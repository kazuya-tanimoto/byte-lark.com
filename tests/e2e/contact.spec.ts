import { expect, type Page, test } from "@playwright/test";

// astro preview は静的配信のみで Cloudflare Worker（/api/contact）は動かない。
// また Turnstile は外部 CDN 依存でヘッドレスでは不安定なため、
// /api/contact と window.turnstile の両方をモックしてフロントの挙動を決定論的に検証する。

/** window.turnstile を差し込む。pass=true で即トークン付与、false で error-callback。 */
async function stubTurnstile(page: Page, pass: boolean): Promise<void> {
  await page.addInitScript((shouldPass) => {
    (window as unknown as { turnstile: unknown }).turnstile = {
      render: (
        el: HTMLElement,
        opts: {
          callback: (token: string) => void;
          "error-callback"?: () => void;
        },
      ) => {
        el.setAttribute("data-stub-rendered", "true");
        if (shouldPass) opts.callback("test-turnstile-token");
        else opts["error-callback"]?.();
        return "stub-widget";
      },
      reset: () => {},
    };
  }, pass);
}

/** Turnstile 描画（=ハイドレーション完了）を待つ。 */
async function waitHydrated(page: Page): Promise<void> {
  await expect(page.getByTestId("turnstile-widget")).toHaveAttribute(
    "data-stub-rendered",
    "true",
  );
}

test.describe("Contact フォーム", () => {
  test("正常系：入力 → 送信で成功メッセージが表示され、契約どおり POST される", async ({
    page,
  }) => {
    await stubTurnstile(page, true);

    let received: Record<string, unknown> | null = null;
    await page.route("**/api/contact", async (route) => {
      received = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/contact");
    await waitHydrated(page);

    await page.getByLabel("お名前").fill("谷本 一弥");
    await page.getByLabel("メールアドレス").fill("test@example.com");
    await page.getByLabel("本文").fill("お問い合わせのテストです。");
    await page.getByRole("button", { name: "送信する" }).click();

    await expect(page.getByText("送信が完了しました。")).toBeVisible();
    expect(received).toEqual({
      name: "谷本 一弥",
      email: "test@example.com",
      message: "お問い合わせのテストです。",
      token: "test-turnstile-token",
    });
  });

  test("必須欠落：空のまま送信するとエラーが出て送信されない", async ({
    page,
  }) => {
    await stubTurnstile(page, true);
    let posted = false;
    await page.route("**/api/contact", async (route) => {
      posted = true;
      await route.fulfill({ status: 200, body: "{}" });
    });

    await page.goto("/contact");
    await waitHydrated(page);
    await page.getByRole("button", { name: "送信する" }).click();

    await expect(page.getByText("お名前を入力してください。")).toBeVisible();
    await expect(
      page.getByText("メールアドレスを入力してください。"),
    ).toBeVisible();
    await expect(page.getByText("本文を入力してください。")).toBeVisible();
    await expect(page.getByText("送信が完了しました。")).toBeHidden();
    expect(posted).toBe(false);
  });

  test("メール形式不正：形式エラーが表示される", async ({ page }) => {
    await stubTurnstile(page, true);
    await page.goto("/contact");
    await waitHydrated(page);

    await page.getByLabel("お名前").fill("テスト");
    await page.getByLabel("メールアドレス").fill("not-an-email");
    await page.getByLabel("本文").fill("本文テスト");
    await page.getByRole("button", { name: "送信する" }).click();

    await expect(
      page.getByText("メールアドレスの形式が正しくありません。"),
    ).toBeVisible();
    await expect(page.getByText("送信が完了しました。")).toBeHidden();
  });

  test("Turnstile 失敗時：トークン未取得だと送信が拒否される", async ({
    page,
  }) => {
    await stubTurnstile(page, false);
    let posted = false;
    await page.route("**/api/contact", async (route) => {
      posted = true;
      await route.fulfill({ status: 200, body: "{}" });
    });

    await page.goto("/contact");
    await waitHydrated(page);

    await page.getByLabel("お名前").fill("テスト");
    await page.getByLabel("メールアドレス").fill("test@example.com");
    await page.getByLabel("本文").fill("本文テスト");
    await page.getByRole("button", { name: "送信する" }).click();

    await expect(
      page.getByText("認証を完了してください", { exact: false }),
    ).toBeVisible();
    await expect(page.getByText("送信が完了しました。")).toBeHidden();
    expect(posted).toBe(false);
  });

  test("API 失敗時：エラーメッセージが表示される", async ({ page }) => {
    await stubTurnstile(page, true);
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, error: "send_failed" }),
      });
    });

    await page.goto("/contact");
    await waitHydrated(page);

    await page.getByLabel("お名前").fill("テスト");
    await page.getByLabel("メールアドレス").fill("test@example.com");
    await page.getByLabel("本文").fill("本文テスト");
    await page.getByRole("button", { name: "送信する" }).click();

    await expect(
      page.getByText("送信に失敗しました。", { exact: false }),
    ).toBeVisible();
    await expect(page.getByText("送信が完了しました。")).toBeHidden();
  });

  test("mailto 撤去：Contact ページに mailto リンクが無い", async ({
    page,
  }) => {
    await stubTurnstile(page, true);
    await page.goto("/contact");
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  });
});

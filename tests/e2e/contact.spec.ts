import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// astro preview は静的配信のみで Cloudflare Worker（/api/contact）は動かない。
// また Turnstile は外部 CDN 依存でヘッドレスでは不安定なため、
// /api/contact と window.turnstile の両方をモックしてフロントの挙動を決定論的に検証する。

/**
 * window.turnstile を差し込む。pass=true で即トークン付与、false で error-callback。
 * reset() は本物と同じく「もう一度チャレンジしてトークンを出し直す」挙動にする
 * （送信失敗後の取り直しを検証するため）。
 */
async function stubTurnstile(page: Page, pass: boolean): Promise<void> {
  await page.addInitScript((shouldPass) => {
    interface StubOptions {
      callback: (token: string) => void;
      "error-callback"?: () => void;
    }
    let rendered: StubOptions | null = null;
    const issue = () => {
      if (shouldPass) rendered?.callback("test-turnstile-token");
      else rendered?.["error-callback"]?.();
    };
    (window as unknown as { turnstile: unknown }).turnstile = {
      render: (el: HTMLElement, opts: StubOptions) => {
        rendered = opts;
        el.setAttribute("data-stub-rendered", "true");
        issue();
        return "stub-widget";
      },
      reset: () => issue(),
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

/** 入力欄を埋める。 */
async function fillForm(
  page: Page,
  values: { name: string; email: string; message: string },
): Promise<void> {
  await page.getByLabel("お名前").fill(values.name);
  await page.getByLabel("メールアドレス").fill(values.email);
  await page.getByLabel("本文").fill(values.message);
}

test.describe("Contact フォーム", () => {
  test("正常系：入力 → 確認 → 送信で成功メッセージが表示され、契約どおり POST される", async ({
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

    await fillForm(page, {
      name: "谷本 一弥",
      email: "test@example.com",
      message: "お問い合わせのテストです。",
    });
    await page.getByRole("button", { name: "確認する" }).click();

    // 確認画面：送る内容が読み取り専用で出ており、入力欄は無い
    await expect(page.getByText("この内容で送信します")).toBeVisible();
    await expect(page.getByTestId("confirm-name")).toHaveText("谷本 一弥");
    await expect(page.getByTestId("confirm-email")).toHaveText(
      "test@example.com",
    );
    await expect(page.getByTestId("confirm-message")).toHaveText(
      "お問い合わせのテストです。",
    );
    await expect(page.getByLabel("お名前")).toHaveCount(0);

    await page.getByRole("button", { name: "送信する" }).click();

    await expect(page.getByText("送信が完了しました。")).toBeVisible();
    expect(received).toEqual({
      name: "谷本 一弥",
      email: "test@example.com",
      message: "お問い合わせのテストです。",
      token: "test-turnstile-token",
    });
  });

  test("確認から戻る：書いた内容が消えずに残り、直して送り直せる", async ({
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

    await fillForm(page, {
      name: "テスト",
      email: "typo@example.com",
      message: "本文テスト",
    });
    await page.getByRole("button", { name: "確認する" }).click();
    await expect(page.getByTestId("confirm-email")).toHaveText(
      "typo@example.com",
    );

    await page.getByRole("button", { name: "入力へ戻る" }).click();

    await expect(page.getByLabel("お名前")).toHaveValue("テスト");
    await expect(page.getByLabel("メールアドレス")).toHaveValue(
      "typo@example.com",
    );
    await expect(page.getByLabel("本文")).toHaveValue("本文テスト");

    await page.getByLabel("メールアドレス").fill("fixed@example.com");
    await page.getByRole("button", { name: "確認する" }).click();
    await expect(page.getByTestId("confirm-email")).toHaveText(
      "fixed@example.com",
    );
    await page.getByRole("button", { name: "送信する" }).click();

    await expect(page.getByText("送信が完了しました。")).toBeVisible();
    expect(received).toMatchObject({ email: "fixed@example.com" });
  });

  test("必須欠落：空のまま確認へ進めず、送信もされない", async ({ page }) => {
    await stubTurnstile(page, true);
    let posted = false;
    await page.route("**/api/contact", async (route) => {
      posted = true;
      await route.fulfill({ status: 200, body: "{}" });
    });

    await page.goto("/contact");
    await waitHydrated(page);
    await page.getByRole("button", { name: "確認する" }).click();

    await expect(page.getByText("お名前を入力してください。")).toBeVisible();
    await expect(
      page.getByText("メールアドレスを入力してください。"),
    ).toBeVisible();
    await expect(page.getByText("本文を入力してください。")).toBeVisible();
    await expect(page.getByText("この内容で送信します")).toBeHidden();
    await expect(page.getByText("送信が完了しました。")).toBeHidden();
    expect(posted).toBe(false);
  });

  test("メール形式不正：形式エラーが表示され確認へ進まない", async ({
    page,
  }) => {
    await stubTurnstile(page, true);
    await page.goto("/contact");
    await waitHydrated(page);

    await fillForm(page, {
      name: "テスト",
      email: "not-an-email",
      message: "本文テスト",
    });
    await page.getByRole("button", { name: "確認する" }).click();

    await expect(
      page.getByText("メールアドレスの形式が正しくありません。"),
    ).toBeVisible();
    await expect(page.getByText("この内容で送信します")).toBeHidden();
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

    await fillForm(page, {
      name: "テスト",
      email: "test@example.com",
      message: "本文テスト",
    });
    await page.getByRole("button", { name: "確認する" }).click();
    await page.getByRole("button", { name: "送信する" }).click();

    await expect(
      page.getByText("認証を完了してください", { exact: false }),
    ).toBeVisible();
    await expect(page.getByText("この内容で送信します")).toBeVisible();
    await expect(page.getByText("送信が完了しました。")).toBeHidden();
    expect(posted).toBe(false);
  });

  test("API 失敗時：確認画面に留まり、内容が消えない", async ({ page }) => {
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

    await fillForm(page, {
      name: "テスト",
      email: "test@example.com",
      message: "本文テスト",
    });
    await page.getByRole("button", { name: "確認する" }).click();
    await page.getByRole("button", { name: "送信する" }).click();

    await expect(
      page.getByText("送信に失敗しました。", { exact: false }),
    ).toBeVisible();
    await expect(page.getByTestId("confirm-message")).toHaveText("本文テスト");
    await expect(page.getByText("送信が完了しました。")).toBeHidden();

    // 失敗しても書いた内容は入力へ戻せば残っている
    await page.getByRole("button", { name: "入力へ戻る" }).click();
    await expect(page.getByLabel("本文")).toHaveValue("本文テスト");
  });

  // 確認画面はハイドレーション後にしか出ないため a11y.spec.ts の巡回では踏めない
  test("確認画面：axe の critical / serious 違反ゼロ", async ({ page }) => {
    await stubTurnstile(page, true);
    await page.goto("/contact");
    await waitHydrated(page);

    await fillForm(page, {
      name: "テスト",
      email: "test@example.com",
      message: "本文テスト",
    });
    await page.getByRole("button", { name: "確認する" }).click();
    await expect(page.getByText("この内容で送信します")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const severe = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(
      severe.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  });

  test("mailto 撤去：Contact ページに mailto リンクが無い", async ({
    page,
  }) => {
    await stubTurnstile(page, true);
    await page.goto("/contact");
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  });
});

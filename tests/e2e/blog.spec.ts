import { expect, test } from "@playwright/test";

const POST_TITLE = "Astro Content Collections で型安全なブログ基盤を構築する";

test.describe("Blog 一覧 → 記事詳細", () => {
  test("一覧の記事カードから記事詳細へ遷移できる", async ({ page }) => {
    await page.goto("/blog");
    await page.getByRole("link", { name: new RegExp(POST_TITLE) }).click();
    await expect(page).toHaveURL(/\/blog\/hello-astro-content-collections\/?$/);
    await expect(
      page.getByRole("heading", { level: 1, name: POST_TITLE }),
    ).toBeVisible();
  });

  test("draft 記事は一覧に表示されない", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByText("下書きサンプル記事")).toHaveCount(0);
  });
});

test.describe("カテゴリフィルタ", () => {
  test("初期状態では「全て」が選択され全記事が表示される", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("button", { name: "全て" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator("[data-blog-item]:visible")).toHaveCount(1);
  });

  test("Tech 選択で tech 記事のみ表示される", async ({ page }) => {
    await page.goto("/blog");
    await page.getByRole("button", { name: "Tech" }).click();
    await expect(page.getByRole("button", { name: "Tech" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(
      page.locator('[data-blog-item][data-category="tech"]:visible'),
    ).toHaveCount(1);
  });

  test("該当記事ゼロのカテゴリでは空メッセージが表示される", async ({
    page,
  }) => {
    // 現状 life カテゴリの公開記事は 0 件
    await page.goto("/blog");
    await page.getByRole("button", { name: "Life" }).click();
    await expect(page.locator("[data-blog-item]:visible")).toHaveCount(0);
    await expect(
      page.getByText("該当するカテゴリの記事はありません。"),
    ).toBeVisible();

    // 「全て」へ戻すと再表示され、空メッセージは消える
    await page.getByRole("button", { name: "全て" }).click();
    await expect(page.locator("[data-blog-item]:visible")).toHaveCount(1);
    await expect(
      page.getByText("該当するカテゴリの記事はありません。"),
    ).toBeHidden();
  });
});

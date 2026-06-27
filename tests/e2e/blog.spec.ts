import { expect, test } from "@playwright/test";

// サンプル記事（hello-astro / draft-sample）は PHASE1B-006 で削除した。
// 実記事は Phase 1b の記事実装 PBI（008+）で投入される。実記事投入後に、
// 一覧→詳細遷移 / カテゴリフィルタ / draft 非表示 / 詳細ページ a11y の E2E を
// 再有効化する（PHASE1B-006 実装ログ / 007 申し送り参照）。
test.describe("Blog 一覧（公開記事ゼロ）", () => {
  test("公開記事が無い場合は空メッセージが表示される", async ({ page }) => {
    await page.goto("/blog");
    await expect(
      page.getByRole("heading", { level: 1, name: "Blog" }),
    ).toBeVisible();
    await expect(page.getByText("記事はまだありません。")).toBeVisible();
    // 記事カードもカテゴリフィルタも描画されない
    await expect(page.locator("[data-blog-item]")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "全て" })).toHaveCount(0);
  });
});

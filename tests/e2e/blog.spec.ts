import { expect, test } from "@playwright/test";

// PHASE1B-008 で実記事を投入したため、空状態前提のテストを実記事前提に書き換えた
// （PHASE1B-006/007 申し送りの再有効化：一覧→詳細遷移 / カテゴリフィルタ / draft 非表示）。
// 記事の追加でテストが壊れないよう、件数は data 属性から動的に数えて検証する。
const PUBLISHED_SLUG = "building-this-blog-with-claude-code";
// draft 非表示検証用の恒久 fixture（src/content/posts/e2e-draft-fixture.md）
const DRAFT_SLUG = "e2e-draft-fixture";

test.describe("Blog 一覧（実記事あり）", () => {
  test("一覧に公開記事のカードが表示される", async ({ page }) => {
    await page.goto("/blog");
    await expect(
      page.getByRole("heading", { level: 1, name: "Blog" }),
    ).toBeVisible();
    await expect(page.getByText("記事はまだありません。")).toHaveCount(0);
    expect(await page.locator("[data-blog-item]").count()).toBeGreaterThan(0);
    await expect(
      page.locator(`[data-blog-item] a[href="/blog/${PUBLISHED_SLUG}/"]`),
    ).toBeVisible();
  });

  test("一覧から詳細へ遷移できる", async ({ page }) => {
    await page.goto("/blog");
    await page.locator(`a[href="/blog/${PUBLISHED_SLUG}/"]`).click();
    await expect(page).toHaveURL(new RegExp(`/blog/${PUBLISHED_SLUG}/$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("カテゴリフィルタで表示が絞り込まれる", async ({ page }) => {
    await page.goto("/blog");
    const visibleItems = page.locator("[data-blog-item]:not([hidden])");
    const techTotal = await page
      .locator('[data-blog-item][data-category="tech"]')
      .count();
    const lifeTotal = await page
      .locator('[data-blog-item][data-category="life"]')
      .count();

    await page.getByRole("button", { name: "Tech" }).click();
    await expect(visibleItems).toHaveCount(techTotal);

    await page.getByRole("button", { name: "Life" }).click();
    await expect(visibleItems).toHaveCount(lifeTotal);
    if (lifeTotal === 0) {
      await expect(
        page.getByText("該当するカテゴリの記事はありません。"),
      ).toBeVisible();
    }

    await page.getByRole("button", { name: "全て" }).click();
    await expect(visibleItems).toHaveCount(techTotal + lifeTotal);
  });

  test("draft 記事は一覧にも詳細にも出ない", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator(`a[href="/blog/${DRAFT_SLUG}/"]`)).toHaveCount(0);
    const response = await page.goto(`/blog/${DRAFT_SLUG}/`);
    expect(response?.status()).toBe(404);
  });
});

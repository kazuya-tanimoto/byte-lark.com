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

// PHASE1D-015：記事内の移動。目次は幅によって本文先頭（xl 未満）か右カラム（xl 以上）の
// どちらかだけが見えるので、見えている方を掴む
test.describe("記事内の移動", () => {
  test("目次のリンクは履歴を増やさず、戻る 1 回で一覧へ帰れる", async ({
    page,
  }) => {
    await page.goto("/blog");
    await page.locator(`a[href="/blog/${PUBLISHED_SLUG}/"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`/blog/${PUBLISHED_SLUG}/$`));

    const links = page.locator("[data-toc]:visible a[href^='#']");
    const clicks = Math.min(3, await links.count());
    expect(clicks).toBeGreaterThan(0);

    const historyBefore = await page.evaluate(() => history.length);
    let lastHref = "";
    for (let i = 0; i < clicks; i++) {
      const link = links.nth(i);
      lastHref = (await link.getAttribute("href")) ?? "";
      await link.click();
      // 移動先の見出しへ焦点が移る＝クリックが処理された
      await expect(page.locator(`[id="${lastHref.slice(1)}"]`)).toBeFocused();
    }

    expect(await page.evaluate(() => history.length)).toBe(historyBefore);
    expect(decodeURIComponent(new URL(page.url()).hash)).toBe(lastHref);

    await page.goBack();
    await expect(page).toHaveURL(/\/blog\/?$/);
  });

  test.describe("スマホ幅の「先頭へ戻る」", () => {
    test.use({ viewport: { width: 390, height: 664 } });

    test("読み始めでは出ず、スクロール後に出て、押すと目次の位置へ戻る", async ({
      page,
    }) => {
      await page.goto(`/blog/${PUBLISHED_SLUG}/`);
      const button = page.getByRole("button", { name: "記事の先頭へ戻る" });
      await expect(button).toBeHidden();

      await page.evaluate(() => window.scrollTo(0, 2000));
      await expect(button).toBeVisible();

      await button.click();
      // sticky ヘッダー分の余白（scroll-mt-20 = 80px）を空けて目次が出る
      const toc = page.locator("[data-toc-mobile]");
      await expect
        .poll(async () => Math.round((await toc.boundingBox())?.y ?? -1))
        .toBeLessThanOrEqual(85);
      await expect(button).toBeHidden();
    });

    test("フッターが見えている間は出さない", async ({ page }) => {
      await page.goto(`/blog/${PUBLISHED_SLUG}/`);
      const button = page.getByRole("button", { name: "記事の先頭へ戻る" });
      await page.evaluate(() => window.scrollTo(0, 2000));
      await expect(button).toBeVisible();

      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight),
      );
      await expect(button).toBeHidden();
    });
  });
});

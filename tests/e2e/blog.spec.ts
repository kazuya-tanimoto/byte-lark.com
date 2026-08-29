import { expect, type Page, test } from "@playwright/test";

// PHASE1B-008 で実記事を投入したため、空状態前提のテストを実記事前提に書き換えた
// （PHASE1B-006/007 申し送りの再有効化：一覧→詳細遷移 / カテゴリフィルタ / draft 非表示）。
// 記事の追加でテストが壊れないよう、件数は data 属性から動的に数えて検証する。
const PUBLISHED_SLUG = "building-this-blog-with-claude-code";
// draft 非表示検証用の恒久 fixture（src/content/posts/e2e-draft-fixture.md）
const DRAFT_SLUG = "e2e-draft-fixture";
// 本文に画像がある記事（PHASE1E-010 の拡大表示の検証用）
const POST_WITH_IMAGE_SLUG = "claude-code-devcontainer-tuning";

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

  // PHASE1E-009 で全ページ共通の部品（src/components/BackToTop.astro）に移した。
  // ここは記事ページでの確認、記事ページ以外は navigation.spec.ts が見る
  test("追従目次が画面内にある間は「先頭へ戻る」を出さない", async ({
    page,
  }) => {
    // 既定の Desktop Chrome は 1280×720 ＝ xl。この高さなら追従目次は記事末尾まで
    // 画面内に残るので、3 つ目の常設案内としてボタンは出さない（2026-08-25 運営者決定）
    await page.goto(`/blog/${PUBLISHED_SLUG}/`);
    await expect(page.locator("[data-toc-sidebar]")).toBeVisible();

    const button = page.getByRole("button", { name: "ページの先頭へ戻る" });
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(button).toBeHidden();

    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await expect(page.locator("[data-toc-sidebar]")).toBeInViewport();
    await expect(button).toBeHidden();
  });

  test("低い窓で目次が画面外へ抜けたら「先頭へ戻る」を出す", async ({
    page,
  }) => {
    // 高さ 280px の窓では、記事末尾でフッターが画面を占めて追従目次が画面外へ抜ける。
    // 目次が見えない以上、幅が xl でもボタンを出す（2026-08-25 追修正。
    // 幅だけの判定では、この状態で先頭へ戻る手段が消えていた）
    await page.setViewportSize({ width: 1280, height: 280 });
    await page.goto(`/blog/${PUBLISHED_SLUG}/`);
    const button = page.getByRole("button", { name: "ページの先頭へ戻る" });

    await page.evaluate(() =>
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      }),
    );
    await expect(page.locator("[data-toc-sidebar]")).not.toBeInViewport();
    await expect(button).toBeVisible();
  });

  test.describe("スマホ幅の「先頭へ戻る」", () => {
    test.use({ viewport: { width: 390, height: 664 } });

    test("読み始めでは出ず、スクロール後に出て、押すとページの先頭へ戻る", async ({
      page,
    }) => {
      await page.goto(`/blog/${PUBLISHED_SLUG}/`);
      const button = page.getByRole("button", { name: "ページの先頭へ戻る" });
      await expect(button).toBeHidden();

      // 出す条件は「300px 下げたら」。手前の 200px では出ない
      await page.evaluate(() => window.scrollTo(0, 200));
      await expect(button).toBeHidden();
      await page.evaluate(() => window.scrollTo(0, 400));
      await expect(button).toBeVisible();

      // 一番上に戻りたくなるのは読み終えた瞬間なので、フッターが見えても消えない
      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight),
      );
      await expect(page.locator("footer")).toBeInViewport();
      await expect(button).toBeVisible();

      await button.click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await expect(button).toBeHidden();
    });
  });
});

// PHASE1E-010：本文画像のクリック拡大。markdown 由来の <img> に
// src/components/ImageLightbox.astro が後から操作を張る作りなので、
// 「実記事の画像で実際に開く」ところまで見る
test.describe("記事内画像の拡大表示", () => {
  const dialog = (page: Page) => page.locator("dialog[data-image-lightbox]");

  test("画像を押すと拡大表示が開き、Esc で閉じて元の画像に戻る", async ({
    page,
  }) => {
    await page.goto(`/blog/${POST_WITH_IMAGE_SLUG}/`);
    const image = page.locator(".post-body img[data-zoomable]").first();
    await expect(image).toHaveCount(1);
    await expect(dialog(page)).toBeHidden();

    await image.click();
    await expect(dialog(page)).toBeVisible();
    // 拡大に使うのは元解像度。画面幅で選ばれた縮小版を引き伸ばさない
    const [source, zoomed] = await Promise.all([
      image.evaluate((el: HTMLImageElement) => el.src),
      dialog(page)
        .locator("img")
        .evaluate((el: HTMLImageElement) => el.src),
    ]);
    expect(zoomed).toBe(source);

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await expect(image).toBeFocused();
  });

  test("キーボードだけで開閉できる", async ({ page }) => {
    await page.goto(`/blog/${POST_WITH_IMAGE_SLUG}/`);
    const image = page.locator(".post-body img[data-zoomable]").first();
    await image.focus();
    await page.keyboard.press("Enter");
    await expect(dialog(page)).toBeVisible();

    // 開いている間、焦点は拡大表示の中にある（背後は <dialog> が inert にする）
    await expect(
      page.getByRole("button", { name: "拡大表示を閉じる" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(dialog(page)).toBeHidden();
    await expect(image).toBeFocused();
  });

  test.describe("スマホ幅では画面に収めた表示と原寸を行き来できる", () => {
    test.use({ viewport: { width: 390, height: 664 } });

    test("押すたびに収めた表示と原寸が入れ替わる", async ({ page }) => {
      await page.goto(`/blog/${POST_WITH_IMAGE_SLUG}/`);
      const image = page.locator(".post-body img[data-zoomable]").first();
      await image.click();
      const zoomed = dialog(page).locator("img");
      await expect(zoomed).toBeVisible();

      const width = () =>
        zoomed.evaluate((el: HTMLImageElement) =>
          Math.round(el.getBoundingClientRect().width),
        );
      const natural = await zoomed.evaluate(
        (el: HTMLImageElement) => el.naturalWidth,
      );
      const fitted = await width();
      expect(fitted).toBeLessThan(natural);

      await zoomed.click();
      expect(await width()).toBe(natural);
      // 原寸では画像の中央から見せる（左上に飛ばされない）
      expect(
        await dialog(page).evaluate((el) => el.scrollLeft),
      ).toBeGreaterThan(0);

      await zoomed.click({ position: { x: 5, y: 5 } });
      expect(await width()).toBe(fitted);
    });
  });
});

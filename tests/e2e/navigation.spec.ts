import { expect, test } from "@playwright/test";

/** 主要ページの path と、表示確認に使う h1 テキスト。 */
const pages = [
  { path: "/about", heading: "About" },
  { path: "/career", heading: "Career" },
  { path: "/skills", heading: "Skills" },
  { path: "/blog", heading: "Blog" },
  { path: "/contact", heading: "Contact" },
  { path: "/privacy", heading: "プライバシーポリシー" },
];

test.describe("主要ページへの遷移", () => {
  test("Home が表示される", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });

  for (const { path, heading } of pages) {
    test(`${path} が表示される`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(
        page.getByRole("heading", { level: 1, name: heading }),
      ).toBeVisible();
    });
  }
});

test.describe("Header ナビゲーション", () => {
  const navLinks = [
    { label: "About", url: /\/about\/?$/ },
    { label: "Career", url: /\/career\/?$/ },
    { label: "Skills", url: /\/skills\/?$/ },
    { label: "Blog", url: /\/blog\/?$/ },
    { label: "Contact", url: /\/contact\/?$/ },
  ];

  for (const { label, url } of navLinks) {
    test(`nav の ${label} リンクで遷移できる`, async ({ page }) => {
      await page.goto("/");
      // Header にはデスクトップ用・モバイル用の 2 つの nav があるため、可視のリンクのみ対象
      await page
        .getByRole("banner")
        .getByRole("link", { name: label })
        .locator("visible=true")
        .click();
      await expect(page).toHaveURL(url);
    });
  }

  test("ロゴクリックで Home へ戻れる", async ({ page }) => {
    await page.goto("/about");
    await page
      .getByRole("banner")
      .getByRole("link", { name: "byte-lark" })
      .click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("404 ページ", () => {
  test("存在しない URL で 404 ページが表示される", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "ページが見つかりません" }),
    ).toBeVisible();
    // Home への導線があること
    await expect(page.getByRole("link", { name: "Home へ戻る" })).toBeVisible();
  });
});

// PHASE1E-009：「先頭へ戻る」は全ページ共通の部品（src/components/BackToTop.astro）。
// 記事ページでの確認は blog.spec.ts が持つので、ここは目次の無いページで見る。
// viewport は既定（Desktop Chrome 1280px）＝ xl 相当なので、旧実装の xl:hidden を
// 外したことの裏取りも兼ねる
test.describe("「先頭へ戻る」（記事ページ以外）", () => {
  test("トップページでもスクロール後に出て、押すとページの先頭へ戻る", async ({
    page,
  }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "ページの先頭へ戻る" });
    await expect(button).toBeHidden();

    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
    await expect(button).toBeVisible();

    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(button).toBeHidden();
  });
});

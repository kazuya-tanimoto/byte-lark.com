import { expect, type Page, test } from "@playwright/test";

/** 主要ページの path と、表示確認に使う h1 テキスト。 */
const pages = [
  { path: "/about", heading: "About" },
  { path: "/career", heading: "Career" },
  { path: "/skills", heading: "Skills" },
  { path: "/blog", heading: "Blog" },
  { path: "/contact", heading: "Contact" },
  { path: "/privacy", heading: "プライバシーポリシー" },
  // アイコン・書体の出典（PHASE1D-001 新設・PHASE1D-010 拡張）。PHASE1E-011 で対象に追加
  { path: "/credits", heading: "アイコン・書体の出典" },
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

// PHASE1E-018：今いるページを色だけでなく aria-current でも示す。
// Header には PC 用・スマホ用の 2 つのリストがあるので、PC 幅で見たあと
// スマホ幅でメニューを開き、見えている方のリストを読む
test.describe("Header ナビの aria-current", () => {
  /** 見えているナビのリストの、ラベルごとの aria-current（無ければ null） */
  const readCurrent = (page: Page) =>
    page
      .getByRole("banner")
      .getByRole("listitem")
      .getByRole("link")
      .locator("visible=true")
      .evaluateAll((links) =>
        links.map((a) => [
          a.textContent?.trim(),
          a.getAttribute("aria-current"),
        ]),
      );

  const expectCurrent = async (
    page: Page,
    path: string,
    expected: Record<string, string>,
  ) => {
    const all = ["Home", "About", "Career", "Skills", "Blog", "Contact"].map(
      (label) => [label, expected[label] ?? null],
    );
    await page.goto(path);
    expect(await readCurrent(page)).toEqual(all);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "メニューを開く" }).click();
    expect(await readCurrent(page)).toEqual(all);
  };

  test("/about では About だけが page になる", async ({ page }) => {
    await expectCurrent(page, "/about", { About: "page" });
  });

  test("記事ページでは Blog だけが true になる", async ({ page }) => {
    await expectCurrent(page, "/blog/building-this-blog-with-claude-code", {
      Blog: "true",
    });
  });

  test("ナビに無いページではどの項目にも付かない", async ({ page }) => {
    await expectCurrent(page, "/privacy", {});
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

    // しきい値は 300px（BackToTop.astro）。手前では出ず、越えたら出る
    await page.evaluate(() => window.scrollTo(0, 200));
    await expect(button).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(button).toBeVisible();

    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(button).toBeHidden();
  });
});

// /credits の書体の出典 URL が 390px 幅で 18px はみ出していた（空白の無い長い URL が
// 折り返されなかった）。同じ種類の崩れを全ページで拾うため、モバイル幅で横スクロールが
// 出ないことを見る
test.describe("モバイル幅で横にはみ出さない", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const path of ["/", ...pages.map((p) => p.path)]) {
    test(`${path} に横スクロールが出ない`, async ({ page }) => {
      await page.goto(path);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  }
});

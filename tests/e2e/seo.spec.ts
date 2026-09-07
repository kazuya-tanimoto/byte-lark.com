import { expect, type Page, test } from "@playwright/test";

// PHASE1E-011：配信物（RSS / sitemap / robots.txt）と <head> の SEO 要素（OGP / canonical /
// JSON-LD）。生成関数の unit（src/lib/og.test.ts / jsonld.test.ts）は戻り値しか見ないので、
// ここでは「その結果が実際にページ・配信物へ届いているか」を見る。
// 対象は `yarn preview` が配るビルド済み dist/（playwright.config.ts）。sitemap はビルド時に
// しか生成されないので、dev サーバー相手では検証できない。
// 記事の件数・並び順は固定値で書かず、配信物から動的に数える（blog.spec.ts と同じ方針）
const SITE = "https://byte-lark.com";
const PUBLISHED_SLUG = "building-this-blog-with-claude-code";
// draft 非表示検証用の恒久 fixture（src/content/posts/e2e-draft-fixture.md）。blog.spec.ts と共用
const DRAFT_SLUG = "e2e-draft-fixture";

/** XML 本文から `<tag>…</tag>` の中身を出現順に取り出す。 */
const textsOf = (xml: string, tag: string) =>
  [...xml.matchAll(new RegExp(`<${tag}>([^<]*)</${tag}>`, "g"))].map(
    (m) => m[1],
  );

test.describe("RSS（/rss.xml）", () => {
  test("XML として 200 で返り、公開記事だけを新しい順に並べる", async ({
    request,
  }) => {
    const response = await request.get("/rss.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(/xml/);

    const xml = await response.text();
    expect(xml).toContain(`<link>${SITE}/blog/${PUBLISHED_SLUG}/</link>`);
    expect(xml).not.toContain(DRAFT_SLUG);

    // src/pages/rss.xml.ts は publishedAt の降順で並べる。件数は記事の増減で動く
    const pubDates = textsOf(xml, "pubDate").map((s) => Date.parse(s));
    expect(pubDates.length).toBeGreaterThan(0);
    expect(pubDates).not.toContain(Number.NaN);
    expect(pubDates).toEqual([...pubDates].sort((a, b) => b - a));
  });
});

test.describe("sitemap と robots.txt", () => {
  test("/sitemap-index.xml が /sitemap-0.xml を指し、そこに公開記事の URL がある", async ({
    request,
  }) => {
    const index = await request.get("/sitemap-index.xml");
    expect(index.status()).toBe(200);
    expect(textsOf(await index.text(), "loc")).toContain(
      `${SITE}/sitemap-0.xml`,
    );

    const sitemap = await request.get("/sitemap-0.xml");
    expect(sitemap.status()).toBe(200);
    const locs = textsOf(await sitemap.text(), "loc");
    expect(locs.length).toBeGreaterThan(0);
    for (const loc of locs) {
      expect(loc).toMatch(new RegExp(`^${SITE}/`));
    }
    expect(locs).toContain(`${SITE}/blog/${PUBLISHED_SLUG}/`);
    expect(locs).not.toContain(`${SITE}/blog/${DRAFT_SLUG}/`);
  });

  test("/robots.txt の Sitemap 行が sitemap-index を指す", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    expect(await response.text()).toMatch(
      new RegExp(`^Sitemap: ${SITE}/sitemap-index\\.xml$`, "m"),
    );
  });
});

const ogContent = (page: Page, property: string) =>
  page.locator(`head meta[property="${property}"]`);

test.describe("OGP と canonical", () => {
  // トップは PHASE1E-004 で専用 og 画像、記事詳細はカバー画像 + og:type=article
  const targets = [
    { path: "/", type: "website" },
    { path: `/blog/${PUBLISHED_SLUG}/`, type: "article" },
  ];

  for (const { path, type } of targets) {
    test(`${path} の og:title / og:url / og:image / canonical がそろっている`, async ({
      page,
    }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      for (const property of ["og:title", "og:url", "og:image"]) {
        await expect(ogContent(page, property)).toHaveCount(1);
        await expect(ogContent(page, property)).toHaveAttribute(
          "content",
          /\S/,
        );
      }
      await expect(ogContent(page, "og:type")).toHaveAttribute("content", type);

      // 画像と正規 URL は絶対 URL でないと SNS カードやクローラーが解決できない
      const canonical = page.locator('head link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      await expect(canonical).toHaveAttribute("href", /^https:\/\//);
      await expect(ogContent(page, "og:image")).toHaveAttribute(
        "content",
        /^https:\/\//,
      );
      // og:url は canonical と同じ値（BaseLayout が同じ canonicalUrl を両方に使う）
      await expect(ogContent(page, "og:url")).toHaveAttribute(
        "content",
        (await canonical.getAttribute("href")) ?? "",
      );

      // RSS 自動発見リンク（PHASE1E-001 導入、BaseLayout で全ページ共通）。
      // 壊れても画面に出ず、気づくのは購読ツール側になるので機械で見張る（011 追補）
      const alternate = page.locator(
        'head link[rel="alternate"][type="application/rss+xml"]',
      );
      await expect(alternate).toHaveCount(1);
      await expect(alternate).toHaveAttribute("href", `${SITE}/rss.xml`);
    });
  }
});

test.describe("JSON-LD", () => {
  // JSON-LD があるのは /about（Person、src/pages/about.astro）と記事詳細（Article、
  // src/layouts/PostLayout.astro）の 2 箇所だけ。トップ・career・skills には無い
  const targets = [
    { path: "/about", type: "Person" },
    { path: `/blog/${PUBLISHED_SLUG}/`, type: "Article" },
  ];

  for (const { path, type } of targets) {
    test(`${path} に ${type} の JSON-LD がある`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      const script = page.locator('head script[type="application/ld+json"]');
      await expect(script).toHaveCount(1);
      const data = JSON.parse((await script.textContent()) ?? "");
      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@type"]).toBe(type);
    });
  }
});

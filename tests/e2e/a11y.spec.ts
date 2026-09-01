import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** axe チェック対象の主要ページ。expectedStatus で正しいページを掴めているかも検証する。 */
const targets: { path: string; expectedStatus: number }[] = [
  { path: "/", expectedStatus: 200 },
  { path: "/about", expectedStatus: 200 },
  { path: "/career", expectedStatus: 200 },
  { path: "/skills", expectedStatus: 200 },
  { path: "/blog", expectedStatus: 200 },
  // 記事詳細ページ（PHASE1B-008 で実記事投入、006/007 申し送りの再追加）
  { path: "/blog/building-this-blog-with-claude-code", expectedStatus: 200 },
  // 本文に画像がある記事。拡大表示が <img> に足す role / 名前を機械で見張る（PHASE1E-010）
  { path: "/blog/claude-code-devcontainer-tuning", expectedStatus: 200 },
  { path: "/contact", expectedStatus: 200 },
  { path: "/privacy", expectedStatus: 200 },
  // アイコン・書体の出典。表と外部リンクが多いページなので axe の対象に入れる（PHASE1E-011）
  { path: "/credits", expectedStatus: 200 },
  { path: "/this-page-does-not-exist", expectedStatus: 404 },
];

test.describe("アクセシビリティ（axe / WCAG 2.1 AA）", () => {
  for (const { path, expectedStatus } of targets) {
    test(`${path} で critical / serious 違反ゼロ`, async ({ page }) => {
      const response = await page.goto(path);
      // 想定外サーバ（古い dev サーバ等）を掴んだまま axe が素通りする事故を防ぐ
      expect(response?.status()).toBe(expectedStatus);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const severe = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );
      expect(
        severe.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    });
  }
});

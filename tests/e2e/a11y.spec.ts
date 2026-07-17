import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** axe チェック対象の主要ページ。expectedStatus で正しいページを掴めているかも検証する。 */
const targets: { path: string; expectedStatus: number }[] = [
  { path: "/", expectedStatus: 200 },
  { path: "/about", expectedStatus: 200 },
  { path: "/career", expectedStatus: 200 },
  { path: "/skills", expectedStatus: 200 },
  { path: "/blog", expectedStatus: 200 },
  // 記事詳細ページの a11y チェックは実記事投入後（008+）に再追加する。
  // サンプル記事は PHASE1B-006 で削除済み（一覧は記事ゼロの空状態）。
  { path: "/contact", expectedStatus: 200 },
  { path: "/privacy", expectedStatus: 200 },
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

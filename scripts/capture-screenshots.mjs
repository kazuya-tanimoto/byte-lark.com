// 主要ページのスクリーンショットをデスクトップ幅とモバイル幅で撮る。用途は 2 つ。
// 1. コンテナ内セッションのローカル / CF preview スクショ確認（CLAUDE.md §7）。
//    コンテナには MCP Playwright が無いので、コンテナ内の headless Chromium で撮り、
//    出力画像を Read で確認する（PHASE1E-001 以降の運用）。
// 2. CI（.github/workflows/ui-tests.yml）から実行して成果物として持ち出す逃げ道。
//    コンテナが firewall の都合でブラウザを取得できない回に使う（PHASE1D-012）。
//
// 使い方:
//   node scripts/capture-screenshots.mjs                     # http://localhost:4321 を撮る
//   BASE_URL=https://example.com node scripts/capture-screenshots.mjs
//
// 出力: screenshots/<ページ名>-<desktop|mobile>.jpg
// jpeg なのは、縦に長いページを png で撮ると 1 枚数 MB になり持ち出しづらいため。

import { mkdir, rm } from "node:fs/promises";
import { chromium, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:4321";
const OUT_DIR = "screenshots";

const PAGES = [
  ["home", "/"],
  ["about", "/about"],
  ["career", "/career"],
  ["skills", "/skills"],
  ["blog", "/blog"],
  ["post", "/blog/incorporating-bytelark"],
  ["contact", "/contact"],
];

const VIEWPORTS = [
  ["desktop", { viewport: { width: 1280, height: 900 } }],
  ["mobile", devices["iPhone 14"]],
];

const browser = await chromium.launch();
await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

let failed = 0;

for (const [label, contextOptions] of VIEWPORTS) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  for (const [name, path] of PAGES) {
    const url = `${BASE_URL}${path}`;
    const response = await page.goto(url, { waitUntil: "load" });
    const status = response?.status() ?? 0;
    if (status !== 200) {
      console.error(`NG  ${label.padEnd(7)} ${path} -> HTTP ${status}`);
      failed++;
      continue;
    }
    // 通信が静まるまで待つのは「できれば」に留める。/contact は Turnstile を
    // 読み込み続けるので networkidle を必須にすると永久に来ない
    await page
      .waitForLoadState("networkidle", { timeout: 5000 })
      .catch(() => {});
    // フォントの差し替えが終わってから撮る（display: optional / swap の揺れを避ける）
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `${OUT_DIR}/${name}-${label}.jpg`,
      type: "jpeg",
      quality: 80,
      fullPage: true,
    });
    console.log(`OK  ${label.padEnd(7)} ${path}`);
  }

  await context.close();
}

await browser.close();

console.log(
  `\n${PAGES.length} ページ × ${VIEWPORTS.length} 幅を ${BASE_URL} で撮影`,
);
if (failed > 0) {
  console.error(`${failed} 件が HTTP 200 以外だった`);
  process.exit(1);
}

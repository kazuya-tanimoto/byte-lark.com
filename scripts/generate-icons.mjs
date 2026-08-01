/**
 * src/assets/logo-badge.svg を唯一の原本として、public/ のアイコン一式を生成する。
 *
 *   public/favicon.svg          ブラウザタブの主役（ベクター）
 *   public/favicon.ico          16/32 の 2 サイズ入り。RSS リーダー等が rel 無しで root を取りに来る用
 *   public/apple-touch-icon.png 180x180 不透明。iOS のホーム画面追加用
 *
 * 意匠は PHASE1C-005 で確定した C 案（sky タイル + 白抜きマーク）。
 * ロゴを差し替えたら `node scripts/generate-icons.mjs` で再生成する。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const ROOT = new URL("..", import.meta.url).pathname;

// 原本 badge の中身。viewBox は "250 250 1548 1548"
const badge = readFileSync(`${ROOT}src/assets/logo-badge.svg`, "utf8");
const inner = badge
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "")
  .trim();
const SRC = { origin: 250, size: 1548 };

const SKY = "#0273B0"; // design-direction §2 primary
const MARK = "#FFFFFF";

/** 一辺 box の正方形の中に、余白 pad でマークを収めた <g> を返す */
function mark(box, pad) {
  const scale = (box - pad * 2) / SRC.size;
  const offset = pad - SRC.origin * scale;
  const body = inner
    .replace('stroke="currentColor"', `stroke="${MARK}"`)
    .replace('fill="currentColor" fill-rule', `fill="${MARK}" fill-rule`);
  return `<g transform="translate(${offset.toFixed(3)} ${offset.toFixed(3)}) scale(${scale.toFixed(6)})">${body}</g>`;
}

/**
 * @param box   viewBox の一辺
 * @param pad   マークの周囲余白（box と同じ座標系）
 * @param round 角丸半径。0 なら角丸なし（iOS は自前でマスクするため touch icon は 0）
 */
function icon(box, pad, round) {
  const rect = `<rect width="${box}" height="${box}"${round ? ` rx="${round}"` : ""} fill="${SKY}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box} ${box}" width="${box}" height="${box}" role="img" aria-label="byte-lark">${rect}${mark(box, pad)}</svg>`;
}

// --- favicon.svg（角丸タイル） ---
const faviconSvg = `<!-- PHASE1C-005 で確定した favicon。原本は src/assets/logo-badge.svg、生成は scripts/generate-icons.mjs -->
${icon(32, 4.5, 7)}
`;
writeFileSync(`${ROOT}public/favicon.svg`, faviconSvg);

// --- PNG 系はヘッドレスブラウザでラスタライズ ---
const browser = await chromium.launch();

/**
 * @param transparent 角丸の外側を透過で抜くか。ico は抜く（暗いタブで四隅が白く出るため）、
 *                    touch icon は抜かない（iOS が透過部分を黒で埋めるため）
 */
async function raster(svg, px, transparent) {
  const page = await browser.newPage({ viewport: { width: px, height: px } });
  await page.setContent(
    `<style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>${svg.replace(/width="\d+(\.\d+)?" height="\d+(\.\d+)?"/, `width="${px}" height="${px}"`)}`,
  );
  const buf = await page.screenshot({ omitBackground: transparent });
  await page.close();
  return buf;
}

// apple-touch-icon: 角丸なしの塗り足し正方形（透過部分があると iOS が黒で埋める）
const touch = await raster(icon(180, 25, 0), 180, false);
writeFileSync(`${ROOT}public/apple-touch-icon.png`, touch);

// favicon.ico: 16 と 32 を PNG のまま ICO コンテナに詰める
const icoSizes = [16, 32];
const pngs = [];
for (const px of icoSizes) {
  pngs.push(await raster(icon(32, 4.5, 7), px, true));
}
await browser.close();

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: 1 = icon
header.writeUInt16LE(pngs.length, 4);

let offset = 6 + 16 * pngs.length;
const entries = pngs.map((png, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(icoSizes[i] === 256 ? 0 : icoSizes[i], 0); // width
  e.writeUInt8(icoSizes[i] === 256 ? 0 : icoSizes[i], 1); // height
  e.writeUInt8(0, 2); // パレット色数（真彩色は 0）
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // color planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});
writeFileSync(`${ROOT}public/favicon.ico`, Buffer.concat([header, ...entries, ...pngs]));

console.log(
  `generated: favicon.svg / favicon.ico (${icoSizes.join("+")}) / apple-touch-icon.png (180)`,
);

// fontsource パッケージの index.css を読み、Astro Fonts API（local provider）の variants 配列に変換する。
// ねらい: フォント実体は node_modules のセルフホストのまま（ビルド時にネットワーク不要）で、
// Astro 側の機能（最適化フォールバック / font-display 制御 / preload）を使えるようにする。PHASE1C-007。
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const FACE_RE = /@font-face\s*\{([^}]*)\}/g;
const FILE_RE = /url\(\.\/files\/([^)]+?)\)/;
const WEIGHT_RE = /font-weight:\s*([^;]+);/;
const STYLE_RE = /font-style:\s*([^;]+);/;
const UNICODE_RANGE_RE = /unicode-range:\s*([^;]+);/;

/**
 * @param {string} pkg fontsource のパッケージ名（例: "@fontsource-variable/geist"）
 * @param {{ exclude?: RegExp, entries?: string[] }} [options]
 *   exclude: 一致するファイル名の @font-face を除く
 *   entries: 読み込む CSS（既定 ["index.css"]）。可変ウェイトでないパッケージは
 *            index.css が 400 のみなので、使うウェイトの CSS（"500.css" 等）を指定する
 * @returns Astro の local provider に渡す variants
 */
export function fontsourceVariants(pkg, { exclude, entries = ["index.css"] } = {}) {
  const variants = [];

  for (const entry of entries) {
    const css = readFileSync(require.resolve(`${pkg}/${entry}`), "utf-8");

    for (const [, body] of css.matchAll(FACE_RE)) {
      const file = body.match(FILE_RE)?.[1];
      if (!file) continue;
      if (exclude?.test(file)) continue;

      const unicodeRange = body.match(UNICODE_RANGE_RE)?.[1];
      variants.push({
        src: [`${pkg}/files/${file}`],
        weight: body.match(WEIGHT_RE)?.[1].trim() ?? "400",
        style: body.match(STYLE_RE)?.[1].trim() ?? "normal",
        // 文字範囲ごとに分割された woff2 を、必要な範囲だけ取得させるために必須
        ...(unicodeRange ? { unicodeRange: unicodeRange.split(",").map((r) => r.trim()) } : {}),
      });
    }
  }

  if (variants.length === 0) {
    throw new Error(`${pkg} の ${entries.join(" / ")} から @font-face を読み取れませんでした`);
  }
  return variants;
}

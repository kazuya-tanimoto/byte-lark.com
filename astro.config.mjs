import mdx from "@astrojs/mdx";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://byte-lark.com",
  integrations: [
    react(),
    mdx(),
    // 除外指定は持たない。唯一の対象だった検証用デモページ（/sample-highlight/）は
    // PHASE1A-020 で削除済みで、存在しないパスを除外し続けていた（PHASE1E-001）。
    // 404 ページは @astrojs/sitemap が既定で除く
    sitemap(),
  ],

  // フォントは Astro の Fonts API で扱う（PHASE1C-007）。provider は local ＝
  // ビルド時にネットワーク不要、配信もセルフホスト（Decision #24 の趣旨を維持）。
  //
  // 実体は scripts/subset-fonts.mjs が作る「サイトに出てくる字だけ」のファイル（PHASE1D-010）。
  // 元の配布物（fontsource）は文字コード順に 120 個前後へ切った塊で、1 ページで 18〜68 個・
  // 0.33〜1.06MB 落ちていた。サブセットは 1 ファミリ 1 ファイル・全ページ共通なので、
  // 文字範囲での出し分け（unicode-range）も要らない。記事を足したら `yarn fonts` で作り直す
  fonts: [
    {
      provider: fontProviders.local(),
      // 見出し書体（PHASE1C-003。docs/design-direction.md §3 で「春空」選定時に確定）
      name: "Zen Kaku Gothic New",
      cssVariable: "--font-zen-kaku",
      // 総称ファミリ（sans-serif）を持たせない。持たせると和文フォントより先に
      // sans-serif が全文字にマッチしてしまい、後続の Noto Sans JP が使われなくなる
      fallbacks: [],
      // 最適化フォールバックは Arial 基準の寸法合わせで和文には効かない（PHASE1C-007 の一次確認）
      optimizedFallbacks: false,
      // 見出しだけは swap。optional だと初回訪問でほぼ当たらず、
      // ブランドの書体が初見の人に届かないため。差し替えのずれは実測 0.0016 以下（PHASE1C-003）
      display: "swap",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/zen-kaku-gothic-new-500-subset.woff2"],
            weight: "500",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/zen-kaku-gothic-new-700-subset.woff2"],
            weight: "700",
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Noto Sans JP Variable",
      cssVariable: "--font-noto-sans-jp",
      fallbacks: ["sans-serif"],
      // 最適化フォールバックは Arial 基準で寸法を合わせるが、Arial に和文の字形は無い。
      // 和文にとって効かないうえ、欧文が読み込み中に約 2 倍で描かれる面ができるため無効化
      optimizedFallbacks: false,
      // 本文は optional のまま。ページの高さの大半を本文が占めるので、
      // ここを swap にすると端末のフォント次第で最大 0.09 のずれが出る（PHASE1C-003 実測）
      display: "optional",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/noto-sans-jp-subset.woff2"],
            // ウェイトは可変軸のまま持つ（本文 400 / 強調 500・700 を 1 ファイルで賄う）
            weight: "100 900",
            style: "normal",
          },
        ],
      },
    },
  ],

  // 本文画像に画面幅別の縮小版と srcset を出させる（PHASE1E-010）。既定は layout 無しで、
  // markdown の `![]()` 由来の画像は `srcset=""` のまま元解像度 1 本をスマホにも配っていた
  // （2026-08-29 実測: statusline スクショが 1310px のまま）。
  //
  // responsiveStyles は既定の false のままにする。有効にすると Astro が img へグローバル CSS を
  // 足すが、本文画像は Tailwind preflight の max-width:100%、カバーは自前の
  // aspect / object-cover で既に整っており、上書きの手当てを増やす理由が無い
  // （公式: https://docs.astro.build/en/guides/images/#responsive-image-styles ）
  image: {
    layout: "constrained",
  },

  markdown: {
    shikiConfig: {
      // 旧 github-light は変数名に #e36209 を使い白地で 3.49:1 と AA 未達だった（PHASE1C-011）。
      // GitHub 現行の light テーマは同じ位置が #953800（7.39:1）で、文字色の指定すべてが AA を通る
      theme: "github-light-default",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});

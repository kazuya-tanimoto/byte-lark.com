import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import { fontsourceVariants } from "./scripts/fontsource-variants.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://byte-lark.com",
  integrations: [
    react(),
    mdx(),
    sitemap({
      // 検証用デモページは検索エンジンに案内しない（削除判断は PHASE1A-020）
      filter: (page) => !page.includes("/sample-highlight/"),
    }),
  ],

  // フォントは Astro の Fonts API で扱う（PHASE1C-007）。
  // provider は local ＝ node_modules の @fontsource-variable/* をそのまま使うので
  // ビルド時にネットワーク不要、配信も従来どおりセルフホスト（Decision #24 の趣旨を維持）。
  // npm provider は index.css をローカルで読んでも実体 URL を jsdelivr に書き換えるため不採用。
  fonts: [
    {
      provider: fontProviders.local(),
      // 見出し書体（PHASE1C-003。docs/design-direction.md §3 で「春空」選定時に確定）。
      // 可変ウェイトが無いパッケージなので、使う 500 / 700 の CSS だけを読む
      name: "Zen Kaku Gothic New",
      cssVariable: "--font-zen-kaku",
      // 総称ファミリ（sans-serif）を持たせない。持たせると和文フォントより先に
      // sans-serif が全文字にマッチしてしまい、後続の Noto Sans JP が使われなくなる
      fallbacks: [],
      // 最適化フォールバックは Arial 基準の寸法合わせで和文には効かない（PHASE1C-007 の一次確認）
      optimizedFallbacks: false,
      // 見出しだけは swap。optional だと初回訪問でほぼ当たらず（多数のサブセットが
      // 100ms の猶予に間に合わない）、ブランドの書体が初見の人に届かないため。
      // 見出しが占める高さは小さく、差し替えのずれも実測で 0.0016 以下（PHASE1C-003）
      display: "swap",
      options: {
        variants: fontsourceVariants("@fontsource/zen-kaku-gothic-new", {
          entries: ["500.css", "700.css"],
        }),
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
      options: { variants: fontsourceVariants("@fontsource-variable/noto-sans-jp") },
    },
  ],

  markdown: {
    shikiConfig: {
      // 旧 github-light は変数名に #e36209 を使い白地で 3.49:1 と AA 未達だった（PHASE1C-011）。
      // GitHub 現行の light テーマは同じ位置が #953800（7.39:1）で、文字色の指定すべてが AA を通る
      theme: "github-light-default",
    },
  },

  vite: {
    plugins: [tailwindcss()]
  }
});
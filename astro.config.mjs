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
      name: "Geist Variable",
      cssVariable: "--font-geist",
      // 総称ファミリ（sans-serif）を持たせない。持たせると和文フォントより先に
      // sans-serif が全文字にマッチしてしまい、Noto Sans JP が使われなくなる
      fallbacks: [],
      options: {
        // キリル文字の面は当サイトで使わないため外す（preload されて毎ページ約 14KB 無駄になる）
        variants: fontsourceVariants("@fontsource-variable/geist", { exclude: /cyrillic/ }),
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
      display: "optional",
      options: { variants: fontsourceVariants("@fontsource-variable/noto-sans-jp") },
    },
  ],

  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
  },

  vite: {
    plugins: [tailwindcss()]
  }
});
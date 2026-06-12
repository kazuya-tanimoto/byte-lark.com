import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

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

  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
  },

  vite: {
    plugins: [tailwindcss()]
  }
});
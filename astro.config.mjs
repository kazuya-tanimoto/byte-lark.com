import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx(), sitemap()],

  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
  },

  vite: {
    plugins: [tailwindcss()]
  }
});
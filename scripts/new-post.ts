import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

const POSTS_DIR = resolve(import.meta.dirname, "../src/content/posts");

const { values } = parseArgs({
  options: {
    slug: { type: "string" },
    title: { type: "string" },
    category: { type: "string", default: "tech" },
  },
  strict: true,
});

if (!values.slug) {
  console.error(
    "Error: --slug is required\nUsage: yarn new-post --slug my-post",
  );
  process.exit(1);
}

const slug = values.slug;

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(
    `Error: slug "${slug}" is invalid. Use lowercase alphanumeric with hyphens (e.g. my-first-post)`,
  );
  process.exit(1);
}

const filePath = resolve(POSTS_DIR, `${slug}.md`);

if (existsSync(filePath)) {
  console.error(`Error: ${filePath} already exists`);
  process.exit(1);
}

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const title = values.title ?? "記事タイトル";
const category = values.category === "life" ? "life" : "tech";

const content = `---
title: "${title}"
description: ""
category: ${category}
tags: []
publishedAt: ${today}
draft: true
slug: ${slug}
---

`;

writeFileSync(filePath, content, "utf-8");
console.log(`Created: src/content/posts/${slug}.md`);

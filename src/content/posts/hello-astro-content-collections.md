---
title: "Astro Content Collections で型安全なブログ基盤を構築する"
description: "Astro の Content Collections と Zod スキーマを使って、ビルド時に型安全性が保証されるブログ記事管理基盤を構築した記録。"
category: tech
tags: [astro, content-collections, typescript]
publishedAt: 2026-05-16
cover: ../../assets/posts/sample-cover.png
slug: hello-astro-content-collections
---

# Astro Content Collections で型安全なブログ基盤を構築する

Content Collections を使うと、Markdown/MDX の frontmatter を Zod スキーマでバリデーションでき、型の不整合をビルド時に検出できる。

## 主なメリット

- frontmatter の型安全性（必須フィールド欠落をビルドエラーで検出）
- カテゴリや tags の正規化（enum / transform）
- 画像の自動最適化（WebP 変換、レスポンシブ）

## コード例

```typescript
import { getCollection } from "astro:content";

const posts = await getCollection("posts", ({ data }) => {
  return data.draft !== true;
});
```

これで draft 記事を除外した公開記事一覧を取得できる。

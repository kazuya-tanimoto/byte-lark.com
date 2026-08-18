---
title: "記事タイトル"
description: ""
category: tech
tags: []
publishedAt: 2026-01-01
draft: true
slug: my-post-slug
# updatedAt: 2026-01-02   ← 公開後に内容を更新したら付ける（任意）
# cover: ./cover.png      ← アイキャッチ（任意。記事フォルダに同居。詳細は docs/writing-workflow.md）
---

導入: 何についての記事か、読者が得られるものを2-3文で。
本文に h1（`# 見出し`）は書かない（タイトルはレイアウトが表示する）。

## 背景 / 動機

なぜこのテーマを選んだか。

## 本題

### セクション1

内容。コード例があれば:

```typescript
const example = "hello";
```

### セクション2

続き。

## まとめ

要点の振り返り。次に何をするか、読者への問いかけなど。

<!--
frontmatter の注意（`scripts/new-post.ts` の雛形と同じ並び）:
- title: サイト名サフィックス（| byte-lark.com 等）は付けない
- description: 80-120 字。OGP description にも使われる
- category: tech / life
- publishedAt: yarn new-post が当日で生成
- draft: true で開始。公開手順は docs/writing-workflow.md
- cover: ./cover.png（元画像は縦横比 40:21、1200×630 以上）
-->

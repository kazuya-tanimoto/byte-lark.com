# クローラーは RSS / Sitemap / robots.txt を通じてサイトコンテンツを効率的にインデックスできる

Status: Done
Started: 2026-06-12
Completed: 2026-06-12

## 誰が
- クローラー

## 何をできる
- `/rss.xml` で RSS フィードを購読できる
- `/sitemap-index.xml` でサイト全体のページ一覧を取得できる
- `/robots.txt` でクロール許可範囲とサイトマップの場所を確認できる

## なんのために
- 検索エンジンにサイト構造を正確に伝え、インデックス効率を最大化するため
- RSS 購読者に新着記事を配信するため
- 関連: site-plan.md §6.6 / FR-20 / FR-21

## 受け入れ条件
- [x] `@astrojs/rss`（Phase 0 でインストール済み）を使用して `src/pages/rss.xml.ts` を実装
- [x] RSS フィードに全公開記事（draft: false）が含まれる
- [x] RSS の各エントリに title / description / pubDate / link が含まれる
- [x] `@astrojs/sitemap`（Phase 0 で integration 登録済み）の `site` プロパティを `astro.config.mjs` に設定（PHASE1A-005 で設定済みのため変更不要だったことを確認）
- [x] ビルド出力に `sitemap-index.xml` が生成される
- [x] `public/robots.txt` に sitemap-index.xml への参照を追記（ファイル自体は PHASE0-002 で作成済み）
- [x] `yarn build` 成功
- [x] `yarn check:ts` エラーなし
- [x] ビルド出力で RSS / Sitemap の中身を目視確認

## 技術メモ
- `@astrojs/rss` と `@astrojs/sitemap` は Phase 0 でインストール済み（追加の yarn add は不要）
- sitemap の site 設定は `astro.config.mjs` の `site` プロパティに依存
- site URL は Workers 移行後の本番 URL（カスタムドメイン設定前は `byte-lark.tanimoto-a49.workers.dev` 等）
- カスタムドメイン設定後に `site` を `https://byte-lark.com` に更新する必要あり（PHASE1A-018 と連動）

## 実装ログ

### 2026-06-12 セッション 1
- やったこと：`src/pages/rss.xml.ts` 新規実装（`getCollection` で draft 除外、`publishedAt` 降順、リンクは blog 詳細と同じ `slug ?? post.id` + 末尾スラッシュ）。`public/robots.txt` に `Sitemap:` 行を追記。`astro.config.mjs` は `site: "https://byte-lark.com"` が PHASE1A-005 時点で設定済みのため変更不要（技術メモの workers.dev 暫定案は採らず、OGP と同じ本番ドメインで統一）。ローカル build 出力 + CF preview の `/rss.xml` `/sitemap-index.xml` `/sitemap-0.xml` `/robots.txt` を curl で目視確認
- 残タスク：なし
- 学び・つまずき：sandbox 内で `gh` が TLS 証明書エラーで使えない（CI 状態確認は preview URL の直接ポーリングで代替できた）
- 想定外だった点：sitemap に `/sample-highlight/`（デモページ）が含まれる。本 PBI スコープ外だが、本番公開前に削除判断が必要（Phase 1b or PHASE1A-020 で要検討）

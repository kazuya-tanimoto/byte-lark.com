# クローラーは RSS / Sitemap / robots.txt を通じてサイトコンテンツを効率的にインデックスできる

Status: InProgress
Started: 2026-06-12

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
- [ ] `@astrojs/rss`（Phase 0 でインストール済み）を使用して `src/pages/rss.xml.ts` を実装
- [ ] RSS フィードに全公開記事（draft: false）が含まれる
- [ ] RSS の各エントリに title / description / pubDate / link が含まれる
- [ ] `@astrojs/sitemap`（Phase 0 で integration 登録済み）の `site` プロパティを `astro.config.mjs` に設定
- [ ] ビルド出力に `sitemap-index.xml` が生成される
- [ ] `public/robots.txt` に sitemap-index.xml への参照を追記（ファイル自体は PHASE0-002 で作成済み）
- [ ] `yarn build` 成功
- [ ] `yarn check:ts` エラーなし
- [ ] ビルド出力で RSS / Sitemap の中身を目視確認

## 技術メモ
- `@astrojs/rss` と `@astrojs/sitemap` は Phase 0 でインストール済み（追加の yarn add は不要）
- sitemap の site 設定は `astro.config.mjs` の `site` プロパティに依存
- site URL は Workers 移行後の本番 URL（カスタムドメイン設定前は `byte-lark.tanimoto-a49.workers.dev` 等）
- カスタムドメイン設定後に `site` を `https://byte-lark.com` に更新する必要あり（PHASE1A-018 と連動）

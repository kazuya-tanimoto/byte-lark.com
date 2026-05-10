# 訪問者は記事ページで構造化されたメタ情報と JSON-LD を通じて正しい検索結果表示を得られる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- 記事ページで統一されたレイアウト（メタ情報・目次・本文）を体験できる
- 検索エンジンが Article JSON-LD を認識し、リッチリザルトに記事情報を表示できる

## なんのために
- Blog 記事詳細ページ（PHASE1A-013）が PostLayout を使う前提のため、先にレイアウトを整備する
- JSON-LD による構造化データで SEO を強化し、検索結果での視認性を高めるため
- 関連: site-plan.md §6.6 / FR-18 / FR-24

## 受け入れ条件
- [ ] `src/layouts/PostLayout.astro` を作成（BaseLayout を wrap）
- [ ] 記事メタ表示: title / publishedAt / updatedAt / category / tags
- [ ] 記事個別の OGP メタ（cover → og:image、未設定時はデフォルト画像）
- [ ] Article JSON-LD を `<script type="application/ld+json">` で出力
- [ ] JSON-LD に必須フィールド: headline / datePublished / dateModified / author / description / image
- [ ] JSON-LD ヘルパ `src/lib/jsonld.ts` を作成（生成ロジック集約）
- [ ] SSG 出力 HTML で JSON-LD が静的に含まれることを確認
- [ ] `yarn build` 成功
- [ ] `yarn check:ts` エラーなし

## 技術メモ
- PostLayout は BaseLayout の上に記事固有の構造（メタ表示・本文エリア・前後リンク枠）を追加
- 前後リンク（前の記事 / 次の記事）は Phase 1a では任意（実装する場合は Blog 記事詳細 PBI と連携）
- JSON-LD の author は Person schema（運営者情報）を使用
- Google Rich Results Test で JSON-LD の妥当性を検証可能

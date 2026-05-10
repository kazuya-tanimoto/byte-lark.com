# 訪問者は Blog 記事詳細ページで本文を読み、コードブロックのシンタックスハイライトを確認できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- `/blog/:slug` で記事の本文・メタ情報を閲覧できる
- コードブロックにシンタックスハイライトが適用された状態で読める
- 記事の cover 画像が最適化された状態で表示される

## なんのために
- Blog の中核機能として、記事本文を読みやすく提示するため
- tech 記事のコードブロックの可読性を確保するため
- 関連: site-plan.md §6.1 / FR-07 / FR-26

## 受け入れ条件
- [ ] `src/pages/blog/[slug].astro` を実装
- [ ] Content Collections から slug で記事を取得し、本文をレンダリング
- [ ] PostLayout（PHASE1A-007）を使用
- [ ] 記事メタ表示: publishedAt / updatedAt / category / tags
- [ ] cover 画像表示（設定されている場合、Astro `<Image>` で最適化）
- [ ] コードハイライトが PHASE1A-002 で選定したライブラリで動作
- [ ] 存在しない slug へのアクセスで 404 ページに遷移
- [ ] 記事個別の OGP メタが正しく出力（title / description / cover → og:image）
- [ ] レスポンシブ対応
- [ ] `yarn build` 成功

## 技術メモ
- `getStaticPaths()` で全記事の slug を列挙し、SSG で各記事ページを生成
- MDX 記事では React コンポーネントの埋め込みが可能（必要な場合のみ）
- コードハイライトのテーマ設定は PHASE1A-002 で `astro.config.mjs` に追加済みの前提

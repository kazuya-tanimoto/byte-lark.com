# 訪問者は Blog 一覧ページで全記事を閲覧し、カテゴリでフィルタできる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- `/blog` で全記事を新しい順に一覧できる
- カテゴリバッジ（tech / life）で記事のジャンルを視覚的に判別できる
- カテゴリフィルタで特定ジャンルの記事だけに絞り込める

## なんのために
- 同業エンジニア（読者）が技術記事を探しやすくするため
- 記事数が増えた時の回遊性を確保するため（Phase 1c のカテゴリ別 URL 追加前の暫定対応）
- 関連: site-plan.md §6.1 / FR-06 / FR-09

## 受け入れ条件
- [ ] `src/pages/blog/index.astro` を実装
- [ ] Content Collections から全記事を取得し、publishedAt の新しい順に表示
- [ ] `draft: true` の記事は一覧に含めない
- [ ] 各記事に category バッジ（tech / life）を表示
- [ ] `src/components/CategoryFilter.tsx` を React Island として実装（クライアントサイドフィルタ）
- [ ] CategoryFilter で「全て / tech / life」を切り替えると表示記事が絞り込まれる
- [ ] BlogCard コンポーネント（PHASE1A-008 で作成済み）を使用
- [ ] 記事 0 件の場合の空状態表示
- [ ] PageLayout を使用
- [ ] OGP メタ（title / description）が正しく出力
- [ ] レスポンシブ対応
- [ ] `yarn build` 成功
- [ ] `yarn check:ts` エラーなし

## 技術メモ
- CategoryFilter は React Island（`client:load` or `client:visible`）で shadcn/ui の Button 等を使用可（Decision #16）
- 記事データは SSG 時に全件ビルドし、フィルタはクライアント JS で表示/非表示を切り替える
- BlogCard は PHASE1A-008（Home ページ）で作成する想定だが、依存関係上どちらが先でも可

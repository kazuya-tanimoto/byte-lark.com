# 訪問者は Blog 一覧ページで全記事を閲覧し、カテゴリでフィルタできる

Status: Done
Started: 2026-06-12
Completed: 2026-06-12

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
- [x] `src/pages/blog/index.astro` を実装
- [x] Content Collections から全記事を取得し、publishedAt の新しい順に表示
- [x] `draft: true` の記事は一覧に含めない（dist HTML に draft-sample が 0 件であることを確認）
- [x] 各記事に category バッジ（tech / life）を表示（BlogCard 内のバッジ）
- [x] `src/components/CategoryFilter.tsx` を React Island として実装（クライアントサイドフィルタ）
- [x] CategoryFilter で「全て / tech / life」を切り替えると表示記事が絞り込まれる
- [x] BlogCard コンポーネント（PHASE1A-008 で作成済み）を使用
- [x] 記事 0 件の場合の空状態表示（全記事 0 件の静的表示 + フィルタ結果 0 件のメッセージの両方）
- [x] PageLayout を使用
- [x] OGP メタ（title / description）が正しく出力
- [x] レスポンシブ対応
- [x] `yarn build` 成功
- [x] `yarn check:ts` エラーなし

## 技術メモ
- CategoryFilter は React Island（`client:load` or `client:visible`）で shadcn/ui の Button 等を使用可（Decision #16）
- 記事データは SSG 時に全件ビルドし、フィルタはクライアント JS で表示/非表示を切り替える
- `src/components/BlogCard.astro` は PHASE1A-008（Home ページ）で共有コンポーネントとして作成する想定。本 PBI ではそれを再利用する

## 実装ログ

### 2026-06-12 セッション 1
- やったこと：`src/pages/blog/index.astro` + `src/components/CategoryFilter.tsx` 新規実装。カードは SSG（BlogCard 再利用、`<li data-blog-item data-category>` でラップ）、CategoryFilter は React Island（`client:load`、shadcn Button、`aria-pressed` 付き）が DOM の hidden を切り替える構成にし、記事データの二重レンダリングを回避。フィルタ結果 0 件時は `[data-blog-empty]` のメッセージを表示。ローカル（dev :4323）+ CF preview の両方で 全て→Life（空状態）→Tech→全て のクリック動作を Playwright で検証、1280px / 375px のスクリーンショット確認、OGP / draft 除外は dist HTML で確認
- 残タスク：なし
- 学び・つまずき：Biome の a11y ルール（useSemanticElements）で `role="group"` が `<fieldset>` 要求になる。最初から `<fieldset aria-label>` で書くとよい
- 想定外だった点：特になし（Life 記事が現状 0 件のため、フィルタ 0 件時の空状態メッセージが実データで検証できたのはむしろ好都合だった）

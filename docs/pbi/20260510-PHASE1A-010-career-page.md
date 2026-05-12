# 訪問者は Career ページで全経歴をタイムライン形式で閲覧できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- 全経歴をタイムライン形式で時系列に閲覧できる

## なんのために
- エージェント担当者・クライアントが運営者の職務経歴を詳細に確認するため
- Home の抜粋では伝えきれない全件を専用ページで提示するため
- 関連: site-plan.md §6.1 / FR-04

## 受け入れ条件
- [ ] `src/pages/career.astro` を実装
- [ ] `src/data/career.ts` の全件をタイムライン形式で表示（新しい順）
- [ ] `src/components/CareerTimeline.astro` を作成
- [ ] 各エントリに期間・社名/プロジェクト名・役割・概要を表示
- [ ] PageLayout を使用
- [ ] OGP メタ（title / description）が正しく出力
- [ ] レスポンシブ対応
- [ ] `yarn build` 成功
- [ ] `yarn check:ts` エラーなし

## 技術メモ
- CareerTimeline は静的コンポーネント（Astro 自前、JS 不要）
- `src/data/career.ts` は PHASE0-003 で移植済み（id=3,4 のダミーデータ削除済み、FR-03）
- タイムラインの視覚デザインは Tailwind で実装（左ボーダー + ドット等のシンプルな形式）

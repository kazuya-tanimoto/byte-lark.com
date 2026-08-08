# 訪問者は Career ページで全経歴をタイムライン形式で閲覧できる

Status: Done
Started: 2026-06-12
Completed: 2026-06-12

## 誰が
- 訪問者

## 何をできる
- 全経歴をタイムライン形式で時系列に閲覧できる

## なんのために
- エージェント担当者・クライアントが運営者の職務経歴を詳細に確認するため
- Home の抜粋では伝えきれない全件を専用ページで提示するため
- 関連: site-plan.md §6.1 / FR-04

## 受け入れ条件
- [x] `src/pages/career.astro` を実装
- [x] `src/data/career.ts` の全件をタイムライン形式で表示（新しい順）
- [x] `src/components/CareerTimeline.astro` を作成
- [x] 各エントリに期間・社名/プロジェクト名・役割・概要を表示（役割はデータが存在する id=1 のみ。id=2 は一次情報なしのため非表示、運営者承認 2026-06-12）
- [x] PageLayout を使用
- [x] OGP メタ（title / description）が正しく出力
- [x] レスポンシブ対応
- [x] `yarn build` 成功
- [x] `yarn check:ts` エラーなし

## 技術メモ
- CareerTimeline は静的コンポーネント（Astro 自前、JS 不要）
- `src/data/career.ts` は PHASE0-003 で移植済み（id=3,4 のダミーデータ削除済み、FR-03）
- タイムラインの視覚デザインは Tailwind で実装（左ボーダー + ドット等のシンプルな形式）

## 実装ログ

### 2026-06-12 セッション 1
- やったこと：`src/pages/career.astro` + `src/components/CareerTimeline.astro` 新規実装（左ボーダー + ドットのタイムライン、from 降順ソート、JS 不要）。`CareerItem` 型に `role?: string` を追加し、id=1 に `CareerDetailData` 由来の「SE兼EM」を設定。ローカル（dev :4322）+ CF preview を 1280px / 375px で検証、OGP メタは dist HTML で確認
- 残タスク：なし
- 学び・つまずき：受け入れ条件の「役割」表示に対しデータ側に role が無かった。アーカイブ branch（archive/vite-react-chakra）の元データまで遡及確認したが id=2 の役割は一次情報なし → 捏造せず運営者に確認し「役割なし（非表示）」で確定。role は optional 表示にして後から追記可能な形にした
- 想定外だった点：push 後の CF preview は反映まで約 3 分かかり、その間 `/career` は HTTP エラー（旧バージョンに該当ルートが無いため）。alias root URL が旧バージョンで応答することを確認して「ビルド待ち」と切り分けた

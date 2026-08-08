# 運営者は初期記事セットの本数・ネタを確定し、記事実装 PBI を追加起票できる

Status: Done
Started: 2026-06-28
Completed: 2026-06-28

## 誰が
- 運営者

## 何をできる
- Claude とネタ出しし、公開時に揃える記事の本数と各テーマを確定し、確定本数分の記事実装 PBI（1 記事 1 PBI）を追加起票できる

## なんのために
- 公開時の初期記事セット（本数・テーマ）が計画に存在しない。ここで確定し、記事執筆を PBI 化する。あわせて R-01（書く習慣・月次ネタ出し routine）の点火を検討する
- 関連: site-plan.md FR-19 / R-01 / Phase 1b（コンテンツ整備） / `docs/writing-workflow.md`

## 受け入れ条件
- [x] 運営者 + Claude でネタ出し（`docs/writing-workflow.md` §1-3 のプロセスを使用）→ 2026-06-28 実施。一次情報（career.ts / skills.ts / about.astro / 本リポジトリ構築履歴）を踏まえ Tech 4 + Life 4 候補を提示、運営者が選択し追加ネタを投入
- [x] 公開時に揃える本数と各テーマ（tech / life）を確定し、本 PBI 実装ログに記録 → 初期セット 6 本（tech 4: T1/T2/T3/T5、life 2: L1/L2+L3）。下記実装ログに記録
- [x] 確定本数分の「記事実装 PBI（1 記事 1 PBI、PHASE1B-008〜）」を INDEX.md に NotStarted で追加起票する（各 PBI に §7 検証ゲート 3 項目を常設、受け入れ条件に frontmatter 完備 / OGP・JSON-LD 出力確認 / 運営者の最終承認を含める）→ PHASE1B-008〜013（記事 6 本）+ 014（Phase 1b Gate）を起票。各記事 PBI に §7 検証 3 項目 + frontmatter 完備 + OGP/Article JSON-LD 出力確認 + 運営者最終承認を受け入れ条件化
- [x] R-01 の月次ネタ出し routine（/schedule）を点火するか運営者と判断し、実装ログに記録 → Phase 1d 公開後に点火と判断。ネタは `docs/article-backlog.md` を起点（routine プロンプト例も同ファイルに記載）
- [x] ローカル スクショ確認（desktop + mobile）：N/A（本 PBI はネタ確定と PBI 追加起票のみで frontend 非変更）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：N/A（同上、frontend 非変更）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：N/A（docs のみで frontend 非変更。ci-status による検証は追加起票する記事実装 PBI 側で実施）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1（ネタ出し + 本数確定 + 記事実装 PBI 起票。実際の記事執筆は追加起票する記事 PBI 群で行う）
- `docs/writing-workflow.md` のヒアリング → ドラフト → 運営者リライト → published プロセスを使用
- 記事 title は `| byte-lark.com` サフィックス無しで素のまま渡す（JSON-LD headline 汚染防止）。本文冒頭に `# タイトル` を重複させない（PostLayout が title を h1 出力。PHASE1A-022 申し送り）
- 本 PBI 完了後に、記事実装 PBI 群と Phase 1b Retrospective Gate（1b→1c）を起票する（番号は起票時に確定）

## 備考
- `draft-phase1b-content-launch-prep.md` 項目6 の正式化。draft 項目7（記事実装 × n）は本 PBI 完了時に追加起票する placeholder

## 実装ログ

### 2026-06-28

やったこと
- ネタ出し（運営者 + Claude）：運営者の一次情報（`src/data/career.ts` / `src/data/skills.ts` / `src/pages/about.astro` / 本リポジトリの構築履歴）を踏まえ、Tech 4 候補 + Life 4 候補を提示。運営者が選択し、追加ネタ（実案件での Claude 活用 PO 業務、Claude 新機能レビュー連載、屋号の由来、iPhone Air、開発デスク環境）を投入。
- 初期記事セット 6 本を確定（公開前 = Phase 1d までに執筆）：
  - tech: T1 サイト構築総括（Claude Code + PBI 駆動）/ T2 自前フォーム実装（Workers + Turnstile + Resend）/ T3 レガシー→モダン移行 / T5 実案件で Claude 活用 PO 業務
  - life: L1 法人化（合同会社バイトラーク）/ L2+L3 合う仕事 × ストレングスファインダー（運営者提案で統合）
- 記事実装 PBI 6 本（PHASE1B-008〜013）+ Phase 1b Retrospective Gate（PHASE1B-014）を起票。
- 公開後バックログ（T4 / T6 / T7 / L4 / L5 / L6）は `docs/article-backlog.md` に切り出して管理。
- R-01 月次ネタ出し routine：Phase 1d 公開後に `/schedule` で点火と判断。`docs/article-backlog.md` を起点（プロンプト例を同ファイルに記載）。T6（Claude 新機能レビュー + cron 半自動化）は routine の発展形。

確定（本数・テーマ）
- 初期セット 6 本（tech 4 / life 2）。各 slug は記事 PBI 技術メモに記載。

運営者の判断記録
- 2026-06-28：Tech は T1/T2/T3/T4/T5、Life は L1/L2/L3/L4 を「書きたい」と選択。初期セット範囲は「推奨 6 本」を選択。R-01 は「Phase 1d 公開後に点火」を選択（いずれも AskUserQuestion）。

学び・つまずき
- 当初「バックログは本 PBI 実装ログに残す」としたが、運営者指摘で Done PBI の実装ログは後続フロー（セッション開始チェックは InProgress のみ参照、README §5.5 で Done は基本不変）が読まず死蔵されると判明。生きた `docs/article-backlog.md` に切り出した。
- ガジェットの tech/life 分けが切り口依存で非対称（T7=tech・L6=life）になっていた（運営者指摘）。「技術そのものは tech / それ以外は life、ガジェットは原則 life・技術的に掘るなら tech」と基準を整理し article-backlog に明記。

申し送り
- 記事実装 PBI（008〜013）は writing-workflow のヒアリング → ドラフト（`draft: true`）→ 運営者リライト → `draft: false` で進める。公開（main マージ）は Phase 1d。
- Phase 1b は 008〜013 完了 → PHASE1B-014 Gate 通過で Phase 1c へ。

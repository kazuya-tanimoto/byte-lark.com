# 運営者は初期記事セットの本数・ネタを確定し、記事実装 PBI を追加起票できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- Claude とネタ出しし、公開時に揃える記事の本数と各テーマを確定し、確定本数分の記事実装 PBI（1 記事 1 PBI）を追加起票できる

## なんのために
- 公開時の初期記事セット（本数・テーマ）が計画に存在しない。ここで確定し、記事執筆を PBI 化する。あわせて R-01（書く習慣・月次ネタ出し routine）の点火を検討する
- 関連: site-plan.md FR-19 / R-01 / Phase 1b（コンテンツ整備） / `docs/writing-workflow.md`

## 受け入れ条件
- [ ] 運営者 + Claude でネタ出し（`docs/writing-workflow.md` §1-3 のプロセスを使用）
- [ ] 公開時に揃える本数と各テーマ（tech / life）を確定し、本 PBI 実装ログに記録
- [ ] 確定本数分の「記事実装 PBI（1 記事 1 PBI、PHASE1B-008〜）」を INDEX.md に NotStarted で追加起票する（各 PBI に §7 検証ゲート 3 項目を常設、受け入れ条件に frontmatter 完備 / OGP・JSON-LD 出力確認 / 運営者の最終承認を含める）
- [ ] R-01 の月次ネタ出し routine（/schedule）を点火するか運営者と判断し、実装ログに記録
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

# PHASE1E-005: 計画書・INDEX の分割（改訂履歴と Decision Log の切り出し）

Status: InProgress
Started: 2026-08-13
Completed:

## 誰が

セッションを開始した Claude Code が

## 何をできる

`docs/pbi/INDEX.md` と `docs/site-plan.md` を Read 1 回（約 25k トークン上限）で読める大きさにし、セッション開始時の読み込み効率を上げる。

## なんのために

両ファイルとも Read 1 回分を超えており（INDEX 88.6KB / site-plan 86KB）、セッション開始のたびに分割読みが要る。PHASE1D-009 の棚卸しで持ち越した「docs 肥大の根治」を、毎回読む必要のない部分（改訂履歴・Decision Log）の別ファイル化で解消する（運営者決定 2026-08-13）。

## 受け入れ条件

- [ ] INDEX.md の改訂履歴（61.7KB、全体の 70%）を `docs/pbi/INDEX-history.md` へ切り出し、INDEX.md 側は誘導スタブにする。今後の改訂履歴行は分割先の表の先頭に追記
- [ ] site-plan.md の改訂履歴表 + 冒頭の「版ごとの主な変更」引用ブロック（計約 27KB）を `docs/site-plan-history.md` へ切り出す。冒頭には最新の 1 世代分だけ残す
- [ ] site-plan.md §8 Decision Log（16KB）を `docs/site-plan-decisions.md` へ切り出し、§8 は誘導スタブにする。既存参照 121 箇所（「site-plan §8 Decision #NN」）が書き換えなしで辿れること
- [ ] 分割後の INDEX.md / site-plan.md がそれぞれ Read 1 回で全体を返すこと（バイト数で確認）
- [ ] 連動更新：site-plan を v3.14 に改訂（§12 の README 参照 v3.9 → v3.11 のドリフト修正を含む）、§14 の改訂履歴同期ルール、CLAUDE.md（セッション開始手順・Related Docs）
- [ ] ローカル スクショ確認：N/A（docs のみ、サイト出力に変更なし）（CLAUDE.md §7）
- [ ] CF preview スクショ確認：N/A（同上）（CLAUDE.md §7）
- [ ] E2E / CI green 確認：`bash scripts/ci-status.sh` で Quality Checks / UI Tests が success（CLAUDE.md §7）

## 技術メモ

- 想定セッション数: 1
- 分割はテキスト移動のみで内容は不変（過去の改訂履歴行・Decision 本文は書き換えない）
- Decision # の番号体系は分割後も継続（新しい決定は分割先の表の末尾に追記）

## 備考

- 出所：PHASE1D-009 申し送り棚卸し表の持ち越し項目「INDEX.md / site-plan.md が Read の 1 回分を超えている（根治は改訂履歴の切り出しか Phase 別分割）」。改訂履歴の切り出し案を採用し、Phase 別分割は不採用（表自体は小さく、分割すると同期ルールが複雑になるため）
- 同日の運営者決定：外部レビュー T3〜T7 は不採用（サイトの目的を「営業サイト」へ広げない）。INDEX の判断待ち一覧から外す

## 実装ログ（着手後に追記、中断時は必須）

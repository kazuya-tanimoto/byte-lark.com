# セッションを開始した Claude Code は、INDEX.md と site-plan.md を Read 1 回で読める

Status: Done
Started: 2026-08-13
Completed: 2026-08-13

## 誰が

セッションを開始した Claude Code が

## 何をできる

`docs/pbi/INDEX.md` と `docs/site-plan.md` を Read 1 回（約 25k トークン上限）で読める大きさにし、セッション開始時の読み込み効率を上げる。

## なんのために

両ファイルとも Read 1 回分を超えており（INDEX 88.6KB / site-plan 86KB）、セッション開始のたびに分割読みが要る。PHASE1D-009 の棚卸しで持ち越した「docs 肥大の根治」を、毎回読む必要のない部分（改訂履歴・Decision Log）の別ファイル化で解消する（運営者決定 2026-08-13）。

## 受け入れ条件

- [x] INDEX.md の改訂履歴（61.7KB、全体の 70%）を `docs/pbi/INDEX-history.md` へ切り出し、INDEX.md 側は誘導スタブにする。今後の改訂履歴行は分割先の表の先頭に追記
- [x] site-plan.md の改訂履歴表 + 冒頭の「版ごとの主な変更」引用ブロック（計約 27KB）を `docs/site-plan-history.md` へ切り出す。冒頭には最新の 1 世代分だけ残す
- [x] site-plan.md §8 Decision Log（16KB）を `docs/site-plan-decisions.md` へ切り出し、§8 は誘導スタブにする。既存参照 121 箇所（「site-plan §8 Decision #NN」）が書き換えなしで辿れること
- [x] 分割後の INDEX.md / site-plan.md がそれぞれ Read 1 回で全体を返すこと（バイト数で確認）
- [x] 連動更新：site-plan を v3.14 に改訂（§12 の README 参照 v3.9 → v3.11 のドリフト修正を含む）、§14 の改訂履歴同期ルール、CLAUDE.md（セッション開始手順・Related Docs）
- [x] ローカル スクショ確認：N/A（docs のみ、サイト出力に変更なし）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上）（CLAUDE.md §7）
- [x] E2E / CI green 確認：`bash scripts/ci-status.sh` で Quality Checks / UI Tests が success（CLAUDE.md §7）

## 技術メモ

- 想定セッション数: 1
- 分割はテキスト移動のみで内容は不変（過去の改訂履歴行・Decision 本文は書き換えない）
- Decision # の番号体系は分割後も継続（新しい決定は分割先の表の末尾に追記）

## 備考

- 出所：PHASE1D-009 申し送り棚卸し表の持ち越し項目「INDEX.md / site-plan.md が Read の 1 回分を超えている（根治は改訂履歴の切り出しか Phase 別分割）」。改訂履歴の切り出し案を採用し、Phase 別分割は不採用（表自体は小さく、分割すると同期ルールが複雑になるため）
- 同日の運営者決定：外部レビュー T3〜T7 は不採用（サイトの目的を「営業サイト」へ広げない）。INDEX の判断待ち一覧から外す

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-13 セッション 1（起票・実施・完了）

#### やったこと
- 分割 3 ファイルを新設し、元ファイルは誘導スタブ化：
  - `docs/pbi/INDEX-history.md`（INDEX の改訂履歴 69 行。新しい行は表の先頭に追記）
  - `docs/site-plan-history.md`（版ごとの主な変更 14 世代 + 改訂履歴表 27 行。追記は末尾）
  - `docs/site-plan-decisions.md`（Decision #1〜#31 の 31 行。参照表記「site-plan §8 Decision #NN」は不変）
- サイズ実測：INDEX.md 88.6KB → **28.0KB**、site-plan.md 86.0KB → **49.4KB**。どちらも Read 1 回（約 25k トークン）で全体が返る
- 移動前後の行数照合：Decision 31 / 引用ブロック 14+新規 1 / site-plan 履歴 27+新規 1 / INDEX 履歴 69+新規 1 で欠落なし
- site-plan v3.13 → v3.14：§8 スタブ化、改訂履歴スタブ化、§12 README 参照ドリフト修正（v3.9 → 現行 v3.11）、§14 改訂履歴同期ルールを分割先に更新、§6.7 自己参照 v3.14
- CLAUDE.md 連動：セッション開始手順 1 に Decision Log の分割先を明記、Related Docs に site-plan-decisions.md を追加・版数 v3.14
- INDEX 冒頭の「次にやること」を同日の運営者決定で更新：外部レビュー T3〜T7 不採用 / Netlify 削除済み / 残る判断待ち 3 件

#### 学び
- INDEX の肥大要因はほぼ改訂履歴単体（61.7KB / 70%）だが、site-plan は冒頭の「版ごとの主な変更」引用ブロックが 13KB あり、改訂履歴表（14KB）と §8（16KB）を合わせた 3 点セットで初めて Read 1 回に収まる

#### 想定外
- なし（テキスト移動のみ、サイト出力に変更なし）

### 2026-08-23 事後追記
- タイトルを README §4.1 のユーザーストーリー形式に是正（件名形式からの書式変更のみ、内容変更なし）

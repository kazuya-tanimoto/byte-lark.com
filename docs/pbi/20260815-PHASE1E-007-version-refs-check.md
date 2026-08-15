# PHASE1E-007: バージョン参照チェックのスクリプト化（check-version-refs.sh）

Status: Done
Started: 2026-08-15
Completed: 2026-08-15

## 誰が

docs のバージョンを更新するセッション（Claude / 運営者）が

## 何をできる

site-plan / PBI README のバージョン参照の連動更新漏れを push 前に機械検出できる（手動 grep 依存をやめる）。

## なんのために

site-plan §14 の連動更新チェックは手動 grep 頼みで、過去に更新漏れが 2 回再発している（v3.3 の教訓で §14 を新設した後も、前ラウンドで INDEX 改訂履歴の追記漏れが発生）。§14 「将来の自動化」に起票検討のまま残っていた案を実装する（運営者決定 2026-08-15）。

## 受け入れ条件

- [x] `scripts/check-version-refs.sh` を新設し、以下の不変条件を検査して不一致なら非ゼロ終了 + 対象箇所を出力する：
  - site-plan.md タイトルの版数 = 冒頭「主な変更」注記の版数 = §6.7 自己参照 = CLAUDE.md Related Docs の `current: v3.x`
  - site-plan の現行版数の行が `docs/site-plan-history.md` に存在する（改訂履歴の追記漏れ検出）
  - docs/pbi/README.md タイトルの版数 = CLAUDE.md Related Docs = site-plan §12 の README 参照
- [x] 検査を意図的に壊した状態で非ゼロ終了 + 指摘出力を実測（負のテスト）、正常状態でゼロ終了を実測
- [x] `lefthook.yml` の pre-push に組み込む
- [x] site-plan §14「将来の自動化」を実装済みに更新し、site-plan を v3.15 に改訂（連動：冒頭注記 / §6.7 / 履歴ファイル追記 / CLAUDE.md）。あわせて R-13 対応策にオフサイト mirror 見送り（Decision #32）を追記
- [x] ローカル スクショ確認：N/A（scripts / docs のみ、サイト出力に変更なし）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上）（CLAUDE.md §7）
- [x] E2E / CI green 確認：`bash scripts/ci-status.sh` で Quality Checks / UI Tests が success（CLAUDE.md §7）

## 技術メモ

- 想定セッション数: 1
- bash + grep のみ（依存追加なし）。ルートは第 1 引数で差し替え可能にし、負のテストは scratchpad 上のコピーで行う
- §14 の 7 パターンのうち、機械検査に向くのは「現行版数の相互参照」だけ。過去事実（Done PBI 内の旧版数・改訂履歴の歴史行）と PBI 件数系は対象外のまま §14 の手動チェックに残す

## 備考

- 出所：site-plan §14 運用ルール「将来の自動化」（Phase 1a 冒頭で起票検討→未起票のまま残置していた）
- 同日の運営者決定：R-13 のオフサイト mirror バックアップは見送り（ローカル clone 併存により全損は GitHub 停止 + 母艦故障の同時発生に限られ、許容する。Decision #32 として記録）

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-15 セッション 1（起票・実施・完了）

#### やったこと
- `scripts/check-version-refs.sh` 新設（bash + grep のみ、ルートを第 1 引数で差し替え可能）。検査対象：site-plan 版数の 4 参照 + 履歴追記 + PBI README 版数の 2 参照
- `lefthook.yml` pre-push に `version-refs` を追加（typecheck の前段）。`npx lefthook run pre-push` で登録を確認
- site-plan v3.14 → v3.15：§14「将来の自動化」を実装済みに更新、R-13 対応策を mirror 見送りに書き換え（Decision #32 を decisions 末尾に追記）、冒頭注記 / §6.7 / site-plan-history.md（引用 + 表）/ CLAUDE.md を連動更新
- テスト実測：正常系 exit=0（`OK: バージョン参照は一致（site-plan v3.15 / PBI README v3.11）`）、負のテスト（scratchpad 上のコピーで CLAUDE.md を旧版数化 + 履歴行を欠落）は NG 2 件を指摘して exit=1

#### 学び
- §12 の README 参照はバッククォート付き（`` `docs/pbi/README.md` v3.11 ``）で、固定文字列 grep が誤検知した。初回の正常系実行が検出 → 「README.md を含む行 かつ `vX.Y を参照`」の 2 段 grep に修正
- lefthook は push 対象ファイルが無いと `(skip) no matching push files` になる（`run` のみのコマンドでも同様）

#### 想定外
- なし

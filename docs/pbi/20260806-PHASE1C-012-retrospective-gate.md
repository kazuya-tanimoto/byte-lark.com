# 運営者と Claude は Phase 1c 完了状態を確認し、Phase 1d への学びを次セッションへ申し送ることができる

Status: NotStarted

## 誰が
- 運営者 + Claude

## 何をできる
- Phase 1c の全 PBI（先行トラック 001〜009 + 仕上げトラック 010〜011）が Done になったことを確認できる
- Phase 1c で得た知見・想定外・つまずきを集約し、Phase 1d（公開）PBI 起票時の参考資料として明文化できる

## なんのために
- Phase 1c の学びが Phase 1d の公開 PBI に反映されないまま着手するリスクを排除するため
- 関連: site-plan.md §7（ロードマップの Retrospective Gate）/ Phase 1c / Phase 1d

## 受け入れ条件

### Phase 1c 完了確認
- [ ] PHASE1C-001 〜 PHASE1C-011 のすべてが Status: Done
- [ ] `docs/pbi/INDEX.md` の Phase 1c セクションがすべて `[Done]` 表示（012 は本 Gate）
- [ ] feat/phase-1 ブランチで `yarn dev` / `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がすべて成功

### 学びの集約
- [ ] 本 PBI の `## Phase 1d への申し送り` セクションに記入: 確定した技術前提（実際に動いた構成）/ 発生した想定外と回避策 / 計画書と実態の差分 / Phase 1d 起票時の注意 / Phase 1d で先に決めるべき事項
- [ ] 申し送り棚卸し（README §4.6 ルール 8）：Phase 1c 全 PBI の実装ログにある申し送り・積み残しを項目単位で列挙し、各項目を **PBI 化（起票先を明記）/ 持ち越し（`## Phase 1d への申し送り` に記載）/ 破棄（理由を明記）** のいずれかに判定して表にする。前 Gate（PHASE1B-014）の持ち越し項目（publishedAt 実公開日化 / Contact 本番ドメイン確認 + Resend DNS + 疎通テスト / main CodeQL 週次 cron 無効化 / medium alert クローズ確認 / 法人化対応 PBI の起票判断（site-plan §13.4）/ Lighthouse Performance・SEO 正式判定 / R-01 routine 点火 / 「最良モデル」ブログ URL）も同じ表で再判定する
- [ ] `draft-phase1d-domain-launch.md` を Phase 1d PBI として正式化する指示を明記（PHASE1B-014 からの持ち越し分の引き渡し先を含める）
- [ ] README 改訂の要否判断：「公開 commit と PBI Done 化は同一セッションで完結させる」の規約化（PHASE1B-014 棚卸しで本 Gate での判断と指定された項目）

### 運営者作業
- [ ] CF Deploy Hooks を設定（ダッシュボード操作。push 取りこぼし時に URL 一発で再ビルドするための保険。2026-08-06 起票セッションで「設定する」と運営者確定。Hook URL は秘匿情報として repo / PBI / ログに書かない）

### CLAUDE.md / site-plan.md の整合確認
- [ ] CLAUDE.md の記述と Phase 1c の実態に齟齬がないか確認
- [ ] site-plan.md と Phase 1c 実装結果に差分があれば記録・修正（PHASE1B-014 で記録済みの §13.1 現在地注記の古さも、site-plan を改訂する場合はあわせて更新）

### 完了処理
- [ ] 本 PBI の Status を Done に更新、INDEX.md 同期
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。Gate は UI を変更しない想定 → `[x] …：N/A（理由）` で明記）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。同上）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）（CLAUDE.md §7。docs のみ変更の想定だが、Gate 通過判定として HEAD の CI green を別途確認する）

### 次セッションへのトリガー
- [ ] 本 PBI が Done になった時点で、次セッションは「Phase 1d PBI 起票」（draft-phase1d-domain-launch.md の正式化）を最初のタスクとして実行可能

## Phase 1d への申し送り

（Gate 実施時に記入）

## 技術メモ
- 想定セッション数: 1
- PHASE0-010 / PHASE1A-022 / PHASE1B-014 と同じ Gate 構造
- 公開（main マージ）は Phase 1d。本 Gate ではマージしない（site-plan §8 Decision #25）

## 備考
- Phase 1c（デザインブラッシュアップ）の Retrospective Gate。draft-phase1c-design-polish.md §C の 3 項目め（仕上げトラック）の正式化。PHASE1B-014「Phase 1c への申し送り」の正式化指示に基づく

## 実装ログ（着手後に追記、中断時は必須）

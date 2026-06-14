# 運営者と Claude は Phase 1a 完了状態を確認し、Phase 1b への学びを次セッションへ申し送ることができる

Status: NotStarted

## 誰が
- 運営者 + Claude

## 何をできる
- Phase 1a の全 PBI が Done になったことを確認できる
- Phase 1a で得た技術的知見・想定外・つまずきを集約し、Phase 1b PBI 起票時の参考資料として明文化できる
- feat/phase-1a を main にマージし、本番デプロイの最終確認ができる

## なんのために
- Phase 1a の学びが Phase 1b のデザインブラッシュアップ PBI に反映されないまま着手するリスクを排除するため
- 関連: site-plan.md §7（ロードマップの Retrospective Gate）/ Phase 1a

## 受け入れ条件

### Phase 1a 完了確認
- [ ] PHASE1A-001 〜 PHASE1A-021 のすべてが Status: Done（**例外**: PHASE1A-018 は Status: Moved。site-plan v3.9 Decision #25 で Phase 1d 公開 PBI へ移管済み）
- [ ] `docs/pbi/INDEX.md` の Phase 1a セクションがすべて `[Done]` 表示
- [ ] feat/phase-1a ブランチで `yarn dev` / `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がすべて成功

### 学びの集約
- [ ] 本 PBI の `## Phase 1b への申し送り` セクションに以下を記入:
  - [ ] 確定した技術前提（実際に動いた構成・選定結果）
  - [ ] 発生した想定外と回避策
  - [ ] 計画書と実態の差分（あれば）
  - [ ] Phase 1b 起票時の注意（コンテンツ整備に影響する事項。※ v3.9 Phase 再編により 1b = コンテンツ整備、デザインは 1c）
  - [ ] Phase 1b で先に決めるべき事項
  - [ ] **ドラフト 2 本の正式化指示**：1b 起票時に `draft-phase1b-content-launch-prep.md` を、1d 起票時に `draft-phase1d-domain-launch.md` を、それぞれ番号付き PBI として正式化すること

### CLAUDE.md / site-plan.md の整合確認
- [ ] CLAUDE.md の記述と Phase 1a の実態に齟齬がないか確認
- [ ] site-plan.md と Phase 1a 実装結果に差分があれば記録・修正

### マージ
- [ ] feat/phase-1a ブランチを main にマージ（`merge --no-ff`）
- [ ] feat/phase-1a は remote に保持
- [ ] 本番デプロイ成功確認

### 完了処理
- [ ] 本 PBI の Status を Done に更新、INDEX.md 同期
- [x] ローカル スクショ確認（desktop + mobile）：N/A（理由：本 PBI は Gate（確認・マージ・申し送り）で UI を変更しない）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：N/A（理由：UI 変更なし）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）：N/A（理由：本 PBI は Gate（確認・マージ・申し送り）でコード非変更。Gate 通過判定では別途 CI 緑を確認）（CLAUDE.md §7）

### 次セッションへのトリガー
- [ ] 本 PBI が Done になった時点で、次セッションは「Phase 1b PBI 起票」を最初のタスクとして実行可能

## 技術メモ
- PHASE0-010 と同じ Gate 構造
- Phase 1b はコンテンツ整備（Skills / Career 実データ化、About / Privacy 文面確定、Contact フォーム化、初期記事セット）。デザインブラッシュアップは Phase 1c（v3.9 Phase 再編、Decision #25）
- Phase 1a の仮 HEX → Phase 1c で確定 HEX に置換するため、どのファイルに仮 HEX が使われているかの一覧が申し送りで重要

## Phase 1b への申し送り

（Phase 1a 完了時に記入）

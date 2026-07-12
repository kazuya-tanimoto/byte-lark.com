# 運営者と Claude は Phase 1b 完了状態を確認し、Phase 1c への学びを次セッションへ申し送ることができる

Status: NotStarted

## 誰が
- 運営者 + Claude

## 何をできる
- Phase 1b の全 PBI（001〜013）が Done になったことを確認できる
- Phase 1b で得た知見・想定外・つまずきを集約し、Phase 1c（デザインブラッシュアップ）PBI 起票時の参考資料として明文化できる

## なんのために
- Phase 1b の学びが Phase 1c のデザイン PBI に反映されないまま着手するリスクを排除するため
- 関連: site-plan.md §7（ロードマップの Retrospective Gate）/ Phase 1b / Phase 1c

## 受け入れ条件

### Phase 1b 完了確認
- [ ] PHASE1B-001 〜 PHASE1B-013 のすべてが Status: Done
- [ ] `docs/pbi/INDEX.md` の Phase 1b セクションがすべて `[Done]` 表示
- [ ] feat/phase-1 ブランチで `yarn dev` / `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がすべて成功

### 学びの集約
- [ ] 本 PBI の `## Phase 1c への申し送り` セクションに記入: 確定した技術前提（実際に動いた構成）/ 発生した想定外と回避策 / 計画書と実態の差分 / Phase 1c 仕上げトラック起票時の注意 / Phase 1c で先に決めるべき事項
- [ ] `draft-phase1c-design-polish.md` の**仕上げトラック**（B-3 CSS サイズ / 全記事最終再検証 / 1c Gate）を Phase 1c PBI として正式化する指示を明記（先行トラック＝確定 HEX + color-contrast 再有効化、タイポ確定、ロゴ刷新、favicon、B-1 見出しレベル、B-2 フォント CLS は site-plan v3.10 Decision #28 により PHASE1C-001〜007 として 2026-07-12 起票済み）
- [ ] 初期記事セット（PHASE1B-008〜013）の実装で判明したタイポ / カード設計 / 見出しレベルの課題を Phase 1c へ申し送り（該当する先行トラック PBI が未 Done なら受け入れ条件・技術メモに追記、Done 済みなら仕上げトラックの最終再検証 PBI に反映）
- [ ] R-01 月次ネタ出し routine（/schedule）を Phase 1d 公開後に点火する方針と、`docs/article-backlog.md`（記事ネタのストック）を起点にすることを申し送りに明記

### CLAUDE.md / site-plan.md の整合確認
- [ ] CLAUDE.md の記述と Phase 1b の実態に齟齬がないか確認
- [ ] site-plan.md と Phase 1b 実装結果に差分があれば記録・修正

### 完了処理
- [ ] 本 PBI の Status を Done に更新、INDEX.md 同期
- [ ] ローカル スクショ確認（desktop + mobile）：N/A（理由: 本 PBI は Gate（確認・申し送り）で UI を変更しない）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）：N/A（理由: UI 変更なし）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：N/A（本 PBI は docs のみ変更で frontend 非変更）。ただし Gate 通過判定として HEAD の CI 緑を別途確認する（CLAUDE.md §7）

### 次セッションへのトリガー
- [ ] 本 PBI が Done になった時点で、次セッションは「Phase 1c 仕上げトラック PBI 起票」（B-3 / 全記事最終再検証 / 1c Gate）を最初のタスクとして実行可能（先行トラック PHASE1C-001〜007 は Decision #28 により本 Gate 前から着手可）

## 技術メモ
- PHASE0-010 / PHASE1A-022 と同じ Gate 構造
- 公開（main マージ）は Phase 1d。本 Gate ではマージしない（site-plan v3.9 Decision #25）
- Phase 1a の仮 HEX → Phase 1c で確定 HEX に置換。どのファイルに仮 HEX があるかの一覧（PHASE1A-022 申し送り）を Phase 1c で参照する

## 備考
- Phase 1b（コンテンツ整備）の Retrospective Gate。PHASE1B-007 完了時に記事実装 PBI 群（008〜013）とあわせて起票（draft-phase1b-content-launch-prep.md 項目7 の Gate 部）

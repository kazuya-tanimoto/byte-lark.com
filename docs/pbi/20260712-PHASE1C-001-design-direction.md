# 運営者は Claude が提示するデザイン草案からサイト全体の方向性（カラー・タイポ・トーン）を確定できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- ブランドコンセプトに基づくデザイン草案（カラーパレット候補・タイポの方向性・全体トーン）を複数案から比較し、Phase 1c 実装（PHASE1C-002〜004）の入力となる方向性を確定できる

## なんのために
- 1c の実装 PBI（確定 HEX / タイポ / ロゴ）が個別バラバラに走ると視覚的一貫性（site-plan §6.5.5）が崩れるため、最初に全体方向を 1 か所で確定する
- 関連: site-plan.md §6.5（デザインシステム）/ §8 Decision #14（Plan B パレット）#15 #28 / Phase 1c 先行トラック

## 受け入れ条件
- [ ] ブランドコンセプト（§6.5.1）・現行仮パレット（§6.5.2 Plan B）・タイポ方針（§6.5.3）を入力に、カラー・タイポ・全体トーンの草案を 2-3 案提示（各案：パレット候補値、見出し/本文のスケール感、適用イメージ）
- [ ] 実コンテンツ（実記事 building-this-blog-with-claude-code + Home / About / Career）への適用イメージで比較できる形で提示する
- [ ] 各案で本文/背景の主要組合せが WCAG AA 4.5:1 を満たせる見込みを添える（PHASE1C-002 の前提。満たせない案は提示しない）
- [ ] 運営者が 1 案を選定（修正指示込み）し、確定内容を `docs/design-direction.md` に記録（PHASE1C-002/003/004 の入力にする）
- [ ] site-plan §6.5 と矛盾する決定が出た場合は site-plan を同コミットで更新
- [x] ローカル スクショ確認（desktop + mobile）：N/A（理由: デザイン方向性の決定・記録のみでコード変更なし）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：N/A（理由: 同上）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：N/A（理由: docs のみ変更で frontend 非変更）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1（草案提示 → 運営者選定。選定待ちは実装フェーズ外）
- 草案作成は ClaudeDesign（site-plan Decision #15）を想定。利用できない場合は HTML モック + MCP Playwright スクショで代替し、その旨を実装ログに記録
- Plan B パレットの役割構成（primary=空色 / accent=朝日・羽色 / secondary=草原 / earth / neutral）は Decision #14 で確定済み。本 PBI は色相の骨格を維持したまま、明度・彩度・具体値とタイポ・トーンを確定する
- 現行仮値の所在: `src/styles/global.css`（`--color-hibari-*` 7 個 + セマンティックトークン。PHASE1A-022 申し送り「仮 HEX の所在一覧」参照）

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。draft-phase1c-design-polish.md A 項の起点
- PHASE1C-004（ロゴ）は本 PBI の完了を待たず並行着手可（最終色のみ本 PBI / 002 の確定値に合わせる）

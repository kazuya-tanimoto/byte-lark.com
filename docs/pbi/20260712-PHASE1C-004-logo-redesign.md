# 訪問者はヒバリ意匠 + ブランドカラーを反映した新ロゴを Header で見られる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- ヒバリ意匠とブランドカラーを反映した新ロゴが Header に表示されたサイトを閲覧できる

## なんのために
- 現行はヒバリ意匠のないテキストロゴ（`src/assets/logo.png`）、旧 ChatGPT 案 2 種はモノトーンでブランド色が乗らない。ClaudeDesign で新規作成する（Decision #15）
- 関連: site-plan.md §6.5.4 / §8 Decision #15 #28 / R-06 / Q11 / Phase 1c 先行トラック

## 受け入れ条件
- [ ] 最初のラウンド前に、ロゴの合格条件チェックリストを運営者と確定する（Q11。例: ヒバリ意匠 / ブランドカラー / 小サイズ視認性 / モノクロ耐性）
- [ ] ClaudeDesign で草案提示 → 運営者フィードバックの反復。**上限 5 ラウンド**（Decision #15）、各ラウンドの提示内容と判断を実装ログに記録
- [ ] 確定ロゴを SVG で `src/assets/` に配置し、Header の現行 logo.png 参照を置換。表示サイズ・retina で確認
- [ ] 5 ラウンドで未確定の場合は R-06 に従い「現行ロゴのまま Phase 1d 公開を先行」を運営者が明示判断し、その記録をもって本 PBI を Done とする（ロゴ検討の継続は別 PBI を起票）
- [ ] `yarn build` / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。R-06 発動で UI 変更なしの場合は `[x] N/A（R-06 発動・置換なし）` に書き換え）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。同上）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。同上）

## 技術メモ
- 想定セッション数: 1（Claude 側の作業として。運営者フィードバック反復の待ち時間は実装フェーズ外、ラウンドごとの再作業は軽量）
- PHASE1C-001 と並行着手可：ブランドカラー確定前は意匠（フォルム）の探索を先行し、最終色は 001/002 の確定値で仕上げる
- インプット: ブランドコンセプト（§6.5.1）/ カラーパレット（§6.5.2 → 001 確定値）/ 旧 ChatGPT 案 2 種 / サイト全体のデザイントーン（001）
- favicon への意匠展開は PHASE1C-005 で実施（本 PBI のスコープ外）

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。反復リードタイムが最長のため早期着手が R-06（1c 長期化）の緩和になる（Decision #28 理由欄）

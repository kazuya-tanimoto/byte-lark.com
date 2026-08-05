# 運営者は公開記事 3 本を含む全ページで確定デザインが意図どおり表示されていることを確認できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- 公開状態の初期記事セット 3 本（PHASE1B-008 / 009 / 012）と全ページを確定デザイン「春空」で最終再検証し、崩れの修正と Phase 1b / 1c 先行トラックからの未消化の裏取り 4 件を解消した状態にできる

## なんのために
- 先行トラックのデザイン確定（PHASE1C-001〜008）は公開記事 0 件の時期に実施したため、実記事での最終確認が未了。公開（Phase 1d）前に全記事セットでデザインを検証し切るため
- 関連: site-plan.md §6.5（デザインシステム）/ NFR-02 / Phase 1c、draft-phase1c-design-polish.md §C、PHASE1B-014「Phase 1c への申し送り」

## 受け入れ条件
- [ ] 全 3 記事（PHASE1B-008 / 009 / 012）を branch alias の PC / スマホ幅で実表示確認：タイポスケール・影カード・朝日マーカー・カバー画像・追従目次（PHASE1C-009）が意図どおり
- [ ] `text-wrap` 修正（bab886d、balance + auto-phrase の Chrome/Edge 限定化）の全 3 記事での見出し折り返し確認。Chromium 側は Claude がスクショで、iPhone Safari（別エンジン。素の右端折り返しになること）は運営者が実機で確認（PHASE1B-014 申し送り：PHASE1C-003 Done 後の修正のため全記事・別エンジン確認が必要）
- [ ] `bash scripts/lighthouse-audit.sh` を branch alias で実行し、`/blog/` と記事ページの heading-order pass を裏取り（PHASE1C-006 申し送り。当時は公開記事 0 件でローカル preview 計測のみだった）
- [ ] 記事ページの署名要素（h2 朝日ドット・影カード・ピル等）の見え方を branch alias で裏取り（PHASE1C-008 申し送り。同じく公開記事 0 件で未実施だった）
- [ ] `/career/` の雇用形態バッジ色（PHASE1B-002 の暫定色：フリーランス=hibari-sky / 会社員=neutral / 副業=hibari-amber）が確定トークン「春空」の下で意図どおりかを確認し、ずれていれば確定トークンに合わせて修正（PHASE1B-014 申し送り）
- [ ] 発見した崩れ・微調整は本 PBI 内で修正する。1 セッションに収まらない規模の場合は修正せず、別 PBI 起票を運営者に提案する
- [ ] 修正が入った場合、`yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。修正が入らず検証のみの場合は branch alias 確認をもって `[x] …：N/A（理由）` 可）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。修正 push が無い場合は HEAD の CI green 確認で可）

## 技術メモ
- 想定セッション数: 1
- 検証 URL（branch alias、feat/phase-1 固定）: `https://feat-phase-1-byte-lark.tanimoto-a49.workers.dev`
- `scripts/lighthouse-audit.sh` は運営者ターミナルで実行（npx lighthouse 直接は不可視プロンプトでハングする既知の罠）
- 外部 CDN（cdn.jsdelivr.net）由来の画像はコンテナ発スクショでは壊れて写り検証できない。該当確認（Skills アイコン等）は母艦ブラウザで行う（PHASE1C-008 の学び）
- CF preview 確認の前に check-runs の `Workers Builds: byte-lark` の有無で CF ビルドが走ったかを機械判別する（push 取りこぼし検知。PHASE1C-008 の学び）
- 順序: PHASE1C-010（CSS 削減）の後に実施する（CSS 変更が表示に影響し得るため、再検証は削減後の状態で行う）
- 触ってはいけない領域: 記事本文の文面（Done 済み。直すのは見た目のみ）、OGP / JSON-LD（PHASE1A-007）

## 備考
- draft-phase1c-design-polish.md §C の 2 項目め（仕上げトラック）の正式化。PHASE1B-014「最終再検証 PBI に入れる素材」4 件（text-wrap / heading-order / 署名要素 / バッジ色）をすべて受け入れ条件化
- Lighthouse Performance / SEO の正式判定は本 PBI では行わない（Phase 1d 本番ドメイン。branch alias は X-Robots-Tag: noindex 強制）

## 実装ログ（着手後に追記、中断時は必須）

# 訪問者は /blog 一覧で見出し階層が正しい（h1→h2）記事カードを閲覧できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- スクリーンリーダー・アウトライン上も正しい見出し階層で Blog 一覧を辿れる（h1「Blog」直下のカードタイトルが h2 になる）

## なんのために
- `/blog/` が h1 → h3（カードタイトル）と h2 を飛ばし、Lighthouse `heading-order` 監査が失敗している（A11y 94 で 90+ は維持、axe の critical/serious では未検出。PHASE1A-020 で確認）
- 関連: site-plan.md NFR-02 / §6.5.2 a11y 追跡 追加（PHASE1A-020 起点）/ §8 Decision #28 / draft-phase1c-design-polish.md B-1 / Phase 1c 先行トラック

## 受け入れ条件
- [ ] `src/components/BlogCard.astro` に見出しレベルの prop を追加（例: `headingLevel: "h2" | "h3"`、既定は現行互換の h3。現状 line 43 で h3 固定）
- [ ] `/blog/`（h1 直下）ではカードタイトルが h2 で出力される
- [ ] Home の Blog セクション（h2「Blog」配下）では h3 のまま（リグレッションなし）
- [ ] Lighthouse `heading-order` 監査が `/blog/` で pass、Accessibility 90+ 維持
- [ ] E2E（`tests/e2e/` の a11y チェック含む）green
- [ ] `yarn build` / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 依存: なし（デザイン確定と独立。任意タイミングで着手可）
- 見た目のサイズはタグと独立に保つ（h2 化で視覚スタイルが変わらないようクラス側で吸収）

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。draft-phase1c-design-polish.md B-1（出典: PHASE1A-020 実装ログ）

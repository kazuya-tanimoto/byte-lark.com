# 訪問者は低速回線でも本文のレイアウトずれ（CLS）なくページを読める

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- 低速回線・低速 CPU 環境でも、フォント読み込みによる本文のガタつき（reflow）なしにページを読める

## なんのために
- Lighthouse モバイル（throttle 模擬）で /about のみ CLS 0.229（他ページは 0、非 throttle では 0.001）。低速回線でフォントが後から差し替わり、本文量の多い about で文字位置がずれる FOUT 由来の reflow と推定（PHASE1A-020）。NFR-11（CLS < 0.1）の充足
- 関連: site-plan.md NFR-11 / §8 Decision #24 #28 / draft-phase1c-design-polish.md B-2 / Phase 1c 先行トラック

## 受け入れ条件
- [ ] フォント読み込み戦略を公式ドキュメント根拠付きで選定・実装（候補: preload / `font-display` 調整 / `size-adjust` + fallback metrics 等。採用・棄却理由を実装ログに記録）
- [ ] Lighthouse モバイル（throttling あり）で `/about` の CLS < 0.1 を確認（現状 0.229）
- [ ] 他ページ（Home / Blog 記事詳細）で CLS の悪化がない
- [ ] Performance スコアに著しい悪化がない（branch alias 計測はノイズありのため参考値として記録。正式判定は Phase 1d 本番ドメイン）
- [ ] `yarn build` / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 依存: なし（デザイン確定と独立。ただし PHASE1C-003 でフォント構成が変わる場合は先に 003 の結論を確認）
- フォント実体: @fontsource-variable/geist + @fontsource-variable/noto-sans-jp（`src/styles/global.css` で @import、セルフホスト。Decision #24）。Noto Sans JP variable は容量が大きく、preload 対象 woff2 の選定（サブセット / unicode-range）に注意
- 計測は MCP Playwright + Lighthouse（throttle 条件を PHASE1A-020 実装ログと揃えて比較可能にする）

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。draft-phase1c-design-polish.md B-2（出典: PHASE1A-020 実装ログ）

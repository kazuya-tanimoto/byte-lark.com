# 訪問者は未使用スタイルを含まない軽量な CSS でページを表示できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- 全ページ共通の外部 CSS（`/_astro/BaseLayout.*.css`、現状 生 131KB / brotli 後 ~10KB）から未使用・重複分が削られ、描画前に読み込むスタイルが小さくなる

## なんのために
- Lighthouse の render-blocking 系監査の指摘に対応し、NFR-07（Performance 90+）の Phase 1d 本番計測に向けて CSS 出力を整えるため（正式判定は Phase 1d 本番ドメイン。branch alias は noindex 強制・キャッシュ条件も本番と異なる）
- 関連: site-plan.md NFR-07 / Phase 1c、draft-phase1c-design-polish.md §B-3（PHASE1A-020 実装ログ起点）

## 受け入れ条件
- [ ] 現状計測：ビルド成果物 `dist/_astro/BaseLayout.*.css` の生 / brotli 圧縮後サイズと内訳（Tailwind ユーティリティ / Shiki コードハイライト / フォント関連 / global.css 手書き分の占有割合）を計測し、実装ログに記録
- [ ] 未使用・重複スタイルの削減を実施し、生サイズの before / after を実装ログに記録（critical CSS インライン化には踏み込まない。到達目標「未使用分の削減まで」は運営者確定 2026-08-06）
- [ ] 内訳計測の結果、削減余地が小さいと判明した場合：その根拠を実装ログに記録し、削減なしで完了してよい（表示品質を犠牲にしてまで削らない）
- [ ] 削減後、全 8 ページ + 公開記事 3 本で表示崩れがないことをスクショで確認（削減の副作用検出）
- [ ] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 関連ファイル: `src/styles/global.css`（トークン・手書きスタイル）、ビルド成果物 `dist/_astro/BaseLayout.*.css`
- Tailwind v4（`@tailwindcss/vite`）は使用クラスのみ出力するため、未使用ユーティリティの大量残留は考えにくい。生 131KB の主要因候補は Shiki のインラインテーマ・フォント関連・手書き CSS。まず内訳を計測してから削減対象を決める（Don't Guess。着手時の前提確認 README §5.3）
- Lighthouse を流す場合は `scripts/lighthouse-audit.sh`（運営者ターミナル実行。npx lighthouse 直接は不可視プロンプトでハングする既知の罠）
- 触ってはいけない領域: 確定デザイントークンの値そのもの（PHASE1C-002 / 003 で確定済み）、記事本文

## 備考
- draft-phase1c-design-polish.md §C の 1 項目め（仕上げトラック）の正式化。PHASE1B-014「Phase 1c への申し送り」の正式化指示に基づく
- 到達目標は起票セッション（2026-08-06）で運営者が「未使用分の削減まで」を選定。critical CSS は brotli 後 ~10KB の転送実害に対して保守コストが見合わないため見送り、Phase 1d の本番計測で問題が出た場合に追加対応を検討する

## 実装ログ（着手後に追記、中断時は必須）

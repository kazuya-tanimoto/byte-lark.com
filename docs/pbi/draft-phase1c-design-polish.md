# 【ドラフト】Phase 1c デザインブラッシュアップ + 品質仕上げ

Status: Draft（番号なし。**先行トラック分は 2026-07-12 に PHASE1C-001〜007 として正式化済み**（site-plan v3.10 Decision #28）。本ファイルは残る**仕上げトラック**の anchor として保持し、Phase 1b Gate（PHASE1B-014）通過後の起票セッションで正式化する）
作成: 2026-06-14（PHASE1A-020 の Lighthouse/CWV 計測で出た品質仕上げ項目を、1c で確実にフォローするため anchor 化）

## このドラフトの役割

Phase 1c（デザイン確定）で対応すべき項目を、散らばらないよう 1 か所に集約する。site-plan に既出のデザイン項目への参照 + PHASE1A-020 で新たに判明した品質項目を載せる。1c 起票セッションはこのファイルと site-plan §6.5 / §6.5.2 を必ず読むこと。

## 1c 着手条件（二段構え。site-plan v3.10 Decision #28）

### 先行トラック（記事非依存。PHASE1C-001〜007 として起票済み）
- [x] Phase 1a Gate（PHASE1A-022）通過
- [x] 全ページの実データ・文面が運営者承認済み（PHASE1B-001〜005）+ 実記事 1 本以上が repo に存在（PHASE1B-008 ドラフト）

### 仕上げトラック（B-3 / 全記事最終再検証 / 1c Gate。未起票）
- [ ] Phase 1b（コンテンツ整備）完了 + Phase 1b Gate（PHASE1B-014）通過（Gate の申し送りを起票に反映する）

## A. site-plan に既出のデザイン確定項目（再掲・参照のみ）→ すべて先行トラックで起票済み
- 仮 HEX → 確定 HEX 置換（site-plan §6.5.2）→ **PHASE1C-002**（デザイン方向性は PHASE1C-001 で先に確定）
- **color-contrast 再有効化**：確定 HEX で AA 4.5:1 を満たす値を選定し、`tests/e2e/a11y.spec.ts` の `disableRules(["color-contrast"])` 除外を解除（site-plan §6.5.2 a11y 追跡 / PHASE1A-019 起点）。Lighthouse でも color-contrast が全ページで唯一の A11y 失敗監査（PHASE1A-020 で確認）→ **PHASE1C-002**
- タイポスケール・行間・和欧混植の確定（site-plan §6.5、TODO 化済み）→ **PHASE1C-003**（全記事セットでの最終再検証は仕上げトラック）
- ロゴ刷新：ClaudeDesign でヒバリ意匠 + ブランドカラー、反復上限 5 ラウンド（site-plan Decision #15 / R-06 / Q11）→ **PHASE1C-004**

## B. PHASE1A-020 で新たに判明した品質仕上げ項目（1c で対応）

トラック区分：B-1 → **PHASE1C-006**（先行）、B-2 → **PHASE1C-007**（先行）、B-3 → **仕上げトラック（未起票。確定デザイン後が前提）**、B-4 → **PHASE1C-005**（先行、ロゴ・確定カラー依存）。

### B-1. blog 一覧の見出しレベル飛び（a11y / 確実に直す）
- 事象: `/blog/` が h1「Blog」→ h3（記事カードタイトル）と h2 を飛ばす。Lighthouse `heading-order` 失敗（A11y スコアは 94 で 90+ は維持。critical/serious ではないため 019 の axe では未検出）。
- 原因: `BlogCard` のタイトルが固定 h3。home では「Blog」セクション見出し（h2）配下で h3 が正しいが、blog 一覧では h1 直下なので h2 であるべき。
- 対応案: `BlogCard` に見出しレベルの prop を追加し、文脈ごとに h2/h3 を出し分ける。
- 出典: PHASE1A-020 実装ログ。

### B-2. about の低速時 CLS（フォント読み込み / 性能）
- 事象: Lighthouse モバイル（低速回線・低速CPU模擬）で about のみ CLS 0.229（他ページは 0）。通常計測（MCP Playwright・非throttle）では about も 0.001。
- 推定原因: 低速回線でフォントが後から差し替わり、本文が一番多い about で文字位置がずれる（FOUT 由来の reflow）。実ユーザーの低速回線で起きうる。
- 対応案: フォント読み込み戦略（preload / `font-display: optional` / `size-adjust` 等）。確定 HEX/タイポ確定と同じく 1c のデザイン実装で対応。
- 出典: PHASE1A-020 実装ログ。

### B-3. 描画前 CSS のサイズ・描画ブロック（性能）
- 事象: 全ページが単一の外部 CSS `/_astro/BaseLayout.*.css`（生 131KB / brotli 圧縮後 ~10KB）を描画前に読み込む。Lighthouse の render-blocking 系監査が指摘。
- 評価: 圧縮後 ~10KB で転送は軽く、Performance 低スコアの主因は計測ノイズ（同一構成ページで FCP が 2.2〜6.6s とばらつき、home は 95）。ただし生 131KB は Tailwind 出力としてやや大きく、確定デザインで未使用ユーティリティを削れる余地あり。
- 対応案: 確定デザイン後に CSS 出力を見直す（必要なら critical CSS インライン化検討）。Performance の正式判定は Phase 1d（本番ドメイン + 本番キャッシュ + 安定計測）で行う。
- 出典: PHASE1A-020 実装ログ。

### B-4. favicon 意匠の確定
- 現状: Phase 1a で暫定 favicon（sky ブルー角丸 + 白 "b"）を `public/favicon.svg` に追加済み（PHASE1A-020）。
- 対応: 確定ブランドカラー / ロゴに合わせて差し替え。apple-touch-icon / 各サイズ展開もここで検討。

## C. 仕上げトラック（1b Gate 通過後に起票する残項目）

- B-3 CSS サイズ・描画ブロック見直し（確定デザイン後に未使用ユーティリティ削減、必要なら critical CSS 検討）
- 全初期記事セット（PHASE1B-008〜013）公開状態でのデザイン最終再検証・微調整（1b Gate PHASE1B-014 の申し送り「タイポ / カード設計 / 見出しレベルの課題」を反映）
- Phase 1c Retrospective Gate（1d 移行前の必須ゲート）

## 受け入れ条件（正式化時に精査）

（正式 PBI 化のとき、上記を個別 PBI に分解し、各 PBI に CLAUDE.md §7 検証ゲート 3 項目を受け入れ条件として常設する。README §4.6 ルール 7。先行トラック分は PHASE1C-001〜007 で実施済み）

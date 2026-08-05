# 訪問者は未使用スタイルを含まない軽量な CSS でページを表示できる

Status: Done
Started: 2026-08-06
Completed: 2026-08-06

## 誰が
- 訪問者

## 何をできる
- 全ページ共通の外部 CSS（`/_astro/BaseLayout.*.css`、現状 生 131KB / brotli 後 ~10KB）から未使用・重複分が削られ、描画前に読み込むスタイルが小さくなる

## なんのために
- Lighthouse の render-blocking 系監査の指摘に対応し、NFR-07（Performance 90+）の Phase 1d 本番計測に向けて CSS 出力を整えるため（正式判定は Phase 1d 本番ドメイン。branch alias は noindex 強制・キャッシュ条件も本番と異なる）
- 関連: site-plan.md NFR-07 / Phase 1c、draft-phase1c-design-polish.md §B-3（PHASE1A-020 実装ログ起点）

## 受け入れ条件
- [x] 現状計測：ビルド成果物 `dist/_astro/BaseLayout.*.css` の生 / brotli 圧縮後サイズと内訳（Tailwind ユーティリティ / Shiki コードハイライト / フォント関連 / global.css 手書き分の占有割合）を計測し、実装ログに記録
- [x] 未使用・重複スタイルの削減を実施し、生サイズの before / after を実装ログに記録（critical CSS インライン化には踏み込まない。到達目標「未使用分の削減まで」は運営者確定 2026-08-06）
- [x] 内訳計測の結果、削減余地が小さいと判明した場合：その根拠を実装ログに記録し、削減なしで完了してよい（表示品質を犠牲にしてまで削らない）→ 削減余地ありと判定し 2 件実施（実装ログ参照）
- [x] 削減後、全 8 ページ + 公開記事 3 本で表示崩れがないことをスクショで確認（削減の副作用検出）
- [x] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` エラーなし
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

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

### 2026-08-06 現状計測 + 削減 2 件 + ローカル検証（push 前まで）

やったこと：

1. 現状計測（削減前）
   - `dist/_astro/BaseLayout.*.css`：生 37,586 B / brotli 6,218 B。起票時記載の「生 131KB」は PHASE1A-020（2026-06-14）時点の数字で、その後のフォント読み込み方式変更（PHASE1C-003/007：Astro Fonts API 化）等で既に大きく縮んでいた
   - 内訳（brace カウントで top-level ブロックを実測）：
     - `@layer utilities` 22,347 B（59.5%）＝使用中 Tailwind ユーティリティ
     - `@layer base` 4,054 B（10.8%）＝preflight + 手書き base
     - `@layer properties` + `@property` 群 約 7,110 B（18.9%）＝Tailwind 内部のカスタムプロパティ登録
     - `:root` + `.dark` 2,398 B（6.4%）＝「春空」セマンティックトークン（light + dark）
     - `@layer theme` 1,339 B（3.6%）、`@layer components` 337 B（0.9%）
     - Shiki 0 B（インライン style 属性方式のため HTML 側）、フォント 0 B（Astro Fonts API が各ページ `<head>` にインライン展開）
2. 削減 1：`tw-animate-css` の import を削除
   - `animate-*` 系クラスの使用は src 全体で 0 件、アニメーション依存の shadcn/ui コンポーネントも不使用（使用は button.tsx のみ）を確認してから削除
   - 生 37,586 → 35,918 B（−1,668）、brotli 6,218 → 6,030 B
3. 削減 2：Tailwind のクラス走査を `source("../")` で src/ 配下に限定
   - 既定の自動検出が repo 全体を走査し、docs/ のモック HTML や文書中の英単語（`table` / `static` / `contents` / `backdrop-filter` / `border-collapse` / `leading-snug` / `lowercase` 等 8 クラス）をクラス候補と誤認して出力していた
   - 生 35,918 → 32,955 B（−2,963）、brotli 6,030 → 5,698 B。副次効果として docs 編集で CSS 出力が揺れなくなる（決定性向上）
   - 合計：生 −4,631 B（−12.3%）、brotli −520 B（−8.4%）
4. 副作用検証（機械照合）
   - ビルド済み全 HTML の class 属性 236 種を CSS 定義と突合 → 実害なし（未定義に見えた 8 件は HTML エンティティ差の arbitrary variant 4 件＝CSS に存在確認済み、CSS 定義を持たないフック用クラス `astro-code` / `github-light` / `line` / `group/button` ＝元から CSS 側に規則なし）
5. 副作用検証（目視）：`yarn preview` + MCP Playwright で全 8 ページ + 記事 3 本 × desktop 1280px / mobile 375px の 22 スクショを確認、崩れなし（Home mobile のカバー画像白抜けは lazy-load タイミングで、blog 一覧 mobile では正常表示を確認）
6. `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` 全 green

判断メモ：

- `.dark` トークンブロック（1,179 B）は画面到達不能だが削除しない：PHASE1C-002 の確定値（design-direction §2 ダークモード確定値）で、将来のダークモード PBI の前提。トークン値は「触ってはいけない領域」
- critical CSS インライン化は運営者確定どおり見送り
- 観測事実（スコープ外・申し送り）：各ページ `<head>` に Astro Fonts API のインライン @font-face が約 283KB（366 ブロック、サブセット分割）あり、HTML が全ページ約 300KB。PHASE1C-003/007 の確定方式のため本 PBI では触らず。Phase 1d 本番計測で問題になった場合の調査候補

残タスク：commit / push → CF preview スクショ確認 → CI green 確認 → Done 化

### 2026-08-06 push 後検証 + Done 化

- 7020252 を push、CI 全 green（Quality Checks / UI Tests(e2e) / Workers Builds: byte-lark / CodeQL いずれも success）
- CF branch alias の配信 CSS がローカルビルドと同一（`BaseLayout.4U1bWvU2.css`、32,955 B、brotli 転送 6,702 B）であることを curl で実測
- CF preview スクショ確認：Home（desktop / mobile）+ T2 記事（desktop）+ L1 記事（mobile）、崩れなし
- 学び：起票時の「生 131KB」のような過去計測値は着手時に必ず再計測する（フォント方式変更で 3.5 分の 1 になっていた）。Tailwind v4 の既定ソース走査は repo 全体が対象で、docs のモックや文章中の英単語がクラスとして混入し得る → `source("../")` で恒久固定した

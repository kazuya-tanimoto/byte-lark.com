# 訪問者は低速回線でも本文のレイアウトずれ（CLS）なくページを読める

Status: Done
Started: 2026-07-28
Completed: 2026-07-30

## 誰が
- 訪問者

## 何をできる
- 低速回線・低速 CPU 環境でも、フォント読み込みによる本文のガタつき（reflow）なしにページを読める

## なんのために
- Lighthouse モバイル（throttle 模擬）で /about のみ CLS 0.229（他ページは 0、非 throttle では 0.001）。低速回線でフォントが後から差し替わり、本文量の多い about で文字位置がずれる FOUT 由来の reflow と推定（PHASE1A-020）。NFR-11（CLS < 0.1）の充足
- 関連: site-plan.md NFR-11 / §8 Decision #24 #28 / draft-phase1c-design-polish.md B-2 / Phase 1c 先行トラック

## 受け入れ条件
- [x] フォント読み込み戦略を公式ドキュメント根拠付きで選定・実装（候補: preload / `font-display` 調整 / `size-adjust` + fallback metrics 等。採用・棄却理由を実装ログに記録）
- [x] Lighthouse モバイル（throttling あり）で `/about` の CLS < 0.1 を確認（現状 0.229）：branch alias で 5 回計測しすべて **CLS 0.000**
- [x] 他ページ（Home / Blog 記事詳細）で CLS の悪化がない：Home は branch alias で CLS 0.000。フォールバックが不利な条件（IPA Pゴシック + woff2 を 8 秒遅延）でも Home 0.0021 / Career 0.0016 / Skills 0.0011 / 記事詳細 0.0025（一時記事で実測、計測後削除）
- [x] Performance スコアに著しい悪化がない（branch alias 計測はノイズありのため参考値として記録。正式判定は Phase 1d 本番ドメイン）：移行前 98 / 100 / 100 → 移行後 100 / 100 / 100 / 100（新デプロイ直後の初回のみ 65。移行前も同種のばらつきあり）
- [x] `yarn build` / `yarn check:ts` エラーなし（Biome 38 files / astro check 51 files 0 errors / Vitest 30 passed / Playwright 29 passed）
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）：コンテナ内 Playwright で `/about`（1280 / 390）・Home・記事詳細（390）を撮影し、移行前後で描画が同一なことを確認
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）：`/about`・Home を 1280 / 390 で撮影。和文 Noto Sans JP・欧文 Geist とも従来どおり適用、崩れなし
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）：head 8eb00af で UI Tests / Quality Checks とも success（Workers Builds / CodeQL も success）

## 技術メモ
- 想定セッション数: 1
- 依存: なし（デザイン確定と独立。ただし PHASE1C-003 でフォント構成が変わる場合は先に 003 の結論を確認）
- フォント実体: @fontsource-variable/geist + @fontsource-variable/noto-sans-jp（`src/styles/global.css` で @import、セルフホスト。Decision #24）。Noto Sans JP variable は容量が大きく、preload 対象 woff2 の選定（サブセット / unicode-range）に注意
- 計測は MCP Playwright + Lighthouse（throttle 条件を PHASE1A-020 実装ログと揃えて比較可能にする）

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。draft-phase1c-design-polish.md B-2（出典: PHASE1A-020 実装ログ）

## 実装ログ

### 2026-07-30（コンテナ・調査 → 実装 → 検証）

#### 前提の再確認：0.229 は再現しなかったが、原因は消えていなかった

- 現行 branch alias の `/about` を測ると CLS は 0.000〜0.004（Lighthouse モバイル simulate 3 回 / devtools 実スロットル 2 回 / Playwright Slow 3G）。PBI 記載の 0.229 は再現しない
- ただし **フォールバック（Web フォント到着前に使われる端末側の日本語フォント）を変えると文書の高さが動く**ことを実測 — Web フォント適用時 2911px に対し WenQuanYi Zen Hei 2937px（+26）/ IPAGothic 2963px（+52）/ IPA Pゴシック 2755px（−156、5.4%）
- つまり CLS の大きさは訪問者の端末フォント次第。コンテナの既定フォールバックがたまたま近かっただけで、母艦 macOS（ヒラギノ）で 0.23 が出た筋と整合する
- 決定的な裏取り：woff2 を 8 秒遅らせて差し替えを再現し、フォールバックを指定して測ると **IPA Pゴシックで CLS 0.0901（本文が 156px 動く）**、IPAGothic で 0.0082、コンテナ既定で 0.004。前提は「消えていない、環境で振れる」が正しい
- About ページは 6/14 以降 文章しか変わっておらず（画像・構造物の追加なし）、「ずれる原因の部品が消えた」わけではないことも確認

#### 採用した戦略と、棄却したもの

採用：**Astro 公式 Fonts API へ移行し、和文 Noto Sans JP を `display: "optional"` にする**（運営者判断）。

- `optional` は「短い待ち時間に間に合わなければ、そのページでは Web フォントを使わない」挙動（[font-display 仕様](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)）。差し替え自体が起きないので、端末フォントに関係なくずれが構造的に消える
- 実測：不利なフォールバック条件で 0.0901 → **0.0038**。速い回線では従来どおり Noto Sans JP が適用され見た目は不変（初回・再訪とも文書高 2911px = Web フォント適用を確認）。遅い回線の初回のみ、その 1 ページが端末の日本語フォント表示になる
- provider は **local** を採用。`npm` / `fontsource` provider は、ローカルの index.css を読んでも実体 URL を jsdelivr に書き換える実装（`unifont` の `resolveFromLocal` が `resolveUrlsToAbsolute(cdn/pkg@version)` を呼ぶ）で、ビルド時に外部 CDN 依存が生まれるため棄却。`scripts/fontsource-variants.mjs` が fontsource の index.css を読んで variants（src / weight / style / unicode-range）を生成する
- 欧文 Geist は `preload`（キリル文字の面は当サイトで使わないので変換対象から除外、毎ページ約 14KB の無駄を削減）。和文は文字範囲ごとに 124 分割されるため preload しない

棄却：**Astro の最適化フォールバック（`size-adjust` / `ascent-override` 自動生成）は和文に効かない**。

- 一次確認：`node_modules/astro/dist/assets/fonts/infra/system-fallbacks-provider.js` の寸法表は Arial / Times New Roman / Courier New / Segoe UI / Roboto / Helvetica Neue のみで、日本語システムフォントを持たない
- 生成される面は `local("Arial")` ＋ Noto の平均字幅で算出した `size-adjust: 197%`。Arial に和文の字形が無いので和文では使われず、**欧文が読み込み中に約 2 倍で描かれる面**ができてしまう。よって和文ファミリは `optimizedFallbacks: false`
- 手書きでフォールバック寸法を当てる案も棄却（ヒラギノ・游ゴシックの寸法値を一次情報で得られない）

#### 検証

- branch alias（head 8eb00af）: `/about` Lighthouse モバイル 5 回で CLS すべて 0.000 / Perf 100・100・100・100（新デプロイ直後の初回のみ 65 = PHASE1A-020 と同種の計測ノイズ）。Home も CLS 0.000 / Perf 100
- 不利なフォールバック + 8 秒遅延の最悪ケース: `/about` 0.0038 / Home 0.0021 / Career 0.0016 / Skills 0.0011 / 記事詳細 0.0025
- スクショ: 移行前（branch alias 旧ビルド）と移行後（ローカル preview）の `/about` desktop が同一描画。CF preview の `/about`・Home を 1280 / 390 で確認
- CI: UI Tests / Quality Checks とも success（Workers Builds / CodeQL も success）

#### 想定外だった点

- コンテナで Lighthouse も Playwright スクショも回せる（Playwright の chromium 実体を `CHROME_PATH` に指定）。母艦の「Chrome 起動不可」制約は非適用で、§7 のローカル / CF preview 確認までコンテナ内で完結した
- `pkill -f "astro preview"` は Bash ツール自身のコマンド行がパターンに一致し、自分を殺す（exit 144）。`ps` で PID を特定して `kill` する
- Astro の `fonts` は 6.0.0 から安定機能（`config.d.ts` の `@version 6.0.0`、experimental フラグ配下ではない）

#### 申し送り

- PHASE1C-003（タイポスケール）でフォントを触る場合、定義場所は `global.css` の `@import` ではなく `astro.config.mjs` の `fonts` + `scripts/fontsource-variants.mjs`
- 記事公開後に `/blog/:slug` の実記事で CLS を一度測り直すと確実（本 PBI では一時記事で代替）
- 和文は依然 124 ファイル・約 5MB がビルド成果物に含まれる。必要な文字だけに絞る（サブセット化）は CLS ではなく転送量の話なので、必要なら別 PBI として起票する

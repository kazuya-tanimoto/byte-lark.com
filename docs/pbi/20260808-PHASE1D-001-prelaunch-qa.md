# 運営者は公開直前の品質状態を確認し、未決事項（ダークモード・ライセンス表記）を確定できる

Status: Done
Started: 2026-08-08
Completed: 2026-08-08

## 誰が
- 運営者

## 何をできる
- 公開（main マージ）前の品質状態を E2E / ビルド検証で確認し、ダークモード採用可否とアイコンライセンス表記の掲示要否を決定できる

## なんのために
- 公開後に手戻りする品質問題・未決事項を公開前に潰すため（draft-phase1d-domain-launch.md「公開前 QA」の正式化）
- 関連: site-plan §7 Phase 1d / PHASE1C-012「Phase 1d で先に決めるべき事項」

## 受け入れ条件
- [x] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がすべて成功（build: 11 ページ / check: 38 ファイル修正なし / check:ts: 52 ファイル 0 errors 0 warnings 0 hints / test:run: 5 ファイル 30 テスト）
- [x] E2E スイートが現行 HEAD で green（CI `ui-tests.yml`。`scripts/ci-status.sh` で確認）（HEAD 85edb0b で `UI Tests: completed/success`）
- [x] ダークモード実表示確認：全主要ページ（トップ / 経歴 / スキル / About / Contact / ブログ一覧 / 記事）に `.dark` クラスを強制付与し、デスクトップ + モバイル幅でスクショ取得 → 運営者が採用可否を判断（`/privacy/` と 404 を足した全 11 ページ × 2 幅 × ライト/ダークで 44 枚。運営者判断は「見送り」）
- [x] ダークモード判断の後続処理を記録：採用なら切り替え UI 等の対応 PBI を起票、見送りなら関連申し送り 3 件（`.dark` トークン実表示 / currentColor アセット / favicon の sky 固定）を次 Phase への申し送りとして整理（見送り確定。3 件は「次 Phase への申し送り」節に整理し、PHASE1C-012 に事後追記で扱いを訂正）
- [x] アイコンライセンス表記（`public/icons/LICENSE.txt`。現状ページから辿れない）のサイト掲示要否を運営者判断。掲示するなら対応（軽微なら本 PBI 内で実装、大きければ起票）（掲示する判断。Footer の Links 列に 1 行追加して本 PBI 内で実装）
- [x] `astro.config.mjs` の `site` 設定と robots.txt / sitemap の出力が本番ドメイン（https://byte-lark.com）前提で正しいことを確認（公開直後のクロール品質がインデックス初期評価になる）（`site` = `https://byte-lark.com` / robots.txt の Sitemap 行・sitemap の 10 URL・canonical すべて本番オリジン / `dist` 配下に `workers.dev` 混入なし）
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。ダークモード検証と併せて実施）（1280 幅と 390 幅。Footer の新リンクも両幅で確認）
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。本 PBI でコード変更が無ければ `[x] N/A（確認のみ）` に更新）（Footer 変更があるため実検証。desktop / mobile とも 200、「アイコン出典」リンクの href が `/icons/LICENSE.txt`、リンク先も 200 text/plain 2562B）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）（HEAD 85edb0b で UI Tests / Quality Checks / Workers Builds / CodeQL すべて success）

## 決定事項（2026-08-08）

### ダークモードは見送り

実表示を確認した結果、`.dark` を付けても直らない破綻が 4 系統あり、公開前に収まる分量ではないため見送る。全 11 ページ × デスクトップ / モバイル × ライト / ダークの 44 枚を撮って判断した。

計測値（ダーク適用時、AA 基準は本文 4.5:1）：

| 箇所 | 前景 / 背景 | コントラスト |
|---|---|---|
| ヘッダー現在地ナビ | `#075985` / `#24292b` | 1.95:1 |
| 記事本文リンク | `#0173b0` / `#1d1a17` | 3.37:1 |
| 記事の Tech チップ | `#075985` / チップ面 | 1.95:1 |
| カード面 vs ページ地 | `#262320` / `#1d1a17` | 1.11:1 |

破綻の内訳：

1. コードブロックが白いまま。Shiki が `background-color:#ffffff;color:#1f2328` を `style` 属性に焼き込むため CSS で上書きできない。暗いページに白い板が乗る。直すには `astro.config.mjs` の `shikiConfig` を `themes: { light, dark }` + `defaultColor: false` に変える必要がある
2. ブランド色 `--color-hibari-*` が `@theme inline` 内にあり `.dark` で再定義されていない。Hero 上端（`Hero.astro:17`）と全ページ Footer（`Footer.astro:7`）の `hibari-wash` が明るい帯として残り、実測でも上端 `#c7ced2` / 下端 `#dbe3e8` と地の `#1d1a17` から浮く。現在地ナビ・本文リンク・チップの低コントラストも同じ原因
3. `--shadow-card` も `@theme inline` 側で、暖色 6% の影は暗背景で消える。カードは罫線を使わない設計のため輪郭が 1.11:1 の明度差だけになる
4. Skills アイコン 34 件は `<img>` 参照の外部 SVG で `currentColor` に追随しない。ShellScript / SQL / Flask / Oracle / Struts など暗色が焼き込まれたものが暗いカード上で沈む

採用するには Shiki のデュアルテーマ化・ブランド色のダーク値定義・アイコン差し替え・切り替え UI が一式必要で、公開を止めてまでやる規模ではないと判断した。

### 関連 3 件は次 Phase へ申し送り

`.dark` トークン実表示 / currentColor アセット / favicon の sky 固定の 3 件は破棄せず次 Phase へ送る。PHASE1C-012 棚卸し表は「やらないと決めた時点で破棄」と書いていたが、上記の計測値と原因分析を残しておけば再着手時に調査をやり直さずに済むため、申し送りに倒した（PHASE1C-012 に事後追記で明記）。

### アイコンライセンス表記は掲示する

`public/icons/LICENSE.txt` は Devicon 24 件・Tabler 1 件が MIT で、著作権表示と許諾文の同梱義務がある。ファイル自体は配信されているがサイト内から辿れなかったため、Footer の Links 列に「アイコン出典」を 1 行追加して `/icons/LICENSE.txt` へリンクした（`Footer.astro`）。既存リンクと同じクラスを使い、新規スタイルは追加していない。

## 技術メモ
- 想定セッション数: 1
- `.dark` 付与は MCP Playwright の evaluate で `document.documentElement.classList.add('dark')`。トークンは PHASE1C-002、アイコン・ロゴの色設計は PHASE1C-004 / 005
- dev server はサンドボックスで watch が死ぬため、編集した場合は再起動してから検証
- Lighthouse Performance / SEO はここでは判定しない（本番ドメイン接続後、PHASE1D-004）

## 備考
- ダークモードの運営者方針（2026-08-08）：「実表示を見て使えそうなら対応、ダメそうなら申し送り」
- 着手条件（公開の門）は通過済み：Phase 1b Gate（2026-08-05）/ Phase 1c Gate（2026-08-08）/ 公開実施日は運営者対応可能（2026-08-08 確認）

## 次 Phase への申し送り

### ダークモード関連 3 件（見送りに伴う持ち越し）

再着手するなら、上表の計測値と下記の原因がそのまま出発点になる。

- `.dark` トークン実表示：トークン自体（`global.css:148-184`）は AA 想定で作られているが、`--color-hibari-*` と `--shadow-card` が `@theme inline` 側にあってダークで再定義されないため、トークンだけでは画面が成立しない
- currentColor アセット：Skills アイコン 34 件は `<img>` 参照の外部 SVG で色を継承できない。インライン SVG 化するか、ダーク用の差し替えを持つ必要がある。ロゴ（`logo.svg` / `logo-badge.svg` / `logo-bird.svg`）は `currentColor` なので追随する
- favicon の sky 固定：`public/favicon.svg` は `#0273B0` / `#FFFFFF` 直書き

### 公開作業中に見つかった、本 PBI の範囲外の項目

- `scripts/lighthouse-audit.sh:20` の `BASE` 既定値がプレビューの `workers.dev` のまま。引数なしで叩くと本番ではなくプレビューを測る（PHASE1D-004 の本番 Lighthouse で踏む）
- `.devcontainer/allowed-domains.conf` に `byte-lark.com` が無い。ドメイン切替後、コンテナ内から本番へ到達できない（PHASE1D-004 / 008 の実機確認に影響）
- `BaseLayout.astro` に `<link rel="alternate" type="application/rss+xml">` が無く、`/rss.xml` は配信されているのに HTML から辿れない
- `astro.config.mjs` の sitemap 除外フィルタが、既に存在しない `/sample-highlight/` を指したまま
- `yarn check`（Biome）の対象が `src` だけで、`worker/` `scripts/` `tests/` は未チェック
- `src/lib/jsonld.ts:20,29` がオリジンをベタ書き。値は正しいが `Astro.site` に追随しない

## 実装ログ（着手後に追記、中断時は必須）

### やったこと
- INDEX.md の Status が `NotStarted` のまま PBI 側だけ `InProgress` になっていた片側更新を是正（README §5.2）。技術メモに `想定セッション数` を追記（README §7）
- ビルド系 4 種とビルド出力の本番オリジン確認
- 全 11 ページ × デスクトップ 1280 / モバイル 390 × ライト / ダークで 44 枚のスクショを取得し、ダークモードの破綻を計測付きで記録
- Footer の Links 列に「アイコン出典」リンクを追加

### 学び・つまずき
- このコンテナには MCP Playwright が無いが、`node_modules` の Playwright で Chromium（v147）が普通に起動する。スクショは使い捨ての Node スクリプトで撮れる。ただしスクリプトを `/workspace` の外（scratchpad）に置くと `playwright` を解決できないので、リポジトリ配下（gitignore 済みの `test-results/`）に置く必要がある
- `addInitScript` で `document.documentElement.classList.add('dark')` を呼ぶと、実行時点で `documentElement` がまだ無く TypeError で init script 全体が死ぬ。クラスが付かないまま「ライトのまま」のスクショが撮れてしまう。ロード後に `page.evaluate` で付け直すのが確実
- 上の取りこぼしに気づけたのは、スクショを見た印象ではなく `getComputedStyle` の実測値を取ったから。PHASE1C-013 の「スクショ単体を根拠にしない」がそのまま効いた
- 逆に、縮小した広い範囲のスクショだけを見てコードブロックを「ダークで出ている」と誤読しかけた。等倍の狭いクロップと保存済み PNG の実ピクセル（`#ffffff`）で確定させた。判定は必ず等倍か数値で行う
- `astro check` はリポジトリ配下の `.mjs` も拾う。検証用の使い捨てスクリプトを置いたままにすると hint が増えるので、終わったら消す

### 想定外
- ダークモードの破綻はトークンの調整では届かない。Shiki がインライン style に色を焼き込む以上、`shikiConfig` をデュアルテーマにしない限りコードブロックだけは絶対に暗くならない
- 現在地ナビとチップの 1.95:1 は、事前の見積もり（1.5:1 前後）より読める値だったが AA には遠く、判断は変わらなかった

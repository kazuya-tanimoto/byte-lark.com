# 訪問者と運営者は、公開後に残っていた取りこぼし（購読導線・執筆手順・検査範囲）が塞がった状態でサイトを使える

Status: InProgress
Started: 2026-08-11

## 誰が
- 訪問者（RSS で購読したい人）
- 運営者 + Claude（記事を書き足すとき / 品質を測るとき）

## 何をできる
- ブラウザや購読ツールがページを開いただけで RSS フィードを見つけられる
- 記事を足すとき、執筆手順を読めばフォントの作り直しが要ることが分かる（CI が落ちてから気づく形をやめる）
- `bash scripts/lighthouse-audit.sh` を引数なしで叩いたとき、本番が測られる
- `yarn check` が `worker/` `scripts/` `tests/` も検査する
- サイトマップの除外設定と JSON-LD のオリジンが、実態に合った書き方になっている

## なんのために
- PHASE1D-009（Phase 1d Gate）の申し送り棚卸しで「まとめて PBI 化」と判定した 6 件（運営者決定 2026-08-10）。出所は PHASE1D-001 の「公開作業中に見つかった、本 PBI の範囲外の項目」5 件と、PHASE1D-010 の実装ログ 1 件
- 公開後の主活動は記事の書き足しで、次の機能（カテゴリ別一覧）は記事 10 本まで着手できない。その間に、小さいが確実に効くものから片づける（site-plan §8 Decision #31 ②）

## 受け入れ条件

優先順は 1 → 6。1 は記事追加のたびに効くので最優先、2 は訪問者に見える唯一の項目。

- [x] **`yarn fonts` を `docs/writing-workflow.md` に書く**。記事を足すと収録字が増えるためフォントの作り直しが要る（`yarn fonts` = build → 生成 → build）。回し忘れは CI の `yarn fonts:check` が止めるが、執筆手順に書かれていないので今は CI が落ちて初めて気づく。手順のどの段階で回すか（記事を書き終えて `draft: false` にする直前）まで明記する
- [x] **`src/layouts/BaseLayout.astro` に `<link rel="alternate" type="application/rss+xml">` を足す**。`/rss.xml` は配信されているのに HTML から辿れず、購読ツールが自動で見つけられない。`title` は `og:site_name` と揃える。全ページに入る（RSS は 1 本しかないため）
- [x] **`scripts/lighthouse-audit.sh` の `BASE` 既定値を本番（`https://byte-lark.com`）に変える**：対応済み（2026-08-10、`fix/ci-branch-triggers` で先行実施。既定値が削除済みブランチ `feat-phase-1` の alias を指して壊れていたため、CI トリガー修正と同じ PR で処置した）
- [x] **`yarn check`（Biome）の対象に `worker/` `scripts/` `tests/` を足す**。現状は `src` だけで、Worker 実装・ビルドスクリプト・E2E が素通りしている。`fix` も同じ範囲に揃える。既存ファイルに指摘が出る場合は、この PBI の中で直すか `biome.json` で除外するかを判断して記録する → 指摘は 2 件だけだったので**除外せず両方直した**（`scripts/generate-icons.mjs` の整形 1 件 = `biome check --write` で自動修正、`worker/contact.test.ts:169` の `noUnsafeOptionalChaining` 1 件 = ヘッダーを変数に受けてから検証する形に書き換え）
- [x] **`astro.config.mjs` の sitemap 除外フィルタから `/sample-highlight/` を外す**。そのページは PHASE1A-020 で削除済みで、存在しないパスを除外し続けている。除外が 1 件も要らなくなるなら `filter` ごと落とす → 除外対象が 0 件になったので `filter` ごと削除。`sitemap-0.xml` は変更前と完全一致（404 は @astrojs/sitemap が既定で除くため影響なし）
- [x] **`src/lib/jsonld.ts` のオリジンを `Astro.site` に追随させる**。`https://byte-lark.com` がベタ書きで、値そのものは正しいが設定と二重管理になっている。`AUTHOR.url` / `PUBLISHER.url` の 2 か所 → 両定数をオリジンを引数に取る関数に変え、呼び出し側（`PostLayout.astro` は既存の `siteUrl`、`about.astro` は `Astro.site?.origin`）から渡す形にした。仮想モジュール `astro:config/client` を使う案は Vitest で中身が空になり不採用（下の実装ログ参照）
- [x] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし → 2026-08-11 全成功（check は 55 ファイル・0 件、check:ts は 54 ファイル 0 errors、テスト 31 件 pass）
- [x] 出力の回帰確認：変更前の `dist/` を取っておき、RSS の `<link>` 追加と sitemap の除外解除以外に差分が出ないことを確かめる（PHASE1D-011 / 012 で使った `diff -rq` 方式）→ HTML 12 枚それぞれ **1 行だけ**（RSS の `<link rel="alternate">`）増え、非 HTML（`sitemap-0.xml` / `rss.xml` / CSS / フォント）は差分ゼロ
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）→ `yarn preview` + `scripts/capture-screenshots.mjs` で 7 ページ × 2 幅を撮影し、見た目に変化がないことを確認（変更は `<head>` 内のみ）
- [ ] CF preview スクショ確認（作業ブランチの branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `bash scripts/ci-status.sh` で UI Tests / Quality Checks が success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 関連ファイル
  - `docs/writing-workflow.md`（`yarn fonts` の位置づけ）
  - `src/layouts/BaseLayout.astro`（`<head>` に 1 行）
  - `scripts/lighthouse-audit.sh:20`（`BASE` 既定値）
  - `package.json`（`check` / `fix` の対象範囲）
  - `astro.config.mjs:14-17`（sitemap の `filter`）
  - `src/lib/jsonld.ts:20,29`（オリジン 2 か所）
- ブランチは main から切る（`fix/postlaunch-housekeeping` 等。README §10.3、site-plan Decision #31 ①）
- 触ってはいけない領域：確定デザイントークン（PHASE1C-002 / 003）、フォントのサブセット方式そのもの（PHASE1D-010。ここで触るのは手順書だけ）、`public/_headers` のキャッシュ指定（PHASE1D-010）
- `yarn check` の範囲を広げると既存ファイルで指摘が出る可能性がある。件数が多くて 1 セッションに収まらないなら、範囲拡大だけを別 PBI に切り出してよい（README §7 のサイズ判定）

## 備考
- Phase 1e の 1 本目。カテゴリ別一覧（FR-19）と記事末尾の前後記事リンクは、記事が 10 本に届いた時点で同じ Phase に追加起票する（INDEX.md Phase 1e 節）
- 出所の詳細は PHASE1D-009 の「申し送り棚卸し表」と、PHASE1D-001 の「公開作業中に見つかった、本 PBI の範囲外の項目」

## 実装ログ（着手後に追記、中断時は必須）
（未着手）

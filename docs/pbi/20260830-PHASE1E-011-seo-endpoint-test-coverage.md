# Claude は RSS・sitemap・OGP の壊れを CI で気づける

Status: NotStarted

## 誰が

- Claude（実装セッション）

## 何をできる

- `/rss.xml`・sitemap・`robots.txt`・OGP メタ・canonical・JSON-LD が壊れたら、CI の E2E が落ちて気づける
- `/credits` が 404 になったり a11y 違反を出したりしたら、CI が落ちて気づける

## なんのために

- 配信物のうち、この 4 つは今どのテストも見ていない（2026-08-30 の監査、下記「備考」）
  - `/rss.xml`（`src/pages/rss.xml.ts`）— draft 除外・日付降順・リンク組み立てのロジックを持つ
  - sitemap（`astro.config.mjs:17` の `@astrojs/sitemap`）と `public/robots.txt`
  - OGP メタ・canonical・JSON-LD が実際に `<head>` に入っているか
  - `/credits` — `tests/` に一度も出てこない（`grep -rn credits tests/` がヒットゼロ）
- 生成関数の unit（`src/lib/og.test.ts` / `src/lib/jsonld.test.ts`）はあるが、その戻り値が
  ページに届いているかは誰も見ていない。関数が正しくても呼び忘れれば検索エンジンから消える
- 壊れても画面には出ない。人が気づくのは検索順位や RSS 購読者の側で、それは遅い
- 出所: 2026-08-30 の運営者指示（monotrip.jp でテスト書き忘れが頻発した件を受けた
  byte-lark 側の点検）。同日の README v3.13 / Stop hook 改訂は「これから起票する PBI」への
  歯止めで、本 PBI は「既に空いている穴」を埋める側
- 関連 FR / NFR（site-plan §5）: **FR-17**（全ページの OGP メタを SSG 生成）/ **FR-18**（記事個別の
  OGP メタ）/ **FR-20**（`/rss.xml` 配信）/ **FR-21**（sitemap 自動生成）/ **FR-24**（記事の JSON-LD）/
  **NFR-06**（主要画面の遷移と挙動を Playwright で検証）/ **NFR-09**（OGP・SEO は SSG 生成で
  クライアント JS 非依存）。いずれも実装済みだが、E2E で見張られているのは NFR-06 の
  「画面遷移」だけで、FR-17 / 18 / 20 / 21 / 24 の成果物は無検証のまま
- 関連 Phase / PBI: site-plan Phase 1e（公開後の運用・改善、Decision #31）/
  PHASE1A-017（rss・sitemap・robots の導入元）/ PHASE1A-005（OGP）/ PHASE1A-007（JSON-LD）/
  PHASE1A-019（E2E 基盤）/ PHASE1E-004（トップの og 画像）

## 受け入れ条件

<!-- PBI 固有 -->
- [ ] `tests/e2e/seo.spec.ts` を新設し、`/rss.xml` を検証した。見るのは 4 点：200 で返る /
      `content-type` が XML / draft fixture の slug `e2e-draft-fixture` が本文に出てこない /
      公開日の新しい記事が先に並ぶ
- [ ] 同 spec で sitemap を検証した：`/sitemap-index.xml` が 200 で `/sitemap-0.xml` を指し、
      `/sitemap-0.xml` が 200 で公開記事の URL を含む
- [ ] 同 spec で `/robots.txt` を検証した：200 で返り、`Sitemap:` 行が
      `https://byte-lark.com/sitemap-index.xml` を指す
- [ ] 同 spec で OGP と canonical を検証した：トップと記事詳細で `og:title` / `og:url` /
      `og:image` / `<link rel="canonical">` が空でなく、`og:image` と canonical が絶対 URL
- [ ] 同 spec で JSON-LD を検証した：`/about` に `Person`、記事詳細に `Article` の
      `application/ld+json` があり、`JSON.parse` が通って `@type` が期待どおり
- [ ] `/credits` を `tests/e2e/navigation.spec.ts` の `pages` 一覧と
      `tests/e2e/a11y.spec.ts` の `targets` に足した
- [ ] 記事が増減しても壊れない書き方にした：記事の件数・並び順を固定値で書かず、
      配信物から動的に数える（`tests/e2e/blog.spec.ts:5` の既存方針に合わせる）
- [ ] 追加したテストが実際に穴を見張っていることを 1 件で確かめた：
      `src/pages/about.astro:15-20` の JSON-LD ブロックを一時的にコメントアウトすると
      新テストが赤くなり、戻すと green に戻る。確認した事実を実装ログに書き、
      **実装は元に戻したうえで** commit する
- [ ] `docs/site-plan.md` §6.2 の URL 設計表に `/credits`（Phase 1d）を追記した。
      PHASE1D-001 で新設・PHASE1D-010 で拡張したのに表へ未反映だったため。
      決定内容は変わらないクラリフィケーションなので site-plan の version は据え置く
      （PHASE1D-009 と同じ扱い）
- [ ] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし
<!-- 定型（削除禁止。該当しないものは [x] N/A（理由）） -->
- [ ] テスト追加：`tests/e2e/seo.spec.ts` を新設し、`tests/e2e/navigation.spec.ts` と
      `tests/e2e/a11y.spec.ts` を更新する（README §4.6 ルール 9）
- [x] ローカル スクショ確認（desktop + mobile）：N/A（画面を変えない。テストの追加と
      docs 1 行だけで、`src/` と `worker/` の実装には触らない）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：N/A（同上）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `bash ~/.claude/bin/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ

- 想定セッション数: 1
- 実行環境: コンテナ内で作業する。`yarn test:e2e` をそのまま実行できる（母艦は Chromium 起動不可）。
  CI は `.github/workflows/ui-tests.yml`（`mcr.microsoft.com/playwright:v1.62.1-noble`）
- **E2E は `yarn preview` が配信するビルド済み `dist/` に対して走る**（`playwright.config.ts:20-24`）。
  sitemap は build 時にしか生成されないので、dev server 相手では検証できない。preview なら出る
- preview サーバーで過去に踏んだ落とし穴（Phase 1d / 1e の実装ログから転記。本 PBI は
  preview 前提のテストを足すので全部効く）:
  - `reuseExistingServer: !process.env.CI` のため、古い dev サーバーが 4321 を掴んでいると
    **ビルド前のコードでテストが走る**（PHASE1D-016）。dev には sitemap が無いので、
    ここを踏むと「実装が壊れている」と誤読する。走らせる前に 4321 の中身を確かめる
  - Astro 7 の `yarn preview` はデーモンとして起動し、ポートが埋まっていると黙って
    別ポート（実例 4323）を選ぶ。ログの `Preview server running at …` で実ポートを読む。
    停止は `yarn astro preview stop`（PHASE1E-001）
  - `.astro/preview.json` に前回のロックが残ると 2 本目の起動を拒否し、エラーが案内する
    `--force` は実装されていない。ロックファイルを消してから起動する（PHASE1D-012）
- 配信物の実測（2026-08-30、`dist/` を直接確認）:
  - sitemap は `sitemap-index.xml` + `sitemap-0.xml` の 2 本立て
  - `public/robots.txt` の `Sitemap:` 行は `https://byte-lark.com/sitemap-index.xml`
  - RSS の `<link>` は `https://byte-lark.com/blog/<slug>/`（末尾スラッシュあり）
  - JSON-LD があるのは `/about` の `Person`（`src/pages/about.astro:15-20`）と
    記事詳細の `Article`（`src/layouts/PostLayout.astro:77`）の 2 箇所だけ。
    トップ・career・skills には無い（`grep -c 'application/ld+json'` で 0 を実測）ので、
    トップを JSON-LD の条件に入れない
  - トップの og は title / description / url / image / type / site_name の 6 本。
    `og:image` は `https://byte-lark.com/og-home.png`（PHASE1E-004 で追加）
  - canonical は全ページにある（実測: トップ `https://byte-lark.com/`、
    `/about` は `https://byte-lark.com/about/`）
- draft の除外を見る材料はすでにある：`src/content/posts/e2e-draft-fixture.md`
  （`slug: e2e-draft-fixture` / `draft: true`）が恒久 fixture として置いてあり、
  `tests/e2e/blog.spec.ts:8` の `DRAFT_SLUG` がこれを参照している。RSS の検証でも同じ slug を使う
- sitemap の URL 数は記事数で動く（PHASE1D-006 の実測で 11 件＝固定ページ 8 + 記事 3）。
  件数を固定値で書くと記事を足すたびに落ちる
- 置き場所: SEO・配信まわりは新規の `tests/e2e/seo.spec.ts` にまとめる。
  `/credits` の 2 件だけは既存の navigation / a11y に足す（同種のテストが既にあるため）
- 触らない: `src/` と `worker/` の実装。本 PBI はテストを足すだけで振る舞いは変えない。
  実装を変えたくなったら（例: トップにも Person JSON-LD を入れる）別 PBI に切る

## 備考

- 起票のもとになった監査（2026-08-30 実施）:
  - unit: `yarn test:run` で 5 ファイル 31 ケース green
    （`worker/contact.test.ts` 14 / `src/lib/` 3 ファイル 13 / `CategoryFilter.test.tsx` 4）
  - E2E: 4 ファイル、`test()` 27 個（ループ展開前）。contact の異常系と axe まで見ている
  - 87 PBI 中「テスト追加」行があるのは `PHASE1A-019` の 1 件のみ。
    ただし README v3.13 でテンプレに常設したのが 2026-08-30 なので、既存 PBI への遡及はしない
  - 公開後のマージ済み PR 39 件のうち、`src/` か `worker/` を変えてテストを一切触らなかったのは
    4 件（#60 / #44 / #43 / #36）。#60 と #43 はフォントサブセットの副産物で実害なし
  - 実害のある 2 件はどちらも本 PBI の対象と重なる:
    - PR #44（PHASE1E-004、トップの title / OG 画像）— `src/pages/index.astro` を変更、テスト追加なし
    - PR #36（PHASE1D-010、フォント絞り込み）— BlogCard / Footer / BaseLayout / blog 一覧 /
      credits を変更、テスト追加なし
  - 穴が空いている場所と、テスト追加が漏れた PR の場所が一致する。`<head>` 系と静的な
    配信物が最初から検証の外にあった、というのが監査の結論
- `/credits` は PHASE1D-001（アイコン出典ページの新設）で生まれ、PHASE1D-010 で書体の出典を
  足した。site-plan §6.2 の URL 設計表にだけ載っていない。テストの対象に格上げするのに合わせて
  表も直す（受け入れ条件に含めた）
- カバレッジ計測（`@vitest/coverage-*`）の導入は本 PBI に含めない。`.astro` は計測外なので、
  上記 4 つの穴はどのみち数値に出てこない。導入するなら別 PBI

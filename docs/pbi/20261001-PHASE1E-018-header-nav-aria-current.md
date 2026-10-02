# 訪問者はスクリーンリーダーでもヘッダーのナビから今いるページを聞き取れる

Status: Done
Started: 2026-10-02
Completed: 2026-10-02

## 誰が

- 訪問者（スクリーンリーダーの利用者）

## 何をできる

- ヘッダーのナビを読み上げたとき、今いるページのリンクが「現在のページ」と分かる。
  記事ページなど下の階層にいるときは、どの項目の中にいるかが分かる

## なんのために

- ヘッダーのナビは、今いるページを色（`bg-primary/10 text-hibari-sky-deep`）だけで示していて、
  `aria-current` が付いていない（2026-10-01 に `src/components/Header.astro` を読んで確認。PC 用・スマホ用の 2 つのリストとも同じ）。
  色が見えない利用者には、今どのページにいるかが伝わらない
- PHASE1E-017 の起票時に見つけ、017 は「見た目も動きも変えない整理」なので範囲外にしていた（017 備考）。
  運営者が 2026-10-01 に別 PBI での起票を決めた
- 関連 FR / NFR（site-plan §5）：**NFR-02**（アクセシビリティ：WCAG 2.1 AA 相当）
- 関連 Phase：site-plan Phase 1e（Decision #31）

## 受け入れ条件

<!-- PBI 固有 -->
- [x] `aria-current` は、PHASE1E-017（PR #125 でマージ済み）がまとめた判定の 1 箇所で決める。PC 用・スマホ用で別々に書かない
- [x] リンク先が今いるページそのものなら `aria-current="page"` を付ける（例：`/about` で About）
- [x] 下の階層にいるときは、親の項目に `aria-current="true"` を付ける（例：`/blog/<slug>` で Blog）。
      `page` は「このリンク先が今のページ」の意味で、`/blog` は記事ページそのものではないため（下の技術メモ）
- [x] 今いるページでない項目には `aria-current` を出さない（`aria-current="false"` も出さない）。1 つのリストで付くのは多くて 1 項目
- [x] 末尾のスラッシュの有無（`/about` と `/about/`）で判定が変わらない。
      静的ビルドでは同じ HTML が返るため E2E では確かめられず、vitest で確かめる（下のテスト追加）
- [x] 見た目は変えない：色付けの条件は今と同じ（`page` と `true` のどちらでも今と同じ色）
- [x] トップ（`/`）では Home だけに `aria-current="page"` が付き、ほかのページで Home に付かない
- [x] `navItems` に無いページ（`/privacy` `/credits` 404）では、どの項目にも `aria-current` が付かない
- [x] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし
<!-- 定型（削除禁止。該当しないものは [x] N/A（理由）） -->
- [x] テスト追加：`tests/e2e/navigation.spec.ts` に 3 件足す。① `/about` で About だけが `aria-current="page"`
      ② 記事ページ（`/blog/building-this-blog-with-claude-code`）で Blog だけが `aria-current="true"`
      ③ `/privacy` でどの項目にも `aria-current` が無い。PC 幅とスマホのメニューを開いた状態の両方のリストを見る。
      あわせて判定の関数の vitest を足す（スラッシュの有無・トップ・下の階層・該当なし）。
      017 で関数が `Header.astro` の中に置かれていたら、`src/lib/` に移してテストする（README §4.6 ルール 9）
- [x] ローカル スクショ確認（desktop + mobile）：`/about` と記事ページで、ナビの色付けが変わっていないこと。
      あわせて MCP Playwright の snapshot か DOM で `aria-current` の値を確かめる（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：同上（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `bash ~/.claude/bin/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ

- 想定セッション数：1
- 実行環境：母艦・コンテナのどちらでもよい。スクショで見るのは色が変わっていないことだけで、
  `aria-current` の値は E2E とスクショ時の DOM で確かめる。母艦は E2E を draft PR の CI で回す
- 対象ファイル：`src/components/Header.astro`（ナビの項目 `navItems` と、PC 用・スマホ用の 2 つのリスト）。
  017 で判定は frontmatter の `stateClass(href)` にまとまり、色のクラスだけを返している（2026-10-01 に main で確認）。
  vitest で確かめるため、判定を `src/lib/` の関数に移し、`stateClass` と `aria-current` の両方がそれを使う形にする
- 今の判定：`currentPath === href || (href !== "/" && currentPath.startsWith(href))`（`currentPath = Astro.url.pathname`）。
  前半が「そのページ」、後半が「下の階層」に当たるので、2 つを分けて返す形にする
- `aria-current` の値の意味（MDN：https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current）
  - `page`：ページの集まりの中の、今のページ
  - `true`：集まりの中の、今の項目
  - 1 つの集まりで current にするのは 1 要素だけ
- 静的ビルドで `Astro.url.pathname` が `/about` と `/about/` のどちらになるかは未確認（`astro.config.mjs` に `trailingSlash` / `build.format` の指定なし）。
  比べる前に末尾のスラッシュを落としてそろえる
- 今の判定は `startsWith` なので、`/blogger` のようなページがあると Blog が付く。今は該当ページが無いので、この PBI では直さない
- 触らない：ナビの色とクラス、スマホのメニューの開閉スクリプト、`navItems` の並びとラベル、目次の `aria-current="location"`（`PostLayout.astro`、017 の担当）

## 備考

- 出所：PHASE1E-017 備考の範囲外項目（2026-09-30 のリファクタリング点検で発見）
- 017 と並行で起票し、起票の PR のマージ前に 017 がマージされた。本文には行番号を書いていない（関数名で探す）

## 実装ログ（着手後に追記、中断時は必須）

### 2026-10-02 セッション 1（コンテナ）
- 作業場所：コンテナ内の worktree `.claude/worktrees/feat+header-nav-aria-current`、ブランチ `feat/header-nav-aria-current`（main `b6992ad` から分岐）。
  着手の記録の push が 1 回中断された（運営者の意図しない中断）ので、着手日は再開した 2026-10-02 にした
- 判定：`src/lib/nav.ts` の `navCurrent(currentPath, href)` を新設。末尾のスラッシュを落としてから比べ、
  リンク先そのものなら `"page"`、下の階層なら `"true"`、どちらでもなければ `undefined` を返す（Astro は `undefined` の属性を出さない）。
  `/blogger` で Blog が付く `startsWith` の性質は技術メモどおり残した
- `Header.astro`：017 の `stateClass(href)` をやめ、frontmatter で `navItems` から `links`（`href`・`label`・`current`・`stateClass`）を 1 回作り、
  PC 用・スマホ用の 2 つのリストがそれを使う。色のクラスの文字列と条件（判定が真なら色付き）は 017 と同じ
- ビルド結果の比較：変更前・変更後の `dist/` を scratchpad に保存して比べ、差は 13 ページの HTML だけ。
  変更後の HTML から ` aria-current="page|true"` を取り除くと 13 本とも変更前と完全に一致する。
  付いた先は、トップ・`/about`・`/career`・`/skills`・`/blog`・`/contact` がそれぞれの項目に `page`、記事 7 本が Blog に `true`。
  どのページも 2 つのリストに 1 つずつ（計 2 つ）。`/privacy`・`/credits`・404 は変更前と一致（付かない）
- テスト追加：`src/lib/nav.test.ts` 新設 6 件（そのページ・スラッシュの有無・トップ・トップ以外で Home・下の階層・該当なし）。unit 78 → 84 件。
  `tests/e2e/navigation.spec.ts` に 3 件（`/about` で About だけ `page`、記事ページで Blog だけ `true`、`/privacy` で付かない）。
  各件で PC 幅のリストを読み、390px に縮めてメニューを開いてからスマホ用のリストも読む。
  変更前の `Header.astro` でビルドし直すと 3 件のうち 2 件が落ち（`/privacy` の件は変更前でも通る）、戻すと通ることを確かめた
- 検証結果：`yarn check` No fixes、`yarn check:ts` 0 errors、`yarn test:run` 11 files 84 passed、`yarn build` 成功、
  `yarn test:e2e` 68 passed（コンテナ）
- ローカル スクショ：`yarn dev` に対し、一時スクリプト（`@playwright/test` の chromium、確認後に削除）で `/about` と
  `/blog/building-this-blog-with-claude-code` のヘッダーを desktop（1280×900）と iPhone 14（メニューを開いた状態）で撮影。
  色付きは `/about` で About、記事ページで Blog だけ（色のクラスが変わっていないことは上のビルド比較で確認済み）。同じスクリプトで DOM の `aria-current` も読み、
  `/about` は About=page、記事ページは Blog=true、ほかは属性なし（4 枚とも）
- CI（PR #128、head `38b058f`）：`bash ~/.claude/bin/ci-status.sh --wait` で Quality Checks / UI Tests とも completed/success
- CF preview：`https://feat-header-nav-aria-current-byte-lark.tanimoto-a49.workers.dev` に同じスクリプトを `BASE_URL` 付きで実行。
  `aria-current` が出ていることで新しいビルドが載っていると確かめた。色付き・`aria-current` の値ともローカルと同じ。
  CF では `/about` が `/about/` へ転送されるので、末尾スラッシュ付きの URL でも `page` になることも確かめられた
- 想定外：コンテナ内で `yarn test:e2e` の 1 回目が「Process from config.webServer exited early」で止まった。
  `astro preview` がサーバーを裏で起動してすぐ終わるため、Playwright は起動失敗と見なす。裏で起動したサーバーが残るので、2 回目はそれを再利用して通る
  （015〜017 と同じ）。変更前後の比較のビルドで起動したサーバーが古い `dist/` のまま残っていたので、止めてビルドし直してから回した

# 訪問者はスクリーンリーダーでもヘッダーのナビから今いるページを聞き取れる

Status: NotStarted

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
- [ ] 着手は PHASE1E-017 のマージ後。017 でナビの「今いるページか」の判定が関数 1 つにまとまるので、`aria-current` はその 1 箇所で決める
- [ ] リンク先が今いるページそのものなら `aria-current="page"` を付ける（例：`/about` で About）
- [ ] 下の階層にいるときは、親の項目に `aria-current="true"` を付ける（例：`/blog/<slug>` で Blog）。
      `page` は「このリンク先が今のページ」の意味で、`/blog` は記事ページそのものではないため（下の技術メモ）
- [ ] 今いるページでない項目には `aria-current` を出さない（`aria-current="false"` も出さない）。1 つのリストで付くのは多くて 1 項目
- [ ] 末尾のスラッシュの有無（`/about` と `/about/`）で判定が変わらない。
      静的ビルドでは同じ HTML が返るため E2E では確かめられず、vitest で確かめる（下のテスト追加）
- [ ] 見た目は変えない：色付けの条件は今と同じ（`page` と `true` のどちらでも今と同じ色）
- [ ] トップ（`/`）では Home だけに `aria-current="page"` が付き、ほかのページで Home に付かない
- [ ] `navItems` に無いページ（`/privacy` `/credits` 404）では、どの項目にも `aria-current` が付かない
- [ ] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし
<!-- 定型（削除禁止。該当しないものは [x] N/A（理由）） -->
- [ ] テスト追加：`tests/e2e/navigation.spec.ts` に 3 件足す。① `/about` で About だけが `aria-current="page"`
      ② 記事ページ（`/blog/building-this-blog-with-claude-code`）で Blog だけが `aria-current="true"`
      ③ `/privacy` でどの項目にも `aria-current` が無い。PC 幅とスマホのメニューを開いた状態の両方のリストを見る。
      あわせて判定の関数の vitest を足す（スラッシュの有無・トップ・下の階層・該当なし）。
      017 で関数が `Header.astro` の中に置かれていたら、`src/lib/` に移してテストする（README §4.6 ルール 9）
- [ ] ローカル スクショ確認（desktop + mobile）：`/about` と記事ページで、ナビの色付けが変わっていないこと。
      あわせて MCP Playwright の snapshot か DOM で `aria-current` の値を確かめる（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）：同上（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `bash ~/.claude/bin/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ

- 想定セッション数：1
- 実行環境：母艦・コンテナのどちらでもよい。スクショで見るのは色が変わっていないことだけで、
  `aria-current` の値は E2E とスクショ時の DOM で確かめる。母艦は E2E を draft PR の CI で回す
- 対象ファイル：`src/components/Header.astro`（ナビの項目 `navItems` と、PC 用・スマホ用の 2 つのリスト）。
  017 で判定を関数にまとめた後は、その関数（置き場所は 017 の実装で決まる）。行番号は 017 で変わるので、着手時に現物を開いて探す
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
- 017 と並行で起票した。017 の作業中に `Header.astro` の形が変わるので、本文には行番号を書いていない

## 実装ログ（着手後に追記、中断時は必須）

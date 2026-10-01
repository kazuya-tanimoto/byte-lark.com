# Claude は目次・ヘッダーのナビ・経歴の表示を 1 箇所直せば両方に反映できる

Status: Done
Started: 2026-10-01
Completed: 2026-10-01

## 誰が

- Claude（実装セッション）

## 何をできる

- 記事の目次、ヘッダーのナビ、経歴の並べ替えで、ほぼ同じ形が 2 つずつ書かれている箇所を 1 つにまとめる。
  雇用形態の色の指定漏れを型チェックで見つけられるようにする

## なんのために

- 同じ形が 2 つずつ書かれていて、片方だけ直すと幅によって見た目がずれる（2026-10-01 にファイルを読んで確認）
  - 記事の目次：本文の先頭に出す版（xl 未満）と右カラムに出す版（xl 以上）が `src/layouts/PostLayout.astro:111-163` にほぼ同じ形で 2 つある。
    違うのは外側の `nav` の属性とクラスだけで、中の `ul` / `li` / `a` は同じ
  - ヘッダーのナビ：PC 用（`src/components/Header.astro:23-38`）とスマホ用（`Header.astro:55-70`）で、
    今いるページかの判定 `currentPath === href || (href !== "/" && currentPath.startsWith(href))` と色のクラスが同じものを 2 回書いている
  - 経歴の新しい順の並べ替え：`src/pages/index.astro:18-20` と `src/components/CareerTimeline.astro:11` に同じ式がある
- 雇用形態の色 `employmentClass`（`CareerTimeline.astro:15`）の型が `Record<string, string>` で、
  `src/types/career.ts:6` の `Employment` に種類を足しても色の指定漏れが型チェックで見つからない
- 優先度は低い。見た目も動きも変えない整理で、PHASE1E-015・016 の後でよい
- 関連 FR / NFR（site-plan §5）：**FR-04**（`/career` のタイムライン）/ **FR-07**（記事詳細）/ **NFR-03**（TypeScript strict）
- 関連 Phase：site-plan Phase 1e（Decision #31）

## 受け入れ条件

<!-- PBI 固有 -->
- [x] 目次を Astro の部品 1 つ（例：`src/components/TableOfContents.astro`）に切り出し、`PostLayout.astro` の 2 箇所がそれを使う。
      `nav` の `aria-label="目次"` と `data-toc` / `data-toc-mobile` / `data-toc-sidebar` は今と同じに出す
      （`PostLayout.astro:183, 237` のスクリプトと `tests/e2e/blog.spec.ts` がこれらの属性で目次を探している）
- [x] 追従目次の現在地の色付けが消えない：今は `PostLayout.astro:267-272` の `<style>`（PostLayout の中だけに効く書き方）で
      `[data-toc-sidebar] a[aria-current="location"]` に色と太さを付けている。目次を別の部品に移すとこのスタイルが届かなくなるので、
      スタイルを部品側へ移すか、届く書き方に変える。xl 幅で記事を下へ送り、右カラムの現在地のリンクが太字・sky-deep 色になることを確かめる
- [x] ヘッダーのナビで、今いるページかの判定を関数 1 つにまとめ、PC 用・スマホ用の両方がそれを使う。表示は変えない
- [x] 経歴の新しい順の並べ替えを関数 1 つ（例：`src/lib/career.ts`）にまとめ、`index.astro` と `CareerTimeline.astro` がそれを使う
- [x] `employmentClass` の型を `Record<Employment, string>` にする。確かめ方：一時的に 1 種類の色を消すと `yarn check:ts` が落ち、
      戻すと通る。確かめた事実を実装ログに書き、**元に戻してから** commit する
- [x] ビルド結果が変わらない：変更前の `dist/` を別ディレクトリへ保存し、変更後とファイル名のハッシュを正規化して `diff -rq` で比べる
      （PHASE1D-012 実装ログ。astro-island の識別子だけの差は許す。PHASE1D-012 で CF preview と比べたときに出た。2 回のローカルビルドで出るかは未確認）。
      部品を切り出すと Astro がスタイル用に付ける属性（`data-astro-cid-*`）が変わりうるので、差分が出たら、それが表示を変えないことを実装ログに書く
- [x] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし
<!-- 定型（削除禁止。該当しないものは [x] N/A（理由）） -->
- [x] テスト追加：経歴の並べ替えの unit（`src/lib/career.test.ts` を新設）と、追従目次の現在地の E2E を
      `tests/e2e/blog.spec.ts` に 1 件足す（記事を下へ送ると、右カラムのどれか 1 つのリンクに `aria-current="location"` が付き、
      その文字が太字になる）。現在地の表示は今どのテストも見ておらず、上記のスタイルが届かなくなっても CI が落ちないため（README §4.6 ルール 9）
- [x] ローカル スクショ確認（desktop + mobile）：記事詳細（xl 幅で右カラムの目次、mobile で本文先頭の目次）・ヘッダー（スマホのメニューを開いた状態）・`/career`（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：同上（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `bash ~/.claude/bin/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ

- 想定セッション数：1
- 実行環境：母艦を推奨。スクショは「記事を下へ送った状態」「スマホのメニューを開いた状態」で撮る必要があり、
  母艦の MCP Playwright なら操作して撮れる。コンテナの `scripts/capture-screenshots.mjs` は決まったページを開いて撮るだけ。
  E2E は母艦では draft PR の CI で確かめる。コンテナで `yarn test:e2e` を回すときの preview のロックは PHASE1E-015 技術メモを参照
- 目次の部品は、外側の `nav` に付ける属性とクラスを props で受け取る形にすると 2 箇所の違いを吸収できる。
  モバイル版は `nav` が直接、サイドバー版は `aside` の中に `nav` がある
- 目次まわりのスクリプト（`PostLayout.astro` の `<script>`）は `document.querySelector` で探しているので、部品に移しても動く。
  スクリプトを部品へ移すかは任意（動きを変えないこと）
- ヘッダーのナビは、`ul` のクラスと `a` の `block` の有無が PC 用とスマホ用で違う。全体を部品にするより、判定とクラスを返す関数にまとめる方が差分が小さい
- 触らない：目次の出し分けの幅（`xl`）、「先頭へ戻る」との連動（PHASE1E-009、Decision #33）、スマホのメニューの開閉スクリプト

## 備考

- 範囲外（行き先：運営者判断。この PBI では扱わない）：ヘッダーのナビは今いるページを色だけで示していて、
  `aria-current="page"` が付いていない（`Header.astro:24-38, 56-70` を確認）。スクリーンリーダーでは今いるページが分からない。
  付けると読み上げが変わる（振る舞いの変更）ので、リファクタリングとは別に扱う。起票するかは運営者が決める
- PHASE1E-016 とは別 PBI にした理由は PHASE1E-016 備考を参照
- 出所：2026-09-30 のリファクタリング点検（PHASE1E-014 備考と同じ）

## 実装ログ（着手後に追記、中断時は必須）

### 2026-10-01 セッション 1（コンテナ）
- 作業場所：コンテナ内の worktree `.claude/worktrees/feat-toc-nav-career-dedup`、ブランチ `feat/toc-nav-career-dedup`（main `d3f54e4` から分岐）。
  016 の `src/lib/posts.ts` などは触っていない
- 目次：`src/components/TableOfContents.astro` を新設。props は `items`（見出し）・`variant`（`"mobile"` / `"sidebar"`）・`class`。
  はじめは nav の属性を `{...attrs}` でそのまま渡す形にしたが、Astro は spread した要素の `class` の末尾に `astro-<印>` を足し、
  親の印を `data-astro-cid-…="true"` として流し込み、`data-toc-mobile` も `="true"` 付きで出した
  （`node_modules/astro/dist/runtime/server/index.js` の `spreadAttributes`）。出力を変えないため、`variant` から
  `data-toc-mobile=""` / `data-toc-sidebar=""` を出す形に変えた（値が `""` だと属性名だけが出る。`render/util.js` の `addAttribute`）
- 現在地の色付け：`[data-toc-sidebar] a[aria-current="location"]` の `<style>` を PostLayout から部品側へ移した。
  スクリプトは PostLayout に残した（`document.querySelector` で探すので動きは同じ）
- ヘッダーのナビ：判定と色のクラスを `Header.astro` の `stateClass(href)` 1 つにまとめ、PC 用・スマホ用の両方で使う
- 経歴：`src/lib/career.ts` の `sortCareerByNewest`（新しい配列を返す）にまとめ、`index.astro` と `CareerTimeline.astro` が使う
- `employmentClass` の型を `Record<Employment, string>` にした。`副業` の行を一時的に消すと `yarn check:ts` が
  `ts(2741): Property '副業' is missing in type … but required in type 'Record<Employment, string>'` で 1 error・exit 1。
  控えから戻して 0 errors を確かめてから commit した
- ビルド結果の比較：変更前の `dist/` を scratchpad に保存し、変更前のまま 2 回ビルドして `diff -rq` が 0 件（astro-island の識別子は揺れなかった）。
  変更後はファイル名のハッシュを正規化して比べ、差は記事ページ 7 本の HTML だけ。中身は、目次の要素（`nav`・`h2`・`ul`・`li`・`a`）に付く印が
  PostLayout の `data-astro-cid-ssdmjifj` から部品の `data-astro-cid-p33bl5ka` に変わったことと、ページに埋め込まれた現在地のスタイルの
  セレクタの印が同じく変わったことだけ。変更後の HTML の `p33bl5ka` を `ssdmjifj` に置き換えると 7 本とも変更前と完全に一致する。
  PostLayout に残った scoped style は `.post-body[data-astro-cid-ssdmjifj] …` だけで目次に当たらないので、印が変わっても表示は変わらない。
  トップ・`/career`・CSS・JS・`rss.xml`・sitemap は一致
- テスト追加：`src/lib/career.test.ts` 新設 4 件（新しい順・同じ年の月順・同じ年月は渡した順・元の配列を変えない）。unit 74 → 78 件。
  `tests/e2e/blog.spec.ts` に「記事を下へ送ると、追従目次の現在地のリンクが太字になる」1 件（現在地のリンクがちょうど 1 つで太さ 700、
  他のリンクは 700 でない）。部品の `<style>` を一時的に消してビルドするとこの E2E が `Expected: "700" / Received: "400"` で落ち、
  戻すと通ることを確かめた
- 検証結果：`yarn check` 70 files / No fixes、`yarn check:ts` 0 errors、`yarn test:run` 10 files 78 passed、`yarn build` 成功、
  `yarn test:e2e` 65 passed（コンテナ。1 回目は 015 / 016 と同じ「exited early」、2 回目で通過）
- ローカル スクショ：`yarn dev` に対し、記事を下へ送って撮る一時スクリプト（scratchpad。`@playwright/test` の chromium、repo には置かない）で撮影。
  xl（1280×900）で記事を半分まで送ると、右カラムの「手続きは詰まらなかった」が太字・sky-deep（`oklch(0.443 0.1 240.8)`）になる。
  mobile（iPhone 14）で本文先頭の目次、スマホのメニューを開いた状態（`/career` で Career に色が付く）、`/career` の desktop / mobile 全体を確認
- CI（PR #125、head `3c27ce3`）：`bash ~/.claude/bin/ci-status.sh --wait` で Quality Checks / UI Tests とも completed/success
- CF preview：`https://feat-toc-nav-career-dedup-byte-lark.tanimoto-a49.workers.dev` に `3c27ce3` が載ったこと（記事ページの目次に
  `data-astro-cid-p33bl5ka` が付いている）を curl で確かめてから、同じ一時スクリプトを `BASE_URL` 付きで実行。
  右カラムの現在地（「手続きは詰まらなかった」が太字・sky-deep）、本文先頭の目次、スマホのメニュー（記事ページで Blog に色が付く）、
  `/career` の desktop / mobile ともローカルと同じ表示

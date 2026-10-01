# Claude は記事の並べ方・URL・カテゴリ表示を 1 箇所直せば全ページに反映できる

Status: InProgress
Started: 2026-10-01

## 誰が

- Claude（実装セッション）

## 何をできる

- 記事一覧の取得と並べ替え、記事 URL の作り方、カテゴリと日付の表示、サイトの URL の組み立てを、
  それぞれ 1 箇所で定義し、各ページはそれを呼ぶだけにする

## なんのために

- 同じ処理が複数のファイルに書き写されていて、1 箇所だけ直すと表示がずれる（2026-10-01 に grep で確認）
  - 記事一覧の取得と新しい順の並べ替え：`src/pages/index.astro:12-15` / `src/pages/blog/index.astro:8-10` / `src/pages/rss.xml.ts:6-9`
  - 記事 URL の `slug ?? post.id`（frontmatter の `slug` が無ければフォルダ名）：`src/components/BlogCard.astro:18` / `src/pages/blog/[slug].astro:11` / `src/pages/rss.xml.ts:20`
  - カテゴリのチップ（ラベル・色）・draft チップ・日付の書式：`BlogCard.astro:22-33, 54-60` と `src/layouts/PostLayout.astro:57-70, 86-95` がほぼ同じ。
    カテゴリのラベル「Tech / Life」は `src/components/CategoryFilter.tsx:8-9` にもある
  - サイト URL・canonical・OG 画像 URL の計算：`src/layouts/BaseLayout.astro:19-23` と `PostLayout.astro:41-45` が同じ
  - 予備の値 `"https://byte-lark.com"`：`BaseLayout.astro:19` / `PostLayout.astro:41` / `src/pages/about.astro:7` / `rss.xml.ts:15` の 4 箇所。
    `astro.config.mjs:10` で `site` を設定済みなので使われることは無いが、ドメインを変えるときに直し漏れの元になる
- 将来のカテゴリ別一覧（FR-19、記事 10 本到達時に起票）は、記事一覧の取得・URL・チップを新しいページでもう一度使う。
  その前に 1 箇所にまとめておくと、写し間違いの入り口が増えない
- 関連 FR / NFR（site-plan §5）：**FR-06**（`/blog` 一覧）/ **FR-07**（記事詳細）/ **FR-09**（category バッジ）/
  **FR-17・18**（OGP メタ）/ **FR-20**（RSS）/ **NFR-03**（TypeScript strict）
- 関連 Phase：site-plan Phase 1e（Decision #31）

## 受け入れ条件

<!-- PBI 固有 -->
- [ ] `src/lib/posts.ts` に「記事を新しい順に並べる関数」と「記事の slug（URL の末尾）を返す関数」を足す。
      並べ替えは `index.astro` / `blog/index.astro` / `rss.xml.ts`、slug は `BlogCard.astro` / `blog/[slug].astro` / `rss.xml.ts` が使う。
      `git grep -n "?? post.id\|publishedAt.getTime() -\|publishedAt.valueOf() -" -- src ':!*.test.ts'`
      が `src/lib/posts.ts` だけになる（RSS だけ `valueOf()` で並べているので両方を見る）
- [ ] RSS は今の挙動を保つ：dev サーバーでも draft 記事を出さない（`rss.xml.ts:6` は `isVisiblePost` ではなく
      `draft !== true` を使っている。一覧・記事ページは dev で draft を出す）
- [ ] カテゴリのチップと draft チップを Astro の部品 1 つにまとめ、`BlogCard.astro` と `PostLayout.astro` がそれを使う。
      カテゴリのラベル（`tech` → `Tech`、`life` → `Life`）の定義は 1 箇所にし、`CategoryFilter.tsx` もそれを読む
- [ ] 日付の書式（`2026年10月1日` の形と `<time datetime>` 用の `YYYY-MM-DD`）を関数 1 つずつにまとめ、
      `BlogCard.astro` と `PostLayout.astro` がそれを使う
- [ ] canonical・OG 画像 URL の計算を `src/lib/og.ts` の関数にまとめ、`BaseLayout.astro` と `PostLayout.astro` がそれを使う
- [ ] 予備の値 `"https://byte-lark.com"` を `src/` から無くす（`git grep -n '"https://byte-lark.com"' -- src ':!*.test.ts'` が 0 件）。
      `site` が未設定のときは、黙って予備の値を使わずビルドを失敗させる
- [ ] ビルド結果が変わらない：変更前の `dist/` を別ディレクトリへ保存し、変更後とファイル名のハッシュを正規化して `diff -rq` で比べ、
      HTML がすべて一致する（PHASE1D-012 実装ログ。astro-island の識別子だけの差は許す。PHASE1D-012 で CF preview と比べたときに出た。2 回のローカルビルドで出るかは未確認）。
      それ以外の差分が出たら、その差分が表示を変えないことを実装ログに書く
- [ ] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし
<!-- 定型（削除禁止。該当しないものは [x] N/A（理由）） -->
- [ ] テスト追加：`src/lib/posts.test.ts` に並べ替え（新しい順・同じ日付）と slug（frontmatter の `slug` あり / なし）のケース、
      `src/lib/og.test.ts` に URL 計算（canonical 指定あり / なし、OG 画像の相対パス → 絶対 URL）のケースを足す。
      日付の書式の関数にも unit を足す（README §4.6 ルール 9）
- [ ] ローカル スクショ確認（desktop + mobile）：トップ・`/blog`・記事詳細 1 本（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）：同上（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `bash ~/.claude/bin/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。
      `tests/e2e/blog.spec.ts`・`seo.spec.ts` が一覧・RSS・canonical・OG を見張っている）

## 技術メモ

- 想定セッション数：1（触るファイルは 10 前後だが、どれも書き写しを関数呼び出しに置き換えるだけ）
- 実行環境：母艦・コンテナのどちらでもよい。スクショは開いた状態を撮るだけなので、母艦なら MCP Playwright、
  コンテナなら `scripts/capture-screenshots.mjs`（トップ・`/blog`・記事 1 本を含む）で撮れる。E2E は母艦では draft PR の CI で確かめる
- `src/lib/` の関数は `astro:content` の型（`CollectionEntry<"posts">`）を受け取ってよいが、`getCollection` を呼ぶ関数は
  vitest から直接呼べない。並べ替えと URL は引数を受け取る純粋な関数にし、`getCollection` は呼び出し側に残す形にすると unit が書ける
- `CategoryFilter.tsx` は React の部品なので、ラベルの定義は `.astro` ではなく `.ts` に置く
- 色のクラス（`bg-muted text-hibari-sky` など）は PHASE1C-008 でコントラストを確かめて決めたもの。まとめるときに値を変えない
- 触らない：記事の見た目、`isVisiblePost` の判定内容、JSON-LD の中身（`src/lib/jsonld.ts`）

## 備考

- PHASE1E-017（目次・ヘッダーのナビ・経歴の型）は別 PBI にした。どちらも記事一覧とは別のファイル群で、同じ PR に入れると差分が大きくなり、
  `dist/` の一致を確かめるときに原因の切り分けが難しくなるため
- 出所：2026-09-30 のリファクタリング点検（PHASE1E-014 備考と同じ）

## 実装ログ（着手後に追記、中断時は必須）

### 2026-10-01 セッション 1
- 作業場所：コンテナ内の worktree `.claude/worktrees/feat-post-helpers-dedup`、ブランチ `feat/post-helpers-dedup`
  （main `edd6a0a` から分岐）。PHASE1E-014 / 015 が別 worktree で同時進行中のため、PBI 本文の対象ファイル以外は触っていない
- まとめた先：
  - `src/lib/posts.ts`：`sortPostsByNewest`（新しい配列を返す。元の `.sort` は配列をその場で並べ替えていたが、
    どの呼び出し側も元の配列を使い回していないので結果は同じ）、`postSlug`、`formatPostDate`、`toIsoDate`
  - `src/lib/categories.ts`（新設）：`PostCategory` 型（`content.config.ts` の enum から導出）と `categoryLabels`。
    はじめは `posts.ts` に置いたが、`CategoryFilter.tsx` のブラウザ用 JS に `posts.ts` の
    `new Intl.DateTimeFormat(...)` が巻き込まれた（モジュール直下の呼び出しは tree-shaking で消えない）ので別ファイルにした
  - `src/components/PostChips.astro`（新設）：カテゴリのチップと draft チップ。色のクラスと PHASE1C-008 のコメントは BlogCard のものをそのまま移した
  - `src/lib/og.ts`：`requireSiteOrigin`（`site` 未設定なら throw）と `buildPageUrls`（canonical・OG 画像 URL）。
    OG 画像は元の三項演算子と同じく空文字も「指定なし」扱いにするため `||` にした
  - RSS は `isVisiblePost` を使わず `draft !== true` のまま（理由をコメントに書いた）。並べ替えは `getTime()` 版に統一（`valueOf()` と同値）
- ビルド結果の比較：変更前の `dist/` を scratchpad に保存し、変更前のまま 2 回ビルドして `diff -rq` が 0 件（ローカルでは astro-island の
  識別子は揺れなかった）。変更後はファイル名のハッシュを正規化して HTML / XML を比べ、差は記事ページ 7 本のカテゴリチップ 1 個ずつだけ：
  `<span class="… bg-muted text-hibari-sky" data-astro-cid-ssdmjifj>Tech</span>` → 属性 `data-astro-cid-ssdmjifj` が消える。
  チップが PostLayout の中から別部品に移り、PostLayout の scoped style の印が付かなくなったため。PostLayout の scoped セレクタは
  `.post-body[data-astro-cid-ssdmjifj] …` と `[data-toc-sidebar] a[…][aria-current=location]` だけで、どれもヘッダーのチップに
  当たらない（dist の CSS を grep して確認）ので表示は変わらない。CSS ファイルは一致。JS は `CategoryFilter.*.js` だけ変わり、
  中身の差はラベルを `categoryLabels` から読むようになった分だけ。`rss.xml`・sitemap は一致
- `site` 未設定の確認：`astro.config.mjs` の `site` 行を一時的に消して `yarn build` → `/404` の描画で
  「astro.config.mjs の site が未設定です」で exit 1。`git checkout -- astro.config.mjs` で戻して再ビルド成功
- draft チップの確認：dev で `incorporating-bytelark` を一時的に `draft: true` にし、記事ページ・`/blog` に PostChips の draft チップが出て、
  `/rss.xml` には出ないこと（dev でも）を curl で確認。`git checkout` で戻した
- テスト追加：`src/lib/posts.test.ts` +7 件（並べ替え 3・slug 2・日付 2）、`src/lib/og.test.ts` +6 件（`requireSiteOrigin` 2・`buildPageUrls` 4）、
  `src/lib/categories.test.ts` 新設 1 件。unit 50 → 64 件
- 検証結果：`yarn check` 65 files / No fixes、`yarn check:ts` 0 errors、`yarn test:run` 8 files 64 passed、`yarn build` 成功、
  `yarn test:e2e` 63 passed（コンテナ内で実行）。ローカル スクショ（`scripts/capture-screenshots.mjs`）でトップ・`/blog`・記事詳細を desktop + mobile で確認
- 学び：コンテナの `yarn test:e2e` は webServer の `yarn preview` が裏に回って即終了するため「exited early」で落ちる。
  裏に残った preview を `reuseExistingServer` が拾うので、もう一度実行すると通る（終わったら `yarn astro preview stop`）

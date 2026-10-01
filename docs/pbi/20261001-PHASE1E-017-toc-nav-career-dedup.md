# Claude は目次・ヘッダーのナビ・経歴の表示を 1 箇所直せば両方に反映できる

Status: NotStarted

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
- [ ] 目次を Astro の部品 1 つ（例：`src/components/TableOfContents.astro`）に切り出し、`PostLayout.astro` の 2 箇所がそれを使う。
      `nav` の `aria-label="目次"` と `data-toc` / `data-toc-mobile` / `data-toc-sidebar` は今と同じに出す
      （`PostLayout.astro:183, 237` のスクリプトと `tests/e2e/blog.spec.ts` がこれらの属性で目次を探している）
- [ ] 追従目次の現在地の色付けが消えない：今は `PostLayout.astro:267-272` の `<style>`（PostLayout の中だけに効く書き方）で
      `[data-toc-sidebar] a[aria-current="location"]` に色と太さを付けている。目次を別の部品に移すとこのスタイルが届かなくなるので、
      スタイルを部品側へ移すか、届く書き方に変える。xl 幅で記事を下へ送り、右カラムの現在地のリンクが太字・sky-deep 色になることを確かめる
- [ ] ヘッダーのナビで、今いるページかの判定を関数 1 つにまとめ、PC 用・スマホ用の両方がそれを使う。表示は変えない
- [ ] 経歴の新しい順の並べ替えを関数 1 つ（例：`src/lib/career.ts`）にまとめ、`index.astro` と `CareerTimeline.astro` がそれを使う
- [ ] `employmentClass` の型を `Record<Employment, string>` にする。確かめ方：一時的に 1 種類の色を消すと `yarn check:ts` が落ち、
      戻すと通る。確かめた事実を実装ログに書き、**元に戻してから** commit する
- [ ] ビルド結果が変わらない：変更前の `dist/` を別ディレクトリへ保存し、変更後とファイル名のハッシュを正規化して `diff -rq` で比べる
      （PHASE1D-012 実装ログ。astro-island の識別子だけの差は許す。PHASE1D-012 で CF preview と比べたときに出た。2 回のローカルビルドで出るかは未確認）。
      部品を切り出すと Astro がスタイル用に付ける属性（`data-astro-cid-*`）が変わりうるので、差分が出たら、それが表示を変えないことを実装ログに書く
- [ ] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし
<!-- 定型（削除禁止。該当しないものは [x] N/A（理由）） -->
- [ ] テスト追加：経歴の並べ替えの unit（`src/lib/career.test.ts` を新設）と、追従目次の現在地の E2E を
      `tests/e2e/blog.spec.ts` に 1 件足す（記事を下へ送ると、右カラムのどれか 1 つのリンクに `aria-current="location"` が付き、
      その文字が太字になる）。現在地の表示は今どのテストも見ておらず、上記のスタイルが届かなくなっても CI が落ちないため（README §4.6 ルール 9）
- [ ] ローカル スクショ確認（desktop + mobile）：記事詳細（xl 幅で右カラムの目次、mobile で本文先頭の目次）・ヘッダー（スマホのメニューを開いた状態）・`/career`（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）：同上（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `bash ~/.claude/bin/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

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

# 訪問者は記事内の画像をクリックして拡大表示できる

Status: Done
Started: 2026-08-29
Completed: 2026-08-29

## 誰が

- 訪問者（記事ページの読者。特にスクショ入りの tech 記事を読む人）

## 何をできる

- 記事本文の画像をクリック / タップすると、画面いっぱいの拡大表示で細部まで読める
- Esc・背景クリック・閉じるボタンのいずれでも元の位置に戻れる
- 通常表示では画面幅に合った縮小版が配信され、狭い画面で元解像度を落とさずに済む

## なんのために

- 本文画像は本文幅まで縮小して表示され、UI スクショの文字が読めない。現行 CSS は
  `margin` と `border-radius` のみで拡大の仕掛けが無い（`src/layouts/PostLayout.astro:326-329`）
- 直近の後編記事で実害が顕在化（`src/content/posts/claude-code-devcontainer-tuning/index.md:119-122`
  の statusline スクショ 2 枚。縮小されて細部が見えないと運営者指摘 2026-08-25）
- Zenn 等の技術記事サイトではクリック拡大が標準で、読者の期待に合わせる
- 次の記事 T8（PHASE1E-008）で herdr のスクショを複数掲載予定で、画像点数は今後増える
- 縮小版の出し分けも本 PBI で行う（2026-08-27 運営者承認でスコープ追加）。現状は
  `srcset=""` で元解像度 1 本のみをスマホにも配信。既存画像は 7〜8KB で実害が無いが、
  T8 の Retina スクショは 1 枚 100KB 超になり得る（推測）。本文画像が LCP 主因になった
  前例あり（PHASE1D-010、INDEX-history.md 2026-08-10 行）
- 出所: 2026-08-25 運営者提案（「画像クリックでモーダル拡大の方が UX いいのでは」）。
  起票は同メッセージの「PBI 作る方がよければ作って」による
- 関連: site-plan Phase 1e（公開後の運用・改善。Decision #31 ② の枠）/
  PHASE1E-008（価値検証の場になる記事）

## 受け入れ条件

<!-- PBI 固有 -->
- [x] 記事本文（`.post-body` 配下）の画像がクリックで拡大表示される。カバー画像・
      ロゴ等の本文外の画像は対象外：対象は script が `data-zoomable` を付けたものだけ。
      記事カバーは `data-zoomable` 無しを実測（`img[slot='cover']` の zoomable=false）
- [x] 拡大表示は外部ライブラリ非依存の自前実装（vanilla JS。`<dialog>` ベース想定）。
      SSG 出力に閉じ、既存記事の HTML（markdown 由来の `<img>`）に手を入れずに効く：
      `src/components/ImageLightbox.astro` に `<dialog>` + script で完結。依存追加なし、
      記事の markdown は 1 文字も触っていない
- [x] キーボードで操作できる：画像へフォーカス到達 → Enter / Space で開く → Esc で閉じる。
      開いている間フォーカスは拡大表示内に移り、閉じたら元の画像に戻る：実測で
      opened=true / focusInside=true / Esc 後に元の本文画像へ復帰。E2E「キーボードだけで開閉できる」でも固定
- [x] 拡大できることが見て分かる（`cursor: zoom-in` 等の affordance）：本文画像の
      computed cursor が `zoom-in`。拡大表示の中も、原寸へ行けるときは `zoom-in`、
      戻れるときは `zoom-out` に変える
- [x] `prefers-reduced-motion: reduce` では開閉アニメーションを付けない：
      `reducedMotion: "reduce"` の context で `animationName` が `none`（実測）
- [x] モバイル実表示で動作する（タップで開閉。OS のピンチズームを妨げない）：
      iPhone 13 相当（390×844 / DPR 3）で開閉と原寸トグルを実測。viewport meta は
      `width=device-width, initial-scale=1` のみで `user-scalable=no` も `maximum-scale` も無く
      （`src/layouts/BaseLayout.astro:38`）、`touch-action` の指定も足していない
- [x] 画像の無い記事・画像入り記事の両方で表示崩れが無い：画像の無い記事
      （`building-this-blog-with-claude-code`）は拡大対象 0 件・dialog は閉じたまま、
      スクショで崩れなしを確認
- [x] 本文画像に画面幅別の縮小版と `srcset` / `sizes` が付く（`image.layout` の
      グローバル設定。markdown `![]()` 由来の画像に効いていることを dist の実 HTML で確認）：
      `dist/blog/claude-code-devcontainer-tuning/index.html` の本文 `<img>` に
      640 / 750 / 828 / 1080 / 1280 / 1310w の 6 エントリと
      `sizes="(min-width: 1310px) 1310px, 100vw"`。390px 幅・DPR 1 では 640w（3.0KB）が
      選ばれる（着手前は 1310w の 7.6KB 一本）
- [x] 拡大表示は元解像度を使う（縮小版の引き伸ばしで粗くしない。実表示で確認）：
      拡大表示の `<img>` に `srcset` を持たせず、押された画像の `src`（元解像度）を入れる。
      CF preview の実測で naturalWidth=1310
- [x] グローバル設定の影響範囲を確認した：既存の `<Image>` 利用箇所（BlogCard の
      カバー等）と記事カバーの表示・サイズに退行が無い：`/blog` のカードは 360×189 で
      `object-fit: cover` 維持、記事カバーは 768×403 で維持。どちらも srcset が増えただけ
- [x] E2E を追加した（画像クリック → 拡大表示 → Esc で閉じる、の 1 本以上）：
      `tests/e2e/blog.spec.ts` に 3 本（クリック開閉 + 元解像度 / キーボード開閉 /
      スマホ幅の原寸トグル）。`tests/e2e/a11y.spec.ts` の axe 対象に画像入り記事も追加
- [x] 最終形の見た目（拡大時の背景・閉じる導線・余白）を運営者がスクショで承認した
      （承認の日付と見たものを実装ログに記録）：2026-08-29 承認。実装ログ参照
- [x] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし：
      build 14 ページ完了、check 57 files エラーなし、check:ts 0 errors、test:run 31 passed
<!-- 定型（削除禁止。該当しないものは [x] N/A（理由）） -->
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）：`yarn preview` +
      Playwright。1440×900 と 390×844 で、本文表示 / 拡大表示 / 原寸表示を撮影
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）：
      https://feat-post-image-lightbox-byte-lark.tanimoto-a49.workers.dev/blog/claude-code-devcontainer-tuning/
      （HTTP 200）。srcset 6 エントリ、モバイルで 1280w 受信、拡大 358px → 原寸 1310px を実測
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）：
      PR #70 で `e2e` pass（1m53s）/ `quality` pass（43s）/ `Workers Builds: byte-lark` pass /
      CodeQL 3 件 pass

## 技術メモ

- 想定セッション数: 1
- 実行環境: 実装・ローカルスクショ確認はコンテナ（`yarn preview` + repo の Playwright、
  PHASE1E-003 / 004 実績）でも母艦（`yarn dev` + MCP Playwright）でも可。
  E2E スイートは draft PR 経由の CI で検証
- 着手タイミング: 当初は「PHASE1E-008（記事 T8）のマージ後」としていたが、2026-08-29 に
  先行着手へ変更（運営者判断）。公開済みの後編記事に本文画像 2 枚があり
  （`src/content/posts/claude-code-devcontainer-tuning/index.md:119,122`）、§7 検証の
  題材は T8 を待たずにそろう。T8 との依存はドキュメントのみでコードの競合は無い
- 現状の実装事実（2026-08-25、dist の実 HTML で確認）:
  - 本文画像は markdown `![alt](./file.png)` 由来。Astro が webp へ変換して出力するが
    解像度は元のまま（実測: `dist/blog/claude-code-devcontainer-tuning/index.html` の
    `<img>` が `width="1310"` / `srcset=""`。縮小版は作られていない）。本文幅への縮小は
    CSS のみ。クリック挙動なし、リンクなし
  - 画像入りの既存記事は `claude-code-devcontainer-tuning` の 2 枚のみ（2026-08-25 時点）
  - `.post-body :global(img)` のスタイルは `src/layouts/PostLayout.astro:326-329`
- 実装方針（推奨）: `PostLayout.astro` に `<dialog>` 1 個 + 数十行の vanilla script を置き、
  `.post-body img` へ click / keydown を委譲で張る。`BackToTop.astro`（PHASE1E-009）と同じ
  「依存なし・1 コンポーネント完結」の作り
- 縮小版の出し分け: `astro.config.mjs`（現状 `image` 設定なし）に
  `image: { layout: 'constrained' }` を追加。markdown `![]()` 由来にも自動適用される
  （公式 docs: https://docs.astro.build/en/guides/images/ 。responsive styles の要否
  = `image.responsiveStyles: true` も同 docs を見て実装時に判断）
- 拡大用の元解像度の取り方: srcset の最大幅エントリを使うか、`getImage()` で元解像度の
  URL を別途用意するかを実装時に比較して選ぶ（未検証。dist の実 HTML で確認して決める）
- 対案（不採用の見込み）: medium-zoom 等のライブラリ導入。サイトは静的部品を自前
  vanilla で通しており（Header / Footer / BackToTop）、依存を増やす理由が無い
- a11y: `<dialog>` の `showModal()` はモーダル化（inert 化）と Esc を標準で持つ
  （https://developer.mozilla.org/docs/Web/HTML/Element/dialog ）。閉じた後の
  フォーカス戻しだけ自前で行う
- 触ってはいけない領域: `PostLayout.astro` の目次スクリプト（履歴置き換え・現在地
  ハイライト、`:188-281` 付近）と `BackToTop.astro` には手を入れない
- E2E の置き場: `tests/e2e/blog.spec.ts`。対象記事は画像入りの実記事か、既存の
  e2e-draft-fixture に画像を足すかを実装時に選ぶ

## 備考

- モーダル以外の選択肢（新しいタブで原寸を開く、`<a href>` で画像に直リンク）は、
  ページ遷移が入り「細部を見てすぐ本文に戻る」動線に合わないため推奨しない。
  最終判断は受け入れ条件の運営者承認で行う

## 実装ログ

### 2026-08-29 セッション 1
- 着手判断：当初の「PHASE1E-008 マージ後」を先行着手へ変更（運営者判断）。理由は公開済みの
  後編記事に本文画像 2 枚があり（`src/content/posts/claude-code-devcontainer-tuning/index.md:119,122`）、
  §7 検証の題材が T8 を待たずにそろうため。008 のブランチが持つのは docs だけで、
  本 PBI が触る `astro.config.mjs` / `src/layouts/PostLayout.astro` とは競合しない
  （`git diff --stat origin/main...post/ghostty-herdr-migration` で確認）。
  010 の起票コミット 2 本は 008 のブランチ上にあったので、main から切った本ブランチへ
  cherry-pick して持ち込んだ（INDEX.md の競合は「008 の記述は入れず 010 だけ入れる」で解決）
- 前提確認（README §5.3）：Astro は 7.2.0（`node -e` で実測）。`image.layout` と
  `image.responsiveStyles` は 5.10.0 以降の設定で、7.2.0 の型定義にも存在する
  （`node_modules/astro/dist/types/public/config.d.ts:2057,2069`）。着手前の dist では
  本文画像が `srcset=""` の元解像度 1 本だったことも実測で確認
- やったこと
  - `astro.config.mjs` に `image: { layout: "constrained" }` を追加。markdown の `![]()` 由来にも
    効き、640 / 750 / 828 / 1080 / 1280 / 1310w の webp と `sizes` が出るようになった
  - `src/components/ImageLightbox.astro` を新設し `PostLayout.astro` から呼ぶ。`<dialog>` +
    vanilla script で依存追加なし。PBI の技術メモは「PostLayout に直接置く」だったが、
    BackToTop.astro と同じ「1 部品完結」に揃えた（PostLayout は既に 330 行）
  - `tests/e2e/blog.spec.ts` に 3 本追加（クリック開閉 + 元解像度 / キーボード開閉 /
    スマホ幅の原寸トグル）。`tests/e2e/a11y.spec.ts` の axe 対象に画像入り記事を追加
- 判断したこと
  - `responsiveStyles` は既定の false のまま。有効にすると Astro が img へグローバル CSS を
    足すが、本文画像は Tailwind preflight の `max-width:100%`、カバーは自前の
    `aspect / object-cover` で既に整っており、上書きの手当てを増やす理由が無い
  - 暗幕は `::backdrop` ではなく dialog 自身の背景で描く。見た目は同じで、描画のばらつきが
    少なく実測もできる（開いた状態の背景を実測: RGB 247,246,243 → 44,44,44）
  - 拡大表示の中に「画面に収める ↔ 原寸」のトグルを足した。当初の実装（常に画面に収める）だと
    390px 幅の端末で 1310px の画像が 358px にしかならず、元の困りごと（スクショの文字が読めない）が
    そのまま残っていたため。デスクトップでは元から収まるのでトグルは出さない
- 想定外
  - `max-w-full` を外すだけでは原寸にならない。Tailwind preflight の `img { max-width: 100% }` が
    残るため、原寸側で `max-w-none` / `max-h-none` を明示する必要があった
  - `naturalWidth` は srcset の `w` 記述子があると「実ピクセル ÷ 密度」を返す。390px 幅の端末で
    640w が選ばれたとき 390 と出るので、配信解像度の確認は `currentSrc` で見る
  - デスクトップの `sizes` は `(min-width: 1310px) 1310px, 100vw` で、本文の実表示幅 768px に対して
    過大。markdown 由来の画像に `sizes` を個別指定する手段が Astro に無いため許容した。
    実ファイルは 1310w で 7.6KB、DPR 2 の環境では 1536px 必要なので損にはならない
- 検証（§7）：ローカル（`yarn preview` + Playwright、1440×900 / 390×844）→ push → draft PR #70 →
  CF preview（HTTP 200、branch alias URL）→ CI green（e2e / quality / Workers Builds / CodeQL）
- 運営者承認：2026-08-29。CF preview の記事ページで拡大表示の背景（黒 80%）・右上の閉じるボタン・
  余白と、スマホでの原寸トグルを確認したうえで承認。あわせて「拡大時に読み込むのは元解像度か」を
  確認され、拡大表示に `srcset` を持たせず常に元解像度（1310px）を出す作りであることを回答した

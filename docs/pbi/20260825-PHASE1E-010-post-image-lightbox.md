# 訪問者は記事内の画像をクリックして拡大表示できる

Status: NotStarted

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
- [ ] 記事本文（`.post-body` 配下）の画像がクリックで拡大表示される。カバー画像・
      ロゴ等の本文外の画像は対象外
- [ ] 拡大表示は外部ライブラリ非依存の自前実装（vanilla JS。`<dialog>` ベース想定）。
      SSG 出力に閉じ、既存記事の HTML（markdown 由来の `<img>`）に手を入れずに効く
- [ ] キーボードで操作できる：画像へフォーカス到達 → Enter / Space で開く → Esc で閉じる。
      開いている間フォーカスは拡大表示内に移り、閉じたら元の画像に戻る
- [ ] 拡大できることが見て分かる（`cursor: zoom-in` 等の affordance）
- [ ] `prefers-reduced-motion: reduce` では開閉アニメーションを付けない
- [ ] モバイル実表示で動作する（タップで開閉。OS のピンチズームを妨げない）
- [ ] 画像の無い記事・画像入り記事の両方で表示崩れが無い
- [ ] 本文画像に画面幅別の縮小版と `srcset` / `sizes` が付く（`image.layout` の
      グローバル設定。markdown `![]()` 由来の画像に効いていることを dist の実 HTML で確認）
- [ ] 拡大表示は元解像度を使う（縮小版の引き伸ばしで粗くしない。実表示で確認）
- [ ] グローバル設定の影響範囲を確認した：既存の `<Image>` 利用箇所（BlogCard の
      カバー等）と記事カバーの表示・サイズに退行が無い
- [ ] E2E を追加した（画像クリック → 拡大表示 → Esc で閉じる、の 1 本以上）
- [ ] 最終形の見た目（拡大時の背景・閉じる導線・余白）を運営者がスクショで承認した
      （承認の日付と見たものを実装ログに記録）
- [ ] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし
<!-- 定型（削除禁止。該当しないものは [x] N/A（理由）） -->
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ

- 想定セッション数: 1
- 実行環境: 実装・ローカルスクショ確認はコンテナ（`yarn preview` + repo の Playwright、
  PHASE1E-003 / 004 実績）でも母艦（`yarn dev` + MCP Playwright）でも可。
  E2E スイートは draft PR 経由の CI で検証
- 着手タイミング: PHASE1E-008（記事 T8）のマージ後に main から短命ブランチを切る。
  T8 のスクショ掲載と重ねると §7 検証の題材がそろう
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

（未着手）

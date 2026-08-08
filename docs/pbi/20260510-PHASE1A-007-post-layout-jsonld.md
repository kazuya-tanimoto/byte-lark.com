# 訪問者は記事ページで構造化されたメタ情報と JSON-LD を通じて正しい検索結果表示を得られる

Status: Done
Started: 2026-05-30
Completed: 2026-05-30

## 誰が
- 訪問者

## 何をできる
- 記事ページで統一されたレイアウト（メタ情報・目次・本文）を体験できる
- 検索エンジンが Article JSON-LD を認識し、リッチリザルトに記事情報を表示できる

## なんのために
- Blog 記事詳細ページ（PHASE1A-013）が PostLayout を使う前提のため、先にレイアウトを整備する
- JSON-LD による構造化データで SEO を強化し、検索結果での視認性を高めるため
- 関連: site-plan.md §6.6 / FR-18 / FR-24

## 受け入れ条件
- [x] `src/layouts/PostLayout.astro` を作成（BaseLayout を wrap）
- [x] 記事メタ表示: title / publishedAt / updatedAt / category / tags
- [x] 記事個別の OGP メタ（cover → og:image、未設定時はデフォルト画像）
- [x] Article JSON-LD を `<script type="application/ld+json">` で出力
- [x] JSON-LD に必須フィールド: headline / datePublished / dateModified / author / description / image
- [x] JSON-LD ヘルパ `src/lib/jsonld.ts` を作成（生成ロジック集約）
- [x] SSG 出力 HTML で JSON-LD が静的に含まれることを確認
- [x] `yarn build` 成功
- [x] `yarn check:ts` エラーなし

## 技術メモ
- PostLayout は BaseLayout の上に記事固有の構造（メタ表示・本文エリア・前後リンク枠）を追加
- 前後リンク（前の記事 / 次の記事）は Phase 1a では任意（実装する場合は Blog 記事詳細 PBI と連携）
- JSON-LD の author は Person schema（運営者情報）を使用
- Google Rich Results Test で JSON-LD の妥当性を検証可能

## 実装ログ

### 2026-05-30

やったこと:
- `src/lib/jsonld.ts`: `buildArticleJsonLd()` を作成。author=Person（Kazuya Tanimoto / sameAs GitHub）、publisher=Organization（byte-lark）、mainEntityOfPage を集約。必須フィールド（headline/description/image/datePublished/dateModified）を網羅。
- `src/layouts/PostLayout.astro`: BaseLayout を wrap し `type="article"` を渡す。記事ヘッダ（カテゴリ/公開日/更新日/タイトル/タグ）、任意の目次（render() の headings から depth 2-3 を抽出）、本文 slot を実装。JSON-LD は `<script is:inline type="application/ld+json" set:html slot="head">` で head に静的出力。
- 本文タイポグラフィは `@tailwindcss/typography` 未導入のため、PostLayout 内の scoped `:global` で最小限のみ付与（本格デザインは Phase 1b）。コードハイライトは PHASE1A-002 の shiki(github-light) がそのまま効く。

検証:
- 一時検証ページ（`src/pages/verify-postlayout-tmp.astro`、検証後に削除）で実記事 hello-astro-content-collections をレンダリング。
- `yarn build` 成功 / `yarn check:ts` 0 errors 0 warnings。ビルド済み HTML に JSON-LD が静的に埋め込まれ、必須フィールド全出力・`og:type=article`・cover→`og:image` を確認。
- dev server + Playwright で打鍵検証（運営者が dev server 起動、確認は Claude）。ヘッダ/メタ/目次/本文/フッタすべて意図通り描画。

想定外・学び:
- worktree には node_modules が無い（git worktree は ignored を引き継がない）。yarn berry は worktree 側 install-state を要求するため build 不可。node_modules 丸ごと symlink だと vite が main 側 `.vite` キャッシュに書こうとして sandbox に EPERM。→ **各パッケージを個別 symlink した実 node_modules ディレクトリ**を作り `.vite` 等を worktree ローカルに落とす形で解決（worktree 削除で消える一時対応）。
- dev server のフォント woff2 が 403（Vite `/@fs/` が symlink 先=main 配下を許可外と判定）。symlink 由来の環境アーティファクトで、本番ビルドはフォントをバンドルするため発生しない。
- sandbox はポート bind（listen）を禁止するため dev server は Claude 側で起動不可。運営者に起動依頼する運用が正しい。

PHASE1A-013（Blog 記事詳細）への申し送り:
- 013 は `/blog/[slug].astro` で getCollection + render() し、PostLayout に `title/description/publishedAt/updatedAt/category/tags/ogImage/headings` を渡す。cover の og:image 解決は `getImage({ src: cover, width:1200, height:630, format:"webp" })` の `.src` を ogImage に渡す（検証ページの実装が参考になる）。
- PostLayout はタイトルを h1 として出すので、記事 Markdown 本文の冒頭に `# タイトル` を重複して書かない運用にする（サンプル記事は重複していた。writing-workflow / new-post テンプレ側で揃える）。

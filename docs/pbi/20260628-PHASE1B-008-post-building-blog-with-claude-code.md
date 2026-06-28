# 訪問者は「Claude Code と PBI 駆動でこのブログを作った話」（tech）を読める

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- byte-lark.com をどう設計・構築したか（Astro 6 + Tailwind v4 + Cloudflare Workers、site-plan / PBI / INDEX によるドキュメント駆動、Claude Code 主導の開発フロー）を一次体験として読める

## なんのために
- PHASE1B-007 で確定した初期記事セット 6 本の看板 tech 記事（T1）。AI を「仕組み」に変えて開発を回す運営者の主軸を、このサイト自体を題材に最も説得力ある形で示す
- 関連: site-plan.md FR-19 / Phase 1b / docs/writing-workflow.md / PHASE1B-007（ネタ出し）

## 受け入れ条件
- [ ] 運営者 + Claude でヒアリング（writing-workflow §3）→ Claude が Markdown ドラフト生成（`yarn new-post --slug building-this-blog-with-claude-code --category tech`、`draft: true`）
- [ ] frontmatter 完備：title（`| byte-lark.com` サフィックス無し）/ description（80-120字・OGP 兼用）/ category: tech / tags / publishedAt / slug。本文冒頭に `# タイトル` を重複させない（PostLayout が title を h1 出力。PHASE1A-022 申し送り）
- [ ] 運営者がリライトし `draft: false` に変更（最終承認を実装ログに記録）
- [ ] OGP / Article JSON-LD が記事ページで正しく出力される（headline 汚染なし、`buildArticleJsonLd()`）
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1（ヒアリング → ドラフト → 運営者リライト。運営者リライト待ちは実装フェーズ外）
- カテゴリ: tech / 想定 slug: building-this-blog-with-claude-code（URL は flat /blog/:slug）
- 内容の柱（ネタ出し T1）: Astro 6 + Tailwind v4 + Cloudflare Workers の構成選定 / site-plan・PBI・INDEX によるドキュメント駆動 / Claude Code 主導でフェーズを回す進め方 / 実体験のつまずき（CF が node_modules/.astro をキャッシュ・branch alias は noindex 強制 等）
- cover 画像は任意（`src/assets/posts/` に置いて `<Image>`。`public/` は最適化対象外。PHASE1A-022 申し送り）
- 公開（main マージ）は Phase 1d。feat/phase-1 上では `draft: false` にすれば CF preview（branch alias は noindex）で本番同等表示を確認できる。クロールはされない

## 備考
- `draft-phase1b-content-launch-prep.md` 項目7（記事実装 × n）の正式化。PHASE1B-007 確定の初期セット 6 本のうち 1 本目

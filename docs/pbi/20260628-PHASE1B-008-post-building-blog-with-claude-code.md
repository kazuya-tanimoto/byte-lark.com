# 訪問者は「Claude Code と PBI 駆動でこのブログを作った話」（tech）を読める

Status: InProgress
Started: 2026-06-28

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

## 実装ログ

### 2026-06-28

やったこと
- 着手（InProgress）。このリポジトリの構築履歴（51 本の PBI / コミット弧 / 想定外ログ）を一次情報として読み込み、記事ネタを集約。
- ヒアリング1巡目を実施。質問（背景込み）と運営者回答を `docs/article-interviews/building-this-blog-with-claude-code.md` に集約（セッション跨ぎで消えないため）。以後の取材・ドラフトはこのファイルを参照する。
- 記事方針: 用語（site-plan / INDEX / §7検証ゲート 等）はブログ本文で平易に言い換える（運営者指摘。そのまま使わない）。文体確定後 `docs/writing-style-guide.md` に蒸留予定。

- ヒアリング2〜3巡目＋振り返り（深掘りF）まで完了。事実確認（モデル docs 引用句／Lost in the Middle／公式ベストプラクティスが手法をほぼ追認／コミット由来タイムライン）を取材メモに記録。
- 全文ドラフトを作成（`src/content/posts/building-this-blog-with-claude-code.md`、`draft: true`、本文約6,520字）。`yarn build` 通過（frontmatter 検証 OK）。
- 取材メモの gitignore 方針確定（`docs/article-interviews/` を gitignore。生メモ非公開・完成記事のみ公開）。

残タスク
- 本文が合意レンジ（4,000〜5,000字）超過（約6,520字）。運営者と長さ方針を相談（今 Claude が圧縮 or リライトで調整）。
- 運営者リライト → `draft: false`。
- draft:false 後に §7 検証（ローカル＋CF preview スクショ、OGP / Article JSON-LD 出力確認、E2E/CI green）。
- 「最良モデルを使え」の中の人ブログは未特定（docs 引用で代替。運営者が想起すれば追記）。

### 2026-08-01

やったこと
- 運営者との共同リライト完了（構成再編・向き不向きをまとめへ移動・出典リンク明記）。最終レビュー（誤字11件・表記揺れ・事実修正3件）を反映。本文約5,300字（合意レンジ近傍まで圧縮）。
- 事実修正の内訳：チェックリスト例の「ClaudFlarePages」→ Cloudflare Workers、devcontainer は「近いうちに試したい」→「構築途中で導入済み・詳細は別記事」、コンテナの通信は「必要な通信以外を遮断」に訂正。
- `draft: false` に変更（運営者承認済み）。

残タスク
- §7 検証（ローカル＋CF preview スクショ、OGP / Article JSON-LD 出力確認、E2E/CI green）。

**申し送り（Phase 1d 公開時）**
- 本記事の `publishedAt`（現在 2026-06-28）を **公開当日の日付に更新してから** main マージ・公開すること（運営者指示 2026-08-01）。表示制御は draft のみで日付は出し分けに影響しないため、公開日表記の正しさだけの問題。

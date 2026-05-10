# 運営者は執筆ワークフローに従って効率的に記事を書き、雛形スクリプトで新規記事を作成できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- `docs/writing-workflow.md` に従って、ヒアリング → ドラフト → リライト → 公開の流れで記事を効率的に書ける
- `yarn new-post --slug <slug>` で frontmatter 付きの記事雛形ファイルを生成できる

## なんのために
- 執筆ハードルを下げ、継続的な記事蓄積を実現するため（R-01 対応）
- 記事作成時の手作業（frontmatter 手書き、ファイル作成）を自動化するため
- 関連: site-plan.md §11 / FR-25 / R-01

## 受け入れ条件
- [ ] `docs/writing-workflow.md` を作成（site-plan §11 の骨子を具体化）
- [ ] ヒアリング SOP プロンプト（テーマ → 質問 → 回答 → ドラフト → リライトの流れ）を記載
- [ ] `docs/templates/post-template.md` を作成（§6.3 の frontmatter 全フィールド + 本文構成例）
- [ ] `scripts/new-post.ts` を実装
- [ ] `yarn new-post --slug example-post` で `src/content/posts/example-post.md` が生成される
- [ ] 生成ファイルの frontmatter が §6.3 スキーマ準拠（publishedAt に当日日付が入る等）
- [ ] 既存 slug と重複時にエラーメッセージ表示
- [ ] `package.json` の scripts に `new-post` を追加
- [ ] CLAUDE.md の Build & Test Commands に `yarn new-post` を追記
- [ ] `yarn check:ts` エラーなし

## 技術メモ
- `scripts/new-post.ts` は `tsx` or `ts-node` で実行（Astro プロジェクトなので tsx が入っている可能性あり）
- 文体プロファイル管理（`docs/writing-style/profile.md`）は初期は空テンプレで作成、運営者が記事を書くごとに蓄積

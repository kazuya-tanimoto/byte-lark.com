# 運営者はサンプル記事を処置し、本番ビルドにサンプルが含まれない状態にできる

Status: InProgress
Started: 2026-06-27

## 誰が
- 運営者

## 何をできる
- サンプル記事（`hello-astro-content-collections.md` / `draft-sample.md`）を削除・差し替え・実記事化のいずれかで処置し、本番ビルドからサンプルを除ける

## なんのために
- 公開時に Astro デモ由来のサンプル記事が混ざらないようにする（Phase 1b 着手条件: 初期記事セットが公開状態 / PHASE1A-022 申し送り）
- 関連: site-plan.md FR-08 / Phase 1b（コンテンツ整備）

## 受け入れ条件
- [x] `hello-astro-content-collections.md` と `draft-sample.md` の処置（削除 / 差し替え / 実記事化）を運営者と決定し実施 → 運営者承認のうえ両方削除（2026-06-27）
- [x] 本番ビルド（dist）にサンプル記事が含まれない（または実記事化済み）→ `dist/blog/` は `index.html` のみ、`grep` でサンプル参照ゼロ
- [x] Blog 一覧（/blog）・RSS・sitemap にサンプルが出ない → /blog 空状態、RSS item 0 件、sitemap は 7 URL（記事ページなし）
- [x] `yarn build` 成功 / `yarn check:ts` エラーなし → check:ts 0 errors、build 8 ページ生成成功
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）→ /blog 空状態（1280 / 390）+ home Blog セクションを確認
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）

## 技術メモ
- 想定セッション数: 1（処置のみ。差し替えで実記事を新規に書く場合は 007 で確定する記事実装 PBI 側で扱う）
- 対象: `src/content/posts/hello-astro-content-collections.md` / `src/content/posts/draft-sample.md`
- `draft-sample.md` は frontmatter の `status`（idea / drafting / review / published）で一覧から除外されている可能性 → 実態を着手時に一次確認する（Don't Guess）
- 記事 frontmatter と一覧 / RSS / sitemap の挙動は PHASE1A-012 / 013 / 017 を参照

## 備考
- `draft-phase1b-content-launch-prep.md` 項目5 の正式化

## 実装ログ

### 2026-06-27

やったこと
- 一次確認：技術メモは `status` フィールドを想定していたが、実際の frontmatter は `draft` フィールド（`status` は存在しない）。`draft-sample.md` は `draft: true`、`hello-astro-content-collections.md` は `draft` 指定なし＝公開状態。一覧 / RSS / 詳細（`getStaticPaths`）はすべて `data.draft !== true` でフィルタ。sitemap は `@astrojs/sitemap` が生成ページをクロールする方式で、draft はページ未生成のため自動的に除外（`astro.config.mjs` の filter は `/sample-highlight/` のみで現状は no-op）。
- 処置方針：運営者と決定し両サンプルを削除（実記事の新規執筆は 007+ 側、本 PBI は処置のみ）。恒久デメリット無しと判断（公開は Phase 1d、実記事は 007→008+ で公開前に投入。空状態は実装済みで崩れない。git 履歴に残るためデータ損失なし）。
- 削除：`src/content/posts/hello-astro-content-collections.md` / `src/content/posts/draft-sample.md` / `src/assets/posts/sample-cover.png`（cover の参照元は hello-astro のみ）。
- `git rm` で空になった `src/content/posts/` ディレクトリ自体が消えた。content loader の `base: "./src/content/posts"` が参照するため `.gitkeep` で保持（`**/*.{md,mdx}` パターン外で loader は無視）。
- E2E 調整（サンプルを fixture にしていた箇所）：`blog.spec.ts` を空 Blog 向けに書き換え（空メッセージ表示 + カード/フィルタ非描画を検証）。`a11y.spec.ts` から `/blog/hello-astro-content-collections/` の検証対象を除去。
- 検証：`yarn check:ts` 0 errors。`yarn build` 8 ページ生成成功。`dist/blog/` は `index.html` のみ、`grep` でサンプル参照ゼロ、RSS item 0 件、sitemap 7 URL（記事ページなし）。
- ローカル スクショ（dev server localhost:4322）：/blog 空状態（desktop 1280 / mobile 390）「記事はまだありません。」、home の Blog セクション（見出し + すべて見る、カードなし）を確認。いずれも崩れなし。

想定外・学び
- Astro content layer の data-store キャッシュ（`.astro/data-store.json` / `node_modules/.astro/`）は、記事削除後の sync で「No files found」になっても古いエントリを残し、削除済み画像 `sample-cover.png` を参照してビルドが `[ImageNotFound]` で失敗した。`rm -rf .astro node_modules/.astro`（両方 gitignore 済み・再生成される）で解消。記事削除時はこのキャッシュ消去が必要。
- 公開記事 0 件のとき build が `The collection "posts" does not exist or is empty.` を複数回 WARN するが、エラーではなく 8 ページ生成は成功。実記事投入（008+）で解消。

残タスク（push 後）
- CF preview スクショ確認（branch alias URL）
- E2E / CI green 確認（`scripts/ci-status.sh` で UI Tests / Quality Checks = success）

008+ への申し送り
- 実記事投入時に、削除した blog-detail 系 E2E を再有効化する：一覧→詳細遷移 / カテゴリフィルタ件数 / draft 非表示 / 詳細ページ a11y（`/blog/<実記事 slug>/`）。`tests/e2e/blog.spec.ts` / `tests/e2e/a11y.spec.ts` 冒頭コメント参照。

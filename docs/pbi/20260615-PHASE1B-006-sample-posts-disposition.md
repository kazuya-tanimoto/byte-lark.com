# 運営者はサンプル記事を処置し、本番ビルドにサンプルが含まれない状態にできる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- サンプル記事（`hello-astro-content-collections.md` / `draft-sample.md`）を削除・差し替え・実記事化のいずれかで処置し、本番ビルドからサンプルを除ける

## なんのために
- 公開時に Astro デモ由来のサンプル記事が混ざらないようにする（Phase 1b 着手条件: 初期記事セットが公開状態 / PHASE1A-022 申し送り）
- 関連: site-plan.md FR-08 / Phase 1b（コンテンツ整備）

## 受け入れ条件
- [ ] `hello-astro-content-collections.md` と `draft-sample.md` の処置（削除 / 差し替え / 実記事化）を運営者と決定し実施
- [ ] 本番ビルド（dist）にサンプル記事が含まれない（または実記事化済み）
- [ ] Blog 一覧（/blog）・RSS・sitemap にサンプルが出ない
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）

## 技術メモ
- 想定セッション数: 1（処置のみ。差し替えで実記事を新規に書く場合は 007 で確定する記事実装 PBI 側で扱う）
- 対象: `src/content/posts/hello-astro-content-collections.md` / `src/content/posts/draft-sample.md`
- `draft-sample.md` は frontmatter の `status`（idea / drafting / review / published）で一覧から除外されている可能性 → 実態を着手時に一次確認する（Don't Guess）
- 記事 frontmatter と一覧 / RSS / sitemap の挙動は PHASE1A-012 / 013 / 017 を参照

## 備考
- `draft-phase1b-content-launch-prep.md` 項目5 の正式化

# 訪問者は「devcontainer で Claude Code を自走させる環境を作った話」（tech）を読める

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- Claude Code をコンテナ内で全権限自走させる環境（PHASE1B-016）の設計・構築・運用でぶつかった問題と解き方を、一次体験として読める

## なんのために
- 記事バックログ T9（開発環境 3 連作の 2 本目）。T1 記事（サイト構築総括）で軽く触れた devcontainer の話の本編。公開記事を 3 → 4 本に増やす（Phase 1e の主活動。カテゴリ別一覧 FR-19 は 10 本到達がトリガー）
- 関連: docs/article-backlog.md T9 / docs/devcontainer-plan.md / PHASE1B-016 / docs/writing-workflow.md

## 受け入れ条件
- [ ] 運営者 + Claude でヒアリング（writing-workflow §3）→ Claude が Markdown ドラフト生成（`yarn new-post --slug claude-code-devcontainer --category tech`、`draft: true`。slug は着手時に運営者確認）
- [ ] frontmatter 完備：title（`| byte-lark.com` サフィックス無し）/ description（80-120字・OGP 兼用）/ category: tech / tags / publishedAt（公開当日の日付に更新してからマージ）/ slug。本文冒頭に `# タイトル` を重複させない
- [ ] バックログ T9 のハマりどころ 3 件を本文の柱に含める：① コンテナ内 Claude だけ URL がリンクにならない（`TERM_PROGRAM` 不在 → `--remote-env FORCE_HYPERLINK=1`）② スクショをコンテナに渡せない（CleanShot 保存先を read-only bind mount。素材: `docs/article-interviews/20260809-cleanshot-container-mount.md`）③ 母艦とコンテナの見分けがつかない（statusline に CONTAINER バッジ。「直したのに反映されない」= postCreate コピーと named volume の話、`ccdsh` 追加まで）
- [ ] 運営者がリライトし `draft: false` に変更（最終承認を実装ログに記録）
- [ ] `draft: false` の直前に `yarn fonts` でフォントを作り直す（writing-workflow 8 段構成、PHASE1E-001）
- [ ] OGP / Article JSON-LD が記事ページで正しく出力される（`buildArticleJsonLd()`、headline 汚染なし）
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1（ヒアリング → ドラフト → 運営者リライト。リライト待ちは実装フェーズ外）
- カテゴリ: tech / 想定 slug: claude-code-devcontainer
- 一次情報: `docs/devcontainer-plan.md`（設計・手順）、PHASE1B-016 実装ログ、`.devcontainer/` 実物、`docs/article-interviews/20260809-cleanshot-container-mount.md`（gitignore 対象・経緯素材）
- 連作の位置づけ: T8（ghostty + herdr 乗り換え）→ **T9（本 PBI）** → T10（herdr サイドバー連携）。順序が前後するので、T8 側で持つ予定だった詳細（T12 の入力ソース問題）への言及は本記事では深追いしない
- cover 画像は cover-image skill（tools/imagegen）で生成可
- ヒアリング内容は `docs/article-interviews/` に集約（セッション跨ぎ対策、gitignore 対象）

## 備考
- 記事バックログ T9 の正式化（docs/article-backlog.md）。起票と同時に PHASE1E-004（トップ title / OG 画像）も起票しており、本記事の運営者リライト待ちの間に 004 を進める想定（1 ツリー 1 セッションのため同時進行は逐次）

## 実装ログ

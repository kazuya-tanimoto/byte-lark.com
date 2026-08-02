# 訪問者は「参画案件で Claude Code / Claude Design を使い PO 業務を回す」（tech）を読める

Status: Dropped (2026-08-02、site-plan Decision #29 初期記事セット縮小 6→3 本。ネタ T5 は article-backlog.md へ移管、公開後に R-01 routine で消化)

## 誰が
- 訪問者

## 何をできる
- 実際の参画案件で、PO 業務（要件整理・仕様化・ドキュメント作成・意思決定支援）に Claude Code / Claude Design をどう組み込んで回しているかを、効果と限界こみで読める

## なんのために
- PHASE1B-007 で確定した初期記事セット 6 本の tech 記事（T5）。T1（個人サイト構築）とは別軸の「実務・チームでの AI 活用」を示し、AI を仕組みにする運営者の主軸を実案件で裏づける
- 関連: src/data/career.ts（直近案件）/ Phase 1b / PHASE1B-007

## 受け入れ条件
- [ ] 運営者 + Claude でヒアリング（writing-workflow §3）→ Claude が Markdown ドラフト生成（`yarn new-post --slug claude-code-for-po-work --category tech`、`draft: true`）
- [ ] frontmatter 完備：title（`| byte-lark.com` サフィックス無し）/ description（80-120字・OGP 兼用）/ category: tech / tags / publishedAt / slug。本文冒頭に `# タイトル` を重複させない（PostLayout が title を h1 出力）
- [ ] 運営者がリライトし `draft: false` に変更（最終承認を実装ログに記録）
- [ ] OGP / Article JSON-LD が記事ページで正しく出力される（headline 汚染なし、`buildArticleJsonLd()`）
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- カテゴリ: tech / 想定 slug: claude-code-for-po-work
- 内容の柱（ネタ出し T5）: 実案件での PO 業務に Claude Code / Claude Design を組み込む実践 / T4（個人開発の体制論）と切り口を分ける = こちらは「実務・チーム」軸 / 効果と限界の両面
- 守秘: 参画先・案件を特定できる固有情報（社名・固有要件・人名）は書かない。一般化した知見として書く
- 公開（main マージ）は Phase 1d。feat/phase-1 上では `draft: false` で CF preview 確認可

## 備考
- 初期セット 6 本のうち 4 本目（T5）。運営者ネタ出しで追加（T4 とは別軸）

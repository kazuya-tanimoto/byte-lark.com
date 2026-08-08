# 訪問者は「合う仕事・合わない仕事をストレングスファインダーで言語化する」（life）を読める

Status: Dropped (2026-08-02、site-plan Decision #29 初期記事セット縮小 6→3 本。ネタ L2+L3 は article-backlog.md へ移管、公開後に R-01 routine で消化)

## 誰が
- 訪問者

## 何をできる
- 自分に合う仕事・合わない仕事を、ストレングスファインダーと性格タイプ（ENTJ）で言語化し、案件選びの軸や消耗しない働き方に落とし込む考え方を読める

## なんのために
- PHASE1B-007 で確定した初期記事セット 6 本の life 記事（L2+L3 統合・運営者提案）。About「得意な領域・合う仕事」「持ち味・タイプ」を物語として深掘りし、キャリア観と人物像を伝える
- 関連: src/pages/about.astro（得意な領域 / 持ち味・タイプ）/ Phase 1b / PHASE1B-007

## 受け入れ条件
- [ ] 運営者 + Claude でヒアリング（writing-workflow §3）→ Claude が Markdown ドラフト生成（`yarn new-post --slug work-that-fits-strengthsfinder --category life`、`draft: true`）
- [ ] frontmatter 完備：title（`| byte-lark.com` サフィックス無し）/ description（80-120字・OGP 兼用）/ category: life / tags / publishedAt / slug。本文冒頭に `# タイトル` を重複させない（PostLayout が title を h1 出力）
- [ ] 運営者がリライトし `draft: false` に変更（最終承認を実装ログに記録）
- [ ] OGP / Article JSON-LD が記事ページで正しく出力される（headline 汚染なし、`buildArticleJsonLd()`）
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- カテゴリ: life / 想定 slug: work-that-fits-strengthsfinder
- 内容の柱（ネタ出し L2+L3 統合）: About の得意領域（上流設計・手を動かす）/ 合わない領域（PMO・0→1 企画）を、ストレングスファインダー Top5（最上志向・達成欲・学習欲・活発性・ポジティブ）と ENTJ で裏づけ / 案件選びの軸 / 消耗しない働き方
- About の「得意な領域・合う仕事」「持ち味・タイプ」記述と矛盾させない（診断名は About と同じ表記）
- 公開（main マージ）は Phase 1d。feat/phase-1 上では `draft: false` で CF preview 確認可

## 備考
- 初期セット 6 本のうち 6 本目（L2+L3 統合。運営者提案でストレングスファインダーと掛け合わせ）

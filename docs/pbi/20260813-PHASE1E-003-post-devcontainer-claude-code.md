# 訪問者は「devcontainer で Claude Code を自走させる環境を作った話」（tech）を読める

Status: InProgress
Started: 2026-08-13

## 誰が
- 訪問者

## 何をできる
- Claude Code をコンテナ内で全権限自走させる環境（PHASE1B-016）の設計・構築・運用でぶつかった問題と解き方を、一次体験として読める

## なんのために
- 記事バックログ T9（開発環境 3 連作の 2 本目）。T1 記事（サイト構築総括）で軽く触れた devcontainer の話の本編。公開記事を 3 → 4 本に増やす（Phase 1e の主活動。カテゴリ別一覧 FR-19 は 10 本到達がトリガー）
- 関連: docs/article-backlog.md T9 / docs/devcontainer-plan.md / PHASE1B-016 / docs/writing-workflow.md

## 受け入れ条件
- [ ] 運営者 + Claude でヒアリング（writing-workflow §3）→ Claude が Markdown ドラフト生成（`draft: true`）
- [ ] **前後編 2 本構成**（2026-08-13 運営者決定）：前編 = 設計編（slug: claude-code-devcontainer、隔離の理由と安全原則）/ 後編 = 調整編（slug: claude-code-devcontainer-tuning、ハマりどころ 3 件）。以下の条件は両記事に適用
- [ ] frontmatter 完備：title（`| byte-lark.com` サフィックス無し）/ description（80-120字・OGP 兼用）/ category: tech / tags / publishedAt（公開当日の日付に更新してからマージ）/ slug。本文冒頭に `# タイトル` を重複させない
- [ ] バックログ T9 のハマりどころ 3 件を後編の柱に含める：① コンテナ内 Claude だけ URL がリンクにならない（`TERM_PROGRAM` 不在 → `--remote-env FORCE_HYPERLINK=1`）② スクショをコンテナに渡せない（CleanShot 保存先を read-only bind mount。素材: `docs/article-interviews/20260809-cleanshot-container-mount.md`）③ 母艦とコンテナの見分けがつかない（statusline に CONTAINER バッジ。「直したのに反映されない」= postCreate コピーと named volume の話、`ccdsh` 追加まで）
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

### 2026-08-13

やったこと
- 着手（InProgress）。一次情報 3 本（devcontainer-plan.md / PHASE1B-016 実装ログ / CleanShot マウント経緯メモ）を読了
- ヒアリング 1 巡目完了（質問と回答は `docs/article-interviews/claude-code-devcontainer.md`）。読者像 (a) 放置自走したい Claude Code ユーザー / 経緯を前半に / コード・スクショあり / 安全原則は深掘り / トーンは既存 tech 記事準拠 / タグ確定
- **前後編 2 本に分割**（運営者承認）：安全原則の深掘り + ハマりどころ 3 件を 3,000 字 1 本に入れると両方薄くなるため。前編 = 設計編 / 後編 = 調整編。herdr は端末非依存の書き方で通し、T10 予告リンクに留める。反論想定 2 件（公式 sandboxing との関係 / firewall は IP ベース）は前編に入れる
- 前編ドラフト作成（`src/content/posts/claude-code-devcontainer.md`、`draft: true`、本文約 3,300 字）。後編は雛形 + frontmatter のみ（本文は前編確定後）。`yarn build` 通過（12 ページ、draft は出力対象外）
- 後編ドラフト作成（`src/content/posts/claude-code-devcontainer-tuning.md`、`draft: true`、本文約 3,000 字）。運営者指示により前編確定を待たず執筆。ハマりどころ 3 件を「隔離の副作用（母艦なら届いていたものが届かない）」の軸で通した。statusline バッジ判定と CleanShot マウントはコンテナ内の実物コードを確認して引用。CONTAINER バッジのスクショは TODO コメントで場所だけ確保（コンテナ内からは撮影不可 → 母艦セッションか運営者）。`yarn build` 通過
- 並行作業の運用確認（運営者と合意）：PHASE1E-004 は別クローンの別セッションで並行する。同一クローン 2 セッションは checkout がクローン単位のため不成立。INDEX.md は pull→即コミットで衝突回避

残タスク
- 前編・後編の運営者レビュー / リライト
- 後編の CONTAINER バッジのスクショ差し込み（TODO コメント箇所）
- cover 画像 2 枚（cover-image skill）
- 公開時：publishedAt を公開日に更新、前後編の相互リンク実効確認、`yarn fonts`、§7 検証

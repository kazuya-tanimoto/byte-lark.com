# 訪問者は「alacritty + tmux から ghostty + herdr へ乗り換えた話」（tech）を読める

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- ターミナル環境を alacritty + tmux から ghostty + herdr へ移した動機・何が変わったか・ぶつかった問題を、一次体験として読める

## なんのために
- 記事バックログ T8（開発環境 3 連作の 1 本目）。T9（devcontainer 前後編、PHASE1E-003）を先に公開したため、3 本目 T10（herdr サイドバー連携）に進む前に空いている 1 本目を埋める。公開記事を 5 → 6 本に増やす（Phase 1e の主活動。カテゴリ別一覧 FR-19 は 10 本到達がトリガー）
- 関連: docs/article-backlog.md T8 / docs/writing-workflow.md / site-plan Phase 1e

## 受け入れ条件
- [ ] 運営者 + Claude でヒアリング（writing-workflow §3〜5）→ 回答と深掘りを `docs/article-interviews/ghostty-herdr-migration.md`（gitignore 対象）に残す → Claude が Markdown ドラフト生成（`draft: true`、`src/content/posts/ghostty-herdr-migration/index.md`）
- [ ] 本文に次の 3 点を含める：① 乗り換えの動機（alacritty + tmux で何に困っていたか）② herdr の spaces / agents で作業の何がどう変わったか（場面つき。形容詞だけの評価にしない）③ ハマりどころとして T12（日本語入力が直接入力のまま戻らない件）に触れる。詳細は T12 記事側が持つので、本記事では症状と「原因は herdr の設定だった」までに留める
- [ ] 連作の位置づけを本文で示す：T9 前編 `/blog/claude-code-devcontainer` への内部リンクを張る。T10（未公開）の予告は書かない（profile.md「避ける表現」の未公開予告禁止）
- [ ] frontmatter 完備：title（`| byte-lark.com` サフィックス無し）/ description（80-120 字・OGP 兼用）/ category: tech / tags / publishedAt（公開当日の日付に更新してからマージ）/ slug。本文冒頭に `# タイトル` を重複させない
- [ ] レビュー 1 回目：Claude が subagent で `/article-review` を実行し、指摘を自分で反映して総評「公開可能」にしてから運営者に渡す（writing-workflow §7）
- [ ] 運営者がレビュー・リライト（writing-workflow §8）
- [ ] レビュー 2 回目：`/article-review` を実行し、運営者が承認した指摘だけを反映（writing-workflow §9）。承認内容を実装ログに記録
- [ ] cover 画像を cover-image skill で生成・配置（`cover: ./cover.png`、2000×1050）。生成前に暫定デザイン方針（設計図調 + 雲雀署名、アクセント色ローテーション）を継続するか運営者に確認（skill の毎回手順）。アクセント色は使用済み（橙・桜色・紫）以外から選び、400px で既存 5 本と並べて区別できることを確認。候補の選定は運営者（実装ログに記録）
- [ ] `draft: false` の直前に `yarn fonts` でフォントを作り直し、生成物も一緒にコミット（writing-workflow §10）
- [ ] OGP / Article JSON-LD が記事ページで正しく出力される（`buildArticleJsonLd()`、headline 汚染なし）
- [ ] `yarn build` 成功 / `yarn check` / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）
- [ ] `draft: false` のコミットを打つセッションで Done 化（Status + INDEX 同期 + マージ）まで終える（README §5.4 外形が変わるコミットの例外）
- [ ] 公開後、docs/article-backlog.md から T8 の行を削除（backlog「使い方」のルール）

## 技術メモ
- 想定セッション数: 1（ヒアリング → ドラフト → レビュー 1 回目。運営者リライト待ちは実装フェーズ外）
- カテゴリ: tech / slug: ghostty-herdr-migration / ブランチ: `post/ghostty-herdr-migration`
- 一次情報: 運営者ヒアリング（本記事専用の取材メモは未作成。T9・T10 と違い素材がバックログ 1 行しかないため、ヒアリングの深掘りが本 PBI の要）。herdr の設定・挙動は `docs/article-interviews/20260731-herdr-devcontainer-agent-bridge.md` §1（herdr 0.7.3 の概要、spaces / agents の説明）と T12 の backlog 行（herdr #1221、`switch_ascii_input_source_in_prefix`）を流用可。母艦の dotfiles（`~/dotfiles/herdr/config.toml`、ghostty 設定）はコンテナから読めないため、設定の現物は運営者に貼ってもらう
- 実行環境: devcontainer 前提（本 PBI 起票セッションもコンテナ）。§7 のローカル検証は `yarn preview` + repo の Playwright（コンテナ内 Chromium）で desktop 1280 / mobile 375 を撮る（PHASE1E-003 / 004 で実績。母艦 MCP Playwright は不要）。cover 生成の `tools/imagegen/.venv` は本コンテナに存在（`ls -d tools/imagegen/.venv` で確認済み）。`.env`（Gemini API キー）の有無は生成時に確認する（無ければ PHASE1E-004 実装ログ 2026-08-13 の手順で再構築、または母艦で生成）
- 運営者にしか確認できない事実（設定ファイルの現物・ghostty / herdr の version・挙動）は、前提知識ゼロで打てるコマンド + 報告形式を添えた依頼文 1 通にまとめて渡す（PHASE1E-003 の学び。1 往復で済む）
- herdr の version は取材メモ時点（2026-07-31）で 0.7.3。執筆時点の version と、T12 の herdr #1221 が未修正のままかは未確認 → ヒアリングで確認
- 既存記事（T9 前後編）は端末非依存の書き方で herdr / ghostty に触れていない（`grep -rl "herdr\|ghostty" src/content/posts/` → 該当なし）。本記事がサイト初出なので、初出時に一言の定義を置く（profile.md 初出定義ルール）
- 記事本文の作業前に `docs/writing-style/profile.md` を必読（CLAUDE.md Article Writing）

## 備考
- 記事バックログ T8 の正式化（docs/article-backlog.md）。3 連作の公開順は T8 → T9 → T10 の想定だったが T9 が先行した（PHASE1E-003 技術メモ）。本記事は「T9 の前日譚」ではなく単独で読める作りにし、T9 へのリンクで連作を繋ぐ
- T12（日本語入力の切り分け）は本記事に含めず独立記事のままにする。理由：T12 は調査の型（容疑者の潰し方）が主題で、乗り換え記事に入れると両方薄くなる（T9 を前後編に割った判断と同じ）
- 起票と同時に backlog から公開済み T9 の行を削除した（backlog「使い方」ルールの消し忘れ）

## 実装ログ

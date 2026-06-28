# 訪問者は「個人事業を法人化した話（合同会社バイトラーク設立）」（life）を読める

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- 長く続けた個人事業を 2026 年に法人化（合同会社バイトラーク設立）した経緯・手続き・気づきを、エンジニア視点のリアルな体験として読める

## なんのために
- PHASE1B-007 で確定した初期記事セット 6 本の看板 life 記事（L1）。About「byte-lark について」の事業文脈を物語として補強し、人柄と独立の歩みを伝える
- 関連: src/pages/about.astro（byte-lark について）/ Phase 1b / PHASE1B-007

## 受け入れ条件
- [ ] 運営者 + Claude でヒアリング（writing-workflow §3）→ Claude が Markdown ドラフト生成（`yarn new-post --slug incorporating-bytelark --category life`、`draft: true`）
- [ ] frontmatter 完備：title（`| byte-lark.com` サフィックス無し）/ description（80-120字・OGP 兼用）/ category: life / tags / publishedAt / slug。本文冒頭に `# タイトル` を重複させない（PostLayout が title を h1 出力）
- [ ] 運営者がリライトし `draft: false` に変更（最終承認を実装ログに記録）
- [ ] OGP / Article JSON-LD が記事ページで正しく出力される（headline 汚染なし、`buildArticleJsonLd()`）
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- カテゴリ: life / 想定 slug: incorporating-bytelark
- 内容の柱（ネタ出し L1）: 2026/06/02 合同会社バイトラーク設立（PHASE1B-003 で確定した実データ）/ なぜ法人化したか / 手続きで詰まった点 / 法人化で変わったこと
- About / Footer / Privacy の法人表記（合同会社バイトラーク・2026 年 6 月設立）と矛盾させない
- 公開（main マージ）は Phase 1d。feat/phase-1 上では `draft: false` で CF preview 確認可

## 備考
- 初期セット 6 本のうち 5 本目（L1）

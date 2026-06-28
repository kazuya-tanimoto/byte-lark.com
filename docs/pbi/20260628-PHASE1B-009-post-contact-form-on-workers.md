# 訪問者は「バックエンドなしのサイトに問い合わせフォームを足す」（tech）を読める

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- 静的サイト（SSG）に、サーバーを持たずに問い合わせフォームを足す方法（Cloudflare Workers の関数 + Turnstile によるボット対策 + Resend によるメール送信）を、実装手順とつまずきこみで読める

## なんのために
- PHASE1B-007 で確定した初期記事セット 6 本の tech 記事（T2）。PHASE1B-004 / 005 で実際に作った Contact フォームの実装記。コード例が豊富で実用検索に乗りやすい
- 関連: site-plan.md FR-29 / Decision #26 / PHASE1B-004 / PHASE1B-005 / PHASE1B-007

## 受け入れ条件
- [ ] 運営者 + Claude でヒアリング（writing-workflow §3）→ Claude が Markdown ドラフト生成（`yarn new-post --slug contact-form-on-cloudflare-workers --category tech`、`draft: true`）
- [ ] frontmatter 完備：title（`| byte-lark.com` サフィックス無し）/ description（80-120字・OGP 兼用）/ category: tech / tags / publishedAt / slug。本文冒頭に `# タイトル` を重複させない（PostLayout が title を h1 出力）
- [ ] 運営者がリライトし `draft: false` に変更（最終承認を実装ログに記録）
- [ ] OGP / Article JSON-LD が記事ページで正しく出力される（headline 汚染なし、`buildArticleJsonLd()`）
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- カテゴリ: tech / 想定 slug: contact-form-on-cloudflare-workers
- 内容の柱（ネタ出し T2）: SSG サイトにサーバーレスでフォームを足す設計 / Worker `/api/contact` / Turnstile でボット対策 / Resend でメール送信 / 実体験の落とし穴（CF バージョンが bindings をスナップショット固定 = secret/変数投入後は再ビルド必須。PHASE1B-004/005 実装ログ）
- 通知先・実装の具体は PHASE1B-004 / 005 の実装ログを一次情報として参照する（秘密情報・実メールアドレスは記事に書かない）
- 公開（main マージ）は Phase 1d。feat/phase-1 上では `draft: false` で CF preview 確認可

## 備考
- 初期セット 6 本のうち 2 本目（T2）

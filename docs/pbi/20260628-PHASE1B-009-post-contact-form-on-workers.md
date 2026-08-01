# 訪問者は「バックエンドなしのサイトに問い合わせフォームを足す」（tech）を読める

Status: InProgress
Started: 2026-08-01

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

## 実装ログ

### 2026-08-01 着手・ドラフト作成

やったこと
- ヒアリング（writing-workflow §3、8問）→ 運営者回答。読者=バリバリでない人、トーン=前回記事準拠、読み物は短め・コードで長くなるのは可、ハマりどころ選定は Claude 任せ
- `yarn new-post --slug contact-form-on-cloudflare-workers --category tech` → ドラフト執筆（draft: true）。素材は 004/005 実装ログ・実コード（worker/index.ts, contact.ts, wrangler.jsonc, ContactForm.tsx）・site-plan Decision #26
- ハマりどころは2本に絞る：secret 投入後の再デプロイ必須（バージョンが設定を焼き付ける）/ 末尾スラッシュ 404。React 型・E2E モックの話は読者層に対し細かすぎるため不採用
- 検証: `yarn check:ts` 0 errors / `yarn build` 成功（draft のためページ数不変）

学び・想定外
- 導入の書き方で運営者と複数往復。確定した方針：抽象的な分類（「足りないものが2つ」等）でなく実際の出来事の順で具体的に語る / つまずかなかった箇所（Workers での受け取り処理）を問題として語らない / 他者の選択（mailto 等）を腐さない。文体知見は `docs/writing-style/profile.md` に反映済み
- Cloudflare 自前のメール送信は「ドメインの DNS を Cloudflare 運用」が条件（公式 docs 確認済み、記事にリンク）。DNS が Xserver にある本サイトでは使えず Resend 採用——これが読者向けの実際の選定理由。Decision #26 に CF 自前送信の比較記録は無い（当時の比較対象は mailto/Google Form/SES、MailChannels 終了→Resend の流れ）

残タスク
- 運営者リライト → draft: false → §7 検証（ローカル/CF preview スクショ + CI green）→ Done 化

# 訪問者は Contact ページのフォームから問合せを送信できる

Status: InProgress
Started: 2026-06-22

## 誰が
- 訪問者

## 何をできる
- Contact ページのフォーム UI と Turnstile ウィジェットから入力・送信し、`/api/contact` 経由で問合せを届けられる（mailto は廃止）

## なんのために
- mailto の平文公開と UX 劣化（メーラー未設定環境で無反応）を解消し、フォーム送信に置き換える（Decision #26）
- 関連: site-plan.md FR-29 / FR-11 / Decision #26 / Phase 1b（コンテンツ整備）

## 受け入れ条件
- [x] `src/pages/contact.astro` にフォーム UI（必須項目 + 送信ボタン）を実装 → `ContactForm.tsx`（React Island、`client:load`）を設置
- [x] Cloudflare Turnstile ウィジェットを設置（クライアント）→ explicit render。site key は `PUBLIC_TURNSTILE_SITE_KEY`（未設定時はテストキー）
- [x] 送信時に `/api/contact`（004）へ POST し、成功 / 失敗の状態を画面に表示 → 成功は完了メッセージ、失敗は 429/その他で文言出し分け
- [x] Contact ページ本文と Footer から mailto リンク・平文メールアドレスを撤去する（`src/pages/contact.astro` line 24 付近 + `src/components/Footer.astro` line 39-40。FR-29 の mailto 廃止）。撤去後は /contact への導線に置換 → 両方撤去、Footer は「お問い合わせフォーム」→ /contact、contact ページはフォームに置換
- [x] 入力検証（必須欠落・形式不正）でユーザーにフィードバック、Turnstile 未通過時は送信不可 → 必須/メール形式をフィールド単位で表示、トークン未取得時は送信ブロック
- [ ] フォーム送信〜受信確認の E2E テスト（`tests/e2e/`）を追加し、Turnstile 失敗時の拒否も確認する（テスト用 Turnstile キー or モックを利用）→ `tests/e2e/contact.spec.ts` 追加済（正常系/必須欠落/形式不正/Turnstile 失敗/API 失敗/mailto 撤去の 6 ケース、Turnstile と /api/contact をモック）。CI green は下の E2E/CI 項目で確認
- [ ] 運営者準備を然るべきタイミングで運営者に依頼し、完了を確認する（004 受け入れ条件7と対）：Resend（アカウント・`send.byte-lark.com` ドメイン認証 DNS・API キー）/ Cloudflare Turnstile 本番ウィジェット（site key・secret key）/ 本番 Worker への secret 投入（`TURNSTILE_SECRET_KEY`・`RESEND_API_KEY`）。テストキー仮置きから本番キーへ差し替える
- [ ] 本番キー投入後に実送信テストを1回実施（フォーム→Turnstile→Resend→`tanimoto@byte-lark.com` 受信を確認）し、004 の実送信条件（受け入れ条件3）と合わせて 004・005 をまとめて Done にする
- [x] `yarn build` 成功 / `yarn check:ts` エラーなし → build 成功 / astro check 0 errors・0 warnings・0 hints
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）→ dev server（localhost）でフォーム/Turnstile/Footer 撤去を desktop 1280 + mobile 375 で確認、空送信で必須エラー 3 件表示も実機確認
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）→ push 後
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）→ push 後

## 技術メモ
- 想定セッション数: 1
- 004（`/api/contact`）が前提。004 backend は既にデプロイ済み（InProgress、`/api/contact` 稼働中：GET 405 / POST 503 secret 未投入）。運営者準備＋実送信確認で 004・005 をまとめて Done 化する段取り（004 実装ログ参照）
- Turnstile は公式テストキーを仮置きして運営者準備を待たず先行実装できる。常時成功キー: site `1x00000000000000000000AA` / secret `1x0000000000000000000000000000000AA`（テストキーはダミートークンのみ受理・本番キーは実トークンのみ受理なので必ずペアで使う）。本番キーは運営者準備時に差し替え
- 運営者準備（Resend / Turnstile 本番キー / Workers secret 投入）は 004→005 の境目で一度だけ。受け入れ条件に明記済み（手順依存でなく PBI 条件として強制）
- Turnstile ウィジェットはクライアント JS 必須。フォームは Astro + 小さな `<script>` か React Island で実装。OGP / SEO は静的のまま（フォーム部分のみ JS）
- mailto 撤去対象（2026-06-15 grep 確認）: `src/pages/contact.astro`（`contactEmail` + line 24 付近の mailto）+ `src/components/Footer.astro`（line 39-40 の mailto / 平文アドレス）
- E2E は Bash サンドボックスで Chromium 起動不可 → push 後 CI（`.github/workflows/ui-tests.yml`）で green 確認、スクショは MCP Playwright

## 備考
- `draft-phase1b-content-launch-prep.md` 項目4 を 4b（フロント）として正式化。バックエンドは 004

## 実装ログ

### 2026-06-22 着手・フォーム UI 実装（運営者準備前まで完了）

やったこと
- `src/components/ContactForm.tsx`（React Island）を新規作成。既存の `CategoryFilter`（`client:load`）に倣う
  - 状態: name / email / message / token / fieldErrors / formError / state（idle→submitting→success/error）
  - Turnstile は explicit render（`api.js?render=explicit`）。`ensureTurnstile()` は `window.turnstile` があれば即解決、無ければ script を 1 度だけ注入。E2E では `addInitScript` で `window.turnstile` を差し込むため外部 CDN 非依存
  - 送信契約は 004 実装ログ準拠: `POST /api/contact` `{name,email,message,token}` → 200 で完了メッセージ、429 は混雑文言、その他/例外は再試行文言
  - クライアント検証: 必須欠落 + メール形式をフィールド単位表示、トークン未取得時は POST せず認証要求文言
- `src/pages/contact.astro`: mailto 節を撤去しフォーム（`<ContactForm client:load />`）に置換
- `src/components/Footer.astro`: 平文 mailto を撤去し「お問い合わせフォーム」→ /contact リンクに置換
- `src/env.d.ts`: `PUBLIC_TURNSTILE_SITE_KEY?: string` を型定義（従来 env.d.ts は空だった）
- `tests/e2e/contact.spec.ts`: 6 ケース（正常系で POST body を契約検証 / 必須欠落 / メール形式不正 / Turnstile 失敗で送信拒否 / API 502 失敗 / mailto 撤去）。Turnstile と /api/contact を Playwright でモックし決定論化

site key の本番差し替え方針（手順依存を避ける）
- フォームは `import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA"`（テストキー）を使用
- 運営者は CF の Workers Build 環境変数に `PUBLIC_TURNSTILE_SITE_KEY`（本番 site key）を設定するだけ。コード編集不要。secret（`TURNSTILE_SECRET_KEY` 等）は 004 どおり `wrangler secret`

検証（ローカル 4 ゲート green）
- `yarn check`（biome）/ `yarn check:ts`（astro check 0/0/0）/ `yarn test:run`（30 passed）/ `yarn build` 成功
- MCP Playwright（dev server localhost:4322）: desktop 1280 / mobile 375 でフォーム・Turnstile（テストキー「成功しました!」widget が実描画）・対応領域・Footer の /contact 化を確認。空送信で必須エラー 3 件表示も実機確認。console は React DevTools 案内 + Turnstile preload warning のみ（実害なし）

残タスク（004 と合流して Done 化）
- push 後 CF preview スクショ確認（branch alias）+ `scripts/ci-status.sh` で UI Tests / Quality Checks green 確認
- 運営者準備（Resend / Turnstile 本番ウィジェット / Worker secret 投入 + CF Build env に `PUBLIC_TURNSTILE_SITE_KEY`）→ 実送信テスト 1 回 → 004・005 まとめて Done

学び・想定外
- @types/react 19 は `FormEvent` / `FormEventHandler` を `@deprecated`（"doesn't actually exist"）→ ハンドラ型は `NonNullable<ComponentProps<"form">["onSubmit"]>` を使い check:ts を 0 hints に
- MCP Playwright のブラウザは外部ネットワーク到達可（challenges.cloudflare.com から実 Turnstile が描画された）。一方 Bash サンドボックスは allowlist 制限のまま。E2E は CDN 非依存にモックで実装したのでこの差に左右されない

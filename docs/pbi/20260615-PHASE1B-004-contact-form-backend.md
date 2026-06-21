# 運営者は Worker /api/contact 経由で Turnstile 検証済みの問合せをメールで受信できる

Status: InProgress
Started: 2026-06-21

## 誰が
- 運営者

## 何をできる
- Contact フォームからの送信を受ける Worker エンドポイント `/api/contact` が、Turnstile サーバー検証とレートリミットを通過した正当な送信のみ Resend で `tanimoto@byte-lark.com` へ通知する

## なんのために
- mailto の平文公開は収集ボットに拾われ、メーラー未設定環境では無反応で商談機会を取りこぼす（Decision #26）。フォーム化のサーバー側を用意する
- 関連: site-plan.md FR-29 / Decision #26 / Phase 1b（コンテンツ整備）

## 受け入れ条件
- [x] `wrangler.jsonc` に Worker の `main` スクリプトを追加し、既存の静的 assets 配信（`not_found_handling: "404-page"`）と併存させる（assets binding 経由のルーティング、静的配信を壊さない）→ `main: worker/index.ts` + `assets.binding: ASSETS` 追加。assets-first がデフォルトのため `/api/contact` 以外は ASSETS へ委譲。無破壊は push 後 CF build / branch alias で確認
- [x] `/api/contact`（POST）が Turnstile トークンをサーバー側で検証（siteverify）し、失敗時は送信を拒否（4xx）→ `verifyTurnstile`（公式 siteverify）。失敗時 403、必須欠落 400。Vitest でカバー
- [ ] 検証通過時に Resend で `tanimoto@byte-lark.com` へ通知メールを送信する（送信元は `send.byte-lark.com` サブドメイン認証）→ `sendViaResend`（POST /emails）実装済。実送信テストは運営者の Resend アカウント + ドメイン認証 + Turnstile ウィジェット（フロント 005）が揃ってから
- [x] 同一 IP の連続投稿を抑制するレートリミットを実装する（CF 公式の最新手段を着手時に一次確認: Rate Limiting binding / KV 等）→ 一次確認の結果、CF 公式 Rate Limiting binding（GA、wrangler 4.36+）を採用。`ratelimits`（60 秒 5 件 / IP）。ダッシュボード事前作成不要
- [x] Turnstile secret / Resend API キーは Workers secret（`wrangler secret` orダッシュボード）。リポジトリに置かない → コードは `env` から読む。`.dev.vars` を gitignore 追加、`.dev.vars.example`（公式テストキーのダミー値）のみコミット。実値は運営者が `wrangler secret put` / ダッシュボードで投入
- [x] 異常系（Turnstile 失敗 / 必須項目欠落 / Resend エラー）で適切なステータスとメッセージを返す → 405 / 503（secret 未投入）/ 429（rate limit）/ 400（JSON 不正・検証失敗）/ 403（Turnstile 失敗）/ 502（Resend 失敗）を JSON で返却
- [ ] 運営者準備（Resend アカウント作成・ドメイン認証 DNS レコード登録・API キー発行）の完了を確認する。認証用 DNS レコードは現 Xserver DNS に追加し（NS 移管を待たない）、1d 移管リスト（`draft-phase1d-domain-launch.md`）に含める → 運営者向けセットアップ手順を実装ログに記載。完了確認待ち
- [x] `yarn build` / `yarn check:ts` グリーン、ハンドラのロジックは可能な範囲で Vitest 単体テストを追加 → 4 ゲート green（check:ts / test:run 30 passed / check / build）。`worker/contact.test.ts` 追加、vitest include に `worker/**/*.test.ts`
- [x] ローカル スクショ確認（desktop + mobile）：N/A（バックエンド API のみで画面変更なし。フォーム UI 検証は 005）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：N/A（同上、画面変更なし）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：Quality Checks（check / test:run）green を確認。フォーム経由の UI Tests(e2e) は 005 で確認（CLAUDE.md §7）→ head b56bf8d で Quality Checks=success / UI Tests(e2e)=success / Workers Builds(byte-lark)=success

## 技術メモ
- 想定セッション数: 1（実装スコープは Worker 1 エンドポイントに収まる）。外部アカウント連携のデバッグが伸びて 2 セッション化する場合は §7 に従い「Worker scaffold + ルーティング」と「Turnstile / Resend / レートリミット連携」に必ず再分割する
- `wrangler.jsonc` は現状 assets のみ（`main` 無し、2026-06-15 確認）。`main` 追加時は静的配信を壊さないこと
- Turnstile はサーバー側 siteverify が本命（Decision #26: セッション認証なしのため CSRF より Turnstile + レートリミットが対策の本命）
- Resend: かつて定番だった MailChannels の Workers 無料送信は 2024 年に終了。Resend 無料枠（登録時に最新条件を確認）で月数十件は十分
- 送信元 `send.byte-lark.com` サブドメインで認証。ルートの SPF / DKIM は Xserver メール運用が使用中のため触らない
- 外部依存（Resend アカウント / DNS / API キー）は運営者準備待ち。待つ間も足回り（wrangler `main` 追加・ルーティング・Turnstile 検証ロジック）は先行できる

## 備考
- `draft-phase1b-content-launch-prep.md` 項目4 を 4a（バックエンド）として正式化。フロント（フォーム UI・Turnstile ウィジェット・/api/contact 連携・mailto 撤去・E2E）は 005

## 実装ログ

### 2026-06-21 着手・足回り実装

やったこと
- 一次確認（公式 docs を WebFetch）：
  - Worker + 静的 assets 併存ルーティング → 既定で assets-first、未一致のみ Worker。`assets.binding` で Worker からアセット委譲、`run_worker_first` は使わず既定運用（`/api/contact` は静的に一致しないため Worker に届く）
  - Turnstile siteverify → `POST https://challenges.cloudflare.com/turnstile/v0/siteverify`（secret / response / remoteip 任意、JSON 可）
  - Resend → `POST https://api.resend.com/emails`（Bearer 認証、from/to/subject/html/text/reply_to）
  - レートリミット → CF 公式 Rate Limiting binding が現行手段（GA / wrangler 4.36+、period は 10 or 60 秒、namespace_id は任意識別子でダッシュボード事前作成不要）。KV より設定が軽いため採用
- 実装：
  - `worker/contact.ts`：ロジック層（`validateContactPayload` / `verifyTurnstile` / `buildEmail` + `escapeHtml` / `sendViaResend`）。fetch を引数注入し単体テスト可能に
  - `worker/index.ts`：エントリ。`/api/contact` のみ自前処理、他は `env.ASSETS.fetch` に委譲。処理順は method→secret 未投入(503)→rate limit(429)→JSON parse(400)→検証(400)→Turnstile(403)→Resend(502)→200
  - `worker/contact.test.ts`：Vitest 単体テスト（検証 / Turnstile 成否 / HTML エスケープ / Resend 成否、計新規分）。`vitest.config.ts` の include に `worker/**/*.test.ts` 追加
  - `wrangler.jsonc`：`main` / `assets.binding: ASSETS` / `ratelimits`（60s 5 件/IP）追加
  - secret 運用：`.dev.vars` を gitignore、`.dev.vars.example`（公式テストキーのダミー）をコミット
- 検証（ローカル 4 ゲート green）：`yarn check:ts`（0 errors、worker/ も型検査対象）/ `yarn test:run`（30 passed）/ `yarn check`（biome）/ `yarn build`

フォーム送信契約（フロント 005 と合わせる）
- `POST /api/contact`、`Content-Type: application/json`、body: `{ name, email, message, token }`（token = Turnstile の `cf-turnstile-response`）
- 成功 `200 {ok:true}`、失敗は `4xx/5xx {ok:false, error, details?}`

運営者セットアップ手順（このうち外部・ダッシュボード操作は運営者対応。完了後に本 PBI を Done 化）
1. Resend：アカウント作成 → ドメイン `send.byte-lark.com` を追加・認証 → Resend が提示する DNS レコード（SPF/DKIM 等）を現 Xserver DNS に追加（ルート apex の SPF/DKIM は触らない）→ API キー発行
2. Cloudflare Turnstile：byte-lark.com 用ウィジェット作成 → site key（公開、フロント 005 で使用）と secret key を取得
3. 本番 Worker に secret 投入：`wrangler secret put TURNSTILE_SECRET_KEY` / `wrangler secret put RESEND_API_KEY`（またはダッシュボード）。送信元を変える場合は `CONTACT_SENDER` も
4. 追加した `send.byte-lark.com` の DNS レコードを `draft-phase1d-domain-launch.md` の NS 移管リストに追記（実レコードはセットアップ時に確定）

残タスク
- 上記運営者セットアップ完了 → 実送信テスト（Turnstile ウィジェットはフロント 005 で載るため、実送信の最終確認は 005 と合流）→ Done 化

### 2026-06-21 push 後 CI + 本番 Worker 動作確認

CI（head b56bf8d、`scripts/ci-status.sh`）
- Quality Checks: success / UI Tests(e2e): success / Workers Builds(byte-lark): success

branch alias 実機確認（`https://feat-phase-1-byte-lark.tanimoto-a49.workers.dev`、curl）
- `GET /` → 200、`GET /about` → 307 → `/about/` → 200（Astro 既存の trailing-slash redirect。assets 層の挙動で無変更）、`GET /zzz-does-not-exist` → 404（`not_found_handling: "404-page"` が ASSETS 委譲経由で機能）→ 静的配信の無破壊を実機で確認（受け入れ条件1）
- `GET /api/contact` → 405 `method_not_allowed`、`POST /api/contact {}` → 503 `service_unavailable`（secret 未投入のため設計どおり停止）→ Worker ルーティングと secret ガードが本番で機能
- 実送信（Turnstile 通過 → Resend → tanimoto@byte-lark.com）は secret 未投入 + Turnstile ウィジェット未実装のため未確認。運営者セットアップ + 005 で確認

### 2026-06-21 末尾スラッシュ対応（運営者がブラウザで /api/contact/ → 404 を確認）

事象
- ブラウザで `/api/contact/`（末尾スラッシュ付き）を開くと 404 ページが出た。Worker が `url.pathname === "/api/contact"` の完全一致で判定しており、スラッシュ付きは静的アセット側へ流れて `not_found_handling: "404-page"` の 404 になっていた。サイトは通常ページを末尾スラッシュ付きに揃える設定（`/about` → 307 → `/about/`）のため、スラッシュが付きやすい

対応（commit 4bc5825）
- `worker/index.ts`：`url.pathname` の末尾スラッシュを正規化して判定（`/api/contact` と `/api/contact/` の両対応）。フロント送信（fetch, スラッシュなし）の挙動は不変
- 実機確認（branch alias）：`GET /api/contact` と `GET /api/contact/` がともに 405、`POST /api/contact/ {}` が 503、`/` 200・存在しないパス 404。CI（head 4bc5825）は Workers Builds / e2e / quality すべて success

想定外・学び
- `astro/tsconfigs/strict` の include は `**/*` のため `astro check` が `worker/` も型検査する。`@cloudflare/workers-types` 未導入でも `Request`/`Response`/`fetch`/`URL` は DOM lib で型付くため、`Env` 等は最小インターフェースを自前定義で対応（依存追加=ネットワーク不可を回避）
- `yarn check`(biome) は `src` のみ対象 → `worker/` は lint 対象外。手書きで整形を合わせた

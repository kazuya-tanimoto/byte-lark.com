# 訪問者は Contact ページのフォームから問合せを送信できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- Contact ページのフォーム UI と Turnstile ウィジェットから入力・送信し、`/api/contact` 経由で問合せを届けられる（mailto は廃止）

## なんのために
- mailto の平文公開と UX 劣化（メーラー未設定環境で無反応）を解消し、フォーム送信に置き換える（Decision #26）
- 関連: site-plan.md FR-29 / FR-11 / Decision #26 / Phase 1b（コンテンツ整備）

## 受け入れ条件
- [ ] `src/pages/contact.astro` にフォーム UI（必須項目 + 送信ボタン）を実装
- [ ] Cloudflare Turnstile ウィジェットを設置（クライアント）
- [ ] 送信時に `/api/contact`（004）へ POST し、成功 / 失敗の状態を画面に表示
- [ ] Contact ページ本文と Footer から mailto リンク・平文メールアドレスを撤去する（`src/pages/contact.astro` line 24 付近 + `src/components/Footer.astro` line 39-40。FR-29 の mailto 廃止）。撤去後は /contact への導線に置換
- [ ] 入力検証（必須欠落・形式不正）でユーザーにフィードバック、Turnstile 未通過時は送信不可
- [ ] フォーム送信〜受信確認の E2E テスト（`tests/e2e/`）を追加し、Turnstile 失敗時の拒否も確認する（テスト用 Turnstile キー or モックを利用）
- [ ] 運営者準備を然るべきタイミングで運営者に依頼し、完了を確認する（004 受け入れ条件7と対）：Resend（アカウント・`send.byte-lark.com` ドメイン認証 DNS・API キー）/ Cloudflare Turnstile 本番ウィジェット（site key・secret key）/ 本番 Worker への secret 投入（`TURNSTILE_SECRET_KEY`・`RESEND_API_KEY`）。テストキー仮置きから本番キーへ差し替える
- [ ] 本番キー投入後に実送信テストを1回実施（フォーム→Turnstile→Resend→`tanimoto@byte-lark.com` 受信を確認）し、004 の実送信条件（受け入れ条件3）と合わせて 004・005 をまとめて Done にする
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）

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

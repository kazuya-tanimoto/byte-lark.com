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
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）

## 技術メモ
- 想定セッション数: 1
- 004（`/api/contact`）が前提。004 完了後に着手する
- Turnstile ウィジェットはクライアント JS 必須。フォームは Astro + 小さな `<script>` か React Island で実装。OGP / SEO は静的のまま（フォーム部分のみ JS）
- mailto 撤去対象（2026-06-15 grep 確認）: `src/pages/contact.astro`（`contactEmail` + line 24 付近の mailto）+ `src/components/Footer.astro`（line 39-40 の mailto / 平文アドレス）
- E2E は Bash サンドボックスで Chromium 起動不可 → push 後 CI（`.github/workflows/ui-tests.yml`）で green 確認、スクショは MCP Playwright

## 備考
- `draft-phase1b-content-launch-prep.md` 項目4 を 4b（フロント）として正式化。バックエンドは 004

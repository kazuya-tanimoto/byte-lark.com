# 運営者は Worker /api/contact 経由で Turnstile 検証済みの問合せをメールで受信できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- Contact フォームからの送信を受ける Worker エンドポイント `/api/contact` が、Turnstile サーバー検証とレートリミットを通過した正当な送信のみ Resend で `tanimoto@byte-lark.com` へ通知する

## なんのために
- mailto の平文公開は収集ボットに拾われ、メーラー未設定環境では無反応で商談機会を取りこぼす（Decision #26）。フォーム化のサーバー側を用意する
- 関連: site-plan.md FR-29 / Decision #26 / Phase 1b（コンテンツ整備）

## 受け入れ条件
- [ ] `wrangler.jsonc` に Worker の `main` スクリプトを追加し、既存の静的 assets 配信（`not_found_handling: "404-page"`）と併存させる（assets binding 経由のルーティング、静的配信を壊さない）
- [ ] `/api/contact`（POST）が Turnstile トークンをサーバー側で検証（siteverify）し、失敗時は送信を拒否（4xx）
- [ ] 検証通過時に Resend で `tanimoto@byte-lark.com` へ通知メールを送信する（送信元は `send.byte-lark.com` サブドメイン認証）
- [ ] 同一 IP の連続投稿を抑制するレートリミットを実装する（CF 公式の最新手段を着手時に一次確認: Rate Limiting binding / KV 等）
- [ ] Turnstile secret / Resend API キーは Workers secret（`wrangler secret` orダッシュボード）。リポジトリに置かない
- [ ] 異常系（Turnstile 失敗 / 必須項目欠落 / Resend エラー）で適切なステータスとメッセージを返す
- [ ] 運営者準備（Resend アカウント作成・ドメイン認証 DNS レコード登録・API キー発行）の完了を確認する。認証用 DNS レコードは現 Xserver DNS に追加し（NS 移管を待たない）、1d 移管リスト（`draft-phase1d-domain-launch.md`）に含める
- [ ] `yarn build` / `yarn check:ts` グリーン、ハンドラのロジックは可能な範囲で Vitest 単体テストを追加
- [x] ローカル スクショ確認（desktop + mobile）：N/A（バックエンド API のみで画面変更なし。フォーム UI 検証は 005）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：N/A（同上、画面変更なし）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：Quality Checks（check / test:run）green を確認。フォーム経由の UI Tests(e2e) は 005 で確認（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1（実装スコープは Worker 1 エンドポイントに収まる）。外部アカウント連携のデバッグが伸びて 2 セッション化する場合は §7 に従い「Worker scaffold + ルーティング」と「Turnstile / Resend / レートリミット連携」に必ず再分割する
- `wrangler.jsonc` は現状 assets のみ（`main` 無し、2026-06-15 確認）。`main` 追加時は静的配信を壊さないこと
- Turnstile はサーバー側 siteverify が本命（Decision #26: セッション認証なしのため CSRF より Turnstile + レートリミットが対策の本命）
- Resend: かつて定番だった MailChannels の Workers 無料送信は 2024 年に終了。Resend 無料枠（登録時に最新条件を確認）で月数十件は十分
- 送信元 `send.byte-lark.com` サブドメインで認証。ルートの SPF / DKIM は Xserver メール運用が使用中のため触らない
- 外部依存（Resend アカウント / DNS / API キー）は運営者準備待ち。待つ間も足回り（wrangler `main` 追加・ルーティング・Turnstile 検証ロジック）は先行できる

## 備考
- `draft-phase1b-content-launch-prep.md` 項目4 を 4a（バックエンド）として正式化。フロント（フォーム UI・Turnstile ウィジェット・/api/contact 連携・mailto 撤去・E2E）は 005

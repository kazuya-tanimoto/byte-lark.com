# 訪問者は問い合わせの内容を送信前に確認してから送れる

Status: InProgress
Started: 2026-08-10

## 誰が
- 訪問者（PC / スマホ）

## 何をできる
- 入力 → 確認 → 送信の 3 段階で問い合わせを送れる
- 確認画面から入力へ戻り、書いた内容を保ったまま直せる

## なんのために
- 現状は「送信する」を押した瞬間に送信され、内容を見直す機会がない（運営者要望 2026-08-09）
- 問い合わせは送り直しがきかない性質のもので、宛先の書き間違いに気づけないまま送られる（site-plan Phase 1d）

## 受け入れ条件
- [ ] 入力欄を埋めて確認へ進むと、送る内容（お名前 / メールアドレス / 本文）が読み取り専用で表示される
- [ ] 確認画面から入力へ戻ると、書いた内容が消えずに残っている
- [ ] 入力の検証（必須・メール形式）は確認へ進む時点で行われ、不備があれば確認画面へ進まない
- [ ] 認証（Turnstile）の扱いを決めて実装する。トークンには寿命（既定 5 分）があり、確認画面で長く止まると失効する。失効した状態で送信を押したときに、無言で失敗せず取り直せること
- [ ] 送信後の表示は現行どおり完了メッセージに切り替わる（PHASE1D-013 でページ先頭へ移動する挙動を入れた場合はそれを保つ）
- [ ] 送信に失敗したときは確認画面に留まり、内容が消えないこと
- [ ] `tests/e2e/contact.spec.ts` を新しい手順に合わせて更新する（成功・必須欠落・送信失敗の 3 系統）
- [ ] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `bash scripts/ci-status.sh` で UI Tests / Quality Checks が success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 関連ファイル：`src/components/ContactForm.tsx`、`tests/e2e/contact.spec.ts`
- 現状は `SubmitState` が `idle` / `submitting` / `success` / `error` の 4 値。確認の段階を足す形になる
- 入力値は React の state に持っているので、確認画面から戻したときの保持は追加の仕組みなしで済む
- 送信先の Worker（`/api/contact`）は変更不要の見込み。手順が増えるだけでリクエストの中身は変わらない
- 触ってはいけない領域：Turnstile のサイトキーの扱い（本番は CF のビルド環境変数 `PUBLIC_TURNSTILE_SITE_KEY`。コードに本番値を書かない）

## 備考
- Gate である PHASE1D-009 より先に着手する

## 実装ログ（着手後に追記、中断時は必須）

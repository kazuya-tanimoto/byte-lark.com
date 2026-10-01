# 訪問者は問い合わせの入力が長すぎることを送信前に知れる

Status: Done
Started: 2026-10-01
Completed: 2026-10-01

## 誰が

- 訪問者

## 何をできる

- お名前・メールアドレス・本文が上限の字数を超えたとき、確認画面へ進む前に、どの欄が何字までかを画面で知れる

## なんのために

- 問い合わせフォームの入力チェックが、画面側とサーバー側に別々に書かれていて、中身が食い違っている
  - 画面側 `src/components/ContactForm.tsx:124-144`：空欄とメールの形式だけを見る。字数の上限が無い
  - サーバー側 `worker/contact.ts:18-48`：お名前 100 字・メール 254 字・本文 5000 字の上限を持つ
- そのため本文が 5000 字を超えると、確認画面まで進めたうえで、送信時に
  「送信に失敗しました。お手数ですが時間をおいて再度お試しください。」（`ContactForm.tsx:379-381`）とだけ出る。
  時間をおいても結果は変わらず、原因が訪問者に伝わらない
- メールの形式を見る正規表現 `EMAIL_RE` も 2 箇所に同じものがある（`ContactForm.tsx:124` / `worker/contact.ts:23`）。
  片方だけ直すと、画面では通るのにサーバーで弾かれる状態に戻る
- 関連 FR（site-plan §5）：**FR-29**（`/contact` の問い合わせフォーム化）
- 関連 Phase / PBI：site-plan Phase 1e（Decision #31）/ PHASE1B-004（フォームの backend）/ PHASE1B-005（フォームの frontend）

## 受け入れ条件

<!-- PBI 固有 -->
- [x] 入力チェックを 1 つのファイルにまとめ、`ContactForm.tsx` と `worker/contact.ts` の両方がそれを使う。
      `EMAIL_RE` と上限の字数（100 / 254 / 5000）を定義している箇所が `src/` と `worker/` で 1 箇所だけになる
      （`git grep -n "EMAIL_RE =\|5000" -- src worker ':!*.test.ts'` で確認。テストは字数を直に書くので除く）
- [x] お名前 101 字で「確認へ進む」を押すと確認画面へ進まず、お名前の欄に
      「お名前は 100 字以内で入力してください。」と出る。メールアドレス（255 字）・本文（5001 字）も同じ形で、
      それぞれ「254 字以内」「5000 字以内」と出る
- [x] 上限ちょうど（本文 5000 字）は確認画面へ進める
- [x] 前後の空白は字数に数えない（サーバーが前後の空白を除いてから数えている `worker/contact.ts:31-33` に合わせる）
- [x] 空欄とメール形式のエラー文は今と変えない（`ContactForm.tsx:138-142`）
- [x] サーバーの返すエラーコード（`name_too_long` / `message_too_long` / `email_invalid` など）と
      `/api/contact` の入出力は変えない。`worker/contact.test.ts` の `validateContactPayload` の既存ケースが
      中身を変えずに通る（import 先の変更だけは可）
- [x] Worker が共通化したファイルを読み込んでビルドできる：`wrangler.jsonc` の `main`（`worker/index.ts`）から
      相対パスで読み込み、wrangler のビルドが通ることを確かめる（確かめ方のコマンドは着手時に wrangler の公式 docs で確認し、
      実装ログに書く）。CF preview で実際に 1 回送信して届くことまでは求めない（送信先が本番の通知先のため）
- [x] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし
<!-- 定型（削除禁止。該当しないものは [x] N/A（理由）） -->
- [x] テスト追加：共通化したチェックの unit（vitest。上限ちょうど・1 字超え・前後の空白・各エラー文）を新設し、
      `tests/e2e/contact.spec.ts` に「本文が上限を超えると確認へ進めず、欄にエラーが出る」を 1 件足す（README §4.6 ルール 9）
- [x] ローカル スクショ確認（desktop + mobile）：上限超過のエラーが出た状態の `/contact`（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：同上（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `bash ~/.claude/bin/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ

- 想定セッション数：1
- 実行環境：母艦を推奨。スクショはエラーを出した状態で撮る必要があり、母艦の MCP Playwright なら入力して撮れる。
  コンテナの `scripts/capture-screenshots.mjs` は決まったページを開いて撮るだけで、入力はできない。
  E2E は母艦では動かないので draft PR の CI で確かめる（コンテナなら `yarn test:e2e` も実行できる）
- コンテナで `yarn test:e2e` のあとに `yarn preview` を起動すると、前の preview が残したロック `.astro/preview.json` で
  起動を拒否されることがある（PHASE1D-012 実装ログ。`--force` は効かない）。CI は `.github/workflows/ui-tests.yml` で対処済み
- 置き場所の案：`src/lib/contact-validation.ts`。画面側は `@/lib/...`、Worker 側は `../src/lib/...` の相対パスで読む。
  Worker は Astro の外で wrangler がまとめるので、このファイルでは `@/` の別名・`import.meta.env`・`astro:*` を使わない
- 返り値の形が両側で違う（画面は欄ごとの日本語文 `FieldErrors`、サーバーはエラーコードの配列）。
  共通にするのは「上限の字数・正規表現・何をエラーとするか」で、文言への変換は画面側に置く形が素直。
  形は着手時に決めてよい（運営者判断は不要。受け入れ条件の振る舞いが満たせればよい）
- 字数は JavaScript の `length`（UTF-16 の単位）で数える。絵文字は 1 字で 2 と数えるが、サーバーも同じ数え方なので
  共通化すれば画面とサーバーの判定は一致する。数え方そのものは変えない
- 触らない：Turnstile まわり（`useTurnstile`、`verifyTurnstile`）、送信処理、確認画面の見た目

## 備考

- 起票時の判断（運営者が PBI のレビューで覆せる）：入力欄に `maxLength` は付けない。
  `maxLength` は貼り付けた文を黙って切るため、長い本文の末尾が消えたことに気づかないまま送られうる。
  エラー文で上限を知らせる形にする
- Worker のコードを触るので、マージ後の本番確認（README §10.6）では運営者が本番のフォームから 1 回送信し、
  info@byte-lark.com に届くことを確かめる。Done の条件ではない（Done は CF preview までで確定する）。
  本番の Turnstile を通した実送信は PHASE1D-009 の申し送りで「次に運営者がフォームを触る機会に 1 回通す」とされ、
  2026-08-15 に運営者が到達を確認済み（INDEX.md「次にやること」）。今回は Worker を変えるので、もう一度通す
- サーバーから 400 が返ったときの文言（今は「時間をおいて再度お試しください」）を直すことは範囲外にする。
  画面側で同じチェックを先に通すので、通常の操作では 400 に届かなくなる
- 出所：2026-09-30 のリファクタリング点検（PHASE1E-014 備考と同じ）

## 実装ログ（着手後に追記、中断時は必須）

### 2026-10-01 セッション 1（コンテナ）
- やったこと：`src/lib/contact-validation.ts` を新設。上限の字数・`EMAIL_RE`・欄ごとの判定（`checkContactFields`。返り値は欄ごとの `required` / `too_long` / `invalid`）と、画面用の文言への変換（`contactFieldMessages`）を置いた。文言も同じファイルに置いたのは、上限の数字を文言に埋めるのに定数を 1 箇所で済ませるためと、unit で文言まで確かめるため。Worker は `checkContactFields` だけを読み、エラーコードに直す（長すぎるメールは従来どおり `email_invalid`）
- やったこと：`git grep -n "EMAIL_RE =\|5000" -- src worker ':!*.test.ts'` の結果は `src/lib/contact-validation.ts` の 2 行だけ
- やったこと：テスト追加。`src/lib/contact-validation.test.ts`（9 件）、`worker/contact.test.ts` に「長すぎるメールは `email_invalid`」1 件（既存ケースは無変更）、`tests/e2e/contact.spec.ts` に「本文が上限超え」1 件。vitest 60 件・E2E 64 件（コンテナで `yarn test:e2e`）とも通過
- Worker のビルド確認：wrangler 公式 docs（https://developers.cloudflare.com/workers/wrangler/commands/workers/ の `deploy`）で `--dry-run`（デプロイせずにまとめるだけ）と `--outdir`（まとめた成果物の出力先）を確認し、`yarn build` の後に `npx wrangler deploy --dry-run --outdir <一時ディレクトリ>` を実行（wrangler 4.145.0、exit 0、ログイン不要）。出力の `index.js` に `checkContactFields` が入り、画面用の文言（「字以内」）は入っていない（使わない export は落ちる）
- スクショ：入力して撮る必要があるので、`@playwright/test` の chromium で入力 → 「確認する」→ フォームを撮る一時スクリプトを scratchpad に書いて撮った（repo には置かない）。ローカル（`yarn dev`）・CF preview（https://feat-contact-validation-shared-byte-lark.tanimoto-a49.workers.dev/contact ）とも desktop / mobile で 3 欄の上限エラーが出て確認画面へ進まないこと、上限ちょうど + 前後の空白で確認画面へ進むことを確認
- CI：PR #124 で Quality Checks / UI Tests とも success
- 学び：受け入れ条件の「確認へ進む」ボタンは、実際の文言が「確認する」。振る舞いの条件としてはそのまま満たしている
- 想定外：コンテナで `yarn test:e2e` を叩いたら、Playwright の webServer（`yarn preview`）が「exited early」で止まった。Astro 6 の `astro preview` / `astro dev` は起動後に自分を裏へ回して（`--json` 付きの別プロセスで常駐し、`astro dev stop` で止める形）コマンド自体はすぐ終わるため、Playwright が終了と見なしたと推測。常駐した preview が 4321 で応答していたので、2 回目は `reuseExistingServer` で通った。CI（`CI=true`、reuse しない）は緑なので CI 側には影響なし。PHASE1D-012 のロックの件と同じ根の可能性があるが未調査
- 想定外：CF preview のスクショは、和文が端末側の書体で描かれていた（ローカルは Noto Sans JP）。`yarn fonts:check` は「文字カバー OK」で、新しい文言の字はサブセットに入っている。初回読み込みで web フォントが間に合わなかっただけと推測（未確認）
- 残タスク：マージ後に運営者が本番のフォームから 1 回送信し、info@byte-lark.com に届くことを確かめる（備考どおり。Done の条件ではない）

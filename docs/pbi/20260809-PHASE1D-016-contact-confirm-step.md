# 訪問者は問い合わせの内容を送信前に確認してから送れる

Status: Done
Started: 2026-08-10
Completed: 2026-08-10

## 誰が
- 訪問者（PC / スマホ）

## 何をできる
- 入力 → 確認 → 送信の 3 段階で問い合わせを送れる
- 確認画面から入力へ戻り、書いた内容を保ったまま直せる

## なんのために
- 現状は「送信する」を押した瞬間に送信され、内容を見直す機会がない（運営者要望 2026-08-09）
- 問い合わせは送り直しがきかない性質のもので、宛先の書き間違いに気づけないまま送られる（site-plan Phase 1d）

## 受け入れ条件
- [x] 入力欄を埋めて確認へ進むと、送る内容（お名前 / メールアドレス / 本文）が読み取り専用で表示される
- [x] 確認画面から入力へ戻ると、書いた内容が消えずに残っている
- [x] 入力の検証（必須・メール形式）は確認へ進む時点で行われ、不備があれば確認画面へ進まない
- [x] 認証（Turnstile）の扱いを決めて実装する。トークンには寿命（既定 5 分）があり、確認画面で長く止まると失効する。失効した状態で送信を押したときに、無言で失敗せず取り直せること
- [x] 送信後の表示は現行どおり完了メッセージに切り替わる（PHASE1D-013 でページ先頭へ移動する挙動を入れた場合はそれを保つ）
- [x] 送信に失敗したときは確認画面に留まり、内容が消えないこと
- [x] `tests/e2e/contact.spec.ts` を新しい手順に合わせて更新する（成功・必須欠落・送信失敗の 3 系統）
- [x] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `bash scripts/ci-status.sh` で UI Tests / Quality Checks が success）（CLAUDE.md §7）

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

### 2026-08-10

やったこと

- `ContactForm.tsx` を入力 → 確認 → 送信の 2 画面に変更。`step`（input / confirm）を足しただけで、値は従来どおり React の state が持つので戻ったときの保持に追加の仕組みは要らなかった
- 確認画面はカード（`bg-card` / `shadow-card`）に `dl` で 3 項目。本文は `whitespace-pre-wrap` で改行をそのまま見せる（届くメールも改行を保つため）。ボタンは「修正する」（outline）と「送信する」の 2 つ、入力画面は「確認する」1 つ
- Turnstile の扱いを決めた（下の「決めたこと」）。あわせて**送信がサーバーに届いたあとの失敗でもウィジェットを reset** するようにした。Worker はメール送信より前に siteverify を済ませるので、502 のあと同じトークンで押し直すと今度は 403（token 使用済み）で落ちる——確認画面ができて「失敗しても画面に留まって押し直す」が普通の動線になるため、ここで直した
- 画面の切り替えで、フォームを含む節（`section`）を頭出しし焦点も移す。確認は見出し「この内容で送信します」、戻るときはお名前欄
- `contact.astro` の節に `scroll-mt-20` を追加（PostLayout の見出しと同じ 5rem）
- 複雑度の上限（Biome の `noExcessiveCognitiveComplexity`、15）に引っかかったので `useTurnstile` フック / `TextField` / `ConfirmPanel` に分割
- E2E を 6 → 9 本に増やした（正常系を確認経由に / 戻って直して送る / 確認画面で認証が切れて取り直す / 確認画面の axe / 送信失敗は確認画面に留まる）

決めたこと（Turnstile）

- ウィジェットは入力・確認のどちらでも**同じ DOM ノードに描き続ける**（JSX 上の位置を変えていないので React が使い回す）。確認画面で描き直す案は採らなかった——公式 docs（[Client-side rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/) / [Configurations](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/)）でトークンの寿命は 300 秒、`refresh-expired` の既定は `auto`（期限切れで自動更新）なので、描き続けるほうが確認画面で止まっている間も勝手に更新されて有利
- それでも自動更新の待ち時間に当たると一瞬トークンが無い。その状態で送信を押したら、黙って失敗させず `reset()` して案内を出す（ウィジェットは同じ画面にあるので、対話が要る場合もその場で解ける）。文面は一度でもトークンを受け取ったかで出し分け（期限切れ / 未認証）

学び

- 確認の段階を足すと、それまで表に出なかった「トークンは 1 回しか使えない」性質が普通の動線に乗ってくる。画面を増やす変更は、状態の寿命を持つものを一通り洗い直す必要がある
- 頭出しはフォームの上端に合わせると、直上の h2「お問い合わせフォーム」が sticky ヘッダーに半分隠れて据わりが悪い（最初の実装で実測）。節ごと頭出しに変えて見出しから見えるようにした

想定外

- コンテナの firewall で `challenges.cloudflare.com` に届かない（`curl` が 000）。スクショ検証は本物と同じ寸法（300×65）の枠を置くスタブに差し替えて配置だけ見た。PHASE1C-008 の「外部 CDN 由来のものはコンテナのスクショでは検証できない」と同じ制約
- `git add -A` が権限で弾かれた（パス指定の `git add` は通る）
- Done 化のあと運営者指摘 3 件で作り直し。①「入力へ戻る」は訪問者に一度も示していない画面名を前提にしていて座りが悪い → 定番の「戻る」「修正する」を提示して「修正する」を採用（最初に推した「書き直す」は平易さを優先して定番から外れており、運営者指摘のとおり実フォームでほぼ見ない文言だった）。② 画面の切り替えで滑らせるスクロールがスマホでちらつく → 実測でスマホ 927px（画面の高さ 844px より長い）／PC 459px を流していた。行き先は要るが動かして見せる意味はないので `behavior: "instant"` で上書き（送信完了の先頭戻りも同様に揃えた）。③ 見出しの「この内容で」は指し先が曖昧なので「以下の内容で送信します」に、直し方を説明する一文はボタン名で足りるため削除
- `yarn test:e2e` は `playwright.config.ts` の `webServer` が `yarn preview` を起動する形だが、この repo の `preview` は常駐サーバーを立てて即終了するラッパーなので、Playwright からは「起動直後に落ちた」と見える。**4321 に preview が生きていることが前提**（`reuseExistingServer`）。古い dev サーバーが 4321 を掴んだままだと、ビルド前のコードでテストが走る（今回、ラベル変更が反映されず 2 件落ちて気づいた。PHASE1C-014 のポート取り違えと同種）

## 検証報告

- ローカル確認：`yarn dev`（4322）+ Playwright で desktop 1280×900 / mobile 390×844 の 2 幅、入力 → 検証エラー → 確認 → 送信失敗 → 入力へ戻る → 送信完了の 6 場面を撮影。確認画面は見出し「お問い合わせフォーム」が sticky ヘッダーの下に収まり、カード・認証・ボタン 2 つがスマホでも 1 画面に収まる。実測：確認へ進んだあとの見出し位置は両幅とも画面上端から 164px、焦点は「この内容で送信します」／入力へ戻ると焦点はお名前欄で本文の値は保持／送信完了は両幅とも scrollY 0（PHASE1D-013 の挙動を維持）
- CF preview 確認：https://feat-phase-1-byte-lark.tanimoto-a49.workers.dev/contact 同じ 6 場面 × 2 幅を撮影し、ローカルと差異なし（数値も一致）
- E2E/CI 確認：`scripts/ci-status.sh`（head e960e90）で UI Tests = success / Quality Checks = success、check-runs も e2e・quality・Workers Builds すべて success。ローカルは `yarn test:e2e` 39 件 green（Contact 9 件）、`yarn build` / `check` / `check:ts` / `test:run`（30 件）もエラーなし
- 追加確認（同日、運営者指摘）：戻りボタンを「修正する」に変更。確認画面の見出しは「以下の内容で送信します」、直し方を説明する一文はボタン名だけで足りるため削除。画面切り替えの頭出しを一息に変更し、CF preview で scroll イベント 16〜20 回 → 1 回・行き先は変わらず（scrollY 187 / 243）を実測。文言の最終形（head 13182ea）でローカル / CF preview のスクショを 6 場面 × 2 幅で取り直し、`scripts/ci-status.sh` で UI Tests / Quality Checks / Workers Builds とも success、ローカル E2E も 39 件 green
- 未検証項目：本物の Turnstile ウィジェットの見た目と、実時間 300 秒での失効。コンテナから `challenges.cloudflare.com` に到達できない（`curl` が 000）ため、スクショは同寸法（300×65）の枠を置くスタブ、失効は `expired-callback` を呼ぶ E2E で代替した。実送信（Worker 経由でメールが届くところまで）も未実施——PHASE1B-004 で実測済みかつリクエストの中身は変えていない

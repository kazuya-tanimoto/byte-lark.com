# 運営者はアクセス状況と検索インデックス状況を確認できる

Status: Done
Started: 2026-08-08
Completed: 2026-08-08

## 誰が
- 運営者

## 何をできる
- Cloudflare Web Analytics でアクセス状況を、Google Search Console でインデックス状況を確認できる。SNS シェア時の OGP 表示も実検証済みの状態にできる

## なんのために
- 公開後の反応（流入・検索掲載・シェア表示）を観測できる状態を公開直後から確保するため
- 関連: Phase 1d / draft-phase1d-domain-launch.md「解析・検索エンジン」/ PHASE1A-020（OGP 実検証の移管元）

## 受け入れ条件
- [x] Cloudflare Web Analytics を有効化（proxied ゾーンの自動注入）→ 本番 HTML に beacon が注入されていること + ダッシュボードにデータが記録されることを確認
- [x] Google Search Console にプロパティ登録（DNS 認証。CF ゾーンに TXT 追加）
- [x] sitemap-index.xml を送信し、受理されることを確認
- [x] OGP 実検証：主要ページ + 記事 1 本以上（PHASE1A-020 から移管された項目）
  - [x] 本番 HTML のタグ実測（og:title / description / url / image / type / site_name、twitter:card、画像の到達性と寸法）
  - [x] Facebook Sharing Debugger でトップと記事 1 本を検証：N/A（運営者がどのアカウントか特定できず今回は実施しない。タグ実測をもって代替し、受け取り側の描画確認は PHASE1D-009 Gate に申し送り）
  - [x] X（Twitter）Card Validator：2026-08-08 時点で公式 validator（cards-dev.twitter.com/validator）は廃止済み（アクセスすると X のログイン画面へリダイレクトすることを実測）。運営者決定により X 側の描画検証は実施しない＝本番 HTML のタグ実測をもって OGP 検証とする（受け取り側の描画確認は Facebook 分とあわせて申し送り）
- [x] ローカル スクショ確認：N/A（ダッシュボード設定のみ、コード変更なし。beacon は CF 自動注入）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上。確認は本番 URL で行う）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：N/A（同上。push は PBI ファイルの docs のみ）（CLAUDE.md §7）

## 技術メモ
- PHASE1D-004（カスタムドメイン接続）完了後に実施
- Web Analytics の beacon 注入はゾーン設定（コード変更不要）。注入確認は本番 HTML を curl で見る

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-08 着手：本番実測（MCP Playwright、https://byte-lark.com）

#### Web Analytics の beacon（コード側の確認分）
- ブラウザ実表示で `https://static.cloudflareinsights.com/beacon.min.js/v4513226…` が読み込まれ、`POST /cdn-cgi/rum` が **204** を返す＝ CF の自動注入が効いていて計測データも送信されている
- 注意：ページ内 `fetch()` で同じ HTML を取り直すと beacon タグは含まれない。CF の注入はブラウザのドキュメント要求に対して行われるため、`curl` / `fetch` の生 HTML で「注入なし」と見えても異常ではない（判定はブラウザ実表示で行う）
- 残り：ダッシュボード側にサイト項目があり数字が入っていることの確認（運営者操作）

#### robots / sitemap
- `/robots.txt` 200・`User-agent: * / Allow: /` + `Sitemap: https://byte-lark.com/sitemap-index.xml`
- `/sitemap-index.xml` 200（application/xml）→ `/sitemap-0.xml` に **11 URL**（トップ / about / blog / career / contact / credits / privacy / skills + 記事 3 本）

#### OGP タグ実測
| 対象 | og:image | 備考 |
|---|---|---|
| トップ / About / Blog 一覧 | `/og-default.png`（200、PNG 1200×630、3.1KB） | og:type=website |
| 記事（building-this-blog-with-claude-code） | `/_astro/cover.…webp`（200、image/webp、67KB） | og:type=article、タイトル・説明は記事固有 |
- 全ページで `og:url` が本番の絶対 URL、`og:site_name` = byte-lark.com、`twitter:card` = summary_large_image を確認
- console エラー 0 件

#### Web Analytics のサイト登録（ダッシュボード側、運営者操作）
- ダッシュボードの入口が 2 か所あり紛らわしい。**アクセス数を見るのはアカウント直下**（`https://dash.cloudflare.com/?to=/:account/web-analytics`）。ドメイン内の Analytics → Web analytics は Observatory の RUM 欄（速度計測）で別物
- アカウント直下は「Get started with Web Analytics」＝サイト未登録の状態だった。無料プランは RUM が自動で有効なので beacon だけ先に動いており、Web Analytics のサイト項目は別途登録が要る
- hostname に `byte-lark.com` を選んで登録 → 直近 24 時間のデータが即座に表示。**beacon の識別子は登録前後で同一（`1a5d5d08…`）＝コード変更も再デプロイも不要**（登録後に /blog/ で再実測、`POST /cdn-cgi/rum` 204 を確認）
- 表示された実測値（2026-08-08 18:09 JST、直近 24 時間、bot 除外）：Visits 44 / Page views 52 / Page load time 661ms / Core Web Vitals は LCP・INP・CLS すべて Good（LCP は Good 100%、P50 388ms / P75 620ms / P90 828ms / P99 1,788ms）
- **PHASE1D-010（フォントサブセット化）への材料**：実ユーザーの LCP P75 は 620ms で Good 判定。004 の Lighthouse（研究室条件のシミュレーション）で Performance 59〜82 だったのとは評価が食い違う。010 の実施是非を決めるときは、この実測値も判断材料に入れる

#### Google Search Console 登録とサイトマップ送信（運営者操作 + Claude 実測）
- プロパティ種別は「ドメイン」（apex / www / サブドメインを 1 件で扱えるため）。所有権確認は DNS 方式
- Google は DNS 事業者を Cloudflare と判別して自動連携（Google に Cloudflare DNS の操作を許可してレコードを自動投入する方式）を提示してくるが、**手動方式を選択**。理由：byte-lark.com の DNS にはメール系（MX / SPF / DKIM / DMARC）が全て載っており、外部サービスに DNS 書き込み権限を常設したくないため。「手順」のドロップダウンで **その他** を選ぶと貼り付け用の TXT 値が出る
- CF に追加したレコード：TXT / `@` / `google-site-verification=Tp4gsCz8sNkob5ERuCAmdO__bUhnrKpxaURdKGqEYes` / TTL Auto（既存の SPF TXT は無変更、apex の TXT は 2 本並列に）
- 反映確認（Claude、ブラウザから DoH 実測）：`dns.google` と `cloudflare-dns.com` の両方で当該 TXT を取得、同時に SPF（`v=spf1 +a:sv16806.xserver.jp …`）が無傷であることも確認
- 所有権確認を通過 → サイトマップ送信。**ドメイン プロパティの入力欄はファイル名だけでは不可、URL 全体（`https://byte-lark.com/sitemap-index.xml`）が必要**
- 送信結果：型「サイトマップ インデックス」/ ステータス **成功しました** / 送信・最終読み込みとも 2026/08/08。検出されたページ数は 0 表示だが、これは索引ファイル（子は `sitemap-0.xml` 1 本、11 URL）を送ったためで、子の読み込み後に数が入る

#### 運営者決定（2026-08-08）
- ダッシュボード操作（CF Web Analytics 確認 / GSC 登録 / DNS TXT 追加 / sitemap 送信）は運営者が手で実施。Claude は手順提示と実施後の反映確認・実測を担当
- X のカード描画検証は省略（公式 validator 廃止のため）。受け入れ条件を書き換え済み
- Facebook Sharing Debugger も今回は実施しない（どのアカウントか特定できないため）。タグ実測で代替し、下記の申し送りに回す

#### 次 Phase / Gate への申し送り
- **SNS カードの受け取り側での描画は未検証**。ページ側のタグ・画像は実測済み（og / twitter 一式、既定画像 1200×630、記事は個別カバー webp が 200）だが、Facebook・X いずれのクローラーがどう描画するかは見ていない。実際に SNS へ投稿する機会が来たときに実物で確認し、崩れていれば対応 PBI を起票する（PHASE1D-009 の棚卸し表で再判定）
- **実ユーザーの表示速度は良好**（LCP P75 620ms、CWV 3 指標 Good）。PHASE1D-010（フォントサブセット化）の実施是非は、この実測値と 004 の Lighthouse 値の食い違いを踏まえて判断する

#### 想定外
- 着手直後、apex への HTTPS 接続が一度だけ `ERR_CERT_DATE_INVALID` で失敗（同時刻に他サイトは正常）。再アクセスで解消し、以後は再現なし。CF エッジ証明書の切り替わりに当たった一過性のものと判断（監視は PHASE1D-007 で入るため、そちらで再発を拾えるようにする）

# 運営者はメールを止めずに byte-lark.com の DNS 管理を Cloudflare へ移せる

Status: Done
Started: 2026-08-08
Completed: 2026-08-08

## 誰が
- 運営者

## 何をできる
- byte-lark.com のゾーンを Cloudflare に作成し NS を切り替えても、Xserver のメール送受信と Resend（Contact 通知）が無停止で動き続ける状態にできる

## なんのために
- Workers カスタムドメイン接続は自アカウントの Active ゾーンが前提で、Free プランのゾーン作成はフルセットアップ（NS 移管）一択のため（2026-06-13 調査、2026-08-08 公式 docs 再確認）
- 関連: Phase 1d / draft-phase1d-domain-launch.md「NS 移管」/ PHASE1A-018（Moved 元）

## 受け入れ条件
- [x] 着手時に dig で現 DNS を再取得し、2026-06-13 調査（draft-phase1d-domain-launch.md 記載）との差分を確認。Xserver 側のレコード一覧をエクスポート / スクショで保全
- [x] CF にゾーン追加 → インポートされたレコードを現 Xserver DNS と全件突合（MX / SPF / DKIM、特に Resend 用の `resend._domainkey.send` TXT・`send` サブドメインの MX / SPF を漏れなく。欠けると Contact フォームの通知が壊れる）
- [x] NS 切替前に CF ゾーン側で設定：MX を `sv16806.xserver.jp` 直指しへ変更 / SPF から `+a:byte-lark.com` を削除 / DKIM（`default._domainkey`）をコピー / DMARC（`_dmarc`、`p=none`）を新設
- [x] apex A / www CNAME は現状のまま移し、proxy は DNS only にして挙動を変えない（サイト表示の切替は 004、www の畳みは 005 で行う）
- [x] レジストラ（Xserver）で NS を CF 指定値へ変更 → CF ゾーン Active 化を確認
- [x] 伝播確認後にメールテスト：`tanimoto@byte-lark.com` / `info@byte-lark.com` の両方で送受信、Contact フォーム実送信で info@ に通知が届くこと（Resend 経路の生存確認）
- [x] 移管後の全レコード最終状態を実装ログに記録
- [x] ローカル スクショ確認：N/A（DNS 作業のみ、サイトのコード・出力に変更なし）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：N/A（同上。push は PBI ファイルの docs のみ）（CLAUDE.md §7）

## 技術メモ
- NS 伝播は数分〜数時間。新旧 NS が混在回答する間はメールテストしない（draft 技術メモ）
- CF のゾーン追加時レコードスキャンは全件を拾わないことがある → 必ず手動で突合する
- MX の配送先実態は変わらない（A が同一 IP のため）。切替はゾーン管理の場所だけ

## 備考
- メール無停止が本 PBI の最優先。サイト表示は本 PBI 完了時点では従来どおり（Xserver 初期ページ / Netlify 旧サイト）で構わない

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-08 実施記録

#### 移管前調査（11:25、dig @ns1.xserver.jp）
- 2026-06-13 調査との差分：ワイルドカード `*` A レコードの存在が新規判明（存在しない名前への probe で検出）。`mail` / `ftp` / `pop` / `smtp` / `autoconfig` / `autodiscover` / `send` は個別レコードではなくすべて `*` のヒットだった（Xserver パネルの全レコード一覧で確定）
- Xserver 一覧はスクショで保全（byte-lark.com は 16 行 = NS 5 本 + 実レコード 11 本）。Resend ダッシュボード（send.byte-lark.com、Verified、ap-northeast-1）もスクショ保全
- DKIM 2 本（apex 2048bit / Resend 1024bit）は dig 実測値と投入値を 1 文字単位で機械照合し、openssl で公開鍵として妥当なことを確認
- DNSSEC は無効を確認（レジストリ DS なし / DNSKEY なし / ad フラグなし）→ NS 切替でドメインが引けなくなるリスクなし

#### CF ゾーン追加（Free プラン、Worker `byte-lark` と同一アカウント）
- 自動スキャンは 6 件（`*` A / apex A / www CNAME / apex MX / SPF TXT / DKIM TXT）。手動で 6 件追加し全 12 件に
- 全レコード DNS only（グレー）・TTL Auto。スキャン直後は A 3 件と CNAME が Proxied だったため手動でグレー化
- 「Block training in robots.txt」は OFF（リポジトリの public/robots.txt を正とするため）
- 意図した変更 3 点：MX apex → `sv16806.xserver.jp` 直指し（優先度 0、同一 IP のため受信実態は不変）/ SPF から `+a:byte-lark.com` 削除 / `_dmarc` TXT 新設 `v=DMARC1; p=none;`

#### NS 切替と伝播
- 13:09 頃 Xserver ドメインパネルで NS を `cheryl.ns.cloudflare.com` / `javier.ns.cloudflare.com` へ変更
- 13:10 時点で .com レジストリ + リゾルバ 3 系統（8.8.8.8 / 1.1.1.1 / 9.9.9.9）すべて CF の NS を返却（伝播は約 10 分で完了）

#### メールテスト（すべて正常）
- tanimoto@ ⇔ 外部アドレス：送受信 OK
- info@ ⇔ 外部アドレス：送受信 OK
- Contact フォーム実送信（branch alias /contact、MCP Playwright）：Turnstile 自動通過、`POST /api/contact` 200、info@ に Resend 経由の通知着信を確認

#### 移管後の最終状態（13:18、dig @cheryl.ns.cloudflare.com、全 12 レコード）
| Type | Name | Content | 備考 |
|---|---|---|---|
| A | `@` | 85.131.209.167 | そのまま / DNS only |
| A | `*` | 85.131.209.167 | そのまま / DNS only |
| A | `xserver` | 85.131.209.167 | そのまま / DNS only |
| CNAME | `www` | byte-lark.netlify.app | そのまま / DNS only |
| MX | `@` | sv16806.xserver.jp（優先度 0） | apex 名指しから変更 |
| TXT | `@` | `v=spf1 +a:sv16806.xserver.jp +mx include:spf.sender.xserver.jp ~all` | `+a:byte-lark.com` 削除 |
| TXT | `default._domainkey` | v=DKIM1（2048bit、移管前と同一） | そのまま |
| TXT | `_adsp._domainkey` | `dkim=unknown` | そのまま |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | 新設 |
| TXT | `resend._domainkey.send` | p=MIGf…（1024bit、移管前と同一） | そのまま |
| MX | `send.send` | feedback-smtp.ap-northeast-1.amazonses.com（優先度 10） | そのまま |
| TXT | `send.send` | `v=spf1 include:amazonses.com ~all` | そのまま |
- ワイルドカード挙動も再現確認（`mail.` と存在しない名前の両方が 85.131.209.167 を返す）

#### 切り戻し手順（Xserver 側ゾーンは削除せず温存）
- Xserver ドメインパネル → ネームサーバー設定 → 「Xserver で利用する」（ns1〜ns5.xserver.jp）に戻すだけで移管前の状態に完全復帰

#### 学び・つまずき / 想定外
- Xserver のワイルドカードは「レコードを持たない中間名」（例: `send.byte-lark.com`）にもマッチする非標準挙動。CF の標準ネームサーバーも同じ挙動のため `*` 1 本で完全再現できた（公式 docs で確認）
- 256 文字以上の TXT（DKIM）は DNS 仕様で 255 文字ごとに分割保持される。CF は連結値を貼れば自動分割するので、引用符付きの分割表示は正常
- CF の自動スキャンは 12 件中 6 件しか拾わず、A/CNAME を Proxied で取り込む。手動突合（件数一致まで）とグレー化は必須だった
- 伝播は想定（数分〜数時間）より速く約 10 分で完了。Xserver の NS 変更はレジストリ反映が即時に近い

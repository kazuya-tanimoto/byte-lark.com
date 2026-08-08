# 運営者はカスタムドメイン byte-lark.com でサイトを公開し、Web Analytics でアクセス状況を確認できる

Status: Moved
Started: 2026-06-13
Moved: 2026-06-13 → Phase 1d 公開 PBI へ移管（site-plan v3.9 Decision #25、`docs/pbi/draft-phase1d-domain-launch.md` 参照）

> **本 PBI は Phase 1a では実施しない。** 着手後の現状調査（下記）で、ドメイン接続 = 未完成サイトの公開・クロール開始を意味すること、MX が apex 名指しでメール停止リスクがあること、www に旧 Netlify サイトが稼働中であることが判明し、公開を独立フェーズ 1d に分離した。コード側の受け入れ条件（site 設定 / sitemap・RSS・canonical / build / check:ts）は確認済み。

## 誰が
- 運営者

## 何をできる
- `byte-lark.com` でサイトにアクセスできる
- Cloudflare Web Analytics でアクセス状況（PV / ユニーク訪問者 / リファラー等）を確認できる

## なんのために
- 法人サイトとして独自ドメインでの公開が必須のため
- アクセス解析データを取得し、コンテンツ改善・Phase 2 広告判断の基礎データとするため
- 関連: site-plan.md Decision #17, #18 / R-14 / PHASE0-010 申し送り「Web Analytics が pages.dev では自動注入不可」

## 受け入れ条件
- [ ] `byte-lark.com` ドメインを Cloudflare に追加（DNS 設定）
- [ ] Workers のカスタムドメインとして `byte-lark.com` を設定
- [ ] HTTPS が有効（Cloudflare の自動 SSL）
- [ ] `https://byte-lark.com` でサイト表示確認
- [ ] `www.byte-lark.com` → `byte-lark.com` のリダイレクト設定（必要な場合）
- [ ] Cloudflare Web Analytics を有効化（カスタムドメイン追加後に自動注入が有効になる）
- [ ] Web Analytics ダッシュボードでデータ取得を確認
- [ ] `astro.config.mjs` の `site` を `https://byte-lark.com` に更新
- [ ] Sitemap / RSS / canonical URL がカスタムドメインを使用していることを確認
- [ ] `yarn build` 成功
- [ ] `yarn check:ts` エラーなし

## 現状調査（2026-06-13、dig + 実表示確認）

- NS: Xserver（ns1〜ns5.xserver.jp）。ドメインは Xserver 管理
- apex（byte-lark.com）: A → 85.131.209.167（= sv16806.xserver.jp）。表示は Xserver サーバー初期ページ、**HTTPS は証明書無効でエラー**
- www: CNAME → byte-lark.netlify.app。**旧法人サイトが Netlify で稼働中**
- MX: `byte-lark.com`（apex 名指し）。**apex を Worker に向けるとメール停止** → MX を sv16806.xserver.jp 直指しに変更する設計が必要
- SPF TXT（`+a:byte-lark.com` を含む、要手直し）/ DKIM default セレクタあり / DMARC なし
- 本番 Worker（main）は Phase 0 の Hello, World! のまま → ドメイン接続＝未完成サイトの公開になるため、接続は品質確認・main マージ後
- CF の制約（公式 docs 確認済み）: Workers Custom Domains は CF 上の Active ゾーンが前提。Free プランは NS 移管（フルセットアップ）一択（CNAME setup は Business 以上）。外部 DNS から Worker へ向けるだけでは証明書が発行されず HTTPS 不成立

## 技術メモ
- PHASE0-008 で判明: `pages.dev` ドメインでは Web Analytics 自動注入が不可。カスタムドメイン追加で解消
- ドメインレジストラの DNS を Cloudflare の NS に変更するか、CNAME で指定するかは運営者の判断
- Workers へのカスタムドメイン設定は Cloudflare ダッシュボードの Workers > Settings > Domains から
- この PBI は運営者による CF ダッシュボード操作が主体

## 実装ログ

### 2026-06-13 セッション 1
- やったこと：着手後にコード側の受け入れ条件を先行確認（`astro.config.mjs` の `site` は PHASE1A-005 で設定済み・変更不要、ビルド出力の canonical / sitemap / RSS / robots.txt はすべて byte-lark.com、`yarn build` / `yarn check:ts` グリーン）。dig + Playwright で現ドメインの全容調査（上記「現状調査」セクション）
- 想定外だった点：(1) ドメイン接続 = 本番 Worker（Phase 0 の Hello, World!）の公開・クロール開始を意味し、品質確認前の公開は不可と運営者判断。(2) MX が apex 名指しでメール停止リスク。(3) www に旧 Netlify 法人サイトが稼働中。(4) CF メール難読化は Workers 配信に不適用 → Contact の mailto 露出問題が発覚し FR-29（フォーム化）起票につながった
- 帰結：site-plan v3.9 で Phase 再編（公開を 1d に分離）。本 PBI の残作業（NS 移管・ドメイン接続・Analytics）は `draft-phase1d-domain-launch.md` に調査結果ごと引き継ぎ、Status: Moved でクローズ
- 学び：インフラ・公開系は現状調査（DNS 全レコード・実表示・メール等の依存）を完了してから計画する。調査前の手順提示は誤実行リスク

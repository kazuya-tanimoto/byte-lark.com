# 【ドラフト】Phase 1d 公開（NS 移管 + カスタムドメイン + Web Analytics + Search Console）

Status: Draft（番号なし。Phase 1c（デザイン）完了後の 1d 起票セッションで番号付き PBI として正式化する）
作成: 2026-06-13（PHASE1A-018 を Status: Moved でクローズし、調査結果ごと本ドラフトへ移管。site-plan v3.9 Decision #25）

## 着手条件（公開の門）

- [ ] Phase 1b（コンテンツ整備）完了：全ページの文面・データが運営者承認済み、初期記事セット（本数は 1b のネタ出し PBI で確定）が公開状態
- [ ] Phase 1c（デザイン）完了：確定 HEX・ロゴ反映済み（R-06 発動時は現行ロゴでの公開を運営者が明示判断）
- [ ] 公開実施日を運営者が決定（NS 切替はメール影響の確認が必要なため、運営者が対応可能な日に行う）

## DNS 現状調査（2026-06-13 時点、dig + 実表示確認）

- NS: Xserver（ns1〜ns5.xserver.jp）。ドメインは Xserver 管理
- apex（byte-lark.com）: A → 85.131.209.167（= sv16806.xserver.jp）。表示は Xserver サーバー初期ページ、HTTPS は証明書無効でエラー
- www: CNAME → byte-lark.netlify.app。旧法人サイト（System Development & IT Consulting）が Netlify で稼働中
- MX: `byte-lark.com`（apex 名指し = apex の A レコード宛に配送）。**apex を Worker に向けると MX の配送先も CF に向きメール停止** → MX を `sv16806.xserver.jp` 直指しに変更する（A は同一 IP のため受信実態は不変）
- SPF TXT: `v=spf1 +a:sv16806.xserver.jp +a:byte-lark.com +mx include:spf.sender.xserver.jp ~all` → `+a:byte-lark.com` は apex が Worker を指すようになると意味が変わるため削除する
- DKIM: `default._domainkey` に Xserver の公開鍵あり（移管時にコピー必須）
- DMARC: なし（移管ついでに `p=none` で新設を推奨）
- 1b の Contact フォーム PBI で `send.byte-lark.com`（Resend 認証用）のレコードが Xserver DNS に追加されている見込み → 移管リストに含める

## 制約（公式 docs 確認済み、2026-06-13）

- Workers カスタムドメインは「CF 上の Active ゾーン」が前提。Free プランのゾーン作成はフルセットアップ（NS 移管）一択（CNAME セットアップは Business 以上）
- 外部 DNS から Worker へ CNAME を向けるだけでは byte-lark.com の証明書が発行されず HTTPS 不成立。hosts ファイルでの事前検証も同理由で不可
- CF のメールアドレス難読化は Workers 配信に不適用（→ 1b で mailto 廃止済みの前提）

## 受け入れ条件（正式化時に精査）

### 公開前 QA
- [ ] E2E（Playwright）グリーン + Lighthouse 90+ を branch alias で再確認（1c のデザイン変更後の状態で）

### NS 移管（メール無停止が最優先）
- [ ] CF にゾーン追加 → インポートされたレコードを現 Xserver DNS と全件突合（MX / SPF / DKIM / send.byte-lark.com を重点確認）
- [ ] MX を `sv16806.xserver.jp` 直指しに変更、SPF から `+a:byte-lark.com` を削除（CF ゾーン側で設定してから NS を切替）
- [ ] レジストラで NS を CF 指定値に変更 → ゾーン Active 化確認
- [ ] **メール送受信テスト**（tanimoto@byte-lark.com で送信・受信とも）

### マージ・ドメイン接続
- [ ] feat/phase-1a 系列の最終状態を main へマージ（merge --no-ff、README §10.6）→ 本番 Worker デプロイ確認
- [ ] Workers カスタムドメインとして byte-lark.com を接続（Workers & Pages > byte-lark > Settings > Domains & Routes）
- [ ] HTTPS 有効確認（CF 自動証明書。現状の証明書切れエラーが解消されること）
- [ ] https://byte-lark.com で全ページ表示確認

### www / 旧サイトの畳み
- [ ] www の旧 Netlify サイトの扱いを運営者が決定（Netlify 側のサイト削除 or 放置）し、DNS の www CNAME → Netlify を撤去
- [ ] www 用の proxied ダミーレコード（AAAA `100::`）+ Redirect Rule で `www.byte-lark.com/*` → `https://byte-lark.com/$1`（301）
- [ ] リダイレクト動作確認

### 解析・検索エンジン
- [ ] Cloudflare Web Analytics 有効化（proxied ゾーンの自動注入）→ beacon 注入とダッシュボードのデータ取得を確認
- [ ] Google Search Console にプロパティ登録（DNS 認証）+ sitemap-index.xml 送信
- [ ] OGP デバッガー（Facebook Sharing Debugger / X Card Validator）で実検証（PHASE1A-020 から移管された項目）

### 検証・記録
- [ ] `yarn build` / `yarn check:ts` グリーン
- [ ] メール・DNS の最終状態（全レコード）を本 PBI の実装ログに記録

## 技術メモ

- production branch の一時切替案（feat/phase-1a を本番化）は **棄却済み**（Decision #25 反対案欄）。マージ → 接続の順を守る
- NS 切替の伝播は数分〜数時間。切替直後は新旧 NS が混在回答するため、メールテストは伝播確認後に行う
- 公開直後に robots.txt / sitemap が正しく見えること（クロール開始時点の品質がインデックスの初期評価になる）

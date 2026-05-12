# 運営者はカスタムドメイン byte-lark.com でサイトを公開し、Web Analytics でアクセス状況を確認できる

Status: NotStarted

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

## 技術メモ
- PHASE0-008 で判明: `pages.dev` ドメインでは Web Analytics 自動注入が不可。カスタムドメイン追加で解消
- ドメインレジストラの DNS を Cloudflare の NS に変更するか、CNAME で指定するかは運営者の判断
- Workers へのカスタムドメイン設定は Cloudflare ダッシュボードの Workers > Settings > Domains から
- この PBI は運営者による CF ダッシュボード操作が主体

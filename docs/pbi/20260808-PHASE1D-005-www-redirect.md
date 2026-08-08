# 訪問者は www.byte-lark.com にアクセスしても本サイトへ 301 で誘導される

Status: Done
Started: 2026-08-08
Completed: 2026-08-08

## 誰が
- 訪問者

## 何をできる
- www.byte-lark.com（旧法人サイトの URL）にアクセスしても、301 リダイレクトで https://byte-lark.com の対応ページに到達できる

## なんのために
- 旧 Netlify サイト（www）と新サイト（apex）の併存をなくし、URL とインデックスを apex に一本化するため
- 関連: Phase 1d / draft-phase1d-domain-launch.md「www / 旧サイトの畳み」

## 受け入れ条件
- [x] www の旧 Netlify サイト（byte-lark.netlify.app、旧法人サイト）の扱いを運営者が決定（Netlify 側のサイト削除 or 放置）→ 削除で決定・削除実施、byte-lark.netlify.app が 404（Site not found）になったことを確認。運営者は Netlify アカウント自体も削除予定（他サイトなし）
- [x] CF ゾーンの www CNAME → Netlify を撤去し、proxied ダミー AAAA `100::` を設定 → DoH 実測で www の AAAA が CF エッジ IP（proxied）を返すことを確認
- [x] Redirect Rule：`www.byte-lark.com/*` → `https://byte-lark.com/$1`（301）→ CF テンプレート「Redirect from WWW to root」（Wildcard `https://www.*` → `https://${1}`、301、Preserve query string 有効）で実装
- [x] `curl -I` で http / https × ルート / パス付き URL のリダイレクトを実測確認（Location とステータス 301）→ 5 通り全合格（実装ログ参照）。ブラウザ実測でも http://www.byte-lark.com/blog → https://byte-lark.com/blog/ に着地
- [x] ローカル スクショ確認：N/A（DNS / CF 設定のみ、コード変更なし）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：N/A（同上。push は PBI ファイルの docs のみ）（CLAUDE.md §7）

## 技術メモ
- AAAA `100::` は「proxied を成立させるためのダミー宛先」定石（トラフィックは Redirect Rule が先に処理）
- PHASE1D-004（カスタムドメイン接続）完了後に実施（リダイレクト先が生きていることが前提）

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-08 着手
- 運営者決定：旧 Netlify サイト（byte-lark.netlify.app）は削除で確定（byte-lark.netlify.app 直アクセスでの旧法人情報の露出を断つため。切り戻し時の www 喪失は apex の旧 A レコードで補えるため影響小と判断）
- 手順順序：CF 側（www CNAME 撤去 → AAAA `100::` proxied → Redirect Rule 301）を先に完成させてから Netlify サイトを削除（削除先行だと www がエラー表示になる時間帯が生じるため）

### 2026-08-08 実施・完了（運営者ダッシュボード操作 + 実測、単一セッション）
- CF DNS：www の CNAME（→ byte-lark.netlify.app）を削除し、AAAA `www` `100::` を Proxied で追加
- Redirect Rule：テンプレート「Redirect from WWW to root」をそのまま使用（Wildcard pattern `https://www.*` → Target `https://${1}`、301）。変更点は「Preserve query string」へのチェックのみ。Deploy 時の警告「This rule may not apply to your traffic」は AAAA が Proxied 済みのため「Ignore and deploy rule anyway」で続行
- 実測（運営者ターミナル、curl -I 5 通り）：
  - http ルート / http パス付き → 301 で `https://www.byte-lark.com/...`（Always Use HTTPS が先に処理する 2 段リダイレクト）
  - https ルート / https パス付き / クエリ付き → 301 で `https://byte-lark.com/...`、クエリ `?test=1` も保持
  - DoH（cloudflare-dns.com）で www の AAAA が CF エッジ IP 2 件（2606:4700:...）＝ proxied 化を確認
- ブラウザ実測（MCP Playwright）：http://www.byte-lark.com/blog → https://byte-lark.com/blog/ に着地、ページ表示正常
- Netlify：運営者がサイト削除 → byte-lark.netlify.app が 404（Site not found）になったことをブラウザで確認。他にサイトが無いため、運営者判断でアカウント自体も削除予定（DNS 管理は CF 移管済みで支障なし）

#### 学び
- CF の Redirect Rule テンプレート「Redirect from WWW to root」は https しか拾わない（pattern が `https://www.*`）。http 側は Always Use HTTPS（SSL/TLS > Edge Certificates）との合わせ技で 2 段 301 になる構成が正
- Deploy 時の「may not apply to your traffic」警告は www レコードの proxied 状態を CF が確認できない場合の汎用警告で、AAAA `100::` Proxied 投入済みなら無視して問題ない

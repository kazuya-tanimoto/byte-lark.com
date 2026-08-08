# 訪問者は www.byte-lark.com にアクセスしても本サイトへ 301 で誘導される

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- www.byte-lark.com（旧法人サイトの URL）にアクセスしても、301 リダイレクトで https://byte-lark.com の対応ページに到達できる

## なんのために
- 旧 Netlify サイト（www）と新サイト（apex）の併存をなくし、URL とインデックスを apex に一本化するため
- 関連: Phase 1d / draft-phase1d-domain-launch.md「www / 旧サイトの畳み」

## 受け入れ条件
- [ ] www の旧 Netlify サイト（byte-lark.netlify.app、旧法人サイト）の扱いを運営者が決定（Netlify 側のサイト削除 or 放置）→ 決定どおり処置
- [ ] CF ゾーンの www CNAME → Netlify を撤去し、proxied ダミー AAAA `100::` を設定
- [ ] Redirect Rule：`www.byte-lark.com/*` → `https://byte-lark.com/$1`（301）
- [ ] `curl -I` で http / https × ルート / パス付き URL のリダイレクトを実測確認（Location とステータス 301）
- [x] ローカル スクショ確認：N/A（DNS / CF 設定のみ、コード変更なし）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：N/A（同上。push は PBI ファイルの docs のみ）（CLAUDE.md §7）

## 技術メモ
- AAAA `100::` は「proxied を成立させるためのダミー宛先」定石（トラフィックは Redirect Rule が先に処理）
- PHASE1D-004（カスタムドメイン接続）完了後に実施（リダイレクト先が生きていることが前提）

## 実装ログ（着手後に追記、中断時は必須）
（未着手）

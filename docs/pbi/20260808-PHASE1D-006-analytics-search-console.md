# 運営者はアクセス状況と検索インデックス状況を確認できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- Cloudflare Web Analytics でアクセス状況を、Google Search Console でインデックス状況を確認できる。SNS シェア時の OGP 表示も実検証済みの状態にできる

## なんのために
- 公開後の反応（流入・検索掲載・シェア表示）を観測できる状態を公開直後から確保するため
- 関連: Phase 1d / draft-phase1d-domain-launch.md「解析・検索エンジン」/ PHASE1A-020（OGP 実検証の移管元）

## 受け入れ条件
- [ ] Cloudflare Web Analytics を有効化（proxied ゾーンの自動注入）→ 本番 HTML に beacon が注入されていること + ダッシュボードにデータが記録されることを確認
- [ ] Google Search Console にプロパティ登録（DNS 認証。CF ゾーンに TXT 追加）
- [ ] sitemap-index.xml を送信し、受理されることを確認
- [ ] OGP デバッガー実検証：Facebook Sharing Debugger / X Card Validator で主要ページ + 記事 1 本以上（PHASE1A-020 から移管された項目）
- [x] ローカル スクショ確認：N/A（ダッシュボード設定のみ、コード変更なし。beacon は CF 自動注入）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上。確認は本番 URL で行う）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：N/A（同上。push は PBI ファイルの docs のみ）（CLAUDE.md §7）

## 技術メモ
- PHASE1D-004（カスタムドメイン接続）完了後に実施
- Web Analytics の beacon 注入はゾーン設定（コード変更不要）。注入確認は本番 HTML を curl で見る

## 実装ログ（着手後に追記、中断時は必須）
（未着手）

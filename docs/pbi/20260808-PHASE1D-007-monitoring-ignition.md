# 運営者はサイトのダウン・改ざん・証明書失効を自動通知で検知できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- 本番サイトの異常（ダウン / 改ざん / ヘッダ異常 / TLS 失効間近）を、自分で見に行かなくてもメール + Slack への自動通知で知ることができる

## なんのために
- PHASE1A-021 で確定した監視設計（push 型・自動検知ファースト）を、本番ドメインが立ったこのタイミングで実装・点火するため。詳細設計は `docs/incident-response.md` §2
- 関連: Phase 1d / R-11 / draft-phase1d-domain-launch.md「公開後の監視セットアップ」

## 受け入れ条件
- [ ] `scripts/health-check.sh`（curl ベース）を作成：https://byte-lark.com に対し (1) HTTP 200 (2) 改ざんカナリア（想定文字列の存在）(3) セキュリティ / 配信ヘッダが想定どおり（公開後は noindex が付かないこと）(4) TLS 証明書の残日数、を確認し異常時のみ非 0 終了 + 通知。2 回連続失敗で通知のしきい値で誤報を抑制
- [ ] Xserver の cron に health-check.sh を登録（運営者。shell 対応・外向き curl 可は確認済み）。監視する側 = Xserver / 監視される側 = Cloudflare の独立インフラ構成
- [ ] 異常時通知はメール + Slack（Incoming Webhook）の二重。Webhook URL は秘密情報なので Xserver 側の環境変数 / 権限を絞ったファイルに置き、リポジトリに commit しない（Secret scanning と整合）
- [ ] GitHub セキュリティ通知（Dependabot / Secret scanning / Push protection）の有効化を確認、未設定なら ON（incident-response.md §2）
- [ ] （任意・推奨）UptimeRobot 等の外部死活監視を本番 URL に設定（死活の二重化・監視自身の watcher）
- [ ] 動作確認：わざと canary を外した URL / ダウン状態の模擬で、メール + Slack に通知が実際に飛ぶことを確認（誤報しきい値含む）
- [x] ローカル スクショ確認：N/A（監視スクリプト追加のみ、サイト出力に変更なし）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh`。スクリプト追加でも Quality Checks が走るため実確認する）（CLAUDE.md §7）

## 技術メモ
- heartbeat / dead man's switch は本構成では不要と判断済み（PHASE1A-021。監視・cron・業務メールが Xserver 同居で、停止時はメール不通で気づく）。スクリプト / cron を変更したら一度手で実行して確認することだけ守る
- Claude を cron で回す案（claude.ai routine）は主役にしない（Claude 契約依存で、監視自身が止まると無通知）。使うなら週次レビュー等の補助のみ

## 実装ログ（着手後に追記、中断時は必須）
（未着手）

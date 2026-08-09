# 運営者はサイトのダウン・改ざん・証明書失効を自動通知で検知できる

Status: InProgress
Started: 2026-08-08

## 誰が
- 運営者

## 何をできる
- 本番サイトの異常（ダウン / 改ざん / ヘッダ異常 / TLS 失効間近）を、自分で見に行かなくてもメール + Slack への自動通知で知ることができる

## なんのために
- PHASE1A-021 で確定した監視設計（push 型・自動検知ファースト）を、本番ドメインが立ったこのタイミングで実装・点火するため。詳細設計は `docs/incident-response.md` §2
- 関連: Phase 1d / R-11 / draft-phase1d-domain-launch.md「公開後の監視セットアップ」

## 受け入れ条件
- [x] `scripts/health-check.sh`（curl ベース）を作成：https://byte-lark.com に対し (1) HTTP 200 (2) 改ざんカナリア（想定文字列の存在）(3) セキュリティ / 配信ヘッダが想定どおり（公開後は noindex が付かないこと）(4) TLS 証明書の残日数、を確認し異常時のみ非 0 終了 + 通知。2 回連続失敗で通知のしきい値で誤報を抑制
- [ ] Xserver の cron に health-check.sh を登録（運営者。shell 対応・外向き curl 可は確認済み）。監視する側 = Xserver / 監視される側 = Cloudflare の独立インフラ構成
- [ ] 異常時通知はメール（cron のメール送信）。経路の二重化は Slack ではなく UptimeRobot の併用で確保する（2026-08-09 運営者決定）。Webhook 通知はスクリプトの任意機能として残し、使う場合の URL は Xserver 側の権限を絞ったファイルに置いてリポジトリに commit しない（Secret scanning と整合）
- [ ] GitHub セキュリティ通知（Dependabot / Secret scanning / Push protection）の有効化を確認、未設定なら ON（incident-response.md §2）
- [ ] UptimeRobot の外部死活監視を本番 URL に設定（死活の二重化・監視自身の watcher。2026-08-09 運営者決定で「設定する」）
- [ ] 動作確認：わざと異常な URL（noindex が付く branch alias）を叩き、2 回連続でメール通知が実際に飛ぶことを確認（誤報しきい値含む）
- [x] ローカル スクショ確認：N/A（監視スクリプト追加のみ、サイト出力に変更なし）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`。スクリプト追加でも Quality Checks が走るため実確認する）（CLAUDE.md §7）：43ecef6 で UI Tests / Quality Checks / Workers Builds とも success

## 技術メモ
- heartbeat / dead man's switch は本構成では不要と判断済み（PHASE1A-021。監視・cron・業務メールが Xserver 同居で、停止時はメール不通で気づく）。スクリプト / cron を変更したら一度手で実行して確認することだけ守る
- Claude を cron で回す案（claude.ai routine）は主役にしない（Claude 契約依存で、監視自身が止まると無通知）。使うなら週次レビュー等の補助のみ

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-09 監視スクリプト実装 + 運用手順の文書化

やったこと：

- `scripts/health-check.sh` を新規作成。HTTP ステータス / 改ざんカナリア / 配信ヘッダ / TLS 残日数の 4 点を確認し、異常時のみ終了コード 1。通知は「2 回連続で異常」のしきい値を超えたときだけ出し、復旧時に 1 回だけ復旧通知を出す。設定は `~/.byte-lark-monitor.env`（bash として読み込む）で上書きでき、Slack Webhook URL はそこにだけ置く（リポジトリには入れない）
- 動作モードを 3 つ用意：通常実行（cron 用・正常時は無出力）/ `--inspect`（観測値の表示だけ、状態も通知も触らない）/ `--test-notify`（通知の配線確認）
- `docs/operation-manual.md` §6 を新設（Xserver への設置・設定ファイル・cron 登録・普段の運用・設定項目一覧）。旧 §6→§7、旧 §7→§8 に繰り下げ
- `docs/incident-response.md` §2 の前方参照（「実装は Phase 1d」「draft-phase1d が実装先」）を実体への参照に置き換え、§7・§8 も連動更新
- `.devcontainer/allowed-domains.conf` に `byte-lark.com` を追加（コンテナから本番 URL を直接実測できるようにする。反映は次回コンテナ起動から）

コンテナ内で実施した動作確認（すべて実測）：

- 正常系：本番 Worker（`byte-lark.tanimoto-a49.workers.dev`）に対し HTTP 200 / カナリア 2 種 OK / TLS 残 56 日
- ヘッダ異常：branch alias は `x-robots-tag: noindex` が付くのでこれを異常系の実物として使用。1 回目は無出力・終了コード 1（しきい値未満）、2 回目で通知内容を出力＝しきい値が効いている
- 復旧通知：alerting 状態から正常に戻したとき「復旧」通知が 1 回だけ出て、その次の正常実行では無出力
- カナリア消失・404・接続失敗（到達不能ホスト）：それぞれ異常として検出し、内訳を報告に列挙
- Slack ペイロード：ローカルの受け口サーバーで実際に POST を受け、JSON として解析できること・日本語と改行と `"` を含む本文が壊れないことを確認
- メール送信コマンドが無い環境での挙動：`MAIL_TO` 指定時は警告を出して標準出力の経路は維持（cron のメール設定に載る）

判明した事実：

- GitHub の Dependabot alerts は有効（`repos/.../dependabot/alerts` が実データを返す）。Secret scanning / Push protection は fine-grained PAT の権限では読めず（403）、運営者のダッシュボード確認が必要
- 本番 apex（`byte-lark.com`）はコンテナの default-deny firewall で未許可だったため、実装中の実測は許可済みの workers.dev 本番エイリアス（同一デプロイ）で代替した

運営者決定（2026-08-09、選択肢を提示して確認）：

- 通知は**メール単独**とする。PBI 起票時の「メール + Slack の二重」から変更。二重化の目的（片方が死んでも気づく）は、同じ Xserver 上の Slack 通知を足すより、別インフラの UptimeRobot を併用する方が素直に満たせるため、受け入れ条件をそう書き換えた。Webhook 通知の実装自体はスクリプトに残す（`SLACK_WEBHOOK_URL` を設定すれば有効。将来チャット通知を足したくなったときに実装し直さずに済む）
- UptimeRobot は**設定する**

残タスク（運営者作業）：Xserver への設置と cron 登録 / 実通知の確認 / UptimeRobot の設定 / GitHub の Secret scanning・Push protection の有効確認

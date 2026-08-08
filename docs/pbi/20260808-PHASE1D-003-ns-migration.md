# 運営者はメールを止めずに byte-lark.com の DNS 管理を Cloudflare へ移せる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- byte-lark.com のゾーンを Cloudflare に作成し NS を切り替えても、Xserver のメール送受信と Resend（Contact 通知）が無停止で動き続ける状態にできる

## なんのために
- Workers カスタムドメイン接続は自アカウントの Active ゾーンが前提で、Free プランのゾーン作成はフルセットアップ（NS 移管）一択のため（2026-06-13 調査、2026-08-08 公式 docs 再確認）
- 関連: Phase 1d / draft-phase1d-domain-launch.md「NS 移管」/ PHASE1A-018（Moved 元）

## 受け入れ条件
- [ ] 着手時に dig で現 DNS を再取得し、2026-06-13 調査（draft-phase1d-domain-launch.md 記載）との差分を確認。Xserver 側のレコード一覧をエクスポート / スクショで保全
- [ ] CF にゾーン追加 → インポートされたレコードを現 Xserver DNS と全件突合（MX / SPF / DKIM、特に Resend 用の `resend._domainkey.send` TXT・`send` サブドメインの MX / SPF を漏れなく。欠けると Contact フォームの通知が壊れる）
- [ ] NS 切替前に CF ゾーン側で設定：MX を `sv16806.xserver.jp` 直指しへ変更 / SPF から `+a:byte-lark.com` を削除 / DKIM（`default._domainkey`）をコピー / DMARC（`_dmarc`、`p=none`）を新設
- [ ] apex A / www CNAME は現状のまま移し、proxy は DNS only にして挙動を変えない（サイト表示の切替は 004、www の畳みは 005 で行う）
- [ ] レジストラ（Xserver）で NS を CF 指定値へ変更 → CF ゾーン Active 化を確認
- [ ] 伝播確認後にメールテスト：`tanimoto@byte-lark.com` / `info@byte-lark.com` の両方で送受信、Contact フォーム実送信で info@ に通知が届くこと（Resend 経路の生存確認）
- [ ] 移管後の全レコード最終状態を実装ログに記録
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
（未着手）

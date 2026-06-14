# 運営者はインシデント発生時に最低限の対応手順を参照できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- インシデント（改ざん・連絡先漏えい等）発生時に、対応手順を `docs/incident-response.md` で確認できる
- Cloudflare のセキュリティイベント監視の設定方法を把握できる

## なんのために
- インシデント発生時に慌てず初動対応するための最低限の手順書を事前に用意しておくため
- 関連: site-plan.md R-11

## 受け入れ条件
- [ ] `docs/incident-response.md` を作成
- [ ] 監視方法の記載（Cloudflare セキュリティイベント / UptimeRobot 等の選択肢）
- [ ] 漏えい・改ざん検知時の対応手順（初動 → 調査 → 復旧 → 報告）
- [ ] 対応者・連絡先の明記（法人化前は運営者本人）
- [ ] Cloudflare ダッシュボードでのセキュリティイベント確認手順の概要
- [x] ローカル スクショ確認（desktop + mobile）：N/A（理由：本 PBI は docs 作成のみで UI を変更しない）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：N/A（理由：UI 変更なし）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）：N/A（理由：本 PBI は docs 作成のみでコード非変更）（CLAUDE.md §7）

## 技術メモ
- 法人化前は対応者 = 運営者本人のみ。法人化後（§13）に組織体制へ更新
- Cloudflare のセキュリティ機能（WAF / Bot Management 等）はフリープランでも基本機能あり
- この PBI は Claude がドラフト → 運営者レビューの流れ
- UptimeRobot は外部サービスなので、導入判断は運営者

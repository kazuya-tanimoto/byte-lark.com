# PHASE1E-006: セキュリティヘッダの追加（nosniff / Referrer-Policy / X-Frame-Options）

Status: InProgress
Started: 2026-08-15

## 誰が

サイト訪問者（とそのブラウザ）が

## 何をできる

全ページで基本のセキュリティヘッダ 3 つ（X-Content-Type-Options / Referrer-Policy / X-Frame-Options）の保護を受けられる。

## なんのために

PHASE1D-007 の実測で本番にセキュリティヘッダが 1 つも無いことが判明し、HSTS のみ同 PBI で追加した。残りは「必要になったら別途起票」としていた分のうち、設定 1 行で済み副作用がほぼ無い 3 つを追加する（運営者決定 2026-08-15）。CSP は Turnstile 等の許可リスト整備が必要で、静的サイトでは費用対効果が悪いため見送り（同決定）。

## 受け入れ条件

- [ ] `public/_headers` に `/*` 向けの 3 ヘッダを追加：`X-Content-Type-Options: nosniff` / `Referrer-Policy: strict-origin-when-cross-origin` / `X-Frame-Options: DENY`
- [ ] CF preview（branch alias URL）で 3 ヘッダが返ることを curl で実測確認
- [ ] 既存ヘッダに影響が無いこと（`/_astro/*` の Cache-Control、HSTS）を同実測で確認
- [ ] ローカル スクショ確認：N/A（ヘッダのみ、表示に変更なし）（CLAUDE.md §7）
- [ ] CF preview スクショ確認：N/A（同上。curl でのヘッダ実測で代替）（CLAUDE.md §7）
- [ ] E2E / CI green 確認：`bash scripts/ci-status.sh` で Quality Checks / UI Tests が success（CLAUDE.md §7）

## 技術メモ

- 想定セッション数: 1
- `public/_headers` は CF Workers 静的アセット配信が読む（PHASE1D-010 で導入。https://developers.cloudflare.com/workers/static-assets/headers/）
- HSTS は CF ダッシュボード側の設定（PHASE1D-007）なので `_headers` には書かない
- X-Frame-Options: DENY の根拠：iframe 埋め込みを許す用途が無い（埋め込みたくなったら緩める）

## 備考

- 出所：PHASE1D-007 実装ログ「残る X-Content-Type-Options / Referrer-Policy / CSP は今回の対象外（選択肢として提示済み、必要になったら別途起票）」
- 同日の運営者決定：Xserver 側 DNS ゾーンは切り戻し保険として残す（確定、判断待ちから除去）。Turnstile 実送信は運営者が実施しメール到達を確認済み

## 実装ログ（着手後に追記、中断時は必須）

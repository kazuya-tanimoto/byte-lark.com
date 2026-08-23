# 訪問者は、全ページで基本のセキュリティヘッダ 3 つ（nosniff / Referrer-Policy / X-Frame-Options）の保護を受けられる

Status: Done
Started: 2026-08-15
Completed: 2026-08-15

## 誰が

サイト訪問者（とそのブラウザ）が

## 何をできる

全ページで基本のセキュリティヘッダ 3 つ（X-Content-Type-Options / Referrer-Policy / X-Frame-Options）の保護を受けられる。

## なんのために

PHASE1D-007 の実測で本番にセキュリティヘッダが 1 つも無いことが判明し、HSTS のみ同 PBI で追加した。残りは「必要になったら別途起票」としていた分のうち、設定 1 行で済み副作用がほぼ無い 3 つを追加する（運営者決定 2026-08-15）。CSP は Turnstile 等の許可リスト整備が必要で、静的サイトでは費用対効果が悪いため見送り（同決定）。

## 受け入れ条件

- [x] `public/_headers` に `/*` 向けの 3 ヘッダを追加：`X-Content-Type-Options: nosniff` / `Referrer-Policy: strict-origin-when-cross-origin` / `X-Frame-Options: DENY`
- [x] CF preview（branch alias URL）で 3 ヘッダが返ることを curl で実測確認
- [x] 既存ヘッダに影響が無いこと（`/_astro/*` の Cache-Control、HSTS）を同実測で確認（HSTS は CF ダッシュボード側設定で `_headers` 変更の影響外。本番 apex はマージ後に確認）
- [x] ローカル スクショ確認：N/A（ヘッダのみ、表示に変更なし）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上。curl でのヘッダ実測で代替）（CLAUDE.md §7）
- [x] E2E / CI green 確認：`bash scripts/ci-status.sh` で Quality Checks / UI Tests が success（CLAUDE.md §7）

## 技術メモ

- 想定セッション数: 1
- `public/_headers` は CF Workers 静的アセット配信が読む（PHASE1D-010 で導入。https://developers.cloudflare.com/workers/static-assets/headers/）
- HSTS は CF ダッシュボード側の設定（PHASE1D-007）なので `_headers` には書かない
- X-Frame-Options: DENY の根拠：iframe 埋め込みを許す用途が無い（埋め込みたくなったら緩める）

## 備考

- 出所：PHASE1D-007 実装ログ「残る X-Content-Type-Options / Referrer-Policy / CSP は今回の対象外（選択肢として提示済み、必要になったら別途起票）」
- 同日の運営者決定：Xserver 側 DNS ゾーンは切り戻し保険として残す（確定、判断待ちから除去）。Turnstile 実送信は運営者が実施しメール到達を確認済み

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-15 セッション 1（起票・実施・完了）

#### やったこと
- `public/_headers` に `/*` ルールを追加（3 ヘッダ + コメント 2 行のみ、計 7 行）
- CF preview（`chore-1e-006-security-headers-byte-lark.tanimoto-a49.workers.dev`）で curl 実測：
  - `/`：`x-content-type-options: nosniff` / `referrer-policy: strict-origin-when-cross-origin` / `x-frame-options: DENY` の 3 つとも返る
  - `/_astro/BaseLayout.D1BVeaQ3.css`：`cache-control: public, max-age=31536000, immutable` 維持 + 3 ヘッダも付与（`/*` と `/_astro/*` のルールはマージされる）
- CI：Quality Checks / UI Tests(e2e) とも success（実装コミット f9887e1）

#### 学び
- `_headers` の複数ルールは同一パスに両方マッチするとヘッダがマージされる（`/_astro/*` にも 3 ヘッダが付いた。上書きでなく加算）

#### 想定外
- なし

### 2026-08-23 事後追記
- タイトルを README §4.1 のユーザーストーリー形式に是正（件名形式からの書式変更のみ、内容変更なし）

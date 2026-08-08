# 運営者は公開直前の品質状態を確認し、未決事項（ダークモード・ライセンス表記）を確定できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- 公開（main マージ）前の品質状態を E2E / ビルド検証で確認し、ダークモード採用可否とアイコンライセンス表記の掲示要否を決定できる

## なんのために
- 公開後に手戻りする品質問題・未決事項を公開前に潰すため（draft-phase1d-domain-launch.md「公開前 QA」の正式化）
- 関連: site-plan §7 Phase 1d / PHASE1C-012「Phase 1d で先に決めるべき事項」

## 受け入れ条件
- [ ] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がすべて成功
- [ ] E2E スイートが現行 HEAD で green（CI `ui-tests.yml`。`scripts/ci-status.sh` で確認）
- [ ] ダークモード実表示確認：全主要ページ（トップ / 経歴 / スキル / About / Contact / ブログ一覧 / 記事）に `.dark` クラスを強制付与し、デスクトップ + モバイル幅でスクショ取得 → 運営者が採用可否を判断
- [ ] ダークモード判断の後続処理を記録：採用なら切り替え UI 等の対応 PBI を起票、見送りなら関連申し送り 3 件（`.dark` トークン実表示 / currentColor アセット / favicon の sky 固定）を次 Phase への申し送りとして整理
- [ ] アイコンライセンス表記（`public/icons/LICENSE.txt`。現状ページから辿れない）のサイト掲示要否を運営者判断。掲示するなら対応（軽微なら本 PBI 内で実装、大きければ起票）
- [ ] `astro.config.mjs` の `site` 設定と robots.txt / sitemap の出力が本番ドメイン（https://byte-lark.com）前提で正しいことを確認（公開直後のクロール品質がインデックス初期評価になる）
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。ダークモード検証と併せて実施）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。本 PBI でコード変更が無ければ `[x] N/A（確認のみ）` に更新）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- `.dark` 付与は MCP Playwright の evaluate で `document.documentElement.classList.add('dark')`。トークンは PHASE1C-002、アイコン・ロゴの色設計は PHASE1C-004 / 005
- dev server はサンドボックスで watch が死ぬため、編集した場合は再起動してから検証
- Lighthouse Performance / SEO はここでは判定しない（本番ドメイン接続後、PHASE1D-004）

## 備考
- ダークモードの運営者方針（2026-08-08）：「実表示を見て使えそうなら対応、ダメそうなら申し送り」
- 着手条件（公開の門）は通過済み：Phase 1b Gate（2026-08-05）/ Phase 1c Gate（2026-08-08）/ 公開実施日は運営者対応可能（2026-08-08 確認）

## 実装ログ（着手後に追記、中断時は必須）
（未着手）

# 訪問者は https://byte-lark.com で公開サイトを閲覧できる

Status: InProgress
Started: 2026-08-08

## 誰が
- 訪問者

## 何をできる
- 本番ドメイン https://byte-lark.com で全ページを HTTPS で閲覧できる

## なんのために
- サイト公開そのもの（Phase 1d の中核）。旧 PHASE1A-018 の移管先
- 関連: site-plan §7 Phase 1d / §8 Decision #25 / NFR（Lighthouse 90+）

## 受け入れ条件
- [ ] 前提確認：PHASE1D-001（QA）/ 002（法人表記）/ 003（ゾーン Active）が Done
- [ ] マージ前に記事 3 本（T1 / T2 / L1）の `publishedAt` を実公開日へ更新（未来日でも表示される仕様のため、忘れても画面で気づけない）
- [ ] feat/phase-1 を main へ `merge --no-ff`（README §10.6）→ 本番 Worker の main ビルド・デプロイ成功を確認
- [ ] main 向け CF Deploy Hook を追加（運営者。PHASE1C-012 申し送り。URL は 1Password 保管、repo・PBI・ログに書かない）
- [ ] Workers カスタムドメインとして byte-lark.com を接続（Workers & Pages > byte-lark > Settings > Domains & Routes）→ HTTPS 有効（現状の証明書エラー解消）を確認
- [ ] https://byte-lark.com で全ページ表示確認（スクショ、desktop + mobile）
- [ ] 本番レスポンスに `X-Robots-Tag: noindex` が付かないことを確認
- [ ] Lighthouse Performance / SEO 90+ を本番ドメインの全主要ページで確認（`bash scripts/lighthouse-audit.sh`、運営者ターミナル実行。A11y 90+ / BP 100 は PHASE1A-020 で branch alias 確認済み）
- [ ] 公開済み実記事で CLS を測り直す（PHASE1C-007 申し送り。Phase 1c は一時記事で代替していた）
- [ ] フォント転送量の判定を記録：本番計測で Performance に問題が出た場合のみサブセット化 PBI を起票、問題なければ現状維持（ビルド 366 ファイル・8.5MB / インライン @font-face 約 283KB は PHASE1C-003 / 007 / 010 の確定方式）
- [ ] main の CodeQL 週次 cron failure がマージで根治したことを確認（旧 codeql.yml 削除が main に到達。GitHub Actions で weekly failure が再発しないこと。PHASE1B-015 申し送り）
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。publishedAt 変更後の記事表示）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。マージ前の最終状態確認として）
- [ ] E2E / CI green 確認（feat/phase-1 push 後と main マージ後の両方で `scripts/ci-status.sh`）（CLAUDE.md §7）

## 技術メモ
- production branch の一時切替案は棄却済み（Decision #25）。マージ → 接続の順を守る
- 公開 commit と PBI Done 化は同一セッションで完結させる（README §5.4、v3.7 規約）
- CF Workers Builds は `node_modules/.astro` をキャッシュ。カバー画像付き記事の削除・改名でビルドが落ちたら Clear Cache（再現性のある失敗）
- SEO 判定は本番ドメインのみ有効（branch alias は CF が noindex を強制）

## 実装ログ（着手後に追記、中断時は必須）
（未着手）

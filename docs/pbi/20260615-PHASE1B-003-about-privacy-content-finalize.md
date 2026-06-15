# 訪問者は About / Privacy ページで運営者が事実確認・承認した文面を閲覧できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- 事実誤認のない About プロフィール / byte-lark 概要と、運営者が確定した Privacy ポリシーを閲覧できる

## なんのために
- About / Privacy は Claude 起草ドラフトで、運営者による事実確認・承認が未実施（文体選定とレイアウト確認のみ。Phase 1b 背景 / PHASE1A-022 申し送り）
- 関連: site-plan.md FR-10 / FR-22 / Phase 1b（コンテンツ整備）

## 受け入れ条件
- [ ] 運営者が About 全文を読み、事実誤認・表現の修正指示 → Claude が反映
- [ ] 運営者が Privacy 全文を読み、修正指示 → Claude が反映
- [ ] 法人化時期の表記（現: 個人事業主・2026 年 6 月法人化予定）を運営者が最新状況で確認・更新する（Privacy の制定日・改定記述、§13.1 準拠表記を含む）
- [ ] Career / Skills 現行化（001 / 002）の内容と矛盾しない（経歴・事業内容の整合）
- [ ] 両ページとも運営者の明示承認を実装ログに記録
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）

## 技術メモ
- 想定セッション数: 1（文面修正の反映が主。運営者の読み込み・承認待ちは実装フェーズ外の外部待ち）
- 関連ファイル: `src/pages/about.astro` / `src/pages/privacy.astro`
- 現状の文体・構成: About = ですます調 × 見出し整理型（Q2、PHASE1A-009）、Privacy = 簡易案（Q10、5 章構成・CF Web Analytics の Cookieless 明記、PHASE1A-015）
- About には Person JSON-LD（`src/lib/jsonld.ts` の `buildPersonJsonLd()`）がある。事実変更時は `worksFor` 等の整合も確認する
- 法人化目前（§13）。Privacy の「2026 年 6 月法人化予定」は時期確認が必要
- 運営者承認待ち項目。待ち時間は Contact（004 / 005）を並行

## 備考
- `draft-phase1b-content-launch-prep.md` 項目3 の正式化

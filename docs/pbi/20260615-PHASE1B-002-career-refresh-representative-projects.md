# 訪問者は Career ページで現行化された経歴と代表案件を閲覧できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- 現行化された全経歴に加え、過去 20 年分から選んだ代表案件サマリを Career ページで閲覧でき、About の経歴記述と矛盾しない

## なんのために
- ダミーデータ削除で Career が実案件 2 件（2021〜）のみとなり寂しい（R-08）。About の「25 年」と Career の内容が不整合
- 関連: site-plan.md FR-04 / R-08 / Phase 1b（コンテンツ整備）

## 受け入れ条件
- [ ] 運営者インプット（過去 20 年分から代表案件 1-2 件のサマリ＝時期・役割・技術・規模、既存 2 件の記載確認）を反映して `src/data/career.ts` を更新
- [ ] id=2 の役割など一次情報が無かった項目を運営者から取得して反映する（取得できないものは捏造せず非表示を維持。`CareerItem.role?` は optional）
- [ ] About の経歴記述（25 年）と Career ページの内容が整合する
- [ ] 運営者承認を実装ログに記録
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）

## 技術メモ
- 想定セッション数: 1（データ更新が主。運営者インプット待ちは実装フェーズ外の外部待ち）
- 関連ファイル: `src/data/career.ts`。利用側は `src/pages/career.astro` / `src/components/CareerTimeline.astro`（Home に Career 抜粋があれば `src/pages/index.astro` も連動）
- archive ブランチ（archive/vite-react-chakra）の元データまで遡及済みで id=2 の役割は一次情報なし（PHASE1A-010）→ 運営者インプットが唯一の出所
- CF preview の反映は push 後 約 3 分。その間は新ルートに旧バージョンが応答し HTTP エラーになり得る（「ビルド待ち」と切り分け、PHASE1A-010）
- 運営者インプット待ち項目。待ち時間は Contact（004 / 005）を並行

## 備考
- `draft-phase1b-content-launch-prep.md` 項目2 の正式化

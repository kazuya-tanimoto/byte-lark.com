# 訪問者は Skills ページで現行の正確なスキル・資格情報を閲覧できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- Skills ページ・Home 抜粋・About で、運営者が「現在の実態」として承認した最新のスキルセット・保有資格を閲覧できる

## なんのために
- Skills / 資格データは archive ブランチ（旧 React 版）からの忠実移植で現在の正確性が未検証（Phase 1b 背景 / PHASE1A-022 申し送り）。古い・誤ったスキル情報は法人サイトの信頼性を損なう
- 関連: site-plan.md FR-05 / Phase 1b（コンテンツ整備）

## 受け入れ条件
- [ ] 運営者インプット（各スキルの現在の経験年数、追加・削除すべき項目、資格の追加有無）を反映して `src/data/skills.ts` を更新
- [ ] `src/data/qualifications.ts` を更新（資格の追加・削除・有効期限）
- [ ] Skills ページ（/skills）・Home 抜粋・About・Header のスキル参照箇所すべてに更新が反映される
- [ ] 追加スキルのアイコンは devicon の実在を `raw.githubusercontent.com`（devicon.json）で照合してから設定する（jsdelivr は不在ファイルに 403 を返すため実在判定に使えない）。実在しないものはアイコンなし表示に統一
- [ ] 運営者が表示内容を「現在の実態として正確」と承認し、実装ログに承認を記録
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）

## 技術メモ
- 想定セッション数: 1（データ更新が主。運営者インプット待ちは実装フェーズ外の外部待ちで、コード作業自体は 1 セッションに収まる）
- 関連ファイル: `src/data/skills.ts` / `src/data/qualifications.ts`。利用側は `src/pages/skills.astro` / `src/pages/index.astro` / `src/pages/about.astro` / `src/components/SkillSet.astro` / `src/components/Header.astro`（grep 確認 2026-06-15）
- devicon: Struts は未収録、VB.Net / GAS もアイコンなし（PHASE1A-011）。jsdelivr は不在ファイルに 404 でなく 403 を返すため、devicon リポジトリ本体（raw.githubusercontent.com の devicon.json）で裏取りする
- dev server が data ファイル編集を HMR で拾わず古い HTML を返すことがある（PHASE1A-011）。再起動時の旧プロセス停止は TaskStop（sandbox で kill 不可）
- 運営者インプット待ち項目。待ち時間は Contact（004 / 005）を並行で進める想定

## 備考
- `draft-phase1b-content-launch-prep.md` 項目1 の正式化

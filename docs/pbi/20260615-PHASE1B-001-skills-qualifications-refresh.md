# 訪問者は Skills ページで現行の正確なスキル・資格情報を閲覧できる

Status: InProgress
Started: 2026-06-15

## 誰が
- 訪問者

## 何をできる
- Skills ページ・Home 抜粋・About で、運営者が「現在の実態」として承認した最新のスキルセット・保有資格を閲覧できる

## なんのために
- Skills / 資格データは archive ブランチ（旧 React 版）からの忠実移植で現在の正確性が未検証（Phase 1b 背景 / PHASE1A-022 申し送り）。古い・誤ったスキル情報は法人サイトの信頼性を損なう
- 関連: site-plan.md FR-05 / Phase 1b（コンテンツ整備）

## 受け入れ条件
- [x] 運営者インプット（各スキルの現在の経験年数、追加・削除すべき項目、資格の追加有無）を反映して `src/data/skills.ts` を更新（2026-06 確定値。Kotlin/Django/FastAPI 削除、SQL/TailwindCSS/CodeIgniter/Git 追加、AI 活用カテゴリ新設）
- [x] `src/data/qualifications.ts` を更新（資格の追加・削除・有効期限）：変更なし＝2011年以降の新規取得なし（運営者確認 2026-06）
- [x] Skills ページ（/skills）・Home 抜粋・About・Header のスキル参照箇所すべてに更新が反映される（About=リンクのみ / Header=nav のみで data 非参照、grep 確認。Home 抜粋は年数なし AI を除外する filter 追加）
- [x] 追加スキルのアイコンは devicon の実在を `raw.githubusercontent.com`（devicon.json）で照合してから設定する。tailwindcss/codeigniter/git=実在→設定、sql/struts/GAS/AI 系=不在→アイコンなしで統一
- [x] 運営者が表示内容を「現在の実態として正確」と承認し、実装ログに承認を記録（2026-06-17 承認、追って修正の留保つき）
- [x] `yarn build` 成功 / `yarn check:ts` エラーなし（0 errors）
- [x] ローカル スクショ確認（desktop + mobile）：/skills・/ を 1280/390 幅で確認、年数・アイコン・AI 名前のみ表示・Home 抜粋 top8 を目視確認
- [ ] CF preview スクショ確認（branch alias URL）← push 後
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）← push 後

## 技術メモ
- 想定セッション数: 1（データ更新が主。運営者インプット待ちは実装フェーズ外の外部待ちで、コード作業自体は 1 セッションに収まる）
- 関連ファイル: `src/data/skills.ts` / `src/data/qualifications.ts`。利用側は `src/pages/skills.astro` / `src/pages/index.astro` / `src/pages/about.astro` / `src/components/SkillSet.astro` / `src/components/Header.astro`（grep 確認 2026-06-15）
- devicon: Struts は未収録、VB.Net / GAS もアイコンなし（PHASE1A-011）。jsdelivr は不在ファイルに 404 でなく 403 を返すため、devicon リポジトリ本体（raw.githubusercontent.com の devicon.json）で裏取りする
- dev server が data ファイル編集を HMR で拾わず古い HTML を返すことがある（PHASE1A-011）。再起動時の旧プロセス停止は TaskStop（sandbox で kill 不可）
- 運営者インプット待ち項目。待ち時間は Contact（004 / 005）を並行で進める想定

## 備考
- `draft-phase1b-content-launch-prep.md` 項目1 の正式化

## 実装ログ

### 2026-06-15 経歴ソース調査（着手）
やったこと:
- career-docs repo（別repo: `/Users/kazuya/src/career-docs`）と 2014年職務経歴書PDF を一次情報として精査
- 経歴ソースの所在を特定（git log は経歴変遷を含まない点を確認）

学び・想定外:
- career-docs の git 履歴は 2026-02-28〜2026-06-15 の約3.5か月・42コミットのみ。内容も PM版スキルシート推敲 / 単価交渉資料の編集が大半で、数年スパンの経歴変遷ではない。年代別 xlsx（2022〜2025）は初回コミットで一括追加のため git diff で変遷を追えない
- 経歴の正解ソースは git log ではなく以下:
  - `master-career-data.md`（43KB・2026-04-22 更新）= 現在の統合マスター（最も信頼できる）
  - 年代別 xlsx（`スキルシート_220716`〜`_20250127`）= 年次スナップショット（バイナリ・要抽出）
  - 2014年職務経歴書PDF = 最古スナップショット（2001〜2014、初期キャリア詳細）
- 資格: `qualifications.ts` の5件は master の保有資格と完全一致。2014PDFには基本情報技術者/カラーコーディネーター3級/SystemWalker/運転免許もあるが master で意図的にIT上位5件へ絞った形跡 → 「2011年以降の新規取得有無」確認のみ必要
- スキル: `skills.ts`（旧React版からの忠実移植）の経験年数は master と多数不一致（例 Java 9↔5, Oracle 3↔10+, Nginx 6↔1, TypeScript 6↔3+）。blog の数字も master の `[10+年]` 表記も単独では不正確 → 運営者インプット必須（PBI前提どおり）

運営者合意した進め方（2026-06-15）:
- ソースは master-career-data.md を正・2014PDFで初期キャリア補完（git log 非依存）
- スキル年数は「blog現状×master 全項目突合表」を運営者レビューで確定（推奨案を選択）
- 経歴の公開可部分を `docs/career-source.md` に抽出保管し 002/003 で再利用（推奨案を選択。単価/住所/生年月日/電話/個人Gmail/NG条件/診断 等の私的情報は除外、PHASE1B-003 リスク低減を兼ねる）

残タスク:
- スキル突合表への運営者の年数・追加/削除インプット → `skills.ts` 反映
- 資格の新規取得有無確認 → `qualifications.ts`（必要時）
- `docs/career-source.md` 作成（公開可抽出版）
- 反映後 build / check:ts / ローカル+CFスクショ / CI green

### 2026-06-17 実装（運営者インプット反映）
運営者確定インプット:
- スキル表現は経験年数を維持（A/B/C 習熟度は主観が入るため不採用 → 客観値の年数を採用）。Decision として site-plan へ反映候補
- AI 活用ツールは年数表示に馴染まないため名前のみ表示
- Kotlin 削除（実務1年未満・今後利用予定なし）、Neovim 3 / GAS 3、Django/FastAPI 削除（実スキルシート・master いずれにも無し）、他年数は推定提案値で確定、資格は2011年以降なし

やったこと:
- `types/skills.ts`：`years` を optional 化（AI 系は年数省略）
- `data/skills.ts`：全面更新（6カテゴリ。OS/MW・Languages・FW・DB・Tools・AI 活用）。年数は職歴ベース確定値、アイコンは devicon 照合済み
- `components/SkillSet.astro`：`years` 無しは年数行を描画しない条件分岐
- `pages/index.astro`：topSkills を `years != null` で filter（年数なし AI を抜粋から除外）し sort を null 安全化
- `docs/career-source.md` 新規作成（公開リポジトリ前提の公開可抽出版。単価/年商/年齢/生年月日/住所/連絡先/NG条件/診断は除外）
- ローカル検証合格（/skills desktop+mobile、/ home 抜粋 top8 に AI 混入なし）

学び:
- スプレッドシート版スキルシート（最新2024-08）の利用技術は習熟度 A/B/C 表記で、年数は持たない。master の `[10+年]` も含め信頼できる年数の一次ソースは存在せず、年数は運営者確認が必須だった（PBI 前提の裏付け）
- このリポジトリは公開前提のため career-source.md は公開可情報のみに限定（PHASE1B-003 のリスク低減を兼ねる）

運営者承認:
- 2026-06-17：レンダリング結果（/skills）を確認し「いいんじゃないかな。必要あれば追って修正」と承認

残タスク:
- commit / push → CF preview スクショ確認 → `scripts/ci-status.sh` で UI Tests / Quality Checks green 確認 → Status: Done + INDEX 同期

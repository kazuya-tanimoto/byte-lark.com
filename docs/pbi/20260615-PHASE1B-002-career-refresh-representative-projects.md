# 訪問者は Career ページで現行化された経歴と代表案件を閲覧できる

Status: InProgress
Started: 2026-06-20

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

## 実装ログ

### 2026-06-20 経歴ソース再調査 + 方針確定（着手）

経緯（重要な方針転換）:
- 当初 `docs/career-source.md` を正解ソースに使う想定だったが、運営者指摘で「career-source.md は前セッションが圧縮した二次情報、`master-career-data.md` も AI でスキルシート向けにサマった二次情報」と判明。**一次情報だけを Input にする**方針に変更。一次ソースの所在はメモリ `project_career_primary_sources` に記録。

一次情報から集約した経歴データ（出所つき）:
- 詳細（担当業務＋成果）が揃いモーダル化可能な7案件:
  1. 大規模決済プラットフォーム横断PM（2025/07〜2026/07・横断PM・7名・委託）＝現行HTML。AI活用成果リッチ
  2. 障がい者支援ポータル（2022/09〜現在・PM/PO/Dev・17名・委託）＝現行HTML。W/F+Scrum、PBImod AI自動化
  3. 医薬品問診システム（2021/12〜2023/06・SE・4名）＝**現行HTMLで削除済→04-22版(54f7a3c)から回収**
  4. Web制作サーバーサイド/進行管理（2015/03〜2021/11・SE→部長→PM・15名・社員）＝現行+04-22
  5. 鉄道キャンペーンシステム（2020/12〜2021/09・PM/SE・4名）＝**現行HTMLで削除済→04-22版から回収**
  6. 電力会社基幹システム再構築（2012/10〜2014/06・PM/SE・15名・社員）＝現行+04-22
  7. 社内PM標準策定（2012/07〜2013/02・メンバー・10名・学会発表）＝04-22版
- 一行粒度（HTMLその他表）＋ 2014 PDF に granular 詳細: 製薬(2020)・民泊副業(2017-2020)・病院パッケージ(2014-2015)・電力系Web/HOST/C-S 多数(2008-2014)・通信キャリア料金系(2001-2007 初期4案件)。初期キャリアは 2014 PDF にしか詳細が無い。

設計に効く発見:
- 経歴は直列でない。決済PF（2025-2026）とポータル（2022-現在）は並行案件（委託で複数クライアント同時）。
- 一次情報そのものが顧客名を伏せている（決済=大規模決済PF、ポータル=顧客名なし）。DMM/沖縄企業名は二次情報(master)のみ。

運営者と確定した方針（2026-06-20）:
- 表示: 全スクロール＋カードクリックでモーダル詳細（旧 archive/vite-react-chakra の設計意図を完成させる形。現 Astro 版はモーダル未実装で CareerDetailData がデッドコード）。実装は shadcn Dialog（React island）。
- 顧客名: 伏せる（一次情報に整合）。
- 除外する非公開: 単価、個人特定情報（生年月日・住所・電話・個人メール＝2014PDF 4ページ目）、master の自己評価ネガ（決済「適性に合わず」等／負けパターン・地獄条件）。
- 載せてよい: 性格診断（ストレングスファインダー Top5・MBTI ENTJ。個人特定不可のため可）、一次HTMLの「得意領域/合わない領域」（明確に不得意と書かず「合う/合わない」で表現＝足切り目的）。
- スコープ拡大: PBI 当初の「代表案件1-2件追加」を超え、Career フル再構築になる。

確定した残論点（2026-06-20）:
- 初期キャリア（2001〜2014）はモーダルなし＝「その他」一覧に留める（運営者決定）。
- 性格診断（ストレングス Top5・MBTI ENTJ）と一次HTMLの「得意領域/合わない領域」（"合う・合わない" の言い方で足切り目的）は About（PBI 003）に置く。Career（002）は案件タイムライン＋モーダルに集中（運営者決定）。→ 003 着手時に反映するため申し送り。

モーダル実装方式の決定:
- shadcn Dialog（React island）ではなくネイティブ `<dialog>` ＋ 最小スクリプトで実装。理由: 詳細テキストが SSG HTML に残りクロール可（SEO 90+ 目標）、新規依存ゼロ（NFR-08）、ESC/フォーカス/背景は標準で a11y 確保。radix-ui は導入済みだが本用途では不要。

データ構造（再構築済み 2026-06-20）:
- `src/types/career.ts`: `CareerItem`（一覧カード）/ `CareerDetail`（id 対応のモーダル詳細: role/scale/technology/responsibilities/achievements）/ `OtherCareerItem`（モーダルなし一覧）に再設計。旧 `NestedListItem`/`CareerItems` は未使用のため削除。
- `src/data/career.ts`: 主要7案件（`Career` + `CareerDetails`）＋ それ以前8件（`OtherCareer`）を一次情報から再構築。旧デッドコード `CareerDetailData` は廃止。

残実装:
- `CareerTimeline.astro` を 7案件カード（クリック→`<dialog>`）＋「その他」一覧＋開閉スクリプトに作り直す。
- `career.astro` の導線文・`index.astro` の Career 抜粋（直近 N 件に制限）を更新。
- build / check:ts / ローカル+CF スクショ / E2E・CI green。

### 2026-06-20 実装 + ローカル検証（§7・前半）

やったこと:
- `types/career.ts` 再設計、`data/career.ts` 一次情報から再構築（主要7案件 + その他8件）。
- `CareerTimeline.astro` を全スクロール7カード＋クリックで `<dialog>` モーダル（役割/規模/利用技術/担当業務/成果）＋「その他の案件」一覧＋ネイティブ dialog 開閉スクリプトに作り直し。
- `career.astro`（details/others を渡す・導線文更新）、`index.astro`（Career 抜粋を直近 N=4 に制限）更新。
- 既存 E2E（a11y.spec / navigation.spec）は /career の 200・見出し・nav のみ検証で、案件数・本文に依存しないため非破壊（grep 確認）。

検証（自動）:
- `yarn check:ts` 0 errors / `yarn build` 9 pages 成功 / `yarn check`(Biome) クリーン（fix 1 件適用後）。

ローカル確認（MCP Playwright・dev :4321）:
- /career desktop(1280): 7案件タイムライン（新しい順）＋各「詳細を見る」＋「その他の案件」8件 一覧を目視。
- /career モーダル desktop: 決済PF 案件をクリック→詳細（役割/規模/利用技術/担当業務/成果6項目）表示・背景ディム確認。
- /career mobile(390): カード・一覧の縦積み確認。モーダルもポータル案件で開きスクロール可・390px に収まることを確認。
- / desktop: Home Career 抜粋が直近4件（決済/ポータル/問診/鉄道）の 2×2 に制限されていることを確認。

未実施（push 後）: CF preview スクショ、E2E/CI green（`scripts/ci-status.sh`）。運営者承認（実レンダリング確認）も未取得。

### 2026-06-21 検証報告（§7・後半）

commit/push: feat/phase-1 aff2c8a（運営者承認済み）。

- ローカル確認: dev :4321 で /career desktop(1280)+mobile(390)、モーダル開閉（決済PF/ポータル）、/ Home 抜粋 直近4件を目視（前半ログ済み）。
- CF preview 確認: `https://feat-phase-1-byte-lark.tanimoto-a49.workers.dev/career`（aff2c8a 反映済み）を desktop で確認。7案件タイムライン＋「その他の案件」一覧＋モーダル（決済PF）の動作がローカルと一致。
- E2E/CI 確認: `scripts/ci-status.sh`（HEAD aff2c8a）→ Quality Checks=success / UI Tests=success / Workers Builds: byte-lark=success / e2e=success / quality=success。
- About 整合: About は「25年」表記、Career は 2001/07〜で整合（FR-04 / 受け入れ条件3）。※About の「2026年6月に法人化を予定」は設立済みのため要更新だが PHASE1B-003 範囲。
- 未検証項目: なし（表示内容の運営者承認のみ待ち）。

### 2026-06-21 全面やり直し（一次情報の横断・全16案件化）

運営者指摘（重大）: 初版（aff2c8a）は「その他の案件」を最新スキルシートの要約 table からコピペしただけ＝主要7案件も含め最新版2バージョンしか見ておらず、git 履歴・xlsx・2014PDF を集めた目的（最新版で削られた古い案件の詳細を復元）を果たしていなかった。「脳死でスキルシート採用するな、全案件を対象に一次情報を見て採用/除外を判断・報告しろ」。

一次情報の横断調査でやったこと:
- skill-sheet-pm.html（最新）/ frontend.html（2025-05）/ git 過去版 / xlsx 全年代（220716〜20250127）/ 2014 PDF を横断。
- xlsx を `unzip`+Python(zipfile/ET) でセル位置ごとに解析（$TMPDIR/read_xlsx.py）。**スキルシート_20240802.xlsx が全案件を同一粒度の詳細（担当業務・コメント・技術・規模・工程）で持つ最完全ソース**と判明。
- 重要発見:
  - 最新HTML版に無い実案件「サーバー構築業務の自動化ツール作成」（2020/12〜2021/04, Python/Flask/Selenium, 年間100h圧縮）を xlsx から復元。
  - 全古い案件（製薬・民泊副業・病院・電力系各案件・通信キャリア各案件）に xlsx でフル詳細あり。
  - 地雷: `スキルシート_220716.xlsx` にリクナビNEXTテンプレの他人サンプル経歴（中堅建設業・金属業・大手化学/食品、Java/Ruby）が混入→採用厳禁。
  - 「楽天/Shopify」の出所は xlsx 20240802 と判明（初版で「出所不明」とした誤りを訂正。顧客名なので伏せる方針は不変）。

成果物:
- `docs/career-source.md` を全面刷新＝**一次情報の集約保管ファイル**（全16案件の詳細＋出所セル番号＋採用/除外メモ＋About用素材）。公開可のみ（公開リポジトリのため）。落とした情報も出所セル番号で辿れる設計。
- `src/data/career.ts` を全16案件で再構築（`Career` + `CareerDetails`、新しい順）。`OtherCareer`/`OtherCareerItem` 廃止。
- 表示方針を運営者再確認: 全案件に同一粒度の詳細が揃ったため「全案件モーダル統一」に決定（旧「古いのはモーダルなし」は薄い前提が崩れたため撤回）。`CareerTimeline.astro` から「その他の案件」一覧を削除。
- About 用素材（得意/合わない領域・性格診断）は career-source.md に分離記録し PHASE1B-003 へ申し送り。

検証（自動）: yarn check:ts 0 errors / yarn build 9 pages / yarn check クリーン。dist 確認＝dialog 16・「その他の案件」無し・サーバー自動化案件あり。
ローカル確認（MCP Playwright・preview :4399。dev は HMR が data/component 変更を拾わず古い HTML を返したため preview=本番ビルドで検証）: /career desktop で全16案件が新しい順＋全件「詳細を見る」、サーバー自動化モーダル（Python/Flask/Selenium・100h圧縮）、mobile で最古=料金システムのモーダル（C/Pro*C・「80人で最速管理職」）を確認。

学び（プロセス）: 「一次情報を集めた」だけでは不十分で、全案件×全バージョンを横断して最も詳しい記述を採用し、採用/除外を理由付きで残すまでが要件だった。集約結果はファイル（career-source.md）に保管して掘り直しを防ぐ（運営者提案）。

未実施（push 後）: CF preview スクショ、E2E/CI green。表示内容の運営者承認も未取得。

### 2026-06-21 雇用形態ラベル追加

運営者要望: 一覧で会社員かフリーランスか分かるようラベルを付けたい。
やったこと:
- 一次情報（xlsx 20240802 r7-14 の雇用形態テーブル）で全16案件の雇用形態を確定。フリーランス転向＝2021/12（問診から）。
- `types/career.ts`: `Employment`型（会社員/フリーランス/副業）と `CareerItem.employment` 追加。
- `data/career.ts`: 全16案件に employment 付与。CareerDetails.scale から重複していた「/ 業務委託」「/ 会社員」を除去。
- `CareerTimeline.astro`: 一覧カードの期間横にバッジ（フリーランス=hibari-sky / 会社員=neutral / 副業=hibari-amber、控えめ。確定HEXは Phase 1c）、モーダルに「雇用形態」行。
- `career-source.md`: 雇用形態の対応表（一次→サイトラベル）を出所付きで追加。
- 呼称は運営者確定で「フリーランス」（About/footer の正式表現「業務委託（準委任）」とは別に、一覧は平易表現）。
- build / check:ts / Biome green。preview で desktop/mobile のバッジ色分け・モーダル雇用形態行を確認。

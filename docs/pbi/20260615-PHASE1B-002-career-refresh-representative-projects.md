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

# 訪問者は About / Privacy ページで運営者が事実確認・承認した文面を閲覧できる

Status: Done
Started: 2026-06-21
Completed: 2026-06-21

## 誰が
- 訪問者

## 何をできる
- 事実誤認のない About プロフィール / byte-lark 概要と、運営者が確定した Privacy ポリシーを閲覧できる

## なんのために
- About / Privacy は Claude 起草ドラフトで、運営者による事実確認・承認が未実施（文体選定とレイアウト確認のみ。Phase 1b 背景 / PHASE1A-022 申し送り）
- 関連: site-plan.md FR-10 / FR-22 / Phase 1b（コンテンツ整備）

## 受け入れ条件
- [x] 運営者が About 全文を読み、事実誤認・表現の修正指示 → Claude が反映（2026-06-21 全文提示 → 承認）
- [x] 運営者が Privacy 全文を読み、修正指示 → Claude が反映（2026-06-21 変更点提示 → 承認）
- [x] 法人化時期の表記（現: 個人事業主・2026 年 6 月法人化予定）を運営者が最新状況で確認・更新する（Privacy の制定日・改定記述、§13.1 準拠表記を含む）→ 設立済み（合同会社バイトラーク・2026/06/02）を反映。本格的な所在地・代表者・特商法・メール切替は §13.4 登記後 PBI へ委譲（運営者承認＝最小反映）
- [x] Career / Skills 現行化（001 / 002）の内容と矛盾しない（経歴・事業内容の整合）→ 役割 SE兼EM→PM/PO/Dev・「障がい者」表記・直近案件を Career(002) に整合
- [x] 両ページとも運営者の明示承認を実装ログに記録（下記 2026-06-21 entry）
- [x] `yarn build` 成功 / `yarn check:ts` エラーなし（check:ts 0 errors / build 9 pages / test 16 passed）
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）→ localhost:4321 で About / Privacy を 1280px / 375px で確認、崩れなし
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）→ `feat-phase-1-byte-lark.tanimoto-a49.workers.dev` の /about・/privacy で確定内容を確認（合同会社バイトラーク・経歴整合・ストレングス/ENTJ・Footer・JSON-LD legalName・制定日 6/21）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）→ HEAD d702a57 で Quality Checks=success / UI Tests=success / e2e=success / Workers Builds=success

## 技術メモ
- 想定セッション数: 1（文面修正の反映が主。運営者の読み込み・承認待ちは実装フェーズ外の外部待ち）
- 関連ファイル: `src/pages/about.astro` / `src/pages/privacy.astro`
- 現状の文体・構成: About = ですます調 × 見出し整理型（Q2、PHASE1A-009）、Privacy = 簡易案（Q10、5 章構成・CF Web Analytics の Cookieless 明記、PHASE1A-015）
- About には Person JSON-LD（`src/lib/jsonld.ts` の `buildPersonJsonLd()`）がある。事実変更時は `worksFor` 等の整合も確認する
- 法人化目前（§13）。Privacy の「2026 年 6 月法人化予定」は時期確認が必要
- 運営者承認待ち項目。待ち時間は Contact（004 / 005）を並行

## 備考
- `draft-phase1b-content-launch-prep.md` 項目3 の正式化

## 実装ログ

### 2026-06-21

やったこと
- About（`src/pages/about.astro`）
  - 経歴サマリを Career(002) に整合：役割「SE 兼 EM」→「PM / PO / Dev」、「障害者」→「障がい者」、直近案件（決済PF横断PM）を反映。
  - 申し送り素材（career-source.md「About 用素材」）を 2 セクション新設で反映：「得意な領域・合う仕事」（得意領域＋合わない領域＝足切り）／「持ち味・タイプ」（ストレングスファインダー Top5 ＋ MBTI ENTJ、診断名明示。運営者選択）。
  - ビジョンの法人化表記を「個人事業主・法人化予定」→「2026 年 6 月に法人化、合同会社バイトラークとして活動」へ更新。「屋号の由来」の「屋号」→「名前」、meta description の「屋号 byte-lark」→「byte-lark（合同会社バイトラーク）」。
- Privacy（`src/pages/privacy.astro`）
  - 基本方針の運営者表記を「合同会社バイトラーク（byte-lark、2026 年 6 月設立）」へ。改定記述の「（法人化等）」例示を削除。制定日 6/12 → 6/21（法人情報を含め確定した日）。
- Footer（`src/components/Footer.astro`）：「byte-lark（個人事業主）/ 2026年6月 法人化予定」→「合同会社バイトラーク（byte-lark）/ 2026年6月設立」（About/Privacy との整合）。
- JSON-LD（`src/lib/jsonld.ts`）：発行元 Organization に `legalName: "合同会社バイトラーク"` を追加（Person.worksFor / Article.publisher 共通。表示ブランドは byte-lark のまま）。
- 検証：check:ts 0 errors / build 9 pages / unit test 16 passed。localhost で About・Privacy を 1280px / 375px 確認（崩れなし、文言一致）。

運営者の明示承認（受け入れ条件 #5）
- 2026-06-21、About 全文・Privacy 変更点・確認 3 点（最小反映スコープ／制定日 6/21／Privacy mailto 据え置き）を提示し「ok」で承認を取得。法人実データ（社名: 合同会社バイトラーク、設立: 2026/06/02）も同日に運営者から取得。

残タスク
- push 後に CF preview（branch alias）スクショ確認 + CI（UI Tests / Quality Checks）green 確認 → Done 化。

申し送り
- PHASE1B-005（Contact フロント）：フォーム化（Turnstile + Resend）完了時に Privacy「個人情報の取得＝メールでのお問い合わせ」をフォーム経由の取得方法へ更新する。
- 法人化対応 PBI（site-plan §13.4、登記後）：所在地・代表者・正式法人名のフル表記、Contact 法人メール切替、特商法表記（FR-28）、Privacy の安全管理措置追記、制定日の公開日合わせを起票時に対応。設立日 2026/06/02 を使用。

学び・つまずき
- 本 PBI は「文面確定（運営者承認）」が主眼で UI 実装は軽微だが、法人化が PHASE1B-002 期間中に設立済みへ進んでおり、site-plan §13.1（法人化前提）の前提が動いていた。一次情報（career-source.md）と運営者確認で現況を取り直してから反映した。
- 法人名は英字ブランド byte-lark ではなく登記上はカタカナ「合同会社バイトラーク」。表示はブランド byte-lark を残しつつ legalName で登記名を補う形にした。

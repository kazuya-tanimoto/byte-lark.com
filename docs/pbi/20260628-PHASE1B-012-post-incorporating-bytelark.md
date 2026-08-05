# 訪問者は「個人事業を法人化した話（合同会社バイトラーク設立）」（life）を読める

Status: Done
Started: 2026-08-03
Completed: 2026-08-05

## 誰が
- 訪問者

## 何をできる
- 長く続けた個人事業を 2026 年に法人化（合同会社バイトラーク設立）した経緯・手続き・気づきを、エンジニア視点のリアルな体験として読める

## なんのために
- PHASE1B-007 で確定した初期記事セットの看板 life 記事（L1）。初期セットは site-plan v3.11 Decision #29 で 3 本（T1 / T2 / L1）に縮小され、本記事は公開前に揃える唯一の life 記事。About「byte-lark について」の事業文脈を物語として補強し、人柄と独立の歩みを伝える
- 関連: src/pages/about.astro（byte-lark について）/ Phase 1b / PHASE1B-007

## 受け入れ条件
- [x] 運営者 + Claude でヒアリング（writing-workflow §3）→ Claude が Markdown ドラフト生成（`yarn new-post --slug incorporating-bytelark --category life`、`draft: true`）
- [x] frontmatter 完備：title（`| byte-lark.com` サフィックス無し）/ description（80-120字・OGP 兼用）/ category: life / tags / publishedAt / slug。本文冒頭に `# タイトル` を重複させない（PostLayout が title を h1 出力）
- [x] 運営者がリライトし `draft: false` に変更（最終承認を実装ログに記録）
- [x] OGP / Article JSON-LD が記事ページで正しく出力される（headline 汚染なし、`buildArticleJsonLd()`）
- [x] `yarn build` 成功 / `yarn check:ts` エラーなし（CF Workers Builds success / pre-push typecheck 通過 + CI Quality Checks success）
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- カテゴリ: life / 想定 slug: incorporating-bytelark
- 内容の柱（ネタ出し L1）: 2026/06/02 合同会社バイトラーク設立（PHASE1B-003 で確定した実データ）/ なぜ法人化したか / 手続きで詰まった点 / 法人化で変わったこと
- About / Footer / Privacy の法人表記（合同会社バイトラーク・2026 年 6 月設立）と矛盾させない
- 公開（main マージ）は Phase 1d。feat/phase-1 上では `draft: false` で CF preview 確認可

## 備考
- 初期セット 6 本のうち 5 本目（L1）

## 実装ログ

### 2026-08-05
- やったこと：ヒアリング（writing-workflow §3、10 問）→ ドラフト生成 → 運営者 FB 反映を 2 往復（税理士メモの比較リスト化、経費×情報発信の筋を削除して一般事例＝賃貸社宅に差し替え、司法書士の感想復活）→ 「情報発信を始めた」小節追加 + 記事 1 に法人化動機を追記して相互リンク化 → 運営者リライト → /article-review 実施、指摘 1-5 適用（年金事務所への名称修正・強制改行・表記統一・公告の補足）→ フォルダ形式へ移動
- 決定事項：売上グラフは載せない（単価逆算の材料になるため）。持ち家リースの社宅化（運営者の実際の予定）は記事に書かない。タイトルは PBI 名どおり
- 残タスク：cover 生成（/cover-image）→ 運営者最終確認 → draft: false → §7 検証（ローカル/CF preview スクショ + CI green）→ publishedAt を公開日に更新（Phase 1d、メモ既存）→ Done 化
- 学び：税務・法律の主張は全て「税理士さんに聞いた話」の伝聞フレームで書くと、裏取り不能な体験談でも安全に書ける

### 2026-08-05（カバー生成〜Done 化）
- やったこと：/cover-image でカバー生成。差別化方針（life 記事は濃紺設計図調を離れる）で「春空＋巣立ちのヒバリ」「書類＋社印フラットレイ」2案×各2枚 → 運営者 FB で改善反復（ロゴの鳥への置換・太陽の光線帯削除・巣箱の描き込み向上）→ 最終「ハンコ改1」（書類＋ロゴのヒバリ入り社印）を運営者選定。2000×1050 で `cover.png` 配置、`draft: false` 化、§7 検証全通過（ローカル + CF preview スクショ、CI: UI Tests / Quality Checks / Workers Builds / CodeQL すべて success、head 6a999f9）。OGP og:image / Article JSON-LD 出力も CF preview 実 HTML で確認
- 決定事項：カバーは書類＋社印案（生成画像を1枚目参照にした差分指示方式で品質を詰めた）。publishedAt は暫定 2026-08-03 のまま、Phase 1d 公開日に見直し（メモリ済み）
- 学び：①画風変換つき生成はロゴ参照を渡しても鳥が再解釈される。生成済み画像を1枚目参照＋「変更点だけ指示」の差分方式が忠実度・品質とも安定 ②質感だけ指示しても対象の形が貧相なら貧相なまま。形状仕様（板張り・軒・止まり木等）から指示する ③参照画像はプロンプトが言及する枚数だけ渡す（余分に渡すと NO_IMAGE で空応答になった）
- 想定外：`out/` フラット出力で記事との対応が分からなくなっていた → 記事 slug ごとのサブディレクトリ整理 + スキル更新で恒久対応（6a999f9）

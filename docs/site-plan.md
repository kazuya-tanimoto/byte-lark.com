# byte-lark.com サイト構築計画書 (v3.13)

最終更新: 2026-08-10

> v3.12 → v3.13 主な変更：**公開後の運用形態の確定**（Phase 1d Gate = PHASE1D-009）。① 統合ブランチ `feat/phase-1` を畳み、main 起点の「1 作業 1 ブランチ → PR」に戻す ② Phase 1e を「カテゴリ別一覧」から「公開後の運用・改善」に再定義（カテゴリ別一覧と前後記事リンクは記事 10 本到達時に同 Phase へ追加起票）③ ダークモードはやらないと確定。Decision #31 追加、§7 ロードマップ 1e 行・現在地図・§12 次アクションを公開後の実態に更新。README v3.9 / CLAUDE.md / operation-manual.md 連動。

> v3.11 → v3.12 主な変更：**記事ライセンスの変更（CC BY 4.0 → 通常の著作権表記）**。Footer の CC BY 表記を削除して © のみとし、Privacy ページに「著作権について」節を新設（出典明記の引用は歓迎 / 全文転載・二次利用は Contact へ相談）。CC BY は全文転載 + 広告収益化をクレジットのみで合法化するため Phase 2 の収益化計画と相性が悪く、配布後は取消不能のため公開（1d）前に変更。Decision #30 追加、Q12・R-09・CLAUDE.md（版数参照）連動。

> v3.10 → v3.11 主な変更：**初期記事セットの縮小（6 本 → 3 本、公開優先）**。公開前に揃える記事を T1 サイト構築総括（PHASE1B-008、公開済み）+ T2 自前フォーム実装（PHASE1B-009）+ L1 法人化（PHASE1B-012）の 3 本に縮小し、残り 3 本（T3 レガシー移行 / T5 PO 業務 / L2+L3 ストレングス）は `docs/article-backlog.md` に移して公開後に月次 routine（R-01）で消化する。Decision #29 追加、§7 ロードマップ 1b 行・PHASE1B-014（Gate 完了条件）・INDEX.md・article-backlog.md・CLAUDE.md 連動。PHASE1B-010 / 011 / 013 は取り下げ（Dropped、README v3.6 で状態を新設）。

> v3.9 → v3.10 主な変更：**Phase 1c 先行トラックの導入（1b 記事執筆との並行許可）**。1c（デザインブラッシュアップ）を二段構えに分割：**先行トラック**（記事非依存：デザイン方向性確定 / 確定 HEX + color-contrast 再有効化 / タイポ確定 / ロゴ刷新 / favicon / B-1 見出しレベル / B-2 フォント CLS）は 1b Gate 通過前でも起票・着手可、**仕上げトラック**（B-3 CSS サイズ / 全記事での最終再検証 / 1c Gate）は従来どおり 1b Gate 通過後に起票。Decision #28 追加、§7 ロードマップ 1c 行・「PBI の起票タイミング」節を連動更新。README §9 例外（v3.3）/ INDEX.md / CLAUDE.md / draft-phase1c-design-polish.md / PHASE1B-014 も連動。先行トラック PBI（PHASE1C-001〜007）を同日起票。

> v3.8 → v3.9 主な変更：**Phase 再編（公開の独立フェーズ化）**。新 1b = コンテンツ整備（Skills / Career 実データ化、About / Privacy 文面確定、Contact フォーム化、初期記事セット）、新 1c = デザインブラッシュアップ（旧 1b）、新 1d = 公開（NS 移管 / カスタムドメイン / Web Analytics / Search Console。旧 PHASE1A-018 を移管）、新 1e = カテゴリ別一覧（旧 1c）。Decision #25（公開フェーズ分離）・#26（Contact 自前フォーム = Worker + Turnstile + Resend）追加、FR-29 追加、FR-19 / FR-28 / Decision #4 #15 #21 #23 / R-06 #07 #08 #12 / Q11 / §6.7 の Phase 名を連動更新。**読み替え注意**：Done 済み PBI 内の旧 Phase 名は当時の表記のまま（旧 1b → 新 1c、旧 1c → 新 1e と読む）。

> v3.7 → v3.8 主な変更：Phase 0 Retrospective Gate（PHASE0-010）での事実修正。§6.4 ディレクトリ構成から `tailwind.config.ts` を削除（Tailwind v4 は CSS ベース設定のため不使用）。Decision #21 を shadcn 4.x の preset 体系（Radix + Nova）に更新。

> v3.6 → v3.7 主な変更：ブランチ運用方針確定。README.md §10 ブランチ運用 新設（Phase ブランチ + 常時 PBI sub-branch + worktree 並行 / merge --no-ff / sub-branch マージ後保持 / CF Pages Preview Branch Filter 必須 / main 保護 / Hotfix 手順）。operation-manual.md に並行 PBI 開始シーン・Phase 完了マージ承認・main 保護・CF Pages filter・Q6（push 競合対処）追加。PHASE0-007 に CF Pages Custom branches 設定追加、PHASE0-009 main マージ手順を `git merge --no-ff` で具体化。§14 row 1 拡張、運用ルール表に「ブランチ運用」「CF Pages branch filter」行追加。

> v3.5 → v3.6 主な変更：運営者向け運用マニュアル `docs/operation-manual.md` を新規作成（シーン別フレーズ表 / 中断 signal リカバリー / トラブルシューティング Q1-Q5）。INDEX.md 着手ルールに「セッション開始時の必須チェック」（§5.8 検出スクリプト実行）を必須化、CLAUDE.md ヘッダーにも同等の必須化と operation-manual.md への誘導を追加。§14 row 1 想定箇所に operation-manual.md と INDEX.md セッション開始チェックを追加、運用ルール表に「運営者向けプロトコル変更」行を追加。

> v3.4 → v3.5 主な変更：4 回目レビュー推奨を反映。§14 row 1（v3.x）の想定箇所列に PBI 内参照（INDEX.md / PHASE0-005 / PHASE0-009）を明示追加し row 2 と粒度統一、row 3 の `N 件` placeholder を `<件数> 件` に明確化、運用ルールに「改訂履歴の同期」「想定箇所列での 1 件ずつ突合」「将来の scripts 化検討」を追記。CLAUDE.md キックオフヘッダの参照をクリッカブルリンク化、INDEX.md 改訂履歴に v3.4 / v3.5 連動行を追記。

> v3.3 → v3.4 主な変更：3 回目レビューで検出された連動更新漏れ再発（§6.7 line 348 の v3.2 残存、§7 フロー図の PHASE0-001〜009 残存）を修正。再発防止のため §14「バージョン参照箇所一覧（メンテ用）」を新設。PHASE0-008 の Web Analytics 観測方法を具体化（DevTools / View Source）。CLAUDE.md にキックオフ用の暫定ヘッダ追加（PHASE0-005 で丸ごと差し替え予定だが、それまでの初動セッション向けに INDEX.md へのポインタ）。

> v3.2 → v3.3 主な変更：差分レビュー指摘を反映。連動更新漏れの修正（§6.4 writing-workflow タイミング、§12 各バージョン参照、§13.4 誤字）。PBI 側にも連動修正（PHASE0-009 受け入れ条件に PHASE0-010 含める、計画書バージョン参照を v3.3 に、PHASE0-008 の Web Analytics 計測 Done 判定を緩和、PHASE0-002 の playwright.config.ts 表現修正、PHASE0-010 の行数基準削除、PHASE0-006 ファイルリネーム、INDEX.md 構造整合）。

> v3.1 → v3.2 主な変更：Phase 0 PBI レビュー指摘を反映。writing-workflow.md の作成タイミングを Phase 0 末 → Phase 1a 冒頭に変更、Decision Log #21（shadcn style/baseColor デフォルト）追加、§6.7 既存資産取扱表を Phase 0 PBI 群と整合させた。

> v3 → v3.1 主な変更：PBI を Phase ごとに起票する方針を §7 / §12 に明記、Phase 間に Retrospective Gate を導入（Phase 0 完了 → 学び棚卸 → 次 Phase PBI 起票 → レビュー → 実装の流れを規定）。

> v2 → v3 主な変更：レビュー指摘を全面反映。Tailwind v4 統合方法の修正、デプロイ先・解析ツール確定、shadcn 利用範囲を明示、法令・コンプラ系（プライバシー / アフィリエイト表記 / 構造化データ）追加、Playwright 既存資産扱いの修正、CLAUDE.md 更新を Phase 0 タスクに、Phase 0 工数 2-3 日に修正、Phase 1a に CI / 仮 HEX / コードハイライトを移設、リスク表大幅拡張、未決事項 Q1-Q13、§13 法人化に伴う改訂を独立章化。

---

## 1. 背景

- 個人事業主として 2026 年 6 月に法人化（屋号: byte-lark / `byte-lark.com`）
- 案件は当面エージェント経由が主体。直案件・採用は副次
- 旧 `byte-lark.com` repo は Hugo サイトだったが数年未更新でバックアップ後削除済み、本 repo にリネームで名称統一
- 開発リソースは 1 人（運営者本人）+ Claude Code 主導
- 「Chakra で自分で実装する経験を積む」当初の動機は破棄。Claude 主導前提で **AI フレンドリーなスタック**（訓練データ豊富 / コピペ型コンポーネント / 安定 API）に振り直す

## 2. 目的 / ゴール

1. **個人としての職能リファレンス**を一元化（エージェント案件・面談時の URL 提示用）
2. **法人としての最低限のメタ情報**を備える（所在地・連絡先、直案件・取材・採用窓口）
3. **個人技術 / ライフ系ブログ**として継続的に記事を蓄積できる基盤を持つ
4. 記事数の増加に応じ広告収益化（AdSense / Amazon アソシエイト）を視野に入れた **SSG / OGP 対応を Phase 1 から完備**
5. 執筆ハードルを下げる仕組み（ヒアリング → ドラフト → リライト → 文体プロファイル蓄積 + 月次リマインダ）を整備

## 3. 非ゴール（今回やらない）

- 認証 / 会員機能 / コメント機能
- 多言語化 (i18n)
- ヘッドレス CMS 導入（Supabase / microCMS 等）
- ブログのフルテキスト検索エンジン
- 既存 Vite + React + Chakra 実装の延命（archive/vite-react-chakra ブランチに保存済み）

## 4. ターゲット / ペルソナ

| 優先度 | 属性 | 来訪動機 |
|---|---|---|
| 高 | エージェント担当者 / クライアント案件 PM | 候補者の職能確認、面談前の事前リサーチ |
| 中 | 同業エンジニア（読者） | 技術記事の検索流入、SNS 経由 |
| 中 | 法人取引候補（直案件問合せ） | 連絡先・事業実体の確認 |
| 低 | 採用候補者 | 法人化後、人を雇うフェーズで |

## 5. 要件

### 5.1 機能要件

| ID | 要件 | 優先度 | Phase |
|---|---|---|---|
| FR-01 | トップページに Hero（名前・肩書・要約・主要リンク）を表示する | 必須 | 1a |
| FR-02 | トップページに Career / Skills の **抜粋**（直近 N 件 / 上位 M 件）を表示し、詳細ページへ誘導する | 必須 | 1a |
| FR-03 | Career のダミーデータ（id=3,4 の境界テスト用文字列）を排除し、実データのみ表示する | 必須 | 0 |
| FR-04 | `/career` ページで Career 全件をタイムライン形式で表示する | 必須 | 1a |
| FR-05 | `/skills` ページで全カテゴリ・全アイテムを表示する | 必須 | 1a |
| FR-06 | `/blog` で Blog 一覧（フラット、新しい順）を表示する | 必須 | 1a |
| FR-07 | `/blog/:slug` で Blog 記事詳細を表示する | 必須 | 1a |
| FR-08 | Blog 記事を Markdown / MDX ファイルから取り込む（Astro Content Collections） | 必須 | 1a |
| FR-09 | Blog 一覧で category（tech / life）バッジ表示 + クライアントサイドフィルタを提供する | 必須 | 1a |
| FR-10 | `/about` に個人プロフィール + byte-lark 概要を表示する | 必須 | 1a |
| FR-11 | `/contact` に法人問合せ口（メール、対応領域）を表示する | 必須 | 1a |
| FR-12 | Footer に法人メタ情報（社名・所在地・メール）を最小配置する | 必須 | 1a |
| FR-13 | トップの Blog セクションは最新 N 件のみ表示し、`/blog` へリンクする | 必須 | 1a |
| FR-14 | 各記事に publishedAt / updatedAt / category / tags / cover image / description を持たせる | 必須 | 1a |
| FR-15 | Qualifications を Home 内のセクションとして表示する（独立ページ不要、件数少のため） | 必須 | 1a |
| FR-16 | NotFound ページ (`*`) を用意する | 必須 | 1a |
| FR-17 | 全ページで OGP メタ（title / description / og:image / canonical）を SSG 時に静的生成する | 必須 | 1a |
| FR-18 | 各記事ページで個別の OGP メタを SSG 時に静的生成する | 必須 | 1a |
| FR-19 | 記事数到達時（合計 10 件以上 + 偏在許容）に `/blog/tech`, `/blog/life` カテゴリ別一覧を追加する | 1e | 1e |
| FR-20 | RSS フィードを `/rss.xml` で配信する | 必須 | 1a |
| FR-21 | sitemap.xml を自動生成する | 必須 | 1a |
| FR-22 | `/privacy` プライバシーポリシーページを設置する | 必須 | 1a |
| FR-23 | Footer に Amazon アソシエイト参加表記を配置する（参加時のみ条件付き表示も可） | 必須 | 1a |
| FR-24 | 各記事ページに JSON-LD (Article schema) を埋め込む | 必須 | 1a |
| FR-25 | `yarn new-post` 雛形生成スクリプトを提供する | 必須 | 1a |
| FR-26 | コードブロックに採用ライブラリ（Q13 で確定）でシンタックスハイライトを適用する | 必須 | 1a |
| FR-27 | 画像最適化パイプラインを設定する（Astro `<Image>` / `<Picture>` で WebP 変換 + サイズ生成） | 必須 | 1a |
| FR-28 | `/legal/tokutei` 特定商取引法表記ページ（直案件で対価を受ける場合） | 法人化後 | 1e+ |
| FR-29 | `/contact` を問い合わせフォームに置換する（Worker `/api/contact` + Turnstile + Resend 送信、mailto 廃止、Decision #26） | 必須 | 1b |

### 5.2 非機能要件

| ID | 要件 | 備考 |
|---|---|---|
| NFR-01 | レスポンシブ対応（モバイル / タブレット / デスクトップ） | Tailwind の標準ブレイクポイント |
| NFR-02 | アクセシビリティ：WCAG 2.1 AA 相当に準拠、axe で重大エラーゼロ | 主要ページで Playwright + axe チェック |
| NFR-03 | TypeScript strict、ビルド時型チェック通過 | |
| NFR-04 | Lint 通過（Biome 2 を採用） | `.astro` 対応のため override 設定で対象範囲調整 |
| NFR-05 | 単体テスト：React Island 部分 (.tsx) と lib/ ロジックを Vitest でカバー | `.astro` は SSR 専用テンプレで Vitest 直接対象外、Playwright で担保 |
| NFR-06 | E2E テスト：主要画面遷移と挙動を Playwright で検証 | 既存 tests/ は Playwright 公式デモのテンプレ 2 本のみ。**自プロジェクト用は新規作成**。設定（playwright.config.ts）は流用。**実行・検証は CI（`.github/workflows/ui-tests.yml`、Playwright 公式コンテナ）で自動化**——Bash サンドボックスは Chromium 起動不可のため `yarn test:e2e` のローカル実行不可、`scripts/ci-status.sh` で合否確認（Decision #27） |
| NFR-07 | Lighthouse スコア：Performance / Accessibility / SEO すべて 90+ | SSG なので達成容易 |
| NFR-08 | 依存追加は最小限 | |
| NFR-09 | OGP / SEO メタは SSG 時に静的生成（クライアント JS 非依存） | Astro の標準機能で担保 |
| NFR-10 | 主要依存ライブラリは Phase 0 着手時の最新安定版を採用 | 段階的更新ではなく初期化時に確定 |
| NFR-11 | Core Web Vitals: LCP < 2.5s / CLS < 0.1 / INP < 200ms | Phase 2 広告配置時の判断軸 |
| NFR-12 | コンテンツライセンス・著作権表記を明示 | Q12 で方針確定 |

## 6. 設計

### 6.1 情報アーキテクチャ / サイトマップ

```
/                           Home（Hero + Career 抜粋 + Skills 抜粋 + Qualifications + 最新記事 N 件）
├── /about                  About（個人プロフィール + byte-lark について）
├── /career                 Career 全件（タイムライン）
├── /skills                 Skills 全件（カテゴリ別）
├── /blog                   Blog 一覧（フラット、カテゴリバッジ + フィルタ）
│   └── /blog/:slug         記事詳細
├── /contact                Contact（法人問合せ口）
├── /privacy                プライバシーポリシー
├── /rss.xml                RSS フィード（自動生成）
├── /sitemap-index.xml      Sitemap（自動生成）
├── /robots.txt             検索エンジン制御
└── *                       NotFound
```

**カテゴリ定義**（記事 frontmatter で持つ。URL には Phase 1a では含めない）：
- `tech`: 技術、ガジェット、AI
- `life`: アウトドア、バイク、猫

**Phase 1e で追加予定の URL**（記事数到達時）：
- `/blog/tech`、`/blog/life`：カテゴリ別一覧
- 既存 `/blog/:slug` は維持。`<link rel="canonical">` は記事自身に向ける（カテゴリ一覧の重複コンテンツ判定回避）

**法人化後追加予定の URL**（§13 参照）：
- `/legal/tokutei`：特定商取引法表記

### 6.2 URL 設計

| URL | 役割 | Phase |
|---|---|---|
| `/` | Home | 1a |
| `/about` | About | 1a |
| `/career` | Career 全件 | 1a |
| `/skills` | Skills 全件 | 1a |
| `/blog` | Blog 一覧 + カテゴリフィルタ | 1a |
| `/blog/:slug` | 記事詳細 | 1a |
| `/contact` | Contact | 1a |
| `/privacy` | プライバシーポリシー | 1a |
| `/rss.xml` | RSS | 1a |
| `/sitemap-index.xml` | Sitemap | 1a |
| `/robots.txt` | クローラー制御 | 1a |
| `*` | NotFound | 1a |
| `/blog/tech`, `/blog/life` | カテゴリ別一覧 | 1c |
| `/legal/tokutei` | 特商法表記（直案件で対価を受ける時） | 法人化後 |

### 6.3 コンテンツモデル（Blog Post Frontmatter スキーマ）

Astro Content Collections + Zod schema で定義。

```yaml
---
title: 記事タイトル
description: 短い概要（OGP description にも使う）
category: tech                       # Zod enum で tech | life のみ許可
tags: [astro, tailwind, ogp]         # Zod refinement で表記揺れチェック（lowercase 強制）
publishedAt: 2026-05-12
updatedAt: 2026-05-15                 # 任意
draft: false                          # true の時はビルドに含めない
cover: ../../assets/posts/cover.png   # 任意、Hero / OGP image。Astro <Image> で最適化される
slug: vite-react-spa-ogp-pitfall      # frontmatter で明示推奨（ファイル名変更で URL が変動するのを避ける）
---
```

- ファイルパス：`src/content/posts/{slug}.md` または `.mdx`（フラット配置、category は frontmatter で持つ）
- 必須項目欠落・category 値不正・tags 表記揺れはビルド時エラー
- `slug` は frontmatter で明示する運用（ファイル名のみ依存だと改名で URL 変動）

### 6.4 ディレクトリ構成（Astro プロジェクト初期化後）

以下は新規スキャフォールド後の構成案。**現存する Vite/React/Chakra 関連は archive/vite-react-chakra ブランチに退避済みで、main 上では削除する**。

```
.
├── astro.config.mjs                  Astro 設定（integrations: mdx, sitemap, react / Vite plugin: @tailwindcss/vite）
├── tsconfig.json
├── biome.jsonc                       Biome 2 設定（.astro override 含む）
├── package.json
├── public/                           静的アセット（favicon.svg / favicon.ico / apple-touch-icon.png〔PHASE1C-005 確定・scripts/generate-icons.mjs で生成〕, robots.txt, og-default.png）
├── src/
│   ├── assets/                       ビルド時最適化対象（logo, ヒーロー画像）
│   │   ├── logo.svg                  フルマーク（PHASE1C-004 確定、墨一色 currentColor）
│   │   ├── logo-badge.svg            ヘッダー 26px 用バッジ。アイコン一式の原本
│   │   ├── logo-bird.svg             鳥単体
│   │   └── posts/                    記事 cover 画像
│   ├── components/                   汎用コンポーネント
│   │   ├── ui/                       shadcn/ui からコピペした Radix ベース React コンポーネント（**インタラクティブ系のみ**）
│   │   │   ├── button.tsx            shadcn 標準
│   │   │   └── ...                   必要な部品のみ随時追加
│   │   ├── Header.astro              静的、自前 Astro
│   │   ├── Footer.astro              静的、自前 Astro
│   │   ├── Hero.astro                静的、自前 Astro
│   │   ├── BlogCard.astro            静的、自前 Astro
│   │   ├── BlogPostMeta.astro        静的、自前 Astro
│   │   ├── CategoryFilter.tsx        React Island（インタラクティブ、shadcn 利用可）
│   │   ├── CareerTimeline.astro      静的、自前 Astro
│   │   └── SkillSet.astro            静的、自前 Astro
│   ├── content.config.ts              Content Collections 定義（Zod schema）
│   ├── content/
│   │   └── posts/
│   │       └── *.md / *.mdx
│   ├── data/                         構造化データ（旧 features/*/data から移植）
│   │   ├── career.ts
│   │   ├── qualifications.ts          保有資格データ（FR-15、Phase 1a で新規作成）
│   │   └── skills.ts
│   ├── types/                        型定義（Phase 1a で追加：career.ts / qualifications.ts / skills.ts）
│   ├── layouts/
│   │   ├── BaseLayout.astro          共通レイアウト（meta / OGP / canonical / JSON-LD / Header / Footer）
│   │   ├── PageLayout.astro          一般ページ用
│   │   └── PostLayout.astro          ブログ記事用（目次・前後リンク・Article JSON-LD）
│   ├── lib/
│   │   ├── utils.ts                  cn() 等ユーティリティ
│   │   ├── og.ts                     OGP メタ生成ヘルパ
│   │   └── jsonld.ts                 JSON-LD 生成ヘルパ
│   ├── pages/
│   │   ├── index.astro               /
│   │   ├── about.astro               /about
│   │   ├── career.astro              /career
│   │   ├── skills.astro              /skills
│   │   ├── contact.astro             /contact
│   │   ├── privacy.astro             /privacy
│   │   ├── blog/
│   │   │   ├── index.astro           /blog
│   │   │   └── [slug].astro          /blog/:slug
│   │   ├── rss.xml.ts                /rss.xml
│   │   └── 404.astro                 NotFound
│   └── styles/
│       └── global.css                Tailwind directives + 全体スタイル
├── scripts/
│   └── new-post.ts                   yarn new-post 雛形生成（FR-25）
├── tests/
│   ├── e2e/                          Playwright E2E（自プロジェクト用、新規作成）
│   └── 削除：demo-todo-app.spec.ts, example.spec.ts（公式デモテンプレ）
├── docs/                             設計ドキュメント（保持）
│   ├── site-plan.md                  本ファイル
│   ├── writing-workflow.md           執筆ワークフロー（Phase 1a 冒頭で作成）
│   ├── pbi/                          PBI（Markdown）
│   │   └── README.md                 PBI フォーマット規約
│   └── templates/
│       └── post-template.md          記事雛形（FR-25 の new-post スクリプトが参照）
├── .github/
│   ├── workflows/                    CI（Phase 1a 冒頭で整備）
│   └── dependabot.yml                既存流用（依存先名は Astro 系へ）
└── CLAUDE.md, README.md, LICENSE
```

### 6.5 デザインシステム

#### 6.5.1 ブランドコンセプト

- **byte**（IT の単位） + **lark**（ヒバリ） / 独語読み Beitrag = 貢献
- イメージ群：飛翔 / 成長 / 明るい未来 / 晴れやか / 春の訪れ / 運気上昇

#### 6.5.2 カラーパレット（Plan B：周辺色 + ヒバリ羽色アクセント）

Tailwind の theme extension で以下を定義。**Phase 1a 冒頭で仮 HEX を確定**（実装が theme トークン参照前提のため）、**Phase 1c で確定 HEX に置換**。

| 役割 | 色相 | 由来 | Tailwind tone 目安 |
|---|---|---|---|
| primary | 空色（晴天） | ヒバリの飛翔背景 | sky-400 / sky-500 |
| accent | 朝日 / ヒバリ羽（黄褐色） | 朝のさえずり + 実物色 | amber-400 / amber-500 |
| secondary | 草原色 | ヒバリ生息地 | green-400 / green-500 |
| earth | 灰褐色（ヒバリ実物） | 実物羽色アクセント | stone-500〜orange-800 の彩度低めの間 |
| neutral | 白 + 暖灰色 | 余白 / テキスト | zinc / stone 系 |

検証済み事実（Wikipedia / Animal Diversity Web）：ヒバリは streaked greyish-brown / earth-toned cryptic plumage、腹は buff-white。実物色（earth）はアクセントに留め、主役は飛翔・春の周辺色。

**確定候補値（PHASE1C-001、2026-07-13）**：運営者が草案 3 案から案2「春空」を選定し、確定パレット候補（HEX / oklch / AA 検証値）を [docs/design-direction.md](design-direction.md) §2 に記録。トークン置換の実装と color-contrast 再有効化は PHASE1C-002 で行う。

**a11y 追跡（PHASE1A-019 起点）**：仮 HEX の primary / hibari-sky（`oklch(0.685 ...)`）は白背景でコントラスト比約 2.8:1 と WCAG AA（4.5:1）未満のため、E2E の axe チェック（`tests/e2e/a11y.spec.ts`）で `color-contrast` ルールを**一時除外**している。**Phase 1c で確定 HEX に置換する際、コントラスト AA を満たす値を選定したうえでこの除外を解除し、color-contrast を再有効化すること**（NFR-02 の完全充足は確定 HEX 確定後）。

**a11y 追跡 追加（PHASE1A-020 起点）**：Lighthouse で `/blog/` の見出しレベル飛び（h1→h3、`heading-order` 失敗。A11y スコアは 94 で 90+ は維持、axe の critical/serious では未検出）を確認。`BlogCard` の見出しを文脈で h2/h3 出し分けできるよう Phase 1c で対応する（[draft-phase1c-design-polish.md](../pbi/draft-phase1c-design-polish.md) B-1）。

#### 6.5.3 タイポグラフィ

PHASE1C-003 で確定・実装済み（2026-07-30）。実体は `src/styles/global.css` の `@theme`（`--text-*` と `--font-*`）、書体の読み込みは `astro.config.mjs` の `fonts`。

- 書体は 2 つ。見出し＝Zen Kaku Gothic New（500 / 700）、本文＝Noto Sans JP。欧文専用だった Geist は**廃止**（和文・欧文を 1 ファミリで揃え、縦方向の寸法差をなくすため。選定された「春空」モックも本文は Noto Sans JP 単独）
- サイズ / 行間：本文 16px・行間 1.95。見出しは Hero の h1 42px、ページ h1 と記事タイトル 32px、h2 24px、h3 17px、補助 14px。行間は大きい文字ほど詰める（1.95 → 1.3）
- ウェイトは 500 / 700 の 2 段のみ（Zen Kaku Gothic New が持つウェイト）。見出しは原則 700、Hero のリード文だけ 500
- 和文の調整：見出しに `font-feature-settings: "palt"`（字送りを字形に合わせて詰める）、折り返しは `text-wrap: balance` + `word-break: auto-phrase` の併用（文節で折る。未対応ブラウザは balance だけの挙動に落ちる）
- コードブロックは等幅ファミリの後ろに Noto Sans JP を足し、和文コメントの書体が端末任せにならないようにする
- 読み込み方：見出しは `font-display: swap`（初回訪問でもブランドの書体が出るように）、本文は `optional`（ページの高さの大半を占めるため、差し替えのずれを避ける）。実測は PHASE1C-003 実装ログ

#### 6.5.4 ロゴ

- 現存：byte-lark テキストロゴ（ヒバリ意匠なし、ピンと来ない感あり）
- 旧 ChatGPT 案 2 種：ヒバリ + 二進数のモチーフは良いが**モノトーン**でブランド色が乗らない
- **Phase 1c で ClaudeDesign を使い、ヒバリ意匠 + ブランドカラーを反映した新ロゴを作成**
- インプット：ブランドコンセプト / カラーパレット / 既存 2 案 / サイト全体のデザイントーン
- **反復上限**：Phase 1c 開始から **5 ラウンド以内に確定**（Q11 で運営者が合格条件確定）

#### 6.5.5 ページ間の視覚的一貫性

- 共通レイアウト：BaseLayout に Header + Footer + メタ
- セクション間スペーシング：Tailwind の `space-y-*` / `py-*` で統一
- カードスタイル：shadcn/ui の `Card`（必要時）or 自前 Astro
- ホバー：Tailwind の `transition` + `hover:` で穏やかに

#### 6.5.6 shadcn/ui の使用範囲（Decision #16 参照）

shadcn/ui は **React Island が必要なインタラクティブ部品にのみ**使用：

| 部品 | 実装 | 理由 |
|---|---|---|
| Header / Footer | Astro 自前 | 静的、JS 不要 |
| Hero / BlogCard / CareerTimeline / SkillSet | Astro 自前 | 静的、JS 不要 |
| CategoryFilter | React + shadcn `Button` 等 | クライアントフィルタ動作 |
| Toast / Dialog 等（必要時） | React + shadcn | インタラクティブ |
| Code highlight | Astro パイプライン（ライブラリ Q13） | ビルド時処理 |

shadcn 由来コード（コピペ）は `src/components/ui/` 配下に配置し、**Astro 純粋部品は `src/components/` 直下**に置いて区別する。

### 6.6 OGP / SEO / 構造化データ

Astro の標準機能で完全対応：

| 項目 | 実装 |
|---|---|
| `<title>` / `<meta name="description">` | BaseLayout で props 受け取り、各ページから渡す |
| OGP（`og:title` / `og:description` / `og:image` / `og:url` / `og:type`） | BaseLayout で SSG 時に静的出力 |
| Twitter Card | BaseLayout で出力（`summary_large_image`） |
| canonical URL | BaseLayout で `<link rel="canonical">`、各ページの正規 URL を指定 |
| デフォルト OGP image | `public/og-default.png`（cover 無し記事用） |
| sitemap.xml | `@astrojs/sitemap` で自動生成 |
| RSS | `@astrojs/rss` で `/rss.xml` を生成 |
| robots.txt | `public/robots.txt` に静的配置（sitemap.xml への参照を含む） |
| JSON-LD (Article) | PostLayout で記事 frontmatter から生成して `<script type="application/ld+json">` で埋め込み |
| JSON-LD (Person / Organization) | BaseLayout または `/about` で必要時 |

**画像最適化パイプライン**：
- Astro の `<Image>` / `<Picture>` コンポーネント採用
- 出力フォーマット：WebP（fallback PNG/JPG）
- OGP 用：1200×630 を生成
- レスポンシブ：`srcset` で複数解像度

### 6.7 既存資産の取扱い

| 既存資産 | 扱い | 移植先 |
|---|---|---|
| `src/features/career/data/Career.ts` | **資産化**（id=3,4 削除） | `src/data/career.ts` |
| `src/features/skills/data/Skill.ts` | **資産化**（icon URL 整理：VB.Net / GAS の代替アイコン是非を Q13 並列で判断） | `src/data/skills.ts` |
| `src/assets/logo.png` | 暫定流用、Phase 1c で SVG に置換 | `src/assets/logo.svg`（後で） |
| `tests/demo-todo-app.spec.ts` | **削除**（Playwright 公式デモ） | — |
| `tests/example.spec.ts` | **削除**（同上） | — |
| `playwright.config.ts` | **設定流用**（PHASE0-002 で Astro 用に最低限調整）、テストは新規作成 | プロジェクトルート |
| `DEVELOPMENT_LOG.md` | **削除**（旧 Vite 学習ノート、archive 参照可） | — |
| `.yarnrc.yml` | **流用**（Yarn 4 の nodeLinker 設定維持） | 同パス |
| `SECURITY.md` | 流用 | 同パス |
| `LICENSE` | 流用 | 同パス |
| `README.md` | **PHASE0-006 でスタブ更新**（新スタックを反映） | 同パス |
| `.github/workflows/quality.yml` / `ui-tests.yml` | **PHASE0-007 で Phase 0 中は一時無効化**（`.disabled` リネーム）、Astro 用書き換えは Phase 1a 冒頭の CI 整備 PBI で対応 | 同パス |
| Vite/React/Chakra 全 .tsx / .test / .stories | **削除**（archive/vite-react-chakra に保存済み） | — |
| `BlogCardCollection`（JSONPlaceholder fetch 版） | 削除 | — |
| `src/features/blog/data/Tag.ts` | 削除（記事 frontmatter の tags に統合） | — |
| `src/dev/`、`@react-buddy/*` 依存 | 削除 | — |
| `src/stories/` Storybook 公式テンプレ | 削除 | — |
| `CLAUDE.md`（プロジェクト規約） | **書き換え**（PHASE0-005、Astro/Tailwind/shadcn + 多セッション運用プロトコル） | 同パス |
| `docs/site-plan.md` | 上書き（v2 → v3.13） | 本ファイル |
| `docs/operation-manual.md` | **新規作成済**（v3.6 連動、運営者向けプロトコル） | 同パス |
| `.github/workflows/codeql.yml` | 流用（言語自動検出で Astro 対応） | 同パス |
| `.github/dependabot.yml` | 内容確認の上、依存先パッケージ名を更新（PHASE0-007） | 同パス |
| `lefthook.yml` | **PHASE0-007 でゼロから書き起こし**（既存はテンプレコメントのみ） | 同パス |
| `tsconfig.json` / `tsconfig.node.json` / `vite.config.ts` / `vitest.setup.ts` / `index.html` / `package.json` / `yarn.lock` | **削除**（PHASE0-001）後、Astro 初期化で再生成（PHASE0-002） | 同パス |
| `biome.jsonc` | 流用 + Biome v2 へアップグレード（PHASE0-004） + 必要時 .astro override | 同パス |

## 7. ロードマップ

| Phase | 内容 | 完了条件 | 想定期間 |
|---|---|---|---|
| **0** | プロジェクト初期化：Vite/React/Chakra 削除、Astro 6 + Tailwind v4 (`@tailwindcss/vite`) + shadcn/ui スキャフォールド、既存資産（Career/Skills データ）移植、CLAUDE.md 更新、Biome v2 化 | `yarn dev` で空ページ起動 / Lint / Typecheck / 既存テストフレーム動作 | **2-3 日** |
| **Gate 0→1a** | **Retrospective Gate**：Phase 0 完了確認 + 学びの集約（Gate PBI 内に申し送り記入） | Gate PBI 全受け入れ条件 check、運営者承認 | 0.25 日 |
| **1a 起票** | 別セッションで Phase 1a PBI 起票（Gate の申し送りを反映） | INDEX.md に Phase 1a PBI が追加され、レビュー完了 | 0.5-1 日 |
| **1a** | サイト構成・各ページの機能実装。冒頭タスク：CI 整備 / 仮 HEX 確定 / コードハイライト選定 / 画像最適化方針確定。続いて全ページ実装 + Markdown ブログ + RSS / sitemap / OGP / JSON-LD / プライバシーポリシー / E2E | 全ページ動作、SSG ビルド成功、Lighthouse 全 90+、Core Web Vitals 目標達成、Playwright E2E グリーン | 5-7 日 |
| **Gate 1a→1b** | Retrospective Gate（同上） | Gate PBI 完了 | 0.25 日 |
| **1b 起票** | 別セッションで Phase 1b PBI 起票（`docs/pbi/draft-phase1b-content-launch-prep.md` を正式化） | INDEX.md 追加・レビュー完了 | 0.25-0.5 日 |
| **1b** | コンテンツ整備：Skills / Career を現行実データに更新 + 代表案件追記（運営者インプット）、About / Privacy 文面の事実確認・承認、サンプル記事の処置、Contact フォーム化（FR-29）、記事ネタ出し → 初期記事セット実装（1 記事 1 PBI、本数はネタ出し PBI で確定 → v3.11 で 3 本に縮小、Decision #29） | 全ページの文面・データが運営者承認済み、初期記事セット 3 本がリポジトリ上で公開状態、フォーム E2E グリーン | 3-5 日 + 記事執筆 |
| **1c** | デザインブラッシュアップ：ClaudeDesign で草案 → カラー / タイポ / ロゴ確定（**ロゴ反復上限 5 ラウンド**） → 実装反映。**1b の実コンテンツで検証**（旧 1b）。**二段構え（Decision #28）**：先行トラック（記事非依存、PHASE1C-001〜007）は 1b 記事執筆と並行可、仕上げトラック（B-3 / 全記事最終再検証 / 1c Gate）は 1b Gate 後に起票 | デザイン確定 + ロゴ刷新 + 視覚的一貫性 + 仮 HEX → 確定 HEX 置換 | 4-6 日 |
| **1d** | 公開：再 QA（E2E / Lighthouse）→ NS 移管（Xserver → CF、MX / SPF 引き継ぎ設計込み）→ main マージ → Workers カスタムドメイン接続 → www 旧 Netlify サイト畳み → Web Analytics 有効化 → Search Console 登録 + sitemap 送信（`docs/pbi/draft-phase1d-domain-launch.md` を正式化） | `https://byte-lark.com` で全ページ表示 + メール送受信継続 + Analytics データ取得 | 1-2 日 + DNS 伝播 |
| **1e** | 公開後の運用・改善（Decision #31 で再定義）。公開直後の小さな手入れから着手し、記事が 10 本に届いた時点でカテゴリ別一覧（FR-19、旧 1c）+ 記事末尾の前後記事リンクを同 Phase 内の PBI として起票する | 小さな手入れ完了 + 記事 10 本到達時に `/blog/tech`, `/blog/life` 公開、Lighthouse 維持 | 都度 |
| **2** | 広告収益化（AdSense / Amazon アソシエイト）。並行検討：ニュースレター / Substack / note 連携 | 記事 30 本以上、AdSense 審査通過、配置最適化、CWV 維持 | 後日（記事数次第） |

各 Phase に **+50% のバッファ** を覚悟。前提（Astro init / Tailwind v4 統合 / shadcn セットアップ / Biome v2 化）が崩れると 1.5〜2 倍に膨らむ可能性あり。

### PBI の起票タイミング（重要）

**全 PBI を着手前に書き切らない**。Phase ごとに起票し、各 Phase 完了後の Retrospective Gate で得た学びを次 Phase PBI に反映する。

**例外（Decision #28、README §9 例外と対）**：Decision Log で明示的に「先行トラック」と定義した PBI 群は、前 Phase Gate 通過前でも起票・着手できる。現行の適用対象は Phase 1c 先行トラック（記事非依存のデザイン項目、PHASE1C-001〜007）のみ。前 Phase の学びを反映すべき残り（仕上げトラック + 1c Gate）は従来どおり 1b Gate 通過後に起票する。

```
Phase 0 → Gate → Phase 1a → Gate → Phase 1b → Gate → Phase 1c → Gate → Phase 1d → Gate
                                                                                    ↑
                                                                                [現在地]
                                                          2026-08-08 公開、1d Gate 通過（PHASE1D-009）
        ↓
Phase 1e（公開後の運用・改善）：小さな手入れから着手。記事 10 本でカテゴリ別一覧を同 Phase に追加起票
        ↓
Phase 2（記事 30 本以上で起票）
```

## 8. 技術選定の判断履歴（Decision Log）

| # | 決定 | 理由 | 反対案・棄却理由 |
|---|---|---|---|
| 1 | Phase 1 から Astro で SSG 構築（Vite + React + Chakra スタックは廃止） | Phase 2 で SSG 必須化が確定 / Chakra 学習動機が消滅 / 段階移行で Phase 1 の労力が捨てられる手戻りコスト大 | Vite 維持して Phase 2 で移行（v1 案）→ 既存資産保護の動機消滅により段階移行のメリット消失 |
| 2 | UI フレームワークは Tailwind CSS v4 + shadcn/ui、統合は **`@tailwindcss/vite`**（`@astrojs/tailwind` は Tailwind 3 legacy 専用） | AI 訓練データ豊富 / コピペ型でコンポーネントが repo 内に存在 / Astro 公式統合 / 2026 年デファクト | Chakra v3 → API 大幅刷新で書き直し量同等 + AI フレンドリー度劣る / Mantine → 採用層小・shadcn ほどコピペ型でなく自前ビルドが残る |
| 3 | アイコンは Lucide | shadcn/ui デフォルト / 軽量 / 単一セット | react-icons → 多様だが shadcn と統一感失う |
| 4 | Markdown / MDX を `src/content/posts/` フラット配置、category は frontmatter | Phase 1e の URL 拡張は frontmatter 駆動で柔軟 / 記事少ないうちのみすぼらしさ回避 | category ディレクトリ分割（v1 案）→ 記事少ない時のスカスカ感悪化 |
| 5 | Career / Skills は専用ページ + Home に抜粋 | 件数多いとトップが縦長になり Blog プレビューを圧迫 | 全件 Home 配置（v1 案）→ Blog プレビューが目立たない |
| 6 | Qualifications は Home 内セクション維持（独立ページなし） | 件数少（5 件）で独立ページにする実利薄い | 独立ページ化 → コンテンツ薄すぎ |
| 7 | Phase 2 で Next.js 移行は **撤回** | Phase 1 から SSG なので Phase 2 の移行作業自体が不要 | （v1 案で誤って採用、撤回） |
| 8 | Lint は Biome 2 を採用 | 既存資産（`biome.jsonc`）流用 / 高速 / TS と相性良 / .astro 対応 experimental あり | ESLint + Prettier → 設定肥大、Biome で十分 |
| 9 | テストは Vitest + Playwright | 既存資産流用 / Astro 公式サポート | Jest → 採用減少傾向 |
| 10 | Storybook は **削除**（個人運用フェーズでは） | 個人ブログ単独運用で過剰 / shadcn/ui のコピペ型なら repo 内コードで代替可 | 維持 → 二重メンテコスト。**ただし将来人を雇うフェーズで再導入の可能性は残す** |
| 11 | OGP は SSG 時に静的生成（react-helmet 等は使わない） | Astro 標準で各ページ frontmatter からビルド時に生成可 / クローラー JS 非実行に対応 | クライアント生成 → SNS 共有時無題で出る |
| 12 | サイト構成は個人主軸ハイブリッド | エージェント案件主体のため純コーポレートは ROI 低い、将来直案件にも開く | 純コーポレート / 純パーソナル |
| 13 | カテゴリは tech / life の 2 区画 | ジャンル分散リスクを IA で吸収、URL 拡張時の設計が明確 | フラット運用 → 読者層分散で AdSense RPM 下がる懸念 |
| 14 | カラーパレットは Plan B（周辺色 + ヒバリ羽色アクセント） | 「飛翔・春」コンセプトと「ヒバリ実物」両立 / 色彩論的に安定（Wikipedia / ADW で実物色裏取り済み） | 実物色のみ（地味） / 周辺色のみ（実物との接点薄い） |
| 15 | ロゴは Phase 1c で ClaudeDesign を使って新規作成、反復上限 5 ラウンド。**2026-08-01 延長**：PHASE1C-004 で 5 ラウンド消化後も未確定のため運営者判断で上限を延長（ラウンド 6 以降は旧案 1+2 ベースの画像生成 AI 編集ルートで続行） | 既存テキストロゴはヒバリ意匠なし / 旧 ChatGPT 案はモノトーン / 上限なしだと Phase 1c 暴走 | 既存流用 / 旧案採用 / 反復上限なし。延長時の打ち切り（既存ロゴ継続）→ ロゴは 1c の中核成果物で、方向性（鳥=旧1+残像尾、数字と円=旧2）は合意済みのため完遂が合理的 |
| 16 | shadcn/ui は **React Island 必要箇所のみ**で利用、静的部品は Astro 自前 | shadcn 部品は React ランタイムを乗せる Island 化が必要、Header/Footer 等で過剰 / Astro の Zero-JS philosophy と整合 | 全コンポーネント shadcn → 不要 JS が乗る |
| 17 | デプロイ先は **Cloudflare Workers**（Q8 確定、Phase 1a で Pages → Workers 移行） | 商用利用可 / 無料枠厚い / CF 公式・Astro 公式ともに新規は Workers 推奨 / Web Analytics 統合（Cookieless） | Vercel → 商用利用条項の解釈余地、Pro 必須リスク / Netlify → 帯域・ビルド分制限がやや厳しい / Pages 維持 → 公式推奨から外れつつある |
| 18 | アクセス解析は **Cloudflare Web Analytics**（Q9 確定） | Cookieless で同意 UI 不要、CF Pages と統合楽、無料 | GA4 → Cookie バナー必要で UX 悪化、過剰機能 / Plausible → 月額発生 |
| 19 | Phase 2 で広告と並列して **ニュースレター / Substack / note 転載**も検討 | AdSense は記事 30+ で RPM 安定までかかる / 別線で同記事資産を活用すると ROI 早い | 広告一本 → 収益化までの時間が長い |
| 20 | 旧 Hugo `byte-lark.com` の URL は **301 計画なし**（dead で OK） | 旧 repo 削除済 / 新ドメインの再開で別アイデンティティ / 旧 URL retain の実利薄 | 301 設定 → 旧コンテンツ無いので意味薄い |
| 21 | shadcn 4.x で **Radix ライブラリ + Nova preset** で初期化（旧 style/baseColor 概念は 4.x で廃止、preset 体系に移行） | デフォルト構成で進めて Phase 1c の ClaudeDesign アウトプットに合わせて再調整、Phase 0 を判断で止めない | 初期からブランドカラーで設定 → カラーパレット未確定の段階で決められない |
| 22 | コードハイライトは **Shiki**（Astro 組込み、テーマ `github-light`）（Q13 確定） | 追加依存ゼロ / ビルド時レンダリングでクライアント JS なし / テーマ豊富 / 後から Expressive Code に差し替え可 | Expressive Code → ファイル名タブ等リッチだが追加依存あり / Prism → Shiki より機能・テーマが少ない |
| 23 | 記事 cover 画像は **装飾不要**（optional フィールドのみ定義）（Q5 確定） | Phase 1a はページ実装が主目的、cover に工数を割らない / optional にしておけば Phase 1c 以降で OGP ジェネレータ等を後付け可 | OGP ジェネレータ → 実装工数追加 / Unsplash → 選定の手間 + ライセンス表記必要 |
| 24 | 和文フォントは **@fontsource-variable/noto-sans-jp**（セルフホスト）。**読み込みは Astro 公式 Fonts API 経由**（`fonts` 設定 + `<Font>`、provider は local で node_modules のパッケージをそのまま使う。PHASE1C-007 で更新） | 既存 Geist と同パターンで統一 / CSP 設定不要 / パフォーマンス制御しやすい / Fonts API に移すと font-display と preload をフォント単位で制御でき、和文の差し替えずれ（CLS）を止められる | Google Fonts CDN → 外部リクエスト + Workers CSP 設定が別途必要 / CSS の `@import` 直書き（旧構成）→ font-display・preload を制御できない / Fonts API の npm・fontsource provider → 実体 URL が jsdelivr になりビルド時に外部 CDN 依存 |
| 25 | **Phase 再編（v3.9）**：公開を独立フェーズ 1d に分離、1b をコンテンツ整備として新設（旧 1b デザイン → 1c、旧 1c カテゴリ → 1e）。公開は 1c 完了 + 初期記事セット + 再 QA を前提条件とする | 未完成サイト（仮デザイン・サンプル記事・未承認文面・旧コード由来の Career / Skills）を法人ドメインで公開・クロールさせないため / 公開は DNS・メール継続（MX が apex 名指し）・旧 www Netlify サイトの畳みを含む一度きりの重要イベントで独立管理が必要 / コンテンツ先・デザイン後にすると実記事でタイポ・カード設計を検証でき手戻りがない | 1a 内で公開（旧計画）→ main は Hello, World! のままで公開すると placeholder がクロールされる / production branch 一時切替 → 未完成サイトの全世界公開で棄却 |
| 26 | **Contact は自前フォームに置換**（Worker `/api/contact` + Cloudflare Turnstile + Resend、送信元は `send.byte-lark.com` サブドメイン認証、API キーは Workers secret、mailto 廃止）（FR-29） | アドレス平文公開は収集ボットに拾われ、CF のメール難読化は Workers 配信に不適用（公式 docs 明記）/ メーラー未設定環境では mailto が無反応で商談機会を取りこぼす / Turnstile・Resend とも無料枠で月数十件は余裕 / CSRF はセッション認証なしのため主論点でなく、対策の本命は Turnstile サーバー側検証 + レートリミット | mailto 維持 → スパム露出 + UX 劣化 / Google Form → 法人サイトの体裁劣化・Google 依存 / SES → サンドボックス解除等の手間が小規模用途に見合わない |
| 27 | **E2E は CI（GitHub Actions）で検証**：`yarn test:e2e` は Bash サンドボックスで Chromium が起動できない（macOS Seatbelt が Mach port 登録を拒否、FATAL）。CI（`.github/workflows/ui-tests.yml`）を Playwright 公式コンテナ `mcr.microsoft.com/playwright:v<ver>-noble` 化し push で自動実行、Claude は `scripts/ci-status.sh`（無認証 REST API、public repo）で合否確認。スクショ確認は MCP Playwright で実施 | 旧 `--with-deps` は noble runner の apt で 60 分ハング→timeout でテスト未実行だった / 運営者手動実行は自走を妨げる / gh CLI は sandbox 内で TLS・keychain により不可、curl は可 | 運営者ターミナル手動実行（旧 PBI 019 前提）→ 毎回手作業で自走せず / sandbox で直接実行 → Chromium 起動不可 |
| 28 | **Phase 1c 先行トラックの 1b 並行**（v3.10）：1c を「先行トラック（記事非依存：デザイン方向性確定 / 確定 HEX + color-contrast 再有効化 / タイポ確定 / ロゴ刷新 / favicon / B-1 見出しレベル / B-2 フォント CLS）」と「仕上げトラック（B-3 CSS サイズ / 全記事最終再検証 / 1c Gate）」に二分し、先行トラックは 1b Gate 通過前に起票・着手可とする。運用はセッション単位の切替（push 競合は README §10.7） | 1b 残タスク（記事 PBI 008〜013）は運営者リライト・ヒアリング律速で待ち時間が発生する / Decision #25「実コンテンツで検証」の前提は、全ページ実データ承認済み（PHASE1B-001〜005）+ 実記事 1 本（008 ドラフト）で実質充足 / ロゴは反復上限 5 ラウンドでリードタイム最長、早期着手が R-06（1c 長期化）の緩和になる / Gate の学び反映（README §9）は仕上げトラック起票に残る | 厳格順守（1b 完了まで 1c 禁止）→ 運営者律速の待ち時間に開発が止まる / 1c 全量起票 → 1b Gate 申し送りの反映機会が消え、記事依存 PBI が長期 InProgress 化 |
| 29 | **初期記事セットの縮小（6 本 → 3 本、公開優先）**（v3.11）：公開前に揃える記事を T1 サイト構築総括（008、公開済み）+ T2 自前フォーム実装（009）+ L1 法人化（012）の 3 本とし、T3 / T5 / L2+L3 は `article-backlog.md` へ移管して公開後に R-01 月次 routine で消化する。PHASE1B-010 / 011 / 013 は Dropped（README v3.6 で新設した取り下げ状態） | 記事執筆は運営者リライト律速で、6 本待つと公開が数週間単位で遅れる（Decision #28 と同じ構図）/ 公開を早めるほど検索エンジンのインデックス開始が早まり、Lighthouse の Performance / SEO 計測（本番ドメインでのみ確定可）にも早く到達する / 初期 6 本は SEO 的な閾値ではなくネタ出し時の区切りで、1e カテゴリ一覧の条件（10 本）にも 6 本では届かない / life を 1 本（L1 法人化）含めることで屋号サイトとして人となりを見せ、About の補強にもなる | 6 本維持 → 公開が記事執筆律速で遅延 / tech 3 本（T1+T2+T3）→ life 空のまま公開で人となりが見えない / 2 本公開 → ブログ一覧がさらに薄く、life も空になるため見送り |
| 31 | **公開後の運用形態を確定**（v3.13、Phase 1d Gate = PHASE1D-009）：① 統合ブランチ `feat/phase-1` を畳み、main を起点とする「1 作業 1 ブランチ → PR」に戻す（README §10.3 / §10.6）② Phase 1e を「カテゴリ別一覧」から「**公開後の運用・改善**」に再定義し、公開直後の小さな手入れから着手。カテゴリ別一覧（FR-19）と記事末尾の前後記事リンクは記事 10 本到達時に同 Phase 内へ追加起票 ③ ダークモードは**やらない**と確定（PHASE1C-002 / 004 / 005 からの申し送り 3 件を破棄） | ① 未完成サイトを main に載せない遅延マージ（Decision #25）の理由は公開で消え、むしろ main = 本番なので小さく入れるほうが本番と手元のずれが起きない（1D-008 で本番が 4 コミット遅れ、実機確認を誤りかけた）。月次ルーチン R-01 が既に短命ブランチ + PR で回っている ② 公開後の主活動は記事執筆で、次の機能（カテゴリ別一覧）は記事 10 本まで着手できない。その間の小さな改善に受け皿が無いと放置される ③ 1D-001 で全 11 ページ × 2 幅の実表示を撮って見送りを決めたが「やらない」と確定していないため、Gate ごとに同じ判定を繰り返していた。Shiki がインライン style に色を焼くのでコードブロックはデュアルテーマ化なしに暗くならず、アイコン 34 件も `<img>` 参照で `currentColor` が効かない。記事 3 本の個人サイトに対して実装量が見合わない | ① `feat/phase-1` を継続 → main が遅れ、本番と手元のずれが続く ② Phase 1e を記事 10 本まで開かない → 小さな手入れ 6 件が宙に浮く / 手入れ用に別 Phase を新設 → Phase の刻みが細かくなりすぎる ③ ダークモードを持ち越し → 判定の手間が毎 Gate かかる（再着手したくなった時の出発点は Gate PBI に記録済みなので、破棄しても情報は失われない） |
| 30 | **記事ライセンスを CC BY 4.0 → 通常の著作権表記に変更**（v3.12、Q12 更新）：Footer の CC BY 表記を削除して「© byte-lark. All rights reserved.」のみとし、Privacy ページに「著作権について」節を新設（出典明記の引用は歓迎 / 全文転載・二次利用は Contact へ相談） | CC BY は全文転載 + 商用利用（広告収益化）をクレジット表示のみで合法化するため、Phase 2 の収益化計画（AdSense / アソシエイト）やコピーサイトへの SEO 評価流出と相性が悪い / 引用（著作権法 32 条）はライセンスに関係なく誰でも可能で、CC を外しても紹介・シェアは阻害されない / CC ライセンスは配布後取消不能のため、本番公開（1d）前が変更の最終機会（preview は noindex で実質未配布） | CC BY 維持 → 拡散最大化と引き換えに転載収益化を許容することになり収益化方針と矛盾 / CC BY-NC(-ND) 化 → 通常著作権 + 引用で同じ効果が得られ、中途半端な自由ライセンスを名乗る意味がない |

## 9. リスク / 留意事項

| ID | リスク | 影響 | 対応策 | トリガー条件 | オーナー |
|---|---|---|---|---|---|
| R-01 | 書く習慣がつかず Phase 2 に進まない | 投資回収できない | (a) 執筆ワークフロー整備（`docs/writing-workflow.md`）、(b) **月 1 でネタ出しを Claude にさせる /schedule routine**、(c) frontmatter `status: idea \| drafting \| review \| published` で記事パイプラインを可視化、(d) 連続 4 週間未投稿で運営者にメール通知 | Phase 1a 完了後、3 ヶ月で記事 5 本未達 | 運営者 |
| R-02 | Markdown スキーマが運用後に変わる | 既存記事の修正が必要 | Zod schema を optional 寛容に / breaking change 時は **`scripts/migrate-frontmatter.ts` 雛形を Phase 1a で先に用意** / 各記事に `schema_version` フィールドを持たせる選択肢を残す | 記事 5 本以上書いた後にスキーマ変更必要時 | Claude（実装）+ 運営者（判断） |
| R-03 | Astro 6 / Tailwind v4 / shadcn の major up で破壊的変更 | ビルドエラー / 表示崩れ | dependabot で月次監視、major up は専用ブランチで PR、E2E でリグレッション検出。**Tailwind v5 / shadcn Astro 統合方式変更**を特に警戒 | dependabot PR 通知 / 各ライブラリのリリースノート | Claude |
| R-04 | 法人化前のため byte-lark の正式法人名・所在地・連絡先が未確定 | Footer / Contact / About の確定情報が出せない | 法人化前は「byte-lark」表記 + 個人事業主としての責任明示。法人化後（2026/06）に置換。**§13 で 3 段階マイルストーン管理** | 法人登記完了 | 運営者 |
| R-05 | Hero の文言が決まらず実装が止まる | スケジュール遅延 | プレースホルダーで先に実装 → 後から差替可能な構造に。Q1 ドラフト 3 案を Claude が出す | Phase 1a 着手時 | Claude（ドラフト）+ 運営者（選定） |
| R-06 | ロゴ刷新が決まらず Phase 1c が長期化 | サイト公開（1d）が後ろ倒し | 5 ラウンド未確定なら現行ロゴで 1d 公開を先行、ClaudeDesign で並行検討、決定次第差替。**反復上限 5 ラウンド** | Phase 1c 開始から 5 ラウンド未確定 | 運営者 |
| R-07 | ジャンル分散（tech + life）で読者層が定まらず AdSense RPM 低下 | 収益化フェーズで効果薄い | Phase 1e でカテゴリ URL 分離 + 内回遊で擬似テーマ分割。**Phase 2 観察結果次第でサブブランドサイト分離**も検討 | Phase 2 で AdSense RPM が想定以下 | 運営者 |
| R-08 | Career のダミーデータ削除で実データが少なくなり Career セクションが寂しい | UX 低下 | 実案件サマリを 1-2 件追加（**Phase 1b コンテンツ整備で対応**）/ Career セクションを濃く見える構成に / Phase 1c で視覚調整 | Phase 1a で Career 表示確認時 | 運営者 + Claude |
| R-09 | コンテンツ著作権・AI 生成物の表記漏れ | 法的リスク / SEO 評価マイナス | 記事画像は Unsplash 等のフリー素材か自前撮影、引用は出典明記、AI 生成物は明示。**Q12 で著作権方針確定**（Footer © 表記 + Privacy 著作権節、Decision #30 で CC BY 4.0 から変更） | 第 1 記事公開時 | 運営者 |
| R-10 | プライバシー・解析法務（GA4 + EU 訪問者等） | コンプラ違反 | Q9 で **Cloudflare Web Analytics 採用** = Cookieless = 同意 UI 不要。プライバシーポリシー（FR-22）に明記 | アクセス開始時点 | 運営者 |
| R-11 | インシデント対応（改ざん・連絡先漏えい） | 信用毀損 | (a) Cloudflare のセキュリティイベント or UptimeRobot で監視、(b) 漏えい時の対応者 = 運営者本人、(c) 最低限の連絡先 + 手順を `docs/incident-response.md` に記載（Phase 1a 末） | インシデント発生時 | 運営者 |
| R-12 | 時間捻出リスク（本業繁忙期に Phase 1a が止まる） | 全体スケジュール延伸 | 月別の現実投下時間見積を持つ / Phase ごと +50% バッファ。停滞時は Phase 縮小（FR-19 を 1e → Phase 2 に等）で対応 | Phase 1a で 1 週間以上の進捗ゼロ | 運営者 |
| R-13 | バックアップ（GitHub アカウント停止リスク） | 全資産喪失 | Git は GitHub + ローカル + 別オフサイト（外付け SSD or 別 git ホスティングへの mirror）。`docs/backup-policy.md` に記載 | アカウント停止通知 | 運営者 |
| R-14 | デプロイ先のフリープラン制限（CF Pages のビルド回数制限等） | 公開停止 | 月初に CF Pages ダッシュボードで使用量確認。法人化後は有料プラン契約を検討 | 月使用量 80% 到達 | 運営者 |
| R-15 | 依存スタック（Astro 6 / Tailwind v4 / shadcn）の若さ | 破壊的変更頻度高 | major up は専用ブランチで検証、本サイトを pin で運用。リリースノートを月次で確認 | 月次レビュー | Claude |

## 10. 未決事項（Claude 主導でドラフト → 運営者選定）

各項目は PBI 化し、Claude が観点出し + 案を 2-3 提示、運営者が選定/修正する。

| # | 項目 | 影響範囲 | Claude のアプローチ |
|---|---|---|---|
| Q1 | Hero の肩書 / キャッチ / 自己紹介 1-2 行 | HomePage Hero | **確定: 肩書「現場を前に進める PM / PO」**（PHASE1A-008 で 3 案から運営者選定） |
| Q2 | About の本文（経歴サマリ・興味領域・OSS 活動） | AboutPage | **確定: ですます調 × 見出し整理型**（PHASE1A-009 で運営者選定。最終文面承認は Phase 1b） |
| Q3 | Contact の問合せメール（法人化前後で分けるか） | ContactPage / Footer | **確定→更新: Phase 1b でフォーム化（FR-29）。平文メール非公開、通知先 info@byte-lark.com**（当初 PHASE1A-006/014 で tanimoto@ を Footer/Contact 表示 → PHASE1B-004/005 で /api/contact + Resend 通知 info@ に変更、mailto 撤去） |
| Q4 | Footer 法人メタ情報（法人化前の表記） | Footer | **確定: 「byte-lark（個人事業主）」+「2026年6月 法人化予定」**（PHASE1A-006、§13.1 準拠） |
| Q5 | 記事 cover 画像の運用方針 | Blog 全般 | **確定: 装飾不要**（optional フィールドのみ定義、Decision #23 参照） |
| Q6 | SNS リンクの配置（GitHub / X / その他） | HomePage / Footer | **確定: GitHub リンクのみ（Footer）**（PHASE1A-006） |
| Q7 | byte-lark 法人ドメインメール / 個人メール の使い分け | Contact 全般 | **確定→更新: 問い合わせ通知先は info@byte-lark.com、tanimoto@ は運営者個人連絡先**（当初 PHASE1A-006/014 は tanimoto@ 統一 → PHASE1B-005 で info@ に変更。法人化後の切替は §13.2） |
| Q8 | デプロイ先 | インフラ | **確定: Cloudflare Workers**（Decision #17 参照） |
| Q9 | アクセス解析ツール | 全ページ + Footer | **確定: Cloudflare Web Analytics**（Decision #18 参照） |
| Q10 | プライバシーポリシー本文 | `/privacy` | **確定: 簡易案（5 章構成）**（PHASE1A-015。フォームなし・Cookieless ＋ 法人化改定が目前が根拠。最終文面承認は Phase 1b、法人化改定は §13.2） |
| Q11 | ロゴ製作の合格条件 / 反復上限 | Phase 1c ロゴ | 合格条件チェックリスト + 反復上限 5 ラウンド推奨（Decision #15 参照） |
| Q12 | 記事のライセンス | 全記事 / Footer / Privacy | **確定→変更: 通常の著作権表記（© のみ、All rights reserved）**（当初 PHASE1A-006 で CC BY 4.0 → 2026-08-05 公開前に変更、Decision #30。引用歓迎 + 転載相談の案内は Privacy「著作権について」節） |
| Q13 | コードハイライトライブラリとテーマ | tech 記事 | **確定: Shiki + github-light**（Decision #22 参照） |

## 11. 執筆ワークフロー（別ドキュメント `docs/writing-workflow.md` で詳述）

**Phase 1a 冒頭で作成**（Phase 0 はインフラ構築に集中させ、執筆ワークフロー設計は Phase 1a の最初の PBI として独立起票）。骨子のみ：

```
[1] テーマ思いつく
  ↓
[2] Claude にヒアリング依頼（テーマ + 一言）
  ↓
[3] Claude が 5-10 質問返す（読者層 / 結論 / 構成 / キー主張 / 反論想定）
  ↓
[4] 運営者が回答（音声 → 文字起こしも可）
  ↓
[5] Claude が Markdown ドラフト生成（frontmatter status=drafting）
  ↓
[6] 運営者がリライト（自分の文体に） status=review
  ↓
[7] 公開（status=published）。文体プロファイル更新
  ↓
[8] 次回以降は kazuya 文体プロンプトでドラフト精度向上
```

実装物：
- ヒアリング SOP プロンプト（claude.ai / Claude Code 共用）
- 記事テンプレ（`docs/templates/post-template.md`）
- 雛形生成スクリプト（`yarn new-post --slug ...`、FR-25）
- 文体プロファイル管理（`docs/writing-style/profile.md`）
- **月 1 ネタ出し routine**（/schedule で Claude に「今月の記事ネタ 3 案」を出させる、R-01 対応）

## 12. 次アクション

Phase 0 〜 1d は完了（2026-08-08 公開、1d Gate は 2026-08-10 通過）。ここから先は次の順で進める。

1. Phase 1e PBI の起票（公開直後の小さな手入れから。Gate PBI = PHASE1D-009 の申し送りを反映）
2. 記事を書き足す（ネタは `docs/article-backlog.md`、月次ルーチン R-01 が毎月 1 日に 3 案を追記する PR を出す）
3. 記事が 10 本に届いたらカテゴリ別一覧 + 前後記事リンクを Phase 1e に追加起票（FR-19）
4. 記事 30 本以上で Phase 2（広告収益化）を起票

PBI フォーマット規約・状態管理・コミット規約・ブランチ運用は `docs/pbi/README.md` v3.9 を参照。
PBI 全体の状態は `docs/pbi/INDEX.md` を参照。
**運営者向け運用マニュアル**（シーン別フレーズ / リカバリー / トラブルシューティング）は `docs/operation-manual.md` を参照。

## 13. 法人化に伴う改訂

法人化（2026/06 登記完了、合同会社バイトラーク・法人番号指定 2026-06-05）に対し、3 段階のマイルストーンで管理する。

### 13.1 法人化前（〜2026/06、通過済み）

- Footer / About 表記：「byte-lark（個人事業主）」+ 「2026 年 6 月法人化予定」
- Contact メール：個人メールアドレス
- 直案件で対価を受け取らないので **特商法表記は不要**（FR-28 は法人化後 or 直案件開始時）
- インボイス：未登録

### 13.2 移行期（2026/06〜2026/09 想定、現在のフェーズ）

- Footer / About 表記を「合同会社バイトラーク」「設立（2026 年 6 月）」「代表社員」「所在地（市区レベル：香川県高松市）」に置換（法人名は PHASE1B-003、代表社員・所在地は PHASE1D-002 済み。所在地の記載粒度は運営者決定 2026-08-08）
- 法人ドメインメール（@byte-lark.com）を発行、Contact を法人メールに切替、旧個人メールを転送設定
- プライバシーポリシー改定：個人事業主表記 → 法人名表記、個人情報取扱事業者としての安全管理措置を明記（PHASE1D-002 済み、改定日 2026-08-08）
- インボイス制度：登録番号はサイト掲載なし（運営者決定 2026-08-08。エージェント経由取引で掲載メリットなし、直案件開始時に再検討）
- 直案件で対価受領を始める時点で `/legal/tokutei`（FR-28）公開

### 13.3 定常期（2026/09〜）

- 全表記が法人名で統一
- 採用ページ追加検討（人を雇うフェーズに到達時）
- 直案件比率増加に応じて `/services` セクション追加検討

### 13.4 法人化対応の追跡

`docs/pbi/` 配下に法人化対応 PBI を別途起票（タイミングは法人登記完了後）。本計画書では論点だけ確保。

## 14. バージョン参照箇所一覧（メンテ用）

site-plan / README / PBI のバージョンや件数を更新する時、以下のパターンで全箇所を grep し、漏れなく更新する。**v3.3 で同種の連動更新漏れが再発した教訓に基づく予防策**。

| パターン | 想定箇所 | 確認コマンド |
|---|---|---|
| `v3.x` | site-plan.md タイトル / 改訂履歴 / 自己参照 / §6.7 既存資産取扱表 / §12 次アクション / §14 自身の予防策説明 / **INDEX.md ロードマップ参照（line 74 周辺）** / **INDEX.md セッション開始時必須チェック注記** / **PHASE0-005 内 CLAUDE.md テンプレ（current: v3.x 行）** / **PHASE0-010 「計画書 v3.x と実態の差分」（line 30, 85 周辺）** / **operation-manual.md（v3.x 連動言及がある場合）** / **CLAUDE.md ヘッダー（v3.x 連動言及がある場合）** / **README.md の version（タイトル + v3.0 以降の改訂履歴）+ CLAUDE.md / site-plan §12 の README 参照 — README は v3.0 で v3.x 名前空間に移行したため本パターンで site-plan 自身の version と混在する。想定箇所列で「site-plan の version」と「README の version」を仕分けること** | `grep -rn "v3\." docs/ CLAUDE.md` |
| `v2.x` | **過去事実の記録のみ**（v2.9 以前の README 改訂履歴行 / 各 Done PBI 内の当時の README 参照、例: PHASE0-005・PHASE0-002・PHASE1A-008）。**現行参照はもう v2.x に無い**（README は v3.0 で v3.x へ移行）→ grep ヒットは書き換えず歴史として残す | `grep -rn "v2\." docs/` |
| PHASE0-NNN 件数 / 範囲 | INDEX.md 表 / §7 ロードマップ / §7 フロー図（`PHASE0-001〜<N>`） / §12 次アクション / PHASE0-009 受け入れ条件 / PHASE0-010 受け入れ条件 | `grep -rn "PHASE0-\|<件数> 件" docs/`（`<件数>` は実値、例：`10 件`）|
| 新規 PBI 追加時のリンク | INDEX.md 表 + 推奨着手順序図 / 関連 PBI の依存表記 | INDEX.md および関連 PBI を Read |
| ファイルリネーム時 | INDEX.md / 各 PBI の参照 / site-plan §6.7 | `grep -rn "<旧ファイル名>" docs/` |
| writing-workflow.md 作成タイミング | site-plan §6.4 ディレクトリ構成 + §11 + R-01 リスク対応 | `grep -rn "writing-workflow" docs/` |
| 法人化関連の表記 / Phase 名 | site-plan §13 + 関連 PBI（Phase 1e 以降） | `grep -rn "法人化\|byte-lark 株式会社" docs/` |
| Phase 再編（v3.9）の読み替え | 現参照（§7 / FR / Decision / R / Q / CLAUDE.md / INDEX.md / ドラフト PBI）は新 Phase 名。**Done 済み PBI 内の旧表記は書き換えず**「旧 1b → 新 1c、旧 1c → 新 1e」と読む | `grep -rn "Phase 1[b-e]" docs/ CLAUDE.md` |
| 運営者向けプロトコル変更（フレーズ / リカバリー / トラブルシューティング） | operation-manual.md + CLAUDE.md ヘッダー + INDEX.md 着手ルール | `grep -rn "operation-manual\|中断 signal\|セッション開始時の必須チェック" docs/ CLAUDE.md` |
| ブランチ運用 / worktree / Phase ブランチ命名 | README.md §10 + operation-manual.md §1 §3 §4 + PHASE0-008（CF Pages filter）+ PHASE0-010（main マージ手順）+ CLAUDE.md ヘッダー | `grep -rn "feat/phase-\|worktree\|sub-branch\|merge --no-ff" docs/ CLAUDE.md` |
| Cloudflare Pages branch filter 設定 | PHASE0-008 + operation-manual.md §3 + README §10.8 | `grep -rn "Branch Filter\|Custom branches\|Preview branch" docs/` |

### 運用ルール

- **計画書バージョンを上げる前**：必ず本表の全パターンで grep し、自己参照箇所を新バージョンに更新。grep 結果から「現参照」と「改訂履歴等の過去事実記述」を **想定箇所列を頼りに 1 件ずつ突合**して仕分けする
- **PBI を追加・リネーム・削除する時**：本表の該当パターンで grep し、INDEX.md / 関連 PBI / site-plan §6.7・§7 を同期
- **改訂履歴の同期**：site-plan.md / README.md / INDEX.md / 関連 PBI のいずれかで改訂履歴行を追加する時、他の改訂履歴も**同コミット内で**整合更新（前ラウンドで INDEX.md 改訂履歴の追記漏れが発生した教訓）
- **本表自体のメンテ**：新たな連動更新漏れパターンが発覚したら、本表に追加して将来の漏れを防ぐ
- **将来の自動化**：本 §14 の grep 7 パターンを `scripts/check-version-refs.sh` 等にスクリプト化し、lefthook の pre-push に組み込む案を Phase 1a 冒頭で別 PBI として起票検討（手動 grep 忘れリスクの構造的排除）

---

## 改訂履歴

| 日付 | 変更内容 |
|---|---|
| 2026-04-30 | v1 初版作成 |
| 2026-05-01 | v2：UI スタックを Tailwind v4 + shadcn/ui に転換、Phase 2 Next.js 移行を撤回、Phase 1 から Astro で SSG 構築、Phase 1 を 1a/1b/1c 分割、Career/Skills 抜粋化と専用ページ化、ヒバリブランドコンセプト反映、Q1-Q8 |
| 2026-05-01 | v3：レビュー指摘を全面反映。Tailwind v4 統合方法を `@tailwindcss/vite` に修正、Q8 = Cloudflare Pages 確定、Q9 = Cloudflare Web Analytics 確定、shadcn を React Island 必要箇所のみに限定、FR-22-28 / NFR-11-12 追加、Playwright 既存資産扱い修正、CLAUDE.md 更新を Phase 0 タスクに、Phase 0 工数 2-3 日に修正、Phase 1a に CI / 仮 HEX / コードハイライトを冒頭タスクに、リスク表 8 項目 → 15 項目に拡張、Q9-Q13 追加、§13 法人化に伴う改訂を独立章化、Decision Log #16-#20 追加 |
| 2026-05-01 | v3.1：PBI を Phase ごとに起票する方針を §7 / §12 に明記、Phase 間に Retrospective Gate を導入、§7 ロードマップに Gate / 次 Phase 起票ステップを追加 |
| 2026-05-02 | v3.2：Phase 0 PBI レビュー指摘を反映。§11 writing-workflow.md 作成タイミングを Phase 1a 冒頭に変更、Decision Log #21（shadcn デフォルト style/baseColor）追加、§6.7 既存資産取扱表を Phase 0 PBI 群（特に PHASE0-001 残置リスト・PHASE0-006 workflow 一時無効化）と整合 |
| 2026-05-02 | v3.3：差分レビュー反映。連動更新漏れ（§6.4 writing-workflow タイミング / §12 各バージョン・件数 / §13.4 誤字）修正、PBI 側の連動修正（PHASE0-009 範囲 + 計画書バージョン参照、PHASE0-008 Web Analytics Done 判定緩和、PHASE0-002 playwright.config.ts 表現、PHASE0-010 行数基準削除、PHASE0-006 ファイルリネーム、INDEX.md 構造整合） |
| 2026-05-02 | v3.4：3 回目レビューで検出された連動更新漏れ再発（§6.7 v3.2、§7 フロー図 PHASE0-001〜009）を修正。再発防止のため §14 バージョン参照箇所一覧を新設。PHASE0-008 観測方法を具体化、CLAUDE.md にキックオフ暫定ヘッダ追加 |
| 2026-05-02 | v3.5：4 回目レビュー推奨を反映。§14 row 1 想定箇所に PBI 内参照追加、row 3 placeholder 明確化、運用ルールに改訂履歴同期・1 件ずつ突合・scripts 化検討を追記。CLAUDE.md ヘッダのリンク化、INDEX.md 改訂履歴に v3.4/v3.5 連動行追記 |
| 2026-05-03 | v3.6：運営者向け運用マニュアル `docs/operation-manual.md` 新規作成。INDEX.md 着手ルールに「セッション開始時の必須チェック」（§5.8 検出スクリプト実行）を必須化、CLAUDE.md ヘッダにも同等の必須化と operation-manual.md 誘導追加。§14 row 1 拡張、運用ルール表に「運営者向けプロトコル変更」行追加 |
| 2026-05-03 | v3.7：ブランチ運用方針確定。README.md §10 新設（Phase ブランチ + 常時 PBI sub-branch + worktree 並行 / merge --no-ff / sub-branch マージ後保持 / CF Pages Preview Branch Filter 必須 / main 保護 / Hotfix）。operation-manual.md / PHASE0-007 / PHASE0-009 / CLAUDE.md ヘッダに連動反映、§14 row 1 拡張・運用ルール表に「ブランチ運用」「CF Pages branch filter」行追加 |
| 2026-05-03 | PHASE0 PBI 番号を着手順序に整列（旧 010→新 006、旧 006→新 007、旧 007→新 008、旧 008→新 009、旧 009→新 010）。本日以前の改訂履歴行に出てくる PBI 番号は当時の番号付けを参照 |
| 2026-05-08 | v3.8：PHASE0-010 Retrospective Gate 事実修正。§6.4 `tailwind.config.ts` 削除（Tailwind v4 は CSS ベース設定）、Decision #21 を shadcn 4.x preset 体系に更新 |
| 2026-06-13 | v3.9：Phase 再編（公開の独立フェーズ化）。1b = コンテンツ整備（新設）、1c = デザイン（旧 1b）、1d = 公開（新設、旧 PHASE1A-018 を移管）、1e = カテゴリ別一覧（旧 1c）。背景：本番 Worker が Phase 0 placeholder のまま・MX が apex 名指し・www に旧 Netlify サイト稼働という現状調査結果を受け、未完成サイトの公開を防ぐ構成に変更。Decision #25 #26 追加（公開フェーズ分離 / Contact 自前フォーム = Worker + Turnstile + Resend）、FR-29 追加、PHASE1A-020 の検証 URL を branch alias に変更、ドラフト 2 本作成（draft-phase1b-content-launch-prep.md / draft-phase1d-domain-launch.md）。Done 済み PBI 内の旧 Phase 名は当時表記のまま（読み替え：旧 1b → 新 1c、旧 1c → 新 1e） |
| 2026-06-14 | E2E 検証を CI ルートに正式化（クラリフィケーション、v 番号据え置き）。`ui-tests.yml` を Playwright 公式コンテナ化して install ハング/timeout を解消、`scripts/ci-status.sh` 追加。Decision #27 追加・NFR-06 に CI 検証注記。§7 検証ゲートを 2→3 項目化（E2E/CI green 確認を常設、README §4.6 ルール 7 / 受け入れ条件テンプレ / INDEX セッション開始チェック / CLAUDE.md §7 連動、PBI 021・022 に N/A 行追加）。PBI 019 に事後追記で前方参照。旧「E2E は運営者ターミナル手動」前提は本日以降 CI 検証に置換 |
| 2026-06-14 | Phase 1a Retrospective Gate（PHASE1A-022）での事実修正（クラリフィケーション、v 番号据え置き）。§10 未決事項 Q1/Q2/Q3/Q4/Q6/Q7/Q10/Q12 を Phase 1a 実装での確定値に反映（各 PHASE1A-006/008/009/014/015 参照）、§12 の README 参照を v2.8 → v2.9、§6.4 構成図に `src/types/` と `public/favicon.svg`〔暫定〕を追記。なお main マージ＋本番デプロイは v3.9 Decision #25 で Phase 1d 移管済みのため Gate では実施せず（PHASE1A-022 マージ節を N/A 化、運営者承認） |
| 2026-06-14 | ガバナンス文書ドリフト一括是正（クラリフィケーション、v 番号据え置き）。README §10 ブランチ運用を deferred-merge に是正し README を v3.0 → v3.1 化（公開前 1a〜1c は feat/phase-1a 集約、main マージは 1d。site-plan §7 1d 行は元から整合）。連動して §12 の README 参照を v2.9 → v3.1 に訂正（前 Gate の v2.9 修正が誤り。README 現行は v3.0 だった）、§14 メンテ表の v2.x / v3.x 行を README の v3.x 名前空間移行に合わせて更新。CLAUDE.md line 69/90・operation-manual.md（毎 Phase マージ + 旧 worktree 記述）・INDEX.md も同コミットで是正。過去事実の改訂履歴行（直前の line 含む）と Done PBI 本体は不変のまま。 |
| 2026-06-14 | 統合ブランチ改名（クラリフィケーション、v 番号据え置き。README v3.2 連動）。公開前 1a〜1c を集約する統合ブランチを `feat/phase-1a` → `feat/phase-1` にリネーム（sub-phase 名で統合ブランチを呼ぶ名前と中身のズレを解消。deferred-merge 構造は不変）。§12 の README 参照を v3.2 に更新。CLAUDE.md / README §10 / operation-manual.md / draft-phase1d の現行・前方参照と CF プレビュー URL（`feat-phase-1-...`）も連動更新。`feat/phase-*` パターン内なので CF filter / main 保護は無変更。Done PBI 本体の当時のブランチ名は不変。 |
| 2026-07-12 | v3.10：**Phase 1c 先行トラック導入（1b 記事執筆との並行許可）**。1c を先行トラック（記事非依存：デザイン方向性確定 / 確定 HEX + color-contrast 再有効化 / タイポ確定 / ロゴ刷新 / favicon / B-1 見出しレベル / B-2 フォント CLS）と仕上げトラック（B-3 CSS サイズ / 全記事最終再検証 / 1c Gate、1b Gate 後に起票）に二分。背景：1b 残タスク（記事 008〜013）が運営者リライト・ヒアリング律速で、記事非依存のデザイン作業を待たせる実益がない（実コンテンツ検証の前提は 1b-001〜005 承認済み + 008 ドラフトで実質充足）。Decision #28 追加、§7 ロードマップ 1c 行・「PBI の起票タイミング」節に例外注記、§12 参照更新。README §9 例外追加（v3.3）、INDEX.md Phase 1c 節・着手ルール、CLAUDE.md、draft-phase1c-design-polish.md 着手条件、PHASE1B-014 申し送り宛先を連動更新。先行トラック PBI（PHASE1C-001〜007）を同日起票 |
| 2026-07-30 | フォント読み込みを Astro 公式 Fonts API へ移行（PHASE1C-007、Decision #24 更新、v 番号据え置き）。`src/styles/global.css` の `@import "@fontsource-variable/*"` をやめ、`astro.config.mjs` の `fonts` 設定（provider は local、variants は `scripts/fontsource-variants.mjs` が fontsource の index.css から生成）+ BaseLayout の `<Font>` に変更。和文 Noto Sans JP は `display: "optional"`（差し替えによる本文のずれを構造的に無くす）、欧文 Geist は preload。背景：CLS はフォールバックの字形寸法差で決まり、端末の日本語フォント次第で 0.09〜0.23 まで振れることを実測。Astro の最適化フォールバックは Arial 基準で和文には効かないため和文側は無効化 |
| 2026-07-13 | デザイン方向性確定（PHASE1C-001 完了の事実反映、クラリフィケーション、v 番号据え置き）。運営者が草案 3 案（快晴 / 春空 / 野の羽色、モックは docs/design-drafts/phase1c-001/）から**案2「春空」を選定**（修正指示なし）。確定記録を docs/design-direction.md に新設（パレット HEX/oklch + AA 検証値 / タイポ方向性 / トーン・署名要素 / 002〜005 への引き継ぎ）。§6.5.2 に確定候補値の所在を追記、§6.5.3 見出し書体を Zen Kaku Gothic New に更新 |
| 2026-08-01 | ロゴ反復上限の延長（Decision #15 更新、v 番号据え置き）。PHASE1C-004 で 5 ラウンド消化（1 ボツ + 2〜5 差し戻し）後も未確定。運営者判断で上限を延長し、ラウンド 6 以降は「鳥 = 旧案1（尾を短縮 + 残像ストローク）、円と数字の滝 = 旧案2」の合意構成を画像生成 AI（Gemini）の編集ベースで作成するルートに切替。経緯詳細は PBI 実装ログ |
| 2026-07-31 | タイポグラフィ確定（PHASE1C-003、§6.5.3 を確定値に差し替え、v 番号据え置き）。見出し書体 Zen Kaku Gothic New（500 / 700）を導入し、欧文専用の Geist は廃止して本文を Noto Sans JP 一本に。サイズ / 行間を `--text-*` トークン化（本文 16px / 行間 1.95、見出し 42 / 32 / 24 / 17 / 14px）、ウェイトは 500・700 の 2 段。和文は palt +`text-wrap: balance` + `word-break: auto-phrase`、コード内の和文コメントは Noto Sans JP に固定。読み込みは見出し swap / 本文 optional（初回訪問でブランド書体が出ることと CLS 抑制の両立。実測は PBI 実装ログ）。docs/design-direction.md §3 に確定結果を追記 |
| 2026-08-02 | v3.11：**初期記事セット縮小（6 本 → 3 本、公開優先）**。公開前は T1（008 公開済み）+ T2（009）+ L1 法人化（012）の 3 本、T3 / T5 / L2+L3 は article-backlog.md へ移管し公開後に R-01 routine で消化。Decision #29 追加、§7 1b 行・§12 の自己参照更新。PHASE1B-010 / 011 / 013 を Dropped 化（README v3.6 で状態新設）、PHASE1B-014 完了条件・INDEX.md・CLAUDE.md 連動 |
| 2026-08-05 | v3.12：**記事ライセンス変更（CC BY 4.0 → 通常の著作権表記）**。Footer の CC BY 表記を削除して © のみとし、Privacy に「著作権について」節を新設（出典明記の引用は歓迎、全文転載・二次利用は Contact へ相談）。CC BY は転載収益化をクレジットのみで許すため Phase 2 収益化と相性が悪く、配布後取消不能のため公開（1d）前に変更。Decision #30 追加、Q12・R-09 更新、CLAUDE.md（版数参照）連動 |
| 2026-08-07 | Phase 1c Gate（PHASE1C-012）での事実修正（クラリフィケーション、v 番号据え置き）。§13 の現在地マーカーを §13.1 法人化前 → §13.2 移行期へ移動（PHASE1B-014 で記録に留めた持ち越し分の消化）。§12 の自己参照 v3.11 → v3.12、README 参照 v3.3 → v3.6（v3.12 改訂時の連動更新漏れ。CLAUDE.md の README 参照も同時修正）。決定内容の変更なし |
| 2026-08-10 | v3.13：**公開後の運用形態を確定**（Phase 1d Gate = PHASE1D-009）。Decision #31 追加（統合ブランチを畳んで main 起点の 1 作業 1 ブランチへ / Phase 1e を「公開後の運用・改善」に再定義 / ダークモードはやらないと確定）。§7 ロードマップ 1e 行と現在地図、§12 次アクションを公開後の実態に書き換え。あわせて Gate で検出した差分を修正：§6.7 既存資産取扱表の自己参照が v3.8 のまま（→ v3.13）、§12 の README 参照 v3.8 → v3.9。README（§10 ブランチ運用を全面改訂、v3.9）・CLAUDE.md（ブランチ運用 / branch alias URL / Sandbox 制約）・operation-manual.md（シーン別表 / Q6 / 必須チェックリスト / health-check の取得 URL）を連動更新 |
| 2026-08-08 | PHASE1D-002 での §13 実態合わせ（v 番号据え置き）。§13.2 の「byte-lark 株式会社（仮）」想定を実態（合同会社バイトラーク）へ更新、Footer / About に代表社員・所在地（市区レベル：香川県高松市、運営者決定）を追加、プライバシーポリシーに安全管理措置を明記し改定日 2026-08-08 を記載、インボイス登録番号は掲載なしで確定（直案件開始時に再検討）。incident-response.md の法人化前提記述も実態合わせ |

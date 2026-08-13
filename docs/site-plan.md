# byte-lark.com サイト構築計画書 (v3.14)

最終更新: 2026-08-13

> v3.13 → v3.14 主な変更：**計画書と INDEX の分割（読み込み効率化、PHASE1E-005）**。改訂履歴と「版ごとの主な変更」を `docs/site-plan-history.md` へ、Decision Log 本体を `docs/site-plan-decisions.md` へ切り出し（§8 は誘導スタブ、参照表記「site-plan §8 Decision #NN」は不変）。INDEX.md の改訂履歴も `docs/pbi/INDEX-history.md` へ切り出し。あわせて §12 の README 参照のドリフト（v3.9 のまま、現行 v3.11）を修正。§14・CLAUDE.md 連動更新。
>
> 過去の「版ごとの主な変更」と改訂履歴表は [docs/site-plan-history.md](site-plan-history.md) を参照。

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
| `docs/site-plan.md` | 上書き（v2 → v3.14） | 本ファイル |
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

本体は [docs/site-plan-decisions.md](site-plan-decisions.md) に分割した（v3.14、読み込み効率化）。参照表記は従来どおり「site-plan §8 Decision #NN」を使い、新しい決定は分割先の表の末尾に # 連番で追記する。

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

PBI フォーマット規約・状態管理・コミット規約・ブランチ運用は `docs/pbi/README.md` v3.11 を参照。
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
| `v3.x` | site-plan.md タイトル / 改訂履歴（分割先 docs/site-plan-history.md）/ 自己参照 / §6.7 既存資産取扱表 / §12 次アクション / §14 自身の予防策説明 / **INDEX.md ロードマップ参照（line 74 周辺）** / **INDEX.md セッション開始時必須チェック注記** / **PHASE0-005 内 CLAUDE.md テンプレ（current: v3.x 行）** / **PHASE0-010 「計画書 v3.x と実態の差分」（line 30, 85 周辺）** / **operation-manual.md（v3.x 連動言及がある場合）** / **CLAUDE.md ヘッダー（v3.x 連動言及がある場合）** / **README.md の version（タイトル + v3.0 以降の改訂履歴）+ CLAUDE.md / site-plan §12 の README 参照 — README は v3.0 で v3.x 名前空間に移行したため本パターンで site-plan 自身の version と混在する。想定箇所列で「site-plan の version」と「README の version」を仕分けること** | `grep -rn "v3\." docs/ CLAUDE.md` |
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
- **改訂履歴の同期**：site-plan（分割先 `docs/site-plan-history.md`）/ README.md / INDEX（分割先 `docs/pbi/INDEX-history.md`）/ 関連 PBI のいずれかで改訂履歴行を追加する時、他の改訂履歴も**同コミット内で**整合更新（前ラウンドで INDEX.md 改訂履歴の追記漏れが発生した教訓）。v3.14 で site-plan / INDEX の改訂履歴は別ファイルに分割済み
- **本表自体のメンテ**：新たな連動更新漏れパターンが発覚したら、本表に追加して将来の漏れを防ぐ
- **将来の自動化**：本 §14 の grep 7 パターンを `scripts/check-version-refs.sh` 等にスクリプト化し、lefthook の pre-push に組み込む案を Phase 1a 冒頭で別 PBI として起票検討（手動 grep 忘れリスクの構造的排除）

---

## 改訂履歴

[docs/site-plan-history.md](site-plan-history.md) に分割した（v3.14）。改訂履歴行と「版ごとの主な変更」の追記は分割先へ。他ファイルの改訂履歴との同期ルールは §14 の運用ルールに従う。

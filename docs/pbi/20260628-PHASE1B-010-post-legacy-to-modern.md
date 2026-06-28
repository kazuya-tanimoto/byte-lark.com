# 訪問者は「25年 PHP/Java 畑のエンジニアが TypeScript/React に移ってみて」（tech）を読める

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- 長年の業務システム開発（PHP / Java / メインフレーム / Oracle）からモダンフロントエンド（TypeScript / React / Tailwind / Astro）へ橋渡しした経験を、戸惑い・腑に落ちた点・ベテランだから見える共通項とともに読める

## なんのために
- PHASE1B-007 で確定した初期記事セット 6 本の tech 記事（T3）。25 年のキャリアを持つ運営者ならではの希少な視点で、レガシーとモダンの両方を知る読者に刺さる
- 関連: src/data/career.ts / src/data/skills.ts / Phase 1b / PHASE1B-007

## 受け入れ条件
- [ ] 運営者 + Claude でヒアリング（writing-workflow §3）→ Claude が Markdown ドラフト生成（`yarn new-post --slug legacy-engineer-learns-typescript-react --category tech`、`draft: true`）
- [ ] frontmatter 完備：title（`| byte-lark.com` サフィックス無し）/ description（80-120字・OGP 兼用）/ category: tech / tags / publishedAt / slug。本文冒頭に `# タイトル` を重複させない（PostLayout が title を h1 出力）
- [ ] 運営者がリライトし `draft: false` に変更（最終承認を実装ログに記録）
- [ ] OGP / Article JSON-LD が記事ページで正しく出力される（headline 汚染なし、`buildArticleJsonLd()`）
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- カテゴリ: tech / 想定 slug: legacy-engineer-learns-typescript-react
- 内容の柱（ネタ出し T3）: skills.ts の実年数（PHP 11年 / Java 6年 / Oracle 12年 → TypeScript / React 各 3年）を一次情報に / 型・コンポーネント思考で腑に落ちた点 / 戸惑った点 / 長く現場にいるから見える普遍的な設計の共通項
- 経歴・年数は src/data/career.ts / skills.ts と矛盾させない（運営者確認済みの実数）
- 公開（main マージ）は Phase 1d。feat/phase-1 上では `draft: false` で CF preview 確認可

## 備考
- 初期セット 6 本のうち 3 本目（T3）

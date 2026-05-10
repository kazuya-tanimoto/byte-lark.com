# 訪問者は Hibari brand カラーで統一されたサイトを閲覧し、コードブロックにシンタックスハイライトが適用された記事を読める

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- サイト全体が Hibari brand の仮カラーパレットで視覚的に統一されている
- tech 記事のコードブロックにシンタックスハイライトが適用されている

## なんのために
- Phase 1a の全ページ実装がデザイントークンを参照する前提のため、冒頭で仮 HEX を確定する必要がある
- コードハイライトは tech 記事の読みやすさに直結し、ライブラリ選定が後工程（Blog 記事詳細）に影響するため早期に決める
- 関連: site-plan.md §6.5.2 / Q13 / FR-26 / Phase 1a 冒頭タスク

## 受け入れ条件
- [ ] `src/styles/global.css` に Hibari brand の CSS カスタムプロパティを定義（primary / accent / secondary / earth / neutral の各ロール、light モード）
- [ ] CSS 変数が Tailwind v4 の `@theme` ディレクティブで参照可能
- [ ] Q13 コードハイライトライブラリ選定完了（Shiki / Prism / Expressive Code を比較、運営者と決定）
- [ ] 選定ライブラリの設定を `astro.config.mjs` に追加
- [ ] サンプルコードブロック（TypeScript / JSX）でハイライト動作確認
- [ ] `yarn build` 成功
- [ ] `yarn check:ts` エラーなし

## 技術メモ
- Tailwind v4 は `tailwind.config.ts` 不使用。テーマトークンは CSS で定義する（PHASE0-010 申し送り確認済み）
- Astro は Shiki をビルトインサポート（有力候補）
- カラーの仮 HEX は site-plan §6.5.2 の Tailwind tone 目安を参考に決定。Phase 1b で確定 HEX に置換
- Expressive Code は Astro 専用統合 `astro-expressive-code` がある

## 備考
- Dark モード対応は Phase 1b 以降で検討（Phase 1a は light モードのみ）
- Q5（記事 cover 画像の運用方針）もこの PBI で合わせて決定可能（Content Collections PBI に影響）

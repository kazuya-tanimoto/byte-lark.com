# 訪問者はトップページで職能概要・経歴・スキル・最新記事を一覧できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- トップページの Hero で名前・肩書・キャッチコピーを確認できる
- Career / Skills の抜粋から詳細ページへ遷移できる
- Qualifications セクションで保有資格を確認できる
- 最新 Blog 記事を確認し、Blog 一覧ページへ遷移できる

## なんのために
- エージェント担当者・クライアント PM が候補者の職能を素早く把握するため（ペルソナ: 高優先度）
- サイトの全コンテンツへの入口として機能させるため
- 関連: site-plan.md §6.1 / FR-01 / FR-02 / FR-13 / FR-15

## 受け入れ条件
- [ ] `src/pages/index.astro` を実装
- [ ] Hero セクション: 名前・肩書・要約・主要リンク（Q1 で文言決定）
- [ ] Career 抜粋: `src/data/career.ts` から直近 N 件を表示、`/career` へのリンク
- [ ] Skills 抜粋: `src/data/skills.ts` から上位 M 件を表示、`/skills` へのリンク
- [ ] `src/data/qualifications.ts` を作成（Qualifications セクションのデータソース）
- [ ] Qualifications セクション: 保有資格を表示（独立ページなし、FR-15）
- [ ] 最新記事セクション: Content Collections から最新 N 件を BlogCard で表示、`/blog` へのリンク
- [ ] `src/components/Hero.astro` を作成
- [ ] `src/components/BlogCard.astro` を作成（Blog 一覧 PBI でも使用）
- [ ] レスポンシブ対応（モバイル / タブレット / デスクトップ）
- [ ] `yarn build` 成功

## 技術メモ
- Hero / BlogCard / CareerTimeline 抜粋 / SkillSet 抜粋は全て Astro コンポーネント（静的、JS 不要）
- Q1 の Hero 文言は Claude が 3 案ドラフト → 運営者選定の流れ
- Career / Skills の抜粋件数（N / M）は実データを見て決定

## 備考
- R-05: Hero 文言が決まらない場合はプレースホルダーで先に実装し、後から差替可能な構造にする
- R-08: Career 実データが少ない場合の見え方を確認、必要なら視覚調整

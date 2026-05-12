# 訪問者は About ページで個人プロフィールと byte-lark の概要を確認できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- 運営者の経歴サマリ・興味領域・技術的バックグラウンドを確認できる
- byte-lark の事業概要・ビジョンを確認できる

## なんのために
- エージェント担当者・クライアントが面談前に運営者の人物像を把握するため
- 法人としての信頼性を最低限示すため
- 関連: site-plan.md §6.1 / FR-10

## 受け入れ条件
- [ ] `src/pages/about.astro` を実装
- [ ] 個人プロフィールセクション（経歴サマリ・興味領域）
- [ ] byte-lark 概要セクション（事業内容・ビジョン）
- [ ] Q2 で文言決定（Claude が文体 2 案 × 構成 2 案をドラフト → 運営者選定）
- [ ] PageLayout を使用
- [ ] OGP メタ（title / description）が正しく出力
- [ ] レスポンシブ対応
- [ ] `yarn build` 成功
- [ ] `yarn check:ts` エラーなし

## 技術メモ
- About ページは静的テキスト中心、Astro コンポーネントで実装
- JSON-LD（Person / Organization）を About ページに含めるかは実装時に判断（site-plan §6.6 に「必要時」と記載）

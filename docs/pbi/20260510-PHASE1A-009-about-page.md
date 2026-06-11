# 訪問者は About ページで個人プロフィールと byte-lark の概要を確認できる

Status: Done
Started: 2026-06-12
Completed: 2026-06-12

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
- [x] `src/pages/about.astro` を実装
- [x] 個人プロフィールセクション（経歴サマリ・興味領域）
- [x] byte-lark 概要セクション（事業内容・ビジョン）
- [x] Q2 で文言決定（Claude が文体 2 案 × 構成 2 案をドラフト → 運営者選定）
- [x] PageLayout を使用
- [x] OGP メタ（title / description）が正しく出力
- [x] レスポンシブ対応
- [x] `yarn build` 成功
- [x] `yarn check:ts` エラーなし

## 技術メモ
- About ページは静的テキスト中心、Astro コンポーネントで実装
- JSON-LD（Person / Organization）を About ページに含めるかは実装時に判断（site-plan §6.6 に「必要時」と記載）

## 実装ログ

### 2026-06-12 セッション 1
- やったこと：`src/pages/about.astro` 新規実装（プロフィール / byte-lark について の 2 セクション構成）。Q2 文言は文体 2 案 × 構成 2 案を提示し、運営者が「ですます調 × 見出し整理型」を選定。JSON-LD は site-plan §6.6「/about で必要時」に基づき Person schema を採用、`src/lib/jsonld.ts` に `buildPersonJsonLd()` を追加（既存の AUTHOR / PUBLISHER 定数を再利用、worksFor で Organization も内包）。ローカル検証はデスクトップ 1280px + モバイル 375px のフルページスクリーンショットで確認
- 残タスク：push 後の CF preview 検証
- 学び・つまずき：bg セッションの分離ガード（Edit/Write 阻止）が worktree 廃止フロー（README v3.0）と衝突 → 運営者承認の上 `.claude/settings.json` に `worktree.bgIsolation: "none"` を追加して仕組みで解決
- 想定外だった点：port 4321 が別プロセス使用中で dev server は 4322 で起動（`yarn dev` 出力の Local URL 確認が必須）。コンソールに favicon.ico の 404 が出る（全ページ共通の既存事象、本 PBI 対象外）

# 訪問者は全ページで一貫したレイアウトと正しい OGP メタ情報を得られる

Status: Done
Started: 2026-05-17
Completed: 2026-05-17

## 誰が
- 訪問者

## 何をできる
- 全ページで統一されたレイアウト（Header / Footer / メタ情報）を体験できる
- SNS 共有時に正しい OGP 情報（タイトル・説明・画像）が表示される

## なんのために
- 後続の全ページ PBI が BaseLayout を使う前提のため、先に共通レイアウトを整備する
- OGP / SEO メタを SSG 時に静的生成し、クローラーの JS 非実行環境でも正しく認識されるようにする
- 関連: site-plan.md §6.6 / FR-17 / NFR-09

## 受け入れ条件
- [x] `src/layouts/BaseLayout.astro` を作成（props: title / description / ogImage / canonical / type）
- [x] `<title>` / `<meta name="description">` が各ページから渡された値で出力
- [x] OGP メタ（og:title / og:description / og:image / og:url / og:type）が SSG 出力 HTML に静的に含まれる
- [x] Twitter Card メタ（`summary_large_image`）が出力
- [x] `<link rel="canonical">` が各ページの正規 URL で出力
- [x] デフォルト OGP 画像 `public/og-default.png` を配置（ogImage 未指定時のフォールバック）
- [x] `src/layouts/PageLayout.astro` を作成（一般ページ用、BaseLayout を wrap）
- [x] OGP ヘルパ `src/lib/og.ts` を作成（メタタグ生成ロジックの集約）
- [x] `yarn build` 成功、出力 HTML で OGP メタを目視確認
- [x] `yarn check:ts` エラーなし

## 技術メモ
- BaseLayout は `<html>` / `<head>` / `<body>` を含む最外殻レイアウト
- PageLayout は BaseLayout を使いつつ、一般ページ共通のコンテンツ幅制約等を追加
- PostLayout は別 PBI（PHASE1A-007）で作成
- global.css の読み込みは BaseLayout で行う
- Header / Footer は別 PBI（PHASE1A-006）で作成するが、BaseLayout の slot 構造は Header/Footer を含む前提で設計

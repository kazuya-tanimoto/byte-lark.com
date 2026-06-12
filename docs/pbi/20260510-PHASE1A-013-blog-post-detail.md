# 訪問者は Blog 記事詳細ページで本文を読み、コードブロックのシンタックスハイライトを確認できる

Status: Done
Started: 2026-06-12
Completed: 2026-06-12

## 誰が
- 訪問者

## 何をできる
- `/blog/:slug` で記事の本文・メタ情報を閲覧できる
- コードブロックにシンタックスハイライトが適用された状態で読める
- 記事の cover 画像が最適化された状態で表示される

## なんのために
- Blog の中核機能として、記事本文を読みやすく提示するため
- tech 記事のコードブロックの可読性を確保するため
- 関連: site-plan.md §6.1 / FR-07 / FR-26

## 受け入れ条件
- [x] `src/pages/blog/[slug].astro` を実装
- [x] Content Collections から slug で記事を取得し、本文をレンダリング
- [x] PostLayout（PHASE1A-007）を使用
- [x] 記事メタ表示: publishedAt / updatedAt / category / tags
- [x] cover 画像表示（設定されている場合、Astro `<Image>` で最適化。PostLayout に cover 用 named slot を追加してタイトルの上に表示）
- [x] コードハイライトが PHASE1A-002 で選定したライブラリで動作（Shiki github-light）
- [x] 存在しない slug へのアクセスで 404 ページに遷移（dev / CF preview とも HTTP 404。専用 404 ページは PHASE1A-016）
- [x] 記事個別の OGP メタが正しく出力（title / description / cover → og:image。og:image は getImage の 1200×630 webp）
- [x] レスポンシブ対応
- [x] `yarn build` 成功
- [x] `yarn new-post` で生成した記事ファイルに本文を書き、ブラウザで正しく表示されることを確認（生成→執筆→ビルド→表示の一気通貫検証。検証用一時記事は確認後に削除）
- [x] `yarn check:ts` エラーなし

## 技術メモ
- `getStaticPaths()` で全記事の slug を列挙し、SSG で各記事ページを生成
- MDX 記事では React コンポーネントの埋め込みが可能（必要な場合のみ）
- コードハイライトのテーマ設定は PHASE1A-002 で `astro.config.mjs` に追加済みの前提

## 実装ログ

### 2026-06-12 セッション 1
- やったこと：`src/pages/blog/[slug].astro` 新規実装（`getStaticPaths` で非 draft 記事を列挙、`satisfies GetStaticPaths` + `InferGetStaticPropsType` で型付け、`render()` の headings を PostLayout の目次へ、cover は PHASE1A-007 申し送りどおり `getImage({ width:1200, height:630, format:"webp" })` で og:image に解決）。cover の本文上表示のため PostLayout に `<slot name="cover" />` を追加。申し送り対応としてサンプル記事の本文冒頭 h1 重複も削除。`yarn new-post --slug verify-pipeline-tmp` で一時記事を生成し執筆→ビルド→表示の一気通貫を確認後、一時記事を削除。ローカル + CF preview を 1280px / 375px で検証、存在しない slug / draft 記事 URL の 404 も両環境で確認
- 残タスク：なし
- 学び・つまずき：PostLayout は title をそのまま `<title>` と JSON-LD headline に使うため、`| byte-lark.com` サフィックスを付けずに記事タイトル素のまま渡す（headline 汚染防止）
- 想定外だった点：特になし

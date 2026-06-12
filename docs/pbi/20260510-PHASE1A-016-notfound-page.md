# 訪問者は存在しない URL にアクセスした際に NotFound ページを表示され、サイトへ復帰できる

Status: Done
Started: 2026-06-12
Completed: 2026-06-12

## 誰が
- 訪問者

## 何をできる
- 存在しない URL にアクセスした際に、サイトのデザインに統一された 404 ページが表示される
- Home ページへのリンクからサイトに復帰できる

## なんのために
- ユーザーが迷子にならないよう、適切な誘導を提供するため
- サイト全体の品質感を維持するため（ブラウザデフォルトの 404 を避ける）
- 関連: site-plan.md §6.1 / FR-16

## 受け入れ条件
- [x] `src/pages/404.astro` を実装
- [x] 「ページが見つかりません」等のメッセージ表示
- [x] Home ページへのリンク
- [x] BaseLayout を使用（Header / Footer 表示）
- [x] サイトのデザイントーンと統一
- [x] レスポンシブ対応
- [x] `yarn build` 成功
- [x] `yarn check:ts` エラーなし

## 技術メモ
- Astro の `src/pages/404.astro` は SSG 時に `404.html` として出力される
- Cloudflare Workers は `404.html` を自動的に 404 レスポンスとして使用する（要確認）
  - **確認結果：自動では使用されない**。`wrangler.jsonc` の `assets.not_found_handling` を `"404-page"` に明示設定する必要がある（未設定デフォルトは null body の 404）。公式 docs: workers/static-assets/routing/static-site-generation/

## 実装ログ

### 2026-06-12 セッション 1
- やったこと：`src/pages/404.astro` 新規実装（PageLayout 使用 → BaseLayout 経由で Header/Footer 表示）。中央寄せで「404（hibari-sky 大表示）/ ページが見つかりません / 説明文」+ CTA 2 つ（「Home へ戻る」は Hero の primary ボタンと同スタイル、「記事一覧を見る →」はテキストリンク）。`wrangler.jsonc` に `not_found_handling: "404-page"` を追加（技術メモの「要確認」を公式 docs で裏取りした結果、明示設定が必須と判明）。ローカル（dev server, 4322）+ CF preview を 1280px / 375px で検証、存在しない URL で HTTP 404 + カスタムページ表示、「Home へ戻る」クリックでトップへ復帰することを CF preview 上で確認
- 残タスク：なし
- 学び・つまずき：前 PBI と同様、ポート 4321 に stale な node プロセスが残存（Astro デフォルト 404 を返す）。dev server は 4322 にフォールバックするため、検証はログの実ポートを確認してから行うこと
- 想定外だった点：CF Workers の 404.html 配信が自動でなかった（設定 1 行追加で解決）。favicon 404 は前 PBI から継続（Phase 1b 対応候補）

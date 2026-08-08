# Claude は Content Collections で記事を型安全に管理し、画像を WebP 最適化できる

Status: Done
Started: 2026-05-16
Completed: 2026-05-16

## 誰が
- Claude

## 何をできる
- Astro Content Collections + Zod スキーマで Markdown/MDX 記事を型安全に管理できる
- Astro の画像最適化パイプラインで記事画像を WebP 変換・レスポンシブ出力できる

## なんのために
- Blog 一覧・記事詳細・RSS 等の後続 PBI が Content Collections API に依存するため、先に基盤を整備する
- frontmatter の型不整合をビルド時に検出し、記事品質を担保する
- 関連: site-plan.md §6.3 / FR-08 / FR-14 / FR-27

## 受け入れ条件
- [x] `src/content.config.ts` に posts コレクションの Zod スキーマ定義（§6.3 準拠）
- [x] 必須フィールド: title / description / category / tags / publishedAt
- [x] 任意フィールド: updatedAt / draft / cover / slug
- [x] category は Zod enum で `tech | life` のみ許可
- [x] tags は lowercase 強制（Zod transform or refinement）
- [x] `draft: true` の記事がビルド出力に含まれない
- [x] サンプル記事 1 件（tech カテゴリ）を `src/content/posts/` に作成し、Content Collections API で取得確認
- [x] frontmatter 必須項目欠落時にビルドエラーになることを確認
- [x] Astro `<Image>` / `<Picture>` で WebP 変換が動作（サンプル画像で確認）
- [x] `yarn build` 成功
- [x] `yarn check:ts` エラーなし

## 実装ログ

### 2026-05-16 実装完了

やったこと:
- `src/content.config.ts` 作成: glob loader + Zod schema（image() ヘルパー使用）
- `src/content/posts/hello-astro-content-collections.md` サンプル記事（tech, cover 画像付き）
- `src/content/posts/draft-sample.md` draft テスト記事
- `src/assets/posts/sample-cover.png` カバー画像（200x100 PNG）
- `src/pages/index.astro` を Content Collections API + `<Image>` 使用に更新

検証結果:
- ビルド時に WebP 生成確認（`/_astro/sample-cover.*.webp`）
- draft 記事がビルド出力に含まれないことを確認（Published: 1）
- 必須フィールド欠落で `InvalidContentEntryDataError` が出ることを確認
- `yarn build` / `yarn check:ts` ともにエラーなし

学び:
- Astro 6 の Content Collections は `src/content.config.ts`（プロジェクトルート level の src 直下）に配置
- glob loader の `base` は相対パス `"./src/content/posts"` で指定
- schema で `({ image }) => z.object(...)` の関数形式にすることで image() ヘルパーが使える
- Biome は .astro テンプレート内のフロントマター変数参照を認識しない（警告が出るが実害なし）

## 技術メモ
- Astro 6 の Content Collections は `src/content.config.ts` で定義（以前の `src/content/config.ts` から変更の可能性あり、公式 docs で確認すること）
- slug はファイル名から自動生成されるが、frontmatter で明示推奨（ファイル名変更で URL 変動防止）
- 画像最適化: `src/assets/posts/` 配下の画像は `<Image>` で import して使う（`public/` 配下は最適化対象外）
- cover image の運用方針は Q5 で決定（002 PBI と連動）

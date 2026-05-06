# 運営者は Astro 5 + Tailwind v4 + shadcn/ui の初期プロジェクトでローカル開発できる

Status: InProgress
Started: 2026-05-06

## 誰が
- 運営者

## 何をできる
- `yarn dev` で Astro 開発サーバが起動し、最小限のページが表示される
- `yarn build` で SSG ビルドが成功する
- shadcn/ui の Button コンポーネント 1 つが repo 内に存在し、サンプルとして動く
- Vitest / Playwright が設定済で起動可能

## なんのために
- Phase 1a 以降の実装基盤を確立するため
- Tailwind v4 / shadcn/ui の統合方法を初期化時点で確定させるため
- 関連: site-plan.md §6.4 / Decision Log #2 #21 / Phase 0

## 受け入れ条件

### Yarn 4 (Berry) 化（scaffold 前に実施）
- [ ] `corepack enable` で corepack を有効化
- [ ] `yarn set version stable` で Yarn 4.x を有効化（`.yarn/releases/yarn-4.x.x.cjs` が生成され、`.yarnrc.yml` に `yarnPath` が追記される）
- [ ] `yarn --version` が 4.x 系を返す

注：現リポジトリは Yarn 1.22 Classic（`yarn --version` で empirical 確認済）。`package.json` の `packageManager` 最終値は scaffold 後マージで決まるため、ずれていたら手動補正。

### Astro プロジェクト初期化
- [ ] `yarn create astro@latest . --template minimal --install --no-git` 相当でプロジェクト初期化済み（既存 `.git` 維持のため `--no-git` 必須。`--typescript strict` flag は create-astro CLI に存在しないため別項目「TypeScript strict 化」で対応）
- [ ] `package.json` の `packageManager` が `yarn@4.x.x`（具体バージョン）に設定されている
- [ ] `astro.config.mjs` に以下の integrations / plugin が登録されている：
  - [ ] `@astrojs/mdx`
  - [ ] `@astrojs/sitemap`
  - [ ] `@astrojs/react`
  - [ ] `@astrojs/rss`（pages 側で使用、依存追加）
  - [ ] Vite plugin: **`@tailwindcss/vite`**（`@astrojs/tailwind` は使わない）

### Tailwind v4 統合
- [ ] `tailwind.config.ts` 相当の設定ファイルが存在する（v4 では CSS-first 設定だが、theme extension 用に config 持つ）
- [ ] `src/styles/global.css` に Tailwind directives が記述されている

### shadcn/ui 初期化
- [ ] `npx shadcn@latest init` 相当が実行され、`components.json` が作成されている
  - [ ] `style: default`（Phase 1b で再調整、Decision Log #21）
  - [ ] `baseColor: slate`（Phase 1b で再調整）
- [ ] `src/components/ui/button.tsx` が `npx shadcn@latest add button` で導入されている
- [ ] `src/lib/utils.ts` に `cn()` ヘルパが存在する

### TypeScript strict 化 + Path alias
- [ ] `tsconfig.json` の `extends` が `astro/tsconfigs/strict` に設定されている（`--typescript strict` flag が CLI 未対応のため scaffold 後に手動設定）
- [ ] `tsconfig.json` の path alias が設定されている（`@/*` → `./src/*`）

### テスト基盤
- [ ] `vitest.config.ts` を新規作成（Astro + Vitest 構成、`@astrojs/check` と独立）
- [ ] `playwright.config.ts` は main 上に残置済（PHASE0-001 で削除しない方針）。Astro 用に以下を最低限調整：
  - [ ] `use.baseURL` を `http://localhost:4321`（Astro デフォルトポート）に設定
  - [ ] `webServer.command` を `yarn dev`（または `yarn preview`）に設定し、`webServer.url` を baseURL と一致させる
  - [ ] 旧 React Router 前提の URL 直書きが残っていれば削除

### Node version pin
- [ ] `.nvmrc` または `.tool-versions` に Node 20.x（または LTS）を pin

### .gitignore 整備
- [ ] `.gitignore` に `.astro/`（Astro の generated types ディレクトリ）を追加

### 動作確認
- [ ] `yarn install` が成功
- [ ] `yarn dev` 実行で Astro 開発サーバが起動し、`http://localhost:4321/`（Astro デフォルトポート）にアクセスできる
- [ ] `yarn build` が成功する
- [ ] `yarn check:ts`（または `astro check`）でエラーなし
- [ ] `feat/phase-0-pbi-002` sub-branch 上で実装し、完了時に `feat/phase-0` へ `git merge --no-ff` でマージされている（詳細：docs/pbi/README.md §10.4-10.5）

## 技術メモ
- Astro + Tailwind v4 公式：https://docs.astro.build/en/guides/styling/
- shadcn/ui Astro 公式：https://ui.shadcn.com/docs/installation/astro
- Tailwind v4 統合は **Vite plugin (`@tailwindcss/vite`)** が公式（`@astrojs/tailwind` は Tailwind 3 legacy 専用）
- Astro バージョン：5.x 系の最新
- Yarn 4 (Berry)：本 PBI 内で `corepack enable && yarn set version stable` を実行して Classic 1.22 → 4.x に移行（PHASE0-001 残置の `.yarnrc.yml` は `nodeLinker: node-modules` のみで `yarnPath` は無し、本 PBI で追加）
- create-astro CLI に `--typescript strict` flag は存在しない（CLI source 一次確認済）。scaffold 後 `tsconfig.json` の `extends` を `astro/tsconfigs/strict` に手動設定で代替
- shadcn コンポーネントは `src/components/ui/` 配下（`components.json` で指定）
- React Island で shadcn を使うため `@astrojs/react` integration が必要

### scaffold アプローチ（ハイブリッド、運営者判断済）

カレント既存ファイル（biome.jsonc, .yarnrc.yml, playwright.config.ts, docs/, lefthook.yml 等）が多数残置されているため、フル scaffold だとプロンプト衝突連発になる。最小 scaffold + 段階的 add のハイブリッドで進める：

1. `yarn create astro@latest . --template minimal --install --no-git`（既存ファイルは keep を選択）
2. `yarn astro add react`（`@astrojs/react`）
3. `yarn astro add tailwind`（公式 v4 統合：`@tailwindcss/vite` を `astro.config.mjs` に注入、`src/styles/global.css` に `@import "tailwindcss";` を生成）
4. `yarn astro add mdx`
5. `yarn astro add sitemap`
6. `yarn add @astrojs/rss`（astro add 不要、import で使う runtime ライブラリ）
7. `npx shadcn@latest init` → `npx shadcn@latest add button`

### shadcn init 時のプロンプト想定回答
- TypeScript: yes
- style: default（Phase 1b で再調整）
- base color: slate（Phase 1b で再調整）
- CSS variables: yes
- React Server Components: no（Astro 文脈）
- components.json 配置: ./components.json
- alias: @/components, @/lib/utils

## 備考
### 想定 package.json scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "biome check src",
    "check:ts": "astro check",
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test",
    "fix": "biome check --write src"
  }
}
```

### 動作確認手順
1. `yarn install`
2. `yarn dev` → http://localhost:4321/ で Astro の最小ページが表示
3. Ctrl+C で停止
4. `yarn build` → `dist/` に静的ファイルが生成
5. `cat src/components/ui/button.tsx` → shadcn の Button が見える

## 実装ログ
（未着手）

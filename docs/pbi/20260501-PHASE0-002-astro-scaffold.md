# 運営者は Astro 6 + Tailwind v4 + shadcn/ui の初期プロジェクトでローカル開発できる

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

### Astro プロジェクト初期化（Manual Setup）

Astro 公式 Manual Setup（`https://docs.astro.build/en/install-and-setup/#manual-setup`）に従う。create-astro CLI は既存 repo 後付け非対応 + Claude sandbox 内で `HTTP_PROXY` 非対応の Node fetch を行うため使わない（2026-05-06 セッション 1 で実証）。

- [ ] `yarn init --yes` で `package.json` を生成し、`packageManager` を `yarn@4.14.1`（worktree 同梱の Yarn binary と一致）に手動補正
- [ ] `yarn add astro` で astro の最新版 6.x を install（npm dist-tag latest = 6.2.2、2026-05-07 確認）
- [ ] `package.json` の `scripts` を本 PBI 備考の「想定 package.json scripts」に置換
- [ ] `src/pages/index.astro` を Astro 公式 Manual Setup のテンプレで新規作成
- [ ] `astro.config.mjs` を `import { defineConfig } from "astro/config"; export default defineConfig({});` で新規作成
- [ ] `tsconfig.json` を `{ "extends": "astro/tsconfigs/base" }` で新規作成（後段「TypeScript strict 化」で `strict` に上げる）
- [ ] `public/robots.txt` を Astro 公式テンプレで作成（`public/` を空 dir にしない）
- [ ] `astro.config.mjs` に integrations 段階追加後、以下が登録されていること：
  - [ ] `@astrojs/mdx`
  - [ ] `@astrojs/sitemap`
  - [ ] `@astrojs/react`
  - [ ] Vite plugin: **`@tailwindcss/vite`**（`@astrojs/tailwind` は使わない）
- [ ] `@astrojs/rss` は dependency に追加（pages 側で import 利用、astro.config.mjs への integration 登録不要）

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
- [ ] `.nvmrc` に Node 24（Active LTS、2026-05-07 audit で確定。Node 22 は 2025-10-21 に Maintenance LTS 入り、24 が現行 Active LTS）を pin。PHASE0-006 / 008 と整合（commit `5fd6cb5`）。Astro 6 の最低要件は `v22.12.0`+（公式 docs 確認済）

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
- Astro バージョン：6.x 系の最新（npm dist-tag `latest` = 6.2.2 on 2026-05-06、empirical 確認済）。PBI 起票時 (2026-05-01) は Astro 5 想定だったが、本日着手時点で Astro 6 が stable。
- Yarn 4 (Berry)：本 PBI 内で `corepack enable && yarn set version stable` を実行して Classic 1.22 → 4.x に移行（PHASE0-001 残置の `.yarnrc.yml` は `nodeLinker: node-modules` のみで `yarnPath` は無し、本 PBI で追加）
- create-astro CLI に `--typescript strict` flag は存在しない（CLI source 一次確認済）。scaffold 後 `tsconfig.json` の `extends` を `astro/tsconfigs/strict` に手動設定で代替
- shadcn コンポーネントは `src/components/ui/` 配下（`components.json` で指定）
- React Island で shadcn を使うため `@astrojs/react` integration が必要

### scaffold アプローチ（Astro 公式 Manual Setup を採用）

create-astro CLI（`yarn create astro@latest .`）は **既存 repo 後付け非対応**かつ Claude sandbox 内で `HTTP_PROXY` 非対応の Node fetch を行うため使わない（2026-05-06 セッション 1 で実証）。Astro 公式が用意する正規パスである **Manual Setup**（`https://docs.astro.build/en/install-and-setup/#manual-setup`）に切替える。pbi/README v2.8 §5.3 step 2 の「approach 自体も verify 対象」を反映した結果。

手順：

1. `yarn init --yes` → `package.json` 生成、`packageManager: yarn@4.14.1` に補正
2. `yarn add astro` → astro 6.x install
3. Manual Setup の手書きファイル群を作成：
   - `package.json` の `scripts` を `astro dev/build/preview` 等に整備（備考の想定 scripts 参照）
   - `src/pages/index.astro`（公式テンプレ）
   - `astro.config.mjs`（`defineConfig({})`）
   - `tsconfig.json`（`extends: "astro/tsconfigs/base"`、後の strict 化ステップで上げる）
   - `public/robots.txt`（公式テンプレ）
4. `yarn astro add react --yes`（`@astrojs/react`）
5. `yarn astro add tailwind --yes`（公式 v4 統合：`@tailwindcss/vite` を `astro.config.mjs` に注入、`src/styles/global.css` に `@import "tailwindcss";` を生成）
6. `yarn astro add mdx --yes`
7. `yarn astro add sitemap --yes`
8. `yarn add @astrojs/rss`（runtime ライブラリのみ、astro add 不要）
9. `yarn dlx shadcn@latest init` → `yarn dlx shadcn@latest add button`（`npx` 回避：npm cache の root-owned files 問題回避）

`yarn astro add` は対話 prompt を出すため `--yes` 必須。Yarn 4 / yarn dlx を Claude sandbox で動かすには `COREPACK_HOME` / `YARN_HTTP_PROXY` / `YARN_HTTPS_PROXY` / `YARN_GLOBAL_FOLDER` の export が必要（運用環境では不要、実装ログ参照）。

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

### 2026-05-06 セッション 1
- やったこと：
  - sub-branch `feat/phase-0-pbi-002` + worktree 作成、PBI Status InProgress + INDEX 同期 (`7428ff7`)
  - 一次情報で Astro 5→6 ドリフト検出 → docs(pbi) 補正コミット (`fe4b9e4`)
  - Yarn 1.22 → 4.14.1 化（corepack DL 済 binary を `.yarn/releases/yarn-4.14.1.cjs` 直配置 + `.yarnrc.yml` に `yarnPath` / `npmRegistryServer` 追記）
  - sandbox network allowlist に `repo.yarnpkg.com` / `raw.githubusercontent.com` 追加（運営者承認、`.claude/settings.local.json`）
- 残タスク（次セッション）：
  - PBI の `### scaffold アプローチ` 節を **Astro Manual Setup** に書き換え（docs(pbi)）。理由：create-astro CLI は「既存 repo 後付け」非対応。
  - Manual Setup 実行（`yarn init --yes` → `yarn add astro` → 手書き：`src/pages/index.astro` / `astro.config.mjs` / `tsconfig.json` / `public/`）
  - integrations 段階追加（`yarn astro add react/tailwind/mdx/sitemap`、`yarn add @astrojs/rss`）
  - shadcn init + Button、tsconfig strict 化 + path alias、`vitest.config.ts` 新規、`playwright.config.ts` 補正、`.nvmrc=22`、`.gitignore` に `.astro/`
  - 動作確認 + Done 化 + sub-branch merge
- 学び・つまずき：
  - **PBI の scaffold アプローチ (create-astro CLI 経由) が現実と乖離**。Astro 公式の Manual Setup 節 (`https://docs.astro.build/en/install-and-setup/#manual-setup`) が「既存 repo 後付け」用の正規パス。
  - **§5.3 step 2 の verify 範囲を「approach も対象」に拡張すべき**（今回 version drift は捕まえたが approach 検証を省略して走り出した）。次セッション冒頭で PHASE0-003 を 1 件 spot-check し、他 PBI の起票品質を測る予定。
  - Yarn 4 を Claude sandbox 内で動かすための env：`COREPACK_HOME=$TMPDIR/corepack` / `YARN_HTTP_PROXY=http://localhost:56072` / `YARN_HTTPS_PROXY=http://localhost:56072` / `YARN_GLOBAL_FOLDER=$TMPDIR/yarn-berry`（運用環境では不要）。
- 想定外：
  - create-astro CLI は `HTTP_PROXY` 非対応の Node fetch で template を fetch → sandbox 内動作不能。
  - Yarn 4 default registry は `registry.yarnpkg.com`（`.yarnrc.yml` の `npmRegistryServer` か env で `registry.npmjs.org` に明示が必要）。

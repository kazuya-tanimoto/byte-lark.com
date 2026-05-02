# 運営者は旧 Vite/React/Chakra 関連リソースが main から完全に削除された状態を確認できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- main ブランチ（feat/rebuild-astro 上での作業）から旧 Vite + React + Chakra 関連の全ファイル・依存が削除され、Astro 初期化に支障ない状態になっていることを確認できる
- 旧コードは `archive/vite-react-chakra` ブランチに退避済みで、必要時に参照可能

## なんのために
- Astro プロジェクト初期化前に、ファイル名・パスの衝突や設定ファイルの混在を排除するため
- 関連: site-plan.md §6.7 / Phase 0

## 受け入れ条件

### archive 確認
- [ ] `archive/vite-react-chakra` ブランチが local + remote に存在し、旧コード一式が含まれている

### 削除対象（feat/rebuild-astro 上で削除）
- [ ] `src/` ディレクトリ全体（Career.ts / Skill.ts / logo.png は PHASE0-003 で別途取り込み）
- [ ] `public/` ディレクトリ（Astro 初期化で再生成）
- [ ] `index.html`
- [ ] `vite.config.ts`
- [ ] `vitest.setup.ts`
- [ ] `package.json` / `yarn.lock`（Astro 初期化で再生成）
- [ ] `tsconfig.json` / `tsconfig.node.json`
- [ ] `tests/demo-todo-app.spec.ts` / `tests/example.spec.ts`（Playwright 公式デモ）
- [ ] `DEVELOPMENT_LOG.md`（旧 Vite 学習ノート、archive で参照可能）
- [ ] （`node_modules/` も削除推奨：容量とインデックス汚染回避、`yarn install` は PHASE0-002 で再実行）

### 残置対象（削除しない）
- [ ] `.git/`（ブランチ履歴維持）
- [ ] `.github/`（PHASE0-006 で書き換え or 一時無効化）
- [ ] `docs/`（計画書・PBI 保持）
- [ ] `LICENSE`（流用）
- [ ] `README.md`（PHASE0-010 でスタブ更新）
- [ ] `CLAUDE.md`（PHASE0-005 で書き換え）
- [ ] `SECURITY.md`（流用）
- [ ] `biome.jsonc`（PHASE0-004 で v2 化）
- [ ] `lefthook.yml`（PHASE0-006 でゼロから書き起こし）
- [ ] `playwright.config.ts`（PHASE0-002 で Astro 用に最低限調整、設定流用方針）
- [ ] `.gitignore`
- [ ] `.yarnrc.yml`（Yarn 4 nodeLinker 設定維持、PHASE0-002 以降の挙動に影響）

### 確認
- [ ] `git status` で削除が反映されている
- [ ] feat/rebuild-astro 上で 1 コミットとして記録されている（コミットメッセージ例：`chore: remove vite/react/chakra resources for astro rebuild`）

## 技術メモ
- archive ブランチは既に存在（前段で push 済）
- ロゴ画像 `src/assets/logo.png` は PHASE0-003 で取り込み（バイナリは `git checkout archive/vite-react-chakra -- <path>` 経由が安全、`git show` の `>` リダイレクトは改行変換で壊れる可能性）
- `.yarnrc.yml` の現状：`nodeLinker: node-modules`（PnP ではなく従来 linker）。これを維持
- ビルドキャッシュ（`dist/`、`storybook-static/`）は gitignored だが、手動削除推奨

## 備考
- 削除前に `git diff archive/vite-react-chakra..HEAD --stat` で差分が小さいことを確認すると安心
- 万一の取り戻し：`git checkout archive/vite-react-chakra -- <path>`

## 実装ログ
（未着手）

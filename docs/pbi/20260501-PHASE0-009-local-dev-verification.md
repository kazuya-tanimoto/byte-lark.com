# 運営者はローカル動作の正常性を確認し、Retrospective Gate 着手可能な状態を確定できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- ローカル：`yarn dev` 起動 + `yarn build` 成功 + Lint / Typecheck / Test 通過を確認できる
- Phase 0 のうちローカルで観測可能な範囲がすべて健全であることを確認し、PHASE0-010 (Retrospective Gate) に進める状態にできる

## なんのために
- Phase 0 完了 Definition of Done のうち**ローカルで完結する部分**を本 PBI で確定させ、main マージと本番系検証は PHASE0-010 (Retrospective Gate) に集約する（README.md §10.6 / site-plan §7 の方針）
- 関連: site-plan.md §7 Phase 0 完了条件 / Phase 0

## 受け入れ条件

### ローカル動作確認
- [ ] `yarn install` がエラーなく完了
- [ ] `yarn dev` 実行で Astro 開発サーバが起動し、`http://localhost:4321/` で最小ページが表示される
- [ ] `yarn build` がエラーなく成功し、`dist/` に静的 HTML が生成される
- [ ] `yarn preview` で `dist/` 内容がローカル HTTP で表示される
- [ ] `yarn check` (Biome) がエラーゼロ
- [ ] `yarn check:ts` (astro check) がエラーゼロ
- [ ] `yarn test:run` が成功（テストゼロでも exit 0、もしくはテスト 1 件以上で全 pass）

### preview デプロイ確認（PHASE0-008 と重複しない範囲）
- [ ] PHASE0-008 で接続済の Cloudflare Pages preview URL に最新コミットが反映されている（feat/phase-0 push 後の preview build が成功）

### Phase 0 完了確認（PHASE0-010 着手前提条件）
- [ ] PHASE0-001〜008 のすべてが Status: Done になっている
- [ ] INDEX.md がそれを反映している
- [ ] **次セッションが PHASE0-010（Retrospective Gate）に着手できる状態**

### 確認
- [ ] `feat/phase-0-pbi-009` sub-branch 上で実装し、完了時に `feat/phase-0` へ `git merge --no-ff` でマージされている（詳細：docs/pbi/README.md §10.4-10.5）

### スコープ外（PHASE0-010 で対応）
- main マージ、本番ビルド成功確認、本番 URL アクセス、Web Analytics 注入確認、R-14 ベースライン把握 → すべて **PHASE0-010 (Retrospective Gate)** で実施

## 技術メモ
- 本 PBI は **ローカル検証のみ**。新規ファイル作成や設定変更は他の PBI で完了している前提
- 失敗した場合は該当 PBI に差し戻して修正

## 備考

### 動作確認チェックリスト
1. ローカル：`yarn install` → `yarn dev` → ブラウザ確認 → Ctrl+C → `yarn build` → `yarn preview`
2. 検証：`yarn check && yarn check:ts && yarn test:run`
3. preview URL で動作確認（PHASE0-008 で接続済の Cloudflare Pages preview）

すべて pass で **PHASE0-010 (Retrospective Gate) に進める状態** → 次セッションで Gate に進む。

### 失敗時の典型パターン
- Tailwind v4 の CSS が読み込まれていない → `astro.config.mjs` の Vite plugin 設定確認
- shadcn の Button が未配置 → `npx shadcn@latest add button` 再実行
- Biome v2 の設定 schema 不整合 → `npx @biomejs/biome migrate --write` 再実行
- Yarn 4 の lockfile 不整合 → `yarn install --immutable` で確認、必要に応じ `yarn install` で再生成
- preview build 失敗 → Cloudflare Pages のビルドログで `YARN_VERSION` 環境変数 / corepack 設定 / Node version を確認（本番ビルド失敗の典型パターンと同じ）

## 実装ログ
（未着手）

# 運営者は Cloudflare Pages にプロジェクトを接続して preview デプロイができる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- Cloudflare Pages のプロジェクトとして本 GitHub repo を接続し、main 以外のブランチで **preview ビルド**が自動実行される
- ローカルで `yarn build` した結果と同等の静的サイトが Cloudflare の preview URL で確認できる
- 後続 PBI で `byte-lark.com` カスタムドメインを当てる準備ができている
- Cloudflare Web Analytics が有効化されている（Decision #18）

## なんのために
- Decision Log #17 / #18 に基づく Cloudflare Pages 採用方針を初期化時点で実体化するため
- Phase 1a 以降の実装を実環境で確認できる環境を確保するため
- 関連: site-plan.md §7 / Decision #17 #18 / Phase 0

## 受け入れ条件

### Cloudflare Pages 接続
- [ ] Cloudflare Pages に新規プロジェクト作成済み（プロジェクト名：`byte-lark`）
- [ ] GitHub repo `kazuya-tanimoto/byte-lark.com` が接続されている
- [ ] ビルド設定：
  - [ ] Build command: `yarn build`
  - [ ] Build output directory: `dist`
  - [ ] Node version: 20.x（PHASE0-002 の `.nvmrc` と一致）
  - [ ] **Yarn 4 (Berry) 対応の環境変数**：`YARN_VERSION=4.x` を Pages の Environment variables に設定（または `CF_PAGES_USE_COREPACK=1` で corepack 有効化）

### preview デプロイ
- [ ] feat/phase-0 ブランチへの push で **preview デプロイ URL** が発行される
- [ ] preview URL にアクセスして PHASE0-002 の最小ページが表示される

### Cloudflare Web Analytics
- [ ] Cloudflare Pages プロジェクト設定 → Web Analytics を有効化（無料、Cookieless）
- [ ] Astro 側の HTML に analytics スクリプトが自動注入されることを確認（Pages 統合の場合は不要、別途必要なら本 PBI スコープ外）

### Preview Branch Filter（必須、PBI sub-branch 運用に必要）
- [ ] CF Pages プロジェクト設定 → Branch deployments → Custom branches を選択：
  - [ ] **Include Preview branches**: `feat/phase-*`（Phase ブランチのみ preview 生成）
  - [ ] **Exclude Preview branches**: `feat/phase-*/pbi-*`（PBI sub-branch は preview しない、大量生成抑制）
- [ ] 詳細は docs/pbi/README.md §10.8 参照

### .gitignore 整備
- [ ] `.gitignore` に `.wrangler/`（Wrangler / CF Pages local emulation の作業ディレクトリ）を追加

### 確認
- [ ] `feat/phase-0/pbi-008` sub-branch 上で実装し、完了時に `feat/phase-0` へ `git merge --no-ff` でマージされている（詳細：docs/pbi/README.md §10.4-10.5）

### 本 PBI スコープ外（後続 PBI / 後続 Phase で対応）
- [ ] 本番（main）ブランチへのマージとビルド成功確認 → **PHASE0-010**（Retrospective Gate に集約）
- [ ] カスタムドメイン `byte-lark.com` の DNS / CNAME 設定 → Phase 1a 末で別途実施

## 技術メモ
- Cloudflare Pages 公式：https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- Astro デプロイガイド (Cloudflare)：https://docs.astro.build/en/guides/deploy/cloudflare/
- 必要な GitHub 連携権限の付与を Cloudflare 側で求められる
- 本 PBI は **運営者の Cloudflare ダッシュボード操作**が必要。Claude は手元で完結できない
- Yarn 4 (Berry) 対応：Cloudflare Pages のデフォルトビルダは Yarn 4 を自動認識しないことがある。`packageManager` フィールド + 環境変数 + corepack 有効化のいずれかで対応

## 備考

### 運営者操作チェックリスト
1. https://dash.cloudflare.com/?to=/:account/pages にログイン
2. 「Create a project」→「Connect to Git」で GitHub 連携
3. `byte-lark.com` repo を選択
4. プロジェクト名：`byte-lark`
5. ビルド設定入力（上記）
6. **Environment variables** に以下を追加：
   - `YARN_VERSION=4.x`（具体バージョンは package.json `packageManager` と一致）
   - 必要なら `CF_PAGES_USE_COREPACK=1`
7. デプロイ実行
8. preview URL を確認
9. プロジェクト Settings → Web Analytics を有効化（無料、Cookieless）

### 法人化後の検討事項
- 法人化後は Cloudflare アカウントを **法人名義**に変更するか、または個人名義のまま運用するか判断（site-plan.md §13 検討事項）
- 本 PBI は個人名義で開設、名義変更は別 PBI で対応

## 実装ログ
（未着手）

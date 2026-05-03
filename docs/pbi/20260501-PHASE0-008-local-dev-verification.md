# 運営者はローカルおよび本番ビルド成功を確認し、Phase 1a 着手可能な状態を確定できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- ローカル：`yarn dev` 起動 + `yarn build` 成功 + Lint / Typecheck / Test 通過を確認できる
- 本番：feat/phase-0 を main にマージし、Cloudflare Pages の本番ビルドが成功することを確認できる
- Phase 0 の最終ゲートとして、Phase 1a 着手可能な状態が整っていることが確認できる

## なんのために
- Phase 0 完了の Definition of Done を満たすため
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

### 本番デプロイ確認
- [ ] feat/phase-0 ブランチを main にマージ（マージ可能な状態 = コンフリクトなし）
- [ ] main へのマージで PHASE0-007 で接続した **Cloudflare Pages の本番ビルド**が自動実行される
- [ ] 本番 URL にアクセスして最小ページが表示される
- [ ] Cloudflare Web Analytics のスクリプト埋込が本番 HTML に存在することを確認（観測方法：DevTools の Network タブで `cloudflareinsights.com/beacon.min.js` が読込まれていること、または View Source で `<script ... data-cf-beacon=...>` の存在を確認。実データの反映は数時間かかる場合があるため、計測開始の確認は本 PBI スコープ外）

### R-14（フリープラン制限監視）の最初のチェック
- [ ] Cloudflare Pages ダッシュボードで本月のビルド回数・帯域使用量を一度確認し、ベースライン把握
- [ ] 月次レビューで使用量 80% 到達を監視する旨を運営者がメモ（site-plan.md §9 R-14）

### Phase 0 完了確認
- [ ] PHASE0-001〜007, 010 のすべてが Status: Done になっている
- [ ] INDEX.md がそれを反映している
- [ ] **次セッションが PHASE0-009（Retrospective Gate）に着手できる状態**

## 技術メモ
- 本 PBI は **検証 + デプロイ実行**。新規ファイル作成や設定変更は他の PBI で完了している前提
- 失敗した場合は該当 PBI に差し戻して修正

## 備考

### 動作確認チェックリスト
1. ローカル：`yarn install` → `yarn dev` → ブラウザ確認 → Ctrl+C → `yarn build` → `yarn preview`
2. 検証：`yarn check && yarn check:ts && yarn test:run`
3. PR 作成 or 直接マージ → Cloudflare Pages 本番ビルド成功確認
4. 本番 URL アクセス確認

すべて pass で **Phase 0 全体完了** → 次セッションで PHASE0-009 (Retrospective Gate) に進む。

### 失敗時の典型パターン
- Tailwind v4 の CSS が読み込まれていない → `astro.config.mjs` の Vite plugin 設定確認
- shadcn の Button が未配置 → `npx shadcn@latest add button` 再実行
- Biome v2 の設定 schema 不整合 → `npx @biomejs/biome migrate --write` 再実行
- Yarn 4 の lockfile 不整合 → `yarn install --immutable` で確認、必要に応じ `yarn install` で再生成
- Cloudflare Pages 本番ビルド失敗 → Pages ログで `YARN_VERSION` 環境変数 / corepack 設定 / Node version を確認

## 実装ログ
（未着手）

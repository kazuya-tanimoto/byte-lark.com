# 運営者は Cloudflare Workers で本番デプロイし、CI で品質ゲートを自動実行できる

Status: InProgress
Started: 2026-05-16

## 誰が
- 運営者

## 何をできる
- Cloudflare Pages から Workers へ移行し、公式推奨のインフラで本番デプロイできる
- GitHub Actions CI が Astro プロジェクト用に動作し、push 時に自動で品質チェックが走る

## なんのために
- Cloudflare 公式・Astro 公式ともに新規プロジェクトには Workers を推奨しており、将来の機能追加・サポートで有利なため
- Phase 1a で多数のページを実装する前に、品質ゲート（lint / 型チェック / テスト）を CI で自動化するため
- 関連: site-plan.md NFR-04 / Phase 1a 冒頭タスク / PHASE0-010 申し送り「CI workflow は Phase 1a 冒頭で整備」

## 受け入れ条件

### PHASE0-008 で完了済み（本 PBI 起票時に未反映だった）
- [x] CF Pages → Workers 移行（PHASE0-008 で実施済み、wrangler.jsonc・ダッシュボード設定済み）
- [x] `astro.config.mjs` の output が `static` のまま（Astro 6 デフォルト、adapter 不要）
- [x] main push で Workers への本番デプロイが自動実行される
- [x] 本番 URL でページ表示確認
- [x] CF Preview Branch Filter 確認（PHASE0-008 実装ログ: 現 UI にワイルドカード指定なし、Enabled のまま運用で実害なしと判断済み）

### 本 PBI で実施
- [x] `.github/workflows/quality.yml.disabled` → `quality.yml` にリネームし、Astro 用に書き換え（biome check / astro check / vitest）
- [x] `.github/workflows/ui-tests.yml.disabled` → `ui-tests.yml` にリネーム（Playwright テストは PHASE1A-019 で追加、ここではフレームだけ有効化）
- [x] CI が main / feat/* ブランチの push・PR で実行される
- [ ] `yarn build` が CI で成功
- [ ] `yarn check` / `yarn check:ts` が CI で成功
- [x] site-plan.md Decision #17 を「Cloudflare Workers」に更新
- [x] CLAUDE.md のデプロイ先記述を Workers 移行に合わせて更新（記述なし、README のみ更新）
- [x] Lefthook `pre-push` フックの Workers 移行後の互換性を確認（変更不要）
- [x] README.md の Installation セクションに `yarn lefthook install --force` の手順を追記
- [x] `scripts/migrate-frontmatter.ts` の雛形を作成（R-02 対応）

## 技術メモ
- 静的サイト（output: static）では `@astrojs/cloudflare` adapter は不要（Astro 公式 docs 2026-05-10 確認）
- Lefthook は `yarn install` 後に `yarn lefthook install --force` が必要（Yarn 4 は postinstall を無効化するため）

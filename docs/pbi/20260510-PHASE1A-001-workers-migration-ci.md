# 運営者は Cloudflare Workers で本番デプロイし、CI で品質ゲートを自動実行できる

Status: NotStarted

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
- [ ] CF Pages プロジェクト `byte-lark` を Workers に移行（CF ダッシュボードでの操作 + wrangler.jsonc 更新）
- [ ] `astro.config.mjs` の output が `static` のまま（adapter 不要を確認）
- [ ] main push で Workers への本番デプロイが自動実行される
- [ ] 本番 URL でページ表示確認
- [ ] `.github/workflows/quality.yml.disabled` → `quality.yml` にリネームし、Astro 用に書き換え（biome check / astro check / vitest）
- [ ] `.github/workflows/ui-tests.yml.disabled` → `ui-tests.yml` にリネーム（Playwright テストは PHASE1A-019 で追加、ここではフレームだけ有効化）
- [ ] CI が main / feat/* ブランチの push・PR で実行される
- [ ] CF Pages Preview Branch Filter を確認・設定（README §10.8: Phase ブランチのみ preview、PBI sub-branch は除外）
- [ ] `yarn build` が CI で成功
- [ ] `yarn check` / `yarn check:ts` が CI で成功
- [ ] site-plan.md Decision #17 を「Cloudflare Workers」に更新
- [ ] CLAUDE.md のデプロイ先記述を Workers 移行に合わせて更新
- [ ] Lefthook `pre-push` フックの Workers 移行後の互換性を確認・必要なら更新
- [ ] README.md の Installation セクションに `yarn lefthook install --force` の手順を追記（Yarn 4 は postinstall を無効化するため、PHASE0-010 申し送り反映）
- [ ] `scripts/migrate-frontmatter.ts` の雛形を作成（R-02 対応: frontmatter スキーマ変更時のマイグレーションスクリプト）

## 技術メモ
- 静的サイト（output: static）では `@astrojs/cloudflare` adapter は不要（Astro 公式 docs 2026-05-10 確認）
- 現在の `wrangler.jsonc` は `assets.directory: "./dist"` で静的アセット指定済み。Workers でもこの設定が使えるか公式 docs で確認すること
- CF Pages → Workers の移行手順は Cloudflare 公式 migration guide を参照
- Lefthook は `yarn install` 後に `yarn lefthook install --force` が必要（Yarn 4 は postinstall を無効化するため）

## 備考
- PHASE0-008 で Preview Branch Filter の UI が見つからなかった経緯あり。Workers 移行後に改めて確認

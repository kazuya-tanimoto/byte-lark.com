# Claude は Astro 用 lefthook と Phase 0 中の CI 一時無効化を整備できる

Status: NotStarted

依存：PHASE0-002（Astro scaffold で `package.json` scripts と `.astro` 拡張子の存在が前提）/ PHASE0-004（Biome v2 へのアップグレード後、その CLI を hook で叩く）両方の完了後に着手する。

## 誰が
- Claude

## 何をできる
- pre-commit hook（lefthook）を Astro 用にゼロから書き起こす
- Phase 0 中に fail し続ける旧 GitHub Actions ワークフローを一時無効化する
- dependabot.yml が Astro 系の依存を引き続き監視する

## なんのために
- 旧 lefthook.yml は EXAMPLE USAGE コメントのみで実コマンドゼロのため、ゼロから書き起こす
- 旧 quality.yml / ui-tests.yml は yarn check や Storybook 前提で、Phase 0 中は **必ず fail** するため、一時無効化して CI ノイズを止める
- Astro 用 CI 整備は Phase 1a 冒頭の専用 PBI で実施
- 関連: site-plan.md §6.7 / Phase 0

## 受け入れ条件

### lefthook をゼロから書き起こす
- [ ] `lefthook.yml` を以下方針で新規作成（既存はテンプレコメントのみのため、上書き）：
  - [ ] **pre-commit**：軽量チェックのみ。`npx biome check --no-errors-on-unmatched {staged_files}`（biome を直叩き、`yarn check` 経由だと PHASE0-002 想定 scripts の `biome check src` で path 固定され `{staged_files}` フィルタが効かないため）
  - [ ] **pre-push**：重いチェック。`yarn check:ts`（astro check）+ `yarn test:run`
- [ ] `lefthook install` で hook が `.git/hooks/` に展開される（postinstall で自動実行されるが、手動確認）
- [ ] dummy commit でテスト：staged ファイルに対して Biome が走り、エラーがあれば commit がブロックされる

### Phase 0 中の workflow 一時無効化
- [ ] `.github/workflows/quality.yml` を `.github/workflows/quality.yml.disabled` にリネーム（または `if: false` で全 job 停止）
- [ ] `.github/workflows/ui-tests.yml` を同様に無効化
- [ ] `.github/workflows/codeql.yml` は **そのまま維持**（言語自動検出で Astro 対応、影響なし）
- [ ] Phase 1a 冒頭で Astro 用 CI を新規作成する旨を本 PBI 備考に明記（次 Phase の PBI 起票時に反映）

### dependabot 確認
- [ ] `.github/dependabot.yml` を Read で確認
- [ ] npm ecosystem 設定があれば、Astro 系パッケージ（astro / @astrojs/* / tailwindcss / @tailwindcss/vite 等）も自動的に監視対象に入る
- [ ] 個別 group 設定があれば、Astro 系の group を追加するか判断（不要なら維持）

### 確認
- [ ] `feat/phase-0-pbi-007` sub-branch 上で実装し、完了時に `feat/phase-0` へ `git merge --no-ff` でマージされている（詳細：docs/pbi/README.md §10.4-10.5）
- [ ] `git status` で `.github/workflows/*.yml.disabled` が反映されている

## 技術メモ
- lefthook 公式：https://lefthook.dev/
- 既存 `lefthook.yml`：EXAMPLE USAGE コメントのみで実コマンドゼロ → ゼロから書き起こし
- pre-commit を軽量化する理由：`astro check` はプロジェクト全体の TS / Astro チェックで秒単位かかる。commit ごとの待ち時間を短縮し、開発体験を保つため pre-push に逃がす
- workflow 一時無効化方式：`.disabled` リネームが GitHub Actions 上で確実に止まる（拡張子 `.yml` 以外は読まれない）

## 備考

### 想定 lefthook.yml 構造

```yaml
pre-commit:
  parallel: true
  commands:
    biome:
      glob: "**/*.{ts,tsx,astro,js,jsx,json,md}"
      run: npx biome check --no-errors-on-unmatched {staged_files}

pre-push:
  parallel: false  # 順序を担保
  commands:
    typecheck:
      run: yarn check:ts
    vitest:
      run: yarn test:run
```

`yarn check` 経由ではなく biome を直叩きする理由：PHASE0-002 想定の `package.json` `"check": "biome check src"` は path 固定で、`yarn check {staged_files}` だと最終コマンドが `biome check src <files>` となり `{staged_files}` フィルタが事実上無効化される（`src/` 全体がチェック対象になる）。lefthook では biome CLI を直接呼ぶことで staged 限定を維持。`yarn check` は全体チェック用途で別途残す。

### Phase 1a で実施する CI 整備（参考、本 PBI スコープ外）

Phase 1a 冒頭で：
- `.github/workflows/ci.yml` 新規作成（push / PR トリガー、`yarn install / check / check:ts / test:run / build`）
- 必要なら `.github/workflows/e2e.yml`（Playwright）
- `.disabled` ファイルは削除

### dependabot 設定の現状確認手順
```bash
cat .github/dependabot.yml
# 既存の updates 配列に "package-ecosystem: npm" があれば、追加設定は基本不要
```

## 実装ログ
（未着手）

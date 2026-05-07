# 引継書 — PHASE0-004 続き + .vscode sandbox 制約の根本対処

作成日: 2026-05-07
作成元セッション: PHASE0-002 完遂後、PHASE0-004 に着手。biome.jsonc 修正まで進んだが `yarn install` の `.vscode` sandbox 制約で中断
受け取り先: 新セッション

---

## 1. やること（2 つ）

1. `.vscode` sandbox 制約の根本対処を決めて実施する
2. PHASE0-004 を完了させる

## 2. .vscode sandbox 制約の問題

### 何が起きるか

Claude Code の sandbox は、パスに `.vscode` を含むファイルへの書き込み・削除を一律ブロックする（Claude Code 本体に組み込まれた制約で、settings.json では変更不可）。

`@astrojs/sitemap` の依存パッケージ `stream-replace-string@2.0.0` が `.vscode/settings.json` を同梱しているため、以下の操作が sandbox 内で毎回失敗する：

- `yarn install`（node_modules への .vscode コピーでブロック）
- `git worktree remove`（node_modules 内の .vscode 削除でブロック）

### 影響範囲

PBI ごとに worktree を作る運用（README §10.4）で、**全 PBI で毎回**運営者ターミナルでの `yarn install` と `git worktree remove` が必要になる。Phase 1a 以降も続く。

### 原因の依存チェーン

```
@astrojs/sitemap@3.7.2
  └─ stream-replace-string@2.0.0
       └─ .vscode/settings.json（VS Code のエディタ設定、実行時不要）
```

- `stream-replace-string` は全バージョン（1.0.0〜2.0.0）で `.vscode/` を同梱
- `@astrojs/sitemap` の全公開バージョン（3.3.1〜3.7.2）が `stream-replace-string@^2.0.0` に依存
- `stream-replace-string` は `@astrojs/sitemap` 内の 2 ファイル（`write-sitemap-chunk.js`、`write-sitemap.js`）で import されている

### .vscode/settings.json の中身（実行に無関係）

```json
{
    "cSpell.words": ["papaper"],
    "javascript.format.semicolons": "remove",
    "javascript.format.insertSpaceAfterConstructor": true,
    "javascript.format.insertSpaceBeforeFunctionParenthesis": true
}
```

### 対処案

#### A: `yarn patch` で `.vscode` を除去（推奨）

Yarn 4 の `yarn patch` 機能で `stream-replace-string` パッケージから `.vscode/` を削除したパッチを作成し、`.yarn/patches/` に保存する。以後の `yarn install` ではパッチ適用済のパッケージが使われる。

```bash
yarn patch stream-replace-string@2.0.0
# 出力されたパッチ用ディレクトリから .vscode/ を削除
rm -rf <patch-dir>/.vscode
yarn patch-commit <patch-dir>
```

これで `package.json` の `resolutions` にパッチ参照が追加され、全環境で `.vscode` なしの `stream-replace-string` が install される。sandbox 内でも `yarn install` が通るようになる。

注意: `yarn patch` 自体が sandbox 内で動くか未検証。パッチディレクトリへの書き込みが `.vscode` パスを含まなければ動くはず。動かなければ運営者ターミナルで 1 回だけ実行。

#### B: `@astrojs/sitemap` を Phase 0 から外して後のフェーズに回す

sitemap integration を一旦削除し、PHASE0-008（Cloudflare Pages）や Phase 1a 以降の本番公開準備で再追加する。sitemap は検索エンジン向けで、Phase 0 の開発環境構築には必須ではない。

- 利点: sandbox 問題を即座に回避。sitemap が不要な開発フェーズで余計な制約を受けない
- 欠点: PHASE0-002 の受け入れ条件を事後変更する必要がある（Done 済 PBI の実装ログに事後追記）。再追加する PBI が必要
- 運営者の意向: A が駄目ならこの案を検討したい（2026-05-07 セッションで表明）

#### C: 現状維持（毎回運営者ターミナルで対応）

`yarn install` と `git worktree remove` を運営者ターミナルで実行する運用を継続。operation-manual.md に手順は記載済（Q6）。

- 利点: 変更なし
- 欠点: PBI ごとに毎回 2 回の手動介入

### 推奨の優先順位

1. A（`yarn patch`）を試す — 成功すれば全て解決、コスト最小
2. A が失敗 → B（sitemap を後回し）— 運営者も検討可と表明済
3. B も不都合 → C（毎回手動）— 最終手段

## 3. PHASE0-004 の現状

### worktree

- 場所: `.claude/worktrees/phase-0-pbi-004/`
- branch: `feat/phase-0-pbi-004`
- HEAD: worktree 作成時点の `feat/phase-0` HEAD（`f1ab712`）+ 未コミットの変更あり
- `yarn install` は運営者ターミナルで実施済

### 完了済

- `@biomejs/biome` v2.4.14 インストール済（PHASE0-002 内で実施）
- `biome.jsonc` を v2 スキーマにマイグレーション済（PHASE0-002 内で実施）
- Tailwind CSS 構文サポート有効化済（PHASE0-002 内で実施）
- PBI Status を InProgress に変更済（未コミット）
- INDEX.md を InProgress に同期済（未コミット）
- `biome.jsonc` から旧 ignore（`src/dev/**/*`、`src/stories/**/*`）を削除済（未コミット）
- `.astro` override セクション枠を追加済（未コミット）

### 未完了

- `yarn check` / `yarn fix` の動作確認（`yarn install` 済なので sandbox 内で実行可能）
- 受け入れ条件の全チェックボックスを埋める
- 実装ログを追記
- Done 化 + INDEX 同期 + コミット
- sub-branch を `feat/phase-0` に merge --no-ff + push + worktree 削除

### 受け入れ条件の照合（残り）

| 条件 | 状態 |
|---|---|
| `@biomejs/biome` v2 系最新 | 済（2.4.14） |
| `biome.jsonc` v2 スキーマ準拠 | 済 |
| 旧 ignore 削除 | 済（未コミット） |
| `.astro` override セクション枠 | 済（未コミット） |
| `yarn check` 成功 | 未確認 |
| `yarn fix` 成功 | 未確認 |
| 旧 v1 オプション残存なし | 済 |
| sub-branch + merge --no-ff | 未 |

## 4. 着手時の確認手順

```bash
cd /Users/kazuya/src/react-blog/.claude/worktrees/phase-0-pbi-004
git log --oneline -3
git status
```

## 5. 現在の .yarnrc.yml

```yaml
nodeLinker: node-modules
npmRegistryServer: "https://registry.npmjs.org"
yarnPath: .yarn/releases/yarn-4.14.1.cjs
```

`yarn patch` を実行すると `resolutions` が `package.json` に追加される。

## 6. sandbox 環境変数（セッションごとに PROXY_PORT が変わる）

```bash
export COREPACK_HOME="$TMPDIR/corepack"
export YARN_HTTP_PROXY="http://localhost:<PROXY_PORT>"
export YARN_HTTPS_PROXY="http://localhost:<PROXY_PORT>"
export YARN_GLOBAL_FOLDER="$TMPDIR/yarn-berry"
export ASTRO_TELEMETRY_DISABLED=1
export NODE_USE_ENV_PROXY=1
```

`env | grep -i HTTP_PROXY` で PROXY_PORT を取得。

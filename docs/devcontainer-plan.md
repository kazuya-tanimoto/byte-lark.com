# Claude Code devcontainer 導入計画

作成: 2026-07-17（検討セッションの決定事項・調査結果を固定化）
対応 PBI: [PHASE1B-016](pbi/20260717-PHASE1B-016-claude-devcontainer-setup.md)

本書は「どのセッションが読んでも同じように実行できる」ことを目的に、検討の経緯・調査済みの事実・設計方針・実施ステップをすべて記録する。実施セッションは本書を頭から読み、§6 のステップに従うこと。

---

## 1. 経緯と決定事項

### 1.1 悩み（起点）

macOS の Bash sandbox（Seatbelt）上で Claude Code を動かしていると：

- 実行できないコマンドが多い（`yarn add` / `yarn up` は DNS 解決失敗、E2E の Chromium は Mach port 拒否で起動不可、`docker` は非互換、`gh` は TLS/keychain 不可）
- 承認プロンプトが多く、放置自走（無人実行）ができない

### 1.2 過去に却下した案

「Claude 専用（壊れてもいい）PC でフル権限実行」案は 2026-06-28 に却下済み。隔離の境界が実 OS 自身になるため、実 OS・実認証情報がそのまま晒され、隔離として弱い。経緯の記録：

- `docs/article-interviews/building-this-blog-with-claude-code.md` の「深掘りE」（2026-06-28）
- 調査メモ（公式 docs 裏取り済み）: `/Users/kazuya/src/todo-next/docs/notes/claude-code-macos-sandbox.md`

公式の立場：`--dangerously-skip-permissions` を使うなら必ずコンテナ / VM の中で。bare の Bash sandbox は Bash しか縛らず（Read/Edit・MCP・hook は sandbox の外）、単体では完全無人実行の隔離にならない。

### 1.3 決定（2026-07-17）

1. **devcontainer 一本で対応する**。悩み（1.1）はコーディング・検証作業で起きるものなので、それらをコンテナへ引っ越せば全部解消する
2. **母艦の sandbox 緩和はやらない**。悩み解決に不要で、母艦の防御を薄くするだけ。将来母艦セッションで具体的に詰まったら、その 1 件だけ `settings.local.json` に足す
3. **作業の住み分け**：
   - コンテナ：コーディング・ビルド・テスト・E2E・push・放置自走
   - 母艦：ブラウザ絡みの運用作業（claude-in-chrome での CF ダッシュボード操作、claude.ai コネクタ MCP 等。これらはコンテナから使えない）

---

## 2. 調査済みの事実（2026-07-17 実測）

### 2.1 母艦環境

- Docker Desktop と OrbStack が両方インストール済み（`/usr/local/bin/docker` あり）。ランタイム追加は不要。**OrbStack 推奨**（常駐が軽い）
- devcontainer CLI（`@devcontainers/cli`、npm、latest 0.87.0）は未インストール → 初回セットアップで導入
- `code` CLI なし → VS Code は使わず、ターミナル完結のフローにする

### 2.2 公式 devcontainer 雛形（anthropics/claude-code リポジトリ `.devcontainer/`、3 ファイル）

- `devcontainer.json`：
  - `--cap-add=NET_ADMIN,NET_RAW`（firewall 用）
  - workspace を `/workspace` に bind mount
  - `~/.claude` 相当はコンテナ専用の名前付き volume（`claude-code-config-${devcontainerId}` → `/home/node/.claude`、`CLAUDE_CONFIG_DIR` で指定）。**ログイン状態はここに永続化され、初回 1 回のログインで済む**
  - `postStartCommand` で `init-firewall.sh` を root 実行
- `Dockerfile`：node:20 ベース。git / gh / iptables / ipset / zsh / git-delta 等 + `npm install -g @anthropic-ai/claude-code`。非 root ユーザー `node`
- `init-firewall.sh`：default-deny の iptables + ipset。許可は GitHub の IP 帯（api.github.com/meta から動的取得）+ registry.npmjs.org + api.anthropic.com + sentry.io + statsig + VS Code 系のみ。最後に「example.com に到達できないこと」「api.github.com に到達できること」を自己検証し、失敗なら起動失敗

### 2.3 この repo / CI

- `packageManager: yarn@4.14.1`（corepack で有効化）、astro ^6.4.6、@playwright/test ^1.59.1
- CI は Node 24（`ui-tests.yml` / `quality.yml` の `node-version: 24`）。E2E は `mcr.microsoft.com/playwright:v1.59.1-noble` コンテナで実行

### 2.4 母艦の `~/.claude` の構成（持ち込み設計の前提）

- `CLAUDE.md` / `settings.json` / `agents` は `~/dotfiles/claude/` への **symlink**（ディレクトリごと mount すると symlink が切れる → コピー方式が確実）
- 母艦 `settings.json` の hooks / statusline は母艦の絶対パス（`/Users/kazuya/.claude/...` 等）を参照 → **そのまま持ち込むとコンテナ内で壊れる**
- 記憶（memory）・履歴は `~/.claude/projects/<プロジェクトパス由来のキー>/` に保存 → コンテナ内はプロジェクトパスが変わる（`/workspace`）ため、共有してもそのままでは紐づかない
- 母艦 sandbox は既にかなり緩めてある（`gh` は excludedCommands 済み、レジストリ系ドメイン許可済み、`allowUnsandboxedCommands: false`）。それでも 1.1 の詰まりが残る、というのが現状（＝設定緩和の限界。devcontainer 方針の裏付け）

---

## 3. 設計方針（安全原則）

1. **持ち込みはコピー、書き戻しは禁止**。母艦 `~/.claude` をコンテナに書き込み可で mount しない。理由：コンテナ内の暴走が母艦の hooks / settings を書き換えられると、次に母艦で `claude` を起動した瞬間にそれが母艦側で実行される（権限昇格経路）。これを許すと隔離の意味が消える
2. グローバル CLAUDE.md は実体（`~/dotfiles/claude/CLAUDE.md`）を起動時にコピーして持ち込む
3. settings はコンテナ用の薄いものを新規作成（モデル・effort 等の方針のみ引き継ぐ。母艦のは持ち込まない — 2.4 の通り壊れるため）
4. ログインはコンテナ専用 volume に永続化（公式雛形の方式のまま。初回 1 回）
5. repo 単位の記憶（memory）は初期構成では共有しない。不便が出たら読み取り専用の持ち込みを検討（書き戻しは不可のまま）
6. push 認証は **fine-grained PAT**（この repo 限定・contents: read/write のみ・期限付き）。母艦の keychain / SSH 鍵はコンテナに入れない
7. firewall は default-deny を維持し、必要な通信先だけ追加する（§4）

---

## 4. 公式雛形からのカスタマイズ（この repo 向け差分）

- ベースイメージ：node:20 → **node:24**（CI と揃える）。※E2E 依存の入れやすさで `mcr.microsoft.com/playwright:v1.59.1-noble` ベースへの変更も可（同梱 Node のバージョンを実測して判断。§7 未決事項）
- `corepack enable`（yarn 4.14.1）
- TZ を Asia/Tokyo に
- Playwright：chromium + OS 依存パッケージを導入（`yarn playwright install --with-deps chromium` 相当）。**これによりコンテナ内で `yarn test:e2e` が回せる**（母艦 sandbox では不可能だったローカル E2E が可能になる）
- firewall 許可先の追加：
  - `registry.yarnpkg.com` / `repo.yarnpkg.com`（yarn 4）
  - `raw.githubusercontent.com`（GitHub meta の IP 帯に含まれるか実施時に確認、含まれなければ追加）
  - CF preview（`*.workers.dev`）：Cloudflare 配下のため**公式 IP レンジ（https://www.cloudflare.com/ips-v4）で追加**。init-firewall.sh はドメインを DNS 解決した IP を ipset に入れる方式で、CDN の IP 回転に弱いため、CF はレンジ許可が正
  - 必要に応じて plausible.io / docs 系（docs.astro.build 等）
- CLAUDE.md 持ち込み：`postCreateCommand` / `postStartCommand` で dotfiles の実体からコンテナ内 `CLAUDE_CONFIG_DIR` へコピー（mount しない — §3-1/2）
- コンテナ用 settings.json 新規作成（§3-3）
- 起動 wrapper：fish 関数 `ccbox`（仮称）を用意。`ccbox` = コンテナが無ければ `devcontainer up` → `devcontainer exec` で claude 起動、`ccbox --auto` = `--dangerously-skip-permissions` 付き（放置自走用）。定義ファイルは repo の `scripts/` に置き、導入手順で `~/.config/fish/functions/` へ配置

---

## 5. 日常の使い方（決定済み UX）

- 初回のみ：イメージビルド数分 + コンテナ内で claude ログイン 1 回
- 以後：`ccbox` 一発。コンテナを立ち上げたままなら待ちゼロ、停止からの再開でも数秒〜十数秒 + firewall 初期化数秒
- 前提：OrbStack（または Docker Desktop）が起動していること
- 放置自走：`ccbox --auto` でタスクを投げる。firewall の自己検証がパスしていることが前提
- ブラウザ絡みの運用作業は従来どおり母艦セッションで（§1.3-3）

---

## 6. 実施ステップ

セッションをまたいでよい。各ステップの完了条件を満たしてから次へ。

1. **運営者の事前準備**（Claude Code 外のターミナルで実施。sandbox 内では不可）
   - `npm install -g @devcontainers/cli`
   - OrbStack（または Docker Desktop）を起動
   - GitHub で fine-grained PAT を発行（対象: この repo のみ / 権限: Contents read+write / 有効期限を設定）
   - 完了条件：`devcontainer --version` が通る、`docker info` が通る、PAT が手元にある
2. **`.devcontainer/` 一式の作成**（Claude）
   - 公式雛形 3 ファイルを取得し、§4 の差分を適用して repo に追加
   - コンテナ用 settings.json、CLAUDE.md コピーの仕組み、`scripts/` の fish 関数も同時に作成
   - 完了条件：ファイル一式がレビュー可能な状態で提示され、運営者承認 → commit
3. **ビルドと起動確認**
   - `devcontainer up --workspace-folder .`（初回ビルド）
   - 完了条件：起動成功 + init-firewall.sh の自己検証ログ（example.com 遮断 / api.github.com 到達）を確認
4. **コンテナ内 Claude の初期化と基本動作確認**
   - claude ログイン（初回 1 回）、グローバル CLAUDE.md が反映されていることを確認
   - `yarn install` / `yarn build` / `yarn test:run` が通ること
   - **`yarn add`（適当な dev パッケージで試して即戻す等）が sandbox 起因の失敗なく通ること**（悩みの筆頭の解消確認）
   - 完了条件：上記すべて green
5. **コンテナ内 E2E**
   - `yarn test:e2e` が回ること（初のローカル E2E）
   - 完了条件：CI と同等の結果が出る
6. **push 経路の確認**
   - PAT を git 認証に設定（渡し方は §7 で確定）→ 運営者承認のうえ push → `bash scripts/ci-status.sh` で CI green
   - 完了条件：コンテナ発の push で CI green
7. **放置自走の試運転と運用ルールの文書化**
   - `--dangerously-skip-permissions` で小さいタスクを 1 件完走させる
   - CLAUDE.md / docs/operation-manual.md に追記：コンテナ/母艦の住み分け、起動手順（ccbox）、書き戻し禁止原則、PAT の扱い
   - 完了条件：試運転完走 + 文書追記の commit

---

## 7. 未決事項（実施セッションで一次情報を確認して確定）

- ベースイメージ：node:24 か `mcr.microsoft.com/playwright:v1.59.1-noble` か（後者の同梱 Node バージョンを実測してから判断）
- PAT の渡し方：`devcontainer.json` の `containerEnv`（localEnv 参照）/ コンテナ内 `gh auth login` / git credential store のどれにするか（PAT がイメージや repo に焼き込まれない方式を必須条件とする）
- raw.githubusercontent.com が GitHub meta の IP 帯に含まれるか
- MCP Playwright（スクショ確認用）をコンテナ内でも使うか、E2E スイートで代替するか

---

## 8. リスクと対処

- firewall が IP ベースで DNS 回転に弱い → GitHub は meta API から動的取得（雛形どおり）、Cloudflare は公式 IP レンジで許可。それ以外のドメイン追加時も同じ観点で確認
- bind mount した repo はコンテナから書き換え可能 → 意図どおり（作業対象）。git 管理下なので壊れても復旧可能。repo 以外の母艦ファイルは見えないことが境界
- PAT 漏洩 → repo 限定・最小権限・期限付きで被害範囲を限定。イメージ / commit に焼き込まない
- コンテナ内では claude-in-chrome・claude.ai コネクタ MCP・母艦の記憶が使えない → 住み分け（§1.3-3）で運用。記憶の共有は必要になってから RO で検討
- `--dangerously-skip-permissions` はコンテナ境界と firewall が正常なことが前提 → 起動時の firewall 自己検証が落ちたら自走させない

---

## 9. Sources（一次情報）

- 公式雛形: https://github.com/anthropics/claude-code/tree/main/.devcontainer （Dockerfile / devcontainer.json / init-firewall.sh、2026-07-17 取得）
- Claude Code sandboxing（公式）: https://code.claude.com/docs/en/sandboxing
- Choose a sandbox environment（公式）: https://code.claude.com/docs/en/sandbox-environments
- Anthropic engineering blog: https://www.anthropic.com/engineering/claude-code-sandboxing
- Cloudflare IP レンジ: https://www.cloudflare.com/ips-v4
- devcontainer CLI: https://www.npmjs.com/package/@devcontainers/cli （latest 0.87.0、2026-07-17 時点）
- 検討の前段メモ: `/Users/kazuya/src/todo-next/docs/notes/claude-code-macos-sandbox.md`（2026-06-28、別 repo）
- 専用 PC 案却下の記録: `docs/article-interviews/building-this-blog-with-claude-code.md` 深掘りE

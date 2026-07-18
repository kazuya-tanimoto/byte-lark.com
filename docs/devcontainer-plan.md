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

### 2.5 実施セッションでの追加実測（2026-07-18）

- `mcr.microsoft.com/playwright:v1.59.1-noble` の同梱 Node は **24**（microsoft/playwright v1.59.1 の Dockerfile.noble、`NODE_VERSION=24`）＝ CI と一致
- raw.githubusercontent.com は 185.199.108.0/22 で、GitHub meta の **web / api / git いずれにも含まれる**
- E2E スイート（a11y / blog / contact / navigation の 4 spec）に**スクリーンショット比較なし** → CI イメージと描画環境を完全一致させる必然性は低い
- Playwright のブラウザ取得ホストは `cdn.playwright.dev` / `playwright.download.prss.microsoft.com`（v1.59.1 の registry/index.ts 実測）
- repo は yarnPath 方式（`.yarn/releases/yarn-4.14.1.cjs` コミット済み）→ コンテナ内の yarn 本体取得は補助的で済む
- 母艦 repo の `node_modules` は macOS ARM ネイティブバイナリ入り（sharp / esbuild 等）→ **コンテナ（Linux）と bind mount 共用すると相互破壊** → named volume で分離が必要（§4）
- 母艦の devcontainer CLI は未導入（ステップ 1 未完）。docker socket は sandbox から権限拒否 → ビルド・起動系は運営者ターミナルで実行してもらう運用で確定

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

2026-07-18 実装済み。`.devcontainer/` の最終構成（各判断の根拠は §2.5 / §7）：

- `devcontainer.json`：公式ベース。VS Code 向け customizations は削除（ターミナル完結フロー）。TZ は Asia/Tokyo（localEnv:TZ 優先）。mounts は 5 本：
  - bash 履歴 / claude 設定の named volume（公式のまま。ログインは claude 設定 volume に永続化）
  - gh 設定の named volume（PAT ログインの永続化。§7）
  - **node_modules の named volume**：母艦の node_modules（macOS ARM バイナリ）とコンテナ（Linux）の相互破壊を防ぐ分離（§2.5）。yarn の install-state も `YARN_INSTALL_STATE_PATH` でコンテナ内へ退避し、母艦側の `.yarn/install-state.gz` を汚さない
  - `~/dotfiles/claude` の **read-only bind mount**（→ /mnt/host-claude。コピー元。RO なので書き戻し不可 — §3-1）
- `Dockerfile`：node:20 → **node:24**（CI と一致。§7）。`corepack enable`（yarn 4）。Playwright Chromium の **OS 依存パッケージのみ焼き込み**（`npx playwright@1.59.1 install-deps chromium`。ブラウザ本体は postCreate で repo の解決バージョンに追随）。`fix-perms.sh` 追加（node_modules volume の初回所有権修正）。node に許す sudo は init-firewall.sh + fix-perms.sh の**固定 2 本のみ**
- `init-firewall.sh`：公式ベース。repo 固有の許可先を **`allowed-domains.conf` に分離**（§6 ステップ 8 の型紙化対応：テンプレ本体は repo 間共通、conf だけ repo 側で編集）。VS Code 系 3 ドメイン削除（ターミナル完結）、**SSH(22) 全開放を削除**（push は HTTPS + PAT のみ、SSH 鍵は持ち込まないため公式より狭める）、ipset add は -exist 化（GitHub レンジと個別 IP の重複許容）
- `allowed-domains.conf`（repo 固有の許可先）：registry.yarnpkg.com / repo.yarnpkg.com / raw.githubusercontent.com / cdn.playwright.dev / playwright.download.prss.microsoft.com / docs.astro.build / developers.cloudflare.com / plausible.io + **Cloudflare 公式 IP レンジ**（`cidr-url https://www.cloudflare.com/ips-v4` 書式で起動時に動的取得。CF preview は IP 回転に弱いドメイン解決方式でなくレンジ許可が正）
- `claude-settings.json`：コンテナ用の薄い settings（model / effortLevel / permissions 方針のみ母艦から引き継ぎ。hooks・statusline・sandbox 節は持ち込まない — §3-3）。「無いときだけ」`CLAUDE_CONFIG_DIR` へ配置（コンテナ内での調整を上書きしない）
- `setup-container.sh`：postCreate = fix-perms → CLAUDE.md/settings 取り込み → git 設定（識別子 + `gh auth setup-git`）→ `yarn install` → `yarn playwright install chromium`（**firewall 適用前に走る**ため初回取得が通る）／ postStart = CLAUDE.md 再取り込み（毎起動最新化）+ gh credential helper 張り直しのみ
- 起動 wrapper：fish 関数 `ccbox`。`ccbox` = コンテナが無ければ `devcontainer up` → `devcontainer exec` で claude 起動、`ccbox --auto` = `--dangerously-skip-permissions` 付き（放置自走用）。定義は `~/dotfiles` の fish functions で管理（repo には置かない。§6 ステップ 8 の型紙化と一体。ステップ 3〜7 の間は `devcontainer up` / `exec` を直接叩く）

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
   - コンテナ用 settings.json、CLAUDE.md コピーの仕組みも同時に作成（ccbox は dotfiles 管理のため repo には置かない — §4。ステップ 8 で作成）
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
8. **dotfiles への型紙化（横展開の仕組み化。2026-07-17 運営者指示で追加）**
   - 完動した `.devcontainer/` 一式を `~/dotfiles/claude/devcontainer/` にテンプレとして格納。repo 固有の許可ドメインはテンプレ本体から分離し、repo 側の設定ファイル 1 個だけ編集すれば済む構造にする
   - fish 関数 `ccbox-init` を dotfiles に作成：任意の repo で実行すると `.devcontainer/` 一式を生成する。`ccbox` 本体も dotfiles の fish functions で管理
   - 目的：他 repo への展開を「react-blog から手でコピー」という手順依存にしない。新 repo は `ccbox-init` → 許可ドメイン編集 → `ccbox` の 3 手（+ PAT 発行のみ手動）で導入できる形に
   - 完了条件：別 repo（todo-next 等）で上記 3 手により起動できることを確認。dotfiles 側の commit は運営者承認のうえ実施

---

## 7. 未決事項の確定（2026-07-18、いずれも一次情報で確認 — §2.5 / §9）

- ベースイメージ：**node:24 を採用**。playwright:v1.59.1-noble の同梱 Node も 24 で CI とは揃う（§2.5）が、E2E にスクリーンショット比較がなく描画環境の完全一致は不要なため、公式雛形の構造（node ユーザー / sudoers / volume 設計）をほぼ無傷で保てる node:24 + OS 依存パッケージ焼き込みを採用
- PAT の渡し方：**コンテナ内 `gh auth login`（初回 1 回、PAT 貼り付け）を採用**。gh 設定用 named volume で永続化し、毎起動 `gh auth setup-git` で git credential helper を張り直す。PAT は母艦のディスク・環境変数・イメージ・repo のいずれにも残らない（必須条件を満たす）。containerEnv（localEnv 参照）案は母艦側に PAT を平文で常駐させるため不採用
- raw.githubusercontent.com：**GitHub meta の web / api / git に含まれる**（185.199.108.0/22）。ただし将来の帯変更に備え allowed-domains.conf にも明示追加（-exist 化により重複は無害）
- MCP Playwright：**コンテナには入れない**。スクショ確認は母艦セッションの担当（§1.3-3 の住み分けどおり）、コンテナ側の UI 検証は E2E スイートで行う

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
- Playwright noble イメージの Node バージョン: https://raw.githubusercontent.com/microsoft/playwright/v1.59.1/utils/docker/Dockerfile.noble （`NODE_VERSION=24`、2026-07-18 取得）
- Playwright ブラウザ取得ホスト: microsoft/playwright v1.59.1 `packages/playwright-core/src/server/registry/index.ts`
- GitHub meta（IP 帯の実測）: https://api.github.com/meta （raw.githubusercontent.com = 185.199.108.0/22 が web/api/git に含まれることを確認、2026-07-18）
- 検討の前段メモ: `/Users/kazuya/src/todo-next/docs/notes/claude-code-macos-sandbox.md`（2026-06-28、別 repo）
- 専用 PC 案却下の記録: `docs/article-interviews/building-this-blog-with-claude-code.md` 深掘りE

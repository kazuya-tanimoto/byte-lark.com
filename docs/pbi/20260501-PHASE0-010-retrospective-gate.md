# 運営者と Claude は Phase 0 完了状態を確認し、Phase 1a への学びを次セッションへ申し送ることができる

Status: Done
Started: 2026-05-08
Completed: 2026-05-09

## 誰が
- 運営者 + Claude

## 何をできる
- Phase 0 の全 PBI が Done になったことを確認できる
- Phase 0 で得た技術的知見・想定外・つまずきを集約し、Phase 1a PBI 起票時の参考資料として明文化できる
- Phase 1a 着手の前提条件（インフラ・ローカル動作・依存・規約）が整っていることを確認できる
- feat/phase-0 を main にマージし、Cloudflare Pages の本番ビルド成功 / 本番 URL 表示 / Web Analytics 注入を確認できる
- R-14（CF Pages フリープラン制限）のベースラインを把握できる
- 別セッションが本 Gate PBI を読むだけで、Phase 1a PBI を学びを反映してドラフトできる状態にする

## なんのために
- Phase 0 の学びが Phase 1a の PBI 設計に反映されないまま着手するリスクを排除するため
- 別セッション運用前提で、人（運営者）+ AI（Claude）両方が学びを引き継げる仕組みを担保するため
- 関連: site-plan.md §7（ロードマップの Retrospective Gate）/ Phase 0

## 受け入れ条件

### Phase 0 完了確認
- [x] PHASE0-001 〜 PHASE0-009 のすべてが Status: Done になっている
- [x] `docs/pbi/INDEX.md` の Phase 0 セクションがすべて `[Done]` 表示
- [x] feat/phase-0 ブランチで `yarn dev` / `yarn build` / `yarn check` / `yarn check:ts` がすべて成功する状態

### 学びの集約（本 PBI 内に書き出す）
- [x] 本 PBI の `## Phase 1a への申し送り` セクションに以下を記入：
  - [x] **確定した技術前提**：実際に動いた構成（Astro バージョン、Tailwind 統合方法、shadcn セットアップ手順、Yarn linker 設定 等）
  - [x] **発生した想定外と回避策**：Phase 0 の各 PBI 実装ログから抽出
  - [x] **計画書（現行バージョン） と実態の差分**：あれば（site-plan.md / 各 PBI の記述で間違っていた点）
  - [x] **Phase 1a 起票時の注意**：Phase 1a PBI のどこに修正が必要か / そのままで OK か
  - [x] **Phase 1a で先に決めるべき事項**：Phase 0 中に発覚した未決事項（仮 HEX 候補、コードハイライト候補等を Phase 1a 冒頭で確定する旨）

### CLAUDE.md / site-plan.md の整合確認
- [x] CLAUDE.md（PHASE0-005 で書き換え済）の記述と Phase 0 の実態に齟齬がないか確認、齟齬あれば本 PBI 内で記録（修正は別 PBI で対応可）
  - 齟齬：`yarn new-post` が未実装なのに Build & Test Commands に載っていた → 本 Gate で削除済み
- [x] site-plan.md と Phase 0 実装結果に大きな差分があれば、本 PBI 内で記録
  - 差分 2 件を本 Gate で修正（v3.7 → v3.8）：§6.4 `tailwind.config.ts` 削除、Decision #21 更新

### マージ
- [x] feat/phase-0 ブランチを main にマージする（merge commit 維持で履歴を残す）：`6a38240 Merge Phase 0: project initialization`
- [x] feat/phase-0 は remote に保持（PBI 単位の checkout 用、削除しない）
- [x] 詳細手順は docs/pbi/README.md §10.6 参照

### 本番デプロイ確認（main マージ後）
- [x] main へのマージで CF Pages の本番ビルドが自動実行された（Version ID: 26d7cc87、デプロイ成功）
- [x] 本番 URL（`byte-lark.tanimoto-a49.workers.dev`）にアクセスしてページ表示確認済み
- [x] Web Analytics：静的アセットのみの Worker では Metrics 利用不可、`pages.dev` ドメインでは自動注入不可。カスタムドメイン追加後に有効化する旨を申し送りに記録済み

### R-14（フリープラン制限監視）の最初のチェック
- [x] CF ダッシュボード Metrics タブ確認：「Metrics is unavailable for Workers with only static assets. Requests for this kind of Worker are served at no charge.」— 静的アセットのみのため課金なし、帯域監視は実質不要
- [x] 月次レビューで使用量 80% 到達を監視する旨を運営者がメモ（site-plan.md §9 R-14）— 静的 Worker は無課金のため実質的に制限なし

### 完了処理
- [x] 本 PBI の Status を Done に更新、INDEX.md 同期

### 次セッションへのトリガー
- [x] 本 PBI が Done になった時点で、次セッションは「Phase 1a PBI 起票」を最初のタスクとして実行可能
- [x] CLAUDE.md の「How to draft next-Phase PBIs」プロトコルが本 Gate を読むよう誘導していることを確認
  - CLAUDE.md L56: `Read the Gate PBI's "次 Phase への申し送り" section` ✓

## 技術メモ
- 本 PBI は **コード変更を伴わない**（学びの集約と確認のみ）
- Phase 0 の各 PBI 実装ログを横串で読む作業：以下で grep 可能
  ```bash
  grep -l "実装ログ" docs/pbi/20260501-PHASE0-*.md
  ```
- 「Phase 1a への申し送り」セクションは構造化して書く：次セッションが機械的に拾える形に

## 備考

### Gate 通過の判断基準

すべての受け入れ条件を満たし、かつ運営者が「Phase 1a に進んで OK」と明示的に承認した時点で Done。

### 申し送り種（Phase 0 完了時に Phase 1a 申し送りへ反映すること）

事前に判明している論点を、Phase 0 完了時の retrospective で必ず再評価し、上の `## Phase 1a への申し送り` 各サブセクションに記入する。

- **インフラ（CF Pages vs Workers）の再評価**：Astro 公式 deploy guide が `Cloudflare recommends using Cloudflare Workers for new projects` と明記（2026-05-07 audit 確認）。Cloudflare Pages は依然 supported で deprecated ではないが、new projects 推奨は Workers。Decision Log #17（site-plan.md）は Pages 維持で確定済、Phase 0 では PHASE0-008 で Pages を実装する方針。Phase 1a 起票時に「Pages 継続のまま Phase 1a 進行」か「Workers 切替を別 PBI 化」を運営者と再確認する。判断材料：（a）静的中心ブログでは技術差は拮抗、（b）切替は `@astrojs/cloudflare` adapter + wrangler.jsonc 構成への書換が必要、（c）Pages の機能更新ペースは Workers より遅い傾向。

- **Web Analytics の有効化**：PHASE0-008 実装時（2026-05-08）に判明。Pages プロジェクトの Metrics タブは static-only Worker では利用不可、アカウントレベルの Web Analytics は `pages.dev` ドメインでは自動注入不可。`byte-lark.com` カスタムドメインを Cloudflare に追加した後であれば自動注入が有効になる。Phase 1a のカスタムドメイン PBI に Web Analytics 有効化を含めること。

### 次 Phase（1a）の PBI 起票プロトコル（CLAUDE.md からの参照先）

別セッションが Phase 1a PBI 起票を行う際の手順：

1. 本 Gate PBI の `## Phase 1a への申し送り` を読む（5 サブセクションすべて）
2. Phase 0 各 PBI の `## 実装ログ` を読み、申し送りに含まれていない学びを補完。**抽出対象**：
   - 各 PBI の `### YYYY-MM-DD セッション N` の **「想定外だった点」** 項（必ず拾う）
   - 各 PBI の **「学び・つまずき」** 項（Phase 1a に影響しそうなもの）
   - 各 PBI の **「残タスク」** 項（Phase 0 中に解消されず Phase 1a 持ち越しになったもの）
3. site-plan.md 最新版を読む
4. Phase 1a 用 PBI をドラフト（FR-01〜21, 22-27 等を分解）
5. INDEX.md に追加（Status: NotStarted）
6. 起票完了 → 別セッションでレビュー → 必要ならブラッシュアップ → さらに別セッションで実装

## Phase 1a への申し送り

### 確定した技術前提

Phase 0 で実際に動いた構成：

- Astro 6.3.1（`astro.config.mjs`、output: static）
- Tailwind CSS v4（`@tailwindcss/vite` プラグイン経由、`tailwind.config.ts` 不使用、CSS ベース設定）
- shadcn/ui 4.x（Radix ライブラリ + Nova preset、旧 style/baseColor 概念は廃止）
- TypeScript strict（`tsconfig.json` extends `astro/tsconfigs/strict`、`@/*` パスエイリアス設定済み）
- Yarn 4.14.1（Berry、`.yarn/releases/yarn-4.14.1.cjs` 直配置 + `.yarnrc.yml` に `yarnPath`）
- Biome v2.4.14（`biome.jsonc`、v2 スキーマ移行済み、`.astro` は experimental サポート）
- Node.js 24（`.nvmrc`、Active LTS）
- Vitest 4.1.5 + Playwright 1.59.1（設定済み、テストファイルは Phase 1a で作成）
- Lefthook（pre-commit: biome check、pre-push: astro check + vitest）
- Cloudflare Pages（プロジェクト `byte-lark`、GitHub 連携済み、main = production branch）
- `wrangler.jsonc`（`assets.directory: "./dist"` で静的アセット指定）
- `stream-replace-string` パッケージに yarn patch 適用済み（`.vscode/` 同梱による sandbox ブロック回避）

### 発生した想定外と回避策

- **create-astro CLI が既存 repo 後付けに非対応**（PHASE0-002）→ Astro Manual Setup で対応。Phase 1a の PBI で CLI 依存の手順を書かないこと
- **shadcn 4.x で style/baseColor 概念が廃止**（PHASE0-002）→ Radix + Nova preset で初期化。Phase 1b のデザイン調整時は preset の再設定ではなく CSS 変数で調整する形になる
- **Tailwind v4 は `tailwind.config.ts` 不使用**（PHASE0-002）→ テーマトークンは `src/styles/global.css` 内の CSS で定義する。Phase 1a の仮 HEX 確定もここに書く
- **CF Pages UI が Workers & Pages 統合で変更**（PHASE0-008）→ 旧「Build output directory」欄は廃止、`wrangler.jsonc` で指定する方式に変更
- **CF Pages Preview Branch Filter の UI 不一致**（PHASE0-008）→ 実装時に Custom branches UI が見つからず「Builds for non-production branches: Enabled」のまま運用。ただし CF 公式ドキュメント（2026-05-08 確認）では Custom branches + ワイルドカードは依然サポート記載あり。Phase 1a でブランチが増える前に運営者が CF ダッシュボードで再確認すること
- **Web Analytics が `pages.dev` ドメインでは自動注入不可**（PHASE0-008）→ カスタムドメイン（`byte-lark.com`）を Cloudflare に追加した後に設定すれば自動注入が有効になる。Phase 1a のカスタムドメイン PBI に含めること
- **Claude Code sandbox でのポート listen 制限**（PHASE0-009）→ `yarn dev` / `yarn preview` は運営者の手動確認で代替。Phase 1a の E2E テスト PBI では、Playwright を sandbox 外で実行する前提を明記すること
- **`yarn up` / `yarn add` が sandbox の DNS 制約で失敗**（複数 PBI）→ レジストリアクセスが必要なコマンドは運営者の別ターミナルで実行。CLAUDE.md の Sandbox 制約セクションに記載済み
- **sandbox の `.git` 書き込みブロック**（PHASE0-001 等）→ worktree 内での git 操作は ExitWorktree 後に `-C` オプションで実行。CLAUDE.md に記載済み
- **`stream-replace-string` パッケージの `.vscode/` 同梱**（PHASE0-004）→ yarn patch で除去。`package.json` の `resolutions` に patch 設定あり

### 計画書（現行バージョン） と実態の差分

本 Gate PBI 内で修正済みの差分（v3.7 → v3.8）：

- §6.4 ディレクトリ構成の `tailwind.config.ts` 行を削除（Tailwind v4 では不使用）
- Decision #21 を shadcn 4.x の preset 体系に更新

残存する軽微な差分（修正不要 or Phase 1a で自然解消）：

- §6.4 の `src/content/config.ts` — Phase 1a の Content Collections 実装時に作成されるため現時点で未存在は正常
- §6.4 の各ページファイル（`about.astro` 等）— Phase 1a で作成予定、現時点は `index.astro` のみ
- CLAUDE.md の `yarn new-post` — 本 Gate で削除済み（Phase 1a の FR-25 で作成後に再追記する）

### Phase 1a 起票時の注意

- **Pages vs Workers の再評価**：Astro 公式 deploy guide が「Cloudflare recommends using Cloudflare Workers for new projects」と明記（2026-05-07 確認）。Decision #17 は Pages 維持で確定済みだが、Phase 1a 起票時に運営者と「Pages 継続」か「Workers 切替を別 PBI 化」か再確認する。判断材料：(a) 静的中心ブログでは技術差は拮抗、(b) 切替は `@astrojs/cloudflare` adapter + wrangler.jsonc 構成書換が必要、(c) Pages の機能更新ペースは Workers より遅い傾向
- **CI workflow は Phase 1a 冒頭で整備**：`.github/workflows/quality.yml` / `ui-tests.yml` は `.disabled` リネームで無効化中。Phase 1a の最初の PBI で Astro 用に書き換えて有効化する
- **カスタムドメイン PBI に Web Analytics 有効化を含める**：`byte-lark.com` をドメインとして Cloudflare に追加した後に Web Analytics 自動注入が有効になる
- **CF Pages の Preview Branch Filter を再確認**：PHASE0-008 で UI 上の設定が見つからなかったが、公式 docs では Custom branches + ワイルドカードがサポートされている。ブランチが増える Phase 1a 序盤で運営者が確認し、README §10.8 の設定を適用すること
- **Lefthook の postinstall**：Yarn 4 は postinstall を無効化するため、`yarn install` 後に `yarn lefthook install --force` が必要。Phase 1a で新しい開発者がセットアップする手順に含めること（README に記載推奨）

### Phase 1a で先に決めるべき事項

- **仮 HEX カラーの確定**：site-plan §6.5.2 で定義した Hibari brand の各色ロールに対して、Phase 1a 冒頭で仮 HEX を決めて `src/styles/global.css` の CSS 変数として定義する（Phase 1b で確定 HEX に置換）
- **コードハイライトライブラリの選定**（Q13）：Shiki / Prism / Expressive Code から選定。Astro は Shiki をビルトインサポートしているため Shiki が有力
- **画像最適化方針の確定**（FR-27）：Astro `<Image>` / `<Picture>` の WebP 変換 + サイズ生成の具体方針
- **Content Collections の Zod スキーマ設計**：site-plan §6.3 のフロントマターモデルを `src/content/config.ts` に落とし込む

## 実装ログ

### 2026-05-07 着手前 audit（実装セッション外）
- Handoff `docs/handoff/2026-05-06-01-phase0-pbi-audit.md` に従い、PBI 本文の empirical claim を一次情報で照合。
- 確認：`docs/pbi/README.md` §10.6（Phase 完了時の main マージ手順）の参照位置が現 v2.8 でも有効 ✓ / `site-plan.md` §7 ロードマップ・Retrospective Gate 表記実在 ✓ / `## Phase 1a への申し送り` セクションテンプレ・grep コマンド例の妥当性 ✓
- 結果：**drift なし**（着手時の二度手間を防ぐため記録）。
- 補足：本 PBI は CLAUDE.md の「How to draft next-Phase PBIs」セクションが PHASE0-005 で書き込まれている前提で受け入れ条件を立てる。本 audit セッションでは CLAUDE.md は slim 暫定版のままだが、PHASE0-010 着手時には PHASE0-005（先行）が完了している前提のため、依存順序的に問題なし。

### 2026-05-07 audit 続編（Handoff 03）
- 「## 備考 / 申し送り種」セクションを新設、Astro 公式 docs（2026-05-07 取得）の `Cloudflare recommends using Cloudflare Workers for new projects` を根拠に、Phase 0 完了時の Pages vs Workers 再評価論点を明文化。
- Decision Log #17 は Pages 維持で確定済、Phase 0 は Pages のまま完走、再評価は Phase 1a 起票時に運営者と実施。
- 包括 cross-check（7 軸 × 8 doc）実施：(a) library version / (b) PBI ID / (c) §N / (d) ファイルパス / (e) 最終更新日付 / (f) Phase ラベル / (g) URL。**drift 0 件**（PHASE0-002 title の `Astro 5` 残存・README.md の旧 repo URL・biome.jsonc schema 1.5.3 はそれぞれ worktree 改訂・PHASE0-006 全文置換・PHASE0-004 migrate で解消予定の既知箇所のため対象外、`docs/writing-workflow.md` 未実在は Phase 1a 冒頭で作成予定の意図的な未来 reference）。

### 2026-05-08〜09 実装セッション

#### やったこと
- Phase 0 完了確認（全 PBI Done、ビルド・lint・型チェック成功）
- PHASE0-001〜009 の全実装ログを横串で読み、Phase 1a への申し送り 5 セクションを記入
- CLAUDE.md / site-plan.md の整合確認、齟齬 2 件を修正：
  - CLAUDE.md: 未実装の `yarn new-post` を Build & Test Commands から削除
  - site-plan.md v3.7 → v3.8: §6.4 `tailwind.config.ts` 削除（Tailwind v4 不使用）、Decision #21 を shadcn 4.x preset 体系に更新
- feat/phase-0 を main にマージ（`6a38240 Merge Phase 0: project initialization`、`--no-ff`）、push 完了
- CF Pages 本番デプロイ確認（Version ID: 26d7cc87、本番 URL 表示確認）
- R-14 ベースライン確認（静的 Worker は課金なし）

#### 想定外だった点
- main への merge 時に `.claude/settings.json`（未コミット変更あり）と `.claude/settings.local.json`（untracked）が衝突し、マージがブロックされた。Claude Code 内で checkout / stash / merge を試みたが、ワーキングツリーを散らかして事態を悪化させた。最終的に運営者ターミナルで `git checkout --` / `rm` / `git merge` を実行して解消
- Bash サンドボックスが `.claude/settings.*` への書き込みを制限していることは `touch` コマンドで確認済み。ただし、マージ失敗の原因がサンドボックスなのか git ワークフロー上の問題（dirty working tree / untracked file conflict）なのかは切り分けできていない
- CF Pages の Metrics タブは「static assets のみの Worker」では利用不可。ただしリクエスト課金もないため、R-14 のフリープラン監視は実質不要と判明

#### 学び
- Edit/Write ツールは Bash サンドボックスを経由しない（公式 docs: code.claude.com/docs/en/sandboxing）。サンドボックスが Bash をブロックする場合でも Edit/Write で対処できる場合がある

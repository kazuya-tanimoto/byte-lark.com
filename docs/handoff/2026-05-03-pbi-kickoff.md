# 引継ぎドキュメント — PHASE0 着手前の整理

作成日: 2026-05-03
作成元セッション: PHASE0-001 着手しようとして PBI と §10 ブランチ運用の不整合に詰まり、監査・整理を実施
受け取り先: 新セッション（kickoff prompt は本ファイルパスを指定して読ませる）

---

## §1 元の運営者指示（再掲）

> ちょっと指示もとのセッションがコンテキスト圧迫してグズグズになって色々壊しそうなので仕切り直したいです。
> そちらのセッションはもう止めます。
> 今の状態をすべて参照して、このPJの方針や問題点をすべて洗い出してもらえますか？
> 改善しないといけないところをピックしてきっちり方針として定めたいです

## §2 最初に詰まった点と解消状況

| # | 詰まった点 | 現状 |
|---|---|---|
| Q1 | PHASE0-001 PBI 本文「feat/rebuild-astro 上での作業」 vs README §10「feat/phase-0」 | 解消（並行セッションが PBI を `feat/phase-0` にリネーム書換中、uncommitted） |
| Q2 | PBI 本文「1 コミット」 vs §10「sub-branch 必須」 | 解消（運営者判断「§10 を Phase 0 から適用」確定。PBI 文言修正は残作業） |
| Q3 | 未コミット src/ 配下 .tsx ドラフト 6 件の扱い | 解消（並行セッションが破棄、PHASE0-001 削除対象だったので結果オーライ） |

## §3 必読ドキュメント（読む順）

1. `docs/site-plan.md`（v3.7、全体方針）
2. `docs/pbi/INDEX.md`（PBI 状態一覧）
3. `docs/pbi/README.md`（PBI フォーマット v2.3 + §10 ブランチ運用）
4. `docs/operation-manual.md`（運営者向け）
5. `CLAUDE.md`（暫定ヘッダー、PHASE0-005 で全面書換予定）
6. `docs/pbi/2026*PHASE0-*.md`（PBI 10 件）

## §4 検証済みリポジトリ実態

- branch：**`feat/phase-0`**（初期 gitStatus snapshot は古い、信用しない）
- main から 10 commits ahead（全 docs 系）
- uncommitted：**11 件**（10 PBI + site-plan.md、内容は branch 名リネームのみ。中身確認済みで安全）
- untracked：なし
- archive ブランチ健全
- ツーリング：lefthook.yml は EXAMPLE のみ、biome v1.5.3、playwright config は baseURL/webServer commented out、`.gitignore` に `.astro/` `.wrangler/` 無し
- node_modules（720MB）/ dist（848KB）/ storybook-static（8.1MB）残存

## §5 監査で派生して見つかった課題

| ID | 内容 | 推奨対処 |
|---|---|---|
| B1 | PHASE0-008 と PHASE0-009 が両方 main マージを Done 条件にしている | §7 B 判断後に確定 |
| B2 | 全 10 PBI の「1 コミット」記述が §10.4 sub-branch 必須と矛盾 | sub-branch 適用済確定 → 全 PBI の「feat/phase-0 上で 1 コミット」を「`feat/phase-0/pbi-NNN` sub-branch + `merge --no-ff`」に書換 |
| B3 | PHASE0-006 が PHASE0-002 / PHASE0-004 への依存を宣言していない | 「依存：PHASE0-002 / PHASE0-004 完了後」を冒頭明記 |
| B4 | operation-manual.md が site-plan §6.7 既存資産取扱表に未記載 | §6.7 に 1 行追加 |
| C1 | PHASE0-001 L31「(node_modules/ も削除推奨：…)」checkbox に「推奨」混入 | 「削除する」と断言形式 |
| C2 | PHASE0-002 L47「旧 React Router 前提の URL があれば修正」観測不能 | baseURL `http://localhost:4321`、webServer.command を `yarn dev` または `yarn preview` と具体化 |
| C3 | PHASE0-002 L22 `--git false` フラグ名が Astro CLI の `--no-git` と異なる可能性 | `npx create-astro@latest --help` で確認後修正 |
| C4 | PHASE0-004 が biome.jsonc の旧 ignore (`src/dev/**`, `src/stories/**`) 整理に言及なし | 受け入れ条件に「旧 ignore を削除」追加 |
| C5 | PHASE0-005 で旧 NOTE ヘッダー（2026-05-02）削除が暗黙 | 「旧 NOTE ヘッダー削除」を受け入れ条件追加 |
| C6 | PHASE0-005、PHASE0-010 技術メモに絶対パス `/Users/kazuya/...` 残存 | repo-relative に修正 |
| C7 | PHASE0-006 lefthook 想定 `yarn check {staged_files}` が PHASE0-002 scripts と整合せず staged filter 無効化 | lefthook で `npx biome check --no-errors-on-unmatched {staged_files}` 直接実行（biome 直叩き）、`yarn check` は path 固定で全体チェック用に維持 |
| C8 | PHASE0-009 受け入れ条件 L30/L93 が「計画書 v3.7」hardcode | 「計画書（現行バージョン）」へ |
| D1 | PHASE0-001 削除対象 checkbox に `.storybook/`、`dist/`、`storybook-static/` が無い | checkbox 追加 |
| D2 | `.junie/`、`.aiignore`、`.env.example` が削除/残置どちらにも未記載 | §7 D 判断後に確定 |
| D3 | `.gitignore` に `.astro/`（PHASE0-002）、`.wrangler/`（PHASE0-007）追加が必要 | 各 PBI 受け入れ条件に追加 |
| D4 | INDEX.md「最終更新: 2026-05-02」だが改訂履歴は 2026-05-03 まで | header 日付更新 |
| D5 | PHASE0-007 で CF Pages プロジェクト名「`byte-lark` 等」と曖昧 | 名称固定 |
| E1 | PHASE0-001（package.json 削除）と PHASE0-002（再生成）の間に CodeQL workflow が weekly cron で発火すると失敗 | 認識のみ。Phase 0 中は main へ push しない、PHASE0-006 を早期完了 |
| E2 | node_modules 削除中、pre-commit shim が `Can't find lefthook in PATH` を吐くが exit 0 で commit は通る | 認識のみ |

## §6 確定済み方針（運営者承認済）

- §10 sub-branch 戦略を Phase 0 から適用
- CF Web Analytics beacon は **CF Pages 統合で自動注入される**（公式ドキュメントで裏取り済み、PHASE0-007/008 はそのままで OK。私が当初「自動注入されない」と誤主張したが訂正済）
- 明らかな誤り（C1〜C8、D3〜D5）は個別判断を仰がず修正可

## §7 未解決判断

### B：main マージのタイミングと所有 PBI

運営者の問い「**そもそも main にマージするタイミングはいつなの？**」への回答：

- README §10.6 の本意：「Retrospective Gate PBI（PHASE0-009 等）の受け入れ条件として実施」
- つまり **Phase 0 全 PBI 完了 → Gate (PHASE0-009) の中で main マージ**が計画書の本来意図
- ところが PHASE0-008 にも「main マージ」「本番ビルド成功確認」が Done 条件として書かれている（重複）

選択肢：
- **(B-1) Gate (PHASE0-009) に集約**（推奨、計画書本意通り）。PHASE0-008 は「ローカル + preview」に純化
- (B-2) PHASE0-008 で本番まで完了させ、Gate は申し送りのみ

新セッションは運営者に B-1 / B-2 を確認すること。

### D：`.junie/`、`.aiignore`、`.env.example` の扱い

中身確認済：

- `.junie/guidelines.md`（109 行）：旧 Vite/React/Chakra/Storybook 前提のドキュメント（atomic design / yarn sb 等を記載）→ **完全に陳腐化**
- `.aiignore`：AI tool 用 secrets ignore 設定（汎用、stack 非依存）→ **そのまま使える**
- `.env.example`：Chromatic project token のコメントのみ（Storybook 撤去で不要）→ **役目終了**

推奨：
- `.junie/guidelines.md`：**削除**（旧スタック前提で誤誘導）。JetBrains AI を引き続き使うなら新スタック前提で書き直す別 PBI を起票
- `.aiignore`：**残置**
- `.env.example`：**削除**（Chromatic 不要）。将来 .env が必要になったら再作成

新セッションは上記推奨で進めて OK か運営者に確認。

## §8 注意喚起（前セッションの失敗と教訓）

- 初期 `gitStatus` snapshot は session 開始時点で既に古い場合あり → `git status` 直接実行で必ず再確認
- CF Pages の beacon 自動注入仕様について、最初「自動注入されない」と裏取りなしで誤主張して hooks に指摘された → 事実主張は必ず WebFetch / Read / Bash で裏取りしてから書く
- Subagent の出力に誤認あり（`feat/phase-0` 既に存在等）→ 直接ツールで裏取りする
- 報告構造が「いきなり判断要求」になり運営者から修正指示あり → 状況報告 → 提案 → 判断仰ぎ の順を徹底
- ユーザーは長文を嫌うので簡潔に

## §9 次セッションの最初の手順

**重要**：各 commit / push / branch 作成 / ファイル削除など、リポジトリ状態を変える action は**実行前に必ず運営者に内容と意図を提示して承認を取る**。「§9 にこう書いてある」だけで自動実行しない。

1. 本ドキュメントを通読
2. §3 の SoT ドキュメントを Read（順序通り）
3. §4 の実態を `git status` / `git branch --show-current` / `ls` で再確認（snapshot 信用しない）
4. uncommitted 差分があれば、**まず運営者に「この差分が手元にあります、commit して良いですか／破棄しますか／別ブランチに退避しますか」を確認**してから動く。本ドキュメント作成時点では 11 件あったが既に commit `b47925f` に収まっている可能性あり、必ず再確認
5. §7 B / D を運営者に確認
6. 判断確定後、§5 の B〜D 系課題の修正を実施。**chore commit 前に `git status` / `git diff --staged` を運営者に提示して承認を得てから commit**
7. PHASE0-001 着手：sub-branch 作成手順（`feat/phase-0/pbi-001`）も**運営者に branch 名と分岐元を確認してから実行**

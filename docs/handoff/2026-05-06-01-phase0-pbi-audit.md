# 引継書 — Phase 0 PBI Audit（一次情報照合）

作成日: 2026-05-06
作成元セッション: PHASE0-002 着手中、PBI 本文に 4 件の primary-source ドリフトが連続検出されたことを契機に、Phase 0 残 PBI の起票品質を spot-check するタスクとして切り出し
受け取り先: 新セッション（kickoff prompt は本ファイルパスを指定して読ませる）

---

## §1 タスク goal（1 行）

Phase 0 PBI（PHASE0-003〜010）の各 empirical claim を一次情報と照合し、ドリフトがあれば `docs(pbi):` で補正コミットして最新化する。あわせて PBI README §5.3 step 2 の verify 範囲を「approach も対象」に拡張する。

## §2 なぜこのタスクが必要か（背景）

PHASE0-002 着手中に同 PBI 1 件で **4 件の primary-source-verifiable な誤り**が出た：

1. `yarn --version` 状況の誤認（Yarn 1.22 を 4 と書いていた）→ commit `cce4559` で補正
2. `--typescript strict` flag が create-astro CLI に存在しないのを誤認 → 同上
3. Astro バージョン 5 想定 → 実態は 6（`registry.npmjs.org/astro` の dist-tag latest = 6.2.2）→ commit `fe4b9e4` で補正
4. scaffold アプローチ `yarn create astro@latest .` が「既存 repo 後付け」非対応の事実を誤認（Astro 公式は別途 Manual Setup 節を提供）→ 補正未了、Handoff 02 で対応

1 PBI で 4 件出ているため、他 Phase 0 PBI も同等の起票品質である**蓋然性が高い**（ただし未検証）。着手前に spot-check してドリフトを刈る。

## §3 必読ドキュメント

1. `docs/pbi/README.md`（PBI フォーマット v2.7、§5.3 step 2 の現状文言を確認）
2. `docs/pbi/INDEX.md`（PBI 状態一覧）
3. `docs/pbi/20260501-PHASE0-002-astro-scaffold.md` 末尾の実装ログ「2026-05-06 セッション 1」（drift パターンの実例）
4. `docs/handoff/2026-05-06-02-phase0-002-resume.md`（後続タスク。本タスクとは独立だが、PHASE0-002 の `### scaffold アプローチ` 節書き換えはそちらに記載）

## §4 対象 PBI（spot-check 順）

NotStarted の 7 件 + Gate 1 件：

| ID | ファイル |
|---|---|
| PHASE0-003 | `docs/pbi/20260501-PHASE0-003-data-migration.md` |
| PHASE0-004 | `docs/pbi/20260501-PHASE0-004-biome-v2-upgrade.md` |
| PHASE0-005 | `docs/pbi/20260501-PHASE0-005-claude-md-update.md` |
| PHASE0-006 | `docs/pbi/20260502-PHASE0-006-readme-stub-update.md` |
| PHASE0-007 | `docs/pbi/20260501-PHASE0-007-lefthook-workflows-setup.md` |
| PHASE0-008 | `docs/pbi/20260501-PHASE0-008-cloudflare-pages-setup.md` |
| PHASE0-009 | `docs/pbi/20260501-PHASE0-009-local-dev-verification.md` |
| PHASE0-010 | `docs/pbi/20260501-PHASE0-010-retrospective-gate.md` |

## §5 各 PBI の audit 手順

各 PBI に対して以下を 1 件ずつ実施：

1. **PBI 全文を読む**
2. **empirical claim を抽出**：
   - ライブラリ・CLI の version（`Astro 5.x` 等）
   - CLI フラグの存在（`--typescript strict` 等）
   - 外部 URL（公式 docs / API ドキュメント）
   - 想定 CLI 挙動（既存 repo に対する scaffold 動作 等）
   - 公式が示す official な手順（manual setup / migration guide）と乖離していないか
3. **一次情報で verify**：
   - npm registry：`curl -s https://registry.npmjs.org/<package> | python3 -c "..."` で latest version
   - 公式 docs：`WebFetch` または `curl` で該当ページ取得
   - CLI flag：`<cli> --help` で実存確認
   - GitHub repo：`gh api` または `curl` で該当ファイル / release 確認
4. **drift があれば PBI を update**：
   - 受け入れ条件・技術メモ・備考を最新化
   - 起票時の前提が誤っていた場合、その経緯と一次情報の根拠を本文に書き残す（PHASE0-002 の Astro 5→6 補正コミットの diff を参考）
5. **`docs(pbi): correct PHASE0-NNN spec for <主要修正点>` で 1 コミット 1 PBI**

drift が無ければ「audit 済、drift なし」を実装ログに残す（実装着手時の二度手間を防ぐため）。

## §6 PBI README §5.3 step 2 の v2.8 化

audit と並行して（または最後に）、`docs/pbi/README.md` の §5.3 step 2 を以下のように拡張：

現状（v2.7）：
> 2. **PBI 本文の前提を一次情報で確認**（コマンド、依存 version、ツール挙動、外部リソースの存在等）。乖離があれば実装に入る前に PBI ファイルを update して commit する...

変更後（v2.8 案）：
- 「コマンド・version・flag・URL」だけでなく **scaffold / migration / setup の "approach" 自体**も対象であると明示
- 例：「PBI が CLI A を使うと書いていても、CLI A の docs に該当 use case が無い／別 path（例：Manual Setup 節）を案内している場合は、approach そのものを書き換える」
- 改訂履歴に v2.8 行を追加

PHASE0-002 セッション 1 で得た学び（実装ログ参照）をそのまま規約に昇格させる位置づけ。

## §7 ブランチ運用

- 本タスクは **docs 単独修正**（PBI ファイル + README）。`docs/pbi/README.md` §10.4 末尾の通り、`feat/phase-0` ブランチに直 commit してよい（worktree は不要）。
- main repo `/Users/kazuya/src/react-blog/`（branch: `feat/phase-0`）で作業する。
- **`.claude/worktrees/phase-0-pbi-002/` には触らない**（PHASE0-002 の作業中の worktree、Handoff 02 で再開する）。

## §8 検証済みリポジトリ実態（2026-05-06 21 時時点）

- main repo branch：`feat/phase-0`（main から 5 commits ahead、すべて docs 系）
- worktree：`.claude/worktrees/phase-0-pbi-002` （branch `feat/phase-0-pbi-002`、3 commits ahead of feat/phase-0、PHASE0-002 InProgress）
- 本 audit タスクは worktree 不使用

## §9 Done 条件

- [ ] PHASE0-003〜010 の 8 PBI を順次 audit 済（drift 検出 + 補正 or 「drift なし」を実装ログ記録）
- [ ] PBI README が v2.8（§5.3 step 2 の approach 拡張）に更新済
- [ ] すべて `feat/phase-0` に commit + push 済（push は運営者承認後）
- [ ] 後続 Handoff 02（PHASE0-002 resume）に進める状態

## §10 注意事項

- **PBI 本文は PHASE0-002 を含めて改訂しない**（PHASE0-002 の `### scaffold アプローチ` 節書き換えは Handoff 02 で worktree 内で実施する。本タスクで触れない）。
- audit で大きな drift が見つかっても、PBI 規約上 InProgress 化していない PBI なので Status はそのまま `NotStarted` を維持（README §5.1 の「逆遷移しない」原則は破らない）。
- audit で構造的問題（PBI そのものを分割すべき・廃止すべき）が見つかった場合は、運営者に相談。Claude 単独判断で PBI を統廃合しない。
- 並行で worktree (`feat/phase-0-pbi-002`) も生きているため、`feat/phase-0` の README 等を変更すると merge 時に conflict 可能性あり。INDEX.md だけは触らない（README §10.7 の通り並行直接編集が conflict しがち）。

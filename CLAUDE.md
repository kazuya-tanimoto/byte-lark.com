# byte-lark.com Project Cheatsheet

## Stack
- Astro 6 + Tailwind CSS v4 (`@tailwindcss/vite`) + shadcn/ui
- TypeScript strict
- Yarn 4 (Berry)
- Biome v2 (lint/format)
- Vitest (React Island / lib のみ) + Playwright (E2E)

## Build & Test Commands
- yarn dev / build / preview
- yarn test:run / test:e2e（test:e2e は Bash サンドボックスで Chromium 起動不可 → push 後に CI で実行。§7 / Sandbox 制約参照）
- yarn check / check:ts / fix
- yarn new-post --slug <slug> [--title "Title"] [--category tech|life]

## Directory Conventions
- src/pages/         Astro routes (file-based)
- src/components/    Custom Astro / React components
- src/components/ui/ shadcn/ui copy-paste components
- src/content/posts/ Markdown / MDX articles
- src/data/          Structured TS data (career, skills)
- src/layouts/       BaseLayout / PageLayout / PostLayout
- src/lib/           Utilities (cn, OGP helpers, JSON-LD)
- docs/              Plan, PBIs, workflows

## Design Rules
- shadcn/ui は React Island 必要箇所のみ（Header/Footer 等の静的部品は Astro 自前）
- OGP / SEO は SSG 時に静的生成（クライアント JS 非依存）
- Blog category は frontmatter、URL は flat /blog/:slug
- Color palette: 確定パレット「春空」（docs/design-direction.md §2、PHASE1C-002 で global.css トークンに反映済み）。sun / wash / チップ面は文字色に使わない

## Code Style
- TypeScript strict, 2-space indent, 100 char line, named exports preferred

## Multi-session work

### How to start work in this session
1. Read docs/site-plan.md (current Phase, Decision Log)
2. Read docs/pbi/INDEX.md (PBI status overview)
3. Pick the next PBI:
   - If any InProgress PBI exists, read its 実装ログ first; resume only if explicitly handed off
   - Otherwise, pick the oldest NotStarted in the current Phase
   - Earlier Phases must be Done (Gate passed)
   - 例外（先行トラック）: site-plan §8 Decision #28 の Phase 1c 先行トラック（PHASE1C-001〜007）は Phase 1b Gate 未通過でも着手可。記事 PBI（PHASE1B-008 / 009 / 012。Decision #29 で 3 本に縮小）とは並行可、ただし別名 clone の別作業ツリーに限る（1 ツリー 1 セッション。INDEX.md は pull→即コミット、同一 PBI を 2 セッションで触らない。README §9 並行運用）。どの PBI を進めるかは運営者指示に従う
4. Update PBI Status: NotStarted → InProgress + Started date
5. Sync INDEX.md
6. Implement
7. Verify: UI/フロントエンド変更がある場合、PBI を Done にする前に以下を**すべて**実施して出力する（必須）:
   - **ローカル検証**: `yarn dev` を起動し Playwright でスクリーンショット確認（デスクトップ + モバイル幅）
   - **CF preview 検証**: push 後に Playwright で CF branch alias URL を開いてスクリーンショット確認
     - Branch alias URL（feat/phase-1 固定）: `https://feat-phase-1-byte-lark.tanimoto-a49.workers.dev`
     - ※ version ごとの URL は CF ビルドログ末尾の `Version Preview URL:` 行に記載される
   - **E2E / CI 検証**: E2E スイート（`tests/e2e/`）は Bash サンドボックスで Chromium が起動できない（Mach port 権限拒否）。`yarn test:e2e` をローカルで叩かず、**push 後に CI（`.github/workflows/ui-tests.yml`）が ubuntu コンテナで自動実行**する。`bash scripts/ci-status.sh` で `UI Tests`(e2e) と `Quality Checks` が `success` になったことを確認（緑になるまで Done 不可）
   ```
   ## 検証報告
   - ローカル確認: （dev server で確認した内容）
   - CF preview 確認: https://feat-phase-1-byte-lark.tanimoto-a49.workers.dev （スクリーンショットまたは観察事実）
   - E2E/CI 確認: `scripts/ci-status.sh` の結果（UI Tests / Quality Checks の conclusion）
   - 未検証項目: （あれば正直に書く）
   ```
8. Done: check all 受け入れ条件 → Status: Done + Completed → sync INDEX.md → commit

### How to end this session
- If a PBI is InProgress: append to `## 実装ログ` (やったこと/残タスク/学び/想定外)
- WIP commit OK: `wip(pbi): PHASEn-NNN <note>`
- Verify INDEX.md and PBI Status are in sync

### How to draft next-Phase PBIs
- Only after current Phase Done + Retrospective Gate passed
  - 例外: site-plan Decision Log で「先行トラック」と明示された PBI 群は前 Phase Gate 前に起票可（現行: Phase 1c 先行トラック、Decision #28 / README §9 例外。仕上げトラック + 1c Gate は 1b Gate 後に起票）
- Through Phase 1c, keep working on the integration branch `feat/phase-1` — do NOT branch from main (公開前は main 未マージで集約。README §10.3）。`git checkout -b feat/phase-<phase>` from main applies only to new phase lineages: Phase 0 (done) and post-publish 1e+ after Phase 1d merges feat/phase-1 into main (README §10.6, site-plan §8 Decision #25)
- Read the Gate PBI's "次 Phase への申し送り" section
- Read all `## 実装ログ` from the just-completed Phase's PBIs (especially "想定外" / "学び・つまずき" 項)
- Draft next-Phase PBIs reflecting the learnings
- **All drafted PBIs MUST carry the §7 verification gate in 受け入れ条件** (ローカル / CF preview スクショ確認 + E2E/CI green 確認, テンプレ常設・非該当は `[x] …：N/A（理由）`). README §4.6 ルール 7。INDEX.md セッション開始チェックが起票漏れを機械検出する
- Append to INDEX.md as Status: NotStarted
- Commit on the Phase branch (docs-only)

## Stop Hook フィードバック対応

Stop hook（PBI Done 宣言の検証ゲート監査）でレスポンスがブロックされた場合、そのフィードバックは次のターンの `<system-reminder>` に含まれる。
次のターンでは、ユーザーの新しい質問に答える前に、まず Stop hook の指摘（未消化の検証工程）を解消すること。

運営者向けの応答に hook の存在・文言・判定結果を書かない。未消化の工程があれば実施し、その結果を §7 の検証報告として出すだけにする（hook は内部の検証機構であって、運営者の判断材料ではない）。指摘が「解消すべき工程なし」だった場合は、そのターンで運営者に伝えるべき新しい事実が無いということなので、hook に言及した短い応答を返さず、いま何が終わっていて何を待っているかを自己完結した形で書く。

## Sandbox 制約
- Phase 1a 以降の git 操作は統合ブランチ feat/phase-1 を直接チェックアウトして行う（sub-branch 不使用、worktree 不使用）。feat/phase-1 に直 commit / 直 push する（1a〜1c を集約、main マージは 1d。詳細: docs/pbi/README.md §10.4-10.6）
- `yarn up` / `yarn add` 等レジストリアクセスが必要なコマンドは、Bash ツールでも `!` プレフィックスでも DNS 解決が失敗する。運営者に別ターミナル（Claude Code 外）での実行を依頼する
- E2E スイート（Playwright test runner）は Bash サンドボックスで Chromium 起動不可（Mach port 権限拒否で即 FATAL）。ローカルで `yarn test:e2e` を叩かず、push 後に CI（`.github/workflows/ui-tests.yml`、ubuntu コンテナ）で検証し `scripts/ci-status.sh` で合否を読む（gh CLI は sandbox 内で TLS/keychain により不可、curl は可）。UI スクショ確認は MCP Playwright で行う
- 上記の yarn / E2E / gh 制約は母艦（macOS Seatbelt sandbox）のもの。devcontainer 内のセッションには適用されない（次節）

## Devcontainer 自走環境
- `.devcontainer/` は Claude Code をコンテナ内で全権限自走させる環境（PHASE1B-016 導入。設計・実施手順: docs/devcontainer-plan.md）。今いる環境の見分け方：作業ディレクトリが `/workspace` ならコンテナ内、`/Users/kazuya/...` なら母艦
- 住み分け：コンテナ = yarn ネットワーク系 / `yarn test:e2e` ローカル実行 / `--dangerously-skip-permissions` 放置自走。母艦 = MCP Playwright スクショ確認・ブラウザ系 MCP・プロジェクトメモリ。コンテナ内では Sandbox 制約節の回避策は不要（直接実行してよい）
- 書き戻し禁止：コンテナから母艦の設定（`~/dotfiles`、`~/.claude`）に書き戻さない。グローバル CLAUDE.md は read-only mount からのコピー持ち込みのみ（.devcontainer/setup-container.sh）、コンテナ内の Claude 設定は専用 volume に閉じる
- push 認証は fine-grained PAT（この repo 限定 / Contents read+write）。コンテナ内 `gh auth login` で専用 volume に永続化済み。PAT を repo / イメージ / 環境変数に書かない
- 起動は fish 関数 `ccd`（dotfiles 管理、firewall 有効チェック付き。`ccd --auto` = 放置自走）。運営者向け手順は docs/operation-manual.md §5

## Commit Convention
- feat(pbi): PHASE0-NNN <desc>   # PBI completion
- chore(pbi): ...                # PBI 起票・更新
- docs(pbi): ...                 # PBI 規約・INDEX 等のドキュメント変更
- wip(pbi): PHASE0-NNN <note>    # 中間コミット

## Related Docs
- docs/site-plan.md           Site construction plan (current: v3.12)
- docs/pbi/README.md          PBI format spec (v3.6) including §10 branch ops
- docs/pbi/INDEX.md           PBI status overview
- docs/writing-workflow.md    Article writing process（Phase 1a 冒頭で作成）
- docs/operation-manual.md    運営者向け運用マニュアル（シーン別フレーズ / リカバリー / トラブルシューティング）
- docs/devcontainer-plan.md   devcontainer 環境の設計・実施手順（PHASE1B-016）

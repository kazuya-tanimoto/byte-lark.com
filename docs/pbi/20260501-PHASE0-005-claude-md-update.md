# Claude は新スタック前提と多セッション運用プロトコルを CLAUDE.md で参照できる

Status: Done
Started: 2026-05-07
Completed: 2026-05-07

## 誰が
- Claude

## 何をできる
- 旧 Vite + React + Chakra + Storybook + atomic 前提の `CLAUDE.md` を、Astro + Tailwind v4 + shadcn/ui 前提 + 多セッション運用プロトコル付きの内容に**丸ごと差し替え**できる

## なんのために
- Claude Code が新セッションで初回 read する CLAUDE.md が旧スタック前提だと、後続作業が旧パターンに引きずられる
- 多セッション運用（1 セッションで複数 PBI / 1 PBI を複数セッション）に対応する手順を文書化するため
- 関連: site-plan.md §6.7 / §7 / Phase 0

## 受け入れ条件

- [ ] `CLAUDE.md` を備考セクションのテンプレで丸ごと差し替えた
- [ ] 既存の暫定 slim ヘッダー（先頭の `> **暫定（PHASE0-005 で完全置換予定）**：以下のリンクを参照してください。` ブロック一式、commit `d4c5cd1` で導入）が新テンプレで完全置換されている
- [ ] 検証 1：旧記述が完全にゼロ（`grep -E "Chakra|Storybook|yarn sb|atoms.*molecules.*organisms"` で 0 件）
- [ ] 検証 2：多セッション運用の 3 セクションが存在（`grep -E "How to (start|end) (work|this session)|How to draft next-Phase"` で 3 件以上ヒット）
- [ ] 検証 3：内容ベースで、以下 3 セクションすべてに必要な指示が含まれる：
  - [ ] **How to start work in this session**：`docs/site-plan.md` → `docs/pbi/INDEX.md` → 該当 PBI の参照順、InProgress 優先 → 最古 NotStarted、Status 更新と INDEX.md 同期
  - [ ] **How to end this session**：InProgress な PBI は `## 実装ログ` 追記、WIP コミット、Status 同期確認
  - [ ] **How to draft next-Phase PBIs**：前 Phase Done + Gate 通過確認、Gate の「申し送り」読込、各 PBI の実装ログ読込、INDEX.md 追加
- [ ] `feat/phase-0-pbi-005` sub-branch 上で実装し、完了時に `feat/phase-0` へ `git merge --no-ff` でマージされている（詳細：docs/pbi/README.md §10.4-10.5）

## 技術メモ
- 既存 CLAUDE.md パス：repo ルートの `CLAUDE.md`
- グローバル CLAUDE.md（`~/.claude/CLAUDE.md`）は触らない
- プロトコル本体は `docs/pbi/README.md` v2.8 に詳細記載済（§5 ライフサイクル / §6 コミット規約 / §10 ブランチ運用）。CLAUDE.md にはエッセンスを書き、詳細は README に誘導することでコンパクト化

## 備考

### 差し替え後の CLAUDE.md（テンプレ）

これを丸ごとコピーして配置：

```markdown
# byte-lark.com Project Cheatsheet

## Stack
- Astro 6 + Tailwind CSS v4 (`@tailwindcss/vite`) + shadcn/ui
- TypeScript strict
- Yarn 4 (Berry)
- Biome v2 (lint/format)
- Vitest (React Island / lib のみ) + Playwright (E2E)

## Build & Test Commands
- yarn dev / build / preview
- yarn test:run / test:e2e
- yarn check / check:ts / fix
- yarn new-post

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
- Color palette: Hibari brand (sky / amber / green / earth / neutral)、確定 HEX は Phase 1b 後

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
4. Update PBI Status: NotStarted → InProgress + Started date
5. Sync INDEX.md
6. Implement
7. Done: check all 受け入れ条件 → Status: Done + Completed → sync INDEX.md → commit

### How to end this session
- If a PBI is InProgress: append to `## 実装ログ` (やったこと/残タスク/学び/想定外)
- WIP commit OK: `wip(pbi): PHASEn-NNN <note>`
- Verify INDEX.md and PBI Status are in sync

### How to draft next-Phase PBIs
- Only after current Phase Done + Retrospective Gate passed
- Read the Gate PBI's "次 Phase への申し送り" section
- Read all `## 実装ログ` from the just-completed Phase's PBIs (especially "想定外" / "学び・つまずき" 項)
- Draft next-Phase PBIs reflecting the learnings
- Append to INDEX.md as Status: NotStarted

## Commit Convention
- feat(pbi): PHASE0-NNN <desc>   # PBI completion
- chore(pbi): ...                # PBI 起票・更新
- docs(pbi): ...                 # PBI 規約・INDEX 等のドキュメント変更
- wip(pbi): PHASE0-NNN <note>    # 中間コミット

## Related Docs
- docs/site-plan.md           Site construction plan (current: v3.7)
- docs/pbi/README.md          PBI format spec (v2.8) including §10 branch ops
- docs/pbi/INDEX.md           PBI status overview
- docs/writing-workflow.md    Article writing process（Phase 1a 冒頭で作成）
- docs/operation-manual.md    運営者向け運用マニュアル（シーン別フレーズ / リカバリー / トラブルシューティング）
```

## 実装ログ

### 2026-05-07 着手前 audit（実装セッション外）
- Handoff `docs/handoff/2026-05-06-01-phase0-pbi-audit.md` に従い、PBI 本文の empirical claim を一次情報で照合。
- 確認：`registry.npmjs.org/astro` の dist-tag latest = 6.2.2（PHASE0-002 fe4b9e4 で primary-source verified）✓ / `docs/pbi/README.md` の現 version は v2.8（commit 6db093b で v2.7→v2.8 化）✓ / 現 `CLAUDE.md` の先頭は slim placeholder header（commit d4c5cd1 で `> **暫定（PHASE0-005 で完全置換予定）**` に置換済、旧 NOTE-header は既に存在しない）✓
- 結果：**drift 補正 commit 5eed317** で 3 箇所を最新化：
  - 受け入れ条件：旧 NOTE-header の削除確認 → 現 slim placeholder の完全置換確認に書き換え（前提が消失していたため）
  - 技術メモ：プロトコル本体の README ref を v2.4 → v2.8
  - 備考テンプレ：Stack `Astro 5` → `Astro 6`、Related Docs の `README.md (v2.4)` → `(v2.8)`

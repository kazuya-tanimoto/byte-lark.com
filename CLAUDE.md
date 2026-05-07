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

## Worktree での git 操作
- EnterWorktree 後は sandbox が `.git` 書き込みをブロックするため、git add / commit / push は ExitWorktree で本体に戻ってから `-C` オプションで実行する
- 詳細: docs/pbi/README.md §10.4-10.5

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

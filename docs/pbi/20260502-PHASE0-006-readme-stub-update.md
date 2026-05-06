# 訪問者は README.md で新スタックを反映した最小限のプロジェクト概要を確認できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- GitHub repo（`kazuya-tanimoto/byte-lark.com`）のトップ README で、本プロジェクトが Astro + Tailwind v4 + shadcn/ui 構成であることを把握できる
- 主要 yarn scripts、ローカル起動方法、関連ドキュメントへのリンクを参照できる

## なんのために
- 旧 Vite + React + Chakra + Storybook 前提の README が残っていると、外部から見て「このプロジェクトは何か」を誤解させる
- Phase 1a 以降の本格的な README 整備（バッジ、スクリーンショット等）は別 Phase に譲り、Phase 0 ではスタブで誤解だけ防ぐ
- 関連: site-plan.md §6.7 / Phase 0

## 受け入れ条件

- [ ] `README.md` が新スタック前提に書き換えられている
- [ ] 旧記述ゼロ（`grep -E "Chakra|Storybook|yarn sb|atomic"` で 0 件）
- [ ] 以下の章を含む（最低限）：
  - [ ] Project name + 1 行説明（個人ポートフォリオ + 技術 / ライフ系ブログ）
  - [ ] Stack（Astro 6 + Tailwind CSS v4 + shadcn/ui + TypeScript + Yarn 4 + Biome v2 + Vitest + Playwright）
  - [ ] Prerequisites（Node 24+, Yarn 4）
  - [ ] Installation（`yarn install`）
  - [ ] Available Scripts（dev / build / preview / check / check:ts / test / test:run / test:e2e / fix）
  - [ ] Project Structure（簡略）
  - [ ] Author（Kazuya Tanimoto / GitHub link）
  - [ ] License（MIT、`LICENSE` ファイル参照）
  - [ ] Related Docs（docs/site-plan.md, docs/pbi/README.md, docs/pbi/INDEX.md, CLAUDE.md）
- [ ] `feat/phase-0-pbi-006` sub-branch 上で実装し、完了時に `feat/phase-0` へ `git merge --no-ff` でマージされている（詳細：docs/pbi/README.md §10.4-10.5）

## 技術メモ
- 既存 `README.md` パス：repo ルートの `README.md`（PHASE0-001 で残置済）
- バッジ（CI status / Lighthouse score 等）は Phase 1a 後で追加候補（現時点の README に入れると壊れたバッジになる）
- スクリーンショット・デモ URL も Phase 1a 後

## 備考

### 想定 README.md 構造（テンプレ）

```markdown
# byte-lark.com

個人ポートフォリオ + 技術 / ライフ系ブログサイト。エージェント案件の職能リファレンス + 技術発信を目的とする。

## Tech Stack
- Astro 6 (SSG)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- shadcn/ui (React Islands only)
- TypeScript strict
- Yarn 4 (Berry)
- Biome v2 (lint / format)
- Vitest (unit) + Playwright (e2e)
- Cloudflare Pages (hosting) + Cloudflare Web Analytics

## Prerequisites
- Node.js 24+
- Yarn 4 (`packageManager` field を参照)

## Installation
```bash
git clone https://github.com/kazuya-tanimoto/byte-lark.com.git
cd byte-lark.com
yarn install
```

## Scripts
- `yarn dev` ローカル開発サーバ起動
- `yarn build` SSG ビルド
- `yarn preview` ビルド結果のローカル確認
- `yarn check` Biome lint
- `yarn check:ts` Astro 型チェック
- `yarn test:run` Vitest 一回実行
- `yarn test:e2e` Playwright E2E
- `yarn fix` Biome auto-fix

## Project Structure
（簡略図、CLAUDE.md / site-plan.md §6.4 を参照）

## Author
- Kazuya Tanimoto / [GitHub](https://github.com/kazuya-tanimoto)

## License
MIT — see [LICENSE](LICENSE)

## Related Docs
- [docs/site-plan.md](docs/site-plan.md) — Site construction plan
- [docs/pbi/README.md](docs/pbi/README.md) — PBI format spec
- [docs/pbi/INDEX.md](docs/pbi/INDEX.md) — PBI status
- [CLAUDE.md](CLAUDE.md) — Project conventions for Claude Code
```

## 実装ログ

### 2026-05-07 着手前 audit（実装セッション外）
- Handoff `docs/handoff/2026-05-06-01-phase0-pbi-audit.md` に従い、PBI 本文の empirical claim を一次情報で照合。
- 確認：`registry.npmjs.org/astro` の dist-tag latest = 6.2.2（PHASE0-002 fe4b9e4 で primary-source verified）✓ / `raw.githubusercontent.com/nodejs/Release/main/schedule.json`（2026-05-07 取得）：v24 = Active LTS（2025-10-28〜、EOL 2028-04-30）、v22 = Maintenance LTS（EOL 2027-04-30）✓
- 結果：**drift 補正 2 commit** で 4 箇所を最新化：
  - commit 88b99df：受け入れ条件 Stack 行と備考 README テンプレ（`## Tech Stack`）の `Astro 5` → `Astro 6`
  - commit 5fd6cb5（Handoff 03 §4 D3-D4）：受け入れ条件 Prerequisites と備考 README テンプレの `Node 20+` / `Node.js 20+` → `Node 24+` / `Node.js 24+`（Node Active LTS への sync）

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
- Cloudflare Workers (hosting) + Cloudflare Web Analytics

## Prerequisites

- Node.js 24+
- Yarn 4 (`packageManager` field を参照)

## Installation

```bash
git clone https://github.com/kazuya-tanimoto/byte-lark.com.git
cd byte-lark.com
yarn install
yarn lefthook install --force
```

> **Note**: Yarn 4 は postinstall を無効化するため、`lefthook install` は手動実行が必要です。

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | ローカル開発サーバ起動 |
| `yarn build` | SSG ビルド |
| `yarn preview` | ビルド結果のローカル確認 |
| `yarn check` | Biome lint |
| `yarn check:ts` | Astro 型チェック |
| `yarn test` | Vitest watch モード |
| `yarn test:run` | Vitest 一回実行 |
| `yarn test:e2e` | Playwright E2E |
| `yarn fix` | Biome auto-fix |

## Project Structure

```
src/
├── assets/        Static assets (images, fonts)
├── components/    Custom Astro / React components
│   └── ui/        shadcn/ui copy-paste components
├── data/          Structured TS data (career, skills)
├── lib/           Utilities (cn, OGP helpers, JSON-LD)
├── pages/         Astro routes (file-based)
├── styles/        Global CSS
└── types/         TypeScript type definitions
```

## Author

- Kazuya Tanimoto / [GitHub](https://github.com/kazuya-tanimoto)

## License

MIT — see [LICENSE](LICENSE)

## Related Docs

- [docs/site-plan.md](docs/site-plan.md) — Site construction plan
- [docs/pbi/README.md](docs/pbi/README.md) — PBI format spec
- [docs/pbi/INDEX.md](docs/pbi/INDEX.md) — PBI status
- [CLAUDE.md](CLAUDE.md) — Project conventions for Claude Code

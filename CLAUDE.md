# React Blog Project Cheatsheet

> **NOTE (2026-05-02)**：本ファイルは旧 Vite/React/Chakra 前提の暫定内容です。**作業着手時はまず [docs/pbi/INDEX.md](docs/pbi/INDEX.md) と [docs/site-plan.md](docs/site-plan.md) を読み、次の PBI を特定してください**。本ファイル全体は PHASE0-005 で Astro/Tailwind/shadcn 前提 + 多セッション運用プロトコル付きに丸ごと差し替えられます。
>
> **多セッション運用プロトコル本体**：[docs/pbi/README.md](docs/pbi/README.md) §5（着手時手順 / 中断時手順 / 完了済み PBI の扱い / コミット規約 / 実装ログ漏れ検出）を参照してください。PHASE0-005 完了までは「INDEX.md（PBI 選択ロジック）」と「README.md §5（着手・中断・完了手順）」の 2 ファイルが SoT です。

## Build & Test Commands
- `yarn dev`: Start dev server
- `yarn build`: Build for production
- `yarn test`: Run all tests in watch mode
- `yarn test:run`: Run all tests once
- `yarn test:coverage`: Generate coverage report
- `yarn test <TestName>`: Run specific test
- `yarn test:ui`: Run tests with UI
- `yarn check`: Run Biome linting
- `yarn check:ts`: TypeScript type checking
- `yarn fix`: Auto-fix linting issues
- `yarn sb`: Start Storybook

## Code Style Guidelines
- Use TypeScript with strict type checking
- Imports organized by Biome (external, internal, then types)
- 2-space indentation, 100 char line width
- Component structure: atoms → molecules → organisms → templates
- React components use named exports and JSX.Element return type
- Tests use React Testing Library with specific assertions
- Use Chakra UI for styling with responsive design (base/sm/md/lg/xl)
- Feature folders contain types/, components/, and data/
- Error handling with react-error-boundary
- Prefer async/await over promise chains
- Use path aliases (@/*) for imports
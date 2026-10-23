# byte-lark.com Project Cheatsheet

## Stack と Commands
- Astro 6 + Tailwind CSS v4（`@tailwindcss/vite`）+ shadcn/ui、TypeScript strict、Yarn 4（Berry）、Biome v2、Vitest（React Island と lib のみ）+ Playwright（E2E）
- yarn dev / build / preview、yarn test:run / test:e2e、yarn check / check:ts / fix
- yarn new-post --slug <slug> [--title "Title"] [--category tech|life]

## コードとデザインの決まり
- 記事は常に `src/content/posts/<slug>/index.md` のフォルダ形式で置き、posts の直下にファイルを置かない。
- shadcn/ui（`src/components/ui/`）は React Island が要る箇所だけに使い、Header や Footer などの静的な部品は Astro で作る。
- OGP と SEO は SSG の時点で静的に作り、クライアントの JS に頼らない。
- 記事のカテゴリは frontmatter で持ち、URL はフラットな `/blog/:slug` にする。
- 色は確定パレット「春空」（docs/design-direction.md §2）を使い、sun・wash・チップ面の色は文字に使わない。
- コードは 2 スペース、1 行 100 字、named export を優先する。

## 記事
- 記事本文に関わる作業（初稿、リライト、レビュー、部分修正）は docs/writing-workflow.md の手順で進める。
- 書く・直す直前に docs/writing-style/profile.md と直近の公開記事 1〜2 本を読み直し、運営者に出す前に ja-check と profile.md「避ける表現」の照合を通す。セッションの前半に読んだ記憶だけで書くと、文体がずれるため。
- 公開（`draft: false`）は、2 回目の `/kt:article-review` の後にする。

## PBI と PR
- PBI に関わる作業の前に、docs/pbi/README.md の該当する節（選ぶ・着手は §5.3 と §10.3・§10.4、中断は §5.4、完了は §5.9 と §10.6、起票は §9）を読み、その手順で進める。
- 作業は main から短命ブランチを切って進め、最初の push の直後に draft PR を作る。CI は PR があるときしか走らないため。
- push のたびに `ci-status.sh --wait` で結果を見て、赤なら次の工程より先に原因を調べて報告する。
- PBI を Done にする前に README §5.9 の検証ゲートをすべて通し、検証報告を出す。
- commit の確認はグローバル CLAUDE.md のとおり merge・片付け・本番の表示確認まで 1 回で取り、その OK の後に merge だけを改めて運営者に回さない。merge は本番公開だが、その可否は検証ゲートの通過で決まっているため。
- commit メッセージは README §6 の規約（`feat(pbi): PHASEn-NNN <desc>` など）に従う。

## 環境
- 作業ディレクトリが `/workspace` ならコンテナの中で、yarn、`yarn test:e2e`、スクショ（`scripts/capture-screenshots.mjs`）を直接実行してよい。
- `/Users/kazuya/...` なら母艦（運営者の Mac）で、レジストリを使う yarn（`yarn add`、`yarn up`）は運営者に別のターミナルで頼み、E2E は CI に任せる。母艦の sandbox では DNS と Chromium が動かないため。
- コンテナの worktree に入った直後は `yarn install --immutable` を実行する。node_modules が無いと pre-push が失敗するため。
- コンテナから母艦の設定（`~/dotfiles`、`~/.claude`）に書き戻さず、PAT を repo・イメージ・環境変数に書かない。

## Related Docs
- docs/site-plan.md（current: v3.18。Decision Log は docs/site-plan-decisions.md）
- docs/pbi/README.md（PBI format spec (v3.19)）と docs/pbi/INDEX.md（PBI の状態）
- docs/operation-manual.md（運営者向けの運用）と docs/devcontainer-plan.md（コンテナと母艦の住み分け）
- .claude/review/（`/kt:article-review` と `/kt:pbi-review` が読む、この repo の軸と材料。skill 本体は個人 plugin `kt`）

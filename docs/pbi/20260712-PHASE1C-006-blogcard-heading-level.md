# 訪問者は /blog 一覧で見出し階層が正しい（h1→h2）記事カードを閲覧できる

Status: InProgress
Started: 2026-07-26

## 誰が
- 訪問者

## 何をできる
- スクリーンリーダー・アウトライン上も正しい見出し階層で Blog 一覧を辿れる（h1「Blog」直下のカードタイトルが h2 になる）

## なんのために
- `/blog/` が h1 → h3（カードタイトル）と h2 を飛ばし、Lighthouse `heading-order` 監査が失敗している（A11y 94 で 90+ は維持、axe の critical/serious では未検出。PHASE1A-020 で確認）
- 関連: site-plan.md NFR-02 / §6.5.2 a11y 追跡 追加（PHASE1A-020 起点）/ §8 Decision #28 / draft-phase1c-design-polish.md B-1 / Phase 1c 先行トラック

## 受け入れ条件
- [x] `src/components/BlogCard.astro` に見出しレベルの prop を追加（`headingLevel?: "h2" | "h3"`、既定は現行互換の h3。動的タグで切替）
- [x] `/blog/`（h1 直下）ではカードタイトルが h2 で出力される（2026-07-26 母艦で実測。dev 限定の一時記事を置いて DOM 確認 → `H1: Blog` → `H2: 記事タイトル` でスキップなし。一時記事は確認後に削除）
- [x] Home の Blog セクション（h2「Blog」配下）では h3 のまま（既定値、prop 未指定。同実測で `H2: Blog` → `H3: 記事タイトル`、カードタイトルの computed style は h2 側と同一の 16px / 600 でリグレッションなし）
- [ ] Lighthouse `heading-order` 監査が `/blog/` で pass、Accessibility 90+ 維持（実カードが必要＝記事公開後に母艦/運営者ターミナルで実測。現状 0 件では意味を成さない）
- [x] E2E（`tests/e2e/` の a11y チェック含む）green（コンテナ内 `yarn test:e2e` 29 passed）
- [x] `yarn build` / `yarn check:ts` エラーなし
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）：2026-07-26 母艦。dev 限定の一時記事ありで `/blog/`（1280 / 390）と Home の Blog セクション（1280 / 390）を確認。カード見た目は h2 化前後で不変、レイアウト崩れなし
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）：2026-07-26 母艦。`/blog/`（1280 / 390）。公開記事 0 件のため「記事はまだありません。」の空表示で、見出しは `H1: Blog` のみ。崩れなし＝リグレッションなしを確認（実カードでの確認は上記ローカル実測が代替）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）：head 95fa5de で UI Tests / Quality Checks とも completed/success（Workers Builds / CodeQL も success）

## 技術メモ
- 想定セッション数: 1
- 依存: なし（デザイン確定と独立。任意タイミングで着手可）
- 見た目のサイズはタグと独立に保つ（h2 化で視覚スタイルが変わらないようクラス側で吸収）

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。draft-phase1c-design-polish.md B-1（出典: PHASE1A-020 実装ログ）

## 実装ログ

### 2026-07-26 セッション 1（コンテナ内・自走）
- やったこと：
  - `src/components/BlogCard.astro` に `headingLevel?: "h2" | "h3"`（既定 h3）を追加。Astro の動的タグ（大文字変数 `const Heading = headingLevel`）でタイトルタグを切替。視覚サイズはクラス側（`font-semibold leading-snug text-foreground`、明示 font-size なし）で吸収するため、タグを変えても見た目は不変
  - `src/pages/blog/index.astro`（h1「Blog」直下）で `<BlogCard post={post} headingLevel="h2" />` を指定。`src/pages/index.astro`（h2「Blog」配下）は prop 未指定＝既定 h3 のまま（リグレッションなし）
  - 前提確認（README §5.3 step2）：BlogCard は変更前 line 43 で h3 固定＝PBI 記述どおり。global.css に要素セレクタ `h2 {}` / `h3 {}` のサイズ定義は無く、見出しサイズは utility クラス依存（Tailwind preflight が既定サイズをリセット）→ タグ差し替えで視覚サイズは変わらないことを一次確認
- 検証（コンテナ内で可能なもの）：
  - `yarn build` / `yarn check`（Biome, 38 files）/ `yarn check:ts`（0 errors）green
  - `yarn test:run`（Vitest 30 passed）green
  - `yarn test:e2e`（Playwright 29 passed、コンテナ内ローカル実行）green
  - CI（push 後、head 95fa5de）：`scripts/ci-status.sh` で **UI Tests / Quality Checks とも completed/success**（Workers Builds: byte-lark / CodeQL も success）
- 想定外だった点：
  - 唯一の記事 building-this-blog-with-claude-code は `draft: true`（運営者リライト中・未コミット、本セッションでは不可侵）。このため現状 `/blog` は公開記事 0 件でカードが描画されず、PBI が狙う「h1→h3 スキップ」自体が現時点では発生しない。コード変更（記事公開時に `/blog` カードが h2 で出る）は正しいが、**実カードでの h2 出力・Lighthouse heading-order pass は記事公開後でないと実測不能**。E2E `blog.spec.ts` も現状「カード 0 件」を前提にしており本変更と非干渉
- 残タスク（次セッション / 母艦）：
  - **§7 スクショ確認（ローカル dev + CF preview）は母艦セッション担当**。当該 2 チェックは未チェックのまま残す
  - Lighthouse heading-order pass / A11y 90+：実カードが必要なため記事公開後に母艦/運営者ターミナルで実測（現状 0 件では意味を成さない）
  - Status は **InProgress のまま**（Done にしない）

### 2026-07-26 セッション 2（母艦・§7 検証）
- コンテナ側の成果を一次確認：feat/phase-1 の HEAD は 2ca2ae3（push 済み、ローカルと origin 一致）。`scripts/ci-status.sh` を再実行し **Quality Checks / UI Tests とも completed/success**（Workers Builds: byte-lark / CodeQL も success）
- 「実カード 0 件で測れない」の裏取り：記事は building-this-blog-with-claude-code 1 本のみで `draft: true`、`src/pages/blog/index.astro` は `data.draft !== true` で絞り込み → `/blog` は 0 件で確定
- 実カードでの見出し実測（0 件問題の回避策）：運営者承認のうえ、**コミットしない一時記事**（カバー画像なし）を `src/content/posts/` に置いて `yarn dev` で確認 → 確認後に削除（削除後 `git status` は運営者リライト中ファイル 1 件のみ＝クリーン）
  - `/blog/`：`H1: Blog` → `H2: 見出しレベル確認用の一時記事`（スキップなし）
  - Home：`H2: Blog` → `H3: 同記事`（既定値のまま）
  - カードタイトルの computed style は両方とも 16px / font-weight 600 ＝ **タグを変えても視覚サイズは不変**を実測（技術メモの前提が満たされていることの確認）
- CF preview（branch alias、2ca2ae3 デプロイ済み）：`/blog/` は空表示のみ。実カードは映らないため、上記ローカル実測で代替した
- スクショ 6 枚は scratchpad に保存（repo には残していない）
- 想定外だった点：
  - 母艦の Bash サンドボックスでも `yarn dev` の localhost バインドは通った（Playwright の Chromium 起動不可とは別問題だった）。ローカル検証で運営者に dev 起動を依頼する必要はない
- 残タスク：
  - Lighthouse `heading-order` / A11y 90+ の実測のみ。実カードが必要＝記事公開（PHASE1B-008）待ち。`bash scripts/lighthouse-audit.sh` は既定で branch alias を見に行き、対象パスに `/blog/` を含むため公開後は 1 コマンドで済む
  - Status は **InProgress のまま**（この 1 項目の扱いは運営者判断待ち）

# 運営者と Claude は Phase 1a 完了状態を確認し、Phase 1b への学びを次セッションへ申し送ることができる

Status: Done
Started: 2026-06-14
Completed: 2026-06-14

## 誰が
- 運営者 + Claude

## 何をできる
- Phase 1a の全 PBI が Done になったことを確認できる
- Phase 1a で得た技術的知見・想定外・つまずきを集約し、Phase 1b PBI 起票時の参考資料として明文化できる
- feat/phase-1a を main にマージし、本番デプロイの最終確認ができる

## なんのために
- Phase 1a の学びが Phase 1b のデザインブラッシュアップ PBI に反映されないまま着手するリスクを排除するため
- 関連: site-plan.md §7（ロードマップの Retrospective Gate）/ Phase 1a

## 受け入れ条件

### Phase 1a 完了確認
- [x] PHASE1A-001 〜 PHASE1A-021 のすべてが Status: Done（**例外**: PHASE1A-018 は Status: Moved。site-plan v3.9 Decision #25 で Phase 1d 公開 PBI へ移管済み）→ 2026-06-14 確認: 001-021 すべて Done、018 のみ Moved
- [x] `docs/pbi/INDEX.md` の Phase 1a セクションがすべて `[Done]` 表示（018 = Moved 含む）
- [x] feat/phase-1a ブランチで `yarn dev` / `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がすべて成功 → 2026-06-14: dev(:4321 起動) / build(9 ページ) / check(36 files クリーン) / check:ts(0 errors) / test:run(16/16) すべて green

### 学びの集約
- [x] 本 PBI の `## Phase 1b への申し送り` セクションに以下を記入:
  - [x] 確定した技術前提（実際に動いた構成・選定結果）
  - [x] 発生した想定外と回避策
  - [x] 計画書と実態の差分（あれば）
  - [x] Phase 1b 起票時の注意（コンテンツ整備に影響する事項。※ v3.9 Phase 再編により 1b = コンテンツ整備、デザインは 1c）
  - [x] Phase 1b で先に決めるべき事項
  - [x] **ドラフト 2 本の正式化指示**：1b 起票時に `draft-phase1b-content-launch-prep.md` を、1d 起票時に `draft-phase1d-domain-launch.md` を、それぞれ番号付き PBI として正式化すること

### CLAUDE.md / site-plan.md の整合確認
- [x] CLAUDE.md の記述と Phase 1a の実態に齟齬がないか確認 → 齟齬なし（スタック / worktree 不使用フロー / §7 検証ゲート / 仮 HEX→1c すべて整合）
- [x] site-plan.md と Phase 1a 実装結果に差分があれば記録・修正 → §10 未決事項 Q1/Q2/Q3/Q4/Q6/Q7/Q10/Q12 を確定反映、§12 README 参照を v2.9 に、§6.4 に `src/types/`・`public/favicon.svg` を追記（申し送り「計画書と実態の差分」参照）

### マージ（v3.9 Phase 再編で Phase 1d へ移管。本ゲートでは実施しない）
> 本 PBI は 2026-05-10 起票で、v3.9（2026-06-13）の Phase 再編より前。**v3.9 Decision #25 で main マージ＋本番デプロイ＝「公開」は Phase 1d へ移管**された（site-plan §7 Phase 1d 行 / draft-phase1d-domain-launch.md line 42 / 同技術メモ line 77）。未確定コンテンツ・仮 HEX を本番反映させないため、本ゲートではマージしない（運営者承認 2026-06-14）。
- [x] feat/phase-1a ブランチを main にマージ（`merge --no-ff`）：N/A（Phase 1d で実施。draft-phase1d「マージ・ドメイン接続」節）
- [x] feat/phase-1a は remote に保持：該当（マージ有無に関わらず保持。Phase 1b も本ブランチ上で進行）
- [x] 本番デプロイ成功確認：N/A（Phase 1d でドメイン接続とあわせて確認）

### 完了処理
- [x] 本 PBI の Status を Done に更新、INDEX.md 同期
- [x] ローカル スクショ確認（desktop + mobile）：N/A（理由：本 PBI は Gate（確認・マージ・申し送り）で UI を変更しない）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：N/A（理由：UI 変更なし）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）：N/A（本 PBI は docs のみ変更で frontend 非変更）。ただし Gate 通過判定として HEAD 1d04dc6 の CI 緑を別途確認済み（2026-06-14: Quality Checks / UI Tests(e2e) / Workers Builds すべて success）（CLAUDE.md §7）

### 次セッションへのトリガー
- [x] 本 PBI が Done になった時点で、次セッションは「Phase 1b PBI 起票」を最初のタスクとして実行可能

## 技術メモ
- PHASE0-010 と同じ Gate 構造
- Phase 1b はコンテンツ整備（Skills / Career 実データ化、About / Privacy 文面確定、Contact フォーム化、初期記事セット）。デザインブラッシュアップは Phase 1c（v3.9 Phase 再編、Decision #25）
- Phase 1a の仮 HEX → Phase 1c で確定 HEX に置換するため、どのファイルに仮 HEX が使われているかの一覧が申し送りで重要

## Phase 1b への申し送り

記入日: 2026-06-14（Phase 1a 全 PBI Done + 検証コマンド 5 種 green + CI green を確認のうえ集約）

### 確定した技術前提（実際に動いた構成）

- スタック: Astro 6.3.1 + Tailwind v4（`@tailwindcss/vite`）+ shadcn/ui（Radix + Nova preset）+ TypeScript strict + Yarn 4 + Biome v2 + Vitest + Playwright。全て計画どおり稼働
- Content Collections は `src/content.config.ts`（`src/content/config.ts` ではない）。glob loader の `base` は `"./src/content/posts"`、schema を `({ image }) => z.object(...)` の関数形式にすると `image()` ヘルパーが効く
- 画像最適化: `src/assets/posts/` 配下を `<Image>` で import して WebP 化（`public/` 配下は最適化対象外）
- コードハイライト: Shiki + `github-light`（追加依存ゼロ・ビルド時レンダリング・クライアント JS なし）
- 和文フォント: `@fontsource-variable/noto-sans-jp` セルフホスト（CSP 設定不要）
- OGP / JSON-LD: BaseLayout で静的出力。PostLayout で Article JSON-LD、`src/lib/jsonld.ts` に `buildArticleJsonLd()` / `buildPersonJsonLd()`（AUTHOR / PUBLISHER 定数を共有）
- デプロイ: Cloudflare Workers の SSG。**404 は `wrangler.jsonc` に `not_found_handling: "404-page"` の明示が必須**（自動配信されない）
- CategoryFilter は React Island（`client:load`）が SSG 済み DOM の `hidden` を切り替える構成（記事データの二重レンダリングを回避）。Biome a11y で `role="group"` は `<fieldset aria-label>` 要求になる
- E2E は CI（`.github/workflows/ui-tests.yml`、Playwright 公式コンテナ）で自動実行し `scripts/ci-status.sh`（無認証 REST、public repo）で合否確認。ローカル/サンドボックスは Chromium 起動不可（Decision #27）

### 発生した想定外と回避策

- **サンドボックスで Chromium / Chrome 系がすべて起動不可**（Mach port 登録拒否 / crashpad 書込拒否 / `mktemp -t` の confstr 領域書込拒否）。回避: E2E は CI、Lighthouse 数値は運営者ターミナル、UI スクショは MCP Playwright、CWV 実測も MCP Playwright（実 Chromium）で分担
- dev server の stale プロセスが `:4321` に居座り `:4322/4323` へフォールバックする事象が頻発。検証時は起動ログの実ポートを確認し、停止は `lsof|kill` ではなく TaskStop（sandbox で kill 不可）
- フォント woff2 の 403（Vite `/@fs/` の symlink 由来）と `favicon.ico` 404 は dev / 旧 worktree 構成のアーティファクト（本番ビルド非影響）。favicon は 020 で暫定 `public/favicon.svg` 追加により console error 解消
- devicon アイコン: Struts は devicon 未収録。jsdelivr は不在ファイルに 404 でなく 403 を返すため、`raw.githubusercontent.com` の `devicon.json` で裏取りした
- **branch alias（`*.workers.dev`）は CF が `X-Robots-Tag: noindex` を強制付与 + 本番キャッシュ無し**。Lighthouse の Performance / SEO は構造的に検証不能 → Phase 1d 本番ドメインへ移管（A11y 90+ / BP 100 は alias で確認済み）
- worktree 由来の node_modules / symlink トラブルが続き、最終的に **worktree 廃止・feat/phase-1a 直 checkout フロー**に収束（README §10 v2.9、CLAUDE.md 反映済み）

### 計画書と実態の差分（本ゲートで対応）

- **本ゲートの「マージ」節は v3.9 以前の記述で陳腐化**。v3.9 Decision #25 で main マージ＋本番デプロイは Phase 1d へ移管済み（site-plan §7 / draft-phase1d line 42 / 技術メモ line 77）。本ゲートでは実施せず、マージ節を N/A（1d 実施）に修正した（運営者承認 2026-06-14）
- site-plan §10 未決事項のうち Q1 / Q2 / Q3 / Q4 / Q6 / Q7 / Q10 / Q12 は Phase 1a 中に確定済みだが §10 が未反映だった → 本ゲートで §10 を確定反映に修正
- site-plan §12 の README 参照が v2.8（実際は 008 で v2.9 化）、§6.4 構成図に `src/types/` と `public/favicon.svg` が未記載 → 本ゲートで修正
- CLAUDE.md は実態と齟齬なし（スタック / worktree 不使用フロー / §7 検証ゲート / 仮 HEX→1c の記述すべて整合）

### 仮 HEX（実体は oklch 暫定値）の所在一覧 ※ 1c で確定 HEX 置換時の対象

- 定義元: **`src/styles/global.css` の 1 ファイルに集約**。`--color-hibari-*`（7 個）+ `:root` の shadcn セマンティックトークン（`--primary` / `--accent` / `--earth` / `--ring` / `--chart-*` / `--sidebar-*`）+ `.dark` variant
- 利用側 10 ファイル: `CareerTimeline.astro` / `Header.astro` / `Hero.astro` / `ui/button.tsx` / `PostLayout.astro` / `404.astro` / `about.astro` / `contact.astro` / `index.astro` / `privacy.astro`（`hibari-*` クラス + セマンティッククラス経由）
- 1c での置換は global.css の定義値を差し替えれば利用側は連動（セマンティックトークン経由のため）。あわせて color-contrast の axe 除外解除（`tests/e2e/a11y.spec.ts`）と heading-order（`BlogCard` 見出しレベル）も 1c で対応（draft-phase1c B-1）

### Phase 1b 起票時の注意（コンテンツ整備。デザインは 1c なので本節はコンテンツ観点のみ）

- Career は実データが少ない（R-08）。id=2 の役割は一次情報がなく非表示。実案件サマリ 1-2 件を運営者インプットで追加する
- Skills は Struts / VB.Net / GAS がアイコンなし表示。実データ更新時に再点検
- About / Privacy の文面は仮確定（Q2 = ですます調 × 見出し整理型、Q10 = 簡易案）。1b で事実確認・運営者承認を取る
- Contact は現状 mailto（`tanimoto@byte-lark.com`）。FR-29 でフォーム化（Worker `/api/contact` + Turnstile + Resend、送信元 `send.byte-lark.com`）。そのための DNS レコード追加は 1d の移管リストに含める
- サンプル記事 `hello-astro-content-collections.md` と `draft-sample.md` の処置（残す / 差し替え / 削除）を 1b で決める
- 記事本文の冒頭に `# タイトル` を重複させない（PostLayout が title を h1 出力）。new-post テンプレで担保済み。記事 title は `| byte-lark.com` サフィックス無しで素のまま渡す（JSON-LD headline 汚染防止）

### Phase 1b で先に決めるべき事項

- 初期記事セットの本数とネタ（ネタ出し PBI で確定。R-01 の月次ネタ出し routine もここで点火検討）
- Career に追記する実案件サマリの内容（運営者インプット待ち）
- Contact フォーム化の詳細（Turnstile / Resend アカウント準備、送信先アドレス）
- About / Privacy の最終文面承認

### ドラフト 2 本の正式化指示

- **1b 起票時**: `docs/pbi/draft-phase1b-content-launch-prep.md` を番号付き PBI 群として正式化する
- **1d 起票時**: `docs/pbi/draft-phase1d-domain-launch.md` を番号付き PBI として正式化する（**main マージ＋本番デプロイ＋公開はここで実施**。本ゲートから移管した作業）
- いずれも正式化時、全 PBI 受け入れ条件に §7 検証ゲート 3 項目（ローカル / CF preview スクショ + E2E/CI green）を常設すること（README §4.6 ルール 7）

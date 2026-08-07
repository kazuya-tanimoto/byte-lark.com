# 訪問者は Skills ページで全項目のアイコンを見られ、各技術が実態に合ったカテゴリに並んでいる状態で読める

Status: InProgress
Started: 2026-08-07

## 誰が
- 訪問者（PC / スマホ）

## 何をできる
- Skills ページの全 34 項目がアイコン付きで表示され、カードの見た目が揃っている
- Oracle が Databases、GAS が Languages に並んでいる

## なんのために
- 現状 11 項目にアイコンがなく、カードが不揃いに見える（運営者指摘 2026-08-07）
  - VB.Net / SQL / Struts / GAS と、AI 活用の全 7 項目
  - PHASE1B-001 の起票時に devicon だけを照合し「無いものはアイコンなしで統一」と判断していたが、Iconify まで範囲を広げると 11 項目すべてに該当アイコンが存在すると判明
- Oracle が OS / Middleware に、GAS が Tools に置かれており、実態と合っていない（運営者指摘 2026-08-07）
- あわせて、アイコンの外部 CDN 直リンクを自前ホストへ移す
  - PHASE1C-008 でコンテナから jsdelivr へ到達できず、Skills アイコンの実表示だけ運営者の目視に頼らざるを得なかった（INDEX 2026-08-01）。同一オリジンにすれば §7 のスクショ検証が完結する
  - 外部 CDN の障害・仕様変更でアイコンが消えるリスクをなくす

## 受け入れ条件
- [x] Skills ページの全 34 項目にアイコンが表示される（アイコンなしの項目が 0）
- [x] Oracle を OS / Middleware から Databases へ、GAS を Tools から Languages へ移す
- [x] アイコンを `public/icons/` に自前ホストし、`src/data/skills.ts` の参照を外部 URL から同一オリジンのパスへ変更する（外部 CDN 参照 0 件）
- [x] アイコンの出典・ライセンスを `public/icons/LICENSE.txt` に明記する（MIT は著作権表示と全文を同梱）
- [x] 既存 23 項目のアイコンは現行と同じ SVG を使い、見た目を変えない
- [x] スマホ幅・PC 幅ともカードの高さと左端が揃っている
- [x] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` エラーなし
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 関連ファイル: `src/data/skills.ts`、`public/icons/*.svg`（新設 34 件）、`public/icons/LICENSE.txt`（新設）、`src/components/SkillSet.astro`（img のサイズ指定のみ）
- アイコンの入手先照合（2026-08-07 実施、全件 HTTP 200 を確認）
  - devicon 全 578 件 / simple-icons 全 3,453 件 / Iconify の logos・tabler を実際に取得して名前照合した
  - 欠けていた 11 件の入手先
    - VB.Net: `devicon:visualbasic`
    - SQL: `tabler:sql`（標準規格でブランドロゴが存在しないため唯一の汎用アイコン。ここだけ線画になる）
    - Struts: `logos:struts`
    - GAS: `simple-icons:googleappsscript`（`?color=%234285F4`）
    - Claude: `logos:claude-icon` / Claude Code: `simple-icons:claudecode`（`?color=%23D97757`）
    - Cursor: `simple-icons:cursor` / GitHub Copilot: `logos:github-copilot`
    - ChatGPT: `logos:openai-icon` / Gemini: `logos:google-gemini` / MCP: `logos:model-context-protocol-icon`
  - 既存 23 件は現行の jsdelivr URL からそのまま取得（見た目を変えないため）
  - 取得時に `<title>` を除去（`<img>` 経由でも読み上げ対象にしないため）
- 配信方法の検討
  - 採用: `public/icons/` に置いて `<img src="/icons/*.svg">`。同一オリジンで完結し、HTML は膨らまない
  - 不採用: astro-icon でビルド時にインライン化。最新 1.1.5 が 2024-12-26 公開でリポジトリの最終 push も 2025-03-31、本プロジェクトの Astro 6.4.6 への対応が示されていない。さらに未解決 issue「Unable to locate @iconify-json/\* packages on build when installed with yarn v4」（2025-01-22 open）が本プロジェクトの Yarn 4 Berry 構成に直撃する
  - 不採用: Vite の `import.meta.glob` + `?raw` で自前インライン化。依存は増えないが、SVG 合計 356KB（うち `linux.svg` が単体 194KB）が Skills ページの HTML に乗る
- 触ってはいけない領域: 確定デザイントークンの値（PHASE1C-002 / 003）、`SkillSet.astro` のレイアウト（署名要素 PHASE1C-008 の確定分）

## 備考
- Gate である PHASE1C-012 より先に着手する（PHASE1C-013 と同じ扱い）。012 の完了確認対象に本 PBI を追加済み
- 2026-08-07 に運営者判断で 2 件差し替え済み（下記実装ログ参照）：`linux` は devicon の写実的な Tux（194KB）から `logos:linux-tux`（11KB）へ、`gemini` はワードマークからシンボルへ

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-07 調査 + 実装（push 前まで）

やったこと：

1. アイコンの入手先を洗い直した。当初 devicon と simple-icons だけを見て「SQL / Struts / ChatGPT は存在しない」と報告したが誤りで、Iconify まで広げると 11 件すべてに該当アイコンがあった。範囲を狭く取ったまま「無い」と断定していた
2. 34 件の SVG を `public/icons/` へ取得（既存 23 件は現行 URL、新規 11 件は Iconify）。`<title>` は除去
3. `public/icons/LICENSE.txt` を作成（devicon MIT / Tabler MIT / SVG Logos CC0 / Simple Icons CC0 + 商標の注記）
4. `src/data/skills.ts` を書き換え。Oracle を Databases へ、GAS を Languages へ移し、id を並び順で 1〜34 に振り直し、`icon` を全件 `/icons/*.svg` に変更

検証（push 前）：

- `yarn check:ts` 0 errors / `yarn check` 38 ファイル no fixes / `yarn test:run` 30 passed / `yarn build` 11 ページ成功
- ビルド成果物で `dist/skills/index.html` の `/icons/*.svg` 参照が 34 件、`dist/icons/` に 35 ファイル（SVG 34 + LICENSE）を配置。外部 CDN 参照は 0 件

### 2026-08-07 ローカル検証 + 差し替え 2 件 + サイズ統一

アイコンを 80px に拡大して 1 件ずつ見た結果、2 件を運営者判断で差し替えた。

- `gemini`：`logos:google-gemini` は「Gemini」のワードマークで、AI 活用の他 6 件がシンボルなのでそこだけ浮いていた → `simple-icons:googlegemini`（`?color=%23076eff`）の四芒星へ
- `linux`：devicon の写実的な Tux は単体 194KB で、他 33 件の合計より大きかった → `logos:linux-tux`（11KB）へ。28px 表示では両者の区別がつかないことをスクショで確認したうえで判断。`public/icons/` 全体が 356KB → 180KB に

実測でアイコンの表示サイズが不揃いなことが判明し、`SkillSet.astro` を修正した。

- `<img width="28" height="28">` を指定していても、Tailwind の preflight が `img { height: auto }` を当てるため高さが SVG の縦横比で決まる。既存 23 件はすべて正方形だったので表面化していなかったが、`struts`（256×290）や `claude-code`（横長）を足した時点で 28×32 / 28×23 が混在した
- `class="size-7 shrink-0 object-contain"` を追加して 28×28 の枠に収める形に統一

検証（ローカル preview、`fonts.ready` 後に DOM 実測）：

| 項目 | 結果 |
|---|---|
| アイコン表示数 | 34 件（アイコンなし 0） |
| 画像の実表示サイズ | 全件 28×28（修正前は 28×28 / 28×32 / 28×31 / 28×23 の 4 種） |
| 読み込み失敗 | 0 件（遅延読み込み分もスクロール後に全件 `naturalWidth > 0`） |
| カード高さ | 年数ありのカテゴリは全件 70px、AI 活用は全件 52px（年数行の有無による差のみ） |
| カード左端 | 390px 幅で 16px / 203px の 2 列に揃う |
| 外部 CDN 参照 | 0 件 |

- `yarn build`（11 ページ）/ `yarn check`（38 ファイル）/ `yarn check:ts`（0 errors）/ `yarn test:run`（30 passed）すべて成功
- ローカル スクショ：PC 1280px / スマホ 390px

学び：

- アイコンを増やすときは縦横比の違いを疑う。`width`/`height` 属性は CSS の `height: auto` に負けるので、枠のサイズは CSS 側（`size-7` + `object-contain`）で決める
- Vite の dev server は別オリジンからの画像取得を拒否する。比較用ページを別ポートで立てて dev server の SVG を参照したら全部壊れ画像になった → 検証用の素材はファイルごとコピーして同一オリジンに置く
- dev server はサンドボックスでファイル変更を拾わないので編集後に再起動が要るが、`pkill` が効かず旧プロセスが 4321 を握ったままだった。新しい server は 4322 に退避して起動しており、4321 を見ている間は古い出力を検証し続けていた。**ポート番号を確認せずに「反映されない」と判断しないこと**（起動ログの `Local` 行を読む）

残タスク：commit / push → CF preview スクショ確認 → CI green 確認 → Done 化

つまずき：

- MCP Playwright が `Browser is already in use`（プロファイル `mcp-chrome-a396f62`）で起動できず、一度ローカル検証が止まった。sandbox で `ps` が使えず掴んでいるプロセスを特定できないため、運営者に `pkill -f mcp-chrome-a396f62` を実行してもらって解消した

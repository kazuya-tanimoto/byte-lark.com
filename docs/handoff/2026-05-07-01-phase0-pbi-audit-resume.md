# 引継書 — Phase 0 PBI Audit Resume（非 PBI 含む包括 cross-doc 整合性 check と未適用 drift の補正完遂）

作成日: 2026-05-07
作成元セッション: Handoff 01 (`docs/handoff/2026-05-06-01-phase0-pbi-audit.md`) を一部実行。PBI 内 drift 補正は適用したが、(a) library version 全件照合の指示違反、(b) 非 PBI 横断 cross-check の矮小化、(c) Node 22 vs 24 判断混乱の 3 点で品質低下、コンテキスト圧迫もありここで打切り、新規セッションへ引き継ぎ。
受け取り先: 新セッション（kickoff prompt は本ファイルパスを指定して読ませる）

**前提**：本タスクは Handoff 01（Phase 0 PBI Audit）の続編。Handoff 01 § 9 Done 条件のうち未充足のものを完遂する。Handoff 02（PHASE0-002 Resume）は本タスク完了後に着手。

---

## §1 タスク goal（1 行）

Handoff 01 § 9 Done 条件を **すべて** 満たし、Phase 0 PBI 群と全関連ドキュメント間の version / 参照 整合性が一次情報で裏取りされた状態にして、`feat/phase-0` に commit（push は運営者承認後）まで完遂する。

## §2 前セッション（2026-05-07）の成果と未完了

### 完了（main repo `feat/phase-0` に 6 commit、push 未実施）

```
2239fc2 docs(plan): correct site-plan v3.7 Astro 5→6 references in §7 roadmap and risk table
e229b1e docs(pbi): record drift-free audit result for PHASE0-003/004/007/009/010
6db093b docs(pbi): bump pbi/README to v2.8, expand §5.3 step 2 verify scope to setup approach
5ac39c8 docs(pbi): correct PHASE0-008 spec to drop unverified CF_PAGES_USE_COREPACK env var
88b99df docs(pbi): correct PHASE0-006 spec for Astro 6 in stack and README template
5eed317 docs(pbi): correct PHASE0-005 spec for Astro 6, README v2.8 ref, and replace stale NOTE-header criterion
```

### 未完了（次セッションで完遂すべき）

1. **残存 drift 4 箇所の補正**（§4 で詳述）：
   - `docs/site-plan.md` line 506: `README.md v2.4` → **v2.8**
   - `PHASE0-008` line 27: `Node version: 20.x` → **Node 22 or 24**（§5 の判断後）
   - `PHASE0-006` line 24: `Prerequisites（Node 20+, Yarn 4）` → **Node 22+ or 24+**
   - `PHASE0-006` line 58 (template): `Node.js 20+` → **同上**
2. **非 PBI 包括 cross-check が未実施**（§6 で詳述）：library version 軸のみ表面的に grep。PBI ID 参照・§N 参照・ファイルパス・日付・Phase ラベル・URL の 6 軸 × 全関連ドキュメントの **網羅照合は未着手**。
3. **判断保留 2 件**（§5 で詳述）：Node 22 vs 24 の最終決定、Cloudflare Pages vs Workers の structural 論点。
4. **push 未実施**：feat/phase-0 が origin より 6 commit ahead（運営者承認後に push）。

### 前セッションでの Don't Guess 違反 / 失敗（次セッションが踏まないため記録）

1. **library version 全件照合の不徹底**：Handoff 01 §5 step 3 「npm registry：…で latest version」は **`Astro 5.x` 等**（"等" = etc.）と書かれていた。にもかかわらず初期 audit で Astro / Biome / Yarn / Node のみ照合、Tailwind / TypeScript / Vitest / Playwright / Lucide / Lefthook / @astrojs/* / Wrangler / @tailwindcss/vite を **未照合のまま「drift なし」判定**。運営者指摘 (`指示には明確に一次情報調べてチェックしろって書いてないの？`) を受けて belated 照合 → 結果 drift なし（PBI に specific patch 未 pin のため）だったが、process としては規律違反。
2. **Node 22/24 判断の根拠提示ミス**：`raw.githubusercontent.com/nodejs/Release/main/schedule.json` の primary source を確認する前に「Node 22 = conservative で妥当」と評価、project 既存決定を前提に正当化した。schedule.json で確認した事実は：
   - Node 22: Active LTS 2024-10-29〜2025-10-21、Maintenance LTS 2025-10-21〜2027-04-30、EOL 2027-04-30
   - Node 24: Active LTS 2025-10-28〜2026-10-20、Maintenance LTS 2026-10-20〜2028-04-30、EOL 2028-04-30
   - 2026-05-07 現在 **Node 24 が Active LTS（公式現行推奨）**、Node 22 は Maintenance LTS（security/critical fix のみ）
   - 「Node 24 はまだ安定版じゃない」は 2025-10-28 より前なら正しかったが、現時点では事実として誤り
3. **非 PBI 横断 check の矮小化**：運営者の `あとPBI以外はバージョン不整合無い？site-plan.mdとか関連するDocs間で不整合無いようにしたい` を library version 軸のみで応答、PBI ID / §N / 日付 / file path / URL 等の他軸を check せず。指摘 (`PBI以外は見てないの？無視してる？`) を受けて handoff に切替。
4. **Bash CWD ドリフト**：`cd .claude/worktrees/phase-0-pbi-002` を実行した bash command 後、後続 bash 全てが worktree CWD で動作。grep / git log の結果が main repo ではなく worktree の状態を反映、「自分の commit が消えた」誤検知に至った。`Bash` ツールは「working directory persists between commands」仕様なので、worktree から戻るときは明示的に `cd /Users/kazuya/src/react-blog && ...` 必須。

## §3 必読ドキュメント

1. **`docs/handoff/2026-05-06-01-phase0-pbi-audit.md`**（Handoff 01、本タスクの原典・Done 条件）
2. `docs/pbi/README.md` v2.8（最新の PBI フォーマット規約、§5.3 step 2 の verify ルール強化済）
3. `docs/pbi/INDEX.md`（PBI 状態一覧）
4. `docs/site-plan.md` v3.7（特に **§14「バージョン参照箇所一覧（メンテ用）」** が cross-doc check の既存ガイドラインとして使える）
5. `docs/operation-manual.md`（運営者向けプロトコル）
6. 各 PBI 本文（PHASE0-003 〜 010）

## §4 残存 drift（適用待ち）

| # | 場所 | 現状 | 修正案 | 一次情報 / 根拠 |
|---|---|---|---|---|
| D1 | `docs/site-plan.md` line 506 | `docs/pbi/README.md v2.4 を参照` | `v2.8 を参照` | 本セッション commit 6db093b で README を v2.8 化 |
| D2 | `docs/pbi/20260501-PHASE0-008-cloudflare-pages-setup.md` line 27 | `Node version: 20.x（PHASE0-002 の .nvmrc と一致）` | §5 Q1 の判断後に確定 | Node 20 EOL（2026-04-30）、PHASE0-002 worktree session 1 で `.nvmrc=22` 設定済（commit a672c66） |
| D3 | `docs/pbi/20260502-PHASE0-006-readme-stub-update.md` line 24 | `Prerequisites（Node 20+, Yarn 4）` | §5 Q1 の判断後に確定 | 同上 |
| D4 | `docs/pbi/20260502-PHASE0-006-readme-stub-update.md` line 58 (template) | `Node.js 20+` | §5 Q1 の判断後に確定 | 同上 |

D1 は判断不要、即補正可能。D2-D4 は §5 Q1 判断確定後に補正。

### 範囲外で報告のみ（Handoff §10 で本タスク改訂禁止 = PHASE0-002）

PHASE0-002 内にも同種 drift：
- title line 1: `Astro 5 + Tailwind v4 + shadcn/ui の初期プロジェクト` ← 本文は Astro 6 補正済だが title は Astro 5 残存
- line 61: `.nvmrc または .tool-versions に Node 20.x（または LTS）を pin` ← 実装で `.nvmrc=22` 確定済

→ **Handoff 02（PHASE0-002 Resume）の worktree 内で併せて補正する**。本タスクで触れない。

## §5 判断保留事項（運営者に相談 → §4 / §6 適用に反映）

### Q1：Node 22 を維持するか、Node 24 に切り替えるか

**事実**：
- Node 22 = Maintenance LTS（2025-10-21〜2027-04-30 EOL）。security / critical fix のみ。
- Node 24 = Active LTS（2025-10-28〜2026-10-20 まで Active、その後 Maintenance、2028-04-30 EOL）。**現行公式推奨**。
- どちらも production-safe / LTS。
- worktree PHASE0-002 session 1 では `.nvmrc=22` で実装済（Yarn 4.14.1 動作確認済）。

**選択肢と影響**：
- (a) **Node 24 に切替**：worktree `.nvmrc=22` → `24`、PHASE0-002 / 006 / 008 PBI を 22→24 で揃える、`yarn install` 再実行、Phase 1a 以降の library 追加で max compatibility。コスト: 約 10 分の機械作業 + 動作再確認。
- (b) **Node 22 維持**：作業ゼロ。Maintenance LTS の 1 年余りで EOL（2027-04）が来る。Phase 1a 以降の依存追加で Node 24+ 前提のものが現れたら追従コスト発生。
- (c) **記述抽象化**：PBI 本文を「Node LTS（22 以降）」とバージョン願講、実体は 22。後で 24 切替を独立 PBI 化。

**推奨**：(a) Node 24 切替（事実→影響→推奨の規律）。理由：(i) Active LTS が公式現行推奨、(ii) EOL runway が 1 年長い、(iii) 切替コストが Phase 1a 以降に library 追加が増える前ほど小さい、(iv) 前セッションの「24 はまだ安定版じゃない」根拠は 2025-10-28 で消失済。

ただし worktree 状態 (`.nvmrc=22`、yarn 4.14.1 動作実績) は運営者の意思決定で固められたもの。次セッションは AskUserQuestion で確認してから動く。

### Q2：Cloudflare Pages 維持か Workers 検討か

**事実**：
- `docs.astro.build/en/guides/deploy/cloudflare/` が「Cloudflare recommends using Cloudflare Workers for new projects」と記述。
- Decision Log #17（site-plan.md line 421）は Cloudflare Pages を確定済。
- PHASE0-008 PBI 全体が Pages 前提（GitHub 連携 / Build command / preview 等）。

**選択肢**：
- (a) Pages 維持で続行：Decision #17 を尊重、PHASE0-008 そのまま実装。
- (b) Workers 検討：別 PBI で Workers + `@astrojs/cloudflare` adapter + wrangler.jsonc 構成を再設計、PHASE0-008 を Workers 版に書き換え or 新 PBI に置換。

**判断**：本 audit task のスコープ外。次セッションは AskUserQuestion で運営者に上げ、Pages 維持なら本 handoff の §4 D2-D4 + §6 のみで完了、Workers 切替なら別 handoff 起票し本 task は (a) として完了させる。

## §6 非 PBI 包括 cross-check（未実施、次セッションで網羅実施）

前セッションで library version 軸のみ表面的に grep し済み：drift なし（PBI に patch 未 pin）。**他 6 軸が未着手**。site-plan.md §14 のメンテ用 grep パターン表が既に存在するので、それを起点に拡張する。

### Check 軸 ×（対象ドキュメント）

| 軸 | 何を check | 推奨 grep / 手法 |
|---|---|---|
| (a) library / runtime version | Astro 6 / Tailwind v4 / Biome v2 / Yarn 4 / Node version / TypeScript / Vitest / Playwright / Lucide / Lefthook / @astrojs/* | `grep -rnE "Astro [0-9]\|Tailwind [0-9v]\|Biome [0-9v]\|Yarn 4\|Node ?[0-9]\|React [0-9]" docs/ CLAUDE.md README.md` ＋ npm registry の latest 照合（@biomejs/biome / astro / tailwindcss / @tailwindcss/vite / typescript / vitest / @playwright/test / lucide-react / lefthook / @astrojs/{react,mdx,sitemap,rss} / wrangler）。**「PBI に未 pin」と「ドキュメント間で食い違っていない」は別問題**、後者を check |
| (b) PBI ID 参照 / 件数 | `PHASE0-NNN` の存在・順序・件数 | `grep -rn "PHASE0-" docs/ CLAUDE.md \| sort \| uniq -c`、INDEX.md の表と各 PBI 内の依存記述・受け入れ条件・備考の cross-ref を突合 |
| (c) §N（章番号）参照 | `§5.3` `§10.6` `§14` 等の crossref が現行構造と一致するか | `grep -rnE "§[0-9]+(\.[0-9]+)?" docs/`、各参照先 doc の TOC と突合 |
| (d) ファイルパス | `docs/pbi/README.md` `CLAUDE.md` `docs/site-plan.md` 等のパスが renamed / moved されていないか | `grep -rnE "docs/[a-z-]+\.md\|src/[a-z/]+\.[a-z]+" docs/ CLAUDE.md README.md` |
| (e) 日付（最終更新） | 各 doc 冒頭の `最終更新: YYYY-MM-DD` が直近の更新と整合 | site-plan.md / pbi/README.md / pbi/INDEX.md / operation-manual.md の最終更新行を Read |
| (f) Phase ラベル | `Phase 0/1a/1b/1c/2` の名称・スコープ記述がドキュメント間で一致 | `grep -rnE "Phase [0-9][a-c]?" docs/` |
| (g) URL | 公式 docs URL（biomejs.dev / docs.astro.build / lefthook.dev / developers.cloudflare.com / nodejs.org 等）が 200 を返す | `grep -rnE "https?://[^\s\)\]]+" docs/` で抽出、抜粋を WebFetch で生存確認（少なくとも本タスクで言及した URL） |

### 対象ドキュメント

- `docs/site-plan.md` v3.7
- `docs/pbi/README.md` v2.8
- `docs/pbi/INDEX.md`
- `docs/operation-manual.md`
- `docs/pbi/*.md`（PHASE0-001〜010）
- `CLAUDE.md`（root, slim 暫定版）
- `README.md`（旧 Vite 版、PHASE0-006 で置換予定）
- `biome.jsonc`（schema URL、PHASE0-004 で更新予定）

### 推奨手順

1. site-plan.md §14 の grep パターン 4 種を実行 → 漏れ箇所を抽出
2. 上の 7 軸 × 8 ドキュメントのマトリクスで grep / Read を網羅実施
3. drift があれば一次情報（npm registry / 公式 docs / git ls-tree 等）で裏取り
4. drift 補正は 1 軸 1 commit が原則（軸を混ぜない）
5. PHASE0-002 / worktree 系の drift は **本タスクで触らず** Handoff 02 に申し送り

## §7 既知の drift 候補（前セッションで気付いたが未確定の追加メモ）

- `README.md` line 7「React 18」：旧 Vite README、PHASE0-006 で全文置換予定なので drift 補正不要（PHASE0-006 着手時にまとめて消える）。**ただし非 PBI 包括 check で他に同種が無いか念押し**。
- `biome.jsonc` `$schema: ".../1.5.3/..."`：PHASE0-004 で `migrate --write` 時に更新される予定なので drift 補正不要。
- `@astrojs/react@5.0.4` の peer-dep が `react: ^17.0.2 || ^18.0.0`：Astro 6 + React 19 の組合せで peer warning 可能性。**PBI 文言の話ではなく PHASE0-002 着手時の peer-dep 調整 or `--legacy-peer-deps` 系の判断事項**。Handoff 02 の Step 3（integrations 段階追加）で `yarn astro add react` 実行時に発覚しうるので注意点として記載。

## §8 Done 条件

- [ ] §4 D1 補正済（site-plan v2.4 → v2.8）
- [ ] §5 Q1 判断確定 → §4 D2-D4 補正済
- [ ] §5 Q2 判断確定 → 結果に応じて handoff 起票 or PHASE0-008 そのまま
- [ ] §6 非 PBI 包括 cross-check（7 軸 × 8 doc）実施済、検出 drift 全件補正済
- [ ] feat/phase-0 に追加 commit を docs(pbi) / docs(plan) prefix で push（push は運営者承認後）
- [ ] Handoff 01 § 9 Done 条件すべて check 済
- [ ] 後続 Handoff 02（PHASE0-002 Resume）に進める状態

## §9 注意事項

- **Bash の CWD は session 跨ぎで persist する**（前セッションで踏んだ罠）。`cd .claude/worktrees/...` を一度でも実行したら、その後の bash command も worktree 内で動く。明示的に `cd /Users/kazuya/src/react-blog && ...` で main repo に戻るか、絶対パスで `git -C /Users/kazuya/src/react-blog ...` を使う。grep / git log の出力が「想定と違う」ときはまず `pwd` を確認する。
- **state-change action は実行前に運営者承認**（feedback memory `feedback_confirm_before_state_change.md`）：commit / push / branch / worktree 操作は内容提示 → 承認 → 実行。本 audit task は docs 単独修正なので feat/phase-0 直 commit OK（README §10.4 の例外）、push のみ承認必要。
- **PBI 本文は PHASE0-002 を含めて改訂しない**（Handoff 01 §10 を継承）。worktree branch (`feat/phase-0-pbi-002`) は触らず、PHASE0-002 の drift は Handoff 02 で対応。
- **InProgress 化していない PBI の Status は NotStarted のまま維持**（README §5.1 逆遷移しない原則）。
- **audit で構造的問題（PBI 統廃合 / 別 Phase へ移動 等）が見つかった場合は運営者に相談**。Claude 単独判断で PBI を統廃合しない。
- 並行で worktree (`feat/phase-0-pbi-002`) も生きているため、`feat/phase-0` の `INDEX.md` 等を変更すると merge 時に conflict 可能性。**INDEX.md は触らない**（README §10.7）。
- **3 回試行で詰まったら運営者に相談**（feedback memory `feedback_investigate_before_retry.md`）：env var 試行錯誤等の loop に入らない。

## §10 補足：site-plan.md §14 grep パターン（出発点）

site-plan v3.7 §14（line 539-549 周辺）の表を実行起点として活用：

| パターン | 想定箇所 | 確認コマンド |
|---|---|---|
| `v3.x` | site-plan / INDEX / PHASE0-005 / PHASE0-010 / operation-manual / CLAUDE.md | `grep -rn "v3\." docs/ CLAUDE.md` |
| `v2.x` | README.md タイトル / 改訂履歴 / 各 PBI の README 参照（PHASE0-005 内含む）/ site-plan §12 | `grep -rn "v2\." docs/` |
| PHASE0-NNN 件数 / 範囲 | INDEX.md 表 / §7 ロードマップ / PHASE0-009 / PHASE0-010 受け入れ条件 | `grep -rn "PHASE0-" docs/` |
| ファイルリネーム時 | INDEX.md / 各 PBI の参照 / site-plan §6.7 | `grep -rn "<旧ファイル名>" docs/` |

§14 の表自体も「site-plan / README / PBI のバージョンや件数」軸限定。**§6 の Check 軸 (a)〜(g) でこれを拡張**して網羅を担保すること。

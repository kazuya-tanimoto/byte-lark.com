# サイト構築計画書 改訂履歴

[site-plan.md](site-plan.md) の改訂履歴。**版ごとの主な変更**（旧・計画書冒頭の引用ブロック）と**改訂履歴表**（古い順、新しい行を表の末尾に追記）を収める。追記の同期ルールは site-plan §14 の運用ルールに従う。

## 版ごとの主な変更（新しい順）

> v3.15 → v3.16 主な変更：**「先頭へ戻る」ボタンを全ページ共通・ページ先頭固定に変更（PHASE1E-009）**。戻り先をページの先頭に統一し、全ページに出し、フッターで隠す挙動を削除。画面幅では出し分けず、常時見える追従目次が出ている間だけ出さない（Decision #33、monotrip.jp Decision #30 の横展開）。CLAUDE.md 連動更新。

> v3.14 → v3.15 主な変更：**§14 バージョン参照チェックのスクリプト化（PHASE1E-007）**。現行版数の相互参照検査を `scripts/check-version-refs.sh` に実装し lefthook pre-push へ組み込み（§14「将来の自動化」を実装済みに更新）。R-13 のオフサイト mirror バックアップは見送り確定（Decision #32）。CLAUDE.md 連動更新。

> v3.13 → v3.14 主な変更：**計画書と INDEX の分割（読み込み効率化、PHASE1E-005）**。改訂履歴と「版ごとの主な変更」を `docs/site-plan-history.md` へ、Decision Log 本体を `docs/site-plan-decisions.md` へ切り出し（§8 は誘導スタブ、参照表記「site-plan §8 Decision #NN」は不変）。INDEX.md の改訂履歴も `docs/pbi/INDEX-history.md` へ切り出し。あわせて §12 の README 参照のドリフト（v3.9 のまま、現行 v3.11）を修正。§14・CLAUDE.md 連動更新。

> v3.12 → v3.13 主な変更：**公開後の運用形態の確定**（Phase 1d Gate = PHASE1D-009）。① 統合ブランチ `feat/phase-1` を畳み、main 起点の「1 作業 1 ブランチ → PR」に戻す ② Phase 1e を「カテゴリ別一覧」から「公開後の運用・改善」に再定義（カテゴリ別一覧と前後記事リンクは記事 10 本到達時に同 Phase へ追加起票）③ ダークモードはやらないと確定。Decision #31 追加、§7 ロードマップ 1e 行・現在地図・§12 次アクションを公開後の実態に更新。README v3.9 / CLAUDE.md / operation-manual.md 連動。

> v3.11 → v3.12 主な変更：**記事ライセンスの変更（CC BY 4.0 → 通常の著作権表記）**。Footer の CC BY 表記を削除して © のみとし、Privacy ページに「著作権について」節を新設（出典明記の引用は歓迎 / 全文転載・二次利用は Contact へ相談）。CC BY は全文転載 + 広告収益化をクレジットのみで合法化するため Phase 2 の収益化計画と相性が悪く、配布後は取消不能のため公開（1d）前に変更。Decision #30 追加、Q12・R-09・CLAUDE.md（版数参照）連動。

> v3.10 → v3.11 主な変更：**初期記事セットの縮小（6 本 → 3 本、公開優先）**。公開前に揃える記事を T1 サイト構築総括（PHASE1B-008、公開済み）+ T2 自前フォーム実装（PHASE1B-009）+ L1 法人化（PHASE1B-012）の 3 本に縮小し、残り 3 本（T3 レガシー移行 / T5 PO 業務 / L2+L3 ストレングス）は `docs/article-backlog.md` に移して公開後に月次 routine（R-01）で消化する。Decision #29 追加、§7 ロードマップ 1b 行・PHASE1B-014（Gate 完了条件）・INDEX.md・article-backlog.md・CLAUDE.md 連動。PHASE1B-010 / 011 / 013 は取り下げ（Dropped、README v3.6 で状態を新設）。

> v3.9 → v3.10 主な変更：**Phase 1c 先行トラックの導入（1b 記事執筆との並行許可）**。1c（デザインブラッシュアップ）を二段構えに分割：**先行トラック**（記事非依存：デザイン方向性確定 / 確定 HEX + color-contrast 再有効化 / タイポ確定 / ロゴ刷新 / favicon / B-1 見出しレベル / B-2 フォント CLS）は 1b Gate 通過前でも起票・着手可、**仕上げトラック**（B-3 CSS サイズ / 全記事での最終再検証 / 1c Gate）は従来どおり 1b Gate 通過後に起票。Decision #28 追加、§7 ロードマップ 1c 行・「PBI の起票タイミング」節を連動更新。README §9 例外（v3.3）/ INDEX.md / CLAUDE.md / draft-phase1c-design-polish.md / PHASE1B-014 も連動。先行トラック PBI（PHASE1C-001〜007）を同日起票。

> v3.8 → v3.9 主な変更：**Phase 再編（公開の独立フェーズ化）**。新 1b = コンテンツ整備（Skills / Career 実データ化、About / Privacy 文面確定、Contact フォーム化、初期記事セット）、新 1c = デザインブラッシュアップ（旧 1b）、新 1d = 公開（NS 移管 / カスタムドメイン / Web Analytics / Search Console。旧 PHASE1A-018 を移管）、新 1e = カテゴリ別一覧（旧 1c）。Decision #25（公開フェーズ分離）・#26（Contact 自前フォーム = Worker + Turnstile + Resend）追加、FR-29 追加、FR-19 / FR-28 / Decision #4 #15 #21 #23 / R-06 #07 #08 #12 / Q11 / §6.7 の Phase 名を連動更新。**読み替え注意**：Done 済み PBI 内の旧 Phase 名は当時の表記のまま（旧 1b → 新 1c、旧 1c → 新 1e と読む）。

> v3.7 → v3.8 主な変更：Phase 0 Retrospective Gate（PHASE0-010）での事実修正。§6.4 ディレクトリ構成から `tailwind.config.ts` を削除（Tailwind v4 は CSS ベース設定のため不使用）。Decision #21 を shadcn 4.x の preset 体系（Radix + Nova）に更新。

> v3.6 → v3.7 主な変更：ブランチ運用方針確定。README.md §10 ブランチ運用 新設（Phase ブランチ + 常時 PBI sub-branch + worktree 並行 / merge --no-ff / sub-branch マージ後保持 / CF Pages Preview Branch Filter 必須 / main 保護 / Hotfix 手順）。operation-manual.md に並行 PBI 開始シーン・Phase 完了マージ承認・main 保護・CF Pages filter・Q6（push 競合対処）追加。PHASE0-007 に CF Pages Custom branches 設定追加、PHASE0-009 main マージ手順を `git merge --no-ff` で具体化。§14 row 1 拡張、運用ルール表に「ブランチ運用」「CF Pages branch filter」行追加。

> v3.5 → v3.6 主な変更：運営者向け運用マニュアル `docs/operation-manual.md` を新規作成（シーン別フレーズ表 / 中断 signal リカバリー / トラブルシューティング Q1-Q5）。INDEX.md 着手ルールに「セッション開始時の必須チェック」（§5.8 検出スクリプト実行）を必須化、CLAUDE.md ヘッダーにも同等の必須化と operation-manual.md への誘導を追加。§14 row 1 想定箇所に operation-manual.md と INDEX.md セッション開始チェックを追加、運用ルール表に「運営者向けプロトコル変更」行を追加。

> v3.4 → v3.5 主な変更：4 回目レビュー推奨を反映。§14 row 1（v3.x）の想定箇所列に PBI 内参照（INDEX.md / PHASE0-005 / PHASE0-009）を明示追加し row 2 と粒度統一、row 3 の `N 件` placeholder を `<件数> 件` に明確化、運用ルールに「改訂履歴の同期」「想定箇所列での 1 件ずつ突合」「将来の scripts 化検討」を追記。CLAUDE.md キックオフヘッダの参照をクリッカブルリンク化、INDEX.md 改訂履歴に v3.4 / v3.5 連動行を追記。

> v3.3 → v3.4 主な変更：3 回目レビューで検出された連動更新漏れ再発（§6.7 line 348 の v3.2 残存、§7 フロー図の PHASE0-001〜009 残存）を修正。再発防止のため §14「バージョン参照箇所一覧（メンテ用）」を新設。PHASE0-008 の Web Analytics 観測方法を具体化（DevTools / View Source）。CLAUDE.md にキックオフ用の暫定ヘッダ追加（PHASE0-005 で丸ごと差し替え予定だが、それまでの初動セッション向けに INDEX.md へのポインタ）。

> v3.2 → v3.3 主な変更：差分レビュー指摘を反映。連動更新漏れの修正（§6.4 writing-workflow タイミング、§12 各バージョン参照、§13.4 誤字）。PBI 側にも連動修正（PHASE0-009 受け入れ条件に PHASE0-010 含める、計画書バージョン参照を v3.3 に、PHASE0-008 の Web Analytics 計測 Done 判定を緩和、PHASE0-002 の playwright.config.ts 表現修正、PHASE0-010 の行数基準削除、PHASE0-006 ファイルリネーム、INDEX.md 構造整合）。

> v3.1 → v3.2 主な変更：Phase 0 PBI レビュー指摘を反映。writing-workflow.md の作成タイミングを Phase 0 末 → Phase 1a 冒頭に変更、Decision Log #21（shadcn style/baseColor デフォルト）追加、§6.7 既存資産取扱表を Phase 0 PBI 群と整合させた。

> v3 → v3.1 主な変更：PBI を Phase ごとに起票する方針を §7 / §12 に明記、Phase 間に Retrospective Gate を導入（Phase 0 完了 → 学び棚卸 → 次 Phase PBI 起票 → レビュー → 実装の流れを規定）。

> v2 → v3 主な変更：レビュー指摘を全面反映。Tailwind v4 統合方法の修正、デプロイ先・解析ツール確定、shadcn 利用範囲を明示、法令・コンプラ系（プライバシー / アフィリエイト表記 / 構造化データ）追加、Playwright 既存資産扱いの修正、CLAUDE.md 更新を Phase 0 タスクに、Phase 0 工数 2-3 日に修正、Phase 1a に CI / 仮 HEX / コードハイライトを移設、リスク表大幅拡張、未決事項 Q1-Q13、§13 法人化に伴う改訂を独立章化。

## 改訂履歴表（古い順）

| 日付 | 変更内容 |
|---|---|
| 2026-04-30 | v1 初版作成 |
| 2026-05-01 | v2：UI スタックを Tailwind v4 + shadcn/ui に転換、Phase 2 Next.js 移行を撤回、Phase 1 から Astro で SSG 構築、Phase 1 を 1a/1b/1c 分割、Career/Skills 抜粋化と専用ページ化、ヒバリブランドコンセプト反映、Q1-Q8 |
| 2026-05-01 | v3：レビュー指摘を全面反映。Tailwind v4 統合方法を `@tailwindcss/vite` に修正、Q8 = Cloudflare Pages 確定、Q9 = Cloudflare Web Analytics 確定、shadcn を React Island 必要箇所のみに限定、FR-22-28 / NFR-11-12 追加、Playwright 既存資産扱い修正、CLAUDE.md 更新を Phase 0 タスクに、Phase 0 工数 2-3 日に修正、Phase 1a に CI / 仮 HEX / コードハイライトを冒頭タスクに、リスク表 8 項目 → 15 項目に拡張、Q9-Q13 追加、§13 法人化に伴う改訂を独立章化、Decision Log #16-#20 追加 |
| 2026-05-01 | v3.1：PBI を Phase ごとに起票する方針を §7 / §12 に明記、Phase 間に Retrospective Gate を導入、§7 ロードマップに Gate / 次 Phase 起票ステップを追加 |
| 2026-05-02 | v3.2：Phase 0 PBI レビュー指摘を反映。§11 writing-workflow.md 作成タイミングを Phase 1a 冒頭に変更、Decision Log #21（shadcn デフォルト style/baseColor）追加、§6.7 既存資産取扱表を Phase 0 PBI 群（特に PHASE0-001 残置リスト・PHASE0-006 workflow 一時無効化）と整合 |
| 2026-05-02 | v3.3：差分レビュー反映。連動更新漏れ（§6.4 writing-workflow タイミング / §12 各バージョン・件数 / §13.4 誤字）修正、PBI 側の連動修正（PHASE0-009 範囲 + 計画書バージョン参照、PHASE0-008 Web Analytics Done 判定緩和、PHASE0-002 playwright.config.ts 表現、PHASE0-010 行数基準削除、PHASE0-006 ファイルリネーム、INDEX.md 構造整合） |
| 2026-05-02 | v3.4：3 回目レビューで検出された連動更新漏れ再発（§6.7 v3.2、§7 フロー図 PHASE0-001〜009）を修正。再発防止のため §14 バージョン参照箇所一覧を新設。PHASE0-008 観測方法を具体化、CLAUDE.md にキックオフ暫定ヘッダ追加 |
| 2026-05-02 | v3.5：4 回目レビュー推奨を反映。§14 row 1 想定箇所に PBI 内参照追加、row 3 placeholder 明確化、運用ルールに改訂履歴同期・1 件ずつ突合・scripts 化検討を追記。CLAUDE.md ヘッダのリンク化、INDEX.md 改訂履歴に v3.4/v3.5 連動行追記 |
| 2026-05-03 | v3.6：運営者向け運用マニュアル `docs/operation-manual.md` 新規作成。INDEX.md 着手ルールに「セッション開始時の必須チェック」（§5.8 検出スクリプト実行）を必須化、CLAUDE.md ヘッダにも同等の必須化と operation-manual.md 誘導追加。§14 row 1 拡張、運用ルール表に「運営者向けプロトコル変更」行追加 |
| 2026-05-03 | v3.7：ブランチ運用方針確定。README.md §10 新設（Phase ブランチ + 常時 PBI sub-branch + worktree 並行 / merge --no-ff / sub-branch マージ後保持 / CF Pages Preview Branch Filter 必須 / main 保護 / Hotfix）。operation-manual.md / PHASE0-007 / PHASE0-009 / CLAUDE.md ヘッダに連動反映、§14 row 1 拡張・運用ルール表に「ブランチ運用」「CF Pages branch filter」行追加 |
| 2026-05-03 | PHASE0 PBI 番号を着手順序に整列（旧 010→新 006、旧 006→新 007、旧 007→新 008、旧 008→新 009、旧 009→新 010）。本日以前の改訂履歴行に出てくる PBI 番号は当時の番号付けを参照 |
| 2026-05-08 | v3.8：PHASE0-010 Retrospective Gate 事実修正。§6.4 `tailwind.config.ts` 削除（Tailwind v4 は CSS ベース設定）、Decision #21 を shadcn 4.x preset 体系に更新 |
| 2026-06-13 | v3.9：Phase 再編（公開の独立フェーズ化）。1b = コンテンツ整備（新設）、1c = デザイン（旧 1b）、1d = 公開（新設、旧 PHASE1A-018 を移管）、1e = カテゴリ別一覧（旧 1c）。背景：本番 Worker が Phase 0 placeholder のまま・MX が apex 名指し・www に旧 Netlify サイト稼働という現状調査結果を受け、未完成サイトの公開を防ぐ構成に変更。Decision #25 #26 追加（公開フェーズ分離 / Contact 自前フォーム = Worker + Turnstile + Resend）、FR-29 追加、PHASE1A-020 の検証 URL を branch alias に変更、ドラフト 2 本作成（draft-phase1b-content-launch-prep.md / draft-phase1d-domain-launch.md）。Done 済み PBI 内の旧 Phase 名は当時表記のまま（読み替え：旧 1b → 新 1c、旧 1c → 新 1e） |
| 2026-06-14 | E2E 検証を CI ルートに正式化（クラリフィケーション、v 番号据え置き）。`ui-tests.yml` を Playwright 公式コンテナ化して install ハング/timeout を解消、`scripts/ci-status.sh` 追加。Decision #27 追加・NFR-06 に CI 検証注記。§7 検証ゲートを 2→3 項目化（E2E/CI green 確認を常設、README §4.6 ルール 7 / 受け入れ条件テンプレ / INDEX セッション開始チェック / CLAUDE.md §7 連動、PBI 021・022 に N/A 行追加）。PBI 019 に事後追記で前方参照。旧「E2E は運営者ターミナル手動」前提は本日以降 CI 検証に置換 |
| 2026-06-14 | Phase 1a Retrospective Gate（PHASE1A-022）での事実修正（クラリフィケーション、v 番号据え置き）。§10 未決事項 Q1/Q2/Q3/Q4/Q6/Q7/Q10/Q12 を Phase 1a 実装での確定値に反映（各 PHASE1A-006/008/009/014/015 参照）、§12 の README 参照を v2.8 → v2.9、§6.4 構成図に `src/types/` と `public/favicon.svg`〔暫定〕を追記。なお main マージ＋本番デプロイは v3.9 Decision #25 で Phase 1d 移管済みのため Gate では実施せず（PHASE1A-022 マージ節を N/A 化、運営者承認） |
| 2026-06-14 | ガバナンス文書ドリフト一括是正（クラリフィケーション、v 番号据え置き）。README §10 ブランチ運用を deferred-merge に是正し README を v3.0 → v3.1 化（公開前 1a〜1c は feat/phase-1a 集約、main マージは 1d。site-plan §7 1d 行は元から整合）。連動して §12 の README 参照を v2.9 → v3.1 に訂正（前 Gate の v2.9 修正が誤り。README 現行は v3.0 だった）、§14 メンテ表の v2.x / v3.x 行を README の v3.x 名前空間移行に合わせて更新。CLAUDE.md line 69/90・operation-manual.md（毎 Phase マージ + 旧 worktree 記述）・INDEX.md も同コミットで是正。過去事実の改訂履歴行（直前の line 含む）と Done PBI 本体は不変のまま。 |
| 2026-06-14 | 統合ブランチ改名（クラリフィケーション、v 番号据え置き。README v3.2 連動）。公開前 1a〜1c を集約する統合ブランチを `feat/phase-1a` → `feat/phase-1` にリネーム（sub-phase 名で統合ブランチを呼ぶ名前と中身のズレを解消。deferred-merge 構造は不変）。§12 の README 参照を v3.2 に更新。CLAUDE.md / README §10 / operation-manual.md / draft-phase1d の現行・前方参照と CF プレビュー URL（`feat-phase-1-...`）も連動更新。`feat/phase-*` パターン内なので CF filter / main 保護は無変更。Done PBI 本体の当時のブランチ名は不変。 |
| 2026-07-12 | v3.10：**Phase 1c 先行トラック導入（1b 記事執筆との並行許可）**。1c を先行トラック（記事非依存：デザイン方向性確定 / 確定 HEX + color-contrast 再有効化 / タイポ確定 / ロゴ刷新 / favicon / B-1 見出しレベル / B-2 フォント CLS）と仕上げトラック（B-3 CSS サイズ / 全記事最終再検証 / 1c Gate、1b Gate 後に起票）に二分。背景：1b 残タスク（記事 008〜013）が運営者リライト・ヒアリング律速で、記事非依存のデザイン作業を待たせる実益がない（実コンテンツ検証の前提は 1b-001〜005 承認済み + 008 ドラフトで実質充足）。Decision #28 追加、§7 ロードマップ 1c 行・「PBI の起票タイミング」節に例外注記、§12 参照更新。README §9 例外追加（v3.3）、INDEX.md Phase 1c 節・着手ルール、CLAUDE.md、draft-phase1c-design-polish.md 着手条件、PHASE1B-014 申し送り宛先を連動更新。先行トラック PBI（PHASE1C-001〜007）を同日起票 |
| 2026-07-30 | フォント読み込みを Astro 公式 Fonts API へ移行（PHASE1C-007、Decision #24 更新、v 番号据え置き）。`src/styles/global.css` の `@import "@fontsource-variable/*"` をやめ、`astro.config.mjs` の `fonts` 設定（provider は local、variants は `scripts/fontsource-variants.mjs` が fontsource の index.css から生成）+ BaseLayout の `<Font>` に変更。和文 Noto Sans JP は `display: "optional"`（差し替えによる本文のずれを構造的に無くす）、欧文 Geist は preload。背景：CLS はフォールバックの字形寸法差で決まり、端末の日本語フォント次第で 0.09〜0.23 まで振れることを実測。Astro の最適化フォールバックは Arial 基準で和文には効かないため和文側は無効化 |
| 2026-07-13 | デザイン方向性確定（PHASE1C-001 完了の事実反映、クラリフィケーション、v 番号据え置き）。運営者が草案 3 案（快晴 / 春空 / 野の羽色、モックは docs/design-drafts/phase1c-001/）から**案2「春空」を選定**（修正指示なし）。確定記録を docs/design-direction.md に新設（パレット HEX/oklch + AA 検証値 / タイポ方向性 / トーン・署名要素 / 002〜005 への引き継ぎ）。§6.5.2 に確定候補値の所在を追記、§6.5.3 見出し書体を Zen Kaku Gothic New に更新 |
| 2026-08-01 | ロゴ反復上限の延長（Decision #15 更新、v 番号据え置き）。PHASE1C-004 で 5 ラウンド消化（1 ボツ + 2〜5 差し戻し）後も未確定。運営者判断で上限を延長し、ラウンド 6 以降は「鳥 = 旧案1（尾を短縮 + 残像ストローク）、円と数字の滝 = 旧案2」の合意構成を画像生成 AI（Gemini）の編集ベースで作成するルートに切替。経緯詳細は PBI 実装ログ |
| 2026-07-31 | タイポグラフィ確定（PHASE1C-003、§6.5.3 を確定値に差し替え、v 番号据え置き）。見出し書体 Zen Kaku Gothic New（500 / 700）を導入し、欧文専用の Geist は廃止して本文を Noto Sans JP 一本に。サイズ / 行間を `--text-*` トークン化（本文 16px / 行間 1.95、見出し 42 / 32 / 24 / 17 / 14px）、ウェイトは 500・700 の 2 段。和文は palt +`text-wrap: balance` + `word-break: auto-phrase`、コード内の和文コメントは Noto Sans JP に固定。読み込みは見出し swap / 本文 optional（初回訪問でブランド書体が出ることと CLS 抑制の両立。実測は PBI 実装ログ）。docs/design-direction.md §3 に確定結果を追記 |
| 2026-08-02 | v3.11：**初期記事セット縮小（6 本 → 3 本、公開優先）**。公開前は T1（008 公開済み）+ T2（009）+ L1 法人化（012）の 3 本、T3 / T5 / L2+L3 は article-backlog.md へ移管し公開後に R-01 routine で消化。Decision #29 追加、§7 1b 行・§12 の自己参照更新。PHASE1B-010 / 011 / 013 を Dropped 化（README v3.6 で状態新設）、PHASE1B-014 完了条件・INDEX.md・CLAUDE.md 連動 |
| 2026-08-05 | v3.12：**記事ライセンス変更（CC BY 4.0 → 通常の著作権表記）**。Footer の CC BY 表記を削除して © のみとし、Privacy に「著作権について」節を新設（出典明記の引用は歓迎、全文転載・二次利用は Contact へ相談）。CC BY は転載収益化をクレジットのみで許すため Phase 2 収益化と相性が悪く、配布後取消不能のため公開（1d）前に変更。Decision #30 追加、Q12・R-09 更新、CLAUDE.md（版数参照）連動 |
| 2026-08-07 | Phase 1c Gate（PHASE1C-012）での事実修正（クラリフィケーション、v 番号据え置き）。§13 の現在地マーカーを §13.1 法人化前 → §13.2 移行期へ移動（PHASE1B-014 で記録に留めた持ち越し分の消化）。§12 の自己参照 v3.11 → v3.12、README 参照 v3.3 → v3.6（v3.12 改訂時の連動更新漏れ。CLAUDE.md の README 参照も同時修正）。決定内容の変更なし |
| 2026-08-10 | v3.13：**公開後の運用形態を確定**（Phase 1d Gate = PHASE1D-009）。Decision #31 追加（統合ブランチを畳んで main 起点の 1 作業 1 ブランチへ / Phase 1e を「公開後の運用・改善」に再定義 / ダークモードはやらないと確定）。§7 ロードマップ 1e 行と現在地図、§12 次アクションを公開後の実態に書き換え。あわせて Gate で検出した差分を修正：§6.7 既存資産取扱表の自己参照が v3.8 のまま（→ v3.13）、§12 の README 参照 v3.8 → v3.9。README（§10 ブランチ運用を全面改訂、v3.9）・CLAUDE.md（ブランチ運用 / branch alias URL / Sandbox 制約）・operation-manual.md（シーン別表 / Q6 / 必須チェックリスト / health-check の取得 URL）を連動更新 |
| 2026-08-08 | PHASE1D-002 での §13 実態合わせ（v 番号据え置き）。§13.2 の「byte-lark 株式会社（仮）」想定を実態（合同会社バイトラーク）へ更新、Footer / About に代表社員・所在地（市区レベル：香川県高松市、運営者決定）を追加、プライバシーポリシーに安全管理措置を明記し改定日 2026-08-08 を記載、インボイス登録番号は掲載なしで確定（直案件開始時に再検討）。incident-response.md の法人化前提記述も実態合わせ |
| 2026-08-13 | v3.14：**計画書と INDEX の分割（読み込み効率化）**（PHASE1E-005）。改訂履歴と「版ごとの主な変更」を本ファイルへ、Decision Log 本体を docs/site-plan-decisions.md へ切り出し（§8 は誘導スタブ、参照表記は不変）。INDEX.md の改訂履歴も docs/pbi/INDEX-history.md へ切り出し。§12 の README 参照ドリフト（v3.9 → 現行 v3.11）を修正、§14 の改訂履歴同期ルール・CLAUDE.md（セッション開始手順 / Related Docs）連動 |
| 2026-08-15 | v3.15：**§14 バージョン参照チェックのスクリプト化**（PHASE1E-007）。現行版数の相互参照検査を scripts/check-version-refs.sh に実装し lefthook pre-push へ組み込み、§14「将来の自動化」を実装済みに更新。R-13 のオフサイト mirror バックアップは見送り確定（Decision #32）。CLAUDE.md（Related Docs 版数）連動 |
| 2026-08-25 | v3.16：**「先頭へ戻る」ボタンを全ページ共通・ページ先頭固定に変更**（PHASE1E-009）。戻り先を全ページ共通で「ページの先頭」に統一（目次戻りを廃止）、全ページに出す（`xl:hidden` 撤廃）、フッターが見えたら隠す挙動を削除、`aria-label` を「ページの先頭へ戻る」へ。画面幅では出し分けず、常時見える追従目次が出ている間だけ出さない（同日の運営者判断）。Decision #33 追加（monotrip.jp Decision #30 の横展開）。実装は `src/components/BackToTop.astro` に集約し `BaseLayout` へ配置。CLAUDE.md（Related Docs 版数）連動 |

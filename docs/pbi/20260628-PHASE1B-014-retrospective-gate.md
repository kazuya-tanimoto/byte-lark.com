# 運営者と Claude は Phase 1b 完了状態を確認し、Phase 1c への学びを次セッションへ申し送ることができる

Status: Done
Started: 2026-08-05
Completed: 2026-08-05

## 誰が
- 運営者 + Claude

## 何をできる
- Phase 1b の全 PBI（001〜009、012、015。010 / 011 / 013 は Decision #29 で Dropped、016 は Phase 非依存の環境整備のため対象外）が Done になったことを確認できる
- Phase 1b で得た知見・想定外・つまずきを集約し、Phase 1c（デザインブラッシュアップ）PBI 起票時の参考資料として明文化できる

## なんのために
- Phase 1b の学びが Phase 1c のデザイン PBI に反映されないまま着手するリスクを排除するため
- 関連: site-plan.md §7（ロードマップの Retrospective Gate）/ Phase 1b / Phase 1c

## 受け入れ条件

### Phase 1b 完了確認
- [x] PHASE1B-001 〜 PHASE1B-009、PHASE1B-012 および PHASE1B-015（CodeQL 二重構成解消、2026-07-13 追加起票）のすべてが Status: Done
  - PHASE1B-010 / 011 / 013 は Dropped（site-plan v3.11 Decision #29 初期記事セット縮小 6→3 本、2026-08-02。ネタは article-backlog.md へ移管）のため完了確認対象外
  - PHASE1B-016（Claude Code devcontainer 環境整備、2026-07-17 起票）は Phase 非依存の開発環境整備のため**本 Gate の完了確認対象外**（未完でも Gate 通過可。docs/devcontainer-plan.md 参照）
- [x] `docs/pbi/INDEX.md` の Phase 1b セクションがすべて `[Done]` 表示（010 / 011 / 013 は Dropped、016 は対象外、014 は本 Gate）
- [x] feat/phase-1 ブランチで `yarn dev` / `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がすべて成功（2026-08-05 実行：build 11 ページ / biome 38 ファイル指摘なし / check:ts 0 errors / vitest 30 passed、dev は起動済みサーバーで 200 応答確認）

### 学びの集約
- [x] 本 PBI の `## Phase 1c への申し送り` セクションに記入: 確定した技術前提（実際に動いた構成）/ 発生した想定外と回避策 / 計画書と実態の差分 / Phase 1c 仕上げトラック起票時の注意 / Phase 1c で先に決めるべき事項
- [x] 申し送り棚卸し（README §4.6 ルール 8）：Phase 1b 全 PBI の実装ログにある申し送り・積み残しを項目単位で列挙し、各項目を **PBI 化（起票先を明記）/ 持ち越し（`## Phase 1c への申し送り` に記載）/ 破棄（理由を明記）** のいずれかに判定して表にする。前 Gate（PHASE1A-022）の申し送りで未消化の項目も同じ表で再判定する
- [x] `draft-phase1c-design-polish.md` の**仕上げトラック**（B-3 CSS サイズ / 全記事最終再検証 / 1c Gate）を Phase 1c PBI として正式化する指示を明記（先行トラック＝確定 HEX + color-contrast 再有効化、タイポ確定、ロゴ刷新、favicon、B-1 見出しレベル、B-2 フォント CLS は site-plan v3.10 Decision #28 により PHASE1C-001〜007 として 2026-07-12 起票済み）
- [x] 初期記事セット（PHASE1B-008 / 009 / 012 の 3 本、Decision #29 で縮小）の実装で判明したタイポ / カード設計 / 見出しレベルの課題を Phase 1c へ申し送り（該当する先行トラック PBI が未 Done なら受け入れ条件・技術メモに追記、Done 済みなら仕上げトラックの最終再検証 PBI に反映）
- [x] R-01 月次ネタ出し routine（/schedule）を Phase 1d 公開後に点火する方針と、`docs/article-backlog.md`（記事ネタのストック）を起点にすることを申し送りに明記

### CLAUDE.md / site-plan.md の整合確認
- [x] CLAUDE.md の記述と Phase 1b の実態に齟齬がないか確認（v3.11 参照・sandbox 制約・ブランチ運用・§7 検証ゲートとも現状どおり、齟齬なし）
- [x] site-plan.md と Phase 1b 実装結果に差分があれば記録・修正（§13.1 の現在地注記の古さのみ。`## Phase 1c への申し送り` の「計画書と実態の差分」に記録、修正は次回 site-plan 改訂時）

### 完了処理
- [x] 本 PBI の Status を Done に更新、INDEX.md 同期
- [x] ローカル スクショ確認（desktop + mobile）：N/A（理由: 本 PBI は Gate（確認・申し送り）で UI を変更しない）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：N/A（理由: UI 変更なし）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：N/A（本 PBI は docs のみ変更で frontend 非変更）。ただし Gate 通過判定として HEAD の CI 緑を別途確認する（CLAUDE.md §7）→ 確認済み：HEAD ad18b46 で UI Tests / Quality Checks / Workers Builds / CodeQL すべて completed/success

### 次セッションへのトリガー
- [x] 本 PBI が Done になった時点で、次セッションは「Phase 1c 仕上げトラック PBI 起票」（B-3 / 全記事最終再検証 / 1c Gate）を最初のタスクとして実行可能（先行トラック PHASE1C-001〜007 は Decision #28 により本 Gate 前から着手可）

## Phase 1c への申し送り

### 確定した技術前提（実際に動いた構成）
- 初期記事セット 3 本（008 サイト構築 / 009 フォーム / 012 法人化、Decision #29）が feat/phase-1 上で公開状態（draft: false）。全ページ実データ承認済み
- カバー画像の運用が確立：tech 記事は濃紺設計図調、life 記事は差別化（012 は書類＋社印フラットレイ）。生成は「生成済み画像を 1 枚目参照＋変更点だけ差分指示」方式が忠実度・品質とも安定（/cover-image スキルに反映済み）
- Contact フォーム（Worker `/api/contact` + Turnstile + Resend）は実送信合格（2026-06-27）。CF はバージョンごとに bindings をスナップショット固定＝secret/変数投入後は再ビルド必須
- E2E は CI（ui-tests.yml、Playwright 公式コンテナ）で自走、`scripts/ci-status.sh` で合否確認。UI スクショは MCP Playwright
- Phase 1c 先行トラック PHASE1C-001〜007 は全 Done、追加の PHASE1C-009（追従目次）も Done。確定パレット「春空」は global.css トークン反映済み（PHASE1C-002）

### 発生した想定外と回避策
- iPhone Safari で `text-wrap: balance` 単独適用が語中折れで悪化 → `@supports (word-break: auto-phrase)` で Chrome/Edge 限定化（bab886d、2026-08-01）。PHASE1C-003 Done（07-31）より後の修正のため、仕上げトラック最終再検証で全記事・別エンジン実機確認が必要
- 公開 commit と PBI Done 化が別セッションに割れ、009 の INDEX / Status が InProgress のまま残った → 公開 commit と Done 化は同一セッションで完結させる（1 ツリー 1 セッション運用でも徹底）
- CF Workers Builds は `node_modules/.astro` をキャッシュし、カバー付き記事の削除/改名で ImageNotFound → Clear Cache で回復（再現性のある失敗、メモリ記録済み）

### 計画書と実態の差分
- site-plan §13.1 の「〜2026/06、現在のフェーズ」注記が古い（実態は法人化済み・§13.2 移行期に到達、Footer / About / Privacy の表記置換は PHASE1B-003 で完了済み）。§14 の連動更新（version bump）が重いため本 Gate では記録に留め、次回 site-plan 改訂時に §13 の現在地注記を更新する
- 上記以外は §7 ロードマップ / Decision #28・#29 / Q1〜Q13 とも実態と齟齬なし

### 仕上げトラック起票時の注意（正式化指示）
- `draft-phase1c-design-polish.md` §C の 3 件を Phase 1c PBI として正式化する：
  1. B-3 CSS サイズ・描画ブロック見直し（現状 全ページ単一 CSS 生 131KB / brotli 後 ~10KB。Performance 正式判定は Phase 1d 本番ドメイン）
  2. 全初期記事セット（3 本）公開状態でのデザイン最終再検証・微調整
  3. Phase 1c Retrospective Gate
- 最終再検証 PBI に入れる素材（本 Gate 棚卸しで確定）：
  - `text-wrap` 修正（bab886d）の全記事・別エンジン実機確認
  - PHASE1C-006 申し送り：`bash scripts/lighthouse-audit.sh` を branch alias で 1 回流して heading-order 裏取り（当時公開記事 0 件で未実施、現在 3 本公開済み）
  - PHASE1C-008 申し送り：記事ページの署名要素の見え方を branch alias で裏取り
  - 雇用形態バッジ色（PHASE1B-002 の暫定色）が確定トークン下で意図どおりかの確認
- 全 PBI に §7 検証ゲートを常設（README §4.6 ルール 7、非該当は N/A + 理由）
- Lighthouse Performance / SEO の正式判定は Phase 1d 本番ドメインで行う（branch alias は X-Robots-Tag: noindex 強制）

### Phase 1c で先に決めるべき事項
- B-3 の到達目標（brotli 後 ~10KB で実害は小さい。未使用ユーティリティ削減で止めるか、critical CSS まで踏み込むか）
- CF Deploy Hooks を設定するか（push 取りこぼし時に URL 一発で再ビルド可。PHASE1C-008 ログ、運営者判断）

### R-01 月次ネタ出し routine
- Phase 1d 公開後に /schedule で点火する（Phase 1c では点火しない）
- 起点は `docs/article-backlog.md`（Dropped 010/011/013 のネタ T3 / T5 / L2+L3 ほかを集約済み、routine プロンプト例も同ファイル）

### 申し送り棚卸し表（README §4.6 ルール 8）

Phase 1b 全 PBI の実装ログ + 前 Gate（PHASE1A-022）申し送りを項目単位で判定。PHASE1A-022 の Phase 1b / 1c 先行トラック向け申し送りは全件消化済み（仮 HEX→確定 HEX は PHASE1C-002、heading-order は PHASE1C-006、コンテンツ系は PHASE1B-001〜007 で消化）のため、下表は未消化・要判定分のみ。消化済み・記録済み知見（CF bindings スナップショット、.astro キャッシュ、文体・カバー生成知見等）はメモリ / スキル / 各 doc に反映済みで破棄（再掲不要）とする。

| 出典 | 項目 | 判定 |
|---|---|---|
| 1B-008 / 012 | 記事 publishedAt を実公開日に更新してから main マージ | 持ち越し（Phase 1d。メモリ記録済み） |
| 1B-004 / 1A-022 | Contact 本番ドメイン最終確認 + Resend DNS（resend._domainkey.send / send.send）の NS 移管 + info@/tanimoto@ 疎通テスト | 持ち越し（Phase 1d。draft-phase1d 移管チェックに明記済み） |
| 1B-015 | main の CodeQL 週次 cron 無効化（運営者作業、Phase 1d main マージで根治） | 持ち越し（Phase 1d） |
| 1B-015 | medium alert（ui-tests.yml permissions）クローズの GitHub UI 確認 | 持ち越し（運営者作業、未確認のまま） |
| 1B-003 | 法人化対応 PBI（所在地・代表者・特商法 FR-28・Privacy 安全管理措置・制定日の公開日合わせ） | 持ち越し（Phase 1d 起票時に draft-phase1d と併せて起票判断。site-plan §13.4） |
| 1A-022 | draft-phase1d-domain-launch.md の正式化 | 持ち越し（予定どおり Phase 1c 完了後） |
| 1A-022 | Lighthouse Performance / SEO 正式判定 | 持ち越し（Phase 1d 本番ドメイン） |
| 1B-007 | R-01 月次ネタ出し routine 点火 | 持ち越し（Phase 1d 公開後。上記のとおり） |
| 1C-006 / 1C-008 | 記事ページの branch alias 裏取り（heading-order / 署名要素） | PBI 化（仕上げトラック最終再検証 PBI に反映） |
| 1B-008 | `text-wrap` 修正の全記事実機確認 | PBI 化（同上） |
| 1B-002 | 雇用形態バッジ色の確定トークン下での確認 | PBI 化（同上） |
| 1C-008 | CF Deploy Hooks 設定の要否 | 持ち越し（運営者判断。「先に決めるべき事項」に記載） |
| 1B-008 | 「最良モデルを使え」の中の人ブログ URL 未特定（docs 引用で代替中） | 持ち越し（軽微、運営者想起時に追記） |
| 1B-009 | 公開 commit と PBI Done 化は同一セッションで完結 | 持ち越し（プロセス教訓として本申し送りに記載。README 改訂は 1c Gate で要否判断） |

## 技術メモ
- PHASE0-010 / PHASE1A-022 と同じ Gate 構造
- 公開（main マージ）は Phase 1d。本 Gate ではマージしない（site-plan v3.9 Decision #25）
- Phase 1a の仮 HEX → Phase 1c で確定 HEX に置換。どのファイルに仮 HEX があるかの一覧（PHASE1A-022 申し送り）を Phase 1c で参照する

## 備考
- Phase 1b（コンテンツ整備）の Retrospective Gate。PHASE1B-007 完了時に記事実装 PBI 群（008〜013）とあわせて起票（draft-phase1b-content-launch-prep.md 項目7 の Gate 部）

## 実装ログ

### 2026-08-05
- やったこと：完了確認（対象 12 PBI 全 Done を INDEX + 各ファイルで確認、yarn build / check / check:ts / test:run 全成功、dev は稼働サーバーで 200 確認）→ Phase 1b 全 PBI の実装ログ + 前 Gate（PHASE1A-022）申し送り + draft-phase1c-design-polish.md を全件読了して申し送り棚卸し → `## Phase 1c への申し送り` 執筆（確定技術前提 / 想定外と回避策 / 計画差分 / 仕上げトラック正式化指示 / 先に決めるべき事項 / R-01 方針 / 棚卸し表）→ CLAUDE.md / site-plan 整合確認 → Done 化
- 確認結果：PHASE1A-022 の Phase 1b / 1c 先行トラック向け申し送りは全件消化済み。未消化は Phase 1d 待ち（publishedAt 更新 / Contact 本番確認 + Resend DNS / CodeQL cron 根治 / 法人化対応 PBI / draft-phase1d 正式化）と仕上げトラック待ち（text-wrap 実機確認 / branch alias 裏取り 2 件 / バッジ色確認）に整理し棚卸し表へ
- 計画差分：site-plan §13.1 の現在地注記の古さのみ（記録対応、次回改訂時に修正）
- CI：HEAD ad18b46 で UI Tests / Quality Checks / Workers Builds / CodeQL 全 success

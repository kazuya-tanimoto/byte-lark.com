# 運営者と Claude は Phase 1c 完了状態を確認し、Phase 1d への学びを次セッションへ申し送ることができる

Status: Done
Started: 2026-08-07
Completed: 2026-08-08

## 誰が
- 運営者 + Claude

## 何をできる
- Phase 1c の全 PBI（先行トラック 001〜007 + 期中追加 008 / 009 + 仕上げトラック 010 / 011 / 013 / 014）が Done になったことを確認できる
- Phase 1c で得た知見・想定外・つまずきを集約し、Phase 1d（公開）PBI 起票時の参考資料として明文化できる

## なんのために
- Phase 1c の学びが Phase 1d の公開 PBI に反映されないまま着手するリスクを排除するため
- 関連: site-plan.md §7（ロードマップの Retrospective Gate）/ Phase 1c / Phase 1d

## 受け入れ条件

### Phase 1c 完了確認
- [x] PHASE1C-001 〜 PHASE1C-011 + PHASE1C-013 / 014 のすべてが Status: Done（014 は本 Gate の起票後に差し込まれたため、Done 化された 2026-08-08 に完了確認をやり直した）
- [x] `docs/pbi/INDEX.md` の Phase 1c セクションがすべて `[Done]` 表示（012 は本 Gate）
- [x] feat/phase-1 ブランチで `yarn dev` / `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がすべて成功

### 学びの集約
- [x] 本 PBI の `## Phase 1d への申し送り` セクションに記入: 確定した技術前提（実際に動いた構成）/ 発生した想定外と回避策 / 計画書と実態の差分 / Phase 1d 起票時の注意 / Phase 1d で先に決めるべき事項
- [x] 申し送り棚卸し（README §4.6 ルール 8）：Phase 1c 全 PBI の実装ログにある申し送り・積み残しを項目単位で列挙し、各項目を **PBI 化（起票先を明記）/ 持ち越し（`## Phase 1d への申し送り` に記載）/ 破棄（理由を明記）** のいずれかに判定して表にする。前 Gate（PHASE1B-014）の持ち越し項目（publishedAt 実公開日化 / Contact 本番ドメイン確認 + Resend DNS + 疎通テスト / main CodeQL 週次 cron 無効化 / medium alert クローズ確認 / 法人化対応 PBI の起票判断（site-plan §13.4）/ Lighthouse Performance・SEO 正式判定 / R-01 routine 点火 / 「最良モデル」ブログ URL）も同じ表で再判定する
- [x] `draft-phase1d-domain-launch.md` を Phase 1d PBI として正式化する指示を明記（PHASE1B-014 からの持ち越し分の引き渡し先を含める）
- [x] README 改訂の要否判断：「公開 commit と PBI Done 化は同一セッションで完結させる」の規約化（PHASE1B-014 棚卸しで本 Gate での判断と指定された項目）

### 運営者作業
- [x] CF Deploy Hooks を設定（2026-08-07 運営者が Worker `byte-lark` の Settings → Builds → Deploy Hooks に `feat/phase-1` 向けを 1 本作成。`curl -X POST` でビルドが 1 本増えることまで実地確認済み。URL は 1Password 保管、repo・PBI・ログには記載しない）（ダッシュボード操作。push 取りこぼし時に URL 一発で再ビルドするための保険。2026-08-06 起票セッションで「設定する」と運営者確定。Hook URL は秘匿情報として repo / PBI / ログに書かない）

### CLAUDE.md / site-plan.md の整合確認
- [x] CLAUDE.md の記述と Phase 1c の実態に齟齬がないか確認
- [x] site-plan.md と Phase 1c 実装結果に差分があれば記録・修正（PHASE1B-014 で記録済みの §13.1 現在地注記の古さも、site-plan を改訂する場合はあわせて更新）

### 完了処理
- [x] 本 PBI の Status を Done に更新、INDEX.md 同期
- [x] ローカル スクショ確認（desktop + mobile）：N/A（本 Gate の変更は docs / CLAUDE.md のみで、サイトの出力に一切影響しない）
- [x] CF preview スクショ確認（branch alias URL）：N/A（同上）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）（CLAUDE.md §7。docs のみ変更の想定だが、Gate 通過判定として HEAD の CI green を別途確認する）

### 次セッションへのトリガー
- [x] 本 PBI が Done になった時点で、次セッションは「Phase 1d PBI 起票」（draft-phase1d-domain-launch.md の正式化）を最初のタスクとして実行可能

## Phase 1d への申し送り

### 確定した技術前提（実際に動いた構成）

- 色：確定パレット「春空」を `src/styles/global.css` の `--color-hibari-*` + セマンティックトークンで保持（PHASE1C-002）。文字色の全組み合わせが AA 通過。sun / wash / チップ面は文字色に使わない
- 文字：見出し Zen Kaku Gothic New（500 / 700）、本文 Noto Sans JP 一本。サイズ・行間は `@theme` の `--text-*`（本文 16px / 行間 1.95、見出し 42 / 32 / 24 / 17 / 14px）。読み込みは Astro Fonts API（`astro.config.mjs` の `fonts` + `scripts/fontsource-variants.mjs`、provider は local）で「見出し swap / 本文 optional」（PHASE1C-003 / 007）
- 和文の折り返し：`text-wrap: balance` + `word-break: auto-phrase` を `@supports (word-break: auto-phrase)` で囲って Chrome / Edge 限定（PHASE1C-011 で全ページ実測比較のうえ現状維持を確定）
- ロゴ・アイコン：`logo.svg`（大サイズ用フルマーク）/ `logo-badge.svg` / `logo-bird.svg`。favicon は svg / ico / apple-touch-icon の 3 本立て（PWA 化しないので 192・512 PNG は不要。PHASE1C-004 / 005）
- 署名要素「揚雲雀の軌跡」：640px 以上は Hero 右下に絶対配置、640px 未満はお問い合わせボタン直下の横長構図。負の下マージンは % 指定で SVG の高さに追従させる（PHASE1C-008 / 013）
- コードハイライト：Shiki テーマ `github-light-default`（旧 `github-light` は変数名 `#e36209` が白地 3.49:1 で AA 未達。PHASE1C-011）
- CSS：全ページ共通 1 枚で生 32,955B / brotli 5,698B。Tailwind の走査は `source("../")` で `src/` 限定（`docs/` の英単語を誤ってクラス化させない。PHASE1C-010）
- Skills アイコン：34 件すべて `public/icons/*.svg` の自前ホスト。外部 CDN 参照 0 件。表示枠は `SkillSet.astro` の `size-7` + `object-contain` で決める（`width`/`height` 属性は Tailwind preflight の `img { height: auto }` に負ける）。ライセンス表記は `public/icons/LICENSE.txt`（PHASE1C-014）
- 記事目次：xl 以上で右カラム sticky。現在地判定は IntersectionObserver ではなく rAF で間引いた passive scroll（末尾の節が点灯しない edge case のため。PHASE1C-009）
- 検証手段：Lighthouse は `bash scripts/lighthouse-audit.sh`（`PATHS` に静的 8 ページ + 公開記事 3 本）。11 ページとも accessibility 100 / color-contrast pass / heading-order pass。スクショと DOM 実測は MCP Playwright、CI の合否は `bash scripts/ci-status.sh`

### 発生した想定外と回避策

- `npx lighthouse` がキャッシュ状態次第で対話プロンプトを出し、出力を握りつぶしていたため 8 時間の無言ハングになった → `scripts/lighthouse-audit.sh`（npx 不使用・出力素通し）に置き換え（PHASE1C-002）
- Cloudflare が push を 1 回取りこぼし、branch alias が古いビルドを配信し続けた → check-runs の `Workers Builds: byte-lark` の有無でビルド実行を機械判別できる。保険として本 Gate で Deploy Hooks を設定（PHASE1C-008）
- CF 反映直後にブラウザが古いページをキャッシュし、スクショだけ見て「反映されていない」と誤判定しかけた → `curl` の配信物と DOM 実測値を突き合わせる。**スクショ単体を根拠にしない**（PHASE1C-013）
- 監査スクリプトの対象パスが静的 8 ページ固定で、記事ページが一度も測られていなかった → 検証の「対象範囲そのもの」を疑う。追加した途端に実在の AA 違反が出た（PHASE1C-011）
- `getComputedStyle` は色を `oklch()` 文字列で返すので RGB としてパースできない → canvas に塗って合成後のピクセルを読む（PHASE1C-011）
- 重なり順：位置指定のある要素どうしは DOM 順で決まる。Hero（position 指定あり）の子は、後続セクション（指定なし）より上に描かれる → 後続側に `relative` を足す（PHASE1C-013）
- モックの px 実測値をそのまま実装に持ち込むと別の幅で破綻する → 幅に比例する値は % で指定し、全幅で測り直す（PHASE1C-013）
- CF の `/skills` は `/skills/` へ 307 リダイレクトする。`curl -L` を付けずに配信物を判定して「旧版のままだ」と誤読しかけた（PHASE1C-014）
- デプロイ直後は一部アセットが一時的に 404 を返す（数秒後に 200）。1 回の 404 で欠損と判断しない（PHASE1C-014）
- 「このアイコンは存在しない」の判断は照合範囲に依存する。devicon と simple-icons だけを見て 11 件を「無い」と断定していたが、Iconify まで広げると全件あった（PHASE1C-014）
- 母艦の sandbox はセッションの起点ディレクトリで挙動が変わる（`tools/imagegen` 起点はポート bind が全面不可で build / dev / preview が全滅）→ build は運営者のコミットスクリプト冒頭に置いた（PHASE1C-009）
- devcontainer では Lighthouse も Playwright スクショも回る（chromium 実体を `CHROME_PATH` 指定）。母艦の Chrome 起動不可制約は非適用。ただし外部 CDN 由来の画像（jsdelivr の Skills アイコン）はコンテナから到達できず壊れて写るため、その検証だけは母艦が要った（PHASE1C-006 / 007 / 008）→ PHASE1C-014 でアイコンを自前ホストへ移したので、この例外は解消済み

### 計画書と実態の差分

本 Gate で以下 5 件を検出し、いずれもクラリフィケーション（決定内容は不変）として同コミットで修正した。site-plan / README の version 番号は据え置き（2026-06-14 の統合ブランチ改名と同じ扱い）。

- site-plan §13.1 の「〜2026/06、現在のフェーズ」注記が古い（実態は法人化済み・§13.2 移行期）。PHASE1B-014 で記録に留めた持ち越し分 → 現在地マーカーを §13.2 へ移した
- site-plan §12 の自己参照が `v3.11` のまま（本体は v3.12）→ 修正
- site-plan §12 / CLAUDE.md の README 参照が `v3.3` のまま（本体は v3.6）→ 修正
- INDEX.md Phase 1c 節の「先行トラック（PHASE1C-001〜009）は 2026-07-12 起票済み」は事実誤り。Decision #28 の先行トラックは 001〜007 で、008（2026-07-25）と 009（2026-08-05）は期中の追加起票 → 実態どおりに書き直し
- INDEX.md Phase 1c 節の仕上げトラックが「010〜012」のまま（013 が抜けていた）→ 修正
- 上記以外は §7 ロードマップ / Decision #28・#29・#30 / FR / NFR とも実態と齟齬なし

### Phase 1d 起票時の注意

- `draft-phase1d-domain-launch.md` を Phase 1d PBI として正式化する。本 Gate の棚卸し表で「持ち越し」と判定した全項目の引き渡し先はここ
- 全 PBI に §7 検証ゲート 3 項目を常設する（README §4.6 ルール 7。非該当は `[x] …：N/A（理由）`）
- Lighthouse の Performance / SEO 正式判定は Phase 1d 本番ドメインで行う。branch alias は `X-Robots-Tag: noindex` を CF が強制するため SEO 90+ が構造上出ない
- main マージ前に記事 3 本の `publishedAt` を実公開日へ更新する（未来日でも表示される仕様のため、忘れても画面上は気づけない）
- 公開後の実記事で CLS を 1 回測り直す（Phase 1c ではすべて一時記事で代替した。PHASE1C-007 申し送り）
- CF Workers Builds は `node_modules/.astro` をキャッシュするため、カバー画像付き記事の削除・改名でビルドだけ落ちる。Clear Cache で回復（再現性のある失敗）

### Phase 1d で先に決めるべき事項

- ダークモードをやるか。`.dark` トークン（PHASE1C-002）とアイコン・ロゴの色設計（PHASE1C-004 / 005）は実装済みだが、`.dark` に到達する手段が無いため実表示は一度も見ていない。「やらない」と決めれば関連する申し送り 3 件をまとめて破棄できる
- 法人化対応（所在地・代表者・特商法 FR-28・Privacy 安全管理措置・制定日の公開日合わせ、site-plan §13.4）を Phase 1d に含めるか、公開後の別 Phase にするか
- フォント転送量に手を入れるか。ビルド成果物のフォントは 366 ファイル・8.5MB、各ページ `<head>` のインライン `@font-face` が約 283KB（HTML が全ページ約 300KB）。いずれも PHASE1C-003 / 007 / 010 の確定方式で、本番計測で問題が出たときだけ着手する前提

### 申し送り棚卸し表（README §4.6 ルール 8）

Phase 1c 全 PBI（001〜011 / 013 / 014）の実装ログと、前 Gate（PHASE1B-014）の持ち越し 11 件を項目単位で判定した。Phase 1c 内で消化済みの申し送り（「春空」見た目適用 → 008 / 朝日マーカーの h2 サイズ整合 → 008 / Hero とロゴの鳥の描き分け統一 → 004 事後追記 / favicon 差し替え → 005 / 未参照 `logo.png` の処置 → 削除済み / 記事ページの branch alias 裏取り 2 件 → 011 / `text-wrap` 全記事確認 → 011 / 雇用形態バッジ色 → 011 / Hero 署名要素 3 点 → 013 / コンテナ Lighthouse 手順 → 007 で流用済み / フォント定義場所 → 003 で消化）は再掲せず破棄とする。

| 出典 | 項目 | 判定 |
|---|---|---|
| 1C-002 / 004 / 005 | ダークモードの実表示検証（`.dark` トークン・currentColor アセット・favicon だけ sky 固定である点） | 持ち越し（「先に決めるべき事項」の可否判断とセット。やらないと決めた時点で破棄） |
| 1C-003 / 007 / 010 | フォント転送量（ビルド 366 ファイル・8.5MB / インライン @font-face 約 283KB）のサブセット化 | 持ち越し（Phase 1d 本番計測で問題が出た場合のみ着手） |
| 1C-005 | iOS ホーム画面アイコンの実表示（実機が要る） | 持ち越し（Phase 1d 公開後、運営者実機） |
| 1C-007 | 実記事での CLS 測り直し（Phase 1c は一時記事で代替） | 持ち越し（Phase 1d 本番計測に含める） |
| 1C-009 | `prefers-reduced-motion: reduce` 時の即時ジャンプの実機確認 | 持ち越し（軽微。OS 設定の切替が要る。Phase 1d 公開後の任意確認） |
| 1C-013 | Hero スマホ構図の iPhone 実機確認 | 持ち越し（Phase 1d 本番確認。標準 CSS のみで別エンジン固有の懸念は薄い） |
| 1C-014 | Skills アイコンの iPhone 実機確認 | 持ち越し（Phase 1d 本番確認。上と同じ扱い、まとめて 1 回見れば足りる） |
| 1C-014 | アイコンのライセンス表記（`public/icons/LICENSE.txt`）をサイト上でも示すか | 持ち越し（Phase 1d の公開前 QA で判断。現状は repo 内に置いてあるのみで、ページからは辿れない） |
| 1C-008 | CF Deploy Hooks 設定 | 本 Gate で消化（運営者作業） |
| 1C-008 | 外部 CDN 由来の画像がコンテナのスクショで検証できない | 破棄（PHASE1C-014 でアイコンを自前ホストへ移して解消） |
| 1B-008 / 012 | 記事 `publishedAt` を実公開日に更新してから main マージ | 持ち越し（Phase 1d。メモリ記録済み） |
| 1B-004 / 1A-022 | Contact 本番ドメイン最終確認 + Resend DNS の NS 移管 + info@ / tanimoto@ 疎通テスト | 持ち越し（Phase 1d。draft-phase1d に記載済み） |
| 1B-015 | main の CodeQL 週次 cron 無効化 | 持ち越し（Phase 1d の main マージで根治） |
| 1B-015 | medium alert（ui-tests.yml permissions）クローズの GitHub UI 確認 | 持ち越し（運営者作業、未確認のまま） |
| 1B-003 | 法人化対応 PBI（site-plan §13.4） | 持ち越し（Phase 1d 起票時に判断。「先に決めるべき事項」に記載） |
| 1A-022 | `draft-phase1d-domain-launch.md` の正式化 | 本 Gate 完了で次セッションへ引き渡し（下の「次セッションへのトリガー」） |
| 1A-022 | Lighthouse Performance / SEO 正式判定 | 持ち越し（Phase 1d 本番ドメイン） |
| 1B-007 | R-01 月次ネタ出し routine の点火 | 持ち越し（Phase 1d 公開後。起点は `docs/article-backlog.md`） |
| 1B-008 | 「最良モデルを使え」の中の人ブログ URL 未特定 | 持ち越し（軽微、運営者想起時に追記） |
| 1B-009 | 公開 commit と PBI Done 化は同一セッションで完結 | 本 Gate で README 規約化（§5.4 に追記、v3.7） |

## 技術メモ
- 想定セッション数: 1
- PHASE0-010 / PHASE1A-022 / PHASE1B-014 と同じ Gate 構造
- 公開（main マージ）は Phase 1d。本 Gate ではマージしない（site-plan §8 Decision #25）

## 備考
- Phase 1c（デザインブラッシュアップ）の Retrospective Gate。draft-phase1c-design-polish.md §C の 3 項目め（仕上げトラック）の正式化。PHASE1B-014「Phase 1c への申し送り」の正式化指示に基づく

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-07 Gate 実施

やったこと：

1. Phase 1c 完了確認
   - PHASE1C-001〜011 + 013 の全 12 件が Status: Done（各ファイルの Status 行を機械照合）。INDEX.md の Phase 1c 表とも一致
   - ※ この確認の後、2026-08-07 に PHASE1C-014（Skills アイコン欠け + カテゴリ修正）が追加起票された。014 の Done 化後に完了確認をやり直す
   - `yarn check`（Biome 38 ファイル）/ `yarn check:ts`（0 errors）/ `yarn test:run`（30 passed）/ `yarn build`（11 ページ）すべて成功。`yarn dev` は PHASE1C-013 のローカル検証で稼働確認済み
2. 申し送り棚卸し：Phase 1c 全 PBI の実装ログと PHASE1B-014 の持ち越し 11 件を項目単位で判定し、`## Phase 1d への申し送り` に表として記載（持ち越し 14 / 本 Gate 消化 2 / 破棄 11）
3. `## Phase 1d への申し送り` 執筆（確定した技術前提 / 想定外と回避策 / 計画書と実態の差分 / 1d 起票時の注意 / 先に決めるべき事項）
4. 計画書との差分 5 件を検出して修正（クラリフィケーション、site-plan / README とも v 番号の扱いは下記）
   - site-plan §13 の現在地マーカーを §13.1（法人化前）→ §13.2（移行期）へ移動。PHASE1B-014 で「次回改訂時に」と記録に留めていた分
   - site-plan §12 の自己参照 v3.11 → v3.12、README 参照 v3.3 → v3.6。CLAUDE.md の README 参照も v3.3 → v3.6。いずれも v3.12 改訂時の連動更新漏れ（site-plan §14 が防ごうとしていたパターンそのもの）
   - INDEX.md Phase 1c 節の「先行トラック（001〜009）は 2026-07-12 起票済み」は事実誤り。Decision #28 の先行トラックは 001〜007 で、008 / 009 / 013 は期中の追加起票 → 実態どおりに書き直し
5. README 改訂：運営者判断で「規約化する」を選択 → §5.4 に例外を追加して v3.7 へ（外形が変わるコミットを打ったセッションは、その PBI の Done 化まで終える）

学び・つまずき：

- CF Deploy Hooks を「Cloudflare Pages 専用機能で Workers Builds には無い」と一度判断しかけた。親ページ（`/workers/ci-cd/builds/`）と configuration ページに記載が無かったため。sitemap を引いたら `/workers/ci-cd/builds/deploy-hooks/` が実在した。**目次ページに載っていないことを「機能が無い」の根拠にしない**（sitemap か検索で存在自体を確かめる）
- site-plan §14（バージョン参照箇所一覧）は連動更新漏れを防ぐために作られた仕組みだが、v3.12 の改訂ではその §12 自身が漏れていた。表の存在だけでは効かないので、Gate で機械的に grep する工程を持つ意味がある

6. CF Deploy Hooks（運営者作業）：Worker `byte-lark` の Settings → Builds → Deploy Hooks に `feat/phase-1` 向けを 1 本作成。`curl -X POST <URL>` でビルド履歴が 1 本増えることまで実地確認した。URL は認証ヘッダー不要で識別子そのものが鍵のため 1Password 保管とし、repo・PBI・ログには残さない。`main` 向けは叩く場面が無いので Phase 1d のマージ時に追加する
7. Stop hook の断片報告対策（本 Gate 中に運営者指摘で発覚）：Stop hook（`type: prompt` の Done 宣言監査）が出力契約（`{"ok": true}`）を破って散文を返し、それが次ターンの system-reminder に流れ込み、内部機構の話を運営者向け応答に書いてしまった。`.claude/settings.json` の監査プロンプト末尾に出力を JSON のみに縛る一文を追加し、CLAUDE.md「Stop Hook フィードバック対応」節に「hook の存在・文言・判定結果を運営者向け応答に書かない / 指摘が空なら hook に言及せず自己完結した状態報告を書く」を追記した

残タスク：commit / push → CI green 確認 → Done 化

### 2026-08-08 完了確認のやり直し + Done 化

本 Gate の作業中（a3db5f5 push 直後）に、同じ作業ツリーの別セッションが PHASE1C-014（Skills アイコン欠け + カテゴリ修正）を起票・着手した。Gate は「Phase 1c の全 PBI が Done」を確認するものなので、014 が InProgress のまま Done を打つと Gate が嘘になる。運営者判断（2026-08-07）で 014 を先に閉じ、本 Gate は完了確認をやり直してから閉じる形にした。

やり直した完了確認：

- Phase 1c の非 Gate PBI 13 件（001〜011 / 013 / 014）すべてが Status: Done であることを再照合
- `yarn check`（38 ファイル）/ `yarn check:ts`（0 errors）/ `yarn test:run`（30 passed）/ `yarn build`（11 ページ）を再実行、すべて成功
- 014 の実装ログから申し送りを拾い、棚卸し表に 2 行追加（iPhone 実機確認 / アイコンのライセンス表記の掲示要否）。あわせて「外部 CDN 由来の画像がコンテナのスクショで検証できない」（1C-008 申し送り）は 014 で解消したため破棄に判定変更
- 「確定した技術前提」に Skills アイコンの自前ホスト化を追記、「想定外と回避策」に 014 の 3 件（307 リダイレクトを追わずに配信物を判定した / デプロイ直後の一時 404 / 「アイコンが存在しない」の判断が照合範囲に依存していた）を追加

想定外だった点：

- **同じ作業ツリーで 2 セッションが同時に動いた**。README §9 の「1 ツリー 1 セッション」「同一 PBI を 2 セッションで触らない」に反する状態で、別セッションが本 Gate の PBI ファイルを直接書き換えた（完了確認のチェックを外し、014 待ちである旨を追記）。今回は書き換えの中身が正しく、むしろ誤った Done 化を防いだが、こちらが気づかずに Done を打っていれば上書きで消えていた。ルールが守られていれば、014 は Gate 着手前か Gate 完了後に回っていたはずの作業
- Gate の完了確認は「実施した時点のスナップショット」でしかない。Gate 中に Phase 内の PBI が増えうる以上、Done を打つ直前にもう一度取り直す必要がある

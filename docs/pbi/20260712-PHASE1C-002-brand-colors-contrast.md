# 訪問者は WCAG AA コントラストを満たす確定ブランドカラーでサイトを閲覧できる

Status: Done
Started: 2026-07-17
Completed: 2026-07-18

## 誰が
- 訪問者

## 何をできる
- 仮カラー（Phase 1a 暫定 oklch 値）が確定ブランドカラーに置換されたサイトを、AA コントラスト準拠の可読性で閲覧できる

## なんのために
- 仮 HEX の primary（hibari-sky）は白背景でコントラスト比約 2.8:1 と AA（4.5:1）未満で、E2E の color-contrast チェックを除外して運用している。確定値への置換と除外解除で NFR-02 を完全充足する
- 関連: site-plan.md NFR-02 / §6.5.2（a11y 追跡）/ §8 Decision #28 / Phase 1c 先行トラック

## 受け入れ条件
- [x] PHASE1C-001 の確定方向性に基づき、`src/styles/global.css` の仮値を確定値に置換（`--color-hibari-*` 7 個 + `:root` / `.dark` のセマンティックトークン。PHASE1A-022 申し送り「仮 HEX の所在一覧」参照）
- [x] テキスト/背景に使う色の組合せがすべて AA 4.5:1 以上（大文字テキスト・UI コンポーネントは WCAG の該当基準に従う）：oklch → sRGB 実測（実装ログの検証表参照）。淡い sky 面上の sky 文字 4.3:1 の AA 未達を検出し sky-deep へ変更
- [x] `tests/e2e/a11y.spec.ts` の `disableRules(["color-contrast"])`（line 26-28 付近）を解除し、axe が全対象ページで green（解除済み・ローカル iframe axe で全 8 ページ green。CI e2e も 4fc6ea1 で success）
- [x] 利用側 10 ファイル（CareerTimeline / Header / Hero / ui/button.tsx / PostLayout / 404 / about / contact / index / privacy）の表示を確認し、意図しない色崩れがない（ダークモード：N/A（`.dark` を付与する仕組みが未実装で画面到達不能。トークン値は AA 実測済み、実表示検証はダークモード導入 PBI で行う）。PostLayout：記事 0 件（008 ドラフトは draft）のため実表示不可、色は共通トークン経由で担保）
- [x] Lighthouse Accessibility で color-contrast 監査 pass、主要ページ 90+ 維持（2026-07-18 運営者ターミナル実行：全 8 ページ A11y 100 / color-contrast pass。手順は `scripts/lighthouse-audit.sh` に恒久化）
- [x] `yarn build` / `yarn check:ts` エラーなし
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）：home（desktop+mobile）/ career を確認、sky-deep 適用 2 箇所は computed style でも実測（rgb(7,89,133)）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）：4fc6ea1 で quality / e2e / Workers Builds / CodeQL すべて success

## 技術メモ
- 想定セッション数: 1
- 依存: PHASE1C-001（確定方向性）
- 定義元は global.css の 1 ファイルに集約済み。コントラスト検証は oklch → sRGB 換算値で行う（ツールで実測、目視だけで判定しない）
- CLAUDE.md「Design Rules」の「確定 HEX は Phase 1c（デザイン）後」の行は本 PBI 完了時に更新する

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。draft-phase1c-design-polish.md A 項（確定 HEX + color-contrast 再有効化）

## 実装ログ

### 2026-07-17

やったこと：
- `global.css` の色トークンを design-direction §2 の確定値に置換
  - `--color-hibari-*` は確定パレットの役割に合わせ 7 個 → 10 個に再構成（sky-deep / wash / sun / チップ 4 色を追加、src 未使用の sky-light / amber-light / green / green-light を削除。grep で未使用を確認済み）
  - `:root` セマンティック：primary=sky `#0273B0` / background=暖白 `#FCFBF8` / foreground=暖黒 `#322E29` / muted 面=wash `#EDF7FD` / muted 文字=`#605A50` / accent=amber チップ対 / secondary=green チップ対（site-plan Decision #14 の色相骨格どおり）/ destructive は現行 shadcn 値維持（bg 上 4.6:1 で AA 可）
  - `.dark`：確定パレットの明度反転から導出（値と検証結果は design-direction §2 に追記）
- コントラスト検証は自作スクリプト（scratchpad の contrast.mjs、oklch→sRGB 変換 + WCAG 相対輝度）で実測。design-direction §2/§4 の記載値との突き合わせで換算器自体を先に検証（14 色誤差 1/255 以内・AA 10 組全再現）してから、サイトで実際に発生する全組合せ（alpha 重ね含む）を測定：
  - text/bg 13.0、muted/bg 6.6、muted/wash 6.3、sky/bg 5.0、sky/wash 4.7、白/sky 5.1、destructive/bg 4.6、Hero 帯（wash30%+bg）上の text 12.8 / muted 6.5 / sky 4.9、副業バッジ（amber10% 面）上の amber 文字 4.8 — すべて AA 4.5 以上
  - **AA 未達を 2 箇所検出**：`bg-primary/10` 面（Header アクティブ / Career フリーランスバッジ）上の sky 文字が 4.32:1 → 文字を sky-deep `#075985` に変更（同面上 6.4:1）。選定モック自体がこの組合せ（nav-links a.active）で、モックの見落としだった。design-direction §2 運用規律に追加規律として記録
- `Header.astro`（2 箇所）/ `CareerTimeline.astro`（フリーランスバッジ）を `text-hibari-sky-deep` に変更。副業バッジは値の置換だけで AA 充足（クラス変更不要）
- `tests/e2e/a11y.spec.ts` の `disableRules(["color-contrast"])` を解除
- ローカル検証：`yarn build` / `yarn check:ts` green。MCP Playwright で home（desktop+mobile）/ career / contact / blog / about / skills / privacy / 404 のスクショ確認、バッジ 3 種は computed style でも確定値の適用を確認。axe-core を iframe 注入して E2E と同条件（wcag2a/2aa/21a/21aa、critical/serious）で全 8 ページ実行 → **color-contrast 除外なしで違反ゼロ**
- CLAUDE.md Design Rules の「確定 HEX は Phase 1c 後」行を確定済みに更新（技術メモの指示）
- design-direction §2 にダーク確定値の表と追加規律を追記

運営者判断（3 点確認済み）：
- 面の色（Hero/Footer 帯・チップ・ナビ hover）に wash を当てる（新色を作らず確定パレットだけで構成）
- ダークトークンは明度反転で導出して据え置き（実表示検証はダークモード導入時）
- 「春空」の見た目実装（影カード・角丸 14px・朝日マーカー・Hero グラデ・揚雲雀）は本 PBI に含めず別 PBI として起票（1c に該当 PBI が無いことを発見 → 起票へ）

残タスク：
- push 後：CI green 確認（`scripts/ci-status.sh`）+ CF preview スクショ確認
- Lighthouse A11y（color-contrast pass / 90+）：運営者ターミナル実行を依頼（サンドボックスで Chrome 起動不可、PHASE1A-020 の分担どおり）
- 「春空」見た目適用 PBI の起票

学び・つまずき：
- 選定モックの nav アクティブ（sky 9% 面 + sky 文字）は AA 未達だった。モックの AA 検証（§4）は単色組合せのみで、alpha 重ねの実効面が漏れる。今後のデザイン検証は「実際に発生する組合せ」を列挙して実測する
- Astro dev server は起動後に `public/` へ追加したファイルを配信しない（404）。再起動で解消
- MCP Playwright + axe-core の iframe 注入で、E2E スイートを回さずに color-contrast の事前確認ができる（サンドボックス Chromium 制約の回避手段として有効）

### 2026-07-18

やったこと：
- push 後検証で Quality Checks が failure → 原因は global.css の 2 行が 100 文字制限超で Biome formatter が改行を要求（値は不変の整形のみ）。`yarn fix` 適用 + 4fc6ea1 で push → quality / e2e / Workers Builds / CodeQL 全 success
- CF preview（branch alias）で「春空」適用を確認：home（desktop+mobile）/ career スクショ + Header アクティブ・Career フリーランスバッジの文字色を computed style で実測（rgb(7,89,133) = sky-deep #075985）
- Lighthouse A11y を運営者ターミナルで全 8 ページ実行：**全ページ 100 / color-contrast pass**。受け入れ条件全達成 → Done

想定外（Lighthouse 検証で 8 時間ハング）：
- 検証用スクリプト（v1/v2）がループ内で `npx lighthouse@12` を呼ぶ設計で、3 回目の実行から npx キャッシュ照合が「要インストール」判定に反転し、「Ok to proceed? (y)」の対話プロンプトで stdin 待ちの永久ハング。v1 は `>/dev/null`、v2 は `tail` パイプで**プロンプトが不可視**だった
- 根本原因は npm ログ（`~/.npm/_logs` の `Error: canceled`）+ npm 本体ソース（`libnpmexec/lib/index.js:296` = プロンプト中断時の throw）で特定。ネットワーク・Chrome・対象ページは無関係（career ページの健全性は Playwright 実測で確認済み）
- キャッシュ判定が 3 回目で反転した引き金は、当時の npm ログがローテーション（logs-max: 10）で消えて特定不能。レジストリ新版公開説は棄却済み（12.x 最新は 12.8.2 のまま）

恒久対策：
- `scripts/lighthouse-audit.sh` を新設。lighthouse を一時ディレクトリへ `npm install` して直接実行（npx 不使用＝プロンプト機構が無い）、出力は隠さない。引数で対象 URL / カテゴリを指定でき、Phase 1d の本番ドメイン計測（Performance / SEO、PHASE1A-020 移管分）でもそのまま使う

残タスク：
- 「春空」見た目適用（影カード・角丸 14px・朝日マーカー・Hero グラデ・揚雲雀）の別 PBI 起票（2026-07-17 運営者判断済み）

学び・つまずき：
- `npx <pkg>` はキャッシュ状態次第で対話プロンプトを出す。検証スクリプトで子プロセスの出力を `>/dev/null` やパイプ（`tail` はバッファするため実質不可視）で握りつぶすと、プロンプト待ちが「原因不明のハング」に化ける。長時間実行ツールは出力を素通しにする
- npm の debug ログは 10 件でローテーションされる。障害調査は痕跡が消える前にログを読む（今回 v1 のログは消失、v2 のログで特定できた）

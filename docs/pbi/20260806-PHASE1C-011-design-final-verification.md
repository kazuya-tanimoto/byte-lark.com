# 運営者は公開記事 3 本を含む全ページで確定デザインが意図どおり表示されていることを確認できる

Status: InProgress
Started: 2026-08-06

## 誰が
- 運営者

## 何をできる
- 公開状態の初期記事セット 3 本（PHASE1B-008 / 009 / 012）と全ページを確定デザイン「春空」で最終再検証し、崩れの修正と Phase 1b / 1c 先行トラックからの未消化の裏取り 4 件を解消した状態にできる

## なんのために
- 先行トラックのデザイン確定（PHASE1C-001〜008）は公開記事 0 件の時期に実施したため、実記事での最終確認が未了。公開（Phase 1d）前に全記事セットでデザインを検証し切るため
- 関連: site-plan.md §6.5（デザインシステム）/ NFR-02 / Phase 1c、draft-phase1c-design-polish.md §C、PHASE1B-014「Phase 1c への申し送り」

## 受け入れ条件
- [x] 全 3 記事（PHASE1B-008 / 009 / 012）を branch alias の PC / スマホ幅で実表示確認：タイポスケール・影カード・朝日マーカー・カバー画像・追従目次（PHASE1C-009）が意図どおり
- [ ] `text-wrap` 修正（bab886d、balance + auto-phrase の Chrome/Edge 限定化）の全 3 記事での見出し折り返し確認。Chromium 側は Claude がスクショで、iPhone Safari（別エンジン。素の右端折り返しになること）は運営者が実機で確認（PHASE1B-014 申し送り：PHASE1C-003 Done 後の修正のため全記事・別エンジン確認が必要）→ Chromium 側は完了（実装ログ 4。現状維持で確定）、iPhone 実機は運営者確認待ち
- [ ] `bash scripts/lighthouse-audit.sh` を branch alias で実行し、`/blog/` と記事ページの heading-order pass を裏取り（PHASE1C-006 申し送り。当時は公開記事 0 件でローカル preview 計測のみだった）→ 静的 8 ページは取得済み（`/blog/` 含め heading-order 全 pass・accessibility 100）、記事 3 本を `PATHS` に追加したので再実行待ち
- [x] 記事ページの署名要素（h2 朝日ドット・影カード・ピル等）の見え方を branch alias で裏取り（PHASE1C-008 申し送り。同じく公開記事 0 件で未実施だった）
- [x] `/career/` の雇用形態バッジ色（PHASE1B-002 の暫定色：フリーランス=hibari-sky / 会社員=neutral / 副業=hibari-amber）が確定トークン「春空」の下で意図どおりかを確認し、ずれていれば確定トークンに合わせて修正（PHASE1B-014 申し送り）→ 3 種とも AA 通過、修正不要
- [x] 発見した崩れ・微調整は本 PBI 内で修正する。1 セッションに収まらない規模の場合は修正せず、別 PBI 起票を運営者に提案する → 表示崩れ 0 件。見出し折り返しは現状維持を運営者が判断（実装ログ 4）、コードハイライトのコントラスト不足は本 PBI 内で修正（実装ログ最終節）
- [x] 修正が入った場合、`yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` エラーなし
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。修正が入らず検証のみの場合は branch alias 確認をもって `[x] …：N/A（理由）` 可）
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。修正 push が無い場合は HEAD の CI green 確認で可）→ dc41792 時点で全 green 確認済み、本 PBI 更新 push 後に再確認

## 技術メモ
- 想定セッション数: 1
- 検証 URL（branch alias、feat/phase-1 固定）: `https://feat-phase-1-byte-lark.tanimoto-a49.workers.dev`
- `scripts/lighthouse-audit.sh` は運営者ターミナルで実行（npx lighthouse 直接は不可視プロンプトでハングする既知の罠）
- 外部 CDN（cdn.jsdelivr.net）由来の画像はコンテナ発スクショでは壊れて写り検証できない。該当確認（Skills アイコン等）は母艦ブラウザで行う（PHASE1C-008 の学び）
- CF preview 確認の前に check-runs の `Workers Builds: byte-lark` の有無で CF ビルドが走ったかを機械判別する（push 取りこぼし検知。PHASE1C-008 の学び）
- 順序: PHASE1C-010（CSS 削減）の後に実施する（CSS 変更が表示に影響し得るため、再検証は削減後の状態で行う）
- 触ってはいけない領域: 記事本文の文面（Done 済み。直すのは見た目のみ）、OGP / JSON-LD（PHASE1A-007）

## 備考
- draft-phase1c-design-polish.md §C の 2 項目め（仕上げトラック）の正式化。PHASE1B-014「最終再検証 PBI に入れる素材」4 件（text-wrap / heading-order / 署名要素 / バッジ色）をすべて受け入れ条件化
- Lighthouse Performance / SEO の正式判定は本 PBI では行わない（Phase 1d 本番ドメイン。branch alias は X-Robots-Tag: noindex 強制）

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-06 branch alias 実表示検証（運営者作業 2 件を残して中断）

前提確認：

- CF branch alias が現 HEAD（dc41792）を配信していることを機械判別。check-runs に `Workers Builds: byte-lark` が success で存在し、配信 CSS が `BaseLayout.4U1bWvU2.css`（PHASE1C-010 削減後のハッシュ）と一致。`@supports (word-break:auto-phrase){h1,h2,h3,h4{text-wrap:balance;word-break:auto-phrase}}` も配信 CSS 内に存在を確認

やったこと：

1. 全 3 記事 × PC 1280px / スマホ 375px の実表示確認（スクショ 11 枚）。崩れなし
   - タイポスケール（h1 32px/24px、h2、h3、本文）、影カード（目次カード・BlogCard）、h2 の朝日ドット、箇条書きの朝日マーカー、カバー画像、カテゴリピル（Tech=空の面 / Life=草原の面）がすべて意図どおり
   - 追従目次（PHASE1C-009）は sticky 追従・スクロール連動ハイライトとも正常動作
   - コードブロック（Shiki github-light）・インラインコード・番号付きリストも崩れなし
2. `/career/` 雇用形態バッジ色の確認（PHASE1B-014 申し送り）→ **修正不要**
   - 実効色をキャンバス合成で実測（透過 /10 面を地の色に重ねてから比を計算）：フリーランス 文字 #075985 / 面 #E2EDF0 = 6.34:1、会社員 文字 #605A50 / 面 #EDF7FD = 6.28:1、副業 文字 #96570A / 面 #F1EADF = 4.80:1。3 種とも AA（4.5:1）通過
   - PHASE1B-002 の暫定色は PHASE1C-002（8da3f73）で確定トークンに合わせ済みだった（sky 面上の sky 文字が 4.3:1 で AA 未達 → sky-deep に差し替え済み）。「sun / wash / チップ面は文字色に使わない」の規約にも違反なし
3. 見出し階層の確認（PHASE1C-006 申し送り）
   - 自前チェック：全 11 ページ（8 ページ + 記事 3 本）で h1 がちょうど 1 個、先頭が h1、レベル飛びゼロを DOM で機械確認
   - Lighthouse（運営者ターミナルで `scripts/lighthouse-audit.sh` を branch alias に実行）：8 ページすべて accessibility 100 / color-contrast pass、JSON から取り出した `heading-order` も 8 ページすべて pass（`/blog/` を含む）
   - ただしスクリプトの `PATHS` が静的 8 ページ固定で記事ページが監査対象外だった → 公開記事 3 本を `PATHS` に追加（記事ページは一覧と DOM 構造が違い、静的ページだけでは裏取りにならないため）。追加後の再実行が残タスク
4. `text-wrap` 修正（bab886d）の全記事確認（PHASE1B-014 申し送り、Chromium 側）→ **現状維持で確定（運営者判断 2026-08-06）**
   - 全ページ・375/768/1280px の見出しについて、Range API で 1 文字ずつ矩形を取り実際の改行位置を採取。`balance + auto-phrase`（現状）/ `pretty + auto-phrase` / `auto-phrase` 単独 を同一 DOM 上で切り替えて比較
   - 語中割れは 1 件のみ：法人化記事タイトルが 768px 以上で `個人事業を法人化した / 話（合同会社バイトラーク設立）`（375px では正常）
   - ただし balance を外すと Cloudflare 記事タイトルが 768px 以上で `…静的サイトのまま問い / 合わせフォームを作る` と語中で割れる。今は balance のおかげで `…のまま / 問い合わせフォームを作る` になっている
   - 13 件の折り返しを比較して balance 有利 6 件 / 不利 6 件とほぼ互角。不利側は career の職務名 h2 が多く `民泊業者の / 清掃管理システム構築（副業）` のように 1 行目が極端に短くなる型
   - 判断：`した / 話（` は禁則上正当な位置、`問い / 合わせ` は語中割れで明確に悪い。どの設定でも同数の不自然さが出るため現状維持（CSS 変更なし）
5. 署名要素の branch alias 裏取り（PHASE1C-008 申し送り）→ 1 の確認に含めて完了。h2 朝日ドット・箇条書き朝日マーカー・影カード・カテゴリピルすべて実記事上で意図どおり

判断メモ：

- CSS / コンポーネントの変更は 0 件。よって `yarn build` 等の再実行とローカル スクショ確認は不要（受け入れ条件どおり N/A）

残タスク（運営者作業・完了後に Done 化）：

- 記事 3 本を追加した `scripts/lighthouse-audit.sh` を再実行し、記事ページの heading-order pass を裏取り（静的 8 ページ分は取得済み・全 pass）
- iPhone Safari 実機で 3 記事の見出し折り返し確認（auto-phrase 非対応エンジンで素の右端折り返しになること）

### 2026-08-06 記事ページ Lighthouse → コードハイライトのコントラスト不足を修正

記事 3 本を `PATHS` に追加して再実行した結果、`heading-order` は 11 ページすべて pass（受け入れ条件クリア）。一方で Cloudflare 記事だけ accessibility 96 / color-contrast fail が出た。

原因と根拠：

- 失敗ノードは `pre.astro-code > code > span.line > span`、色は `#e36209`（関数引数 `request` / `env` / `t` の 5 か所）。白地で 3.49:1 と AA 未達（Lighthouse の explanation と、配信ページ上でキャンバス合成した実測値が一致）
- `github-light`（Shiki 同梱の GitHub 旧世代パレット）の `variable` スコープの色。テーマ定義の文字色 45 指定を全件照合したところ AA 未達はこの 1 色のみ、ただしキーワード 4.57 / コメント 4.82 と他も余裕が薄い

対応（運営者判断 2026-08-06「テーマを変える」）：

- `astro.config.mjs` の `shikiConfig.theme` を `github-light` → `github-light-default`（GitHub 現行の light テーマ）に変更。同じ位置の色が `#953800`＝7.39:1 になり、文字色 45 指定すべてが AA を通る（最小はコメント `#6e7781` の 4.55:1）
- 候補比較：`min-light` / `vitesse-light` は AA 未達の色が複数（それぞれ 3 色 / 11 色）、`light-plus` は見た目が現行のトーンから離れるため不採用
- 検証：再ビルド後の全記事 HTML から `pre.astro-code` 内の色を機械抽出し 8 色すべて AA 通過を確認（最小 4.55、旧 `#e36209` は消滅）。`yarn build` / `check` / `check:ts` / `test:run` 全 green
- ローカル スクショ：記事 2 本（コードブロックを持つのは T1 / T2 の 2 本、T3 は 0 個）× desktop 1280px / mobile 375px で表示確認、崩れなし

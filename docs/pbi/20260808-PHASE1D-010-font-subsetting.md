# 訪問者は低速回線でもフォント転送に足を引かれずページを表示できる

Status: NotStarted

## 誰が
- 訪問者（特に低速回線・モバイル回線）

## 何をできる
- フォントの転送量が実際に使う文字ぶんに絞られ、低速回線でも本文フォント込みで速くページを表示できる

## なんのために
- PHASE1D-004 の本番 Lighthouse で Performance 90+ が 11 ページ中 2 ページ（/ 94、/skills 100）にとどまり、残り 9 ページは 59〜82 だった。受け入れ条件「本番計測で Performance に問題が出た場合のみサブセット化 PBI を起票」の条件が成立したため起票
- 原因はページあたりのフォント転送量（18〜68 ファイル・約 0.35〜1.1MB。日本語グリフの多いページほど重く、スコアと完全に連動）。実測の初回描画は 0.3〜2.6 秒と良好だが、Lighthouse の低速回線シミュレーションがこれを 5〜7 秒に増幅して採点する
- 関連: site-plan NFR（Lighthouse 90+）/ PHASE1C-003・007・010（現行フォント方式の確定経緯）

## 受け入れ条件
- [ ] サブセット化の方式を調査・選定（ビルド時に全ページの使用グリフを走査して必要分だけのフォントを生成する方式。subfont / fonttools 系等。Astro Fonts API（`fontProviders.local()`）との共存可否が論点）
- [ ] 見出し（Zen Kaku Gothic New 500/700）と本文（Noto Sans JP Variable）の両方を対象に、ページあたりフォント転送量を数百 KB 級以下へ削減
- [ ] 表示退行なし：全ページ × desktop / mobile で字形・ウェイトの欠け（豆腐・フォールバック混在）がないことを確認。動的に増える文字（今後の記事）への追従方法をビルドフローとして確立
- [ ] CLS 退行なし：≈0 を維持（PHASE1C-007 の optional / swap 方針は原則維持、変更する場合は CLS 実測を添えて判断）
- [ ] 本番ドメインで Lighthouse Performance 90+ を全主要ページで確認（`bash scripts/lighthouse-audit.sh https://byte-lark.com performance`、運営者ターミナル実行）
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）（CLAUDE.md §7）

## 技術メモ
- 現行方式は確定事項として尊重する：Astro Fonts API + `fontProviders.local()`（PHASE1C-007）、見出し swap / 本文 optional（PHASE1C-003。swap 化は最大 CLS 0.09 の実測根拠あり）。サブセット化は「配るファイルを軽くする」変更であり、読み込み戦略の変更ではない
- unicode-range 分割サブセット（現行）は「使う文字を含むファイルだけ落ちる」仕組みだが、和文は 1 ページで多数のレンジに散るため 18〜68 ファイルになる。ページ使用グリフ限定のサブセットならこれを 1〜数ファイルに畳める
- 計測の一次データ：PHASE1D-004 実装ログの Lighthouse 結果表を参照
- 実施時期は運営者判断（公開ブロッカーではない。Phase 1d 内で他 PBI と並行可、1e 送りも可）
- 想定セッション数: 1〜2（方式調査に 1、組み込み・検証に 1）

## 実装ログ（着手後に追記、中断時は必須）
（未着手）

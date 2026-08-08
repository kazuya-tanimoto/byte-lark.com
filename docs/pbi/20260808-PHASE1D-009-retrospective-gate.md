# 運営者と Claude は Phase 1d 完了状態（公開成立）を確認し、次 Phase への学びを申し送ることができる

Status: NotStarted

## 誰が
- 運営者 + Claude（Gate PBI の例外。README §4.3）

## 何をできる
- Phase 1d の全 PBI が Done になり、サイトが本番ドメインで公開・監視されている状態を確認できる
- Phase 1d で得た知見・想定外を集約し、次 Phase（1e 以降）起票時の参考資料として明文化できる

## なんのために
- 公開作業の学び（NS 移管・本番計測・監視点火の実際）が記録されないまま定常運用に入るリスクを排除するため
- 関連: site-plan §7（ロードマップの Retrospective Gate）/ Phase 1d / Phase 1e

## 受け入れ条件

### Phase 1d 完了確認
- [ ] PHASE1D-001〜008 のすべてが Status: Done（Done を打つ直前にスナップショットを取り直す。1C-012 の学び：Gate 実施中に Phase 内 PBI が増えうる）
- [ ] `docs/pbi/INDEX.md` の Phase 1d セクションがすべて `[Done]` 表示（009 は本 Gate）
- [ ] main で `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がすべて成功 + CI green
- [ ] https://byte-lark.com が正常表示（公開状態の最終確認）

### 学びの集約
- [ ] 本 PBI の `## 次 Phase への申し送り` セクションに記入：確定した技術前提（実際に動いた構成）/ 発生した想定外と回避策 / 計画書と実態の差分 / 次 Phase 起票時の注意
- [ ] 申し送り棚卸し（README §4.6 ルール 8）：Phase 1d 全 PBI の実装ログにある申し送り・積み残しを項目単位で列挙し、PBI 化 / 持ち越し / 破棄 のいずれかに判定して表にする。前 Gate（PHASE1C-012）の持ち越し項目（フォント転送量 / T1 記事の「最良モデル」ブログ URL 未特定 / ダークモード関連が 001 で申し送りになった場合はその分）も同じ表で再判定する
- [ ] 次の動き方を運営者と確認：Phase 1e はカテゴリ別一覧（FR-19、記事 10 本到達時に起票）、Phase 2 は記事 30 本以上。当面は R-01 月次 routine での記事追加が主活動

### CLAUDE.md / site-plan / README の整合確認
- [ ] 公開後の実態に合わせた更新の要否判断と実施：CLAUDE.md のブランチ運用（1d 完了後は main 起点の feat/phase-1e+、README §10.3 / §10.6）・CF preview 検証手順の扱い（branch alias の今後）・site-plan §13 現在地
- [ ] site-plan §14 の全パターンで grep し、連動更新漏れがないこと

### 完了処理
- [ ] 本 PBI の Status を Done に更新、INDEX.md 同期
- [x] ローカル スクショ確認：N/A（本 Gate の変更は docs のみ）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（Gate 通過判定として HEAD の CI green を `scripts/ci-status.sh` で別途確認）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- PHASE0-010 / PHASE1A-022 / PHASE1B-014 / PHASE1C-012 と同じ Gate 構造

## 備考
- Phase 1d（公開）の Retrospective Gate。draft-phase1d-domain-launch.md の正式化群の締め

## 実装ログ（着手後に追記、中断時は必須）
（未着手）

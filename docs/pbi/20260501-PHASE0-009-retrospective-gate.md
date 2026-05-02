# 運営者と Claude は Phase 0 完了状態を確認し、Phase 1a への学びを次セッションへ申し送ることができる

Status: NotStarted

## 誰が
- 運営者 + Claude

## 何をできる
- Phase 0 の全 PBI が Done になったことを確認できる
- Phase 0 で得た技術的知見・想定外・つまずきを集約し、Phase 1a PBI 起票時の参考資料として明文化できる
- Phase 1a 着手の前提条件（インフラ・ローカル動作・依存・規約）が整っていることを確認できる
- 別セッションが本 Gate PBI を読むだけで、Phase 1a PBI を学びを反映してドラフトできる状態にする

## なんのために
- Phase 0 の学びが Phase 1a の PBI 設計に反映されないまま着手するリスクを排除するため
- 別セッション運用前提で、人（運営者）+ AI（Claude）両方が学びを引き継げる仕組みを担保するため
- 関連: site-plan.md §7（ロードマップの Retrospective Gate）/ Phase 0

## 受け入れ条件

### Phase 0 完了確認
- [ ] PHASE0-001 〜 PHASE0-008 および PHASE0-010 のすべてが Status: Done になっている
- [ ] `docs/pbi/INDEX.md` の Phase 0 セクションがすべて `[Done]` 表示
- [ ] feat/rebuild-astro ブランチで `yarn dev` / `yarn build` / `yarn check` / `yarn check:ts` がすべて成功する状態

### 学びの集約（本 PBI 内に書き出す）
- [ ] 本 PBI の `## Phase 1a への申し送り` セクションに以下を記入：
  - [ ] **確定した技術前提**：実際に動いた構成（Astro バージョン、Tailwind 統合方法、shadcn セットアップ手順、Yarn linker 設定 等）
  - [ ] **発生した想定外と回避策**：Phase 0 の各 PBI 実装ログから抽出
  - [ ] **計画書 v3.6 と実態の差分**：あれば（site-plan.md / 各 PBI の記述で間違っていた点）
  - [ ] **Phase 1a 起票時の注意**：Phase 1a PBI のどこに修正が必要か / そのままで OK か
  - [ ] **Phase 1a で先に決めるべき事項**：Phase 0 中に発覚した未決事項（仮 HEX 候補、コードハイライト候補等を Phase 1a 冒頭で確定する旨）

### CLAUDE.md / site-plan.md の整合確認
- [ ] CLAUDE.md（PHASE0-005 で書き換え済）の記述と Phase 0 の実態に齟齬がないか確認、齟齬あれば本 PBI 内で記録（修正は別 PBI で対応可）
- [ ] site-plan.md と Phase 0 実装結果に大きな差分があれば、本 PBI 内で記録

### マージ
- [ ] feat/rebuild-astro ブランチを main にマージする（または運営者が手動でマージ）
- [ ] マージ後、Cloudflare Pages の本番ビルドが成功する
- [ ] 本 PBI の Status を Done に更新、INDEX.md 同期

### 次セッションへのトリガー
- [ ] 本 PBI が Done になった時点で、次セッションは「Phase 1a PBI 起票」を最初のタスクとして実行可能
- [ ] CLAUDE.md の「How to draft next-Phase PBIs」プロトコルが本 Gate を読むよう誘導していることを確認

## 技術メモ
- 本 PBI は **コード変更を伴わない**（学びの集約と確認のみ）
- Phase 0 の各 PBI 実装ログを横串で読む作業：以下で grep 可能
  ```bash
  grep -l "実装ログ" docs/pbi/20260501-PHASE0-*.md
  ```
- 「Phase 1a への申し送り」セクションは構造化して書く：次セッションが機械的に拾える形に

## 備考

### Gate 通過の判断基準

すべての受け入れ条件を満たし、かつ運営者が「Phase 1a に進んで OK」と明示的に承認した時点で Done。

### 次 Phase（1a）の PBI 起票プロトコル（CLAUDE.md からの参照先）

別セッションが Phase 1a PBI 起票を行う際の手順：

1. 本 Gate PBI の `## Phase 1a への申し送り` を読む（5 サブセクションすべて）
2. Phase 0 各 PBI の `## 実装ログ` を読み、申し送りに含まれていない学びを補完。**抽出対象**：
   - 各 PBI の `### YYYY-MM-DD セッション N` の **「想定外だった点」** 項（必ず拾う）
   - 各 PBI の **「学び・つまずき」** 項（Phase 1a に影響しそうなもの）
   - 各 PBI の **「残タスク」** 項（Phase 0 中に解消されず Phase 1a 持ち越しになったもの）
3. site-plan.md 最新版を読む
4. Phase 1a 用 PBI をドラフト（FR-01〜21, 22-27 等を分解）
5. INDEX.md に追加（Status: NotStarted）
6. 起票完了 → 別セッションでレビュー → 必要ならブラッシュアップ → さらに別セッションで実装

## Phase 1a への申し送り

（**Phase 0 完了時に記入する。テンプレート段階では空欄**）

### 確定した技術前提
（Phase 0 完了時に記入）

### 発生した想定外と回避策
（Phase 0 完了時に記入）

### 計画書 v3.6 と実態の差分
（Phase 0 完了時に記入。差分なければ「なし」と明記）

### Phase 1a 起票時の注意
（Phase 0 完了時に記入）

### Phase 1a で先に決めるべき事項
（Phase 0 完了時に記入）

## 実装ログ
（未着手）

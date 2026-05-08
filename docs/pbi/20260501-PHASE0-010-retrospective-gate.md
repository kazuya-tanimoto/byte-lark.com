# 運営者と Claude は Phase 0 完了状態を確認し、Phase 1a への学びを次セッションへ申し送ることができる

Status: NotStarted

## 誰が
- 運営者 + Claude

## 何をできる
- Phase 0 の全 PBI が Done になったことを確認できる
- Phase 0 で得た技術的知見・想定外・つまずきを集約し、Phase 1a PBI 起票時の参考資料として明文化できる
- Phase 1a 着手の前提条件（インフラ・ローカル動作・依存・規約）が整っていることを確認できる
- feat/phase-0 を main にマージし、Cloudflare Pages の本番ビルド成功 / 本番 URL 表示 / Web Analytics 注入を確認できる
- R-14（CF Pages フリープラン制限）のベースラインを把握できる
- 別セッションが本 Gate PBI を読むだけで、Phase 1a PBI を学びを反映してドラフトできる状態にする

## なんのために
- Phase 0 の学びが Phase 1a の PBI 設計に反映されないまま着手するリスクを排除するため
- 別セッション運用前提で、人（運営者）+ AI（Claude）両方が学びを引き継げる仕組みを担保するため
- 関連: site-plan.md §7（ロードマップの Retrospective Gate）/ Phase 0

## 受け入れ条件

### Phase 0 完了確認
- [ ] PHASE0-001 〜 PHASE0-009 のすべてが Status: Done になっている
- [ ] `docs/pbi/INDEX.md` の Phase 0 セクションがすべて `[Done]` 表示
- [ ] feat/phase-0 ブランチで `yarn dev` / `yarn build` / `yarn check` / `yarn check:ts` がすべて成功する状態

### 学びの集約（本 PBI 内に書き出す）
- [ ] 本 PBI の `## Phase 1a への申し送り` セクションに以下を記入：
  - [ ] **確定した技術前提**：実際に動いた構成（Astro バージョン、Tailwind 統合方法、shadcn セットアップ手順、Yarn linker 設定 等）
  - [ ] **発生した想定外と回避策**：Phase 0 の各 PBI 実装ログから抽出
  - [ ] **計画書（現行バージョン） と実態の差分**：あれば（site-plan.md / 各 PBI の記述で間違っていた点）
  - [ ] **Phase 1a 起票時の注意**：Phase 1a PBI のどこに修正が必要か / そのままで OK か
  - [ ] **Phase 1a で先に決めるべき事項**：Phase 0 中に発覚した未決事項（仮 HEX 候補、コードハイライト候補等を Phase 1a 冒頭で確定する旨）

### CLAUDE.md / site-plan.md の整合確認
- [ ] CLAUDE.md（PHASE0-005 で書き換え済）の記述と Phase 0 の実態に齟齬がないか確認、齟齬あれば本 PBI 内で記録（修正は別 PBI で対応可）
- [ ] site-plan.md と Phase 0 実装結果に大きな差分があれば、本 PBI 内で記録

### マージ
- [ ] feat/phase-0 ブランチを main にマージする（merge commit 維持で履歴を残す）：
  ```bash
  git checkout main
  git pull origin main
  git merge --no-ff feat/phase-0 -m "Merge Phase 0: project initialization"
  git push origin main
  ```
- [ ] feat/phase-0 は remote に保持（PBI 単位の checkout 用、削除しない）
- [ ] 詳細手順は docs/pbi/README.md §10.6 参照

### 本番デプロイ確認（main マージ後）
- [ ] main へのマージで PHASE0-008 で接続した **Cloudflare Pages の本番ビルド**が自動実行される
- [ ] 本番 URL にアクセスして最小ページが表示される
- [ ] Cloudflare Web Analytics のスクリプト埋込が本番 HTML に存在することを確認（観測方法：DevTools の Network タブで `cloudflareinsights.com/beacon.min.js` が読込まれていること、または View Source で `<script ... data-cf-beacon=...>` の存在を確認。実データの反映は数時間かかる場合があるため、計測開始の確認は本 PBI スコープ外）

### R-14（フリープラン制限監視）の最初のチェック
- [ ] Cloudflare Pages ダッシュボードで本月のビルド回数・帯域使用量を一度確認し、ベースライン把握
- [ ] 月次レビューで使用量 80% 到達を監視する旨を運営者がメモ（site-plan.md §9 R-14）

### 完了処理
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

### 申し送り種（Phase 0 完了時に Phase 1a 申し送りへ反映すること）

事前に判明している論点を、Phase 0 完了時の retrospective で必ず再評価し、上の `## Phase 1a への申し送り` 各サブセクションに記入する。

- **インフラ（CF Pages vs Workers）の再評価**：Astro 公式 deploy guide が `Cloudflare recommends using Cloudflare Workers for new projects` と明記（2026-05-07 audit 確認）。Cloudflare Pages は依然 supported で deprecated ではないが、new projects 推奨は Workers。Decision Log #17（site-plan.md）は Pages 維持で確定済、Phase 0 では PHASE0-008 で Pages を実装する方針。Phase 1a 起票時に「Pages 継続のまま Phase 1a 進行」か「Workers 切替を別 PBI 化」を運営者と再確認する。判断材料：（a）静的中心ブログでは技術差は拮抗、（b）切替は `@astrojs/cloudflare` adapter + wrangler.jsonc 構成への書換が必要、（c）Pages の機能更新ペースは Workers より遅い傾向。

- **Web Analytics の有効化**：PHASE0-008 実装時（2026-05-08）に判明。Pages プロジェクトの Metrics タブは static-only Worker では利用不可、アカウントレベルの Web Analytics は `pages.dev` ドメインでは自動注入不可。`byte-lark.com` カスタムドメインを Cloudflare に追加した後であれば自動注入が有効になる。Phase 1a のカスタムドメイン PBI に Web Analytics 有効化を含めること。

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

### 計画書（現行バージョン） と実態の差分
（Phase 0 完了時に記入。差分なければ「なし」と明記）

### Phase 1a 起票時の注意
（Phase 0 完了時に記入）

### Phase 1a で先に決めるべき事項
（Phase 0 完了時に記入）

## 実装ログ

### 2026-05-07 着手前 audit（実装セッション外）
- Handoff `docs/handoff/2026-05-06-01-phase0-pbi-audit.md` に従い、PBI 本文の empirical claim を一次情報で照合。
- 確認：`docs/pbi/README.md` §10.6（Phase 完了時の main マージ手順）の参照位置が現 v2.8 でも有効 ✓ / `site-plan.md` §7 ロードマップ・Retrospective Gate 表記実在 ✓ / `## Phase 1a への申し送り` セクションテンプレ・grep コマンド例の妥当性 ✓
- 結果：**drift なし**（着手時の二度手間を防ぐため記録）。
- 補足：本 PBI は CLAUDE.md の「How to draft next-Phase PBIs」セクションが PHASE0-005 で書き込まれている前提で受け入れ条件を立てる。本 audit セッションでは CLAUDE.md は slim 暫定版のままだが、PHASE0-010 着手時には PHASE0-005（先行）が完了している前提のため、依存順序的に問題なし。

### 2026-05-07 audit 続編（Handoff 03）
- 「## 備考 / 申し送り種」セクションを新設、Astro 公式 docs（2026-05-07 取得）の `Cloudflare recommends using Cloudflare Workers for new projects` を根拠に、Phase 0 完了時の Pages vs Workers 再評価論点を明文化。
- Decision Log #17 は Pages 維持で確定済、Phase 0 は Pages のまま完走、再評価は Phase 1a 起票時に運営者と実施。
- 包括 cross-check（7 軸 × 8 doc）実施：(a) library version / (b) PBI ID / (c) §N / (d) ファイルパス / (e) 最終更新日付 / (f) Phase ラベル / (g) URL。**drift 0 件**（PHASE0-002 title の `Astro 5` 残存・README.md の旧 repo URL・biome.jsonc schema 1.5.3 はそれぞれ worktree 改訂・PHASE0-006 全文置換・PHASE0-004 migrate で解消予定の既知箇所のため対象外、`docs/writing-workflow.md` 未実在は Phase 1a 冒頭で作成予定の意図的な未来 reference）。

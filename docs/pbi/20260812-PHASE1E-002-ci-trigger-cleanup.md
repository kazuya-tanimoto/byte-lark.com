# 運営者と Claude は、1 つの変更につき CI を 1 巡だけ走らせ、PR 1 か所を見てマージ可否を判断できる

Status: Done
Started: 2026-08-12
Completed: 2026-08-12

## 誰が
- 運営者 + Claude（変更を push してマージまで持っていくとき）

## 何をできる
- 同じコミットに `quality` / `e2e` が 2 本ずつぶら下がる状態がなくなり、check 欄が 1 セットになる
- 最初の push の直後に draft PR を作ることで、CI と CF preview ビルドが同時に始まる
- 緑になった瞬間に誤ってマージされない（draft のうちはマージできない）

## なんのために
- `quality.yml` / `ui-tests.yml` が `push` と `pull_request` の両方で発火しており、PR が開いている間は 1 回の push で 2 巡する。実測（PR #39 の head `7bdd828`）で同一コミットに `quality` ×2 / `e2e` ×2 が付いていることを確認した
- `pull_request` 側は main とマージした結果を検査する（`actions/checkout` の既定が merge ref）。`push` 側はブランチ単体しか見ない。必須チェックは strict 無効（ブランチを最新に保つ要求なし）なので、main が進んだことによる壊れを拾えるのは `pull_request` 側だけ
- push の branch フィルタに `dependabot/*`（`.github/dependabot.yml` で weekly 有効）と `archive/*`（README §10.2）が入っていない。この 2 つは `pull_request` でしか CI が付かないため、`pull_request` を落とす選択肢は取れない

## 受け入れ条件

- [x] `quality.yml` / `ui-tests.yml` の `push` トリガーを `branches: [main]` だけに絞る。`pull_request`（`branches: [main]`）はそのまま
- [x] `quality.yml` に `concurrency`（`cancel-in-progress: true`）を足す。現状は指定が無く、連続 push で古い run が走り続ける（`ui-tests.yml` には既にある）
- [x] `docs/pbi/README.md` §10.4〜§10.6 を「最初の push の直後に draft PR → 検証 → `gh pr ready` → merge」の手順に書き換える。版を v3.10 に上げ、§11 改訂履歴に 1 行足す
- [x] `CLAUDE.md` §7 の検証手順を同じ形に更新する（`scripts/ci-status.sh` を読む前提が「push で CI が走る」から「draft PR で CI が走る」に変わるため）
- [x] 実地確認：本ブランチへの push だけでは Actions の run が出ないこと（`push` フィルタが main だけになった証明）→ push 後に `gh run list --branch chore/ci-trigger-cleanup` が 0 件。付いた check-run は CF の `Workers Builds` 1 本だけ
- [x] 実地確認：draft PR を作ると `quality` / `e2e` が起動し、head SHA に付く check-run が**各 1 本**であること → PR #41（draft）で両方 success。`3d8250f` の check-run は 7 本すべて名前が一意（`quality` 1 / `e2e` 1 / `Workers Builds` 1 / `CodeQL` 1 / `Analyze` 3 種）
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）：N/A（CI 設定と docs のみ。`src/` 非接触で配信物に差分なし）
- [x] CF preview スクショ確認（作業ブランチの branch alias URL）（CLAUDE.md §7）：N/A（同上。preview ビルド自体が走ることは check-run で確認する）
- [x] E2E / CI green 確認（`bash scripts/ci-status.sh` で UI Tests / Quality Checks が success）（CLAUDE.md §7）→ `3d8250f` で Quality Checks / UI Tests とも completed/success

## 技術メモ
- 想定セッション数: 1
- 関連ファイル
  - `.github/workflows/quality.yml:2-6`（トリガー、concurrency 追加）
  - `.github/workflows/ui-tests.yml:2-6`（トリガー）
  - `docs/pbi/README.md` §10.4 / §10.5 / §10.6 / §11
  - `CLAUDE.md`（Multi-session work §7 の検証 3 点）
- ruleset「main protection」は変更しない。必須チェックは check-run 名（`quality` / `e2e`）と head SHA で照合され、発火イベントを問わないため、`pull_request` 側だけでも満たせる（PR #39 の check-runs で両系統が同じ SHA に付いていることを実測済み）
- draft PR でも `pull_request` の `opened` / `synchronize` は発火する。draft のあいだ GitHub 側がマージを止めるのが採用理由（必須レビューは 0 件設定のため、非 draft だと緑になった時点でマージできてしまう）
- concurrency の group を push 側と PR 側で共通化して片方を打ち切る案は不採用。打ち切られた run が `cancelled` の check-run として同じ名前で残り、必須チェックを塞ぐ可能性がある

## 備考
- 本 PBI は PR #38（2026-08-10、`fix/ci-branch-triggers`）で入れた「push トリガーを `fix/*` `chore/*` に拡張」を逆向きに畳む。#38 の目的は「PR 作成まで §7 の `ci-status.sh` 検証が詰まる穴を塞ぐ」ことで、その目的は draft PR を先に作ることで満たされる（CI と preview が同時に始まり、詰まりは起きない）
- 出所は PHASE1D-009 の申し送りではなく、2026-08-12 の運営者からの指摘（CI が push と PR で 2 回走る件）

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-12 セッション 1

- やったこと：
  - `quality.yml` / `ui-tests.yml` の `push` を `branches: [main]` に変更、`pull_request` は据え置き。判断の理由（merge ref を見るので push 側より強い / `dependabot/*` `archive/*` の唯一の経路）を workflow のコメントに残した
  - `quality.yml` に `concurrency`（`quality-${{ github.ref }}` / `cancel-in-progress: true`）を追加。`ui-tests.yml` と同じ扱いに揃えた
  - README §10.4 に draft PR を先に作る手順、§10.6 を `gh pr ready` → merge に変更。v3.9 → v3.10、§11 に改訂履歴 1 行
  - CLAUDE.md の 3 か所（Build & Test Commands / §7 の E2E・CI 検証 / Sandbox 制約）を「draft PR を作らないと CI が走らない」形に更新
  - INDEX.md を同期（冒頭の「次にやること」/ ブランチ運用行 / Phase 1e 表 / 起票済み節 / 改訂履歴）
- 残タスク：なし
- 学び・つまずき：
  - **push 発火が消えたことは「run が 0 件」でしか確認できない**。緑を待つ形の検証と違って、何も起きないことを見にいく必要がある。`gh run list --branch <name>` が空、かつ付いている check-run が CF の `Workers Builds` だけ、という 2 点で確かめた
  - `pull_request` の run は**その PR の merge commit にある workflow ファイル**で走る。今回のようにトリガー自体を書き換える PR では、変更後の設定が自分自身に適用される（`pull_request` を残していなければ、この PR に CI が 1 本も付かないところだった）
  - draft PR でも `pull_request` の `opened` / `synchronize` は普通に発火する。draft は CI を止めるのではなくマージを止める仕組み
- 想定外だった点：
  - 特になし。check-run は 7 本すべて名前が一意で、狙いどおり `quality` / `e2e` の重複だけが消えた

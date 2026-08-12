# 運営者と Claude は、1 つの変更につき CI を 1 巡だけ走らせ、PR 1 か所を見てマージ可否を判断できる

Status: InProgress
Started: 2026-08-12
Completed: -

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

- [ ] `quality.yml` / `ui-tests.yml` の `push` トリガーを `branches: [main]` だけに絞る。`pull_request`（`branches: [main]`）はそのまま
- [ ] `quality.yml` に `concurrency`（`cancel-in-progress: true`）を足す。現状は指定が無く、連続 push で古い run が走り続ける（`ui-tests.yml` には既にある）
- [ ] `docs/pbi/README.md` §10.4〜§10.6 を「最初の push の直後に draft PR → 検証 → `gh pr ready` → merge」の手順に書き換える。版を v3.10 に上げ、§11 改訂履歴に 1 行足す
- [ ] `CLAUDE.md` §7 の検証手順を同じ形に更新する（`scripts/ci-status.sh` を読む前提が「push で CI が走る」から「draft PR で CI が走る」に変わるため）
- [ ] 実地確認：本ブランチへの push だけでは Actions の run が出ないこと（`push` フィルタが main だけになった証明）
- [ ] 実地確認：draft PR を作ると `quality` / `e2e` が起動し、head SHA に付く check-run が**各 1 本**であること（`gh api .../commits/<sha>/check-runs` で名前の重複が無いことを確認）
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）：N/A（CI 設定と docs のみ。`src/` 非接触で配信物に差分なし）
- [ ] CF preview スクショ確認（作業ブランチの branch alias URL）（CLAUDE.md §7）：N/A（同上。preview ビルド自体が走ることは check-run で確認する）
- [ ] E2E / CI green 確認（`bash scripts/ci-status.sh` で UI Tests / Quality Checks が success）（CLAUDE.md §7）

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

（着手）

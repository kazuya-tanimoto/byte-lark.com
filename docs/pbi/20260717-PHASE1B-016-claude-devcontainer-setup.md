# 運営者と Claude は devcontainer の中で Claude Code を安全に全権限自走させ、sandbox 起因の詰まりなしに開発できる

Status: InProgress
Started: 2026-07-17

## 誰が
- Claude（実施）+ 運営者（事前準備: devcontainer CLI 導入 / Docker ランタイム起動 / PAT 発行、および各所の承認）

## 何をできる
- この repo に `.devcontainer/` 一式（公式雛形ベース + repo 向け差分）を導入し、コンテナ内で Claude Code をログイン済み・グローバル CLAUDE.md 反映済みの状態で使える
- コンテナ内で `yarn add` / `yarn test:e2e` など、母艦 sandbox では不可能だったコマンドが通る
- default-deny firewall の中で `--dangerously-skip-permissions` による放置自走ができる
- fish 関数（ccbox）で、今の「repo に移動して `claude`」とほぼ同じ操作感で起動できる

## なんのために
- macOS Bash sandbox（Seatbelt）起因の詰まり（yarn ネットワーク系 / E2E Chromium / docker / 承認多発）を解消し、放置自走を可能にする
- 「専用フル権限 PC」案（2026-06-28 却下）に対する、隔離が本物の代替。母艦の実 OS・認証情報を守ったまま無人実行できる
- 母艦 sandbox の追加緩和はやらない（防御を薄くするだけ）という決定の実装

## 受け入れ条件
- [ ] [docs/devcontainer-plan.md](../devcontainer-plan.md) §6 のステップ 1〜8 を、各ステップの完了条件どおりに完了（計画書が単一の実施手順書。読み直してから着手。ステップ 8 = dotfiles への型紙化は 2026-07-17 運営者指示で追加）
- [ ] `.devcontainer/` 一式が §3 の安全原則（持ち込みコピー・書き戻し禁止 / コンテナ用 settings 新規 / PAT 最小権限）を満たしていることを、diff 提示のうえ運営者が承認
- [ ] firewall 自己検証（example.com 遮断 + api.github.com 到達）のログを確認
- [ ] コンテナ内で `yarn install` / `yarn build` / `yarn test:run` / `yarn test:e2e` green + `yarn add` 系が sandbox 起因の失敗なく通ることを確認
- [ ] コンテナ発の push → CI green（PAT 経路の確認）
- [ ] `--dangerously-skip-permissions` で小タスク 1 件を完走（放置自走の試運転）
- [ ] CLAUDE.md / docs/operation-manual.md にコンテナ/母艦の住み分け・起動手順・書き戻し禁止原則を追記
- [ ] ローカル スクショ確認（desktop + mobile）：N/A（理由: 開発環境整備でサイト UI 非変更）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）：N/A（理由: 同上）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：repo へのファイル追加を伴うため実施必須（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 2（①環境構築〜基本動作 = 計画書 §6 ステップ 2〜5 / ②push 経路・自走試運転・文書化 = ステップ 6〜7。ステップ 1 は運営者の事前準備）
- 検討の経緯・調査済み事実・設計方針・未決事項は**すべて [docs/devcontainer-plan.md](../devcontainer-plan.md) に固定化済み**（2026-07-17 検討セッション）。本 PBI には重複記載しない。計画書 §7 の未決事項（ベースイメージ / PAT の渡し方等）は実施時に一次情報で確定し、計画書側を更新すること
- 事前準備コマンド（`npm i -g @devcontainers/cli` 等）は sandbox 内で実行不可 → 運営者に Claude Code 外のターミナルでの実行を依頼する
- ビルド・起動（`devcontainer up` / `docker`）も sandbox 非互換の可能性が高い → 実施時に切り分け、不可なら運営者ターミナルで実行してもらいログを貼ってもらう運用（`!` プレフィックス案内は禁止、CLAUDE.md シェル節）

## 実装ログ

### 2026-07-18 セッション①前半（ステップ 2: `.devcontainer/` 一式の作成 — 運営者承認待ち）

- やったこと
  - 計画書 §7 の未決事項 4 件をすべて一次情報で確定し、計画書 §7 を確定内容に更新（ベースイメージ node:24 / PAT はコンテナ内 `gh auth login` + 専用 volume / raw.githubusercontent.com は meta 帯に含まれるが明示追加 / MCP Playwright はコンテナに入れない）
  - `.devcontainer/` 6 ファイルを作成（公式雛形 2026-07-17 取得分ベース）：devcontainer.json / Dockerfile / init-firewall.sh / allowed-domains.conf / claude-settings.json / setup-container.sh + fix-perms.sh。bash・fish・JSON の構文チェック済み
  - ステップ 8（型紙化）を見据え、repo 固有の許可ドメインを allowed-domains.conf に分離（テンプレ本体は repo 間共通）
  - 計画書 §2.5（追加実測）/ §4（最終構成）/ §9（出典）を更新。§6 ステップ 2 の記述を §4 の ccbox 方針（dotfiles 管理）に整合
- 残タスク
  - 運営者：ステップ 1（devcontainer CLI 導入 / PAT 発行。OrbStack は起動済みらしいが `docker info` は sandbox から確認不可）
  - diff 承認 → commit → ステップ 3 以降（ビルド系は運営者ターミナルで実行しログを貼ってもらう運用）
- 学び・つまずき
  - 母艦 repo の node_modules は macOS ARM バイナリ入りで、bind mount のままコンテナと共用すると相互破壊 → named volume で分離し、yarn install-state も `YARN_INSTALL_STATE_PATH` でコンテナ内へ退避（計画時に見えていなかった論点）
  - devcontainer CLI 未導入・docker socket は sandbox から権限拒否を実測（ステップ 1 未完のまま着手した分はステップ 2 の範囲で完結）
  - セッション途中で運営者が計画書に §6 ステップ 8 と §4 ccbox 方針変更（repo に置かない）を追記 → 作成済みの scripts/ccbox.fish を削除して追随

## 備考
- Phase 非依存の開発環境整備（横断タスク）。PHASE1A-021 / PHASE1B-015 の「依存なし・任意タイミング」前例に倣い Phase 1b 期中に起票するが、サイト品質と無関係のため **Gate（PHASE1B-014）の完了確認対象には含めない**（Gate ファイルに対象外の旨を明記済み）
- 採番は起票順のため Gate（PHASE1B-014）より後の番号

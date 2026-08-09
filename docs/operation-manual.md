# 運用マニュアル（運営者向け）

最終更新: 2026-07-19

本ファイルは byte-lark.com プロジェクトの**運営者（人間ユーザー）向け運用マニュアル**です。Claude Code との多セッション運用において、運営者が「何を / いつ / どう言えばいいか」をまとめます。

Claude 側のプロトコル本体は `docs/pbi/README.md` §5 と CLAUDE.md（PHASE0-005 完了後）に書かれているので、本ファイルは**運営者が主語の操作のみ**を扱います。

---

## 1. シーン別の運営者操作

| シーン | 運営者の発言例 | Claude の自動応答 |
|---|---|---|
| **作業開始（初回 / 任意のタイミング）** | `PBIの対応して` / `次のタスク進めて` | INDEX.md → README §5 経由で次の PBI を特定 → §5.8 検出スクリプト実行 → 実装着手 |
| **中断（コンテキスト消費 / 時間切れ）** | `ここまでで終了` / `中断します` / `今日はここまで` | InProgress な PBI の `## 実装ログ` に「やったこと / 残タスク / 学び / 想定外」追記 → WIP コミット → 報告 |
| **再開（同一 PBI を続行）** | `続き進めて` / `再開して` | 該当 PBI の実装ログを読んで状況把握 → 続行 |
| **Phase 0 全完了後の Phase 1a PBI 起票** | `Retrospective Gate (PHASE0-010) の申し送りに従って Phase 1a の PBI を起票して` | Gate PBI の「Phase 1a への申し送り」セクション + 各 Phase 0 PBI の実装ログを読み、Phase 1a PBI をドラフト |
| **並行 PBI 開始指示** | `PHASE1B-010 と PHASE1C の PBI を並行で進めたい。手順教えて` | **別名でローカルに clone した別作業ツリー**で 2 つ目のセッションを起動（例：`git clone <repo> byte-lark-articles` → その中で `ccd`。初回のみ `gh auth login` と `yarn install`）。同一作業ツリーでの 2 セッション同時作業は禁止（1 ツリー 1 セッション、README §9 並行運用）。両方 `feat/phase-1` に直 commit/push、push 競合は `git pull --rebase` で解消（下記 Q6 / README §10.7） |
| **公開フェーズ（1d）の main マージ承認** | `Phase 1d で公開、feat/phase-1 を main にマージしていい？` | Phase 1d PBI の受け入れ条件を再確認 → OK なら `git merge --no-ff feat/phase-1` で main へマージ + push。**公開前の 1a / 1b / 1c Gate ではマージしない**（README §10.6 / site-plan §8 Decision #25） |
| **計画書のレビュー依頼** | （別セッションでレビュープロンプトを使用） | レビュー結果を別セッションから持ち込み、本セッションで反映 |
| **その他全部** | （特に何もしない、Claude 任せ） | プロトコル通りに自動進行 |

## 2. 中断 signal を出し忘れた時のリカバリー

セッションを no-warning で閉じてしまった場合：

1. 次セッション開始時、CLAUDE.md ヘッダー / INDEX.md 着手ルールの指示に従い、Claude が **README §5.8 の検出スクリプトを必ず実行**する（v3.6 から必須化）
2. InProgress なのに実装ログが空の PBI が検出されると、Claude が `WARNING: 実装ログ entry 無し → <PBI ファイル>` と報告
3. Claude が「PHASE0-NNN が InProgress ですが実装ログが空です。前回の状況を覚えていますか？」と運営者に確認
4. 運営者が記憶を頼りに状況説明 → Claude が実装ログを補完して再開

→ 情報損失の可能性はあるが、**完全に迷子にはならない仕組み**。とはいえ手間が増えるので、可能な限り中断 signal は出すこと。

## 3. ユーザー（運営者）が意識すべきこと

### 必須

- **セッション終了前に必ず一言**：「終了」「中断」「ここまで」のいずれかを言ってから閉じる
- **GitHub UI 操作**：Cloudflare Pages 接続（PHASE0-008）、リポジトリ設定変更等、Claude が手元で完結できない操作は運営者がダッシュボード操作
- **main 保護設定**（プロジェクト初期化時 1 回）：GitHub UI の Branch protection rules で main への直接 push を禁止、PR 経由必須に
- **Cloudflare Pages の Preview Branch Filter 設定**（プロジェクト初期化時 1 回）：CF Pages ダッシュボードで Custom branches に Include `feat/phase-*` を設定（sub-branch は v3.0 で廃止したため Exclude パターンは不要。詳細 README §10.8）

### 推奨

- **実装ログの sanity check**：Claude が中断時に書いた `## 実装ログ` を眺め、認識が事実と合っているか確認。違和感あれば「残タスクここも書いて」「〇〇は事実誤認」等で修正させる
- **コンテキスト消費の監視**：1 セッション内で複数 PBI 進める場合、Claude のコンテキストが膨らみ過ぎる前に区切る（目安：大きな PBI 1 つ完遂、または小さな PBI 2-3 件で 1 セッション）

### 任意

- **Done 化後の commit メッセージ確認**：Claude は `feat(pbi): PHASEn-NNN ...` 規約に従うが、内容は git log で見て妥当か確認

## 4. トラブルシューティング

### Q1: Claude が「次のタスク」を間違える

- **原因候補**：INDEX.md と PBI の Status 不整合 / 推奨着手順序図と実際の依存関係のズレ
- **対処**：`docs/pbi/INDEX.md` を Read で開いて Status 一覧を確認、不整合あれば手動修正 or Claude に「INDEX.md と PBI 群の Status を grep で照合して」と依頼

### Q2: pre-commit hook が失敗する

- **原因候補**：`yarn check` / `yarn check:ts` / `yarn test:run` のいずれかが失敗
- **対処**：失敗内容を Claude に共有 → Claude が原因特定して修正 → 再 commit。`--no-verify` での skip は **禁止**（CLAUDE.md ガイドライン）

### Q3: バージョン番号が混在している

- **原因候補**：site-plan / PBI の自己参照箇所の連動更新漏れ
- **対処**：site-plan §14「バージョン参照箇所一覧（メンテ用）」の grep パターンを実行、漏れ箇所を特定 → Claude に修正依頼

### Q4: Claude が同じ作業を繰り返している（無限ループ）

- **対処**：明示的に「やめて」と止め、状況を整理。PBI の受け入れ条件が曖昧な可能性 → Claude に「受け入れ条件を再確認、解釈に迷うなら確認してから続けて」と指示

### Q5: 計画とズレた実装が始まりそう

- **対処**：「計画書（site-plan）の §X や PBI の受け入れ条件と乖離している」と指摘、Claude に方針確認させる

### Q6: 並行作業中の `git push` が non-fast-forward で fail する

- **原因**：別セッションが先に `feat/phase-1` へ push しており、手元のブランチが古くなっている（並行作業は別 clone の複数セッションが同一ブランチへ push する運用。README §9 並行運用）
- **対処**：`git pull --rebase origin feat/phase-1` → conflict あれば手動 resolve（INDEX.md は隣接 PBI 行が同 hunk として競合しやすい）→ `git push origin feat/phase-1`
- **詳細**：[docs/pbi/README.md](pbi/README.md) §10.7 参照

## 5. devcontainer（コンテナ自走環境）の運用

Claude Code をコンテナ内で全権限自走させるための環境（PHASE1B-016 で導入。設計・経緯は `docs/devcontainer-plan.md`）。母艦 sandbox で不可能な作業（`yarn add` 等のネットワーク系 / ローカル E2E / 放置自走）はこちらで行う。

### 起動と利用

- 通常起動：`ccd`（fish 関数、dotfiles 管理）。コンテナが無ければビルド・起動してから claude を開く
- 放置自走：`ccd --auto`（alias `ccda` でも可。`--dangerously-skip-permissions` 付き。default-deny firewall 内なので許可プロンプトなしで自走させてよい）
- コンテナ再作成：`ccd --rebuild`（イメージ焼き込みファイルの修正後に使う。下記注意点参照）
- 他 repo への導入：repo ルートで `ccd-init` → 生成される案内に従って調整（型紙と汎用手順は `~/dotfiles/claude/devcontainer/README.md`）
- 初回のみ：コンテナ内で claude ログインと `gh auth login`（PAT 貼り付け）。どちらも専用 volume に永続化され 2 回目以降は不要

### 注意点

- 「`devcontainer up` が success ＝ firewall 有効」ではない（firewall 初期化が失敗してもコンテナは走り続け、次回 up は既存コンテナ検出だけで success を返す）。ccd は claude 起動前に firewall チェックを行い、コンテナ内から example.com に到達できたら起動を拒否する。`devcontainer exec` を直接使うときは `curl -m 5 https://example.com` が**失敗する**ことを確認してから自走させる
- `.devcontainer/init-firewall.sh` 等イメージ焼き込みのファイルを修正したら、`ccd --rebuild`（= `devcontainer up --workspace-folder . --remove-existing-container`）で再ビルドしないと反映されない
- PAT は fine-grained（この repo 限定 / Contents read+write / 無期限運用）。GitHub の fine-grained PAT 一覧で last used を時々確認し、使わなくなったら失効させる
- コンテナから母艦の設定（`~/dotfiles`、`~/.claude` 等）への書き戻しは禁止。グローバル CLAUDE.md は read-only mount からのコピー持ち込みのみ、コンテナ内の Claude 設定は volume 内に閉じる

## 6. サイト監視（health-check.sh）の設置と運用

本番サイトが落ちていないか・書き換えられていないかを Xserver の cron から定期的に見に行き、**異常のときだけ**メールで知らせる仕組み（PHASE1D-007 で導入。なぜこの形なのかは `docs/incident-response.md` §2）。スクリプトの実体はリポジトリの `scripts/health-check.sh`。経路の二重化は、別インフラの外形監視 UptimeRobot を併用して確保します（下記）。

見ているのは 4 つです。

- HTTP ステータスが 200 か（落ちていないか）
- 決めた文字列がページに残っているか（書き換えられていないか。既定は `<title>byte-lark.com</title>` と `合同会社バイトラーク`）
- 配信ヘッダが想定どおりか（公開後に `noindex` が付いていないこと等）
- TLS 証明書の残日数（既定は 14 日を切ったら異常）

1 回の失敗では鳴らしません。**2 回続けて異常**になったときだけ通知します（一時的な回線の揺れで起こされないため）。直ったときは「復旧」の通知が 1 回だけ飛びます。

### 設置手順（Xserver、初回だけ）

1. SSH でログインし、置き場所を作ってスクリプトを取ってくる：

```bash
mkdir -p ~/monitor
curl -sSfL -o ~/monitor/health-check.sh \
  https://raw.githubusercontent.com/kazuya-tanimoto/byte-lark.com/feat/phase-1/scripts/health-check.sh
chmod +x ~/monitor/health-check.sh
```

2. 設定ファイルを作る（監視先を明示しておくだけ。既定値と同じなので省いても動きます）：

```bash
cat > ~/.byte-lark-monitor.env <<'EOF'
MONITOR_URL="https://byte-lark.com"
EOF
chmod 600 ~/.byte-lark-monitor.env
```

3. 手で 1 回動かして、観測値が想定どおりか見る（この `--inspect` は状態も通知も触らない、ただの確認モード）：

```bash
bash ~/monitor/health-check.sh --inspect
```

4. サーバーパネルの「Cron設定」で登録する。
   - 実行コマンド：`/bin/bash /home/<アカウント名>/monitor/health-check.sh`
   - 実行間隔：10 分ごと（分の欄に `*/10`、他は `*`）
   - 通知先メールアドレス：受け取りたいアドレス（cron は**出力があったときだけ**メールを送る。このスクリプトは正常時に何も出力しないので、平常時のメールはゼロ）

5. 通知が本当に届くか、わざと異常を起こして確かめる。branch alias は `noindex` が付くので、これを異常系の実物として使えます。2 回連続で異常になったときに通知が出るので、続けて 2 回叩きます：

```bash
STATE_DIR=~/monitor-test bash ~/monitor/health-check.sh --url https://feat-phase-1-byte-lark.tanimoto-a49.workers.dev
STATE_DIR=~/monitor-test bash ~/monitor/health-check.sh --url https://feat-phase-1-byte-lark.tanimoto-a49.workers.dev
```

1 回目は何も出ず、2 回目に異常の内訳が表示されれば正しい動きです（cron 経由ならこの出力がメールで届きます）。確認したら `rm -rf ~/monitor-test` で後始末します。

### UptimeRobot（外部の死活監視）

Xserver 自体が止まったときに気づけるよう、別インフラからも死活を見ます。無料枠で足ります。

- 監視の種類：HTTP(s)
- URL：`https://byte-lark.com`
- 間隔：5 分
- 通知先：受け取りたいメールアドレス（Xserver 以外で受けられるアドレスにすると、Xserver 障害時も届く）

こちらは死活だけを見ます。改ざん・ヘッダ・証明書の確認は health-check.sh 側の担当です。

### 普段の運用

- 平常時は何も届きません。届いたら異常です。読み方と初動は `docs/incident-response.md` §3 以降。
- スクリプトや cron を触ったら、**必ず一度手で実行**して壊れていないことを確認します（この構成では監視自身の死活を別サービスで見張らない代わりに、これだけは守る。理由は incident-response.md §2）。
- サイトの文言を大きく変えてカナリア文字列が消える場合は、`~/.byte-lark-monitor.env` に `CANARIES=("新しい文字列")` を書いて更新します。書き換えないと誤報が出ます。
- 実行の履歴は `~/.byte-lark-monitor/health-check.log` に 1 行ずつ残ります。

### 主な設定項目

設定ファイル `~/.byte-lark-monitor.env` に書けるもの（すべて任意、書かなければ既定値）。

- `MONITOR_URL`：監視先。既定 `https://byte-lark.com`
- `PATHS`：確認するパス。既定 `("/")`。リダイレクトは追わないので末尾スラッシュまで正確に書く
- `CANARIES`：残っているべき文字列の配列
- `REQUIRE_HEADERS` / `FORBID_HEADERS`：`("ヘッダ名=部分文字列")` の配列。既定は `content-type=text/html` を必須、`x-robots-tag=noindex` を禁止
- `TLS_MIN_DAYS`：証明書の残日数のしきい値。既定 14
- `FAIL_THRESHOLD`：何回連続の異常で通知するか。既定 2
- `MAIL_TO`：`mail` コマンドで直接送りたいときだけ設定。空なら cron のメール設定に任せる（Xserver ではこちらが基本）
- `SLACK_WEBHOOK_URL`：Slack 等の Incoming Webhook。現在は未使用（空）。将来チャット通知を足したくなったらここに URL を書く。**URL は秘密情報**なのでこのファイルの外には出さない

## 7. 関連ドキュメント

| ドキュメント | 役割 | 主な読者 |
|---|---|---|
| `docs/site-plan.md` | サイト構築計画書（要件・設計・ロードマップ・Decision Log） | 全員 |
| `docs/pbi/README.md` | PBI フォーマット規約 + 多セッション運用プロトコル + ブランチ運用（§10） | Claude / PBI を書く人 |
| `docs/pbi/INDEX.md` | 全 PBI 状態一覧 + 着手ルール | Claude / 全員 |
| `docs/pbi/*.md` | 個別 PBI | Claude |
| `docs/writing-workflow.md` | 記事執筆ワークフロー（Phase 1a 冒頭で作成予定） | 運営者 |
| `docs/devcontainer-plan.md` | devcontainer 環境の設計・実施手順（PHASE1B-016） | Claude / 運営者 |
| `docs/incident-response.md` | 監視の方針・インシデント初動フロー・ケース別手順 | 運営者 |
| **本ファイル** | **運営者向け運用マニュアル** | **運営者** |
| `CLAUDE.md` | プロジェクト規約 + 多セッション運用プロトコル（PHASE0-005 で全面書き換え） | Claude |

## 8. 改訂履歴

| 日付 | 変更内容 |
|---|---|
| 2026-05-03 | 初版作成（site-plan v3.6 連動）。シーン別操作表、中断リカバリー、運営者必須・推奨アクション、トラブルシューティング Q1-Q5、関連ドキュメント表 |
| 2026-05-03 | site-plan v3.7 連動：シーン別操作表に「並行 PBI 開始」「Phase 完了 main マージ承認」追加、必須に main 保護 + CF Pages Branch Filter 追加、Q6（push 競合）追加 |
| 2026-05-07 | Q6 に worktree 削除の sandbox 制約と運営者対処を追加（旧 Q6 → Q7 に繰り下げ） |
| 2026-06-14 | ガバナンス文書ドリフト是正（README v3.1 連動）：シーン別表の「並行 PBI 開始」を worktree 廃止後の単一ブランチ運用に、「Phase 完了 main マージ承認」を公開フェーズ（1d）限定に修正。必須チェックリストの CF Pages Branch Filter から sub-branch Exclude を削除。トラブルシューティングから worktree 削除 Q6 を撤去（worktrees 廃止で発生し得ないため）、push 競合 Q7 を Q6 に繰り上げ + 原因記述を単一ブランチ並行に修正 |
| 2026-06-14 | 統合ブランチ改名（README v3.2 連動）：シーン別表・Q6 の `feat/phase-1a` 参照を `feat/phase-1` に更新（1a〜1c を集約する統合ブランチ。deferred-merge 構造は不変） |
| 2026-07-19 | §5 devcontainer 運用を新設（PHASE1B-016 連動）：起動手順（ccd / 手動）、firewall 有効確認、PAT の扱い、書き戻し禁止。旧 §5 関連ドキュメント → §6（devcontainer-plan.md 行追加）、旧 §6 改訂履歴 → §7 に繰り下げ |
| 2026-07-19 | §5 更新（PHASE1B-016 ステップ 8 完了）：ccd / ccda / ccd-init を dotfiles に実装済みとなったため暫定の直接実行手順を削除。`ccd --rebuild` と他 repo 導入（ccd-init + dotfiles 型紙 README）を追記 |
| 2026-08-02 | 並行運用ルール連動（README v3.5）：シーン別表の「並行 PBI 開始」を別名 clone の別作業ツリー前提に更新（同一ツリー 2 セッション禁止、初回 `gh auth login` + `yarn install`）。Q6 の原因記述も別 clone 運用に修正 |
| 2026-08-09 | §6 サイト監視（health-check.sh）の設置と運用を新設（PHASE1D-007 連動）：Xserver への設置手順、cron 登録、通知が届くかの確かめ方、UptimeRobot の設定、普段の運用、主な設定項目。通知はメール単独（運営者決定）、経路の二重化は UptimeRobot が担う。関連ドキュメント表に incident-response.md を追加。旧 §6 関連ドキュメント → §7、旧 §7 改訂履歴 → §8 に繰り下げ |

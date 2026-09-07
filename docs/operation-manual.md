# 運用マニュアル（運営者向け）

最終更新: 2026-08-10

本ファイルは byte-lark.com プロジェクトの**運営者（人間ユーザー）向け運用マニュアル**です。Claude Code との多セッション運用において、運営者が「何を / いつ / どう言えばいいか」をまとめます。

Claude 側のプロトコル本体は `docs/pbi/README.md` §5 と CLAUDE.md（PHASE0-005 完了後）に書かれているので、本ファイルは**運営者が主語の操作のみ**を扱います。

---

## 1. シーン別の運営者操作

| シーン | 運営者の発言例 | Claude の自動応答 |
|---|---|---|
| **作業開始（初回 / 任意のタイミング）** | `PBIの対応して` / `次のタスク進めて` | INDEX.md → README §5 経由で次の PBI を特定 → §5.8 検出スクリプト実行 → 実装着手 |
| **中断（コンテキスト消費 / 時間切れ）** | `ここまでで終了` / `中断します` / `今日はここまで` | InProgress な PBI の `## 実装ログ` に「やったこと / 残タスク / 学び / 想定外」追記 → WIP コミット → 報告 |
| **再開（同一 PBI を続行）** | `続き進めて` / `再開して` | 該当 PBI の実装ログを読んで状況把握 → 続行 |
| **Gate 通過後の次 Phase PBI 起票** | `Retrospective Gate の申し送りに従って次の Phase の PBI を起票して` | Gate PBI の「次 Phase への申し送り」セクション + 直前 Phase 各 PBI の実装ログを読み、次 Phase PBI をドラフト |
| **並行 PBI 開始指示** | `記事執筆と PHASE1E の PBI を並行で進めたい。手順教えて` | **別名でローカルに clone した別作業ツリー**で 2 つ目のセッションを起動（例：`git clone <repo> byte-lark-articles` → その中で `ccd`。初回のみ `gh auth login` と `yarn install`）。同一作業ツリーでの 2 セッション同時作業は禁止（1 ツリー 1 セッション、README §9 並行運用）。それぞれ別の短命ブランチを main から切るので push は競合しない。main が進んで PR が古くなったら `git rebase origin/main`（下記 Q6 / README §10.7） |
| **本番反映（main マージ）の承認** | `この PBI の PR を main にマージしていい？` | PBI の受け入れ条件と CI green を再確認 → OK なら `gh pr merge --merge`（`--delete-branch` は付けない）。**main へのマージ＝ byte-lark.com への公開**で、マージした時点で本番が入れ替わる（README §10.6） |
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
- **main 保護設定**（設定済み・2026-08-09）：GitHub の ruleset「main protection」で main への直接 push を禁止、PR 必須、必須チェック `quality` / `e2e`（詳細 README §10.9）
- **Cloudflare の preview ビルド**（設定不要）：ブランチ名を問わず preview が走ることを実測済み（README §10.8）

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

### Q6: PR が「このブランチは main より遅れています」で止まる

- **原因**：作業中に別セッション（または月次ルーチンの PR）が main を進めた。公開後は 1 作業 1 ブランチなので、同じブランチへの多重 push で衝突することはない
- **対処**：`git fetch origin` → `git rebase origin/main` → conflict あれば手動 resolve（INDEX.md は隣接 PBI 行が同 hunk として競合しやすい）→ `git push --force-with-lease`
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

本番サイトが落ちていないか・書き換えられていないかを Xserver の cron から定期的に見に行き、**異常のときだけ**メールで知らせる仕組み（PHASE1D-007 で導入。なぜこの形なのかは `docs/incident-response.md` §2）。スクリプトの実体はリポジトリの `scripts/health-check.sh`。通知はメール 1 本で、チャット通知や外部の外形監視は足していません（理由は incident-response.md §2）。

見ているのは 4 つです。

- HTTP ステータスが 200 か（落ちていないか）
- 決めた文字列がページに残っているか（書き換えられていないか。既定は `byte-lark.com</title>`（title の末尾）と `合同会社バイトラーク`）
- 配信ヘッダが想定どおりか（`noindex` が付いていないこと、HSTS が外れていないこと）
- TLS 証明書の残日数（既定は 14 日を切ったら異常）

1 回の失敗では鳴らしません。**2 回続けて異常**になったときだけ通知します（一時的な回線の揺れで起こされないため）。直ったときは「復旧」の通知が 1 回だけ飛びます。

### 設置手順（Xserver、初回だけ）

1. SSH でログインし、置き場所を作ってスクリプトを取ってくる：

```bash
mkdir -p ~/monitor
curl -sSfL -o ~/monitor/health-check.sh \
  https://raw.githubusercontent.com/kazuya-tanimoto/byte-lark.com/main/scripts/health-check.sh
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

5. 通知が本当にメールで届くか確かめる。メールを送るのは cron（出力があったときだけ送る）なので、**cron に一時的な項目を足して確かめます**。SSH から手で叩いてもメールは飛びません。

   異常系の実物には作業ブランチの preview URL を使います（`noindex` が付くので必ず異常判定になる）。サーバーパネルの「Cron設定」に、本番用とは別にもう 1 つ登録します。

   - 実行コマンド（1 行。URL は今ある作業ブランチの branch alias に読み替える）：

```
STATE_DIR=/home/<アカウント名>/monitor-test /bin/bash /home/<アカウント名>/monitor/health-check.sh --url https://<ブランチ名>-byte-lark.tanimoto-a49.workers.dev
```

   - 実行間隔：5 分ごと（分の欄に `*/5`）

   1 回目は無出力なのでメールは来ません。**2 回目（約 10 分後）に異常の内訳がメールで届けば正常**です。しきい値が効いていることも同時に確認できます。届いたらこの cron 項目を削除し、`rm -rf ~/monitor-test` で後始末します。

   手元で出力の形だけ先に見たいときは、SSH から同じコマンドを 2 回叩けば同じ内容が画面に出ます。

### 外部の死活監視は入れていません

UptimeRobot のような外部サービスは使っていません。監視が止まる原因のほとんど（スクリプトを消す・壊す）は cron がエラーをメールで送るので気づけますし、静かに止まるのは cron の項目そのものを消したときだけだからです。詳しい理屈は incident-response.md §2 にあります。

そのぶん、次の 2 つだけ守ってください。

- スクリプトや cron を触ったら、必ず一度手で実行して壊れていないことを確かめる
- Xserver からサーバー移行の案内が来たら、移行後に cron 設定が残っているか見る

### 普段の運用

- 平常時は何も届きません。届いたら異常です。読み方と初動は `docs/incident-response.md` §3 以降。
- スクリプトや cron を触ったら、**必ず一度手で実行**して壊れていないことを確認します（この構成では監視自身の死活を別サービスで見張らない代わりに、これだけは守る。理由は incident-response.md §2）。
- サイトの文言を大きく変えてカナリア文字列が消える場合は、更新しないと誤報が出ます（2026-08-13 にトップの title 変更で実際に誤報が出ました）。直し方は 2 通り：
  - 基本は repo の `scripts/health-check.sh` の `CANARIES` を直して main にマージし、設置手順 1 の curl でスクリプトを取り直す（repo が正本。取り直したら必ず一度手で実行）
  - 急ぎで止めたいときだけ、`~/.byte-lark-monitor.env` に `CANARIES=("新しい文字列")` を書いて一時的に上書き（repo 側を直したら消しておく。残すと repo の既定値が効かなくなります）
- 実行の履歴は `~/.byte-lark-monitor/health-check.log` に 1 行ずつ残ります。

### 主な設定項目

設定ファイル `~/.byte-lark-monitor.env` に書けるもの（すべて任意、書かなければ既定値）。

- `MONITOR_URL`：監視先。既定 `https://byte-lark.com`
- `PATHS`：確認するパス。既定 `("/")`。リダイレクトは追わないので末尾スラッシュまで正確に書く
- `CANARIES`：残っているべき文字列の配列
- `REQUIRE_HEADERS` / `FORBID_HEADERS`：`("ヘッダ名=部分文字列")` の配列。既定は `content-type=text/html` と `strict-transport-security=max-age` を必須、`x-robots-tag=noindex` を禁止
- `TLS_MIN_DAYS`：証明書の残日数のしきい値。既定 14
- `FAIL_THRESHOLD`：何回連続の異常で通知するか。既定 2
- `MAIL_TO`：`mail` コマンドで直接送りたいときだけ設定。空なら cron のメール設定に任せる（Xserver ではこちらが基本）
- `SLACK_WEBHOOK_URL`：Slack 等の Incoming Webhook。現在は未使用（空）。将来チャット通知を足したくなったらここに URL を書く。**URL は秘密情報**なのでこのファイルの外には出さない

## 7. 依存更新 PR の受け方

`.github/dependabot.yml` の設定で、毎週 Dependabot が更新の提案を PR として送ってきます。内訳は 2 種類です。

- まとめて 1 本：バージョンの上 1 桁が変わらない更新（minor / patch）。何十件でも 1 本にまとまります
- 個別に 1 本ずつ：上 1 桁が変わる更新（メジャー）。壊れる可能性があるので分けて届きます

### 誰がいつ見るか

運営者は届いた PR を自分で読む必要はありません。週 1 回程度、作業セッションの冒頭に Claude へ「Dependabot の PR を見て」と言えば足ります。急ぐのはセキュリティのアラートが出たときだけで、それは別経路（GitHub のアラート通知）で届きます。

### Dependabot の PR は直接マージしない

Dependabot は main を見て PR を作りますが、作業は統合ブランチの上で進んでいて、ロックファイルが main と食い違っています。そのため PR のブランチをそのままマージせず、同じ内容を作業ブランチ側で `yarn up` して入れ直します。入れ直した内容が main に届いた時点で、Dependabot は自分の PR を役目済みとして自動で閉じます。

### まとめて 1 本（minor / patch）の判断

一括で入れて、次の全部が通れば取り込みます。

- `yarn check` / `yarn check:ts` / `yarn test:run` / `yarn build` / `yarn npm audit --severity high --environment production`
- 更新前の `dist/` を別の場所に取っておき、更新後と比べる。ファイル名のハッシュを除いて、ページの見えるテキストが変わっていないこと

### 個別 1 本（メジャー）の判断

1 本ずつ、公式の変更履歴を読んでから入れます。判断の材料は次の 3 点です。

- 出力が変わるか（HTML の詰め方、Markdown の処理系、CSS の生成規則など）
- 他のパッケージを道連れにするか。たとえば Astro 7 は `@astrojs/mdx` 7 と `@astrojs/react` 6 と同時でないと入らない
- `package.json` の `resolutions`（脆弱性を避けるための固定）が不要にならないか。メジャー更新で本体が安全な版を引くようになれば外せます

### Dependabot が触らないので手で合わせるもの

- `.github/workflows/ui-tests.yml` の Playwright コンテナのタグ。`@playwright/test` のバージョンと一致していないと E2E が全件失敗します（同ファイル内にも注意書きあり）
- `package.json` の `resolutions`。不要になっても Dependabot は消しません

## 8. 月次の記事ネタ PR の受け方

毎月 1 日の朝 9 時すぎに、記事のネタ 3 案を提案する PR が届きます。claude.ai に登録したルーチン（クラウドで動く Claude）が、リポジトリを読んで出したものです。

- ルーチンの画面：https://claude.ai/code/routines/trig_01UP6sJ44uiN5tqn9eEv5Gru
- 変更されるのは `docs/article-backlog.md` だけ。ブランチは `chore/article-ideas-YYYY-MM`、宛先は main
- 届いた時点ではドラフトです。取り込むときは ready にしてからマージします

### 誰がいつ見るか

急ぐものではありません。作業セッションの冒頭に Claude へ「今月のネタ出し PR を見て」と言えば足ります。GitHub の通知メールが届くので、放置しても埋もれません。

### 判断のしかた

3 案を読んで、書きたいものが 1 つでもあればマージします。バックログは「生きたリスト」なので、その場で書かなくても候補として並んでいるだけで役に立ちます。全部ピンとこなければクローズして構いません。翌月また 3 案が届きます。

PR 本文には、既存のバックログから「今月書くならこれ」という推薦が 1 件付きます。新しい 3 案より、こちらのほうが着手しやすいことがあります。

### 内容や頻度を変えたいとき

Claude に「月次ネタ出しルーチンの頻度を変えて」「プロンプトをこう直して」と言えば更新できます。停止だけは claude.ai の画面（上のリンク）から行ってください。

## 9. 関連ドキュメント

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

## 10. 改訂履歴

| 日付 | 変更内容 |
|---|---|
| 2026-08-10 | §8「月次の記事ネタ PR の受け方」を新設（PHASE1D-008、R-01 点火）。旧 §8 関連ドキュメント → §9、旧 §9 改訂履歴 → §10 に繰り下げ |
| 2026-05-03 | 初版作成（site-plan v3.6 連動）。シーン別操作表、中断リカバリー、運営者必須・推奨アクション、トラブルシューティング Q1-Q5、関連ドキュメント表 |
| 2026-05-03 | site-plan v3.7 連動：シーン別操作表に「並行 PBI 開始」「Phase 完了 main マージ承認」追加、必須に main 保護 + CF Pages Branch Filter 追加、Q6（push 競合）追加 |
| 2026-05-07 | Q6 に worktree 削除の sandbox 制約と運営者対処を追加（旧 Q6 → Q7 に繰り下げ） |
| 2026-06-14 | ガバナンス文書ドリフト是正（README v3.1 連動）：シーン別表の「並行 PBI 開始」を worktree 廃止後の単一ブランチ運用に、「Phase 完了 main マージ承認」を公開フェーズ（1d）限定に修正。必須チェックリストの CF Pages Branch Filter から sub-branch Exclude を削除。トラブルシューティングから worktree 削除 Q6 を撤去（worktrees 廃止で発生し得ないため）、push 競合 Q7 を Q6 に繰り上げ + 原因記述を単一ブランチ並行に修正 |
| 2026-06-14 | 統合ブランチ改名（README v3.2 連動）：シーン別表・Q6 の `feat/phase-1a` 参照を `feat/phase-1` に更新（1a〜1c を集約する統合ブランチ。deferred-merge 構造は不変） |
| 2026-07-19 | §5 devcontainer 運用を新設（PHASE1B-016 連動）：起動手順（ccd / 手動）、firewall 有効確認、PAT の扱い、書き戻し禁止。旧 §5 関連ドキュメント → §6（devcontainer-plan.md 行追加）、旧 §6 改訂履歴 → §7 に繰り下げ |
| 2026-07-19 | §5 更新（PHASE1B-016 ステップ 8 完了）：ccd / ccda / ccd-init を dotfiles に実装済みとなったため暫定の直接実行手順を削除。`ccd --rebuild` と他 repo 導入（ccd-init + dotfiles 型紙 README）を追記 |
| 2026-08-02 | 並行運用ルール連動（README v3.5）：シーン別表の「並行 PBI 開始」を別名 clone の別作業ツリー前提に更新（同一ツリー 2 セッション禁止、初回 `gh auth login` + `yarn install`）。Q6 の原因記述も別 clone 運用に修正 |
| 2026-08-09 | §6 サイト監視（health-check.sh）の設置と運用を新設（PHASE1D-007 連動）：Xserver への設置手順、cron 登録、通知が届くかの確かめ方、普段の運用、主な設定項目。通知はメール 1 本、チャット通知も外部の外形監視も入れない（運営者決定）。代わりに「触ったら手で実行して確認」「サーバー移行の案内が来たら cron を確認」の 2 点を明記。関連ドキュメント表に incident-response.md を追加。旧 §6 関連ドキュメント → §7、旧 §7 改訂履歴 → §8 に繰り下げ |
| 2026-08-09 | §7 依存更新 PR の受け方を新設（PHASE1D-012 連動）：届く 2 種類（まとめて 1 本の minor/patch と個別のメジャー）、週 1 回 Claude に任せる運用、Dependabot の PR を直接マージせず作業ブランチで入れ直す理由、minor/patch とメジャーそれぞれの判断材料、Dependabot が触らないので手で合わせるもの（ui-tests.yml の Playwright コンテナのタグ / package.json の resolutions）。旧 §7 関連ドキュメント → §8、旧 §8 改訂履歴 → §9 に繰り下げ |
| 2026-08-10 | ブランチ運用の切替を連動反映（README v3.9 / Phase 1d Gate = PHASE1D-009）：シーン別表の「公開フェーズの main マージ承認」を「本番反映（main マージ）の承認」に置き換え（`git merge --no-ff` + 直接 push は main 保護で不可能になっていた）、「並行 PBI 開始」をそれぞれ別の短命ブランチ前提に更新、Phase 0 限定だった起票行を汎用の Gate 通過後の起票に一般化。Q6 を「同一ブランチへの多重 push」から「main が進んで PR が古くなる」形に書き換え。必須チェックリストの main 保護と CF preview を設定済みの実態に更新。health-check.sh の取得 URL を `feat/phase-1` から `main` に変更（統合ブランチを畳んだため） |

# 運営者は公開サイトを実機で最終確認し、運用ルーチンを開始できる

Status: Done
Started: 2026-08-10
Completed: 2026-08-10

## 誰が
- 運営者

## 何をできる
- 公開済みサイトを iPhone 実機で確認し（Phase 1c の実機待ち申し送りの消化）、公開後の運用ルーチン（月次記事ネタ出し）を開始できる

## なんのために
- Phase 1c で「実機が要る」「公開後」と持ち越された確認・運用項目を、公開が成立したこのタイミングでまとめて消化するため
- 関連: Phase 1d / PHASE1C-012 申し送り棚卸し表（1C-005 / 009 / 013 / 014、1B-007 / 015 の持ち越し分）

## 受け入れ条件
- [x] iPhone 実機で本番サイトを確認（まとめて 1 回でよい）：ホーム画面アイコンの実表示（1C-005）/ Hero スマホ構図（1C-013）/ Skills アイコン表示（1C-014）
- [x] iOS の「視差効果を減らす」（prefers-reduced-motion: reduce）設定で、記事目次のジャンプが即時になることを実機確認（1C-009）
- [x] 実機確認で問題が見つかった場合：軽微なら本 PBI 内で修正（その時点で §7 検証 3 項目を実検証に切り替える）、大きければ対応 PBI を起票 → 問題 0 件のため修正なし
- [x] medium alert（ui-tests.yml permissions）のクローズを GitHub UI で確認（1B-015 申し送り、未確認のまま持ち越し中）→ API で全 6 件 fixed / open 0 件を確認
- [x] R-01 月次記事ネタ出し routine を点火（起点は `docs/article-backlog.md`。点火方法＝カレンダー / claude.ai routine 等を運営者と合意し、実装ログに記録）
- [x] ローカル スクショ確認：N/A（確認・運用作業のみ、コード変更なし。修正が発生した場合は実検証に書き換える）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上、確認対象は本番 URL）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：N/A（同上。push は PBI ファイルの docs のみ）（CLAUDE.md §7）

## 技術メモ
- PHASE1D-004（公開）完了後に実施
- Hero スマホ構図・Skills アイコンは標準 CSS のみでエンジン固有の懸念は薄い（1C-013 / 014 の評価）。確認は 1 回で足りる

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-10 着手 → 完了

#### やったこと

**R-01 月次記事ネタ出し routine の点火（完了）**

点火方法は運営者判断で「claude.ai の月次ルーチンが `docs/article-backlog.md` に追記する PR を出す」を採用。比較した案は 4 つで、判断の軸は「ネタが出ること」より「運営者が気づいて動くところまで届くか」（R-01 のリスクは書く習慣がつかないこと）。

- 採用：月次ルーチン + PR。GitHub の通知メールという既存の導線に乗り、次にセッションを開いた時点で候補が生きたリストに並んでいる
- 不採用：ルーチンで提案のみ（claude.ai の画面に残るだけで見に行かないと気づけない）/ Xserver cron で月次リマインドメール（仕組みは確実だがネタ出しの手間が毎回かかる。PR が通らなかった場合の受け皿として温存）/ カレンダー予定（実行が運営者頼み）

登録内容：

- ルーチン ID `trig_01UP6sJ44uiN5tqn9eEv5Gru`（https://claude.ai/code/routines/trig_01UP6sJ44uiN5tqn9eEv5Gru ）
- cron `7 0 1 * *`（UTC）＝毎月 1 日 9:07 JST。次回 2026-09-01
- モデル claude-opus-5（月 1 回のためネタの質を優先）、allowed_tools は Bash / Read / Write / Edit / Glob / Grep
- プロンプトは自己完結型（クラウド側は前提知識ゼロ・過去の実行結果も参照不可）。`article-backlog.md` → 公開済み記事 → `writing-workflow.md` の順に読ませ、重複しない 3 案をバックログの表に追記 → `chore/article-ideas-YYYY-MM` から main 宛 PR。制約として main 直 push 禁止・`article-backlog.md` 以外の変更禁止・記事本体を書かない・push か PR に失敗したらそこで止めて 3 案の全文と失敗理由を出力に残す、を明記

作成直後に Gmail / Google ドライブ / カレンダー / Claude Code Remote の MCP 接続が自動で付いてきたため `clear_mcp_connections` で全部外した（バックログ追記に外部サービスへの経路は不要）。

その場で 1 回手動実行し、ブランチ push → PR #34 まで通ることを実測。出た 3 案（T13 依存警告 61 件の仕分け / T14 速度の点数と実利用者の食い違い / L7 法人化後の名前変更の波及）はいずれも PHASE1D-011 / 004 / 006 / 002 の実作業を素材にしたもので、既存バックログとも公開済み 3 本とも重複なし。既存バックログからの推薦は T12（下調べ済み・記憶が新しい・3 連作の順番に縛られない、という理由付き）。CI 全 pass を確認して main にマージ（a19622d）し、`origin/main` を feat/phase-1 に取り込んだ。

運用手順を operation-manual に §8「月次の記事ネタ PR の受け方」として新設（旧 §8 → §9、旧 §9 → §10）。

**medium alert の確認（完了・open 0 件）**

当初コンテナの PAT では読めなかった（403 `Resource not accessible by personal access token`）。運営者判断で PAT `byte-lark-devcontainer` に「Code scanning alerts: Read-only」を追加してもらい、API で確認：

| 状態 | # | 深刻度 | ルール | 対象 |
|---|---|---|---|---|
| fixed | 6 | medium | actions/missing-workflow-permissions | quality.yml |
| fixed | 5 | medium | actions/unpinned-tag | ui-tests.yml |
| fixed | 4 / 3 / 2 | medium | actions/missing-workflow-permissions | ui-tests.yml |
| fixed | 1 | note | actions/unnecessary-use-of-advanced-config | codeql.yml（削除済み） |

open 0 件。PHASE1B-015 の申し送り（ui-tests.yml permissions の medium alert がクローズされたか未確認）を消化。コード側も `quality.yml` / `ui-tests.yml` とも `permissions: contents: read` が現存することを確認済み。

**iPhone 実機確認（完了・問題 0 件）**

4 点とも運営者が実機で確認し、問題なし。ホーム画面アイコンの実表示（1C-005）/ Hero のスマホ構図（1C-013）/ Skills のアイコン 34 件（1C-014）/「視差効果を減らす」ON で目次ジャンプが即時になるか（1C-009）。あわせて公開後に直した確認画面付きフォーム（1D-016）と「先頭へ戻る」（1D-015）も同じ 1 回で確認。

**確認の前に本番を最新化（PR #35）**

当初 preview URL での確認を案内したが、運営者判断で「本番 URL で見る」に切り替え。ただし本番（main）は 2026-08-08 のマージ時点のままで、PHASE1D-013〜016 が入っていなかった（curl で実測：記事に「先頭へ戻る」なし、`/contact` に確認画面なし、トップの h1 が `text-3xl / sm:text-4xl` で 014 の変更前）。特に 014 は h1 の高さをスマホで 46 → 74px に変えており、Hero の鳥とボタンの位置関係がこの上に乗るため、本番のままでは近々差し替わる姿を確認することになる。

そのため実機確認の前段として `feat/phase-1` → main の PR #35 を作成しマージ（CI 全 pass、main の Push on main も success）。本番反映を curl で確認してから運営者に依頼した。

#### 残タスク

なし（受け入れ条件を全て達成、Done）。

#### 学び・つまずき

- claude.ai のルーチンは作成した本人（アカウント）に紐づき、セッションが終わっても残る。一方 `CronCreate` はセッション内だけ・7 日で失効するので、月次の運用には使えない
- ルーチンが出す PR はドラフトで届く。`gh pr merge` は「still a draft」で弾かれるので `gh pr ready` を先に打つ必要がある
- クラウド側からリポジトリへ push でき、PR も作れることを実測（案A が成立する前提。事前には未確認だった）
- ルーチン作成時、頼んでいない MCP 接続が既定で付く。必要最小限にするには作成後に `clear_mcp_connections` で外す
- docs 1 ファイルだけの PR でも CI は全部走る（quality / e2e / CodeQL / CF ビルド）。運営者判断で `paths-ignore` は入れず現状維持（月 1 回 11 分、検査を飛ばす仕組みのほうが見逃しの危険が大きい）
- 「本番で確認」を案内する前に、本番が最新かを確かめる。統合ブランチで作業している間、main は前回マージ時点で止まっている。今回は 4 コミット分（1D-013〜016）遅れていた
- 記事 URL は末尾スラッシュへ 307 で飛ぶため `curl -L` が要る。付け忘れて空の本文を grep し、本番に反映されていないと一度誤認した（PHASE1C-014 で `/skills` の 307 に当たったのと同じ形）

#### 想定外

- なし（PAT の権限不足は PHASE1D-011 で 3 回起きたのと同じ形）

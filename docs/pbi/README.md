# PBI フォーマット規約 (v3.10)

本プロジェクト（byte-lark.com）の Product Backlog Item (PBI) はすべて本規約に従う。

最終更新: 2026-08-12

---

## 1. 目的

- 統一フォーマットで PBI を起票し、起票・実装・レビューの認知負荷を最小化する
- Claude Code が PBI 単独で実装着手できる粒度・構造を担保する
- 会話履歴を持たない後続セッションでも、PBI を読むだけで実装再開できる
- 1 セッションで複数 PBI / 1 PBI を複数セッション、両方の運用に対応する
- 顧客案件の Gherkin 形式とは**意図的に分離**：本プロジェクトは個人運用で、レビュー Skill 連携や人間チーム引渡しは想定しない

## 2. ファイル名規則

```
docs/pbi/YYYYMMDD-PHASE-NNN-スラッグ.md
```

- `YYYYMMDD`：起票日
- `PHASE`：`PHASE0` / `PHASE1A` / `PHASE1B` / `PHASE1C` / `PHASE2`
- `NNN`：PHASE 内通番（3 桁ゼロ埋め、`001` から）
- スラッグ：英小文字 + ハイフン、内容を端的に表す

例：

```
docs/pbi/20260501-PHASE0-001-vite-resources-cleanup.md
docs/pbi/20260501-PHASE0-002-astro-scaffold.md
docs/pbi/20260502-PHASE1A-001-base-layout.md
```

## 3. ファイル本体フォーマット

```markdown
# [誰が]は[何を]できる

Status: NotStarted | InProgress | Done
Started: YYYY-MM-DD     ← InProgress 化時に追記
Completed: YYYY-MM-DD   ← Done 化時に追記

## 誰が
- ロール（1 つ）

## 何をできる
- 機能・能力（1-2 行）

## なんのために
- 目的・背景（1-3 行）
- 関連: site-plan.md の FR-XX / NFR-XX / Phase X

## 受け入れ条件
- [ ] 観測可能な条件 1
- [ ] 観測可能な条件 2
- [ ] エラー / エッジケース条件
- [ ] テスト・Lint・型チェック等の自動検証条件
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。UI/フロントエンド変更が無い PBI は `[x] …：N/A（理由）`）

## 技術メモ（任意）
- 関連ファイル / 配置先パス
- 採用ライブラリ / API
- 触ってはいけない領域
- 参考リンク（公式ドキュメント等）

## 備考（任意）
- 仕様の詳細表・図・設計判断の理由
- 関連 PBI への参照

## 実装ログ（着手後に追記、中断時は必須）
### YYYY-MM-DD セッション N
- やったこと：
- 残タスク：
- 学び・つまずき：
- 想定外だった点：
```

## 4. 各セクションの書き方

### 4.1 タイトル

- ユーザーストーリー形式：`[誰が]は[何を]できる`
- 動詞で終わる（〜できる / 〜が表示される / 〜が動作する）

### 4.2 Status / Started / Completed（最上段、必須）

- **Status**：`NotStarted`（未着手）/ `InProgress`（仕掛中）/ `Done`（完了、全受け入れ条件 check 済）
- **Started**：InProgress に変更したセッションが日付追記
- **Completed**：Done に変更したセッションが日付追記
- INDEX.md と必ず同期させる（変更時は両方更新）

### 4.3 誰が

- ロールを 1 つだけ書く
- 想定ロール：**訪問者** / **運営者** / **Claude** / **クローラー**
- 複数ロールにまたがる場合は別 PBI に分割
- **例外**：Gate PBI（Phase 間遷移の合意形成 PBI）は性質上「運営者 + Claude」両方が必要なため、複数ロール記述を許可する

### 4.4 何をできる

- 1-2 行で機能・能力を簡潔に
- 「具体的にできること」を書く

### 4.5 なんのために

- なぜこの PBI が必要か 1-3 行
- **必ず `site-plan.md` の FR-NN / NFR-NN / Phase X に紐づける**

### 4.6 受け入れ条件（Definition of Done）

最重要セクション。以下のルールに従う：

1. **観測可能な条件**で書く
2. **チェックボックス形式**で 1 件 1 行
3. **失敗ケース・エッジケース**も含める
4. **自動検証可能な条件**は明示する（`yarn check:ts` がエラーなし、Lighthouse Accessibility 90+ 等）
5. ユーザー操作可能な機能は Playwright で検証可能な粒度に書く
6. 受け入れ条件の項目数は**網羅性の目安**（観測条件・エッジケース・自動検証を漏らさないための確認用）であって、PBI のサイズ基準ではない。サイズ判定は §7 のスコープ基準（触るファイル群 × 外部依存・概ね 1 セッション）で行う。項目が 20+ に膨らむ場合は分割を検討する合図
7. **§7 検証ゲート（必須・常設）**：CLAUDE.md §7 の ① ローカル スクショ確認（desktop + mobile）② CF preview スクショ確認（branch alias URL）③ E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）の 3 項目を、**全 PBI の受け入れ条件に必ず置く**（テンプレ §3 に常設済み）。UI/フロントエンド変更を伴う PBI は実検証で check、**変更が無い PBI は項目を削除せず `[x] …：N/A（理由）` と明記**（黙って欠落させない）。E2E スイートは Bash サンドボックスで Chromium 起動不可のため `yarn test:e2e` をローカル実行せず、push 後に CI（`.github/workflows/ui-tests.yml`、ubuntu コンテナ）で検証する。UI 変更を伴う PBI は CF preview 確認 + CI green まで完了して初めて Done。INDEX.md のセッション開始チェックがこの 3 行の有無と未 check 残りを機械検出する
8. **Gate PBI の申し送り棚卸し（必須）**：Retrospective Gate PBI の受け入れ条件には「当該 Phase 全 PBI の実装ログにある申し送り・積み残しを項目単位で列挙し、各項目を **PBI 化（起票先を明記）/ 持ち越し（本 Gate の申し送りセクションに記載）/ 破棄（理由を明記）** のいずれかに判定する」を必ず置く。前 Gate から持ち越された未消化項目も同じ表に含めて再判定する（どの Phase にも属さない項目——例：ダークモード実表示検証——が Gate の網から漏れる経路を塞ぐ）。これにより次 Phase の起票者は全実装ログを再走査せず、直前 Gate の棚卸し表を一次資料にできる。「全ログを読む」だけでは項目が黙って落ちる余地があった（2026-08-01 の棚卸しで、実装ログ内にのみ存在する申し送り 7 件が grep で初めて可視化された経験を規約化）

### 4.7 技術メモ

Claude Code 向けの実装ヒント。任意セクション。

- 関連ファイル / 配置先パス
- 採用ライブラリ / API / 公式ドキュメント URL
- 触ってはいけない領域
- 既存資産との関係

### 4.8 備考

仕様の詳細を書く。任意セクション。

- フィールドリスト・テーブル
- 設計判断の理由
- 関連 PBI への参照

### 4.9 実装ログ

着手後に追記する作業ログ。**中断時（InProgress でセッション終了時）は必須**。

```markdown
## 実装ログ

### 2026-05-15 セッション 1
- やったこと：（実装した範囲を簡潔に）
- 残タスク：（中断時に何が残っているか、引き継ぎたい情報）
- 学び・つまずき：（次セッションが知っておくべき事実、参照したドキュメント等）
- 想定外だった点：（PBI 記述と実態の差分があれば）

### 2026-05-16 セッション 2
- ...
```

**重要**：技術的具体性のある記述は実際に発生した事実のみ書く。テンプレート段階で予言しない（架空のトラブルシューティングは書かない）。

## 5. 状態管理

### 5.1 ライフサイクル

```
NotStarted ──(着手時)──> InProgress ──(全 受け入れ条件 check)──> Done
     └──(スコープ変更で取り下げ)──> Dropped
```

逆遷移（Done → InProgress 等）は原則しない。やり直しが必要なら新規 PBI を起票。

**Dropped（取り下げ、v3.6 新設）**：スコープ変更で不要になった NotStarted の PBI に使う。適用条件：site-plan の Decision Log に取り下げ理由が記録されていること。PBI ファイルの Status 行に `Dropped` と Decision 番号を書き、INDEX.md も同期する。ファイルは削除しない（経緯の記録として残す）。InProgress / Done からの取り下げは不可（InProgress は中断手順 §5.4、Done のやり直しは新規起票）。

### 5.2 同期ルール

PBI を更新する時は、必ず以下を**同一コミット内**で同期：

1. PBI ファイルの Status / Started / Completed 行
2. `docs/pbi/INDEX.md` の該当エントリ Status

片方だけ更新するのは禁止。

### 5.3 着手時の手順

1. PBI 全文を読む
2. **PBI 本文の前提を一次情報で確認**（コマンド、依存 version、ツール挙動、外部リソース、**および scaffold / migration / setup の "approach" 自体**）。乖離があれば実装に入る前に PBI ファイルを update して commit する（メッセージ例：`docs(pbi): correct PHASE0-NNN spec for ...`）。Don't Guess の PBI 着手時版。`yarn --version` / `<cli> --help` / `git ls-tree archive/...` 等で empirical 確認。**「approach 自体」も対象**とは：PBI が CLI A を使うと書いていても、CLI A の公式 docs に該当 use case が無い／別 path（例：Manual Setup 節）を案内している場合は、コマンドや version だけでなく approach そのものを書き換える（PHASE0-002 セッション 1 で `yarn create astro@latest .` が既存 repo 後付けに非対応で、Astro 公式 Manual Setup 節への切替が必要だった経験を規約化）
3. PBI の Status を `InProgress` に変更、Started に今日の日付追記
4. INDEX.md の該当エントリを `[InProgress]` に更新
5. 実装する
6. 完了：受け入れ条件全 check → Status: Done + Completed 追記 → INDEX.md 同期
7. コミット（後述のメッセージ規約に従う）

### 5.4 中断時の手順

セッションを終わる時、InProgress な PBI があれば：

1. 該当 PBI の `## 実装ログ` セクションに「やったこと / 残タスク / 学び / 想定外」を追記
2. WIP コミット可（後述）
3. INDEX.md の該当エントリは InProgress のまま

次セッションは実装ログを読めば再開可能。

**例外：外形が変わるコミットを打った場合（v3.7）**。記事の公開（`draft: false`）、main へのマージ、DNS / ドメインの切替など、**サイトの外から見える状態を変えるコミット**を打ったセッションは、その PBI の Done 化（Status + INDEX 同期 + コミット）まで同一セッションで終える。終えられる見通しが無いなら、そのコミット自体を次セッションに回す。Phase 1b で公開コミットと Done 化が別セッションに割れ、記事が公開済みなのに PBI が InProgress のまま残った（PHASE1B-009、PHASE1B-014 で検出）。「公開されているのに未完了に見える」履歴は、次に読む人が状態を誤読する。

### 5.5 完了済み PBI の扱い

- 削除しない、Status: Done のまま `docs/pbi/` に残す
- 全 checkbox は埋まった状態
- 実装ログは履歴として価値あるので保持
- **事後追記**：Done 後に補足が必要なら `## 実装ログ` 末尾に「### YYYY-MM-DD 事後追記」セクションで追記可能。本体（受け入れ条件等）は変更しない。誤りが見つかった場合は新規 PBI で fix する

### 5.6 PBI 改訂のバージョニング

- PBI ファイル本体に version 番号は持たない（git 履歴で管理）
- 起票後の重大修正（受け入れ条件の変更等）は **コミットで追跡**：`chore(pbi): PHASE0-NNN 受け入れ条件追加 (理由)`
- Status: Done 化後の変更は §5.5 の方針に従う（本体不変、`## 実装ログ` 末尾への事後追記のみ）

### 5.7 1 セッションで複数 PBI を進める時のコミット粒度

- 原則 **1 PBI = 1 コミット**（複数 PBI を 1 コミットにまとめない）
- これにより `git log --oneline | grep PHASE0` で進捗追跡可能
- WIP コミットは PBI 単位で `wip(pbi): PHASEn-NNN ...`

### 5.8 実装ログ記入漏れの検出

セッション開始時、以下を実行することを推奨：

```bash
# InProgress な PBI のうち、`### YYYY-MM-DD` 形式の実装ログ entry が 1 件も無いものを検出
# （テンプレの「（未着手）」だけが残っている状態 = 前セッションのログ書き漏らし疑い）
for f in $(grep -l "^Status: InProgress" docs/pbi/*.md); do
  if ! grep -q "^### 20" "$f"; then
    echo "WARNING: 実装ログ entry 無し → $f"
  fi
done
```

該当ファイルは前セッションの記入漏れの可能性。再開前に状況を git log や運営者ヒアリングで確認する。

## 6. コミットメッセージ規約

PBI 関連のコミットは以下の prefix を使う：

| prefix | 用途 | 例 |
|---|---|---|
| `feat(pbi):` | PBI を Done にした完了コミット | `feat(pbi): PHASE0-002 astro scaffold` |
| `chore(pbi):` | PBI 起票・更新（実装は伴わない） | `chore(pbi): add PHASE0-010 retrospective gate` |
| `docs(pbi):` | PBI 規約・INDEX 等のドキュメント変更 | `docs(pbi): update README to v2` |
| `wip(pbi):` | InProgress 中の中間コミット | `wip(pbi): PHASE0-002 tailwind v4 integration done, shadcn pending` |

PBI 単位でコミットを分けるのを推奨（複数 PBI を 1 コミットにまとめない）。

## 7. PBI 分割の判断

**サイズ判定の主基準は実装スコープ**：触るファイル群 × 外部依存（API / 第三者アカウント準備 / DNS 等）から想定セッション数を見積もり、**各 PBI の技術メモに想定セッション数を明記する。2 セッション以上に見積もられるものは必ず分割**する。受け入れ条件の項目数は実装規模の代理にならない（例: PHASE1A-020 は受け入れ条件 13 項目だが実体は最重量級 143 行、Contact フォーム化は項目数小でも複数日）。

加えて以下に該当する場合も分割：

- 受け入れ条件が 20 項目以上（網羅性の観点で肥大）
- 複数のロール（訪問者 + 運営者等）が混在
- 異なる Phase にまたがる
- 概ね 1 営業日（人間換算 / 1 セッション）を超える

## 8. PBI を書かない場合

以下のような作業は PBI 化しない：

- 1 行の typo 修正
- 依存パッケージの patch / minor up（dependabot 任せ）
- ローカル開発環境の個人設定

## 9. PBI の起票タイミング（重要）

**Phase ごとに起票し、前 Phase 完了後に次 Phase の PBI を起票する**：

- 着手済 Phase の PBI は実装中・完了
- 次 Phase の PBI は **前 Phase 完了 + Retrospective Gate 通過後に起票**
- これにより前 Phase の **学び（実装ログ + Gate の申し送り）を次 Phase PBI に反映**できる

全 PBI を着手前に書き切る方式は採らない（学びの反映機会が消えるため）。

**例外：先行トラック（site-plan §8 Decision #28）**。site-plan の Decision Log で明示的に「先行トラック」と定義された PBI 群は、前 Phase の Gate 通過前でも起票・着手できる（現行の適用対象：Phase 1c 先行トラック＝記事非依存のデザイン項目、PHASE1C-001〜007）。前 Phase の学びを反映すべき残り（仕上げトラック + 次 Phase の Gate）は従来どおり前 Phase Gate 通過後に起票する。先行・仕上げの区分は該当 Phase のドラフトファイル（例：`draft-phase1c-design-polish.md`）に明記する。並行作業の push 競合は §10.7 で対処。

**並行運用（2026-08-02 改定）**：記事 PBI と開発系 PBI は、**別名でローカルに clone した別作業ツリーであれば並行して進めてよい**（従来の「セッション単位で切替」を置き換え）。同一作業ツリーで 2 セッションを同時に走らせるのは禁止（**1 ツリー 1 セッション**。2026-08-01 に INDEX.md が古い内容で黙って上書きされる実害が発生したため）。並行時の遵守事項：

1. 同じ PBI を 2 セッションで触らない（どのセッションがどの PBI を進めるかは運営者指示で分ける）
2. INDEX.md の更新は「pull → 書き込み → 即コミット」で滞留させない（競合の窓を狭める）
3. push 競合は §10.7 で対処

devcontainer はボリューム名が devcontainerId（clone パス由来）で分離されるため、別 clone なら設定・認証・node_modules が衝突せず同時起動できる。新 clone の初回のみ `gh auth login`（PAT はボリュームに永続化）と `yarn install` が必要。

## 10. ブランチ運用

### 10.1 ブランチ階層

```
main                          正本かつ本番。ruleset で保護（§10.9）。公開（2026-08-08）以降はここが起点
├── <短命ブランチ>            作業ごとに main から切り、PR でマージして削除（§10.3）
├── feat/phase-0              Phase 0 ブランチ（完了・main マージ済み）
├── feat/phase-1              Phase 1a〜1d の作業を集約（公開前の遅延マージ用。1d Gate で役割終了）
└── archive/vite-react-chakra 旧版退避（Phase 0 開始時に切った）
```

### 10.2 命名規則

| ブランチ | 命名 | 例 |
|---|---|---|
| 機能・改善 | `feat/<short>` | `feat/blog-category-pages` |
| 修正 | `fix/<short>` | `fix/rss-alternate` |
| 雑務・docs | `chore/<short>` | `chore/article-ideas-2026-09` |
| Archive | `archive/<context>` | `archive/vite-react-chakra` |

公開前に使っていた Phase ブランチ（`feat/phase-<phase>`）は、1 Phase を丸ごと 1 本に集約して main マージを遅らせるための仕組みだった。公開後はその必要がないので、粒度は「1 作業 1 ブランチ」に戻す。

### 10.3 作業開始時（main から分岐）

```bash
git checkout main
git pull origin main
git checkout -b <type>/<short>
```

- PBI 1 件につき 1 ブランチが基本。docs だけの小さな修正も同じ形（main は直接 push できない）
- ブランチ名は CF の branch alias URL になる（`/` と英数字以外は `-` に置換）。preview ビルドはブランチ名を問わず走る（PR #34 の `chore/article-ideas-2026-08` で実測）ので、§7 の CF preview 検証はどの名前でも成立する
- 並行作業は別名 clone の別作業ツリーで（§9 並行運用）。同一作業ツリーの 2 セッション同時作業は禁止

### 10.4 PBI 着手時

§10.3 で切ったブランチで作業し、commit / push する（sub-branch・worktree は使わない）。**最初の push の直後に draft PR を作る**。

```bash
git add <files>
git commit -m "feat(pbi): PHASE1E-NNN <desc>"
git push -u origin <type>/<short>

# 最初の push の直後。以降の push はこの PR が拾う（作り直さない）
gh pr create --draft --base main --head <type>/<short> --title "<title>" --body "<body>"
```

CI（`quality` / `e2e`）は短命ブランチへの push では走らず、**PR がある状態でのみ走る**（`.github/workflows/*.yml` の trigger。PHASE1E-002）。draft PR を先に作っておくことで、CI と CF の preview ビルドが同時に始まり、§7 の検証を待たせずに済む。draft のあいだは GitHub がマージを止めるので、緑になった瞬間の誤マージも防げる。

修正が要る場合も**同じブランチに push し直すだけ**でよい。PR の head が動いて CI と preview が再実行される。PR を閉じて作り直すのは、作業自体を取りやめるときだけ。branch alias URL はブランチ名から決まるので、やり直しても preview の URL は変わらない。

**PBI 実装ではない docs 単独の修正**（site-plan.md、INDEX.md 等）も同じ形。main には直接 push できない。

### 10.5 PBI 完了時

受け入れ条件を確認して Done 化し、§10.6 の手順で main へマージする。

```bash
# 受け入れ条件確認 → Status: Done → INDEX.md 同期 → commit → push
git add docs/pbi/PHASE1E-NNN-xxx.md docs/pbi/INDEX.md <実装ファイル群>
git commit -m "feat(pbi): PHASE1E-NNN <desc>"
git push origin <type>/<short>
```

### 10.6 main へのマージ

main は ruleset で保護されており **直接 push できない**（§10.9）。PR 経由でマージする。PR は §10.4 で draft として作ってあるので、ここでやるのは draft を外してマージするところだけ：

```bash
# 最後の push（Done 化した PBI と INDEX.md を含む）
git push origin <type>/<short>

# CI green + §7 の検証が済んでから draft を外す → マージ
gh pr ready
gh pr merge --merge --delete-branch   # merge commit を残す（--no-ff 相当）
```

- `gh pr merge` は必須チェック（`quality` / `e2e`）が success になるまで通らない。`bash scripts/ci-status.sh` で確認してから実行する
- draft のままではマージできない。`gh pr ready` は「§7 の検証を全部終えた」という宣言として使う
- コンテナから実行する場合、PAT に Pull requests: Read and write が必要（PHASE1D-011 で付与済み）
- **main へのマージ＝ byte-lark.com への公開**。マージした時点で本番が入れ替わる

#### 公開前の遅延マージ（2026-08-08 まで、歴史）

公開前は未完成サイト（仮デザイン・サンプル記事・未承認文面）を main 経由でクロールさせないため、Phase 1a〜1d を統合ブランチ `feat/phase-1` に集約し、main マージを公開フェーズまで遅らせていた（site-plan §8 Decision #25）。実績は 1d 中の 4 回（`01239b9` 公開 / `2fee28f` プライバシーポリシー / `733662e` PR #35 / `9555d6d` PR #36）で、公開後は期中も随時マージしていた。この方式は 1d Gate（PHASE1D-009）で役割を終え、§10.3 の「1 作業 1 ブランチ」に戻した（Decision #31）。Phase 0 は本モデル制定前に完了しており `feat/phase-0` を main へマージ済み（PHASE0-010、`6a38240`）。

### 10.7 並行作業の競合対処

並行作業は別 clone の別作業ツリーで行う（§9 並行運用。同一作業ツリーの 2 セッション同時作業は、push 以前にファイルの黙った上書きが起きるため禁止）。

1 作業 1 ブランチにしたことで、同じブランチへ複数セッションが push する形（統合ブランチ時代の non-fast-forward）は起きない。代わりに **main が進んで PR が古くなる**形で競合する：

```bash
git fetch origin
git rebase origin/main
# conflict（INDEX.md 等。隣接 PBI 行が同 hunk として競合しやすい）あれば手動 resolve → git rebase --continue
git push --force-with-lease origin <type>/<short>
```

### 10.8 Cloudflare の preview ビルド

preview ビルドは**ブランチ名を問わず走る**（PR #34 の `chore/article-ideas-2026-08` の check-run `Workers Builds: byte-lark` が success であることを 2026-08-10 に実測）。branch alias URL はブランチ名の `/` と英数字以外を `-` に置換したもので、`https://<alias>-byte-lark.tanimoto-a49.workers.dev` になる。§7 の CF preview 検証はどのブランチ名でも成立する。

Deploy Hooks は Worker の Settings → Build に「main manual rebuild」（対象ブランチ main）が 1 本だけある（PHASE1D-004）。CF 側が push を取りこぼしたとき、コードを変えずに URL を 1 回叩いて本番を焼き直すための保険。`feat/phase-1` 向けの 1 本（PHASE1C-012）は、統合ブランチを畳んだのに合わせて 2026-08-11 に削除した。短命ブランチは push のたびに preview ビルドが走るので、ブランチ別の hook は要らない。URL は認証ヘッダー不要で識別子そのものが鍵のため Bitwarden 保管とし、repo・PBI・ログには書かない。

### 10.9 main の保護

main は GitHub の ruleset「main protection」で保護している（2026-08-09 設定、PHASE1D-011）。実際の設定内容：

- 対象は既定ブランチ（main）のみ、Enforcement は Active
- **Bypass list は空**。運営者本人の端末からも devcontainer からも直接 push できない。コンテナの PAT は運営者本人として動くため、管理者を例外に含めると PAT も一緒にすり抜けてしまう。放置自走セッションが本番へ直接デプロイする経路を塞ぐのが目的（main への push = byte-lark.com への公開）
- Require a pull request before merging（Required approvals は 0。一人体制のため自分の PR を自分でマージする）
- Require status checks to pass：`quality` と `e2e`。`Workers Builds: byte-lark` は入れない（Cloudflare 側の取りこぼしでマージが止まるため。PHASE1C-008 実装ログ参照）
- Block force pushes / Restrict deletions / Restrict creations
- main 以外のブランチは保護なし、直接 push OK

緊急時に保護を外す必要が出たら、Settings → Rules → Rulesets → main protection の Enforcement status を Disabled にする（運営者操作。ruleset 自体の変更には Administration 権限が必要で、コンテナの PAT には**意図的に付与していない**——保護を書き換えられる権限を自走環境に渡すと歯止めが意味を失うため）。

### 10.10 Hotfix

§10.3〜§10.6 の通常フローと同じ（公開後は全作業が main 起点の短命ブランチのため、Hotfix だけの特別な手順はない）。進行中の別ブランチがあれば `git rebase origin/main` で取り込む。

## 11. 改訂履歴

| 日付 | バージョン | 変更内容 |
|---|---|---|
| 2026-05-01 | v1 | 初版作成 |
| 2026-05-01 | v2 | Status フィールド規定、実装ログセクション規定、コミットメッセージ規約追加、Phase ごとの起票タイミングを §9 で明文化、状態同期ルール詳細化 |
| 2026-05-02 | v2.1 | レビュー指摘反映：Gate PBI のロール例外を §4.3 に追加、Done PBI 事後追記方針を §5.5 に追加、改訂バージョニングを §5.6、コミット粒度を §5.7、実装ログ記入漏れ検出を §5.8 に追加 |
| 2026-05-02 | v2.2 | 差分レビュー反映：§5.6 と §5.5 の事後追記重複を §5.5 に集約、§5.8 の検出スクリプトコメント・本文を「### YYYY-MM-DD entry の有無」で正確化 |
| 2026-05-03 | v2.3 | §10 ブランチ運用 新設：Phase ブランチ + 常時 PBI sub-branch + worktree による並行作業、merge --no-ff、sub-branch マージ後保持、CF Pages Preview Branch Filter 必須設定、main 保護、Hotfix 手順 |
| 2026-05-05 | v2.4 | §10.4 を厳格化：PBI 着手時の worktree を「可能なら」から「常時必須（既定）」に変更。Claude による独自判断での省略を禁止。PBI 実装ではない docs 単独修正は本節対象外と明記 |
| 2026-05-05 | v2.5 | §10.2 命名規則修正：PBI sub-branch を `feat/phase-<phase>/pbi-<NNN>` から `feat/phase-<phase>-pbi-<NNN>` へ変更（Git files backend の D/F conflict 制約により Phase ブランチと sub-branch の同時存在が不可能だったため）。§10.1 図、§10.4-10.5 コマンド例、§10.8 CF Pages Exclude pattern、全 PBI ファイルの sub-branch 参照を連動更新 |
| 2026-05-06 | v2.6 | §10.4-10.5 worktree 配置を sibling（`../<repo>-pbi-<NNN>`）からプロジェクト配下（`.claude/worktrees/phase-<phase>-pbi-<NNN>`）に変更。Claude Code sandbox がプロジェクト配下のみ書込許可するため、追加 sandbox 設定なしで運用可能に。Claude セッションは EnterWorktree / ExitWorktree tool で切替。 |
| 2026-05-06 | v2.7 | §5.3 着手時の手順に「PBI 本文の前提を一次情報で確認」step を追加（Step 2、後続 renumber）。Don't Guess の PBI 着手時版。PHASE0-002 で PBI 本文の `--typescript strict` flag / Yarn 4 維持前提が事実と乖離していた経験から、各 PBI 着手時に empirical 確認するルールを明文化。 |
| 2026-05-07 | v2.8 | §5.3 step 2 の verify 範囲を「コマンド・version・flag・URL」から **scaffold / migration / setup の approach 自体**まで拡張。PHASE0-002 セッション 1 で `yarn create astro@latest .` が既存 repo 後付けに非対応で、approach そのものを Astro Manual Setup 節に切替える必要があった経験を規約化。Phase 0 PBI 全体 audit（PHASE0-005 / 006 / 008 の drift 補正）と同セッションで反映。 |
| 2026-06-07 | v2.9 | §10 ブランチ運用を Phase 1a 実績フローに刷新：sub-branch 廃止・常設 worktree `.claude/worktrees/phase-1a` への直 commit/push に変更（PHASE1A-008 完了時に同梱）。§10.1 階層図、§10.2 命名表（sub-branch 行削除）、§10.4 着手手順、§10.5 完了手順、§10.7 競合対処、§10.8 CF Pages filter を更新。CLAUDE.md Sandbox 制約行も同期。 |
| 2026-06-10 | v3.0 | §10 worktree 廃止：feat/phase-1a を直接チェックアウトして作業するフローに変更。§10.1 階層図・§10.4 着手手順・§10.5 完了手順から worktree / EnterWorktree 参照を削除。CLAUDE.md Sandbox 制約行も同期。 |
| 2026-06-14 | v3.1 | §10 ブランチ運用を deferred-merge に是正：公開前の 1a〜1c は feat/phase-1a に集約し、main マージは公開フェーズ 1d に集約（site-plan §8 Decision #25 整合）。§10.1 図 / §10.3（main 分岐は新規 Phase 系列のみ）/ §10.6（マージは 1d 集約、Phase 0 は制定前の歴史的マージと明記）を更新。CLAUDE.md line 69（次 Phase を main から分岐）と operation-manual.md（毎 Phase マージ承認 + v3.0 で廃止済みの worktree / sub-branch 記述）も連動是正。あわせて §4.6 ルール6 の項目数基準を網羅性の目安に降格し、§7 にサイズ判定の主基準（想定セッション数を技術メモに明記・2 セッション以上は必ず分割）を新設。タイトル version（旧 v2.8）と外部参照（CLAUDE.md / site-plan §12 の旧 v2.9）の版数ドリフトを v3.1 に統一（前 Gate が v2.9 と誤修正していたのを訂正、過去事実の改訂履歴行は不変のまま）。 |
| 2026-06-14 | v3.2 | 統合ブランチを `feat/phase-1a` → `feat/phase-1` にリネーム（名前と中身のズレ解消：1a〜1c を集約する統合ブランチを sub-phase 名で呼んでいた問題。deferred-merge 構造は不変）。§10.1 図 / §10.2 命名例 / §10.3〜§10.7 のコマンド例の現行参照を feat/phase-1 に更新。CLAUDE.md（プレビュー URL + フロー）/ operation-manual.md / draft-phase1d（前方マージ参照）/ メモリも連動更新。ブランチは `feat/phase-*` パターン内なので CF preview filter / main 保護は無変更（プレビュー URL は `feat-phase-1-...` に変わる）。Done PBI 本体・v3.0/v3.1 改訂履歴行など過去事実は不変。 |
| 2026-07-12 | v3.3 | §9 に先行トラック例外を追加（site-plan v3.10 Decision #28 連動）：Decision Log で明示された先行トラック PBI（現行：Phase 1c 記事非依存デザイン項目 PHASE1C-001〜007）は前 Phase Gate 通過前でも起票・着手可。仕上げトラック + Gate は従来どおり前 Phase Gate 後に起票し、Gate の申し送りを反映する |
| 2026-08-01 | v3.4 | §4.6 にルール 8（Gate PBI の申し送り棚卸し）を追加：Gate の受け入れ条件に「全実装ログの申し送りを項目単位で列挙し、PBI 化 / 持ち越し / 破棄のいずれかに判定」を必須化。前 Gate からの持ち越し項目も再判定対象。従来の「全ログを読む」だけでは項目単位の判定が強制されず黙って落ちる余地があり、Phase 非所属の項目（例：ダークモード実表示検証）に行き場がなかった穴を塞ぐ。PHASE1B-014 の受け入れ条件にも同項目を追記 |
| 2026-08-02 | v3.5 | §9 に並行運用ルールを追加：記事 PBI と開発系 PBI は別名 clone の別作業ツリーなら並行可（従来の「セッション単位で切替」を置き換え）。1 ツリー 1 セッションを必須化（2026-08-01 に同一ツリー 2 セッションで INDEX.md が古い内容で黙って上書きされる実害が発生）。遵守事項：同一 PBI を 2 セッションで触らない / INDEX は pull→即コミット / push 競合は §10.7。§10.7 冒頭にも別 clone 前提を明記。CLAUDE.md の切替記述も連動更新 |
| 2026-08-02 | v3.6 | §5.1 に Dropped（取り下げ）状態を新設：スコープ変更で不要になった NotStarted の PBI に適用。Decision Log の記録を必須とし、ファイルは削除せず INDEX と同期。初出の適用は初期記事セット縮小（site-plan v3.11 Decision #29）による PHASE1B-010 / 011 / 013 |
| 2026-08-07 | v3.7 | §5.4 に例外を追加（Phase 1c Gate = PHASE1C-012 での判断）：記事の公開・main マージ・DNS / ドメイン切替など**外から見える状態を変えるコミット**を打ったセッションは、その PBI の Done 化まで同一セッションで終える。終えられないならコミット自体を次セッションへ回す。§5.2（Status と INDEX の同一コミット同期）の守備範囲外で、§5.4 が正規に認める「InProgress のまま終える」の中で事故が起きていた（PHASE1B-009：記事は公開済みなのに PBI が InProgress のまま残存）。Phase 1d は該当コミットが並ぶため先行して規約化 |
| 2026-08-09 | v3.8 | §10.9 main の保護を実態に更新（PHASE1D-011）：ruleset「main protection」を設定し、bypass list を空にして運営者本人の端末からも devcontainer からも直接 push を禁止（コンテナの PAT は本人として動くため、管理者を例外に含めると PAT もすり抜ける。放置自走セッションが本番へ直接デプロイする経路を塞ぐのが目的）。必須チェックは `quality` / `e2e` のみで `Workers Builds` は含めない。ruleset 変更に必要な Administration 権限は PAT に意図的に付与しない旨と、緊急時に Enforcement を Disabled にする逃げ道も明記。連動して §10.6 の main マージ手順を直接 push から PR 経由（`gh pr create` → CI green 確認 → `gh pr merge`）へ書き換え。従来 §10.9 は「直接 push 禁止」と書いていたが実際には未設定（`protected: false`）で、記述と現実がずれていた |
| 2026-08-10 | v3.9 | §10 ブランチ運用を公開後の形に切替（Phase 1d Gate = PHASE1D-009、site-plan Decision #31）：統合ブランチ `feat/phase-1` を畳み、**1 作業 1 ブランチ**（main から短命ブランチ → PR → マージ → 削除）に戻した。未完成サイトを main に載せないための遅延マージ（Decision #25）は公開でその理由が消えたため。§10.1 図 / §10.2 命名規則（Phase ブランチ → `feat` `fix` `chore` の作業種別）/ §10.3〜§10.6 の手順 / §10.7 競合対処（同一ブランチへの多重 push → main が進んで PR が古くなる形）/ §10.10 Hotfix（通常フローに統合）を更新。あわせて §10.1 / §10.6 の「1a〜1c を集約」「main マージは一度だけ」が実態（1a〜1d を集約・1d 中に 4 回マージ）とずれていたのを是正し、遅延マージ方式は歴史として §10.6 末尾に残した。§10.8 は「CF Pages の Preview Branch Filter で `feat/phase-*` のみ preview」と書いていたが、実測では**ブランチ名を問わず preview ビルドが走る**（PR #34 の `chore/article-ideas-2026-08`）ため実態に書き換え。CLAUDE.md（ブランチ運用 / branch alias URL / Sandbox 制約）と operation-manual.md も連動更新 |
| 2026-08-11 | v3.9（据え置き） | 事実修正（クラリフィケーション）。§10.8 の Deploy Hooks 記述を実態に更新：残っているのは「main manual rebuild」（対象 main）の 1 本だけで、`feat/phase-1` 向けは統合ブランチを畳んだのに合わせて削除済み。短命ブランチは push で preview ビルドが走るためブランチ別 hook は不要と明記。あわせて hook URL の保管先を 1Password → Bitwarden に訂正（実際の保管先。Done PBI 内の当時表記は不変） |
| 2026-08-12 | v3.10 | §10.4〜§10.6 を draft PR 前提の手順に変更（PHASE1E-002）：CI（`quality` / `e2e`）の `push` trigger を `main` だけに絞り、短命ブランチの検査は `pull_request` に一本化した。PR が開いている間は push と pull_request の両方が発火し、同じコミットに check-run が 2 本ずつ付いていたため（PR #39 の head `7bdd828` で実測）。`pull_request` 側を残したのは、(1) main とマージした結果（merge ref）を検査するので push 側より強い、(2) `dependabot/*` `archive/*` は push フィルタに入らずこの trigger が唯一の経路、の 2 点。代わりに **最初の push の直後に draft PR を作る**ことを §10.4 に明記し、作業ブランチの CI と CF preview が同時に始まる形にした（PR #38 が push trigger 拡張で塞いだ「PR 作成まで検証が詰まる」穴は、これで満たされる）。§10.6 は `gh pr create` → `gh pr ready` に置き換え、draft を外す操作を §7 検証完了の宣言と位置づけた。あわせて `quality.yml` に concurrency（`cancel-in-progress`）を追加。CLAUDE.md §7 も連動更新 |

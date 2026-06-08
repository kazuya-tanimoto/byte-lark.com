# PBI フォーマット規約 (v2.8)

本プロジェクト（byte-lark.com）の Product Backlog Item (PBI) はすべて本規約に従う。

最終更新: 2026-05-07

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
6. 1 PBI で 5-15 項目が目安。20+ になる場合は **PBI 分割を検討**

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
```

逆遷移（Done → InProgress 等）は原則しない。やり直しが必要なら新規 PBI を起票。

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

以下に該当する場合は分割：

- 受け入れ条件が 20 項目以上
- 複数のロール（訪問者 + 運営者等）が混在
- 異なる Phase にまたがる
- 概ね 1 営業日（人間換算）を超える

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

## 10. ブランチ運用

### 10.1 ブランチ階層

```
main                          保護対象、Phase 完了時のみマージで更新
├── feat/phase-0              Phase 0 ブランチ（完了・main マージ済み）
├── feat/phase-1a             Phase 1a ブランチ（常設 worktree で直 commit/push）
└── archive/vite-react-chakra 旧版退避（Phase 0 開始時に切った）
```

### 10.2 命名規則

| ブランチ | 命名 | 例 |
|---|---|---|
| Phase ブランチ | `feat/phase-<phase>` | `feat/phase-0`, `feat/phase-1a` |
| Archive | `archive/<context>` | `archive/vite-react-chakra` |
| Hotfix | `fix/<short>` | `fix/typo-readme` |

### 10.3 Phase 開始時

```bash
git checkout main
git pull origin main
git checkout -b feat/phase-<phase>
git push -u origin feat/phase-<phase>
```

### 10.4 PBI 着手時（常設 worktree 直 commit/push）

Phase 1a 以降は sub-branch を使わず、常設 worktree `.claude/worktrees/phase-1a` で作業し feat/phase-1a に直接 commit / push する。

```bash
# セッション開始: リポジトリルートで Claude Code を起動後、常設 worktree に入る
# Claude セッション: EnterWorktree({ path: ".claude/worktrees/phase-1a" })

# worktree 内で git 操作を直接実行（ExitWorktree 不要）
git add <files>
git commit -m "feat(pbi): PHASE1A-NNN <desc>"
git push origin feat/phase-1a
```

sandbox の allowWrite に `.`（プロジェクト配下）と `/.../.git` が含まれるため、worktree 内から git add / commit / push はそのまま実行できる。旧 §10.5 の「ExitWorktree + `-C` オプション」手順は不要。

**PBI 実装ではない docs 単独の修正**（site-plan.md、INDEX.md 等）は本節対象外。Phase ブランチに直 commit してよい。

### 10.5 PBI 完了時

§10.4 と同じ worktree 内で commit / push する。マージ工程は不要（feat/phase-1a が Phase ブランチ兼作業ブランチ）。

```bash
# PBI 完了: 受け入れ条件確認 → STATUS: Done → INDEX.md 同期 → commit → push
git add docs/pbi/PHASE1A-NNN-xxx.md docs/pbi/INDEX.md <実装ファイル群>
git commit -m "feat(pbi): PHASE1A-NNN <desc>"
git push origin feat/phase-1a
```

### 10.6 Phase 完了時（Phase ブランチを main へマージ）

Retrospective Gate PBI（PHASE0-010 等）の受け入れ条件として実施：

```bash
git checkout main
git pull origin main
git merge --no-ff feat/phase-<phase>
git push origin main

# Phase ブランチも remote に保持（後で全体構造を見られる）
```

### 10.7 並行作業の競合対処

複数セッションが同時に feat/phase-1a に push すると non-fast-forward で後発が fail する：

```bash
git pull --rebase origin feat/phase-1a
# conflict（INDEX.md 等）あれば手動 resolve → git rebase --continue
git push origin feat/phase-1a
```

### 10.8 Cloudflare Pages の Preview Branch Filter（必須設定）

Phase ブランチのみ preview deployment が生成される（sub-branch なし）。**運営者は CF Pages のダッシュボードで Custom branches 設定を行う**：

- **Include Preview branches**：`feat/phase-*`（Phase ブランチのみ preview）

または **Disable all preview deployments** 一択。

設定詳細は [Cloudflare Pages: Branch deployment controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/) 参照。

### 10.9 main の保護

GitHub UI の Branch protection rules で main を保護：

- 直接 push 禁止（PR 経由のみ、または管理者のみ許可）
- Phase ブランチ（`feat/phase-*`）と sub-branch は保護なし、直接 push OK

### 10.10 Hotfix（main に直接修正したい場合）

```bash
git checkout main
git pull origin main
git checkout -b fix/<short-name>
# 修正・commit
git push -u origin fix/<short-name>
# PR 作成 → main へマージ
# 進行中の Phase ブランチは：git pull origin main を merge or rebase で取り込む
```

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

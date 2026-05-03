# PBI フォーマット規約 (v2.3)

本プロジェクト（byte-lark.com）の Product Backlog Item (PBI) はすべて本規約に従う。

最終更新: 2026-05-03

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
2. PBI の Status を `InProgress` に変更、Started に今日の日付追記
3. INDEX.md の該当エントリを `[InProgress]` に更新
4. 実装する
5. 完了：受け入れ条件全 check → Status: Done + Completed 追記 → INDEX.md 同期
6. コミット（後述のメッセージ規約に従う）

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
main                         保護対象、Phase 完了時のみマージで更新
├── feat/phase-0/            Phase 0 ブランチ（main から切る）
│   ├── feat/phase-0/pbi-001 PBI ごと sub-branch（Phase ブランチから切る、常時）
│   ├── feat/phase-0/pbi-002 並行 session が必要なら worktree で複数同時展開可
│   └── ...
├── feat/phase-1a/           Phase 1a ブランチ
│   └── ...
└── archive/vite-react-chakra  旧版退避（Phase 0 開始時に切った）
```

### 10.2 命名規則

| ブランチ | 命名 | 例 |
|---|---|---|
| Phase ブランチ | `feat/phase-<phase>` | `feat/phase-0`, `feat/phase-1a` |
| PBI sub-branch | `feat/phase-<phase>/pbi-<NNN>` | `feat/phase-0/pbi-001` |
| Archive | `archive/<context>` | `archive/vite-react-chakra` |
| Hotfix | `fix/<short>` | `fix/typo-readme` |

### 10.3 Phase 開始時

```bash
git checkout main
git pull origin main
git checkout -b feat/phase-<phase>
git push -u origin feat/phase-<phase>
```

### 10.4 PBI 着手時（**常時 sub-branch + worktree**）

並行可能性を担保するため、PBI ごとに必ず sub-branch を切り、可能なら worktree で展開する：

```bash
# Phase ブランチから sub-branch を切る
cd <main repo>
git checkout feat/phase-<phase>
git pull origin feat/phase-<phase>

# worktree で sibling ディレクトリに展開（並行 session 用）
git worktree add ../<repo>-pbi-<NNN> -b feat/phase-<phase>/pbi-<NNN>

# 作業ディレクトリへ移動
cd ../<repo>-pbi-<NNN>
```

並行 session が不要な場合は worktree を省略し、`git checkout -b feat/phase-<phase>/pbi-<NNN>` で同一ディレクトリ内で済ませても可。

### 10.5 PBI 完了時（sub-branch を Phase ブランチへマージ）

```bash
# sub-branch ディレクトリで commit / push
cd ../<repo>-pbi-<NNN>
git push -u origin feat/phase-<phase>/pbi-<NNN>

# 元の Phase ブランチに戻る
cd <main repo>
git checkout feat/phase-<phase>
git pull origin feat/phase-<phase>  # 他並行 PBI の進捗を取り込む

# merge commit 強制（squash しない、PBI 名を log に残す）
git merge --no-ff feat/phase-<phase>/pbi-<NNN>
# INDEX.md などに conflict があれば手動 resolve

git push origin feat/phase-<phase>

# worktree 削除（ローカルディレクトリ整理）
git worktree remove ../<repo>-pbi-<NNN>

# remote の sub-branch は削除しない（log + 個別 PBI 状態の checkout 用に保持）
```

**sub-branch は削除しない**：マージ後も remote に残し、`git checkout feat/phase-<phase>/pbi-<NNN>` で過去 PBI の独立状態に戻れるようにする。CF Pages の preview 大量生成は §10.8 の filter 設定で抑制。

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

**INDEX.md は表構造で PBI 行が隣接しているため、並行直接編集は git auto-merge できず必ず conflict する**（実証済）。sub-branch 戦略により conflict をマージタイミング 1 回に集約する。

push 競合（後発の `git push` が non-fast-forward で fail）：

```bash
git pull --rebase origin feat/phase-<phase>
# conflict あれば手動 resolve、git rebase --continue
git push origin feat/phase-<phase>
```

### 10.8 Cloudflare Pages の Preview Branch Filter（必須設定）

sub-branch を保持する運用では、Cloudflare Pages のデフォルト設定（全非本番 branch に preview deployment 自動生成）が大量の不要 preview を生む。**運営者は CF Pages のダッシュボードで Custom branches 設定を必ず行う**：

- **Include Preview branches**：`feat/phase-*`（Phase ブランチのみ preview）
- **Exclude Preview branches**：`feat/phase-*/pbi-*`（PBI sub-branch は preview しない）

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

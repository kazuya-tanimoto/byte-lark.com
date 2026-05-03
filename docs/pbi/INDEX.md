# PBI Index

最終更新: 2026-05-03

本ファイルは全 PBI の状態を一元管理するインデックスです。各 PBI ファイルの Status と必ず同期させてください（同期ルールは `docs/pbi/README.md` §5 参照）。

---

## 凡例

- `[NotStarted]` 未着手
- `[InProgress]` 仕掛中
- `[Done]` 完了

## 着手ルール

**PBI 選択ロジック**（下の要約） + **着手・中断・完了の手順**（[docs/pbi/README.md](README.md) §5）の 2 つを組合せて完結します。

PHASE0-005 完了後は `CLAUDE.md` の "How to start/end/draft" セクションに同等の protocol が inline で入り、SoT が CLAUDE.md に移行します（PHASE0-005 完了前は本ファイル + README §5 が SoT）。

### PBI 選択ロジック（要約）
- InProgress な PBI が存在すれば、その実装ログを読んで再開
- なければ、現在 Phase の最初の NotStarted PBI を着手（推奨着手順序図に従う）
- 前 Phase の Gate PBI が Done になっていない場合、次 Phase に進まない

### 着手後・中断時・完了時の手順
[docs/pbi/README.md](README.md) §5 を参照（着手時の手順 §5.3、中断時の手順 §5.4、完了済み PBI の扱い §5.5、コミット規約 §6）。

### セッション開始時の必須チェック（v3.6 から必須化）
PBI を着手する前に、以下を**必ず実行**：

```bash
# README §5.8 の検出スクリプト：InProgress なのに実装ログ entry が無い PBI を検出
for f in $(grep -l "^Status: InProgress" docs/pbi/*.md); do
  if ! grep -q "^### 20" "$f"; then
    echo "WARNING: 実装ログ entry 無し → $f"
  fi
done
```

該当があれば、運営者に「<該当 PBI> が InProgress ですが実装ログが空です。前回の状況を覚えていますか？」と確認してから再開する（運営者操作の詳細は [docs/operation-manual.md](../operation-manual.md) §2 参照）。

---

## Phase 0：プロジェクト初期化

表は推奨着手順序に従って並べる：

| ID | タイトル | Status |
|---|---|---|
| PHASE0-001 | [vite-resources-cleanup](20260501-PHASE0-001-vite-resources-cleanup.md) | NotStarted |
| PHASE0-002 | [astro-scaffold](20260501-PHASE0-002-astro-scaffold.md) | NotStarted |
| PHASE0-003 | [data-migration](20260501-PHASE0-003-data-migration.md) | NotStarted |
| PHASE0-004 | [biome-v2-upgrade](20260501-PHASE0-004-biome-v2-upgrade.md) | NotStarted |
| PHASE0-005 | [claude-md-update](20260501-PHASE0-005-claude-md-update.md) | NotStarted |
| PHASE0-006 | [readme-stub-update](20260502-PHASE0-006-readme-stub-update.md) | NotStarted |
| PHASE0-007 | [lefthook-workflows-setup](20260501-PHASE0-007-lefthook-workflows-setup.md) | NotStarted |
| PHASE0-008 | [cloudflare-pages-setup](20260501-PHASE0-008-cloudflare-pages-setup.md) | NotStarted |
| PHASE0-009 | [local-dev-verification](20260501-PHASE0-009-local-dev-verification.md) | NotStarted |
| **PHASE0-010** | [**retrospective-gate**](20260501-PHASE0-010-retrospective-gate.md) **(Gate)** | **NotStarted** |

### Phase 0 推奨着手順序

依存関係を考慮した推奨順（上の表の順序と一致）：

```
PHASE0-001 (cleanup)
  ↓
PHASE0-002 (astro scaffold) ← 大きい、複数セッション可能性
  ↓
┌─ PHASE0-003 (data + logo migration)
├─ PHASE0-004 (biome v2)
├─ PHASE0-005 (claude.md update)              ← ドキュメント整備グループ
└─ PHASE0-006 (readme stub update)             ← ドキュメント整備グループ
   並列可だが、commit 衝突回避のため同セッション内では逐次推奨
  ↓
PHASE0-007 (lefthook + workflows)
  ↓
PHASE0-008 (cloudflare pages preview) ← 運営者の Cloudflare 操作含む
  ↓
PHASE0-009 (local + production verification) ← 全体動作ゲート
  ↓
PHASE0-010 (retrospective gate) ← Phase 1a 移行前の必須ゲート
```

**並列可と書いた 003-006 群について**：別セッションで分担すれば真に並列だが、同セッション内では `package.json` / `CLAUDE.md` 等の commit 衝突回避のため逐次推奨。

---

## Phase 1a：サイト構成・各ページ実装

PBI は **Phase 0 完了 + PHASE0-010 (Retrospective Gate) 通過後**に別セッションで起票する。  
（v3.7 ロードマップ §7 の方針に従う）

---

## Phase 1b：デザインブラッシュアップ

PBI は **Phase 1a 完了 + Gate 通過後**に別セッションで起票する。

---

## Phase 1c：カテゴリ別一覧

PBI は **Phase 1b 完了後**に別セッションで起票する（記事数到達条件あり）。

---

## Phase 2：広告収益化

PBI は **Phase 1 完了 + 記事 30 本以上**の段階で起票する。

---

## 改訂履歴

| 日付 | 変更内容 |
|---|---|
| 2026-05-01 | 初版作成、Phase 0 PBI 9 件を登録 |
| 2026-05-02 | レビュー反映：PHASE0-010 (readme-stub-update) 追加、着手ルールを CLAUDE.md SoT に集約、PHASE0-006 を lefthook-workflows-setup にリネーム |
| 2026-05-02 | 差分レビュー反映：PHASE0-010 をドキュメント整備グループとして 005 と並列化、表の並びを推奨着手順序図と一致させた、PHASE0-006 のリンク先を実ファイル名と一致 |
| 2026-05-02 | site-plan v3.4 連動：line 74 のロードマップ参照を v3.4 に更新 |
| 2026-05-02 | site-plan v3.5 連動：line 74 のロードマップ参照を v3.5 に更新（4 回目レビュー推奨#3 反映） |
| 2026-05-02 | 着手ルール書き換え：循環参照（CLAUDE.md → INDEX.md → CLAUDE.md）を解消、PHASE0-005 完了前の SoT を「INDEX.md + README §5」に明示。CLAUDE.md ヘッダーにも README §5 への暫定誘導追加 |
| 2026-05-03 | site-plan v3.6 連動：line 74 のロードマップ参照を v3.6 に更新、着手ルールに「セッション開始時の必須チェック」（§5.8 検出スクリプト実行）を追加・必須化、operation-manual.md への誘導追加 |
| 2026-05-03 | site-plan v3.7 連動：line 93 のロードマップ参照を v3.7 に更新（README §10 ブランチ運用追加に伴う） |
| 2026-05-03 | PHASE0 PBI 番号を着手順序に整列（旧 010→新 006、旧 006→新 007、旧 007→新 008、旧 008→新 009、旧 009→新 010）。本日以前の改訂履歴に出てくる PBI 番号は当時の番号付けを参照 |

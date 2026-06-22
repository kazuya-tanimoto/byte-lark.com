# PBI Index

最終更新: 2026-06-15

本ファイルは全 PBI の状態を一元管理するインデックスです。各 PBI ファイルの Status と必ず同期させてください（同期ルールは `docs/pbi/README.md` §5 参照）。

---

## 凡例

- `[NotStarted]` 未着手
- `[InProgress]` 仕掛中
- `[Done]` 完了
- `[Moved]` 他 Phase へ移管（着手対象外。移管先は PBI ファイル冒頭に記載）

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
# (1) README §5.8：InProgress なのに実装ログ entry が無い PBI を検出
for f in $(grep -l "^Status: InProgress" docs/pbi/*.md); do
  if ! grep -q "^### 20" "$f"; then
    echo "WARNING: 実装ログ entry 無し → $f"
  fi
done

# (2) §7 検証ゲート（README §4.6 ルール 7）：着手対象 PBI に検証 3 行が無い＝起票漏れ
for f in $(grep -lE "^Status: (NotStarted|InProgress)" docs/pbi/*PHASE*.md); do
  grep -q "スクショ確認" "$f" || echo "WARNING: §7 スクショ検証が受け入れ条件に無い（テンプレ常設漏れ）→ $f"
  grep -q "ci-status" "$f"     || echo "WARNING: §7 E2E/CI 検証が受け入れ条件に無い（テンプレ常設漏れ）→ $f"
done

# (3) §7 検証ゲート：Done なのに検証行が未 check [ ] のまま＝検証せず Done 化
for f in $(grep -l "^Status: Done" docs/pbi/*PHASE*.md); do
  grep -qE '^- \[ \].*スクショ確認' "$f" && echo "WARNING: §7 スクショ検証が未 check のまま Done → $f"
  grep -qE '^- \[ \].*ci-status'   "$f" && echo "WARNING: §7 E2E/CI 検証が未 check のまま Done → $f"
done
```

(1) に該当があれば、運営者に「<該当 PBI> が InProgress ですが実装ログが空です。前回の状況を覚えていますか？」と確認してから再開する（運営者操作の詳細は [docs/operation-manual.md](../operation-manual.md) §2 参照）。(2)(3) に該当があれば、受け入れ条件に §7 検証 3 項目（ローカル / CF preview スクショ + E2E/CI green）を追加（非該当なら `[x] …：N/A（理由）`）してから着手・完了する。

---

## Phase 0：プロジェクト初期化

表は推奨着手順序に従って並べる：

| ID | タイトル | Status |
|---|---|---|
| PHASE0-001 | [vite-resources-cleanup](20260501-PHASE0-001-vite-resources-cleanup.md) | Done |
| PHASE0-002 | [astro-scaffold](20260501-PHASE0-002-astro-scaffold.md) | Done |
| PHASE0-003 | [data-migration](20260501-PHASE0-003-data-migration.md) | Done |
| PHASE0-004 | [biome-v2-upgrade](20260501-PHASE0-004-biome-v2-upgrade.md) | Done |
| PHASE0-005 | [claude-md-update](20260501-PHASE0-005-claude-md-update.md) | Done |
| PHASE0-006 | [readme-stub-update](20260502-PHASE0-006-readme-stub-update.md) | Done |
| PHASE0-007 | [lefthook-workflows-setup](20260501-PHASE0-007-lefthook-workflows-setup.md) | Done |
| PHASE0-008 | [cloudflare-pages-setup](20260501-PHASE0-008-cloudflare-pages-setup.md) | Done |
| PHASE0-009 | [local-dev-verification](20260501-PHASE0-009-local-dev-verification.md) | Done |
| **PHASE0-010** | [**retrospective-gate**](20260501-PHASE0-010-retrospective-gate.md) **(Gate)** | **Done** |

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

表は推奨着手順序に従って並べる：

| ID | タイトル | Status |
|---|---|---|
| PHASE1A-001 | [workers-migration-ci](20260510-PHASE1A-001-workers-migration-ci.md) | Done |
| PHASE1A-002 | [design-tokens-code-highlight](20260510-PHASE1A-002-design-tokens-code-highlight.md) | Done |
| PHASE1A-003 | [content-collections-image](20260510-PHASE1A-003-content-collections-image.md) | Done |
| PHASE1A-004 | [writing-workflow](20260510-PHASE1A-004-writing-workflow.md) | Done |
| PHASE1A-005 | [base-layout-ogp](20260510-PHASE1A-005-base-layout-ogp.md) | Done |
| PHASE1A-006 | [header-footer](20260510-PHASE1A-006-header-footer.md) | Done |
| PHASE1A-007 | [post-layout-jsonld](20260510-PHASE1A-007-post-layout-jsonld.md) | Done |
| PHASE1A-008 | [home-page](20260510-PHASE1A-008-home-page.md) | Done |
| PHASE1A-009 | [about-page](20260510-PHASE1A-009-about-page.md) | Done |
| PHASE1A-010 | [career-page](20260510-PHASE1A-010-career-page.md) | Done |
| PHASE1A-011 | [skills-page](20260510-PHASE1A-011-skills-page.md) | Done |
| PHASE1A-012 | [blog-list](20260510-PHASE1A-012-blog-list.md) | Done |
| PHASE1A-013 | [blog-post-detail](20260510-PHASE1A-013-blog-post-detail.md) | Done |
| PHASE1A-014 | [contact-page](20260510-PHASE1A-014-contact-page.md) | Done |
| PHASE1A-015 | [privacy-page](20260510-PHASE1A-015-privacy-page.md) | Done |
| PHASE1A-016 | [notfound-page](20260510-PHASE1A-016-notfound-page.md) | Done |
| PHASE1A-017 | [rss-sitemap-robots](20260510-PHASE1A-017-rss-sitemap-robots.md) | Done |
| PHASE1A-018 | [custom-domain-analytics](20260510-PHASE1A-018-custom-domain-analytics.md) | Moved |
| PHASE1A-019 | [e2e-tests-a11y](20260510-PHASE1A-019-e2e-tests-a11y.md) | Done |
| PHASE1A-020 | [lighthouse-cwv-production](20260510-PHASE1A-020-lighthouse-cwv-production.md) | Done |
| PHASE1A-021 | [incident-response](20260510-PHASE1A-021-incident-response.md) | Done |
| **PHASE1A-022** | [**retrospective-gate**](20260510-PHASE1A-022-retrospective-gate.md) **(Gate)** | **Done** |

### Phase 1a 推奨着手順序

依存関係を考慮した推奨順（上の表の順序と一致）：

```
PHASE1A-001 (Workers + CI) ← 最初に実施、インフラ基盤
  ↓
┌─ PHASE1A-002 (design tokens + code highlight)   ← 決定事項グループ
├─ PHASE1A-003 (Content Collections + image)       ← 決定事項グループ
└─ PHASE1A-004 (writing workflow + new-post)        ← 決定事項グループ
   並列可だが、同セッション内では逐次推奨
  ↓
PHASE1A-005 (BaseLayout + OGP) ← 全ページの基盤
  ↓
┌─ PHASE1A-006 (Header + Footer)
└─ PHASE1A-007 (PostLayout + JSON-LD)
  ↓
┌─ PHASE1A-008 (Home)
├─ PHASE1A-009 (About)
├─ PHASE1A-010 (Career)         ← ページ実装グループ
├─ PHASE1A-011 (Skills)           並列可
├─ PHASE1A-012 (Blog 一覧) ← 003, 008 依存
├─ PHASE1A-013 (Blog 記事詳細) ← 003, 007 依存
├─ PHASE1A-014 (Contact)
├─ PHASE1A-015 (Privacy)
└─ PHASE1A-016 (NotFound)
  ↓
PHASE1A-017 (RSS + Sitemap + robots.txt) ← 003 依存
  ↓
PHASE1A-018 → **Moved**（公開は Phase 1d へ移管。site-plan v3.9 Decision #25）
  ↓
PHASE1A-019 (E2E + a11y) ← 全ページ実装後
  ↓
PHASE1A-020 (Lighthouse + CWV + branch alias での品質確認) ← 最終品質ゲート
PHASE1A-021 (incident-response) ← R-11 対応、依存なし（任意のタイミングで実施可）
  ↓
PHASE1A-022 (retrospective gate) ← Phase 1b 移行前の必須ゲート
```

---

## Phase 1b：コンテンツ整備（site-plan v3.9 で新設）

[draft-phase1b-content-launch-prep.md](draft-phase1b-content-launch-prep.md) を 2026-06-15 に正式化（項目1〜6、Contact は §7 基準で 4a/4b に分割）。

表は推奨着手順序に従って並べる：

| ID | タイトル | Status |
|---|---|---|
| PHASE1B-001 | [skills-qualifications-refresh](20260615-PHASE1B-001-skills-qualifications-refresh.md) | Done |
| PHASE1B-002 | [career-refresh-representative-projects](20260615-PHASE1B-002-career-refresh-representative-projects.md) | Done |
| PHASE1B-003 | [about-privacy-content-finalize](20260615-PHASE1B-003-about-privacy-content-finalize.md) | Done |
| PHASE1B-004 | [contact-form-backend](20260615-PHASE1B-004-contact-form-backend.md) | InProgress |
| PHASE1B-005 | [contact-form-frontend](20260615-PHASE1B-005-contact-form-frontend.md) | InProgress |
| PHASE1B-006 | [sample-posts-disposition](20260615-PHASE1B-006-sample-posts-disposition.md) | NotStarted |
| PHASE1B-007 | [article-ideation-initial-set](20260615-PHASE1B-007-article-ideation-initial-set.md) | NotStarted |

### Phase 1b 推奨着手順序

001-003 は運営者インプット待ち（Skills/Career 実データ、About/Privacy 文面承認）が発生し得る。待ち時間は Contact（004 → 005）を並行で進める：

```
┌─ PHASE1B-001 (Skills / 資格 現行化)    ← Done（2026-06-17）
├─ PHASE1B-002 (Career 現行化 + 代表案件)  ← Done（2026-06-21。全16案件を一次情報で再構築・雇用形態ラベル）
└─ PHASE1B-003 (About / Privacy 文面確定)  ← Done（2026-06-21。合同会社バイトラーク設立済みを反映・About 用素材で得意/合わない領域+性格を追加・運営者承認）
        ‖ 並行 ‖
PHASE1B-004 (Contact backend: Worker /api/contact + Turnstile + Resend)
  ↓
PHASE1B-005 (Contact frontend: フォーム UI + Turnstile + mailto 撤去 + E2E) ← 004 依存
  ↓
PHASE1B-006 (サンプル記事処置)
  ↓
PHASE1B-007 (記事ネタ出し・初期記事セット確定)
  ↓
記事実装 PBI 群（PHASE1B-008〜、本数は 007 で確定）+ Phase 1b Retrospective Gate
  ← 007 完了時に追加起票（draft 項目7 = placeholder。番号は起票時に確定）
```

---

## Phase 1c：デザインブラッシュアップ（旧 1b）

PBI は **Phase 1b 完了後**に別セッションで起票する。**[draft-phase1c-design-polish.md](draft-phase1c-design-polish.md) を正式化する**（確定 HEX + color-contrast 再有効化、タイポ確定、ロゴ刷新、加えて PHASE1A-020 で判明した品質仕上げ: blog 見出しレベル / about 低速 CLS（フォント）/ CSS サイズ / favicon 意匠）。

---

## Phase 1d：公開（site-plan v3.9 で新設）

PBI は **Phase 1c 完了後**に起票する。**[draft-phase1d-domain-launch.md](draft-phase1d-domain-launch.md) を正式化する**（再 QA、NS 移管 + メール無停止、main マージ、カスタムドメイン、www 畳み、Web Analytics、Search Console。旧 PHASE1A-018 の移管先）。

---

## Phase 1e：カテゴリ別一覧（旧 1c）

PBI は **記事数到達時**（FR-19: 合計 10 件以上）に起票する。

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
| 2026-05-05 | README v2.5 連動：PBI sub-branch 命名規則を `feat/phase-<phase>/pbi-<NNN>` から `feat/phase-<phase>-pbi-<NNN>` へ変更（Git files backend の D/F conflict 制約回避）。全 PBI ファイル (PHASE0-001〜009) 内の sub-branch 参照を連動更新 |
| 2026-05-10 | Phase 1a PBI 21 件を起票（PHASE1A-001〜021）。PHASE0-010 Gate 申し送り + Phase 0 実装ログ + site-plan v3.8 を反映。Workers 移行（Decision #17 変更）を含む |
| 2026-05-12 | Phase 1a PBI レビュー反映：PHASE1A-021 incident-response 追加（R-11 対応）、Gate を PHASE1A-022 にリナンバー。修正 9 件（001: site-plan/CLAUDE.md 更新 + Lefthook + R-02 雛形追加、002: Q5 受け入れ条件化 + CSP メモ追加、008: qualifications.ts 追加、011: Q13 誤参照修正、012: BlogCard 共有明示、017: yarn add 誤記修正、019: 削除済みデモテスト参照修正）+ site-plan §6.4 content config パス修正 |
| 2026-05-12 | Phase 1a PBI 2 回目レビュー反映：着手順序図の 012 依存に 008 追加、site-plan §6.4 に qualifications.ts 追加、002 に Noto Sans JP 導入追加、001/018 の「なんのために」に NFR-04/R-14 紐付け追加、11 件の PBI に yarn check:ts 受け入れ条件を統一追加（006/008-011/013-018） |
| 2026-05-14 | Phase 1a PBI 3 回目レビュー反映：001 に README Lefthook 手順追記の受け入れ条件追加（PHASE0-010 申し送り反映）、017 の「導入」表現を「Phase 0 でインストール済み」に修正 |
| 2026-06-13 | site-plan v3.9 Phase 再編を反映：PHASE1A-018 を Status: Moved（公開を Phase 1d へ移管）、凡例に Moved 追加、着手順序図から 018 を除外、Phase セクションを 1b コンテンツ整備 / 1c デザイン / 1d 公開 / 1e カテゴリ別一覧に再編、ドラフト 2 本（draft-phase1b-content-launch-prep.md / draft-phase1d-domain-launch.md）へのリンク追加。PHASE1A-020 の検証 URL を branch alias に変更、PHASE1A-022 に 018 例外と申し送り項目を追記 |
| 2026-06-14 | PHASE1A-020 完了（Done）：A11y 90+ / BP 100 を branch alias 確認、Performance 90+ / SEO 90+ は branch alias 検証不能（noindex 強制 / 本番キャッシュ無し / 計測ノイズ）のため Phase 1d へ移管。favicon 追加 + sample-highlight 削除。1c デザイン仕上げ項目を draft-phase1c-design-polish.md に集約し Phase 1c セクションからリンク（漏れ防止） |
| 2026-06-14 | PHASE1A-021 完了（Done）：`docs/incident-response.md` 作成（R-11 対応）。現構成（Cloudflare Workers SSG / Git 正本 / mailto Contact / バックエンド無し / 法人化前）前提で監視・初動フロー・ケース別手順・CF 確認手順を記載。残り Phase 1a は Gate PHASE1A-022 のみ |
| 2026-06-14 | **PHASE1A-022 完了（Done）＝ Phase 1a Gate 通過**。全 PBI Done 確認（018 のみ Moved）、検証コマンド 5 種 green、CI green を確認のうえ `## Phase 1b への申し送り` を集約。site-plan §10 未決事項の確定反映 / §12 v2.9 / §6.4 追記でドリフト修正。main マージは v3.9 Decision #25 で Phase 1d 移管済みのため Gate では実施せず（運営者承認）。次セッションは Phase 1b PBI 起票（draft-phase1b-content-launch-prep.md の正式化）から |
| 2026-06-14 | ガバナンス文書ドリフト一括是正（docs のみ）：README §10 ブランチ運用を deferred-merge に是正し v3.0 → v3.1（公開前 1a〜1c は feat/phase-1a 集約、main マージは 1d。Decision #25 整合）。版数を v3.1 に統一（README タイトル / CLAUDE.md / site-plan §12 の現行参照のみ。過去事実の改訂履歴・Done PBI 本体は不変）。README §4.6 ルール6 を網羅性の目安に降格 + §7 にサイズ判定の主基準（想定セッション数を技術メモに明記 / 2 セッション以上は必ず分割）を新設。CLAUDE.md line 69/90・operation-manual.md（毎 Phase マージ + v3.0 廃止済み worktree 記述）も連動是正。Phase 1b 正式化は次セッション |
| 2026-06-14 | 統合ブランチ改名（README v3.2 連動）：公開前 1a〜1c を集約する統合ブランチを `feat/phase-1a` → `feat/phase-1` にリネーム（名前と中身のズレ解消、deferred-merge 構造は不変）。README §10 / CLAUDE.md / operation-manual.md / draft-phase1d の現行・前方参照と CF プレビュー URL を連動更新。`feat/phase-*` パターン内のため CF filter / main 保護は無変更。Done PBI 本体の当時のブランチ名は不変 |
| 2026-06-15 | **Phase 1b PBI 起票（7 件）**：`draft-phase1b-content-launch-prep.md` を正式化。PHASE1B-001（Skills/資格 現行化）/ 002（Career 現行化 + 代表案件）/ 003（About/Privacy 文面確定）/ 004（Contact backend）/ 005（Contact frontend）/ 006（サンプル記事処置）/ 007（記事ネタ出し・初期記事セット確定）。draft 項目4（Contact フォーム化 FR-29）を §7 基準でバックエンド 004 / フロント 005 に分割。各 PBI 技術メモに想定セッション数を明記（全件 1 セッション、004 は 2 セッション化時の再分割条件を付記）、受け入れ条件に §7 検証ゲート 3 項目を常設。PHASE1A-022 申し送り + Phase 1a 各実装ログ（devicon 403 判定 / HMR / Career id=2 一次情報なし / About=ですます調・Privacy=簡易案 / wrangler は assets のみ / Footer も平文 mailto）を反映。draft 項目7（記事実装 × n）と Phase 1b Gate は 007 完了時に追加起票（placeholder）。INDEX セッション開始チェック 3 種 green 確認済み |

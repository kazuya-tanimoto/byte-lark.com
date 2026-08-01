# PBI Index

最終更新: 2026-08-01

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
- **例外（先行トラック）**：site-plan §8 Decision #28 で定義された Phase 1c 先行トラック（PHASE1C-001〜007）は、Phase 1b Gate（PHASE1B-014）未通過でも着手可。記事 PBI（PHASE1B-008〜013）とはセッション単位で切り替えて進める（README §9 例外 / push 競合は §10.7）

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
| PHASE1B-004 | [contact-form-backend](20260615-PHASE1B-004-contact-form-backend.md) | Done |
| PHASE1B-005 | [contact-form-frontend](20260615-PHASE1B-005-contact-form-frontend.md) | Done |
| PHASE1B-006 | [sample-posts-disposition](20260615-PHASE1B-006-sample-posts-disposition.md) | Done |
| PHASE1B-007 | [article-ideation-initial-set](20260615-PHASE1B-007-article-ideation-initial-set.md) | Done |
| PHASE1B-008 | [post-building-blog-with-claude-code](20260628-PHASE1B-008-post-building-blog-with-claude-code.md) | InProgress |
| PHASE1B-009 | [post-contact-form-on-workers](20260628-PHASE1B-009-post-contact-form-on-workers.md) | NotStarted |
| PHASE1B-010 | [post-legacy-to-modern](20260628-PHASE1B-010-post-legacy-to-modern.md) | NotStarted |
| PHASE1B-011 | [post-claude-code-for-po-work](20260628-PHASE1B-011-post-claude-code-for-po-work.md) | NotStarted |
| PHASE1B-012 | [post-incorporating-bytelark](20260628-PHASE1B-012-post-incorporating-bytelark.md) | NotStarted |
| PHASE1B-013 | [post-work-fit-strengthsfinder](20260628-PHASE1B-013-post-work-fit-strengthsfinder.md) | NotStarted |
| PHASE1B-015 | [codeql-dual-setup-fix](20260713-PHASE1B-015-codeql-dual-setup-fix.md) | Done |
| PHASE1B-016 | [claude-devcontainer-setup](20260717-PHASE1B-016-claude-devcontainer-setup.md) | Done |
| **PHASE1B-014** | [**retrospective-gate**](20260628-PHASE1B-014-retrospective-gate.md) **(Gate)** | **NotStarted** |

### Phase 1b 推奨着手順序

001-003 は運営者インプット待ち（Skills/Career 実データ、About/Privacy 文面承認）が発生し得る。待ち時間は Contact（004 → 005）を並行で進める：

```
┌─ PHASE1B-001 (Skills / 資格 現行化)    ← Done（2026-06-17）
├─ PHASE1B-002 (Career 現行化 + 代表案件)  ← Done（2026-06-21。全16案件を一次情報で再構築・雇用形態ラベル）
└─ PHASE1B-003 (About / Privacy 文面確定)  ← Done（2026-06-21。合同会社バイトラーク設立済みを反映・About 用素材で得意/合わない領域+性格を追加・運営者承認）
        ‖ 並行 ‖
PHASE1B-004 (Contact backend: Worker /api/contact + Turnstile + Resend)  ← Done（2026-06-27。実送信合格）
  ↓
PHASE1B-005 (Contact frontend: フォーム UI + Turnstile + mailto 撤去 + E2E) ← Done（2026-06-27。004 と合流。通知先 info@byte-lark.com）
  ↓
PHASE1B-006 (サンプル記事処置)  ← Done（2026-06-28。両サンプル + sample-cover.png 削除、空 content dir は .gitkeep で保持、E2E を空 Blog 向けに調整。CF ビルドは node_modules/.astro キャッシュ汚染で一度赤→Clear Cache で解消）
  ↓
PHASE1B-007 (記事ネタ出し・初期記事セット確定)  ← Done（2026-06-28。初期セット 6 本確定 / 記事 PBI 008〜013 + Gate 014 起票 / バックログを docs/article-backlog.md に集約）
  ↓
┌─ PHASE1B-008 (T1 サイト構築総括・tech)
├─ PHASE1B-009 (T2 自前フォーム実装・tech)
├─ PHASE1B-010 (T3 レガシー→モダン移行・tech)        ← 記事実装グループ（1 記事 1 PBI、並列可）
├─ PHASE1B-011 (T5 実案件で Claude 活用 PO 業務・tech)
├─ PHASE1B-012 (L1 法人化・life)
└─ PHASE1B-013 (L2+L3 合う仕事×ストレングス・life)

PHASE1B-015 (CodeQL 二重構成解消・CI 保守) ← Done（2026-07-15。案B: default setup 一本化、失敗 check-run 消滅。main 週次 cron の無効化のみ運営者作業として申し送り）

PHASE1B-016 (Claude Code devcontainer 環境整備) ← Phase 非依存の横断タスク、依存なし・任意タイミング。**Gate 014 の対象外**（docs/devcontainer-plan.md が実施手順書）
  ↓
PHASE1B-014 (Phase 1b Retrospective Gate)  ← 008〜013 + 015 全 Done 後、1c 移行前の必須ゲート（016 は対象外）
```

---

## Phase 1c：デザインブラッシュアップ（旧 1b）

二段構え（site-plan v3.10 §8 Decision #28）：**先行トラック**（記事非依存、下表）は 2026-07-12 起票済みで Phase 1b 記事執筆と並行着手可。**仕上げトラック**（B-3 CSS サイズ見直し / 全初期記事セットでのデザイン最終再検証 / Phase 1c Gate）は **Phase 1b Gate（PHASE1B-014）通過後**に別セッションで起票する（[draft-phase1c-design-polish.md](draft-phase1c-design-polish.md) の残項目を正式化）。

表は推奨着手順序に従って並べる：

| ID | タイトル | Status |
|---|---|---|
| PHASE1C-001 | [design-direction](20260712-PHASE1C-001-design-direction.md) | Done |
| PHASE1C-002 | [brand-colors-contrast](20260712-PHASE1C-002-brand-colors-contrast.md) | Done |
| PHASE1C-003 | [typography-scale](20260712-PHASE1C-003-typography-scale.md) | Done |
| PHASE1C-004 | [logo-redesign](20260712-PHASE1C-004-logo-redesign.md) | NotStarted |
| PHASE1C-005 | [favicon-touch-icons](20260712-PHASE1C-005-favicon-touch-icons.md) | NotStarted |
| PHASE1C-006 | [blogcard-heading-level](20260712-PHASE1C-006-blogcard-heading-level.md) | Done |
| PHASE1C-007 | [font-loading-cls](20260712-PHASE1C-007-font-loading-cls.md) | Done |
| PHASE1C-008 | [spring-sky-signature-style](20260725-PHASE1C-008-spring-sky-signature-style.md) | Done |

### Phase 1c 先行トラック 推奨着手順序

```
PHASE1C-001 (デザイン方向性確定) ← 最初。002/003/004 の入力
  ↓
┌─ PHASE1C-002 (確定 HEX + color-contrast 再有効化)
├─ PHASE1C-003 (タイポスケール確定)
└─ PHASE1C-004 (ロゴ刷新。001 の途中からでも並行可、反復 5 ラウンド上限)
  ↓
PHASE1C-005 (favicon 意匠 ← 002/004 依存)

PHASE1C-008 (署名要素の見た目適用 ← 001/002 依存、003 の後が推奨。朝日マーカー全般を担当)
PHASE1C-006 (BlogCard 見出しレベル) ← 依存なし、任意タイミング
PHASE1C-007 (フォント読み込み CLS)  ← 依存なし、任意タイミング
  ↓
（仕上げトラック：1b Gate 通過後に起票 — B-3 CSS サイズ / 全記事最終再検証 / 1c Gate）
```

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
| 2026-06-28 | **PHASE1B-007 完了（Done）＋ 記事実装 PBI 群・Phase 1b Gate 起票**：運営者 + Claude のネタ出しで初期記事セット 6 本を確定（tech 4: T1 サイト構築総括 / T2 自前フォーム実装 / T3 レガシー→モダン移行 / T5 実案件 Claude 活用 PO、life 2: L1 法人化 / L2+L3 合う仕事×ストレングスファインダー）。記事実装 PBI PHASE1B-008〜013（1 記事 1 PBI）+ Phase 1b Retrospective Gate PHASE1B-014 を NotStarted で起票。公開後バックログ（T4/T6/T7/L4/L5/L6）は死蔵防止のため `docs/article-backlog.md` に切り出し。R-01 月次ネタ出し routine は Phase 1d 公開後に点火（article-backlog 起点）と判断 |
| 2026-06-15 | **Phase 1b PBI 起票（7 件）**：`draft-phase1b-content-launch-prep.md` を正式化。PHASE1B-001（Skills/資格 現行化）/ 002（Career 現行化 + 代表案件）/ 003（About/Privacy 文面確定）/ 004（Contact backend）/ 005（Contact frontend）/ 006（サンプル記事処置）/ 007（記事ネタ出し・初期記事セット確定）。draft 項目4（Contact フォーム化 FR-29）を §7 基準でバックエンド 004 / フロント 005 に分割。各 PBI 技術メモに想定セッション数を明記（全件 1 セッション、004 は 2 セッション化時の再分割条件を付記）、受け入れ条件に §7 検証ゲート 3 項目を常設。PHASE1A-022 申し送り + Phase 1a 各実装ログ（devicon 403 判定 / HMR / Career id=2 一次情報なし / About=ですます調・Privacy=簡易案 / wrangler は assets のみ / Footer も平文 mailto）を反映。draft 項目7（記事実装 × n）と Phase 1b Gate は 007 完了時に追加起票（placeholder）。INDEX セッション開始チェック 3 種 green 確認済み |
| 2026-07-12 | **Phase 1c 先行トラック起票（site-plan v3.10 Decision #28 連動）**：1c を先行トラック（記事非依存）と仕上げトラック（1b Gate 後起票）に二分し、先行トラック PHASE1C-001（デザイン方向性）/ 002（確定 HEX + color-contrast 再有効化）/ 003（タイポスケール）/ 004（ロゴ刷新）/ 005（favicon）/ 006（BlogCard 見出しレベル B-1）/ 007（フォント CLS B-2）を NotStarted で起票。着手ルールに先行トラック例外を追記（README §9 例外 / v3.3 連動）。1b 記事 PBI（008〜013）とはセッション単位で切替並行。draft-phase1c-design-polish.md は仕上げトラックの anchor として更新 |
| 2026-07-13 | **PHASE1C-001 完了（Done）**：デザイン草案 3 案（快晴 / 春空 / 野の羽色）を HTML モック（`docs/design-drafts/phase1c-001/`）で提示し、運営者が**案2「春空」を選定**（修正指示なし）。確定記録 `docs/design-direction.md` を新設（パレット HEX/oklch + AA 検証値 / タイポ方向性 / 署名要素 / 002〜005 への引き継ぎ）、site-plan §6.5.2/6.5.3 を同コミットで整合。次は PHASE1C-002（確定 HEX + color-contrast 再有効化）/ 003 / 004 が着手可能 |
| 2026-07-13 | **PHASE1B-015 起票（CI 保守）**：CodeQL 二重構成（GitHub default setup 有効 + 自前 `codeql.yml` advanced 構成の併存で SARIF 拒否）により 2026-06-28 以降 `Analyze (javascript)` が全 push で failure と判明（PHASE1C-001 セッションで一次調査済み、エラー全文と履歴は PBI 技術メモ）。解消 PBI を Phase 1b 期中の横断タスクとして追加起票（PHASE1A-021 前例に倣う、依存なし・任意タイミング）。Gate（014）の完了確認対象を 001〜013 + 015 に連動更新 |
| 2026-07-17 | **PHASE1B-016 起票（Claude Code devcontainer 環境整備）+ 計画書新設**：macOS Bash sandbox 起因の詰まり（yarn ネットワーク系 / E2E Chromium / docker / 承認多発）と放置自走不可を、公式 devcontainer 雛形（default-deny firewall）ベースのコンテナ移行で解消する横断タスクを起票。検討セッション（2026-07-17）の決定事項——devcontainer 一本・母艦 sandbox 緩和はしない・持ち込みコピー/書き戻し禁止・fine-grained PAT・コンテナ/母艦の住み分け——と調査済み事実・実施ステップ 7 段を `docs/devcontainer-plan.md` に固定化（どのセッションでも同一手順で実施可能にするため）。Phase 非依存のため Gate 014 の完了確認対象外（Gate ファイルに明記） |
| 2026-07-19 | **PHASE1B-016 完了（Done）**：Claude Code の devcontainer 自走環境を導入。default-deny firewall 内で `--dangerously-skip-permissions` 放置自走が可能に（母艦 sandbox で不可だった yarn ネットワーク系 / ローカル E2E / docker も解消）。コンテナ発 push → CI green（fine-grained PAT 経路）、statusline 母艦同一化（COLORTERM / CCD_REPO_NAME）、CLAUDE.md・operation-manual §5 に運用を文書化。dotfiles へ型紙化（`~/dotfiles/claude/devcontainer/` + fish 関数 ccd / ccda / ccd-init）し、todo-next で 3 手導入（ccd-init → conf 調整 → ccd）の起動を実証。2026-06-28 の sandbox 調査メモを docs/notes/ へ移設 |
| 2026-07-18 | **PHASE1C-002 完了（Done）**：確定パレット「春空」を global.css トークンへ反映（AA 未達 2 箇所を sky-deep 文字化）、E2E の color-contrast 除外を解除。CI green + CF preview 実測 + Lighthouse A11y 全 8 ページ 100 / color-contrast pass（運営者ターミナル実行）で受け入れ条件全達成。検証中に npx lighthouse の不可視インストールプロンプトで 8 時間ハング → 根本原因を npm ログ + libnpmexec ソースで特定し、恒久対策として `scripts/lighthouse-audit.sh` を新設（npx 不使用・Phase 1d の本番 Performance/SEO 計測でも使用）。残：「春空」見た目適用 PBI の起票 |
| 2026-07-15 | **PHASE1B-015 完了（Done）**：運営者が案B（default setup へ一本化）を選定し、自前 `codeql.yml` を削除 + `ui-tests.yml` / `quality.yml` に `permissions: contents: read` を追加（medium alert 対応）。03efd32 で CI green + CodeQL 単一構成（`Analyze (javascript)` failure 消滅、default setup の javascript-typescript / actions とも success）を確認。追加判明：failure の発火経路は PR #28 の pull_request トリガー、main 週次 cron も同因で毎週 failure（無効化は運営者作業として申し送り、Phase 1d の main マージで根治）、default setup 有効化は 2025-02-19（経緯は運営者も心当たりなし）。1b 残は記事 PBI 008〜013 + Gate 014 |
| 2026-07-30 | **PHASE1C-007 完了（Done）**：フォント読み込みを Astro 公式 Fonts API へ移行し、和文 Noto Sans JP を `display: "optional"` に変更。調査で「CLS の大きさは訪問者の端末フォント次第で振れる」ことを実測（不利なフォールバックで 0.0901、近いフォールバックで 0.004。6 月の母艦 0.23 と整合）、optional 採用で最悪ケースが 0.0038 に。branch alias の `/about` は 5 回とも CLS 0.000 / Perf 100。Astro の最適化フォールバックは寸法表が欧文システムフォントのみで和文に効かない（むしろ欧文が約 2 倍で描かれる面ができる）ため和文側は無効化、provider は外部 CDN 依存を避けて local を採用。site-plan Decision #24 を更新（v 番号据え置き）。副産物：コンテナ内で Lighthouse / Playwright スクショまで完結でき、§7 検証に母艦を要しないことを確認 |
| 2026-07-31 | **PHASE1C-003 完了（Done）**：タイポスケールを確定・実装。見出し書体に Zen Kaku Gothic New（500 / 700）を導入し、欧文専用の Geist は廃止して本文を Noto Sans JP 一本に（和文と欧文で縦方向の寸法がずれる問題を混植の解消そのもので解決。選定モックも本文は Noto 単独）。サイズ / 行間は global.css の @theme に `--text-*` として定義（本文 16px / 行間 1.95、見出し 42 / 32 / 24 / 17 / 14px）、ウェイトは 500・700 の 2 段に統一。和文の折り返しは `text-wrap: balance` + `word-break: auto-phrase` の併用が最良と実測して採用。読み込み方は「見出し swap / 本文 optional」に分けた——optional では初回訪問でほぼ当たらない（サブセット 50 件前後が 100ms の猶予に間に合わない）ことを CDP で実測し、見出しだけ swap にしても差し替えのずれは 0.0016 以下（本文まで swap にすると /about で 0.0913）。site-plan §6.5.3 と design-direction §3 を確定内容に更新 |
| 2026-07-28 | **PHASE1C-006 完了（Done）**：BlogCard に `headingLevel` prop を追加し `/blog/` のカードタイトルを h2 化（Home は既定 h3 のまま）。最後まで残っていた Lighthouse `heading-order` 実測は、記事公開を待たず「コミットしない一時記事 + ローカル preview」方式でコンテナ内 Lighthouse 12.8.2 を実行して充足（`/blog/` `/` とも heading-order pass / Accessibility 100 / 失格 audit なし）。副産物として **コンテナ内で Lighthouse が回る**ことを確認（Playwright の chromium 実体を `CHROME_PATH` 指定、母艦の Chrome 起動不可制約は非適用）→ PHASE1C-007 の CLS 計測で流用可。記事公開後に branch alias で 1 回裏取りする申し送りを PBI に記載 |
| 2026-08-01 | **PHASE1C-008 完了（Done）**：design-direction §5 の署名要素（影カード・角丸 14px・チップ/ボタンのピル・朝日マーカー・Hero の `wash → bg` 縦グラデ・揚雲雀の軌跡）を全ページに適用。CF preview 検証の過程で、**Cloudflare が push を 1 回取りこぼしていた**ことが判明——b9c83b0 は GitHub Actions は走ったのに CF 側に build 行が無く、branch alias が ed39801 のビルドを配信し続けていた（CF 設定は正常、それ以前は毎 push ビルド済み）。新しいコミット（b2edc1c）の push で再点火し反映を確認。以後は check-runs の `Workers Builds: byte-lark` の有無でビルド実行を機械的に判別できる。予防策として CF の Deploy Hooks 未設定を申し送り。Skills アイコンの実表示は、コンテナから jsdelivr へ到達できずスクショでは壊れて写るため運営者が母艦のブラウザで確認（全て表示）——**外部 CDN 由来の画像はコンテナのスクショでは検証できない**という学び。申し送り：記事ページの裏取り（公開記事 0 件、PHASE1C-006 と同じ） |
| 2026-07-25 | **PHASE1C-008 起票（署名要素の見た目適用）**：design-direction §5 のトーン・形・署名要素（影カード・角丸 14px・チップ/ボタンのピル・朝日マーカー・Hero の wash→bg 縦グラデ・揚雲雀の軌跡）を実装する PBI を NotStarted で起票（PHASE1C-002 実装ログ 2026-07-17 運営者判断＝002 から分離の受け皿）。h2 朝日ドットマーカーが design-direction §3（003 タイポ）と §5（008）で重複していた件を **008 が朝日マーカー全般（h2 ドット + リストマーカー）を持つ**と確定し、003・008 両 PBI 本文と design-direction §3/§6 に境界を明記。着手順序図・Phase 1c 表を同期 |

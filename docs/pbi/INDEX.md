# PBI Index

最終更新: 2026-08-13（PHASE1E-003 / 004 起票）

## 次にやること

- 現在地：**Phase 1e（公開後の運用・改善）**。Phase 0 〜 1d は完了（2026-08-08 公開、1d Gate 通過 2026-08-10）
- 次の PBI：**[PHASE1E-003 記事 T9（devcontainer で Claude Code 自走）](20260813-PHASE1E-003-post-devcontainer-claude-code.md)**（2026-08-13 起票、運営者指名）。並行枠として [PHASE1E-004 トップの title / OG 画像](20260813-PHASE1E-004-home-title-og-image.md) も同日起票（外部レビュー指摘 T1+T2 採用分。003 の運営者リライト待ちの間に進める）。外部レビュー T3〜T7 と、PHASE1D-009 棚卸し持ち越し分（docs 肥大の分割 / セキュリティヘッダの残り / 旧インフラ撤収 / 運営者の実機確認まとめ）は引き続き運営者判断待ち。以後の主活動は記事の書き足しで、カテゴリ別一覧（FR-19）と記事末尾の前後記事リンクは**記事が 10 本に届いた時点**で Phase 1e に追加起票する（現在 3 本）
- ブランチ：main から短命ブランチを切り、**最初の push の直後に draft PR**（CI は PR がある状態でのみ走る。README §10.4、PHASE1E-002）。統合ブランチ `feat/phase-1` は 1d Gate で畳んだ（site-plan Decision #31）
- 直前 Gate の申し送り：[PHASE1D-009](20260808-PHASE1D-009-retrospective-gate.md) の `## 次 Phase への申し送り`

> 本ファイルは 400 行を超えており、`Read` は 1 回で全体を返しません（下の Phase 別の表や改訂履歴は切れた先にあります）。現在地と次の一手は必ず本節に置き、詳細は必要な節を `offset` 付きで読んでください。

---

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
- **例外（先行トラック）**：site-plan §8 Decision #28 で定義された Phase 1c 先行トラック（PHASE1C-001〜007）は、Phase 1b Gate（PHASE1B-014）未通過でも着手可。記事 PBI とは並行可、ただし別名 clone の別作業ツリーに限る（1 ツリー 1 セッション。README §9 並行運用 / push 競合は §10.7）

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
| PHASE1B-008 | [post-building-blog-with-claude-code](20260628-PHASE1B-008-post-building-blog-with-claude-code.md) | Done |
| PHASE1B-009 | [post-contact-form-on-workers](20260628-PHASE1B-009-post-contact-form-on-workers.md) | Done |
| PHASE1B-010 | [post-legacy-to-modern](20260628-PHASE1B-010-post-legacy-to-modern.md) | Dropped（Decision #29） |
| PHASE1B-011 | [post-claude-code-for-po-work](20260628-PHASE1B-011-post-claude-code-for-po-work.md) | Dropped（Decision #29） |
| PHASE1B-012 | [post-incorporating-bytelark](20260628-PHASE1B-012-post-incorporating-bytelark.md) | Done |
| PHASE1B-013 | [post-work-fit-strengthsfinder](20260628-PHASE1B-013-post-work-fit-strengthsfinder.md) | Dropped（Decision #29） |
| PHASE1B-015 | [codeql-dual-setup-fix](20260713-PHASE1B-015-codeql-dual-setup-fix.md) | Done |
| PHASE1B-016 | [claude-devcontainer-setup](20260717-PHASE1B-016-claude-devcontainer-setup.md) | Done |
| **PHASE1B-014** | [**retrospective-gate**](20260628-PHASE1B-014-retrospective-gate.md) **(Gate)** | **Done** |

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
┌─ PHASE1B-008 (T1 サイト構築総括・tech)  ← Done（2026-08-01 公開）
├─ PHASE1B-009 (T2 自前フォーム実装・tech)            ← 記事実装グループ（1 記事 1 PBI、並列可）Done（2026-08-05。公開は 08-03）
└─ PHASE1B-012 (L1 法人化・life)  ← Done（2026-08-05 公開）
（010 T3 / 011 T5 / 013 L2+L3 は Decision #29 で Dropped、ネタは article-backlog.md へ移管）

PHASE1B-015 (CodeQL 二重構成解消・CI 保守) ← Done（2026-07-15。案B: default setup 一本化、失敗 check-run 消滅。main 週次 cron の無効化のみ運営者作業として申し送り）

PHASE1B-016 (Claude Code devcontainer 環境整備) ← Phase 非依存の横断タスク、依存なし・任意タイミング。**Gate 014 の対象外**（docs/devcontainer-plan.md が実施手順書）
  ↓
PHASE1B-014 (Phase 1b Retrospective Gate)  ← Done（2026-08-05。Phase 1b 完了・申し送り棚卸し済み。次: 1c 仕上げトラック起票）
```

---

## Phase 1c：デザインブラッシュアップ（旧 1b）

二段構え（site-plan v3.10 §8 Decision #28）：**先行トラック**（記事非依存、PHASE1C-001〜007）は 2026-07-12 起票済み。PHASE1C-008（署名要素の見た目適用、2026-07-25）と PHASE1C-009（追従目次、2026-08-05）は期中の追加起票。**仕上げトラック**（B-3 CSS サイズ見直し / 全初期記事セットでのデザイン最終再検証 / Phase 1c Gate）は Phase 1b Gate（PHASE1B-014、2026-08-05 通過）の申し送りを反映して **2026-08-06 に PHASE1C-010〜012 として正式化済み**（[draft-phase1c-design-polish.md](draft-phase1c-design-polish.md) §C の正式化）。PHASE1C-013 は 011 の申し送りから 2026-08-07 に追加起票。PHASE1C-014 は運営者指摘（Skills ページのアイコン欠けとカテゴリ誤り）から 2026-08-07 に追加起票。

表は推奨着手順序に従って並べる：

| ID | タイトル | Status |
|---|---|---|
| PHASE1C-001 | [design-direction](20260712-PHASE1C-001-design-direction.md) | Done |
| PHASE1C-002 | [brand-colors-contrast](20260712-PHASE1C-002-brand-colors-contrast.md) | Done |
| PHASE1C-003 | [typography-scale](20260712-PHASE1C-003-typography-scale.md) | Done |
| PHASE1C-004 | [logo-redesign](20260712-PHASE1C-004-logo-redesign.md) | Done |
| PHASE1C-005 | [favicon-touch-icons](20260712-PHASE1C-005-favicon-touch-icons.md) | Done |
| PHASE1C-006 | [blogcard-heading-level](20260712-PHASE1C-006-blogcard-heading-level.md) | Done |
| PHASE1C-007 | [font-loading-cls](20260712-PHASE1C-007-font-loading-cls.md) | Done |
| PHASE1C-008 | [spring-sky-signature-style](20260725-PHASE1C-008-spring-sky-signature-style.md) | Done |
| PHASE1C-009 | [toc-sidebar-smooth-scroll](20260805-PHASE1C-009-toc-sidebar-smooth-scroll.md) | Done |
| PHASE1C-010 | [css-size-render-blocking](20260806-PHASE1C-010-css-size-render-blocking.md) | Done |
| PHASE1C-011 | [design-final-verification](20260806-PHASE1C-011-design-final-verification.md) | Done |
| PHASE1C-013 | [hero-signature-mobile-layout](20260807-PHASE1C-013-hero-signature-mobile-layout.md) | Done |
| PHASE1C-014 | [skills-icons-and-categories](20260807-PHASE1C-014-skills-icons-and-categories.md) | Done |
| **PHASE1C-012** | [**retrospective-gate**](20260806-PHASE1C-012-retrospective-gate.md) **(Gate)** | **Done** |

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
```

### Phase 1c 仕上げトラック 推奨着手順序（2026-08-06 起票）

```
PHASE1C-010 (B-3 CSS サイズ・描画ブロック見直し) ← 最初。CSS 変更が表示に影響し得るため再検証より前
  ↓
PHASE1C-011 (全記事デザイン最終再検証 ← 1b Gate 申し送りの裏取り 4 件を含む)
  ↓
PHASE1C-013 (Hero 署名要素のスマホ配置 ← 011 の申し送り。番号は後ろだが Gate より先)
  ↓
PHASE1C-014 (Skills アイコン欠け + カテゴリ修正 ← 運営者指摘。同じく Gate より先)
  ↓
PHASE1C-012 (Phase 1c Retrospective Gate ← Phase 1d 移行前の必須ゲート。CF Deploy Hooks 設定を含む)
```

---

## Phase 1d：公開（site-plan v3.9 で新設）

2026-08-08 起票（[draft-phase1d-domain-launch.md](draft-phase1d-domain-launch.md) の正式化 + PHASE1C-012 申し送りの引き受け + 法人化対応の追加。対応表はドラフト冒頭）。期中の追加起票：PHASE1D-011（公開時に判明した Dependabot アラート 61 件、2026-08-08）、PHASE1D-012（011 の設定修正で届いた更新 PR 5 本、2026-08-09）、PHASE1D-013〜016（運営者の公開後実機確認 PC + スマホで挙がった指摘 8 件、2026-08-09）：

| ID | タイトル | Status |
|---|---|---|
| PHASE1D-001 | [prelaunch-qa](20260808-PHASE1D-001-prelaunch-qa.md) | Done |
| PHASE1D-002 | [corporate-identity-update](20260808-PHASE1D-002-corporate-identity-update.md) | Done |
| PHASE1D-003 | [ns-migration](20260808-PHASE1D-003-ns-migration.md) | Done |
| PHASE1D-004 | [main-merge-custom-domain](20260808-PHASE1D-004-main-merge-custom-domain.md) | Done |
| PHASE1D-005 | [www-redirect](20260808-PHASE1D-005-www-redirect.md) | Done |
| PHASE1D-006 | [analytics-search-console](20260808-PHASE1D-006-analytics-search-console.md) | Done |
| PHASE1D-007 | [monitoring-ignition](20260808-PHASE1D-007-monitoring-ignition.md) | Done |
| PHASE1D-008 | [postlaunch-checks-routines](20260808-PHASE1D-008-postlaunch-checks-routines.md) | Done |
| PHASE1D-010 | [font-subsetting](20260808-PHASE1D-010-font-subsetting.md) | Done |
| PHASE1D-011 | [dependabot-triage](20260808-PHASE1D-011-dependabot-triage.md) | Done |
| PHASE1D-012 | [dependency-update-policy](20260809-PHASE1D-012-dependency-update-policy.md) | Done |
| PHASE1D-013 | [postlaunch-small-fixes](20260809-PHASE1D-013-postlaunch-small-fixes.md) | Done |
| PHASE1D-014 | [hero-message-hierarchy](20260809-PHASE1D-014-hero-message-hierarchy.md) | Done |
| PHASE1D-015 | [post-navigation-usability](20260809-PHASE1D-015-post-navigation-usability.md) | Done |
| PHASE1D-016 | [contact-confirm-step](20260809-PHASE1D-016-contact-confirm-step.md) | Done |
| **PHASE1D-009** | [**retrospective-gate**](20260808-PHASE1D-009-retrospective-gate.md) **(Gate)** | **Done** |

### Phase 1d 推奨着手順序

```
PHASE1D-001 (公開前 QA・未決事項確定) ← 最初
  ↓
┌─ PHASE1D-002 (法人表記更新 ← main マージ前に済ませる)
└─ PHASE1D-003 (NS 移管 ← 001 着手後なら 002 と並行可。メール無停止が最優先)
  ↓
PHASE1D-004 (main マージ + カスタムドメイン接続 + 本番 Lighthouse ← 001/002/003 Done が前提)
  ↓
┌─ PHASE1D-005 (www 畳み)
├─ PHASE1D-006 (Web Analytics + Search Console + OGP)
├─ PHASE1D-007 (監視点火) ← 004 後、相互に並行可
├─ PHASE1D-010 (フォントサブセット化 ← 004 の本番計測で Perf 未達 9 ページ、実施時期は運営者判断)
└─ PHASE1D-011 (Dependabot アラート仕分け ← 005 の push 時に判明した 61 件。006 と並行可)
     ↓
   PHASE1D-012 (依存更新 PR の処置と受け方の決定 ← 011 の設定修正で届いた #29〜#33。Gate より先)
  ↓
┌─ PHASE1D-013 (公開後実機確認で出た小さい不具合 4 件 ← 原因特定済み、方針判断が要らない分)
├─ PHASE1D-014 (Hero の見せ方 ← 案を出して運営者が選ぶ)
├─ PHASE1D-015 (記事の回遊性: 上へ戻る / 目次の履歴。前後リンクは 1e へ)   ← 相互に並行可、Gate より先
└─ PHASE1D-016 (お問い合わせフォームの確認画面)
  ↓
PHASE1D-008 (公開後実機確認 + R-01 routine 点火)
  ↓
PHASE1D-009 (Phase 1d Retrospective Gate)
```

013〜016 は 2026-08-09 の運営者による公開後実機確認（PC + スマホ）で挙がった指摘の受け皿。008 の着手前に運営者が先行して見たものなので、008 の対象からは外してよい。

---

## Phase 1e：公開後の運用・改善（site-plan v3.13 Decision #31 で再定義）

旧定義は「カテゴリ別一覧（旧 1c）」だったが、公開後の主活動が記事執筆で、次の機能（カテゴリ別一覧）が記事 10 本まで着手できないため、その間の改善に受け皿が無かった。Phase 1d Gate（PHASE1D-009、2026-08-10）で **公開後の運用・改善** に広げ、カテゴリ別一覧はこの Phase 内の 1 PBI に降ろした。

| ID | タイトル | Status |
|---|---|---|
| PHASE1E-001 | [postlaunch-housekeeping](20260810-PHASE1E-001-postlaunch-housekeeping.md) | Done |
| PHASE1E-002 | [ci-trigger-cleanup](20260812-PHASE1E-002-ci-trigger-cleanup.md) | Done |
| PHASE1E-003 | [post-devcontainer-claude-code](20260813-PHASE1E-003-post-devcontainer-claude-code.md) | NotStarted |
| PHASE1E-004 | [home-title-og-image](20260813-PHASE1E-004-home-title-og-image.md) | NotStarted |

### 起票済み・起票予定

- **PHASE1E-001（2026-08-10 起票）**：公開後の小さな手入れ 6 件。PHASE1D-009 の棚卸し表で「まとめて PBI 化」と判定した分（運営者決定 2026-08-10）
  1. `yarn fonts` を `docs/writing-workflow.md` に書く（記事追加のたびに必要。今は CI の `fonts:check` が落ちて初めて気づく）
  2. `BaseLayout.astro` に `<link rel="alternate" type="application/rss+xml">` を足す
  3. `scripts/lighthouse-audit.sh` の `BASE` 既定値を本番に変える
  4. `astro.config.mjs` の sitemap 除外フィルタから存在しない `/sample-highlight/` を外す
  5. `yarn check`（Biome）の対象に `worker/` `scripts/` `tests/` を足す
  6. `src/lib/jsonld.ts` のオリジンを `Astro.site` に追随させる
- **PHASE1E-002（2026-08-12 起票）**：CI トリガーの整理。`quality.yml` / `ui-tests.yml` が `push` と `pull_request` の両方で発火し、PR が開いている間は同じコミットに `quality` / `e2e` が 2 本ずつ付いていた（PR #39 の head `7bdd828` で実測）。`push` を main だけに絞り、短命ブランチの検査は `pull_request` に一本化する。代わりに最初の push の直後に draft PR を作る運用へ（README §10.4）。出所は PHASE1D-009 の棚卸しではなく 2026-08-12 の運営者指摘
- **PHASE1E-003（2026-08-13 起票）**：記事 T9「devcontainer で Claude Code を自走させる環境を作った」（tech）。開発環境 3 連作の 2 本目を先行執筆（運営者指名 2026-08-13）
- **PHASE1E-004（2026-08-13 起票）**：トップページの title / og:title と専用 OG 画像。出所は 2026-08-13 の外部レビュー（Opus によるサイト評価）指摘 T1+T2。同レビューの T3（ご依頼ページ新設）/ T4（Career 定量化）/ T5・T6（Skills・資格の見せ方）/ T7（ブログの営業記事化）は、サイトの目的（site-plan §2「職能リファレンス」）を「営業サイト」へ広げるかの判断と運営者インプットが必要なため未起票・判断待ち
- **カテゴリ別一覧 + 記事末尾の前後記事リンク（記事 10 本到達時に起票）**：`/blog/tech` `/blog/life` の実 URL 化（FR-19）と、前後リンク（PHASE1D-015 から移管、2026-08-09 運営者判断）。前後の並びは訪問者が見ている一覧と一致させる必要があり、カテゴリが実 URL になれば仕掛けなしで成立する。現在の公開記事は 3 本

---

## Phase 2：広告収益化

PBI は **Phase 1 完了 + 記事 30 本以上**の段階で起票する。

---

## 改訂履歴

| 日付 | 変更内容 |
|---|---|
| 2026-08-12 | **PHASE1E-002 完了（Done）＝ CI トリガーの整理**：CI が push と PR で 2 回走る件の判断。実測では quality 40〜50 秒 / e2e 103〜118 秒・queue 0 秒で並列のため待ち時間は 1 巡 2 分弱だが、同一コミットに check-run が 2 本ずつ付く。`pull_request` を残す判断の根拠は 2 つ——(1) `actions/checkout` の既定が merge ref なので main とマージした結果を検査する（必須チェックは strict 無効でブランチを最新に保つ要求が無いため、main が進んだ壊れを拾えるのはこちらだけ）(2) `dependabot/*` `archive/*` は push フィルタに入らずこの trigger が唯一の検査経路。よって `push` を `[main]` に絞る側を採り、PR #38（2026-08-10、push trigger を `fix/*` `chore/*` に拡張）を逆向きに畳む。#38 の目的だった「PR 作成まで §7 検証が詰まる」は、最初の push の直後に draft PR を作ることで解消する（CI と CF preview が同時に始まる。draft のあいだは GitHub がマージを止めるので、必須レビュー 0 件でも緑になった瞬間の誤マージを防げる）。README を v3.10（§10.4〜§10.6）、CLAUDE.md §7 も連動更新。実地検証：push だけでは Actions の run が 0 件（付くのは CF の `Workers Builds` のみ）、draft PR（#41）で `quality` / `e2e` が起動し `3d8250f` の check-run 7 本はすべて名前が一意 = 重複解消。学び：`pull_request` の run は**その PR の merge commit にある workflow ファイル**で走るため、トリガー自体を書き換える PR では変更後の設定が自分自身に適用される（`pull_request` を残していなければこの PR に CI が 1 本も付かなかった）。push 発火が消えたことは「何も起きない」ことの確認なので、緑を待つ検証と手順が違う |
| 2026-08-11 | **PHASE1E-001 完了（Done）＝ Phase 1e 1 本目**：公開後の小さな手入れ 6 件を消化。項目 3（`lighthouse-audit.sh` の `BASE` 既定値を本番へ）は 2026-08-10 に PR #38 で先行実施済みで、残り 5 件を `fix/postlaunch-housekeeping` で実装——① `docs/writing-workflow.md` を 7 段→8 段にし「フォントを作り直す（`draft: false` の直前）」を新設 ② `BaseLayout.astro` に RSS の `<link rel="alternate">`（全ページ、`title` は `og:site_name` と同一）③ Biome の検査対象を `src` → `src worker scripts tests`（出た指摘は 2 件だけで除外せず両方修正）④ sitemap の除外 `filter` を削除（対象の `/sample-highlight/` は PHASE1A-020 で削除済み）⑤ `jsonld.ts` のオリジンを呼び出し側の `Astro.site` から渡す形に。回帰確認は HTML 12 枚に RSS の 1 行が増えるだけで非 HTML は差分ゼロ、CI（806fab6）は Quality / UI Tests / Workers Builds すべて success。学び：**`astro:config/client` は Vitest では中身が空になる**（モジュール解決は通るが実体が `undefined`）ため、設定値をライブラリ側で読む案は不採用にした。`yarn preview` は Astro 7 でデーモン起動し `--port` が埋まっていると黙って別ポートを選ぶ（ログで実ポートを読む）。あわせて同日、`README.md` §10.8 の Deploy Hooks 記述を実態（「main manual rebuild」1 本のみ、`feat/phase-1` 向けは削除済み、URL の保管先は Bitwarden）に修正（PR #39） |
| 2026-08-10 | **PHASE1D-009 完了（Done）＝ Phase 1d Gate 通過**：非 Gate PBI 15 件（001〜008 / 010〜016）全 Done 確認 + `yarn build` / `check` / `check:ts` / `test:run` 全成功 + CI green（feat/phase-1 HEAD 96c52da・main 9555d6d とも全 check-run success）+ 本番 11 ページ 200・HSTS あり・noindex なし。Phase 1d 全実装ログと PHASE1C-012 の持ち越し 16 件を棚卸しし（前 Gate 分は 14 件消化 / 持ち越し 1 / 下表送り 1、Phase 1d 発の 21 項目は PBI 化 6 / 持ち越し 7 / 破棄 6 / 1e 移管 1 / 判断待ち 1）、「次 Phase への申し送り」を Gate PBI に記入。**運営者決定 3 件を site-plan Decision #31 として確定**：① 統合ブランチ `feat/phase-1` を畳み main 起点の「1 作業 1 ブランチ → PR」に戻す（未完成サイトを main に載せない遅延マージ = Decision #25 の理由が公開で消えたため。1D-008 で本番が 4 コミット遅れて実機確認を誤りかけたのが実害）② Phase 1e を「カテゴリ別一覧」から「**公開後の運用・改善**」に再定義し、公開直後の小さな手入れ 6 件（PHASE1E-001）から着手。カテゴリ別一覧（FR-19）と前後記事リンクは記事 10 本到達時に同 Phase へ追加起票 ③ **ダークモードはやらないと確定**し申し送り 3 件を破棄（1D-001 で実表示を見て見送りを決めていたが「やらない」と確定しておらず、Gate ごとに同じ判定を繰り返していた。再着手時の出発点は Gate PBI に記録）。計画書との差分 6 件を修正（README §10.1/§10.6 の「1a〜1c を集約」「main マージは一度だけ」が実態＝ 1a〜1d 集約・1d 中 4 回マージとずれ / operation-manual の main マージ手順が保護前の `git merge --no-ff` のまま / site-plan §6.7 自己参照 v3.8 / §7 現在地図 / §12 次アクション）。README を v3.9（§10 全面改訂）、site-plan を v3.13 に改訂し CLAUDE.md・operation-manual も連動。学び：README §10.8 は「CF は `feat/phase-*` だけ preview を作る」と書いていたが、実測では `chore/article-ideas-2026-08`（PR #34）でも preview ビルドが走っており、ブランチ運用を変える判断の前提だったので check-run で確かめてから決めた。**Done 後に運営者指摘で引き継ぎの導線を作り直し**：当初は「次セッションで PHASE1E-001 を起票」としていたが、INDEX.md（436 行 / 80KB）も site-plan.md（630 行 / 86KB）も `Read` の 1 回分（約 274 行）を超えており、申し送りを書いた場所（INDEX の Phase 1e 節 340 行 / 改訂履歴 367 行 / site-plan §12 は 530 行）がすべて切れた先にあった。さらに INDEX に置いた PHASE1E-001 の行には実ファイルが無く、開始時チェックの grep（`docs/pbi/*PHASE*.md`）の検出対象にもならない。→ ① PHASE1E-001 を実ファイルとして起票 ② INDEX 冒頭に「次にやること」節を新設（現在地 / 次の PBI / ブランチ運用 / 直前 Gate へのリンク）。INDEX の肥大化そのものは持ち越し（根治は改訂履歴の切り出しか Phase 別分割）。次セッションは **PHASE1E-001 の着手**から |
| 2026-08-10 | **PHASE1E-001 起票（公開後の小さな手入れ）**：PHASE1D-009 の棚卸しで「まとめて PBI 化」と判定した 6 件（`yarn fonts` を writing-workflow.md に記載 / BaseLayout に RSS の `<link rel="alternate">` / lighthouse-audit.sh の `BASE` 既定値を本番へ / `yarn check` の対象に worker・scripts・tests / sitemap 除外から削除済みの `/sample-highlight/` を除去 / jsonld.ts のオリジンを `Astro.site` 追随に）。出所は PHASE1D-001 の「範囲外の項目」5 件 + PHASE1D-010 の実装ログ 1 件。優先順は記事追加のたびに効く `yarn fonts` が 1 番、訪問者に見える RSS が 2 番。ブランチは main 起点（Decision #31 ①）。`yarn check` の範囲拡大で既存指摘が大量に出た場合は別 PBI へ切り出し可と技術メモに明記 |
| 2026-08-10 | **PHASE1D-010 完了（Done）**：PR #36 で main へマージし（9555d6d）、本番 Lighthouse Performance は **11 ページすべて 91〜100**（100 が 2 / 99 が 7 / 98 が 1 / 91 が 1、FCP は全ページ 1.5〜1.7 秒、TBT 0ms、CLS 0〜0.005）。起票の根拠だった「11 ページ中 9 ページが 59〜82」は解消。最低の 91 は最長記事で、LCP 3363ms の中身はフォントでなく本文中の画像。マージ前に CodeQL が 2 件で落ちたので直した（69897cc）——`scripts/subset-fonts.mjs` の HTML 走査部分で、`</script >` のように空白や属性が付いた閉じタグを取りこぼす正規表現と、実体参照を段階的に置き換えることで戻した結果を次の段が拾って二重に解ける（`&amp;lt;` が `<` になる）順序。実体参照は 1 回の走査でまとめて戻す形にし、`yarn fonts` で収録字・生成物とも差分 0 を確認 |
| 2026-08-10 | **PHASE1D-010 実装**：フォントを「サイトに出てくる字だけ」の 1 ファミリ 1 ファイルに作り直した（c704316）。フォント転送は 333〜1064KB / 18〜68 ファイル → 298〜338KB / 2〜3 ファイル、HTML も @font-face のインライン約 283KB が消えて 289〜346KB → 12〜70KB。Lighthouse Performance は本番（変更前）56〜99・90 未満 4 ページ → CF preview 89〜100・95 以上 10 ページ、FCP は全ページ 1.8〜9.5s → 0.8〜1.1s、CLS は前後とも 0〜0.006 で不変。道具は `subset-font`（harfbuzz の wasm、fonttools は pypi 到達不可で不採用）、元フォントは google/fonts のコミット固定 + sha256 照合で取得しキャッシュへ置くので通常のビルドと CI はネットワーク非依存。収録字は本文＝ `src/` 走査（組み上がり HTML の全字を含むことを実測）、見出し＝ dist の h1〜h4（1085 字 → 360 字）。記事追加時は `yarn fonts`、回し忘れは CI の `yarn fonts:check` で止まる。レイアウト閉包は切った（元フォントとの差はサブピクセルの 0.2%、切ると 129KB 減）。副産物：塊分割で効かなくなっていた和文の約物の詰めが復活／fontsource 2 パッケージ削除で node_modules 33MB 減／改変版の再配布にあたるため `/credits` に書体の出典と OFL 全文を追加（ページ名・Footer を「アイコン・書体の出典」に変更）。想定外：本番の `_astro/*` が `max-age=0, must-revalidate` で配られており、そのせいで **本文フォント（optional）は実際には使われていない**（preview でも本番でも同じ。変更前から同じ）／`/blog/` だけ 89 で残るが原因はフォントでなく一覧 1 枚目の画像の `loading="lazy"`。**この申し送り 3 件は同日に本 PBI 内で対応、コミットは分けた**：`public/_headers` で `_astro/*` を 1 年 `immutable` に（Cloudflare Workers の静的アセット配信は `_headers` を読む。73c8bef）／`/blog/` 1 枚目のカード画像を `priority` に（`loading="eager"` + `fetchpriority="high"`。8f5c391）／本文フォントの preload は CF preview で計り比べて**採らない**と判断（19786aa を f06af0a で revert）——11 ページ中 10 ページで LCP が 1.5〜2.7 秒悪化（`/` は 940ms → 3201ms・Performance 100 → 92）、258KB を最優先で取りにいくぶん本来の LCP 要素が後ろに押される。本文フォントは `immutable` により 2 ページ目からキャッシュで当たる（回線制限あり・なしとも画素差 19896px で確認）ので、1 ページ目に当てにいかないのが `font-display: optional` の趣旨どおり。結果 CF preview は **11 ページ中 10 ページが 100・記事 1 本が 99**（FCP 858〜1382ms / LCP 858〜1825ms / CLS 0〜0.005）。学び：ローカルの静的サーバーで計る Lighthouse は FCP が 3 秒台まで落ちて CF preview（0.9〜1.4 秒）と乖離するため、差の小さい判断は CF preview で計らないと結論が逆になりうる |
| 2026-08-10 | **PHASE1D-008 完了（Done）＝公開後の実機確認 + R-01 点火**：R-01 月次記事ネタ出しを claude.ai のルーチン（`trig_01UP6sJ44uiN5tqn9eEv5Gru`、毎月 1 日 9:07 JST、Opus 5）として点火。点火方法は 4 案を比較して「月次ルーチンが `docs/article-backlog.md` に追記する PR を出す」を運営者が採用——判断の軸は「ネタが出ること」より「運営者が気づいて動くところまで届くか」で、GitHub の通知メールという既存の導線に乗るのが決め手（不採用：提案のみ＝見に行かないと気づけない / Xserver cron のリマインドメール＝仕組みは確実だが手間が毎回かかる、PR 不成立時の受け皿として温存 / カレンダー＝実行が運営者頼み）。その場で 1 回実行し push → PR #34 まで通ることを実測、出た 3 案（T13 依存警告の仕分け / T14 速度の点数と実利用者の食い違い / L7 法人化後の名前変更の波及）を main へマージ。運用手順を operation-manual §8 に新設（旧 §8→§9、§9→§10）。**確認の前段で本番が 4 コミット遅れていると判明**：PHASE1D-013〜016 が main 未反映のままで、特に 014 は h1 の高さをスマホで 46 → 74px に変えており Hero の鳥とボタンの位置関係がその上に乗る → PR #35 で `feat/phase-1` を main へマージし本番を最新化してから実機確認。iPhone 実機 4 点（ホーム画面アイコン / Hero スマホ構図 / Skills アイコン 34 件 /「視差効果を減らす」ON で目次ジャンプが即時）とも問題 0 件、1D-015 / 016 も同じ 1 回で確認。PHASE1B-015 申し送りの medium alert は PAT に Code scanning alerts の読み取りを足して API で確認し、全 6 件 fixed / open 0 件。学び：claude.ai のルーチンはアカウントに紐づき永続する（`CronCreate` はセッション内・7 日で失効するので月次運用に使えない）／ルーチンの PR はドラフトで届くので `gh pr ready` が要る／作成時に頼んでいない MCP 接続が既定で付くため `clear_mcp_connections` で外す／「本番で確認」を案内する前に本番が最新かを確かめる／記事 URL は末尾スラッシュへ 307 で飛ぶため `curl -L` が要り、付け忘れて未反映と一度誤認した |
| 2026-08-10 | **PHASE1D-016 完了（Done）**：お問い合わせを入力 → 確認 → 送信の 2 画面にした（6d28b26 / e960e90）。値は React の state が持つので戻ったときの保持は追加の仕組み不要。Turnstile は入力・確認で同じ DOM ノードに描き続ける方式を採用——公式 docs でトークンの寿命は 300 秒・`refresh-expired` の既定は `auto` なので、描き直さないほうが確認画面で止まっている間も自動更新が効く。自動更新の待ち時間に当たってトークンが無いまま送信を押した場合は、黙って失敗させず `reset()` して案内を出す（文面は未認証／期限切れで出し分け）。期中に既存の欠陥も 1 件直した：Worker はメール送信より前に siteverify を済ませるため、502 のあと同じトークンで押し直すと 403（使用済み）で落ちる → 送信失敗時もウィジェットを reset する。画面切り替えはフォーム単体でなく見出しを含む節ごと頭出し（`contact.astro` に `scroll-mt-20`）。E2E 6 → 9 本（確認経由の正常系／戻って直して送る／確認画面で失効して取り直す／確認画面の axe）、計 39 件 green。想定外：Biome の複雑度上限 15 に当たり `useTurnstile` フック / `TextField` / `ConfirmPanel` に分割／コンテナから `challenges.cloudflare.com` へ到達できずスクショは同寸法のスタブ枠で代替（PHASE1C-008 と同じ制約）。**Done 後に運営者指摘 3 件で作り直し（b3c68ae / 13182ea）**：戻りボタンは「入力へ戻る」→「修正する」（訪問者に示していない画面名を前提にしていた。定番は「戻る」か「修正する」で、最初に推した「書き直す」は実フォームでまず見ない文言だった）／画面切り替えのスクロールを一息に（実測でスマホ 927px = 画面の高さ 844px より長い距離を滑らせていた。scroll イベント 16〜20 回 → 1 回、行き先は不変。送信完了の先頭戻りも同様に揃えた）／確認画面の見出しを「以下の内容で送信します」にし、直し方を説明する一文は削除 |
| 2026-08-10 | **PHASE1D-015 完了（Done）**：記事内の移動 2 件を実装（c1e37ba）。目次のリンクをクリックで横取りし、自分でスクロールして `history.replaceState` でハッシュだけ差し替え——4 回クリックして `history.length` 増分 0、戻る 1 回で `/blog/` へ戻れることを実測（従来は 1 クリックごとに履歴 1 件）。移動先の見出しへ `focus({ preventScroll: true })` でキーボード・読み上げの現在地も運ぶ。xl 未満に「先頭へ戻る」ボタン（44px 円・右下）を追加し、戻り先は目次の位置（無ければページ先頭）、表示判定は IntersectionObserver 2 本で「戻り先が画面上へ抜けたら出す / フッターと重なる位置まで来たら引っ込める」。共有 URL 直開き・視差効果を減らす設定（即時ジャンプ）・追従目次の現在地ハイライト維持も実測。E2E 3 本追加で計 36 件 green。想定外：CI の UI Tests が 11 分かかったがテスト実行自体は 19.8 秒（コンテナ準備・スクショ取得側の遅さ）／`ci-status.sh` は無認証 API のため 30 秒間隔のポーリング 2 本で 403 に落ちる（待ち合わせは `gh` を使う） |
| 2026-08-09 | **PHASE1D-015 スコープ変更（前後記事リンクを Phase 1e へ移管）**：着手時の運営者判断。前後リンクは訪問者が見ている一覧の並びと一致していないと使いづらいだけになるが、今の絞り込みは `CategoryFilter.tsx` の `useState` のみで URL にも保存領域にも残らず、追従させるには一覧の絞り込みを URL に持たせ・カードのリンクに印を付け・記事側で 3 通りの前後を出し分ける仕掛けが要る。Phase 1e（FR-19）で `/blog/tech` `/blog/life` が実 URL になれば同じことが仕掛けなしで成立し、公開記事 3 本（tech 2 / life 1）では出るリンクもほとんどない → 今回は作らず 1e 起票時に含める。015 は「上へ戻る」「目次の履歴」の 2 件に縮小 |
| 2026-08-09 | **PHASE1D-014 完了（Done）**：Hero の情報の順番を整理（830da45）。3 巡の案出し（並べ方 3 案 → キャッチの強さ 4 段階 → 名前主役 2 案、比較は実画面スクショ埋め込みの 1 ページに集約）を経て、当初方針の「キャッチを最大に」は不採用——案A（キャッチ 42px 太字）を一度 push した後、汎用的な約束の文を最大サイズで張ると空虚に見えると運営者確認で差し戻し。名前主役のまま声量だけ落とす E1 に確定（名前 42 → 32px 太字 + 英字名、キャッチ 20px を直下に。h1 高さ desktop 55 → 87px / mobile 46 → 74px）。期中追加で説明文の「す。」だけが 2 行目に落ちる折り返しを修正（実測 1 行 673px に対し `max-w-2xl` = 672px と 1px 不足 → `max-w-3xl` + 狭幅の保険に文節折り `word-break: auto-phrase`）。学び：案出しは効く軸を先に見立てて振る／コピーの強度と表示サイズは釣り合わせる／大きさ・強さに関わる変更は選定後も本実装 preview の運営者確認を挟んでから Done に進める |
| 2026-08-09 | **PHASE1D-013 完了（Done）**：公開後実機確認で挙がった小さい不具合 4 件を修正（6b66252）。About の見出し「屋号の由来」→「名前の由来」（会社概要の商号表記との食い違い解消。法人化記事の「屋号」は過去の事実として据え置き）／`BlogCard.astro` の `<article>` に `h-full` を足して `/blog/` 1 行目のカード高さを 339・366px → 366・366px に揃えた（トップは格子の直接の子なので前後で変化なし）／送信ボタンを 78×32 → 106×45px にして Hero（132×45px）と高さを一致／送信完了時に完了パネルへ焦点を移してページ先頭へ戻す（スマホ scrollY 497 → 0）。想定外なし・既存 E2E 33 件は無改修で全通過。学び：Hero のボタンは起票時記載の「約 40px」でなく実測 45px（タイポスケールで `text-sm` の行間が既定より大きい）→ 高さを px 固定せず Hero と同じ余白指定で追従させ、shadcn Button の透明 1px 枠ぶんを縦余白から相殺／素の `focus()` は直後の `scrollTo` と引っぱり合ってスマホで 91px 残る（`preventScroll: true` で解消）／CF は反映直後に同じ URL で古い版を返すことがあり、1 回の確認で断定できない |
| 2026-08-09 | **PHASE1D-007 完了（Done）＝監視の点火**：`scripts/health-check.sh` を新規実装（HTTP 200 / 改ざんカナリア 2 種 / 配信ヘッダ / TLS 残日数の 4 点、2 回連続の異常で通知・復旧通知あり、`--inspect` と `--test-notify` の確認モード付き）。Xserver に設置して 10 分間隔の cron を登録し、本番 apex で 4 項目とも通過（TLS 残 89 日）。メール到達は一時 cron（branch alias 対象）で実測し、1 回目無発報・2 回目着信としきい値の効きまで確認。**本番ヘッダの実測でセキュリティヘッダが 1 つも無いと判明**（計画書に要件の記載なし＝未検討項目）→ 運営者判断で HSTS のみ即時有効化（`max-age=15552000` / includeSubDomains なし / preload なし）し、監視の必須ヘッダにも追加。**GitHub の Secret scanning / Push protection が両方 disabled だったため ON にした**（設定画面にトグルが出ず、`gh api` の `security_and_analysis` で実状を確認 → PATCH で有効化。「public なら常時有効」という私の推測は誤りだった）。通知は**メール単線**で確定し Slack も UptimeRobot も不採用——スクリプトの消失・破損は cron のエラーメールで露見して静かには止まらず、静かに止まるのは cron 項目を人が消した場合だけ、という整理（冗長性なしを承知の選択、運営者指摘で「Slack は配送の二重化であって検知の二重化ではない」と訂正した経緯を PBI に記録）。人為以外の唯一の経路としてサーバー移行時の cron 確認を incident-response.md §7 に追加。operation-manual.md §6 を新設（旧 §6→§7、§7→§8） |
| 2026-08-09 | **PHASE1D-012 起票（依存更新 PR の処置と受け方の決定）**：PHASE1D-011 で `.github/dependabot.yml` の不正キーを取り除いた結果、通常のバージョン更新が初めて機能し PR 5 本（#29 minor+patch 17 件まとめ / #30 @astrojs/react 6 / #31 @astrojs/mdx 7 / #32 jsdom 30 / #33 astro 7.1.6）が一度に届いた。011 の申し送り 2 件（Astro 6→7 メジャー更新 / 更新 PR の受け方）の受け皿として起票。#33 は 011 で「到達不能」として dismiss した astro 3 件の根本解消にあたる。あわせて旧スタック時代の Cloudflare 自動設定 PR #27（2026-05-08 起票、`vite.config.ts` 対象で現構成に非適用）をクローズ |
| 2026-08-09 | **PHASE1D-011 完了（Done）**：Dependabot アラート 61 件を全件仕分けし **open 0 件**（fixed 194 / dismissed 4）に到達。57 件は範囲内の更新で解消（`yarn up -R` で hono 4.13.1 / ip-address 10.4.0 / qs 6.15.3 / tar 7.5.22 / undici 7.29.0・6.28.0 / js-yaml 4.3.1 ほか、直接依存は @astrojs/rss 4.0.19 / shadcn 4.16.2）、範囲外の 3 件は `resolutions` で解消（sharp 0.35.3 / esbuild 0.28.1 / yaml-language-server の yaml 2.9.0）。critical（node-tar の DoS）は macOS 専用 `fsevents` → `node-gyp` 経由で runtime 非露出だったが範囲内に修正版があり更新で消した。残り 4 件は `not_used` で理由付き dismiss（astro 3 件は View Transitions 未使用・spread 属性 0 件で到達不能、@hono/node-server は Windows 限定かつ修正版が親の範囲外）。**根本原因を特定**：GitHub の走査対象は既定ブランチのみで、main には 2026-08-08 まで旧スタックの lockfile が乗っていたため Astro 構成の依存が一度も走査されていなかった + 手元の CI にも audit 工程が無かった → `quality.yml` に `yarn npm audit --severity high --environment production` を追加（運営者決定）。`.github/dependabot.yml` の不正キー 3 つ（`security-updates-only` / `auto-merge` / `require-tests`）を削除し `groups` を追加、旧スタック時代の Dependabot PR 9 本をクローズ。想定外：**shadcn は開発用 CLI でなく `@import "shadcn/tailwind.css"` 経由で本番 CSS にも入っていた**（4.16.2 の shimmer / scroll-fade の土台で未使用 CSS が 899B 増 → 寄与 0B を実測し運営者判断で import を削除）／PAT の権限が 3 回不足（Dependabot alerts / Workflows / Pull requests）／設定修正の直後に Dependabot がバージョン更新 PR 5 本（#29〜#33）を作成し `groups` が 17 件を 1 本にまとめることを実地確認。出力は更新前と全ファイルバイト単位で一致（`diff -rq` で 0 差分）、main マージ（7f31b94）後の本番 11 ページ 200 / CI 全 green。申し送り：Astro 6→7 メジャー更新（PR #33 が受け皿）／PR #29〜#33 の受け方の方針／README §10.9 の main 保護が実際には未設定（`protected: false`）で記述とずれている |
| 2026-08-08 | **PHASE1D-011 起票（Dependabot アラート仕分け）**：PHASE1D-005 の push 時に判明した Dependabot アラート 61 件（critical 1 / high 16）の全件仕分け・解消を独立 PBI 化。PHASE1D-007 が持つのは通知の有効化確認で、既存アラートの処置は本 PBI が担当（相互参照を PBI 本文に明記）。SSG + Workers 構成での露出区分（runtime / build / dev）を付けて記録し、依存更新は devcontainer または運営者ターミナルで実施（母艦 sandbox はレジストリ DNS 不可）。006 と並行可 |
| 2026-08-08 | **PHASE1D-006 完了（Done）**：アクセス解析と検索登録を開通。CF Web Analytics はアカウント直下（`?to=/:account/web-analytics`）に `byte-lark.com` を登録して数字が出る状態に（Visits 44 / PV 52、beacon 識別子は登録前後で同一＝コード変更・再デプロイ不要。ドメイン内の Analytics → Web analytics は Observatory の RUM 欄で別物）。Search Console はドメイン プロパティを DNS 認証で登録：Google が出す Cloudflare 自動連携は使わず（メール系レコードを抱える DNS に外部の書き込み権限を常設しないため）手動 TXT を追加、公開 DNS 2 系統で反映と SPF 無傷を実測。サイトマップは URL 全体で送信し「成功しました」。OGP はタグ・画像を実測（既定画像 1200×630、記事は個別カバー webp 200）、X の公式 validator は廃止済みのため実施不可・Facebook デバッガーは運営者判断でスキップ → **受け取り側の描画確認は 009 Gate へ申し送り**。実ユーザー計測は LCP P75 620ms・CWV 3 指標 Good で、004 の Lighthouse 判定（Perf 59〜82）と食い違い → PHASE1D-010 の実施判断材料に追加 |
| 2026-08-08 | **PHASE1D-005 完了（Done）**：www.byte-lark.com を apex へ 301 一本化。CF の www CNAME（→ Netlify）を撤去し AAAA `100::` Proxied + Redirect Rule（テンプレート「Redirect from WWW to root」+ Preserve query string、301）。curl 実測 5 通り合格（http は Always Use HTTPS との 2 段 301、クエリ保持確認）。旧 Netlify サイトは運営者決定により削除（byte-lark.netlify.app が 404 化を確認、アカウント自体も削除予定）。あわせて運営者が feat/phase-1 を main へマージ（2fee28f、check-runs 全 success）し、プライバシーポリシー改定が本番反映＝ 004 の申し送り解消。push 時に判明した Dependabot アラート 61 件（critical 1 / high 16、main に lockfile が乗って初走査）は要仕分け・未対応 |
| 2026-08-08 | **PHASE1D-004 完了（Done）＝サイト公開 + PHASE1D-010 起票**：記事 3 本の publishedAt を 2026-08-08 へ更新し、feat/phase-1 を main へマージ（01239b9。sandbox で merge 不可のため `git commit-tree` による 2 親マージ + `push <sha>:main`）、main CI 全 green・本番 Worker デプロイ成功。運営者作業で main 向け Deploy Hook「main manual rebuild」作成、旧 apex A 削除のうえ byte-lark.com を Workers カスタムドメインとして接続（正規ホストは www なしの apex に運営者が確定、www 畳みは 005）。https://byte-lark.com で全 10 ページ表示・noindex なし・HTTPS 有効を確認し**サイト公開**。本番 Lighthouse は SEO 全 11 ページ 100 / CLS ≈0（実記事の測り直し込み）、Performance は 2/11 のみ 90+（59〜82、ページあたりフォント 0.35〜1.1MB が原因。実測 FCP 0.3〜2.6s をシミュレーションが 5〜7s に外挿）→ 受け入れ条件の判定に従い **PHASE1D-010（font-subsetting）を起票**（実施時期は運営者判断）。想定外：NS 移管直後のルーターの旧委任キャッシュで旧サイトが見え続けた（テザリングで回避、最大 48h で自然解消）。申し送り：並行セッションのプライバシーポリシー改定（224a4a4）が main 未反映 → 次回 main マージで反映 |
| 2026-08-08 | **PHASE1D-003 完了（Done）**：byte-lark.com の DNS 管理を Xserver から Cloudflare へ NS 移管（Free / Worker と同一アカウント、全 12 レコード DNS only）。切替前に MX を `sv16806.xserver.jp` 直指しへ変更・SPF から `+a:byte-lark.com` 削除・`_dmarc`（p=none）新設、DKIM 2 本は 1 文字単位照合。DNSSEC 無効を確認して切替、伝播は約 10 分で完了。メール 3 経路（tanimoto@ / info@ 送受信、Contact フォーム→Resend→info@）の生存確認済み。切り戻しは Xserver ネームサーバー設定を戻すだけ（Xserver 側ゾーンは温存） |
| 2026-08-08 | **Phase 1d PBI 起票（PHASE1D-001〜009、NotStarted）**：draft-phase1d-domain-launch.md を正式化（対応表はドラフト冒頭に記載）し、PHASE1C-012 の持ち越し項目を各 PBI に配置。起票前に運営者決定 3 件を確定：① ダークモードは 001 で実表示（`.dark` 強制付与）を見て採用可否判断 ② 法人化対応は登記完了済み（合同会社バイトラーク、法人番号指定 2026-06-05）のため 002 として Phase 1d に含める ③ インボイス登録番号はサイト掲載なし（エージェント経由取引で掲載メリットなし、直案件開始時に再検討）。NS 移管の要否は CF 公式 docs で再確認（Workers カスタムドメインは自アカウントの Active ゾーン前提・Free プランはフルセットアップ一択のため必須。DNS 管理のみ移り、メールサーバーは Xserver のまま） |
| 2026-08-08 | **PHASE1C-012 完了（Done）＝ Phase 1c Gate 通過**：非 Gate PBI 13 件（001〜011 / 013 / 014）全 Done 確認 + build / check / check:ts / test:run 全成功 + CI green。Phase 1c 全実装ログと PHASE1B-014 の持ち越し 11 件を棚卸しし（持ち越し 16 / 本 Gate 消化 2 / 破棄 12）、「Phase 1d への申し送り」を Gate PBI に記入（確定した技術前提 / 想定外と回避策 / 計画書との差分 / 1d 起票時の注意 / 先に決めるべき事項）。運営者作業の CF Deploy Hooks を設定（`feat/phase-1` 向け 1 本、`curl -X POST` でビルド増加を実地確認）。計画書との差分 5 件を修正（site-plan §13 現在地マーカーを移行期へ / §12 自己参照 v3.11→v3.12 / site-plan・CLAUDE.md の README 参照 v3.3→v3.6 / INDEX 先行トラック範囲の事実誤り）。README を v3.7 に改訂（§5.4 に「外形が変わるコミットを打ったセッションは Done 化まで終える」）。副産物：Stop hook が出力契約を破って散文を返し内部機構の話が運営者向け応答に混入したため、settings.json で出力を JSON のみに制限し CLAUDE.md に非言及ルールを追加。想定外：Gate 実施中に同一ツリーの別セッションが PHASE1C-014 を起票・着手（README §9 の 1 ツリー 1 セッション違反）→ 014 を先に閉じてから完了確認をやり直した。次セッションは Phase 1d PBI 起票（draft-phase1d-domain-launch.md の正式化）から |
| 2026-08-07 | **PHASE1C-014 完了（Done）**：Skills ページのアイコンなし 11 項目を解消し、全 34 項目にアイコンを付けた。Oracle を Databases へ、GAS を Languages へ移動。アイコンは外部 CDN 直リンクから `public/icons/` の自前ホストへ移行（外部参照 0 件、ライセンスは `public/icons/LICENSE.txt`）。実測でアイコンの表示サイズが 28×28 / 28×32 / 28×23 と不揃いなことが判明——`<img width height>` は Tailwind preflight の `height: auto` に負けるため、縦横比の違う SVG（struts 256×290 等）を足した時点で崩れる → `size-7 shrink-0 object-contain` を追加して全件 28×28 に統一。運営者判断で 2 件差し替え（Gemini はワードマーク→四芒星、linux は 194KB→11KB。`public/icons/` 全体 356KB→180KB）。3abc697、CI 全 green・CF preview 実測とも一致。学び 4 件：照合範囲を狭く取ったまま「無い」と断定していた（devicon だけ見て Iconify を見ていなかった）／dev server の再起動でポートが 4322 に退避していたのに 4321 を見続けた／CF の `/skills` は 307 リダイレクトで `curl -L` が要る／デプロイ直後の 404 は伝播の遅れ |
| 2026-08-07 | **PHASE1C-014 起票（Skills アイコン欠け + カテゴリ修正）**：運営者指摘（アイコンなし 11 項目 / Oracle が OS・Middleware / GAS が Tools）を受けて追加起票、InProgress で着手。調査で、PHASE1B-001 当時の「devicon に無いものはアイコンなしで統一」という判断が照合範囲の狭さによるものと判明——Iconify（logos / tabler / simple-icons）まで広げると 11 項目すべてに該当アイコンがある。あわせてアイコンを外部 CDN 直リンクから `public/icons/` の自前ホストへ移す（PHASE1C-008 でコンテナから jsdelivr に到達できず §7 スクショ検証が運営者目視頼りになった件の解消）。配信は `<img src="/icons/*.svg">` を採用、astro-icon は Astro 6 対応不明 + Yarn 4 で未解決 issue のため不採用、`import.meta.glob` インライン化は SVG 計 356KB が HTML に乗るため不採用。番号は 014 だが Gate（012）より先に着手 |
| 2026-08-07 | **PHASE1C-013 完了（Done）**：Hero 署名要素のスマホ配置を修正。スマホは viewBox 320×130 の横長構図を新設してお問い合わせボタンの 20px 下へ置き、軌跡を 34.3 度で左下へ降ろす（PC は 25.0 度）。負の下マージンを % 指定（−45%）にして装飾の高さ（幅比例）に追従させ、Career の位置は全幅で ±11px 以内に維持。320px の鳥とボタンの重なり 16×16 → 0、軌跡の実効不透明度 0.165 → 0.44、軌跡の終点を尾の先へ付け替え。PC は付け根修正のみで位置・大きさ・不透明度とも変化なし。`index.astro` の main に `relative` を追加し、はみ出した装飾がカードの裏に回るようにした（2e1810b、CI・CF preview とも green）。学び 2 件：モックの px 実測値をそのまま持ち込むと可変幅で破綻する／「線がカードの裏に隠れている」は見た目の思い込みで、実際は対策なしだと線が上に描かれていた |
| 2026-08-07 | **PHASE1C-013 起票**：PHASE1C-011 の申し送り（Hero 署名要素のスマホ不具合 3 件）を正式化。モック `docs/design-drafts/phase1c-013/` で 7 方式を実ページ相当・スクロール可能な形で比較し、運営者が「案1+Career引き上げ」を採用（2026-08-07）。スマホは横長の別構図で鳥をボタンの 20px 下へ、軌跡は 34 度で左下へ降ろし Career カードの裏に隠す。Career の位置と Hero 高さは現状維持（427px）。PC は現状維持。不採用：背景レイヤー化（スマホでカードに覆われて見えない）／42 度案（PC の 24.6 度から 18 度ずれる）／縮小案（320px で 14×24px 重なりが残る）。番号は 013 だが Gate（012）より先に着手 |
| 2026-08-06 | **PHASE1C-011 完了（Done）**：全 3 記事 × PC/スマホの実表示確認で崩れ 0 件。1b Gate 申し送り 4 件を全消化——雇用形態バッジは 3 種とも AA 通過（6.34 / 6.28 / 4.80、PHASE1C-002 で確定トークン反映済みだった）、署名要素は実記事上で意図どおり、heading-order は全 11 ページ pass、`text-wrap` は全ページ・3 幅の折り返しを実測比較して現状維持を運営者が判断（balance 有利 6 件 / 不利 6 件で互角、外すと語中割れが出る）。副産物：Lighthouse 監査スクリプトの `PATHS` が静的 8 ページ固定で記事が対象外だったため記事 3 本を追加 → Cloudflare 記事で color-contrast fail が出現し、Shiki テーマを `github-light`（variable 色 #e36209 が 3.49:1）から `github-light-default`（同 #953800 が 7.39:1、文字色 45 指定すべて AA）へ変更。再計測で 11 ページとも accessibility 100 / color-contrast pass（56f1fe1、CI・CF preview とも green）。申し送り：Hero 署名要素に 3 点の指摘（スマホでボタンと衝突 / 軌跡の実効不透明度 0.165 / 軌跡の終点が尾でなく胴の下）→ 別 PBI で対応 |
| 2026-08-06 | **PHASE1C-010 完了（Done）**：全ページ共通 CSS の未使用分削減。起票時記載の「生 131KB」は再計測で 37.6KB と判明（PHASE1C-003/007 のフォント方式変更で既に縮小済み）。tw-animate-css 削除（使用 0 件）+ Tailwind 走査を `source("../")` で src/ 限定（docs/ の英単語誤認 8 クラスを排除・出力の決定性向上）で生 37,586 → 32,955 B（−12.3%）/ brotli 6,218 → 5,698 B（−8.4%）。全 HTML 使用クラスと CSS 定義の機械照合 + 11 ページ × 2 幅スクショで副作用なし、CI・CF preview とも green（7020252）。`.dark` トークンは PHASE1C-002 確定値のため残置。申し送り：各ページ `<head>` の Astro Fonts インライン @font-face 約 283KB は確定方式のためスコープ外（Phase 1d 本番計測で問題時に調査） |
| 2026-08-06 | **Phase 1c 仕上げトラック起票（3 件）**：PHASE1B-014（1b Gate、2026-08-05 通過）の申し送りを反映し、draft-phase1c-design-polish.md §C を正式化。PHASE1C-010（B-3 CSS サイズ・描画ブロック見直し。到達目標は運営者確定「未使用分の削減まで」、critical CSS 見送り）/ 011（全 3 記事デザイン最終再検証。申し送り素材 4 件＝text-wrap 全記事・別エンジン実機確認 / heading-order branch alias 裏取り / 署名要素裏取り / 雇用形態バッジ色確認を受け入れ条件化）/ 012（1c Gate。棚卸し表 + CF Deploy Hooks 設定（運営者確定「設定する」）+ README 改訂要否判断を含む）を NotStarted で起票。全 PBI に §7 検証ゲート常設。着手順序は 010 → 011 → 012 |
| 2026-08-05 | **PHASE1B-014 完了（Done）＝ Phase 1b Gate 通過**：対象 12 PBI 全 Done 確認 + yarn build/check/check:ts/test:run 全成功 + HEAD ad18b46 CI 全 success。Phase 1b 全実装ログ + PHASE1A-022 申し送り + draft-phase1c を全件棚卸しし「Phase 1c への申し送り」を Gate PBI に記入（前 Gate 申し送りは全件消化済み、未消化は Phase 1d 待ち 5 件と仕上げトラック待ち 4 件に整理）。site-plan との差分は §13.1 現在地注記の古さのみ（記録対応）。次セッションは Phase 1c 仕上げトラック起票（B-3 / 全 3 記事最終再検証 / 1c Gate）から |
| 2026-08-05 | **PHASE1B-009 完了（Done）**：T2 フォーム記事の公開作業（2026-08-03 draft:false 化 494828d、2026-08-05 カバー v2 差し替え 9cbc4c5）が別セッションで完了していたが実装ログ・ステータス未更新だったのを引き取り、§7 検証（ローカル + CF preview の desktop/mobile スクショ、OGP/JSON-LD 実 HTML、CI green head bf835d8）を実施して Done 化。学び：公開 commit と PBI Done 化は同一セッションで完結させる |
| 2026-08-05 | **PHASE1B-012 完了（Done）**：L1 法人化記事を `draft: false` で公開（feat/phase-1 preview）。カバーは life 記事の差別化方針で設計図調を離れ「書類＋ロゴのヒバリ入り社印」フラットレイ（Flash・差分指示方式で反復）。§7 検証全通過（14d1464 / 6a999f9、CI green・CF preview 確認・OGP/JSON-LD 実 HTML 確認）。publishedAt は暫定 2026-08-03、Phase 1d で見直し。副産物：tools/imagegen/out を記事 slug 別サブディレクトリに整理しスキルへ恒久反映 |
| 2026-08-05 | **PHASE1C-009 完了（Done）**：記事目次を xl 以上で右カラム sticky 化（現在地ハイライト・末尾は最後の節を点灯）＋サイト全体に `scroll-behavior: smooth`（reduced-motion ガード付き）。d09d1f3 / ce15d72、CI・CF preview とも green。学び：IO だけの現在地判定は末尾の節が点灯しない edge case → rAF passive scroll 化、tools/imagegen 起点 sandbox はポート bind 不可で build/dev 不可（build は運営者スクリプト冒頭で実施） |
| 2026-08-05 | **PHASE1C-009 起票（追従目次＋スムーススクロール）**：記事目次が冒頭静的配置でスクロールすると使えなくなる問題（運営者指摘）への UI 改善 PBI。xl 以上で右カラム sticky 目次＋現在地ハイライト（IntersectionObserver）、`scroll-behavior: smooth`（reduced-motion ガード付き）。仕上げトラック起票を待たない単発追加（運営者指示）、InProgress で着手 |
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
| 2026-08-02 | **初期記事セット縮小（site-plan v3.11 Decision #29）**：公開前は T1（008 公開済み）+ T2（009）+ L1 法人化（012）の 3 本に縮小し、PHASE1B-010 / 011 / 013 を Dropped（README v3.6 新設状態）。ネタ T3 / T5 / L2+L3 は article-backlog.md へ移管し公開後に R-01 routine で消化。Phase 1b 表・着手順序図・Gate 前提を同期、先行トラック例外注記を並行運用（README v3.5）に更新 |

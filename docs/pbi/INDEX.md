# PBI Index

最終更新: 2026-08-15（SNS カード実機確認の完了を反映）

## 次にやること

- 現在地：**Phase 1e（公開後の運用・改善）**。Phase 0 〜 1d は完了（2026-08-08 公開、1d Gate 通過 2026-08-10）
- 次の PBI：**[PHASE1E-003 記事 T9（devcontainer で Claude Code 自走）](20260813-PHASE1E-003-post-devcontainer-claude-code.md)**（2026-08-13 起票、運営者指名）。並行枠として [PHASE1E-004 トップの title / OG 画像](20260813-PHASE1E-004-home-title-og-image.md) も同日起票（外部レビュー指摘 T1+T2 採用分。003 の運営者リライト待ちの間に進める）。外部レビュー T3〜T7 は不採用で確定（2026-08-13 運営者決定：サイトの目的を「営業サイト」へ広げない）。PHASE1D-009 棚卸し持ち越し分は、docs 肥大の分割を [PHASE1E-005](20260813-PHASE1E-005-docs-slimming.md) として起票・実施済み、Netlify アカウントは削除済み（2026-08-13 運営者報告）。判断待ちだった 3 件は 2026-08-15 に決着：セキュリティヘッダの残りは [PHASE1E-006](20260815-PHASE1E-006-security-headers.md) として起票・実施済み（CSP は見送り確定）、Xserver 側 DNS ゾーンは切り戻し保険として残すで確定、Turnstile 実送信は運営者がメール到達を確認済み。SNS カードの実物確認も 2026-08-15 に完了（運営者が metatags.io でトップ + 記事ページを確認。X / Facebook / LinkedIn / Pinterest / Slack のプレビューで画像・タイトル・説明文とも正常描画、記事の webp カバーも表示された。1D-006 からの持ち越しは解消）。実機確認の残なし。以後の主活動は記事の書き足しで、カテゴリ別一覧（FR-19）と記事末尾の前後記事リンクは**記事が 10 本に届いた時点**で Phase 1e に追加起票する（現在 3 本）
- ブランチ：main から短命ブランチを切り、**最初の push の直後に draft PR**（CI は PR がある状態でのみ走る。README §10.4、PHASE1E-002）。統合ブランチ `feat/phase-1` は 1d Gate で畳んだ（site-plan Decision #31）
- 直前 Gate の申し送り：[PHASE1D-009](20260808-PHASE1D-009-retrospective-gate.md) の `## 次 Phase への申し送り`

> 改訂履歴は [INDEX-history.md](INDEX-history.md) に分割済み（PHASE1E-005）。本ファイルは `Read` 1 回で全体が読める。現在地と次の一手は必ず本節に置く。

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
| PHASE1E-004 | [home-title-og-image](20260813-PHASE1E-004-home-title-og-image.md) | Done |
| PHASE1E-005 | [docs-slimming](20260813-PHASE1E-005-docs-slimming.md) | Done |
| PHASE1E-006 | [security-headers](20260815-PHASE1E-006-security-headers.md) | Done |

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
- **PHASE1E-004（2026-08-13 起票）**：トップページの title / og:title と専用 OG 画像。出所は 2026-08-13 の外部レビュー（Opus によるサイト評価）指摘 T1+T2。同レビューの T3（ご依頼ページ新設）/ T4（Career 定量化）/ T5・T6（Skills・資格の見せ方）/ T7（ブログの営業記事化）は、サイトの目的（site-plan §2「職能リファレンス」）を「営業サイト」へ広げるかの判断と運営者インプットが必要なため未起票・判断待ちとしていた → **2026-08-13 運営者決定で不採用**（目的は職能リファレンスのまま広げない）
- **PHASE1E-005（2026-08-13 起票）**：計画書・INDEX の分割。INDEX.md（88.6KB、うち改訂履歴 61.7KB）と site-plan.md（86KB）が Read 1 回分を超えている件の根治。改訂履歴を `INDEX-history.md` / `docs/site-plan-history.md` へ、Decision Log を `docs/site-plan-decisions.md` へ切り出す。出所は PHASE1D-009 棚卸しの持ち越し項目（運営者決定 2026-08-13）
- **カテゴリ別一覧 + 記事末尾の前後記事リンク（記事 10 本到達時に起票）**：`/blog/tech` `/blog/life` の実 URL 化（FR-19）と、前後リンク（PHASE1D-015 から移管、2026-08-09 運営者判断）。前後の並びは訪問者が見ている一覧と一致させる必要があり、カテゴリが実 URL になれば仕掛けなしで成立する。現在の公開記事は 3 本

---

## Phase 2：広告収益化

PBI は **Phase 1 完了 + 記事 30 本以上**の段階で起票する。

---

## 改訂履歴

[INDEX-history.md](INDEX-history.md) に分割した（PHASE1E-005）。改訂履歴行は分割先の表の**先頭**に追記する。他ファイルの改訂履歴との同期ルールは site-plan §14 の運用ルールに従う。

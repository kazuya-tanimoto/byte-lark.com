# 訪問者は「devcontainer で Claude Code を自走させる環境を作った話」（tech）を読める

Status: InProgress
Started: 2026-08-13

## 誰が
- 訪問者

## 何をできる
- Claude Code をコンテナ内で全権限自走させる環境（PHASE1B-016）の設計・構築・運用でぶつかった問題と解き方を、一次体験として読める

## なんのために
- 記事バックログ T9（開発環境 3 連作の 2 本目）。T1 記事（サイト構築総括）で軽く触れた devcontainer の話の本編。公開記事を 3 → 4 本に増やす（Phase 1e の主活動。カテゴリ別一覧 FR-19 は 10 本到達がトリガー）
- 関連: docs/article-backlog.md T9 / docs/devcontainer-plan.md / PHASE1B-016 / docs/writing-workflow.md

## 受け入れ条件
- [ ] 運営者 + Claude でヒアリング（writing-workflow §3）→ Claude が Markdown ドラフト生成（`draft: true`）
- [ ] **前後編 2 本構成**（2026-08-13 運営者決定）：前編 = 設計編（slug: claude-code-devcontainer、隔離の理由と安全原則）/ 後編 = 調整編（slug: claude-code-devcontainer-tuning、ハマりどころ 3 件）。以下の条件は両記事に適用
- [ ] frontmatter 完備：title（`| byte-lark.com` サフィックス無し）/ description（80-120字・OGP 兼用）/ category: tech / tags / publishedAt（公開当日の日付に更新してからマージ）/ slug。本文冒頭に `# タイトル` を重複させない
- [ ] バックログ T9 のハマりどころ 3 件を後編の柱に含める：① コンテナ内 Claude だけ URL がリンクにならない（`TERM_PROGRAM` 不在 → `--remote-env FORCE_HYPERLINK=1`）② スクショをコンテナに渡せない（CleanShot 保存先を read-only bind mount。素材: `docs/article-interviews/20260809-cleanshot-container-mount.md`）③ 母艦とコンテナの見分けがつかない（statusline に CONTAINER バッジ。「直したのに反映されない」= postCreate コピーと named volume の話、`ccdsh` 追加まで）
- [ ] 運営者がリライトし `draft: false` に変更（最終承認を実装ログに記録）
- [ ] `draft: false` の直前に `yarn fonts` でフォントを作り直す（writing-workflow 8 段構成、PHASE1E-001）
- [ ] OGP / Article JSON-LD が記事ページで正しく出力される（`buildArticleJsonLd()`、headline 汚染なし）
- [ ] `yarn build` 成功 / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1（ヒアリング → ドラフト → 運営者リライト。リライト待ちは実装フェーズ外）
- カテゴリ: tech / 想定 slug: claude-code-devcontainer
- 一次情報: `docs/devcontainer-plan.md`（設計・手順）、PHASE1B-016 実装ログ、`.devcontainer/` 実物、`docs/article-interviews/20260809-cleanshot-container-mount.md`（gitignore 対象・経緯素材）
- 連作の位置づけ: T8（ghostty + herdr 乗り換え）→ **T9（本 PBI）** → T10（herdr サイドバー連携）。順序が前後するので、T8 側で持つ予定だった詳細（T12 の入力ソース問題）への言及は本記事では深追いしない
- cover 画像は cover-image skill（tools/imagegen）で生成可
- ヒアリング内容は `docs/article-interviews/` に集約（セッション跨ぎ対策、gitignore 対象）

## 備考
- 記事バックログ T9 の正式化（docs/article-backlog.md）。起票と同時に PHASE1E-004（トップ title / OG 画像）も起票しており、本記事の運営者リライト待ちの間に 004 を進める想定（1 ツリー 1 セッションのため同時進行は逐次）

## 実装ログ

### 2026-08-13

やったこと
- 着手（InProgress）。一次情報 3 本（devcontainer-plan.md / PHASE1B-016 実装ログ / CleanShot マウント経緯メモ）を読了
- ヒアリング 1 巡目完了（質問と回答は `docs/article-interviews/claude-code-devcontainer.md`）。読者像 (a) 放置自走したい Claude Code ユーザー / 経緯を前半に / コード・スクショあり / 安全原則は深掘り / トーンは既存 tech 記事準拠 / タグ確定
- **前後編 2 本に分割**（運営者承認）：安全原則の深掘り + ハマりどころ 3 件を 3,000 字 1 本に入れると両方薄くなるため。前編 = 設計編 / 後編 = 調整編。herdr は端末非依存の書き方で通し、T10 予告リンクに留める。反論想定 2 件（公式 sandboxing との関係 / firewall は IP ベース）は前編に入れる
- 前編ドラフト作成（`src/content/posts/claude-code-devcontainer.md`、`draft: true`、本文約 3,300 字）。後編は雛形 + frontmatter のみ（本文は前編確定後）。`yarn build` 通過（12 ページ、draft は出力対象外）
- 後編ドラフト作成（`src/content/posts/claude-code-devcontainer-tuning.md`、`draft: true`、本文約 3,000 字）。運営者指示により前編確定を待たず執筆。ハマりどころ 3 件を「隔離の副作用（母艦なら届いていたものが届かない）」の軸で通した。statusline バッジ判定と CleanShot マウントはコンテナ内の実物コードを確認して引用。CONTAINER バッジのスクショは TODO コメントで場所だけ確保（コンテナ内からは撮影不可 → 母艦セッションか運営者）。`yarn build` 通過
- 並行作業の運用確認（運営者と合意）：PHASE1E-004 は別クローンの別セッションで並行する。同一クローン 2 セッションは checkout がクローン単位のため不成立。INDEX.md は pull→即コミットで衝突回避

残タスク
- 前編・後編の運営者レビュー / リライト
- 後編の CONTAINER バッジのスクショ差し込み（TODO コメント箇所）
- cover 画像 2 枚（cover-image skill）
- 公開時：publishedAt を公開日に更新、前後編の相互リンク実効確認、`yarn fonts`、§7 検証

### 2026-08-15

やったこと
- 運営者指摘「文体が AI っぽい（『コンテナに閉じ込めて』等）」を受け、前後編とも全文リライト。指摘を 4 パターン（ドラマチックな比喩・擬人化 / 決め台詞・アフォリズム / 断言短文・倒置 / コンサル調フレーミング）に整理し、既存記事の 1〜2 文ごとの行末 2 スペース改行にも揃えた。くだけた挿入は「本文に既にある実感の言い換えに限る」で運営者合意
- 記事 2 本をフォルダ形式（`<slug>/index.md`）へ移動（`git mv`）
- ルール恒久化は別ブランチ `chore/writing-rules` で実施し PR #51 マージ済み：profile.md「避ける表現」に上記 4 パターン + 実感の捏造禁止 + 改行スタイル、workflow §5 の profile.md 必読化 + article-review 7 軸の初回ドラフト適用、記事は常にフォルダ形式（new-post.ts をフォルダ生成に変更）、CLAUDE.md に明示
- main をこのブランチにマージ（INDEX.md 競合は main 側を採用し 1E-003 InProgress のみ維持）

残タスク
- 前後編ともリライト内容は**運営者レビュー待ち（未承認）**。前編のコミットはブランチ切り替えの都合で入れたもので、内容承認済みではない
- 以降は 2026-08-13 分の残タスクと同じ（スクショ差し込み / cover / 公開時作業）

学び・想定外
- ドラフト生成が profile.md を参照する仕組みはあったが「基本トーン」等が未記入で効いていなかった。文体指摘はルール化して profile.md に蓄積するのが再発防止になる（今回実施）

### 2026-08-18

やったこと
- 前編 cover 作成・配置：候補 3 枚から運営者が 01（桜色アクセント・コンテナ断面）を選定。2000×1050 に縮小して配置、frontmatter に `cover: ./cover.png` 追加、publishedAt を公開日 2026-08-18 に更新
- カバーデザインの暫定方針を cover-image skill（.claude/skills/cover-image/SKILL.md）に追記：一覧で「全部同じ画像」に見える問題への対応。固定 = 設計図調 + 雲雀署名、可変 = 主役モチーフ + アクセント色ローテーション。記事用プロンプト `tools/imagegen/prompt_claude-code-devcontainer.txt` 新調
- 前後編一括公開の想定を前編単独公開に変更（運営者指示）：前編の後編リンク 2 箇所（冒頭「後編に分けて〜」/ 末尾「後編にまとめました〜」）からリンクを外し文言調整

- article-review 全軸実施（指摘6件）。運営者承認により要修正1（description 129→119字）+ 推奨2（bind mount「見える→書き込める」/「フル権限」→「全権限」）を反映、軽微3（倒置文・CDN括弧・LLM呼称）は見送り
- `draft: false` → `yarn fonts` 再生成（13 page(s) built、新規グリフ追加）→ `yarn check:ts` 0 errors
- §7 検証：ローカル（preview + Playwright、desktop 1280 / mobile 375、一覧・記事とも正常。桜色カバーが既存の橙2本と一覧で明確に区別できることを確認）/ CF preview（branch alias、同2幅で正常。og:image cover webp / Article JSON-LD headline を実 HTML で確認）/ CI（head e8de6ff で UI Tests・Quality Checks・Workers Builds・CodeQL すべて success）
- 前編を公開（PR #43 マージ）。**PBI は後編が残るため InProgress 継続**

残タスク
- **後編公開時：前編の 2 箇所に `/blog/claude-code-devcontainer-tuning` へのリンクを戻す**（冒頭の導入段落と本文末尾）
- 後編：CONTAINER バッジのスクショ差し込み（TODO コメント箇所）→ リライト運営者レビュー → cover 生成（暫定方針：アクセント色は桜色・橙以外から）→ article-review → 公開

### 2026-08-20〜23

やったこと
- 後編の運営者レビューを複数往復で反映：説明の具体化（リンク判定の挙動・貼り付けの仕組み・CDN 記述の事実化）、用語の統一（バッジ・シェル・手元の Mac）、自作コマンド（ccd / ccdsh / ccds）の初出定義、ビルド章に当時の実エラー文を母艦ログから転記、まとめの自構成限定の話を削除、未公開記事（herdr）の予告を削除
- article-review 全軸実施（指摘 12 件）。運営者承認により #1-3, #5-10, #12 を反映、#11 は見送り、#4（publishedAt / cover）は公開時に対応
- コンテナから確認できない 6 項目（CleanShot の CDN・ccd の仕様・TERM_PROGRAM の有無 等）を母艦セッション向け依頼文にまとめて運営者に依頼 → 全件一致（TERM_PROGRAM 不在は `devcontainer exec ... env | grep TERM_PROGRAM` → exit=1 で実測）。ビルド章を結果に合わせて精密化（head 6ce657f、CI green）
- 今回の指摘を次の記事に持ち越さないためのルール化（PR #62、`chore/writing-feedback-rules`）：profile.md「避ける表現」に 10 項目追加、article-review skill に観点追加（観察と仕様の区別・初出定義・抽象段落・まとめの自構成限定・未公開予告・未検証項目へのローカル向け依頼文）と subagent 実行の節、writing-workflow をレビュー 2 回制（ドラフト → /article-review 1 回目 → 運営者レビュー → /article-review 2 回目）に変更

学び
- 運営者レビューの前に skill でレビューを 1 回通せば、誤字・表記揺れ・事実の不一致は運営者に届く前に潰せる。運営者の確認は内容判断に絞れる
- 記事内の「〜でした」という挙動の記述は、観察なのか仕様なのかをレビューで区別する。観察だけを根拠に仕様を断定していた箇所が指摘された
- コンテナから確認できない事実は、前提知識ゼロで打てるコマンド + 報告形式を添えた依頼文にすると 1 往復で済む

残タスク
- **後編公開時：前編の 2 箇所に `/blog/claude-code-devcontainer-tuning` へのリンクを戻す**（冒頭の導入段落と本文末尾）
- 後編：cover 生成（アクセント色は桜色・橙以外）→ publishedAt 更新 + `draft: false` + `yarn fonts` → §7 検証（ローカル / CF preview スクショは母艦）→ `gh pr ready` → merge

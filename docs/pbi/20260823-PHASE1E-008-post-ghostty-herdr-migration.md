# 訪問者は「alacritty + tmux から ghostty + herdr へ乗り換えた話」（tech）を読める

Status: InProgress
Started: 2026-08-23

## 誰が
- 訪問者

## 何をできる
- ターミナル環境を alacritty + tmux から ghostty + herdr へ移した動機・何が変わったか・ぶつかった問題を、一次体験として読める

## なんのために
- 記事バックログ T8（開発環境 3 連作の 1 本目）。T9（devcontainer 前後編、PHASE1E-003）を先に公開したため、3 本目 T10（herdr サイドバー連携）に進む前に空いている 1 本目を埋める。公開記事を 5 → 6 本に増やす（Phase 1e の主活動。カテゴリ別一覧 FR-19 は 10 本到達がトリガー）
- 関連: docs/article-backlog.md T8 / docs/writing-workflow.md / site-plan Phase 1e

## 受け入れ条件
- [ ] 運営者 + Claude でヒアリング（writing-workflow §3〜5）→ 回答と深掘りを `docs/article-interviews/ghostty-herdr-migration.md`（gitignore 対象）に残す → Claude が Markdown ドラフト生成（`draft: true`、`src/content/posts/ghostty-herdr-migration/index.md`）
- [ ] 本文に次の 3 点を含める：① 乗り換えの動機（alacritty + tmux で何に困っていたか）② herdr の spaces / agents で作業の何がどう変わったか（場面つき。形容詞だけの評価にしない）③ ハマりどころとして T12（日本語入力が直接入力のまま戻らない件）に触れる。詳細は T12 記事側が持つので、本記事では症状と「原因は herdr の設定だった」までに留める
- [ ] 連作の位置づけを本文で示す：T9 前編 `/blog/claude-code-devcontainer` への内部リンクを張る。T10（未公開）の予告は書かない（profile.md「避ける表現」の未公開予告禁止）
- [ ] frontmatter 完備：title（`| byte-lark.com` サフィックス無し）/ description（80-120 字・OGP 兼用）/ category: tech / tags / publishedAt（公開当日の日付に更新してからマージ）/ slug。本文冒頭に `# タイトル` を重複させない
- [ ] レビュー 1 回目：Claude が subagent で `/article-review` を実行し、指摘を自分で反映して総評「公開可能」にしてから運営者に渡す（writing-workflow §7）
- [ ] 運営者がレビュー・リライト（writing-workflow §8）
- [ ] レビュー 2 回目：`/article-review` を実行し、運営者が承認した指摘だけを反映（writing-workflow §9）。承認内容を実装ログに記録
- [ ] cover 画像を cover-image skill で生成・配置（`cover: ./cover.png`、2000×1050）。生成前に暫定デザイン方針（設計図調 + 雲雀署名、アクセント色ローテーション）を継続するか運営者に確認（skill の毎回手順）。アクセント色は使用済み（橙・桜色・紫）以外から選び、400px で既存 5 本と並べて区別できることを確認。候補の選定は運営者（実装ログに記録）
- [ ] `draft: false` の直前に `yarn fonts` でフォントを作り直し、生成物も一緒にコミット（writing-workflow §10）
- [ ] OGP / Article JSON-LD が記事ページで正しく出力される（`buildArticleJsonLd()`、headline 汚染なし）
- [ ] `yarn build` 成功 / `yarn check` / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `bash ~/.claude/bin/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）
- [ ] `draft: false` のコミットを打つセッションで Done 化（Status + INDEX 同期 + マージ）まで終える（README §5.4 外形が変わるコミットの例外）
- [ ] 公開後、docs/article-backlog.md から T8 の行を削除（backlog「使い方」のルール）

## 技術メモ
- 想定セッション数: 1（ヒアリング → ドラフト → レビュー 1 回目。運営者リライト待ちは実装フェーズ外）
- カテゴリ: tech / slug: ghostty-herdr-migration / ブランチ: `post/ghostty-herdr-migration`
- 一次情報: 運営者ヒアリング（本記事専用の取材メモは未作成。T9・T10 と違い素材がバックログ 1 行しかないため、ヒアリングの深掘りが本 PBI の要）。herdr の設定・挙動は `docs/article-interviews/20260731-herdr-devcontainer-agent-bridge.md` §1（herdr 0.7.3 の概要、spaces / agents の説明）と T12 の backlog 行（herdr #1221、`switch_ascii_input_source_in_prefix`）を流用可。母艦の dotfiles（`~/dotfiles/herdr/config.toml`、ghostty 設定）はコンテナから読めないため、設定の現物は運営者に貼ってもらう
- 実行環境: devcontainer 前提（本 PBI 起票セッションもコンテナ）。§7 のローカル検証は `yarn preview` + repo の Playwright（コンテナ内 Chromium）で desktop 1280 / mobile 375 を撮る（PHASE1E-003 / 004 で実績。母艦 MCP Playwright は不要）。cover 生成の `tools/imagegen/.venv` は本コンテナに存在（`ls -d tools/imagegen/.venv` で確認済み）。`.env`（Gemini API キー）の有無は生成時に確認する（無ければ PHASE1E-004 実装ログ 2026-08-13 の手順で再構築、または母艦で生成）
- 運営者にしか確認できない事実（設定ファイルの現物・ghostty / herdr の version・挙動）は、前提知識ゼロで打てるコマンド + 報告形式を添えた依頼文 1 通にまとめて渡す（PHASE1E-003 の学び。1 往復で済む）
- herdr の version は取材メモ時点（2026-07-31）で 0.7.3。執筆時点の version と、T12 の herdr #1221 が未修正のままかは未確認 → ヒアリングで確認
- 既存記事（T9 前後編）は端末非依存の書き方で herdr / ghostty に触れていない（`grep -rl "herdr\|ghostty" src/content/posts/` → 該当なし）。本記事がサイト初出なので、初出時に一言の定義を置く（profile.md 初出定義ルール）
- 記事本文の作業前に `docs/writing-style/profile.md` を必読（CLAUDE.md Article Writing）

## 備考
- 記事バックログ T8 の正式化（docs/article-backlog.md）。3 連作の公開順は T8 → T9 → T10 の想定だったが T9 が先行した（PHASE1E-003 技術メモ）。本記事は「T9 の前日譚」ではなく単独で読める作りにし、T9 へのリンクで連作を繋ぐ
- T12（日本語入力の切り分け）は本記事に含めず独立記事のままにする。理由：T12 は調査の型（容疑者の潰し方）が主題で、乗り換え記事に入れると両方薄くなる（T9 を前後編に割った判断と同じ）
- 起票と同時に backlog から公開済み T9 の行を削除した（backlog「使い方」ルールの消し忘れ）

## 実装ログ

### 2026-08-23 セッション 1
- やったこと：起票（/pbi-review セルフチェック 5 件反映：cover 暫定方針の継続確認 / 公開コミットと Done 化の同セッション / コンテナでの検証経路と imagegen 基盤 / 運営者向け依頼文の形式 / herdr version 未確認の明記）→ 着手。前提確認：既存記事に herdr / ghostty の記述なし（grep）、`tools/imagegen/.venv` あり、T8 専用の取材メモなし（`docs/article-interviews/` に該当ファイルなし）。ヒアリング 1 巡目の質問を運営者に提示
- 残タスク：ヒアリング回答待ち → 深掘り → ドラフト → /article-review 1 回目

### 2026-08-25〜09-07 セッション 2（ヒアリング 1〜2 巡目）
- やったこと：ヒアリング 1 巡目・2 巡目の回答を受領し、取材メモ
  `docs/article-interviews/ghostty-herdr-migration.md`（gitignore 対象）に記録。
  Web 一次情報で裏取り（Zenn 記事 7/2 公開 / herdr 最新 0.8.0・#1221 Open /
  ghostty 1.4.0 未リリース・PR #12547 マージ済み / alacritty は OSC 通知未対応 #7105・
  ghostty は OSC 9/777 対応）。dotfiles git log で時期を特定
  （2024-01 alacritty+tmux 開始 → 2026-07-11 alacritty+herdr 試用 → 07-26 ghostty+herdr 本格移行）。
  裏取り用に `.devcontainer/allowed-domains.conf` へ herdr.dev を追加（要コンテナ再起動）。
  途中で main を 2 回マージ（009 完了分 / 010 完了ほか 37 コミット分。INDEX 衝突は
  main 側 + 008 行復元で解消）。派生提案から PHASE1E-010 を起票（その後 main 側で実装済み）
- 残タスク：運営者の確認 2 件（T12 の線引き / Ctrl+K の扱い）とタイムラインの読み合わせ
  → スクショ受領（別途提供と回答あり）→ ドラフト → /article-review 1 回目。
  ドラフト時の裏取り事項：herdr の spaces→tabs→agents の思想（herdr.dev docs）/
  herdr の通知が OSC 経由かの確認 / 記事は「手元 0.7.3 時点」と明記（最新 0.8.0）
- 学び・つまずき：作業ツリーがセッション跨ぎで main に戻っていることがある。
  ブランチ確認をしてから編集する（今回 allowed-domains.conf を main 上で編集しかけ、
  stash で退避して復旧）

### 2026-09-09 セッション 3（ドラフト + レビュー 1 回目）
- やったこと：スクショ 3 枚を受領・保管（全体像は「この記事を書いているセッションが
  写っている」形で運営者が採用決定、コスト表示の写り込みも承認）。herdr.dev docs で
  裏取り（workspace の推奨単位 / agent 状態の定義 / toast の配送 3 種。`delivery = "system"`
  は terminal-notifier / osascript 経由と判明し、OSC メカニズムは記事に書かない形へ訂正）。
  ドラフト執筆（約 3000 字 + スクショ 3 枚 + 設定引用、`yarn build` 成功）。
  /article-review 1 回目を subagent で実施 → 要修正 7 件を全反映 + 任意の磨き 2 件も反映
  → 再判定「公開可能」。設定引用はヒアリング 1 巡目の cat 出力と突き合わせて実物一致を確認
- 残タスク：運営者リライト（workflow 手順 8）→ /article-review 2 回目 → cover（生成前に
  暫定方針の継続確認）→ `yarn fonts` → publishedAt 更新 + draft: false → §7 検証 →
  Done 化 + マージ + backlog T8 行削除・T11 行の Ctrl+K 書き換え
- 学び・つまずき：draft: true の記事はビルドされない（dist/blog/ に出ない）ため、
  リライトは index.md の直接編集で行う。CF preview では見えない。公開直前に herdr 最新版
  （執筆時 0.9.0）と ghostty 1.4.0 リリース状況を再確認する（レビュー指摘）
- 想定外：Quality Checks が eeb7d34 以降 failure（js-yaml / svgo の新勧告公開による
  audit 失敗。記事内容とは無関係で、draft: true のため fonts:check は通っていた）。
  push 後の CI 確認を怠り 2 push 分見落とし、運営者の指摘で発覚
  → chore/audit-jsyaml-svgo（PR #89）で lockfile を修正版へ更新し、CLAUDE.md 手順 6 に
  「push のたびに ci-status.sh で確認」をルール化してマージ。本受け入れ条件の
  `scripts/ci-status.sh` は誤記だったため正パスに修正

### 2026-09-09 セッション 3 続き（AI 臭指摘と全面リライト）
- 想定外：レビュー 1 回目「公開可能」のドラフトを運営者が「一見して AI くさい」と指摘
  （「決め手は2つでした。」等の前振り・種明かしのキメ文、「私はこう使っています。→箇条書き」
  の教科書的な運び）。原因は 3 つ：(1) 執筆直前に profile.md・過去記事を読み直さず
  記憶で書いた（骨組み時 9/7 に読んだきり）(2) 導入済み（9/5）の natural-japanese
  スキルを使わなかった (3) profile.md を 1 項目ずつ照合する工程が無く、明文化済みの
  「断言の短文でキメる」が再発した
- 対応：chore/writing-ai-smell-gate（PR #91）で再発防止をルール化してマージ
  （writing-workflow §6/§8 に natural-japanese 検査の必須化 + 執筆直前の読み直し、
  article-review に 9 軸目「AI 臭」、profile.md に運営者指摘の原文つき 5 項目、
  CLAUDE.md に導線）。本文は natural-japanese のフル工程で全面リライト
  （lint --genre tech 0 件 + subagent 3 本のレビューで収束）
- リライト後に /article-review を再実行（1 回目相当、9 軸）→ 総評「公開可能」・
  修正必須 0 件。任意指摘 3 件を反映（#1221 は最新 0.9.0 でも未修正の表記へ、
  「次の2行」→「次のとおり」、発生時期「しばらくして」は未確認のため「乗り換えたあと」
  へ安全側に変更）。設定引用 4 ブロックはセッション記録内の 1 巡目 cat 出力と
  照合済み（運営者への再依頼は不要）。「いいやん」「herdrはいいぞ」の ！ の有無は
  運営者リライト時に判断してもらう申し送り
- 受け入れ条件③の「症状 +『原因は herdr の設定だった』までに留める」は、
  確定事項（2026-09-07 運営者決定：症状 + 設定名 + false で解消 + 副作用まで）が
  上書きしており、本文はそちらに従っている（Done 判定時はこの行を根拠にする）

### 2026-09-09 セッション 3 続き（運営者レビュー序盤の FB 反映）
- 運営者が序盤（〜作業の型）を確認し FB。運営者自身のリライト（「導入のきっかけ」見出し、
  「付いてきました」除去、「これはいいぞ！」等）を先に wip コミットで確定（5375a84）
- 「いま使っているターミナルの中でそのまま動きます」は意図不明の指摘 → 公式トップの
  「Herdr is where your coding agents live.」の引用に差し替え（herdr.dev を curl し原文確認）
- workspace 分割の勧めは公式 docs で裏取り：herdr.dev/docs/concepts の
  「Use one workspace per repo, task, or investigation.」を引用しリンクを貼った
- repo → リポジトリ（地の文のみ。keys 設定引用内の「repo=space」コメントは原本どおり残置）
- 画像 3 枚にキャプション追加。記法は「![alt](./x.png)*キャプション*」で、PostLayout に
  img + em のスタイルを追加。draft を一時 false にしてローカル dev + Playwright で
  描画確認後、戻した
- 「### 巡回がなくなった」以降へ同種 FB を反映：見出しへ主語追加（エージェントの巡回）、
  「失ったもの」→「乗り換えで失ったもの」、「向こうから知らせてくる」「記録にも記憶にも」の
  擬人化・対句を除去、まとめの総括キメ構文を平叙へ。締めは運営者リライトの温度
  （「これはいいぞ！」）に合わせ「herdrはいいぞ！」とし、！の申し送りは判断確定とみなした
- 運営者依頼で AI 臭リライト事例集を新設：docs/writing-style/rewrite-examples.md
  （指摘原文 + before / after。profile.md「避ける表現」と article-review 手順 1 から参照）
- 検査：natural-japanese lint --genre tech 0 件、profile.md 全項目照合、yarn build 成功
- 残：運営者の続き確認 → レビュー 2 回目 → cover → fonts → draft: false → §7 検証 → Done

### 2026-09-10 セッション 3 続き（前回対応への再指摘 3 件）
- 公式タグライン「where your coding agents live」の引用は「売り・機能の訴求ではない」と
  再指摘 → 引用を削除し、冒頭を「Rust製のターミナルマルチプレクサで〜」に統合
  （機能の訴求は直後のサイドバー・状態・通知の文に任せる）
- 「これに倣って」は公式とずれ：公式が単位を勧めるのは workspace のみ
  （repo / task / investigation）。タブの公式説明は「ビュー（agents、logs、server、
  review）の分離用」で、タスク = タブは運営者独自の使い方（concepts / agents ページを
  curl で確認）→ 倣う主張をやめる。言い回しは Claude 案（「私はこのうち〜の形で」）が
  AI 臭いと再々指摘され、運営者リライト文から「もこれに倣って」だけ外した形に確定
  （「私はリポジトリごとにspaceを分け、その中でタスクごとにタブを作成し〜」）
- 画像の脈絡：キャプションだけでは「説明なく画像が出る」への対応として不足の再指摘
  → 3 枚に本文からの導入（「普段の画面はこんな感じです。」「下のように状態が並ぶ」
  「届くのはこんなバナーです。」）を追加し、キャプションの重複を調整
- 検査：natural-japanese lint --genre tech 0 件、yarn build 成功

### 2026-09-10 セッション 3 続き（同種表現の全文照合）
- 運営者指摘「該当しそうな箇所は他にないか確認して全体反映」を受け、指摘カテゴリ全部
  （標語引用・根拠とずれた対応づけ・画像の脈絡・Claude 発明の言い回し・内輪語）で全文照合
- 「端末も〜」節冒頭「herdrは、いま使っているターミナルをそのまま使えます」が
  序盤 FB で意味不明 NG となった文と同型 → 「herdrの導入に、ターミナルを替える必要は
  ありません。」に修正
- 通知の配送先の記述（OS 通知・トースト・端末経由）は公式 configuration ページで裏取り
  （delivery = herdr / terminal / system / off と一致）→ 修正不要
- 画像 3 枚の導入文・キャプション、repo 表記（残りは引用 toml コメントのみ・既報）、
  公式 docs への言及箇所は問題なし
- rewrite-examples.md：「教科書的な運び」の after に残っていた「私もこれに倣って」を
  確定文に更新し、今回確定の 3 例（標語引用・これに倣って・リライト文の言い換え）を追記
- profile.md「避ける表現」に画像の脈絡ルールを追記

### 2026-09-11 セッション 4（後半 FB への回答と承認分の反映）
- 手順指定（コミット → 提案 → OK 後に修正）に沿って提案を送付。copy-mode の追加質問に
  一次情報で回答：
  - w/b が記号で止まらないのは herdr 側の実装（#970 open）。tmux は word-separators の
    既定値（options-table.c、`_` を除く記号全部）で記号を区切りにするため発生しない
  - `$` がペイン右端に飛ぶのは herdr #1405 のバグで、修正 PR #1411 は v0.7.5 収録済み
    （compare API で確認）→ 0.7.3 では発生し、0.9.0 更新で解消見込み。`0` の issue は無し
  - copy-mode 節と display-panes は運営者の 0.9.0 再テストと方針 OK を待って書き直す
- 承認された修正を反映：
  - 「こちらはghostty側です」→「もう1件は、herdrではなくghostty側でした。」
    （提案の「ghosttyのバグでした」は直後の文と重複するため語尾を調整、事例集に注記）
  - 「手癖をそのまま持ち込む方向で」→「herdrのキーバインドは、tmuxで使っていた操作に
    合わせています。」
  - まとめを箇条書き 3 点 + 地の文 1 行 + 「herdrはいいぞ！」に再構成
  - 「設定の要点」→「いま使っている設定」に改題し、運営者提供の herdr / ghostty 設定を
    全文掲載（冒頭の紹介箇条書きと表記を一致させた）
  - インストール方法（install.sh / brew）、スター急成長（約9,800 → 37,000 超）、
    「今後試したいもの」節（agent skill / プラグイン機構 / マーケットプレイス）を追加
  - 運営者リライト内の誤字 2 件（できるころと / あ流ようです）を修正
- rewrite-examples.md に確定 2 例（こちらは〜です / 手癖を持ち込む）を追加
- 検査：natural-japanese lint --genre tech 0 件、profile「避ける表現」全項目照合済み
- 保留（運営者判断待ち）：tmuxタブ表記 / 0.9.0 スクショ撮り直し / サイドバー赤枠画像 /
  [ui.toast] の明記 / 端末節の圧縮 / dotfiles 残置 2 文 / copy-mode・display-panes 書き直し

### 2026-09-12 セッション 4 続き（FB 回答と承認分の反映）
- 運営者の再テスト結果：0.9.0 で `$` / `w` / `b` は期待どおり。`0` は元から問題なし
- 回答：display-panes 画像の撮り方（`alacritty -e tmux` で herdr を止めずに撮る）、
  herdr のクライアント / サーバー構成（クライアント終了はサーバーに影響しない。
  サーバー再起動後の復元は設定上は有効だが実挙動は未検証）、自作略称の説明
- 反映（運営者 OK 済み）：
  - copy-mode：「0.7.3 では `$` と `w`/`b` の挙動が tmux と違い、0.9.0 で手元では解消」
    に書き換え。`0` は運営者指示で対象から外した
  - 設定節を全文掲載から抜粋に変更。herdr は `[keys]` のみ、ghostty は起動コマンド +
    auto-update + 内蔵キー無効化のみ。導入文を「実物から、記事で触れた部分を抜粋」に調整
  - 抜粋により ghostty 設定の「Spit Devider」typo 箇所は記事から外れた（dotfiles 側の
    修正は運営者にお任せ）
  - `[ui.toast]` と実験的設定は上の節に掲載済みのため抜粋に重複させていない（報告済み）
- プロセス：FB 対応手順（回答 → 方針提案 → OK 後のみ反映、逸脱は再提案）を
  writing-workflow §8 と CLAUDE.md に必須化（e67daf3、運営者指示「今後のプロセスで必須化して」）
- 検査：natural-japanese lint --genre tech 0 件（86 文）、profile「避ける表現」照合済み
- 保留（可否待ち）：tmuxタブ表記 / 0.9.0 版数統一 + スクショ 3 枚 / [ui.toast] の明記 /
  端末節の圧縮（削るのは index.md:99-103 のターミナル変遷の 5 文） / dotfiles 残置 2 文の削除
- 画像待ち：tmux display-panes のスクショ + herdr サイドバー用スクショ（赤枠はこちらで合成）

### 2026-09-12 セッション 4 続き 2（保留 5 項目の承認と反映）
- 運営者が保留 5 項目すべてを承認 → 反映：
  - 「ペインとタブ（tmuxのウインドウ相当）を持ちます」に修正
  - 本文の版数を 0.9.0 に統一。IME 設定コメントの「0.7.3 で未修正」も 0.9.0 に更新。
    copy-mode 節の「0.7.3では」は経緯の記述なので残す
  - [ui.toast] の導入文を「herdrの設定ファイル（`~/.config/herdr/config.toml`）に
    次を書いています」に変更
  - 端末節のターミナル変遷 5 文（iTerm2 / wezterm / warp の段落）を削除
  - 記事末尾の dotfiles 残置 2 文を削除
- tmux display-panes のスクショを運営者から受領（チャット添付）。リポジトリへの配置と、
  display-panes 節の修正文面の OK を待って反映する
- 赤枠合成は運営者側で実施に変更。ghostty 設定「Spit Devider」typo は dotfiles
  セッション向けの依頼文を運営者に渡した
- herdr 側スクショ（3 枚差し替え + サイドバー赤枠用）は 0.9.0 の設定調整の完了待ち
- 検査：natural-japanese lint --genre tech 0 件（79 文）、profile「避ける表現」照合済み

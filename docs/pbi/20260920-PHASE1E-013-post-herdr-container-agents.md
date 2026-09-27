# 訪問者は「コンテナの中の Claude Code を herdr のサイドバーに出した話」（tech）を読める

Status: InProgress
Started: 2026-09-20
Completed: -

## 誰が
- 訪問者

## 何をできる
- 隔離したコンテナの中で動く Claude Code を、母艦のターミナル管理ツール（herdr）の一覧に出すまでの経緯を、一次体験として読める
- ソケットを丸ごと渡さずに一方通行で繋ぐという選択と、その理由（渡すと母艦で任意のコマンドを実行できる口を渡すことになる）を読める
- 同じ仕組みを使う人が、行が出なくなったときの回復手段（新しいペインを作る）を先に知れる

## なんのために
- 記事バックログ T10（開発環境 3 連作の 3 本目）。1 本目 T8（ghostty + herdr 乗り換え、PHASE1E-008）と 2 本目 T9（devcontainer 前後編、PHASE1E-003）は公開済みで、「環境を移す → 隔離する → 隔離したものを部分的に繋ぐ」の締めにあたる
- 公開記事を 6 → 7 本に増やす（Phase 1e の主活動。カテゴリ別一覧 FR-19 は 10 本到達がトリガー）
- 初稿を 4 モデルで作って比べる期間の 1 本目（writing-workflow §6、2026-09-17 運営者決定）。2 本目の後に主力のモデルを決める
- 関連: docs/article-backlog.md T10 / docs/writing-workflow.md / site-plan Phase 1e

## 受け入れ条件
- [ ] ヒアリング（writing-workflow §3〜5）の結果から、構成 `docs/article-interviews/herdr-container-agents.outline.md` と材料 `docs/article-interviews/herdr-container-agents.notes.md` を作業ツリーに作る（git 管理外。worktree を消すと消える）
- [ ] 雛形を `yarn new-post --slug herdr-container-agents` で生成し、frontmatter を埋める（`draft: true`、category: tech、title は `| byte-lark.com` サフィックス無し、description 80〜120 字、本文冒頭に `# タイトル` を重複させない）
- [ ] 初稿は `bash scripts/draft-compare.sh herdr-container-agents` で 4 本作り、A〜D のまま数えた結果（網羅・余計・自然さ）と一緒に運営者へ出す。運営者が選んだ 1 本を採用する（writing-workflow §6 手順 3〜5）
- [ ] 数えた結果・かかった秒数・対応表・運営者の選択・§6 の決まりのうち破った / 迷った / 読み飛ばしたものを実装ログに残す（比較期間の記録。手順 6）
- [ ] 本文に次の 6 点を含める：① サイドバーに出なかった症状と、原因が隔離の設計そのもの（PID 空間もソケットも分けてある）だったこと ② 母艦のソケットをコンテナに渡す案を採らなかった理由 ③ 一方通行の橋渡しの作り（コンテナは共有済みの作業ディレクトリに状態を 1 語書く / 母艦の見張りが読んで herdr に報告する） ④ 戻し方を先に決めた設計（撤去は revert 2 本 + 状態ファイル削除、コンテナ再作成は不要） ⑤ `blocked` の誤検知（Notification は入力待ちでも飛ぶ）と、自己申告と外から観測の違い ⑥ 2026-09-20 に調べた「行が出なくなるペイン」の症状・切り分け・回復手段
- [ ] 連作の位置づけを本文で示す：公開済みの `/blog/claude-code-devcontainer`（隔離編）と `/blog/ghostty-herdr-migration`（乗り換え編）へ内部リンクを張る。未公開記事の予告は書かない（profile.md「避ける表現」）
- [ ] 材料に無いことを書かない（writing-workflow「材料に無いことの扱い」）。【要確認】は 3 件まで、【要写真】は書式どおり。`yarn posts:check` が通る
- [ ] レビュー 1 回目：subagent で `/article-review` を実行し、指摘を自分で反映して総評「公開可能」にしてから運営者に渡す（writing-workflow §7）
- [ ] 運営者がレビュー・リライト（writing-workflow §8）
- [ ] レビュー 2 回目：`/article-review` を実行し、3 つに仕分けたうえで承認された指摘だけを反映（writing-workflow §9）。承認内容を実装ログに記録
- [ ] cover 画像を cover-image skill で生成・配置（`cover: ./cover.png`、2000×1050）。描き方は直近の記事と変える（skill のデザイン方針）。候補の選定は運営者（実装ログに記録）
- [ ] `draft: false` の直前に `yarn fonts` でフォントを作り直し、生成物も一緒にコミット（writing-workflow §10）
- [ ] `yarn build` 成功 / `yarn check` / `yarn check:ts` エラーなし
- [ ] テスト追加：N/A（記事のみで、サイトの振る舞いは変えないため）
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL: `https://post-herdr-container-agents-byte-lark.tanimoto-a49.workers.dev`）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `bash ~/.claude/bin/ci-status.sh` で UI Tests / Quality Checks が success）（CLAUDE.md §7）
- [ ] `draft: false` のコミットを打つセッションで Done 化（Status + INDEX 同期 + マージ）まで終える（README §5.4 外形が変わるコミットの例外）
- [ ] 公開後、docs/article-backlog.md から T10 の行を削除（backlog「使い方」のルール）

## 技術メモ
- 想定セッション数: 1（ヒアリング → 初稿 4 本 → 採用 → レビュー 1 回目。運営者リライト待ちは実装フェーズ外）
- カテゴリ: tech / slug: herdr-container-agents / ブランチ: `post/herdr-container-agents`
- 一次情報（コンテナから読める）:
  - 取材メモ `docs/article-interviews/20260731-herdr-devcontainer-agent-bridge.md`（main 側、gitignore 対象。worktree からは読むだけ）
  - 実装の現物 `.devcontainer/herdr/agent-state.sh`、`.claude/settings.json` の 5 イベント、`.gitignore` の `.herdr-state/`
  - herdr 公式 docs（`herdr.dev` は `.devcontainer/allowed-domains.conf` に登録済み。2026-09-20 に `llms.txt` / `agents.mdx` / `socket-api.mdx` / `cli-reference.mdx` を取得して確認）
- 運営者に貼ってもらう必要がある現物: 母艦 dotfiles の `bin/herdr-ccd-bridge` と `fish/conf.d/ccd.fish`（コンテナから読めない）。記事には要点だけ引用する（2026-09-20 運営者決定）
- version: 母艦の herdr は 0.9.0（2026-09-20 実測）。取材メモ時点は 0.7.3、公式 docs の安定版は 0.9.1。記事では計測時点を明記する
- `ccd` のオプションは `--auto` / `--rebuild` / `--update` の 3 つだけ（2026-09-20 実測）。`--continue` は無い
- 記事本文の作業前に `docs/writing-style/profile.md` と直近公開記事 1〜2 本を読み直す（CLAUDE.md Article Writing）

## 備考
- 2026-09-20 の調査記録（本文 ⑥ の材料）。monotrip.jp のコンテナセッション 3 本のうち 1 本がサイドバーに出ない状態で切り分けた:
  - コンテナ側は正常（`.herdr-state/<pane>.state` が更新されている）
  - 母艦の見張りも動いていて、ログに `reported idle` が出る
  - herdr の CLI から直接報告しても、そのペインだけ一覧に出ない（`herdr pane report-agent` は ok を返す）
  - 同じタブの別ペイン（fish）には同じコマンドで行が出る → 経路は正常でペイン固有の問題
  - seq の追い越し（socket-api.mdx の「直前に受理した番号以下は反映しない」）は、現在より 1000 秒先の値でも出ないことから否定
  - `pane.clear_agent_authority`（CLI に無い socket メソッド）も ok を返すが変化なし
  - 同じペインでセッションを起動し直しても戻らない。新しいペインを作ると出る → 回復手段は新しいペイン
  - 原因は未特定。herdr 側がペインごとに持っている状態が壊れる形までしか分かっていない
- 記事に入れる範囲は「症状 → 切り分けで分かったこと → 回復手段」までにする。原因未特定であることを書く
- 3 連作の公開順は T8 → T9 → T10 の想定で、T9 が先に公開された（PHASE1E-008 技術メモ）。本記事は前 2 本の前提の上に立つが、単独で読める作りにする

## 実装ログ

### 2026-09-20 セッション 1
- やったこと：テーマ・slug・カテゴリを運営者と決定（T10 / herdr-container-agents / tech）。主軸は「隔離したものを一方通行で繋ぐ」（運営者選択）。分量は上限を決めず outline の見出しで確認する形に変更（運営者指摘：字数は記事の中身でぶれる）
- やったこと：ヒアリングの途中で、運営者環境で「サイドバーに出ないペイン」が再現中と判明し、先に切り分けた（結果は備考に記録）。回復手段（新しいペインを作る）まで確定し、本文 ⑥ として記事に入れることを運営者が決定
- 残タスク：母艦 dotfiles 2 ファイルの受領 → outline / notes 作成 → `scripts/draft-compare.sh` で 4 本 → 数える → 運営者が選ぶ → 検査 → /article-review 1 回目

### 2026-09-20〜21 セッション 2（4 モデルの比較 3 回）
- やったこと：`scripts/draft-compare.sh` で 4 モデルの初稿を 3 回作り、運営者がモデル名を伏せたまま順位を付けた。字数はコード・表・frontmatter・空白を除いた本文

  | 回 | 渡したもの | 1 位 | 2 位 | 3 位 | 4 位 |
  | --- | --- | --- | --- | --- | --- |
  | 1 回目 | Claude が作った見出し 8 本と、調べた細かさのままの材料（23KB） | gemini-pro 3,364 字・76 秒 | 順位なし：gemini-flash 6,969 字・63 秒／opus 9,356 字・223 秒／fable 8,364 字・72 秒 | | |
  | 2 回目 | Claude が作った見出し 8 本（目安と注記）と、Claude が文に書き直して削った材料（9KB） | gemini-flash 5,225 字・53 秒 | opus 3,717 字・90 秒 | fable 4,045 字・56 秒 | gemini-pro 2,968 字・78 秒 |
  | 3 回目 | 見出しなし。作業記録の原文（main 側の取材メモ）と、聞き取りの短い項目。依頼は読者・残したいこと・分量・決定済みの 3 点だけ | fable 4,892 字・49 秒 | gemini-flash 4,767 字・63 秒 | opus 4,312 字・57 秒 | gemini-pro 2,722 字・104 秒 |

- 運営者の評価
  - 1 回目：gemini-pro 以外の 3 本は「技術的なところを突っ込みすぎて、わかる人にしか読めない」「この内容でこんな長文だと正直読みたくない」。4 本とも「またいっぱいリライト必要そうでダルい」
  - 2 回目：1〜3 位は「そこまで大きく変わらない」「文章にてる」
  - 3 回目：1 位（fable）と 2 位（gemini-flash）は「甲乙つけ難い」「文章は全体的に D（fable）がいいけど、表は B（gemini-flash）が一番いい」。2 回目の 1 位と比べて「今回のやつがいい」
- 採用：3 回目の fable の本文に、gemini-flash の表（イベント・状態・役割の 3 列）を入れた。表の Notification の役割は「ユーザーの承認や入力を待っている状態」から「ユーザーの承認を待っている状態」に直した（入力待ちを除外する後段の節と食い違うため）
- 学び：Claude が見出しと文の形の材料を渡すと、どのモデルが書いても Claude の骨格どおりになる。本文の 10 文字の並びが材料と一致する割合は、2 回目の opus 44%・fable 38%（互いに 60% が共通）、3 回目は 4 本とも 10〜16%（互いに 8〜20%）。1 回目で読みにくかった原因もモデルではなく、Claude の材料の細かさと見出しだった
- 学び：モデルの差は小さい。1 位は 3 回とも別のモデル。gemini-flash だけが 2 回続けて上位 2 本に入った
- 決定（2026-09-21 運営者）：次の記事からは、3 回目と同じ渡し方で gemini-flash 1 本で作る流れを試す。主力の確定ではない。`docs/writing-workflow.md` §6 と `scripts/draft-compare.sh`（`--single`）をその形に直した
- 決定（2026-09-21 運営者）：tech 記事の読者・分量・トーンは記事ごとに聞かない。既定を `docs/writing-style/profile.md`「読者と分量の既定」に置いた
- 想定外：コンテナではロケールが設定できず `wc -m` がバイト数を返す。字数として約 3 倍の値を運営者に報告し、指摘されて Python で数え直した
- §6 の決まりのうち破ったもの・迷ったもの
  - 手順 4「数える」は 2 回目・3 回目で行っていない。「網羅」（材料の項目が本文に入った数）を数えると、全部入れた本文ほど良く見え、1 回目の読みにくさと逆を向くため。§6 から外した
  - 2 回目の作り直しでは、1 回目と同じく Claude が見出しを渡した。比較の目的（モデルの差を見る）と食い違うことに気づかず、運営者の指摘で 3 回目をやり直した
- 画像：この件の herdr の画面は、コンテナ内の会話ログには無い（貼り付け画像 23 件を確認）。相談時の画面は Mac 側のセッションにあり、コンテナから見えない。【要写真】を 1 件置いた
- やったこと：採用した本文を検査した。natural-japanese の lint（`--genre tech`）は low_burstiness（-0.262）と TTR の 2 件が残る。残す理由は、技術用語の繰り返しと、材料に無い実感を足さない決まり。`/article-review` 1 回目を subagent で 2 周し、1 周目の 19 件と 2 周目の 5 件を反映した
- 想定外：2 周目のレビューで、herdr 公式ドキュメント（https://herdr.dev/docs/agents/ 「VMs and sandbox wrappers」）に `HERDR_AGENT=<agent>` をラッパーコマンドに付ける手段があると分かった。`devcontainer exec` に付けて効くかはコンテナから試せない。本文に【要確認】を 1 件置いた。「出る」なら記事の構成を運営者と見直す
- 残タスク：【要確認】1 件の回答 → 【要写真】1 件 → 運営者レビュー・リライト → カバー画像 → `/article-review` 2 回目 → 公開

### 2026-09-21 セッション 2（続き）：公式の手段の実機確認
- やったこと：運営者が Mac の herdr 0.9.0 で `env HERDR_AGENT=claude devcontainer exec --workspace-folder ~/src/byte-lark.com claude` を 2 回試した。サイドバーの行、working / idle の切り替え、承認待ちの blocked、別のタブを見ているときの画面右上の通知が、すべて出た。hook も見張りも使っていない
- 影響：本文の「この記事の対応を入れない限り、今も同じ症状が出ます」は誤り。記事は公式の手段を前提に作り直す必要がある（方針は運営者の判断待ち）
- 想定外：試験をしたペイン（`w4D:p26`）で、その後に `ccd` を起動しても行が出なくなった。コンテナ側の状態ファイルと見張りは正常で、`herdr pane report-agent` で手で報告しても一覧に出ない。新しいペインでは出た。備考の「1 つのペインだけ出ない」症状と挙動が同じ。公式の検出が一度働いたペインでは自作の報告が反映されない、という説明がつくが、原因は未確認
- 想定外：1 回目の試験で「通知は音だけ」だったのは、macOS の集中モードが原因だった（運営者確認）。公式の手段と自作の仕組みの差ではない。herdr は見ているタブの通知を出さない仕様でもある（https://herdr.dev/docs/configuration/ Notifications 節）。Mac に `terminal-notifier` は入っておらず、通知は `osascript` の代用で出ている
- 学び：取材メモの古いパス（`~/src/react-blog`）を確かめずに運営者へ案内して失敗した。Mac 側のパスは `/proc/self/mountinfo` の `/workspace` の行で分かる

### 2026-09-22 セッション 2（続き）：`HERDR_AGENT` がいつから使えたか
- やったこと：`herdrdev/herdr` の `CHANGELOG.md` とバージョン別ドキュメントで確かめた。Linux 向けの追加は 0.7.1（2026-06-24）、macOS 向けの追加は 0.7.5（2026-07-21）。どちらも #679。0.7.3 のドキュメント（`docs/versions/0.7.3/website/src/content/docs/agents.mdx`）は「On Linux, …」と Linux 限定で書いている
- 事実：自作した 2026-07-31 の Mac の herdr は 0.7.3（取材メモ 5〜6 行目）で、公式の手段は使えなかった。ただし 0.7.5 はその 10 日前に公開済みで、上げていれば使えた。0.7.5 の変更履歴では Added 7 項目のうちの 1 行
- 未確認：0.7.5 の Mac で実際に動くか。実機で確かめたのは 0.9.0 だけ
- 決定（2026-09-22 運営者）：記事は公式の手段を主役にして作り直す。自作の話は短く残す。本文は `scripts/draft-compare.sh --single gemini-flash` で作る
- 残タスク：材料と依頼を直す → Gemini Flash で作り直す → 検査 → `/article-review` 1 回目 → 【要写真】 → 運営者レビュー → カバー画像 → `/article-review` 2 回目 → 公開

### 2026-09-22 セッション 2（続き）：公式の手段を主役にして作り直し
- やったこと：`<slug>.notes.md` の聞き取りの部分に、公式の手段・実機確認の結果・対応バージョンを短い項目で足した。`<slug>.outline.md` は「主役は公式の手段、自作は短く」に直し、見出しと順序は渡していない。`bash scripts/draft-compare.sh --single gemini-flash herdr-container-agents` で 1 本作った（gemini-flash、52 秒、本文 3,404 字。コードと frontmatter を除き Python の `len()` で数えた）
- やったこと：Claude が直した箇所は、材料に無い感想の締め（「約 7 週間は何だったのか」「やはり快適です」。運営者は切り替えていない）→ 削って【要確認｜主張】に置き換え／材料に無い思考の記述 2 か所／太字 → コード表記／【要写真】を書式どおりに／lint の指摘 2 件。natural-japanese の lint（`--genre tech`）は 0 件、`yarn posts:check` は合格
- 決まりで迷ったもの：outline の「運営者の一言は原文のまま最後に置く」は外した。一言（「…カスタマイズはマストですね」）は公式の手段を知る前のもので、作り直した記事の結論と食い違うため。締めの言葉は【要確認】で運営者に聞く
- やったこと：`/article-review` 1 回目を subagent で回し、17 件のうち 16 件を反映した。大きいのは原因の節で、Gemini Flash は 7 月の取材メモどおり「hook が herdr に申告する」を主に書いていたが、公式ドキュメント「Status authority」節では前面プロセスの検出が先。レビューの差し替え文に直した。title の変更案（キーワードを入れる）は運営者の判断に残した。反映後も lint 0 件、`yarn posts:check` 合格
- 学び：取材メモの原文に、あとで誤りと分かった推測が残っていると、モデルはそれを事実として書く。聞き取りの項目で「記録のここは誤り」と名指しする必要があった
- 残タスク：【要確認】1 件（`ccd` を切り替えるか）と締めの言葉 → 【要写真】 → 運営者レビュー・リライト → カバー画像 → `/article-review` 2 回目 → 公開
- 運営者の質問（2026-09-22）：「ccd の機能も公式でそれに変わるやつを提供してるの？」→ 無い。`HERDR_AGENT` は `ccd` の中の `devcontainer exec` に付ける環境変数で、コンテナ起動・firewall 確認・後片付けは `ccd` に残る。切り替え＝`ccd` の中で `HERDR_AGENT=claude` を付け、見張りの起動とコンテナ側 hook を外すこと。本文の【要確認】の質問文をこの意味に直した
- 運営者の指示（2026-09-22）：比較のため、Claude が見出しと構成を作り Gemini が本文だけ書く渡し方（2 回目と同じ）でもう 1 本作る。材料は `docs/article-interviews/herdr-container-agents-round4-outlined/` に用意した（outline は流れの目安 7 節、notes は Claude が短い項目に書き直したもの）。構成を任せた回の材料と本文は `-round4-free/` に控えた
- 想定外：Gemini Flash・Gemini Pro とも「Individual quota reached. Resets in 28h」（429）で生成できなかった。比較用の 1 本は上限の回復後（2026-09-23 夕方以降）に `bash scripts/draft-compare.sh --single gemini-flash herdr-container-agents` で作る。作る前に `-round4-outlined/` の outline と notes を `docs/article-interviews/` に戻す
- やったこと（2026-09-23）：上限の回復後、Claude が見出し 7 節と短い項目の材料を渡す形で gemini-flash 1 本を作った（42 秒、3,896 字）。構成を任せた回（52 秒、3,427 字）の生の出力と、伏せた 2 本 `docs/article-interviews/herdr-container-agents-round4-compare/draft-A.md`・`draft-B.md` にして運営者に出した。対応表は同じフォルダの `mapping.txt`（Claude は開いていない）。どちらも Claude の修正を入れる前の生の出力で比べる
- 運営者の選択（2026-09-23）：伏せた 2 本のうち A（Claude が見出し 7 節と短い項目の材料を渡し、gemini-flash が本文を書いたもの）を採用。B は構成を任せた回。両方の生の出力で比べた
- 運営者フィードバック（2026-09-23）を反映：導入で「自作して 7 週間 → 公式で済むと分かった」を 3 文で説明／「前面プロセス」（Claude の訳語）を公式日本語ドキュメントの「フォアグラウンドプロセス」に直し、初出で「そのペインでいま動いているコマンド」と補う／「切り替えるかは未定」を消し、事実（試したのはここまで、`ccd` はまだ自作のまま）だけ残す／集中モードと見ているタブの通知の段落を運営者の言葉で書き直す／ペインを混ぜない件（蛇足）を消し、運営者のオチと教訓の 3 文に置き換える／まとめに「独自に作る前に最新の情報を調べる」を足す／末尾の【要確認】（締めの言葉の置き場）を消す。本文 4,257 字、lint 0 件、`yarn posts:check` 合格
- 運営者の質問と回答（2026-09-23）：「公式の機能で代替できたんだっけ？」→ できた。運営者が 2026-09-21 に Mac の herdr 0.9.0 で 4 点を確認済み。7 月に「できない」だったのは 0.7.3 が Linux 限定だったため。「前の記事と同じ写真では？」→ 前の記事（ghostty-herdr-migration）の画像は Mac のセッションだけ。この記事はコンテナと Mac の両方が並んだ画面で、1 枚で足りる
- 決定（2026-09-24 運営者）：`ccd` を herdr 公式の `HERDR_AGENT` に切り替え、自作の橋渡しを外す。dotfiles 側への依頼文を `docs/article-interviews/herdr-official-switch-request.md`（git 管理外。worktree を消すと消える）に置いた。repo 側（`.devcontainer/herdr/agent-state.sh`、`.claude/settings.json` の hook 6 件、`.gitignore`）は別の変更で外す。本文の「`ccd` はまだ自作のまま」は消し、切り替え後に「`ccd` もこの形に直した」と書く。公開は切り替え後
- 運営者指摘（2026-09-24）：原因の節の言い方（「前面プロセス」「Mac から見えるコマンド」）はコンテナと Mac の違いが読み取れない。段落を 6 文に開いて、Mac で直接起動したペインとコンテナで起動したペインを並べて書く案を出した（判断待ち）
- 反映（2026-09-24 運営者 OK）：原因の節を 6 文の 1 段落に差し替え（見出し「herdr は Mac の中のプロセスしか見えない」）。「`ccd` はまだ自作のまま」を「`ccd` もこの環境変数を付ける形に直した／自作の hook と見張りは外した」の 2 文に差し替え。用語を消した結果、後段の 2 文（「主な判定は Mac 上で動いているコマンドの検出」「Mac 上で動いている `devcontainer exec` を claude として扱う」）も言い換えた。lint 0 件、`yarn posts:check` 合格。公開は dotfiles 側の切り替えが終わってから
- やったこと（2026-09-27）：dotfiles 側の切り替え（dotfiles 0c44eb0）が終わったので、repo 側の自作 hook を外した。PR #108（`chore/remove-herdr-bridge`、main の先頭から切った別ブランチ）をマージ。`/workspace/.herdr-state/` の古い状態ファイル 3 つも消した。これで本文の「`ccd` もこの環境変数を付ける形に直した／自作の hook と見張りは外した」は事実になった
- 想定外：`ci-status.sh --wait` はローカルのブランチ名（`worktree-chore+…`）でランを探すので、push 先の名前が違うと見つからず待ち続ける。`gh run list --branch <リモート名>` で確認した
- 残タスク（再起動後に記事の worktree で再開）：`/article-review` 2 回目 → 【要写真】の撮影（運営者）→ カバー画像 → 公開（`draft: false`）→ PBI Done → PR
- やったこと（2026-09-27 運営者フィードバック 3 回目）：運営者が worktree の本文を読み、9 項目のフィードバックを出した（原文は `docs/article-interviews/herdr-container-agents.feedback-0927.md`）。指摘の中心は「まだ説明していないものを、説明済みのように書いている」。運営者の指示（「見直してください。修正した後は、Opus とか別のモデルでもレビューしてもらってください。Gemini にも」）で本文を書き直し、Opus と Gemini Pro にフィードバックの原文ごと渡してレビューさせた
  - 書き直しの要点：導入を 2 文 + 箇条書き 3 点に縮めた／原因の節から「hook が申告しないから〜誤りでした」を削除／解決方法の節から hook・ソケット・自作の仕組みへの言及を外した／自作の仕組みは独立した節にし、検討した 2 案・やめた理由・採用した案の動きを順に書いた／「まれに 1 つのセッションだけ出ない」を削除／運営者の 3 文をまとめの箇条書きの後へ移し、重複していた箇条書き 1 行と末尾の 1 文を削除
  - Gemini Pro：フィードバックは全項目「解消」。指摘 3 件のうち 1 件を反映（「採用したのは2つ目です。」の短文を次の文とつなげた）。「切り替えはまだ」との食い違いの指摘は、notes.md が古かったため（notes.md を直した）。「ドキュメントを読めなかった理由を書く」は不採用（当時の調査環境を確かめられない）
  - Opus：フィードバックは 6 項目「解消」・3 項目「一部」。指摘 11 件のうち 10 件を反映（隔離の目的を `ccd` の説明で先に書く／報告の API を使う理由の 1 文／「文字入力できる」から「任意のコマンド」へのつなぎ／macOS は 0.7.5 からの条件を解決方法の節に／「起動コマンド」を「コンテナに入るコマンド」に／状態の日本語名と英語名の対応 ほか）。原因の節の文の長さをそろえすぎという指摘は、運営者が承認済みの文なので不採用
  - 承認済みの文から変えた箇所：原因の節の 4 文目「コンテナで起動したペインでは」→「`ccd`でコンテナの中のClaude Codeを起動したペインでは」（起動したのはペインではなく Claude Code、という Opus の指摘）
  - 新しく足した事実：`devcontainer exec` は起動済みのコンテナが前提（devcontainers/cli の README「Execute a command on a running dev container」）／当時は公式ドキュメントを読んでいなかった（取材メモ §11「herdr.dev のドキュメントは…未読のまま」）
  - 検査：natural-japanese の lint 0 件、`yarn posts:check` 合格。本文は約 4,300 字（箇条書きを含む。コード・引用を除く）
- 学び：writing-workflow §8 は「提案 → OK 後に反映」だが、今回は運営者が書き直しとレビューを名指しで指示したので先に反映した。変えた箇所は報告で 1 件ずつ示した
- 残タスク：運営者の確認 → `/article-review` 2 回目 → 【要写真】の撮影（運営者）→ カバー画像 → 公開（`draft: false`）→ PBI Done → PR。コミットと push は未承認
- やったこと（2026-09-27 書き直しの取り消し）：運営者が書き直した本文を読み、「指摘した以外のところも直して、構造を変えている」「導入から自作の仕組みの話が消えて流れがおかしい」と指摘した。運営者の指示（「今のは一旦捨てて、前回の内容に対して、私がフィードバックしたところだけ反映する」「何をどう変更するかを先に提示」）で、本文を書き直す前の版（`docs/article-interviews/herdr-container-agents-before-feedback-0927.md`）に戻した。捨てた版は `docs/article-interviews/herdr-container-agents-discarded-rewrite-0927.md` に控えた。上の「運営者フィードバック 3 回目」の書き直しとレビュー反映は本文に残っていない
- 学び：フィードバックを受けた直しは、指摘された箇所だけを変える。指摘の外で直したい箇所は、直さずに候補として出す。反映の前に、変更前と変更後を 1 か所ずつ示して承認を取る（writing-workflow §8 の「回答 → 提案 → OK 後に反映」を、書き直しの指示があった場合にも守る）
- 想定外：控えの版は「8月に調べた時点では」だが、運営者が引用した本文は「7月に調べた時点では」だった。セッションの記録では、2026-09-24 の時点で「7月」、2026-09-27 17:05 に Claude が本文を読んだ時点で「8月」で、その間に Claude が本文を書き換えた記録は無い。誰が書き換えたかは未確認（運営者には「私が書き換えた」と報告したが、確かめずに言った誤りで、取り消した）。自作した日は 2026-07-31 なので事実は「7月」。この段落は運営者のフィードバックで削除する対象
- やったこと（2026-09-27 引き継ぎ）：運営者の指示（「品質落ちてそうなので、別セッションに引き継ぎますか。引き継ぎファイルを出力してください。」）で、引き継ぎファイル `docs/article-interviews/herdr-container-agents.handover-0927.md`（git 管理外。worktree を消すと消える）を作った。経緯、運営者の発言の原文、失敗の内容と原因の見立て、運営者に出した修正案 7 か所、確かめた事実と出典、残タスクを入れた。Opus のレビュー結果は `docs/article-interviews/herdr-container-agents.review-opus-0927.md` に保存した。修正案は 1 つも本文に反映していない
- 残タスク（次のセッション）：引き継ぎファイルを読む → 修正案を評価して運営者に出す → OK の出た項目だけ反映 → 以降は引き継ぎファイルの 11 章。コミットと push は未承認

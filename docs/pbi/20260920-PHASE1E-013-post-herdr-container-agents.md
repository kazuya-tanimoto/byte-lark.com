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

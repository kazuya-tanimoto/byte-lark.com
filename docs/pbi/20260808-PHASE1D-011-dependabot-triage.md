# 運営者は依存ライブラリの脆弱性アラートを仕分けし、実害のあるものを解消できる

Status: Done
Started: 2026-08-09
Completed: 2026-08-09

## 誰が
- 運営者

## 何をできる
- リポジトリの Dependabot アラート 61 件（critical 1 / high 16 を含む。2026-08-08、main に lockfile が乗って初走査された時点の値）を全件仕分けし、本サイトの構成で実害があるものは依存更新で解消、実害がないものは根拠付きで dismiss した状態にできる

## なんのために
- PHASE1D-005 の push 時に判明した未対応アラートを放置せず、公開直後のうちに危険度を確定させるため
- 本サイトは SSG + Workers（静的配信 + Contact API のみ）であり、build 時にしか使わない依存の脆弱性と runtime に露出する脆弱性では危険度が大きく異なる。この区別を付けて記録し、以後のアラート対応の基準にするため
- 関連: PHASE1D-007（GitHub セキュリティ通知の有効化確認を持つ。既存アラートの仕分けは本 PBI が担当）/ docs/incident-response.md §2

## 受け入れ条件
- [x] critical 1 件を最優先で内容確認し、露出経路（runtime / build 時のみ / devDependencies のみ）と対応方針を確定
- [x] 残る全アラートを仕分け：パッケージ / severity / 露出区分（runtime・build・dev）/ 処置（更新 or dismiss）の一覧を実装ログに記録
- [x] 実害あり（または更新コストが低い）ものは依存更新で解消：`yarn up` 等のレジストリアクセスは devcontainer 内セッションまたは運営者ターミナルで実行（母艦 sandbox は registry.npmjs.org へ DNS 不可）
- [x] 実害なしと判断したものは GitHub 上で理由付き dismiss（判断根拠は実装ログにも残す）
- [x] 対応後、open アラートが「対応不要と判断済みのもの 0 件」になっていることを Security タブで確認
- [x] 依存更新を行った場合：`yarn build` / `yarn check` / `yarn test:run` がローカル（devcontainer）で成功
- [x] ローカル スクショ確認：依存更新がサイト出力に影響し得るため主要ページで表示回帰がないことを確認（更新が devDependencies のみで build 出力不変なら N/A 化可）（CLAUDE.md §7）
- [x] CF preview スクショ確認：同上（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`。lockfile 変更で Quality Checks / UI Tests が走るため実確認する）（CLAUDE.md §7）
- [x] 再発防止：CI に依存の脆弱性チェックを追加（本番依存の high 以上をゲート）。GitHub の Dependabot は既定ブランチしか走査せず、feat/* に積み上げた依存を誰も見ていなかったため（2026-08-09 運営者決定）
- [x] 旧スタック時代の Dependabot PR 9 本をクローズ（2026-08-09 運営者決定で本 PBI に追加）

## 技術メモ
- アラートの閲覧・dismiss は GitHub → Security → Dependabot alerts（ブラウザ。母艦の gh CLI は sandbox で不可、curl は api.github.com 可）
- 仕分けの観点：本番 runtime は「Workers が静的アセットを配信 + /api/contact」だけ。Astro / Vite / Tailwind 等のビルドチェーンは build 時のみ実行され、悪意ある入力を処理しない（入力は自リポジトリのソースのみ）ため、多くの transitive 脆弱性は実害なしになる見込み。ただし critical と、Contact API の runtime 依存に掛かるものは個別精査
- 依存更新は minor / patch の範囲を基本とし、major が必要な場合は影響を確認のうえ運営者に判断を仰ぐ
- PHASE1D-006 と並行可（本 PBI は Security タブ + 依存ファイルのみ、006 はダッシュボード設定のみで衝突しない。INDEX.md のみ共有 → pull → 記入 → 即コミットで運用。README §9）
- 想定セッション数: 1（更新対象が多く major を跨ぐ場合は 2 セッション目で更新分を分離）

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-09

#### なぜ開発中に気付けなかったか（起票時に分かっていなかった前提）

3 つ重なっていた。

1. GitHub 側の走査対象は既定ブランチ（main）だけ。公式リファレンスは `target-branch` の項で「セキュリティ更新は常にリポジトリの既定ブランチを使う」と明記しており、PR に付く dependency review も既定ブランチ向けの PR が対象
2. その main の中身が 2026-08-08 まで旧スタック（Vite / React / Chakra）の lockfile だった。作業は `feat/phase-1` に集約する方針（README §10.3）のため、Astro 構成の依存は一度も走査されていない。旧スタック向けの Dependabot PR が 9 本 open のまま残っていたのがその証拠
3. 手元にも検知工程が無い。`quality.yml` も `lefthook.yml` も lint / 型 / テスト / build だけ

→ 3 を埋めるため、運営者決定のうえ `quality.yml` に audit 工程を追加した（後述）。

#### 仕分け結果

GitHub の open アラート 61 件（critical 1 / high 16 / medium 36 / low 8。runtime 24 / development 37）を `gh api` で全件取得し、`yarn npm audit --all --recursive`（手元 71 件。GitHub とは重複統合の単位が違う）と突き合わせた。判定は yarn.lock の実解決バージョンを各アラートの脆弱バージョン範囲に semver で当てる方式（機械照合）。

更新で解消：57 件。

| 件数 | パッケージ | 区分 | severity | 解決先 |
|---|---|---|---|---|
| 18 | undici | dev | high 4 / medium 10 / low 4 | 6.28.0・7.29.0 |
| 15 | hono | dev | high 1 / medium 13 / low 1 | 4.13.1 |
| 6 | tar | runtime | **critical 1** / high 1 / medium 4 | 7.5.22 |
| 3 | js-yaml | runtime | high 2 / medium 1 | 4.3.1 |
| 3 | fast-uri | dev | high 3 | 3.1.5 |
| 3 | ip-address | dev | high 1 / medium 2 | 10.4.0 |
| 2 | postcss | dev | high 1 / medium 1 | 8.5.26 |
| 1 | sharp | runtime | high 1 | 0.35.3 |
| 1 | svgo | runtime | high 1 | 4.0.2 |
| 1 | @astrojs/rss | runtime | medium 1 | 4.0.19 |
| 1 | brace-expansion | dev | high 1 | 5.0.9 |
| 1 | @babel/core | runtime | low 1 | 7.29.7 |
| 1 | esbuild | runtime | low 1 | 0.28.1 |
| 1 | qs | dev | medium 1 | 6.15.3 |

critical（node-tar の解凍 DoS）の露出経路：`fsevents`（macOS 専用の optional 依存）→ `node-gyp` → `tar`。ネイティブビルド時にしか動かず本番 runtime に載らない。ただし範囲内に 7.5.22 があったため dismiss せず更新で消した。

残り 4 件（理由付き dismiss、いずれも「Vulnerable code is not actually used」）：

- #165 astro / medium — Reflected XSS via View Transition animation properties。View Transitions 未使用（`ClientRouter` / `transition:*` の使用箇所は src/ 全体で 0 件）。修正版 7.1.0
- #167 astro / low — XSS via `transition:*` on hydrated islands。同じ理由で到達しない。修正版 7.0.4
- #169 astro / medium — XSS via unescaped spread attribute names。`.astro` 内のスプレッド属性が 0 件、かつ SSG でビルド時の入力は自リポジトリのソースのみ。修正版 7.0.6
- #172 @hono/node-server / medium — Windows の serve-static のパストラバーサル。開発用 CLI shadcn の依存（shadcn → MCP SDK → @hono/node-server）で本番 Worker に含まれず、SDK の指定が `^1.19.9` なので修正版 2.0.5 はメジャー更新となり到達不可。かつ当該サーバーを起動していない

Astro 6 → 7 のメジャー更新（上記 astro 3 件の根本解消）は運営者判断で本 PBI 対象外とし、申し送りにした。

#### やったこと

- 範囲内の更新：`yarn up shadcn @astrojs/rss` + `yarn up -R hono @hono/node-server ip-address qs body-parser tar undici brace-expansion fast-uri js-yaml nanoid postcss svgo yaml @babel/core`
- 範囲外は `resolutions` で解消（既存の `devalue` / `vite` と同じ手法）：`sharp` 0.35.3（astro の指定は `^0.34.0`。libvips CVE 4 本）/ `esbuild` 0.28.1（vite 7.3.6 が `^0.27.0 || ^0.28.0` を受ける）/ `yaml-language-server/yaml` 2.9.0（`yaml-language-server` が 2.7.1 を厳密指定していて `-R` では動かない）
- `.github/dependabot.yml`：公式リファレンスに存在しないキー 3 つ（`security-updates-only` / `auto-merge` / `require-tests`）を削除。通常のバージョン更新が乱立しないよう minor+patch を 1 本にまとめる `groups` を追加。push 後 GitHub の設定検証 check-run が success になったことを確認
- `.github/workflows/quality.yml`：`yarn npm audit --all --recursive --severity high --environment production` を build の後に追加

#### 想定外

- **shadcn は開発用 CLI ではなく本番 CSS にも入っていた**。`src/styles/global.css` が `@import "shadcn/tailwind.css"` で取り込んでおり、4.16.2 で追加された shimmer / scroll-fade の土台（`@property` 宣言と reduced-motion 用の `.shimmer`）が常に出力されて未使用 CSS が 899 B（brotli 131 B）増えた。PHASE1C-010 で削った brotli 520 B の 4 分の 1 に当たる。取り込みを外して測ると 33,303 B / brotli 5,763 B でハッシュまで更新前と完全一致、つまり**旧 4.7.0 のスタイルシートは 1 バイトも寄与していなかった**。唯一の shadcn 部品 `button.tsx` も提供物（accordion キーフレーム・`data-open` 等の変種・shimmer / scroll-fade）を 1 つも使っていない → 運営者判断で `@import` を削除し、戻す条件を global.css にコメントで残した
- **PAT の権限が 3 回足りなかった**。① Dependabot alerts API が 403（→ Read を付与）② `.github/workflows/` の push が `without workflow scope` で拒否（→ Workflows: Read and write を付与。付与待ちの間は CI 工程だけ別コミットに分離して依存更新分を先に push した）③ 旧 PR のクローズが 403（→ Pull requests: Read and write を付与）。いずれも都度運営者に画面操作を依頼した
- **push 競合**：並行セッションの PHASE1D-006 完了コミットが先に入っていたため rebase して取り込んだ（README §9 の想定どおり、共有は INDEX.md のみで衝突なし）
- **アラートは main マージまで閉じない**。`feat/phase-1` に修正を積んでも既定ブランチの依存グラフは変わらないため、57 件は open のまま。実際に閉じるのは main マージ後

#### 学び

- `yarn up -R <pkg>` は「その範囲を全部再解決する」モードで、transitive の脆弱性はこれでほぼ片付く。外れるのは ① 親が厳密指定しているもの（`yaml-language-server` の yaml）② 修正版が親の範囲の外にあるもの（sharp / esbuild）だけ。この 2 つだけ `resolutions` で拾えばよい
- 「発生源のパッケージを外す」より先に「更新で届くか」を測る。当初は shadcn を外して 23 件消す案だったが、実測すると 21 件は更新だけで消え、外す必要がなかった
- 依存だけを変えた回の回帰確認は、変更前の `dist/` を保存して `diff -rq` するのが一番強い。今回は全ファイルバイト単位で一致し、スクショ確認より確実な証拠になった
- コンテナから本番ドメイン `byte-lark.com` へは到達できない（DNS は解決するが接続拒否＝firewall の許可リスト外）。本番の確認は Workers のエイリアス `byte-lark.tanimoto-a49.workers.dev` で代替できる

#### 検証結果

- ローカル：`yarn build` / `check` / `check:ts` / `test:run` 全成功。更新前の `dist/` と `diff -rq` して全ファイルバイト一致。主要 7 ページ × デスクトップ / モバイルのスクショで崩れ 0
- CF preview（`feat-phase-1-byte-lark.tanimoto-a49.workers.dev`）：同 7 ページ × 2 幅を確認、配信 CSS ハッシュ `BaseLayout.Du6DNnFp.css` がローカル build と一致
- CI：`feat/phase-1` の HEAD `13d61c0` で Quality Checks / UI Tests / Workers Builds すべて success。新設の `Audit dependencies` 工程も success。`.github/dependabot.yml` の設定検証 check-run も success（不正キー解消の裏取り）
- main マージ（`7f31b94`）後：quality / e2e / Workers Builds / CodeQL 3 種すべて success。本番 Worker で全 11 ページ 200、配信 CSS ハッシュもローカル build と一致
- Dependabot アラート：**open 0 件**（fixed 194 / dismissed 4）。マージ前は open 57 だったものが依存グラフの更新で fixed に落ちた

#### 旧 Dependabot PR の整理と、その直後に起きたこと

旧スタック（Vite / React / Chakra）時代の PR 9 本（#16 form-data / #19 tar-fs / #20 playwright / #21 vite 6.4 / #22 js-yaml 3.14 / #23 storybook / #24 tar 6.2 / #25 lodash / #26 axios）を理由コメント付きでクローズし、ブランチも削除した。対象パッケージは axios / lodash / storybook / tar-fs / form-data が現 lockfile に 0 件、残る 4 本は現在より古いバージョンへの更新だった。

クローズ直後に Dependabot が**新しいバージョン更新 PR を 5 本作成**した。不正キーによる設定エラーを解消したことで、通常のバージョン更新が初めて機能した形（設定修正の効果がそのまま観測できた）：

- #29 `npm-minor-patch group with 17 updates` — 追加した `groups` が働き 17 件が 1 本にまとまった
- #30 `@astrojs/react` 6.0.2 / #31 `@astrojs/mdx` 7.0.5 / #32 `jsdom` 30.0.1 — メジャーは意図どおり個別
- #33 `astro` 7.1.6 — 本 PBI で dismiss した astro 3 件の根本解消にあたる

これら 5 本の処置は本 PBI の対象外（脆弱性ではなくバージョン更新）。#33 は下記の申し送りで扱う。

#### 次 Phase / 他 PBI への申し送り

- Astro 6 → 7 のメジャー更新。dismiss した astro 3 件（#165 / #167 / #169）の根本解消。全ページの表示回帰確認を伴うため独立 PBI が妥当。Dependabot PR #33（astro 7.1.6）が受け皿として使える
- Dependabot のバージョン更新 PR 5 本（#29〜#33）の処置方針。設定修正で今後は毎週 minor+patch がまとまった 1 本 + メジャー個別で届くため、受け方（マージ判断の基準・誰がいつ見るか）を決める必要がある
- README §10.9 は「main は直接 push 禁止（PR 経由のみ）」と書いているが、実際には保護が掛かっていない（API で `protected: false`）。本 PBI のマージは直接 push で通した。保護を掛けるなら bypass を空にする必要がある（コンテナの PAT は運営者本人として動くため、管理者を例外に含めると PAT もすり抜ける）。掛けた場合は README §10.6 の `git push origin main` 手順も PR 経由へ書き換えが必要 → **同日中に解消（下記 事後追記）**
- devcontainer の PAT に本 PBI で 3 つ権限を追加した（Dependabot alerts: Read / Workflows: Read and write / Pull requests: Read and write）。Administration は**意図的に付与していない**（ruleset を書き換えられる権限を自走環境に渡すと main 保護の歯止めが意味を失うため）

### 2026-08-09 事後追記：main 保護の申し送りを解消

上記申し送りのうち README §10.9 のずれは同日中に解消した（起票は 2026-08-08、着手・完了は 2026-08-09）。

- 運営者が GitHub の ruleset「main protection」を作成（対象は既定ブランチのみ / Enforcement Active / bypass list 空 / PR 必須（承認 0）/ 必須チェック `quality`・`e2e` / force push 禁止・削除禁止・作成制限）。`Workers Builds: byte-lark` は必須チェックに入れていない（Cloudflare 側の取りこぼしでマージが止まるため。PHASE1C-008 実装ログ参照）
- 空コミットで main への直接 push を試し、`push declined due to repository rule violations` で拒否されることを実測（検証コミットは push されず破棄）
- README を v3.8 に改訂し §10.9 を実際の設定内容に、§10.6 の main マージ手順を PR 経由（`gh pr create` → CI green 確認 → `gh pr merge`）に書き換え。CLAUDE.md / site-plan の README 参照も同期（`f67d772`）
- ruleset の作成は API では 403（Administration 権限が必要）。この権限は上記の理由で PAT に付与しない方針とし、運営者の画面操作で実施した

残る申し送りは Astro 6 → 7 のメジャー更新と、Dependabot バージョン更新 PR 5 本（#29〜#33）の受け方の 2 件。

### 2026-08-09 事後追記：他セッションの変更を巻き込んだ件と再発防止

本 PBI の仕分け完了コミット `0d2d64c` に、母艦セッションが作業ツリーに置いていた `docs/article-backlog.md` の未コミット変更（T9 の追記）が入ってしまった。原因は `git add -A` を使ったこと。母艦（`/Users/kazuya/src/byte-lark.com`）とコンテナ（`/workspace`）は bind mount で同じ作業ツリーを共有しているため、sweep 系のステージ操作は相手の編集をそのまま拾う。内容は失われていないが変更の帰属がずれた。共有履歴を書き換える価値はないと判断し `0d2d64c` はそのまま残す。

再発防止は `.claude/settings.json` の `permissions.deny` で行う。`git add` / `git stage` の `-A` / `-u` / `--all` / `--update` / `.` / `./` / `:/`、`git commit` の `-a` / `--all` を並べた。当初は PreToolUse フックをスクリプトに切り出す案で作りかけたが、公式ドキュメントを読み直して deny に切り替えた。

deny を選んだ根拠（すべて公式ドキュメントで確認）：

- 評価順は deny → ask → allow。スコープをまたいで deny が勝つ
- `bypassPermissions` モードでも効く。「These controls apply in every mode, including `bypassPermissions`: deny rules and explicit ask rules」。コンテナは `--dangerously-skip-permissions` で動くのでここが要点
- 複合コマンドはサブコマンドごとに独立照合される。「The recognized command separators are `&&`, `||`, `;`, `|`, `|&`, `&`, and newlines. A rule must match each subcommand independently」。`cd /workspace && git add -A` も捕まる
- 照合の記号は `*` のみ。`.` は文字通りなので `Bash(git add .)` は完全一致になる
- スクリプトファイルが不要。リポジトリ設定に置けば別名 clone は pull だけで入り、母艦セッションにもコンテナセッションにも効く

置き場所を 2 段に分けた。このサイトの repo 系はリポジトリ設定（git 配布）、それ以外の repo は母艦の dotfiles の user 設定。コンテナの `~/.claude` は devcontainer ごとに独立した volume なので、そこに置くとコンテナごとの作業になり採用しなかった。

残る限界：

- 前方一致なので「引数のどこかに `-a` がある」を完全には表現できない。`git commit -a` / `-am` / `-a -m` と末尾の `-a` は塞いだが、途中に挟まる形は通る
- `git add *` は `*` が照合の記号なので文字通りには書けない
- `git add docs/` のようにディレクトリ単位で他セッションの変更を拾う経路は止められない
- deny は Claude の Bash ツールにしか効かない。ターミナルでの手打ちは対象外（git に `add` 用フックが無いため、git 側では止められない）

`-u` / `--update` / `git stage` は運営者の指示リストには無かったが、追跡済みファイルの変更を一括で拾う点で `-a` と同じ性質なので同時に塞いだ。

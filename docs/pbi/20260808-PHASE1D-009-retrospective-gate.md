# 運営者と Claude は Phase 1d 完了状態（公開成立）を確認し、次 Phase への学びを申し送ることができる

Status: Done
Started: 2026-08-10
Completed: 2026-08-10

## 誰が
- 運営者 + Claude（Gate PBI の例外。README §4.3）

## 何をできる
- Phase 1d の全 PBI が Done になり、サイトが本番ドメインで公開・監視されている状態を確認できる
- Phase 1d で得た知見・想定外を集約し、次 Phase（1e 以降）起票時の参考資料として明文化できる

## なんのために
- 公開作業の学び（NS 移管・本番計測・監視点火の実際）が記録されないまま定常運用に入るリスクを排除するため
- 関連: site-plan §7（ロードマップの Retrospective Gate）/ Phase 1d / Phase 1e

## 受け入れ条件

### Phase 1d 完了確認
- [x] PHASE1D-001〜008 のすべてが Status: Done（Done を打つ直前にスナップショットを取り直す。1C-012 の学び：Gate 実施中に Phase 内 PBI が増えうる）→ 期中追加の 010〜016 を含む非 Gate 15 件すべて Done
- [x] `docs/pbi/INDEX.md` の Phase 1d セクションがすべて `[Done]` 表示（009 は本 Gate）
- [x] main で `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がすべて成功 + CI green
- [x] https://byte-lark.com が正常表示（公開状態の最終確認）

### 学びの集約
- [x] 本 PBI の `## 次 Phase への申し送り` セクションに記入：確定した技術前提（実際に動いた構成）/ 発生した想定外と回避策 / 計画書と実態の差分 / 次 Phase 起票時の注意
- [x] 申し送り棚卸し（README §4.6 ルール 8）：Phase 1d 全 PBI の実装ログにある申し送り・積み残しを項目単位で列挙し、PBI 化 / 持ち越し / 破棄 のいずれかに判定して表にする。前 Gate（PHASE1C-012）の持ち越し項目（フォント転送量 / T1 記事の「最良モデル」ブログ URL 未特定 / ダークモード関連が 001 で申し送りになった場合はその分）も同じ表で再判定する
- [x] 次の動き方を運営者と確認：Phase 1e を「公開後の運用・改善」に再定義（Decision #31 ②）。小さな手入れ 6 件から着手し、カテゴリ別一覧（FR-19）+ 前後記事リンクは記事 10 本到達時に同 Phase へ追加起票。Phase 2 は記事 30 本以上。当面は R-01 月次 routine を起点にした記事追加が主活動

### CLAUDE.md / site-plan / README の整合確認
- [x] 公開後の実態に合わせた更新の要否判断と実施：CLAUDE.md のブランチ運用（1d 完了後は main 起点の短命ブランチ、README §10.3 / §10.6）・CF preview 検証手順の扱い（branch alias はブランチ名から決まる形に一般化）・site-plan §13 現在地（§13.2 移行期のままで実態と一致、修正不要）
- [x] site-plan §14 の全パターンで grep し、連動更新漏れがないこと

### 完了処理
- [x] 本 PBI の Status を Done に更新、INDEX.md 同期
- [x] ローカル スクショ確認：N/A（本 Gate の変更は docs のみ）（CLAUDE.md §7）
- [x] CF preview スクショ確認：N/A（同上）（CLAUDE.md §7）
- [x] E2E / CI green 確認（Gate 通過判定として HEAD の CI green を `scripts/ci-status.sh` で別途確認）（CLAUDE.md §7）

### 次セッションへのトリガー
- [x] 本 PBI が Done になった時点で、次セッションは **Phase 1e PBI の起票**（PHASE1E-001＝公開後の小さな手入れ 6 件。上の「次 Phase 起票時の注意」を反映）を最初のタスクとして実行可能

## 技術メモ
- 想定セッション数: 1
- PHASE0-010 / PHASE1A-022 / PHASE1B-014 / PHASE1C-012 と同じ Gate 構造

## 備考
- Phase 1d（公開）の Retrospective Gate。draft-phase1d-domain-launch.md の正式化群の締め

## 次 Phase への申し送り

### 確定した技術前提（実際に動いた構成）

公開後の本番はこの形で動いている。次 Phase はここを出発点にしてよい。

- ドメインと DNS：`byte-lark.com` の DNS 管理は Cloudflare（Free、Worker と同一アカウント）。正規ホストは www なしの apex で、www は AAAA `100::` Proxied + Redirect Rule で 301。メールは Xserver のまま（MX は `sv16806.xserver.jp` 直指し、SPF / DKIM 2 本 / DMARC `p=none`）。切り戻し先として Xserver 側のゾーンを温存中（PHASE1D-003 / 004 / 005）
- 配信：Cloudflare Workers の静的アセット。`public/_headers` で `_astro/*` を 1 年 `immutable`、HTML は毎回再検証。HSTS は `max-age=15552000`（includeSubDomains なし / preload なし）。他のセキュリティヘッダは付けていない（PHASE1D-007 / 010）
- 速度：本番 Lighthouse Performance は 11 ページとも 91〜100（FCP 1.5〜1.7 秒 / TBT 0ms / CLS 0〜0.005）。実ユーザー計測（CF Web Analytics）も LCP P75 620ms で CWV 3 指標とも Good（PHASE1D-006 / 010）
- フォント：サイトに出てくる字だけに絞った 1 ファミリ 1 ファイル（`scripts/subset-fonts.mjs`、`subset-font` の harfbuzz wasm）。元フォントは google/fonts をコミット固定 + sha256 照合で取得しキャッシュに置くので、通常のビルドと CI はネットワークに触らない。**記事を足したら `yarn fonts` が要る**。回し忘れは CI の `yarn fonts:check` が止める（PHASE1D-010）
- 監視：Xserver の cron が 10 分間隔で `scripts/health-check.sh` を叩き、HTTP 200 / 改ざんカナリア 2 種 / 配信ヘッダ / TLS 残日数の 4 点を見る。2 回連続の異常でメール通知、復旧時も 1 通。**通知はメール単線**（冗長性なしを承知の選択。PHASE1D-007）
- リポジトリの守り：main は ruleset で保護（bypass 空 / PR 必須 / 必須チェック `quality`・`e2e`）。CodeQL は default setup、Secret scanning と Push protection は有効、`quality.yml` に `yarn npm audit` 工程あり。Dependabot は `groups` で minor+patch がまとまった 1 本 + メジャー個別で届く（PHASE1D-007 / 011 / 012）
- 依存：Astro 7.2.0 / Vite 8 系。`resolutions` は `stream-replace-string` のパッチと `yaml-language-server/yaml` の 2 つだけ（どちらも開発時のみ）。`ui-tests.yml` が固定する Playwright 公式コンテナのタグは **Dependabot の守備範囲外なので人が合わせる**（PHASE1D-012）
- 記事ネタの供給：claude.ai のルーチン `trig_01UP6sJ44uiN5tqn9eEv5Gru`（毎月 1 日 9:07 JST）が `docs/article-backlog.md` に 3 案を追記する PR を main 宛に出す。PR はドラフトで届くので `gh pr ready` が要る（PHASE1D-008）

### 発生した想定外と回避策

- 本番の `_astro/*` が `max-age=0, must-revalidate` で配られており、内容ハッシュ付きの名前なのに毎回再検証していた。そのせいで `font-display: optional` の本文フォントが一度も画面に出ていなかった → `public/_headers` で `immutable` に。Cloudflare Workers の静的アセット配信は `_headers` を読む（PHASE1D-010）
- 差の小さい速度の判断をローカルの静的サーバーで計ると結論が逆になる（FCP がローカル 3 秒台 / CF preview 0.9〜1.4 秒）。本文フォントの preload はローカルでは有利に見えて、CF preview で計り直すと 11 ページ中 10 ページで LCP が 1.5〜2.7 秒悪化した（PHASE1D-010）
- カスタムドメイン接続は「同名の既存 DNS レコードがあると拒否」される。apex A を消してから接続、が正順（PHASE1D-004）
- NS 移管直後の公開だったため、運営者のルーターが旧 NS 委任をキャッシュして旧サイトを返し続けた。DoH（`cloudflare-dns.com` / `dns.google`）は新 IP を返すので切り分けに使える。ゾーン温存の既知の副作用で設定ミスではない（PHASE1D-004）
- 統合ブランチで作業している間、main は前回マージ時点で止まる。「本番で確認してください」と案内する前に、本番が最新かを確かめる。1D-008 では 4 コミット分（013〜016）遅れていた（PHASE1D-008）
- `git add -A` は bind mount で作業ツリーを共有する別セッションの未コミット変更を巻き込む。`.claude/settings.json` の `permissions.deny` で塞いだ（`bypassPermissions` でも deny は効く）。残る限界：`git add docs/` のようなディレクトリ単位、ターミナルでの手打ち（PHASE1D-011）
- GitHub の走査対象は既定ブランチだけ。統合ブランチに積んでいる間、依存の脆弱性は一度も見られていなかった（main マージ時に 61 件が一度に出た）。手元の CI に audit 工程を置いて塞いだ（PHASE1D-011）
- 設定画面にトグルが出ないことを「public だから常時有効」と推測したが誤りで、API で取ると Secret scanning / Push protection とも disabled だった。画面に無い設定は API で実値を取る（PHASE1D-007）
- `@playwright/test` を上げると `ui-tests.yml` の公式コンテナタグとずれて E2E が全件落ちる。ファイル内に注意書きがあっても Dependabot は直さない（PHASE1D-012）
- Astro 7 は preview サーバーの情報を `.astro/preview.json` に書く。直前の E2E が残したロックを生きたサーバーとみなして 2 本目の起動を拒否し、エラーが案内する `--force` は実装されていない。ロックファイルを消してから起動する（PHASE1D-012）
- `yarn test:e2e` は 4321 に preview が生きていることが前提（`reuseExistingServer`）。古い dev サーバーが 4321 を掴んでいるとビルド前のコードでテストが走る（PHASE1D-016）
- コンテナの firewall は `challenges.cloudflare.com`（Turnstile）と GitHub Actions の成果物置き場（`*.blob.core.windows.net`）に届かない。前者はスクショが同寸法のスタブ、後者は母艦から `gh run download` で回避（PHASE1D-012 / 016）
- 確認の段階を足すと、それまで表に出なかった「Turnstile のトークンは 1 回しか使えない」性質が普通の動線に乗る。画面を増やす変更では、寿命を持つ状態を一通り洗い直す（PHASE1D-016）
- 大きさ・強さに関わる見た目の変更は、スクショ比較で選べても実物の圧までは伝わらない。選定後も本実装の preview で運営者確認を挟んでから Done に進める（PHASE1D-014）

### 計画書と実態の差分

本 Gate で以下を検出し、いずれもクラリフィケーション（決定内容は不変）として同コミットで修正した。site-plan / README の version 番号は据え置き。

- README §10.1 / §10.2 / §10.3 の「`feat/phase-1` は 1a〜1c を集約」は実態と違う。Phase 1d も同じブランチで進め、公開後も 013〜016 と 010 をここに積んだ → 「1a〜1d」に修正
- README §10.6 の「main へのマージは公開フェーズで**一度だけ**」も実態と違う。1d 中に 4 回（`01239b9` 公開 / `2fee28f` プライバシーポリシー / `733662e` PR #35 / `9555d6d` PR #36）マージしている → 「公開時に初回、以後は 1d の期中も随時」に修正
- operation-manual.md §1 の main マージ手順が `git merge --no-ff` + push のまま。main は 2026-08-09 から ruleset で直接 push できず、README §10.6 は PR 経由に書き換わっている（PHASE1D-011）→ PR 経由に修正
- site-plan §6.7 の既存資産取扱表が `docs/site-plan.md | 上書き（v2 → v3.8）` のまま（本体は v3.12）→ 修正
- site-plan §7 のフロー図の `[現在地]` が「Phase 0 PBI 起票済」を指したまま → 公開後の現在地に修正
- site-plan §12「次アクション」が Phase 0 着手前の 7 項目のまま → 公開後の実態に書き換え
- site-plan §13 の現在地（§13.2 移行期、2026/06〜2026/09 想定）は実態と一致。修正不要
- §14 の全パターンで grep した結果、version 参照（site-plan v3.12 / README v3.8）の連動は §6.7 の 1 件を除いて漏れなし

### 次 Phase 起票時の注意

- Phase 1e（カテゴリ別一覧）の起票条件は記事 10 本以上（FR-19）。現在 3 本
- 1e には記事末尾の前後記事リンクを含める（PHASE1D-015 から移管、2026-08-09 運営者判断）。`/blog/tech` `/blog/life` が実 URL になれば、一覧の並びと前後の並びが仕掛けなしで一致する
- 最初に着手するのは **PHASE1E-001（公開後の小さな手入れ 6 件）**。棚卸し表で「まとめて PBI 化」と判定した分（運営者決定 2026-08-10）
  1. `yarn fonts` を `docs/writing-workflow.md` に書く（記事を足すたびに必要だが執筆手順に無く、今は CI の `fonts:check` が落ちて初めて気づく。記事追加が当面の主活動なので最優先）
  2. `BaseLayout.astro` に `<link rel="alternate" type="application/rss+xml">` を足す
  3. `scripts/lighthouse-audit.sh` の `BASE` 既定値を本番に変える
  4. `astro.config.mjs` の sitemap 除外フィルタから `/sample-highlight/` を外す
  5. `yarn check`（Biome）の対象に `worker/` `scripts/` `tests/` を足す
  6. `src/lib/jsonld.ts` のオリジンを `Astro.site` に追随させる
- 全 PBI に §7 検証ゲート 3 項目を常設する（README §4.6 ルール 7。非該当は `[x] …：N/A（理由）`）
- CF preview の branch alias URL は作業ブランチ名で決まる。`feat/phase-1` を畳んだ後は URL が変わるので、CLAUDE.md §7 の固定 URL をそのまま使わない

### 申し送り棚卸し表（README §4.6 ルール 8）

Phase 1d 全 PBI（001〜008 / 010〜016）の実装ログと、前 Gate（PHASE1C-012）の持ち越し 16 件を項目単位で判定した。

**前 Gate（PHASE1C-012）からの持ち越しの再判定**

| 出典 | 項目 | 判定 |
|---|---|---|
| 1C-002 / 004 / 005 | ダークモードの実表示検証 | 1D-001 で全 11 ページ × 2 幅を実表示して**見送りを決定**。再着手時の出発点 3 件（`--color-hibari-*` と `--shadow-card` が `@theme inline` 側でダーク再定義されない / Skills アイコン 34 件は `<img>` 参照で `currentColor` が効かない / favicon は sky 直書き）は下表で再判定 |
| 1C-003 / 007 / 010 | フォント転送量のサブセット化 | 消化（PHASE1D-010） |
| 1C-005 | iOS ホーム画面アイコンの実表示 | 消化（PHASE1D-008、運営者実機・問題なし） |
| 1C-007 | 実記事での CLS 測り直し | 消化（PHASE1D-004 / 010、本番実記事で 0〜0.005） |
| 1C-009 | `prefers-reduced-motion` 時の即時ジャンプの実機確認 | 消化（PHASE1D-008、運営者実機） |
| 1C-013 | Hero スマホ構図の iPhone 実機確認 | 消化（PHASE1D-008） |
| 1C-014 | Skills アイコンの iPhone 実機確認 | 消化（PHASE1D-008） |
| 1C-014 | アイコンのライセンス表記をサイト上でも示すか | 消化（PHASE1D-001 で `/credits` を新設。1D-010 で書体の出典と OFL も追加） |
| 1B-008 / 012 | 記事 `publishedAt` を実公開日に更新 | 消化（PHASE1D-004、3 本とも 2026-08-08） |
| 1B-004 / 1A-022 | Contact 本番ドメイン確認 + Resend DNS + 疎通テスト | 消化（PHASE1D-003 / 004） |
| 1B-015 | main の CodeQL 週次 cron 無効化 | 消化（自前 `codeql.yml` は削除済みで cron 自体が存在しない。main の `Analyze` 3 種は default setup で success） |
| 1B-015 | medium alert クローズの確認 | 消化（PHASE1D-008、全 6 件 fixed / open 0 件） |
| 1B-003 | 法人化対応 PBI | 消化（PHASE1D-002） |
| 1A-022 | Lighthouse Performance / SEO 正式判定 | 消化（PHASE1D-004 / 010、本番 11 ページで Performance 91〜100 / SEO 100） |
| 1B-007 | R-01 月次ネタ出し routine の点火 | 消化（PHASE1D-008） |
| 1B-008 | 「最良モデルを使え」の中の人ブログ URL 未特定 | 持ち越し（軽微。運営者が思い出した時に追記） |

**Phase 1d の実装ログから出た項目**

| 出典 | 項目 | 判定 |
|---|---|---|
| 1D-001 | ダークモード再着手時の 3 件（トークン / アイコン / favicon） | **破棄**（運営者決定 2026-08-10：やらないと確定。site-plan Decision #31 ③）。再着手したくなった時の出発点は本 Gate の上表に残してある |
| 1D-001 | `scripts/lighthouse-audit.sh` の `BASE` 既定値が preview URL のまま。引数なしで叩くと本番を測らない | 未処置 → まとめて PBI 化 |
| 1D-001 | `BaseLayout.astro` に `<link rel="alternate" type="application/rss+xml">` が無く、`/rss.xml` は配信されているのに HTML から辿れない | 未処置 → まとめて PBI 化 |
| 1D-001 | `astro.config.mjs` の sitemap 除外フィルタが、存在しない `/sample-highlight/` を指したまま | 未処置 → まとめて PBI 化 |
| 1D-001 | `yarn check`（Biome）の対象が `src` だけで、`worker/` `scripts/` `tests/` は未チェック | 未処置 → まとめて PBI 化 |
| 1D-001 | `src/lib/jsonld.ts` がオリジンをベタ書き（値は正しいが `Astro.site` に追随しない） | 未処置 → まとめて PBI 化 |
| 1D-001 | `.devcontainer/allowed-domains.conf` に `byte-lark.com` が無い | 破棄（解消済み。現在は登録されており、本 Gate でコンテナから本番へ到達できることを実測） |
| 1D-010 | 記事追加時の `yarn fonts` が `writing-workflow.md` に無い | 未処置 → まとめて PBI 化（記事追加が当面の主活動なので優先度は上の 5 件より高い） |
| 1D-002 | devcontainer の firewall が e-Gov・個人情報保護委員会を遮断する | 持ち越し（法令の一次確認が続くなら許可先を足す。今は WebSearch で代替できている） |
| 1D-003 | 切り戻し用に温存している Xserver 側 DNS ゾーンをいつ畳むか | 持ち越し（公開から 2 日。当面は温存でよい。畳む判断は運営者） |
| 1D-005 | Netlify アカウントの削除 | 持ち越し（運営者作業。サイト本体は削除済みで 404、DNS は CF 移管済みなので支障なし） |
| 1D-006 | SNS カードの受け取り側での描画が未検証 | 持ち越し（X の公式 validator は廃止。実際に投稿する機会に実物で見て、崩れていたら起票） |
| 1D-007 | セキュリティヘッダの残り（X-Content-Type-Options / Referrer-Policy / CSP） | 持ち越し（1D-007 で選択肢として提示済み・運営者が HSTS のみ採用。必要になったら起票） |
| 1D-012 | CI で撮ったスクショをコンテナへ持ち込めない | 破棄（回避策が確立。母艦から `gh run download` で取れる。firewall の許可先は run ごとに変わるので構造的に塞げない） |
| 1D-012 | Playwright 公式コンテナのタグを人が合わせる | 破棄（operation-manual §7 に恒久運用として記載済み） |
| 1D-012 | Dependabot PR は main 基点でロックファイルが食い違うためマージせずクローズ | 破棄（operation-manual §7 に恒久ルールとして記載済み） |
| 1D-011 | `git add -A` 禁止の残る限界（ディレクトリ単位・ターミナル手打ち） | 破棄（deny で主経路は塞いだ。残りは仕組みで塞げない性質のもの） |
| 1D-013 / 016 | 本番 Turnstile を通した実送信（メールが届くところまで）が未実施 | 持ち越し（PHASE1B-004 / 1D-003 で実測済みかつリクエストの中身は変えていない。次に運営者がフォームを触る機会に 1 回通す） |
| 1D-016 | 本物の Turnstile ウィジェットの見た目と実時間 300 秒での失効 | 持ち越し（コンテナから `challenges.cloudflare.com` に到達できない。上の実送信と同じ機会に見る） |
| 1D-015 | 記事末尾の前後記事リンク | Phase 1e へ移管済み（2026-08-09 運営者判断。INDEX.md の Phase 1e 節に記載） |
| 1D-008 | R-01 ルーチンの次回実行（2026-09-01） | 破棄（申し送りではなく定常運用。手順は operation-manual §8） |

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-10 Gate 実施

#### Phase 1d 完了確認

- 非 Gate PBI 15 件（001〜008 / 010〜016）すべて `Status: Done`（各ファイルの Status 行を機械照合）。INDEX.md の Phase 1d 表とも一致
- INDEX.md セッション開始チェック 3 種すべて該当なし
- `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` すべて成功（終了コード 0）
- CI：`feat/phase-1` HEAD `96c52da` で Quality Checks / UI Tests とも success、check-runs も `quality` / `e2e` / `Workers Builds: byte-lark` すべて success。main（`9555d6d`）も quality / e2e / Workers Builds / Analyze 3 種すべて success
- 本番：`https://byte-lark.com` の全 11 ページが 200（sitemap の 11 URL + `/404`）。`strict-transport-security: max-age=15552000` あり / `X-Robots-Tag` なし / HTML は `max-age=0, must-revalidate`。コンテナの firewall からも本番へ到達できることを確認（1D-001 の申し送りが解消済みであることの裏取り）

#### 運営者決定（2026-08-10）

事実と分析を出したうえで 3 件を確定した。いずれも Gate の推奨どおり。

- **ダークモードはやらない**。1D-001 で実表示を見て見送りを決めていたが「やらない」と確定していなかったため、Gate ごとに同じ判定を繰り返していた。破棄して申し送りから外す
- **未処置の小さな手入れ 6 件は 1 本の PBI にまとめて着手**。記事 10 本（従来の Phase 1e の起票条件）を待つ理由がない。置き場所として Phase 1e を「公開後の運用・改善」に再定義し、カテゴリ別一覧は同 Phase 内の PBI として記事 10 本到達時に追加起票する
- **統合ブランチ `feat/phase-1` を畳み、main 起点の「1 作業 1 ブランチ → PR」に戻す**。未完成サイトを main に載せない遅延マージ（Decision #25）の理由は公開で消えている

3 件を site-plan Decision #31 として記録した。

#### 計画書・規約の差分修正

上の「計画書と実態の差分」の 6 件を修正した。あわせて Decision #31 を反映：

- `docs/pbi/README.md` v3.8 → **v3.9**：§10 ブランチ運用を全面改訂（§10.1 図 / §10.2 命名規則を作業種別に / §10.3〜§10.6 を main 起点の手順に / §10.7 競合対処を「main が進んで PR が古くなる」形に / §10.8 を実測した CF preview の挙動に / §10.10 Hotfix を通常フローに統合）。遅延マージ方式は §10.6 末尾に歴史として残した
- `docs/site-plan.md` v3.12 → **v3.13**：Decision #31 追加、§7 ロードマップ 1e 行・現在地図・§12 次アクションを公開後の実態に、§6.7 の自己参照 v3.8 → v3.13、§12 の README 参照 v3.8 → v3.9
- `CLAUDE.md`：ブランチ運用（統合ブランチ → main 起点）、§7 の CF preview URL をブランチ名から決まる形に一般化、Sandbox 制約、Related Docs の版数
- `docs/operation-manual.md`：シーン別表（main マージ承認 / 並行 PBI / Gate 後の起票）、Q6、必須チェックリスト、health-check.sh の取得 URL を `feat/phase-1` → `main`、監視の異常系テスト URL を汎用化

#### §14 の全パターン grep

`v3.x` / `v2.x` / PBI 件数 / ファイル参照 / 法人化表記 / Phase 名 / 運営者プロトコル / ブランチ運用 / CF branch filter の各パターンで grep した。検出した連動漏れは §6.7 の自己参照 1 件のみで、上で修正済み。site-plan §13.2（移行期 2026/06〜2026/09、現在のフェーズ）は実態と一致しており修正不要。

#### 学び

- 統合ブランチで長く作業すると、main が本番なのに「main は前回マージ時点」という二重の現在地ができる。1D-008 で実機確認の直前に 4 コミット遅れが見つかったのがその表面化で、公開後まで同じ形を続ける理由はなかった
- 「見送る」と「やらない」は別物で、確定させないと Gate ごとに同じ判定コストがかかる。破棄しても再着手の出発点を Gate に書き残せば情報は失われない
- README §10.8 は「CF は `feat/phase-*` だけ preview を作る」と書いていたが、実測すると `chore/...` でも preview ビルドが走っていた。ブランチ運用を変える判断の前提だったので、設定値の記述を信じずに check-run で確かめた

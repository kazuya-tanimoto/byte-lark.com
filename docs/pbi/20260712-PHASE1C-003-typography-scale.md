# 訪問者は確定タイポグラフィ（スケール・行間・和欧混植）で見出し・本文を読める

Status: Done
Started: 2026-07-30
Completed: 2026-07-31

## 誰が
- 訪問者

## 何をできる
- 確定したタイポスケール（見出し階層・本文サイズ・行間）と和欧混植調整のもとで、記事・各ページを読みやすく閲覧できる

## なんのために
- タイポスケール・行間・和欧混植は Phase 1a から TODO のまま（site-plan §6.5.3）。実記事が repo に入った今、実コンテンツで検証しながら確定する
- 関連: site-plan.md §6.5.3 / §8 Decision #28 / Phase 1c 先行トラック

## 受け入れ条件
- [x] PHASE1C-001 の確定方向性に基づき、見出し階層（h1〜h4）・本文・キャプションのサイズ / 行間 / ウェイトのスケールを定義し、`src/styles/global.css`（@theme トークンまたは共通スタイル）に実装（h2 の朝日ドットマーカー等の**装飾レイヤーは対象外**。下記「PHASE1C-008 との境界」参照）：`--text-xs`〜`--text-4xl` と行間の対を `@theme` に定義（12 / 14 / 16 / 17 / 20 / 24 / 32 / 42px）。見出し書体 Zen Kaku Gothic New を導入し、ウェイトは 500 / 700 の 2 段に統一
- [x] 和欧混植（Noto Sans JP × Geist）の見え方（数字・英単語混じりの本文、コード内和文コメント等）を確認・調整：**Geist を廃止**して本文を Noto Sans JP 一本に。混植の寸法差そのものを無くす形で解決した。コード内和文は等幅ファミリの後ろに Noto Sans JP を足して固定。見出しは palt + `text-wrap: balance` + `word-break: auto-phrase`
- [x] 実記事 building-this-blog-with-claude-code（コードブロック含む）+ Home / About / Career / Blog 一覧で表示検証（スクショ）：実記事は draft のため、同じ本文の一時記事（コミットせず、計測後削除）で記事詳細を検証
- [x] site-plan §6.5.3 の TODO（タイポスケール定義）を確定内容で更新：確定値一覧に差し替え。docs/design-direction.md §3 にも「確定結果」を追記
- [x] `yarn build` / `yarn check:ts` エラーなし：Biome 38 files / astro check 51 files 0 errors / Vitest 30 passed / Playwright E2E 29 passed（ローカル）
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）：Home / About / Career / Skills / Contact / Blog 一覧 / 記事詳細を 1280・390 で撮影
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）：`https://feat-phase-1-byte-lark.tanimoto-a49.workers.dev` の Home / About / Career を 1280・390 で撮影、書体・スケールとも意図どおり
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）：head b056817 で UI Tests / Quality Checks とも success

## 技術メモ
- 想定セッション数: 1
- 依存: PHASE1C-001（確定方向性）
- （起票時の想定）フォント実体は @fontsource-variable/geist + @fontsource-variable/noto-sans-jp（global.css で @import、セルフホスト。Decision #24）。フォントファミリー構成を変える場合は PHASE1C-007（読み込み戦略）への影響を実装ログに記録
  - 実装時点の実態：@import は PHASE1C-007 で廃止され、定義場所は `astro.config.mjs` の `fonts` + `scripts/fontsource-variants.mjs`。本 PBI で geist を外し @fontsource/zen-kaku-gothic-new を追加（読み込み方への影響は実装ログに記録済み）
- 記事本文は PostLayout 配下の prose 系スタイルが対象

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。draft-phase1c-design-polish.md A 項（タイポ確定）
- 全初期記事セット（PHASE1B-008〜013）公開後の最終再検証は仕上げトラックで実施（本 PBI では現存コンテンツで確定）

### PHASE1C-008 との境界（h2 朝日ドットマーカーの帰属）
- design-direction §3 は本 PBI（003）の入力として「h2 には朝日ドットマーカー」を挙げるが、同じ装飾は §5 の署名要素として PHASE1C-008 にも現れて重複していた。**朝日マーカー全般（h2 ドットマーカー + リストマーカー）は PHASE1C-008 が持つ**と確定（008 の PBI 本文に理由を明記）
- 本 PBI（003）の範囲: 見出し階層のサイズ / 行間 / ウェイト・本文・和欧混植など**純粋なタイポグラフィ**。h2 のサイズ/ウェイト/行間は本 PBI で確定し、その上に載る装飾マーカーは 008 が additive に実装する

## 実装ログ

### 2026-07-30〜31（コンテナ・実装 → 実測 → 確定）

#### 確定した中身

- 書体は 2 つ。見出し＝Zen Kaku Gothic New（`@fontsource/zen-kaku-gothic-new` 5.3.0、OFL-1.1。500 / 700 の 2 ウェイト）、本文＝Noto Sans JP
- サイズと行間は `src/styles/global.css` の `@theme` に `--text-*` と `--text-*--line-height` の対で定義。既存の `text-sm` / `text-2xl` 等の utility がそのまま新スケールを指すので、各ファイルにサイズ指定を撒かずに済む
- 本文 16px / 行間 1.95。見出しは Hero の h1 42px、ページ h1 と記事タイトル 32px（モバイル 24px）、h2 24px、h3 17px、補助 14px。行間は大きい文字ほど詰める
- ウェイトは 500 / 700 の 2 段。Zen Kaku Gothic New は可変ウェイトを持たないので、`font-semibold`（600）が混じると合成太字か 700 への丸めになる。見出しの 600 指定はすべて 700 に寄せた
- 見出しの共通指定（`@layer base` の h1〜h4）：書体切替 + `font-feature-settings: "palt"` + `text-wrap: balance` + `word-break: auto-phrase`

#### 欧文 Geist の去就 → 廃止

- 選定された案2「春空」のモックは本文が `"Noto Sans JP", sans-serif` 単独で、Geist を残す案は選ばれなかった案1「快晴」の側だった
- 和文と欧文で別ファミリを混ぜると縦方向の寸法が食い違う。1 ファミリに揃えるのが混植調整として最も効く（本 PBI の受け入れ条件「和欧混植の調整」への回答がこれ）
- 依存も削除（`yarn remove @fontsource-variable/geist`）

#### 読み込み方は「見出し swap / 本文 optional」に分けた

PHASE1C-007 で本文を `font-display: optional` にしたが、見出し書体を足すにあたって初回訪問の見え方を実測したところ、**optional では初回訪問でほぼ当たらない**ことが分かった。文字範囲ごとに分割された woff2 が 1 ページ 50 件前後になり、optional の猶予（約 100ms）に間に合わないため。

CDP の `CSS.getPlatformFontsForNode` で「実際に使われた書体」を直接読んで比較した（キャッシュ無しの初回訪問）:

| 読み込み方 | 初回訪問の見出し | 初回訪問の本文 | 差し替えずれ（不利なフォールバック強制）|
|---|---|---|---|
| 両方 optional | ほぼ当たらない | 当たらない | /about 0.0000 |
| 両方 swap | 当たる | 当たる | /about **0.0913**（144px 動く）|
| **見出し swap + 本文 optional（採用）** | 当たる | 当たらない | /about 0.0014・Home 0.0016・記事 0.0008 |

- 見出しが占める高さはページ全体から見れば小さいので、差し替えても実測 0.0016 以下。本文は高さの大半を占めるため swap にすると 0.09 まで跳ね、NFR-11（CLS < 0.1）に貼り付く
- よって「ブランドの書体は初見の人にも出す・本文は動かさない」の両取りができる。PHASE1C-007 の本文側の判断は変えていない

#### 和文の折り返し

`text-wrap: balance` 単独だと語の途中で折れる。Chromium 147 で実測して比較した:

| 指定 | 「大規模決済プラットフォームの横断PM」 | 「AIに開発を任せるなら、仕組みがいる」 |
|---|---|---|
| 指定なし | …の横断 / PM | …仕組みが / いる |
| balance のみ | 大規模決済プラット / フォームの横断PM | AIに開発を任せるな / ら、仕組みがいる |
| auto-phrase のみ | …の横断 / PM | …仕組みが / いる |
| **併用（採用）** | 大規模決済プラットフォームの / 横断PM | AIに開発を任せるなら、/ 仕組みがいる |

`word-break: auto-phrase` は未対応ブラウザでは単に無視され、balance だけの挙動に落ちる（付けて損はない）。

#### 記事本文の h2 は 700

モックの CSS では記事の h2 だけウェイト 500 だったが、ページの節見出し（Career / Skills など）は 700 で、同じ h2 が場所によって太さが変わることになる。design-direction §3 の記載（h2 24px / 700）どおり 700 に統一した。500 と 700 の両方を実際に描いて比べ、700 のほうが読み進めるときの段落の切れ目が分かりやすかった。

#### 想定外だった点

- `astro preview` は静的アセットに `Cache-Control: no-cache` を返す。`font-display: optional` は「取得済みなら使う」挙動なので、preview 越しに何度読み込んでも Web フォントが当たらず、スクリーンショットが意図した書体にならない。本番相当のキャッシュヘッダを返す簡易サーバで `dist` を配って検証した（スクリプトは scratchpad）
- 合成した `span` の幅で「書体が当たっているか」を判定するのは誤り。未取得のサブセットを新たに要求してしまい、optional では当たらないため常に「当たっていない」に見える。ページ上の実要素を CDP で読むのが確実
- Astro Fonts API は @font-face のファミリ名にハッシュを付ける（`Zen Kaku Gothic New-c2aa08ff…`）。CSS から参照するときは必ず `var(--font-*)` を経由すること（`--font-mono` に素のファミリ名を書いて一度外した）
- `@theme inline` に定義した `--text-2xl` 等は、scoped style から `var()` で参照している限り `:root` にも出力される（PostLayout の記事本文スタイルで利用）

#### 申し送り

- ビルド成果物のフォントは 366 ファイル・8.5MB（Noto 124 + Zen Kaku 242）。dist 全体で 12MB。Workers のアセット上限（20,000 ファイル）には十分収まるが、転送量を絞るならサブセット化を別 PBI に（PHASE1C-007 の申し送りと同じ論点）
- PHASE1C-008 の朝日ドットマーカーは、h2 の確定サイズ（24px / 700 / 行間 1.5）の上に additive で載せる
- 記事公開後に、実記事の URL で記事詳細の見え方をもう一度確認すると確実（本 PBI では同内容の一時記事で代替）

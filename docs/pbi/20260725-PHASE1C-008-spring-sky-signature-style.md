# 訪問者は「春空」の署名的な見た目（影カード・角丸・朝日マーカー・Hero グラデ・揚雲雀）でサイトを閲覧できる

Status: Done
Started: 2026-07-31
Completed: 2026-08-01

## 誰が
- 訪問者

## 何をできる
- 確定デザイン「春空」の署名要素——柔らかい影のカード・14px の角丸（チップ/ボタンはピル）・朝日マーカー・Hero の縦グラデーション・揚雲雀の軌跡——が反映された、明るく軽やかな見た目でサイトを閲覧できる

## なんのために
- PHASE1C-002 で確定パレットの色トークンは反映済みだが、「春空」の面・形・装飾（署名要素）はまだ未適用で、現状はデフォルトの罫線カード・素の見出しのまま。design-direction §5 のトーン・形・署名要素を実装して選定案の見た目を完成させる
- 経緯: PHASE1C-002 実装ログの 2026-07-17 運営者判断で、見た目実装は 002 から分離して別 PBI 化すると決定（1c に該当 PBI が無いことを発見）。本 PBI がその受け皿
- 関連: site-plan.md §6.5.1（ブランドコンセプト）/ §8 Decision #28 / Phase 1c 先行トラック / docs/design-direction.md §5・§6

## 受け入れ条件
- [x] 影カード：カード面を罫線でなく柔らかい影＋白面（card）で表す。影値は design-direction §5 の `0 1px 3px rgba(70,55,30,.06), 0 6px 20px rgba(70,55,30,.06)`。対象は BlogCard および各ページのカード状の面（Career/Skills/Qualifications 等）。罫線（border）主体の表現を影主体に置換する
- [x] 角丸：カード等の面は 14px（`--radius` を 0.875rem に確定）。チップ（カテゴリラベル等）とボタンはピル形（999px / `rounded-full`）
- [x] 朝日マーカー：h2 見出しに朝日（sun）の小さなドットマーカー（`radial-gradient` の円、装飾）、および本文/一覧のリストマーカーに朝日を小さく日常使いする（design-direction §5・§6。**PHASE1C-003 でなく本 PBI が持つ**——下記「PHASE1C-003 との境界」参照）
- [x] Hero：背景を `wash → bg` の縦グラデーションにする
- [x] 揚雲雀の軌跡：Hero 右下に、左下から右上へ昇る点線の飛行線 + ヒバリのシルエット + 朝日。**1 ページに 1 回だけ**使う（他ページ・他セクションで重複させない）
- [x] sun / wash 等の装飾色は文字色に使わない（design-direction §2 運用規律を維持）。装飾要素は装飾のみに使う
- [x] 装飾（揚雲雀・マーカー）が支援技術のノイズにならない（意味を持たない装飾は `aria-hidden` 等で読み上げ対象外にする）
- [x] Lighthouse Accessibility 90+ 維持（装飾追加でコントラスト/heading への悪影響がない）
- [x] `yarn build` / `yarn check` / `yarn check:ts` エラーなし
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 依存: PHASE1C-001（確定方向性）/ PHASE1C-002（色トークン反映済み）。PHASE1C-003（タイポ）とは推奨順 003 → 008（h2 のサイズ/ウェイト確定後にマーカーを additive に重ねると手戻りが少ない。マーカーは additive なので厳密な blocker ではない）
- 定義元: 影・角丸トークンは `src/styles/global.css`（`--radius` は現行 0.625rem → 0.875rem = 14px に確定。`--radius-*` の派生は現行の比率式をそのまま流用）。カード共通スタイルは BlogCard / 各ページのカード面に適用
- 揚雲雀は inline SVG（軽量・セルフホスト、外部 JS 非依存＝OGP/SEO 方針と整合）。Hero コンポーネント内に閉じる
- 触ってはいけない領域: 色の役割分離（§2 運用規律）を崩さない。記事本文（PostLayout prose）のタイポスケールは PHASE1C-003 の領域なので本 PBI では触らない（h2 マーカーの装飾レイヤーのみ本 PBI）

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。design-direction §5「トーン・形・署名要素」の実装 PBI（002 から分離、2026-07-17 運営者判断）

### PHASE1C-003 との境界（h2 朝日ドットマーカーの帰属）
- design-direction では h2 の朝日ドットマーカーが §3（→ PHASE1C-003 タイポ）と §5（→ 本 PBI）の両方に現れて重複していた。**本 PBI（008）が朝日マーカー全般（h2 ドットマーカー + リストマーカー）を持つ**と確定する
- 理由: 朝日マーカーは §5 の署名要素（sun 色の装飾を日常使い）の一部であり、リストマーカーと合わせて装飾レイヤーとして一括管理する方が一貫する。PHASE1C-003 は純粋なタイポグラフィ（見出しスケール・行間・ウェイト・和欧混植）に専念する
- 分担: 003 が h2 のサイズ/ウェイト/行間を確定 → 008 がその上に装飾マーカーを additive に重ねる
- この境界は PHASE1C-003 の PBI 本文にも明記済み（重複起票の防止）

## 実装ログ

### 2026-07-31

やったこと
- 着手（InProgress）。design-direction §5 と選定モック `docs/design-drafts/phase1c-001/2-spring-sky.html` を実装の基準にした。
- トークン（`src/styles/global.css`）：`--radius` を 0.625rem → 0.875rem（14px）、影 `--shadow-card` を §5 の確定値で追加（Tailwind の `shadow-card` として使用）、朝日の光側 `--color-hibari-sun-light`（#F6C35C = `oklch(0.843 0.133 82.7)`、装飾専用）を追加。
- 影カード化：BlogCard / Home の Career・Skills・Qualifications / SkillSet / 記事の目次 / Contact の送信完了パネルを、罫線から「白面 + 柔らかい影」に置換。Home の節区切り罫線とページ h2 の下線も落とした（モックは罫線を使わず、影カードと併用すると面が立て込むため）。
- チップ・ボタンのピル化：shadcn Button の `rounded-lg` 系を `rounded-full` に（カテゴリ絞り込み・送信ボタンに波及）、Hero / 404 のボタン、Header のナビ、Hero の肩書きチップも同様。カテゴリチップは Tech = 空の面 + sky 文字、Life = 草原の面 + green 文字に色分けした。
- 朝日マーカー：h2 の左に朝日ドット（`.heading-sun` と `.post-body h2`）、`ul > li::marker` を sun 色に。番号付きリストは数字が文字に見えるため対象外。Career のタイムライン h2 は既に左に sky の点があるので付けない。
- Hero：背景を `wash → bg` の縦グラデにし、右下に「揚雲雀の軌跡」（点線の飛行線 + ヒバリ + 朝日）を inline SVG で追加（`aria-hidden` + `pointer-events-none`、Home のみ 1 回）。対にして Footer を `bg → wash` の縦グラデにした。
- `scripts/lighthouse-audit.sh` に `CHROME_FLAGS` の上書き口を足した（コンテナ内は Chrome のサンドボックスが使えず `--no-sandbox` が要るため。既定値は従来どおり）。

検証（ローカル）
- スクショ：dev サーバー + Playwright で 8 ページ × PC(1280) / スマホ(390) 幅。記事ページ用に一時記事（未コミット、確認後に削除）を置いて本文の見え方も確認。
- Lighthouse（コンテナ内 / ローカル preview）：8 ページすべて Accessibility 100・color-contrast pass。記事ページも 100・失格 audit ゼロ。
- `yarn build` / `yarn check` / `yarn check:ts` エラーなし、`yarn test:run` 30 件パス、`yarn test:e2e` 29 件パス。

学び・つまずき
- 朝日ドットを `background-image` の `radial-gradient` で描いたら円でなく四角に出た。背景画像は背景領域の矩形を塗るだけで円形には切り抜かれない。`::before` + `border-radius` で描き直した（絶対配置なので見出しの折り返し計算にも入らない）。
- ドットの縦位置は「1 行分の高さ（1.5em）の中央 − 円の半径」で 1 行目の中心に合う。h2 の行間が 1.5 固定である前提に依存しているので、タイポスケールを変えるときはここも見直す。
- コンテナからは jsdelivr（Skills アイコンの配信元）に到達できず、ローカルのスクショではアイコンが壊れて写る。今回の変更とは無関係で、実表示は CF preview 側で確認する。

残タスク
- CF preview スクショ確認（push 後、branch alias）。あわせて Skills アイコンの実表示も確認する。
- CI（UI Tests / Quality Checks）green 確認。
- 記事公開後に、記事ページの見え方を branch alias で 1 回裏取り（現状 branch alias は公開記事 0 件。PHASE1C-006 と同じ申し送り）。

### 2026-08-01

やったこと
- CI 確認：`scripts/ci-status.sh` で b9c83b0 の Quality Checks / UI Tests / CodeQL（javascript-typescript・actions）すべて success を確認。→ 残タスクの CI green 確認は消化。
- CF preview 確認を実施したが、**branch alias が b9c83b0 より前のビルドを配信していた**ため、署名要素の確認はできていない（下記）。

わかったこと：CF preview が古いビルドのまま
- 配信 HTML（`curl` で取得）に `heading-sun` も `rounded-full` も 1 件も出てこない。ソース（`src/`）とローカル `dist/index.html` にはどちらもある。
- CSS のファイル名が食い違う：CF = `BaseLayout.BYJQ0k_z.css` / ローカル dist = `BaseLayout.CZ56XjW4.css`。CF 側の CSS には角丸 14px（`0.875rem`）が入っていない。
- スクショ（8 ページ × PC/スマホ、全 200）でも、カードは影ではなく罫線、ボタンはピルでなく角丸長方形、h2 に朝日ドット無し、Home の節区切り罫線も残ったまま＝ 008 適用前の見た目。
- push 自体は済んでいる（`origin/feat/phase-1` == HEAD == b9c83b0）。GitHub Actions 側に deploy workflow は無く、デプロイは Cloudflare の Git 連携（Workers Builds）なのでコンテナからは状態を読めない。→ **運営者に CF ダッシュボードで feat/phase-1 の最新ビルドログを確認してもらう必要がある**（PHASE1B-006 では `node_modules/.astro` のキャッシュ汚染でビルドが赤くなり、Clear Cache で解消した前例あり）。
- Skills アイコンが壊れて写る件は、コンテナから `cdn.jsdelivr.net` へ到達できないため（curl で HTTP コード 000）。サイト側の問題ではないが、裏返すと**アイコンの実表示はコンテナからは確認できない**（母艦での確認が要る）。

原因特定：Cloudflare が push を 1 回取りこぼしていた
- build history と GitHub API を突き合わせた結果、**取りこぼしは push 1 回分**と判明。ed39801 は 2026-07-30 22:43 UTC に push されて Cloudflare もビルド済み。b9c83b0 は 2026-07-31 12:14 UTC に push され GitHub Actions は走った（Quality Checks / UI Tests とも success）が、Cloudflare 側に build 行が 1 つも無い。
- a6e511b / 0763461 は Actions の実行自体が存在しない＝単独では push されておらず、b9c83b0 を先頭とする 1 回の push に含まれていた。
- CF 側の設定は正常（Git 連携あり / Production branch=main / Builds for non-production branches=Enabled / watch paths=`*` / Build command=`yarn build` / Version command=`npx wrangler versions upload`）。それ以前は push のたびに毎回ビルドが走っている。恒常的な故障ではなく単発の取りこぼし。
- 対処：新しいコミット（b2edc1c）を push して再点火 → ビルドが走り preview に反映された。b2edc1c の check-runs には `Workers Builds: byte-lark: success` が出ている（b9c83b0 には無かった）。**「ビルドが走ったか」はこの check-run の有無で機械的に判別できる**ので、以後 §7 の CF preview 確認前にここを見るのが速い。
- 予防策の候補：CF の Deploy Hooks が未設定（"No deploy hooks defined"）。作っておけば取りこぼし時に URL を叩くだけで再ビルドでき、ダッシュボードを開かずに済む（未実施、運営者判断）。

検証（CF preview / b2edc1c）
- スクショ：branch alias で 8 ページ × PC(1280) / スマホ(390)、全 200。Hero の縦グラデ・揚雲雀の軌跡（右上へ昇る点線 + ヒバリ + 朝日）・肩書きチップと両ボタンのピル・Career/Skills/Qualifications の影カード・h2 左の朝日ドット・節区切り罫線の消失・Footer の `bg → wash` グラデを実機で確認。Career のタイムライン h2 に朝日ドットが付いていないことも意図どおり。
- CI：`scripts/ci-status.sh` で b2edc1c の Quality Checks / UI Tests / CodeQL すべて success。
- エッジのキャッシュ切り替わり中は旧版が返ることがある（反映直後の 1 回目が旧 HTML だった）。連続取得して同じ内容が返ることで確認した。

Skills アイコンの実表示（運営者が母艦で確認、2026-08-01）
- 運営者が母艦のブラウザで branch alias の `/skills/` を開き、**アイコンが全て表示されていること**を確認。これで前セッションの残タスク（CF preview 確認とセットで挙がっていた項目）が消化された。
- コンテナからは `cdn.jsdelivr.net` に到達できない（curl で HTTP 000）ため、ローカル・CF preview どちらのスクショでもアイコンは壊れて写る。過去のスクショ（`.playwright-mcp/003-skills-desktop.png` 等）も全てコンテナ発で同様。**外部 CDN 由来の画像は、コンテナのスクショでは検証できない**——今後同種の確認が要るときは母艦に回す。
- 008 側の裏取り：`git show b9c83b0 -- src/components/SkillSet.astro` の差分は h2 への `heading-sun` 追加と `<li>` の `border border-border` → `bg-card shadow-card` だけ。`<img src={skill.icon} …>` の行も URL 定義（`src/data/skills.ts`）も未変更。

申し送り
- 記事公開後に、記事ページの見え方を branch alias で 1 回裏取り（現状 branch alias は公開記事 0 件。PHASE1C-006 と同じ申し送り）。
- 記事ページの見え方を branch alias で 1 回裏取り（現状 branch alias は公開記事 0 件。PHASE1C-006 と同じ申し送り）。

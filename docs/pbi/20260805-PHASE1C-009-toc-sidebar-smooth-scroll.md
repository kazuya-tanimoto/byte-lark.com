# 読者は広い画面で追従目次から現在地を把握しながら記事を読み、目次リンクで滑らかに移動できる

Status: Done
Started: 2026-08-05
Completed: 2026-08-05

## 誰が
- ブログ記事の読者

## 何をできる
- 広い画面（xl 以上）では記事の右側に目次が表示され、スクロールしても画面内に追従する
- 追従目次では、いま読んでいる節がハイライトされる（現在地表示）
- 目次リンクをクリックすると、瞬間移動でなく滑らかにスクロールして該当節へ移動する
- 狭い画面（スマホ等）では従来どおり記事冒頭に目次が表示される

## なんのために
- 現状の目次は記事冒頭に静的配置のため、読み進めるとスクロールで消え、リンクにしている意味が薄い（運営者指摘 2026-08-05）。Zenn 等と同様の追従目次＋現在地表示で、長い記事の回遊性を上げる
- 関連: docs/design-direction.md（「春空」の見た目規律に従う）/ PHASE1A-007（PostLayout）/ PHASE1C-008（影カード様式）

## 受け入れ条件
- [x] xl（1280px）以上：記事本文の右に目次列が表示され、`position: sticky` でスクロールに追従する。本文列の幅は現行（max-w-3xl）を維持する
- [x] xl 未満：従来どおり記事冒頭に目次を表示（右列は出さない）。冒頭目次は xl 以上では表示しない
- [x] 現在地ハイライト：スクロール位置に応じて、追従目次のいま読んでいる節のリンクが視覚的に区別される（文字色は AA を満たすトークンを使う）。目次から末端の節へ移動した場合も、その節が現在地として表示される
- [x] スムーススクロール：目次リンククリックで滑らかにスクロールする。`prefers-reduced-motion: reduce` 環境では従来どおり即時ジャンプ（アニメーションを強制しない）
- [x] 追従目次が長い場合も画面内でスクロールでき、ヘッダーと重ならない
- [x] 装飾・状態表示が支援技術のノイズにならない（現在地は `aria-current` で表現し、目次 nav の landmark 構造を壊さない）
- [x] `yarn build` / `yarn check` / `yarn check:ts` エラーなし
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）：N/A（母艦 tools/imagegen 起点セッションの sandbox がポートを開けず dev/preview サーバー起動不可。CF preview スクショで PC/スマホ両幅を代替確認）
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 変更対象: `src/layouts/PostLayout.astro`（2 カラム化・追従目次・現在地スクリプト）/ `src/styles/global.css`（`scroll-behavior: smooth` を reduced-motion ガード付きで追加）
- 幅設計: 本文 768px（max-w-3xl 維持）＋ gap 40px ＋ 目次列 240px ＝ 1048px。外枠は xl で 1080px（px-4 込み）。lg（1024px）では本文が窮屈になるため出さない
- 現在地判定: 見出し（h2/h3）の上端が viewport 上から一定オフセット（`scroll-margin-top: 5rem` と整合させる）を過ぎた最後の見出しを現在地とする。ページ末尾に達したら最後の見出しを現在地にする（末端の節が短いとオフセット線に届かないため）。末尾判定は見出しの境界跨ぎと無関係に起きるので IntersectionObserver では拾えず、rAF で間引いた passive scroll で再計算する
- 冒頭目次と追従目次は同一データ（`headings`）から二重に描画し、表示は Tailwind の `xl:hidden` / `hidden xl:block` で排他にする。両方 `aria-label="目次"` でも同時に可視になることがないため axe の landmark-unique には抵触しない
- 触ってはいけない領域: 記事本文のタイポスケール（PHASE1C-003）/ OGP・JSON-LD（PHASE1A-007）

## 備考
- Phase 1c の追加 PBI（運営者指示 2026-08-05）。仕上げトラック起票（1b Gate 後）を待たず、単発の UI 改善として先行実施

## 実装ログ

### 2026-08-05

やったこと
- 起票と同セッションで実装（運営者指示の単発 UI 改善）。d09d1f3（実装）→ ce15d72（末端節の修正）の 2 コミット。
- `PostLayout.astro`：main を xl で `max-w-[1080px]` の 2 カラム（本文 max-w-3xl + gap 40px + 目次 240px）に。追従目次は `sticky top-24` + `max-h-[calc(100vh-8rem)] overflow-y-auto`、影カード様式。冒頭目次に `xl:hidden`。現在地は `aria-current="location"` を sky-deep + 太字で表示。
- `global.css`：`scroll-behavior: smooth` を `prefers-reduced-motion: no-preference` ガード付きで追加。
- 現在地判定は当初 IntersectionObserver をトリガーにしたが、CF preview のクリック検証で「目次から『まとめ』へ移動しても前の節が光ったまま」を発見。末端の節が短いと見出しがオフセット線（80px）に届かないため。「ページ末尾に達したら最後の見出しを現在地にする」判定を追加し、この判定は見出しの境界跨ぎと無関係で IO では拾えないため、rAF で間引いた passive scroll に置き換えた（ce15d72）。

検証報告（§7）
- ローカル確認：`yarn check`（Biome 38 ファイル）green。`yarn check:ts`（0 errors）と `yarn test:run`（30 件）は sandbox が repo に書けないため scratchpad の作業コピーで実行し green。`yarn build` は sandbox がポートを開けず（listen EPERM）実行不可 → 運営者のコミットスクリプト冒頭で実行し通過（×2 回）。dev サーバーも同理由で起動不可のためローカルスクショは N/A、CF preview で代替。
- CF preview 確認：https://feat-phase-1-byte-lark.tanimoto-a49.workers.dev の記事ページで、PC 1440px＝右カラム追従・現在地ハイライト・本文幅維持・冒頭目次非表示、スマホ 390px＝冒頭目次のみ、を MCP Playwright スクショと DOM 検査（`aria-current` の付与、`scroll-behavior: smooth` の computed style、末尾で「まとめ」点灯、中間節の追従）で確認。
- E2E/CI 確認：`scripts/ci-status.sh` で d09d1f3・ce15d72 とも Quality Checks / UI Tests(e2e) / Workers Builds / CodeQL すべて success。
- 未検証項目：`prefers-reduced-motion: reduce` 時の即時ジャンプは CSS の media query 分岐のみで実機未確認（OS 設定の切替が必要）。

学び・つまずき
- 母艦 tools/imagegen 起点セッションの sandbox はポート bind が全面不可（`listen EPERM`、127.0.0.1 も不可）。`yarn build` / dev / preview / python http.server が全滅。build はコミットスクリプト冒頭に入れて「失敗したら commit しない」形にした。
- `rsync --exclude dist` は node_modules/*/dist まで除外して astro CLI が壊れる。ルート限定の `--exclude "/dist"` にする。
- 現在地ハイライトは IO だけだと「ページ末尾で最後の節が点灯しない」edge case がある。末尾判定が要るなら最初から rAF passive scroll が素直。
- 作業ツリーに別セッション（ロゴ・記事3本目）の未コミット変更が同居していたため、コミットは対象ファイル名指しの `git add` で分離した。

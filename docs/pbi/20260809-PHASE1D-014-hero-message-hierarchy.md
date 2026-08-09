# 訪問者はトップを開いた瞬間に「何をしてくれる人か」を最初に読み取れる

Status: InProgress
Started: 2026-08-09

## 誰が
- 訪問者（PC / スマホ）

## 何をできる
- トップの最初の画面で、いちばん大きく目に入るのが提供価値（キャッチコピー）になっている
- 名前は引き続き読み取れ、指名で検索したときにも拾われる

## なんのために
- 現状は上から「肩書きの小さなチップ →『谷本 和也』（最大）→『現場を前に進める PM / PO』（一段小さい）」の順で、読み手が最初に知りたい「何をしてくれる人か」が 2 番目になっている（運営者指摘 2026-08-09「名前の主張しすぎかも」）
- 受託の相談窓口を兼ねるサイトなので、最初の一目で伝わる情報の順番を整える（site-plan Phase 1d）

## 受け入れ条件
- [ ] 見せ方の案を 2〜3 案（実画面のスクショ付き）で提示し、運営者が選ぶ
- [ ] 選ばれた案で、キャッチコピーが名前より大きい、または同等以上の存在感になっている
- [ ] 名前は h1 の中に残す（記事の構造化データが著者を個人、発行元を法人としており、指名検索の受け皿でもあるため）。h1 から名前を外す案を採る場合は、`src/lib/jsonld.ts` の Person / Organization との整合を確認したうえで運営者判断を仰ぐ
- [ ] スマホ幅（375px / 390px）で、キャッチコピーが 3 行以上に折り返して間延びしないこと
- [ ] Hero の署名要素（揚雲雀の軌跡）の配置が崩れないこと。スマホは負の下マージンで Hero からはみ出させて main で隠す作りになっている（PHASE1C-013）
- [ ] `tests/e2e/navigation.spec.ts` の Home の h1 検証（テキスト指定なし）が通ること
- [ ] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `bash scripts/ci-status.sh` で UI Tests / Quality Checks が success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 関連ファイル：`src/components/Hero.astro`
- 現状の指定：名前 `text-3xl sm:text-4xl font-bold`、キャッチ `text-xl sm:text-2xl font-medium`、肩書きチップ `text-sm font-bold`
- 触ってはいけない領域：確定デザイントークンの値（PHASE1C-002 / 003）、ヒバリの意匠そのもの（PHASE1C-004）

## 備考
- Gate である PHASE1D-009 より先に着手する

## 実装ログ（着手後に追記、中断時は必須）

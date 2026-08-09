# 運営者は届いた依存更新 PR を判断基準に沿って処置し、以後の受け方を決めた状態にできる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- PHASE1D-011 の設定修正で初めて届いたバージョン更新 PR 5 本（#29〜#33）を、マージ / 保留 / クローズのいずれかに処置できる
- 以後毎週届く更新 PR の受け方（判断基準・見るタイミング・メジャー更新の扱い）を決め、ドキュメントに残せる

## なんのために
- PHASE1D-011 で `.github/dependabot.yml` の不正キー 3 つを取り除いた結果、通常のバージョン更新が初めて機能し PR 5 本が一度に届いた。処置方針を決めないまま放置すると、旧スタック時代に 9 本溜めた状態（PHASE1D-011 でクローズ）が再発する
- #33（astro 6.4.8 → 7.1.6）は PHASE1D-011 で「到達不能」として dismiss した astro 3 件（#165 / #167 / #169）の根本解消にあたる。dismiss は「修正版が Astro 7 系のみでメジャー更新が必要」という前提の上に立っているので、その前提を解消できるならしておく方が安全側
- 関連: PHASE1D-011（申し送り 2 件の受け皿）/ docs/pbi/README.md §10.6（main マージは PR 経由）

## 受け入れ条件
- [ ] #29（minor + patch 17 件まとめ）の中身を確認し、マージするか分割するかを判断。マージした場合 `yarn build` / `check` / `check:ts` / `test:run` が成功し、`dist/` の差分を確認して意図しない出力変化がないこと
- [ ] #33（astro 6.4.8 → 7.1.6）を評価：Astro 7 の破壊的変更の洗い出し（公式 migration ガイドを一次情報として参照）、全 11 ページの表示回帰確認、`sharp` / `esbuild` の `resolutions` が Astro 7 でも必要か再判定（不要なら外す）
- [ ] #30（@astrojs/react 6）/ #31（@astrojs/mdx 7）/ #32（jsdom 30）をそれぞれ評価し処置。#30 / #31 は Astro 7 と同時に上げる必要があるかを確認
- [ ] astro を 7 系へ更新した場合：PHASE1D-011 で dismiss した #165 / #167 / #169 が不要になったことを確認（GitHub 上の dismiss は残るが、次回走査で該当バージョンから外れる）
- [ ] 以後の受け方を決めてドキュメント化：週次で届く「minor+patch のまとめ 1 本」と「メジャー個別」をそれぞれ誰がいつ見て何を基準にマージするか。`docs/operation-manual.md` に節を追加するか、`docs/pbi/README.md` §10 に足すかを判断して記載
- [ ] 処置後、open な Dependabot PR が「判断済みのもの 0 件」になっていること
- [ ] ローカル スクショ確認（desktop + mobile）：依存更新が出力に影響し得るため主要ページで表示回帰がないことを確認（更新が devDependencies のみで `dist/` がバイト一致なら `[x] …：N/A（dist 差分 0 を確認）` 化可）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）：同上（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `bash scripts/ci-status.sh` で UI Tests / Quality Checks が success）（CLAUDE.md §7）

## 技術メモ
- #29 の内訳（17 件）：@astrojs/sitemap 3.7.3 / @fontsource-variable/noto-sans-jp 5.3.0 / @tailwindcss/vite 4.3.3 / lucide-react 1.28.0 / radix-ui 1.6.7 / react 19.2.8 / @types/react 19.2.18 / react-dom 19.2.8 / @types/react-dom 19.2.4 / tailwind-merge 3.6.0 / tailwindcss 4.3.3 / @astrojs/check 0.9.10 / @axe-core/playwright 4.12.1 / @biomejs/biome 2.5.7 / @playwright/test 1.62.1 / lefthook 2.1.10 / vitest 4.1.10
- Tailwind 4.2.4 → 4.3.3 は生成 CSS が変わり得る。PHASE1C-010（未使用 CSS 削減）と PHASE1D-011（shadcn のスタイルシート取り込み削除）の測定値と比べる：直近の基準は生 33,303 B / brotli 5,763 B
- Biome 2.4.14 → 2.5.7 は lint ルールの追加で `yarn check` が落ちる可能性がある。落ちた場合は指摘内容を見て修正するか、ルールを `biome.jsonc` で明示的に切るかを判断する
- 依存だけを変える回の回帰確認は、変更前の `dist/` を別ディレクトリへ保存して `diff -rq` するのが最も確実（PHASE1D-011 の学び）
- devcontainer 内で `yarn` のネットワーク操作が可能。Dependabot の lockfile をそのまま使わず、ローカルで `yarn install` して整合を取り直す方が確実
- main へのマージは ruleset により PR 経由のみ（README §10.6 / §10.9）。必須チェックは `quality` と `e2e`
- 想定セッション数: 2（1 本目で #29 と非メジャー、2 本目で Astro 7 系。#33 単独で 1 セッション使う想定）

## 実装ログ（着手後に追記、中断時は必須）
（未着手）

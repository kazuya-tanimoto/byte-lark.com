# 運営者は届いた依存更新 PR を判断基準に沿って処置し、以後の受け方を決めた状態にできる

Status: Done
Started: 2026-08-09
Completed: 2026-08-09

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
- [x] #29（minor + patch 17 件まとめ）の中身を確認し、マージするか分割するかを判断。マージした場合 `yarn build` / `check` / `check:ts` / `test:run` が成功し、`dist/` の差分を確認して意図しない出力変化がないこと：17 件そのまま一括で取り込み（Dependabot のブランチは使わず `yarn up` で入れ直し）。4 コマンドと `yarn npm audit` すべて成功、`dist/` はハッシュ名を除いて HTML 全ファイル一致、CSS 生 33,303→33,238 B / brotli 5,763→5,813 B、JS brotli +888 B（radix-ui と lucide-react の分）
- [x] #33（astro 6.4.8 → 7.1.6）を評価：Astro 7 の破壊的変更の洗い出し（公式 migration ガイドを一次情報として参照）、全 11 ページの表示回帰確認、`sharp` / `esbuild` の `resolutions` が Astro 7 でも必要か再判定（不要なら外す）：CHANGELOG を一次情報として確認し astro 7.2.0 を採用。`resolutions` は sharp / esbuild に加え vite / devalue も不要と判定して 4 つとも削除（astro 7 が vite 8.2.1 / devalue 5.9.0 / esbuild 0.28.2 / sharp 0.35.3 を自力で引き、audit 無指摘）
- [x] #30（@astrojs/react 6）/ #31（@astrojs/mdx 7）/ #32（jsdom 30）をそれぞれ評価し処置。#30 / #31 は Astro 7 と同時に上げる必要があるかを確認：#30 / #31 は astro 7 と不可分（mdx 7 が astro ^7.0.0 を peer 必須、react 6 の破壊的変更は Vite 8 移行）と確認し 3 本まとめて適用。#32 は独立で先に適用しテスト 30 件通過
- [x] astro を 7 系へ更新した場合：PHASE1D-011 で dismiss した #165 / #167 / #169 が不要になったことを確認（GitHub 上の dismiss は残るが、次回走査で該当バージョンから外れる）：3 件の影響範囲は `< 7.0.6` / `>= 3.10.0, < 7.0.4` / `>= 2.9.0, <= 7.0.9` で、採用した 7.2.0 はいずれの範囲にも入らない。GitHub の走査対象は既定ブランチなので、状態が dismissed から外れるのは feat/phase-1 が main に入った後。open は現在 0 件
- [x] 以後の受け方を決めてドキュメント化：週次で届く「minor+patch のまとめ 1 本」と「メジャー個別」をそれぞれ誰がいつ見て何を基準にマージするか。`docs/operation-manual.md` に節を追加するか、`docs/pbi/README.md` §10 に足すかを判断して記載：`docs/operation-manual.md` §7 に新設（運営者主語の運用手順であり、ブランチ規約ではないため README §10 ではなくこちら）
- [x] 処置後、open な Dependabot PR が「判断済みのもの 0 件」になっていること：#29〜#33 の 5 本を「同じ内容を feat/phase-1 に適用済み」のコメント付きでクローズ。`gh pr list --state open` は 0 件
- [x] ローカル スクショ確認（desktop + mobile）：依存更新が出力に影響し得るため主要ページで表示回帰がないことを確認（更新が devDependencies のみで `dist/` がバイト一致なら `[x] …：N/A（dist 差分 0 を確認）` 化可）（CLAUDE.md §7）→ CI で 7 ページ × 2 幅を撮影済み（run 31291367840 の成果物 `screenshots`）。コンテナからは成果物置き場（Azure ストレージ）へ到達できず取り寄せられないため、運営者が PC 幅とスマホ実機で全ページを目視し「Astro 7 にした影響の崩れはなさそう」と確認（2026-08-09）
- [x] CF preview スクショ確認（branch alias URL）：同上（CLAUDE.md §7）→ ブランチ用 URL の配信物が手元の `dist/` とバイト一致であることを実測済み（11 ページ中 9 ページ完全一致、残り 2 ページの差は astro-island の 1 回きりの識別子と Turnstile のサイトキーのみ。CSS と client JS もバイト一致）。表示は上記の運営者目視で確認済み
- [x] E2E / CI green 確認（push 後 `bash scripts/ci-status.sh` で UI Tests / Quality Checks が success）（CLAUDE.md §7）：ab1f5af で UI Tests・Quality Checks・Workers Builds とも success

## 技術メモ
- #29 の内訳（17 件）：@astrojs/sitemap 3.7.3 / @fontsource-variable/noto-sans-jp 5.3.0 / @tailwindcss/vite 4.3.3 / lucide-react 1.28.0 / radix-ui 1.6.7 / react 19.2.8 / @types/react 19.2.18 / react-dom 19.2.8 / @types/react-dom 19.2.4 / tailwind-merge 3.6.0 / tailwindcss 4.3.3 / @astrojs/check 0.9.10 / @axe-core/playwright 4.12.1 / @biomejs/biome 2.5.7 / @playwright/test 1.62.1 / lefthook 2.1.10 / vitest 4.1.10
- Tailwind 4.2.4 → 4.3.3 は生成 CSS が変わり得る。PHASE1C-010（未使用 CSS 削減）と PHASE1D-011（shadcn のスタイルシート取り込み削除）の測定値と比べる：直近の基準は生 33,303 B / brotli 5,763 B
- Biome 2.4.14 → 2.5.7 は lint ルールの追加で `yarn check` が落ちる可能性がある。落ちた場合は指摘内容を見て修正するか、ルールを `biome.jsonc` で明示的に切るかを判断する
- 依存だけを変える回の回帰確認は、変更前の `dist/` を別ディレクトリへ保存して `diff -rq` するのが最も確実（PHASE1D-011 の学び）
- devcontainer 内で `yarn` のネットワーク操作が可能。Dependabot の lockfile をそのまま使わず、ローカルで `yarn install` して整合を取り直す方が確実
- main へのマージは ruleset により PR 経由のみ（README §10.6 / §10.9）。必須チェックは `quality` と `e2e`
- 想定セッション数: 2（1 本目で #29 と非メジャー、2 本目で Astro 7 系。#33 単独で 1 セッション使う想定）

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-09 minor/patch 17 件 + jsdom 30（#29 / #32 相当）

Dependabot のブランチはマージせず、同じ内容を `yarn up` で作業ブランチ側に入れ直した（PR は main を見て作られており、ロックファイルが統合ブランチと食い違うため）。`check` / `check:ts` / `test:run` / `build` / `npm audit` すべて通過。

出力の比較は更新前の `dist/` を別ディレクトリに取っておき、ファイル名のハッシュを正規化してから突き合わせた。HTML は 12 ファイルすべてバイト一致。CSS は生 33,303→33,238 B（Tailwind 4.3 の内部改善で `calc(var(--spacing) * 1)` が `var(--spacing)` に畳まれた）、brotli は 5,763→5,813 B。JS は brotli で +888 B（radix-ui 1.4.3→1.6.7 と lucide-react 1.14→1.28 の分）。

Tailwind 4.3 で preflight の `--default-font-family` の既定値が `ui-sans-serif, system-ui, ...` から `-apple-system, BlinkMacSystemFont, ...` に変わっているが、`global.css` の `html { @apply font-sans }` が後勝ちで上書きするため影響なし。

### 2026-08-09 CI の Playwright コンテナのタグずれ（想定外）

`@playwright/test` を 1.62.1 に上げた最初の push で E2E が 33 件すべて失敗した。`ui-tests.yml` が公式コンテナを `v1.59.1-noble` で固定していて、ブラウザの実体が無い状態になっていた。ファイル内には既に「タグは解決バージョンと一致させること」と書かれていたが、Dependabot はワークフローを更新しないので人が合わせるしかない。タグを 1.62.1 に上げて green。**このずれは今後もメジャー/マイナー更新のたびに起きるので、operation-manual §7 に手で合わせる項目として明記した。**

### 2026-08-09 Astro 7 系（#33 / #30 / #31 相当）

3 本は分割できないことを先に確認した。`@astrojs/mdx` 7.0.5 は peer に `astro ^7.0.0` を要求し、`@astrojs/react` 6.0.0 の破壊的変更は「Vite 8 へ移行」で、Vite 8 を使うのは astro 7。よって同時に上げるか全部見送るかの二択。

astro は PR の 7.1.6 ではなく解決時点の最新 7.2.0 になった。CHANGELOG から本構成に効く破壊的変更は 4 つ：

- Vite 8 へ移行 → `resolutions` の `vite: ^7.3.5` が邪魔になるので削除
- `compressHTML` の既定が `'jsx'` に → タグ間の改行由来の空白が落ち、HTML が 1 ページあたり約 300 B 縮む
- Markdown の処理系が remark/rehype から Astro 自前の Sätteri に → 本構成は remark/rehype プラグインを 1 つも使っておらず、`markdown.shikiConfig` だけで、それは動いた
- `astro:transitions` の非推奨 API 削除 / `@astrojs/db` 削除 → いずれも未使用

出力の実測（更新前の `dist/` と比較）：

- 全 12 ページの可視テキストをタグ除去 + 空白正規化して機械比較し完全一致。唯一の差は記事内コード例の実体参照の書き方（`&#x3C;` が `&lt;`）で、表示は同じ
- フォントは 366 ファイルで中身の sha256 が同一集合。ファイル名のハッシュ方式だけ変わった
- エントリ JS の名前が `index.*.js` から `react.*.js` に変わった（中身相当）

`resolutions` は 4 つ（vite / devalue / sharp / esbuild）を削除できた。astro 7 が自力で vite 8.2.1 / devalue 5.9.0 / esbuild 0.28.2 / sharp 0.35.3 を引き、`yarn npm audit --severity high --environment production` は無指摘。残したのは `stream-replace-string` のパッチ適用と `yaml-language-server/yaml`（どちらも開発時のみ）。

### 2026-08-09 スクショを CI で撮る仕組みを追加

このセッションのコンテナでは表示確認ができなかった。`@playwright/test` の更新でブラウザの再取得が必要になるが、firewall は起動時に解決した IP しか通さない方式で、Playwright の配信元（cdn.playwright.dev）の IP が入れ替わっていて届かない。さらに再取得の失敗時に古いブラウザが削除され、コンテナからブラウザが完全に無くなった。

運営者判断で、CI 側で撮って持ち出す形を作った。`scripts/capture-screenshots.mjs`（7 ページ × デスクトップ/モバイルの 2 幅、jpeg）を追加し、`ui-tests.yml` の e2e ジョブで実行して成果物に上げる。作る過程で 2 つ躓いた。

- Astro 7 は preview サーバーの情報を `.astro/preview.json` に書くようになり、直前の e2e（Playwright の webServer が preview を起動）が残したロックを生きたサーバーとみなして 2 本目の起動を拒否する。エラーメッセージは `--force` を案内するが、`astro/dist/cli/preview/index.js` は無条件に `checkExistingServer` を見ており **`--force` は実装されていない**。ロックファイルを消してから起動する形にした
- `/contact` は Turnstile を読み込み続けるので `networkidle` に到達しない。`load` を必須にし、`networkidle` は 5 秒までの「できれば」に変更

### 2026-08-09 成果物が取り寄せられない（未解決）

CI でのスクショ取得は成功したが、コンテナへ持ち込めない。GitHub Actions の成果物は Azure のストレージ（`*.blob.core.windows.net`）に置かれ、firewall がそこを通さない（`no route to host`）。`gh api` 経由でも最終的に同じ URL へ飛ぶため回避できない。

置き場のホスト名は run ごとに変わる（今回は `productionresultssa12`）ので、firewall に 1 件足しても次の run では通らない。運営者判断で、見た目の確認は運営者自身がブラウザと実機で行う形にした。**CI で撮る仕組み自体は残す**——母艦のセッションからは `gh run download <run-id> -n screenshots` で取り寄せられるため、コンテナ側でブラウザが使えない回の逃げ道として機能する。

### 2026-08-09 CF preview の配信物をバイト比較

ブラウザが使えないぶん、ブランチ用 URL が配信しているものが手元の `dist/` と同一かを機械で確かめた。11 ページを取得して突き合わせた結果、9 ページがバイト一致。残る 2 ページの差は次の 2 つだけで、どちらも表示に関係しない。

- `/blog/`：astro-island の `uid`（島ごとに 1 回きりで振られる識別子）
- `/contact/`：上記に加えて ContactForm のチャンク。差分を 1 文字ずつ追ったところ Turnstile のサイトキーだけで、本番は `0x4AAAAAADrGT0xgf25FIhKU`、手元はテストキー `1x00000000000000000000AA`

`BaseLayout.*.css` と `client.*.js` はバイト一致。つまり配信されている HTML・CSS・JS は手元のビルドと同じもので、あとは見た目を人が見るだけ、という状態まで詰められた。

### 2026-08-09 Dependabot PR の処置と完了

#29〜#33 の 5 本を、いずれも「同じ内容を `feat/phase-1` に適用済み」の説明コメントを付けてクローズした。マージしなかったのは、これらの PR が main を基点に作られていてロックファイルが統合ブランチと食い違うため（operation-manual §7 に恒久ルールとして記載）。`gh pr list --state open` は 0 件。

見た目の確認は運営者が PC 幅とスマホ実機で全ページを回り、Astro 7 由来の崩れなしと確認して完了。あわせて Astro 7 とは無関係の改善点が 8 件挙がったので、PHASE1D-013〜016 として別に起票した（表記の誤り / ブログカードの高さ / フォームのボタンと送信後の位置 / Hero の見せ方 / 記事の回遊性 / フォームの確認画面）。

学び：

- ワークフローが固定している外部コンテナのタグは、Dependabot の守備範囲外。`package.json` 側だけ上がってタグが取り残されると e2e が全件落ちる形で表面化する
- ブラウザが無くても、配信物のバイト比較 + 可視テキストの機械比較まで詰めれば、人が見る範囲は「崩れていないか」だけに絞れる

<!-- kt plugin の pbi-review skill が読む差分ファイル。手順の枠は plugin 側、この repo 固有の内容はここが正。 -->

# pbi-review（byte-lark.com）

## 前提

- 規約の正本は `docs/pbi/README.md` と `CLAUDE.md`。照らす先は直前 Gate の申し送りも含む
- PBI は起票した時点で `NotStarted`（README §4.2）。レビューの結論は「このまま commit して着手対象にしてよいか」で出す
- 規約に足したいルールは README / CLAUDE.md に書いてから照合項目にする

## 対象の特定

引数の PBI パス / ID を使う。無ければ `docs/pbi/INDEX.md` の現在 Phase にある `NotStarted` を全部対象にし、冒頭で「◯◯をレビューします」と明示する。複数のときは PBI ごとに判定表を出す。

## 材料

- PBI 全文
- `docs/pbi/README.md` §2〜§9・§10.8（ファイル名・本体フォーマット・各節の書き方・状態管理・分割基準・PBI 化しない作業・起票タイミング・repo に書かない情報）
- `docs/pbi/README.md` §5.9（Done 前の検証ゲート）と、`CLAUDE.md`「環境」節・`docs/devcontainer-plan.md` §1（検証手順が環境で実行できるかの照合元）
- PBI が参照する `docs/site-plan.md` の FR / NFR / Phase と `docs/site-plan-decisions.md` の Decision の本文（番号だけで済ませない）
- PBI が参照する上流・下流の PBI（前提にした PBI、決定値や申し送りを受け取る元の PBI）
- PBI が `file:line` で参照するファイルの該当行（実在と現状値を開いて確認する）
- `docs/pbi/INDEX.md` の該当行と「次にやること」
- 取り込み漏れの照合元：直前 Gate PBI の `## 次 Phase への申し送り`（棚卸し表を含む）、同じ Phase の Done PBI の実装ログ「学び・つまずき / 想定外だった点」、該当 Phase のドラフトファイル（`docs/pbi/draft-phase*.md`）があればその該当項目（README §9 と §4.6 ルール 8 の起票手順）

## レビュー軸

| 軸 | 見るもの（照らす先） |
|---|---|
| 粒度と分割 | README §7：技術メモに想定セッション数が明記され、2 以上なら分割されているか。複数ロール混在 / Phase 跨ぎ / 受け入れ条件 20 項目以上 / 運営者判断とその結果に依存する実装の同居も分割の合図。分割を勧めるときは元の条件・技術メモ・備考の移動先まで示す。§8 の PBI なしでよい作業（サイトの出力に関わるファイルに触らない作業・依存の更新・typo・個人設定）を PBI にしていないか。範囲外にした項目の行き先が備考にあるか（§4.8） |
| 自己完結性 | README §1（PBI を読むだけで後続セッションが着手・再開できる）と §4.7：対象ファイルのパス・現状値の所在・公式 docs URL・触ってはいけない領域が技術メモにあるか。「CLAUDE.md や site-plan を読めば分かる」を理由に省略していないか。参照した `file:line` が実在し現状値と一致するか。外部仕様は一次情報の URL 併記、確認できていない点は「未確認」と書かれているか。手順 1 の照合元にある申し送り・学びのうち該当するものが受け入れ条件か技術メモに入っているか（1 件でも落ちていれば指摘） |
| 受け入れ条件 | README §4.6 ルール 1〜7 と 9：観測可能（運営者判断は記録先まで）/ チェックボックス 1 件 1 行 / 失敗・エッジケース / 自動検証条件の明示 / ユーザー操作可能な機能は Playwright で検証できる粒度。§7 検証ゲートの 3 行（ローカル スクショ / CF preview スクショ / E2E・CI green）と **ルール 9 のテスト追加行**が削除されず、非該当は `[x] …：N/A（理由）` 形式か。新しい振る舞いを足す PBI で、テスト追加行が `yarn test:run` がエラーなし（＝既存テストが通る確認）で代用されていないか。追加・更新する spec のファイル名が条件の行にあるか。運営者の手作業や preview で確認できない項目は、誰が何で確認するかが条件の行にあるか |
| Gate 棚卸し | Gate PBI のみ。README §4.6 ルール 8：当該 Phase 全 PBI の申し送りを項目単位で列挙し PBI 化（起票先明記）/ 持ち越し / 破棄（理由明記）に判定する条件があるか。前 Gate からの持ち越し項目も表に含まれるか。Gate 以外の PBI は判定表に「対象外」と書く |
| 依存と順序 | README §4.5：「なんのために」が site-plan の FR / NFR / Phase に紐づいているか。§9：起票が前 Phase Gate 通過後か、Decision Log で「先行トラック」と明示された例外か。上流 PBI が Done で、受け取る決定値・申し送りが本文に転記されているか。INDEX の推奨着手順序と矛盾しないか。参照した Decision と PBI の前提が食い違っていないか |
| 検証の実現性 | README §5.9 と CLAUDE.md「環境」節：ローカル検証は `yarn dev` + スクショ確認（母艦は MCP Playwright、コンテナは `scripts/capture-screenshots.mjs` でコンテナ内 headless Chromium から撮る）、CF preview は branch alias URL、E2E は draft PR 経由の CI という経路で受け入れ条件を満たせる手順になっているか。手順が前提にする実行環境（母艦 / コンテナ）が明記され、その環境で実行できるか。母艦なら `yarn add` 等のレジストリアクセスと `yarn test:e2e` ローカル実行は不可、コンテナなら MCP Playwright は使えない（スクショは `scripts/capture-screenshots.mjs` で撮る） |
| 制約の転記 | その PBI 固有に効く制約が受け入れ条件か備考に転記されているか。全 PBI 共通の手順（§5.3 手順 8 のマージ等）は転記対象外。見るもの：repo に書かない情報（Deploy Hook URL は README §10.8、PAT は CLAUDE.md「環境」節）/ パレット「春空」の文字色禁止（CLAUDE.md「コードとデザインの決まり」）/ 記事 PBI は `docs/writing-style/profile.md` 必読と公開前 `/article-review`（CLAUDE.md「記事」節と docs/writing-workflow.md）/ 記事公開・DNS 切替など外から見える状態を変えるコミットは同セッションで Done 化（README §5.4）/ 技術メモ「触ってはいけない領域」 |
| 表記と同期 | README §2 ファイル名 `YYYYMMDD-PHASE-NNN-slug.md`。§4.1 タイトルが `[誰が]は[何を]できる` 形式で動詞終わりか。§4.3 ロールが 1 つ（Gate PBI のみ複数可）。§3 の節（誰が / 何をできる / なんのために / 受け入れ条件 / 技術メモ / 備考 / 実装ログ）が揃い、実装ログは起票時点で空か（§4.9）。§4.4「何をできる」が成果物でなく能力で書かれているか。Status が `NotStarted` / `InProgress` / `Done` / `Dropped` のいずれかか（§5.1）。INDEX の表行（ID・slug リンク・Status）と「起票済み・起票予定」節が同じ値で載っているか。INDEX「セッション開始時の必須チェック」(2) の grep（`スクショ確認` / `ci-status` / `テスト追加`）を通るか。site-plan / Decision の参照番号が現行か |

## 報告の補足

- 重要度順の「手戻り要因」は分割・検証手順・制約漏れ
- 軸別判定表は 8 軸。Gate 棚卸しは Gate 以外の PBI では「対象外」

## 禁止事項

- 参照先のうち site-plan / Decision の番号を開かずに「整合している」と判定する

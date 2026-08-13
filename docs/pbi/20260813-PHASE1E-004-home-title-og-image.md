# 検索結果と SNS カードで、トップページが「誰の何のサイトか」を名前・役割入りタイトルと専用 OG 画像で伝えられる

Status: InProgress
Started: 2026-08-13

## 誰が
- 検索・SNS 経由の訪問者（ペルソナ最上位: エージェント担当者 / クライアント案件 PM の面談前リサーチ）

## 何をできる
- 検索結果・ブラウザタブ・SNS カードで、トップページのタイトルから運営者の名前と役割が読み取れる
- トップページの URL をシェアしたとき、汎用のデフォルト画像ではなくサイト専用の OG 画像が出る

## なんのために
- 現状、トップの `<title>` / `og:title` は `byte-lark.com` のみ（`src/pages/index.astro:31`）。記事ページは適切なタイトルが付いており、トップだけの取りこぼし。site-plan §2 目的 1「職能リファレンス（面談時の URL 提示用）」に対し、提示された URL の第一印象で誰のサイトか分からないのは目的と直結する欠け
- トップの og:image はフォールバックの `og-default.png`（`src/layouts/BaseLayout.astro:20-22`）。専用画像に差し替えてカードの見た目を記事と同水準にする
- 出所: 2026-08-13 の外部レビュー指摘 T1 / T2（採用判断の経緯は INDEX.md 起票済み節）

## 受け入れ条件
- [ ] `index.astro` の title を「名前 + 役割 + サイト名」形式に変更。文言案を運営者に確認してから実装（案: `谷本和也 | PM/PO・フルスタックエンジニア - byte-lark.com`。Hero の表記 `PM / PO・フルスタックエンジニア` と揃える）
- [ ] og:title / twitter:title が title と一致（`buildOgMeta()` が title から生成するため実装上は自動。出力で確認）
- [ ] 他ページの title を壊していない（`yarn build` 後、`dist/` の全 HTML から `<title>` を抽出して一覧確認）
- [ ] tools/imagegen（cover-image skill）でトップ用 OG 画像（1200x630）を生成し、記事カバーと同系統のトーンにする。候補を提示し運営者が選定
- [ ] `index.astro` が `BaseLayout` に `ogImage` を渡し、`/` の og:image が専用画像を指す（他ページのフォールバック `og-default.png` は現状維持）
- [ ] CF preview の HTML で title / og:title / og:image の出力を確認（X の card validator は廃止済み（PHASE1D-009 棚卸し表）。実投稿での見た目確認は 1D-006 の持ち越しと同じ機会に行う）
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1（小）
- 関連ファイル
  - `src/pages/index.astro:31-33`（title / description）
  - `src/layouts/BaseLayout.astro:20-22`（ogImage フォールバック）
  - `src/lib/og.ts`（buildOgMeta。title をそのまま og:title / twitter:title に流す）
- OG 画像の配置は記事カバーと違い最適化不要（メタ参照のみ）なので `public/` 直下でよい（`og-default.png` と同じ扱い）。ファイル名は `og-home.png` 等、default と区別できる名前にする
- E2E に title を検証しているテストがあれば追随修正（`tests/e2e/` を grep してから着手）

## 備考
- 外部レビュー（2026-08-13、Opus によるサイト評価）の指摘 T1 + T2 を 1 PBI に統合したもの。T3〜T7（ご依頼ページ新設 / Career 定量化 / Skills・資格の見せ方 / ブログ方向性）は運営者判断待ちで未起票

## 実装ログ

### 2026-08-13 セッション 1（devcontainer）

やったこと:
- title 文言を運営者確認のうえ確定：`谷本和也 | PM / PO・フルスタックエンジニア - byte-lark.com`（役割表記は Hero に揃え、姓名はスペースなし）
- `index.astro` の title 変更 + `ogImage="/og-home.png"` を BaseLayout に渡す形で実装（画像本体は未配置）
- `dist/` 全 12 HTML の `<title>` 抽出で「`/` のみ変更、他ページ現状維持」を確認。og:title / og:image の出力も確認
- `yarn check` / `check:ts` / `test:run`（31 passed）green。e2e に title を検証するテストは無いことを grep で確認
- draft PR #44 作成（ブランチ `feat/1e-004-home-title-og`）
- トップ専用プロンプト `tools/imagegen/prompt_home.txt` 新調（小鳥を紋章風に主役化、記事カバーと同トーン・同カラー）
- OG 画像生成のコンテナ自走化を運営者承認のうえ決定：`allowed-domains.conf` に pypi.org / files.pythonhosted.org / generativelanguage.googleapis.com を追加

残タスク:
- 運営者：このクローン直下に `.env`（`GEMINI_API_KEY=...`）配置 → ccd 再起動 → resume
- 再起動後：`tools/imagegen` の壊れた `.venv` を作り直し（`python3 -m venv .venv` が ensurepip 不足で失敗した残骸あり。venv 再作成も pip も firewall 更新後なら通る想定。pip が無ければ get-pip.py を先に）
- Flash 3 枚生成（承認済み、約 45 円）→ 原寸 + 400px 縮小で評価 → 候補提示・運営者選定
- 選定画像を 1200x630 に縮小して `public/og-home.png` に配置 → §7 検証（ローカル / CF preview スクショ、CI green、CF preview の meta 出力確認）

学び・想定外:
- devcontainer には imagegen の実行基盤が丸ごと無い（`.venv` なし / pip・ensurepip なし / firewall が pypi・googleapis を遮断 / `.env` なし）。cover-image skill の手順は母艦前提だった
- sudo と `rm -rf` はコンテナ内でも permission 拒否される（apt でのパッケージ追加・ディレクトリ掃除は不可）

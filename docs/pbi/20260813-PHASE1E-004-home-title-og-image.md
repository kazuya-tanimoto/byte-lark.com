# 検索結果と SNS カードで、トップページが「誰の何のサイトか」を名前・役割入りタイトルと専用 OG 画像で伝えられる

Status: Done
Started: 2026-08-13
Completed: 2026-08-13

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
- [x] `index.astro` の title を「名前 + 役割 + サイト名」形式に変更。文言は運営者確認のうえ確定：`谷本和也 | PM / PO・フルスタックエンジニア - byte-lark.com`（Hero の表記に揃えた）
- [x] og:title / twitter:title が title と一致（dist/index.html の出力で確認）
- [x] 他ページの title を壊していない（`yarn build` 後、dist/ 全 12 HTML の `<title>` 抽出で「`/` のみ変更」を確認）
- [x] tools/imagegen でトップ用 OG 画像を生成（Flash 3 候補、記事カバーと同トーンの設計図調）。1200px/400px/240px 比較を提示し運営者が候補 02 を選定
- [x] `index.astro` が `BaseLayout` に `ogImage="/og-home.png"` を渡し、`/` の og:image が `https://byte-lark.com/og-home.png` を指す。他ページは og-default.png のまま（blog / career の dist 出力で確認）
- [x] CF preview（branch alias）の HTML で title / og:title / og:image / twitter:title の出力を確認
- [x] ローカル スクショ確認（dev server、desktop 1280px + mobile 390px。レイアウト崩れなし）
- [x] CF preview スクショ確認（feat-1e-004-home-title-og-byte-lark.tanimoto-a49.workers.dev、desktop + mobile）
- [x] E2E / CI green 確認（`scripts/ci-status.sh`：UI Tests=success / Quality Checks=success @ 9b368ef）

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
- 運営者：このクローン直下に `.env`（`GEMINI_API_KEY=...`）配置 → ccd 再起動 → resume →（セッション 2 で完了）

学び・想定外:
- devcontainer には imagegen の実行基盤が丸ごと無い（`.venv` なし / pip・ensurepip なし / firewall が pypi・googleapis を遮断 / `.env` なし）。cover-image skill の手順は母艦前提だった
- sudo と `rm -rf` はコンテナ内でも permission 拒否される（apt でのパッケージ追加・ディレクトリ掃除は不可）

### 2026-08-13 セッション 2（devcontainer、コンテナ再起動後）

やったこと:
- firewall 疎通確認 OK（初回は Claude セッションのみの再起動で firewall 未更新 → コンテナ自体の再起動が必要だった。postStartCommand はコンテナ起動時のみ実行）
- `.venv` 再構築：ensurepip 不在のため `python3 -m venv --without-pip --clear` → pypi から pip wheel を取得し `python <wheel>/pip install --ignore-installed pip` で bootstrap → python-dotenv / google-genai / Pillow 導入
- Flash 3 枚生成（prompt_home.txt + reference-logo.png）→ 1200px / 400px / 240px 縮小で比較評価 → 運営者が候補 02（線画 + 翼断面図）を選定（240px 比較で鳥の形の判別性が最良）
- 02 を 1200x630 LANCZOS 縮小で `public/og-home.png` に配置（860KB。256 色量子化は橙アクセントが劣化するため不採用）
- §7 検証：ローカル / CF preview スクショ（desktop 1280px + mobile 390px）、CF preview の title / og:title / og:image / twitter:title 出力確認、CI green 確認

学び・想定外:
- venv の pip bootstrap は get-pip.py（bootstrap.pypa.io、firewall 外）不要。pip wheel は zip なので `python <wheel>/pip install` で直接実行できる
- pip wheel 直接実行時は `--ignore-installed` が必要（wheel 自身が sys.path に乗り「already satisfied」になる）
- Astro 6 の `yarn dev` はデーモン化する（バックグラウンド起動不要、停止は `yarn dev stop`）
- コンテナ内でも repo の Playwright（chromium）で直接スクショ確認できる。母艦 MCP Playwright は不要だった

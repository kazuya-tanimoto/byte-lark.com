---
name: cover-image
description: Use when generating, replacing, or evaluating a blog article cover/eyecatch image — 記事のカバー画像・アイキャッチの生成・差し替え・候補評価を依頼されたとき、tools/imagegen（Gemini API）を使う作業全般
---

# カバー画像生成

`tools/imagegen/generate_image.py`（Gemini API）で設計図調のカバー画像を生成し、評価 → 運営者選定 → 記事配置 → 検証まで行う。

## デザイン方針（暫定、2026-08-18 導入）

tech 既存 2 本（building-this-blog / contact-form）が同一配色＋雲雀主役で並び、一覧サムネで「全部同じ画像」に見えた問題への対応。運営者の要望は「都度作るのは前提、一覧で一目で別画像と分かる形にする」。数本作って効果を見ながら調整する前提の**暫定方針**（確定ではない）。

- 固定（ブランドの役割）：濃紺の製図用紙＋方眼＋シアン線画の設計図調、雲雀の署名
- 可変（記事の識別）：主役モチーフの形＋アクセント色 1 色を記事ごとに変える。サムネサイズの印象は色調が支配するため、被写体だけ変えても足りない（今回の学び）
- 雲雀は署名（判子）扱い：隅に小さく 1 羽、円形ストロークは付けない。主役サイズ＋円形ストローク込みだとロゴ画像に見え、一本調子の主因になる（既存 1 本目がこのパターン）。参照画像は `reference-bird.png`（鳥単体）を使い、雲雀を主役に据える例外時のみ `reference-logo.png`（円形ストローク＋0/1 流つき）を使う
- アクセント色の選び方：
  - 記事ごとに変える。使用済み：橙 sun（building-this-blog / contact-form）、桜色（claude-code-devcontainer）、紫 violet（claude-code-devcontainer-tuning）
  - 色名が違っても濃紺の上で同系に見える組み合わせがある（淡い藤色と桜色はどちらも薄桃に見えた）。色は名前でなく 400px 比較で決める
  - 緑は tech カバーに使わない。カテゴリチップの緑＝Life と同一カード上で意味が衝突する（design-direction.md §2、BlogCard.astro）。Life 記事カバーに温存
  - 彩度は春空の世界観に合わせ淡め（桜色・菜の花色など春の語彙）。蛍光系は不可。カバーはコンテンツ扱いでサイトトークンの縛りは無いが、世界観からは外さない
- 判定基準：400px 縮小で既存カバーと並べ、一目で別画像と分かること（評価手順 2 で実施）

## 実行前の確認（毎回）

- デザイン方針は暫定。生成前に、既存カバーが並んだ一覧を踏まえて方針を継続するか運営者に確認する（確定になったらこの行を消し、デザイン方針節の「暫定」表記も更新する）
- 生成は有料（Flash 2K 1枚 $0.101 ≒ 15円 / Pro $0.134）。実行前に枚数と概算費用を提示して承認を得る
- モデルは Flash（`gemini-3.1-flash-image`、スクリプト既定）を主力にする。運営者の選好も Flash。Pro は注記がきれいだが線が細く、比較用の少数のみ
- 参照画像はデザイン方針節のとおり `reference-bird.png` が基本（雲雀主役の例外時のみ `reference-logo.png`）

## 生成

```fish
cd tools/imagegen
.venv/bin/python generate_image.py -n 3 -p prompt_<記事slug>.txt \
  -r ../../docs/design-drafts/covers/reference-bird.png \
  -o out/<記事slug>
```

- 出力先は `-o out/<記事slug>` で必ず記事ごとのサブディレクトリを指定する（`out/` 直下にフラットに出さない。どの画像がどの記事か分からなくなるため）。slug は `src/content/posts/` のフォルダ名に合わせる
- プロンプトは記事ごとに `prompt_<記事slug>.txt` を新調する（デザイン方針節の固定・可変に従う。雛形は `prompt_claude-code-devcontainer.txt`）。`prompt_logo.txt` は雲雀主役の旧様式。新調するときの鉄則：1案 = 1リクエスト（複数案を1枚にまとめない）、注記の文字は英数字のみ許可（全面禁止も日本語も破綻する）
- 出力は `out/<記事slug>/` に raw（16:9 2K）と `*_cover.png`（40:21 センタークロップ、2752×1444）が並ぶ

## 評価と選定

1. 各候補の `*_cover.png` を原寸で確認：鳥の造形がロゴに忠実か／注記のラベル重複・文字化け・値のない寸法線／構図バランス
2. 400px 幅に縮小した画像も作って確認（ブログ一覧カード相当。細線・小要素はここで消える）。既存記事の cover と横並びにし、一目で別画像と分かるかを確認する（デザイン方針節の判定基準）
3. 候補を順位と根拠つきで運営者に提示し、選定を仰ぐ（勝手に決めない）

## 記事への配置

- 記事をフォルダ形式にし（`src/content/posts/<slug>/index.md`）、選定画像を同フォルダに `cover.png` で配置、frontmatter に `cover: ./cover.png`（詳細: docs/writing-workflow.md §画像）
- コミットする cover は 2000×1050 に縮小（Pillow LANCZOS）。2752 原本と縮小版は `out/<記事slug>/`（gitignored）に残す

## 検証と既知の罠

- CLAUDE.md §7 の検証ゲートを全て実施（ローカル + CF preview のデスクトップ/モバイル表示、CI green）
- カバー付き記事のパス変更（改名・フォルダ化）は CF ビルドキャッシュで ImageNotFound になる既知パターン。CF が赤になったら Clear Cache
- サブディレクトリ起点のセッションは repo 本体への Bash 書き込み（git 含む）が sandbox で塞がれる。その場合は bash スクリプトを書き出して運営者ターミナルで実行してもらう

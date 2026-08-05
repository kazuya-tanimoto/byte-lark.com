---
name: cover-image
description: Use when generating, replacing, or evaluating a blog article cover/eyecatch image — 記事のカバー画像・アイキャッチの生成・差し替え・候補評価を依頼されたとき、tools/imagegen（Gemini API）を使う作業全般
---

# カバー画像生成

`tools/imagegen/generate_image.py`（Gemini API）で設計図調のカバー画像を生成し、評価 → 運営者選定 → 記事配置 → 検証まで行う。

## 実行前の確認（毎回）

- 生成は有料（Flash 2K 1枚 $0.101 ≒ 15円 / Pro $0.134）。実行前に枚数と概算費用を提示して承認を得る
- モデルは Flash（`gemini-3.1-flash-image`、スクリプト既定）を主力にする。運営者の選好も Flash。Pro は注記がきれいだが線が細く、比較用の少数のみ
- 参照画像は `docs/design-drafts/covers/reference-logo.png` が正規（円形ストローク＋0/1 データ流を含むロゴ全体）。`reference-bird.png` は小ロゴ用でカバー生成には使わない

## 生成

```fish
cd tools/imagegen
.venv/bin/python generate_image.py -n 3 -p prompt_logo.txt \
  -r ../../docs/design-drafts/covers/reference-logo.png \
  -o out/<記事slug>
```

- 出力先は `-o out/<記事slug>` で必ず記事ごとのサブディレクトリを指定する（`out/` 直下にフラットに出さない。どの画像がどの記事か分からなくなるため）。slug は `src/content/posts/` のフォルダ名に合わせる
- プロンプトは `prompt_logo.txt`（ロゴ参照つき・通常はこれ）/ `prompt.txt`（参照なし）。新調するときの鉄則：1案 = 1リクエスト（複数案を1枚にまとめない）、注記の文字は英数字のみ許可（全面禁止も日本語も破綻する）
- 出力は `out/<記事slug>/` に raw（16:9 2K）と `*_cover.png`（40:21 センタークロップ、2752×1444）が並ぶ

## 評価と選定

1. 各候補の `*_cover.png` を原寸で確認：鳥の造形がロゴに忠実か／注記のラベル重複・文字化け・値のない寸法線／構図バランス
2. 400px 幅に縮小した画像も作って確認（ブログ一覧カード相当。細線・小要素はここで消える）
3. 候補を順位と根拠つきで運営者に提示し、選定を仰ぐ（勝手に決めない）

## 記事への配置

- 記事をフォルダ形式にし（`src/content/posts/<slug>/index.md`）、選定画像を同フォルダに `cover.png` で配置、frontmatter に `cover: ./cover.png`（詳細: docs/writing-workflow.md §画像）
- コミットする cover は 2000×1050 に縮小（Pillow LANCZOS）。2752 原本と縮小版は `out/<記事slug>/`（gitignored）に残す

## 検証と既知の罠

- CLAUDE.md §7 の検証ゲートを全て実施（ローカル + CF preview のデスクトップ/モバイル表示、CI green）
- カバー付き記事のパス変更（改名・フォルダ化）は CF ビルドキャッシュで ImageNotFound になる既知パターン。CF が赤になったら Clear Cache
- サブディレクトリ起点のセッションは repo 本体への Bash 書き込み（git 含む）が sandbox で塞がれる。その場合は bash スクリプトを書き出して運営者ターミナルで実行してもらう

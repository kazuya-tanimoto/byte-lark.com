---
title: "alacritty + tmuxからghostty + herdrへ乗り換えた"
description: "2年半使ったalacritty + tmuxからghostty + herdrへ乗り換えました。エージェントを並走させる作業がspacesとagentsでどう変わったか、日本語入力のハマりどころ2件と設定の実物を書きます。"
category: tech
tags: ["ghostty", "herdr", "tmux", "terminal", "claude code"]
publishedAt: 2026-09-09
draft: true
slug: ghostty-herdr-migration
---

こんにちは。今回はターミナル環境をalacritty + tmuxからghostty + herdrへ乗り換えた話です。  
alacritty + tmuxは2年半使っていましたが、いまはghostty + herdrを使っています。

Claude Codeのようなコーディングエージェントを複数走らせる作業がどう変わったかと、日本語入力のハマりどころ2件、いま使っている設定を紹介します。  
ターミナルマルチプレクサ自体の説明はしません。

## herdrとは

[herdr](https://herdr.dev/)は、Rust製のターミナルマルチプレクサで、tmuxのようにペインとタブを持ちます。  
tmuxに無いのは左サイドバーで、spaces（作業空間の一覧）とagents（動いているAIエージェントの一覧）が並びます。agentsの行には状態（working / blockedなど）が表示され、承認待ちや完了でmacOSの通知も出せます。  
一言でいうと、tmuxをAIエージェント向けに再構築したもの、というイメージかと思います。

手元のバージョンはherdr 0.7.3です（執筆時点の最新は0.9.0）。

## 導入のきっかけ

alacritty + tmuxに困っていたわけではありません。きっかけは、[herdrの紹介記事](https://zenn.dev/studypocket/articles/herdr-ai-agent-multiplexer)をたまたま見つけたことでした。  
決め手は、エージェントの状態を設定なしで検知して見せてくれるところと、キーバインドがtmux互換で学習コストが低そうなところでした。  
「これはtmuxのAIエージェント向け上位互換かも？」と思って試してみました。  
実際に入れてみると、tmuxでやっていたことはそのままでき、加えてエージェントの状態の可視化や通知ができます。  
「これはいいぞ！」となってそのまま定着しました。

## 変わったこと

### 作業の型が決まった

herdrの[公式ドキュメント](https://herdr.dev/docs/concepts)には、workspace（サイドバーの表示ではspaces）について「Use one workspace per repo, task, or investigation.（workspaceはリポジトリ・タスク・調査ごとに1つ使う）」とあります。  
私はリポジトリごとにspaceを分け、その中でタスクごとにタブを作成し、1タスクに1エージェントを走らせています。  
一時的なコマンド実行やメモなどが必要な場合はタブ内を複数ペインに分割して行っています。  
普段の画面はこんな感じです。

![普段の作業画面。左にspacesとagentsのサイドバー、中央にエージェントのセッション、右にコマンド実行用のペイン。この記事を書いているセッション自体が写っている](./herdr-overview.png)*左がspacesとagentsのサイドバー、右がコマンド実行用のペイン*

tmux時代はエージェントの実行状態を把握したいが為に、1画面に4〜6ペインを開いていました。  
これが現在の型にしてからは主に1〜2ペイン、多くて3ペイン程度で足りています。  
なお、写っているエージェントをdevcontainerで隔離して動かす環境は[以前の記事](/blog/claude-code-devcontainer)に書きました。

### エージェントの巡回がなくなった

tmuxでエージェントを複数走らせていたころは、ウィンドウを順に切り替えて、終わったか・止まっていないかを見て回っていました。  
herdrではサイドバーのagentsに下のように状態が並ぶので、見て回る必要がなくなりました。

![agentsサイドバーの拡大。blocked（入力や承認の待ち）、idle（確認済み）、working（作業中）、done（完了・未確認）の4状態が並んでいる](./herdr-agents-sidebar.png)*agentsサイドバーの拡大*

### 通知で気づけるようになった

エージェントが入力や承認を待つ状態になったり、作業が終わったりすると、macOSの通知が来ます。  
こちらから見に行かなくてもよくなり、待ち時間に別の作業へ移りやすくなりました。  
届くのはこんなバナーです。

![エージェントの作業完了を知らせるmacOSの通知バナー](./notification-claude-finished.png)*作業完了を知らせるmacOSの通知*

設定は次のとおりです。  
配送先はOSの通知サービスのほか、herdr内のトーストや端末経由も選べます。

```toml
[ui.toast]
# エージェントが承認待ち・完了になったら macOS 通知
delivery = "system"
```

## 端末もalacrittyからghosttyへ

herdrは、いま使っているターミナルをそのまま使えます。実際、最初はalacritty + herdrで試していました。  
dotfilesのコミットログでは、alacrittyの起動をherdrに切り替えたのが最初で、その約2週間後にghosttyでも同じ切り替えをしています。

ghosttyに替えた理由は、コミットログにも残っておらず、自分でも覚えていません。  
この記事を書くにあたって試し直したところ、alacrittyではエージェントの通知が音だけで、デスクトップ通知が出ませんでした。ghosttyだけを起動し直すと通知が届きます。  
仕組みの違いまでは追えていませんが、当時もこれに気づいて替えたのだろうと思います。  
いまの使い方は通知が前提なので、選び直すとしてもghosttyにします。

ghostty自体は過去にも一度試して、そのときはalacritty + tmuxに戻っています。  
ターミナルはiTerm2、wezterm、warpも使ってきました。  
iTerm2は完成度が高くて不満らしい不満は出ないのですが、設定がバイナリ形式で、gitでの管理がしっくりこず、何往復もしては離れています。  
warpは日本語変換に難があり、weztermはlua設定など良い点もあったのですが、どこがとは言えないまま合わず、どちらも定着しませんでした。  
herdrとの組み合わせになって、ようやくghosttyに落ち着きました。

## 乗り換えで失ったもの

ほとんどありません。alacrittyは速さが売りですが、ghostty + herdrにして遅いと感じたこともないです。  
強いて挙げると2つあります。  
tmuxのcopy-mode相当の画面で、`0`や`$`での行頭・行末ジャンプと`w`や`b`での単語移動の挙動が今ひとつです。  
それと、tmuxでペインに番号を出して選ぶ機能（display-panes）に相当するものがありません。  
ただ、先に書いた型でペインの数自体が減ったので、display-panesの方は困らなくなりました。

## ハマりどころ2件（どちらも日本語入力）

### 日本語が打てなくなる

乗り換えたあと、ターミナルでだけ日本語が打てなくなる現象に当たりました。  
IMEを日本語にしても直接入力のままで、他のアプリで一度日本語を打つと直ります。  
IMEをazooKeyからGoogle日本語入力に替えても再現しました。

原因はherdrの実験的設定`switch_ascii_input_source_in_prefix`でした。  
prefixキー（操作の合図として最初に押すキー）を使っている間だけ、入力ソースをASCIIに切り替える機能です。日本語IMEのままprefixを押して文字が化けるのを防いでくれるのですが、元の入力ソースに戻し損ねることがあります（[herdr #1221](https://github.com/herdrdev/herdr/issues/1221)、最新0.9.0でも未修正）。  
私はこの設定をfalseにして解消しました。  
引き換えに、日本語入力中のprefix誤爆は戻ってきます。

```toml
[experimental]
# prefix 操作中だけ macOS の入力ソースを ASCII に自動切替（日本語 IME の prefix 誤爆対策）。
# 元の入力ソースに戻し損ねて日本語入力できなくなる不具合（herdr #1221、0.7.3 で未修正）を
# 頻繁に踏むため無効化。修正が入ったら再検討する
switch_ascii_input_source_in_prefix = false
```

### 変換中にCtrl+Kを押すと入力が消える

こちらはghostty側です。  
日本語の変換中にCtrl+KやCtrl+L、Ctrl+;を押すと、変換中の文字が消えます。  
最初はIME（azooKey）を疑いましたが、ghosttyの既知バグでした。  
修正は[PR #12547](https://github.com/ghostty-org/ghostty/pull/12547)でマージ済みですが、執筆時点の安定版1.3.xには入っていません。  
私はtip版（開発版）に切り替えて解消しました。  
tip版が知らないうちに更新されて挙動が変わらないよう、更新は通知だけにする`auto-update = check`も併せて設定しています。

## 設定の要点

herdr側は、tmuxの手癖をそのまま持ち込む方向でキーを合わせました。

```toml
[keys]
# tmux と同じ prefix
prefix = "ctrl+a"
# tmux（pain-control）の prefix+| と同じ右分割。デフォルトの prefix+v を置き換え
split_vertical = "prefix+|"
# 番号切替は space を主役に、tab は shift+番号（repo=space / agent=tab 運用）
switch_workspace = "prefix+1..9"
switch_tab = "prefix+shift+1..9"
```

ghostty側は、起動コマンドをherdrにして、ghostty内蔵の分割・タブのキーを無効化しています。  
下の引用は抜粋で、実際は分割・タブ・ウィンドウ系のキーを列挙してunbindしています。

```
# Launch herdr (attaches to the persistent session, creates it if missing)
command = /opt/homebrew/bin/herdr

# ===== ghostty 内蔵の split / tab ショートカットを無効化 =====
# 押すと同じ herdr セッションに 2 つ目のクライアントがつながってしまうため。
keybind = super+d=unbind
```

なお、alacrittyとtmuxの設定はdotfilesに残したままにしています。  
合わなければ戻れる状態で移行しました。

## まとめ

乗り換えてから、tmuxでやっていたことはそのままに、エージェントの状態の可視化と通知ができるようになりました。  
おかげでエージェントの巡回がなくなり、待ち時間は別の作業に充てられています。  
エージェントを複数走らせる使い方をしているなら、いまの端末のまま試せます。ただし通知の出方は端末によって差があって、手元ではalacrittyだとデスクトップ通知が出ませんでした。  
herdrはいいぞ！

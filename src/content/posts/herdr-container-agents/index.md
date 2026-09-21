---
title: "コンテナの中のClaude Codeをherdrのサイドバーに出す"
description: "devcontainerで隔離したClaude Codeは、herdrのサイドバーに出てきません。隔離を崩さずに状態と通知を出せるようにした方法と、登録したhookのイベント、返事待ちが承認待ちと表示された誤検知の直し方を書きます。"
category: tech
tags: ["herdr", "claude code", "devcontainer", "hooks"]
publishedAt: 2026-09-20
draft: true
slug: herdr-container-agents
---

こんにちは。今回は、コンテナの中で動かしているClaude Codeを、herdrのサイドバーに出せるようにした話です。

herdrは、AIエージェントの一覧と状態をサイドバーに出せるターミナルマルチプレクサです。  
[前回の記事](/blog/ghostty-herdr-migration)で書いたとおり、承認待ちや完了で通知も届きます。  
ところが、[devcontainerで隔離したClaude Code](/blog/claude-code-devcontainer)は、このサイドバーに出てきませんでした。  
同じウインドウの上下2ペインで、手元のMacのClaude Codeとコンテナ内のClaude Codeを動かしているのに、agentsに並ぶのはMacの1行だけです。

この記事では、コンテナの隔離を崩さずに、コンテナ内のセッションもサイドバーに出るようにした方法を書きます。  
約7週間使っていて、サイドバーの行と通知は常に役に立っています。

## サイドバーに出ない原因は、Claude Codeからherdrへの申告経路が無いこと

AIに調べてもらったところ、herdrは動いているClaude Codeを自分で探しているわけではありませんでした。  
`herdr integration install claude`を実行すると、Claude Codeの設定にhookが登録されます。  
このhookが「このペインで動いています」とherdrに申告する作りです。  
Macに入っているhookのスクリプトを開くと、次の確認が入っていました。

```sh
[ "${HERDR_ENV:-}" = "1" ] || exit 0
[ -n "${HERDR_SOCKET_PATH:-}" ] || exit 0
[ -n "${HERDR_PANE_ID:-}" ] || exit 0
```

この3つの環境変数が揃ったときだけ、herdrのUnixソケットにJSONを1行送ります。

一方、コンテナに入るときに使っている`devcontainer exec`は、Macの環境変数をコンテナに渡しません。  
私の構成では、コンテナ内のClaude Codeの設定は専用のvolumeに分けてあるので、このhook自体もコンテナにありません。Macのソケットもコンテナからは見えません。  
3条件がすべて成り立たず、申告する経路が最初から無い状態でした。  
手元のherdrは0.9.0ですが、この記事の対応を入れない限り、今も同じ症状が出ます。

herdrにはペインの前面プロセスを見る仕組みもあるようです。  
ただ、コンテナ内のclaudeはDockerの別のPID空間にいるので、Macのプロセス一覧には出てきません。  
ペインの前面プロセスとして見えるのはdevcontainer CLI（node）だけで、こちらも判定材料になりません。

herdrが認識しているペインを一覧で見ても、claudeと認識されていたのはMacのセッションだけでした。

> 【要確認｜事実】
> 対象：「手元のherdrは0.9.0ですが、この記事の対応を入れない限り、今も同じ症状が出ます。」
> 質問：Macで`HERDR_AGENT=claude`を付けて`devcontainer exec … claude`を起動すると、コンテナのセッションはサイドバーに出ますか（出る／出ない／試さない）
> 無回答なら：対象の文を「手元のherdrは0.9.0です。」に書き換える

## ソケットをコンテナに渡す案は採用しなかった

すぐ思いつくのは、環境変数とhookをコンテナに持ち込み、herdrのソケットにコンテナから触れるようにする方法ですが、採用しませんでした。

herdrのソケットAPIには、好きな作業ディレクトリで新しいペインを作る`pane.split`や、ペインに文字を流す`pane.send_text`があります。  
ソケットをコンテナに渡すと、Macで任意のコマンドを実行できる口をコンテナに渡すことになります。  
コンテナは`--dangerously-skip-permissions`を付けたClaude Codeを放置して走らせる場所なので、これでは隔離した意味がなくなります。  
（そもそもmacOSのUnixソケットはbind mountで素直に通らない可能性が高く、TCPへの橋渡しとfirewallの穴あけも必要になりそうでした）

## 状態はコンテナがファイルに書き、herdrへの報告はMacから行う

採用したのは、コンテナがファイルに状態を書き、Mac側がそれを読んでherdrに報告する、一方通行の受け渡しです。

コンテナ内のhookは、Macと共有している作業ディレクトリに、状態を1語で書きます。実行中は`working`、応答待ちは`idle`、承認待ちは`blocked`です。  
Mac側では、見張りのスクリプト（以下、見張り）がそのファイルを0.4秒間隔で見ていて、内容が変わったときだけherdrに報告します。  
コンテナが書けるのは自分の作業ディレクトリのファイルだけで、Macのソケットには触れません。

herdrへの報告に使うAPIのパラメータは、`herdr api schema --json`で確認できます。  
状態を報告するのは`pane.report_agent`で、必須のパラメータは`pane_id`・`source`・`agent`・`state`の4つです。`source`は報告元の名前で、自分で決めた文字列を入れます。  
行を消す`pane.release_agent`も用意されています。

実装の前に、このAPIを手で叩いて試しました。  
`working`を報告するとサイドバーに行が増え、`idle`を報告すると表示が変わり、`pane.release_agent`で行が消えます。

herdrにはペインの画面から状態を読み取る仕組みもあるので、報告が最初の1回だけで済むかどうかも確かめました。  
`idle`と報告したあとにコンテナ側のセッションを動かしても、表示は`working`に変わりませんでした。  
手元で試した限り、herdrは一度報告を受けたペインの状態を自分では更新しないので、状態が変わるたびに報告する必要があります。

## コンテナ側では、hookを6つのイベントに登録した

Claude Codeのhookに、次の6つのイベントを登録しています。

| Claude Codeのイベント | 書き出す状態 | 役割 |
| --- | --- | --- |
| SessionStart | idle | セッション開始時の初期化 |
| UserPromptSubmit | working | ユーザーからの指示を受けて実行中 |
| PostToolUse | working | ツールの実行後（承認待ちから実行中へ戻す） |
| Stop | idle | 処理が完了して応答待ちに戻った状態 |
| Notification | blocked | ユーザーの承認を待っている状態 |
| SessionEnd | （状態ファイルを消す） | セッション終了時に表示を削除する |

PostToolUseは後から足しました。承認待ちで`blocked`になったあと、承認されてツールが動いたら`working`へ戻すためのものです。

hookの本体はPOSIX shのスクリプトで、最初のほうに次の確認を置いています。

```sh
[ -f /.dockerenv ] || exit 0
[ -n "${HERDR_PANE_ID:-}" ] || exit 0
[ -n "${CLAUDE_PROJECT_DIR:-}" ] || exit 0
```

`/.dockerenv`はコンテナの中にだけあるファイルです。Macで動いた場合と、herdrの外から起動した場合は、何もせずに終わります。

状態ファイルは、`CLAUDE_PROJECT_DIR`（Claude Codeがhookに渡すプロジェクトのディレクトリ）直下の`.herdr-state/`にペインごとに1つ作ります（`.gitignore`に追加済み）。  
ペインごとにファイルが分かれるので、コンテナのセッションを複数同時に動かしても、サイドバーの行は別々に動きます。  
書き込みは一時ファイルに書いてから`mv`で置き換えています。Mac側が書きかけの内容を読まないようにするためです。

subagent由来のイベント（hookの入力JSONに`"agent_id"`が含まれるもの）は無視しています。  
本体がまだ動いているのに、subagentの停止で`idle`表示になってしまうためです。

## Mac側では、起動コマンドに見張りの起動と後片付けを足した

コンテナの起動から`devcontainer exec`でClaude Codeを起動するまでをまとめた自作コマンド`ccd`に、次の処理を足しました。  
動くのは`HERDR_PANE_ID`があるとき、つまりherdrのペインから起動したときだけです。

- 前回の異常終了で残った状態ファイルを消す（古い値を報告しないため）
- 見張りをバックグラウンドで起動する
- `--remote-env HERDR_PANE_ID=...`でペインのIDをコンテナに渡して`devcontainer exec`を実行する
- セッションが終わったら見張りを止める

見張りは、状態ファイルが消えたときと、自分が止められたときには、`pane.release_agent`を送ってから終わります。  
herdrが一時的に落ちていても終了せず、次の巡回で送り直します。

使うときの手順は増えておらず、herdrのペインから`ccd`を実行すれば済みます。

起動すると、コンテナのセッションもサイドバーに1行として出ます。

【要写真：撮影リスト No.1（herdrのサイドバー。コンテナのセッションの行とMacのセッションの行が並んでいる状態）】  
*herdrのサイドバーに、コンテナのセッションとMacのセッションが並んでいる*

## 元に戻しやすい置き場所を選んだ

作る前に、うまくいかなかったときに戻せるかを考えました。

hookの本体はリポジトリの`.devcontainer/`に置き、hookの登録はリポジトリの`.claude/settings.json`に書いています。  
どちらも作業ディレクトリのbind mount越しにコンテナから読まれるので、コミットをrevertすればコンテナ側からも同時に消えます。

`devcontainer.json`は変更していません。mountsや環境変数の定義を変えると、入れるときも戻すときもコンテナの再作成が必要になるためです。  
コンテナの永続volume、herdrの設定、Mac側のClaude Codeの設定にも触れていないので、Mac上のセッションの挙動は変わりません。

やめるときは、このリポジトリと、Mac側のスクリプトを置いている設定用のリポジトリ（dotfiles）のコミットを1つずつrevertして、`.herdr-state/`を消すだけです。  
コンテナの再作成は不要で、一時的に止めたいだけなら見張りを止めれば済みます。

## 返事を待っているだけのセッションがblockedになった

使い始めた翌日、サイドバーに`blocked`が2行並びました。  
ところが、どちらも承認待ちではなく、私の返事を待っているだけのセッションでした。

原因は、Notificationイベントが承認待ち以外でも発火することでした。  
入力待ちのまま一定時間たつと、「Claude is waiting for your input」という通知でも発火します。  
hookに渡るJSONには`notification_type`という欄があり、この場合は`idle_prompt`が入っています。  
`blocked`を書く前に、これを捨てる分岐を足しました。

```sh
if [ "$state" = blocked ]; then
  case "$input" in
  *'"notification_type":"idle_prompt"'* | *'"notification_type": "idle_prompt"'*) exit 0 ;;
  esac
fi
```

Mac上のセッションは、同じ状況でも`blocked`になりません。  
herdr公式のhookを読み直すと、状態は送っていませんでした。  
SessionStartのときにセッションIDと会話ログのパスを報告するだけで、状態の判定はherdr側が行っています。  
コンテナのペインでは、前に書いたとおりherdrがClaude Codeを見つけられません。  
そのためコンテナ側は状態を自分で申告するしかなく、Claude Codeのどのイベントをどの状態と見なすかは、自分で決めることになります。  
今回の誤検知は、その対応付けを1つ間違えたものでした。

## 残っている不便

まれに、1つのセッションだけサイドバーに出ないことがあります。  
コンテナ側の状態ファイルは更新されていて、Mac側の見張りも動いています。  
herdrに手で報告してもそのペインだけ出ず、同じタブの別のペインなら出ます。  
原因は分かっていませんが、新しいペインを作って起動し直すと出ます。  
これ以外に不便は無く、満足しています。

## まとめ

- コンテナ内のClaude Codeがherdrのサイドバーに出ないのは、herdrへ申告する経路（環境変数・hook・ソケット）がコンテナに届いていないため
- herdrのソケットはコンテナに渡さない。コンテナは共有ディレクトリに状態を書くだけにして、herdrへの報告はMac側から行う
- コンテナのvolumeや`devcontainer.json`には触れず、リポジトリ内のファイルだけで構成すると、コミットのrevertで戻せる
- Notificationイベントは入力待ちでも発火する。`notification_type`が`idle_prompt`のものは除外する

herdrとコンテナを併用するなら、エージェントの状態を検知できるカスタマイズはマストですね。

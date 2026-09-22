---
title: "Claude Codeの報告が長い原因はoutput styleの矛盾だった"
description: "「簡潔に」と何度言っても長文で報告してくるClaude Code。指示の無視ではなく、自分で書いたoutput styleが長文を要求していました。条文の矛盾を消し、毎ターン注入するhookを全リポジトリ共通に移すまでの記録です。"
category: tech
tags: ["claude code", "output style", "hooks", "dotfiles"]
publishedAt: 2026-09-04
draft: true
slug: claude-code-concise-output
---

こんにちは。Claude Codeに「簡潔に報告して」と繰り返し言っているのに、次のセッションではまた長文で返ってくる、という状態が続いていました。  
原因を調べたところ、指示が無視されていたのではなく、自分で書いた指示同士が矛盾していました。  
この記事では、その診断と、矛盾を消してから毎ターン注入するhookの置き場を全リポジトリ共通にするまでを書きます。

作業は2つの場所で分けて進めました。  
診断と設計はclaude.aiのチャットで行い、その結果を手元のMacのClaude Codeに依頼して反映しました。  
この記事では前者を「チャット側」、後者を「Claude Code側」と呼び、どちらで確認した事実かを分けて書きます。  
対象はClaude Code v2.1.259です。  
ターミナルはghosttyで、普段の最小幅は110桁です。  
5K2Kモニターの幅を3分割して使うときに、サイドバーを除いた表示幅がこの値です。

## 困っていたこと

Claude Codeの応答の文体は、output styleという仕組みで指定できます。  
Markdownファイルに書いた指示が、選んだスタイルとしてシステムプロンプトに入る仕組みです。  
自作の`concise-ja`というスタイルで簡潔さを指示し、さらに要点を短くまとめたもの（以下ダイジェスト）をhookで毎ターン注入していました。  
hookはClaude Codeが特定のイベント（プロンプトの送信時など）で実行するコマンドです。  
プロンプト送信時のhookでは、その標準出力がClaudeへのコンテキストとして渡されます。  
それでも症状は次のとおりでした。

- 完了報告が7セクション・30行超になる（あるPRのマージ運用を変えたときの報告）
- 「簡潔に」と一言言えば短くなる。つまり指示自体は理解している
- 短くなった後も「判断待ち1件。〜。〜。〜。」のように、60字未満の文を4つ改行なしで並べる
- ターミナルでは段落が1行に折り返されるので「1行が長い」ように見える

「気をつけます」と言わせても、次のセッションで再発します。  
ここまでがチャット側に持ち込んだ材料です。

## 最初の見立てと外れた理由

チャット側で最初に立てた見立ては2つあり、どちらも外れました。

1つ目は「SessionStart hookは会話の先頭に1回注入するだけだから効かないのでは」です。  
実際の設定を確認すると、注入はUserPromptSubmit hookで行っていて、毎ターン入っていました。

2つ目は「注入が届いていないのでは」です。  
hookのコマンドをシェルで直接実行すると5行のダイジェストが出力され、Claude側もその内容を引用できていました。  
届いてはいます。

## 長い報告をoutput styleの条文と突き合わせる

ここでチャット側が取った方法は、Claude Codeに「なぜ守らないのか」と聞くことではなく、`concise-ja.md`の条文を全部読んで、長かった報告と1項目ずつ照合することでした。

### 守った結果として長かった

旧版の`concise-ja.md`には、簡潔さの条文と並んで次の条文がありました。

- 「長さは文字数でなく『判断根拠の量』で決める。根拠・数値・ファイル名・コマンド・出力は削らない」
- 「設計判断・リスク・トレードオフは根拠を省略せず書いてよい」
- 「完了報告は3点のみ：…その結果（出力を貼る）」
- 「監査・調査結果は『事実 → 分析 → 提案 → 判断仰ぎ』の4段階で組み立てる」
- 毎ターン注入するダイジェストの1行目が「事実主張には根拠を1行で併記」

30行超だった報告をこれらと照合すると、ほぼ全項目に準拠していました。  
検証コマンドと出力を貼り、判断の理由を書き、調査結果を4段階で組み立てています。  
「事実主張には根拠を1行で併記」に従えば、事実がN個あるだけで最低2N行になります。  
つまり指示を守った結果として長くなっていました。

### 形式ルールは内容ルールに負ける

条文の数も問題でした。  
本文が30条、ダイジェストが5行ありました。  
旧版には「1文が60字を超える場合は複数行に分割するか、意味を損なわずに60字に収まるよう言い換える」という形式ルールもありました。

このうち「根拠を書いたか」のような内容ルールは、書きながら満たせます。  
一方「60字以内か」のような形式ルールは、書いた後に数えないと分かりません。  
両方を同時に要求すると、書きながら満たせる内容ルールが勝ちます。

### 症状に一番近い条文が一番弱い位置にあった

「1行がダラダラ長い」の実体は段落でした。  
60字ルールには違反していません。  
違反していたのは「2文以上続く説明は箇条書きに分解」だけで、この条文は「文体」節12項目の2番目にあり、ダイジェストには入っていませんでした。  
症状に一番効く条文が、一番目立たない場所に埋まっていたことになります。

## もう一つの原因、output styleとhookのスコープ違い

output styleはdotfiles（設定ファイルをまとめたGitリポジトリ）で管理していて、全リポジトリ共通です。  
一方、ダイジェストを注入するhookはリポジトリ側の設定ファイルに置いていました。

devcontainerは[以前の記事](/blog/claude-code-devcontainer)で作った、Claude Codeを隔離して動かす環境です（以下コンテナ）。  
チャット側で作った確認用の依頼文を、その中のClaude Codeで実行してもらった結果は次のとおりでした。

- byte-lark.comのコンテナでは、hookは`/workspace/.claude/settings.json`のUserPromptSubmitにあり、awkでマーカー節を抜き出していた
- 別のコンテナでは`/workspace/.claude/settings.json`にhooks節が無く、`~/.claude/settings.json`のUserPromptSubmitは別のhookだけだった。どのリポジトリのコンテナだったかは記録に残っていません

チャット側はここから、hookはbyte-lark.com限定だと見ていました。  
後述するClaude Code側の調査では、手元のMacで見る限りbyte-lark.comとmonotrip.jpの両リポジトリのmainにhookがありました。  
別のコンテナがどのリポジトリだったか分からないので、この2つが食い違うのかどうかは決められません。  
ただ、どちらであっても、output styleはグローバルでhookはリポジトリ限定という構成のせいで、セッションごとに挙動が違って見えていたことは変わりません。  
これが置き場を1つにする理由になりました。

## 確認したClaude Codeの仕様

設計の前に、チャット側で公式ドキュメントから確認した仕様です。  
出典は末尾にまとめます。  
バージョン表記はドキュメント記載のものです。

Output styleについて。

- 組み込みのConciseスタイルがあります（v2.1.237以降）。結果を先に出し、前置きや実況を省き、作業の徹底度はDefaultと同じで、エラーやセキュリティ警告、破壊的操作の確認は完全に残します
- カスタムスタイルの`keep-coding-instructions`はデフォルト`false`で、`false`だとClaude Code組み込みのソフトウェアエンジニアリング指示が外れます
- Default以外のスタイルを選ぶと、Claude Codeは会話中にもスタイルをリマインドします
- 反映は`/clear`か新セッション後です。ターミナルでは`/config`から選び、`.claude/settings.local.json`に保存されます

Hooksについて。

- SessionStartのadditionalContextは会話の先頭に置かれます（セッションの開始時だけで、毎ターンではありません）
- UserPromptSubmitのadditionalContextは送信したプロンプトと並んで挿入されます（毎ターン）
- 注入文は命令形のシステム指示ではなく事実の記述として書きます。システムコマンド風だとプロンプトインジェクション防御に引っかかり、コンテキストとして扱われずユーザーに表示されることがあります
- Stop hookの入力には`last_assistant_message`（そのターンの最終応答）と`stop_hook_active`が入ります。`decision: "block"`と`reason`を返すとClaudeは停止せず継続します。表示済みの1本目は残るので、発火時は2本表示になるはずです（表示の挙動は未確認）
- 出力の生成前に止めるhookは、ドキュメントのイベント一覧には見当たりません（PreToolUseはツール用、UserPromptSubmitは入力用）
- MessageDisplay hook（v2.1.152以降）は表示専用です。入力の`delta`に対して`displayContent`を返すと画面表示だけ置き換わり、transcriptもClaudeの出力も変わりません。`--verbose`または設定`verbose: true`では無視されます
- 既知の不具合として、UserPromptSubmit hookの出力などのシステムリマインダーが挟まると、同一ターン内でStop hookが複数回発火し、`stop_hook_active`が毎回`false`のままになる報告があります（anthropics/claude-code#54360、Opus 4.6での報告。調査時点では対応されないままクローズされています）

## 設計で決めたこと

### 前提を「最小出力、詳細は聞かれてから」にする

旧版の矛盾は「聞かれる前に全部出せ」と「短くしろ」の同居でした。  
前提を片方に決めれば矛盾は消えます。  
会話のコンテキストは残るので、後から「検証の詳細は」と聞けば短いやり取りで引き出せます。

ただし、聞かれなくても各1行書く例外を残しました。  
エラー、未完了や未検証の残り、破壊的操作の前の確認、判断待ちです。  
ここを落とすと、今度は「未完了を完了として報告する」ほうに振れます。  
依頼外の気づきも1行だけ残します。  
存在を知らない情報については、ユーザーが追加質問できないからです。

「判断を仰ぐ前に自分でできる調査は済ませる」という行動の条文は残しました。  
変えたのは書く量だけで、事実1行と推奨1行に制限しています。

### 1行の上限を「文」ではなく「行」で定義する

「1文 = 1行」と決めると文と行が一致するので、上限は行に1本だけ置けば済みます。  
上限値はターミナルの幅から逆算しました。  
最小幅110桁から、Claude Codeの表示プレフィックス（「● 」の2桁と箇条書きの字下げ最大4桁）を引くと約104桁です。  
全角50字は100桁で、4桁の余裕があります。  
そこで50字に決めました。

将来Stop hookで機械検査をする場合の閾値は表示幅100桁にします。  
全角50字 = 100桁という同じ値をルールと検査で共有します。  
別の値を持つとズレるからです。  
パス、コマンド、URL、file:lineは字数に数えません。

### ダイジェストは形式ルールだけにする

毎ターン注入するダイジェストは、症状に直結する条文（段落を書かない、1文 = 1行）を1行目に置きました。  
「未検証のコマンドは1回実行する」のような行動ルールは本文に残し、ダイジェストからは外しています。  
上限は5行、1行1テーマです。

改訂後の`concise-ja.md`末尾にあるマーカー節が、そのまま注入される文言です。  
以下は2026年9月4日時点のものです。

```markdown
<!-- hook-digest:start -->
1 文 = 1 行。改行なしで 2 文を続けない
1 行 50 字以内。パス・コマンド・URL は数えない
作業後の報告は「変更／検証／判断待ち」の型のみ、合計 10 行以内
出力・ログは貼らない。詳細は聞かれてから出す
根拠は結論の直後に 1 行。未確認は「未確認」と書く
<!-- hook-digest:end -->
```

### 条文は追加ではなく置き換え

「output styleを守らないのに、新しい条文なら守るのか」という疑問は当然あります。  
答えはこうです。  
守られなかったのは条文同士を矛盾させたからです。  
矛盾する条文を消して型1つに置き換えるのは、条文を1つ足すのとは別の操作です。  
「簡潔に」と一言言えば短くなる事実が、指示自体は効いている証拠です。

改訂で本文の条文は減っていません。  
上位の箇条書きで数えると30から36に、下位の項目を含めると30から43に増えました。  
削除したのは前述の「削らない」系の条文と、ダイジェストの「事実主張には根拠を1行で併記」です。  
増えたのは新設した「前提」と「報告の型」の節で、この2節だけで上位の箇条書きが10項目あります。

### hookは残し、dotfilesに移して全リポジトリ共通にする

output styleのリマインドより、hookのほうがプロンプトの直近に置ける分だけ効くと見込みました。  
そこでhookは残し、置き場をリポジトリ側からdotfilesに移すことにしました。  
マーカー文字列は変えていないので、ファイルを差し替えるだけで注入内容が追従します。  
設定ファイルに書くコマンドのパスは`$HOME`で書きます。  
手元のMacとコンテナでホームディレクトリが違うためです。

ここまでがチャット側の範囲で、成果物は改訂版の`concise-ja.md`と、Claude Codeへの依頼文です。

## 実施したこと（Claude Code側）

改訂版の`concise-ja.md`は、dotfilesリポジトリで開いたClaude Codeのセッションで先に置き換えていました。  
以下は、その後に同じセッションでhookの移設を依頼したときに確認した事実です。

### 見つかったhookの定義

UserPromptSubmitの定義を、リポジトリ側の`.claude/settings.json`と`.claude/settings.local.json`、`~/.claude/settings.json`、dotfiles配下から全部列挙しました。  
ダイジェスト注入hookがあったのは、byte-lark.comとmonotrip.jpの各リポジトリの`.claude/settings.json`で、どちらもmainにコミット済みでした。  
追加時期はbyte-lark.comが2026年8月17日、monotrip.jpが8月18日です。  
コマンドの原文は両リポジトリとも同じでした。

```bash
awk '/^<!-- hook-digest:start -->/{f=1;next} /^<!-- hook-digest:end -->/{f=0} f' "$HOME/.claude/output-styles/concise-ja.md"
```

`settings.local.json`、`~/.claude/settings.json`、dotfilesには定義がありませんでした。  
hookが無かった別のコンテナがどのリポジトリだったかは、前述のとおり分かっていません。

### 移設先のスクリプトと設定

スクリプトは`~/dotfiles/claude/hooks/inject-output-style-digest.sh`にしました。  
用途が名前から読めることを優先し、略語は使っていません。  
中身はawkでマーカー節を抜き出すだけで、文言はスクリプトに持ちません。  
参照するファイルの起点を`CLAUDE_CONFIG_DIR`にしてあるのは、コンテナではこの変数で設定ディレクトリを`/home/node/.claude`に変えているためです。

```bash
#!/bin/bash
# UserPromptSubmit hook: output style の毎ターン注入ダイジェストを stdout に出す。
# 正本は output-styles/concise-ja.md のマーカー節（<!-- hook-digest:start --> 〜 end）。
# ここは抜き出すだけで、文言はこのファイルに持たない。
# 母艦は $HOME/.claude、コンテナは CLAUDE_CONFIG_DIR（/home/node/.claude）を起点にする。
set -u

STYLE="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/output-styles/concise-ja.md"
[ -f "$STYLE" ] || exit 0

awk '/^<!-- hook-digest:start -->/{f=1;next} /^<!-- hook-digest:end -->/{f=0} f' "$STYLE"
```

dotfilesで管理している`~/.claude/settings.json`のUserPromptSubmitに、次の項目を追加しました。  
既存の項目（通知用のhook）はそのまま残しています。

```json
{
  "hooks": [
    {
      "type": "command",
      "command": "\"$HOME\"/.claude/hooks/inject-output-style-digest.sh",
      "timeout": 5
    }
  ]
}
```

コンテナ配布用に、dotfilesの`claude/hooks/hooks.json`にも同じ項目を追加しました。  
このファイルの役割は次の節で書きます。  
そして両リポジトリの`.claude/settings.json`から、上記のawkの項目を削除しました。  
残しておくと同じ文言が2回注入されるためです。  
同じUserPromptSubmitにあった別のhookは残しています。

### 手元のMacへの反映

dotfilesから`~/.claude`への反映は、dotfiles側のインストールスクリプトがシンボリックリンクを張る方式です。  
確認すると、リンクの対象はファイル4つ（`CLAUDE.md`、`settings.json`、`settings.local.json`、`statusline.sh`）とディレクトリ3つ（`agents`、`output-styles`、`bin`）で、`hooks`ディレクトリは対象外でした。  
`~/.claude/hooks`は実ディレクトリで、既存のhookもファイル1本ごとに手でシンボリックリンクを張ってありました。

そのため`settings.json`と`output-styles`はリンク経由で即反映される一方、新しいhookのスクリプトは自分でリンクを張る必要がありました。  
Claude Codeのサンドボックスは`~/.claude/hooks`への書き込みを拒否するので、次のコマンドは自分のターミナルで実行しました。

```bash
ln -s ~/dotfiles/claude/hooks/inject-output-style-digest.sh ~/.claude/hooks/
```

### コンテナへの配布

コンテナへは、次の経路で配っていることが分かりました。

- `devcontainer.json`が`~/dotfiles/claude`をコンテナの`/mnt/host-claude`に読み取り専用でマウントする
- コンテナ起動時のスクリプトが、そこから`CLAUDE.md`、`statusline.sh`、`output-styles/`、`bin/`、`hooks/*.sh`を`/home/node/.claude`へ毎回コピーする
- `settings.json`はコンテナ内に無いときだけ（実質、コンテナ作成時の1回）、リポジトリ同梱の雛形から配置する
- hookの登録は、dotfilesの`hooks/hooks.json`を`jq`でコンテナの`settings.json`にマージする

つまり`hooks.json`は「コンテナのsettings.jsonに足すhook登録の一覧」で、Macの`settings.json`とは別に持っています。  
Macの`settings.json`をそのままコンテナに持ち込まない方針のためです。

### 途中で想定と違った3点

調べる過程で、想定と違っていた点が3つありました。

1つ目は、上記のマージの重複除去です。  
マージは「同じイベントの既存登録から、dotfiles管理のhookを指す登録を除いてから足す」という冪等な作りでした。  
ところが除外条件が既存hookの名前（`worktree-`を含むもの）に固定されていました。  
このまま新しいhookを足すと、コンテナを起動するたびに登録が1件ずつ増えます。  
除外条件を「`.claude/hooks/`配下を指す登録」全般に広げました。

```diff
-              (($sh[.key] // []) | map(select(tojson | contains("worktree-") | not)))
+              (($sh[.key] // []) | map(select(tojson | contains(".claude/hooks/") | not)))
```

2つ目は、dotfilesにあるコンテナ設定の雛形に、このhook同期の処理が入っていなかったことです。  
各リポジトリでは8月下旬に入れていたのに、雛形へ戻していませんでした。  
雛形にも同じ処理を移植しました。

3つ目は、サンドボックスの制約です。  
前述の`~/.claude/hooks`に加えて、他リポジトリの`.git`にも書き込めないため、両リポジトリの変更のコミットはそれぞれのリポジトリで開いたClaude Codeに依頼文を渡して進めました。  
両リポジトリはmainが保護されているので、短命ブランチにコミットしてPRにする流れです。

## 検証

Claude Code側で確認した結果です。

スクリプトをシェルで直接実行すると、マーカー間の5行が出力され、終了コードは0でした。

```
$ ~/.claude/hooks/inject-output-style-digest.sh
1 文 = 1 行。改行なしで 2 文を続けない
1 行 50 字以内。パス・コマンド・URL は数えない
作業後の報告は「変更／検証／判断待ち」の型のみ、合計 10 行以内
出力・ログは貼らない。詳細は聞かれてから出す
根拠は結論の直後に 1 行。未確認は「未確認」と書く
$ echo $?
0
```

`CLAUDE_CONFIG_DIR`を存在しないディレクトリにして実行すると、出力なしで終了コード0でした。  
output styleのファイルが無い環境でhookがエラーにならないことの確認です。

新しいセッションで、登録済みhookの一覧を表示する`/hooks`を開くと、UserPromptSubmitの一覧に次のように出ました。  
出どころがUser Settings、つまりdotfilesで管理している`~/.claude/settings.json`であることが確認できます。

```
UserPromptSubmit
Input to command is JSON with original user prompt text.
Exit code 0 - stdout shown to Claude
Exit code 2 - block processing, erase original prompt, and show stderr to user only
Other exit codes - show stderr to user only

  1. [command] [ -n "$SUPERSET_HOME_DIR" ] && [ -x "$SUPERSET_HOME_DIR/hooks/notify.sh" ] && ...  User Settings
  2. [command] "$HOME"/.claude/hooks/inject-output-style-digest.sh                                  User Settings
```

移設後は、hookを置いていなかったdotfilesリポジトリのセッションでも、毎ターンの入力に5行のダイジェストが付くようになりました。  
byte-lark.com以外のリポジトリで効いていることの確認になります。

設定ファイルは`jq`で構文を確認し、シェルスクリプトは`bash -n`で構文を確認しました。  
コンテナ向けのマージは、雛形の`settings.json`に対して2回続けて実行し、各イベントの登録件数が変わらないことを確認しました。

## 未検証と今後

この時点で確認していないことを列挙します。

- コンテナ内での`/hooks`表示は未確認です。両リポジトリのPRをマージしてコンテナを再起動した後に確認します
- 改訂版のoutput styleが実際に長文を減らすかは、数セッション運用してみるまで分かりません。完了報告が型（10行以内）に収まるかを見ます
- 収まらない場合はStop hookによる機械検査を入れる予定です。行の表示幅を測り、上限超なら`decision: "block"`で書き直させる案で、付録Bに未検証のまま置きます
- MessageDisplay hookで「。」の後に改行を入れる対症療法は未実施です。Claudeの出力もtranscriptも変わらないので根本対策にはなりませんが、体感の確認用として短時間で試せます
- 組み込みのConciseスタイルとの比較も未実施です。同じタスクで比較する価値はあると考えています
- ダイジェストの5行は、2026年9月5日に分かりにくい日本語を普通の文に書き直しました。指示文自体が分かりにくく、出力がそれを真似ていた疑いがあったためです

## 学び

今回の経験から、自分の環境に限らず持ち帰れると思うことです。

- 「指示が無視されている」と感じたら、まず長い出力を指示の条文と突き合わせます。今回はほぼ全部守っていました
- 形式ルール（字数）は内容ルール（根拠を書け）に負けます。書きながら満たせるルールが勝つので、両方を同時に要求しない構成にします
- 症状に一番近い条文を一番目立つ位置に置きます。旧版では12項目の2番目に埋まっていました
- 条文をもう1つ足すのではなく、矛盾している条文を消して型に置き換えます
- 上限値は、モデルに数えさせるためではなく、機械検査と数値を共有するために決めます。ターミナルの幅から逆算すると根拠が残ります
- output styleとhookのスコープを揃えます。片方がグローバルで片方がリポジトリ限定だと、セッションごとに挙動が変わって原因が見えなくなります
- 「なぜ守らないの」とモデルに聞いても答えは出ません。ファイルを読んで条文同士を突き合わせるほうが早いです

## 付録A：MessageDisplay hook（未検証）

チャット側で作った案です。  
実セッションでは動かしていません。

```python
#!/usr/bin/env python3
# ~/.claude/hooks/message-display-break-after-kuten.py
import json, sys
d = json.load(sys.stdin)
delta = d.get("delta") or ""
print(json.dumps({"hookSpecificOutput": {
    "hookEventName": "MessageDisplay",
    "displayContent": delta.replace("。", "。\n")}}, ensure_ascii=False))
```

注意点として、`--verbose`では無視されます。  
デルタは行単位のまとまりで来るので「。」の置換は単純に動く想定ですが、これも未検証です。

## 付録B：Stop hook（未検証、ガード未実装）

こちらもチャット側で作った案で、実セッションでは動かしていません。

```python
#!/usr/bin/env python3
# ~/.claude/hooks/stop-hook-reject-long-lines.py
import json, sys

d = json.load(sys.stdin)
if d.get("stop_hook_active"):  # 再発火によるループ防止
    sys.exit(0)

msg = d.get("last_assistant_message") or ""
if any(len(line) > 120 for line in msg.splitlines()):
    print(json.dumps({
        "decision": "block",
        "reason": "直前の報告を、1 行 1 文・各行 50 字以内の箇条書き 3〜5 行に書き直してください。内容は追加しないでください。"
    }, ensure_ascii=False))
```

導入するなら直すところが4つあります。

- 閾値を「表示幅100桁」に変えます。全角を2桁として数えるので、`unicodedata.east_asian_width`を使います
- バッククォート内とURLを除いてから数えます
- `stop_hook_active`が`false`のまま複数回発火する不具合（#54360）への対策として、`prompt_id`をキーにしたマーカーファイルで1ターン1回だけblockします
- `reason`は「前の回答は破棄。型で10行以内に出し直す」として、2本目の表示を最小にします

## 出典

- Output styles：https://code.claude.com/docs/en/output-styles
- Hooks reference：https://code.claude.com/docs/en/hooks
- Claude Code changelog（MessageDisplay hookの追加バージョン）：https://code.claude.com/docs/en/changelog
- Stop hookの`stop_hook_active`不具合報告：https://github.com/anthropics/claude-code/issues/54360

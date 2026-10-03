#!/usr/bin/env bash
# 記事本文の初稿を 4 つのモデルに書かせ、モデル名を伏せた A〜D のコピーを作る
# （docs/writing-workflow.md §6 の比較期間用）。
# 比べずに 1 本だけ作るときは、このスクリプトではなく ~/.claude/bin/article-draft.sh（dotfiles 管理）を呼ぶ。
#
# プロンプトの書き出し、Gemini の 2 本、出力を採用するかの判定は article-draft.sh に任せる。
# このスクリプトが持つのは、Claude の 2 本を呼ぶことと、4 本を A〜D に並べることだけ。
#
# 読んで守る決まりを減らすため、次のことをスクリプトが固定する。呼ぶ側は気にしなくてよい。
# - 出力先は docs/article-interviews/（git 管理外）。posts 以下に .md を置くと記事として
#   読み込まれ、frontmatter が無いので yarn build が InvalidContentEntryDataError で止まる
# - Claude の 2 本は記事のフォルダから呼ぶ（切り出す前と同じ場所）。Gemini の 2 本は article-draft.sh が
#   空の一時フォルダから呼ぶ。agy は実行ディレクトリを索引するので repo 直下だと遅い
# - 4 つのモデルに同じプロンプトを渡す。article-draft.sh が書き出した <slug>.prompt.md を、Claude の
#   2 本にもそのまま読ませる。文体の指示は、natural-japanese スキルの執筆時の決まり
#   （writing-constitution.md の 12 条）と docs/writing-style/*.md が、この順で入る。12 条を書く段階で
#   渡すのは、スキル自身が「事後修正より生成時制約」を設計思想にしているため。12 条と食い違う箇所は
#   profile.md を優先する（profile.md の冒頭に書いてある）
# - claude -p のオプション。--setting-sources local と --system-prompt は、Claude Code の設定を
#   モデルへの入力に混ぜないためのもの。MCP を外すオプション（--strict-mcp-config・--safe-mode）は
#   足さない。足すと思考のトークンが 0 になり、Fable が考えた過程を本文の前に書く（2026-09-17 に 7 回中 7 回）
# - 考える量。Claude の 2 本は --effort high（公式の既定と同じ段階）を明示する。環境変数
#   CLAUDE_CODE_EFFORT_LEVEL は --effort より優先されるので外して呼ぶ（2026-09-19 に API への要求の中身で確認）。
#   Gemini の 2 本は article-draft.sh が -high の版を使う。Pro には medium の版が無く、Flash と段階をそろえるため
# - Claude の 2 本は、応答したモデルの名前を確かめる。頼んだモデルが JSON の modelUsage に無ければ失敗にする
# - 前置きや考えた過程が入った出力は採用しない。記事は見出し無しの導入から始まるので（profile.md
#   「構成の癖」）、1 行目が本文の文であること、本文に ## の見出しがあることの 2 つで見る。
#   判定は article-draft.sh が持ち、Claude の 2 本にも --judge で同じものを当てる
# - 文体の見本として、公開済みの新しい記事 2 本が渡る（選ぶのは article-draft.sh）。CLAUDE.md が執筆の
#   直前に直近 1〜2 本を読み直すよう求めているのに合わせる（2026-09-20、見本を渡さないまま 4 本中
#   1 本が「だ・である」で書かれ、3 本が「導入に見出しが無い」で弾かれた）
# - 対応表（<slug>.mapping.txt）の中身は画面に出さない。運営者が選ぶまで開かない
#
# 前提: コンテナの中で、作業中の worktree から呼ぶ。agy と claude が PATH にあること。
# natural-japanese プラグインが入っていること。~/.claude/bin/article-draft.sh があること
# （コンテナの起動時に dotfiles から写される）。
# <slug>.outline.md と <slug>.notes.md を docs/article-interviews/ に置いておく。
# article-draft.sh は <slug>/outline.md のフォルダ置きも読むが、このスクリプトは平置きだけを扱う。
#
# 使い方:
#   bash scripts/draft-compare.sh <slug>                 4 本を作り、A〜D のコピーを作る
#   bash scripts/draft-compare.sh --only <model> <slug>  1 本だけ作り直し、A〜D を作り直す
#                                                        （model: gemini-pro | gemini-flash | opus | fable）
#   bash scripts/draft-compare.sh --dry-run <slug>       入力の確認とプロンプトの書き出しだけ行う
#
# 4 本で 10 分を超えることがあるので、Bash ツールから呼ぶときは timeout を最大にする。
set -euo pipefail

MODELS=(gemini-pro gemini-flash opus fable)
ARTICLE_DRAFT="${HOME}/.claude/bin/article-draft.sh"

only=""
dry_run=0
slug=""

while [ $# -gt 0 ]; do
  case "$1" in
    --only) only="$2"; shift 2 ;;
    --dry-run) dry_run=1; shift ;;
    -*) echo "ERROR: 不明なオプション: $1" >&2; exit 2 ;;
    *)
      if [ -n "$slug" ]; then
        echo "ERROR: slug は 1 つだけ指定できる: $1" >&2; exit 2
      fi
      slug="$1"; shift ;;
  esac
done

if ! [[ "$slug" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "ERROR: slug が要る（英小文字・数字・ハイフン）。使い方はスクリプト冒頭のコメントを参照" >&2
  exit 2
fi

if [ -n "$only" ]; then
  case " ${MODELS[*]} " in
    *" $only "*) ;;
    *) echo "ERROR: --only に指定できるのは ${MODELS[*]}" >&2; exit 2 ;;
  esac
fi

root="$(git rev-parse --show-toplevel)"
dir="$root/docs/article-interviews"
post="$root/src/content/posts/$slug"
outline="$dir/$slug.outline.md"
notes="$dir/$slug.notes.md"
prompt="$dir/$slug.prompt.md"

[ -d "$post" ] || { echo "ERROR: 記事のフォルダが無い: $post（先に yarn new-post）" >&2; exit 2; }
for f in "$outline" "$notes" "$ARTICLE_DRAFT"; do
  [ -f "$f" ] || { echo "ERROR: ファイルが無い: $f" >&2; exit 2; }
done
# article-draft.sh は <slug>/outline.md があるとフォルダ置きとして扱い、出力を <slug>/draft/ に書く。
# このスクリプトは平置きの場所を読むので、両方あると食い違う
[ ! -f "$dir/$slug/outline.md" ] || {
  echo "ERROR: $dir/$slug/outline.md がある。このスクリプトは平置きだけを扱う" >&2; exit 2
}
for c in agy claude shuf jq; do
  command -v "$c" >/dev/null 2>&1 || { echo "ERROR: $c が PATH に無い" >&2; exit 1; }
done

cd "$post"
# プロンプトは article-draft.sh に書き出させる。1 本だけ作るときと同じ中身になる。
# article-draft.sh の INFO は「対象: gemini-flash」と出るので、成功したときは出さずに言い直す
rc=0
msg="$(bash "$ARTICLE_DRAFT" --dry-run "$slug" 2>&1)" || rc=$?
if [ "$rc" -ne 0 ]; then
  echo "$msg" >&2
  exit "$rc"
fi
echo "INFO: プロンプトを書き出した: $prompt（$(wc -c < "$prompt") バイト）" >&2

if [ "$dry_run" -eq 1 ]; then
  echo "INFO: --dry-run なのでモデルは呼ばない。対象: ${only:-${MODELS[*]}}" >&2
  exit 0
fi

# $1 = Claude のモデル ID, $2 = 出力先。gemini-draft.sh の --out と同じ扱いにする
# （成功してから所定の名前にする。前回の出力は .prev に 1 世代だけ残す）
run_claude() {
  local tmp="$2.partial" json="$2.json.partial"
  env -u CLAUDE_CODE_EFFORT_LEVEL claude -p --model "$1" --effort high --tools "" --no-session-persistence \
    --setting-sources local --system-prompt "ユーザーの依頼に答えてください。" --output-format json \
    < "$prompt" > "$json" || { rm -f "$json"; return 1; }
  if ! jq -e --arg m "$1" '.is_error == false and (.modelUsage | has($m))' "$json" > /dev/null; then
    echo "ERROR: $1 が書いたと確かめられない。$(jq -r '"is_error=\(.is_error) 応答したモデル: \(.modelUsage // {} | keys | join(", "))"' "$json")" >&2
    rm -f "$json"; return 1
  fi
  jq -r '.result' "$json" > "$tmp"
  rm -f "$json"
  [ -s "$tmp" ] || { echo "ERROR: $1 の出力が空だった" >&2; rm -f "$tmp"; return 1; }
  [ -f "$2" ] && mv "$2" "$2.prev"
  mv "$tmp" "$2"
}

# $1 = モデルの呼び名。失敗したら <slug>.<model>.failed を残す
run_model() {
  local name="$1" out="$dir/$slug.$1.md" failed="$dir/$slug.$1.failed" start rc=0 why=""
  case "$name" in
    gemini-pro|gemini-flash)
      # 秒数と .failed は article-draft.sh が書く。OK／NG の行は下でまとめて出すので、ここでは出さない。
      # 不採用でも 1 を返すので、ここで止めずに受ける。.failed を書く前に止まったときだけ、ここで書く
      # （前回の本文が残っていると、作れていないのに OK に見えるため）
      bash "$ARTICLE_DRAFT" --model "$name" "$slug" > /dev/null || rc=$?
      [ "$rc" -eq 0 ] || [ -f "$failed" ] || echo "exit $rc" > "$failed"
      return 0 ;;
  esac
  rm -f "$failed"
  start=$(date +%s)
  case "$name" in
    opus) run_claude claude-opus-5 "$out" || rc=$? ;;
    fable) run_claude claude-fable-5-1 "$out" || rc=$? ;;
  esac
  echo "$(( $(date +%s) - start ))" > "$dir/$slug.$name.seconds"
  if [ "$rc" -ne 0 ]; then
    echo "exit $rc" > "$failed"
  else
    why="$(bash "$ARTICLE_DRAFT" --judge "$out")" || echo "$why" > "$failed"
  fi
}

# agy は localhost に bind するので、Gemini の 2 本は同時に動かさない。Claude の 2 本とは並べる
if [ -n "$only" ]; then
  run_model "$only"
else
  { run_model gemini-pro; run_model gemini-flash; } &
  run_model opus &
  run_model fable &
  wait
fi

ng=0
for m in "${MODELS[@]}"; do
  secs="-"
  [ -f "$dir/$slug.$m.seconds" ] && secs="$(cat "$dir/$slug.$m.seconds")"
  if [ -f "$dir/$slug.$m.failed" ]; then
    echo "NG  $m ${secs}s: $(cat "$dir/$slug.$m.failed")"
    ng=1
  elif [ -f "$dir/$slug.$m.md" ]; then
    echo "OK  $m ${secs}s"
  else
    echo "NG  $m: まだ作っていない"
    ng=1
  fi
done

# 前回の A〜D は、作り直した本文と中身が食い違うので必ず消す
rm -f "$dir/$slug".draft-[A-D].md "$dir/$slug.mapping.txt"

if [ "$ng" -ne 0 ]; then
  echo "ERROR: 4 本そろっていないので A〜D は作らない。NG のモデルを --only で作り直す" >&2
  exit 1
fi

shuf -e "${MODELS[@]}" | awk '{print substr("ABCD", NR, 1), $0}' > "$dir/$slug.mapping.txt"
while read -r label model; do
  cp "$dir/$slug.$model.md" "$dir/$slug.draft-$label.md"
done < "$dir/$slug.mapping.txt"
echo "A〜D を作った: $dir/$slug.draft-A.md 〜 draft-D.md（対応表は運営者が選ぶまで開かない）"

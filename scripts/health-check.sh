#!/usr/bin/env bash
# byte-lark.com 外形監視スクリプト（Xserver の cron から定期実行する想定）
#
# 4 つを見る:
#   (1) HTTP ステータスが 200 か（ダウン検知）
#   (2) 想定の文字列がページに残っているか（改ざんカナリア）
#   (3) 配信ヘッダが想定どおりか（公開後に noindex が付いていないこと等）
#   (4) TLS 証明書の残日数
#
# 異常があれば終了コード 1。ただし通知は「FAIL_THRESHOLD 回連続で異常」になって
# から出す（一時的なネットワーク揺れで鳴らさないため）。正常時は何も出力しない
# ＝ cron がメールを送らない、という前提の作り。
#
# 使い方:
#   bash scripts/health-check.sh              # 通常実行（cron 用）
#   bash scripts/health-check.sh --inspect    # 観測値を表示するだけ（状態も通知も触らない）
#   bash scripts/health-check.sh --test-notify # 通知の配線確認（メール / Slack にテスト送信）
#   bash scripts/health-check.sh -v           # 正常でも結果を表示
#
# 設定は環境変数か設定ファイル（既定 ~/.byte-lark-monitor.env、bash として読み込む）。
# Slack の Webhook URL は秘密情報なので設定ファイル側に置き、リポジトリには入れない。
# 設定ファイルの例:
#   SLACK_WEBHOOK_URL="https://hooks.slack.com/services/XXX/YYY/ZZZ"
#   MONITOR_URL="https://byte-lark.com"
#   PATHS=("/" "/blog/")

set -uo pipefail

# cron の PATH は最小限なので、よくある場所を足しておく
export PATH="/usr/local/bin:/usr/bin:/bin:${PATH:-}"

# ---- 既定値（設定ファイルで上書きできる） -----------------------------------

MONITOR_URL="${MONITOR_URL:-https://byte-lark.com}"

# 確認するパス。リダイレクトは追わないので末尾スラッシュまで正確に書く
declare -a PATHS=("/")

# 改ざんカナリア。text/html のページに、この文字列がすべて残っていることを確認する
# title は「〜 - byte-lark.com」の末尾だけ見る。前半（名前・役割）は変わりうるため完全一致にしない
declare -a CANARIES=("byte-lark.com</title>" "合同会社バイトラーク")

# 「name=部分文字列」形式。ヘッダ値にその文字列が含まれていることを要求する。
# HSTS は Cloudflare のゾーン設定で付けているので、外れたら異常として拾う
declare -a REQUIRE_HEADERS=("content-type=text/html" "strict-transport-security=max-age")

# 同じ形式で、含まれていてはいけないもの。公開後の noindex 混入検知が本命
declare -a FORBID_HEADERS=("x-robots-tag=noindex")

TLS_MIN_DAYS="${TLS_MIN_DAYS:-14}"       # 証明書の残日数がこれを下回ったら異常
FAIL_THRESHOLD="${FAIL_THRESHOLD:-2}"    # 何回連続で異常なら通知するか
STATE_DIR="${STATE_DIR:-${HOME:-/tmp}/.byte-lark-monitor}"
MAIL_TO="${MAIL_TO:-}"                   # 空なら標準出力のみ（cron のメール設定に任せる）
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
CONNECT_TIMEOUT="${CONNECT_TIMEOUT:-10}"
MAX_TIME="${MAX_TIME:-25}"
USER_AGENT="${USER_AGENT:-byte-lark-health-check/1.0 (+https://byte-lark.com)}"

MONITOR_CONF="${MONITOR_CONF:-${HOME:-/tmp}/.byte-lark-monitor.env}"
if [ -f "$MONITOR_CONF" ]; then
  # shellcheck disable=SC1090
  . "$MONITOR_CONF"
fi

# ---- 引数 -------------------------------------------------------------------

mode="run"
verbose=0

usage() {
  sed -n '2,30p' "$0" | sed 's/^# \{0,1\}//'
}

while [ $# -gt 0 ]; do
  case "$1" in
    --inspect)      mode="inspect" ;;
    --test-notify)  mode="test-notify" ;;
    --url)          MONITOR_URL="${2:?--url needs a value}"; shift ;;
    -v|--verbose)   verbose=1 ;;
    -h|--help)      usage; exit 0 ;;
    *)              echo "unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

base="${MONITOR_URL%/}"
host="${base#*://}"; host="${host%%/*}"; host="${host%%:*}"

# ---- 小道具 -----------------------------------------------------------------

now() { date '+%Y-%m-%d %H:%M:%S %z'; }

json_escape() {
  local s="$1"
  s=${s//\\/\\\\}
  s=${s//\"/\\\"}
  s=${s//$'\r'/}
  s=${s//$'\t'/\\t}
  s=${s//$'\n'/\\n}
  printf '%s' "$s"
}

# ヘッダ値を取り出す（同名が複数あれば改行区切りで全部返す）。名前は小文字で渡す
header_value() {
  local file="$1" name="$2"
  tr -d '\r' < "$file" \
    | awk -v n="$name" 'BEGIN{IGNORECASE=1} index(tolower($0), n ":")==1 {sub(/^[^:]*: */,""); print}'
}

# TLS 証明書の残日数。openssl が無い / 取れない場合は空文字を返す
tls_days_left() {
  command -v openssl >/dev/null 2>&1 || return 0
  local end end_ts now_ts
  end=$(echo \
    | openssl s_client -connect "${host}:443" -servername "$host" 2>/dev/null \
    | openssl x509 -noout -enddate 2>/dev/null \
    | cut -d= -f2)
  [ -n "$end" ] || return 0
  end_ts=$(date -d "$end" +%s 2>/dev/null) \
    || end_ts=$(date -j -f '%b %d %T %Y %Z' "$end" +%s 2>/dev/null) \
    || return 0
  now_ts=$(date +%s)
  echo $(( (end_ts - now_ts) / 86400 ))
}

# ---- 検査本体 ---------------------------------------------------------------

declare -a PROBLEMS=()
declare -a OBSERVED=()

check_path() {
  local path="$1"
  local url="${base}${path}"
  local head body code curl_rc ctype
  head=$(mktemp) || return
  body=$(mktemp) || { rm -f "$head"; return; }

  code=$(curl -sS -o "$body" -D "$head" -w '%{http_code}' \
    --connect-timeout "$CONNECT_TIMEOUT" --max-time "$MAX_TIME" \
    -A "$USER_AGENT" "$url" 2>/dev/null)
  curl_rc=$?

  if [ "$curl_rc" -ne 0 ]; then
    PROBLEMS+=("接続失敗: ${url}（curl 終了コード ${curl_rc}）")
    OBSERVED+=("${path} → 接続失敗 (curl rc=${curl_rc})")
    rm -f "$head" "$body"
    return
  fi

  OBSERVED+=("${path} → HTTP ${code}, $(wc -c < "$body" | tr -d ' ') bytes")
  [ "$code" = "200" ] || PROBLEMS+=("HTTP ステータス異常: ${url} → ${code}")

  local spec name want got
  for spec in "${REQUIRE_HEADERS[@]:-}"; do
    [ -n "$spec" ] || continue
    name="${spec%%=*}"; want="${spec#*=}"
    got=$(header_value "$head" "$name")
    OBSERVED+=("${path} ヘッダ ${name}: ${got:-（無し）}")
    case "$got" in
      *"$want"*) ;;
      *) PROBLEMS+=("必須ヘッダ不一致: ${url} の ${name} に \"${want}\" が無い（実際: ${got:-無し}）") ;;
    esac
  done

  for spec in "${FORBID_HEADERS[@]:-}"; do
    [ -n "$spec" ] || continue
    name="${spec%%=*}"; want="${spec#*=}"
    got=$(header_value "$head" "$name")
    case "$got" in
      *"$want"*) PROBLEMS+=("禁止ヘッダ検出: ${url} の ${name} に \"${want}\" がある（実際: ${got}）") ;;
      *) ;;
    esac
  done

  # カナリアは HTML ページにだけ当てる
  ctype=$(header_value "$head" "content-type")
  case "$ctype" in
    *text/html*)
      local canary
      for canary in "${CANARIES[@]:-}"; do
        [ -n "$canary" ] || continue
        if grep -qF -- "$canary" "$body"; then
          OBSERVED+=("${path} カナリア OK: ${canary}")
        else
          PROBLEMS+=("カナリア消失: ${url} に \"${canary}\" が無い")
          OBSERVED+=("${path} カナリア NG: ${canary}")
        fi
      done
      ;;
  esac

  rm -f "$head" "$body"
}

run_checks() {
  local p
  for p in "${PATHS[@]}"; do
    check_path "$p"
  done

  local days
  days=$(tls_days_left)
  if [ -z "$days" ]; then
    OBSERVED+=("TLS 残日数: 取得できず（openssl 無し or 接続不可のため未判定）")
  else
    OBSERVED+=("TLS 残日数: ${days} 日")
    if [ "$days" -lt "$TLS_MIN_DAYS" ]; then
      PROBLEMS+=("TLS 証明書の期限が近い: ${host} 残り ${days} 日（しきい値 ${TLS_MIN_DAYS} 日）")
    fi
  fi
}

# ---- 通知 -------------------------------------------------------------------

notify() {
  local subject="$1" text="$2"

  # 標準出力（cron のメール送信に乗る）
  printf '%s\n\n%s\n' "$subject" "$text"

  if [ -n "$MAIL_TO" ]; then
    if command -v mail >/dev/null 2>&1; then
      printf '%s\n' "$text" | mail -s "$subject" "$MAIL_TO"
    elif command -v mailx >/dev/null 2>&1; then
      printf '%s\n' "$text" | mailx -s "$subject" "$MAIL_TO"
    elif command -v sendmail >/dev/null 2>&1; then
      printf 'To: %s\nSubject: %s\nContent-Type: text/plain; charset=UTF-8\n\n%s\n' \
        "$MAIL_TO" "$subject" "$text" | sendmail -t
    else
      echo "warn: MAIL_TO を設定しているがメール送信コマンドが見つからない" >&2
    fi
  fi

  if [ -n "$SLACK_WEBHOOK_URL" ]; then
    local payload
    payload="{\"text\":\"$(json_escape "${subject}"$'\n'"${text}")\"}"
    curl -sS -X POST -H 'Content-type: application/json' \
      --connect-timeout "$CONNECT_TIMEOUT" --max-time "$MAX_TIME" \
      --data "$payload" "$SLACK_WEBHOOK_URL" >/dev/null 2>&1 \
      || echo "warn: Slack への通知に失敗した" >&2
  fi
}

# ---- モード別の動作 ---------------------------------------------------------

format_report() {
  printf '対象: %s\n時刻: %s\n\n' "$base" "$(now)"
  if [ "${#PROBLEMS[@]}" -gt 0 ]; then
    printf '異常:\n'
    printf -- '- %s\n' "${PROBLEMS[@]}"
    printf '\n'
  fi
  printf '観測値:\n'
  printf -- '- %s\n' "${OBSERVED[@]}"
}

case "$mode" in
  test-notify)
    notify "[byte-lark 監視] 通知テスト" \
      "これは通知経路の確認用メッセージです（$(now)）。届いていれば配線は正常。"
    exit 0
    ;;
  inspect)
    run_checks
    format_report
    exit 0
    ;;
esac

run_checks

mkdir -p "$STATE_DIR" 2>/dev/null
count_file="${STATE_DIR}/consecutive_failures"
state_file="${STATE_DIR}/state"
log_file="${STATE_DIR}/health-check.log"

prev_count=$(cat "$count_file" 2>/dev/null || echo 0)
case "$prev_count" in (*[!0-9]*|'') prev_count=0 ;; esac
prev_state=$(cat "$state_file" 2>/dev/null || echo ok)

if [ "${#PROBLEMS[@]}" -eq 0 ]; then
  echo 0 > "$count_file"
  echo "$(now) OK" >> "$log_file"
  if [ "$prev_state" = "alerting" ]; then
    echo ok > "$state_file"
    notify "[byte-lark 監視] 復旧" "$(format_report)"
  else
    echo ok > "$state_file"
    [ "$verbose" -eq 1 ] && format_report
  fi
  exit 0
fi

count=$(( prev_count + 1 ))
echo "$count" > "$count_file"
echo "$(now) NG (${count}回連続) ${PROBLEMS[*]}" >> "$log_file"

if [ "$count" -ge "$FAIL_THRESHOLD" ]; then
  echo alerting > "$state_file"
  notify "[byte-lark 監視] 異常検知（${count}回連続）" "$(format_report)"
else
  # しきい値未満は黙って終わる（cron のメールを出さない）。-v なら表示
  [ "$verbose" -eq 1 ] && format_report
fi

exit 1

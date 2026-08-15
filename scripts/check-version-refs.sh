#!/usr/bin/env bash
# site-plan §14 の連動更新チェックのうち「現行版数の相互参照」を機械検査する（PHASE1E-007）。
# 過去事実（Done PBI 内の旧版数・改訂履歴の歴史行）と PBI 件数系は対象外 → §14 の手動チェックに残す。
# 使い方: bash scripts/check-version-refs.sh [ルートディレクトリ]（省略時はカレント）
set -u

ROOT="${1:-.}"
SITE_PLAN="$ROOT/docs/site-plan.md"
SP_HISTORY="$ROOT/docs/site-plan-history.md"
PBI_README="$ROOT/docs/pbi/README.md"
CLAUDE_MD="$ROOT/CLAUDE.md"

fail=0
ng() {
  echo "NG: $1"
  fail=1
}

for f in "$SITE_PLAN" "$SP_HISTORY" "$PBI_README" "$CLAUDE_MD"; do
  [ -f "$f" ] || { echo "NG: ファイルが見つからない → $f"; exit 1; }
done

# --- site-plan の版数（タイトル行が正） ---
SP_VER=$(head -1 "$SITE_PLAN" | grep -oE 'v[0-9]+\.[0-9]+')
if [ -z "$SP_VER" ]; then
  echo "NG: site-plan.md タイトル行から版数を抽出できない"
  exit 1
fi

grep -qF "→ $SP_VER 主な変更" <(head -10 "$SITE_PLAN") \
  || ng "site-plan.md 冒頭「主な変更」注記が $SP_VER になっていない（タイトルと不一致）"
grep -qF "上書き（v2 → ${SP_VER}）" "$SITE_PLAN" \
  || ng "site-plan.md §6.7 の自己参照が $SP_VER になっていない"
grep -qF "current: $SP_VER" "$CLAUDE_MD" \
  || ng "CLAUDE.md Related Docs の site-plan 参照が current: $SP_VER になっていない"
grep -qF "$SP_VER" "$SP_HISTORY" \
  || ng "site-plan-history.md に $SP_VER の改訂履歴行が無い（追記漏れ）"

# --- PBI README の版数（タイトル行が正） ---
RM_VER=$(head -1 "$PBI_README" | grep -oE 'v[0-9]+\.[0-9]+')
if [ -z "$RM_VER" ]; then
  echo "NG: docs/pbi/README.md タイトル行から版数を抽出できない"
  exit 1
fi

grep -qF "PBI format spec ($RM_VER)" "$CLAUDE_MD" \
  || ng "CLAUDE.md Related Docs の PBI README 参照が $RM_VER になっていない"
grep "docs/pbi/README.md" "$SITE_PLAN" | grep -qF "$RM_VER を参照" \
  || ng "site-plan.md §12 の README 参照が $RM_VER になっていない"

if [ "$fail" -ne 0 ]; then
  echo "バージョン参照の不一致あり。site-plan §14 の表に従って連動更新してから push してください。"
  exit 1
fi
echo "OK: バージョン参照は一致（site-plan ${SP_VER} / PBI README ${RM_VER}）"

#!/usr/bin/env bash
# Lighthouse 監査（運営者ターミナル実行用。サンドボックス内は Chrome 起動不可 → PHASE1A-020 参照）
#
# 使い方:
#   bash scripts/lighthouse-audit.sh                                  # branch alias を accessibility のみ
#   bash scripts/lighthouse-audit.sh https://byte-lark.com            # 本番を accessibility のみ
#   bash scripts/lighthouse-audit.sh https://byte-lark.com performance,accessibility,best-practices,seo
#
# devcontainer 内から回すときは Chrome のサンドボックスが使えないので、
# CHROME_PATH に Playwright の chromium 実体を、CHROME_FLAGS に --no-sandbox を渡す:
#   CHROME_PATH=~/.cache/ms-playwright/chromium-1217/chrome-linux/chrome \
#   CHROME_FLAGS="--headless --no-sandbox" bash scripts/lighthouse-audit.sh http://localhost:4322
#
# 注意: npx lighthouse は使わないこと。npx はキャッシュ状態次第で「Ok to proceed?」の
# 対話プロンプトを出し、出力をパイプ/リダイレクトしていると不可視のまま永久に stdin を
# 待ち続ける（2026-07-17 の PHASE1C-002 検証で 8 時間ハングした実績）。本スクリプトは
# lighthouse を一時ディレクトリへ npm install して直接実行するため、この罠が発生しない。
set -u

BASE="${1:-https://feat-phase-1-byte-lark.tanimoto-a49.workers.dev}"
CATEGORIES="${2:-accessibility}"
# 公開記事も監査対象に含める（PHASE1C-011）。記事ページは一覧と DOM 構造が違い、
# 見出し階層・コントラストの当たり方も別物になるため、静的 8 ページだけでは裏取りにならない
PATHS=("/" "/about/" "/career/" "/skills/" "/blog/" "/contact/" "/privacy/" "/404"
  "/blog/building-this-blog-with-claude-code/"
  "/blog/contact-form-on-cloudflare-workers/"
  "/blog/incorporating-bytelark/")

echo "[$(date +%H:%M:%S)] lighthouse@12 を一時ディレクトリへインストール中…"
TOOL=$(mktemp -d)
npm install --prefix "$TOOL" --no-audit --no-fund lighthouse@12 >/dev/null || {
  echo "インストール失敗"; exit 1; }
LH="$TOOL/node_modules/.bin/lighthouse"
echo "[$(date +%H:%M:%S)] 完了: lighthouse $("$LH" --version) / 対象: $BASE / カテゴリ: $CATEGORIES"

OUT=$(mktemp -d)
SUMMARY=()

for p in "${PATHS[@]}"; do
  name=$(echo "$p" | tr -d '/')
  [ -z "$name" ] && name="home"
  echo ""
  echo "=== [$(date +%H:%M:%S)] $p 計測開始 ==="
  "$LH" "$BASE$p" \
    --only-categories="$CATEGORIES" \
    --output=json --output-path="$OUT/$name.json" \
    --chrome-flags="${CHROME_FLAGS:---headless}"
  if [ ! -s "$OUT/$name.json" ]; then
    SUMMARY+=("$p  計測失敗（上のログ参照）")
    continue
  fi
  line=$(python3 - "$OUT/$name.json" "$p" <<'PY'
import json, sys
d = json.load(open(sys.argv[1]))
parts = []
for key, cat in d["categories"].items():
    parts.append(f"{key}: {round(cat['score'] * 100):>3}")
cc = d["audits"].get("color-contrast")
if cc is not None:
    s = cc.get("score")
    label = "pass" if s == 1 else ("fail" if s == 0 else f"n/a({cc.get('scoreDisplayMode')})")
    parts.append(f"color-contrast: {label}")
print(f"{sys.argv[2]:<12} " + "  ".join(parts))
PY
)
  echo ">>> $line"
  SUMMARY+=("$line")
done

echo ""
echo "=== 全ページまとめ ==="
printf '%s\n' "${SUMMARY[@]}"
echo "JSON 詳細: $OUT"

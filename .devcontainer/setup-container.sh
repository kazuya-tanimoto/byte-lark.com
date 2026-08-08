#!/bin/bash
# コンテナ内セットアップ（devcontainer.json の postCreate / postStart から呼ばれる）。
#   create: コンテナ作成時に 1 回。重い初期化（依存インストール等）。firewall 適用前に走る
#   start : 起動ごと。軽い同期のみ（グローバル CLAUDE.md の取り込み等）
set -euo pipefail

MODE="${1:?usage: setup-container.sh <create|start>}"
CONFIG_DIR="${CLAUDE_CONFIG_DIR:-/home/node/.claude}"
# 母艦 ~/dotfiles/claude の read-only mount。コピーして使う（mount 直読み・書き戻しはしない
# — docs/devcontainer-plan.md §3 の安全原則）
HOST_CLAUDE=/mnt/host-claude

sync_claude_config() {
  mkdir -p "$CONFIG_DIR"
  # グローバル CLAUDE.md は毎起動コピーで最新化
  if [ -f "$HOST_CLAUDE/CLAUDE.md" ]; then
    cp "$HOST_CLAUDE/CLAUDE.md" "$CONFIG_DIR/CLAUDE.md"
  else
    echo "WARN: $HOST_CLAUDE/CLAUDE.md が見つからないため、グローバル CLAUDE.md なしで続行" >&2
  fi
  # settings はコンテナ専用の薄い設定（母艦のものは持ち込まない）。
  # 無いときだけ配置し、コンテナ内での調整は上書きしない
  if [ ! -f "$CONFIG_DIR/settings.json" ]; then
    cp /workspace/.devcontainer/claude-settings.json "$CONFIG_DIR/settings.json"
  fi
  # statusline は母艦と同じ見た目にする（毎起動コピーで最新化）
  if [ -f "$HOST_CLAUDE/statusline.sh" ]; then
    cp "$HOST_CLAUDE/statusline.sh" "$CONFIG_DIR/statusline.sh"
    chmod +x "$CONFIG_DIR/statusline.sh"
  fi
}

setup_git() {
  git config --global user.name "Kazuya Tanimoto"
  git config --global user.email "tanimoto@byte-lark.com"
  # bind mount した repo の所有権が uid 違いに見える環境向け（idempotent）
  git config --global --get-all safe.directory 2>/dev/null | grep -qx /workspace \
    || git config --global --add safe.directory /workspace
  # push 認証は fine-grained PAT。コンテナ内で一度 `gh auth login`（PAT 貼り付け）すれば
  # gh 用 volume に永続化される。credential helper の張り直しは毎起動行う
  if gh auth status >/dev/null 2>&1; then
    gh auth setup-git
  else
    echo "INFO: gh 未ログイン。push する前にコンテナ内で 'gh auth login'（PAT 貼り付け）を実行してください" >&2
  fi
}

case "$MODE" in
  create)
    # node_modules 用 named volume の所有権を node に揃える（初回は root 所有で作られるため）
    sudo /usr/local/bin/fix-perms.sh
    sync_claude_config
    setup_git
    cd /workspace
    yarn install
    # ブラウザ本体は repo の @playwright/test と同じバージョンを取得
    # （OS 依存パッケージは Dockerfile で焼き込み済み）
    yarn playwright install chromium
    ;;
  start)
    sync_claude_config
    setup_git
    ;;
  *)
    echo "ERROR: unknown mode: $MODE" >&2
    exit 1
    ;;
esac

echo "setup-container.sh $MODE: done"

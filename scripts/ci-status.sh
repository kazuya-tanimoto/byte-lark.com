#!/usr/bin/env bash
# CI（GitHub Actions）の状況を無認証 REST API で取得する。
# 本リポジトリは public なのでトークン不要。Bash サンドボックス内では gh CLI が
# TLS/keychain で失敗するが curl は通るため、curl + jq で代替する。
#
# 使い方:
#   bash scripts/ci-status.sh [branch]   # branch 省略時は現在のブランチ
set -euo pipefail

branch="${1:-$(git rev-parse --abbrev-ref HEAD)}"
remote_url="$(git remote get-url origin)"
# git@github.com:owner/repo.git / https://github.com/owner/repo.git → owner/repo
repo="$(printf '%s' "$remote_url" | sed -E 's#(git@github.com:|https://github.com/)##; s#\.git$##')"
head_sha="$(git rev-parse HEAD)"
api="https://api.github.com/repos/${repo}"

echo "repo=${repo} branch=${branch} head=${head_sha:0:7}"
echo
echo "## 最新ワークフローラン (branch=${branch})"
curl -fsSL "${api}/actions/runs?branch=${branch}&per_page=20" \
  | jq -r '
      .workflow_runs
      | group_by(.name) | map(max_by(.run_number))
      | .[] | "- \(.name): \(.status)/\(.conclusion // "running")  (\(.head_sha[0:7]))  \(.html_url)"'
echo
echo "## HEAD commit の check-runs (${head_sha:0:7})"
curl -fsSL -H "Accept: application/vnd.github+json" "${api}/commits/${head_sha}/check-runs" \
  | jq -r '.check_runs[] | "- \(.name): \(.status)/\(.conclusion // "running")"'

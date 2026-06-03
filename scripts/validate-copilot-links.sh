#!/usr/bin/env bash
set -euo pipefail

SOURCE_ROOT="${COPILOT_ASSETS_ROOT:-$HOME/sandbox/copilot-agent-workspace}"
DEST_ROOT="${VSCODE_USER_ROOT:-$HOME/Library/Application Support/Code/User}"

resolve_path() {
  python3 - <<'PY' "$1"
import os
import sys

path = sys.argv[1]
print(os.path.realpath(path))
PY
}

check_link() {
  local name="$1"
  local dest="$2"
  local ok=0

  if [[ ! -L "$dest" ]]; then
    echo "FAIL: $name link missing ($dest)"
    return 1
  fi

  if [[ ! -e "$dest" ]]; then
    echo "FAIL: $name link target missing"
    return 1
  fi

  local resolved
  resolved=$(resolve_path "$dest")
  if [[ "$resolved" != "$SOURCE_ROOT"/* ]]; then
    echo "FAIL: $name link resolves outside copilot-agent-workspace ($resolved)"
    return 1
  fi

  echo "OK: $name"
  return 0
}

prompts_dest="$DEST_ROOT/prompts"
agents_dest="$DEST_ROOT/agents"

status=0
check_link "prompts" "$prompts_dest" || status=1
check_link "agents" "$agents_dest" || status=1

if [[ "$status" -eq 0 ]]; then
  echo "PASS"
else
  echo "FAIL"
fi

exit "$status"

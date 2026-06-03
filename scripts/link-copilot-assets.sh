#!/usr/bin/env bash
set -euo pipefail

SOURCE_ROOT="${COPILOT_ASSETS_ROOT:-$HOME/sandbox/copilot-agent-workspace}"
DEST_ROOT="${VSCODE_USER_ROOT:-$HOME/Library/Application Support/Code/User}"

link_asset() {
  local name="$1"
  local src="$2"
  local dest="$3"
  local dest_parent

  if [[ ! -e "$src" ]]; then
    echo "MISSING SOURCE: $name ($src)"
    return 1
  fi

  dest_parent=$(dirname "$dest")
  if [[ ! -d "$dest_parent" ]]; then
    echo "MISSING DEST PARENT: $dest_parent"
    return 1
  fi

  if [[ -L "$dest" ]]; then
    local current_target
    current_target=$(readlink "$dest")
    if [[ "$current_target" == "$src" ]]; then
      echo "OK: $name already linked"
      return 0
    fi

    echo "RELINK: $name -> $src"
    rm "$dest"
    ln -s "$src" "$dest"
    return 0
  fi

  if [[ -e "$dest" ]]; then
    echo "BLOCKED: $dest exists and is not a symlink. Remove or rename it, then rerun."
    return 1
  fi

  ln -s "$src" "$dest"
  echo "LINKED: $name -> $src"
}

prompts_src="$SOURCE_ROOT/prompts"
agents_src="$SOURCE_ROOT/agents"

prompts_dest="$DEST_ROOT/prompts"
agents_dest="$DEST_ROOT/agents"

status=0
link_asset "prompts" "$prompts_src" "$prompts_dest" || status=1
link_asset "agents" "$agents_src" "$agents_dest" || status=1

exit "$status"

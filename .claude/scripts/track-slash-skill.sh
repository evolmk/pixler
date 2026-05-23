#!/bin/bash
hook_input=$(cat)
prompt=$(echo "$hook_input" | jq -r '.prompt // ""')
skill=$(echo "$prompt" | sed -nE 's|^[[:space:]]*/([a-zA-Z][a-zA-Z0-9_-]*).*|\1|p')
if [ -n "$skill" ]; then
  log_dir="$(dirname "$0")/../logs"
  mkdir -p "$log_dir"
  echo "$(date '+%Y-%m-%d %H:%M:%S') $skill" >> "$log_dir/skill-log.txt"
fi
exit 0
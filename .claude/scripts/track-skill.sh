#!/bin/bash
hook_input=$(cat)
skill_name=$(echo "$hook_input" | jq -r '.tool_input.skill // "unknown"')
session_id=$(echo "$hook_input" | jq -r '.session_id // "unknown"')
log_dir="$(dirname "$0")/../logs"
mkdir -p "$log_dir"
echo "$(date '+%Y-%m-%d %H:%M:%S') $skill_name" >> "$log_dir/skill-log.txt"
# Per-session tracking so PreToolUse hooks can check which skills ran this session
echo "$skill_name" >> "$log_dir/session-${session_id}.skills"
exit 0
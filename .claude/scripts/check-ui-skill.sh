#!/bin/bash
# PreToolUse hook: warns when editing UI or app component files
# without having invoked the /ui skill this session.
hook_input=$(cat)
file_path=$(echo "$hook_input" | jq -r '.tool_input.file_path // ""')
session_id=$(echo "$hook_input" | jq -r '.session_id // ""')
log_dir="$(dirname "$0")/../logs"
session_file="$log_dir/session-${session_id}.skills"

# Only check files under src/components/ui/ or apps/
if ! echo "$file_path" | grep -qE '(/src/components/ui/|/apps/)'; then
  exit 0
fi

# If ui skill was used this session, allow silently
if [ -f "$session_file" ] && grep -q "^ui$" "$session_file"; then
  exit 0
fi

# Notify: show a soft reminder to the user (no blocking, no context injection)
printf '{"systemMessage": "ℹ  /ui skill not invoked — consider running /ui before editing UI or app component files."}'
exit 0
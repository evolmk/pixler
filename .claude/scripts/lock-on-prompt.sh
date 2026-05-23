#!/bin/bash
# UserPromptSubmit hook: if the prompt references a Kanban plan path, write a
# lock file at _plans/_status/<session_id>.json. No-op otherwise. Always exits 0.

set +e
source "$(dirname "$0")/lock-helpers.sh"

trap 'exit_safely_on_error "lock-on-prompt unexpected failure"' ERR

hook_input=$(cat)

# Extract session_id and prompt. Fall back to fast extractors if jq absent.
if have_jq; then
  session_id=$(printf '%s' "$hook_input" | jq -r '.session_id // empty' 2>/dev/null)
  prompt=$(printf '%s' "$hook_input" | jq -r '.prompt // empty' 2>/dev/null)
else
  session_id=$(printf '%s' "$hook_input" | extract_session_id_fast)
  prompt="$hook_input"
fi

# Sanitize session_id to a filesystem-safe form.
session_id="${session_id//[^A-Za-z0-9_-]/_}"

if [ -z "$session_id" ] || [ -z "$prompt" ]; then
  exit 0
fi

plan_path=$(extract_plan_path "$prompt")
if [ -z "$plan_path" ]; then
  # Prompt did not reference a Kanban plan — nothing to lock.
  exit 0
fi

if ! write_lock_json "$session_id" "$plan_path"; then
  log_error "lock-on-prompt: write_lock_json failed for session=$session_id plan=$plan_path"
  exit 0
fi

append_log_line "$session_id" "START plan=$plan_path agent=claude"
exit 0

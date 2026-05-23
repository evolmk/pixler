#!/bin/bash
# Stop hook: marks the session's lock as ended (sets status=ended, endedAt=now).
# No-op if no lock exists. Always exits 0.

set +e
source "$(dirname "$0")/lock-helpers.sh"

trap 'exit_safely_on_error "lock-on-stop unexpected failure"' ERR

hook_input=$(cat)

if have_jq; then
  session_id=$(printf '%s' "$hook_input" | jq -r '.session_id // empty' 2>/dev/null)
else
  session_id=$(printf '%s' "$hook_input" | extract_session_id_fast)
fi
session_id="${session_id//[^A-Za-z0-9_-]/_}"

[ -z "$session_id" ] && exit 0

target="$(status_dir)/$session_id.json"
[ -f "$target" ] || exit 0   # No lock — nothing to end.

if ! mark_lock_ended "$session_id"; then
  log_error "lock-on-stop: mark_lock_ended failed for session=$session_id"
  exit 0
fi

append_log_line "$session_id" "END"
exit 0

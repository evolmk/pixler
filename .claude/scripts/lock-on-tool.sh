#!/bin/bash
# PostToolUse hook: heartbeat. Refreshes `lastUpdatedAt` on the session's lock
# JSON if it exists. Must be cheap on every tool call across every session,
# including sessions with no active lock.
#
# Hot path (no-lock session): one lightweight sed/grep parse + one stat → exit.
# Throttle: when a lock exists, only rewrite if `lastUpdatedAt` is older than 30s.

set +e
source "$(dirname "$0")/lock-helpers.sh"

trap 'exit_safely_on_error "lock-on-tool unexpected failure"' ERR

# Read stdin once. Use the fast extractor — avoid spawning jq for the no-lock
# case which is the overwhelming majority of invocations.
hook_input=$(cat)
session_id=$(printf '%s' "$hook_input" | extract_session_id_fast)

[ -z "$session_id" ] && exit 0

target="$(status_dir)/$session_id.json"
[ -f "$target" ] || exit 0   # Fast-path: no lock for this session.

# 30-second write throttle. The Active state threshold is 5 minutes, so this
# keeps the lock comfortably in Active state while bounding disk writes.
throttle_seconds=30
last=$(lock_last_updated_epoch "$session_id")
now_epoch=$(date -u +%s)
age=$(( now_epoch - last ))

if [ "$age" -lt "$throttle_seconds" ]; then
  exit 0
fi

if ! update_lock_timestamp "$session_id"; then
  log_error "lock-on-tool: update_lock_timestamp failed for session=$session_id"
  exit 0
fi

append_log_line "$session_id" "TICK"
exit 0

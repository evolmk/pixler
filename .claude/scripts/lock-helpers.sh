#!/bin/bash
# Shared helpers for the session-lock overlay hooks.
#
# Hook payload contract (verified against .claude/scripts/track-skill.sh and Claude Code hook docs):
#   UserPromptSubmit  → .session_id (string), .prompt (string)
#   PostToolUse       → .session_id (string), .tool_name (string), .tool_input (object)
#   Stop              → .session_id (string)
#
# All hooks must exit 0 to avoid blocking the agent.

# Resolve the repo root. Prefer the harness-provided CLAUDE_PROJECT_DIR; fall
# back to a path computed from this script's location. Hooks may execute from
# an arbitrary cwd, so we never rely on $PWD.
repo_root() {
  if [ -n "${CLAUDE_PROJECT_DIR:-}" ] && [ -d "${CLAUDE_PROJECT_DIR}" ]; then
    printf '%s\n' "${CLAUDE_PROJECT_DIR}"
  else
    # This file lives at .claude/scripts/, so two levels up is the repo root.
    (cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
  fi
}

status_dir() {
  printf '%s/_plans/_status\n' "$(repo_root)"
}

errors_log() {
  printf '%s/.claude/scripts/lock-errors.log\n' "$(repo_root)"
}

# Convert backslashes to forward slashes. Used both on inbound prompt text and
# when storing planPath in the lock JSON so the value is OS-independent.
# Handles both `\\` (raw JSON-encoded form when jq is unavailable) and `\`
# (jq-decoded form) by running the double-backslash pass first, then the
# single-backslash pass. Both pipe through the same sed call.
normalize_path() {
  printf '%s' "$1" | sed -e 's|\\\\|/|g' -e 's|\\|/|g'
}

# Extract the first Kanban plan path from a string. Echoes the normalized
# forward-slash form or nothing if no match. Accepts both `/` and `\\`
# separators in the source; the regex runs on the normalized form.
extract_plan_path() {
  local input
  input=$(normalize_path "$1")
  printf '%s' "$input" | grep -oE '_plans/(00_skip-review|01_plans_need_codex_review|02_plans_need_claude_fixes|03_plans_ready_for_claude|03_bugfixes_ready_for_claude|04_code_needs_codex_review|05_code_needs_claude_fixes|_rare_arbitration/needs_user_decision|_rare_arbitration/needs_claude_followup)/[^[:space:]"'"'"']+\.md' \
    | head -n 1
}

# Cheap session-id extraction for the heartbeat hot path. Avoids spawning jq
# when no lock file exists for this session — important because the heartbeat
# fires on every tool call across every session. Sanitizes the value to a safe
# filename character set (alphanumeric, dash, underscore).
extract_session_id_fast() {
  local raw
  raw=$(grep -oE '"session_id"[[:space:]]*:[[:space:]]*"[^"]*"' \
        | head -n 1 \
        | sed 's/.*"\([^"]*\)"$/\1/')
  printf '%s' "${raw//[^A-Za-z0-9_-]/_}"
}

# ISO-8601 UTC timestamp like 2026-05-11T14:23:00Z.
iso_now() {
  date -u +'%Y-%m-%dT%H:%M:%SZ'
}

# Append a line to .claude/scripts/lock-errors.log. Used by exit_safely_on_error.
log_error() {
  local msg="$1"
  local errfile
  errfile=$(errors_log)
  mkdir -p "$(dirname "$errfile")" 2>/dev/null || true
  printf '%s %s\n' "$(iso_now)" "$msg" >> "$errfile" 2>/dev/null || true
}

# Trap-friendly wrapper: log the error, exit 0 so the hook never blocks the agent.
exit_safely_on_error() {
  log_error "$*"
  exit 0
}

# Append a single line to the sibling .log file for forensics. Best-effort —
# never blocks on failure.
append_log_line() {
  local session_id="$1"
  local line="$2"
  local dir
  dir=$(status_dir)
  printf '%s %s\n' "$(iso_now)" "$line" >> "$dir/$session_id.log" 2>/dev/null || true
}

# Detect whether jq is on PATH. Hooks fall back to sed-based timestamp updates
# in the heartbeat path if jq is unavailable; full JSON construction still
# requires jq.
have_jq() {
  command -v jq >/dev/null 2>&1
}

# Write the initial lock JSON for a session/plan. Atomic via tmpfile + mv.
# Requires jq.
write_lock_json() {
  local session_id="$1"
  local plan_path="$2"
  local dir
  dir=$(status_dir)
  mkdir -p "$dir" 2>/dev/null || true
  local now
  now=$(iso_now)
  local target="$dir/$session_id.json"
  local tmp="$target.tmp"
  if ! have_jq; then
    # Fallback: hand-build the JSON. Acceptable because the values are all
    # controlled (session_id is sanitized, plan_path is regex-matched, now is
    # date-generated).
    printf '{"sessionId":"%s","agent":"claude","planPath":"%s","startedAt":"%s","lastUpdatedAt":"%s","status":"active","endedAt":null}\n' \
      "$session_id" "$plan_path" "$now" "$now" > "$tmp" || return 1
  else
    jq -n \
      --arg sid "$session_id" \
      --arg plan "$plan_path" \
      --arg now "$now" \
      '{sessionId:$sid, agent:"claude", planPath:$plan, startedAt:$now, lastUpdatedAt:$now, status:"active", endedAt:null}' \
      > "$tmp" || return 1
  fi
  mv "$tmp" "$target" 2>/dev/null || return 1
}

# Refresh `lastUpdatedAt` on an existing lock. Atomic via tmpfile + mv.
# Caller already verified the file exists.
update_lock_timestamp() {
  local session_id="$1"
  local dir
  dir=$(status_dir)
  local target="$dir/$session_id.json"
  local tmp="$target.tmp"
  local now
  now=$(iso_now)
  if have_jq; then
    jq --arg now "$now" '.lastUpdatedAt = $now' "$target" > "$tmp" 2>/dev/null || return 1
    mv "$tmp" "$target" 2>/dev/null || return 1
  else
    # sed fallback: replace the lastUpdatedAt value in place.
    sed "s/\"lastUpdatedAt\":\"[^\"]*\"/\"lastUpdatedAt\":\"$now\"/" "$target" > "$tmp" 2>/dev/null || return 1
    mv "$tmp" "$target" 2>/dev/null || return 1
  fi
}

# Read the `lastUpdatedAt` ISO timestamp as epoch seconds, or 0 if not parseable.
# Used by the heartbeat throttle.
lock_last_updated_epoch() {
  local session_id="$1"
  local dir
  dir=$(status_dir)
  local target="$dir/$session_id.json"
  local iso
  if have_jq; then
    iso=$(jq -r '.lastUpdatedAt // empty' "$target" 2>/dev/null)
  else
    iso=$(grep -oE '"lastUpdatedAt":"[^"]*"' "$target" 2>/dev/null | sed 's/.*"\([^"]*\)"$/\1/' | head -n 1)
  fi
  if [ -z "$iso" ]; then
    printf '0'
    return
  fi
  # Try GNU date first (handles ISO-8601 with Z). Fall back to BSD date on macOS.
  local epoch
  epoch=$(date -u -d "$iso" +%s 2>/dev/null) || epoch=$(date -u -j -f '%Y-%m-%dT%H:%M:%SZ' "$iso" +%s 2>/dev/null) || epoch=0
  printf '%s' "$epoch"
}

# Mark the lock as ended. Atomic via tmpfile + mv. No-op if file doesn't exist.
mark_lock_ended() {
  local session_id="$1"
  local dir
  dir=$(status_dir)
  local target="$dir/$session_id.json"
  [ -f "$target" ] || return 0
  local tmp="$target.tmp"
  local now
  now=$(iso_now)
  if have_jq; then
    jq --arg now "$now" '.status = "ended" | .endedAt = $now | .lastUpdatedAt = $now' "$target" > "$tmp" 2>/dev/null || return 1
    mv "$tmp" "$target" 2>/dev/null || return 1
  else
    # Simple in-place edit. Works because the fields are single-line and quoted.
    sed -e "s/\"status\":\"[^\"]*\"/\"status\":\"ended\"/" \
        -e "s/\"endedAt\":null/\"endedAt\":\"$now\"/" \
        -e "s/\"endedAt\":\"[^\"]*\"/\"endedAt\":\"$now\"/" \
        -e "s/\"lastUpdatedAt\":\"[^\"]*\"/\"lastUpdatedAt\":\"$now\"/" \
        "$target" > "$tmp" 2>/dev/null || return 1
    mv "$tmp" "$target" 2>/dev/null || return 1
  fi
}

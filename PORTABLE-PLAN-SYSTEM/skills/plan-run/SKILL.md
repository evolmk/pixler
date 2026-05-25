---
name: plan-run
description: |
  Executes the next sprint from an active plan. Reads the plan, finds the next pending sprint, and
  works through its tasks — keeping the plan file synced so an interrupted session can resume.
  Triggers on: "run sprint", "next sprint", "execute sprint", "continue milestone", "run next".
---

# Run Sprint

A focused runner for plans authored by `/agent-planning create`. (Equivalent to the `run`
subcommand of `/agent-planning` — keep whichever you prefer.)

## Instructions

1. **Find the active plan:**
   - List `_docs/plans/*.md` (exclude `.TEMPLATE-*` and `_docs/plans/done/` — or your repo's
     completion folder if different; see `_docs/plans/CLAUDE.md`).
   - If multiple are in-progress, ask the user which one. If only one, use it. Read the full file.

2. **Resume check (if reopening — don't trust the checkboxes blindly):**
   - Read the top: `Status`, `Current Status`, `Modified`.
   - Find the frontier: the first `[-]` task, or if none, the first `[ ]` task.
   - A `[-]` task is the danger zone — verify it against `git status`/`git diff` and the files it
     names. Reconcile: complete → flip to `[x]`; partial → finish then `[x]`; nothing written →
     back to `[ ]`.
   - Spot-check the most recent `[x]` in case only one of the file/code writes landed before a crash.

3. **Staleness audit (before execution):**
   - Compare the `**Modified:**` date to today:
     - **Low risk** (≤ 3 days): note "likely still current" and proceed.
     - **Medium risk** (4–14 days): warn, and offer to audit the completion folder for overlap
       with recent work, skip the audit, or abandon.
     - **High risk** (15+ days): strongly recommend the audit before proceeding.

4. **Ask execution mode** (if not already chosen this session):
   - **Execute All Sprints** — complete all remaining sprints sequentially.
   - **Execute Next Sprint Only** — complete one sprint, then pause.

5. **Find the next pending sprint:**
   - The first sprint section with `[ ]`/`[-]` tasks.
   - If all sprints are complete: tell the user the plan is done; offer to set `Status: ✅ COMPLETE`
     and follow the completion protocol in `_docs/plans/CLAUDE.md` if your repo has one (otherwise
     default: move the file to `_docs/plans/done/`).

6. **Execute the sprint:**
   - Flip the sprint's tasks to `[-]` as you start each one, `[x]` as you finish.
   - If the repo has best-practices docs relevant to the work, read them before significant code.
   - **Verify** with the project's check (build / typecheck / tests) before marking anything `[x]`.
   - Update the sprint's "Files Created/Modified" and "Issues Encountered" as you go.

7. **After sprint completion:**
   - Update the sprint status, the plan's top-of-file "Current Status", and the "Modified" date.
   - (Recommended) Commit with a short message naming the sprint.
   - In "Execute Next Sprint Only" mode, pause and report what was completed.

## Key Rules

- Keep the plan file synchronized after every task — it's the durable record if the session dies.
- Verify before marking `[x]`; never mark complete on faith.
- Never silently downgrade or remove dependencies — stop and ask the user.
- No auto-commit, push, or PR unless the user asks.

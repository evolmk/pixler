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
   - List `_docs/plans/*.md` (exclude `.TEMPLATE-*` and `_docs/plans/completed/`).
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
     - **Medium risk** (4–14 days): warn, and offer to audit `_docs/plans/completed/` for overlap
       with recent work, skip the audit, or abandon.
     - **High risk** (15+ days): strongly recommend the audit before proceeding.

4. **Ask execution mode + commit cadence** (if not already chosen this session):
   - **Execute All Sprints** — complete all remaining sprints sequentially.
   - **Execute Next Sprint Only** — complete one sprint, then pause.
   - **If more than one sprint remains, ask in the same `AskUserQuestion` round whether to commit
     after each sprint completes** (yes → a per-sprint commit history mirroring the plan; no →
     don't commit). Record the answer and apply it to the whole run — do not re-ask per sprint.
     Skip this question when only one sprint remains (offer a single commit at the end instead).

5. **Find the next pending sprint:**
   - The first sprint section with `[ ]`/`[-]` tasks.
   - If all sprints are complete: tell the user the plan is done; offer to set `Status: ✅ COMPLETE`
     and follow the Pixler completion protocol in `_docs/plans/CLAUDE.md` (move to
     `_docs/plans/completed/` with `-COMPLETE` suffix, update `INDEX.md` and `MILESTONE-TRACKER.md`).

6. **Model check (before executing):**
   - Note which model this session is running (stated in your environment context).
   - If it is **not** a Sonnet model: sprint execution is well-specified implementation that Sonnet
     handles well and that burns far less of the 5-hour usage window than Opus (reserve Opus for
     plan *authoring* and hard debugging). Surface a one-line recommendation and ask whether to
     **(a)** pause so the user can run `/model sonnet`, or **(b)** proceed on the current model.
   - You can't switch the model yourself — only the user can, via `/model` or settings. Don't claim
     to have switched it.
   - If already on a Sonnet model, skip silently.

7. **Execute the sprint:**
   - **BEFORE implementing each task:** edit the plan file to flip it from `[ ]` to `[-]`. Do
     this as the very first action for that task — not after, not at the end of the sprint.
   - **IMMEDIATELY after completing each task:** edit the plan file to flip it from `[-]` to `[x]`.
   - If the repo has best-practices docs relevant to the work, read them before significant code.
   - **Verify** with the project's check (build / typecheck / tests) before marking anything `[x]`.
   - Update the sprint's "Files Created/Modified" and "Issues Encountered" as you go.

8. **After sprint completion:**
   - Update the sprint status, the plan's top-of-file "Current Status", and the "Modified" date.
   - If the user opted into per-sprint commits at step 4, commit now with a short message naming
     the sprint. Otherwise don't commit (offer one at the end if they didn't opt in).
   - In "Execute Next Sprint Only" mode, pause and report what was completed.

## Key Rules

- Keep the plan file synchronized after every task — it's the durable record if the session dies.
- Verify before marking `[x]`; never mark complete on faith.
- Never silently downgrade or remove dependencies — stop and ask the user.
- No auto-commit, push, or PR unless the user asks — the per-sprint commit opt-in at step 4 counts
  as the user asking, for the duration of that run.
---
name: agent-planning
description: |
  Create and execute milestone/bugfix plans as resumable, file-based sprints. The plan file is
  the single source of truth — if a session hangs, re-open it and you know exactly what's done
  and what isn't. Subcommands: create, run.
  Triggers on: "create plan", "new milestone", "bugfix", "run sprint", "next sprint",
  "continue milestone", "resume plan", "implement plan".
---

# Planning

A plan is a markdown file in `_docs/plans/` that is **durable state**: it stays in lockstep with the
code at all times, so an interrupted session can always be resumed from the file alone.

## Subcommands

| Subcommand | What it does                                                                    |
| :--------- | :------------------------------------------------------------------------------ |
| `create`   | Gather scope, confirm, write a plan to `_docs/plans/` broken into sprints.      |
| `run`      | Execute the next sprint(s), keeping the file synced; resume safely after a hang. |

If the user's intent is ambiguous, ask which subcommand they want.

## Core principle (applies to both subcommands)

The plan file is the source of truth. Update it **as you go**, never at the end. Task markers:

- `[ ]` pending · `[-]` in-progress · `[x]` complete.

---

## Subcommand: `create`

### 1. Determine plan type

| Plan type | Template                                       | Output                         |
| :-------- | :--------------------------------------------- | :----------------------------- |
| Milestone | `_docs/plans/templates/.TEMPLATE-milestone.md` | `_docs/plans/M<N>-<slug>.md`   |
| Bugfix    | `_docs/plans/templates/.TEMPLATE-bugfix.md`    | `_docs/plans/bugfix-<slug>.md` |

Use the bugfix template if the user mentions `bug`/`fix`/broken behavior or scopes the work to a
defect. Use milestone otherwise.

For milestone IDs: read `_docs/plans/MILESTONE-TRACKER.md` to find the highest used number; the new
plan gets the next one. (Pixler-specific — see `_docs/plans/CLAUDE.md`.)

### 2. Gather scope

- Read the appropriate template.
- Ask the questions that actually change the plan: name, scope boundaries, explicit non-goals.
  Bugfix also: steps to reproduce, severity (Critical/High/Medium/Low — Medium default), affected
  area.
- If the user references a spec or existing feature, read the matching files to inform the plan.
- (If your `CLAUDE.local.md` defines an "interview before writing" flow, run that here.)

### 3. Confirm before writing

Restate plan type, name, goal, scope, and what's **out of scope** in a few lines. Get an explicit
"yes" before writing the file.

### 4. Write the plan

- Write the file into `_docs/plans/` from the template.
- Replace all placeholders; set today's date and `Status: ⏳ IN_PROGRESS`.
- Paste the original request under "Prompt that created this plan".
- **Milestone:** decompose work into **sprints** (the executable unit) with concrete `[ ]` tasks.
  Each sprint gets a one-line goal, is independently verifiable (its own build/test), and is worth
  one commit.
- **Bugfix:** fill the root-cause hypothesis, fix tasks, and verification steps.

### 5. Hand off

Don't slide straight into implementing. Ask: **"Plan ready. Run the first sprint now, or stop
here?"** If the user says run → route to `run`.

---

## Subcommand: `run`

### 1. Find the active plan

Glob `_docs/plans/*.md` (exclude `.TEMPLATE-*` and `_docs/plans/completed/`). If more than one is in
progress, ask which to work on.

### 2. Resume check (if reopening an in-progress plan)

Don't trust the checkboxes blindly — verify against the code:

- Read the top: `Status`, `Current Status`, `Modified`.
- Find the frontier: the first `[-]` task, or if none, the first `[ ]` task.
- A `[-]` task is the danger zone — verify it against `git status`/`git diff` and the files it
  names. Reconcile: complete → flip to `[x]`; partial → finish then `[x]`; nothing written → flip
  back to `[ ]`.
- Spot-check the most recent `[x]` in case only one of the file/code writes landed before a crash.
- Continue from the reconciled frontier.

### 3. Pick execution mode (if not already chosen)

- **Execute all sprints** (default) — run every sprint sequentially, stop at the end.
- **Execute next sprint only** — run one sprint, then pause. Use for risky work (auth, payments,
  schema migration, cross-service changes).
- **If more than one sprint remains, ask in the same `AskUserQuestion` round whether to commit
  after each sprint completes.** Record the answer and apply it to the whole run — don't re-ask
  per sprint. Skip the question when only one sprint remains (offer a single commit at the end).

### 4. Model check (before executing)

- Note which model this session is running (stated in your environment context).
- If it is **not** a Sonnet model: sprint execution is well-specified implementation that Sonnet
  handles well and that burns far less of the 5-hour usage window than Opus (reserve Opus for plan
  *authoring* and hard debugging). Surface a one-line recommendation and ask whether to **(a)**
  pause so the user can run `/model sonnet`, or **(b)** proceed on the current model.
- You can't switch the model yourself — only the user can, via `/model` or settings. Don't claim to
  have switched it. If already on a Sonnet model, skip silently.

### 5. Do the work (per sprint)

- Find the next pending sprint; flip its tasks to `[-]` as you start them.
- Implement the sprint.
- **Verify** with the project's check (build / typecheck / tests) before marking anything `[x]`.
  Mark complete on a passing check, not on faith.
- Keep these updated **in the file, as you go** (not at the end):
  - Each task `[-] → [x]`.
  - The sprint's **Files Created/Modified** and **Issues Encountered**.
  - The top-of-file **Current Status** (one sentence) and the **Modified** date.
- If the user opted into per-sprint commits at step 3, commit after the sprint with a short message
  naming it — a second, independent record of progress that `git log` and the plan file should
  agree on. Otherwise don't commit (offer one at the end if they didn't opt in).
- In "all sprints" mode, continue to the next sprint. In "next sprint only" mode, stop and report.

### 6. Finish

When every sprint is `[x]`: set `Status: ✅ COMPLETE`, write the final Current Status. **For
completion bookkeeping (move to `_docs/plans/completed/`, append `-COMPLETE` suffix, update
`INDEX.md` + `MILESTONE-TRACKER.md`, commit message format), follow the protocol in
`_docs/plans/CLAUDE.md`.**

---

## Key rules

- No application code before the plan exists (for non-trivial work). Trivial one-liners don't need
  a plan.
- The plan file is durable state — keep it honest and current, never retroactive.
- Verify before `[x]`.
- Creating ≠ executing — confirm and pick a mode before implementing.
- No auto-commit, push, or PR unless the user asks — the per-sprint commit opt-in at step 3 counts
  as the user asking, for the duration of that run.

## What this skill does not do

- No Kanban queues, review gates, or approval routing.
- No multi-agent reviewer handoff.
- No todo-system integration.
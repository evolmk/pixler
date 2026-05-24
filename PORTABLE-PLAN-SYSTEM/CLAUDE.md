# Plan & Sprint System

> Merge this section into your repo's `CLAUDE.md`. It loads every session and tells the agent
> how to plan, track, and resume multi-step work.

## When to write a plan

Non-trivial work (multi-file changes, new features, refactors, multi-step bugfixes) gets a
**plan file** in `_docs/plans/` before code is written. Trivial changes (one-line fixes, typos, comment
edits — anything unambiguous and a few lines in one file) don't need a plan; just make them.

If unsure whether something is trivial, default to writing a plan.

## The plan file is durable state

**Keep the plan file synchronized with the code at all times — not at the end.** If a session
dies, the file must already reflect reality. This is the whole point: updating the plan is not
bookkeeping you do after the work, it *is* part of the work.

**Task markers:**

- `[ ]` pending
- `[-]` in-progress (flip to this the moment you start a task)
- `[x]` complete (flip to this the moment it's done and verified)

## Structure: phases → sprints

A milestone is broken into **phases** (the high-level plan) which decompose into **sprints** (the
unit of execution). Each sprint is a coherent, independently-verifiable chunk of work with its own
goal and `[ ]` task checklist. A good sprint passes its own build/test and is worth one commit.

## Creating a plan (before any code)

1. **Pick the type** — milestone (feature/refactor) or bugfix (defect). Bugfixes use the lighter
   template.
2. **Gather scope, then confirm — don't guess.** Ask only the questions that change the plan: its
   name, scope boundaries, and what's explicitly *out* of scope. For a bugfix also get steps to
   reproduce, severity, and the affected area. Restate goal / scope / non-goals in a couple of
   lines and get an explicit "yes" before writing the file.
3. **Write the file from the template** in `_docs/plans/`. Replace every placeholder, set today's date
   and `Status: ⏳ IN_PROGRESS`, and paste the original request under "Prompt that created this plan".
4. **Decompose into phases, then sprints** with concrete `[ ]` tasks small enough to verify.
5. **Stop. Creating ≠ executing.** Confirm the plan reads right, pick an execution mode, *then*
   start Sprint 1. Don't slide straight from writing into implementing.

## Executing a plan

**Execution modes** — before starting, pick one:

1. **All sprints** — run every sprint sequentially, stop at the end. (default)
2. **Next sprint only** — run one sprint, then pause for review. Use for risky work (auth,
   payments, schema migrations, cross-service changes).

**While implementing a sprint, you MUST keep these current in the file:**

- Flip each task `[ ] → [-] → [x]` as you move through it.
- The sprint's **Files Created/Modified** list (add files as you touch them).
- The sprint's **Issues Encountered** (anything surprising, with its resolution).
- The **Current Status** summary line at the top of the file (one sentence: where things stand).
- The **Modified:** date at the top.

**Verify before marking a sprint complete.** Run the project's check (build / typecheck / tests).
Don't mark `[x]` on faith — mark it on a passing check. Note what you ran in the sprint's Current
State.

**Committing (recommended for resumability).** Commit after each sprint completes, with a short
message naming the sprint. A per-sprint commit history is a second, independent record of what's
done — `git log` and the plan file should agree.

**When the whole milestone is done:** set `Status: ✅ COMPLETE`, write the final Current Status,
and move the file to `_docs/plans/done/` (optional).

## Resuming after a hang (the payoff)

When you pick a plan back up after an interruption, follow this exactly — don't trust the
checkboxes blindly, *verify against the code*:

1. **Read the top of the file** — `Status`, `Current Status`, `Modified`. That's your
   one-paragraph re-orientation.
2. **Find the frontier** — the first `[-]` task (something was mid-flight) or, if none, the first
   `[ ]` task. That's where work stopped.
3. **Verify the frontier against reality.** A `[-]` task is the danger zone: the session may have
   died halfway through it. Check `git status` / `git diff` and read the actual files the sprint
   names. Reconcile:
   - If the code for a `[-]` task is actually complete and verified → flip it to `[x]`.
   - If it's partially done → finish it, then flip to `[x]`.
   - If nothing was written → flip back to `[ ]` and start clean.
4. **Spot-check the last `[x]`.** Occasionally a task gets marked complete just before a crash but
   only one of the file/code writes landed. A 10-second look catches this.
5. **Continue** from the reconciled frontier.

The rule that makes this work: **you updated the file as you went**, so step 1 is accurate and
steps 3–4 are quick reconciliation, not archaeology.

## Skills

- `/agent-planning create` — author a plan into `_docs/plans/`.
- `/agent-planning run` — execute the next sprint(s) and keep the file synced.
- `/plan-check` — read-only status across all plans.

Templates live in `_docs/plans/templates/.TEMPLATE-milestone.md` and `_docs/plans/templates/.TEMPLATE-bugfix.md`.

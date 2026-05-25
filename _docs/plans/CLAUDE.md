# Plans — CLAUDE.md

Loaded automatically when any file in `_docs/plans/` is touched. Contains the full Plan & Sprint
workflow plus Pixler-specific bookkeeping. The plan-creation interview lives in `CLAUDE.local.md`.

## Plan & Sprint workflow

### When to write a plan

Non-trivial work (multi-file changes, new features, refactors, multi-step bugfixes) gets a plan
file before code is written. Trivial changes (one-line fixes, typos, comment edits) don't need a
plan; just make them. If unsure, default to writing a plan.

### Task markers

- `[ ]` pending
- `[-]` in-progress (flip to this the moment you start a task)
- `[x]` complete (flip to this the moment it's done and verified)

### Structure: sprints

A milestone decomposes into **sprints** — each is a coherent, independently-verifiable chunk of
work with its own goal and `[ ]` task checklist. A good sprint passes its own build/test and is
worth one commit.

### Creating a plan (before any code)

1. **Pick the type** — milestone (feature/refactor) or bugfix (defect). Bugfixes use the lighter template.
2. **Run the interview protocol** in `CLAUDE.local.md` before writing the file.
3. **Write the file from the template** in `_docs/plans/templates/`. Replace every placeholder,
   set today's date and `Status: ⏳ IN_PROGRESS`.
4. **Decompose into sprints** with concrete `[ ]` tasks small enough to verify.
5. **Stop. Creating ≠ executing.** Confirm the plan reads right, pick an execution mode, *then* start Sprint 1.

### Executing a plan

**Execution modes** — before starting, pick one:

1. **All sprints** — run every sprint sequentially, stop at the end. (default)
2. **Next sprint only** — run one sprint, then pause. Use for risky work (auth, payments, schema
   migrations, cross-service changes).

**While implementing a sprint, keep these current in the file:**

- Flip each task `[ ] → [-] → [x]` as you move through it.
- The sprint's **Files Created/Modified** list.
- The sprint's **Issues Encountered** (anything surprising, with resolution).
- The **Current Status** summary line at the top (one sentence).
- The **Modified** date at the top.

**Verify before marking a sprint complete.** Run build / typecheck / tests. Don't mark `[x]` on faith.

**Committing (per-sprint, opt-in).** When a plan run begins with more than one sprint ahead, ask
up front whether to commit after each sprint — then honor that choice for the whole run without
re-asking. Skip the up-front question when only one sprint remains; offer a single commit at the end.

### Resuming after a hang

1. **Read the top of the file** — `Status`, `Current Status`, `Modified`. One-paragraph re-orientation.
2. **Find the frontier** — first `[-]` task, or if none, first `[ ]` task.
3. **Verify the frontier against reality.** Check `git status` / `git diff` and read the actual files.
   - Code for a `[-]` task is complete → flip to `[x]`.
   - Partially done → finish it, then flip to `[x]`.
   - Nothing written → flip back to `[ ]` and start clean.
4. **Spot-check the last `[x]`.** A task can be marked complete just before a crash with only partial writes.
5. **Continue** from the reconciled frontier.

---

## Milestone plans live here

Active plans: `_docs/plans/M<N>-<slug>.md` (M01–M26). Completed plans:
`_docs/plans/completed/M<N>-<slug>-COMPLETE.md`. Each is self-contained and agent-runnable per the
merged template at `_docs/plans/templates/.TEMPLATE-milestone.md`. See `README.md` for the
dependency graph.

Critical path: `M01 → M02/M04/M05 → M03 → M06 → M07 → M08 → M09 → M13 → M14 → M15 → M25`

## Pixler-specific bookkeeping

### Creating a new plan

1. Read `MILESTONE-TRACKER.md` — check `Most Recent Plan ID` to find the highest used number. New
   plan gets the next one.
2. Run the interview protocol (`CLAUDE.local.md`) before writing the file.
3. Write the plan file to `_docs/plans/M<N>-<slug>.md` from the milestone template. Include
   `Status: ⏳ IN_PROGRESS` in the header.
4. Update `MILESTONE-TRACKER.md`: set `Most Recent Plan ID: M<N>` and add
   `- [ ] **M<N>** — <short description>` to the milestones list.

### Completing a plan

1. Verify all sprint tasks are `[x]`. Set `Status: ✅ COMPLETE` in the header and write the final
   `Current Status` line.
2. Move the file into `_docs/plans/completed/` and append `-COMPLETE` to the filename.
3. Update `MILESTONE-TRACKER.md` — three fields, each with a precise rule (do not skip any):
   - **Tick** the just-completed milestone (`- [ ]` → `- [x] **M<N>** — …`).
   - `**Last Plan Completed:** M<N>-<slug>` — the plan you just finished, every time (chronological
     marker, not furthest-numbered). If you complete M03 after M05, this becomes `M03-<slug>`.
   - `**Next Plan:** M<X>-<slug>` — first still-unticked milestone in the list.
4. Append a one-line entry to `_docs/plans/completed/INDEX.md`:
   `| M<N> | YYYY-MM-DD | <short description> |`
5. Commit: `feat(plans): complete M<N> — <slug>`

### Before executing any plan

Offer to run `/plan-consultant` if it hasn't had a consultant review this session. One offer, not a gate.

## Plan and code reviews

Both use the `code-review` skill.

**Plan reviews:**

1. Invoke `skill: "code-review"`. Frame: *"Review the plan at `<plan-path>` as a design/planning
   review. Check for: missing file references, scope ambiguities, missing wiring (module
   registrations, gateway routes, Socket.io event types, shared-types DTOs), spec compliance
   against `pixler-SPEC.md`, security/auth implications."*
2. Independently verify every file:line reference against the live codebase.
3. Append findings as `## Plan Review (Claude via code-review, YYYY-MM-DD)`. Translate:
   `blocking → P0`, `important → P1`, `nit/suggestion → P2`.
4. Verdict: **ready to execute** or **fix first**.

**Code reviews:**

1. Invoke `skill: "code-review"`. Frame: *"Review the implementation against the plan at
   `<plan-path>`. Focus on files changed during this milestone."*
2. Append findings as `## Code Review (Claude via code-review, YYYY-MM-DD)`. Same P0/P1/P2.
   Include file:line refs.
3. Verdict: **clean** (proceed to completion bookkeeping) or **fix first**.

**Escape hatch:** If the user says "quick self-review" or "skip the skill", run a plain
self-review under heading `## Plan Review (Claude, YYYY-MM-DD — quick)`. Claude never offers the escape hatch.

# Plans — CLAUDE.md

Loaded automatically when any file in `_docs/plans/` is touched. **Adds Pixler-specific
bookkeeping on top of the general Plan & Sprint System** defined in the repo's top-level
`CLAUDE.md`. The general workflow (sprints, `[ ]/[-]/[x]`, durable Status header, resume-after-hang
discipline) lives there. The plan-creation interview lives in `CLAUDE.local.md`.

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
2. Move the file into `_docs/plans/completed/` and append `-COMPLETE` to the filename:
   `M<N>-<slug>-COMPLETE.md`.
3. Update `MILESTONE-TRACKER.md` — three fields, each with a precise rule (do not skip any):
   - **Tick** the just-completed milestone in the list (`- [ ]` → `- [x] **M<N>** — …`).
   - `**Last Plan Completed:** M<N>-<slug>` — **the plan you just finished, every time.** This is
     a chronological marker (what just happened), NOT a "furthest-numbered completed plan"
     marker. If you complete M03 after M05 is already done, this field becomes `M03-<slug>`, not
     `M05-<slug>`. Always overwrite it on every completion.
   - `**Next Plan:** M<X>-<slug>` — the first still-unticked milestone in the list (independent
     of which plan you just finished; uses the natural list order).
4. Append a one-line entry to `_docs/plans/completed/INDEX.md`:
   `| M<N> | YYYY-MM-DD | <short description> |`
5. Commit the rename + tracker + index update together:
   `feat(plans): complete M<N> — <slug>`

### Before executing any plan

Offer to run `/plan-consultant` if it hasn't had a consultant review this session. One offer, not
a gate.

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
self-review under heading `## Plan Review (Claude, YYYY-MM-DD — quick)`. Claude never offers the
escape hatch.

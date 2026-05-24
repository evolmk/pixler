# Plans — CLAUDE.md

Loaded automatically when any file in `_docs/plans/` is touched.

## Milestone plans

Plans live here (M01–M25). Each is self-contained and agent-runnable with: Goal, Depends on, Deliverables, Acceptance, Files, Out of scope. See
`README.md` for the dependency graph.

Critical path: `M01 → M02/M04/M05 → M03 → M06 → M07 → M08 → M09 → M13 → M14 → M15 → M25`

### Creating a new plan

1. Read `MILESTONE-TRACKER.md` — check
   `Most Recent Plan ID` to find the highest used number. New plan gets the next one.
2. Run the interview protocol below before writing the file.
3. Write the plan file to `_docs/plans/M<N>-<slug>.md`. Include `Status: draft` near the top of the metadata block.
4. Update `MILESTONE-TRACKER.md`: set `Most Recent Plan ID: M<N>` and add
   `- [ ] **M<N>** — <short description>` to the milestones list.

### Completing a plan

1. Check off all deliverable checkboxes in the plan file (`- [ ]` → `- [x]`). Set
   `Status: complete` in the metadata block.
2. Move the file into `_docs/plans/completed/` (create if needed) and append `-COMPLETE` to the filename.
3. Update `MILESTONE-TRACKER.md`: tick the milestone, set `Last Plan Completed`, set `Next Plan`.
4. Append a one-line entry to `_docs/plans/completed/INDEX.md` (create if needed):
   `| M<N> | YYYY-MM-DD | <short description> |`
5. Commit the rename + tracker + index update together:
   `feat(plans): complete M<N> — <slug>`

### Before executing any plan

Offer to run `/plan-consultant` if it hasn't had a consultant review this session. One offer, not a gate.

## Plan authoring — interview before writing

1. **State a one-sentence hypothesis with a confidence number.**
   `HYPOTHESIS: You want X. CONFIDENCE: ~35%.` Be honest — if you can't predict Mike's reactions to the next three questions, the number is too high.

2. **Propose common features for this type of work** (draw from
   `pixler-SPEC.md` and existing plans). Pick 3–6 most likely:
    - **New NestJS module** — module registration, gateway route, Socket.io event types in
      `shared-types`, auth guard, validation pipe, DTO shape.
    - **New agent capability
      ** — orchestrator package integration, state-machine transitions, IPC events, error/retry handling, CLI flag.
    - **New UI page
      ** — Zustand store slice, TanStack Query hook, route registration, loading/error states, responsive layout per
      `spec-ui-responsive.md`.
    - **New UI component** — CVA variants, Radix UI primitive, semantic tokens, accessibility, Storybook story.
    - **New SQLite schema change** — migration file, repository method, DTO mapping, index.
    - **New Socket.io event** — event type in
      `shared-types`, backend emit, frontend listener, optimistic update or cache invalidation.

3. **Ask using `AskUserQuestion`, one focused round at a time.** Label recommended answer
   `(Recommended)`, list it first. Up to 4 questions per call.

4. **Listen for "want vs. should-want."** If answers sound like best-practice talk, probe once: *"If you didn't have to
   justify this to anyone, what would you actually want?"*

5. **Restate intent in 5–8 lines before writing the file:**
   ```
   - Outcome:      <one line>
   - Why now:      <one line>
   - Success:      <one line>
   - Constraint:   <one line>
   - Out of scope: <one line>
   - Common features included: <bullet per step 2 answer>
   ```

6. **Get an explicit yes.** "Sounds good" / silence are not yes. Only after explicit yes write the plan file.

**When it fires:** Any time Mike asks to create a new milestone or non-trivial feature plan.
**Does not fire on:** trivial single-file bugfixes, or when Mike says "skip the interview" / "just write the plan".
**Stop condition:
** Stop when you can predict Mike's reaction to the next three questions. If confidence isn't rising after three rounds, stop and say so.
**Anti-patterns:** Three open-ended questions instead of
`AskUserQuestion`. Accepting "whatever you think". Writing before the explicit-yes restate. Skipping "Out of scope".

## Plan and code reviews

Both use the `code-review` skill.

**Plan reviews:**

1. Invoke `skill: "code-review"`. Frame: *"Review the plan at `<plan-path>` as a design/planning review. Check for:
   missing file references, scope ambiguities, missing wiring (module registrations, gateway routes, Socket.io event
   types, shared-types DTOs), spec compliance against `pixler-SPEC.md`, security/auth implications."*
2. Independently verify every file:line reference against the live codebase.
3. Append findings as `## Plan Review (Claude via code-review, YYYY-MM-DD)`. Translate: `blocking → P0`,
   `important → P1`, `nit/suggestion → P2`.
4. Verdict: **ready to execute** or **fix first**.

**Code reviews:**

1. Invoke `skill: "code-review"`. Frame: *"Review the implementation against the plan at `<plan-path>`. Focus on files
   changed during this milestone."*
2. Append findings as `## Code Review (Claude via code-review, YYYY-MM-DD)`. Same P0/P1/P2. Include file:line refs.
3. Verdict: **clean** (check off deliverables + update `MILESTONE-TRACKER.md`) or **fix first**.

**Escape hatch:** If Mike says "quick self-review" or "skip the skill", run a plain self-review under heading
`## Plan Review (Claude, YYYY-MM-DD — quick)`. Claude never offers the escape hatch.

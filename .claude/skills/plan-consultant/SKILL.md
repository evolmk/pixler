---
name: plan-consultant
description: |
  Advisory pre-flight review for milestone plans. Reads the plan, inspects the live
  codebase and specs, then updates the plan with findings and enhancements. Never
  gates or routes — advisory only, writes directly to the plan file.

  Triggers on: "/plan-consultant", "consult plan", "sanity check plan", "pre-review",
  "enhance plan", "pressure-test plan", "plan ideas", "enhance features",
  "improve plan", "what am i missing".
---

# Plan Consultant

A pre-flight advisory review that makes milestone plans **better** before execution. It reads the plan, inspects the live codebase and specs, then updates the plan file with findings and suggested enhancements.

## When to use

- On any non-executed milestone plan in `_docs/plans/`.
- When the user explicitly asks to "consult", "pressure-test", "enhance", or "improve" a plan.
- Before starting execution of a milestone.

## When NOT to use

- On already-completed milestones (checked off in `MILESTONE-TRACKER.md`).
- As a substitute for code review — this reviews *plans*, not *code*.
- Do NOT edit application code. The consultant only reads code and writes to plan files.

## Inputs

- `/plan-consultant M04` or `/plan-consultant M04-api-core.md` — evaluate a specific plan.
- `/plan-consultant` with no argument — show plan selection (see Flow step 1).

## Flow

### 1. Plan selection

If the user supplies a filename or milestone number, resolve it to a file in `_docs/plans/`.

If no argument is given:
- Read `_docs/plans/MILESTONE-TRACKER.md` to find incomplete milestones.
- Present the next 5 incomplete plans using `AskUserQuestion` so the user can pick one.
- Include a final option "Specify a filename" for arbitrary paths.

### 2. Read the plan in full

- Read the plan file end-to-end. Note: Goal, Depends on, Deliverables, Acceptance criteria, Files, Out of scope.
- Identify the plan's stated scope and all files it claims to create or modify.

### 3. Load project context

- `CLAUDE.md` — repo conventions, stack decisions.
- `_docs/pixler-SPEC.md` — the canonical product spec. Cross-reference the section(s) relevant to this milestone.
- The relevant `_specs/spec-ui/*.md` file(s) if the plan touches UI.
- `_docs/plans/MILESTONE-TRACKER.md` — which milestones are done (determines what code exists).
- The plan's "Depends on" milestones — skim those plans to understand what's already built.

### 4. Inspect the live codebase

For every file the plan claims to create or modify:
- Check if it already exists (from a previously-completed milestone).
- If it exists, read it and note what the plan should account for.

For every area the plan touches (NestJS module, React component, package):
- Glob for related code that's already landed.
- Note patterns already established that the plan should follow or leverage.
- Check `packages/` for shared types, utilities, or components the plan should use.

### 5. Apply four lenses

#### Lens 1 — Risks & gaps

What the plan might be missing or mis-stating. Verified against the live code and specs.

- Missing dependencies (npm packages, workspace references).
- Missing wiring: module registrations, route setup, exports from index.ts.
- Acceptance criteria that can't actually be tested as described.
- Scope ambiguities — anything where two implementers would make different decisions.
- Conflicts with already-landed code from completed milestones.

#### Lens 2 — Spec compliance

Cross-reference against `pixler-SPEC.md` and relevant `_specs/` files.

- Requirements in the spec that fall within this milestone's scope but aren't in the plan.
- Spec details the plan glosses over (specific behaviors, edge cases, configuration).
- Spec constraints the plan might violate (e.g., "Pixler never holds an LLM API key").

#### Lens 3 — Reuse opportunities

Where the plan should leverage existing code instead of writing new.

- Packages already scaffolded that the plan should import from.
- Patterns established by completed milestones the plan should follow.
- npm packages in the spec's stack table the plan should use.
- Reference material in `files-from-my-angular-repo/` worth consulting.

#### Lens 4 — Enhancements

Concrete functionality the plan could add to make the milestone more complete. This is the "what am I missing" lens.

- Features implied by the spec but not explicitly listed in deliverables.
- Developer experience improvements (better error messages, helpful CLI output, dev tooling).
- Integration points with future milestones that would be cheap to wire now.
- Edge cases worth handling upfront rather than patching later.

Be selective — only suggest enhancements that are clearly within scope and materially improve the milestone. Don't scope-creep.

### 6. Update the plan file

Append a `## Consultant Review` section at the bottom of the plan file:

```markdown
## Consultant Review (YYYY-MM-DD)

### Risks & gaps

- **[P0]** <finding>
- **[P1]** <finding>

### Spec compliance

- **[P1]** <finding> — see SPEC §X.X
- _(none)_

### Reuse opportunities

- **[P1]** <finding> — existing code at `path/to/file.ts`

### Enhancements

- **[P1]** <enhancement description>
- **[P2]** <enhancement description>

### Changelog

- YYYY-MM-DD: Initial consultant review
```

Severity codes:
- **P0** — likely to cause rework if missed (factual error, missing critical wiring).
- **P1** — strong suggestion (clear improvement, spec gap, reuse opportunity).
- **P2** — worth considering (nice-to-have, soft suggestion).

If a lens has no findings, write `- _(none)_` under the heading.

### 7. Multiple runs

If a `## Consultant Review` section already exists, append a new dated entry to the Changelog and update the findings sections (replace stale findings, keep valid ones).

### 8. Offer next plan

After completing the review, use `AskUserQuestion` to offer:
- The next 3–5 incomplete plans adjacent to the one just reviewed (by milestone number).
- A "Specify filename" option.
- Phrased so the user can decline (they can select "Other" and type "done" or just dismiss).

## Boundaries

- **Never** modify the plan body above the `## Consultant Review` section.
- **Never** edit application code. Read-only access to the codebase.
- **Never** mark milestones as complete or modify `MILESTONE-TRACKER.md`.
- **Never** commit or push.
- If invoked on a completed milestone, refuse and suggest the next incomplete one.

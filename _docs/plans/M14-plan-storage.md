# M14 — Plan storage (file / inline / attachment + auto)

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — runnable after M10 + M13.

---

## Goal

Implement SPEC §5 in full: three plan storage modes (file, inline, attachment) with the "auto"
recommender, the big-plan prompt, rolling-pair attachment versioning, frontmatter format, inline
markers, and the Plan tab UI that surfaces and edits the active plan.

## Depends on

- M10 (Linear attachment + ticket-comment APIs)
- M13 (orchestrator events to detect plan completion, plan revisions)

## Acceptance

- A simple ticket (description < 200 chars, no sub-tasks) plans to **inline** without prompting.
- A complex ticket plans to **file** and the file appears in `docs/plans/`.
- A plan that grows past inline thresholds blocks the save and shows the big-plan modal.
- Choosing "Attach" uploads `plan-v1.md` to Linear; a subsequent revision uploads `plan-v2.md`
  and the first stays as previous; a v3 uploads and deletes v1.
- Toggling a task checkbox in the Plan tab closes the matching Linear sub-issue.
- `pnpm -w typecheck` clean.

## Out of scope

- Live diff between plan and current working tree — Diff tab is M17.
- Conflict resolution between concurrent plan writes — single-writer assumption in v1.

## Files (expected surface)

```
apps/api/src/db/migrations/0005_plans.sql
apps/api/src/plans/plans.module.ts
apps/api/src/plans/plans.service.ts
apps/api/src/plans/plans.controller.ts
apps/api/src/plans/auto-recommender.service.ts
apps/api/src/plans/storage/file-storage.ts
apps/api/src/plans/storage/inline-storage.ts
apps/api/src/plans/storage/attachment-storage.ts
apps/api/src/plans/sub-issues-bridge.service.ts
packages/shared-types/src/plans.ts
apps/web/src/components/PlanTab.tsx
apps/web/src/components/PlanEditor.tsx
apps/web/src/components/BigPlanPromptModal.tsx
apps/web/src/components/PlanStorageBadge.tsx
apps/web/src/components/ProjectSettingsDrawer/PlansPanel.tsx
apps/web/src/components/SettingsDrawer/PlansPanel.tsx
apps/web/src/hooks/usePlan.ts
```

---

## Sprint 1 — DB + types + PlansModule + three storage writers

**Status:** ⏳ pending
**Goal:** Migration + module + reader/writer for each storage mode work in isolation.

**Tasks:**

- [ ] `0005_plans.sql` per SPEC §5.5 columns.
- [ ] `packages/shared-types/src/plans.ts` — `PlanStorageMode`, `PlanFrontmatter`, `Plan`.
- [ ] `PlansModule` + `PlansService` + `PlansController`.
- [ ] `storage/file-storage.ts` — write to `<repo>/docs/plans/<TICKET>.md`; commit if on a branch.
- [ ] `storage/inline-storage.ts` — find/create `<!-- pixler-plan:start revision=N -->...<!-- pixler-plan:end -->`
  block in Linear ticket description; never touch text outside.
- [ ] `storage/attachment-storage.ts` — upload via Linear; maintain rolling pair (delete old
  AFTER new one uploads).
- [ ] `POST /api/workspaces/:id/plan`, `GET /api/workspaces/:id/plan`,
  `GET /api/workspaces/:id/plan/history`, `POST /api/workspaces/:id/plan/revise`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test plans-storage` — round-trip each storage mode + rolling-pair test.

---

## Sprint 2 — Auto recommender + big-plan prompt + reset prompts

**Status:** ⏳ pending
**Goal:** "auto" mode resolves correctly per SPEC §5.2; big-plan blocking modal appears at the
right thresholds.

**Tasks:**

- [ ] `auto-recommender.service.ts` — implements SPEC §5.2 table; returns `{ mode, reason }`.
- [ ] On plan write: if resolved mode is `inline` AND body exceeds thresholds (`> 3 tasks` OR
  `> 500 chars approach`), **block** the save and emit `plan.big-plan-prompt`.
- [ ] Reset-prompts: per-project clears `don't-ask-again` flags; global wipes across projects.
- [ ] Inline-mode markers per SPEC §5.6 exactly.
- [ ] Attachment versioning per SPEC §5.4 rolling-pair table.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test auto-recommender` + manual: trigger big-plan modal.

---

## Sprint 3 — Sub-issues bridge + Plan tab UI

**Status:** ⏳ pending
**Goal:** Plan tab renders the current plan with editable checkboxes that drive Linear sub-issues.

**Tasks:**

- [ ] `sub-issues-bridge.service.ts` — on plan commit: each top-level task becomes a Linear
  sub-issue. On checkbox toggle: close/reopen matching sub-issue.
- [ ] `plan.frontmatter.sub_issue_map` keyed by task index.
- [ ] `PlanTab.tsx` — sections: Acceptance Criteria, Approach, Tasks (interactive), Peer Review,
  Execution Log.
- [ ] `PlanEditor.tsx` — Monaco markdown editor, toggled via "Edit".
- [ ] `PlanStorageBadge.tsx` — 📄 / 📝 / 📎 with click-to-switch (subject to big-plan thresholds).
- [ ] "Open in Linear" link when applicable.
- [ ] `BigPlanPromptModal.tsx` per SPEC.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual: toggle a checkbox, confirm Linear sub-issue closes.

---

## Sprint 4 — Settings panels (global Plans + project Plans)

**Status:** ⏳ pending
**Goal:** Both settings panels fully functional.

**Tasks:**

- [ ] `ProjectSettingsDrawer/PlansPanel.tsx` — storage method default, plan directory, inline
  thresholds, "Reset prompts" button.
- [ ] `SettingsDrawer/PlansPanel.tsx` — global storage default + "Reset all prompts".
- [ ] `hooks/usePlan.ts`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck` + manual: change project default → next plan uses it.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

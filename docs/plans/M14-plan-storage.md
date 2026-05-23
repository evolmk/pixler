# M14 — Plan storage (file / inline / attachment + auto)

## Goal

Implement SPEC §5 in full: three plan storage modes (file, inline, attachment) with the "auto" recommender, the big-plan prompt, rolling-pair attachment versioning, frontmatter format, inline markers, and the Plan tab UI that surfaces and edits the active plan.

## Depends on

- M10 (Linear attachment + ticket-comment APIs)
- M13 (orchestrator events to detect plan completion, plan revisions)

## Deliverables

- [ ] `packages/shared-types/src/plans.ts`:
  - `PlanStorageMode = 'file' | 'inline' | 'attachment'`
  - `PlanFrontmatter` matching SPEC §5.5 (ticket, storage, linear_url, branch, workspace, created_by, created_at, status, revision, planner, reviewer, plus attachment-specific `linear_attachment_current` / `linear_attachment_previous`)
  - `Plan` interface — frontmatter + parsed body sections (`acceptance_criteria`, `approach`, `tasks: { text, done }[]`, `peer_review`, `execution_log`)
- [ ] DB migration `0005_plans.sql`: `plans (id PK, workspace_id, revision, storage, file_path?, attachment_current_id?, attachment_previous_id?, body TEXT, frontmatter JSON, created_at)`
- [ ] api `PlansModule`:
  - `PlansService` — load/save the active plan for a workspace, regardless of mode
  - `POST /api/workspaces/:id/plan` body `{ body, storage?, frontmatterPatch? }` — saves a new revision; figures out storage if `auto`
  - `GET /api/workspaces/:id/plan` — current plan
  - `GET /api/workspaces/:id/plan/history` — list of revisions
  - `POST /api/workspaces/:id/plan/revise` — kicks orchestrator back to PLANNING with a "make it smaller" instruction
- [ ] **Auto recommender** (`auto-recommender.service.ts`) — implements the table in SPEC §5.2:
  - Inputs: ticket description length, presence of acceptance criteria, estimate, sub-task count, labels (`pixler:plan-file`, `pixler:plan-inline`), project setting override
  - Output: `{ mode: PlanStorageMode, reason: string }`
- [ ] **Storage writers**:
  - `file-storage.ts` — write to `<repo>/docs/plans/<TICKET>.md` (path configurable per project), commit if workspace is on a branch
  - `inline-storage.ts` — find or create the `<!-- pixler-plan:start revision=N --><!-- pixler-plan:end -->` block in the Linear ticket description; replace within block; never touch text outside
  - `attachment-storage.ts` — uploads via Linear; maintains rolling pair (current + previous); deletes the older one **after** the new one uploads
- [ ] **Big-plan prompt** (SPEC §5.3):
  - On plan write: if mode resolved to `inline` AND body exceeds project thresholds (`> 3 tasks OR > 500 chars approach`), **block** the save and emit `plan.big-plan-prompt` event
  - UI shows the modal exactly as specced (File recommended ⭐, Attach, Cancel & Revise Plan, "Don't ask again" toggle)
  - On "Don't ask again": write the chosen mode to project setting `plans.defaultStorage`
- [ ] **Reset prompts**: per SPEC §5.7 + §10.3 — Project Settings → Plans → "Reset plan prompts" clears `don't-ask-again` flags for that project; Global Settings → Storage → "Reset all prompts" clears across every project
- [ ] **Inline-mode markers** exactly per SPEC §5.6
- [ ] **Attachment versioning** exactly per SPEC §5.4 rolling-pair table; frontmatter tracks both ids
- [ ] **Plan tab UI** in the center pane:
  - Renders the current plan with sections: Acceptance Criteria, Approach, Tasks (interactive checkboxes), Peer Review, Execution Log
  - Read-only by default; "Edit" toggles a Markdown editor (use the same Monaco instance pattern)
  - Storage mode badge in the header (📄 File / 📝 Inline / 📎 Attachment) with click to switch (subject to big-plan thresholds)
  - "Open in Linear" link (when applicable)
- [ ] **Sub-issues bridge** (SPEC §6.5):
  - On plan commit: each top-level task checkbox becomes a Linear sub-issue
  - On a checkbox toggle in the Plan tab: close/reopen the corresponding sub-issue via Linear CLI
  - Map maintained in `plan.frontmatter.sub_issue_map` (`{ taskIndex: linearSubIssueId }`)
- [ ] **Project Settings → Plans panel** filled in: storage method default, plan directory, inline thresholds, "Reset prompts" button

## Acceptance

- A simple ticket (description < 200 chars, no sub-tasks) plans to **inline** without prompting.
- A complex ticket plans to **file** and the file appears in `docs/plans/`.
- A plan that grows past inline thresholds blocks the save and shows the big-plan modal.
- Choosing "Attach" uploads `plan-v1.md` to Linear; a subsequent revision uploads `plan-v2.md` and the first stays as previous; a v3 uploads and deletes v1.
- Toggling a task checkbox in the Plan tab closes the matching Linear sub-issue.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- Live diff between plan and current working tree — Diff tab is M17.
- Conflict resolution between concurrent plan writes — single-writer assumption in v1.

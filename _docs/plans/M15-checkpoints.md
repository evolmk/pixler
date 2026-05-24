# M15 — Checkpoints (snapshot + rollback)

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — runnable after M13.

---

## Goal

Implement SPEC §13: auto-snapshots at key points (before plan execution, before large file-write
batches, before `/resolve-conflicts`, before `/rebase`, manually triggered) so the user can roll
back an off-the-rails agent in one click.

## Depends on

- M13 (orchestrator state — checkpoints are taken at machine-driven moments)

## Acceptance

- A workspace running through the loop accumulates at least one "Before execution" checkpoint.
- Rolling back restores the worktree to the snapshot state (verified with `git status`).
- Rolling back also restores the chat history + plan revision + todo state.
- Manual "Take checkpoint" works and shows up immediately.
- `pnpm -w typecheck` clean.

## Out of scope

- Diffs between two checkpoints — single-click rollback only in v1.
- Cross-workspace checkpoint sharing.

## Files (expected surface)

```
apps/api/src/db/migrations/0006_checkpoints.sql
apps/api/src/checkpoints/checkpoints.module.ts
apps/api/src/checkpoints/checkpoints.service.ts
apps/api/src/checkpoints/checkpoints.controller.ts
apps/api/src/checkpoints/triggers.service.ts
apps/api/src/orchestrator/orchestrator.service.ts   (extend with checkpoint hooks)
packages/shared-types/src/checkpoints.ts
apps/web/src/components/CheckpointsTab.tsx
apps/web/src/components/CheckpointCard.tsx
apps/web/src/components/RollbackConfirmModal.tsx
apps/web/src/hooks/useCheckpoints.ts
```

---

## Sprint 1 — DB + CheckpointsModule + takeSnapshot/rollback

**Status:** ⏳ pending
**Goal:** Service can snapshot a workspace (git stash + chat/plan/todo capture) and roll it back.

**Tasks:**

- [ ] `0006_checkpoints.sql` per SPEC columns.
- [ ] `CheckpointsModule` + `CheckpointsService` + `CheckpointsController`.
- [ ] `takeSnapshot(workspaceId, { label, trigger })` — git stash + chat history snapshot (ok to
  start empty if M16 not done) + plan revision (M14) + todo state + emit `checkpoint.taken`.
- [ ] `rollback(checkpointId)` — restore stash, chat, plan, todo state; emit
  `checkpoint.rolled-back`.
- [ ] `GET /api/workspaces/:id/checkpoints`, `POST /api/workspaces/:id/checkpoints { label? }`,
  `POST /api/checkpoints/:id/rollback`, `DELETE /api/checkpoints/:id`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test checkpoints` + manual: dirty a worktree, snapshot, clean, rollback restores changes.

---

## Sprint 2 — Auto-triggers wired into orchestrator

**Status:** ⏳ pending
**Goal:** Orchestrator takes checkpoints at the right machine-driven moments.

**Tasks:**

- [ ] Before EXECUTING is entered → checkpoint labeled `Before execution`.
- [ ] During execution: watch agent output for batched file writes; > 5 files OR > 200 lines →
  checkpoint labeled `Pre-batch (N files, M lines)` (count Edit/Write tool calls; fall back to
  time-bucketing).
- [ ] On `/resolve-conflicts` or `/rebase` slash commands → labeled accordingly.
- [ ] Hook implementation in `triggers.service.ts`; extend `orchestrator.service.ts` to invoke.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test triggers` + manual loop run.

---

## Sprint 3 — Web UI: Checkpoints tab + cards + rollback modal

**Status:** ⏳ pending
**Goal:** Center pane widens to include Checkpoints tab; users can see history + roll back with
confirmation.

**Tasks:**

- [ ] Extend `CenterTabs` tab strip with **Checkpoints**.
- [ ] `CheckpointsTab.tsx` — reverse-chronological list.
- [ ] `CheckpointCard.tsx` — timestamp · label · files · lines · trigger-kind icon · Rollback btn.
- [ ] `RollbackConfirmModal.tsx` — warns if uncommitted changes; offers checkpoint-first.
- [ ] `hooks/useCheckpoints.ts`.
- [ ] `⌘K` "Checkpoint" + "Take checkpoint" button in the workspace toolbar.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual: trigger rollback, confirm restored state.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

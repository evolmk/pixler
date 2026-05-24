# M15 — Checkpoints (snapshot + rollback)

## Goal

Implement SPEC §13: auto-snapshots at key points (before plan execution, before large file-write batches, before
`/resolve-conflicts`, before
`/rebase`, manually triggered) so the user can roll back an off-the-rails agent in one click.

## Depends on

- M13 (orchestrator state — checkpoints are taken at machine-driven moments)

## Deliverables

- [ ] DB migration `0006_checkpoints.sql`:
  `checkpoints (id PK, workspace_id, label, trigger_kind, git_stash_ref TEXT, files_count INT, lines_count INT, chat_history_snapshot JSON, plan_revision INT, todo_state JSON, created_at)`
- [ ] api `CheckpointsModule`:
    - `CheckpointsService.takeSnapshot(workspaceId, { label, trigger })`:
        1. `git stash push -u -m "<label>"` inside the worktree
        2. Capture chat history (subset of M16 message store, ok to start empty if M16 not done yet)
        3. Capture current plan revision (M14)
        4. Capture todo state (extracted from the plan's tasks)
        5. Persist row
        6. Emit `checkpoint.taken` event
    - `CheckpointsService.rollback(checkpointId)`:
        1. Restore stash (`git stash apply <ref>` then `git stash drop`)
        2. Restore chat history, plan revision, todo state from row
        3. Emit `checkpoint.rolled-back`
    - `GET /api/workspaces/:id/checkpoints`
    - `POST /api/workspaces/:id/checkpoints` body `{ label? }` — manual checkpoint
    - `POST /api/checkpoints/:id/rollback`
    - `DELETE /api/checkpoints/:id`
- [ ] **Auto-triggers** wired into orchestrator (M13):
    - Before `EXECUTING` is entered → checkpoint labeled `Before execution`
    - During execution, watch agent output for batched file writes; on > 5 files or > 200 lines in a single batch → checkpoint labeled
      `Pre-batch (N files, M lines)` (heuristic: ok to start naive — count `Edit`/
      `Write` tool calls if the agent reports them, else fall back to time-based bucketing)
    - On `/resolve-conflicts` or `/rebase` slash commands (M16) → checkpoint labeled accordingly
- [ ] Manual trigger: `⌘K` → "Checkpoint" + "Take checkpoint" button in the workspace toolbar
- [ ] Web UI:
    - **Checkpoints tab
      ** added to the center pane (yes, this widens the tab strip — Chat | Plan | Diff | Checks | PR | Checkpoints)
    - Lists checkpoints reverse-chronologically: timestamp · label · files · lines · "Rollback" button
    - Rollback confirmation modal warns if there are uncommitted changes that would be lost; offers to checkpoint-first
    - Trigger kind shown as an icon (auto vs manual)

## Acceptance

- A workspace running through the loop accumulates at least one "Before execution" checkpoint.
- Rolling back restores the worktree to the snapshot state (verified with `git status`).
- Rolling back also restores the chat history + plan revision + todo state.
- Manual "Take checkpoint" works and shows up immediately.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- Diffs between two checkpoints — single-click rollback only in v1.
- Cross-workspace checkpoint sharing.

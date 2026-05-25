# M08 — Workspaces, worktrees, setup scripts, files-to-copy

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Sprint 3 complete — setup script runner, files-to-copy, archive/rerun-setup endpoints. Sprint 4 next: web UI (dialog, sidebar, context menu, settings panels).

---

## Goal

Implement the workspace lifecycle: SPEC §3 (workspace = ticket + worktree + branch + agent), §8.3
(naming), §10.3 (scripts panel, files-to-copy). End state: user can create a workspace from a
project, Pixler creates a git worktree at the configured path, runs the setup script with
`$PIXLER_*` env vars, copies declared files, and shows the workspace card with live status.

## Depends on

- M05 (settings cascade — workspaces.worktreeBaseDir, scripts)
- M07 (projects — workspaces hang off a project)

## Acceptance

- Creating a workspace produces a real git worktree at the configured path on the configured
  branch.
- Setup script runs with all `$PIXLER_*` vars populated; output streams live into a panel.
- A workspace whose setup fails enters `state: 'error'` and surfaces the stderr in the UI.
- Archiving removes the worktree from disk but the row remains and is visible in the Archived
  view (placeholder, but state transition is real).
- Re-creating a workspace with the same derived name correctly falls back to a color name.
- `pnpm -w typecheck` clean.

## Out of scope

- node-pty / xterm.js terminal mode — M09.
- The actual agent loop running inside the workspace — M13.
- The Run/Open App buttons and run script execution — M19.
- Open-in-IDE — M19.

## Files (expected surface)

```
apps/api/src/db/migrations/0003_workspaces.sql
apps/api/src/workspaces/workspaces.module.ts
apps/api/src/workspaces/workspaces.service.ts
apps/api/src/workspaces/workspaces.controller.ts
apps/api/src/workspaces/worktree.service.ts
apps/api/src/workspaces/setup-runner.service.ts
apps/api/src/workspaces/files-to-copy.service.ts
apps/api/src/workspaces/port-allocator.service.ts
apps/api/src/workspaces/name-generator.service.ts
packages/shared-types/src/workspaces.ts
packages/shared-types/src/color-names.ts
apps/web/src/components/NewWorkspaceDialog.tsx
apps/web/src/components/WorkspaceCard.tsx
apps/web/src/components/WorkspaceContextMenu.tsx
apps/web/src/components/RemoveWorkspaceModal.tsx
apps/web/src/components/ProjectSettingsDrawer/ScriptsPanel.tsx
apps/web/src/components/ProjectSettingsDrawer/FilesToCopyPanel.tsx
apps/web/src/hooks/useWorkspaces.ts
apps/web/src/hooks/useWorkspace.ts
apps/web/src/components/WorkspacesSidebar.tsx   (light up real data)
```

---

## Sprint 1 — DB + WorkspacesModule scaffold (CRUD only)

**Status:** ✅ complete
**Goal:** Migration + module + read/write endpoints exist; rows persist; sidebar pulls live data
(still placeholder cards for now).

**Tasks:**

- [x] `0003_workspaces.sql` per SPEC §3 columns including state enum and mode enum.
- [x] `WorkspacesModule` + `WorkspacesService` + `WorkspacesController` scaffold.
- [x] `GET /api/workspaces?projectId=…`, `GET /api/workspaces/:id`.
- [x] `PATCH /api/workspaces/:id` (rename, pin/unpin).
- [x] `DELETE /api/workspaces/:id` (hard delete + worktree removal).
- [x] `packages/shared-types/src/workspaces.ts` DTOs.

**Files Created/Modified:**

- `apps/api/src/db/migrations/0003_workspaces.sql`
- `apps/api/src/db/database.service.ts`
- `apps/api/src/workspaces/workspaces.module.ts`
- `apps/api/src/workspaces/workspaces.service.ts`
- `apps/api/src/workspaces/workspaces.controller.ts`
- `apps/api/src/app.module.ts`
- `packages/shared-types/src/workspaces.ts`
- `packages/shared-types/src/index.ts`

**Issues Encountered:**

- _none_

**Verify:** `pnpm -w typecheck` — 9/9 tasks pass.

---

## Sprint 2 — Naming, port allocator, worktree creation

**Status:** ✅ complete
**Goal:** `POST /api/workspaces` produces a real git worktree on a properly-named branch with an
allocated port; falls back to color names on collision.

**Tasks:**

- [x] `port-allocator.service.ts` — finds free port starting at 7100.
- [x] `name-generator.service.ts` — ticket-derived names (`<label>-<id>-<slug>`); collision
  detection against open workspaces; round-robin color names from
  `packages/shared-types/src/color-names.ts` pool.
- [x] `worktree.service.ts` via simple-git — `git worktree add <path> -b <branch>`.
- [x] `POST /api/workspaces` body `{ projectId, name?, ticketId?, ticketSource?, mode? }` —
  orchestrates name resolution + port allocation + worktree creation + persistence.

**Files Created/Modified:**

- `apps/api/src/workspaces/port-allocator.service.ts`
- `apps/api/src/workspaces/name-generator.service.ts`
- `apps/api/src/workspaces/worktree.service.ts`
- `apps/api/src/workspaces/workspaces.module.ts` (added providers)
- `apps/api/src/workspaces/workspaces.service.ts` (full create/remove with worktree)
- `apps/api/src/workspaces/workspaces.controller.ts` (POST added)
- `packages/shared-types/src/color-names.ts`
- `packages/shared-types/src/index.ts`
- `apps/api/package.json` (simple-git added)

**Issues Encountered:**

- _none_

**Verify:** `pnpm -w typecheck` — 9/9 tasks pass.

---

## Sprint 3 — Setup script execution + files-to-copy + archive

**Status:** ✅ complete
**Goal:** Workspace creation also copies declared files, runs the setup script with `$PIXLER_*`
env vars, streams output. Archive endpoint runs archive script, removes worktree, keeps row.

**Tasks:**

- [x] `files-to-copy.service.ts` using `fast-glob`; resolves globs from `pixler.json` +
  per-project setting; copies preserving paths.
- [x] `setup-runner.service.ts` — spawn under `bash -lc` (or `cmd /c`), inherit env + add
  `PIXLER_ROOT_PATH/WORKSPACE_PATH/WORKSPACE_NAME/PORT/TICKET_ID/BRANCH`, stream
  `workspace.setup-log` events, set state to `error` on non-zero exit.
- [x] `POST /api/workspaces/:id/archive` — runs archive script if defined, removes worktree,
  keeps row with `archived_at`.
- [x] `POST /api/workspaces/:id/rerun-setup`.

**Files Created/Modified:**

- `apps/api/src/workspaces/files-to-copy.service.ts`
- `apps/api/src/workspaces/setup-runner.service.ts`
- `apps/api/src/workspaces/workspaces.service.ts` (archive, rerunSetup, filesToCopy integration)
- `apps/api/src/workspaces/workspaces.controller.ts` (archive + rerun-setup routes)
- `apps/api/src/workspaces/workspaces.module.ts` (new providers + ProjectsModule import)
- `packages/shared-types/src/events.ts` (workspace.setup-log + workspace.state-changed events)
- `apps/api/package.json` (fast-glob added)

**Issues Encountered:**

- _none_

**Verify:** `pnpm -w typecheck` — 9/9 tasks pass.

---

## Sprint 4 — Web UI: NewWorkspaceDialog, sidebar, settings panels

**Status:** ⏳ pending
**Goal:** All workspace-related UI lights up: dialog with mode picker + ticket field, sidebar
with real cards, context menu, remove modal, Scripts and Files-to-copy panels in Project Settings.

**Tasks:**

- [ ] `NewWorkspaceDialog.tsx` — Chat/Terminal segmented control, optional ticket id, optional
  custom name, live branch + worktree path preview, "Create" runs API + shows setup log live.
- [ ] `WorkspacesSidebar.tsx` lit up: color dot, state badge, 3-dot overflow with all actions.
- [ ] `WorkspaceContextMenu.tsx` items: Rename / Pin / Archive / Remove / Open in IDE (stub) /
  Open app (stub) / Re-run setup.
- [ ] `RemoveWorkspaceModal.tsx` with "Silence remove confirmations for 1 minute" checkbox.
- [ ] `ProjectSettingsDrawer/ScriptsPanel.tsx` — Monaco editors for setup/run/archive,
  `$PIXLER_*` reference panel with click-to-copy.
- [ ] `ProjectSettingsDrawer/FilesToCopyPanel.tsx` — list of paths/globs with add/remove.
- [ ] `hooks/useWorkspaces.ts` and `useWorkspace.ts`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual flow.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

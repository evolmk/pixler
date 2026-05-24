# M08 — Workspaces, worktrees, setup scripts, files-to-copy

## Goal

Implement the workspace lifecycle: SPEC §3 (workspace = ticket + worktree + branch + agent), §8.3 (naming), §10.3 (scripts panel, files-to-copy). End state: user can create a workspace from a project, Pixler creates a git worktree at the configured path, runs the setup script with
`$PIXLER_*` env vars, copies declared files, and shows the workspace card with live status.

## Depends on

- M05 (settings cascade — workspaces.worktreeBaseDir, scripts)
- M07 (projects — workspaces hang off a project)

## Deliverables

- [ ] DB migration `0003_workspaces.sql`: `workspaces` table — `id`, `project_id`, `name`, `color_name`, `branch`,
  `worktree_path`, `state` (enum:
  `idle|planning|reviewing|awaiting_approval|executing|validating|pr_open|done|archived|error`), `ticket_id`,
  `ticket_source` (`linear|github|none`), `mode` (`chat|terminal`), `port`, `created_at`, `archived_at`, `pinned`
- [ ] `apps/api/src/workspaces/`:
    - `WorkspacesModule`, `WorkspacesService`, `WorkspacesController`
    - `POST /api/workspaces` body `{ projectId, name?, ticketId?, ticketSource?, mode? }` — orchestrates create flow:
        1. Resolve workspace name (see naming below)
        2. Allocate a port via `WorkspacesService.allocatePort()` (find free starting at 7100)
        3. Run `git worktree add <worktreePath> -b <branch>` via simple-git
        4. Copy declared `filesToCopy` (resolved from `pixler.json` + per-project setting)
        5. Run the setup script with env vars (`$PIXLER_ROOT_PATH`, `$PIXLER_WORKSPACE_PATH`, `$PIXLER_WORKSPACE_NAME`,
           `$PIXLER_PORT`, `$PIXLER_TICKET_ID`, `$PIXLER_BRANCH`)
        6. Stream setup output as `workspace.setup-log` events
        7. Persist the workspace row in `state: 'idle'`
    - `GET /api/workspaces?projectId=…`
    - `GET /api/workspaces/:id`
    - `PATCH /api/workspaces/:id` (rename, pin/unpin)
    - `POST /api/workspaces/:id/archive` — runs archive script if defined, removes worktree, keeps row with
      `archived_at`
    - `DELETE /api/workspaces/:id` — hard delete + worktree removal
    - `POST /api/workspaces/:id/rerun-setup` — re-runs the setup script in place
- [ ] **Naming logic** (SPEC §8.3):
    - From a ticket: `<label-short>-<id>-<3-word-slug>` (e.g. `bug-eng-101-fix-auth-redirect`)
    - Collision with another **open** workspace: fall back to a color name
    - From scratch: round-robin a color from the pool of ~50 alphabetical color names (declare the pool in
      `packages/shared-types/src/color-names.ts`)
    - Persist `color_name` so the sidebar tint stays consistent even after renames
    - Branch defaults to `pixler/<workspace-name>` unless project setting overrides
- [ ] **Files-to-copy** declarative resolver: globs supported via
  `fast-glob`, resolved relative to project root, copied to worktree preserving paths
- [ ] **Setup script execution**: spawn under `bash -lc` (or `cmd /c` on Windows), inherit env + add
  `$PIXLER_*`, capture stdout/stderr, set workspace state to `error` if exit code non-zero
- [ ] Web UI:
    - **New Workspace dialog** (opened from `+ Workspace` button or project page):
        - Mode picker: Chat (default) | Terminal — segmented control
        - Optional: paste/select Linear ticket id (full Linear integration is M10; here just accept a string)
        - Optional: custom name (else auto-generated)
        - Live preview of branch name + worktree path
        - "Create" runs the API + shows setup log live → on success closes and routes to `/p/:projectId/w/:workspaceId`
    - **Workspaces sidebar** lit up with real data: color dot from
      `color_name`, state badge, 3-dot overflow with Rename / Pin / Archive / Remove / Open in IDE (stub) / Open app (stub) / Re-run setup
    - **Remove modal
      ** with "Silence remove confirmations for 1 minute" checkbox (resets on app close) per SPEC §10.4 + §10.6
    - **Project Settings → Scripts panel
      ** filled in: editors for setup/run/archive (use a small Monaco instance, syntax highlighted as bash),
      `$PIXLER_*` variable reference panel with click-to-copy
    - **Project Settings → Files to copy** panel: list of paths/globs with add/remove

## Acceptance

- Creating a workspace produces a real git worktree at the configured path on the configured branch.
- Setup script runs with all `$PIXLER_*` vars populated; output streams live into a panel.
- A workspace whose setup fails enters `state: 'error'` and surfaces the stderr in the UI.
- Archiving removes the worktree from disk but the row remains and is visible in the Archived view (placeholder, but state transition is real).
- Re-creating a workspace with the same derived name correctly falls back to a color name.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- node-pty / xterm.js terminal mode — M09.
- The actual agent loop running inside the workspace — M13.
- The Run/Open App buttons and run script execution — M19.
- Open-in-IDE — M19.

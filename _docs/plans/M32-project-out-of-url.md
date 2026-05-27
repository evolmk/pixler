# M32 — Project out of URL (localStorage-backed current project)

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-26
**Current Status:** Plan written, ready to execute.

---

## Goal

Drop `projectId` from the URL entirely. The "current project" becomes UI state
persisted to `localStorage` (`pixler.currentProjectId`). The router collapses
from three routes to two: `/` (project shell with no workspace open) and
`/w/$workspaceId` (project shell with a workspace open). When a workspace
URL is loaded directly, its `projectId` is resolved server-side from the
workspace record and pushed into the store, so the shell always knows which
project is active without needing it in the URL.

Old `/p/$projectId/...` URLs break — this is pre-release, no shared links
exist yet.

## Depends on

- M07 (projects) — projects table + `useProjects` hook
- M08 (workspaces) — workspaces table + `GET /workspaces/:id`

## Acceptance

- `localStorage.getItem('pixler.currentProjectId')` updates as the user
  switches projects in `TopBar`. No navigation fires on switch.
- Loading `/` with a stored projectId renders the project shell for that
  project. Loading `/` with no stored projectId (or stored id that no longer
  exists) shows the project picker / onboarding (existing `HomeRoute`
  behavior).
- Opening a workspace navigates to `/w/$workspaceId`. Reloading that URL
  restores the same project + workspace (project resolved from the workspace
  record at load time).
- Opening a workspace whose project ≠ current store value silently updates
  the store to the workspace's project.
- The string `/p/$projectId` no longer appears in any `<Link>` or
  `navigate(...)` call in `apps/web/src/`.
- `pnpm -w typecheck` and `pnpm -w lint` clean.
- Manual browser walkthrough in `lazar-ui`: switch projects → URL stays `/`;
  open workspace → URL becomes `/w/<id>`; reload → same view restored;
  hard-load `/w/<id>` of a different project → store updates, correct
  project + workspace shown.

## Out of scope

- Multi-project tabs / multi-window project context.
- URL-based project sharing or slug-based project URLs (slugs were
  considered and rejected for M32).
- Migrating old `/p/$id/...` URLs — they're allowed to break.
- Changing the workspace API surface beyond what's already shipped
  (`GET /workspaces/:id` already returns `project_id`).
- Persisting the *last open workspace per project* — that's a separate
  feature; M32 only persists the last-open project.

## Files (expected surface)

```
apps/web/src/router.tsx                                  # drop projectRoute; workspaceRoute → /w/$workspaceId; / → ProjectShellOrHome
apps/web/src/stores/currentProject.ts                    # new — Zustand store w/ localStorage persistence
apps/web/src/hooks/useCurrentProject.ts                  # new — wraps store + workspace→project resolution
apps/web/src/routes/index.tsx                            # rewrite — if stored project, render ProjectShell; else show picker
apps/web/src/routes/project.tsx                          # rename to shell.tsx OR keep filename; remove useParams projectId
apps/web/src/hooks/useDeepLink.ts                        # rewrite project/workspace open handlers
apps/web/src/hooks/usePaletteActions.ts                  # read projectId from store, not params
apps/web/src/components/TopBar.tsx                       # project switcher writes to store, no navigate
apps/web/src/components/WorkspacesSidebar.tsx            # read projectId from store
apps/web/src/components/ActivityTab.tsx                  # read projectId from store
apps/web/src/components/CommandPalette.tsx               # read projectId from store
apps/web/src/components/NewWorkspaceDialog.tsx           # read projectId from store
apps/web/src/components/NewProjectDialog.tsx             # on created, set store (no navigate)
apps/web/src/components/GuidedNewWorkspaceDialog.tsx     # read projectId from store
apps/web/src/components/CloneProgress.tsx                # read projectId from store
apps/web/src/components/LinearProjectPicker.tsx          # read projectId from store
apps/web/src/components/LinearIssuePicker.tsx            # read projectId from store
apps/web/src/components/CreateLinearIssueDialog.tsx      # read projectId from store
apps/web/src/components/LinearTicketList.tsx             # read projectId from store
apps/web/src/components/ActivityFeed.tsx                 # read projectId from store
apps/web/src/components/TeamConfigDiffModal.tsx          # read projectId from store
apps/web/src/components/ProjectSettingsDrawer/GeneralPanel.tsx     # read projectId from store
apps/web/src/components/ProjectSettingsDrawer/IntegrationsPanel.tsx # read projectId from store
apps/web/src/components/ProjectSettingsDrawer/PlansPanel.tsx       # read projectId from store
```

**Not touched:**
- `apps/api/*` — no API changes needed; `GET /workspaces/:id` already returns `project_id`.
- All `use*` query hooks that take `projectId` as an arg — only their *call sites* change.

---

## Sprint 1 — Store + router collapse

**Status:** ✅ done
**Goal:** Stand up `currentProjectStore` with localStorage persistence and
flip the router to the new two-route shape. Components still reading
`projectId` from the old `useParams` path type-error; Sprint 2 fixes them.

**Tasks:**

- [x] New `apps/web/src/stores/currentProject.ts`: Zustand store with
      `{ projectId, setProjectId }`. Persists to `localStorage` directly
      (matches `stores/theme.ts` pattern — repo doesn't use Zustand
      `persist` middleware anywhere else).
- [x] New `apps/web/src/hooks/useCurrentProject.ts`: returns `{ projectId,
      setProjectId }`; on `useProjects` success, clears stale stored id.
- [x] Added `useWorkspace(id)` + `fetchWorkspace` to
      `apps/web/src/hooks/useWorkspaces.ts` — needed for the workspace
      route's project resolution.
- [x] Rewrote `router.tsx`: dropped `projectRoute`; `/` → `RootRoute`
      (picker-or-shell switcher); `/w/$workspaceId` → new `WorkspaceRoute`.
- [x] New `apps/web/src/routes/workspace.tsx`: resolves
      `workspace.project_id`, syncs into store, renders `ProjectShell`.
      Handles loading + workspace-not-found states.
- [x] `routes/index.tsx` rewritten as `RootRoute`: shows picker if no
      projects, auto-selects first project to the store if none stored,
      renders `ProjectShell` once a project is set.
- [x] `routes/project.tsx`: updated JSDoc to reflect new routes.

**Files Created/Modified:**

- `apps/web/src/stores/currentProject.ts` (new)
- `apps/web/src/hooks/useCurrentProject.ts` (new)
- `apps/web/src/hooks/useWorkspaces.ts` (added `useWorkspace`)
- `apps/web/src/router.tsx` (rewrote routes)
- `apps/web/src/routes/index.tsx` (rewrote as `RootRoute`)
- `apps/web/src/routes/workspace.tsx` (new)
- `apps/web/src/routes/project.tsx` (JSDoc only)

**Issues Encountered:**

- Repo doesn't use Zustand `persist` middleware — switched to plain
  localStorage to match `stores/theme.ts` convention.
- No `useWorkspace(id)` hook existed; added one alongside `useWorkspaces`.

**Verify:** `pnpm --filter @pixler/web typecheck` — expect compile errors in
the call-site components fixed in Sprint 2. The router itself should compile.
Browser sanity: load `/`, see either picker or shell depending on stored
value (set `localStorage.setItem('pixler.currentProjectId', '<real-id>')`
manually to test both paths).

---

## Sprint 2 — Migrate all call sites off `useParams({ projectId })`

**Status:** ⏳ pending
**Goal:** Every component that today reads `projectId` from URL params reads
from `useCurrentProject()` instead. Every `navigate({ to: '/p/$projectId' })`
call switches to `setProjectId(id)` (no navigation) or
`navigate({ to: '/w/$workspaceId' })` for workspace opens. The `apps/web/`
tree contains zero references to `/p/$projectId`.

**Tasks:**

- [ ] `TopBar.tsx`: `params.projectId` → `useCurrentProject().projectId`.
      The "switch to project P" click handler calls `setProjectId(p.id)`
      and `navigate({ to: '/' })` if currently on a workspace route (so the
      URL doesn't keep showing the previous project's workspace). Project
      switcher's `data-active` reads from the store.
- [ ] `WorkspacesSidebar.tsx`: same swap. Clicking a workspace navigates to
      `/w/$workspaceId`.
- [ ] `usePaletteActions.ts`: `projectId` source becomes the store.
      `actions.openWorkspace(id)` navigates to `/w/$id`.
- [ ] `useDeepLink.ts`: rewrite `pixler://workspace/<id>` → navigate to
      `/w/<id>` (no fake `projectId: '_'` hack). `pixler://project/<id>`
      → `setProjectId(id)` + `navigate({ to: '/' })`.
- [ ] Bulk migrate the remaining components — each has the same one-line
      change (`useParams` → `useCurrentProject`):
      `ActivityTab`, `CommandPalette`, `NewWorkspaceDialog`,
      `GuidedNewWorkspaceDialog`, `CloneProgress`, `LinearProjectPicker`,
      `LinearIssuePicker`, `CreateLinearIssueDialog`, `LinearTicketList`,
      `ActivityFeed`, `TeamConfigDiffModal`, `ProjectSettingsDrawer/*`.
- [ ] `NewProjectDialog.tsx`: after a project is created, call
      `setProjectId(id)` instead of `navigate({ to: '/p/$projectId', ... })`.
- [ ] `routes/index.tsx`: becomes the picker/shell-switcher wrapper from
      Sprint 1's plan. The "auto-select first project on mount" effect
      changes to call `setProjectId(projects[0].id)` instead of navigating.
- [ ] Final grep: `grep -rn "/p/\$projectId" apps/web/src` returns zero
      hits. `grep -rn "useParams" apps/web/src` should only return hits
      for `workspaceId`, not `projectId`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm -w lint`. Browser walkthrough:
1. Hard-load `/` with a stored project → shell renders, URL stays `/`.
2. Switch projects in TopBar → URL stays `/`, sidebar updates.
3. Open a workspace → URL becomes `/w/<id>`.
4. Reload `/w/<id>` → same project + workspace restored.
5. Set `localStorage` to a different project's id manually, hard-load
   `/w/<id>` of the workspace's project → store updates to the workspace's
   project (the silent update path).
6. Clear localStorage, reload `/` → project picker renders.

---

## Sprint 3 — Shell handles workspace→project resolution + edge cases

**Status:** ⏳ pending
**Goal:** Hard-loading `/w/<id>` for any workspace works without the project
being pre-set in the store. The shell silently updates the store when the
loaded workspace's `project_id` differs from the current value.

**Tasks:**

- [ ] In `ProjectShell` (or a small `useWorkspaceProjectSync` hook called
      from it), when rendered under the `/w/$workspaceId` route: call
      `useWorkspace(workspaceId)`, and once data lands, if
      `data.project_id !== currentProjectId`, call `setProjectId(data.project_id)`.
      Loading state (workspace fetch in flight) renders a minimal spinner;
      do **not** flash the project picker.
- [ ] Handle the "workspace not found" case (404 from
      `GET /workspaces/:id`): render a small "Workspace not found —
      [back to project] / [home]" view. Don't auto-redirect.
- [ ] Edge case: stored `projectId` references a project that was deleted.
      `useCurrentProject` already clears stale ids once `useProjects` loads
      (Sprint 1 task) — verify the picker shows correctly after clearing.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** Browser:
1. Clear localStorage, hard-load `/w/<id>` of an existing workspace →
   shell loads with that workspace open, store now holds that workspace's
   project id (DevTools → Application → Local Storage).
2. Hard-load `/w/garbage-id` → "Workspace not found" view, with a button
   back to `/`.
3. Set `localStorage.pixler.currentProjectId` to a non-existent id,
   reload `/` → project picker renders, localStorage cleared.

---

## Prompt that created this plan

```
i dont want to have the current project url in webapp, can we use a local
storage in browser (app) instead. but when we open a workspace i want the
url there
```

Decisions from interview:
- Workspace URL: `/w/$workspaceId` (projectId derived server-side)
- Empty / first-run on `/`: existing project picker / onboarding
- Old `/p/$projectId/...` URLs: just break (pre-release, no shared links)

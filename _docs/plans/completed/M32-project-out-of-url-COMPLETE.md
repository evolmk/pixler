# M32 — Project out of URL (localStorage-backed current project)

**Status:** ✅ COMPLETE
**Modified:** 2026-05-26
**Current Status:** All sprints complete. Router collapsed to `/` + `/w/$id`; current project lives in localStorage via Zustand; workspace route resolves project server-side; browser-verified.

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

**Status:** ✅ done
**Goal:** Every component that today reads `projectId` from URL params reads
from `useCurrentProject()` instead. Every `navigate({ to: '/p/$projectId' })`
call switches to `setProjectId(id)` (no navigation) or
`navigate({ to: '/w/$workspaceId' })` for workspace opens. The `apps/web/`
tree contains zero references to `/p/$projectId`.

**Tasks:**

- [x] `TopBar.tsx`: switched to `useCurrentProject()`; project switcher
      calls `setProjectId(p.id)` and bounces to `/` if currently on a `/w/`
      route. `data-active` reads from store. `onProjectAdded` writes store.
- [x] `WorkspacesSidebar.tsx`: switched to `useCurrentProject()`.
      Note: `WorkspaceCard` has no click-to-open handler today
      (selection is via palette/deep link/context menu) — pre-existing,
      unchanged by M32.
- [x] `usePaletteActions.ts`: `projectId` from store.
- [x] `useDeepLink.ts`: rewrote to `/w/<id>` for workspace; for project,
      `setProjectId(event.id)` + navigate to `/`.
- [x] `CommandPalette.tsx`, `ActivityTab.tsx`, `ActivityFeed.tsx` (prop
      removed — was only used for navigate), `ProjectSettingsDrawer/{General,Integrations,Plans}Panel.tsx`:
      all switched to `useCurrentProject()` (or just dropped `useParams`
      where the prop was unused).
- [x] Container/leaf components that take `projectId` as a prop
      (`NewWorkspaceDialog`, `GuidedNewWorkspaceDialog`, `CloneProgress`,
      `LinearProjectPicker`, `LinearIssuePicker`, `CreateLinearIssueDialog`,
      `LinearTicketList`, `TeamConfigDiffModal`) need no change — their
      callers pass the right value.
- [x] `NewProjectDialog` callers in `TopBar` + `routes/index.tsx` write to
      store on add.
- [x] `routes/index.tsx`: auto-selects first project to store, renders
      picker only when no projects exist.
- [x] Final grep clean: zero `/p/\$projectId` references; `useParams`
      remaining hits are all for `workspaceId`.

**Files Created/Modified:**

- `apps/web/src/components/TopBar.tsx`
- `apps/web/src/components/WorkspacesSidebar.tsx`
- `apps/web/src/components/CommandPalette.tsx`
- `apps/web/src/components/ActivityTab.tsx`
- `apps/web/src/components/ActivityFeed.tsx`
- `apps/web/src/components/ProjectSettingsDrawer/GeneralPanel.tsx`
- `apps/web/src/components/ProjectSettingsDrawer/IntegrationsPanel.tsx`
- `apps/web/src/components/ProjectSettingsDrawer/PlansPanel.tsx`
- `apps/web/src/hooks/usePaletteActions.ts`
- `apps/web/src/hooks/useDeepLink.ts`
- `apps/web/src/hooks/useCurrentProject.ts` (mapped null→undefined for ergonomics)

**Issues Encountered:**

- `useCurrentProject` originally returned `string | null`; many call sites
  pass `projectId` to hooks typed as `string | undefined`. Mapped null→
  undefined in the hook return so callers don't need conversion.
- `ActivityFeed`'s `projectId` prop was used only for the (now removed)
  navigate to `/p/$projectId/w/...`. Removed the prop; updated caller.

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

**Status:** ✅ done
**Goal:** Hard-loading `/w/<id>` for any workspace works without the project
being pre-set in the store. The shell silently updates the store when the
loaded workspace's `project_id` differs from the current value.

**Tasks:**

- [x] Project-resolution + 404 handling implemented in `routes/workspace.tsx`
      during Sprint 1 (was a build prerequisite). Loading shows
      "Loading workspace…"; 404 shows "Workspace not found" with a
      "Back to home" button.
- [x] Browser-verified: clearing `localStorage.pixler.currentProjectId` and
      hard-loading `/w/<id>` restores the project from the workspace's
      `project_id`. The `/w/garbage-id` URL shows the not-found view; clicking
      "Back to home" returns to `/`.
- [x] Stale stored-id cleanup verified in `useCurrentProject`.

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

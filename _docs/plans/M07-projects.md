# M07 — Project management (add local, clone from GitHub, `pixler.json`)

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — runnable after M05 + M06.

---

## Goal

Implement the New Project flow (SPEC §7.2 + §10.7 + §11.1 step 4): pick an existing local git repo
or clone one via `gh`, persist projects in SQLite, read/write `pixler.json` for team workflow
config, surface project icons and basic project settings.

## Depends on

- M05 (SQLite + settings cascade)
- M06 (app shell — drawers, project switcher)

## Acceptance

- Add an existing local repo by path; it appears in the switcher and the URL routes to `/p/:id`.
- Clone a public GitHub repo; progress streams; on completion, the repo lives at
  `~/pixler/repos/<name>/` and Pixler treats it as a project.
- Editing `pixler.json` on disk re-reads it on next project open; the team-config diff modal
  appears when there's a delta.
- "Remove project" leaves the repo on disk; "Delete project" deletes it (with the proper typed
  confirmation per SPEC §10.6).
- `pnpm -w typecheck` clean.

## Out of scope

- The other Project Settings categories (Scripts, Files-to-copy, Integrations, etc.) — owned by
  M08 (scripts), M10 (Linear), M14 (plans), etc.
- Workspace creation (M08).
- `gh auth` flow / setup (M12 handles GitHub integration depth).

## Files (expected surface)

```
apps/api/src/db/migrations/0002_projects.sql
apps/api/src/projects/projects.module.ts
apps/api/src/projects/projects.service.ts
apps/api/src/projects/projects.controller.ts
apps/api/src/projects/pixler-json.service.ts
apps/api/src/projects/clone.service.ts
packages/shared-types/src/projects.ts
packages/shared-types/src/pixler-json.ts
apps/web/src/components/NewProjectDialog.tsx
apps/web/src/components/CloneProgress.tsx
apps/web/src/components/TeamConfigDiffModal.tsx
apps/web/src/components/ProjectSettingsDrawer/GeneralPanel.tsx
apps/web/src/hooks/useProjects.ts
apps/web/src/hooks/useProject.ts
apps/web/src/components/TopBar.tsx   (light up the switcher)
```

---

## Sprint 1 — DB + ProjectsModule scaffold (local-add path)

**Status:** ⏳ pending
**Goal:** Persist projects to SQLite via `0002_projects.sql`; add/list/get/patch/delete endpoints
work end-to-end for the local-add path.

**Tasks:**

- [ ] `apps/api/src/db/migrations/0002_projects.sql` with columns: `id`, `name`, `path`,
  `default_branch`, `package_manager`, `icon_path`, `cloned_by_pixler`, `created_at`.
- [ ] `ProjectsModule` + `ProjectsService` + `ProjectsController`.
- [ ] `POST /api/projects/add-local` — verify git repo, detect default branch + package manager,
  persist, return row.
- [ ] `GET /api/projects` and `GET /api/projects/:id` (resolved settings).
- [ ] `PATCH /api/projects/:id` — rename, change icon.
- [ ] `DELETE /api/projects/:id?mode=remove|delete` — both modes implemented.
- [ ] Icon auto-detect: `icon.png` → `logo.svg` → `favicon.ico`; manual upload writes to
  `<project>/.pixler/icon.png`.
- [ ] `packages/shared-types/src/projects.ts` DTOs.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/api test projects` — manually POST a local repo path and round-trip via GET.

---

## Sprint 2 — Clone flow via gh with Socket.io progress

**Status:** ⏳ pending
**Goal:** `POST /api/projects/clone` shells out to `gh repo clone`, streams progress over
Socket.io, and persists the project on completion.

**Tasks:**

- [ ] `clone.service.ts` — spawns `gh repo clone`, parses progress lines, emits
  `project.clone-progress` events `{ pct, line }`.
- [ ] Clone destination defaults to `~/pixler/repos/<name>/`.
- [ ] On completion, persist project row with `cloned_by_pixler = true`.
- [ ] Handle gh-not-installed / not-authed errors with structured response.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test clone` + manual: clone a small public repo, see live progress events.

---

## Sprint 3 — `pixler.json` schema, reader, writer + diff event

**Status:** ⏳ pending
**Goal:** Read/write the project's `pixler.json`; on add, if the file exists and differs from
defaults, emit `project.team-config-diff` for the UI.

**Tasks:**

- [ ] `packages/shared-types/src/pixler-json.ts` — schema matching SPEC §10.7 (version, scripts,
  filesToCopy, plans, git, linear, models).
- [ ] `pixler-json.service.ts`: `loadPixlerJson(projectPath)` and `savePixlerJson(projectPath, patch)`
  (pretty-printed, 2-space).
- [ ] On project add: detect `pixler.json`, compute diff against defaults, emit
  `project.team-config-diff` event with the workflow-keys-only diff.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test pixler-json` — round-trip read/write, diff event payload shape correct.

---

## Sprint 4 — Web UI: New Project dialog, switcher, settings General panel

**Status:** ⏳ pending
**Goal:** All project-related UI lights up: New Project dialog, clone progress, team-config diff
modal, switcher fed by live data, Project Settings → General fully functional.

**Tasks:**

- [ ] `NewProjectDialog.tsx` — two tiles "Open local folder" / "Clone from GitHub"; local uses
  native picker + backend validate.
- [ ] `CloneProgress.tsx` — live log streamed from Socket.io.
- [ ] `TeamConfigDiffModal.tsx` — 2-column diff with cherry-pick checkboxes.
- [ ] `TopBar.tsx` — wire project switcher to `useProjects()` (replaces M06's stub).
- [ ] `ProjectSettingsDrawer/GeneralPanel.tsx` — display name, icon, description, "Reset to defaults".
- [ ] Empty-state CTA on `/` becomes live.
- [ ] `hooks/useProjects.ts` and `hooks/useProject.ts` — TanStack Query.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual smoke through every acceptance criterion.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

# M07 — Project management (add local, clone from GitHub, `pixler.json`)

## Goal

Implement the New Project flow (SPEC §7.2 + §10.7 + §11.1 step 4): pick an existing local git repo or clone one via `gh`, persist projects in SQLite, read/write `pixler.json` for team workflow config, surface project icons and basic project settings.

## Depends on

- M05 (SQLite + settings cascade)
- M06 (app shell — drawers, project switcher)

## Deliverables

- [ ] DB migration `0002_projects.sql`: `projects` table columns — `id`, `name`, `path`, `default_branch`, `package_manager`, `icon_path`, `cloned_by_pixler` (bool), `created_at`
- [ ] api `ProjectsModule`:
  - `POST /api/projects/add-local` body `{ path }` — verify it's a git repo, detect default branch + package manager, persist, return the project
  - `POST /api/projects/clone` body `{ url, name?, dest? }` — shells out to `gh repo clone`, streams progress over Socket.io (`project.clone-progress` events with `{ pct, line }`), persists on completion; clone destination defaults to `~/pixler/repos/<name>/`
  - `GET /api/projects` — list
  - `GET /api/projects/:id` — single project with resolved settings
  - `PATCH /api/projects/:id` — rename, change icon
  - `DELETE /api/projects/:id?mode=remove|delete` — `remove` keeps the repo on disk, `delete` rms worktrees + (if Pixler cloned it) the repo itself
- [ ] `pixler.json` schema (TypeScript type in `@pixler/shared-types`):
  ```
  {
    "$schema"?: "https://pixler.dev/schemas/config.json",
    "version": 1,
    "name"?: string,
    "scripts": { "setup"?: string, "run"?: string, "archive"?: string },
    "filesToCopy"?: string[],
    "plans": { "defaultStorage"?: "file"|"inline"|"attachment"|"auto", "dir"?: string },
    "git": { "branchTemplate"?: string, "baseBranch"?: string, "mergeStrategy"?: string },
    "linear"?: { "team"?: string, "project"?: string, "stateMap"?: Record<string,string>, "labelFilters"?: string[] },
    "models"?: { "planner"?: string, "reviewer"?: string, "executor"?: string }
  }
  ```
  - Reader: `loadPixlerJson(projectPath)` returns parsed config or `null`
  - Writer: `savePixlerJson(projectPath, patch)` merges + writes (pretty-printed, 2-space)
  - When a project is added and `pixler.json` exists: emit `project.team-config-diff` event and present a UI diff (see below)
- [ ] Icon auto-detect (SPEC §10.3 General): try `icon.png` → `logo.svg` → `favicon.ico` in repo root; store the resolved path in `projects.icon_path`. Manual upload writes to `<project>/.pixler/icon.png`.
- [ ] Web UI:
  - **New Project dialog**: two big tiles "Open local folder" / "Clone from GitHub"; local uses the native file picker via `<input type="file" webkitdirectory>` plus a backend resolve, or surfaces a path input — backend validates
  - Clone: paste URL → progress UI with live log lines streamed via Socket.io
  - **Team config diff modal**: after add, if `pixler.json` exists, show a 2-column diff of file vs current settings with cherry-pick checkboxes (only **workflow** keys — personal settings excluded per SPEC §10.7)
  - **Project switcher** in the top bar lights up with the real list, icon + name; selecting one navigates to `/p/:projectId`
  - **Project Settings drawer** category **General** filled in (display name, icon, description, "Reset to defaults"); other categories remain stubs
- [ ] Empty-state CTA on `/` becomes live — opens the New Project dialog

## Acceptance

- Add an existing local repo by path; it appears in the switcher and the URL routes to `/p/:id`.
- Clone a public GitHub repo; progress streams; on completion, the repo lives at `~/pixler/repos/<name>/` and Pixler treats it as a project.
- Editing `pixler.json` on disk re-reads it on next project open; the team-config diff modal appears when there's a delta.
- "Remove project" leaves the repo on disk; "Delete project" deletes it (with the proper typed confirmation per SPEC §10.6).
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- The other Project Settings categories (Scripts, Files-to-copy, Integrations, etc.) — owned by M08 (scripts), M10 (Linear), M14 (plans), etc.
- Workspace creation (M08).
- `gh auth` flow / setup (M12 handles GitHub integration depth).

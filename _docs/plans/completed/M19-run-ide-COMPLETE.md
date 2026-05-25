# M19 — Run / Open App + External IDE launcher

**Status:** ✅ COMPLETE
**Modified:** 2026-05-25
**Current Status:** All sprints complete — RunModule, IDEModule, RunButton/OpenAppButton/OpenInIdeMenu in TopBar, ⌘+E shortcut, RunLogsTab, ExternalToolsPanel.

---

## Goal

Implement SPEC §8.11 (Run button + Open App) and §8.12 (external IDE launcher). End state: each
workspace can spin up its dev environment via the project's run script using `$PIXLER_PORT`,
surface live logs, expose an Open App button that opens the running app in the browser, and
launch the worktree in the user's IDE of choice.

## Depends on

- M07 (project — run script lives in `pixler.json`)
- M08 (workspace — $PIXLER_PORT allocated)

## Acceptance

- A workspace whose project has a `pnpm dev` run script starts, detects ready, exposes Open App;
  clicking opens the browser to the right port.
- Running 3 workspaces in parallel uses 3 different ports, no collisions, no clobbering.
- Stopping the run kills the process cleanly (no orphan listeners on the port).
- `⌘+E` opens the worktree in VS Code (or whichever is set).
- Settings → External Tools shows all detected IDEs with versions.
- `pnpm -w typecheck` clean.

## Out of scope

- `pixler://` URL-scheme registration — M24.
- Multi-process / Procfile-style run definitions — single script in v1.

## Files (expected surface)

```
apps/api/src/run/run.module.ts
apps/api/src/run/run.service.ts
apps/api/src/run/run.controller.ts
apps/api/src/run/ready-detector.service.ts
apps/api/src/ide/ide.module.ts
apps/api/src/ide/ide.service.ts
apps/api/src/ide/ide.controller.ts
packages/shared-types/src/run.ts
packages/shared-types/src/ide.ts
apps/web/src/components/RunButton.tsx
apps/web/src/components/OpenAppButton.tsx
apps/web/src/components/RunLogsTab.tsx
apps/web/src/components/OpenInIdeMenu.tsx
apps/web/src/components/SettingsDrawer/ExternalToolsPanel.tsx
apps/web/src/hooks/useRun.ts
apps/web/src/hooks/useIDEs.ts
```

---

## Sprint 1 — RunModule + dev process manager + ready detection

**Status:** [x] complete
**Goal:** Server manages per-workspace dev processes, streams logs, and detects readiness.

**Tasks:**

- [x] `RunModule` + `RunService` + `RunController`.
- [x] `POST /api/workspaces/:id/run` — spawn run script with `$PIXLER_*` env; stream `run.log`
  events; track state.
- [x] `POST /api/workspaces/:id/run/stop` — SIGTERM, escalate to SIGKILL after timeout.
- [x] `GET /api/workspaces/:id/run` — state + log buffer (last N lines).
- [x] `ready-detector.service.ts` — configurable regex per project (default
  `(ready|listening|started).*on.*(:?\d+)`) OR port-open check on `$PIXLER_PORT`. Emit
  `run.ready` once detected.
- [x] `packages/shared-types/src/run.ts` DTOs.

**Files Created/Modified:**

- `apps/api/src/run/run.module.ts` — created
- `apps/api/src/run/run.service.ts` — created
- `apps/api/src/run/run.controller.ts` — created
- `apps/api/src/run/ready-detector.service.ts` — created
- `packages/shared-types/src/run.ts` — created
- `apps/api/src/app.module.ts` — RunModule + IdeModule imported

**Issues Encountered:**

- _none_

**Verify:** `pnpm --filter @pixler/api test run` + manual: spawn a known dev server, observe `run.ready`.

---

## Sprint 2 — IDE detection + open-in-IDE endpoint

**Status:** [x] complete
**Goal:** Server detects installed IDEs at boot and can launch any of them with a workspace's
worktree path.

**Tasks:**

- [x] `IDEModule` + `IDEService` + `IDEController`.
- [x] `IDEService.detect()` probes: `code`, `cursor`, `windsurf`, `webstorm`, `zed`, `subl`,
  `vim`/`nvim`; caches results.
- [x] `GET /api/ides` — list + active default.
- [x] `POST /api/workspaces/:id/open-in-ide { ide? }` — shell out with worktree path.
- [x] `packages/shared-types/src/ide.ts` DTOs.

**Files Created/Modified:**

- `apps/api/src/ide/ide.module.ts` — created
- `apps/api/src/ide/ide.service.ts` — created
- `apps/api/src/ide/ide.controller.ts` — created
- `packages/shared-types/src/ide.ts` — created
- `packages/shared-types/src/index.ts` — exports RunState/RunStatus/StartRunDto/DetectedIde/OpenInIdeDto

**Issues Encountered:**

- _none_

**Verify:** `pnpm --filter @pixler/api test ide` + manual: invoke open-in-IDE, see IDE launch with worktree.

---

## Sprint 3 — Web UI: Run button, Open App, Run logs, OpenInIde menu, External Tools panel

**Status:** [x] complete
**Goal:** All workspace-level run + IDE controls land in the UI.

**Tasks:**

- [x] `RunButton.tsx` in TopBar — start/stop toggle with state icon.
- [x] `RunLogsTab.tsx` in center pane (dedicated Run tab).
- [x] `OpenAppButton.tsx` appears once `run.ready` fires; opens `http://localhost:$PIXLER_PORT`.
- [x] `OpenInIdeMenu.tsx` in TopBar — lists detected IDEs.
- [x] `SettingsDrawer/ExternalToolsPanel.tsx` — default IDE picker + detected list.
- [x] `⌘+E` opens active workspace in default IDE (wired in TopBar).
- [x] Workspace context menu wire-ups: "Open in IDE", "Open app" (greyed until ready).
- [x] `useRun.ts` + `useIDEs.ts`.

**Files Created/Modified:**

- `apps/web/src/components/RunButton.tsx` — created
- `apps/web/src/components/OpenAppButton.tsx` — created
- `apps/web/src/components/RunLogsTab.tsx` — created
- `apps/web/src/components/OpenInIdeMenu.tsx` — created
- `apps/web/src/components/SettingsDrawer/ExternalToolsPanel.tsx` — created
- `apps/web/src/components/WorkspaceContextMenu.tsx` — IDE + Open App wired
- `apps/web/src/components/TopBar.tsx` — RunButton/OpenAppButton/OpenInIdeMenu + ⌘+E
- `apps/web/src/components/CenterTabs.tsx` — Run tab added
- `apps/web/src/hooks/useRun.ts` — created
- `apps/web/src/hooks/useIDEs.ts` — created
- `apps/api/src/settings/registry.ts` — ide.default setting

**Issues Encountered:**

- _none_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual end-to-end per Acceptance.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

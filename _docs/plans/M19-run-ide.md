# M19 — Run / Open App + External IDE launcher

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — runnable after M07 + M08.

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

**Status:** ⏳ pending
**Goal:** Server manages per-workspace dev processes, streams logs, and detects readiness.

**Tasks:**

- [ ] `RunModule` + `RunService` + `RunController`.
- [ ] `POST /api/workspaces/:id/run` — spawn run script with `$PIXLER_*` env; stream `run.log`
  events; track state.
- [ ] `POST /api/workspaces/:id/run/stop` — SIGTERM, escalate to SIGKILL after timeout.
- [ ] `GET /api/workspaces/:id/run` — state + log buffer (last N lines).
- [ ] `ready-detector.service.ts` — configurable regex per project (default
  `(ready|listening|started).*on.*(:?\d+)`) OR port-open check on `$PIXLER_PORT`. Emit
  `run.ready` once detected.
- [ ] `packages/shared-types/src/run.ts` DTOs.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test run` + manual: spawn a known dev server, observe `run.ready`.

---

## Sprint 2 — IDE detection + open-in-IDE endpoint

**Status:** ⏳ pending
**Goal:** Server detects installed IDEs at boot and can launch any of them with a workspace's
worktree path.

**Tasks:**

- [ ] `IDEModule` + `IDEService` + `IDEController`.
- [ ] `IDEService.detect()` probes: `code`, `cursor`, `windsurf`, `webstorm`, `zed`, `subl`,
  `vim`/`nvim`, `xed`; caches results.
- [ ] `GET /api/ides` — list + active default.
- [ ] `POST /api/workspaces/:id/open-in-ide { ide? }` — shell out with worktree path; supports
  `{path}` template per SPEC §10.2 External Tools.
- [ ] `packages/shared-types/src/ide.ts` DTOs.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test ide` + manual: invoke open-in-IDE, see IDE launch with worktree.

---

## Sprint 3 — Web UI: Run button, Open App, Run logs, OpenInIde menu, External Tools panel

**Status:** ⏳ pending
**Goal:** All workspace-level run + IDE controls land in the UI.

**Tasks:**

- [ ] `RunButton.tsx` in workspace toolbar — start/stop toggle + state icon + "open logs" caret.
- [ ] `RunLogsTab.tsx` in center pane (dedicated tab so Run logs ≠ chat ≠ terminal).
- [ ] `OpenAppButton.tsx` appears once `run.ready` fires; opens
  `http://localhost:$PIXLER_PORT`.
- [ ] `OpenInIdeMenu.tsx` on workspace card + workspace toolbar — lists detected IDEs; default
  IDE shortcut on the card.
- [ ] `SettingsDrawer/ExternalToolsPanel.tsx` — default IDE picker, detected list, custom IDE
  template, `pixler://` URL-scheme registration status (registration itself is M24).
- [ ] `⌘+E` opens active workspace in default IDE.
- [ ] Workspace context menu wire-ups: "Open in IDE", "Open app" (greyed until ready),
  "Re-run setup script".
- [ ] `useRun.ts` + `useIDEs.ts`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual end-to-end per Acceptance.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

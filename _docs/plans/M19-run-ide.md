# M19 — Run / Open App + External IDE launcher

## Goal

Implement SPEC §8.11 (Run button + Open App) and §8.12 (external IDE launcher). End state: each workspace can spin up its dev environment via the project's run script using
`$PIXLER_PORT`, surface live logs, expose an Open App button that opens the running app in the browser, and launch the worktree in the user's IDE of choice.

## Depends on

- M07 (project — run script lives in `pixler.json`)
- M08 (workspace — $PIXLER_PORT allocated)

## Deliverables

- [ ] api `RunModule`:
    - `RunService` manages per-workspace dev processes (separate from agent PTYs)
    - `POST /api/workspaces/:id/run` — spawn the run script with `$PIXLER_*` env vars; streams stdout/stderr as
      `run.log` events; tracks state: `idle | starting | running | crashed | stopping`
    - `POST /api/workspaces/:id/run/stop` — SIGTERM, escalate to SIGKILL after timeout
    - `GET /api/workspaces/:id/run` — current state + log buffer (last N lines)
    - **Ready detection**: configurable per project — default looks for a regex match like
      `(ready|listening|started).*on.*(:?\d+)` or for the configured `$PIXLER_PORT` opening; once detected, set state to
      `running` and emit `run.ready` event
- [ ] api `IDEModule`:
    - `IDEService.detect()` — at startup probes for: VS Code (`code`), Cursor (`cursor`), Windsurf (
      `windsurf`), WebStorm (`webstorm`), Zed (`zed`), Sublime (`subl`), Vim/Neovim (`vim`/`nvim`), Xcode (
      `xed`); caches results
    - `GET /api/ides` — list of detected IDEs + active default
    - `POST /api/workspaces/:id/open-in-ide` body
      `{ ide?: string }` — shells out to the right command with the worktree path; supports a custom command template
      `{path}` per SPEC §10.2 External Tools
- [ ] Web UI:
    - **Run button
      ** in the workspace toolbar (above the right pane): start / stop toggle, state icon, "open logs" caret that pops a tab
    - **Run logs tab
      ** added to the center pane (or surfaces in the existing right pane as a sub-mode — pick whichever reads cleaner; consistent with the spec is a dedicated tab so Run logs ≠ chat ≠ terminal)
    - **Open App button** appears once `run.ready` fires; opens
      `http://localhost:$PIXLER_PORT` in the user's default browser
    - **"Open in…" dropdown
      ** on each workspace card and in the workspace toolbar — lists detected IDEs; the workspace card shows a single-icon shortcut for the default IDE
    - **Settings → External Tools panel** filled in: default IDE picker, detected IDE list, custom IDE config (
      `{path}` template), `pixler://` URL scheme registration status (registration itself is M24)
    - **Keyboard shortcut**: `⌘+E` opens the active workspace in the default IDE
- [ ] **Workspace context menu** items wire up:
    - "Open in IDE" → default IDE; submenu for "Open in…" picker
    - "Open app" → opens `http://localhost:$PIXLER_PORT` (greyed out unless `run.ready` has fired)
    - "Run setup script (re-run)" → triggers M08's `rerun-setup`

## Acceptance

- A workspace whose project has a
  `pnpm dev` run script starts, detects ready, exposes Open App; clicking opens the browser to the right port.
- Running 3 workspaces in parallel uses 3 different ports, no collisions, no clobbering.
- Stopping the run kills the process cleanly (no orphan listeners on the port).
- `⌘+E` opens the worktree in VS Code (or whichever is set).
- Settings → External Tools shows all detected IDEs with versions.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- `pixler://` URL-scheme registration — M24.
- Multi-process / Procfile-style run definitions — single script in v1.

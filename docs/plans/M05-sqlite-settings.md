# M05 — SQLite + three-tier settings cascade

## Goal

Set up `better-sqlite3` as the local data store and implement the global/project/workspace settings cascade described in SPEC §10. Migrate the M02 `localStorage` theme blob into this system. Define the settings shape that every later milestone reads from.

## Depends on

- M01 (scaffold)
- M04 (api core)

## Deliverables

- [ ] `apps/api/src/db/` — `better-sqlite3` setup:
  - DB file at `~/.config/pixler/pixler.db` (XDG-aware)
  - Lightweight migration runner (`migrations/0001_init.sql`, …) — embed SQL files as strings, track applied version in a `meta` table
  - Initial tables: `settings_global`, `settings_project (project_id, key, value)`, `settings_workspace (workspace_id, key, value)`, `projects`, `workspaces` (skeleton — fields filled out by M07/M08)
- [ ] `apps/api/src/settings/` — `SettingsModule`:
  - `SettingsService` exposing `get(key, { projectId?, workspaceId? })` that resolves cascade workspace → project → global → built-in default
  - `set(key, value, { scope: 'global' | 'project' | 'workspace', id? })`
  - `resetPrompts({ scope, id })` — clears `don't-ask-again` flags
  - `reset({ scope, id })` — wipes overrides at that scope
  - Caching layer in memory, invalidated on writes, with an event emitted to all clients
- [ ] `~/.config/pixler/config.json` — human-editable file:
  - On boot, read it and upsert into `settings_global` for any keys present (file is the source of truth on conflict)
  - Watch the file with `fs.watch` and re-sync on change
  - Format documented in the SettingsService as JSDoc
- [ ] REST endpoints:
  - `GET /api/settings?scope=global|project|workspace&id=…` returns the resolved view
  - `PATCH /api/settings` body `{ scope, id?, patch: { key: value } }`
  - `POST /api/settings/reset` body `{ scope, id?, kind: 'prompts' | 'all' }`
- [ ] Settings keys defined as a typed registry in `@pixler/shared-types`:
  - `appearance.theme`, `appearance.mode`, `appearance.density`, `appearance.animationLevel`
  - `linear.pat`, `linear.workspace`, `linear.team`, `linear.syncIntervalMs`, `linear.stateMap`
  - `plans.defaultStorage` (`'file' | 'inline' | 'attachment' | 'auto'`), `plans.fileDir`, `plans.inlineThresholdTasks`, `plans.inlineThresholdChars`
  - `models.planner`, `models.reviewer`, `models.executor`
  - `git.branchTemplate`, `git.baseBranch`, `git.autoMerge`, `git.mergeStrategy`
  - `workspaces.worktreeBaseDir`, `workspaces.maxParallel`, `workspaces.removeSilenceMs`
  - `providers.claude`, `providers.codex`, `providers.gemini`, `providers.gh`
  - `notifications.*`, `telemetry.enabled`
- [ ] Each registry entry carries: type, default value, scopes allowed, label, description (so the Settings UI in later milestones can auto-render)
- [ ] Web client: `apps/web/src/hooks/useSetting.ts` and `useSettings.ts` — TanStack Query–backed, write-through to PATCH; live updates via Socket.io event `settings.changed`
- [ ] Migrate the M02 theme persistence to use `useSetting('appearance.theme')` and `'appearance.mode'`

## Acceptance

- Restarting the api persists theme + any other set values.
- Editing `~/.config/pixler/config.json` (e.g. changing `appearance.theme` to `"graphite"`) flips the UI within a second.
- Project-scope override beats global; workspace beats project (verified with a curl-driven test).
- `pnpm -w typecheck` clean.

## Files

```
apps/api/src/db/database.module.ts
apps/api/src/db/database.service.ts
apps/api/src/db/migrations/0001_init.sql
apps/api/src/settings/settings.module.ts
apps/api/src/settings/settings.service.ts
apps/api/src/settings/settings.controller.ts
apps/api/src/settings/config-file.watcher.ts
packages/shared-types/src/settings.ts
apps/web/src/hooks/useSetting.ts
apps/web/src/hooks/useSettings.ts
apps/web/src/stores/theme.ts   (refactored to call useSetting)
```

## Out of scope

- The visual Settings drawer UI — owned by M06 (skeleton) and individual feature milestones that fill in their panels.
- `pixler.json` (committed-to-repo team config) — owned by M07.
- Resetting via the UI — only API endpoints in this milestone; UI later.

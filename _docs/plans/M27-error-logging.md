# M27 — Error Logging

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-25
**Current Status:** Plan authored — ready to execute.

---

## Goal

Write backend API errors (4xx + 5xx) and frontend uncaught JS errors to date-stamped JSON-lines
log files in `~/.config/pixler/logs/`. A global setting (`logs.retentionDays`, default 7) controls
how many days of log files are kept; files older than that are deleted automatically on startup.
Frontend errors are captured via `window.onerror` / `unhandledrejection` and forwarded to the
existing `POST /api/crashes` endpoint, which also appends to the log file.

## Depends on

- M04 (API core — AllExceptionsFilter, DatabaseService data dir pattern)
- M05 (Settings registry + SettingsService)
- M10 (CrashesService — reused for frontend error path)

## Acceptance

- Hit a 404 route → `~/.config/pixler/logs/api-YYYY-MM-DD.log` gets a new JSON line with status, path, message.
- Hit a 500 route → same file, status 500 entry.
- Throw an uncaught JS error in the frontend → `~/.config/pixler/logs/frontend-YYYY-MM-DD.log` gets a line.
- Set `logs.retentionDays` to 1 in settings, backdate a log file by 2 days → it's deleted on next API start.
- `pnpm -w typecheck` clean.

## Out of scope

- Log viewer UI in the app
- Log streaming over WebSocket
- Structured log search / filtering
- Log rotation within a single day (unbounded file size within a day is acceptable)
- Shipping log config (log level, format) — defaults only

## Files (expected surface)

```
apps/api/src/common/logger/file-logger.service.ts   (new)
apps/api/src/common/logger/logs.module.ts            (new)
apps/api/src/common/filters/all-exceptions.filter.ts (modified — inject FileLoggerService)
apps/api/src/crashes/crashes.service.ts              (modified — append to frontend log)
apps/api/src/crashes/crashes.module.ts               (modified — import LogsModule)
apps/api/src/app.module.ts                           (modified — switch to APP_FILTER, import LogsModule)
apps/api/src/main.ts                                 (modified — remove useGlobalFilters)
apps/api/src/settings/registry.ts                   (modified — add logs.retentionDays)
apps/web/src/main.tsx                                (modified — global error handler)
.gitignore                                           (modified — add logs/ entry)
```

---

## Sprint 1 — FileLoggerService + backend wiring

**Status:** ✅ complete
**Goal:** Write API and frontend errors to dated log files; wire into existing exception filter and crashes service.

**Tasks:**

- [x] Create `apps/api/src/common/logger/file-logger.service.ts`
- [x] Create `apps/api/src/common/logger/logs.module.ts`
- [x] Update `apps/api/src/common/filters/all-exceptions.filter.ts`
- [x] Update `apps/api/src/app.module.ts` — import LogsModule, register APP_FILTER
- [x] Update `apps/api/src/main.ts` — remove useGlobalFilters
- [x] Update `apps/api/src/crashes/crashes.service.ts` — inject FileLoggerService
- [x] Update `apps/api/src/crashes/crashes.module.ts` — import LogsModule
- [x] Add `logs.retentionDays` to `apps/api/src/settings/registry.ts`
- [x] Add `logs/` to `.gitignore`

**Files Created/Modified:**

- `apps/api/src/common/logger/file-logger.service.ts` (new)
- `apps/api/src/common/logger/logs.module.ts` (new)
- `apps/api/src/common/filters/all-exceptions.filter.ts` (DI injection, request extraction)
- `apps/api/src/app.module.ts` (LogsModule import, APP_FILTER provider)
- `apps/api/src/main.ts` (removed useGlobalFilters)
- `apps/api/src/crashes/crashes.service.ts` (FileLoggerService injected)
- `apps/api/src/crashes/crashes.module.ts` (LogsModule import)
- `apps/api/src/settings/registry.ts` (logs.retentionDays added)
- `.gitignore` (logs/ entry)

**Issues Encountered:**

- Used `@Optional()` on all FileLoggerService injections to keep the service safely decoupled from modules that may not import LogsModule.

**Verify:** `pnpm -w typecheck` — 10/10 tasks successful.

---

## Sprint 2 — Frontend global error handler

**Status:** ⏳ pending
**Goal:** Capture uncaught frontend JS errors and unhandled promise rejections and forward them to `/api/crashes`.

**Tasks:**

- [ ] Update `apps/web/src/main.tsx`
  - Add `window.addEventListener('error', handler)` before `ReactDOM.createRoot`
  - Add `window.addEventListener('unhandledrejection', handler)` before `ReactDOM.createRoot`
  - Both handlers: POST to `/api/crashes` with `{ source: 'frontend', message, stack, context: { url: location.href, userAgent: navigator.userAgent } }`
  - Use a plain `fetch` (not TanStack Query) — must work before React mounts and after unmount
  - Fire-and-forget (no await, no error UI — silent best-effort)
  - Guard: skip if `import.meta.env.DEV` is false? No — log in both dev and prod

**Files Created/Modified:** _(append as you touch them)_

- _none yet_

**Issues Encountered:** _(append surprising things + their resolution)_

- _none yet_

**Verify:** Open browser devtools, run `throw new Error('test log')` in console → check `~/.config/pixler/logs/frontend-YYYY-MM-DD.log` for the entry.

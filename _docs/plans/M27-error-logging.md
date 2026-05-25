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

**Status:** ⏳ pending
**Goal:** Write API and frontend errors to dated log files; wire into existing exception filter and crashes service.

**Tasks:**

- [ ] Create `apps/api/src/common/logger/file-logger.service.ts`
  - `onModuleInit`: create `~/.config/pixler/logs/` dir if missing; call `pruneOldLogs(retentionDays)` using `SettingsService.get('logs.retentionDays')` (default 7 if settings not yet available)
  - `logApiError(status: number, method: string, path: string, message: string, stack?: string)`: appends JSON line to `api-YYYY-MM-DD.log`
  - `logFrontendError(message: string, stack: string, context: Record<string, unknown>)`: appends JSON line to `frontend-YYYY-MM-DD.log`
  - `pruneOldLogs(retentionDays: number)`: reads `logs/` dir, deletes files whose date suffix is older than N days
  - Private `appendLine(filename: string, data: object)`: opens file for append, writes `JSON.stringify(data) + '\n'`; uses sync fs to keep it simple
- [ ] Create `apps/api/src/common/logger/logs.module.ts`
  - Exports `FileLoggerService`; imports `SettingsModule` (for retention setting on init)
- [ ] Update `apps/api/src/common/filters/all-exceptions.filter.ts`
  - Add constructor injection of `FileLoggerService`
  - In `catch()`: call `fileLogger.logApiError(status, method, url, message, stack)` — log both 4xx and 5xx
  - Extract `request` from `host.switchToHttp().getRequest()` to get method + url
- [ ] Update `apps/api/src/app.module.ts`
  - Import `LogsModule`
  - Register `AllExceptionsFilter` as `APP_FILTER` provider (enables DI injection)
- [ ] Update `apps/api/src/main.ts`
  - Remove `app.useGlobalFilters(new AllExceptionsFilter())` — now handled by `APP_FILTER`
- [ ] Update `apps/api/src/crashes/crashes.service.ts`
  - Inject `FileLoggerService`
  - In `record()`: call `fileLogger.logFrontendError(message, stack, context)` after the DB insert
- [ ] Update `apps/api/src/crashes/crashes.module.ts`
  - Import `LogsModule`
- [ ] Add `logs.retentionDays` to `apps/api/src/settings/registry.ts`
  ```ts
  { key: 'logs.retentionDays', type: 'number', default: 7, scopes: ['global'],
    label: 'Log Retention', description: 'Days to keep error log files (0 = keep forever)' }
  ```
- [ ] Add `logs/` to `.gitignore` (if not already present)

**Files Created/Modified:** _(append as you touch them)_

- _none yet_

**Issues Encountered:** _(append surprising things + their resolution)_

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/api build`

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

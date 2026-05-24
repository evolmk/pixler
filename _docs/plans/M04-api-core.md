# M04 — NestJS api core + Socket.io gateway

## Goal

Flesh out `apps/api` with module structure, a Socket.io gateway for streaming agent + PTY events, a shared event-type contract in `@pixler/shared-types`, and a TanStack Query setup on the web side that consumes it.

## Depends on

- M01 (monorepo scaffold)

## Deliverables

- [x] `apps/api/src/app.module.ts` — root module composing feature modules with stubs: `HealthModule`, `SettingsModule` (placeholder), `ProjectsModule` (placeholder), `WorkspacesModule` (placeholder), `EventsModule` (the gateway)
- [x] `apps/api/src/events/events.gateway.ts` — Socket.io gateway at namespace `/events`. Emits typed events to per-workspace rooms (`workspace:<id>`) and to a global `app` room.
- [x] `apps/api/src/events/events.service.ts` — DI service other modules call to publish events (`emitWorkspaceEvent(id, event)`, `emitAppEvent(event)`).
- [x] CORS configured for the Vite dev origin.
- [x] Global validation pipe (`class-validator` + `class-transformer`).
- [x] Global exception filter that produces `{ error: { code, message, details? } }` payloads.
- [x] `@pixler/shared-types` populated with:
  - `AppEvent` discriminated union (`type` field) — at minimum `pixler.boot`, `pixler.shutdown` events
  - `WorkspaceEvent` discriminated union — placeholder variants `workspace.created`, `agent.output`, `agent.state-changed` (full shape filled out by M13)
  - Common DTOs: `ApiError`, `Paginated<T>`
- [x] `apps/web` integrates:
  - TanStack Query `QueryClientProvider` at the root
  - `apps/web/src/lib/socket.ts` — a singleton `io()` client subscribing to the right rooms with reconnection
  - `apps/web/src/hooks/useAppEvents.ts` and `useWorkspaceEvents(id)` — small typed wrappers over the socket
- [x] Health endpoint upgraded to return `{ ok, version, uptimeMs, env: 'dev' | 'prod' }`
- [x] Logger: structured logs via `pino` or NestJS default + JSON transport in prod; pretty in dev

## Acceptance

- `pnpm dev` brings up api + web; the browser shows a `pixler.boot` event arriving over Socket.io (logged in the console).
- Hitting `/api/health` returns the expected shape.
- Stopping the api triggers a `disconnect` and Socket.io auto-reconnects when it comes back.
- `pnpm -w typecheck` clean across api + web + shared-types.

## Files

```
apps/api/src/main.ts
apps/api/src/app.module.ts
apps/api/src/health.controller.ts
apps/api/src/events/events.module.ts
apps/api/src/events/events.gateway.ts
apps/api/src/events/events.service.ts
apps/api/src/common/filters/all-exceptions.filter.ts
apps/api/src/common/pipes/validation.pipe.ts
packages/shared-types/src/index.ts
packages/shared-types/src/events.ts
packages/shared-types/src/dtos.ts
apps/web/src/lib/socket.ts
apps/web/src/lib/query.ts
apps/web/src/hooks/useAppEvents.ts
apps/web/src/hooks/useWorkspaceEvents.ts
```

## Out of scope

- Authentication — the app is local-first and bound to localhost; no auth in v1.
- Specific workspace / project / orchestrator endpoints — owned by their respective milestones.
- node-pty wiring — owned by M09.

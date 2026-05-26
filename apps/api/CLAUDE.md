# apps/api — CLAUDE.md

NestJS backend. Auto-loaded when working under `apps/api/`.

## Module pattern

Every feature is a folder under `apps/api/src/<feature>/` with three files:

```
<feature>.module.ts      // @Module: providers, controllers, exports
<feature>.controller.ts  // @Controller('<path>'): HTTP routes
<feature>.service.ts     // @Injectable: business logic
```

Reference shape: `apps/api/src/system/` (small, complete, no DB).
Reference shape with DB: `apps/api/src/ide/` (uses `DatabaseService`).

**Wiring a new module:** register it in `apps/api/src/app.module.ts`'s
`imports: [...]` array. Forgetting this is the #1 silent failure — the module
compiles but no routes mount.

**Global prefix is `/api`** (`main.ts` → `setGlobalPrefix('api')`). Controllers
declare paths *without* the `/api` prefix.

## DTOs and shared types

Cross-cutting types (DTOs, event payloads, enums) live in
`packages/shared-types/src/<feature>.ts` and are re-exported from
`packages/shared-types/src/index.ts`. The frontend imports the same types — do
**not** duplicate DTOs between api and web.

Controllers should `import type { FooDto } from '@pixler/shared-types'`, not
define their own.

## Socket.io events

Real-time events go through `EventsGateway` (`apps/api/src/events/`).
Event payload types live in `packages/shared-types/src/events.ts` —
add the new event to the union there before emitting it. Frontend
subscribes via `useAppEvents` / `useWorkspaceEvents`.

## Persistence

SQLite via `better-sqlite3`, injected as `DatabaseService` (`db/`). Migrations
in `apps/api/src/db/migrations/` run at boot. Repository methods live on the
feature service, not on a separate repo class — pattern is "service owns its
SQL".

## Auth, errors, validation

- Errors: throw `BadRequestException` / `NotFoundException` / `ForbiddenException`
  from `@nestjs/common`. The global `AllExceptionsFilter` formats them.
- Validation: small endpoints accept a typed DTO and trust it. Class-level
  validation pipes are not the convention here — check incoming fields explicitly
  in the controller or service.
- Auth: see `apps/api/src/auth/` for Linear + GitHub OAuth + PAT flows.

## Don't

- Don't `console.log` in production paths — use the injected `LoggerService`.
- Don't `cwd`-relative paths — resolve from `process.cwd()` only at boot;
  feature code should accept absolute paths.
- Don't read `.env` directly in services — settings go through
  `SettingsModule`.

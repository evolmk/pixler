# M10 — Linear integration (Pixler-internal, `@linear/sdk`)

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-25
**Current Status:** Sprint 3 complete — mutations service (comments, attachments, sub-issues). Sprint 4 next: Web UI.

---

## Goal

Wire up the Pixler-internal Linear integration described in SPEC §6: PAT auth, sync assigned
Todo + In Progress tickets every 60s and on-demand, drive state transitions, manage Linear
comments + attachments. Everything here goes through `@linear/sdk`, never through an agent.

## Depends on

- M05 (settings — `linear.*` keys + secret storage)
- M07 (projects — Linear filters live per-project)

## Acceptance

- Saving a PAT validates immediately and shows "Connected as Mike in Lazar".
- Tickets appear in the sidebar within one sync interval of being created/updated in Linear.
- "Start workspace from ticket" creates a workspace whose `ticket_id` is the Linear identifier
  and whose name follows the `<label>-<id>-<slug>` rule.
- Triggering a state transition via API moves the ticket in Linear (verified manually).
- Disconnecting wipes the PAT from storage.
- `pnpm -w typecheck` clean.

## Out of scope

- The `@pixler/linear-cli` agent-facing wrapper — M11.
- Linear deep links (`pixler://workspace/<id>` comments) — M24.
- Linear OAuth (v2 in the spec — v1 is PAT-only).
- MCP-vs-CLI toggle UI for agents — that lives in M11's Project Settings → Integrations.

## Files (expected surface)

```
apps/api/src/db/migrations/0004_linear.sql
apps/api/src/linear/linear.module.ts
apps/api/src/linear/linear.service.ts
apps/api/src/linear/linear.controller.ts
apps/api/src/linear/state-map.service.ts
apps/api/src/linear/sync.scheduler.ts
apps/api/src/linear/secret-store.service.ts
packages/shared-types/src/linear.ts
apps/web/src/components/SettingsDrawer/LinearPanel.tsx
apps/web/src/components/ProjectSettingsDrawer/IntegrationsPanel.tsx
apps/web/src/components/LinearTicketList.tsx
apps/web/src/components/LinearStatusPill.tsx
apps/web/src/hooks/useLinear.ts
apps/web/src/hooks/useLinearTickets.ts
```

---

## Sprint 1 — DB + auth (PAT connect/disconnect/status) + secret store

**Status:** ✅ complete
**Goal:** User can paste a PAT, validate it, and persist it; status endpoint surfaces connection
state; secrets land in OS keychain when available.

**Tasks:**

- [x] `0004_linear.sql` migration with `linear_tickets` table keyed on Pixler project_id.
- [x] `LinearModule` + `LinearService` wrapping `@linear/sdk` with the user's PAT.
- [x] `secret-store.service.ts` — `keytar` when available, plaintext SQLite fallback with logged
  warning.
- [x] `POST /api/linear/connect`, `POST /api/linear/disconnect`, `GET /api/linear/status`.
- [x] `GET /api/linear/teams`, `GET /api/linear/projects?teamId=…`.

**Files Created/Modified:**

- `apps/api/src/db/migrations/0004_linear.sql`
- `apps/api/src/db/database.service.ts`
- `apps/api/src/linear/secret-store.service.ts`
- `apps/api/src/linear/linear.service.ts`
- `apps/api/src/linear/linear.controller.ts`
- `apps/api/src/linear/linear.module.ts`
- `apps/api/src/app.module.ts`
- `packages/shared-types/src/linear.ts`
- `packages/shared-types/src/index.ts`
- `apps/api/package.json` (added @linear/sdk, keytar)

**Issues Encountered:**

- `LinearFetch<T>` is just `type LinearFetch<T> = Promise<T>` — no special handling needed.
- `keytar` installed with native bindings successfully on macOS.

**Verify:** `pnpm -w typecheck` — 9/9 tasks pass.

---

## Sprint 2 — Tickets sync loop + state-map

**Status:** ✅ complete
**Goal:** Tickets are pulled every `syncIntervalMs` per project, cached locally, and surfaced via
`GET /api/linear/tickets`. State-name mapping drives transitions.

**Tasks:**

- [x] `sync.scheduler.ts` — calls `issues({ filter: { assignee: { isMe: true }, state: { type:
  { in: ['unstarted', 'started'] } } } })` per project; upsert into `linear_tickets`; emit
  `linear.synced`.
- [x] `GET /api/linear/tickets?projectId=…` from local cache.
- [x] `POST /api/linear/sync { projectId? }` — force sync.
- [x] `state-map.service.ts` — maps `'todo'|'in_progress'|'in_review'|'done'` to team's actual
  state names via `linear.stateMap` setting.
- [x] `POST /api/linear/tickets/:identifier/state { state }`.

**Files Created/Modified:**

- `apps/api/src/linear/sync.scheduler.ts`
- `apps/api/src/linear/state-map.service.ts`
- `apps/api/src/linear/linear.controller.ts`
- `apps/api/src/linear/linear.module.ts`
- `apps/api/src/settings/registry.ts` (added `linear.stateMap`)

**Issues Encountered:**

- `label_name` skipped in upsert to avoid N+1 label API calls — stored as null.

**Verify:** `pnpm -w typecheck` — 9/9 tasks pass.

---

## Sprint 3 — Comments + attachments + sub-issues

**Status:** ✅ complete
**Goal:** Programmatically add comments, upload/delete attachments, create/complete sub-issues.

**Tasks:**

- [x] `POST /api/linear/tickets/:identifier/comment { body }`.
- [x] `POST /api/linear/tickets/:identifier/attachment` — two-step: `POST /upload/init` returns
  pre-signed S3 URL; client uploads; `POST .../attachment { assetUrl, title }` creates attachment.
- [x] `DELETE /api/linear/attachments/:id`.
- [x] `POST /api/linear/tickets/:identifier/subissues { title }`.
- [x] `POST /api/linear/subissues/:id/complete`.

**Files Created/Modified:**

- `apps/api/src/linear/linear-mutations.service.ts`
- `apps/api/src/linear/linear.controller.ts`
- `apps/api/src/linear/linear.module.ts`
- `apps/api/package.json` (added @types/multer dev dep)

**Issues Encountered:**

- Attachment upload is split into two endpoints (init → client S3 PUT → createAttachment) rather
  than piping the file through our server — cleaner and avoids buffering large files.
- `payload.commentId`/`attachmentId`/`issueId` used instead of awaiting entity to avoid extra round-trips.

**Verify:** `pnpm -w typecheck` — 9/9 tasks pass.

---

## Sprint 4 — Web UI: Linear panel, IntegrationsPanel, TicketList, StatusPill

**Status:** ⏳ pending
**Goal:** All Linear-related UI lights up.

**Tasks:**

- [ ] `SettingsDrawer/LinearPanel.tsx` — PAT input (masked after save), team picker, default
  project, sync interval, state-name mapping editor with autocomplete from workflow states.
- [ ] `ProjectSettingsDrawer/IntegrationsPanel.tsx` Linear section — per-project team / project
  filter, label filter, state-mapping override.
- [ ] `LinearTicketList.tsx` — new sub-section in workspace sidebar; click a ticket → opens
  NewWorkspaceDialog pre-filled; pull-to-refresh triggers sync.
- [ ] `LinearStatusPill.tsx` — top-bar pill: green/amber/red.
- [ ] `hooks/useLinear.ts`, `hooks/useLinearTickets.ts`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual smoke through every acceptance criterion.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

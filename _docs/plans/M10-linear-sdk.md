# M10 — Linear integration (Pixler-internal, `@linear/sdk`)

## Goal

Wire up the Pixler-internal Linear integration described in SPEC §6: PAT auth, sync assigned Todo + In Progress tickets every 60s and on-demand, drive state transitions, manage Linear comments + attachments. Everything here goes through
`@linear/sdk`, never through an agent.

## Depends on

- M05 (settings — `linear.*` keys + secret storage)
- M07 (projects — Linear filters live per-project)

## Deliverables

- [ ] DB migration `0004_linear.sql`:
  `linear_tickets (id PK, identifier, title, state, assignee_id, project_id_linear, team_id, labels JSON, updated_at, raw JSON)` — local cache of synced tickets, keyed on Pixler project_id so the sidebar can filter
- [ ] api `LinearModule`:
    - `LinearService` — wraps `@linear/sdk` with the user's PAT (loaded from
      `settings.linear.pat`, kept in OS keychain if available via
      `keytar`, else plaintext SQLite for v1 with a clear warning logged)
    - `POST /api/linear/connect` body `{ pat }` — validate via `viewer` query, persist; return
      `{ name, email, workspace }`
    - `POST /api/linear/disconnect` — wipe PAT
    - `GET /api/linear/status` — `{ connected, viewer?, lastSyncAt }`
    - `GET /api/linear/teams` and `GET /api/linear/projects?teamId=…` — used by onboarding + project settings
    - `GET /api/linear/tickets?projectId=<pixler-project>` — read from local cache
    - `POST /api/linear/sync` `{ projectId? }` — force sync now; otherwise runs on a 60s interval per setting
      `linear.syncIntervalMs`
    - `POST /api/linear/tickets/:identifier/state` `{ state }` — transition via state-map
    - `POST /api/linear/tickets/:identifier/comment` `{ body }`
    - `POST /api/linear/tickets/:identifier/attachment` (multipart) — `fileUpload` mutation; returns `{ attachmentId }`
    - `DELETE /api/linear/attachments/:id`
    - `POST /api/linear/tickets/:identifier/subissues` `{ title }`
    - `POST /api/linear/subissues/:id/complete`
- [ ] **State-name mapping**: SPEC §6.4 — `linear.stateMap` setting maps
  `'todo'|'in_progress'|'in_review'|'done'` to the team's actual state names; default to common names but always go through the map
- [ ] **Sync loop**: every `syncIntervalMs` per project, hit
  `issues({ filter: { assignee: { isMe: true }, state: { type: { in: ['unstarted', 'started'] } } } })`; upsert into
  `linear_tickets`; emit `linear.synced` event with delta info
- [ ] Web UI:
    - **Settings → Linear panel
      ** filled in: PAT input (masked after save), team picker, default project, sync interval, state-name mapping editor with autocomplete from team's actual workflow states
    - **Project Settings → Integrations
      ** Linear section: per-project team / project filter, label filter, state-mapping override
    - **Sidebar Linear ticket list
      ** (new sub-section in the workspaces sidebar): shows assigned Todo + In Progress tickets for the active project; clicking one opens the New Workspace dialog pre-filled with the ticket id + title + description; pull-to-refresh triggers
      `POST /api/linear/sync`
    - Status pill in the top bar shows Linear connection state (green dot when synced, amber when sync is overdue, red when unauthenticated)

## Acceptance

- Saving a PAT validates immediately and shows "Connected as Mike in Lazar".
- Tickets appear in the sidebar within one sync interval of being created/updated in Linear.
- "Start workspace from ticket" creates a workspace whose
  `ticket_id` is the Linear identifier and whose name follows the `<label>-<id>-<slug>` rule.
- Triggering a state transition via API moves the ticket in Linear (verified manually).
- Disconnecting wipes the PAT from storage.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- The `@pixler/linear-cli` agent-facing wrapper — M11.
- Linear deep links (`pixler://workspace/<id>` comments) — M24.
- Linear OAuth (v2 in the spec — v1 is PAT-only).
- MCP-vs-CLI toggle UI for agents — that lives in M11's Project Settings → Integrations.

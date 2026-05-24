# M18 — Checks tab + Activity feed (toasts + tab)

## Goal

Implement SPEC §8.8 (Checks tab) and §8.10 (Activity feed). The Checks tab consolidates per-workspace status across git, CI, deploy previews, PR review comments, and todos. The Activity feed surfaces ephemeral toasts and a persistent history.

## Depends on

- M07/M08 (project + workspace)
- M12 (gh / CI checks / PR comments)
- M13 (orchestrator events)
- M14 (plan todos)

## Deliverables

- [ ] api `ActivityModule`:
  - `activities` table (migration `0008_activity.sql`): `id PK, scope ('app'|'project'|'workspace'), scope_id, kind, title, body, severity ('info'|'success'|'warning'|'error'), seen BOOLEAN, ts`
  - `ActivityService.record({ scope, scopeId?, kind, title, body, severity })` — writes a row, emits `activity.appended` event
  - Listeners that translate domain events into activities:
    - `plan.ready`, `approval.needed`, `agent.stuck` / `agent.error`, `pr.opened`, `pr.checks.failed` / `pr.checks.passed`, `pr.merged`, `workspace.archived`
  - `GET /api/activities?scope=&scopeId=&unseenOnly=` — paginated
  - `POST /api/activities/mark-seen` body `{ ids: number[] }`
- [ ] **Checks tab UI**:
  - Sections (collapsible cards):
    - **Git status** — staged/unstaged counts, ahead/behind, "Open Diff"
    - **CI runs** — list from `gh pr checks`; each row: name, conclusion icon, duration, "Open in GitHub" link; auto-refreshes via Socket.io events from M12
    - **Deploy previews** — placeholder card; only shows if Vercel/Netlify integrations are configured (leave empty in v1, ready for extension)
    - **PR review comments** — list of reviews and inline comments from `gh pr view --json reviews`; click to expand
    - **Todos from plan** — pulled from M14 plan tasks with checkboxes
    - **Tests** — placeholder "Run tests" button that opens a Run config tab (M19) — v1 doesn't auto-detect test commands
  - Each section can be refreshed manually with a small button
- [ ] **Activity feed**:
  - **Toast stack** (top-right, mounted at root): uses M03 Sonner (`<Toaster />` mounted at root + `toast()` from `@pixler/ui/components/sonner`); subscribes to `activity.appended` for severity ∈ `success|warning|error`; respects do-not-disturb (`notifications.dnd.start`/`end` setting)
  - **Activity tab** in the left rail (separate icon, below workspaces): a scrolling list of all activities, filterable per workspace, unread count badge
  - Click an activity → navigate to the workspace + open the relevant tab (e.g., `pr.checks.failed` → Checks tab)
- [ ] **Notification setting panel** filled in (SPEC §10.2 Notifications): per-event on/off, sound, do-not-disturb hours
- [ ] **Native OS notifications** when the app is not focused (electron-style via Notification API; gated by setting)

## Acceptance

- Plan ready → toast appears in the top-right + activity entry recorded.
- A CI failure on the workspace's PR pops a `warning` toast and marks the Checks tab with a red dot.
- Marking activities as seen clears the badges.
- DnD hours suppress toasts but still record activities.
- `pnpm -w typecheck` clean.

## Files

```
apps/api/src/db/migrations/0008_activity.sql
apps/api/src/activity/activity.module.ts
apps/api/src/activity/activity.service.ts
apps/api/src/activity/activity.controller.ts
apps/api/src/activity/listeners.ts
packages/shared-types/src/activity.ts
apps/web/src/components/ChecksTab.tsx
apps/web/src/components/checks/GitStatusCard.tsx
apps/web/src/components/checks/CiRunsCard.tsx
apps/web/src/components/checks/PrReviewCommentsCard.tsx
apps/web/src/components/checks/PlanTodosCard.tsx
apps/web/src/components/checks/DeployPreviewsCard.tsx
apps/web/src/components/ActivityTab.tsx
apps/web/src/components/ToastBridge.tsx
apps/web/src/components/SettingsDrawer/NotificationsPanel.tsx
apps/web/src/hooks/useActivities.ts
apps/web/src/hooks/useNativeNotifications.ts
```

## Out of scope

- Real GitHub webhooks — polling per M12 is enough for v1.
- "Spotlight testing" — v2 per spec.

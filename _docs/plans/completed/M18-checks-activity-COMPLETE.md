# M18 — Checks tab + Activity feed (toasts + tab)

**Status:** ✅ COMPLETE
**Modified:** 2026-05-25
**Current Status:** All 3 sprints complete by evolmk.

---

## Goal

Implement SPEC §8.8 (Checks tab) and §8.10 (Activity feed). The Checks tab consolidates
per-workspace status across git, CI, deploy previews, PR review comments, and todos. The Activity
feed surfaces ephemeral toasts and a persistent history.

## Depends on

- M07/M08 (project + workspace)
- M12 (gh / CI checks / PR comments)
- M13 (orchestrator events)
- M14 (plan todos)

## Acceptance

- Plan ready → toast appears in the top-right + activity entry recorded.
- A CI failure on the workspace's PR pops a `warning` toast and marks the Checks tab with a red
  dot.
- Marking activities as seen clears the badges.
- DnD hours suppress toasts but still record activities.
- `pnpm -w typecheck` clean.

## Out of scope

- Real GitHub webhooks — polling per M12 is enough for v1.
- "Spotlight testing" — v2 per spec.

## Files (expected surface)

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

---

## Sprint 1 — ActivityModule + DB + listeners

**Status:** ✅ complete (completed by evolmk instance)
**Goal:** Backend records activities for every domain event and exposes a paginated read endpoint.

**Tasks:**

- [x] `0009_activity.sql` migration (renumbered; 0008 taken by messages).
- [x] `ActivityModule` + `ActivityService` + `ActivityController`.
- [x] `ActivityService.record({ scope, scopeId?, kind, title, body, severity })` → writes row +
  emits `activity.appended`.
- [x] `listeners.ts` — translates `plan.ready`, `approval.needed`, `agent.stuck`, `agent.error`,
  `pr.opened`, `pr.checks.failed`/`passed`, `pr.merged`, `workspace.archived` into activities.
- [x] `GET /api/activities?scope=&scopeId=&unseenOnly=` paginated.
- [x] `POST /api/activities/mark-seen { ids }`.

**Files Created/Modified:**

- `apps/api/src/db/migrations/0009_activity.sql`
- `packages/shared-types/src/activity.ts`
- `apps/api/src/activity/activity.module.ts`
- `apps/api/src/activity/activity.service.ts`
- `apps/api/src/activity/activity.controller.ts`
- `apps/api/src/activity/activity.listeners.ts`
- `apps/api/src/app.module.ts`

**Issues Encountered:**

- Migration renumbered to 0009 (0008 taken by M16 messages).

**Verify:** `pnpm --filter @pixler/api test activity` — trigger each event source, assert correct activity rows.

---

## Sprint 2 — Checks tab UI

**Status:** ✅ complete
**Goal:** Center pane Checks tab shows live status across all sources.

**Tasks:**

- [x] `ChecksTab.tsx` collapsible cards: GitStatus, CiRuns, DeployPreviews, PrReviewComments,
  PlanTodos, Tests (placeholder).
- [x] `GitStatusCard.tsx` — staged/unstaged counts, ahead/behind, "Open Diff" (done by evolmk).
- [x] `CiRunsCard.tsx` — from `gh pr checks`; auto-refreshes via Socket.io from M12 (done by evolmk).
- [x] `PrReviewCommentsCard.tsx` — `gh pr view --json reviews,comments`; expand to view (done by evolmk).
- [x] `PlanTodosCard.tsx` — M14 plan tasks with checkboxes (done by evolmk).
- [x] `DeployPreviewsCard.tsx` — placeholder (only shows when Vercel/Netlify configured).
- [x] Per-card refresh buttons (in each card).

**Files Created/Modified:**

- `apps/web/src/components/ChecksTab.tsx`
- `apps/web/src/components/checks/GitStatusCard.tsx`
- `apps/web/src/components/checks/CiRunsCard.tsx`
- `apps/web/src/components/checks/PrReviewCommentsCard.tsx`
- `apps/web/src/components/checks/PlanTodosCard.tsx`
- `apps/web/src/components/checks/DeployPreviewsCard.tsx`
- `apps/web/src/components/CenterTabs.tsx`

**Issues Encountered:**

- Most cards were built by evolmk.

**Verify:** `pnpm --filter @pixler/web build` + manual: CI failure triggers red dot.

---

## Sprint 3 — Activity feed: toast bridge + tab + native + settings

**Status:** ✅ complete
**Goal:** Toasts surface in top-right honoring DnD; Activity tab in left rail shows full history;
native OS notifications when unfocused.

**Tasks:**

- [x] `ToastBridge.tsx` — subscribes to `activity.appended` for severity ∈
  `success|warning|error`; uses M03 Sonner; respects `notifications.dnd.start`/`end` setting.
- [x] `ActivityFeed.tsx` — collapsible section in left rail below workspaces; scrolling list with
  unread badge; click → navigate to workspace.
- [x] `SettingsDrawer/NotificationsPanel.tsx` — per-event on/off, DnD hours.
- [x] `useNativeNotifications.ts` + `Notification` API gated by setting.
- [x] `useActivities.ts`.

**Files Created/Modified:**

- `apps/web/src/components/ToastBridge.tsx`
- `apps/web/src/components/ActivityFeed.tsx`
- `apps/web/src/components/SettingsDrawer/NotificationsPanel.tsx`
- `apps/web/src/hooks/useNativeNotifications.ts`
- `apps/web/src/hooks/useActivities.ts`
- `apps/web/src/components/WorkspacesSidebar.tsx`
- `apps/web/src/components/TopBar.tsx`
- `apps/web/src/routes/project.tsx`

**Issues Encountered:**

- `sonner` not a direct dep of `apps/web` — added it.
- ActivityTab named ActivityFeed (sits inside WorkspacesSidebar as a collapsible, not a separate tab).

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual: simulate plan ready + CI fail; observe toasts + entries.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

# M23 — Token health panel + status bar + pre-flight check

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — runnable after M05 + M08 + M13.

---

## Goal

Implement SPEC §12.3 + §12.4 + §12.5: a per-user 5-hour-window token usage view derived from
local `~/.claude/projects/` JSONL transcripts, a status-bar pill that's always visible, and a
pre-flight check before spawning parallel agents.

## Depends on

- M05 (settings — to find the `~/.claude/projects/` path, exposed via setting
  `providers.claudeProjectsPath`)
- M08 (workspaces — per-workspace cost attribution)
- M13 (orchestrator — pre-flight check fires before spawning agents)

## Acceptance

- Opening Pixler shows the status pill with a live %.
- Per-workspace attribution lights up after running an agent in one workspace and not another.
- Starting a 3rd agent while at 78% surfaces the confirmation modal.
- `.claudeignore` is seeded in fresh workspaces.
- `pnpm -w typecheck` clean.

## Out of scope

- Cross-machine token reconciliation — local-only in v1.
- Provider-side rate-limit API integration — parsing the local transcripts is enough.

## Files (expected surface)

```
apps/api/src/db/migrations/0009_usage.sql
apps/api/src/usage/usage.module.ts
apps/api/src/usage/usage.service.ts
apps/api/src/usage/usage.controller.ts
apps/api/src/usage/claude-log-parser.service.ts
apps/api/src/usage/mcp-overhead-estimator.service.ts
apps/api/src/orchestrator/preflight.service.ts
packages/shared-types/src/usage.ts
apps/web/src/components/TokenStatusPill.tsx
apps/web/src/components/SettingsDrawer/UsagePanel.tsx
apps/web/src/components/PreflightModal.tsx
apps/web/src/hooks/useUsage.ts
```

---

## Sprint 1 — UsageModule + claude-log parser + usage_snapshots

**Status:** ⏳ pending
**Goal:** Backend reads `~/.claude/projects/` JSONL, builds a time-series, and exposes window /
per-model / per-workspace / historical endpoints.

**Tasks:**

- [ ] `0009_usage.sql` migration with `usage_snapshots`.
- [ ] `UsageModule` + `UsageService` + `UsageController`.
- [ ] `claude-log-parser.service.ts` — walks `~/.claude/projects/`, parses JSONL transcripts;
  emits per-message tokens (input/output/cache-read/cache-write), model, ts.
- [ ] Flush summary snapshots every N seconds.
- [ ] `GET /api/usage/window?hours=5` (with % of cap heuristic from last 4 weeks; fallback
  `usage.5hCap`).
- [ ] `GET /api/usage/per-model?since=&until=`, `GET /api/usage/per-workspace?workspaceId=`
  (cwd-match), `GET /api/usage/historical?range=`.
- [ ] `mcp-overhead-estimator.service.ts` + `GET /api/usage/mcp-overhead`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test usage` + manual: parse a known transcript dir, GET /window returns coherent %.

---

## Sprint 2 — Status bar pill + Usage panel

**Status:** ⏳ pending
**Goal:** Always-visible pill in top-right; Settings → Usage panel with breakdowns + MCP
overhead.

**Tasks:**

- [ ] `TokenStatusPill.tsx` — `73% / 4h 12m`; color shifts green → yellow → red; click pops a
  popover with model breakdown + "Open usage panel" link.
- [ ] `SettingsDrawer/UsagePanel.tsx` — current 5h window, per-model breakdown table +
  sparkline, per-workspace cost, MCP schema overhead list (with "Disable MCP for this workspace"
  one-click toggle), daily/weekly/monthly historical chart.
- [ ] `useUsage.ts`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/web build` + manual: pill updates live; panel charts render.

---

## Sprint 3 — Pre-flight check + token-saving defaults

**Status:** ⏳ pending
**Goal:** Spawning N parallel agents above 70% triggers a confirmation modal; fresh workspaces
seed `.claudeignore`; workspace switch dispatches `/clear`.

**Tasks:**

- [ ] `preflight.service.ts` — hook into M13 `agent-runner.service.ts` before spawning a
  *parallel* agent; if window > 70% with N parallel requested → surface confirmation modal with
  "Don't ask again for 5 min" memory.
- [ ] `PreflightModal.tsx`.
- [ ] On first workspace creation: write `.claudeignore` with
  `node_modules/`, `dist/`, `.next/`, `*.lock`, common artifacts (skip if file exists).
- [ ] On workspace switch: dispatch `/clear` to previous workspace's claude session
  (configurable; default on).
- [ ] On context-spike token events: emit activity "Consider /compact".

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck` + manual: at 78%, spawn 3rd agent → modal appears; fresh workspace gets `.claudeignore`.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

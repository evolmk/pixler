# M23 — Token health panel + status bar + pre-flight check

## Goal

Implement SPEC §12.3 + §12.4 + §12.5: a per-user 5-hour-window token usage view derived from local
`~/.claude/projects/` JSONL transcripts, a status-bar pill that's always visible, and a pre-flight check before spawning parallel agents.

## Depends on

- M05 (settings — to find the `~/.claude/projects/` path, exposed via setting `providers.claudeProjectsPath`)
- M08 (workspaces — per-workspace cost attribution)
- M13 (orchestrator — pre-flight check fires before spawning agents)

## Deliverables

- [ ] api `UsageModule`:
    - `UsageService.parseClaudeLogs()` — walks `~/.claude/projects/`, parses JSONL transcripts:
        - Per-message tokens (input/output/cache-read/cache-write)
        - Model used per message
        - Timestamp
    - Builds an in-memory time-series indexed by timestamp; flushes a summary into a `usage_snapshots` table (migration
      `0009_usage.sql`) every N seconds
    -
  `GET /api/usage/window?hours=5` — current 5-hour-window usage, % of cap (cap heuristic: looks at last 4 weeks of usage to estimate the user's plan tier; falls back to a configurable
  `usage.5hCap` if known)
    - `GET /api/usage/per-model?since=&until=` — model breakdown
    - `GET /api/usage/per-workspace?workspaceId=` — attribute by `cwd` match against the workspace's worktree path
    - `GET /api/usage/historical?range=day|week|month`
    -
  `GET /api/usage/mcp-overhead` — sum of MCP schema bytes injected per turn (best-effort estimate; flag entries that mention MCP server names in their tool list)
- [ ] Web UI:
    - **Status bar pill** (top-right): `73% / 4h 12m` per SPEC §12.4
        - Color shifts green → yellow → red as % climbs
        - Click → popover with model breakdown + "Open usage panel" link
    - **Settings → Usage panel** filled in (this is the "Usage" category — add it to the SettingsDrawer):
        - Current 5-hour window (% + time to reset + bar viz)
        - Per-model breakdown (table + sparkline)
        - Per-workspace cost (table)
        - MCP schema overhead (list of MCPs you have loaded with cost-per-turn estimates) + "Disable MCP for this workspace" one-click toggle
        - Daily/weekly/monthly historical chart
- [ ] **Pre-flight check** (SPEC §12.5):
    - Hook into M13's `agent-runner.service.ts` — before spawning a
      *parallel* agent (i.e., when an active orchestrator process already exists for another workspace), if current window usage > 70% with N parallel agents requested, surface a confirmation modal:
      > You're at 78% of your 5-hour window. Starting 3 parallel agents may exhaust it in ~25 minutes. Proceed?
    - Persist user's "don't ask again for 5 minutes" choice in-memory
- [ ] **Token-saving defaults** (SPEC §12.2):
    - On first workspace creation: write `.claudeignore` to the worktree with `node_modules/`, `dist/`, `.next/`,
      `*.lock`, common build artifacts (skip if file exists)
    - On workspace switch: dispatch `/clear` to the previous workspace's claude session (configurable; default on)
    - When approaching context limit (heuristic: token spike events in transcript): emit an activity "Consider /compact"

## Acceptance

- Opening Pixler shows the status pill with a live %.
- Per-workspace attribution lights up after running an agent in one workspace and not another.
- Starting a 3rd agent while at 78% surfaces the confirmation modal.
- `.claudeignore` is seeded in fresh workspaces.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- Cross-machine token reconciliation — local-only in v1.
- Provider-side rate-limit API integration — parsing the local transcripts is enough.

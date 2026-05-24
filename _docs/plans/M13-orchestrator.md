# M13 — Orchestrator state machine + agent process spawning

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — runnable after M08 + M09 + M11 + M12.

---

## Goal

Implement the state machine in SPEC §4 as a pure, testable package + the api glue that drives it.
End state: a workspace can be told "start the loop" and it spawns the planner, then the reviewer,
gates on approval, executes, validates, opens a PR — with all output streaming to the UI.

## Depends on

- M08 (workspaces give us cwd, branch, ticket id)
- M09 (PTY infrastructure — same node-pty used to run agent CLIs)
- M11 (Pixler Linear CLI for the agent to call)
- M12 (gh wrapper for the PR step)

## Acceptance

- Pure orchestrator package has 100% test coverage in `vitest`.
- Starting a workspace with a simple Linear ticket runs the planner; the planner output streams
  live; when it finishes, the reviewer runs; if approved, the executor runs; the validator runs;
  a PR is opened.
- Auto-approve toggles short-circuit the human gates correctly.
- Rejecting the plan loops back; after 3 rejections the workspace pauses and asks the human.
- Pressing Interrupt kills the running agent and leaves the workspace in a safe state.
- `pnpm -w typecheck` clean.

## Out of scope

- The actual plan file format / storage selection — M14.
- Checkpoint snapshotting — M15.
- Chat-mode polished message bubbles — M16 (the orchestrator emits agent output; M16 renders it
  as chat messages).
- Token-usage tracking / pre-flight check — M23.

## Files (expected surface)

```
packages/orchestrator/src/states.ts
packages/orchestrator/src/events.ts
packages/orchestrator/src/machine.ts
packages/orchestrator/src/loop-limit.ts
packages/orchestrator/src/index.ts
packages/orchestrator/test/machine.test.ts
apps/api/src/orchestrator/orchestrator.module.ts
apps/api/src/orchestrator/orchestrator.service.ts
apps/api/src/orchestrator/orchestrator.controller.ts
apps/api/src/orchestrator/agent-runner.service.ts
apps/api/src/orchestrator/prompt-templates.service.ts
apps/api/src/orchestrator/linear-bridge.service.ts
apps/web/src/components/RightPaneControls.tsx
apps/web/src/components/WorkspaceStateBadge.tsx
apps/web/src/components/SettingsDrawer/ModelsPanel.tsx
apps/web/src/components/ProjectSettingsDrawer/WorkspacesPanel.tsx
apps/web/src/components/ProjectSettingsDrawer/ModelsPanel.tsx
apps/web/src/hooks/useOrchestrator.ts
```

---

## Sprint 1 — Pure orchestrator package + state machine + tests

**Status:** ⏳ pending
**Goal:** `packages/orchestrator` is a standalone library with 100% test coverage. No Nest, no
node-pty.

**Tasks:**

- [ ] `states.ts` — enum + transition table per SPEC §4.1.
- [ ] `events.ts` — union of all events.
- [ ] `machine.ts` — `createMachine(initial, transitions)` + reducer `step(state, event)`
  returning new state + side-effects.
- [ ] `loop-limit.ts` — enforces max-iteration count (default 3, 1–5 configurable).
- [ ] Vitest suite achieving 100% coverage.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/orchestrator test --coverage` — 100% lines/branches.

---

## Sprint 2 — Agent runner + spawner + prompt templates

**Status:** ⏳ pending
**Goal:** api can spawn the right agent CLI per phase, parse exit/output, emit events.

**Tasks:**

- [ ] `agent-runner.service.ts` — spawns via node-pty (reuses M09 infra); resolves command per
  phase per project per workspace.
- [ ] `prompt-templates.service.ts` — interpolates ticket details, plan contents, prior
  reviewer critiques into phase-specific prompts.
- [ ] Env injection: `PIXLER_API_PORT`, `PIXLER_WORKSPACE_ID/PATH/TICKET_ID/BRANCH`.
- [ ] Output parser detects `APPROVED` / `REJECTED` markers (reviewer phase) + success markers.
- [ ] Emit `agent.output`, `agent.state-changed`, `agent.error` events.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test agent-runner` — mock pty, drive each phase, assert events.

---

## Sprint 3 — Orchestrator controller + endpoints + approval gates + Linear bridge

**Status:** ⏳ pending
**Goal:** HTTP surface exists; auto-approve toggles work; workspace state transitions update
Linear.

**Tasks:**

- [ ] `OrchestratorModule` + `OrchestratorService` + `OrchestratorController`.
- [ ] `POST /start`, `/approve`, `/reject`, `/interrupt`, `/stop`; `GET /state`.
- [ ] Approval gates from `settings.gates.autoApprovePlan/Validation/PR` — auto-fire with short
  visible delay.
- [ ] Loop limits: 3× rejection → pause and require human action.
- [ ] Interrupt forwards SIGINT to agent PTY; transitions to safe rest state.
- [ ] `linear-bridge.service.ts` — workspace start → `Todo → In Progress`; PR opened →
  `In Progress → In Review`; PR merged → `In Review → Done`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test orchestrator` + manual: full loop on a test ticket.

---

## Sprint 4 — Web UI: RightPaneControls, StateBadge, Models/Workspaces panels

**Status:** ⏳ pending
**Goal:** All orchestrator UI lights up; users can approve/reject from chat or terminal mode.

**Tasks:**

- [ ] `RightPaneControls.tsx` — Approve/Reject buttons gated by state; visible in both Chat and
  Terminal modes.
- [ ] `WorkspaceStateBadge.tsx` — animates between states with color shift.
- [ ] `SettingsDrawer/ModelsPanel.tsx` — per-role dropdowns (planner/reviewer/executor).
- [ ] `ProjectSettingsDrawer/WorkspacesPanel.tsx` — max parallel agents, loop-limit cap,
  remove-confirmation silence window.
- [ ] `ProjectSettingsDrawer/ModelsPanel.tsx` — project-level overrides.
- [ ] `hooks/useOrchestrator.ts`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual: drive loop end-to-end via UI.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

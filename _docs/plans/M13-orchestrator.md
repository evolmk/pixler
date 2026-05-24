# M13 — Orchestrator state machine + agent process spawning

## Goal

Implement the state machine in SPEC §4 as a pure, testable package + the api glue that drives it. End state: a workspace can be told "start the loop" and it spawns the planner, then the reviewer, gates on approval, executes, validates, opens a PR — with all output streaming to the UI.

## Depends on

- M08 (workspaces give us cwd, branch, ticket id)
- M09 (PTY infrastructure — same node-pty used to run agent CLIs)
- M11 (Pixler Linear CLI for the agent to call)
- M12 (gh wrapper for the PR step)

## Deliverables

- [ ] `packages/orchestrator/` — **pure** logic, no node-pty / no Nest:
    - `states.ts` — enum + transition table matching SPEC §4.1
    - `machine.ts` — `createMachine(initial, transitions)` with reducer-style
      `step(state, event)` returning the new state and any side-effects to dispatch (`spawn-agent`, `apply-approval`,
      `open-pr`, etc.)
    - `events.ts` — event union: `start`, `planner.exit`, `reviewer.exit`, `human.approve`, `human.reject`,
      `executor.exit`, `validator.exit`, `pr.opened`, `pr.merged`, `interrupt`, etc.
    - `loop-limit.ts` — enforces max-iteration count (default 3, configurable per project 1–5)
    - 100% test coverage with `vitest`
- [ ] api `OrchestratorModule`:
    - `POST /api/workspaces/:id/start` — kicks the workspace into PLANNING
    - `POST /api/workspaces/:id/approve` body `{ gate: 'plan'|'validation'|'pr' }`
    - `POST /api/workspaces/:id/reject` body `{ gate, feedback? }`
    - `POST /api/workspaces/:id/interrupt`
    - `POST /api/workspaces/:id/stop`
    - `GET /api/workspaces/:id/state` — current machine state + recent transitions
- [ ] **Agent process spawner** (`agent-runner.service.ts`):
    - Spawns the configured agent CLI via node-pty (same PTY infra as M09; agents stream to the same place as the terminal)
    - Resolves command + args per phase per project per workspace settings:
        - Planner: `claude --permission-mode plan "[prompt]"`
        - Reviewer: `codex exec "Review this plan: [contents]. Reply REJECTED with critique or APPROVED."`
        - Executor: `claude --execute "Implement plan at <plan-path>"`
        - Validator: `claude --execute "/review"`
    - Each `[prompt]` is built from a template that interpolates ticket details, plan contents, prior reviewer critiques
    - Injects env vars: `PIXLER_API_PORT`, `PIXLER_WORKSPACE_ID`, `PIXLER_WORKSPACE_PATH`, `PIXLER_TICKET_ID`,
      `PIXLER_BRANCH` (so agents can call the Pixler Linear CLI seamlessly)
    - Parses agent exit codes / output for `APPROVED` / `REJECTED` (reviewer phase) or success markers
    - Emits `agent.output`, `agent.state-changed`, `agent.error` events
- [ ] **Approval gates** (SPEC §4.3): three toggles in `settings.gates.autoApprovePlan`, `autoApproveValidation`,
  `autoApprovePR` — when enabled, the orchestrator auto-fires the matching event after a short visible delay
- [ ] **Loop limits**: when plan → review fails 3× (configurable), transition to
  `AWAITING_APPROVAL` with the latest plan + reviewer critique and require human action; the UI surfaces "Plan rejected 3 times — your call"
- [ ] **Interrupt / Stop**: forwards `SIGINT` to the agent PTY; transitions to a safe rest state
- [ ] **Workspace state transitions ↔ Linear** (SPEC §6.4):
    - Workspace start → Linear `Todo → In Progress`
    - PR opened → `In Progress → In Review`
    - PR merged → `In Review → Done`
    - All via M10's Linear CLI / `LinearService`
- [ ] Web UI:
    - Right pane in Chat mode: `Approve` / `Reject` buttons go live, gated by state
    - State badge on the workspace card animates between states with a small color shift
    - Right pane in Terminal mode: same approve/reject buttons sit above the xterm view; the PTY *is* the agent's pty
- [ ] **Settings → Models panel
  ** filled in: dropdown per role (planner/reviewer/executor) with the list of models per CLI (planner+executor: Claude Code models; reviewer: codex models). Project Settings → Models override.
- [ ] **Project Settings → Workspaces panel
  ** filled in: max parallel agents, loop-limit cap (1–5), remove-confirmation silence window.

## Acceptance

- Pure orchestrator package has 100% test coverage in `vitest`.
- Starting a workspace with a simple Linear ticket runs the planner; the planner output streams live; when it finishes, the reviewer runs; if approved, the executor runs; the validator runs; a PR is opened.
- Auto-approve toggles short-circuit the human gates correctly.
- Rejecting the plan loops back; after 3 rejections the workspace pauses and asks the human.
- Pressing Interrupt kills the running agent and leaves the workspace in a safe state.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- The actual plan file format / storage selection — M14.
- Checkpoint snapshotting — M15.
- Chat-mode polished message bubbles — M16 (the orchestrator emits agent output; M16 renders it as chat messages).
- Token-usage tracking / pre-flight check — M23.

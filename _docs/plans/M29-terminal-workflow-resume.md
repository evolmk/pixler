# M29 — Terminal-driven workflow execution + resume/retry

**Status:** ⏳ IN_PROGRESS   <!-- ⏳ IN_PROGRESS | ✅ COMPLETE -->
**Modified:** 2026-05-25
**Current Status:** Sprint 1 complete — SQLite persistence, shared-types DTOs, WorkflowRunsService, WorkflowRunner rehydration + external step resolver, boot rehydration, OrchestratorService wired.

---

## Goal

Shift AI workflow-step execution from Pixler auto-spawning `claude --execute "<prompt>"` to a
**terminal-driven** model that preserves subscription pricing (no Agent SDK / headless). For the
current step, Pixler presents the step's prompt above the Big Terminal (3-line accordion,
expandable, copy icon) plus a "Send to terminal" button that types it into the live Claude session;
bash/non-AI steps still auto-run. Workflow runs become **resumable**: run state and per-attempt
context persist to SQLite (survives app restart), the user can stop a running step and retry *any*
step with optional extra text context, and a retry that touches files can restore the pre-step
checkpoint. References SPEC §4A (workflow engine), §4.5 (Chat vs Terminal), §8.6 (Terminal UI),
§13 (Checkpoints). This is the model SPEC §4A.1 describes — "every AI step spawns a Claude Code
terminal session. No Agent SDK / API credits" — made human-driven.

**Note on coexistence:** only the **workflow path** becomes terminal-driven. Workspaces with no
ticket or no label matching a workflow still fall through to the hardcoded FSM
(`OrchestratorService.runEffects`), which keeps its current auto-spawn behavior. That split is
intentional for this milestone.

## Depends on

- M13 (orchestrator state machine + agent process spawning — the execution path being reworked)
- M28 (workflow engine — `WorkflowRunner`, step types, presets)
- M15 (checkpoints — pre-step snapshot + rollback used by the retry path)
- M09 (terminal — node-pty session we send prompts into)

## Acceptance

How we know this is done (functional, observable, separate from "did you write the code"):

- Starting a workflow on a labeled ticket presents the first AI step's prompt as an event/accordion
  and does **not** auto-spawn `claude --execute`; a `bash` step still runs automatically.
- "Send to terminal" types the step prompt into the workspace's interactive terminal session.
- "Mark step done" advances AI steps; bash steps auto-advance on exit.
- Stopping a running step leaves the run **paused and resumable** (run record not deleted).
- Retrying any step re-presents its prompt with the user's added text context appended, writes a
  new attempt row, and (for file-writing steps) offers to restore the pre-step checkpoint with
  "Restore pre-step checkpoint (recommended)" as the default.
- Closing and reopening Pixler preserves a paused run's state (step index, context, attempts).
- `pnpm -w typecheck` clean.

## Out of scope

- **Attachments/screenshots** in added context — text-only for v1 (a later milestone).
- **Heuristic step-completion detection** — AI-step advance is manual by design.
- **Headless / Agent SDK execution** — explicitly rejected to keep subscription pricing.
- The hardcoded fallback state machine's execution path — it **keeps its current auto-spawn UX**;
  M29 only touches it as needed to keep it compiling (workflow path is the focus).
- The other recommended features — cost-per-run attribution, PR-review→agent loop, Linear batch
  queue — captured in `_docs/todo-features.md` (unplanned).

## Files (expected surface)

```
apps/api/src/db/migrations/0012_workflow_runs.sql        (new — NOT 0010/0011, those exist; bump schema_version→12)
apps/api/src/workflows/workflow-runs.service.ts          (new — persistence/CRUD + run↔checkpoint linkage)
packages/orchestrator/src/workflow-runner.ts             (resume-from-step, rehydration, external step resolver)
packages/orchestrator/src/workflow-types.ts              (run/attempt/persisted-state types)
packages/shared-types/src/workflows.ts                   (WorkflowRunDto, StepAttemptDto, RetryStepDto, AddContextDto)
packages/shared-types/src/events.ts                      (formalize workflow.step + step-prompt/step-advanced)
apps/api/src/orchestrator/orchestrator.service.ts        (terminal-driven executeWorkflowStep, stop/retry/advance, boot rehydrate)
apps/api/src/orchestrator/orchestrator.controller.ts     (new endpoints under orchestrator/:workspaceId/…)
apps/api/src/terminals/terminals.service.ts              (reuse write()/getForWorkspace()/findOrCreate())
apps/api/src/checkpoints/checkpoints.service.ts          (reuse rollback(); prefer stash apply for repeat retries)
apps/web/src/hooks/useWorkflowState.ts                   (EXTEND — add paused/awaiting_run; don't rebuild)
apps/web/src/components/WorkflowRunPanel.tsx             (new — step list + prompt accordion + controls)
apps/web/src/components/StepPromptAccordion.tsx          (new — 3-line accordion, expand, copy)
apps/web/src/components/RetryStepDialog.tsx              (new — add-context + checkpoint-restore choice; pattern: RollbackConfirmModal)
```

---

## Sprint 1 — Run-state persistence + resumable runner

**Status:** ✅ complete
**Goal:** A workflow run's state, step context, and per-attempt context persist to SQLite; the
`WorkflowRunner` can rehydrate and resume from an arbitrary step index and block an AI step on an
external resolver; paused runs rehydrate after an app restart.

**Tasks:**

- [x] Add migration **`0012_workflow_runs.sql`** (0010/0011 are taken — `crashes`,
      `model_registry`): `workflow_runs` (id, workspace_id, workflow_name, status,
      current_step_index, context_json, created_at, updated_at) and `workflow_step_attempts`
      (id, run_id, step_id, attempt_no, added_context, status, **checkpoint_id** (FK→checkpoints,
      nullable), started_at, completed_at, error). End with `UPDATE meta SET value = '12'`.
- [x] shared-types: add `WorkflowRunDto`, `WorkflowStepAttemptDto`, `RetryStepDto`,
      `AddContextDto`; extend `WorkflowStatusDto` with `runId` + `persisted`; add `'awaiting_run'`
      to the step-status union (runner + DTO + `useWorkflowState`).
- [x] `workflow-runs.service.ts`: create/load/update run + append attempt + record the
      `checkpoint_id` taken before a step; resolve by workspaceId.
- [x] `WorkflowRunner`: accept initial `{ steps, currentStepIndex, context }` for rehydration;
      add `resetFrom(index)` (mark target + later steps `pending`, clear their context); resume
      entry point that starts the loop at `currentStepIndex` instead of 0.
- [x] **External step resolver** (the key control-flow change): AI steps must block until resolved
      externally — add `waitForStepDone()` + `resolveStep(outcome)` mirroring the existing
      `waitForApproval()`/`resolve()` (workflow-runner.ts:130-146). The executor for an AI step
      emits its prompt and awaits this resolver; bash steps resolve on process exit.
- [x] Persist run state on each step transition (hook the existing `onEvent`).
- [x] Boot rehydration: on `OrchestratorService` init (or lazily in `getState`/resume), reload any
      `paused` runs from SQLite into `workflowRunners` so the UI can resume after a restart.
- [x] Rebuild `@pixler/shared-types`.

**Files Created/Modified:**

- `apps/api/src/db/migrations/0012_workflow_runs.sql` (new)
- `apps/api/src/db/database.service.ts` (added migration 12)
- `packages/shared-types/src/workflows.ts` (WorkflowRunDto, WorkflowStepAttemptDto, RetryStepDto, AddContextDto; extended WorkflowStatusDto; awaiting_run status)
- `packages/shared-types/src/events.ts` (WorkflowEvent union — workflow.step, step-prompt, step-advanced, run-updated)
- `packages/shared-types/src/index.ts` (exports WorkflowRunDto, WorkflowStepAttemptDto, RetryStepDto, AddContextDto, WorkflowEvent)
- `packages/orchestrator/src/workflow-types.ts` (awaiting_run added to StepStatus)
- `packages/orchestrator/src/workflow-runner.ts` (rehydration, resetFrom, runFrom, waitForStepDone, resolveStep, pause)
- `packages/orchestrator/src/server.ts` (exports WorkflowRehydrateOptions)
- `apps/api/src/workflows/workflow-runs.service.ts` (new)
- `apps/api/src/workflows/workflows.module.ts` (added WorkflowRunsService)
- `apps/api/src/orchestrator/orchestrator.service.ts` (OnModuleInit, boot rehydration, emitStepEvent, workflowRunIds tracking, runWorkflow persistence)

**Issues Encountered:**

- Boot rehydration cast: `run.context as unknown as WorkflowContext` needed since DTO types it as `Record<string, unknown>`

**Verify:** `pnpm --filter @pixler/shared-types build && pnpm --filter @pixler/orchestrator build && pnpm --filter @pixler/api typecheck` — all pass.

---

## Sprint 2 — Terminal-driven step execution

**Status:** ⏳ pending
**Goal:** AI steps present their prompt instead of auto-spawning Claude; bash steps auto-run; step
advancement is manual for AI steps and automatic for bash.

**Tasks:**

- [ ] Refactor `OrchestratorService.executeWorkflowStep`: for AI steps
      (planning/reviewing/executing/validating/`prompt`), build the prompt, emit a
      `workflow.step-prompt` event `{ stepId, prompt }`, set status `awaiting_run`, and **await the
      runner's `waitForStepDone()`** — do **not** call `AgentRunnerService.run`. Bash steps auto-run.
- [ ] **Reviewing-step verdict:** with no stdout to parse (was agent-runner.service.ts:111-121),
      the human records the verdict — *Mark done* = approved; reuse the existing approve/reject
      controls (`OrchestratorService.approve/reject` already call `wfRunner.resolve`). Map
      reject→`resolveStep('rejected')` so the runner's review loop still works.
- [ ] Terminal wiring: `POST /orchestrator/:workspaceId/step/:stepId/send-to-terminal` resolves the
      workspace's terminal via `TerminalsService.getForWorkspace`/`findOrCreate` and `write()`s the
      prompt. Pick a single target terminal (primary); if no interactive Claude session is active,
      return a flag so the UI can offer "Open terminal + start Claude" instead of blindly writing
      (raw `write()` to a shell prompt would execute the text as a command).
- [ ] `POST /orchestrator/:workspaceId/step/done` → `resolveStep('done')`, persist + emit
      `workflow.step-advanced`; bash steps advance on PTY exit.
- [ ] **Formalize events in `shared-types/events.ts`**: the existing `workflow.step` event is only
      typed as a local interface in `useWorkflowState.ts` and is absent from the shared union — add
      it plus `workflow.step-prompt` and `workflow.step-advanced`.
- [ ] Keep new endpoints under `orchestrator/:workspaceId/…` to match existing controller params.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api typecheck && pnpm --filter @pixler/api test` — a feature workflow emits a `step-prompt` for `create_plan` and spawns no agent, the step stays `awaiting_run` until `/step/done`, and a `bash` step runs + auto-advances.

---

## Sprint 3 — Stop, retry-any-step, add-context, checkpoint restore

**Status:** ⏳ pending
**Goal:** The user can stop a running step (run stays resumable), retry any step with optional
appended text context, and optionally restore the pre-step checkpoint.

**Tasks:**

- [ ] **Per-step checkpoints:** today only the executing phase snapshots (`triggers.onBeforeExecution`,
      trigger `before_execution`) and the `checkpoints` table has no step/run link. Take a snapshot
      before each **file-writing** AI step and record its id in `workflow_step_attempts.checkpoint_id`
      so retry can find the right pre-step state.
- [ ] `POST /orchestrator/:workspaceId/stop-step`: interrupt the step's terminal agent
      (`TerminalsService` Ctrl-C / `AgentRunnerService.interrupt`) but keep the run record
      **paused/resumable** — do not delete the runner/run; set status `paused`.
- [ ] `POST /orchestrator/:workspaceId/retry-step` (body `RetryStepDto`: `stepId`, `addedContext?`,
      `restoreCheckpoint?`): `resetFrom(stepIndex)`, append a new attempt row with `addedContext`,
      re-emit the prompt with the context appended, resume forward.
- [ ] Checkpoint restore: when `restoreCheckpoint` is true, call
      `CheckpointsService.rollback(checkpoint_id)` for the step's recorded checkpoint **before**
      re-presenting. Use `git stash apply` (already the fallback at checkpoints.service.ts:111)
      rather than `pop`, so repeat retries of the same step still have a checkpoint to restore.
- [ ] Persist added context per attempt; surface attempts in the run record.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api typecheck && pnpm --filter @pixler/api test` — retry writes a new attempt row with the added context appended; restore invokes `rollback` against the step's recorded checkpoint; a second retry still finds the checkpoint (apply, not pop).

---

## Sprint 4 — Web UI: run panel, prompt accordion, controls

**Status:** ⏳ pending
**Goal:** A workflow run panel shows step status, presents the current step's prompt, and exposes
send-to-terminal, mark-done, stop, and retry-with-context.

**Tasks:**

- [ ] **Extend `useWorkflowState`** (do not rebuild): add `paused`/`awaiting_run` to its status
      union + `STEP_EVENT_STATUS` map, and handle the new `workflow.step-prompt`/`step-advanced`
      events. Add mutation helpers (send-to-terminal, mark-done, stop, retry) hitting the new
      endpoints.
- [ ] `WorkflowRunPanel` — ordered step list with status badges; current/failed step expanded;
      shows per-step attempt history (added context per attempt) from the run record.
- [ ] `StepPromptAccordion` — 3-line prompt preview, expand toggle, copy icon, "Send to terminal"
      button; when no active Claude session, show "Open terminal + start Claude" instead.
- [ ] "Mark step done" on AI steps; auto-advance reflected for bash steps.
- [ ] `RetryStepDialog` (pattern: existing `RollbackConfirmModal` from M15) — add-context textarea
      + checkpoint choice with "Restore pre-step checkpoint (recommended)" default-selected, showing
      the checkpoint's label/time; per-step Retry + Stop controls.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck` clean; in-browser smoke (Playwright) on a workspace with a labeled ticket — prompt accordion renders, Send-to-terminal types into the terminal (and offers start-Claude when none is running), Mark-done advances, Retry re-presents the prompt with appended context and shows the attempt in history.

---

## Prompt that created this plan

```
[From recommendations review] User wants "Mid-workflow resume/retry" (feature #1 of 4).
Interview outcomes:
- Persistence: SQLite (survives restart).
- Granularity: retry ANY step (re-runs it + everything after); on re-run user can add context
  via input that is passed to the agent when the step runs.
- Checkpoint on retry: offer a choice in the dialog, with "restore pre-step checkpoint" marked
  (recommended) / default.
- Context: TEXT ONLY. Key architecture: agent runs in the Big Terminal (interactive claude,
  subscription pricing) — NOT the Agent SDK. Pixler presents the step's prompt either by starting
  Claude in the terminal with a prefilled prompt, or showing it above the terminal as a 3-line
  accordion (expandable, copy icon) to paste in.
- Stop: user can stop/interrupt a running step, change context, then proceed — "proceed" means
  re-run the step from its start with the added context (a killed agent can't resume mid-run).
- Presentation: accordion + "Send to terminal" button.
- Step advance: manual for AI steps, automatic for bash steps.
- Scope: convert AI steps to terminal-driven (replace programmatic claude --execute); bash/non-AI
  steps still auto-run.
- Context persistence: save per-attempt context to run history.
```

---

## Consultant Review (2026-05-25)

### Risks & gaps

- **[P0]** **Migration number collides.** Plan says `0010_workflow_runs.sql`, but `0010_crashes.sql`
  and `0011_model_registry.sql` already exist. Use **`0012_workflow_runs.sql`**, and bump
  `schema_version` in `meta` to `12` (every migration does this, e.g. `0007_checkpoints.sql` ends
  with `UPDATE meta SET value = '7'`).
- **[P0]** **The runner's control flow must change, not just its inputs.** Today
  `WorkflowRunner.run()` does `await this.executor(step, ctx)` and treats the resolved value as the
  step output. In the terminal-driven model an AI step "finishes" when the human clicks *Mark done*
  (or Stop), via an external endpoint — not when a promise naturally resolves. So the AI-step
  executor must **block on an external resolver**, exactly like the existing `waitForApproval()` /
  `resolve()` pattern (workflow-runner.ts:69, 130-146). Sprint 2 should model AI steps as
  "emit prompt → `await waitForStepDone()`" with a `resolveStep(workspaceId, outcome)` method.
  Designing this up front avoids a Sprint-2 rewrite.
- **[P1]** **`reviewing` step verdict has no programmatic source anymore.** Today the reviewer's
  APPROVED/REJECTED is parsed from agent stdout (agent-runner.service.ts:111-121) and drives the
  FSM/runner. With no auto-spawn, that parsing won't run. Decide how a human-driven review step
  records its verdict (likely: *Mark done* = approved; reuse the existing approve/reject controls).
- **[P1]** **Checkpoints aren't linked to steps/runs, and only the executing phase takes one.**
  `triggers.onBeforeExecution` fires for the executing phase only, tagged `trigger:'before_execution'`
  (triggers.service.ts:23-26); the `checkpoints` table (0007_checkpoints.sql) has **no step_id/run_id**.
  To offer "restore pre-step checkpoint" per retried step, M29 must (a) snapshot before each
  file-writing AI step and (b) link checkpoint↔run/step (add a column or a mapping table). Also
  `CheckpointsService.rollback` uses `git stash pop` (checkpoints.service.ts:107) which **consumes**
  the stash — a second retry of the same step would find no checkpoint. Prefer `git stash apply`
  (already the fallback at :111) or re-snapshot so repeat retries work.
- **[P1]** **"Send to terminal" needs a target terminal and an active Claude session.** A workspace
  can have multiple terminals (`workspaceTerminals: Map<wsId, Set<terminalId>>`,
  terminals.service.ts:19); `write(id, data)` (line 85) sends raw text to whatever's at the prompt.
  If the terminal is at a shell prompt (not inside `claude`), the prompt text executes as a shell
  command. Specify: which terminal is targeted (`getForWorkspace`/`findOrCreate`), and the affordance
  when no interactive Claude session is running (e.g., "Start Claude here" vs "Send prompt").
- **[P1]** **Boot-time rehydration is unspecified.** Persisting to SQLite is necessary but not
  sufficient — on API restart, `workflowRunners` (orchestrator.service.ts:21) is empty. Add a path
  that rehydrates a paused run (lazily on access, or on boot) so the UI can actually resume.
- **[P1]** **Two execution models will coexist.** The hardcoded FSM fallback (`runEffects` →
  `RUN_PLANNER` etc., orchestrator.service.ts:325-363) still auto-spawns via `AgentRunnerService`.
  Out-of-scope correctly leaves it, but state explicitly that non-ticket / no-matching-label
  workspaces keep the old auto-spawn UX, so the inconsistency is intentional, not a bug.

### Spec compliance

- **[P1]** The terminal-driven direction directly satisfies **SPEC §4A.1** — "Claude Code native:
  every AI step spawns a Claude Code terminal session. No Agent SDK / API credits." Worth citing in
  the Goal; the current auto-spawn `claude --execute` path is arguably *less* aligned than this plan.
- **[P1]** Aligns with **SPEC §4.5** (Chat vs Terminal both over the same interactive `claude` via
  node-pty) and **§8.6** ("Shadow mode: take over the agent's session — Interrupt"). The Stop→resume
  behavior is the §8.6 interrupt made non-destructive.
- _(P2)_ `WorkflowStatusDto.status` already includes `'paused'` (shared-types/workflows.ts:30), so
  that state is partly modeled; the runner just never sets it today.

### Reuse opportunities

- **[P1]** **Extend `useWorkflowState`, don't replace it.** `apps/web/src/hooks/useWorkflowState.ts`
  already subscribes to `workflow.step` events and maps them to live step status. Sprint 4's
  `useWorkflowRun` should build on it. Note its `WorkflowRunState.status` union (`running|completed|
  failed|cancelled|idle`) and `STEP_EVENT_STATUS` map must gain `paused` + `awaiting_run`.
- **[P1]** **Formalize the workflow socket event in shared-types.** `workflow.step` is currently
  typed only as a local `WorkflowSocketEvent` interface inside the hook and is **absent from
  `packages/shared-types/src/events.ts`**. Sprint 2 should add `workflow.step` (and the new
  `workflow.step-prompt` / `workflow.step-advanced`) to the shared event union so web + api agree.
- **[P1]** **Use `CheckpointsService.rollback(checkpointId)`** (checkpoints.service.ts:98) for the
  restore path, and the existing `RollbackConfirmModal` (M15) as a pattern for `RetryStepDialog`.
- **[P2]** Mirror the existing controller param style — `@Post('start')` etc. use
  `@Param('workspaceId')` (orchestrator.controller.ts). Keep new endpoints under
  `orchestrator/:workspaceId/...` for consistency (plan writes `:ws`).

### Enhancements

- **[P1]** When "Send to terminal" finds no active Claude session, offer a one-click
  "Open terminal + start Claude" so the flow isn't a dead end (DX; needed for the model to work).
- **[P2]** **Attempt-history view.** Since per-attempt context is persisted, show prior attempts and
  their added context on the step in the run panel — cheap given the data is already there, and a
  nice audit trail for "why was this re-run".
- **[P2]** Surface the resolved checkpoint label/time in `RetryStepDialog` so the user knows exactly
  what state "Restore pre-step checkpoint (recommended)" rolls back to.

### Changelog

- 2026-05-25: Initial consultant review
- 2026-05-25: Folded findings into the plan body — migration renumbered to `0012` (+schema_version),
  external step-resolver design added to Sprint 1, reviewing-verdict + terminal-target + event
  formalization in Sprint 2, per-step checkpoint linkage + stash-apply in Sprint 3, extend
  `useWorkflowState` + RollbackConfirmModal reuse + start-Claude affordance + attempt history in
  Sprint 4. Both P0s resolved.


# Pixler — TODO / Future Features

Backlog of features not yet planned or built. Each entry is a candidate milestone; before
implementing, run the pre-plan interview (`CLAUDE.local.md`) and write a proper `_docs/plans/M<N>-*.md`.

Captured 2026-05-25 from a spec-vs-codebase review. The first recommended feature became
**M29 — Terminal-driven workflow execution + resume/retry** (`_docs/plans/M29-terminal-workflow-resume.md`);
the three below are still unplanned.

---

## 1. Cost-per-run attribution

**What:** Tie token spend to a specific workspace / workflow run, not just the rolling 5-hour window.

**Why:** The pre-flight check and token-health panel exist, but spend isn't attributable per run.
Pairs naturally with the M29 run records — "this run cost X" makes the pre-flight warning actionable.

**Touchpoints / reuse:**
- `apps/api/src/usage/claude-log-parser.service.ts` already parses `~/.claude/projects/` JSONL.
- M29's new `workflow_runs` table is the join target (attribute parsed usage to a run by time window + workspace).
- `apps/web` token-health panel + status pill (M23) for surfacing per-run cost.

**Open questions for the interview:** attribution heuristic (time-window vs explicit markers); per-step
vs per-run granularity; how to handle the human-in-terminal model where Pixler doesn't spawn the agent.

---

## 2. PR-review-comment → agent loop

**What:** Pull PR review comments back into an `/address-review` step so the agent resolves feedback
without a human relaying it.

**Why:** Review comments are already surfaced in the Checks tab; closing the loop back to the agent
is the missing half.

**Touchpoints / reuse:**
- `apps/api/src/github/*` — PR + review-comment fetching already exists (M12).
- M29's terminal-driven step model — an `/address-review` step would present the comments-as-prompt
  the same way other AI steps do.
- Orchestrator/workflow engine — likely a new built-in step type or a `prompt` step variant.

**Open questions for the interview:** triggered manually vs on new-comment webhook (webhooks are v2);
how comments are formatted into the prompt; whether it's a workflow step or an ad-hoc action.

---

## 3. Batch queue from a Linear filter

**What:** Kick off N workspaces from a saved Linear query, with a max-parallel cap.

**Why:** Today workspaces are created one ticket at a time. A batch queue would let a saved filter
fan out into multiple runs under a concurrency limit.

**Touchpoints / reuse:**
- `apps/api/src/orchestrator/preflight.service.ts` + `countRunning()` — existing concurrency/preflight basis.
- `apps/api/src/linear/*` — saved-query / filter fetching.
- Project setting "Max parallel agents" (SPEC §10.3 Workspaces) is the cap to enforce.

**Open questions for the interview:** queue persistence + resume (SQLite, like M29); how the max-parallel
cap interacts with the 5-hour-window pre-flight; UI for the queue (list, pause, reorder). Largest scope
of the three.

---

## Known spec gap (separate from the above)

- **Deployment previews (Vercel/Netlify)** — SPEC §8.8 lists these in the Checks tab; no code exists
  for either provider. Not yet scheduled.

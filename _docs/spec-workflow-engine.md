# Workflow Engine Spec

**Status:** Draft — 2026-05-25  
**Scope:** YAML-driven workflow presets that take a Linear issue from "Todo" to "Merged PR", with per-step model selection, pluggable storage providers, and an in-app editor.

---

## Overview

Pixler's workflow engine replaces the current hardcoded orchestrator state machine with a **file-first, YAML-defined system**. Each workflow type (bugfix, quickfix, feature) is a single YAML file describing the ordered stages the agent follows — which model runs each stage, whether human approval is required, and where artifacts (plans, diffs, QA reports) get stored.

Workflows are selected automatically when a user opens a task, based on the issue's Linear label. The user can override before execution begins.

### Design principles

- **File-first**: workflows live in folders on disk, version-controlled, shareable by copy-paste.
- **Per-step model selection**: expensive reasoning steps can use Opus; cheap scaffolding steps can use Haiku.
- **Local storage**: plan files are written to a local folder (default `_plans` in the repo root), configurable per project.
- **Claude Code native**: no agent SDK / API credits. Every AI step spawns a Claude Code terminal session (`claude` CLI).
- **Human gates are explicit**: `approval` steps in the YAML, not hardcoded in the state machine.

---

## Workflow file locations

```
~/.config/pixler/workflows/          # user-global custom workflows (takes priority)
<repo>/.pixler/workflows/            # repo-scoped custom workflows (takes priority over defaults)
<pixler-app>/workflows/defaults/     # built-in workflows shipped with Pixler
```

Resolution order (highest priority first): repo-scoped → user-global → built-in defaults.  
Files with the same `name` field shadow lower-priority files. Archiving a workflow means adding `archived: true` to the YAML — it disappears from the UI but isn't deleted.

---

## Plan storage

Plans are stored as `.md` files in a **local folder**. By default that's `_plans` in the repo root.
The folder is configurable via the **Plan folder** setting (`plans.fileDir`) — globally and overridable
per project.

- A **relative** folder (e.g. `_plans`, `docs/plans`) resolves against the repo root.
- An **absolute** path (or one starting with `~`) is used as-is.

The Plans settings panel shows the full resolved path beneath the input as you type. Changing the
folder does not migrate existing files — only new plans are written to the new location.

---

## Workflow YAML format

```yaml
# Required fields
name: feature                        # matched against Linear label (case-insensitive)
description: "Full feature workflow — plan → review → implement → QA"
version: 1

# Optional workflow-level model defaults (overridden per step)
model: claude-sonnet-4-6             # default for all steps
provider: claude                     # claude | codex

steps:
  - id: review_issue
    type: builtin:review_issue       # see Built-in step types below
    label: "Review Issue"

  - id: create_plan
    type: builtin:create_plan
    label: "Create Implementation Plan"
    model: claude-opus-4-7           # per-step override
    skip_if: "$issue.plan_linked"    # skip when issue already has a plan

  - id: approve_plan
    type: approval
    label: "Approve Plan"
    message: |
      Plan saved to {{ plan_filename }}.
      Review it, then approve to begin implementation.
    skip_if: "$workflow.skip_plan_review"   # user-level override toggle

  - id: review_plan
    type: builtin:review_plan
    label: "Plan Review (secondary model)"
    model: claude-opus-4-7
    skip_if: "$workflow.skip_plan_review"

  - id: implement
    type: builtin:run_plan
    label: "Implement"
    model: claude-sonnet-4-6

  - id: qa_review
    type: builtin:qa_review
    label: "QA Code Review"
    model: claude-opus-4-7
    on_findings: prompt_user         # prompt_user | auto_fix | skip

  - id: open_pr
    type: builtin:open_pr
    label: "Open Pull Request"
```

### Step types

| Type | Description |
|------|-------------|
| `builtin:review_issue` | Fetch issue from Linear, display `#issue-details`, ask user to confirm or edit |
| `builtin:create_plan` | Generate implementation plan from issue context; save to storage provider |
| `builtin:review_plan` | Second-model review pass; appends findings to plan file |
| `builtin:run_plan` | Execute plan in Claude Code terminal session (spawns agent, streams output) |
| `builtin:qa_review` | Run lint + typecheck + tests; ask Claude to review diff for correctness |
| `builtin:open_pr` | Create GitHub PR, link in Linear issue |
| `approval` | Human gate — pause, display `message`, wait for Approve / Edit / Cancel |
| `prompt` | Inline Claude prompt string (for lightweight custom steps) |
| `bash` | Shell script step (no AI involved) |

### Conditional fields

- `skip_if` — JS expression over `$issue`, `$workflow`, `$step.<id>.output`; step is skipped when truthy
- `on_error` — `fail` (default) | `skip` | `retry`
- `retry.max_attempts` / `retry.delay_ms`

---

## Built-in workflow presets

### `bugfix.yaml` — simple

```yaml
name: bugfix
description: "Simple bug fix: issue → implement → QA"
steps:
  - { id: review_issue,  type: builtin:review_issue }
  - { id: implement,     type: builtin:run_plan,    model: claude-sonnet-4-6 }
  - { id: qa_review,     type: builtin:qa_review,   on_findings: prompt_user }
  - { id: open_pr,       type: builtin:open_pr }
```

### `quickfix.yaml` — minimal

```yaml
name: quickfix
description: "One-liner fix: issue → implement (no plan, no QA gate)"
steps:
  - { id: review_issue,  type: builtin:review_issue }
  - { id: implement,     type: builtin:run_plan,    model: claude-haiku-4-5-20251001 }
  - { id: open_pr,       type: builtin:open_pr }
```

### `feature.yaml` — full

```yaml
name: feature
description: "Full feature: plan → review → implement → QA → PR"
model: claude-sonnet-4-6
steps:
  - { id: review_issue,  type: builtin:review_issue }
  - { id: create_plan,   type: builtin:create_plan,   model: claude-opus-4-7 }
  - { id: approve_plan,  type: approval,              message: "Review {{ plan_filename }} then approve." }
  - { id: review_plan,   type: builtin:review_plan,   model: claude-opus-4-7 }
  - { id: implement,     type: builtin:run_plan }
  - { id: qa_review,     type: builtin:qa_review,     on_findings: prompt_user }
  - { id: open_pr,       type: builtin:open_pr }
```

---

## Template variables

Available in `message`, `skip_if`, and `prompt` fields.

| Variable | Value |
|----------|-------|
| `{{ issue.id }}` | Linear issue short ID (e.g. `PIX-42`) |
| `{{ issue.title }}` | Issue title |
| `{{ issue.label }}` | Linear label (`bugfix` / `quickfix` / `feature`) |
| `{{ issue.project }}` | Project name |
| `{{ issue.modified }}` | Last modified (12-hr format) |
| `{{ issue.description }}` | Full issue body |
| `{{ plan_filename }}` | `plan-{{ issue.id }}-{{ issue.slug }}.md` |
| `{{ plan_summary }}` | First 10 lines of plan file (collapsible in terminal) |
| `{{ plan_review }}` | `No` or `<model> on <date>` |
| `$issue.plan_linked` | Boolean — plan file is attached to issue |
| `$workflow.skip_plan_review` | Boolean — user toggled "skip review" in modal |

### `#issue-details` display format (compact)

```
PIX-42 — Dark mode flicker on sidebar | bugfix | Pixler Web | May 24 2026 3:14 PM
When toggling dark mode, the sidebar background flashes white for ~100ms.
plan: plan-PIX-42-dark-mode-flicker.md
--- Plan Preview (first 10 lines) ---
# Plan: Dark mode flicker…
…
Plan reviewed: No
```

---

## UI flow — starting a task

### Entry point: Repo Tasks list → "+" button

Clicking **+** opens the **New Task modal** with two tabs:

**Tab 1 — Create Issue**
- Prompt field → auto-generates title, description, and label via Claude
- Workflow auto-selected from label; dropdown to override
- "Create & Start" button

**Tab 2 — Load Issue**
- Search field (typeahead against open Linear issues)
- Shows `#issue-details` inline after selection
- Workflow auto-selected from label; dropdown to override
- "Start" button

### After issue is confirmed

The modal transitions to a **Workflow Preview panel**:
- Lists every step with its model assignment and skip status
- Toggle: "Skip plan review" (sets `$workflow.skip_plan_review`)
- "Begin" button starts the first step in a terminal session

### During execution

- Active step is highlighted in the Workflow panel (left sidebar)
- Terminal streams Claude Code output (existing xterm.js panel)
- `approval` steps pause execution and surface a card: **Approve / Edit / Cancel**
- QA findings surface inline with "Auto-fix" and "Review manually" buttons

---

## In-app workflow editor

Accessible from **Settings → Workflows**.

- Lists all discovered workflows (grouped: built-in / repo / user-global)
- Each row: name, label match, step count, storage, last modified
- Actions: **Edit** (opens YAML editor with syntax highlighting) | **Duplicate** | **Archive**
- "New Workflow" button: starts from a blank template or copies a built-in
- Save writes to `~/.config/pixler/workflows/<name>.yaml` (user-global) unless the file originated from a repo path
- "Open in Finder / Explorer" button for the workflow folder (easy copy-paste sharing)

---

## Plan folder UI

**Settings → Plans** (global) and **Project Settings → Plans** (per project)

- "Plan folder" text input — default `_plans`
- Full resolved absolute path shown beneath the input, updating as you type
- Project value overrides the global default

---

## Relation to current orchestrator

The existing `@pixler/orchestrator` state machine (`planning → reviewing → executing → validating` + gate phases) maps cleanly to this YAML model:

| Current phase | Equivalent built-in step |
|---------------|--------------------------|
| `planning` | `builtin:create_plan` |
| `reviewing` / `awaiting_plan_approval` | `builtin:review_plan` + `approval` |
| `executing` | `builtin:run_plan` |
| `validating` / `awaiting_validation_approval` | `builtin:qa_review` + `approval` |

Migration path: the state machine becomes a workflow runner that interprets YAML rather than hardcoding transitions. Gate phases become `approval` steps. The orchestrator package gains a `WorkflowRunner` class; the hardcoded states remain as the fallback when no workflow file is found.

---

## Open questions

1. **Repo-scoped vs user-global precedence** — should a repo `.pixler/workflows/` file completely shadow a same-named user-global file, or merge step lists?
2. **Parallel steps** — Archon supports DAG parallelism via `depends_on`. Do we need it for v1, or is linear execution enough?
3. **Workflow versioning** — if a workflow YAML changes while a run is in progress, does the in-flight run continue on the old version?
4. **Claude Code session handoff** — each `builtin:run_plan` step opens a fresh terminal. Should subsequent steps in the same workflow share a session, or always start fresh?
5. **Linear write-back** — when should the plan filename be written back to the issue (on save, or on approval)?

---

*Sources: [Archon workflow authoring guide](https://archon.diy/guides/authoring-workflows/) · [Archon GitHub](https://github.com/coleam00/Archon)*

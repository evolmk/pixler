# Portable Plan & Sprint System

A self-contained, resumable planning system you can drop into any repo. The **plan file is the
single source of truth** for what's done and what isn't — so if a session hangs, crashes, or you
walk away mid-milestone, you re-open the file and know exactly where you are.

No Kanban queues, no review pipeline, no multi-agent routing, no todo system. Just: write a plan,
break it into sprints, and keep the file in lockstep with the code as you go.

---

## What's in this bundle

```
PORTABLE-PLAN-SYSTEM/
├── README.md                              ← this file (install guide)
├── CLAUDE.md                              ← merge into your repo's CLAUDE.md
├── CLAUDE.local.md                        ← merge into your repo's CLAUDE.local.md (optional)
├── _docs/plans/
│   ├── templates/
│   │   ├── .TEMPLATE-milestone.md         ← milestone plan template
│   │   └── .TEMPLATE-bugfix.md            ← bugfix plan template
│   └── done/                              ← finished plans land here (optional tidiness)
└── skills/
    ├── agent-planning/SKILL.md            ← create + run plans
    ├── plan-run/SKILL.md                  ← run the next sprint (standalone runner)
    └── plan-check/SKILL.md                ← read-only status readout
```

> These skills live under `skills/` (not `.claude/skills/`) so the bundle is just portable
> source and won't auto-register in this repo. When installing, copy them into the **target**
> repo's `.claude/skills/`.

## How to install in a target repo

1. **Rules** — Copy the contents of `CLAUDE.md` (this bundle) into your target repo's `CLAUDE.md`.
   That's what the agent reads every session. If you keep a private `CLAUDE.local.md`, copy that
   one too — it adds the "interview before writing a plan" authoring flow.
2. **Plans folder** — Copy `_docs/plans/` into your target repo at the same path (`_docs/plans/`).
   Active plans live in `_docs/plans/`; finished ones move to `_docs/plans/done/` (optional — the
   `Status:` field already tells you, the folder is just tidiness).
3. **Skills** — Copy `skills/agent-planning/`, `skills/plan-run/`, and `skills/plan-check/` into
   your target repo's `.claude/skills/`. Invoke with `/agent-planning create`, `/plan-run` (or
   `/agent-planning run`), and `/plan-check`.

That's the whole system.

## The skills

- **`/agent-planning create`** — gather scope, confirm, write a plan to `_docs/plans/` broken into
  phases → sprints with concrete `[ ]` tasks.
- **`/agent-planning run`** — execute the next sprint(s), keeping the file synced as you go;
  safely resume after an interruption.
- **`/plan-run`** — a standalone sprint runner with the same behavior as `/agent-planning run`
  (resume check → staleness audit → execution mode → run sprint). Use whichever you prefer; they
  overlap, so you can drop one if you don't want two entry points.
- **`/plan-check`** — read-only status readout across all plans (what's done / in-progress /
  pending).

## The core idea (why this survives a hang)

The plan file is **durable state**. You update it *as you work*, not at the end — flipping task
markers `[ ] → [-] → [x]`, appending Files Modified and Issues, and keeping a one-line Current
Status at the top. Because the file is always current, resuming after a crash is a 30-second
reconciliation against `git diff`, not archaeology. See `CLAUDE.md` § "Resuming after a hang".

## What was intentionally left out

Removed by request, relative to the source repo this was extracted from:

- **Kanban directory state machine** — the `01_…review` → `06_completed` queues and "move the
  file last" discipline. Replaced with a flat `_docs/plans/` (+ optional `_docs/plans/done/`).
- **Plan review & code review** — reviewer findings sections, approval gates, the resolve-review
  loop, arbitration.
- **Multi-agent routing** — Codex/Gemini reviewer roles, per-agent instruction files.
- **Todo system** — `/todo`, the master todo list, promotion references, developer-initial prefixes.

Each of those layers back on top of this kernel cleanly if you ever want it.

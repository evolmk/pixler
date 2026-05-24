# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Pixler

Local-first desktop app that orchestrates Claude Code (and other agent CLIs) to take software tickets from "Todo" to "Merged PR". Runs via `npx pixler` — boots a NestJS server and opens `localhost:7777` in the browser. See `_docs/pixler-SPEC.md` for the full product spec.

## Current state

**Pre-implementation.** The repo contains specs, plans, and reference material but no built application code yet. The monorepo scaffold (apps/, packages/, turbo.json, pnpm-workspace.yaml) will be created as part of milestone M01.

## Build commands (once M01 is complete)

```bash
pnpm install                          # Install all workspace dependencies
pnpm -w build                         # Build all apps + packages
pnpm -w dev                           # Start api + web in dev mode (Vite on 5173, API on 7777)
pnpm -w lint                          # Lint entire monorepo
pnpm -w typecheck                     # TypeScript check all packages
pnpm --filter @pixler/ui dev          # Run a single package in dev
pnpm --filter @pixler/api test        # Run tests for a single package
turbo run build --filter=@pixler/web  # Build a single target with Turborepo
```

## Stack

| Layer | Tech |
|-------|------|
| Backend | NestJS (Node) + Socket.io + better-sqlite3 + node-pty + simple-git |
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind v4 + CSS variables + `@pixler/ui-styles` |
| Components | `@pixler/ui` — Radix UI + CVA + cn() (shadcn/ui pattern) |
| Animation | Motion (motion.dev, respect `prefers-reduced-motion`) |
| Icons | Lucide React (never inline `<svg>`) |
| State | Zustand (UI) + TanStack Query (server) |
| Chat UI | assistant-ui |
| Terminal | xterm.js + node-pty |
| Monorepo | Turborepo + pnpm workspaces |

## Dependency policy

Always install the **latest stable/LTS** version of every package. Never use alpha, beta, RC, canary, or `@next` tagged releases unless explicitly approved. When a package offers an LTS track (e.g. Node, NestJS), prefer the current LTS over bleeding-edge major versions.

## Repo structure

```
pixler/
├── apps/
│   ├── api/                    # NestJS backend
│   └── web/                    # React + Vite frontend
├── packages/
│   ├── ui/                     # React component library (@pixler/ui)
│   ├── ui-styles/              # Design tokens, themes, CSS variables (@pixler/ui-styles)
│   ├── shared-types/           # DTOs, event types
│   ├── orchestrator/           # Agent state-machine logic
│   └── linear-cli/             # Thin Linear CLI for agents
├── bin/pixler.js               # npx entry point
├── _docs/
│   ├── pixler-SPEC.md          # Full product spec
│   └── plans/                  # Milestone plans (M01–M25)
├── _specs/
│   ├── spec-ui/                # UI specs (tokens, typography, motion, responsive, etc.)
│   └── spec-catalog/           # Catalog feature specs
├── globals.css                 # Master CSS with all theme tokens (oklch)
└── files-from-my-angular-repo/ # REFERENCE ONLY — Angular source material
```

## Plan & Sprint System

Plans live in `_docs/plans/`. The plan file is **durable state**: keep it in lockstep with the
code at all times, so if a session dies you can re-open the file and know exactly where you are.

### When to write a plan

Non-trivial work (multi-file changes, new features, refactors, multi-step bugfixes) gets a **plan
file** in `_docs/plans/` before code is written. Trivial changes (one-line fixes, typos, comment
edits — anything unambiguous and a few lines in one file) don't need a plan; just make them.

If unsure whether something is trivial, default to writing a plan.

### Task markers

- `[ ]` pending
- `[-]` in-progress (flip to this the moment you start a task)
- `[x]` complete (flip to this the moment it's done and verified)

### Structure: sprints

A milestone decomposes into **sprints** — each is a coherent, independently-verifiable chunk of
work with its own goal and `[ ]` task checklist. A good sprint passes its own build/test and is
worth one commit.

### Creating a plan (before any code)

1. **Pick the type** — milestone (feature/refactor) or bugfix (defect). Bugfixes use the lighter
   template.
2. **Run the interview protocol** in `CLAUDE.local.md` ("Interview Before Writing") before writing
   the file. Restate goal / scope / non-goals and get an explicit "yes" before writing.
3. **Write the file from the template** in `_docs/plans/templates/`. Replace every placeholder,
   set today's date and `Status: ⏳ IN_PROGRESS`, paste the original request under "Prompt that
   created this plan".
4. **Decompose into sprints** with concrete `[ ]` tasks small enough to verify.
5. **Stop. Creating ≠ executing.** Confirm the plan reads right, pick an execution mode, *then*
   start Sprint 1.

For Pixler-specific bookkeeping (milestone IDs, `MILESTONE-TRACKER.md` updates, the
`/plan-consultant` pre-flight offer), see `_docs/plans/CLAUDE.md` (auto-loaded when working in
that directory).

### Executing a plan

**Execution modes** — before starting, pick one:

1. **All sprints** — run every sprint sequentially, stop at the end. (default)
2. **Next sprint only** — run one sprint, then pause. Use for risky work (auth, payments, schema
   migrations, cross-service changes).

**While implementing a sprint, you MUST keep these current in the file:**

- Flip each task `[ ] → [-] → [x]` as you move through it.
- The sprint's **Files Created/Modified** list (add files as you touch them).
- The sprint's **Issues Encountered** (anything surprising, with its resolution).
- The **Current Status** summary line at the top of the file (one sentence: where things stand).
- The **Modified** date at the top.

**Verify before marking a sprint complete.** Run the project's check (build / typecheck / tests).
Don't mark `[x]` on faith — mark it on a passing check.

**Committing (recommended for resumability).** Commit after each sprint completes, with a short
message naming the sprint. A per-sprint commit history is a second, independent record of what's
done — `git log` and the plan file should agree.

**When the whole milestone is done:** follow the Pixler completion protocol in
`_docs/plans/CLAUDE.md` (move to `_docs/plans/completed/` with `-COMPLETE` suffix, update
`INDEX.md` and `MILESTONE-TRACKER.md`).

### Resuming after a hang

When you pick a plan back up after an interruption, follow this exactly — don't trust the
checkboxes blindly, *verify against the code*:

1. **Read the top of the file** — `Status`, `Current Status`, `Modified`. That's your
   one-paragraph re-orientation.
2. **Find the frontier** — the first `[-]` task (something was mid-flight) or, if none, the first
   `[ ]` task. That's where work stopped.
3. **Verify the frontier against reality.** A `[-]` task is the danger zone: the session may have
   died halfway through it. Check `git status` / `git diff` and read the actual files the sprint
   names. Reconcile:
   - If the code for a `[-]` task is actually complete and verified → flip it to `[x]`.
   - If it's partially done → finish it, then flip to `[x]`.
   - If nothing was written → flip back to `[ ]` and start clean.
4. **Spot-check the last `[x]`.** Occasionally a task gets marked complete just before a crash but
   only one of the file/code writes landed. A 10-second look catches this.
5. **Continue** from the reconciled frontier.

### Skills

- `/agent-planning create` — author a plan into `_docs/plans/`.
- `/agent-planning run` (or `/plan-run`) — execute the next sprint(s) and keep the file synced.
- `/plan-check` — read-only status across all plans.
- `/plan-consultant` — advisory pre-flight review of a plan before execution (Pixler-specific).

Templates: `_docs/plans/templates/.TEMPLATE-milestone.md` and
`_docs/plans/templates/.TEMPLATE-bugfix.md`.

## Component conventions

- Single-file `.tsx` modules in `packages/ui/src/components/` with colocated CVA variants and types
- Use `cn()` (clsx + tailwind-merge) for all class merging
- Use `forwardRef` on every component that renders a DOM element
- Always use semantic tokens (`bg-primary`, `text-muted-foreground`) — never hardcoded colors
- Favor composition (children, compound components) over prop drilling
- Tailwind v4 CSS-first — no `theme()` in arbitrary values (that's TW3 syntax)

## Theming

- 8 color schemes × light/dark: Forest (default), Graphite, Catppuccin, Tokyo Night, Nord, Rosé Pine, Solarized, Mono
- Color scheme via `data-color-scheme` on `<html>`, dark mode via `.dark` class
- Brand hex: `#16a355` (Pixler green)
- All colors use oklch — see `globals.css` and `_specs/spec-ui/spec-ui-tokens.md`

## Design system specs

Read these before building UI:
- `_specs/spec-ui/spec-ui-tokens.md` — all CSS variable tokens and Tailwind mappings
- `_specs/spec-ui/spec-ui-design-system.md` — layout, voice, and palette decisions
- `_specs/spec-ui/spec-ui-typography.md` — Inter variable, 14px base, full type scale
- `_specs/spec-ui/spec-ui-motion.md` — Motion (motion.dev) patterns
- `_specs/spec-ui/spec-ui-layout-patterns.md` — page layout rules
- `_specs/spec-ui/spec-ui-responsive.md` — breakpoints and mobile behavior
- `_specs/spec-ui/spec-ui-tailwind-gotchas.md` — tricky CSS patterns with solutions

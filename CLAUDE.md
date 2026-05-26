# CLAUDE.md

Guidance for Claude Code when working in this repo. Sub-CLAUDE.md files load
automatically when you touch the directory they live in — don't restate their
content here.

## What is Pixler

Local-first desktop app that orchestrates Claude Code (and other agent CLIs) to
take software tickets from "Todo" to "Merged PR". Runs via `npx pixler` — boots
a NestJS server and opens `localhost:7777` in the browser. Full spec:
`_docs/pixler-SPEC.md`.

## Current state

Active development. Foundation (M01–M08) complete; working M09+ (orchestration,
Linear, UI). Progress: `_docs/plans/MILESTONE-TRACKER.md`.

## Build commands

```bash
pnpm install                          # install workspace deps
pnpm -w dev                           # api (7777) + web (5173)
pnpm -w build                         # build all apps + packages
pnpm -w lint                          # lint monorepo
pnpm -w typecheck                     # typecheck all packages
pnpm --filter @pixler/api test        # test one package
```

## Stack (top-level only)

NestJS · React 19 + Vite · Tailwind v4 · Radix + CVA (`@pixler/ui`) ·
Zustand + TanStack Query · Socket.io · better-sqlite3 · node-pty ·
Turborepo + pnpm workspaces · Motion · Lucide icons.

Layer-specific details live in the sub-files below.

## Repo map & sub-CLAUDE.md index

| Path | Auto-loads | Covers |
|---|---|---|
| `apps/api/CLAUDE.md` | working in api | NestJS module pattern, DTOs, gateway, auth |
| `apps/web/CLAUDE.md` | working in web | routing, hooks, stores, query patterns |
| `packages/ui/CLAUDE.md` | working in ui | component conventions, theming, specs |
| `_docs/plans/CLAUDE.md` | working in plans | plan/sprint workflow |
| `PORTABLE-PLAN-SYSTEM/CLAUDE.md` | working in that dir | portable plan tooling |

```
pixler/
├── apps/api · apps/web
├── packages/ui · ui-styles · shared-types · orchestrator · linear-cli
├── bin/pixler.js
├── _docs/ (pixler-SPEC.md, plans/)
├── _specs/spec-ui · _specs/spec-catalog
└── globals.css
```

## Dependency policy

Install the **latest stable/LTS**. Never alpha/beta/RC/canary/`@next` without
explicit approval. **Never `@latest` in a committed config** (`.mcp.json`,
`package.json`, etc.) — always pin to a real version.

## Definition of Done

Do not say a task is complete until:

1. `pnpm -w typecheck` passes (or the targeted `--filter` equivalent).
2. `pnpm -w lint` passes for any files you touched.
3. If a test exists for the touched code, it passes. If you added behavior to a
   tested module, add or update a test.
4. **For UI changes**, you launched the dev server and used the change in a
   browser (golden path + at least one edge case). Typecheck does not verify
   feature correctness. If you can't browser-verify, say so explicitly.
5. **No secrets, no `@latest`, no `.env`** in anything staged.
6. If the work has a plan file, its tasks and **Files Modified** list are
   reconciled with `git status`.

If any of these are skipped, name which and why in your end-of-turn summary.

## Plan & Sprint System

Full workflow auto-loads from `_docs/plans/CLAUDE.md`. Quick reference:
non-trivial work gets a plan first; markers `[ ] [-] [x]`; sprints are
independently-verifiable commits; skills `/agent-planning create`, `/plan-run`,
`/plan-check`, `/plan-consultant`.

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

## Playwright / browser testing

Whenever you use Playwright (via MCP or directly) — for screenshots, snapshots,
traces, console logs, or generated test scripts — write **all artifacts to
`.temp/`** at the repo root. Subfolders are fine (`.temp/screenshots/`,
`.temp/traces/`, etc.). `.temp/` is gitignored; never commit anything from it
and never write Playwright output elsewhere (no `tmp/`, no `test-results/`).

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

## Response style — be more verbose than your default

The system prompt biases you toward terse, headline-style replies. In this repo,
override that: explain your reasoning and what you're doing in more depth than
you would by default.

What that means in practice:

- **Before tool calls**, explain *why* you're about to do this — not just "let me
  read X" but "I want to read X because I suspect the bug is in the event
  subscription order; if the createdId is set after the event fires, the dialog
  will never close." A sentence or two of reasoning per non-trivial step.
- **After surprising findings**, narrate what you learned and what it implies
  for the next move, before jumping to the next tool call. Don't make the user
  re-derive your inference chain from the diff.
- **In end-of-turn summaries**, prefer 3–6 sentences (or a short bulleted
  breakdown) over the default 1–2. Cover: what changed, *why* that fixes the
  thing, what edge cases you considered, and what you deliberately left out
  of scope. If you ran into a trade-off, name both sides and which one you
  picked.
- **When proposing a plan or fix**, lay out the reasoning behind the choice
  (not just the choice). The user is an experienced engineer — show your
  working so they can disagree with the *premise*, not just the conclusion.
- **Still don't** narrate trivial mechanics ("now I'll save the file"), pad
  with filler, or restate the user's request back at them. Verbose means
  *more reasoning surfaced*, not *more words for their own sake*.

If a task is genuinely one-line ("what's the dev port?" → "5173"), stay
one-line. The override is about reasoning-heavy work, not every reply.

## Testing the app (browser / UI)

1. Use `/Users/mike/work/workspace-lazar/lazar-ui` as the test project when a real project is needed (add it via the "New Project" dialog).
2. When a test step requires Linear OAuth, **stop and ask the user** — they will complete the OAuth handshake manually. Do not try to drive it without them.

## Plan & Sprint System

Full workflow auto-loads from `_docs/plans/CLAUDE.md`. Quick reference:
non-trivial work gets a plan first; markers `[ ] [-] [x]`; sprints are
independently-verifiable commits; skills `/agent-planning create`, `/plan-run`,
`/plan-check`, `/plan-consultant`.

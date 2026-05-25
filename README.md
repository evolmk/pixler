<div align="center">

# Pixler

**Local agentic SDLC orchestrator. Your stack, your team, zero LLM API cost.**

Take a Linear ticket from `Todo` to `Merged PR` end-to-end — without leaving the app.

[Features](#features) · [Quick start](#quick-start) · [How it works](#how-it-works) · [Roadmap](#roadmap) · [Status](#status)

</div>

---

## What is Pixler?

Pixler is a **local-first desktop app** that drives Claude Code (and other agent CLIs) through a complete plan → review → execute → PR loop. Each teammate runs their own copy via `npx pixler`. The app boots a local Node server and opens `localhost:7777` in your browser.

It sits in the same category as Conductor.build, but is **open-source**, **cross-platform**, built on a stack the team already uses, and adds opinionated features around:

- 🎯 **Linear-driven workflows** — workspaces are spawned straight from tickets
- 📝 **Plan-file durability** — plans live in the repo, on the branch, surviving across machines
- 💸 **Token efficiency** — CLI > MCP defaults save ~98% on Linear ops
- 🪟 **Multi-workspace parallelism** — git worktrees + ports keep three agents from clobbering each other
- 🎨 **8 themes × light/dark** — Forest, Graphite, Catppuccin, Tokyo Night, Nord, Rosé Pine, Solarized, Mono

Pixler **never holds an LLM API key**. All compute is delegated to the already-authenticated CLIs on your machine (`claude`, `codex`, `gemini`, `gh`). Your Pro / Max subscription does the work.

---

## Features

|                            |                                                                                          |
|----------------------------|------------------------------------------------------------------------------------------|
| **Plan → Review → Execute**| Planner writes, peer reviewer critiques, executor implements, validator runs `/review` |
| **Chat *or* Terminal**     | Polished assistant-ui chat panel — or the raw `claude` CLI in xterm.js. Same agent.    |
| **Plan storage**           | File / Inline / Attachment — auto-picked per ticket complexity                          |
| **Linear ↔ GitHub**        | Tickets sync, sub-issues update from plan checkboxes, PRs auto-open via `gh`            |
| **Git worktrees**          | Each workspace is isolated; no branch-switching, no port collisions                     |
| **Checkpoints**            | Auto git-stash snapshots before risky operations; one-click rollback                    |
| **Live diff viewer**       | Monaco-based, updates as the agent writes — hunk staging, side-by-side / unified       |
| **Token health**           | 5-hour-window pill in the top bar; pre-flight check before parallel agents             |
| **Deep links**             | `pixler://workspace/<id>` from Linear comments lands you in the right place             |

---

## Quick start

```bash
# zero install, always-latest
npx pixler

# or install globally
npm i -g pixler && pixler
```

Pixler will:

1. Boot a local NestJS server on a free port.
2. Open `http://localhost:<port>` in your browser.
3. Walk you through a 90-second onboarding (theme → tool detection → Linear PAT → first project).

Then create a workspace from any Linear ticket and watch it go.

### Prerequisites
doews 
You'll want these authenticated on your machine first:

```bash
claude --version          # Claude Code, signed in to Pro / Max
gh auth status            # GitHub CLI authenticated
codex --version           # optional — for peer review
```

A Linear API token from <https://linear.app/settings/api> finishes the loop.

---

## How it works

```
                Linear ticket
                       │
                       ▼
            ┌────────────────────┐
            │  New Workspace     │   git worktree created
            │  (chat or terminal)│   setup script runs
            └─────────┬──────────┘   $PIXLER_* env vars injected
                      │
                      ▼
        ┌───── PLANNING ─────► REVIEWING ──┐
        │                                  │ (rejected, loop ≤3×)
        │                                  ▼
        │                       AWAITING_APPROVAL (human gate)
        │                                  │
        │                                  ▼
        │                            EXECUTING
        │                                  │
        │                                  ▼
        │                           VALIDATING
        │                                  │
        │                                  ▼
        └─────────────────────────►  PR_OPEN ─► DONE
```

Every workspace is **one ticket, one worktree, one branch, one agent**. Three approval gates — plan, validation, PR — each independently auto-approvable when you trust the loop.

The plan lives at `docs/plans/<TICKET>.md` (or inline in Linear, or as an attachment). It's the source of truth that ties Linear ↔ GitHub together.

---

## Stack

| Layer            | Tech                                                        |
|------------------|-------------------------------------------------------------|
| Backend          | NestJS · Socket.io · better-sqlite3 · node-pty · simple-git |
| Frontend         | React 19 · Vite · TypeScript · Tailwind v4 · Motion  |
| Primitives       | Radix UI · Vaul · cmdk · Lucide                              |
| Chat             | assistant-ui · Shiki                                         |
| Diff             | Monaco                                                       |
| Terminal         | xterm.js                                                     |
| State            | Zustand · TanStack Query                                     |
| LLMs             | shells out to authenticated `claude`, `codex`, `gemini`     |
| GitHub           | shells out to authenticated `gh`                             |
| Linear           | `@linear/sdk` (internal) · thin Pixler CLI wrapper (agents)  |
| Distribution     | npm package with `bin` entry · Turborepo · pnpm workspaces  |

See `pixler-SPEC.md` for the full design and `docs/plans/` for the v1 milestone breakdown.

---

## Roadmap

### v1 (in progress)

Workspaces · plan loop · Linear + GitHub via CLI · Chat + Terminal modes · Monaco diff · run / open app · IDE launcher · all 8 themes · settings · onboarding · checkpoints · CI polling · activity feed · token health · telemetry opt-out.

### v2

Headless mode (Agent SDK) · `.pixler/instructions.md` Pixler-only layer · status bar above terminal · webhook-driven CI · Linear OAuth.

### v3+

Multi-repo `/add-dir` · MCP-per-repo · multi-agent collaboration · Spotlight testing · **mobile read-only companion** (Expo) · enterprise managed settings.

---

## Status

Pre-implementation. The spec is locked, the milestones are planned, and the first commit will land soon. If you're a teammate following along:

- [`pixler-SPEC.md`](./pixler-SPEC.md) — the canonical product specification (v1.0 draft)
- [`docs/plans/`](./docs/plans) — milestone-by-milestone build plan, parallelizable

---

<div align="center">
<sub>Built by the Pixler team · MIT licensed</sub>
</div>

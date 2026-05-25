# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Pixler

Local-first desktop app that orchestrates Claude Code (and other agent CLIs) to take software tickets from "Todo" to "Merged PR". Runs via `npx pixler` — boots a NestJS server and opens `localhost:7777` in the browser. See `_docs/pixler-SPEC.md` for the full product spec.

## Current state

Active development. Monorepo scaffold and foundation (M01–M08) complete. Working on M09+ (agent orchestration, Linear integration, UI). See `_docs/plans/MILESTONE-TRACKER.md` for current progress.

## Build commands

```bash
pnpm install                          # Install all workspace dependencies
pnpm -w build                         # Build all apps + packages
pnpm -w dev                           # Start api + web in dev mode (Vite on 5173, API on 7777)
pnpm -w lint                          # Lint entire monorepo
pnpm -w typecheck                     # TypeScript check all packages
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

Always install the **latest stable/LTS** version. Never use alpha, beta, RC, canary, or `@next` releases unless explicitly approved.

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
│   └── plans/                  # Milestone plans (M01–M26)
├── _specs/
│   ├── spec-ui/                # UI specs (tokens, typography, motion, responsive, etc.)
│   └── spec-catalog/           # Catalog feature specs
└── globals.css                 # Master CSS with all theme tokens (oklch)
```

## Plan & Sprint System

Full workflow in `_docs/plans/CLAUDE.md` (auto-loaded when working in `_docs/plans/`). Quick reference:

- Non-trivial work gets a plan file first. Trivial one-file changes don't.
- Task markers: `[ ]` pending · `[-]` in-progress · `[x]` complete — flip as you go.
- Sprints are independently-verifiable chunks worth one commit each.
- Skills: `/agent-planning create`, `/plan-run`, `/plan-check`, `/plan-consultant`.
- Templates: `_docs/plans/templates/.TEMPLATE-milestone.md` and `.TEMPLATE-bugfix.md`.

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

# Changelog

All notable changes to Pixler are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] — 2026-05-25

### Added

**Foundation (M01–M06)**
- Turborepo + pnpm monorepo scaffold with NestJS API, React 19 + Vite web, shared-types, UI kit
- Design token system — 8 color schemes × light/dark (oklch), `@pixler/ui-styles`
- Radix UI component library (`@pixler/ui`) with CVA variants, Tailwind v4
- NestJS API core — health endpoint, Socket.io gateway, CORS, static serving
- SQLite settings store with per-scope global/project/workspace overrides
- 3-pane responsive shell with full-bleed expansions, keyboard shortcuts, command palette

**Projects & Workspaces (M07–M09)**
- Projects: git clone + open existing repos, pixler.json team config, team config diff modal
- Workspaces: git worktrees per ticket, PTY terminal (xterm.js + node-pty), workspace lifecycle
- Terminal: iTerm2/Terminal.app themes, font scaling, scrollback, multi-terminal support

**Integrations (M10–M12)**
- Linear SDK: OAuth + PAT auth, ticket search, `@pixler/linear-cli` for agents
- Linear CLI: thin wrapper for agent use — `pixler-linear get-ticket`, `set-status`, `add-comment`
- GitHub (gh): auth status, PR create/merge, CI check polling, PR review comments

**Orchestration & Plans (M13–M16)**
- Orchestrator: state machine (`idle → running → gate → done/error`), agent spawn, gate flow
- Plan storage: SQLite + file-based plan cache, plan view tab with markdown rendering
- Checkpoints: git stash–based snapshots, rollback modal, auto-trigger on agent gates
- Chat UI: assistant-ui integration, PTY bridge for streaming, Composer with @file/@command mentions

**UI Polish (M17–M21)**
- Diff viewer: Monaco-based side-by-side diff, file tree, syntax highlighting
- Checks + activity: ChecksTab (git status, CI, PR reviews, plan todos), ActivityFeed, ToastBridge, native notifications
- Run logs: real-time PTY output log viewer, log download
- Themes: 8 color schemes (Forest, Graphite, Catppuccin, Tokyo Night, Nord, Rosé Pine, Solarized, Mono)
- Onboarding: 5-step guided setup (API key, tools, clone, theme, ready)

**Quality & Shipping (M22–M26)**
- Command palette + keyboard shortcuts (⌘K, full keybinding table in settings)
- Token health: usage meter, context spike detection, `/compact` nudge, cost estimator
- Gestures + deep links: swipe-archive, pull-refresh, `pixler://` URL scheme, Motion animations
- Playwright E2E smoke suite: 9 specs covering boot → onboarding → workspace flow
- Telemetry (opt-in), crash reporting, StoragePanel, AboutPanel

### Architecture highlights

- All LLM compute delegated to locally-authenticated CLIs — no API keys held
- Git worktrees for true workspace isolation
- Plan files live in the repo on the branch — durable across machines
- Token-efficient Linear/GitHub access via CLI > MCP by default (~98% cost reduction)


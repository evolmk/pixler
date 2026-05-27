# Milestone Tracker

**Most Recent Plan ID:** M32
**Last Plan Completed:** M31-model-defaults-family-picker
**Next Plan:** M32-project-out-of-url

---

## Currently Running

| Instance                              | Plan              | Status         |
|---------------------------------------|-------------------|----------------|
| **evolmk** (default `~/.claude`)      | M25-ship          | ✅ complete    |
| **evolmikek** (`~/.claude-evolmikek`) | M27-error-logging | ✅ complete    |

> Update this table when a plan starts/finishes. In the Milestones list below, in-progress plans
> show `[-]` and are annotated with the instance name `(evolmk)` or `(evolmikek)`.

### Parallel execution rule

Two Claude Code instances (two subscriptions) can run simultaneously as long as their plans touch
**different files**. Before starting a second plan in parallel, scan both plans' **Files
Created/Modified** lists and confirm there is no overlap — shared files cause merge conflicts and
broken builds. If any file appears in both lists, run those plans serially. When in doubt, check
`apps/web/package.json` and `pnpm-lock.yaml` — any two plans that add dependencies will conflict
there.

---

## Milestones

- [x] **M01** — Monorepo scaffold + `npx pixler` boot
- [x] **M02** — Design tokens
- [x] **M03** — UI kit
- [x] **M04** — API core
- [x] **M05** — SQLite + settings
- [x] **M06** — App shell
- [x] **M07** — Projects
- [x] **M08** — Workspaces
- [x] **M09** — Terminal
- [x] **M10** — Linear SDK
- [x] **M11** — Linear CLI
- [x] **M12** — GitHub (gh)
- [x] **M13** — Orchestrator
- [x] **M14** — Plan storage
- [x] **M15** — Checkpoints
- [x] **M16** — Chat UI
- [x] **M17** — Diff viewer
- [x] **M18** — Checks + activity
- [x] **M19** — Run + IDE
- [x] **M20** — Themes
- [x] **M21** — Onboarding
- [x] **M22** — Palette + keys
- [x] **M23** — Token health
- [x] **M24** — Gestures + deep links
- [x] **M25** — Ship
- [x] **M26** — Playwright E2E smoke suite
- [x] **M27** — Error logging to ~/.config/pixler/logs/
- [x] **M28** — Auth (Linear OAuth + GitHub OAuth/PAT/CLI), workflow engine, model picker
- [x] **M29** — Terminal-driven workflow execution + resume/retry (SQLite persistence, prompt accordion, stop/retry with context)
- [x] **M30** — Linear project linking & issue picker (settings-based per-project link, searchable issue picker + create via extended `LinearMutationsService`, OAuth error toast, wider Settings w/ icon+label nav, fixes `NewWorkspaceDialog` "Waiting for setup script…" race)
- [x] **M31** — Model Defaults: family-level picker (drop version selection, store provider:family, fix false "no longer available" warning, update spec §10.8)
- [ ] **M32** — Project out of URL (localStorage-backed current project, router collapses to `/` + `/w/$workspaceId`)


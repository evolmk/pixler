# Milestone Tracker

**Most Recent Plan ID:** M26
**Last Plan Completed:** M11-linear-cli
**Next Plan:** M12-github-gh

---

## Currently Running

| Instance                              | Plan           | Status         |
|---------------------------------------|----------------|----------------|
| **evolmk** (default `~/.claude`)      | M09-terminal   | ✅ complete |
| **evolmikek** (`~/.claude-evolmikek`) | M12-github-gh  | 🔄 in progress |

> Update this table when a plan starts/finishes. In the Milestones list below, in-progress plans
> show `[-]` and are annotated with the instance name `(evolmk)` or `(evolmikek)`.
> Check the Wave schedule to confirm the two plans are safe to run in parallel.

---

## Milestones

- [x] **M01** — Monorepo scaffold + `npx pixler` boot
- [x] **M02** — Design tokens
- [x] **M03** — UI kit
- [x] **M04** — API core
- [x] **M05** — SQLite + settings
- [x] **M06** — App shell
- [x] **M07** — Projects
- [x] **M08** — Workspaces _(Wave 3 / Track A)_
- [x] **M09** — Terminal _(Wave 4 / Track A)_
- [x] **M10** — Linear SDK _(Wave 3 / Track B)_
- [x] **M11** — Linear CLI _(Wave 5 / Track A)_
- [-] **M12** — GitHub (gh) _(Wave 4 / Track B)_ **(evolmikek)**
- [ ] **M13** — Orchestrator _(Wave 6 / Track A)_
- [ ] **M14** — Plan storage _(Wave 7 / Track B)_
- [ ] **M15** — Checkpoints _(Wave 8 / Track B)_
- [ ] **M16** — Chat UI _(Wave 7 / Track A)_
- [ ] **M17** — Diff viewer _(Wave 5 / Track B)_
- [ ] **M18** — Checks + activity _(Wave 9 / Track B)_
- [ ] **M19** — Run + IDE _(Wave 6 / Track B)_
- [ ] **M20** — Themes _(Wave 8 / Track A)_
- [ ] **M21** — Onboarding _(Wave 9 / Track A)_
- [ ] **M22** — Palette + keys _(Wave 10 / Track A)_
- [ ] **M23** — Token health _(Wave 10 / Track B)_
- [ ] **M24** — Gestures + deep links _(Wave 11 / Track A)_
- [ ] **M25** — Ship _(Wave 12 — serial, last)_
- [ ] **M26** — Playwright E2E smoke suite _(Wave 11 / Track B)_

---

## Parallel execution plan (2 concurrent agents)

Analysis of `Depends on` + `Files` across M06–M26 for running **two Claude subscriptions at
once** without dependency or shared-file conflicts. Last verified 2026-05-24.

### Two unavoidable single-track points

- **Front is serial.** After M05, only **M06** is runnable; after M06, only **M07** is
  runnable (M08 *and* M10 both need M07). The 2nd agent is idle through M06 → M07.
- **Tail is serial.** **M25** depends on *every* prior milestone — runs alone, last.

Real parallelism starts at **M08** (the first wave with two independent runnable plans).

### Schedule (Track A = critical path, Track B = conflict-free filler)

| Wave | Track A                    | Track B                 | Why B is safe to run alongside A                                                      |
|------|----------------------------|-------------------------|---------------------------------------------------------------------------------------|
| 1    | **M06** app-shell          | —                       | nothing else unblocked                                                                |
| 2    | **M07** projects           | —                       | M08/M10 both need M07                                                                 |
| 3    | **M08** workspaces         | **M10** linear-sdk      | disjoint files (db 0003 vs 0004, `workspaces/` vs `linear/`) — see sidebar caveat     |
| 4    | **M09** terminal           | **M12** github-gh       | `terminals/` vs `github/`; no shared files                                            |
| 5    | **M11** linear-cli         | **M17** diff-viewer     | `linear-cli/` + root `package.json` vs `diff/` + web `package.json` (different files) |
| 6    | **M13** orchestrator       | **M19** run-ide         | `orchestrator/` vs `run/`+`ide/`; no overlap                                          |
| 7    | **M16** chat-ui            | **M14** plan-storage    | `messages/`+ChatPane vs `plans/`+PlanTab; no overlap                                  |
| 8    | **M20** themes             | **M15** checkpoints     | `ui-styles/`+theme vs `checkpoints/`; no overlap                                      |
| 9    | **M21** onboarding         | **M18** checks-activity | `onboarding/` vs `activity/`+ChecksTab; no overlap                                    |
| 10   | **M22** palette-keys       | **M23** token-health    | palette + web `package.json` vs `usage/`; no overlap                                  |
| 11   | **M24** gestures-deeplinks | **M26** e2e-smoke       | M24 web `package.json` vs M26 root `package.json`+`turbo.json` (different files)      |
| 12   | **M25** ship               | —                       | depends on everything                                                                 |

21 milestones pack into **12 waves** (≈40% faster than the 21-wave serial path). The only
idle slots are forced by structure: waves 1, 2, and 12.

### File-conflict landmines — NEVER co-schedule these

If you reorder, do not run any of these pairs in the same wave (they edit the same file):

- **M11 ✗ M12** — both edit `apps/web/src/components/ProjectSettingsDrawer/IntegrationsPanel.tsx`
  (M10 creates it; M11, M12, M24 all extend it — serialize every edit to that file).
- **M19 ✗ M24** — both edit `SettingsDrawer/ExternalToolsPanel.tsx`.
- **M16 ✗ M20** — both edit `apps/web/src/lib/shiki.ts` (M20 depends on M16, so naturally ordered).
- **Two dep-adders in one wave** — M16, M17, M22, M24 each add to `apps/web/package.json`;
  running two together risks `pnpm-lock.yaml` merge conflicts. The schedule above already
  avoids pairing any two web-`package.json` plans.
- **Soft caveat, Wave 3 (M08 ∥ M10):** M08 owns `WorkspacesSidebar.tsx`; M10 mounts its
  `LinearTicketList` *into* that sidebar (not in M10's file list, but integration touches it).
  Have M08's agent own the sidebar edit, or sequence that one file.

### Naturally-ordered overlaps (dep already serializes them — no action needed)

- M13 → M15 (M15 edits `orchestrator.service.ts`) and M13 → M23 (M23 edits `agent-runner.service.ts`).
- M06 → M20 (M20 replaces M06's `AppearancePanel.tsx`).
- M06 → M07 (M07 lights up `TopBar.tsx`); M06 → M08 (M08 lights up `WorkspacesSidebar.tsx`).

### Flexible filler (only needs an early dep — slot wherever a B-track opens)

- **M26** needs only M09 → runnable from Wave 5 onward; isolated files (`apps/e2e/`).
- **M23** needs M13 → runnable from Wave 7 onward.
- **M17 / M19** need only M06+M08 → runnable from Wave 4 onward.

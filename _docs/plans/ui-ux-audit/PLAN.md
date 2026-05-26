# UI/UX Audit & Desktop Polish

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-26
**Current Status:** Sprint 1 (audit) complete — findings in `AUDIT-FINDINGS.md`. Awaiting sign-off to execute Sprint 2.

> Cross-cutting polish work; lives outside the M-series per user direction
> (`_docs/plans/ui-ux-audit/` not `_docs/plans/M<N>-…`). Sprints are independent
> and roughly priority-ordered; user may reorder/skip after Sprint 1.
>
> **Scope: desktop web UI only.** A mobile orchestrator is a separate, future
> deliverable per user direction (2026-05-26) and is explicitly out of scope here.

---

## Goal

Bring Pixler's desktop web UI to production quality. Today the app has one P0
crash blocking workspace creation, a TopBar that silently clips controls when
the window narrows below ~960px, a Settings drawer that's too narrow for its
own content density, and a cluster of loading/destructive-action gaps. This
plan fixes those and sweeps the surfaces not yet walked.

## Depends on

- _none_ — touches existing code only; no new milestone dependencies.

## Acceptance

- All P0 findings closed; all P1 findings closed or explicitly deferred with reason.
- `pnpm -w typecheck` and `pnpm -w lint` clean.
- WCAG 2.2 AA on touched surfaces (contrast ≥ 4.5:1 normal / 3:1 large; visible focus).
- `prefers-reduced-motion` honored across touched components.
- Definition-of-Done in `apps/web/CLAUDE.md` updated with the desktop a11y checklist.

## Out of scope

- **Mobile / phone / tablet layouts.** Pixler web is desktop-only; a separate
  mobile orchestrator app will handle the mobile use case.
- Visual redesign / re-theming of the brand language (themes stay as-is).
- New features. New milestones. M16 chat/composer build-out.
- Backend changes beyond what a UI fix strictly requires.
- Onboarding rewrite (only fixes Step4 prominence noted in P2-10).

## Files (expected surface)

```
_docs/plans/ui-ux-audit/PLAN.md                 (this file)
_docs/plans/ui-ux-audit/AUDIT-FINDINGS.md       (Sprint 1 output)
.temp/screenshots/audit/                        (Sprint 1 evidence — gitignored)
apps/web/src/components/TopBar.tsx
apps/web/src/components/SettingsDrawer.tsx
apps/web/src/components/SettingsDrawer/        (nav + panels)
apps/web/src/components/GuidedNewWorkspaceDialog.tsx
apps/web/src/components/CheckpointCard.tsx
apps/web/src/components/RollbackConfirmModal.tsx
apps/web/src/components/WorkspaceContextMenu.tsx
apps/web/src/components/WorkspaceStateBadge.tsx
apps/web/src/components/WorkspacesSidebar.tsx
apps/web/src/components/Onboarding/             (Step4 only)
apps/web/src/components/RootErrorBoundary.tsx
apps/web/src/routes/index.tsx                   (home empty-state chrome)
apps/web/CLAUDE.md                              (DoD update)
```

---

## Sprint 1 — Full audit walk-through

**Status:** ✅ done
**Goal:** Walk every reachable surface, capture screenshots, run heuristic +
WCAG checks, produce a prioritized findings doc that drives the rest of this plan.

**Tasks:**

- [x] Boot dev server (web 5173 + api 7777), add the pixler repo itself as the
  test project so all downstream surfaces are reachable.
- [x] Capture home empty state and project shell at desktop width.
- [x] Capture add-project dialog (mode picker + Open local path step).
- [x] Capture Settings drawer with Appearance and Account panels.
- [x] Discover and document the New Workspace crash (P0-01).
- [x] Apply Nielsen 10 + WCAG 2.2 AA heuristic rubric across the captured set.
- [x] Write `AUDIT-FINDINGS.md` with P0/P1/P2 table + cross-cutting recs +
  "what's good (don't break)" list.

**Files Created/Modified:**

- `_docs/plans/ui-ux-audit/AUDIT-FINDINGS.md` (created)
- `.temp/screenshots/audit/*.png` (gitignored evidence)

**Issues Encountered:**

- `GuidedNewWorkspaceDialog` crashes immediately on open → escalated to P0-01,
  unblocks Sprint 2.
- Several settings panels (Models, Providers, Environment, Linear, GitHub, Git,
  Workflows, Plans, Usage, Keyboard, Notifications, Terminal, External Tools,
  Storage, Experimental, About) were *not* clicked into individually — deferred
  to Sprint 7 (Remaining-surfaces sweep) where each will be audited *as part of
  its fix sprint*, not as a separate audit pass.
- Initial scope included mobile responsiveness; user clarified mid-session that
  mobile is a separate future deliverable. Findings + this plan rewritten to
  desktop-only on 2026-05-26.

**Verify:** `AUDIT-FINDINGS.md` exists with P0/P1/P2 sections and ≥ 1 P0 entry.

---

## Sprint 2 — Unblock workspace creation (P0-01)

**Status:** ⏳ pending
**Goal:** Fix the P0-01 crash so the rest of the app is reachable for downstream
sprints.

**Tasks:**

- [ ] Find the `<Select.Item value="">` in `GuidedNewWorkspaceDialog` (likely an
  empty agent/model/branch placeholder option). Replace with either a `placeholder`
  prop on the trigger or `value="__none__"` + filtered submit, per Radix docs.
- [ ] Add a dev-only assertion / ESLint rule (or both) so this regresses loudly,
  not silently — see `AUDIT-FINDINGS.md` cross-cutting rec #4.
- [ ] Manually create a workspace end-to-end; capture the path to
  `audit-followup/workspace-created.png` for downstream sprints to reference.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm -w lint`; manual: open dialog, walk
through to created-workspace state without hitting the error boundary.

---

## Sprint 3 — Settings drawer polish (P1-01, P1-02, P1-03)

**Status:** ⏳ pending
**Goal:** Make the Settings drawer comfortable at desktop widths and give
clearer affordances for close + active-panel state.

**Tasks:**

- [ ] Widen Settings drawer from `sm:max-w-[480px]` to `lg:max-w-[560px]` so
  Models / Diff Viewer panels stop feeling cramped.
- [ ] Add an explicit close (X) button in the drawer header.
- [ ] Replace the active settings-nav item treatment with a left accent bar
  (2-3px primary) plus stronger icon color. Verify in both light and dark themes.
- [ ] Walk every settings panel (Account, Models, Providers, Environment,
  Linear, GitHub, Git, Workflows, Plans, Appearance, Usage, Keyboard,
  Notifications, Terminal, External Tools, Storage, Experimental, About) —
  file any new findings inline in "Issues Encountered" and fix the obvious ones.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm -w lint`; manual walk of every panel.

---

## Sprint 4 — TopBar overflow + Home empty-state chrome (P1-04, P1-05)

**Status:** ⏳ pending
**Goal:** Stop the TopBar from silently clipping controls when the window
narrows, and give the home empty state proper app chrome.

**Tasks:**

- [ ] In `TopBar.tsx`, define "always visible" set (logo, project switcher,
  settings) and "overflow" set (help, theme, notifications, GitHub pill, token
  pill). Below ~1100px viewport, fold overflow set into a single `MoreMenu`
  (Radix DropdownMenu). Above 1100px, layout unchanged.
- [ ] Add a minimal TopBar (logo + theme/help/settings) to the home route's
  empty state in `routes/index.tsx`. Reuse the same `TopBar` component with a
  `variant="minimal"` prop or a project-less branch.
- [ ] Confirm focus order through the new MoreMenu is sensible.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** Manual: resize from 1440 down to 1024; no controls clip off the
right edge at any width in that range. Home empty state shows logo + overflow
menu.

---

## Sprint 5 — Loading states + destructive confirmations (P1-06, P1-07, P1-08)

**Status:** ⏳ pending
**Goal:** Close the loading-state and destructive-action gaps. Audit confirms
two surfaces (Open in IDE, Pin/Unpin, Checkpoint rollback/delete); sprint
sweeps any siblings discovered along the way.

**Tasks:**

- [ ] `WorkspaceContextMenu` — disable + spinner on Open in IDE while
  `openInIde` mutation is pending. Same for Pin/Unpin.
- [ ] `CheckpointCard` — disable + spinner on rollback/delete; wire
  `RollbackConfirmModal` (verify it isn't already wired and bypassed).
- [ ] Sweep all `mutate` / `mutateAsync` call sites in
  `apps/web/src/components/` for missing `isPending` handling; file any new
  ones here.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm -w lint`; manual: trigger each mutation
and observe disabled state + spinner; trigger rollback and confirm modal appears.

---

## Sprint 6 — a11y pass (P2-02, P2-03, P2-04)

**Status:** ⏳ pending
**Goal:** Close P2-02 (contrast), P2-03 (reduced motion), P2-04 (keyboard nav)
on the desktop UI.

**Tasks:**

- [ ] Audit all `text-muted-foreground` usages on light theme — measure
  contrast; bump token if anything fails 4.5:1.
- [ ] Audit `prefers-reduced-motion` honored: grep all `transition-*`/`animate-*`
  classes; introduce a `motion-safe:` prefix policy and apply.
- [ ] Walk Tab/Shift-Tab through TopBar → sidebar → tabs → right pane. Add
  `tabIndex` / `aria-label` where missing. Verify focus rings visible in both themes.
- [ ] Verify the Appearance > Animation setting actually gates all animations
  (gate non-motion-safe transitions on the Zustand `theme` store value).

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** Manual keyboard-only navigation through the project shell.
Lighthouse a11y score ≥ 95 on home + project shell (run via Chrome devtools).

---

## Sprint 7 — Remaining surfaces sweep

**Status:** ⏳ pending
**Goal:** Walk and fix every surface not yet audited.

**Tasks:**

- [ ] Modals: `NewWorkspaceDialog`, `RemoveWorkspaceModal`, `RollbackConfirmModal`,
  `PreflightModal`, `BigPlanPromptModal`, `TeamConfigDiffModal`,
  `ShortcutsHelpModal`, `RetryStepDialog`. File findings; fix P0/P1; defer P2.
- [ ] `CommandPalette` audit + fix.
- [ ] `Onboarding/*` flow end-to-end; close P2-10 (Skip-for-now prominence).
- [ ] `DiffEditor`, `DiffTab`, `DiffFileTree`, `HunkList`.
- [ ] `ActivityFeed` expanded; Big Terminal expanded.
- [ ] `WorkspaceCard` polish: P2-08 (always-visible ... menu at low opacity),
  P2-09 (hide redundant "ready" badge), P2-05 (project switcher chevron),
  P2-06/P2-07 (sidebar-footer Activity + Big Terminal consolidation).

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** Per-surface screenshot in `.temp/screenshots/audit-followup/`.

---

## Sprint 8 — Cross-cutting polish + DoD update

**Status:** ⏳ pending
**Goal:** Close cross-cutting recs from `AUDIT-FINDINGS.md` and update the
project's Definition of Done so this work doesn't regress.

**Tasks:**

- [ ] Update `apps/web/CLAUDE.md` with the desktop a11y checklist
  (cross-cutting rec #3).
- [ ] Improve error-boundary recovery: add "Reload" / "Go home" buttons
  alongside "Hide Error" (P2-11).
- [ ] Move plan into `_docs/plans/completed/ui-ux-audit-COMPLETE/` per
  `_docs/plans/CLAUDE.md` completion bookkeeping (folder, not file — two artifacts).

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm -w lint`; visual diff between pre-audit
screenshots and post-audit at desktop width.

---

## Prompt that created this plan

```
go through app, including making sure it's mobile responsive... grab a ui/ux skill
from internet if need, want to audit app and improve it

(+ "To test whole app add the current repo as a project")
(+ "Remove the mobile test stuff, you're right just make this a desktop only app.
   I'll make a mobile version to just help orchestrate (out of scope)")
```

# UI/UX Audit — Findings

**Audit date:** 2026-05-26
**Branch:** main @ edf3d86
**Scope:** Desktop only. A separate mobile orchestrator app is out of scope for
Pixler's web UI per user direction (2026-05-26).
**Methodology:** manual Playwright walkthrough at 1280px + spot checks at 1024
(for TopBar crowding) + heuristic checks (Nielsen 10 + WCAG 2.2 AA targets).
Reference skills: `anthropics/skills/frontend-design` (creative direction),
`webapp-testing` (browser harness). Screenshots: `.temp/screenshots/audit/`.

**Scope walked:** Home empty state · Add-project dialog (mode picker + Open local) ·
Project shell (workspaces sidebar + center tabs + right pane) · Settings drawer
(Appearance + Account panels) · TopBar in all states · Crash boundary on broken dialog.

**Not yet walked (deferred to per-sprint verification):** Workspace detail with real
workspace (blocked by P0-01), Modals (NewWorkspace, Remove, Rollback, Preflight, Big
Plan Prompt, Team Config Diff, Shortcuts Help, Retry Step), Command Palette, every
non-Appearance/Account settings panel (Models, Providers, Environment, Linear, GitHub,
Git, Workflows, Plans, Usage, Keyboard, Notifications, Terminal, External Tools,
Storage, Experimental, About), Onboarding `Onboarding/*`, Project Settings drawer,
Context menus, Activity feed expanded, Big Terminal expanded, Diff editor, dark mode
visual pass.

---

## Severity scale

- **P0** — blocks a flow or crashes. Ship-blocker.
- **P1** — significant UX degradation; users complete the task but with friction or confusion.
- **P2** — polish / consistency / minor a11y. Cumulative impact matters; individually small.

---

## Findings

### P0 — Blockers

| ID | Surface | Finding | Evidence |
|---|---|---|---|
| P0-01 | NewWorkspace dialog (`GuidedNewWorkspaceDialog.tsx`) | Clicking "Create your first workspace" crashes the root error boundary with `A <Select.Item /> must have a value prop that is not an empty string`. Likely an empty option in agent/model/branch select. Blocks any workspace creation. | `audit/error-new-workspace.png` |

### P1 — Significant

| ID | Surface | Finding | Evidence |
|---|---|---|---|
| P1-01 | Settings drawer at 1280px | Width `sm:max-w-[480px]` leaves only 424px for content after the 56px icon column. Panels with multiple controls (Appearance Density, Models dropdowns, Diff Viewer segmented) feel cramped. Recommend `sm:max-w-[560px]` or `lg:max-w-[640px]`. | `audit/settings-1280.png` |
| P1-02 | Settings drawer header | No explicit close (X) button. Users dismiss only via click-outside or Escape — discoverable for keyboard users only after they try. Title bar has lots of unused space to the right of the panel heading. | `audit/settings-1280.png` |
| P1-03 | Settings icon nav — active indicator | Active panel uses `variant=secondary` background tint. On both light and dark themes the active state is subtle (e.g. Account/Appearance icons in screenshots look almost identical to inactive siblings). Add a left accent bar (2-3px primary) like VS Code, or stronger background + icon-color treatment. | `audit/settings-account-1280.png`, `audit/settings-1280.png` |
| P1-04 | Home empty state | Before any project exists, the route renders **no TopBar / no app chrome at all** — just a centered dashed-border card on a near-white background. No Pixler logo, no settings access, no theme toggle, no help. Users opening for the first time have only the browser tab title to identify the app. Add a minimal TopBar (logo + theme/help/settings) so the empty state is recognizable as "Pixler". | `audit/home-1280.png` |
| P1-05 | TopBar density at 1024–1280 | 7 controls cluster on the right (token pill, GitHub pill, ⌘K, bell, help, settings, theme). Plus the project switcher + add-workspace on the left. There is no overflow menu — when window is resized below ~960px the right cluster starts losing items off the right edge with no warning. Group secondary actions (help, theme, bell) into a single overflow menu below ~1100px, or shrink/icon-only the token/GitHub pills below that breakpoint. | `audit/project-1280.png`, observed during resize |
| P1-06 | Loading states — Open in IDE & Pin/Unpin | `WorkspaceContextMenu` triggers `openInIde.mutateAsync({})` and `patch.mutate(...)` without disabling the menu item or showing a spinner. IDE launch can take 1–3s. Pin patch race-conditions a re-render. (Carried over from prior audit — confirmed in code.) | code: `WorkspaceContextMenu.tsx` |
| P1-07 | Loading state — CheckpointCard rollback/delete | `CheckpointCard` calls `onRollback` directly on click. Rollback runs `git stash apply`/`reset` and can take seconds. No spinner, no disabled state, no confirmation. (Also P1-08 below.) | code: `CheckpointCard.tsx` |
| P1-08 | Destructive action without confirm — Checkpoint rollback | Same surface as P1-07. Rollback replaces working tree and is irreversible if mid-edit. Needs a confirm step (lightweight modal or toast with Undo). The `RollbackConfirmModal.tsx` exists in the tree — verify it's wired up. | code: `CheckpointCard.tsx`, `RollbackConfirmModal.tsx` |

### P2 — Polish

| ID | Surface | Finding | Evidence |
|---|---|---|---|
| P2-01 | Empty states consistency | The right pane "Select a workspace" empty state (icon + heading + description) is the best-polished pattern. Center pane "Chat ships in M16 / The AI conversation pane will appear here" is a dev placeholder — call out in plan to either gate behind dev flag or replace with a more honest "Not built yet" treatment until M16. | `audit/project-1280.png` |
| P2-02 | Color contrast — muted descriptive text | "Add a local repo or clone one from GitHub to get started." in home empty state appears as low-contrast gray on near-white. Needs measurement against WCAG AA 4.5:1 (normal text) / 3:1 (large). | `audit/home-1280.png` |
| P2-03 | Reduced motion | Appearance panel exposes Animation: Full / Reduced / None. Coverage across components is not verified — many transitions live in component-local Tailwind classes. Audit: does the `motion` setting actually gate all animations? | code-wide grep TBD |
| P2-04 | Keyboard nav | Not exhaustively tested. Tab order through TopBar / sidebar / tabs / right pane needs verification. Focus rings present on default Radix primitives but custom buttons (e.g. tab strip) need verification. | TBD per surface |
| P2-05 | Project switcher button | "pixler v" — the dropdown indicator (chevron `v`) is rendered as text-styled icon next to the project name. Visually thin, low-discoverability. | `audit/project-1280.png` |
| P2-06 | Activity drawer collapsed state | Tiny chevron + bell icon + "Activity" label at the bottom of the workspaces sidebar. On hover state unclear whether it expands inline or opens a panel. | `audit/project-1280.png` |
| P2-07 | "Big Terminal" toggle | Below Activity in the sidebar footer. Two stacked "footer" controls cramping the sidebar bottom — could fold into a single sidebar-footer popover. | `audit/project-1280.png` |
| P2-08 | WorkspaceCard ... menu visibility | (Prior audit, code-confirmed.) Menu button is `opacity-0` until hover. Hover-only reveals are fragile — show at `opacity-40` resting, full on hover, so the affordance is always visible. | code: `WorkspacesSidebar.tsx` / cards |
| P2-09 | Workspace state badge redundancy | (Prior audit.) Dot color + "ready" badge text both encode state. Hide the badge for happy-path `ready`; keep for pending / setting_up / error / archived. | code: `WorkspaceStateBadge.tsx` |
| P2-10 | Onboarding Step4 "Skip for now" prominence | (Prior audit, deferred — not visited this pass.) Re-validate during Sprint 7 (Remaining-surfaces sweep). | code: `Onboarding/` |
| P2-11 | Error boundary recovery | When the boundary catches, only a "Hide Error" button is offered. No "Reload" / "Go home". Add a recovery action. | `audit/error-new-workspace.png` |

---

## Cross-cutting recommendations

1. **Drawer width policy.** Settle on a default sized for content density: 560px for
   Settings (which has dense panels) vs 480px for ProjectSettings (sparser). Document
   in `packages/ui/CLAUDE.md` so future drawers pick consistently.

2. **TopBar density.** Define which icons are "always visible" (logo, project switcher,
   settings) and which can fold into a `MoreMenu` (help, theme, notifications,
   GitHub pill) on narrower desktop windows. Avoid the silent off-edge clipping at <960px.

3. **Audit-rubric living checklist.** Future surfaces should ship with: (a) screenshot
   at 1280px (and ≤1024 if the surface re-flows), (b) reduced-motion honored,
   (c) keyboard tab order, (d) AA contrast in both themes, (e) loading + empty +
   error states. Add to `apps/web/CLAUDE.md` definition-of-done.

4. **`<Select.Item value="">` lint rule.** Add an ESLint rule or runtime dev-warning
   to catch the P0-01 class of bug before it reaches the error boundary.

5. **Mobile is out of scope.** Pixler's web UI is desktop-only. A separate mobile
   orchestrator app (per user, 2026-05-26) will be a different deliverable. Do not
   spend effort on responsive-down work in this plan; if a desktop surface happens
   to break below ~900px wide, fix only what affects realistic laptop sizes (≥1024).

---

## What's good (don't break)

- **Theme system** — swatches, modes, density, animation grouped well in Appearance panel.
- **Empty-state pattern** — icon + heading + body + CTA used consistently for Home and Right pane.
- **Activity drawer** — collapsed-by-default footer in the sidebar is a clever space saver.
- **Toast bridge / Notifications region** — accessible region present (`alt+T` live region).
- **Error boundary** — catches dev errors loudly so they get fixed instead of silently breaking flows.
- **Account panel privacy controls** — clear, well-labeled, with "Inspect what we'd send" disclosure. Good model for other privacy-adjacent surfaces.

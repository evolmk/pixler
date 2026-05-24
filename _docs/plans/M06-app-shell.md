# M06 — App shell (3-pane layout + top bar + drawers)

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — next plan up after M03/M04/M05 completion.

---

## Goal

Build the application chrome described in SPEC §8.1: the three-pane layout (workspaces sidebar /
center tabs / chat-or-terminal pane), the top bar, the Vaul settings drawer skeleton, and the
routing scaffold. No real features inside the panes yet — those are owned by later milestones.

## Depends on

- M03 (UI primitives — `ResizableSplit`, `Drawer`, `Button`, etc.)
- M05 (settings — sidebar width, density)

## Acceptance

- Loading `/` shows an empty state with "Create your first project" CTA (CTA is a stub; M07 makes
  it live).
- Resizing pane dividers smooth, persists across reload, respects min/max.
- Settings drawer opens via gear icon, closes via swipe-down (on touch) or Esc.
- Big Terminal toggle expands and restores cleanly.
- All shell elements retint when themes/mode change (M20 later, but the wiring should be
  theme-correct here).
- `pnpm -w typecheck` clean; `pnpm --filter @pixler/web build` succeeds.

## Out of scope

- Project / workspace data — placeholders only (M07, M08 fill in).
- Real chat / terminal / diff / checks panels — their own milestones.
- Command palette content (M22), keyboard shortcut handling beyond Esc (M22), gestures (M24).

## Files (expected surface)

```
apps/web/src/main.tsx                         (router setup)
apps/web/src/routes/index.tsx                 (empty home)
apps/web/src/routes/project.tsx               (3-pane shell)
apps/web/src/components/TopBar.tsx
apps/web/src/components/WorkspacesSidebar.tsx
apps/web/src/components/CenterTabs.tsx
apps/web/src/components/RightPane.tsx
apps/web/src/components/SettingsDrawer.tsx
apps/web/src/components/SettingsDrawer/AppearancePanel.tsx
apps/web/src/components/ProjectSettingsDrawer.tsx
apps/web/src/components/BigTerminalToggle.tsx
apps/web/src/stores/layout.ts
```

---

## Sprint 1 — Router + 3-pane layout skeleton

**Status:** ⏳ pending
**Goal:** Site boots and routes to `/`, `/p/:projectId`, `/p/:projectId/w/:workspaceId`. The
project route renders a hollow 3-pane shell with `<ResizableSplit>` wired to persisted pane sizes.

**Tasks:**

- [ ] Install + configure router (TanStack Router preferred; React Router acceptable). Wire
  routes: `/`, `/p/:projectId`, `/p/:projectId/w/:workspaceId`.
- [ ] `apps/web/src/main.tsx` mounts the router and the root providers (QueryClient, Settings).
- [ ] `routes/index.tsx` renders an `<EmptyState>` with "Create your first project" CTA (stub
  onClick).
- [ ] `routes/project.tsx` renders the 3-pane scaffold using `<ResizableSplit>` (left / center /
  right) with placeholder content in each pane.
- [ ] `stores/layout.ts` Zustand slice for `paneSizes`, full-bleed mode, plus selectors.
- [ ] Persist pane sizes through `useSetting('layout.paneSizes')`; restore on reload.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build && pnpm --filter @pixler/web dev` — open `/`, `/p/test`, `/p/test/w/abc` in browser, resize dividers, reload, confirm sizes persist.

---

## Sprint 2 — Top bar

**Status:** ⏳ pending
**Goal:** Top bar renders across all routes with every control visible and wired to either a stub
or its real provider.

**Tasks:**

- [ ] `components/TopBar.tsx` layout: wordmark left; project switcher / `+ Workspace` / `⌘K` /
  notification bell / settings gear / theme toggle right.
- [ ] Project switcher = `DropdownMenu` from `@pixler/ui` with placeholder list (real data lands
  in M07).
- [ ] `+ Workspace` opens a stub `Dialog` ("workspaces ship in M08").
- [ ] `⌘K` opens an empty `cmdk` `<CommandDialog>` placeholder.
- [ ] Settings gear opens the settings drawer (the drawer itself is built in Sprint 4 — wire the
  trigger now, stub the drawer for the moment).
- [ ] Theme/mode toggle re-uses the M02 toggle but reads/writes via `useSetting`.
- [ ] Notification bell renders a stub badge (M18 wires it up).

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/web build` clean; manual check that every top-bar control either opens its real provider or a labeled stub.

---

## Sprint 3 — Sidebar, center tabs, right pane

**Status:** ⏳ pending
**Goal:** Each of the three panes shows the structural UI defined in SPEC §8.1, with stubbed
content. Full-bleed (Big Terminal) toggle works.

**Tasks:**

- [ ] `components/WorkspacesSidebar.tsx` — vertical stack of workspace cards (placeholder data:
  color dot, name, state badge, 3-dot overflow menu).
- [ ] `components/BigTerminalToggle.tsx` at the bottom of the sidebar — toggles full-bleed mode
  (center + left collapse).
- [ ] `components/CenterTabs.tsx` — Radix `Tabs` with **Chat | Plan | Diff | Checks | PR**, each
  rendering a stub `<EmptyState>` keyed to its owning milestone.
- [ ] Composer placeholder at the bottom of the center pane (real composer in M16).
- [ ] `components/RightPane.tsx` — mode-pill at top to switch between ChatMode / TerminalMode
  stubs; persistent **Interrupt** + **Approve/Reject** buttons (disabled stubs).
- [ ] Per-pane header chevron expands that pane to full-bleed; another chevron click restores.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/web build` clean; manual check that all three panes render, tabs switch, Big Terminal expand/restore is clean.

---

## Sprint 4 — Settings drawer + Project Settings drawer + Activity Toasts

**Status:** ⏳ pending
**Goal:** The right-side Vaul drawer opens from the gear icon with every settings category present;
Appearance panel is fully real; reduced-motion is honored throughout the shell.

**Tasks:**

- [ ] `components/SettingsDrawer.tsx` — Vaul drawer (480px from right) with icon rail listing all
  SPEC §10.2 categories (Account, Models, Providers, Env, Linear, Git, Plans, Appearance,
  Keyboard, Notifications, Terminal, External Tools, Storage, Experimental, About).
- [ ] Each category renders an `<EmptyState>` saying which milestone fills it in.
- [ ] `components/SettingsDrawer/AppearancePanel.tsx` — fully real: theme picker (M02 toggle
  expanded to swatches later in M20), mode segmented control, density segmented control,
  animation level.
- [ ] `components/ProjectSettingsDrawer.tsx` — reuses the same Drawer component, opened from the
  project switcher gear.
- [ ] Mount activity-toast viewport at the root (M18 populates it; for now just render an empty
  `<Sonner />` provider).
- [ ] Audit shell components: every animation/transition respects `prefers-reduced-motion`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` clean; manual check that drawer opens via gear, closes via Esc / swipe-down on touch, Appearance settings persist via M05 settings.

---

## Prompt that created this plan

_(Original plan predates the merged template; preserved here as historical record. Plan re-shaped
into sprints on 2026-05-24.)_

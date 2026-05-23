# M06 — App shell (3-pane layout + top bar + drawers)

## Goal

Build the application chrome described in SPEC §8.1: the three-pane layout (workspaces sidebar / center tabs / chat-or-terminal pane), the top bar, the Vaul settings drawer skeleton, and the routing scaffold. No real features inside the panes yet — those are owned by later milestones.

## Depends on

- M03 (UI primitives — `ResizableSplit`, `Drawer`, `Button`, etc.)
- M05 (settings — sidebar width, density)

## Deliverables

- [ ] React Router (or TanStack Router) set up with routes:
  - `/` → empty state (no projects yet)
  - `/p/:projectId` → main 3-pane view, no workspace selected (center shows project empty state)
  - `/p/:projectId/w/:workspaceId` → main 3-pane view with workspace selected
- [ ] Top bar:
  - Pixler wordmark on the left
  - Project switcher dropdown (uses `DropdownMenu` from `@pixler/ui`) — placeholder list, real data from M07
  - `+ Workspace` button (opens a stub dialog; real flow in M08)
  - `⌘K` button (opens an empty `cmdk`-style dialog placeholder; real palette in M22)
  - Settings gear → opens the Vaul settings drawer
  - Theme/mode toggle (carried over from M02, now sourced from `useSetting`)
  - Notification bell (placeholder — wires up in M18)
- [ ] Left sidebar (workspaces rail):
  - Vertical stack of workspace cards (placeholder data)
  - Each card: color dot, name, state badge, 3-dot overflow
  - "Big Terminal ⇱" button at the bottom (toggles full-bleed mode — center+right collapse)
- [ ] Center pane:
  - Tabs (Radix-based): **Chat | Plan | Diff | Checks | PR** — each tab renders a stub component for now
  - Composer at the bottom (placeholder; real composer ships with M16)
- [ ] Right pane:
  - Mode-aware: shows either ChatMode or TerminalMode component, with a small mode-pill at the top to switch (placeholder content)
  - Persistent **Interrupt** + **Approve/Reject** buttons (disabled stubs)
- [ ] All three panes use `<ResizableSplit>` from `@pixler/ui`; sizes persisted via `useSetting('layout.paneSizes')`
- [ ] Full-bleed toggles: any pane can be temporarily expanded with a header chevron. Big Terminal toggle expands the right pane fully.
- [ ] Settings drawer (Vaul, 480px from right):
  - Icon rail with categories from SPEC §10.2 (Account, Models, Providers, Env, Linear, Git, Plans, Appearance, Keyboard, Notifications, Terminal, External Tools, Storage, Experimental, About)
  - Each category renders a stub `<EmptyState>` saying which milestone fills it in
  - **Appearance** category is fully real here: theme picker (uses M02 toggle for now, expanded to swatches in M20), mode segmented control, density segmented control, animation level
- [ ] Project Settings drawer reuses the same Drawer component, opened from the project switcher gear
- [ ] Activity Toast viewport mounted at the root (M18 populates it)
- [ ] Reduced-motion respected throughout

## Acceptance

- Loading `/` shows an empty state with "Create your first project" CTA (CTA is a stub; M07 makes it live).
- Resizing pane dividers smooth, persists across reload, respects min/max.
- Settings drawer opens via gear icon, closes via swipe-down (on touch) or Esc.
- Big Terminal toggle expands and restores cleanly.
- All shell elements retint when themes/mode change (M20 later, but the wiring should be theme-correct here).

## Files

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

## Out of scope

- Project / workspace data — placeholders only (M07, M08 fill in).
- Real chat / terminal / diff / checks panels — their own milestones.
- Command palette content (M22), keyboard shortcut handling beyond Esc (M22), gestures (M24).

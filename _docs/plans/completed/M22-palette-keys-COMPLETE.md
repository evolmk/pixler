# M22 — Command palette (`cmdk`) + keyboard shortcuts

**Status:** ✅ COMPLETE
**Modified:** 2026-05-25
**Current Status:** All 3 sprints complete — palette infra, action registration, hotkey engine + keyboard panel.

---

## Goal

Implement SPEC §8.9 + §10.2 Keyboard: a `cmdk`-based fuzzy search palette over every action /
setting / workspace / ticket / file, plus a full keyboard-shortcut editor with conflict detection.

## Depends on

- M03 (UI primitives)
- M06 (the `⌘K` stub gets replaced with the real palette)
- All feature milestones whose actions appear in the palette (everything ≤ M21)

## Acceptance

- `⌘K` opens the palette anywhere; typing surfaces matches across all groups.
- Selecting "Toggle auto-approve plan" flips the setting and the change persists.
- Vim preset rebinds the common ones (`:` for command mode, `gd`/`gp` chord for diff/plan tabs,
  etc.).
- Conflict detection prevents accidental dupes.
- All shortcuts respect input focus.
- `pnpm -w typecheck` clean.

## Out of scope

- AI-driven action suggestions ("you might want to") — out of v1.
- Plug-in / extension API for third-party palette actions — out of v1.

## Files (expected surface)

```
apps/web/src/lib/palette/registry.ts
apps/web/src/lib/palette/keyboard.ts
apps/web/src/lib/palette/presets/default.json
apps/web/src/lib/palette/presets/vim.json
apps/web/src/lib/palette/presets/emacs.json
apps/web/src/components/CommandPalette.tsx
apps/web/src/components/SettingsDrawer/KeyboardPanel.tsx
apps/web/src/components/ShortcutsHelpModal.tsx
apps/web/src/hooks/useHotkey.ts
apps/web/src/hooks/usePalette.ts
apps/web/package.json   (add cmdk, react-hotkeys-hook)
```

---

## Sprint 1 — Palette infra: registry + cmdk UI + recent store

**Status:** ✅ complete
**Goal:** `⌘K` opens a real cmdk palette with section grouping and recent-actions ranking.

**Tasks:**

- [x] Add `cmdk` (already installed via M03) + `react-hotkeys-hook` to `apps/web/package.json`.
- [x] `lib/palette/registry.ts` — `registerAction({ id, title, group, keywords?, perform, when? })`.
- [x] Recent-actions store (last 10) for surface-first ranking.
- [x] `CommandPalette.tsx` — cmdk `Command` primitive; sections: Recent · Actions · Settings ·
  Workspaces · Tickets · Files.
- [x] `usePalette.ts`.

**Files Created/Modified:**

- `apps/web/package.json` — added `react-hotkeys-hook`
- `apps/web/src/lib/palette/registry.ts` — action registry (new)
- `apps/web/src/stores/palette.ts` — Zustand store for open state + recent (new)
- `apps/web/src/hooks/usePalette.ts` — palette hook (new)
- `apps/web/src/components/CommandPalette.tsx` — full cmdk UI (new)
- `apps/web/src/components/TopBar.tsx` — wired to real palette, stub removed

**Issues Encountered:**

- _none_

**Verify:** `pnpm --filter @pixler/web build` + manual: `⌘K` opens palette, sections render.

---

## Sprint 2 — Action registration across modules + section content

**Status:** ✅ complete
**Goal:** Every existing feature registers its actions; Files searches `git ls-files`; Settings
generates from M05 registry; Tickets pull from M10 cache; Workspaces section lists all incl.
`:archived`.

**Tasks:**

- [x] Register actions in each module (settings, workspace ops, theme switches, IDE openers,
  run/stop, etc.).
- [x] Files section: `git ls-files` of active workspace.
- [x] Settings section: every setting in M05 registry becomes an action like "Toggle
  auto-approve plan".
- [x] Tickets section: pulled from Linear cache (M10).
- [x] Workspaces section: live list; `:archived` modifier shows archived too.

**Files Created/Modified:**

- `apps/api/src/workspaces/workspaces.controller.ts` — added `GET :id/files` endpoint
- `apps/api/src/workspaces/workspaces.service.ts` — added `listFiles()` via `git ls-files`
- `apps/web/src/stores/layout.ts` — added `newWorkspaceOpen`, `settingsTab`, `setNewWorkspaceOpen`
- `apps/web/src/components/WorkspacesSidebar.tsx` — migrated `newOpen` to layout store
- `apps/web/src/components/SettingsDrawer.tsx` — syncs to `settingsTab` on open
- `apps/web/src/hooks/useWorkspaceFiles.ts` — TanStack Query hook for workspace files (new)
- `apps/web/src/hooks/usePaletteActions.ts` — registers all static actions on mount (new)
- `apps/web/src/components/CommandPalette.tsx` — dynamic workspace/ticket/file sections
- `apps/web/src/routes/project.tsx` — mounts `usePaletteActions`

**Issues Encountered:**

- _none_

**Verify:** `pnpm --filter @pixler/web build` + manual: `⌘K`, type "Auto-approve plan", select, setting flips.

---

## Sprint 3 — Hotkey engine + Keyboard panel + presets + Help modal

**Status:** ✅ complete
**Goal:** Bindings system fully functional: defaults, presets, click-to-rebind with conflict
detection, Help modal.

**Tasks:**

- [x] `lib/palette/keyboard.ts` — shortcut registry keyed off action registry; default bindings
  for everything in SPEC.
- [x] `useHotkey.ts` — single root listener; disabled when input focused unless `global`.
- [x] `presets/default.json`, `presets/vim.json`, `presets/emacs.json`.
- [x] `SettingsDrawer/KeyboardPanel.tsx` — searchable list, click-to-rebind, conflict warning,
  preset switcher, persists overrides to `settings.keyboard.bindings`.
- [x] `ShortcutsHelpModal.tsx` — Help → "Keyboard shortcuts".

**Files Created/Modified:**

- `apps/api/src/settings/registry.ts` — added `keyboard.preset` + `keyboard.bindings` settings
- `apps/web/src/lib/palette/keyboard.ts` — shortcut registry with preset loading + conflict detection (new)
- `apps/web/src/lib/palette/presets/default.json` — default key bindings (new)
- `apps/web/src/lib/palette/presets/vim.json` — vim preset bindings (new)
- `apps/web/src/lib/palette/presets/emacs.json` — emacs preset bindings (new)
- `apps/web/src/hooks/useHotkey.ts` — action-id–based hotkey hook via react-hotkeys-hook (new)
- `apps/web/src/components/SettingsDrawer/KeyboardPanel.tsx` — keyboard settings panel (new)
- `apps/web/src/components/ShortcutsHelpModal.tsx` — shortcuts help dialog (new)
- `apps/web/src/components/SettingsDrawer.tsx` — wired KeyboardPanel
- `apps/web/src/components/TopBar.tsx` — wired ShortcutsHelpModal, Keyboard shortcuts menu item
- `apps/web/src/components/CommandPalette.tsx` — replaced useEffect with react-hotkeys-hook
- `apps/web/src/hooks/usePaletteActions.ts` — initializes keyboard registry from settings

**Issues Encountered:**

- _none_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual: rebind `⌘+E`; vim preset switches `:`; conflict warning fires.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

# M22 — Command palette (`cmdk`) + keyboard shortcuts

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — runnable after M03 + M06 + all M07–M21 feature work.

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

**Status:** ⏳ pending
**Goal:** `⌘K` opens a real cmdk palette with section grouping and recent-actions ranking.

**Tasks:**

- [ ] Add `cmdk` (already installed via M03) + `react-hotkeys-hook` to `apps/web/package.json`.
- [ ] `lib/palette/registry.ts` — `registerAction({ id, title, group, keywords?, perform, when? })`.
- [ ] Recent-actions store (last 10) for surface-first ranking.
- [ ] `CommandPalette.tsx` — cmdk `Command` primitive; sections: Recent · Actions · Settings ·
  Workspaces · Tickets · Files.
- [ ] `usePalette.ts`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/web build` + manual: `⌘K` opens palette, sections render.

---

## Sprint 2 — Action registration across modules + section content

**Status:** ⏳ pending
**Goal:** Every existing feature registers its actions; Files searches `git ls-files`; Settings
generates from M05 registry; Tickets pull from M10 cache; Workspaces section lists all incl.
`:archived`.

**Tasks:**

- [ ] Register actions in each module (settings, workspace ops, theme switches, IDE openers,
  run/stop, etc.).
- [ ] Files section: `git ls-files` of active workspace.
- [ ] Settings section: every setting in M05 registry becomes an action like "Toggle
  auto-approve plan".
- [ ] Tickets section: pulled from Linear cache (M10).
- [ ] Workspaces section: live list; `:archived` modifier shows archived too.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/web build` + manual: `⌘K`, type "Auto-approve plan", select, setting flips.

---

## Sprint 3 — Hotkey engine + Keyboard panel + presets + Help modal

**Status:** ⏳ pending
**Goal:** Bindings system fully functional: defaults, presets, click-to-rebind with conflict
detection, Help modal.

**Tasks:**

- [ ] `lib/palette/keyboard.ts` — shortcut registry keyed off action registry; default bindings
  for everything in SPEC.
- [ ] `useHotkey.ts` — single root listener; disabled when input focused unless `global`.
- [ ] `presets/default.json`, `presets/vim.json`, `presets/emacs.json`.
- [ ] `SettingsDrawer/KeyboardPanel.tsx` — searchable list, click-to-rebind, conflict warning,
  preset switcher, persists overrides to `settings.keyboard.bindings`.
- [ ] `ShortcutsHelpModal.tsx` — Help → "Keyboard shortcuts".

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual: rebind `⌘+E`; vim preset switches `:`; conflict warning fires.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

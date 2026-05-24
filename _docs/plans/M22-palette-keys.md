# M22 — Command palette (`cmdk`) + keyboard shortcuts

## Goal

Implement SPEC §8.9 + §10.2 Keyboard: a
`cmdk`-based fuzzy search palette over every action / setting / workspace / ticket / file, plus a full keyboard-shortcut editor with conflict detection.

## Depends on

- M03 (UI primitives)
- M06 (the `⌘K` stub gets replaced with the real palette)
- All feature milestones whose actions appear in the palette (everything ≤ M21)

## Deliverables

- [ ] **Palette infra**:
    - `apps/web/src/lib/palette/registry.ts` — a typed `registerAction({ id, title, group, keywords?, perform, when? })`
    - Modules across the app register their actions at mount or lazily (settings, workspace ops, theme switches, IDE openers, run/stop, etc.)
    - Recent-actions store (last 10) for surface-first ranking
- [ ] **Palette UI**:
    - Opens on `⌘K` / `Ctrl+K` and from the top-bar button
    - `cmdk` `Command` primitive
    - Sections: Recent · Actions · Settings · Workspaces · Tickets · Files
    - Files section searches the active workspace's tracked files via `git ls-files`
    - Settings section is searchable across the entire registry from M05 (every setting becomes an action like "Toggle auto-approve plan")
    - Tickets section pulls from Linear cache (M10)
    - Workspaces section lists everything (including archived if you type `:archived`)
- [ ] **Keyboard shortcut system**:
    - Shortcut registry keyed off the action registry
    - Default bindings table covering everything in SPEC mentions: `⌘K` palette, `⌘+E` open IDE,
      `⌘+Shift+D` diff full-bleed, Esc close drawer/dialog, `⌘+T` new workspace,
      `⌘+W` close workspace tab, arrows in palette, etc.
    - **Settings → Keyboard panel
      ** filled in: searchable list of all shortcuts, click-to-rebind with conflict detection (warns "X already binds to Foo — replace?")
    - Presets: Default / Vim / Emacs-ish — each preset is a JSON file applied to overrides
    - Persists per-shortcut overrides in `settings.keyboard.bindings`
- [ ] **Hotkey engine**: a single root listener (
  `react-hotkeys-hook` or hand-rolled) that dispatches to the action registry; disabled when an input is focused unless the binding is
  `global`
- [ ] **Help → "Keyboard shortcuts"** modal listing every binding grouped by section

## Acceptance

- `⌘K` opens the palette anywhere; typing surfaces matches across all groups.
- Selecting "Toggle auto-approve plan" flips the setting and the change persists.
- Vim preset rebinds the common ones (`:` for command mode, `gd`/`gp` chord for diff/plan tabs, etc.).
- Conflict detection prevents accidental dupes.
- All shortcuts respect input focus.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- AI-driven action suggestions ("you might want to") — out of v1.
- Plug-in / extension API for third-party palette actions — out of v1.

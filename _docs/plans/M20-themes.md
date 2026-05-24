# M20 — All 8 themes + theme picker grid

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — runnable after M02 + M03 + M09 + M16 + M17.

---

## Goal

Finish the theming story from SPEC §9: ship all eight themes (Forest, Graphite, Catppuccin, Tokyo
Night, Nord, Rosé Pine, Solarized, Mono) × light/dark, build the 16-swatch grid theme picker with
live hover preview, ensure terminal + chat + diff all sync from the same CSS variables.

## Depends on

- M02 (token contract + Forest + Graphite already shipped)
- M03 (UI primitives are theme-correct)
- M09 (terminal palette pulls from tokens)
- M16 (chat surfaces pull from tokens)
- M17 (diff editor honors theme)

## Acceptance

- All 16 variants render the entire app cleanly: top bar, sidebar, drawers, chat, terminal, diff,
  modals.
- Hovering swatches in the picker previews live; clicking sets and the choice persists.
- Per-project override beats global on the project's pages.
- Setting animation level to "off" eliminates all motion.
- `pnpm -w typecheck` clean.

## Out of scope

- Custom user-defined themes — pick from the 8 in v1.
- Per-workspace theme override — project-level granularity is enough.

## Files (expected surface)

```
packages/ui-styles/src/themes/catppuccin.ts
packages/ui-styles/src/themes/tokyo-night.ts
packages/ui-styles/src/themes/nord.ts
packages/ui-styles/src/themes/rose-pine.ts
packages/ui-styles/src/themes/solarized.ts
packages/ui-styles/src/themes/mono.ts
packages/ui-styles/src/index.ts                       (export all)
apps/web/src/styles/theme.css                      (extend with new blocks)
apps/web/src/components/SettingsDrawer/AppearancePanel.tsx   (replace with the grid)
apps/web/src/components/ThemeSwatchGrid.tsx
apps/web/src/components/ProjectSettingsDrawer/ThemePanel.tsx
apps/web/src/lib/monaco-theme.ts
apps/web/src/lib/shiki.ts                          (extend theme map)
```

---

## Sprint 1 — Add 6 new themes + theme.css blocks

**Status:** ⏳ pending
**Goal:** Each of the 6 new themes ships as a `*.ts` matching `forest.ts`/`graphite.ts` shape;
`theme.css` gains the 16 `[data-theme][data-mode]` blocks.

**Tasks:**

- [ ] `themes/catppuccin.ts` (Latte light / Frappé dark).
- [ ] `themes/tokyo-night.ts`.
- [ ] `themes/nord.ts`.
- [ ] `themes/rose-pine.ts`.
- [ ] `themes/solarized.ts`.
- [ ] `themes/mono.ts`.
- [ ] `packages/ui-styles/src/index.ts` exports them all.
- [ ] Extend `apps/web/src/styles/theme.css` with the new selectors.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w build` + manual: programmatically set each `data-theme` + `data-mode`, eyeball app chrome.

---

## Sprint 2 — Theme picker grid + hover preview + per-project override

**Status:** ⏳ pending
**Goal:** Settings → Appearance shows the 4×4 swatch grid with hover preview and active star;
project-level override panel reuses it.

**Tasks:**

- [ ] `ThemeSwatchGrid.tsx` — 16 swatches with base/elevated/primary/accent/typography preview.
- [ ] Hover preview applies theme temporarily; click persists via `useSetting('appearance.theme', …)`
  + `appearance.mode`.
- [ ] Star indicator on active swatch.
- [ ] Replace `SettingsDrawer/AppearancePanel.tsx` with the grid (replaces M06 stub).
- [ ] `ProjectSettingsDrawer/ThemePanel.tsx` reuses the grid; project setting beats global.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/web build` + manual: every swatch retints app on hover; click persists.

---

## Sprint 3 — Terminal/Shiki/Monaco sync + density + animation level

**Status:** ⏳ pending
**Goal:** Terminal palette + chat code-block theme + Monaco editor theme + density + animation
level all driven by the active theme.

**Tasks:**

- [ ] Extend `lib/shiki.ts` theme map (catppuccin-frappe, tokyo-night, nord, etc.; fallback for
  Forest/Graphite/Mono).
- [ ] `lib/monaco-theme.ts` — register custom Monaco theme per active selection.
- [ ] `appearance.animationLevel: 'full' | 'reduced' | 'off'` honored globally (Motion variants
  read it).
- [ ] `appearance.density` sets `--pixler-density` consumed by components.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck` + manual: theme switch retints terminal, chat code blocks, diff; off-animation strips Motion.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

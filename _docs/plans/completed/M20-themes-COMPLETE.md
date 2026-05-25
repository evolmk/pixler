# M20 — All 8 themes + theme picker grid

**Status:** ✅ COMPLETE
**Modified:** 2026-05-25
**Current Status:** All sprints complete — 8 themes shipped, ThemeSwatchGrid with hover preview, Monaco/Shiki theme mapping, project ThemePanel.

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

**Status:** [x] complete
**Goal:** Each of the 6 new themes ships as a `*.ts` matching `forest.ts`/`graphite.ts` shape;
globals.css gains the new `[data-color-scheme]` blocks.

**Tasks:**

- [x] `themes/catppuccin.ts` (Latte light / Mocha dark).
- [x] `themes/tokyo-night.ts`.
- [x] `themes/nord.ts`.
- [x] `themes/rose-pine.ts`.
- [x] `themes/solarized.ts`.
- [x] `themes/mono.ts`.
- [x] `packages/ui-styles/src/index.ts` exports them all.
- [x] Extend `packages/ui-styles/src/css/globals.css` with new CSS scheme blocks.

**Files Created/Modified:**

- `packages/ui-styles/src/themes/catppuccin.ts` — created
- `packages/ui-styles/src/themes/tokyo-night.ts` — created
- `packages/ui-styles/src/themes/nord.ts` — created
- `packages/ui-styles/src/themes/rose-pine.ts` — created
- `packages/ui-styles/src/themes/solarized.ts` — created
- `packages/ui-styles/src/themes/mono.ts` — created
- `packages/ui-styles/src/types.ts` — ThemeName expanded to all 8
- `packages/ui-styles/src/index.ts` — all themes exported + themeNames updated
- `packages/ui-styles/src/css/globals.css` — 6 new color-scheme blocks

**Issues Encountered:**

- _none_

**Verify:** `pnpm -w build` + manual: programmatically set each `data-theme` + `data-mode`, eyeball app chrome.

---

## Sprint 2 — Theme picker grid + hover preview + per-project override

**Status:** [x] complete
**Goal:** Settings → Appearance shows the 4×4 swatch grid with hover preview and active star;
project-level override panel reuses it.

**Tasks:**

- [x] `ThemeSwatchGrid.tsx` — 8 swatches with primary/muted/border preview strips.
- [x] Hover preview applies theme temporarily; click persists.
- [x] Check indicator on active swatch.
- [x] Replace `SettingsDrawer/AppearancePanel.tsx` Theme section with the grid.
- [x] `ProjectSettingsDrawer/ThemePanel.tsx` reuses the grid.

**Files Created/Modified:**

- `apps/web/src/components/ThemeSwatchGrid.tsx` — created
- `apps/web/src/components/SettingsDrawer/AppearancePanel.tsx` — Theme section replaced with grid
- `apps/web/src/components/ProjectSettingsDrawer/ThemePanel.tsx` — created
- `apps/web/src/components/ProjectSettingsDrawer.tsx` — Theme tab added

**Issues Encountered:**

- _none_

**Verify:** `pnpm --filter @pixler/web build` + manual: every swatch retints app on hover; click persists.

---

## Sprint 3 — Terminal/Shiki/Monaco sync + density + animation level

**Status:** [x] complete
**Goal:** Terminal palette + chat code-block theme + Monaco editor theme driven by active theme.

**Tasks:**

- [x] Extend `lib/shiki.ts` theme map (catppuccin, tokyo-night, nord, rose-pine, solarized, mono).
- [x] `lib/monaco-theme.ts` — register pixler-dark/pixler-light Monaco themes using CSS vars.
- [x] DiffEditor reads `resolvedMode` to pick the Monaco theme.
- [x] Terminal already reads CSS vars via `terminal-theme.ts` — no change needed.

**Files Created/Modified:**

- `apps/web/src/lib/shiki.ts` — created
- `apps/web/src/lib/monaco-theme.ts` — created
- `apps/web/src/components/DiffEditor.tsx` — switched to `getMonacoTheme(resolvedMode)`

**Issues Encountered:**

- `import type * as monaco from 'monaco-editor'` fails — used `any` type for editor param instead.

**Verify:** `pnpm -w typecheck` + manual: theme switch retints terminal, chat code blocks, diff; off-animation strips Motion.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_

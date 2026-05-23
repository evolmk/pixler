# M20 — All 8 themes + theme picker grid

## Goal

Finish the theming story from SPEC §9: ship all eight themes (Forest, Graphite, Catppuccin, Tokyo Night, Nord, Rosé Pine, Solarized, Mono) × light/dark, build the 16-swatch grid theme picker with live hover preview, ensure terminal + chat + diff all sync from the same CSS variables.

## Depends on

- M02 (token contract + Forest + Graphite already shipped)
- M03 (UI primitives are theme-correct)
- M09 (terminal palette pulls from tokens)
- M16 (chat surfaces pull from tokens)
- M17 (diff editor honors theme)

## Deliverables

- [ ] `packages/tokens/src/themes/`:
  - `catppuccin.ts` — Latte (light) / Frappé (dark)
  - `tokyo-night.ts`
  - `nord.ts`
  - `rose-pine.ts`
  - `solarized.ts`
  - `mono.ts`
  - Each one matches the same shape as `forest.ts`/`graphite.ts` from M02 (base, surface, primary, accent, text, border, success/warning/danger, terminal palette, syntax palette)
- [ ] Update `apps/web/src/styles/theme.css` with the additional `[data-theme="…"][data-mode="…"]` selectors (8 themes × 2 modes = 16 blocks)
- [ ] **Theme picker grid** in Settings → Appearance:
  - 16 swatches in a 4×4 grid (theme × mode)
  - Each swatch is a small preview: shows base + elevated + primary + accent + a typography sample
  - Hover preview: applies the theme to the entire app temporarily; on click, persists via `useSetting('appearance.theme', …)` + `appearance.mode`
  - Star indicator on the currently active swatch
- [ ] **Per-project theme override** (SPEC §9.3) — Project Settings → Theme override panel reuses the same grid; project setting beats global
- [ ] **Terminal palette + chat code-block theme** verified across all 8: ensure Shiki uses an appropriately matched grammar theme (`catppuccin-frappe`, `tokyo-night`, `nord`, etc. — Shiki ships several of these natively; for Forest/Graphite/Mono fall back to closest match)
- [ ] **Monaco theme sync**: register custom Monaco themes generated from token values for at least each `mode` per `theme` (one Monaco theme per active selection is enough — register on theme change)
- [ ] **Animation level** setting (`appearance.animationLevel: 'full' | 'reduced' | 'off'`) implemented — `reduced` honors OS preference; `off` strips all Framer Motion animations
- [ ] **Density** setting (`appearance.density`) — sets a CSS-variable `--pixler-density` that components read for padding/font-size scaling

## Acceptance

- All 16 variants render the entire app cleanly: top bar, sidebar, drawers, chat, terminal, diff, modals.
- Hovering swatches in the picker previews live; clicking sets and the choice persists.
- Per-project override beats global on the project's pages.
- Setting animation level to "off" eliminates all motion.
- `pnpm -w typecheck` clean.

## Files

```
packages/tokens/src/themes/catppuccin.ts
packages/tokens/src/themes/tokyo-night.ts
packages/tokens/src/themes/nord.ts
packages/tokens/src/themes/rose-pine.ts
packages/tokens/src/themes/solarized.ts
packages/tokens/src/themes/mono.ts
packages/tokens/src/index.ts                       (export all)
apps/web/src/styles/theme.css                      (extend with new blocks)
apps/web/src/components/SettingsDrawer/AppearancePanel.tsx   (replace with the grid)
apps/web/src/components/ThemeSwatchGrid.tsx
apps/web/src/components/ProjectSettingsDrawer/ThemePanel.tsx
apps/web/src/lib/monaco-theme.ts
apps/web/src/lib/shiki.ts                          (extend theme map)
```

## Out of scope

- Custom user-defined themes — pick from the 8 in v1.
- Per-workspace theme override — project-level granularity is enough.

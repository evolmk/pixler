# M02 — Design tokens + theme system (Forest + Graphite)

## Goal

Fill out `@pixler/ui-styles` with the design-token contract every other UI milestone consumes. Wire CSS custom properties + Tailwind v4 so a single `data-theme` attribute flip on `<html>` swaps themes with zero re-render. Ship two themes: **Forest** (default, ported from Lazar's Tailwind preset) and **Graphite**. The other six themes land in M20.

## Depends on

- M01 (monorepo scaffold)

## Deliverables

- [x] `packages/ui-styles/src/themes/forest.ts` — TS object describing the full Forest palette (base, surface, primary, accent, text, border, success/warning/danger, terminal palette) for light + dark variants
- [x] `packages/ui-styles/src/themes/graphite.ts` — same shape, Graphite palette
- [x] `packages/ui-styles/src/index.ts` — exports `themes`, `themeNames`, `type Theme`, helpers `toCssVars(theme)` and `injectGlobalTheme(name, mode)`
- [x] `packages/ui-styles/src/css/base.css` — declares the variable surface (e.g. `--pixler-bg`, `--pixler-bg-elevated`, `--pixler-fg`, `--pixler-primary`, etc.) with sane defaults
- [x] `apps/web/src/styles/theme.css` — imports `@pixler/ui-styles/css/base.css` and applies `[data-theme="forest"][data-mode="dark"] { ... }` selectors for both themes × 2 modes (4 rule blocks)
- [x] Tailwind v4 config in `apps/web` that maps utility classes to CSS variables: `bg-base`, `bg-elevated`, `text-fg`, `text-muted`, `border-default`, `text-primary`, `bg-primary` etc.
- [x] Tiny `useTheme()` Zustand store in `apps/web/src/stores/theme.ts`: `{ theme, mode, setTheme, setMode }`. Mode `system` reads `prefers-color-scheme` and updates on change.
- [x] Theme persistence to `localStorage` under `pixler.theme` (just a JSON `{theme, mode}` blob — proper settings persistence lives in M05)
- [x] Top-bar theme toggle stub in `apps/web/src/App.tsx`: a button that cycles Forest → Graphite, and a moon/sun toggle for light/dark.

## Acceptance

- Switching `data-theme` on `<html>` from the devtools instantly retints the page with no flash.
- Selecting "system" mode follows the OS preference when the user toggles dark mode at the OS level.
- `pnpm typecheck` and `pnpm build` clean.
- Reloading the page restores the last theme from `localStorage`.

## Files

```
packages/ui-styles/src/index.ts
packages/ui-styles/src/themes/forest.ts
packages/ui-styles/src/themes/graphite.ts
packages/ui-styles/src/css/base.css
apps/web/src/styles/theme.css
apps/web/src/stores/theme.ts
apps/web/tailwind.config.ts
apps/web/postcss.config.cjs   (if Tailwind v4 needs it; per Tailwind v4 docs)
apps/web/src/App.tsx          (add the stub toggle)
```

## Out of scope

- The other six themes (M20).
- The polished 16-swatch grid theme picker (M20).
- Persisting theme into SQLite or `pixler.json` — `localStorage` is fine for now; M05 migrates it.
- Anything visual beyond the toggle stub — M03 owns primitives, M06 owns layout.

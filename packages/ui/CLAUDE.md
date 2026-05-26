# packages/ui — CLAUDE.md

The `@pixler/ui` component library. Auto-loaded under `packages/ui/`.

## Component conventions

- Single-file `.tsx` modules in `src/components/`, colocate CVA variants + types.
- Use `cn()` from `@pixler/ui/lib/utils` for all class merging.
- `forwardRef` on every component that renders a DOM element.
- Semantic tokens only (`bg-primary`, `text-muted-foreground`) — never hex.
- Composition (children, compound components) over prop drilling.
- Tailwind v4 CSS-first — **no `theme()` in arbitrary values** (that's TW3).

## Theming

- 8 color schemes × light/dark: Forest (default), Graphite, Catppuccin,
  Tokyo Night, Nord, Rosé Pine, Solarized, Mono.
- Color scheme: `data-color-scheme` on `<html>`; dark mode: `.dark` class.
- Brand: `#16a355` (Pixler green). All colors **oklch** — see `globals.css`.

## Design system specs

Read these before non-trivial UI work:

- `_specs/spec-ui/spec-ui-tokens.md` — CSS variables ↔ Tailwind mappings
- `_specs/spec-ui/spec-ui-design-system.md` — layout, voice, palette
- `_specs/spec-ui/spec-ui-typography.md` — Inter, 14px base, type scale
- `_specs/spec-ui/spec-ui-motion.md` — Motion (motion.dev) patterns
- `_specs/spec-ui/spec-ui-layout-patterns.md` — page layout rules
- `_specs/spec-ui/spec-ui-responsive.md` — breakpoints + mobile
- `_specs/spec-ui/spec-ui-tailwind-gotchas.md` — gotchas with fixes

## Stories

Each component has a `<name>.stories.tsx`. When you add or meaningfully change
a component, update the story.

## Don't

- Don't add a new component without checking if Radix has the primitive.
- Don't ship a component that has no story.
- Don't introduce a new dependency in this package without approval — it
  affects every app that pulls in `@pixler/ui`.

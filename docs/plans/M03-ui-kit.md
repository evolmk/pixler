# M03 — UI primitives (`@pixler/ui`)

## Goal

Port enough of Lazar's component patterns into `packages/ui` to cover Pixler v1's needs: a small, opinionated kit built on Radix + Vaul + Framer Motion + Lucide that reads everything from `@pixler/tokens` CSS variables.

## Depends on

- M01 (monorepo scaffold)
- M02 (CSS variable contract — primitives must read from it)

## Deliverables

- [ ] `packages/ui` set up to consume `@pixler/tokens`, Tailwind v4, Radix UI, Vaul, Framer Motion, Lucide React
- [ ] Components (exported from `packages/ui/src/index.ts`):
  - `<Button variant size loading icon>` — primary / secondary / ghost / danger × sm/md/lg
  - `<IconButton>` — square, icon-only
  - `<Drawer side width>` — Vaul-backed, supports left/right; velocity-and-distance dismiss
  - `<Sheet>` — bottom sheet variant of Drawer
  - `<Dialog>` — Radix dialog with Framer fade/scale
  - `<Tooltip delay side>` — Radix tooltip with sensible defaults
  - `<Toggle>` (one-off) and `<Switch>` (Radix-backed)
  - `<SegmentedControl options value onChange>` — pill-style
  - `<Stepper value min max onChange>` — replaces number inputs
  - `<Tabs>` — Radix tabs with animated active indicator
  - `<DropdownMenu>` — Radix dropdown
  - `<ContextMenu>` — Radix context menu
  - `<Toast>` and `<ToastViewport>` — Radix toast wired to a Zustand `useToasts` store
  - `<EmptyState icon title body action>` — used by sidebar/checks/etc
  - `<Spinner>` — animated SVG using `currentColor`
  - `<Badge variant>` — neutral/primary/success/warning/danger + size sm/md
  - `<Kbd>` — for keyboard shortcuts (`<Kbd>⌘</Kbd>` style)
  - `<ResizableSplit direction sizes onResize>` — used by M06 for the 3-pane shell
- [ ] Every component renders correctly under both Forest and Graphite themes (uses CSS vars, never hard-coded colors)
- [ ] A small `apps/web/src/routes/__kitchen-sink.tsx` route renders one of each component for visual review (not linked from main nav; only reachable by URL)
- [ ] Storybook is **out** — kitchen-sink route is enough for v1
- [ ] Animation respects `prefers-reduced-motion`

## Acceptance

- `apps/web` builds and the kitchen-sink route renders every component without console errors.
- Switching theme/mode in the top bar retints every component on the kitchen-sink page instantly.
- All components are keyboard-accessible (Radix gives this for free; verify Drawer + Dialog).
- `pnpm -w typecheck` clean.

## Files

```
packages/ui/package.json          (depends: react, radix-ui packages, vaul, framer-motion, lucide-react)
packages/ui/src/index.ts
packages/ui/src/components/*.tsx  (one file per component listed above)
packages/ui/src/hooks/*.ts        (useToasts store, useReducedMotion)
apps/web/src/routes/__kitchen-sink.tsx
```

## Out of scope

- Application layout (M06).
- Chat/terminal/diff surfaces — they are their own milestones and may bring their own libs.
- cmdk command palette — M22.
- Theme picker UI — M20.

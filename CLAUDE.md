# Pixler

Local-first desktop app that orchestrates Claude Code (and other agent CLIs) to take software tickets from "Todo" to "Merged PR". See `_docs/pixler-SPEC.md` for the full product spec.

## Stack

- **Backend:** NestJS (Node)
- **Frontend:** React 19 + Vite + TypeScript
- **Styling:** Tailwind v4 + CSS variables + `@pixler/ui-styles`
- **Components:** `@pixler/ui` — React component library (shadcn/ui style: Radix UI + CVA + cn())
- **Animation:** Framer Motion
- **Icons:** Lucide React (never inline `<svg>`)
- **State:** Zustand (UI) + TanStack Query (server)
- **Monorepo:** Turborepo + pnpm workspaces

## Repo structure

```
pixler/
├── apps/
│   ├── api/                    # NestJS backend
│   └── web/                    # React + Vite frontend
├── packages/
│   ├── ui/                     # React component library (@pixler/ui)
│   ├── ui-styles/              # Design tokens, themes, CSS variables (@pixler/ui-styles)
│   ├── shared-types/           # DTOs, event types
│   ├── orchestrator/           # Agent state-machine logic
│   └── linear-cli/             # Thin Linear CLI for agents
├── bin/
│   └── pixler.js               # npx entry point
├── _docs/
│   ├── pixler-SPEC.md          # Full product spec
│   ├── plans/                  # Milestone plans (M01–M25)
│   └── screenshots/            # Reference screenshots
├── _specs/
│   └── spec-ui/                # UI specs (tokens, typography, motion, responsive, etc.)
└── shared-packages-from-lazar-angular-app/   # REFERENCE ONLY — Angular source material
    ├── design-system.md        # Lazar design system doc (Angular + B2B context)
    ├── ui-components-library/  # Angular component library (shadcn-style, CVA + Tailwind)
    └── ui-styles-library/      # Angular styles library (globals.css with CSS variables)
```

## Reference: Angular source material

`shared-packages-from-lazar-angular-app/` contains the original Angular component library and styles from the Lazar project. These are **reference only** — not imported or built. Use them for:

- **Visual inspiration** — the Angular components are shadcn-based with CVA variants and the same token system. Look at their structure, variants, and styling decisions when building the React equivalents.
- **Token values** — `ui-styles-library/src/globals.css` contains the production CSS variable values (oklch colors, semantic tokens, brand colors). These are the source of truth for the Forest theme.
- **Component inventory** — `ui-components-library/src/components/` has ~80 components. When building `@pixler/ui`, check what exists in the Angular library for API inspiration.

Do NOT copy Angular patterns (signals, directives, standalone components) into React code. Convert to idiomatic React: functional components, hooks, forwardRef, JSX.

## Plans and milestones

Implementation plans live in `_docs/plans/` (M01–M25). Each plan is self-contained and agent-runnable. See `_docs/plans/README.md` for the dependency graph and execution order.

## Component approach

1. Start with shadcn/ui components as the foundation (React + Radix + CVA + Tailwind)
2. Build `packages/ui/` as a reusable component library
3. Reference `shared-packages-from-lazar-angular-app/ui-components-library/` for custom component inspiration — convert the patterns you like to React
4. Components are single-file `.tsx` modules with colocated CVA variants and types
5. Always use semantic tokens (`bg-primary`, `text-muted-foreground`) — never hardcoded colors

## Conventions

- Use `cn()` (clsx + tailwind-merge) for all class merging
- Use `forwardRef` on every component that renders a DOM element
- Tailwind v4 CSS-first — theme tokens in CSS, no `theme()` in arbitrary values
- Framer Motion for animations, respecting `prefers-reduced-motion`

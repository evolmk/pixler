# M03 — UI primitives (`@pixler/ui`, shadcn-based)

## Goal

Turn the empty `@pixler/ui` package into a shared **shadcn/ui** component library (new-york
style: Radix + CVA + `cn()`) that every app in the monorepo consumes via subpath imports
(`import { Button } from '@pixler/ui/components/button'`). Install the **full shadcn component
catalog** plus a handful of Pixler-specific primitives. Components read all color/spacing from
the existing `@pixler/ui-styles` token contract — no tokens are duplicated into this package.
Ship a **Storybook gallery** alongside the package with five custom landing pages (Showcase,
Style Guide, Design, Design.md, Shadcn-case) for visual review across all 11 color schemes ×
light/dark.

Pattern reference: `evgenius1424/turborepo-vite-shadcn-ui` (shared `ui` package + `pnpm ui add`
workflow), but Pixler diverges on where tokens live (see Key decisions). Storybook structure
ports from `files-from-my-angular-repo/ui/.storybook/` + `src/storybook-demos/` — same toolbar
behavior (color-scheme + dark/light globals), same custom demo pages, converted to React.

## Depends on

- M01 (monorepo scaffold — `packages/ui` skeleton exists)
- M02 (token contract — `@pixler/ui-styles/src/css/globals.css` already defines every shadcn CSS
  variable: `--background`, `--primary`, `--card`, `--ring`, `--sidebar`, `--chart-*`, `--radius`,
  plus `@theme inline` mappings, across 11 `data-color-scheme` palettes × light/dark)

## Key decisions

- **Tokens stay in `@pixler/ui-styles`.** Unlike the reference repo (which keeps `globals.css`
  inside the ui package), Pixler already ships the full shadcn variable contract from M02 in
  `ui-styles`, and the names match shadcn 1:1. `@pixler/ui` ships **components only**;
  `components.json` points the shadcn CLI at the ui-styles css file so it resolves token classes
  but never rewrites or duplicates our tokens.
- **Source-only package.** `@pixler/ui` exports raw `.tsx`/`.ts` (no `tsc` build step); apps bundle
  it directly through Vite — same model as how `apps/web` already consumes
  `@pixler/ui-styles/src/css/globals.css`.
- **Subpath exports, not a barrel** — `@pixler/ui/components/*`, `@pixler/ui/lib/*`,
  `@pixler/ui/hooks/*`. (Replaces the current `src/index.ts` `export {}` stub.)
- **Toasts = Sonner.** shadcn's current default; the deprecated Radix `<Toast>` + `useToasts`
  store from the old plan is dropped in favor of `toast()` + `<Toaster />`.
- **Storybook lives inside `@pixler/ui`** (not a separate `apps/storybook`). Config in
  `packages/ui/.storybook/`, stories colocated as `packages/ui/src/**/*.stories.tsx`, run via
  `pnpm --filter @pixler/ui storybook`. Mirrors the Angular reference layout. The package stays
  source-only — `.stories.tsx` files are inert to consumers (Vite tree-shakes them) and only
  picked up by the Storybook builder.
- **Storybook builder = Vite** via `@storybook/react-vite` (matches `apps/web`'s bundler — no
  Webpack workaround needed like the Angular setup carried). Latest stable Storybook 9.x per
  the LTS-only [Dependency policy](../../CLAUDE.md#dependency-policy).
- **`tailwind-merge` is already a hard dep** of `@pixler/ui` via `cn()` (see `lib/utils.ts`
  below) — shadcn requires it. No separate install needed for Storybook stories.

## Deliverables

### Package infrastructure

- [x] `packages/ui/package.json` rewritten:
    - `"exports"`:
      `{ "./components/*": "./src/components/*.tsx", "./lib/*": "./src/lib/*.ts", "./hooks/*": "./src/hooks/*.ts" }`
    - deps: `react`, `react-dom`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`
      (component-specific deps like `@radix-ui/*`, `vaul`, `sonner`, `cmdk` are added automatically by
      the shadcn CLI as each component is installed)
    - `devDependencies`: `@types/react`, `@types/react-dom`, `typescript`, `tailwindcss`
    - scripts: `"ui": "pnpm dlx shadcn@latest add"`, `"typecheck": "tsc --noEmit"`, `"lint": "tsc --noEmit"`
    - remove the old `main` / `types` / `tsc build` setup (package is source-only)
- [x] `packages/ui/src/lib/utils.ts` — `cn()` = `twMerge(clsx(inputs))`
- [x] `packages/ui/components.json` — shadcn config:
    - `style: "new-york"`, `rsc: false`, `tsx: true`, `iconLibrary: "lucide"`
    - `tailwind: { config: "", css: "../ui-styles/src/css/globals.css", baseColor: "neutral", cssVariables: true }`
    - aliases → `components: "@pixler/ui/components"`, `utils: "@pixler/ui/lib/utils"`,
      `hooks: "@pixler/ui/hooks"`, `lib: "@pixler/ui/lib"`, `ui: "@pixler/ui/components"`
    - **Verify the CLI does not overwrite the existing M02 tokens** in the referenced css file; tokens
      are owned by M02 and already complete.
- [x] `packages/ui/tsconfig.json` — `jsx: "react-jsx"`, `lib: ["ES2022","DOM"]`,
  `paths: { "@pixler/ui/*": ["./src/*"] }`, source-only (no `composite`/`outDir` emit)

### Components — full shadcn catalog

Add via `pnpm --filter @pixler/ui ui <name>` (the `ui` script above). Install the complete set:

- [x] accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar,
  card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer,
  dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination,
  popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar,
  skeleton, slider, sonner, switch, table, tabs, textarea, toggle, toggle-group, tooltip

### Components — Pixler-specific (hand-authored, no shadcn equivalent)

- [x] `<EmptyState icon title body action>` — used by M06 sidebar / M18 checks
- [x] `<Spinner>` — lucide `Loader2` + `animate-spin`, `currentColor`
- [x] `<Kbd>` — keyboard-shortcut chips (`<Kbd>⌘</Kbd>`)
- [x] `<Stepper value min max onChange>` — replaces bare number inputs
- [x] `<SegmentedControl options value onChange>` — pill wrapper over shadcn `toggle-group`
- [x] `<ResizableSplit direction sizes onResize>` — thin wrapper over shadcn `resizable`
  (`ResizablePanelGroup`/`ResizablePanel`/`ResizableHandle`); keeps the name M06 references.
  **Mobile behavior:** below `lg`, stacks panels vertically and hides the drag handle so the
  3-pane desktop layout becomes a single scroll column on phone (no per-consumer breakpoint code).
- [x] `<AdaptiveSheet>` — picks Vaul `drawer` on `<md` (bottom-up, swipe-to-dismiss) and Radix
  `sheet` on `≥md` (side-in). Same API surface in both modes so Settings, workspace details, and
  ticket details share one component. Driven by `useMediaQuery('(min-width: 768px)')`.
- [x] `<BottomTabs items value onChange>` — fixed bottom tab bar for mobile. Replaces the center
  Radix `tabs` on `<md` so the Chat / Plan / Diff / Checks / PR surfaces stay one-tap reachable
  without horizontal scroll. Renders nothing on `≥md` (let the regular `tabs` show instead).
- [x] `<DesignMdViewer sections tocTitle?>` — reusable **Getdesign.md-style editorial previewer**.
  See `_docs/screenshots/design-md-template.jpg` for the visual reference (Airbnb design-system
  walkthrough aesthetic). API: takes a `sections` array of `{ number, eyebrow, title, lead,
  markdown?, examples? }` and renders a sticky left-rail TOC + numbered editorial sections with
  inline live React `examples`. Reused by the `Demos/Design.md` story (below) and available to
  consumers for future design-system pages. **Not** a pure markdown parser — accepts both
  markdown prose (`markdown` field, rendered via `react-markdown`) and live React content
  (`examples` field) so component proofs render alongside their description. Layout details:
    - Three-column desktop: left rail (`w-56`, sticky), main column (`max-w-[760px]`), no right column
    - Top sticky breadcrumb / brand strip with current section indicator (scroll-spy)
    - Section block pattern: small numbered overline (`"01 — OVERVIEW"`) → `text-4xl` title →
      lead paragraph → live `examples` block (color grids, type specimens, button rows, etc.)
    - Generous whitespace, subtle `border-t border-border` between sections, no shadows on examples
    - Mobile collapses the left rail into an `<AdaptiveSheet>` triggered by a sticky "On this page" button

### Hooks — Pixler-specific

- [x] `useMediaQuery(query: string): boolean` — generic responsive branching hook (lets components
  branch on `md`/`lg`/`xl` independently — the shadcn-installed `useMobile` is single-breakpoint).
  Lives at `packages/ui/src/hooks/use-media-query.ts`.

### App wiring

- [x] `apps/web/package.json` — add `"@pixler/ui": "workspace:*"`
- [x] `apps/web/vite.config.ts` — add resolve alias `@pixler/ui` → `packages/ui/src` so subpath
  imports resolve to `.tsx` source with no build step
- [x] `apps/web/src/styles/app.css` — add
  `@source "../../../../packages/ui/src/**/*.{ts,tsx}";` so Tailwind v4 scans ui components for
  class usage. **Critical:** without this, `@tailwindcss/vite` won't see classes used inside the
  workspace package and every component renders unstyled.
- [x] **No kitchen-sink route in `apps/web`** — Storybook (below) is the canonical gallery and
  replaces the prior `__kitchen-sink.tsx` plan. Keeps `apps/web` routes for product surfaces only.

### Storybook — gallery + custom landing pages

Storybook is wired into `@pixler/ui` itself (config + stories colocated). Run with
`pnpm --filter @pixler/ui storybook` (dev on `:6006`) or `pnpm --filter @pixler/ui build-storybook`
for a static build that can be served behind `/storybook` later.

**Infrastructure:**

- [x] `packages/ui/package.json` scripts: `"storybook": "storybook dev -p 6006"`,
  `"build-storybook": "storybook build -o storybook-static"`
- [x] `packages/ui/package.json` devDeps (latest stable per LTS policy): `storybook`,
  `@storybook/react-vite`, `@storybook/addon-docs`, `@storybook/addon-themes`, `vite`,
  `@vitejs/plugin-react`, `@tailwindcss/vite`, `react-markdown`, `remark-gfm`, `rehype-slug`,
  `rehype-autolink-headings`
- [x] `packages/ui/.storybook/main.ts` — framework `@storybook/react-vite`;
  `stories: ["../src/**/*.stories.@(ts|tsx|mdx)"]`;
  addons `['@storybook/addon-docs', '@storybook/addon-themes']`; `viteFinal` adds `@tailwindcss/vite`
  and imports `@pixler/ui-styles/src/css/globals.css` so previews are tokenized identically to `apps/web`
- [x] `packages/ui/.storybook/preview.tsx` — port from `files-from-my-angular-repo/ui/.storybook/preview.ts`,
  converted to React. Provides:
    - `withThemeByClassName` (Light/Dark via `.dark` on `<html>`)
    - `colorScheme` toolbar global → sets `data-color-scheme` on `<html>` (11 values: forest, graphite,
      catppuccin, tokyo-night, nord, rose-pine, solarized, mono, plus any extra schemes — must include
      every value listed in `_specs/spec-ui/spec-ui-tokens.md` §Themes)
    - `storySort` enforcing `Demos → Components → Hooks` group order; within `Demos`, order is
      `Showcase → Style Guide → Design → Design.md → Shadcn-case` (Shadcn-case sits last as the
      recipe gallery after the reference docs; Design.md sits next to Design since both render
      long-form design-system content)
- [x] `packages/ui/.storybook/manager.ts` — sets a Pixler-branded sidebar title (`"Pixler UI"`)
  and brand color from `--brand` (`#16a355`)
- [x] `packages/ui/tsconfig.json` — add `"include": ["src/**/*", ".storybook/**/*"]`

**Component stories (one `.stories.tsx` per primitive):**

- [x] Every shadcn component installed above gets a colocated `*.stories.tsx` next to the component
  (`packages/ui/src/components/button.stories.tsx`, etc.). Each story must:
    - export a `Meta` with `title: "Components/<Group>/<Name>"` (Group = Actions, Forms, Display,
      Feedback, Overlay, Navigation, Data, Layout — matches Angular reference grouping)
    - cover every CVA `variant` and `size` as a separate named story
    - include at least one disabled/loading state where applicable
- [x] Each Pixler-specific primitive (EmptyState, Spinner, Kbd, Stepper, SegmentedControl,
  ResizableSplit) gets the same treatment under `title: "Components/Pixler/<Name>"`

**Custom landing pages (`packages/ui/src/storybook-demos/`):**

- [x] **`showcase.stories.tsx`** — `title: "Demos/Showcase"`. Single comprehensive page rendering
  every M03 component with every variant in a labeled grid. **Match the visual arrangement** of
  the Angular reference (`files-from-my-angular-repo/ui/src/storybook-demos/demo-showcase.stories.ts`
  — the screenshot pasted in the task brief): cell-per-component grid, name + variant labels,
  same density. **Do not 1:1 port** — only render components M03 actually builds.

  **Render in the grid** (built by M03 — full shadcn catalog + Pixler-specific + standard shadcn
  compositions):

    - Direct shadcn primitives: Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge,
      Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command,
      Context Menu, Dialog, Drawer, Dropdown Menu, Hover Card, Input, Input OTP, Label, Menubar,
      Navigation Menu, Pagination, Popover, Progress, Radio Group, Resizable, Scroll Area, Select,
      Separator, Sheet, Sidebar, Skeleton, Slider, Switch, Table, Tabs, Textarea, Toast (Sonner),
      Toggle, Toggle Group, Tooltip
    - Standard shadcn compositions (no new install — composed inline from primitives above):
      Combobox (Popover + Command), Date Picker (Popover + Calendar), Form Field (Form primitive),
      Searchbox (Input + Command)
    - Pixler-specific: EmptyState, Kbd, ResizableSplit, SegmentedControl, Spinner, Stepper

  **At the bottom of the page**, render a section titled **"Not yet ported from lazar_2026"** —
  a single alphabetical bullet list (muted text, no live components, just names) so the gap vs.
  the Angular reference is visible at a glance:

  > Color Picker · Comment box · File Input · Legend Indicator · List Group · Mega Menu · Navbar ·
  > Placeholder Image · Price · Ratings · Strong Password · Time Picker · Toggle Count ·
  > Toggle Password · Tree

  Out of scope for M03 — these are tracked here only for visibility; future milestones may pull
  individual items into `@pixler/ui` as product surfaces need them.
- [x] **`style-guide.stories.tsx`** — `title: "Demos/Style Guide"`. Tailwind utility reference
  covering: Semantic Colors, Brand & Status Colors, Text Colors, Typography Scale, Font Weights,
  Background + Text Combos, Borders & Radius (border colors + radius scale), Hover & Interactive
  States, Active/Focus States, Opacity Variants (`/0..100` step grid), Shadows
  (`shadow-none → shadow-2xl`), Spacing Scale (`0.5 → 24` bar chart), Component Comparison
  (Neutral / Brand / Error card variants), Primary vs Secondary vs Accent buttons, Status Colors
  pills. Port from `files-from-my-angular-repo/ui/src/storybook-demos/demo-style-guide.stories.ts`.
- [x] **`design.stories.tsx`** — `title: "Demos/Design"`. Renders the **canonical Pixler design
  system doc** (`_specs/spec-ui/spec-ui-design-system.md`) as a styled long-form page resembling
  Google Material Design 3 docs (m3.material.io) / GitHub Primer docs:
    - Import the `.md` as a raw string (`?raw` Vite suffix) and feed through `react-markdown`
      with `remark-gfm` (tables), `rehype-slug` + `rehype-autolink-headings` (deep links)
    - Layout: max-width 880px main column on white, with a sticky right-side TOC (generated from
      H2/H3 via `rehype-slug` ids), 14px Inter body, hero H1 with brand-green rule underneath,
      code blocks in `bg-muted text-foreground`, inline `code` in `bg-muted/60 rounded px-1`
    - All custom components (e.g. the Hero Numbers, Eyebrow + brand-rule signature, Stat chip
      examples cited in the spec) render **live** inline beneath their description so the page
      is both reference doc and visual gallery
    - Add a small "Edit on GitHub" link in the header pointing at the source `.md` path
- [x] **`design-md.stories.tsx`** — `title: "Demos/Design.md"`. Editorial walkthrough of the
  Pixler design system rendered through the new reusable **`<DesignMdViewer>`** component (spec'd
  above under Pixler-specific). Visual reference is `_docs/screenshots/design-md-template.jpg` —
  Getdesign.md / Airbnb-style narrated case study, distinct from the dry `Demos/Design` doc page.

  Build out a `sections` config covering (numbers + eyebrows match the screenshot's rhythm):

    - **01 — Overview** — one-paragraph intro to Pixler's design language, brand hex, the "developer
      tool, not consumer SaaS" stance. No live examples.
    - **02 — Foundations / Color** — full color story: brand greens (`brand`, `brand-light`,
      `brand-dark`), neutral surface ramp, status colors (error / warning / success / info). Each
      color rendered as a labeled swatch card with role + token name.
    - **03 — Typography** — Inter specimens at scale (display 6xl/7xl numerals like the screenshot's
      `4.81`), the full type scale (xs → 4xl) with role labels, weight ladder (light → extrabold),
      eyebrow + brand-rule signature live.
    - **04 — Buttons** — every CVA variant + size as a live grid (matches the "Three product tabs"
      row in the screenshot). Side-by-side: default / outline / ghost / destructive / link, with
      sizes sm → lg.
    - **05 — Tabs & Segmented** — pill-tabs row, segmented control row, bottom-tabs preview (live
      `<BottomTabs>` rendered inside a phone-frame mock).
    - **06 — Cards & Surfaces** — card variants with corner-radius grid (`rounded-md` → `rounded-xl`)
      rendered as photo-like swatches, plus the Pixler "Empty State" composition live.
    - **07 — Forms** — input states (default / focus / error / disabled), floating-label pattern,
      checkbox + switch + radio rows, date-cell grid (calendar primitive styled like screenshot's
      "circular day cells").
    - **08 — Patterns** — three Pixler-specific compositions rendered live: workspace row, PR
      checks row, chat message bubble. Mirrors the screenshot's "listing detail" + "reviews" +
      "what this place offers" pattern blocks.
    - **09 — Responsive & Touch Targets** — breakpoint table from `spec-ui-responsive.md`, plus
      min-touch-target swatches (`h-11` / `py-3` / `size="icon-sm"`).

  Page renders by feeding the above `sections` config into `<DesignMdViewer>` — no per-page
  layout code, only content. Proves the component is genuinely reusable. Must retint correctly
  across all 11 color schemes × light/dark.
- [x] **`shadcn-case.stories.tsx`** — `title: "Demos/Shadcn-case"`. shadcn.com-style "blocks"
  gallery: a **4-column masonry grid of self-contained recipe cards** showing M03 primitives
  composed into real-world UI snippets. Visual reference is the screenshot pasted in the M03
  task brief — match the column count, card spacing, soft borders, generous padding, and
  rounded corners. Each cell is composed from primitives that already exist in M03; **no new
  components.** Responsive: 4 cols at `xl`, 2 cols at `md`, 1 col on mobile.

  Recipes to render (one cell each, top-to-bottom within each column):

  **Column 1**
    - Payment Method form (Card): Name on Card (Label + Input), Card Number + CVV (Input row),
      Month + Year (Select row), Separator, Billing Address section with Checkbox
      "Same as shipping address", Comments Textarea, Button Submit + Button Cancel ghost

  **Column 2**
    - Empty State card (dashed border): AvatarGroup (3 avatars), "No Team Members" headline,
      body text, Button "+ Invite Members"
    - Status Badges row with spinner icons: Syncing, Updating, Loading
    - Message composer: Input with leading `+` icon, placeholder "Send a message…", trailing mic icon
    - Price Range Slider with label "Price Range" + helper "Set your budget range ($200 – 800)."
    - Searchbox: Input with leading search icon, trailing "12 results" muted text
    - URL Input with leading `https://` addon and trailing info icon (Input group composition)
    - Ask/Search/Chat Textarea + footer row with `+ Auto` badge, "52% used" muted text, and a
      rounded-full send Button (chevron-up icon)
    - Username-confirmed Input: value `@shadcn`, trailing brand-green check icon

  **Column 3**
    - URL bar Input with leading info icon and trailing star (favicon) icon
    - Two-factor authentication Card: title + subtitle + Button "Enable" trailing
    - Profile-verified row Card: leading check-circle icon, "Your profile has been verified.",
      trailing chevron-right
    - Section separator with centered "Appearance Settings" label (Separator + inset Label)
    - Compute Environment large-card RadioGroup: Kubernetes (selected, with description) +
      Virtual Machine (with "Coming soon" hint) — each card is fully clickable, radio dot
      top-right
    - Number of GPUs row: Label "Number of GPUs" + helper "You can add more later." + Stepper
      (value 8)
    - Wallpaper Tinting row: Label + helper + Switch

  **Column 4**
    - "Add context" Input with leading `@` icon
    - "Ask, search, or make anything…" Input with leading attach + globe icons and trailing
      circular send Button
    - Pill toolbar row: leading back-arrow Button, Buttons "Archive" "Report" "Snooze", trailing
      `⋯` menu Button
    - "I agree to the terms and conditions" Checkbox styled as a full-width selected/highlighted
      row (subtle muted background, brand check)
    - Pagination row: numbers 1, 2, 3 + prev/next arrows + trailing Select labeled "Copilot"
    - "How did you hear about us?" RadioGroup as pill-style chips: Social Media (selected),
      Search Engine, Referral, Other
    - Loading-state Card (dashed border): Spinner, "Processing your request" title, "Please wait
      while we process your request. Do not refresh the page." body, Button Cancel

  All cells must retint with the toolbar `colorScheme` + `theme` globals (uses only semantic
  tokens — `bg-card`, `border-border`, `text-foreground`, `bg-primary`, etc.; no hard-coded
  colors). The grid uses CSS columns or a simple 4-col grid with each cell sized to content —
  do not force equal row heights.
- [x] `Showcase`, `Style Guide`, `Design.md`, and `Shadcn-case` must all visually retint when
  the toolbar `colorScheme` or `theme` global changes (proves the token contract works across
  all 22 surfaces). `Design` is intentionally white-canvas docs and exempt.

### Cross-cutting

- [x] Animation respects `prefers-reduced-motion` (both component code and Storybook stories)
- [x] Storybook builds with zero `console.error`/`console.warn` output in dev mode

## Acceptance

- `pnpm install` succeeds; `pnpm -w typecheck` clean.
- `apps/web` builds; `import { Button } from '@pixler/ui/components/button'` works from `apps/web`.
- `pnpm --filter @pixler/ui storybook` boots on `:6006` with no console errors and lands on the
  `Demos/Showcase` page (enforced by `storySort`).
- `pnpm --filter @pixler/ui build-storybook` produces a static `storybook-static/` build.
- Toolbar `Color Scheme` global lists all 11 schemes from `_specs/spec-ui/spec-ui-tokens.md`;
  switching any value retints the Showcase, Style Guide, Design.md, and Shadcn-case pages
  instantly in both Light and Dark.
- `Demos/Shadcn-case` renders the 4-column recipe grid matching the M03 task brief screenshot
  (Payment form, Empty state, Compute Environment radio cards, Pagination + Copilot, etc.) using
  only primitives built by M03 — no new components introduced.
- `Demos/Design.md` renders through `<DesignMdViewer>` with the 9 sections listed above, sticky
  left-rail TOC with scroll-spy works on desktop, and collapses into a triggered
  `<AdaptiveSheet>` on `<lg`.
- `<AdaptiveSheet>`, `<BottomTabs>`, `<ResizableSplit>` each have a story under
  `Components/Pixler/*` that demonstrates the desktop ↔ mobile breakpoint behavior by resizing
  the Storybook preview frame.
- Every shadcn component installed above has a colocated `.stories.tsx` with at least one story
  per CVA variant and size; the sidebar group order is `Demos → Components/* → Hooks`.
- `Demos/Design` renders the live contents of `_specs/spec-ui/spec-ui-design-system.md` with a
  working right-side TOC and live-rendered Eyebrow + brand-rule and Hero Numbers examples.
- All components are keyboard-accessible (Radix gives this for free; verify Drawer + Dialog).

## Files

```
packages/ui/package.json
packages/ui/components.json
packages/ui/tsconfig.json
packages/ui/src/lib/utils.ts
packages/ui/src/components/*.tsx              (shadcn catalog + custom additions)
packages/ui/src/components/*.stories.tsx      (one per component, CVA variant coverage)
packages/ui/src/hooks/*.ts                    (shadcn-installed hooks, e.g. use-mobile)
packages/ui/src/storybook-demos/showcase.stories.tsx
packages/ui/src/storybook-demos/style-guide.stories.tsx
packages/ui/src/storybook-demos/design.stories.tsx
packages/ui/src/storybook-demos/design-md.stories.tsx
packages/ui/src/storybook-demos/shadcn-case.stories.tsx
packages/ui/src/components/design-md-viewer.tsx       (reusable Getdesign.md previewer)
packages/ui/src/components/adaptive-sheet.tsx         (drawer<md / sheet>=md)
packages/ui/src/components/bottom-tabs.tsx            (mobile bottom tab bar)
packages/ui/src/hooks/use-media-query.ts              (generic responsive hook)
packages/ui/.storybook/main.ts
packages/ui/.storybook/preview.tsx
packages/ui/.storybook/manager.ts
apps/web/package.json                         (add @pixler/ui workspace dep)
apps/web/vite.config.ts                       (add @pixler/ui resolve alias)
apps/web/src/styles/app.css                   (add @source for the ui package)
```

## Out of scope

- Application layout (M06).
- Chat / terminal / diff surfaces — their own milestones; may bring their own libs.
- cmdk command **palette** UI — M22 (the `command` primitive is installed here, but the palette is M22).
- Theme picker UI — M20 (Storybook's toolbar covers theme switching during development; the
  end-user theme picker is a separate milestone).
- Visual regression snapshots / Chromatic — not in v1; Storybook static build is enough.
- Hosting Storybook publicly — local dev + static build only. Any publish step is post-M25.
- Moving or duplicating design tokens — they live in `@pixler/ui-styles` (M02) and stay there.

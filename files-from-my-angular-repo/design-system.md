# Lazar Design System — Guest & Client Apps

> **Purpose:** Single source of truth when generating new page designs with Claude's design tool for the `frontend/guest` (public catalog) and `frontend/client` (authenticated portal) apps.
>
> **Scope:** Page-level designs — layouts, compositions, and visual treatments that fit the existing system. **Not** a component library spec (that lives in `_specs/spec-ui/components/`).

---

## §0 — Bundle reference (canonical asset source)

The **2026-05-15 export** from `claude.ai/design` lives at:

```
_docs/design-system/bundle-2026-05-15/
  README.md       ← CONTENT FUNDAMENTALS, VISUAL FOUNDATIONS, iconography (agent-facing brief)
  TAILWIND.md     ← Tailwind v4 usage, eyebrow utility, theme schemes
  globals.css     ← Advisory token file (advisory only — production canonical: packages/ui-styles/src/globals.css)
  assets/         ← Logos (SVG + PNG @1x/@4x), reference screenshots
  preview/        ← 33 HTML preview cards (visual reference — not agent-facing)
  DIFF-vs-production.md ← Delta between bundle and production globals.css
```

**When in doubt about voice, casing, or brand language — read `bundle-2026-05-15/README.md` first.**

The **archived** `_docs/design-system/export-archive-2026-04-23/` is the "before" snapshot Mike took INTO `claude.ai/design`. The bundle above is the "after" finalized version.

> **Drift-prevention rule:** When updating brand language or token values in this file, also update the matching `_specs/spec-ui/spec-ui-tokens.md` and `spec-ui-design-system.md` so both sides stay in sync. Each spec file links back here — follow the link to verify.

---

## 1. Product at a glance

**Lazar Technologies** — B2B enterprise platform for industrial bottle-capping machinery. Customers are procurement engineers, plant maintenance managers, and service techs at beverage companies. They come to the site with a **specific verb**: find a part, build a quote, track an order, check a manual.

**Two public-facing apps:**

| App        | Audience       | Tone                                                        | Layout                                 |
| ---------- | -------------- | ----------------------------------------------------------- | -------------------------------------- |
| **Guest**  | Public visitor | Industrial catalog gone digital — grounded, precise         | Header + content + footer. No sidebar. |
| **Client** | Authenticated  | Same visual language, adds account context via left sidebar | Header + left nav + content + footer.  |

Both apps **share the same header, footer, basket flyouts, and component library.** Client adds a GitHub-settings-style left sidebar for account sections (Projects, Orders, Support, Account).

---

## 2. Feel / Voice / Visual Direction

Lazar copy reads like a **technical catalog** — not marketing, not friendly assistant.

- **Grounded and precise** — like a well-organized industrial catalog.
- **Not consumer-retail playful.** Not cold SaaS sterile.
- **Engineered surfaces, clear labeling, confident hierarchy.**
- Think: technical drawing on white paper, with the Lazar-green machine paint as the brand anchor.
- **Information density is welcome** — users know part numbers, SKUs, and categories. Don't over-simplify.

**Voice rules:**

- **Engineer-to-engineer.** Assumes the reader knows what a SKU, BOM, RFQ, torque setting, or PLC is.
- **Confident, never apologetic.** "Out of stock" not "Sorry, this item is temporarily unavailable."
- **Information-dense.** Spec sheets win over hero copy. Numbers, units, and part numbers are always visible — never abstracted away.

**Signature UX patterns:**

- **Triple basket system** — Quote, Wishlist, Cart are all first-class header citizens. Three procurement workflows, not one checkout.
- **Megamenu catalog nav** — reveals the catalog's structure (parts by category, products by type) on hover.
- **Exploded-diagram / BOM thinking** — lists, grids, and tables are the primary data surfaces.

---

## 3. Stack constraints (non-negotiable)

Any design must be implementable within:

- **Angular 21** (standalone components, signal inputs)
- **Tailwind v4** (utility-first, `@theme inline` tokens)
- **CVA** (class-variance-authority for component variants)
- **`@lazar/ui`** component library — always reuse first, extend second, never rebuild
- **`@lazar/ui-styles`** — shared CSS tokens (`globals.css` + per-app `theme-{app}.css`)

**Hard rules:**

1. Never hardcode colors — use semantic tokens (`bg-primary`, `text-muted-foreground`, `border-border`).
2. Never rebuild an existing component — reuse from `@lazar/ui` (see §7 inventory).
3. Brand green (`#16a355`) is reserved for **brand identity** — logos, primary CTAs, active states — not general UI fill.

---

## 4. Color palette

### Brand

| Token           | Value     | Usage                                               |
| --------------- | --------- | --------------------------------------------------- |
| `--brand`       | `#16a355` | Primary brand green — the Lazar machine paint color |
| `--brand-light` | `#22c55e` | Lighter variant for hovers, accents                 |
| `--brand-dark`  | `#15803d` | Darker variant for pressed/active                   |

**Single brand spot color.** Brand green is used for primary CTAs, active nav, in-stock badges, prices, links on white, the logomark. Everything else is neutral white-on-gray.

### Semantic tokens (Tailwind classes)

Use these for **all** UI surfaces. They adapt automatically to light/dark mode.

| Purpose               | Background             | Text                          | Border          |
| --------------------- | ---------------------- | ----------------------------- | --------------- |
| Page                  | `bg-background`        | `text-foreground`             | —               |
| Card / panel          | `bg-card`              | `text-card-foreground`        | `border-border` |
| Popover / dropdown    | `bg-popover`           | `text-popover-foreground`     | `border-border` |
| Primary action        | `bg-primary`           | `text-primary-foreground`     | —               |
| Secondary surface     | `bg-secondary`         | `text-secondary-foreground`   | —               |
| Muted / placeholder   | `bg-muted`             | `text-muted-foreground`       | —               |
| Hover / selected tint | `bg-accent`            | `text-accent-foreground`      | —               |
| Error / danger        | `bg-destructive`       | `text-destructive-foreground` | —               |
| Input                 | `bg-background`        | `text-foreground`             | `border-input`  |
| Focus ring            | `ring-ring` + `ring-2` | —                             | —               |

### Status colors (static — do not change in dark mode)

| Token              | Value     | Usage    |
| ------------------ | --------- | -------- |
| `--status-error`   | `#dc2626` | Errors   |
| `--status-warning` | `#f59e0b` | Warnings |
| `--status-success` | `#10b981` | Success  |
| `--status-info`    | `#3b82f6` | Info     |

### Surface tokens

| Token              | Value     | Usage                                                          |
| ------------------ | --------- | -------------------------------------------------------------- |
| `--footer-surface` | `#e8efe8` | Very pale tinted gray-green — footer and landing sections only |

### Theme overrides

- **Guest & Client** both set `--primary: #16a355` and `--ring: #16a355` via `theme-guest.css` / `theme-client.css`.
- All other tokens (background, card, border, muted) are **neutral gray** — the brand green is an accent on a neutral canvas, not a wash.
- Dark mode exists in the token system but is not the primary surface for either Guest or Client. Design light-first.

---

## 5. Typography

**Font:** `Inter, ui-sans-serif, system-ui, sans-serif` (via `--font-sans`). Single family — variable weights 400/500/600/700/800. Base `html` font-size is `14px`.

| Purpose            | Classes                                                           |
| ------------------ | ----------------------------------------------------------------- |
| Page title         | `text-3xl font-bold tracking-tight`                               |
| Page subtitle      | `text-muted-foreground`                                           |
| Section heading    | `text-xl font-semibold`                                           |
| Card title         | `text-lg font-medium` (large) or `text-sm font-medium` (compact)  |
| Body               | `text-sm` (14px default) or `text-base` (16px marketing surfaces) |
| Metadata / caption | `text-xs text-muted-foreground`                                   |
| Stat value         | `text-2xl font-bold`                                              |
| Table header       | `text-sm font-medium text-muted-foreground`                       |

**Weights:** 400 (normal), 500 (medium — nav, labels), 600 (semibold — section headings), 700 (bold — page titles).

### Eyebrow / overline signature

```html
<span class="eyebrow text-muted-foreground">ACCESSORIES</span>
<div class="bg-brand h-[2px] w-10"></div>
```

`class="eyebrow"` resolves to: 11px / weight 600 / uppercase / letter-spacing 0.025em. **Pair with a color class** — the utility does not set color. The 40px brand-green rule beneath is the signature — overline + rule is THE pattern for section introductions.

### Display type

Hero numbers (e.g. model designators "LC-40"): `text-6xl` or `text-7xl`, `leading-[0.9]`, `tracking -0.02em`. Page titles: `text-3xl font-bold tracking-tight`.

### Casing rules

| Context              | Rule               | Example                             |
| -------------------- | ------------------ | ----------------------------------- |
| Navigation / titles  | Title Case         | "Cap Sorter Assembly"               |
| Overlines / eyebrows | UPPERCASE          | "TECHNICAL SPEC SHEET · DRAWING 01" |
| Body / descriptions  | Sentence case      | "Heavy-duty inline capper for…"     |
| CTAs                 | Title Case (short) | "Add to Cart", "Request Quote"      |
| Part numbers         | Verbatim as-is     | `CS-DL-L-ASM-ADJ-150-KNB`           |

### Tabular figures

Use `tabular-nums` for prices, SKUs, and dimensions so numbers align in columns.

---

## 6. Spacing, radius, depth, motion

### Spacing

Tailwind 4px grid. Common rhythm: `gap-2/3/4/6/8`, page `px-6 lg:px-12`, vertical `py-8` to `py-12`.

- **Page horizontal padding:** `px-6 lg:px-12`
- **Max content width:** `max-w-container` (≈1280px)
- **Section vertical rhythm:** `py-8` to `py-12`
- **Sidebar (Client):** ~240px fixed.

### Border radius

Defined from `--radius: 0.625rem` (10px).

- `rounded-sm` (6px) — small elements
- `rounded-md` (8px) — inputs, buttons, badges (CTAs like "Add to Cart" use `rounded-md` — **never `rounded-full`**)
- `rounded-lg` (10px) — cards, dialogs
- `rounded-xl` (14px) — large containers, megamenu panels
- `rounded-full` — pills, avatar circles, icon buttons only
- `rounded-none` — spec drawings / blueprint headers (technical feel)

### Depth — borders-first

The interface is a technical document: flat, precise surfaces. Most elements use **border separation only, no shadow.**

- **No shadow:** cards, table rows, section containers
- **Shadow only for z-layer:** dropdowns (`shadow-md`), popovers, dialogs, megamenu panels, basket flyouts (`shadow-lg`)

### Hover & press states

- **Hover (links, nav items):** color shift to `--brand` (or `--brand-dark` on already-green surfaces), or `bg-accent` / `bg-brand/10`.
- **Hover (cards / interactive panels):** `shadow-md` lift, occasional `scale-[1.02]`, border may shift to `border-brand`.
- **Press / active:** `active:scale-[0.98]` for buttons; `bg-brand-dark` for primary CTAs.
- **Focus:** `ring-2 ring-ring` (which equals `ring-brand` in Guest/Client themes), `focus:outline-none` on the underlying element.

### Motion

- **200ms ease** for all transitions — hover, scroll-state transitions, dropdown open/close. No springs, no bounces.
- Skeleton loaders pulse subtly (`animate-pulse`). Toasts slide in from bottom-right.
- **No decorative animation.** No parallax. No floating elements. No on-scroll reveals beyond header collapse.

### Backgrounds

- **White is the default.** No gradients on the canvas.
- **Subtle accent gradients only on hero sections**: light gray-to-transparent washes, sometimes a 5–10% brand-green radial glow.
- **Blueprint grids** appear on technical hero variants (32px and 8px overlays at 5–14% opacity, masked to fade vertically).
- **Real product photography** on neutral seamless gray (RAL 7035) — no lifestyle, no people.
- **No hand-drawn illustrations.** No painterly textures.

### Transparency & blur

Used very sparingly: backdrop-blur on floating callout pills in product hero diagrams (`bg-white/95 backdrop-blur`). No frosted-glass card aesthetic. No glassmorphism.

---

## 7. Component inventory (reuse first)

All from `@lazar/ui`. Full API in `_specs/spec-ui/components/`. Any new page design should compose from these — **never invent a new component when one of these fits.**

### Display

`ui-button` · `ui-badge` · `ui-avatar` · `ui-alert` · `ui-card` (+ header, title, description, content, footer) · `ui-separator` · `ui-divider` · `ui-progress` · `ui-skeleton` · `ui-loader` · `ui-icon` · `ui-legend-indicator`

### Form

`input[uiInput]` · `textarea[uiTextarea]` · `ui-form-field` (+ control, message) · `label[uiLabel]` · `ui-checkbox` · `ui-radio-group` · `ui-switch` · `ui-select` · `ui-combobox` · `ui-searchbox` · `ui-date-picker` (always this — never native `<input type="date">`) · `ui-file-input` · `ui-slider` · `ui-input-pin`

### Navigation

`ui-breadcrumb` · `ui-pagination` · `ui-tabs` · `ui-stepper` · `ui-navbar` · `ui-nav-menu` · `ui-sidebar` · `ui-mega-menu`

### Overlay

`ui-dialog` · `ui-drawer` · `ui-dropdown-menu` · `ui-popover` · `ui-hover-card` · `ui-tooltip` · `ui-toaster` (toast) · `ui-lightbox` · `ui-collapsible`

### Data display

`ui-table` (primitive) · `ui-table-data` (full-featured — **use this for admin-style list pages**) · `ui-list-group` · `ui-tree` · `ui-accordion` · `ui-carousel` · `ui-command`

### Layout

`ui-container` · `ui-grid` + `ui-col` · `ui-prose` · `ui-timeline`

### Feature components (app-connected)

`ui-file-upload` (S3) · `ui-image-gallery-dialog` · `ui-pdf-viewer` · `ui-video-player` (+ dialog) · `lib-video-thumbnail-card` · `lib-manual-view`

---

## 8. Iconography

**Lucide** is the only icon library. Use `<ui-icon [name]="..." size="sm|md|lg" />` (thin wrapper around Lucide). Import icons from `@lazar/ui/icons`.

- **Stroke icons only.** Default Lucide style: 24×24 viewBox, 2px stroke, round caps, round joins. Never solid/filled icons except for status dots and badges.
- **Sizes:** `sm = 16px`, `md = 20px`, `lg = 24px`. Inline with text uses 16px.
- **Color:** inherits `currentColor`.
- **Stroke width:** 1.5px on ≤16px, 2px default.
- **Emoji: never.** Strip from any provided copy. Use Lucide icons instead.

---

## 9. Page inventory (what we're designing for)

### Guest app (`apps/frontend/guest`)

| Route                          | Page                 | Purpose                                     |
| ------------------------------ | -------------------- | ------------------------------------------- |
| `/`                            | Home / landing       | Hero, featured products, value props        |
| `/catalog`                     | Catalog landing      | Entry point to products/parts/videos        |
| `/catalog/search`              | Catalog search       | Unified search across products & parts      |
| `/catalog/products/all`        | Products browse      | Filterable product grid/list                |
| `/catalog/products/:cat`       | Products by category | Same layout, scoped                         |
| `/catalog/products/:cat/:slug` | Product detail       | Gallery, specs, variants, add-to-quote/cart |
| `/catalog/parts/all`           | Parts browse         | Filterable parts grid/list                  |
| `/catalog/parts/:cat/:slug`    | Part detail          | Part specs, compatible machines, order      |
| `/videos`                      | Videos library       | Categorized video cards                     |
| `/company` + sub-pages         | Company pages        | About, clients, president, dealer, find     |
| `/support` + sub-pages         | Support hub          | Contact, manuals, guides, order-parts       |
| `/quote`                       | Quote basket         | Review quote items, request RFQ             |
| `/wishlist`                    | Wishlist             | Saved items                                 |
| `/cart`                        | Cart                 | Direct-buy items                            |
| `/checkout`                    | Checkout             | Multi-step: address → shipping → payment    |
| `/auth/*`                      | Auth flows           | Login, verify, request-client-access        |

### Client app (`apps/frontend/client`)

Shares header + footer with guest. Adds left sidebar with these sections:

| Section  | Items                                  |
| -------- | -------------------------------------- |
| Projects | My Projects, My Machines               |
| Orders   | Orders, Quotes                         |
| Support  | Tickets, Messages, Manuals             |
| Account  | Profile, Addresses, Contacts, Settings |

---

## 10. Layout patterns

### Guest app layout

```
┌─────────────────────────────────────────────────┐
│  Header (sticky, two scroll states — see §11)   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Content (max-w-container, px-6 lg:px-12)       │
│                                                 │
├─────────────────────────────────────────────────┤
│  Footer (multi-column sitemap + copyright)      │
└─────────────────────────────────────────────────┘
```

### Client app layout

```
┌─────────────────────────────────────────────────┐
│  Header (same as guest)                         │
├────────────┬────────────────────────────────────┤
│            │                                    │
│  Left Nav  │  Content                           │
│  (~240px)  │                                    │
│            │                                    │
│  Grouped   │                                    │
│  sections  │                                    │
│  w/ icons  │                                    │
│            │                                    │
├────────────┴────────────────────────────────────┤
│  Footer (same as guest)                         │
└─────────────────────────────────────────────────┘
```

### Browse / list page pattern (products, parts)

- Breadcrumb at top
- Page title + result count
- Filter sidebar on left (collapsible on mobile) OR inline filter bar
- Sort dropdown + view toggle (grid / list) on right
- Card grid (desktop) → list (mobile)
- Pagination at bottom
- Empty state when no results

### Detail page pattern (product, part)

- Breadcrumb
- Split view: gallery/hero on left (~60%), summary + actions on right (~40%)
- Tabbed section below: Specs, Compatibility, Documents, Related
- Sticky "Add to Quote / Wishlist / Cart" action on mobile

### Layout signatures (use these patterns — see `spec-ui-layout-signatures.md`)

- **Overline + brand-rule + display number**: eyebrow text → 40px green rule (`bg-brand h-[2px] w-10`) → display number (`text-6xl leading-[0.9]`)
- **Annotated product diagram**: numbered callout pills (`bg-white/95 backdrop-blur`) connected to dots on the product image
- **Spec chips**: `bg-brand h-[2px] w-full` bottom green underline instead of pill background
- **Triple-basket header fingerprint**: Wishlist · Quote · Cart, each with red count badge

---

## 11. Header behavior

**Scroll states (two) — 200ms smooth transition:**

| State         | Background  | Height                     | Text/icons               | Trigger         |
| ------------- | ----------- | -------------------------- | ------------------------ | --------------- |
| Default (top) | White       | 70px desktop / 60px mobile | Dark text, green accents | `scrollY === 0` |
| Scrolled      | Brand green | 50px desktop / 44px mobile | White text/icons         | `scrollY > 0`   |

- Logo swaps variant (dark on white, white on green)
- Basket badges stay red (`bg-status-error`) in both states
- Sticky `top-0` throughout

**Structure:**

```
[Logo]  [Megamenu: Products | Parts | Videos | Company | Support]  …  [Wishlist] [Quote] [Cart] [Account/Auth]
```

**Basket flyouts** (Quote, Wishlist, Cart):

- Hover-triggered dropdown (200ms close delay)
- Header with title + count
- Scrollable item list (max-h ~260px)
- Footer with CTA
- Empty state with icon + message

---

## 12. Don'ts (common traps)

- ❌ Don't hardcode `#16a355` — use `bg-brand` or `bg-primary`.
- ❌ Don't add decorative shadows to cards — borders only.
- ❌ Don't use native `<input type="date">` — always `ui-date-picker`.
- ❌ Don't invent a new card/button variant if an existing CVA variant fits.
- ❌ Don't treat this like a consumer e-commerce site. It's a **B2B procurement catalog.**
- ❌ Don't drop metadata in favor of whitespace — engineers want part numbers, specs, SKUs visible.
- ❌ No emoji. Use Lucide icons.
- ❌ No bluish-purple gradients.
- ❌ No emoji-icon cards.
- ❌ No card-with-colored-left-stripe pattern.
- ❌ No glassmorphism or frosted-glass card effects.
- ❌ Don't use `rounded-full` for CTAs — buttons are `rounded-md` (8px), never pill-shaped.
- ❌ No springs, bounces, parallax, on-scroll reveals beyond header collapse.
- ❌ No lifestyle photography, hand-drawn illustrations, or warm color casts.

---

## 13. Screenshots / references

Live references to attach alongside this doc:

- `./bundle-2026-05-15/assets/` — logo assets + reference screenshots from the 2026-05-15 design session
- `./bundle-2026-05-15/preview/` — 33 HTML token/component preview cards (visual reference, not agent-facing)
- `../specs/spec-ui/` — component-level specs (load on demand)

### Suggested screenshots to upload

1. Guest home (`/`)
2. Catalog landing (`/catalog`)
3. Products browse (`/catalog/products/all`) — grid + filters
4. Product detail (`/catalog/products/sc-500/...`)
5. Parts browse (`/catalog/parts/all`)
6. Quote basket (`/quote`)
7. Header scrolled state (green)
8. Header default state (white)
9. Megamenu open
10. Client sidebar + dashboard

---

## 14. How to use this doc with claude.ai/design

1. **Attach this file** as the primary design brief.
2. **Point at the bundle** at `_docs/design-system/bundle-2026-05-15/` — attach `README.md` for the deep CONTENT FUNDAMENTALS + VISUAL FOUNDATIONS content.
3. **Upload screenshots** from `./bundle-2026-05-15/assets/` so Claude can see the current visual language.
4. **Reference component names** from §7 in your prompts ("use `ui-card` + `ui-badge`" rather than "make a card with a label").
5. **State the page route** you're designing for (e.g., "Design `/catalog/products/:cat` for the guest app") — Claude can cross-reference §9/§10 for layout expectations.
6. **If tokens change** (palette, brand color), update §4 here AND `_specs/spec-ui/spec-ui-tokens.md` — both must stay in sync.

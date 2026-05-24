# Layout Signatures — Guest & Client Apps

**Created:** 2026-05-15

**When to read:** Building any app page, especially hero sections, detail pages, and navigation pages. These are THE brand-defining patterns -- use them consistently.

---

## 1. Overline + Brand-Rule + Display Number

Used in project overviews, workspace heroes, and "stat spotlight" sections. The three-part vertical stack is a **signature** — it identifies Pixler pages at a glance.

```html
<!-- e.g. "PROJECT OVERVIEW · WORKSPACE 01" → 40px green rule → "WS-01" -->
<div class="flex flex-col gap-3">
  <span class="eyebrow text-muted-foreground">PROJECT OVERVIEW · WORKSPACE 01</span>
  <div class="bg-brand h-[2px] w-10"></div>
  <span class="text-7xl font-bold leading-[0.9] tracking-[-0.02em] text-foreground">WS-01</span>
</div>
```

**Rules:**

- Eyebrow uses `class="eyebrow"` + a color class (never hardcoded uppercase text classes as a substitute).
- Rule is exactly `h-[2px] w-10` (2px tall, 40px wide, `bg-brand`).
- Display number: `text-6xl` or `text-7xl`, always `leading-[0.9]` and `tracking-[-0.02em]`.

---

## 2. Annotated Product Diagram

Used in detail hero sections — numbered callout pills connect via lines/dots to specific parts of an interface diagram. Creates the "annotated diagram" feel.

```html
<div class="relative w-full">
  <!-- Detail image -->
  <img src="workspace.jpg" alt="Workspace overview" class="w-full object-cover" />

  <!-- Dot anchor (on image, absolutely positioned by % of image width/height) -->
  <div class="absolute top-[32%] left-[48%] size-3 rounded-full bg-brand ring-2 ring-white shadow"></div>

  <!-- Floating callout pill (near the dot) -->
  <div
    class="absolute top-[28%] left-[52%] flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-md text-xs font-medium whitespace-nowrap"
  >
    <span
      class="size-4 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-bold shrink-0"
      >1</span
    >
    Terminal panel
  </div>
</div>

<!-- Callout legend below the image (optional) -->
<ul class="grid grid-cols-2 gap-2 mt-4 text-sm">
  {callouts.map((callout) => (
  <li key={callout.id} className="flex items-start gap-2">
    <span
      className="size-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
    >{callout.id}</span>
    <span className="text-muted-foreground">{callout.label}</span>
  </li>
  ))}
</ul>
```

**Rules:**

- Callout pills: `bg-white/95 backdrop-blur-sm` — sparingly. This is one of the few places blur is allowed.
- Number badge: `bg-brand` fill, white text. Round (`rounded-full`).
- Dot on image: matches badge color (`bg-brand`), `ring-2 ring-white` for visibility on any background.
- Position dots as percentages of the image container for responsiveness.

---

## 3. Spec Chip (bottom green underline)

Used for individual spec values on detail pages. The bottom underline instead of a pill background gives a "spec table cell" feel — grounded, technical.

```html
<div className="flex flex-wrap gap-2">
  {specs.map((spec) => (
  <div key={spec.label} className="flex flex-col items-center min-w-[80px] px-3 pt-2 pb-1 border border-border rounded-md bg-card">
    <span className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{spec.label}</span>
    <span className="text-sm font-semibold tabular-nums text-foreground">{spec.value}</span>
    <div className="bg-brand h-[2px] w-full mt-2 rounded-full"></div>
  </div>
  ))}
</div>
```

**Rules:**

- Bottom underline: `bg-brand h-[2px] w-full` — full width of the chip, no pill.
- Spec values: `tabular-nums` for alignment. `font-semibold` at `text-sm`.
- Label: tiny uppercase (`text-[10px] uppercase tracking-wide text-muted-foreground`) — NOT the `eyebrow` utility (too prominent for inline chip labels).
- Container: `border border-border bg-card rounded-md` — standard card style. No shadow.

---

## 4. Action-Group Header Fingerprint

The developer-tool signature — Projects · Workspaces · Terminal in the header, each with a count badge. This pattern identifies Pixler as a multi-context developer tool.

```html
<div className="flex items-center gap-0.5">
  {actions.map((action) => (
  <button
    key={action.key}
    className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md
             hover:bg-white/10 transition-colors duration-200"
    aria-label={`${action.label} (${action.count} items)`}
  >
    <Icon name={action.icon} size="sm" />
    <span className="hidden lg:inline">{action.label}</span>
    {action.count > 0 && (
    <span
      className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full
                     bg-status-error text-white text-[10px] font-bold
                     flex items-center justify-center px-1 leading-none"
    >
      {action.count > 99 ? '99+' : action.count}
    </span>
    )}
  </button>
  ))}
</div>
```

**Rules:**

- Count badge: always `bg-status-error` (red) in **both** header scroll states (white header and green header).
- Badge cap: `99+` for counts over 99.
- Button hover: `hover:bg-white/10` works on both white and green header backgrounds (transparent, so it reads correctly in both states).
- Order: Projects · Workspaces · Terminal (left to right). This order is fixed -- don't reorder.

---

## 5. Header Scroll-State Interaction

The header transitions between two distinct states as the user scrolls. This is a signature interaction — it signals the two visual modes (default at top, compact once scrolled).

```typescript
// In the header component:
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 0);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

```jsx
<header
  className={scrolled
    ? 'fixed top-0 inset-x-0 z-50 h-[50px] bg-brand text-white transition-all duration-200'
    : 'fixed top-0 inset-x-0 z-50 h-[70px] bg-background text-foreground transition-all duration-200'}
>
  {/* Dark logo when white, white logo when green */}
  <img src={scrolled ? logoWhite : logoDark} alt="Pixler" className="h-7 transition-opacity duration-200" />
</header>
```

**Rules:**

- Default (top): white background, dark text, green nav highlights. Height 70px desktop / 60px mobile.
- Scrolled: brand green (`bg-brand`), white text/icons. Height 50px desktop / 44px mobile.
- Transition: `duration-200 ease` — no springs.
- Logo: swaps between dark variant (on white) and white variant (on green).
- Count badges: stay `bg-status-error` (red) in both states.

---

## 6. Breadcrumb — Every Detail Page

A breadcrumb appears at the top of every detail page (project, workspace, terminal session). It ends in the **bold current item**.

```html
<ui-breadcrumb>
  <ui-breadcrumb-list>
    <ui-breadcrumb-item>
      <ui-breadcrumb-link href="/projects">Projects</ui-breadcrumb-link>
    </ui-breadcrumb-item>
    <ui-breadcrumb-separator />
    <ui-breadcrumb-item>
      <ui-breadcrumb-link href="/projects/alpha/workspaces">Workspaces</ui-breadcrumb-link>
    </ui-breadcrumb-item>
    <ui-breadcrumb-separator />
    <ui-breadcrumb-item>
      <ui-breadcrumb-page>ws-dev-01</ui-breadcrumb-page>
    </ui-breadcrumb-item>
  </ui-breadcrumb-list>
</ui-breadcrumb>
```

**Rules:**

- Current item (`ui-breadcrumb-page`): rendered bold and non-clickable.
- Links: `text-muted-foreground` hover to `text-foreground`.
- Separator: `·` or `chevron-right` icon (match the site's existing breadcrumb separator).
- Never omit on detail pages -- it's the primary "where am I" signal in a deep navigation hierarchy.

---

## 7. Megamenu

Triggered on hover (desktop) / tap (mobile). Reveals nested navigation structure across two or more columns.

```html
<!-- Trigger item in nav -->
<ui-mega-menu>
  <ui-mega-menu-trigger>Products</ui-mega-menu-trigger>
  <ui-mega-menu-content>
    <div className="grid grid-cols-3 gap-6 p-6 max-w-container">
      {categories.map((cat) => (
      <a
        key={cat.slug}
        href={`/tools/${cat.slug}`}
        className="group flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors duration-200"
      >
        <Icon name={cat.icon} size="md" className="text-muted-foreground group-hover:text-brand shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-medium">{cat.name}</div>
          <div className="text-xs text-muted-foreground">{cat.description}</div>
        </div>
      </a>
      ))}
    </div>
  </ui-mega-menu-content>
</ui-mega-menu>
```

**Rules:**

- Background: white with `border-border` + `shadow-lg` (z-layer shadow rule applies).
- Radius: `rounded-xl` (14px — large container rule).
- Item hover: `bg-accent`, icon shifts to `text-brand`.
- No decorative images in the megamenu itself.

---

> **Cross-links:** `spec-ui-design-system.md` → hover/press states, header signature overview · `spec-ui-layout-patterns.md` → where signatures plug into page-level layouts

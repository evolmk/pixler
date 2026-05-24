# Typography Reference

## Font Family

Defined in `@theme inline` in `globals.css`:

```css
--font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
```

Usage: `font-sans` (default body font).

## Type Scale

Standard Tailwind v4 type scale with common usage patterns:

| Class       | Size | Line Height | Usage                                           |
| ----------- | ---- | ----------- | ----------------------------------------------- |
| `text-xs`   | 12px | 16px        | Badges, labels, timestamps, captions            |
| `text-sm`   | 14px | 20px        | Body text, table cells, descriptions, nav items |
| `text-base` | 16px | 24px        | Default body, inputs, buttons                   |
| `text-lg`   | 18px | 28px        | Card titles, sub-headings                       |
| `text-xl`   | 20px | 28px        | Section headers                                 |
| `text-2xl`  | 24px | 32px        | Stat values, page sub-titles                    |
| `text-3xl`  | 30px | 36px        | Page titles                                     |
| `text-4xl`  | 36px | 40px        | Hero headings (rare in admin)                   |

## Font Weights

| Class           | Weight | Usage                                         |
| --------------- | ------ | --------------------------------------------- |
| `font-normal`   | 400    | Body text, descriptions                       |
| `font-medium`   | 500    | Nav items, table headers, labels, card titles |
| `font-semibold` | 600    | Section headings, stat values                 |
| `font-bold`     | 700    | Page titles, hero text                        |

## Tracking (Letter Spacing)

| Class             | Usage                                             |
| ----------------- | ------------------------------------------------- |
| `tracking-tight`  | Page titles, large headings                       |
| `tracking-normal` | Body text (default)                               |
| `tracking-wide`   | Uppercase labels (sidebar groups, section labels) |

## Eyebrow / Overline Signature

The overline + brand-rule pattern is the primary section-introduction signature in Guest/Client apps.

```html
<!-- eyebrow label + 40px green rule -->
<span class="eyebrow text-muted-foreground">ACCESSORIES</span>
<div class="bg-brand h-[2px] w-10"></div>
```

`class="eyebrow"` resolves to: 11px / weight 600 / uppercase / letter-spacing 0.025em. Registered via `@utility` in `globals.css`. **Always pair with a color class** — the utility does not set color.

## Display Type

For hero numbers (model designators, display stats in marketing sections):

```html
<!-- e.g. "LC-40", large stat value -->
<span class="text-7xl font-bold leading-[0.9] tracking-[-0.02em]">LC-40</span>
```

Use `text-6xl` or `text-7xl`. Always `leading-[0.9]` and `-0.02em` tracking for display weight. Not for page titles (those use `text-3xl font-bold tracking-tight`).

## Casing Rules

| Context              | Rule                        | Example                                       |
| -------------------- | --------------------------- | --------------------------------------------- |
| Navigation labels    | Title Case                  | "Parts & Components"                          |
| Page titles          | Title Case                  | "Cap Sorter Assembly"                         |
| Overlines / eyebrows | UPPERCASE                   | "TECHNICAL SPEC SHEET · DRAWING 01"           |
| Body / descriptions  | Sentence case               | "Heavy-duty fully automatic inline capper…"   |
| CTAs                 | Title Case (verb-first)     | "Add to Cart", "Request Quote", "View Manual" |
| Part numbers         | Verbatim, hyphens preserved | `CS-DL-L-ASM-ADJ-150-KNB`                     |
| Em-dash usage        | Inline elaboration          | "3-jaw chuck — rated to 350 ft-lb"            |
| Bullet lists         | No terminal punctuation     | `· Cap Elevator · Chuck Capper`               |

## Tabular Figures

Use `tabular-nums` for any column of numbers that needs alignment: prices, SKUs, dimensions, quantities.

```html
<td class="tabular-nums">$1,495</td>
<td class="tabular-nums">CS-DL-L-ASM-ADJ-150-KNB</td>
```

## Common Typography Patterns

### Page Title

```html
<h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
```

### Page Subtitle

```html
<p class="text-muted-foreground">Welcome back, John</p>
```

### Card Title

```html
<h3 class="text-sm font-medium">Total Revenue</h3>
```

### Stat Value

```html
<div class="text-2xl font-bold">$1.2M</div>
```

### Muted Description

```html
<p class="text-xs text-muted-foreground">+18% from last month</p>
```

### Sidebar Group Label

```html
<span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Platform</span>
```

### Table Header

```html
<th class="text-sm font-medium text-muted-foreground">Customer</th>
```

### Badge Text

```html
<span class="text-xs font-medium">Active</span>
```

## Truncation

| Class          | Behavior                  |
| -------------- | ------------------------- |
| `truncate`     | Single line with ellipsis |
| `line-clamp-2` | Two lines with ellipsis   |
| `line-clamp-3` | Three lines with ellipsis |

## Semantic Text Colors

| Class                     | Usage                       |
| ------------------------- | --------------------------- |
| `text-foreground`         | Primary body text           |
| `text-muted-foreground`   | Secondary/muted text        |
| `text-primary`            | Links, active items         |
| `text-primary-foreground` | Text on primary backgrounds |
| `text-destructive`        | Error text                  |
| `text-accent-foreground`  | Text on accent backgrounds  |
| `text-sidebar-foreground` | Sidebar text                |

# Design Tokens Reference

All tokens defined in `globals.css` as CSS custom properties, mapped to Tailwind via `@theme inline`.

## Architecture

One shared token system in `globals.css`. Color scheme via `data-color-scheme` on `<html>`. Dark mode via `.dark` on `<html>`.

## Semantic Color Tokens

### Core Tokens (Light / Dark)

| Token                      | Tailwind Class                | Usage                  |
| -------------------------- | ----------------------------- | ---------------------- |
| `--background`             | `bg-background`               | Page background        |
| `--foreground`             | `text-foreground`             | Primary text           |
| `--card`                   | `bg-card`                     | Card surfaces          |
| `--card-foreground`        | `text-card-foreground`        | Card text              |
| `--popover`                | `bg-popover`                  | Popover/dropdown bg    |
| `--popover-foreground`     | `text-popover-foreground`     | Popover text           |
| `--primary`                | `bg-primary`                  | Primary actions        |
| `--primary-foreground`     | `text-primary-foreground`     | Text on primary        |
| `--secondary`              | `bg-secondary`                | Secondary surfaces     |
| `--secondary-foreground`   | `text-secondary-foreground`   | Text on secondary      |
| `--muted`                  | `bg-muted`                    | Muted backgrounds      |
| `--muted-foreground`       | `text-muted-foreground`       | Muted/placeholder text |
| `--accent`                 | `bg-accent`                   | Hover highlights       |
| `--accent-foreground`      | `text-accent-foreground`      | Text on accent         |
| `--destructive`            | `bg-destructive`              | Error/danger           |
| `--destructive-foreground` | `text-destructive-foreground` | Text on destructive    |
| `--border`                 | `border-border`               | Default borders        |
| `--input`                  | `border-input`                | Input borders          |
| `--ring`                   | `ring-ring`                   | Focus rings            |

### Sidebar Tokens

| Token                          | Tailwind Class                    | Usage               |
| ------------------------------ | --------------------------------- | ------------------- |
| `--sidebar`                    | `bg-sidebar`                      | Sidebar background  |
| `--sidebar-foreground`         | `text-sidebar-foreground`         | Sidebar text        |
| `--sidebar-primary`            | `bg-sidebar-primary`              | Active nav item     |
| `--sidebar-primary-foreground` | `text-sidebar-primary-foreground` | Active nav text     |
| `--sidebar-accent`             | `bg-sidebar-accent`               | Hover state         |
| `--sidebar-accent-foreground`  | `text-sidebar-accent-foreground`  | Hover text          |
| `--sidebar-border`             | `border-sidebar-border`           | Sidebar borders     |
| `--sidebar-ring`               | `ring-sidebar-ring`               | Sidebar focus rings |

### Chart Tokens

| Token       | Tailwind Class               | Usage                  |
| ----------- | ---------------------------- | ---------------------- |
| `--chart-1` | `text-chart-1`, `bg-chart-1` | Primary chart color    |
| `--chart-2` | `text-chart-2`, `bg-chart-2` | Secondary chart color  |
| `--chart-3` | `text-chart-3`, `bg-chart-3` | Tertiary chart color   |
| `--chart-4` | `text-chart-4`, `bg-chart-4` | Quaternary chart color |
| `--chart-5` | `text-chart-5`, `bg-chart-5` | Quinary chart color    |

## Brand Tokens

Static tokens — **not affected by color schemes or dark mode**.

| Token                | Value     | Tailwind Class        | Usage               |
| -------------------- | --------- | --------------------- | ------------------- |
| `--brand`            | `#16a355` | `bg-brand`            | Primary brand green |
| `--brand-light`      | `#22c55e` | `bg-brand-light`      | Light brand variant |
| `--brand-dark`       | `#15803d` | `bg-brand-dark`       | Dark brand variant  |
| `--pixler-green`      | `#3a9d5c` | `bg-pixler-green`      | Pixler green  |
| `--pixler-green-dark` | `#2e8b57` | `bg-pixler-green-dark` | Dark variant  |

## Surface Tokens

Static tokens — **not affected by color schemes or dark mode**.

| Token              | Value     | Tailwind Class      | Usage                                              |
| ------------------ | --------- | ------------------- | -------------------------------------------------- |
| `--footer-surface` | `#e8efe8` | `bg-footer-surface` | Very pale gray-green — footer and landing sections |

## Status Tokens

Static tokens — **not affected by color schemes or dark mode**.

| Token              | Value     | Tailwind Class        | Usage    |
| ------------------ | --------- | --------------------- | -------- |
| `--status-error`   | `#dc2626` | `text-status-error`   | Errors   |
| `--status-warning` | `#f59e0b` | `text-status-warning` | Warnings |
| `--status-success` | `#10b981` | `text-status-success` | Success  |
| `--status-info`    | `#3b82f6` | `text-status-info`    | Info     |

## Color Schemes

Set via `data-color-scheme` attribute on `<html>`. All schemes provide light + dark variants.

| Scheme      | Selector                         | Character                  |
| ----------- | -------------------------------- | -------------------------- |
| **Default** | `:root` (no attribute)           | Green primary (hue 145)    |
| Slate       | `[data-color-scheme='slate']`    | Cool blue-gray             |
| Zinc        | `[data-color-scheme='zinc']`     | Warm purple-gray           |
| Stone       | `[data-color-scheme='stone']`    | Warm yellow-gray           |
| Gray        | `[data-color-scheme='gray']`     | Blue-tinted gray           |
| Rose        | `[data-color-scheme='rose']`     | Pink/rose primary (hue 12) |
| Blue        | `[data-color-scheme='blue']`     | Blue primary (hue 250)     |
| Green       | `[data-color-scheme='green']`    | Green primary (hue 145)    |
| Orange      | `[data-color-scheme='orange']`   | Orange primary (hue 55)    |
| Violet      | `[data-color-scheme='violet']`   | Violet primary (hue 290)   |
| Nord Ice    | `[data-color-scheme='nord-ice']` | Nord-inspired arctic blues |

## Per-App Theme Overrides

- **Admin**: no overrides — uses default neutral
- **Client & Guest**: brand green primary (`--primary: #16a355`)
- **Portal**: navy sidebar (`--sidebar: oklch(0.21 0.06 255)`)

Per-app overrides can be loaded via additional CSS files after `globals.css`.

## Spacing Scale

Standard Tailwind v4 spacing (1 unit = 4px):

| Class           | Value | Common Usage                     |
| --------------- | ----- | -------------------------------- |
| `p-1` / `gap-1` | 4px   | Tight spacing, icon gaps         |
| `p-2` / `gap-2` | 8px   | Compact elements, button padding |
| `p-3` / `gap-3` | 12px  | Default gap between items        |
| `p-4` / `gap-4` | 16px  | Standard card/section spacing    |
| `p-6` / `gap-6` | 24px  | Section spacing, card padding    |
| `p-8` / `gap-8` | 32px  | Large section spacing            |
| `p-12`          | 48px  | Section dividers                 |

## Border Radius

Defined via `--radius: 0.625rem` (10px):

| Token         | Tailwind Class | Value                              | Usage            |
| ------------- | -------------- | ---------------------------------- | ---------------- |
| `--radius-sm` | `rounded-sm`   | `calc(var(--radius) - 4px)` = 6px  | Small elements   |
| `--radius-md` | `rounded-md`   | `calc(var(--radius) - 2px)` = 8px  | Inputs, badges   |
| `--radius-lg` | `rounded-lg`   | `var(--radius)` = 10px             | Cards, dialogs   |
| `--radius-xl` | `rounded-xl`   | `calc(var(--radius) + 4px)` = 14px | Large containers |

## Custom Utilities

Registered via `@utility` in `globals.css`.

| Utility           | CSS output                                                                                 | Notes                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `class="eyebrow"` | 11px / weight 600 / line-height 1.2 / letter-spacing 0.025em / `text-transform: uppercase` | Backed by `--text-eyebrow` tokens in `globals.css`. **Pair with a color class** (`text-muted-foreground`, `text-brand`, etc.) — utility does not set color. |

Usage pattern — overline + brand-rule signature:

```html
<span class="eyebrow text-muted-foreground">ACCESSORIES</span>
<div class="bg-brand h-[2px] w-10"></div>
```

## Icon Stroke-Width Rules

| Icon size | Stroke width | Notes                         |
| --------- | ------------ | ----------------------------- |
| ≤ 16px    | 1.5px        | Inline with text, small icons |
| Default   | 2px          | Standard `md` / `lg` icons    |

Never go thicker — keeps the technical feel. Icons inherit `currentColor`. On white: `--foreground` or `--muted-foreground`. On brand-green surfaces: white.

## Base Layer

`font-size: 14px` on `html`. `bg-background text-foreground` on `body`. All borders default to `border-border`, focus rings to `ring/50`.

## Dark Mode

Toggle via `.dark` on `<html>`. All semantic tokens have dark-mode values — background inverts, primary brightens, borders/muted shift darker.

## Rules

1. **Never hardcode colors** — always use semantic tokens (`bg-primary`, `text-muted-foreground`, etc.)
2. **Use brand tokens sparingly** — only for explicit brand elements (logos, marketing CTAs), not general UI
3. **Use status tokens for status indicators** — don't repurpose `destructive` for non-error red
4. **Per-app overrides go in theme files** — never modify `globals.css` for app-specific needs
5. **Test both light and dark** — all components must work in both modes

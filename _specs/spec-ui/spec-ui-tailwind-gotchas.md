# Tailwind CSS Patterns & Gotchas

Common patterns for tricky CSS situations using Tailwind utilities.

---

## Image Inside Flex Container (No Scrollbar)

**Problem**: An image inside a `flex-col` container overflows, gets clipped, or creates a scrollbar — even with `max-h-full`.

**Root cause**: Two issues combine:

1. Flex items default to `min-height: auto`, refusing to shrink below intrinsic size.
2. The image wrapper must use `flex-col` — not `flex` (row). With flex-row, `flex-shrink` only controls _horizontal_ shrinking; the image's height is on the cross-axis and stays at its intrinsic size, getting clipped by `overflow-hidden`.

**Solution**: The body/wrapper must be `flex flex-col`, and the image needs `shrink min-h-0`.

```html
<!-- Container: flex column with constrained height -->
<div class="flex flex-col max-h-[85vh]">
  <!-- Header (fixed) -->
  <div class="flex-shrink-0 p-4">Title</div>

  <!-- Body (flex-grow, clips overflow) — MUST be flex-col -->
  <div class="flex-1 min-h-0 flex flex-col items-center justify-center overflow-hidden px-4 py-2">
    <img src="..." class="shrink min-h-0 max-w-full object-contain" />
  </div>

  <!-- Footer (fixed) -->
  <div class="flex-shrink-0 p-4">Navigation</div>
</div>
```

**Key classes on the image**:
| Class | Why |
|-------|-----|
| `shrink` | `flex-shrink: 1` — allows image to shrink along the main axis |
| `min-h-0` | Overrides default `min-height: auto` so image can be smaller than its natural height |
| `max-w-full` | Don't exceed container width |
| `object-contain` | Maintain aspect ratio while fitting within the shrunk box |

**Key classes on the body/wrapper**:
| Class | Why |
|-------|-----|
| `flex-1` | Grow to fill remaining space |
| `min-h-0` | Allow shrinking (must be on EVERY flex parent in the chain) |
| `flex flex-col` | **Critical** — main axis must be vertical so `flex-shrink` controls height, not width |
| `overflow-hidden` | Clip any remaining overflow |
| `items-center justify-center` | Center the image horizontally (cross-axis) and vertically (main axis) |

**Why `flex` (row) fails**: In flex-row, `flex-shrink` shrinks the image _horizontally_. The image height is on the cross-axis, controlled by `align-items: center`, which does NOT constrain height — it just centers the overflowing image. Result: image stays at intrinsic height and gets clipped top/bottom.

**Critical rule**: `min-h-0` must be set on every flex item in the ancestor chain, not just the image. Without it, any parent can still refuse to shrink, blocking the image from fitting.

---

## Tailwind Source Scanning (@source)

**Problem**: Tailwind classes used in a library package don't generate CSS in the app.

**Root cause**: Tailwind v4 CSS-first config only scans directories listed via `@source`. If a package isn't listed, its classes are invisible.

**Solution**: Add `@source` for every package that contains Tailwind classes.

```css
/* apps/frontend/guest/src/styles.css */
@import 'tailwindcss';
@source '../../../../packages/ui/src';
@source '../../../../packages/ui-components/src';
```

**Symptoms of missing @source**: Classes appear in code but have zero effect. No build errors. Looks like CSS isn't working.

---

## tailwind-merge (cn) Class Override

**Behavior**: `cn()` uses `tailwind-merge` which resolves conflicts — last class wins. Shorthand properties (`overflow-hidden`) correctly override axis-specific ones (`overflow-y-auto`).

```ts
cn('overflow-y-auto', 'overflow-hidden'); // → 'overflow-hidden'
cn('px-6', '!px-4'); // → '!px-4'
cn('flex flex-col-reverse', '!grid'); // → '!grid' (display conflict resolved)
```

Use `!` prefix (Tailwind important) when overriding base component classes via `className` prop to ensure specificity.

---

## 3-Column Centered Footer (Grid)

**Problem**: A footer with left/center/right items where center must be perfectly centered regardless of left/right content width.

**Solution**: Use CSS grid with 3 equal columns instead of flexbox `justify-between`.

```html
<div class="grid grid-cols-3 items-center p-4">
  <div class="justify-self-start">Left</div>
  <span class="justify-self-center">Center</span>
  <div class="justify-self-end">Right</div>
</div>
```

Flexbox `justify-between` shifts the center item when left/right have different widths. Grid columns are equal-width, so center stays centered.

---

## Icon + Text Vertical Alignment

**Problem**: An icon next to a label looks 1–2px too low even with `items-center`.

**Root cause**: `items-center` aligns to the flex container's geometric center. Text has descenders and internal line-height padding baked into the font metrics — the visual center of the glyph sits slightly above the geometric center of the text node.

**Solution**: Use `translate-y-px` on the icon to shift it up one pixel optically.

```html
<!-- Icon sits 1px low -->
<div class="flex items-center gap-2">
  <PlusIcon className="size-4" />
  <span>Create Item</span>
</div>

<!-- Optically corrected -->
<div class="flex items-center gap-2">
  <PlusIcon className="size-4 -translate-y-px" />
  <span>Create Item</span>
</div>
```

**When to apply**: Most noticeable with `text-sm` (14px) and `size-4` (16px) icons. Less noticeable at larger sizes. Check with a screenshot — if it looks fine without correction, don't add it.

---

## Lucide Icon Internal Whitespace

**Problem**: `gap-2` between an icon and label looks wider than the same `gap-2` between two text nodes.

**Root cause**: Lucide icons have ~1–1.5px of internal viewBox padding built in. The icon's visual edge does not reach the bounding box edge, so the perceived gap is `gap` + padding on each side.

**Solution**: Drop one gap step when pairing a Lucide icon with text.

```html
<!-- Looks too wide -->
<div class="flex items-center gap-2">
  <PlusIcon className="size-4" />
  <span>Save</span>
</div>

<!-- Visually tighter, same optical distance as gap-2 between text nodes -->
<div class="flex items-center gap-1.5">
  <PlusIcon className="size-4" />
  <span>Save</span>
</div>
```

**Rule of thumb**: Icon + text → use `gap-1.5`. Text + text → use `gap-2`.

---

## Button Content Alignment

**Problem**: Button label sits slightly low or high inside the button due to font metric padding.

**Root cause**: Browser font metrics include ascender/descender space above and below glyphs. Combined with the button's `py-*` padding, the visual center of the text rarely matches the geometric center.

**Solution**: Add `leading-none` to the button's text content (or the button itself) to strip line-height from the equation, then rely on `py-*` alone for vertical centering.

```html
<!-- Text may float slightly off-center -->
<button class="inline-flex items-center px-4 py-2 text-sm">Save</button>

<!-- Consistent vertical centering -->
<button class="inline-flex items-center px-4 py-2 text-sm leading-none">Save</button>
```

**Note**: This only matters for buttons with explicit `py-*` values. Our `ui-button` component already applies this — only relevant when writing raw `<button>` elements (e.g., in Storybook stories or one-off templates).

---

## `items-center` vs `items-baseline`

**Problem**: Multi-line or mixed-size text next to an icon looks misaligned — one element shifts when the other wraps.

**Root cause**: `items-center` aligns to the container's center axis. When one child changes height (e.g., a label wraps to two lines), the icon re-centers to the new midpoint instead of staying locked to the first text line.

**Solution**: Use `items-baseline` when aligning text of different sizes, or when content may wrap. Use `items-center` only when all children have a fixed, known height.

```html
<!-- Icon drifts if label wraps -->
<div class="flex items-center gap-2">
  <AlertCircleIcon className="size-4" />
  <span class="text-sm">This is a long label that might wrap onto two lines</span>
</div>

<!-- Icon stays locked to the first text baseline -->
<div class="flex items-baseline gap-2">
  <AlertCircleIcon className="size-4 translate-y-0.5" />
  <span class="text-sm">This is a long label that might wrap onto two lines</span>
</div>
```

**Note**: Icons are `inline-flex` boxes with no baseline, so `items-baseline` aligns them to their bottom edge. Add `translate-y-0.5` (2px) to compensate and bring the icon back up to match the text cap-height.

---

## Form Field Vertical Rhythm

**Problem**: A row of form inputs, labels, and buttons sits at different heights — fields look "lumpy."

**Root cause**: Inputs sized by `py-*` padding have heights that depend on the font and line-height. A `<select>`, a `<button>`, and an `<input>` using the same `py-2 text-sm` will often differ by 1–3px because browsers apply different internal metrics.

**Solution**: Use an explicit `h-9` (36px) or `h-10` (40px) on every interactive element in a row. This overrides browser inconsistencies and guarantees pixel-perfect alignment.

```html
<!-- Heights differ by 1-3px across element types -->
<div class="flex items-center gap-2">
  <input class="rounded border px-3 py-2 text-sm" />
  <select class="rounded border px-3 py-2 text-sm"></select>
  <button class="rounded bg-primary px-4 py-2 text-sm text-white">Go</button>
</div>

<!-- All locked to 36px -->
<div class="flex items-center gap-2">
  <input class="h-9 rounded border px-3 text-sm" />
  <select class="h-9 rounded border px-3 text-sm"></select>
  <button class="h-9 rounded bg-primary px-4 text-sm text-white">Go</button>
</div>
```

**Our standard heights**: `h-9` (36px) for compact rows, `h-10` (40px) for standard forms. Never mix them in the same row.

---

## `class="eyebrow"` Custom Utility

**What it is:** A registered `@utility` block in `packages/ui-styles/src/globals.css:1073-1079`, backed by `--text-eyebrow` typography tokens at `globals.css:965-968`.

**Resolved CSS:** 11px / weight 600 / line-height 1.2 / letter-spacing 0.025em / `text-transform: uppercase`.

**Usage:**

```html
<span class="eyebrow text-muted-foreground">ACCESSORIES</span>
<div class="bg-brand h-[2px] w-10"></div>
```

**Key rule:** The utility does **not** set `color`. Always pair with `text-muted-foreground`, `text-brand`, `text-foreground`, or similar. The 40px brand-green rule beneath (`bg-brand h-[2px] w-10`) is the signature — together they form the overline + rule pattern.

**Do NOT use `text-xs font-semibold uppercase tracking-[0.25em]` as a substitute.** That older pattern — visible in early prototype files before `@utility eyebrow` was standardized — uses tracking that is **10× too wide** (`0.25em` vs the eyebrow's correct `0.025em`). It also uses 12px (`text-xs`) instead of the eyebrow's 11px, and bypasses the `--text-eyebrow` token system. Use `class="eyebrow"` consistently.

---

## `@import 'tw-animate-css'` Caveat

`packages/ui-styles/src/globals.css` opens with `@import 'tw-animate-css'`. This npm package is **not fetchable via CDN**, so the design system bundle's copy of `globals.css` has it commented out for use in HTML prototypes.

**In production code:** the import is active and required for animation utilities (`fade`, `scale`, `slide` keyframes from `tw-animate-css`). If you see missing keyframe animations in a local dev build, check that `tw-animate-css` is installed: `pnpm add -w tw-animate-css`.

Regular Tailwind transitions (`duration-200 ease`) do NOT require `tw-animate-css` — only `animate-*` keyframe utilities do.

# Pixler UI — Coding Protocol

Load this file for: `variant-add`, `new-component`, `compose`, `page-build`, `form-work` tasks.
Skip for: `style-tweak`, `story-only`, `unclear`.

---

## What Are You Building?

| Task                               | Path                          |
| ---------------------------------- | ----------------------------- |
| New reusable primitive             | → New Component (below)       |
| Composition of existing components | → Block / Composition (below) |
| Story for a single component       | → Read `STORYBOOK.md`         |
| Full-page demo / screen            | → Read `STORYBOOK.md`         |

## Variant Extension (extending CVA variants)

Read the existing component file first, then append only the new variant key to the `cva()` call:

```typescript
// In button.tsx — add to existing variants object:
const buttonVariants = cva('...base classes...', {
  variants: {
    variant: {
      // ... existing variants ...
      'brand-solid': 'bg-brand text-white hover:bg-brand-dark',
    },
  },
});
```

`ButtonProps` type is inferred automatically from `VariantProps<typeof buttonVariants>` — no manual type change needed.

## New Component

Follow the Architecture Rules below and the Component Template.

```
packages/ui/src/components/{name}.tsx       (single file: component + CVA variants + types)
packages/ui/src/components/{name}.stories.tsx (colocated story)
```

Export from `packages/ui/src/components/index.ts`.

### Component Template

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const nameVariants = cva('inline-flex items-center justify-center rounded-md', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      outline: 'border border-input bg-background',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface NameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof nameVariants> {}

const Name = React.forwardRef<HTMLDivElement, NameProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(nameVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Name.displayName = 'Name';

export { Name, nameVariants, type NameProps };
```

### Radix UI Composition

When wrapping a Radix primitive, forward ref to the primitive's root and merge classes:

```tsx
import * as DialogPrimitive from '@radix-ui/react-dialog';

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
```

## Block / Composition

A "block" is a reusable composition of existing `ui` components — not a new primitive.
Build it in the consuming feature component or story. Do NOT add files to `packages/ui/src/components/` unless it's a true design-system primitive.

## Code Rules

- Prefer composition over prop drilling — pass children or render props, not deeply nested config objects
- Use `cn()` from `@/lib/utils` (clsx + tailwind-merge) for all class merging
- Use `forwardRef` on every component that renders a DOM element
- Use semantic tokens only: `bg-primary`, `text-muted-foreground` — never `bg-gray-200`
- Always read `_specs/spec-ui/spec-ui-tokens.md` before using color tokens
- **Icons: always use lucide-react, never inline `<svg>`** — see Icon Usage below

## Icon Usage (lucide-react)

Always use lucide-react — never inline `<svg>`. Import icons directly by name and render as JSX elements. Sizes via `size` prop or `className`. Browse icons at https://lucide.dev/icons/

```tsx
import { PanelLeft, ChevronDown, Search } from 'lucide-react';

// Default size (24px)
<PanelLeft />

// Custom size
<Search size={16} />
<ChevronDown className="h-4 w-4" />

// With semantic color
<Search className="text-muted-foreground" />
```

---

## Architecture Rules (Hard Constraints)

1. **Single-file components** — CVA variants, types, and component in one `.tsx` file (shadcn/ui style)
2. **forwardRef on all components** — every component that renders a DOM element must use `React.forwardRef`
3. **CVA for variants** — use `cva()` from `class-variance-authority` for all variant logic
4. **cn() for class merging** — `cn()` (clsx + tailwind-merge) from `@/lib/utils`, always accept `className` prop
5. **Radix UI primitives** — use `@radix-ui/*` for accessible interactive components (Dialog, Popover, DropdownMenu, etc.)
6. **Semantic tokens only** — `bg-primary`, `text-muted-foreground`, never `bg-gray-200`
7. **React only** — functional components, hooks, JSX; no class components, no non-React framework patterns
8. **Tailwind v4 CSS-first** — theme tokens in `globals.css`; no `theme()` in arbitrary values
9. **Inline everything** — no separate `.css` files, no separate `.variants.ts` files

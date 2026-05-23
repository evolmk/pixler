import { cva, type VariantProps } from 'class-variance-authority';

// ── Item ────────────────────────────────────────────────────────────────────

export const accordionItemVariants = cva('block', {
  variants: {
    variant: {
      default: 'border-b',
      card: 'mb-2 rounded-lg border bg-card shadow-sm overflow-hidden',
      filled: 'border-b',
      bordered: 'mb-2 rounded-lg border overflow-hidden',
      separated: 'mb-3 rounded-lg border bg-card/50 overflow-hidden',
    },
  },
  defaultVariants: { variant: 'default' },
});

// ── Trigger ─────────────────────────────────────────────────────────────────

export const accordionTriggerVariants = cva(
  'flex flex-1 w-full cursor-pointer items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'hover:underline',
        card: 'hover:bg-muted/50',
        filled: 'bg-primary text-primary-foreground hover:bg-primary/90',
        bordered: 'hover:bg-muted/50',
        separated: 'hover:bg-muted/50',
      },
      size: {
        xs: 'py-2 px-2 text-xs',
        sm: 'py-3 px-3 text-sm',
        default: 'py-4 px-4 text-sm font-medium',
        lg: 'py-5 px-5 text-base font-medium',
        xl: 'py-6 px-6 text-lg font-semibold',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

// ── Content Inner ───────────────────────────────────────────────────────────

export const accordionContentInnerVariants = cva('', {
  variants: {
    variant: {
      default: '',
      card: '',
      filled: 'bg-muted/30',
      bordered: '',
      separated: '',
    },
    size: {
      xs: 'pb-2 px-2 pt-0 text-xs',
      sm: 'pb-3 px-3 pt-0 text-sm',
      default: 'pb-4 px-4 pt-0 text-sm',
      lg: 'pb-5 px-5 pt-0 text-base',
      xl: 'pb-6 px-6 pt-0 text-lg',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

// ── Types ───────────────────────────────────────────────────────────────────

export type AccordionVariant = NonNullable<VariantProps<typeof accordionItemVariants>['variant']>;
export type AccordionSize = NonNullable<VariantProps<typeof accordionTriggerVariants>['size']>;

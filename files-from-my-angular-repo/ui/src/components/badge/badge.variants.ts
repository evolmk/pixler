import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: '',
        secondary: '',
        destructive: '',
        outline: 'text-foreground',
        success: '',
        warning: '',
        info: '',
      },
      dark: {
        true: '',
        false: '',
      },
      shape: {
        default: 'rounded-md',
        square: 'rounded-none',
        pill: 'rounded-full',
      },
    },
    compoundVariants: [
      // ── Soft (dark=false) ──────────────────────────────────────────────
      { variant: 'default', dark: false, class: 'border-transparent bg-primary/15 text-primary' },
      { variant: 'secondary', dark: false, class: 'border-transparent bg-secondary text-secondary-foreground' },
      { variant: 'destructive', dark: false, class: 'border-transparent bg-destructive/15 text-destructive' },
      {
        variant: 'success',
        dark: false,
        class: 'border-transparent bg-green-500/20 text-green-700 dark:text-green-400',
      },
      {
        variant: 'warning',
        dark: false,
        class: 'border-transparent bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
      },
      { variant: 'info', dark: false, class: 'border-transparent bg-blue-500/20 text-blue-700 dark:text-blue-400' },
      // ── Solid (dark=true) ──────────────────────────────────────────────
      {
        variant: 'default',
        dark: true,
        class: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
      },
      {
        variant: 'secondary',
        dark: true,
        class: 'border-transparent bg-secondary-foreground text-secondary shadow hover:bg-secondary-foreground/80',
      },
      {
        variant: 'destructive',
        dark: true,
        class: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
      },
      {
        variant: 'success',
        dark: true,
        class: 'border-transparent bg-green-600 text-white shadow hover:bg-green-600/80',
      },
      {
        variant: 'warning',
        dark: true,
        class: 'border-transparent bg-yellow-500 text-white shadow hover:bg-yellow-500/80',
      },
      { variant: 'info', dark: true, class: 'border-transparent bg-blue-600 text-white shadow hover:bg-blue-600/80' },
    ],
    defaultVariants: {
      variant: 'default',
      dark: false,
      shape: 'default',
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

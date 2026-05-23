import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Base toast item container variants.
 * toastVariants: default | destructive.
 */
export const toastVariants = cva(
  'group relative flex w-full items-center gap-3 rounded-lg border bg-background p-4 shadow-lg text-foreground overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive: 'bg-destructive text-destructive-foreground border-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type ToastVariants = VariantProps<typeof toastVariants>;

/**
 * Rich-color classes per toast type (applied when richColors=true and variant='default').
 * Uses Tailwind semantic + palette colors for type-specific feedback.
 * NOTE: richColors intentionally uses palette colors (green/red/yellow/blue) for
 * clear semantic meaning — this is the expected behaviour for this mode.
 */
export const richColorClasses: Record<string, string> = {
  success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-50 dark:border-green-800',
  error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-50 dark:border-red-800',
  warning:
    'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-50 dark:border-yellow-800',
  info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-50 dark:border-blue-800',
};

/** Icon color classes per type (for the SVG icon inside the toast). */
export const iconColorClasses: Record<string, string> = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400',
  loading: 'text-muted-foreground',
  default: 'text-muted-foreground',
  destructive: 'text-destructive-foreground',
};

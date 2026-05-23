import { cva, type VariantProps } from 'class-variance-authority';

// ─── Root overlay container ────────────────────────────────────────────────────

export const lightboxVariants = cva('z-[1100] flex flex-col overflow-hidden outline-none', {
  variants: {
    inline: {
      true: 'relative',
      false: 'fixed inset-0',
    },
    theme: {
      dark: 'bg-black/95 text-white',
      light: 'bg-white text-gray-900',
      auto: 'bg-white text-gray-900 dark:bg-black/95 dark:text-white',
    },
  },
  defaultVariants: {
    inline: false,
    theme: 'dark',
  },
});

// ─── Size-constrained panel (non-fullscreen) ─────────────────────────────────

export const lightboxSizeVariants = cva('', {
  variants: {
    size: {
      fullscreen: '',
      sm: 'max-h-[70vh] w-[calc(100%-2rem)] max-w-xl rounded-xl shadow-2xl dark:border dark:border-white/15',
      md: 'max-h-[80vh] w-[calc(100%-2rem)] max-w-3xl rounded-xl shadow-2xl dark:border dark:border-white/15',
      lg: 'max-h-[85vh] w-[calc(100%-2rem)] max-w-5xl rounded-xl shadow-2xl dark:border dark:border-white/15',
      xl: 'max-h-[90vh] w-[calc(100%-2rem)] max-w-7xl rounded-xl shadow-2xl dark:border dark:border-white/15',
      xxl: 'max-h-[92vh] w-[calc(100%-2rem)] max-w-[1440px] rounded-xl shadow-2xl dark:border dark:border-white/15',
      xxxl: 'max-h-[95vh] w-[calc(100%-2rem)] max-w-[1680px] rounded-xl shadow-2xl dark:border dark:border-white/15',
    },
  },
  defaultVariants: { size: 'fullscreen' },
});

export type LightboxVariants = VariantProps<typeof lightboxVariants>;

// ─── Backdrop ─────────────────────────────────────────────────────────────────

export const lightboxBackdropVariants = cva('absolute inset-0 bg-black/80', {
  variants: {
    blur: {
      true: 'backdrop-blur-md',
      false: '',
    },
  },
  defaultVariants: { blur: true },
});

// ─── Toolbar ──────────────────────────────────────────────────────────────────

export const lightboxToolbarVariants = cva(
  ['relative z-10 flex shrink-0 items-center justify-between gap-2 px-4 py-2', 'transition-opacity duration-300'],
  {
    variants: {
      idle: {
        true: 'pointer-events-none opacity-0',
        false: 'opacity-100',
      },
    },
    defaultVariants: { idle: false },
  },
);

// ─── Toolbar button ───────────────────────────────────────────────────────────

export const lightboxToolbarBtnVariants = cva(
  [
    'flex h-9 w-9 cursor-pointer items-center justify-center rounded-md',
    'transition-colors',
    'focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-40',
  ],
  {
    variants: {
      theme: {
        dark: 'text-white/80 hover:bg-white/10 hover:text-white',
        light: 'text-gray-600 hover:bg-black/10 hover:text-gray-900',
        auto: 'text-gray-600 hover:bg-black/10 hover:text-gray-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white',
      },
    },
    defaultVariants: { theme: 'dark' },
  },
);

// ─── Stage ────────────────────────────────────────────────────────────────────

export const lightboxStageVariants = cva('relative flex flex-1 items-center justify-center overflow-hidden', {
  variants: {},
  defaultVariants: {},
});

// ─── Caption ──────────────────────────────────────────────────────────────────

export const lightboxCaptionVariants = cva(
  ['relative z-10 shrink-0 px-6 py-3 text-center text-sm leading-snug', 'transition-opacity duration-300'],
  {
    variants: {
      idle: {
        true: 'pointer-events-none opacity-0',
        false: 'opacity-100',
      },
      theme: {
        dark: 'text-white/80',
        light: 'text-gray-700',
        auto: 'text-gray-700 dark:text-white/80',
      },
    },
    defaultVariants: { idle: false, theme: 'dark' },
  },
);

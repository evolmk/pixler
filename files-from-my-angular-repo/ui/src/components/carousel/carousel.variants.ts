import { cva, type VariantProps } from 'class-variance-authority';

// Root wrapper — position context for absolutely-placed controls
export const carouselVariants = cva('block relative w-full focus-visible:outline-none', {
  variants: {},
  defaultVariants: {},
});

// Flex slide track — Embla canonical negative-margin gap approach
export const carouselContentVariants = cva('flex backface-hidden touch-pan-y', {
  variants: {
    orientation: {
      horizontal: '-ml-4',
      vertical: 'flex-col -mt-4',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

// Individual slide — basis-full by default, consumer overrides for multi-slide
export const carouselItemVariants = cva('block min-w-0 shrink-0 grow-0 basis-full', {
  variants: {
    orientation: {
      horizontal: 'pl-4',
      // flex flex-col: makes the child (img or div) a flex item, eliminating the
      // inline-baseline descender gap that causes a white strip below the image.
      vertical: 'min-h-0 pt-4 flex flex-col',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

export type CarouselContentVariants = VariantProps<typeof carouselContentVariants>;
export type CarouselItemVariants = VariantProps<typeof carouselItemVariants>;

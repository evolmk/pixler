import { InjectionToken } from '@angular/core';
import type { Signal } from '@angular/core';
import { cn } from '../../utils/cn';

export type { EmblaCarouselType, EmblaPluginType, EmblaOptionsType, EmblaEventType } from 'embla-carousel-angular';

// ─── Nav button styling ────────────────────────────────────────────────────────

export type CarouselNavVariant = 'default' | 'dark' | 'light' | 'ghost';
export type CarouselNavShape = 'circle' | 'rounded' | 'square';
export type CarouselDotsVariant = 'dark' | 'light';

const NAV_VARIANT_CLASSES: Record<CarouselNavVariant, string> = {
  default: 'border border-border bg-background/80 backdrop-blur-sm hover:bg-background',
  dark: 'bg-black/50 backdrop-blur-sm text-white hover:bg-black/70',
  light: 'bg-white/90 backdrop-blur-sm text-foreground hover:bg-white shadow-sm',
  ghost: 'text-foreground/70 hover:text-foreground hover:bg-background/30 backdrop-blur-sm',
};

const NAV_SHAPE_CLASSES: Record<CarouselNavShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-md',
  square: 'rounded-none',
};

/** Shared button class builder for nav arrows (prev/next) and thumb strip arrows. */
export function navBtnClass(variant: CarouselNavVariant, shape: CarouselNavShape, size: 'md' | 'sm' = 'md'): string {
  const sizeClass = size === 'sm' ? 'h-7 w-7 flex-shrink-0' : 'h-8 w-8';
  return cn(
    'flex cursor-pointer items-center justify-center transition-all disabled:pointer-events-none disabled:opacity-40',
    sizeClass,
    NAV_SHAPE_CLASSES[shape],
    NAV_VARIANT_CLASSES[variant],
  );
}

export interface CarouselApi {
  readonly selectedIndex: Signal<number>;
  readonly slideCount: Signal<number>;
  readonly canScrollPrev: Signal<boolean>;
  readonly canScrollNext: Signal<boolean>;
  readonly scrollSnaps: Signal<number[]>;
  readonly isPlaying: Signal<boolean>;
  /** Countdown seconds remaining (e.g. 5, 4, 3, 2, 1). */
  readonly progressPercent: Signal<number>;
  /** Elapsed fraction 0→1 within the current autoplay cycle. Drives progress arc. */
  readonly progressFraction: Signal<number>;
  readonly orientation: Signal<'horizontal' | 'vertical'>;
  /** Autoplay delay in ms — readable by ui-carousel-progress for countdown display. */
  readonly autoplayDelay: Signal<number>;
  /** Nav button visual style — flows to built-in prev/next and manually composed buttons. */
  readonly navVariant: Signal<CarouselNavVariant>;
  /** Nav button shape. */
  readonly navShape: Signal<CarouselNavShape>;
  /** Dot indicator color — 'dark' (default, for light backgrounds) | 'light' (for dark/image backgrounds). */
  readonly dotsVariant: Signal<CarouselDotsVariant>;
  prev(): void;
  next(): void;
  goTo(index: number, jump?: boolean): void;
  play(): void;
  pause(): void;
}

export const CAROUSEL_TOKEN = new InjectionToken<CarouselApi>('CAROUSEL_TOKEN');

// ─── Thumbs API ────────────────────────────────────────────────────────────────
// Provided by CarouselThumbsComponent, injected by CarouselThumbItemComponent.

export interface CarouselThumbsApi {
  readonly type: Signal<'modern' | 'classic' | 'scrollable'>;
  readonly thumbWidth: Signal<number>;
  readonly thumbHeight: Signal<number>;
  readonly clipWidth: Signal<number>;
  readonly orientation: Signal<'horizontal' | 'vertical'>;
}

export const CAROUSEL_THUMBS_TOKEN = new InjectionToken<CarouselThumbsApi>('CAROUSEL_THUMBS_TOKEN');

// ─── Plugin Config ─────────────────────────────────────────────────────────────
// Consolidated snapshot of all plugin-related inputs, passed to CarouselPluginService.

export interface CarouselPluginConfig {
  // Autoplay
  autoplay: boolean;
  autoplayDelay: number;
  autoplayStopOnInteraction: boolean;
  autoplayStopOnMouseEnter: boolean;
  autoplayStopOnLastSnap: boolean;

  // Auto scroll
  autoScroll: boolean;
  autoScrollSpeed: number;
  autoScrollDirection: 'forward' | 'backward';
  autoScrollStopOnInteraction: boolean;

  // Auto height
  autoHeight: boolean;

  // Transition — 'fade' | 'crossfade' activates the Fade plugin
  transition: 'slide' | 'fade' | 'crossfade';

  // Class names
  classNames: boolean;
  classNameSnapped: string;
  classNameInView: string;
  classNameDraggable: string;
  /** Maps to ClassNames plugin's `dragging` option. */
  classNamePointerDown: string;

  // Wheel gestures
  wheelGestures: boolean;
  wheelForceAxis: 'x' | 'y' | undefined;
}

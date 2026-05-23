/**
 * Shared GSAP animation presets for overlay components (select, popover, dialog, drawer).
 *
 * Usage:
 *   overlayEnter(element)              — slide-down default (select, dropdown)
 *   overlayEnter(element, 'dialog')    — dialog scale-in
 *   overlayExit(element)               — returns Promise, resolve = safe to destroy
 */
import { gsap } from 'gsap';

// ── Presets ──────────────────────────────────────────────────────────────────

export type MotionPreset =
  | 'slide-down'
  | 'slide-up'
  | 'dialog'
  | 'slide-right'
  | 'slide-left'
  | 'fade'
  | 'slide-bottom'
  | 'slide-top';

interface MotionKeyframe {
  duration: number;
  ease: string;
  opacity?: number;
  scale?: number;
  y?: number | string;
  x?: number | string;
  transformOrigin?: string;
}

const PRESETS: Record<MotionPreset, { enter: MotionKeyframe; exit: MotionKeyframe }> = {
  'slide-down': {
    enter: { duration: 0.28, ease: 'power3.out', opacity: 0, scale: 0.96, y: -4, transformOrigin: 'top center' },
    exit: { duration: 0.2, ease: 'power2.in', opacity: 0, scale: 0.96, y: -4 },
  },
  'slide-up': {
    enter: { duration: 0.28, ease: 'power3.out', opacity: 0, scale: 0.96, y: 4, transformOrigin: 'bottom center' },
    exit: { duration: 0.2, ease: 'power2.in', opacity: 0, scale: 0.96, y: 4 },
  },
  dialog: {
    enter: { duration: 0.32, ease: 'back.out(1.4)', opacity: 0, scale: 0.95, transformOrigin: 'center center' },
    exit: { duration: 0.22, ease: 'power2.in', opacity: 0, scale: 0.95 },
  },
  'slide-right': {
    enter: { duration: 0.3, ease: 'power3.out', x: '100%' },
    exit: { duration: 0.25, ease: 'power2.in', x: '100%' },
  },
  'slide-left': {
    enter: { duration: 0.3, ease: 'power3.out', x: '-100%' },
    exit: { duration: 0.25, ease: 'power2.in', x: '-100%' },
  },
  fade: {
    enter: { duration: 0.15, ease: 'power2.out', opacity: 0, scale: 0.96 },
    exit: { duration: 0.1, ease: 'power2.in', opacity: 0, scale: 0.96 },
  },
  'slide-bottom': {
    enter: { duration: 0.3, ease: 'power3.out', y: '100%' },
    exit: { duration: 0.25, ease: 'power2.in', y: '100%' },
  },
  'slide-top': {
    enter: { duration: 0.3, ease: 'power3.out', y: '-100%' },
    exit: { duration: 0.25, ease: 'power2.in', y: '-100%' },
  },
};

// ── Public API ───────────────────────────────────────────────────────────────

/** Animate an overlay element in. Fire-and-forget. */
export function overlayEnter(el: Element, preset: MotionPreset = 'slide-down'): void {
  const { duration, ease, transformOrigin, ...from } = PRESETS[preset].enter;
  const to: gsap.TweenVars = { opacity: 1, scale: 1, y: 0, x: 0, duration, ease };
  if (transformOrigin) to.transformOrigin = transformOrigin;
  gsap.fromTo(el, from, to);
}

/** Animate an overlay element out. Resolves when animation completes (safe to destroy). */
export function overlayExit(el: Element, preset: MotionPreset = 'slide-down'): Promise<void> {
  const { duration, ease, ...to } = PRESETS[preset].exit;
  return new Promise((resolve) => {
    gsap.to(el, { ...to, duration, ease, onComplete: () => resolve() });
  });
}

// ── Expand / Collapse ───────────────────────────────────────────────────────

/** Animate an element expanding from height:0 to its natural height. */
export function expandEnter(el: HTMLElement): void {
  gsap.killTweensOf(el);
  gsap.set(el, { overflow: 'hidden', display: 'block' });
  gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.25, ease: 'power2.out' });
}

/** Animate an element collapsing to height:0. Resolves when animation completes. */
export function expandExit(el: HTMLElement): Promise<void> {
  gsap.killTweensOf(el);
  gsap.set(el, { overflow: 'hidden' });
  return new Promise((resolve) => {
    gsap.to(el, {
      height: 0,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(el, { display: 'none' });
        resolve();
      },
    });
  });
}

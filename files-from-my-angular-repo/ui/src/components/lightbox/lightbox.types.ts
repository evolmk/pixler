import type { ClassValue } from 'clsx';

// ─── Item ──────────────────────────────────────────────────────────────────────

export type LightboxItemType = 'image' | 'video' | 'youtube' | 'vimeo';

export interface LightboxPin {
  id: string;
  x: number | string;
  y: number | string;
  label?: string;
  content?: string;
}

export interface LightboxItem {
  src: string;
  srcset?: string;
  sizes?: string;
  thumb?: string;
  caption?: string;
  alt?: string;
  type?: LightboxItemType;
  poster?: string;
  downloadSrc?: string;
  slug?: string;
  pins?: LightboxPin[];
}

// ─── Toolbar ───────────────────────────────────────────────────────────────────

export type LightboxToolbarItem =
  | 'prev'
  | 'next'
  | 'counter'
  | 'caption'
  | 'zoom-in'
  | 'zoom-out'
  | 'zoom-reset'
  | 'rotate-cw'
  | 'rotate-ccw'
  | 'flip-x'
  | 'flip-y'
  | 'download'
  | 'share'
  | 'fullscreen'
  | 'thumbs-toggle'
  | 'sidebar-toggle'
  | 'close'
  | 'pins-toggle';

// ─── Display types ─────────────────────────────────────────────────────────────

export type ThumbPosition =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type ZoomClickAction = 'zoom' | 'toggleCover' | 'toggleFull' | 'toggleMax' | 'iterateZoom' | false;

export type LightboxSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'fullscreen';

export type LightboxMode = 'default' | 'minimal';

// ─── Options ───────────────────────────────────────────────────────────────────

export interface LightboxOptions {
  // Navigation & Behavior
  startIndex: number;
  loop: boolean;
  enableSwipe: boolean;
  dragToClose: boolean;
  dragToCloseThreshold: number;
  enableKeyboard: boolean;
  enableDrag: boolean;
  wheelAction: 'slide' | 'zoom' | false;
  closeOnBackdropClick: boolean;
  hashNavigation: boolean;
  // Thumbnails
  showThumbs: boolean;
  thumbType: 'modern' | 'classic' | 'scrollable';
  thumbPosition: ThumbPosition;
  thumbSize: 'sm' | 'md' | 'lg';
  thumbClipWidth: number;
  // Chrome visibility
  showCounter: boolean;
  showCaption: boolean;
  showDownload: boolean;
  showRotate: boolean;
  showFlip: boolean;
  showShare: boolean;
  showFullscreen: boolean;
  showClose: boolean;
  showSidebar: boolean;
  // Toolbar order
  toolbarLeft: LightboxToolbarItem[];
  toolbarCenter: LightboxToolbarItem[];
  toolbarRight: LightboxToolbarItem[];
  toolbarMobileLeft: LightboxToolbarItem[] | null;
  toolbarMobileCenter: LightboxToolbarItem[] | null;
  toolbarMobileRight: LightboxToolbarItem[] | null;
  // Idle & theme
  idle: number | false;
  theme: 'dark' | 'light' | 'auto';
  rtl: boolean;
  protect: boolean;
  inline: boolean;
  sidebar: boolean;
  // Social sharing
  shareNetworks: Array<'copy' | 'twitter' | 'facebook' | 'pinterest'>;
  shareUrl: string | ((item: LightboxItem) => string) | null;
  // Zoom
  enableZoom: boolean;
  zoomClickAction: ZoomClickAction;
  panMode: 'drag' | 'mousemove';
  mouseMoveFactor: number;
  maxZoomScale: number;
  minZoomScale: number;
  doubleTapZoom: boolean;
  wheelZoom: boolean;
  // Animation
  animationDuration: number;
  openFrom: 'origin' | 'center' | 'none';
  animationEasing: string;
  closeEasing: string | null;
  slideEasing: string | null;
  backdropBlur: boolean;
  // Size
  size: LightboxSize;
  // Mode
  mode: LightboxMode;
  // Misc
  class: ClassValue;
  mobileBreakpoint: number;
  preloadCount: number;
  captionCollapsible: boolean;
  // Pins
  showPins: boolean;
  pinsToggle: boolean;
  pinStyle: 'dot' | 'numbered' | 'label';
  pinSize: 'sm' | 'md' | 'lg';
}

// ─── LightboxRef (returned by service) ────────────────────────────────────────

export interface LightboxRef {
  close(): void;
  goTo(index: number): void;
  afterClosed$: Promise<number>;
}

// ─── Easing presets ───────────────────────────────────────────────────────────

export const LIGHTBOX_EASING = {
  /** ease-out-quad — smooth deceleration (default) */
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  /** expo-out — very fast start, pro feel */
  snappy: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /** spring — slight overshoot/bounce on open */
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  linear: 'linear',
  easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)',
  easeOut: 'cubic-bezier(0, 0.55, 0.45, 1)',
  easeInOut: 'cubic-bezier(0.85, 0, 0.15, 1)',
} as const;

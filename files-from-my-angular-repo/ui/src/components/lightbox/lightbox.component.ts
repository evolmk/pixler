import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
  viewChildren,
  DOCUMENT,
} from '@angular/core';
import { A11yModule, FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { DomSanitizer, type SafeHtml, type SafeResourceUrl } from '@angular/platform-browser';
import type { ClassValue } from 'clsx';
import { X } from 'lucide-angular';
import { cn } from '../../utils/cn';
import { IconComponent } from '../icon/icon.component';
import {
  LIGHTBOX_EASING,
  type LightboxItem,
  type LightboxMode,
  type LightboxSize,
  type LightboxToolbarItem,
  type ThumbPosition,
  type ZoomClickAction,
} from './lightbox.types';
import {
  lightboxBackdropVariants,
  lightboxCaptionVariants,
  lightboxSizeVariants,
  lightboxStageVariants,
  lightboxToolbarBtnVariants,
  lightboxToolbarVariants,
  lightboxVariants,
} from './lightbox.variants';
import { LightboxSwipeDirective, type DragMoveEvent, type SwipeEvent } from './lightbox-swipe.directive';

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const ICON_CLOSE = svg(20, 20, '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>');
const ICON_FS_ENTER = svg(
  18,
  18,
  '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>',
);
const ICON_FS_EXIT = svg(
  18,
  18,
  '<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/>',
);
const ICON_ZOOM_IN = svg(
  18,
  18,
  '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>',
);
const ICON_ZOOM_OUT = svg(
  18,
  18,
  '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>',
);
const ICON_ZOOM_RESET = svg(
  18,
  18,
  '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="9" y1="9" x2="13" y2="13"/>',
);
const ICON_DOWNLOAD = svg(
  18,
  18,
  '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
);
const ICON_CHEVRON_LEFT = svg(24, 24, '<polyline points="15 18 9 12 15 6"/>');
const ICON_CHEVRON_RIGHT = svg(24, 24, '<polyline points="9 18 15 12 9 6"/>');
const ICON_ARROW_DOWN = svg(16, 16, '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>');
const ICON_ROTATE_CW = svg(
  18,
  18,
  '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
);
const ICON_ROTATE_CCW = svg(18, 18, '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>');
const ICON_FLIP_H = svg(18, 18, '<polyline points="17 3 3 12 17 21 17 3"/><line x1="21" y1="3" x2="21" y2="21"/>');
const ICON_FLIP_V = svg(18, 18, '<polyline points="21 7 3 7 12 21 21 7"/><line x1="3" y1="3" x2="21" y2="3"/>');
const ICON_SIDEBAR = svg(
  18,
  18,
  '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/>',
);
const ICON_SHARE = svg(
  18,
  18,
  '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
);
const ICON_PLAY = svg(20, 20, '<polygon points="5 3 19 12 5 21 5 3"/>');
const ICON_THUMBS_TOGGLE = svg(
  18,
  18,
  '<rect x="3" y="3" width="6" height="5" rx="0.5"/><rect x="11" y="3" width="6" height="5" rx="0.5"/><rect x="3" y="10" width="6" height="5" rx="0.5"/><rect x="11" y="10" width="6" height="5" rx="0.5"/>',
);
const ICON_PIN = svg(
  18,
  18,
  '<path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/>',
);

// ─── Thumbnail size map ───────────────────────────────────────────────────────

const THUMB_SIZE_MAP = {
  sm: { w: 60, h: 48 },
  md: { w: 94, h: 76 },
  lg: { w: 120, h: 96 },
} as const;

// ─── Per-slide transform state ────────────────────────────────────────────────

interface TransformState {
  scale: number;
  translateX: number;
  translateY: number;
  rotation: 0 | 90 | 180 | 270;
  flipX: boolean;
  flipY: boolean;
}

const DEFAULT_TRANSFORM: TransformState = {
  scale: 1,
  translateX: 0,
  translateY: 0,
  rotation: 0,
  flipX: false,
  flipY: false,
};

@Component({
  selector: 'ui-lightbox',
  standalone: true,
  imports: [A11yModule, LightboxSwipeDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (_isVisible() && _isMinimal()) {
      <!-- ═══ MINIMAL MODE ═══ -->
      <div class="fixed inset-0 z-[1100] flex items-center justify-center" (click)="onBackdropClick()">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"></div>
      </div>

      <div
        #overlayEl
        class="fixed inset-0 z-[1101] flex items-center justify-center outline-none pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
        tabindex="-1"
      >
        <!-- Close button -->
        <button
          type="button"
          class="pointer-events-auto absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Close"
          (click)="close()"
        >
          <ui-icon [name]="xIcon" [size]="20" />
        </button>

        <!-- Prev / Next arrows -->
        @if (items().length > 1) {
          <button
            type="button"
            class="pointer-events-auto absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:pointer-events-none disabled:opacity-0"
            aria-label="Previous"
            [disabled]="!loop() && _currentIndex() === 0"
            (click)="prev(); $event.stopPropagation()"
            [innerHTML]="iconChevronLeft"
          ></button>
          <button
            type="button"
            class="pointer-events-auto absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:pointer-events-none disabled:opacity-0"
            aria-label="Next"
            [disabled]="!loop() && _currentIndex() === items().length - 1"
            (click)="next(); $event.stopPropagation()"
            [innerHTML]="iconChevronRight"
          ></button>
        }

        <!-- White image container -->
        <div
          class="pointer-events-auto relative max-h-[85vh] w-[calc(100%-5rem)] max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl"
          lbSwipe
          [disabled]="_swipeDisabled()"
          (swipe)="onSwipe($event)"
          (dragMove)="onDragMove($event)"
          (dragEnd)="onDragEnd($event)"
          (click)="$event.stopPropagation()"
        >
          @if (_currentItem(); as item) {
            @switch (item.type) {
              @case ('video') {
                <video
                  #videoEl
                  [src]="item.src"
                  [attr.poster]="item.poster || null"
                  controls
                  playsinline
                  class="block max-h-[85vh] w-full object-contain"
                ></video>
              }
              @case ('youtube') {
                <iframe
                  [src]="_videoSrc()"
                  title="YouTube video"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  class="aspect-video w-full"
                  style="border:0"
                ></iframe>
              }
              @case ('vimeo') {
                <iframe
                  [src]="_videoSrc()"
                  title="Vimeo video"
                  frameborder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowfullscreen
                  class="aspect-video w-full"
                  style="border:0"
                ></iframe>
              }
              @default {
                <img
                  #imageEl
                  [src]="item.src"
                  [attr.srcset]="item.srcset || null"
                  [attr.sizes]="item.sizes || null"
                  [alt]="item.alt || ''"
                  class="block max-h-[85vh] w-full object-contain"
                  draggable="false"
                />
              }
            }
          }
        </div>
      </div>
    } @else if (_isVisible()) {
      <!-- ═══ DEFAULT MODE ═══ -->
      <!-- Outer wrapper: viewport-filling for non-fullscreen so backdrop covers everything -->
      @if (_isConstrained()) {
        <div class="fixed inset-0 z-[1100] flex items-center justify-center" (click)="onBackdropClick()">
          <div [class]="backdropClass()" aria-hidden="true"></div>
        </div>
      }

      <div
        #overlayEl
        [class]="overlayClass()"
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
        tabindex="-1"
        [style]="safeAreaStyles"
        (wheel)="onWheel($event)"
        (click)="$event.stopPropagation()"
      >
        <!-- Backdrop (fullscreen only — non-fullscreen uses the outer wrapper) -->
        @if (!inline() && !_isConstrained()) {
          <div [class]="backdropClass()" (click)="onBackdropClick()" aria-hidden="true"></div>
        }

        <!-- Toolbar -->
        <div [class]="toolbarClass()" [attr.dir]="rtl() ? 'rtl' : null">
          <div class="flex items-center gap-1">
            @for (item of _activeLeft(); track item) {
              @switch (item) {
                @case ('counter') {
                  @if (showCounter()) {
                    <span class="min-w-[3rem] text-center text-sm tabular-nums opacity-80">
                      {{ _currentIndex() + 1 }}&thinsp;/&thinsp;{{ items().length }}
                    </span>
                  }
                }
                @case ('zoom-in') {
                  <button
                    type="button"
                    [class]="toolbarBtnClass()"
                    aria-label="Zoom in"
                    (click)="zoomIn()"
                    [innerHTML]="iconZoomIn"
                  ></button>
                }
                @case ('zoom-out') {
                  <button
                    type="button"
                    [class]="toolbarBtnClass()"
                    aria-label="Zoom out"
                    (click)="zoomOut()"
                    [innerHTML]="iconZoomOut"
                  ></button>
                }
                @case ('zoom-reset') {
                  <button
                    type="button"
                    [class]="toolbarBtnClass()"
                    aria-label="Reset zoom"
                    (click)="zoomReset()"
                    [innerHTML]="iconZoomReset"
                  ></button>
                }
                @case ('rotate-cw') {
                  @if (showRotate()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      aria-label="Rotate CW"
                      (click)="rotateCW()"
                      [innerHTML]="iconRotateCW"
                    ></button>
                  }
                }
                @case ('rotate-ccw') {
                  @if (showRotate()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      aria-label="Rotate CCW"
                      (click)="rotateCCW()"
                      [innerHTML]="iconRotateCCW"
                    ></button>
                  }
                }
                @case ('flip-x') {
                  @if (showFlip()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      aria-label="Flip H"
                      (click)="flipX()"
                      [innerHTML]="iconFlipH"
                    ></button>
                  }
                }
                @case ('flip-y') {
                  @if (showFlip()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      aria-label="Flip V"
                      (click)="flipY()"
                      [innerHTML]="iconFlipV"
                    ></button>
                  }
                }
                @case ('download') {
                  @if (showDownload()) {
                    <a
                      [href]="_currentItem().downloadSrc || _currentItem().src"
                      download
                      [class]="toolbarBtnClass()"
                      aria-label="Download"
                      [innerHTML]="iconDownload"
                    ></a>
                  }
                }
                @case ('fullscreen') {
                  @if (showFullscreen()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      [attr.aria-label]="_isFullscreen() ? 'Exit fullscreen' : 'Enter fullscreen'"
                      (click)="toggleFullscreen()"
                      [innerHTML]="_isFullscreen() ? iconFsExit : iconFsEnter"
                    ></button>
                  }
                }
                @case ('close') {
                  @if (showClose()) {
                    <button type="button" [class]="toolbarBtnClass()" aria-label="Close" (click)="close()">
                      <ui-icon [name]="xIcon" [size]="20" />
                    </button>
                  }
                }
                @case ('thumbs-toggle') {
                  <button
                    type="button"
                    [class]="toolbarBtnClass()"
                    [attr.aria-label]="_thumbsVisible() ? 'Hide thumbnails' : 'Show thumbnails'"
                    (click)="toggleThumbs()"
                    [innerHTML]="iconThumbsToggle"
                  ></button>
                }
                @case ('share') {
                  @if (showShare()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      [attr.aria-label]="_shareVisible() ? 'Close share' : 'Share'"
                      (click)="toggleShare()"
                      [innerHTML]="iconShare"
                    ></button>
                  }
                }
                @case ('sidebar-toggle') {
                  @if (sidebar()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      [attr.aria-label]="_sidebarOpen() ? 'Close sidebar' : 'Open sidebar'"
                      (click)="toggleSidebar()"
                      [innerHTML]="iconSidebar"
                    ></button>
                  }
                }
                @case ('pins-toggle') {
                  @if (pinsToggle()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      [attr.aria-label]="_pinsVisible() ? 'Hide pins' : 'Show pins'"
                      (click)="togglePins()"
                      [innerHTML]="iconPin"
                    ></button>
                  }
                }
                @case ('caption') {
                  @if (_currentItem().caption) {
                    <span class="text-sm font-medium opacity-90 truncate">{{ _currentItem().caption }}</span>
                  }
                }
                @default {}
              }
            }
          </div>

          <div class="flex items-center gap-1">
            @for (item of _activeCenter(); track item) {
              @switch (item) {
                @case ('counter') {
                  @if (showCounter()) {
                    <span class="min-w-[3rem] text-center text-sm tabular-nums opacity-80">
                      {{ _currentIndex() + 1 }}&thinsp;/&thinsp;{{ items().length }}
                    </span>
                  }
                }
                @case ('zoom-in') {
                  <button
                    type="button"
                    [class]="toolbarBtnClass()"
                    aria-label="Zoom in"
                    (click)="zoomIn()"
                    [innerHTML]="iconZoomIn"
                  ></button>
                }
                @case ('zoom-out') {
                  <button
                    type="button"
                    [class]="toolbarBtnClass()"
                    aria-label="Zoom out"
                    (click)="zoomOut()"
                    [innerHTML]="iconZoomOut"
                  ></button>
                }
                @case ('zoom-reset') {
                  <button
                    type="button"
                    [class]="toolbarBtnClass()"
                    aria-label="Reset zoom"
                    (click)="zoomReset()"
                    [innerHTML]="iconZoomReset"
                  ></button>
                }
                @case ('rotate-cw') {
                  @if (showRotate()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      aria-label="Rotate CW"
                      (click)="rotateCW()"
                      [innerHTML]="iconRotateCW"
                    ></button>
                  }
                }
                @case ('rotate-ccw') {
                  @if (showRotate()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      aria-label="Rotate CCW"
                      (click)="rotateCCW()"
                      [innerHTML]="iconRotateCCW"
                    ></button>
                  }
                }
                @case ('flip-x') {
                  @if (showFlip()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      aria-label="Flip H"
                      (click)="flipX()"
                      [innerHTML]="iconFlipH"
                    ></button>
                  }
                }
                @case ('flip-y') {
                  @if (showFlip()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      aria-label="Flip V"
                      (click)="flipY()"
                      [innerHTML]="iconFlipV"
                    ></button>
                  }
                }
                @case ('download') {
                  @if (showDownload()) {
                    <a
                      [href]="_currentItem().downloadSrc || _currentItem().src"
                      download
                      [class]="toolbarBtnClass()"
                      aria-label="Download"
                      [innerHTML]="iconDownload"
                    ></a>
                  }
                }
                @case ('fullscreen') {
                  @if (showFullscreen()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      [attr.aria-label]="_isFullscreen() ? 'Exit fullscreen' : 'Enter fullscreen'"
                      (click)="toggleFullscreen()"
                      [innerHTML]="_isFullscreen() ? iconFsExit : iconFsEnter"
                    ></button>
                  }
                }
                @case ('close') {
                  @if (showClose()) {
                    <button type="button" [class]="toolbarBtnClass()" aria-label="Close" (click)="close()">
                      <ui-icon [name]="xIcon" [size]="20" />
                    </button>
                  }
                }
                @case ('thumbs-toggle') {
                  <button
                    type="button"
                    [class]="toolbarBtnClass()"
                    [attr.aria-label]="_thumbsVisible() ? 'Hide thumbnails' : 'Show thumbnails'"
                    (click)="toggleThumbs()"
                    [innerHTML]="iconThumbsToggle"
                  ></button>
                }
                @case ('share') {
                  @if (showShare()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      [attr.aria-label]="_shareVisible() ? 'Close share' : 'Share'"
                      (click)="toggleShare()"
                      [innerHTML]="iconShare"
                    ></button>
                  }
                }
                @case ('sidebar-toggle') {
                  @if (sidebar()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      [attr.aria-label]="_sidebarOpen() ? 'Close sidebar' : 'Open sidebar'"
                      (click)="toggleSidebar()"
                      [innerHTML]="iconSidebar"
                    ></button>
                  }
                }
                @case ('pins-toggle') {
                  @if (pinsToggle()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      [attr.aria-label]="_pinsVisible() ? 'Hide pins' : 'Show pins'"
                      (click)="togglePins()"
                      [innerHTML]="iconPin"
                    ></button>
                  }
                }
                @case ('caption') {
                  @if (_currentItem().caption) {
                    <span class="text-sm font-medium opacity-90 truncate">{{ _currentItem().caption }}</span>
                  }
                }
                @default {}
              }
            }
          </div>

          <div class="flex items-center gap-1">
            @for (item of _activeRight(); track item) {
              @switch (item) {
                @case ('counter') {
                  @if (showCounter()) {
                    <span class="min-w-[3rem] text-center text-sm tabular-nums opacity-80">
                      {{ _currentIndex() + 1 }}&thinsp;/&thinsp;{{ items().length }}
                    </span>
                  }
                }
                @case ('zoom-in') {
                  <button
                    type="button"
                    [class]="toolbarBtnClass()"
                    aria-label="Zoom in"
                    (click)="zoomIn()"
                    [innerHTML]="iconZoomIn"
                  ></button>
                }
                @case ('zoom-out') {
                  <button
                    type="button"
                    [class]="toolbarBtnClass()"
                    aria-label="Zoom out"
                    (click)="zoomOut()"
                    [innerHTML]="iconZoomOut"
                  ></button>
                }
                @case ('zoom-reset') {
                  <button
                    type="button"
                    [class]="toolbarBtnClass()"
                    aria-label="Reset zoom"
                    (click)="zoomReset()"
                    [innerHTML]="iconZoomReset"
                  ></button>
                }
                @case ('rotate-cw') {
                  @if (showRotate()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      aria-label="Rotate CW"
                      (click)="rotateCW()"
                      [innerHTML]="iconRotateCW"
                    ></button>
                  }
                }
                @case ('rotate-ccw') {
                  @if (showRotate()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      aria-label="Rotate CCW"
                      (click)="rotateCCW()"
                      [innerHTML]="iconRotateCCW"
                    ></button>
                  }
                }
                @case ('flip-x') {
                  @if (showFlip()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      aria-label="Flip H"
                      (click)="flipX()"
                      [innerHTML]="iconFlipH"
                    ></button>
                  }
                }
                @case ('flip-y') {
                  @if (showFlip()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      aria-label="Flip V"
                      (click)="flipY()"
                      [innerHTML]="iconFlipV"
                    ></button>
                  }
                }
                @case ('download') {
                  @if (showDownload()) {
                    <a
                      [href]="_currentItem().downloadSrc || _currentItem().src"
                      download
                      [class]="toolbarBtnClass()"
                      aria-label="Download"
                      [innerHTML]="iconDownload"
                    ></a>
                  }
                }
                @case ('fullscreen') {
                  @if (showFullscreen()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      [attr.aria-label]="_isFullscreen() ? 'Exit fullscreen' : 'Enter fullscreen'"
                      (click)="toggleFullscreen()"
                      [innerHTML]="_isFullscreen() ? iconFsExit : iconFsEnter"
                    ></button>
                  }
                }
                @case ('close') {
                  @if (showClose()) {
                    <button type="button" [class]="toolbarBtnClass()" aria-label="Close" (click)="close()">
                      <ui-icon [name]="xIcon" [size]="20" />
                    </button>
                  }
                }
                @case ('thumbs-toggle') {
                  <button
                    type="button"
                    [class]="toolbarBtnClass()"
                    [attr.aria-label]="_thumbsVisible() ? 'Hide thumbnails' : 'Show thumbnails'"
                    (click)="toggleThumbs()"
                    [innerHTML]="iconThumbsToggle"
                  ></button>
                }
                @case ('share') {
                  @if (showShare()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      [attr.aria-label]="_shareVisible() ? 'Close share' : 'Share'"
                      (click)="toggleShare()"
                      [innerHTML]="iconShare"
                    ></button>
                  }
                }
                @case ('sidebar-toggle') {
                  @if (sidebar()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      [attr.aria-label]="_sidebarOpen() ? 'Close sidebar' : 'Open sidebar'"
                      (click)="toggleSidebar()"
                      [innerHTML]="iconSidebar"
                    ></button>
                  }
                }
                @case ('pins-toggle') {
                  @if (pinsToggle()) {
                    <button
                      type="button"
                      [class]="toolbarBtnClass()"
                      [attr.aria-label]="_pinsVisible() ? 'Hide pins' : 'Show pins'"
                      (click)="togglePins()"
                      [innerHTML]="iconPin"
                    ></button>
                  }
                }
                @case ('caption') {
                  @if (_currentItem().caption) {
                    <span class="text-sm font-medium opacity-90 truncate">{{ _currentItem().caption }}</span>
                  }
                }
                @default {}
              }
            }
          </div>
        </div>

        <!-- Body: flex-row when left/right strips visible, flex-col otherwise -->
        <div [class]="_bodyClass()">
          <!-- Left vertical thumb strip -->
          @if (_thumbsVisible() && _effectiveThumbPos() === 'left') {
            <div
              class="relative z-10 flex shrink-0 flex-col overflow-hidden bg-black/40 backdrop-blur-sm"
              [style.width.px]="_thumbStripW()"
            >
              <div #thumbTrack class="flex flex-col gap-1.5 overflow-y-auto p-1.5 [&::-webkit-scrollbar]:hidden">
                @for (item of items(); track item; let i = $index) {
                  <button
                    type="button"
                    [attr.data-thumb-idx]="i"
                    [class]="thumbBtnClass(i)"
                    [style]="thumbBtnStyle(i)"
                    (click)="goTo(i); $event.stopPropagation()"
                    [attr.aria-label]="'View image ' + (i + 1)"
                    [attr.aria-current]="_currentIndex() === i ? 'true' : null"
                  >
                    <div [class]="thumbInnerClass()" [style]="thumbInnerStyle(i)">
                      <img
                        [src]="thumbSrc(item)"
                        [alt]="item.alt || ''"
                        class="h-full w-full object-cover"
                        draggable="false"
                        loading="lazy"
                      />
                      @if (item.type === 'video' || item.type === 'youtube' || item.type === 'vimeo') {
                        <div
                          class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30"
                          [innerHTML]="iconPlay"
                        ></div>
                      }
                    </div>
                  </button>
                }
              </div>
            </div>
          }

          <!-- Content column (swipe area + top/bottom strips) -->
          <div class="relative flex min-w-0 flex-1 flex-col overflow-hidden">
            <!-- Top horizontal thumb strip -->
            @if (_thumbsVisible() && _effectiveThumbPos() === 'top') {
              <div
                class="relative z-10 shrink-0 overflow-hidden bg-black/40 backdrop-blur-sm"
                [style.height.px]="_thumbStripH()"
              >
                <div #thumbTrack class="flex flex-row gap-1.5 overflow-x-auto p-1.5 [&::-webkit-scrollbar]:hidden">
                  @for (item of items(); track item; let i = $index) {
                    <button
                      type="button"
                      [attr.data-thumb-idx]="i"
                      [class]="thumbBtnClass(i)"
                      [style]="thumbBtnStyle(i)"
                      (click)="goTo(i); $event.stopPropagation()"
                      [attr.aria-label]="'View image ' + (i + 1)"
                      [attr.aria-current]="_currentIndex() === i ? 'true' : null"
                    >
                      <div [class]="thumbInnerClass()" [style]="thumbInnerStyle(i)">
                        <img
                          [src]="item.thumb || item.src"
                          [alt]="item.alt || ''"
                          class="h-full w-full object-cover"
                          draggable="false"
                          loading="lazy"
                        />
                      </div>
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Swipe / navigation wrapper -->
            <div
              lbSwipe
              [disabled]="_swipeDisabled()"
              (swipe)="onSwipe($event)"
              (dragMove)="onDragMove($event)"
              (dragEnd)="onDragEnd($event)"
              class="relative flex flex-1 overflow-hidden"
            >
              <!-- Prev / Next arrows -->
              @if (items().length > 1) {
                <button
                  type="button"
                  [class]="navBtnClass()"
                  aria-label="Previous"
                  [disabled]="!loop() && _currentIndex() === 0"
                  [class.opacity-0]="_idleActive()"
                  [style.left]="'max(12px, var(--lb-safe-left, 12px))'"
                  class="absolute top-1/2 z-10 -translate-y-1/2 transition-opacity duration-300"
                  (click)="prev(); $event.stopPropagation()"
                  [innerHTML]="rtl() ? iconChevronRight : iconChevronLeft"
                ></button>
                <button
                  type="button"
                  [class]="navBtnClass()"
                  aria-label="Next"
                  [disabled]="!loop() && _currentIndex() === items().length - 1"
                  [class.opacity-0]="_idleActive()"
                  [style.right]="'max(12px, var(--lb-safe-right, 12px))'"
                  class="absolute top-1/2 z-10 -translate-y-1/2 transition-opacity duration-300"
                  (click)="next(); $event.stopPropagation()"
                  [innerHTML]="rtl() ? iconChevronLeft : iconChevronRight"
                ></button>
              }

              <!-- Stage: holds the drag wrapper + image -->
              <div
                #stageEl
                [class]="stageClass()"
                (click)="onStageClick($event)"
                (pointerdown)="onStagePointerDown($event)"
                (pointermove)="onStagePointerMove($event)"
                (pointerup)="onStagePointerUp($event)"
                (pointercancel)="onStagePointerCancel($event)"
                (mousemove)="onStageMouseMove($event)"
              >
                <!-- Drag-to-close wrapper (translateY + scale + opacity) -->
                <div
                  class="flex h-full w-full items-center justify-center"
                  [style.transform]="_dragTransform()"
                  [style.opacity]="_dragOpacity()"
                >
                  <!-- Drag-to-close hint -->
                  @if (_dragHintVisible()) {
                    <div
                      class="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm"
                    >
                      Release to close <span [innerHTML]="iconArrowDown"></span>
                    </div>
                  }

                  @if (_currentItem(); as item) {
                    @switch (item.type) {
                      @case ('video') {
                        <video
                          #videoEl
                          [src]="item.src"
                          [attr.poster]="item.poster || null"
                          controls
                          playsinline
                          class="max-h-full max-w-full rounded"
                          (contextmenu)="onContextMenu($event)"
                        ></video>
                      }
                      @case ('youtube') {
                        <iframe
                          [src]="_videoSrc()"
                          title="YouTube video"
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowfullscreen
                          class="aspect-video max-h-full max-w-full"
                          style="border:0"
                        ></iframe>
                      }
                      @case ('vimeo') {
                        <iframe
                          [src]="_videoSrc()"
                          title="Vimeo video"
                          frameborder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowfullscreen
                          class="aspect-video max-h-full max-w-full"
                          style="border:0"
                        ></iframe>
                      }
                      @default {
                        <img
                          #imageEl
                          [src]="item.src"
                          [attr.srcset]="item.srcset || null"
                          [attr.sizes]="item.sizes || null"
                          [alt]="item.alt || ''"
                          class="max-h-full max-w-full object-contain select-none"
                          [class.cursor-zoom-in]="!_isZoomed() && enableZoom() && zoomClickAction() !== false"
                          [class.cursor-zoom-out]="_isZoomed()"
                          [class.pointer-events-none]="protect()"
                          [style.transform]="_imageTransform()"
                          [style.transition]="_imageTransition()"
                          (contextmenu)="onContextMenu($event)"
                          (click)="onImageClick($event)"
                          draggable="false"
                        />
                      }
                    }
                  }

                  <!-- Pin overlay (image items only, hidden at high zoom) -->
                  @if (showPins() && _pinsVisible() && !_pinsHidden() && _currentItem(); as item) {
                    @if ((!item.type || item.type === 'image') && item.pins?.length) {
                      <div class="pointer-events-none absolute inset-0">
                        @for (pin of item.pins!; track pin.id; let i = $index) {
                          <div
                            class="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
                            [style.left]="pinLeft(pin.x)"
                            [style.top]="pinTop(pin.y)"
                          >
                            <button
                              type="button"
                              [class]="
                                cn(
                                  'relative flex items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                                  pinSize() === 'sm'
                                    ? 'h-5 w-5 text-[10px]'
                                    : pinSize() === 'lg'
                                      ? 'h-8 w-8 text-sm'
                                      : 'h-6 w-6 text-xs',
                                  pinStyle() !== 'dot' && 'bg-white/20 backdrop-blur-sm'
                                )
                              "
                              [attr.aria-label]="pin.label || 'Pin ' + (i + 1)"
                              (click)="onPinClick(pin.id); $event.stopPropagation()"
                            >
                              @switch (pinStyle()) {
                                @case ('dot') {
                                  <span
                                    class="relative block rounded-full bg-white shadow ring-2 ring-white/40"
                                    [class]="
                                      pinSize() === 'sm' ? 'h-3 w-3' : pinSize() === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
                                    "
                                  >
                                    <span class="absolute inset-0 animate-ping rounded-full bg-white/50"></span>
                                  </span>
                                }
                                @case ('numbered') {
                                  {{ i + 1 }}
                                }
                                @case ('label') {
                                  <span
                                    class="max-w-[6rem] truncate px-1.5 py-0.5 text-[11px] font-medium leading-tight"
                                    >{{ pin.label }}</span
                                  >
                                }
                              }
                            </button>

                            <!-- Tooltip popover -->
                            @if (_activePinId() === pin.id && (pin.content || pin.label)) {
                              <div
                                class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[200px] -translate-x-1/2 rounded-lg bg-black/90 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-sm"
                                role="tooltip"
                              >
                                @if (pin.content) {
                                  <span [innerHTML]="sanitizedPinContent(pin.content)"></span>
                                } @else {
                                  {{ pin.label }}
                                }
                              </div>
                            }
                          </div>
                        }
                      </div>
                    }
                  }
                </div>
              </div>
            </div>

            <!-- Bottom horizontal thumb strip -->
            @if (_thumbsVisible() && _effectiveThumbPos() === 'bottom') {
              <div
                class="relative z-10 shrink-0 overflow-hidden bg-black/40 backdrop-blur-sm"
                [style.height.px]="_thumbStripH()"
              >
                <div
                  #thumbTrack
                  class="flex flex-row justify-center gap-1.5 overflow-x-auto p-1.5 [&::-webkit-scrollbar]:hidden"
                >
                  @for (item of items(); track item; let i = $index) {
                    <button
                      type="button"
                      [attr.data-thumb-idx]="i"
                      [class]="thumbBtnClass(i)"
                      [style]="thumbBtnStyle(i)"
                      (click)="goTo(i); $event.stopPropagation()"
                      [attr.aria-label]="'View image ' + (i + 1)"
                      [attr.aria-current]="_currentIndex() === i ? 'true' : null"
                    >
                      <div [class]="thumbInnerClass()" [style]="thumbInnerStyle(i)">
                        <img
                          [src]="item.thumb || item.src"
                          [alt]="item.alt || ''"
                          class="h-full w-full object-cover"
                          draggable="false"
                          loading="lazy"
                        />
                      </div>
                    </button>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Right vertical thumb strip -->
          @if (_thumbsVisible() && _effectiveThumbPos() === 'right') {
            <div
              class="relative z-10 flex shrink-0 flex-col overflow-hidden bg-black/40 backdrop-blur-sm"
              [style.width.px]="_thumbStripW()"
            >
              <div #thumbTrack class="flex flex-col gap-1.5 overflow-y-auto p-1.5 [&::-webkit-scrollbar]:hidden">
                @for (item of items(); track item; let i = $index) {
                  <button
                    type="button"
                    [attr.data-thumb-idx]="i"
                    [class]="thumbBtnClass(i)"
                    [style]="thumbBtnStyle(i)"
                    (click)="goTo(i); $event.stopPropagation()"
                    [attr.aria-label]="'View image ' + (i + 1)"
                    [attr.aria-current]="_currentIndex() === i ? 'true' : null"
                  >
                    <div [class]="thumbInnerClass()" [style]="thumbInnerStyle(i)">
                      <img
                        [src]="thumbSrc(item)"
                        [alt]="item.alt || ''"
                        class="h-full w-full object-cover"
                        draggable="false"
                        loading="lazy"
                      />
                      @if (item.type === 'video' || item.type === 'youtube' || item.type === 'vimeo') {
                        <div
                          class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30"
                          [innerHTML]="iconPlay"
                        ></div>
                      }
                    </div>
                  </button>
                }
              </div>
            </div>
          }
        </div>

        <!-- Corner thumb strip (absolute positioned) -->
        @if (_thumbsVisible() && _isThumbCorner()) {
          <div class="absolute z-10 p-1.5" [class]="_thumbCornerClass()">
            <div #thumbTrack class="flex flex-row gap-1.5 overflow-auto [&::-webkit-scrollbar]:hidden">
              @for (item of items(); track item; let i = $index) {
                <button
                  type="button"
                  [attr.data-thumb-idx]="i"
                  [class]="thumbBtnClass(i)"
                  [style]="thumbBtnStyle(i)"
                  (click)="goTo(i); $event.stopPropagation()"
                  [attr.aria-label]="'View image ' + (i + 1)"
                  [attr.aria-current]="_currentIndex() === i ? 'true' : null"
                >
                  <div [class]="thumbInnerClass()" [style]="thumbInnerStyle(i)">
                    <img
                      [src]="item.thumb || item.src"
                      [alt]="item.alt || ''"
                      class="h-full w-full object-cover"
                      draggable="false"
                      loading="lazy"
                    />
                  </div>
                </button>
              }
            </div>
          </div>
        }

        <!-- Sidebar panel (absolute, slides in from right) -->
        @if (sidebar() && _sidebarOpen()) {
          <div
            class="absolute right-0 top-0 bottom-0 z-20 flex w-72 flex-col overflow-y-auto bg-black/80 backdrop-blur-sm"
            style="transition: transform 0.3s ease"
            role="complementary"
            aria-label="Sidebar"
          >
            <ng-content select="[lbSidebar]" />
          </div>
        }

        <!-- Social sharing panel -->
        @if (_shareVisible()) {
          <div
            class="absolute inset-0 z-50 flex items-center justify-center"
            (click)="_shareVisible.set(false)"
            aria-label="Close share panel"
          >
            <div
              class="flex flex-col gap-1 rounded-xl bg-black/90 p-3 shadow-xl backdrop-blur-md"
              (click)="$event.stopPropagation()"
              role="dialog"
              aria-label="Share options"
            >
              <div class="mb-1 px-3 text-center text-xs font-medium tracking-wide text-white/60 uppercase">Share</div>
              @for (network of shareNetworks(); track network) {
                <button
                  type="button"
                  class="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-white/15"
                  (click)="share(network)"
                >
                  @switch (network) {
                    @case ('copy') {
                      Copy link
                    }
                    @case ('twitter') {
                      Twitter / X
                    }
                    @case ('facebook') {
                      Facebook
                    }
                    @case ('pinterest') {
                      Pinterest
                    }
                  }
                </button>
              }
            </div>
          </div>
        }

        <!-- Caption -->
        @if (showCaption() && _currentItem().caption) {
          <div [class]="captionClass()">
            @if (_captionExpanded() || !_captionTruncated()) {
              <span [innerHTML]="_currentItem()!.caption"></span>
            } @else {
              <span class="line-clamp-2 [&_*]:inline" [innerHTML]="_currentItem()!.caption"></span>
              <button
                type="button"
                class="ml-2 inline text-xs opacity-60 underline underline-offset-2"
                (click)="_captionExpanded.set(true)"
              >
                more
              </button>
            }
          </div>
        }
      </div>
    }
  `,
})
export class LightboxComponent {
  // ─── Injections ──────────────────────────────────────────────────────────────

  private readonly _doc = inject(DOCUMENT);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _focusTrapFactory = inject(FocusTrapFactory);
  private readonly _sanitizer = inject(DomSanitizer);

  // ─── Template utilities ───────────────────────────────────────────────────────

  protected readonly cn = cn;

  // ─── Icons ───────────────────────────────────────────────────────────────────

  private readonly _safe = (html: string) => this._sanitizer.bypassSecurityTrustHtml(html);

  readonly xIcon = X;
  readonly iconClose = this._safe(ICON_CLOSE);
  readonly iconFsEnter = this._safe(ICON_FS_ENTER);
  readonly iconFsExit = this._safe(ICON_FS_EXIT);
  readonly iconZoomIn = this._safe(ICON_ZOOM_IN);
  readonly iconZoomOut = this._safe(ICON_ZOOM_OUT);
  readonly iconZoomReset = this._safe(ICON_ZOOM_RESET);
  readonly iconDownload = this._safe(ICON_DOWNLOAD);
  readonly iconChevronLeft = this._safe(ICON_CHEVRON_LEFT);
  readonly iconChevronRight = this._safe(ICON_CHEVRON_RIGHT);
  readonly iconArrowDown = this._safe(ICON_ARROW_DOWN);
  readonly iconRotateCW = this._safe(ICON_ROTATE_CW);
  readonly iconRotateCCW = this._safe(ICON_ROTATE_CCW);
  readonly iconFlipH = this._safe(ICON_FLIP_H);
  readonly iconFlipV = this._safe(ICON_FLIP_V);
  readonly iconThumbsToggle = this._safe(ICON_THUMBS_TOGGLE);
  readonly iconShare = this._safe(ICON_SHARE);
  readonly iconPlay = this._safe(ICON_PLAY);
  readonly iconSidebar = this._safe(ICON_SIDEBAR);
  readonly iconPin = this._safe(ICON_PIN);

  // ─── Inputs ───────────────────────────────────────────────────────────────────

  readonly items = input<LightboxItem[]>([]);
  readonly startIndex = input<number>(0);

  // Navigation & behavior
  readonly loop = input<boolean>(true);
  readonly enableSwipe = input<boolean>(true);
  readonly dragToClose = input<boolean>(true);
  readonly dragToCloseThreshold = input<number>(100);
  readonly enableKeyboard = input<boolean>(true);
  readonly enableDrag = input<boolean>(true);
  readonly wheelAction = input<'slide' | 'zoom' | false>('slide');
  readonly closeOnBackdropClick = input<boolean>(true);
  readonly hashNavigation = input<boolean>(false);

  // Thumbnails
  readonly showThumbs = input<boolean>(false);
  readonly thumbType = input<'modern' | 'classic' | 'scrollable'>('classic');
  readonly thumbPosition = input<ThumbPosition>('bottom');
  readonly thumbSize = input<'sm' | 'md' | 'lg'>('md');
  readonly thumbClipWidth = input<number>(46);

  // Chrome visibility
  readonly showCounter = input<boolean>(true);
  readonly showCaption = input<boolean>(true);
  readonly showDownload = input<boolean>(false);
  readonly showRotate = input<boolean>(false);
  readonly showFlip = input<boolean>(false);
  readonly showShare = input<boolean>(false);
  readonly showFullscreen = input<boolean>(true);
  readonly showClose = input<boolean>(true);
  readonly showSidebar = input<boolean>(false);

  // Toolbar order
  readonly toolbarLeft = input<LightboxToolbarItem[]>(['counter']);
  readonly toolbarCenter = input<LightboxToolbarItem[]>([]);
  readonly toolbarRight = input<LightboxToolbarItem[]>(['zoom-in', 'zoom-out', 'fullscreen', 'close']);
  readonly toolbarMobileLeft = input<LightboxToolbarItem[] | null>(null);
  readonly toolbarMobileCenter = input<LightboxToolbarItem[] | null>(null);
  readonly toolbarMobileRight = input<LightboxToolbarItem[] | null>(null);

  // Theme & behavior
  readonly idle = input<number | false>(4000);
  readonly theme = input<'dark' | 'light' | 'auto'>('dark');
  readonly rtl = input<boolean>(false);
  readonly protect = input<boolean>(false);
  readonly inline = input<boolean>(false);
  readonly size = input<LightboxSize>('fullscreen');
  readonly mode = input<LightboxMode>('default');
  readonly sidebar = input<boolean>(false);

  // Social
  readonly shareNetworks = input<Array<'copy' | 'twitter' | 'facebook' | 'pinterest'>>(['copy', 'twitter', 'facebook']);
  readonly shareUrl = input<string | ((item: LightboxItem) => string) | null>(null);

  // Zoom
  readonly enableZoom = input<boolean>(true);
  readonly zoomClickAction = input<ZoomClickAction>('iterateZoom');
  readonly panMode = input<'drag' | 'mousemove'>('drag');
  readonly mouseMoveFactor = input<number>(1);
  readonly maxZoomScale = input<number>(4);
  readonly minZoomScale = input<number>(1);
  readonly doubleTapZoom = input<boolean>(true);
  readonly wheelZoom = input<boolean>(true);

  // Animation
  readonly animationDuration = input<number>(250);
  readonly openFrom = input<'origin' | 'center' | 'none'>('origin');
  readonly animationEasing = input<string>(LIGHTBOX_EASING.smooth);
  readonly closeEasing = input<string | null>(null);
  readonly slideEasing = input<string | null>(null);
  readonly backdropBlur = input<boolean>(true);

  // Misc
  readonly class = input<ClassValue>('');
  readonly mobileBreakpoint = input<number>(640);
  readonly preloadCount = input<number>(1);
  readonly captionCollapsible = input<boolean>(true);

  // Pins
  readonly showPins = input<boolean>(true);
  readonly pinsToggle = input<boolean>(true);
  readonly pinStyle = input<'dot' | 'numbered' | 'label'>('dot');
  readonly pinSize = input<'sm' | 'md' | 'lg'>('md');

  // ─── Outputs ──────────────────────────────────────────────────────────────────

  readonly opened = output<number>();
  readonly closed = output<number>();
  readonly changed = output<number>();

  // ─── Visibility / idle / fullscreen state ─────────────────────────────────────

  readonly _isVisible = signal(false);
  readonly _currentIndex = signal(0);
  readonly _idleActive = signal(false);
  readonly _isFullscreen = signal(false);

  // ─── Drag-to-close state ──────────────────────────────────────────────────────

  readonly _dragDeltaY = signal(0);
  readonly _isDraggingToClose = signal(false);
  readonly _dragHintVisible = signal(false);

  // ─── Caption state ────────────────────────────────────────────────────────────

  readonly _captionExpanded = signal(false);
  readonly _captionTruncated = signal(false);

  // ─── Thumbnail strip state ────────────────────────────────────────────────────

  readonly _thumbsVisible = signal(false);

  // ─── Share / video state ──────────────────────────────────────────────────────

  readonly _shareVisible = signal(false);
  readonly _sidebarOpen = signal(false);

  // ─── Pin state ────────────────────────────────────────────────────────────────

  readonly _pinsVisible = signal(true);
  readonly _activePinId = signal<string | null>(null);
  readonly _pinsHidden = computed(() => this._transformState().scale > 2.5);

  // ─── Transform state (per-slide zoom / pan / rotate / flip) ──────────────────

  private readonly _transformState = signal<TransformState>({ ...DEFAULT_TRANSFORM });
  /** True when zoomed in — disables swipe navigation, enables pan. */
  readonly _isZoomed = computed(() => this._transformState().scale > 1);

  // ─── Private fields ───────────────────────────────────────────────────────────

  private _idleTimer: ReturnType<typeof setTimeout> | null = null;
  private _focusTrap: FocusTrap | null = null;
  private _triggerEl: HTMLElement | null = null;
  private _originRect: DOMRect | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private readonly _isMobile = signal(false);

  // Pointer tracking for pan & pinch
  private readonly _pointers = new Map<number, { x: number; y: number }>();
  private readonly _isPinching = signal(false);
  private _initialPinchDistance = 0;
  private _initialPinchScale = 1;
  private readonly _isPanning = signal(false);
  private _panStartX = 0;
  private _panStartY = 0;
  private _panStartTX = 0;
  private _panStartTY = 0;

  // Click vs drag detection
  private _pointerDownX = 0;
  private _pointerDownY = 0;
  private _pointerMoved = false;

  // Double-tap detection
  private _lastTapTime = 0;
  private _lastTapX = 0;
  private _lastTapY = 0;

  // Slide transition in progress (prevents double-trigger)
  private _isTransitioning = false;

  // Hash navigation popstate cleanup
  private _onPopState: (() => void) | null = null;

  // ─── View children ────────────────────────────────────────────────────────────

  private readonly _overlayElRef = viewChild<ElementRef<HTMLElement>>('overlayEl');
  private readonly _stageElRef = viewChild<ElementRef<HTMLElement>>('stageEl');
  private readonly _imageElRef = viewChild<ElementRef<HTMLImageElement>>('imageEl');
  private readonly _thumbTrackRef = viewChildren<ElementRef<HTMLElement>>('thumbTrack');
  private readonly _videoElRef = viewChild<ElementRef<HTMLVideoElement>>('videoEl');

  // ─── Computed ─────────────────────────────────────────────────────────────────

  readonly _currentItem = computed(() => this.items()[this._currentIndex()] ?? null);

  /**
   * Disable lbSwipe directive when:
   * - enableSwipe is false
   * - zoomed in (pan mode takes over)
   * - pinch gesture active
   */
  readonly _swipeDisabled = computed(() => !this.enableSwipe() || this._isZoomed() || this._isPinching());

  /** CSS transform for zoom + pan + rotate + flip on the image element. */
  readonly _imageTransform = computed(() => {
    const t = this._transformState();
    const parts: string[] = [];
    if (t.translateX !== 0 || t.translateY !== 0) {
      parts.push(`translate(${t.translateX}px, ${t.translateY}px)`);
    }
    if (t.rotation !== 0) parts.push(`rotate(${t.rotation}deg)`);
    if (t.scale !== 1) parts.push(`scale(${t.scale})`);
    if (t.flipX) parts.push('scaleX(-1)');
    if (t.flipY) parts.push('scaleY(-1)');
    return parts.join(' ') || '';
  });

  /** CSS transition for the image — suppressed during drag/pan for responsiveness. */
  readonly _imageTransition = computed(() =>
    this._isPanning() || this._isDraggingToClose() ? 'none' : 'transform 0.15s ease',
  );

  /** CSS transform for drag-to-close on the image wrapper. */
  readonly _dragTransform = computed(() => {
    const dy = this._dragDeltaY();
    if (dy === 0 || this._isZoomed()) return '';
    const scale = Math.max(0.85, 1 - Math.abs(dy) / 600);
    return `translateY(${dy}px) scale(${scale})`;
  });

  /** Opacity for drag-to-close image wrapper. */
  readonly _dragOpacity = computed(() => {
    const dy = this._dragDeltaY();
    if (dy === 0 || this._isZoomed()) return '1';
    return String(Math.max(0.4, 1 - Math.abs(dy) / 300));
  });

  readonly _isMinimal = computed(() => this.mode() === 'minimal');

  readonly _isConstrained = computed(() => this.size() !== 'fullscreen' && !this.inline());

  readonly overlayClass = computed(() =>
    cn(
      lightboxVariants({ inline: this.inline(), theme: this.theme() }),
      lightboxSizeVariants({ size: this.size() }),
      this._isConstrained() && 'z-[1101] m-auto',
      this.class(),
    ),
  );

  readonly backdropClass = computed(() => lightboxBackdropVariants({ blur: this.backdropBlur() }));

  readonly toolbarClass = computed(() => lightboxToolbarVariants({ idle: this._idleActive() }));

  readonly stageClass = computed(() => lightboxStageVariants());

  readonly toolbarBtnClass = computed(() => cn(lightboxToolbarBtnVariants({ theme: this.theme() })));

  readonly captionClass = computed(() => lightboxCaptionVariants({ idle: this._idleActive(), theme: this.theme() }));

  // ─── Thumbnail strip computed ─────────────────────────────────────────────────

  /** Effective thumb position — mobile always collapses to bottom. */
  readonly _effectiveThumbPos = computed<ThumbPosition>(() => (this._isMobile() ? 'bottom' : this.thumbPosition()));

  /** True when strip is on a vertical edge (left/right). */
  readonly _isThumbVertical = computed(
    () => this._effectiveThumbPos() === 'left' || this._effectiveThumbPos() === 'right',
  );

  /** True for corner positions (absolutely positioned strip). */
  readonly _isThumbCorner = computed(() => {
    const pos = this._effectiveThumbPos();
    return pos === 'top-left' || pos === 'top-right' || pos === 'bottom-left' || pos === 'bottom-right';
  });

  /** Height of a horizontal thumb strip (thumb height + padding). */
  readonly _thumbStripH = computed(() => THUMB_SIZE_MAP[this.thumbSize()].h + 20);
  /** Width of a vertical thumb strip (thumb width + padding). */
  readonly _thumbStripW = computed(() => THUMB_SIZE_MAP[this.thumbSize()].w + 20);

  /** Outer body class — flex-row when vertical strips are active. */
  readonly _bodyClass = computed(() =>
    cn('flex flex-1 overflow-hidden', this._thumbsVisible() && this._isThumbVertical() ? 'flex-row' : 'flex-col'),
  );

  /** Positioning classes for corner thumb strips. */
  readonly _thumbCornerClass = computed(() => {
    switch (this._effectiveThumbPos()) {
      case 'top-left':
        return 'top-0 left-0';
      case 'top-right':
        return 'top-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'bottom-right':
        return 'bottom-0 right-0';
      default:
        return '';
    }
  });

  // ─── Mobile toolbar / RTL ─────────────────────────────────────────────────────

  private readonly _MOBILE_HIDDEN = new Set<LightboxToolbarItem>([
    'download',
    'share',
    'rotate-cw',
    'rotate-ccw',
    'flip-x',
    'flip-y',
    'sidebar-toggle',
  ]);

  private _mobileFilter(items: LightboxToolbarItem[]): LightboxToolbarItem[] {
    return items.filter((item) => !this._MOBILE_HIDDEN.has(item));
  }

  readonly _activeLeft = computed<LightboxToolbarItem[]>(() => {
    if (!this._isMobile()) return this.toolbarLeft();
    const m = this.toolbarMobileLeft();
    return m !== null ? m : this._mobileFilter(this.toolbarLeft());
  });

  readonly _activeCenter = computed<LightboxToolbarItem[]>(() => {
    if (!this._isMobile()) return this.toolbarCenter();
    const m = this.toolbarMobileCenter();
    return m !== null ? m : this._mobileFilter(this.toolbarCenter());
  });

  readonly _activeRight = computed<LightboxToolbarItem[]>(() => {
    if (!this._isMobile()) return this.toolbarRight();
    const m = this.toolbarMobileRight();
    return m !== null ? m : this._mobileFilter(this.toolbarRight());
  });

  /** Per-thumb button CSS class (type-aware active state). */
  thumbBtnClass(index: number): string {
    const type = this.thumbType();
    const active = this._currentIndex() === index;
    if (type === 'modern') {
      return cn(
        'relative flex-shrink-0 overflow-hidden cursor-pointer block p-0 border-0 bg-transparent',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1',
        'transition-all duration-300',
        !active && 'opacity-60 hover:opacity-90',
      );
    }
    return cn(
      'relative flex-shrink-0 cursor-pointer overflow-hidden rounded-md transition-all',
      active ? 'ring-2 ring-inset ring-white' : 'opacity-50 hover:opacity-100',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
    );
  }

  /** Per-thumb button inline style (modern: clip expand; classic/scrollable: fixed size). */
  thumbBtnStyle(index: number): Record<string, string> {
    const type = this.thumbType();
    const { w, h } = THUMB_SIZE_MAP[this.thumbSize()];
    const clip = this.thumbClipWidth();
    const active = this._currentIndex() === index;
    const isVertical = this._isThumbVertical();

    if (type === 'modern') {
      if (isVertical) {
        return {
          height: `${active ? h : clip}px`,
          width: `${w}px`,
          transition: 'height 0.25s ease-out, opacity 0.3s ease-in-out',
        };
      }
      return {
        width: `${active ? w : clip}px`,
        height: `${h}px`,
        transition: 'width 0.3s ease-in-out, opacity 0.3s ease-in-out',
      };
    }
    return { width: `${w}px`, height: `${h}px` };
  }

  /** Inner image wrapper class. */
  thumbInnerClass(): string {
    return 'relative block w-full h-full overflow-hidden';
  }

  /** Inner div style — for modern type, negative margin centers the cropped image. */
  thumbInnerStyle(index: number): Record<string, string> {
    if (this.thumbType() !== 'modern') return {};
    const { w, h } = THUMB_SIZE_MAP[this.thumbSize()];
    const clip = this.thumbClipWidth();
    const active = this._currentIndex() === index;
    const isVertical = this._isThumbVertical();

    if (isVertical) {
      return { width: `${w}px`, height: `${h}px`, marginTop: `${active ? 0 : -Math.round((h - clip) / 2)}px` };
    }
    return { width: `${w}px`, height: `${h}px`, marginLeft: `${active ? 0 : -Math.round((w - clip) / 2)}px` };
  }

  /** Toggle thumbnail strip visibility. */
  toggleThumbs(): void {
    this._thumbsVisible.update((v) => !v);
    this.resetIdleTimer();
  }

  // ─── Video / YouTube / Vimeo ──────────────────────────────────────────────────

  /** Safe embed URL for the current YouTube or Vimeo item. */
  readonly _videoSrc = computed<SafeResourceUrl | null>(() => {
    const item = this._currentItem();
    if (!item) return null;
    if (item.type === 'youtube') {
      return this._sanitizer.bypassSecurityTrustResourceUrl(this._buildYouTubeUrl(item.src));
    }
    if (item.type === 'vimeo') {
      return this._sanitizer.bypassSecurityTrustResourceUrl(this._buildVimeoUrl(item.src));
    }
    return null;
  });

  private _extractYouTubeId(src: string): string {
    const patterns = [/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/, /^([A-Za-z0-9_-]{11})$/];
    for (const p of patterns) {
      const m = src.match(p);
      if (m) return m[1];
    }
    return src;
  }

  private _extractVimeoId(src: string): string {
    const m = src.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/);
    if (m) return m[1];
    if (/^\d+$/.test(src)) return src;
    return src;
  }

  private _buildYouTubeUrl(src: string): string {
    const id = this._extractYouTubeId(src);
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0&enablejsapi=1&autoplay=1`;
  }

  private _buildVimeoUrl(src: string): string {
    const id = this._extractVimeoId(src);
    return `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`;
  }

  /** Thumbnail src for any item type (handles video poster + YouTube auto-thumb). */
  thumbSrc(item: LightboxItem): string {
    if (item.thumb) return item.thumb;
    if (item.poster) return item.poster;
    if (item.type === 'youtube') {
      const id = this._extractYouTubeId(item.src);
      return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
    }
    if (item.type === 'video' || item.type === 'vimeo') return '';
    return item.src;
  }

  // ─── Hash navigation ──────────────────────────────────────────────────────────

  private _currentHashValue(): string {
    const item = this.items()[this._currentIndex()];
    return item?.slug ? `#${item.slug}` : `#lightbox-${this._currentIndex()}`;
  }

  private _setupHashNav(): void {
    this._onPopState = () => {
      this._clearHashNav();
      this.close();
    };
    this._doc.defaultView?.addEventListener('popstate', this._onPopState);
  }

  private _clearHashNav(): void {
    if (this._onPopState) {
      this._doc.defaultView?.removeEventListener('popstate', this._onPopState);
      this._onPopState = null;
    }
  }

  // ─── Social sharing ───────────────────────────────────────────────────────────

  toggleShare(): void {
    this._shareVisible.update((v) => !v);
    this.resetIdleTimer();
  }

  toggleSidebar(): void {
    this._sidebarOpen.update((v) => !v);
    this.resetIdleTimer();
  }

  togglePins(): void {
    this._pinsVisible.update((v) => !v);
    this._activePinId.set(null);
    this.resetIdleTimer();
  }

  onPinClick(id: string): void {
    this._activePinId.update((current) => (current === id ? null : id));
  }

  sanitizedPinContent(content: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(content);
  }

  pinLeft(x: number | string): string {
    return typeof x === 'number' ? `${x}%` : x;
  }

  pinTop(y: number | string): string {
    return typeof y === 'number' ? `${y}%` : y;
  }

  share(network: 'copy' | 'twitter' | 'facebook' | 'pinterest'): void {
    const url = this._getShareUrl();
    switch (network) {
      case 'copy':
        void this._doc.defaultView?.navigator.clipboard.writeText(url);
        break;
      case 'twitter':
        this._doc.defaultView?.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        this._doc.defaultView?.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
        );
        break;
      case 'pinterest':
        this._doc.defaultView?.open(
          `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`,
          '_blank',
        );
        break;
    }
    this._shareVisible.set(false);
    this.resetIdleTimer();
  }

  private _getShareUrl(): string {
    const shareUrl = this.shareUrl();
    const item = this._currentItem();
    if (typeof shareUrl === 'function' && item) return shareUrl(item);
    if (typeof shareUrl === 'string') return shareUrl;
    const hash = this.hashNavigation() ? this._currentHashValue() : '';
    return this._doc.location.href.split('#')[0] + hash;
  }

  readonly navBtnClass = computed(() =>
    cn(
      'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full',
      'bg-black/40 backdrop-blur-sm text-white transition-all',
      'hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
      'disabled:pointer-events-none disabled:opacity-0',
    ),
  );

  readonly safeAreaStyles = [
    '--lb-safe-top: env(safe-area-inset-top)',
    '--lb-safe-bottom: env(safe-area-inset-bottom)',
    '--lb-safe-left: env(safe-area-inset-left)',
    '--lb-safe-right: env(safe-area-inset-right)',
  ].join('; ');

  // ─── Constructor ─────────────────────────────────────────────────────────────

  constructor() {
    this._doc.addEventListener('fullscreenchange', this._onFullscreenChange);

    this._destroyRef.onDestroy(() => {
      this._doc.removeEventListener('fullscreenchange', this._onFullscreenChange);
      this._cleanupFocusTrap();
      this._releaseScrollLock();
      this._clearIdleTimer();
      this._clearHashNav();
      this._resizeObserver?.disconnect();
    });

    // Auto-pause video on slide change
    effect(() => {
      this._currentIndex();
      this._videoElRef()?.nativeElement.pause();
    });

    // Preload adjacent images on index change
    effect(() => {
      const items = this.items();
      const idx = this._currentIndex();
      const count = this.preloadCount();
      for (let i = 1; i <= count; i++) {
        [items[idx + i], items[idx - i]].forEach((it) => {
          if (it?.src && (!it.type || it.type === 'image')) {
            const img = new Image();
            img.src = it.src;
          }
        });
      }
    });

    // Reset per-slide transforms and caption on slide change
    effect(() => {
      this._currentIndex();
      this._resetTransforms();
      this._captionExpanded.set(false);
    });

    // Scroll active thumb into view when index changes
    effect(() => {
      const idx = this._currentIndex();
      const tracks = this._thumbTrackRef();
      if (!tracks.length || !this._thumbsVisible()) return;
      const track = tracks[0]?.nativeElement;
      if (!track) return;
      const thumbEls = track.querySelectorAll<HTMLElement>('[data-thumb-idx]');
      const el = thumbEls[idx];
      if (!el) return;
      const isVertical = this._isThumbVertical();
      track.scrollTo({
        [isVertical ? 'top' : 'left']: isVertical ? el.offsetTop - track.offsetTop : el.offsetLeft - track.offsetLeft,
        behavior: 'smooth',
      });
    });
  }

  // ─── Public API ───────────────────────────────────────────────────────────────

  /** Open the lightbox at `index`. Pass `triggerEl` for origin animation + focus restore. */
  open(index?: number, triggerEl?: HTMLElement): void {
    const count = this.items().length;
    if (count === 0) return;
    // Re-entry guard: clean up previous open state to prevent stacked scroll locks/focus traps.
    if (this._isVisible()) {
      this._releaseScrollLock();
      this._cleanupFocusTrap();
      this._clearIdleTimer();
      this._resizeObserver?.disconnect();
      this._resizeObserver = null;
    }
    this._currentIndex.set(Math.max(0, Math.min(index ?? this.startIndex(), count - 1)));
    this._triggerEl = triggerEl ?? null;
    this._originRect = triggerEl ? triggerEl.getBoundingClientRect() : null;
    this._isMobile.set(this._doc.documentElement.clientWidth < this.mobileBreakpoint());
    this._thumbsVisible.set(this.showThumbs());
    this._isVisible.set(true);

    if (this.hashNavigation()) {
      this._doc.defaultView?.history.pushState({ lightbox: true }, '', this._currentHashValue());
      this._setupHashNav();
    }

    setTimeout(() => {
      this._lockScroll();
      this._setupFocusTrap();
      this._setupResizeObserver();
      this._startIdleTimer();
      this._animateOpen();
      this.opened.emit(this._currentIndex());
    }, 0);
  }

  /** Close with exit animation, restore focus to trigger. */
  close(): void {
    this._shareVisible.set(false);
    if (this.hashNavigation()) {
      this._clearHashNav();
      this._doc.defaultView?.history.back();
    }
    void this._animateClose().then(() => {
      this._isVisible.set(false);
      this._releaseScrollLock();
      this._cleanupFocusTrap();
      this._clearIdleTimer();
      this._idleActive.set(false);
      this._resizeObserver?.disconnect();
      this._resizeObserver = null;
      if (this._isFullscreen()) void this._doc.exitFullscreen?.();
      this.closed.emit(this._currentIndex());
      this._triggerEl?.focus();
      this._triggerEl = null;
      this._originRect = null;
    });
  }

  /** Navigate to index (respects loop). Plays slide transition animation. */
  goTo(index: number): void {
    const items = this.items();
    if (!items.length || this._isTransitioning) return;
    const next = this.loop()
      ? ((index % items.length) + items.length) % items.length
      : Math.max(0, Math.min(index, items.length - 1));
    if (next === this._currentIndex()) return;
    const dir = next > this._currentIndex() ? 'next' : 'prev';
    void this._animateSlide(next, dir);
  }

  prev(): void {
    this.goTo(this._currentIndex() - 1);
  }

  next(): void {
    this.goTo(this._currentIndex() + 1);
  }

  resetIdleTimer(): void {
    this._idleActive.set(false);
    this._clearIdleTimer();
    this._startIdleTimer();
  }

  toggleFullscreen(): void {
    if (!this._doc.fullscreenEnabled) return;
    if (this._isFullscreen()) {
      void this._doc.exitFullscreen?.();
    } else {
      void this._overlayElRef()?.nativeElement.requestFullscreen?.();
    }
    this.resetIdleTimer();
  }

  // ─── Zoom / rotate / flip public methods ─────────────────────────────────────

  zoomIn(): void {
    const t = this._transformState();
    const next = Math.min(t.scale * 1.5, this.maxZoomScale());
    this._transformState.set({ ...t, scale: next });
    this.resetIdleTimer();
  }

  zoomOut(): void {
    const t = this._transformState();
    const next = Math.max(t.scale / 1.5, this.minZoomScale());
    const clamped = this._clampTranslate(t.translateX, t.translateY, next);
    this._transformState.set({ ...t, scale: next, ...clamped });
    this.resetIdleTimer();
  }

  zoomReset(): void {
    this._resetTransforms();
    this.resetIdleTimer();
  }

  rotateCW(): void {
    const t = this._transformState();
    const next = ((t.rotation + 90) % 360) as 0 | 90 | 180 | 270;
    this._transformState.set({ ...t, rotation: next, translateX: 0, translateY: 0 });
    this.resetIdleTimer();
  }

  rotateCCW(): void {
    const t = this._transformState();
    const next = ((t.rotation + 270) % 360) as 0 | 90 | 180 | 270;
    this._transformState.set({ ...t, rotation: next, translateX: 0, translateY: 0 });
    this.resetIdleTimer();
  }

  flipX(): void {
    const t = this._transformState();
    this._transformState.set({ ...t, flipX: !t.flipX });
    this.resetIdleTimer();
  }

  flipY(): void {
    const t = this._transformState();
    this._transformState.set({ ...t, flipY: !t.flipY });
    this.resetIdleTimer();
  }

  // ─── Swipe / drag event handlers ──────────────────────────────────────────────

  onSwipe(event: SwipeEvent): void {
    const delta = event.direction === 'left' ? 1 : event.direction === 'right' ? -1 : 0;
    if (delta === 0) return;
    const items = this.items();
    if (!items.length || this._isTransitioning) return;
    const newIndex = this.loop()
      ? (((this._currentIndex() + delta) % items.length) + items.length) % items.length
      : Math.max(0, Math.min(this._currentIndex() + delta, items.length - 1));
    if (newIndex === this._currentIndex()) return;
    // Swipe feel: new image enters from opposite side of the drag direction,
    // so it appears to follow the finger. This reverses button-nav direction.
    const animDir: 'next' | 'prev' = delta > 0 ? 'prev' : 'next';
    void this._animateSlide(newIndex, animDir);
  }

  onDragMove(event: DragMoveEvent): void {
    if (!this.dragToClose() || this._isZoomed()) return;
    if (event.deltaY > 10) {
      this._isDraggingToClose.set(true);
      this._dragDeltaY.set(event.deltaY);
      this._dragHintVisible.set(event.deltaY > 50);
    } else if (event.deltaY < -10) {
      this._isDraggingToClose.set(true);
      this._dragDeltaY.set(event.deltaY);
      this._dragHintVisible.set(false);
    }
  }

  onDragEnd(event: DragMoveEvent): void {
    if (!this.dragToClose()) return;
    this._dragHintVisible.set(false);
    if (Math.abs(event.deltaY) >= this.dragToCloseThreshold()) {
      this.close();
    } else {
      this._dragDeltaY.set(0);
      this._isDraggingToClose.set(false);
    }
  }

  // ─── Stage pointer handlers (pan + pinch) ─────────────────────────────────────

  onStagePointerDown(event: PointerEvent): void {
    this._pointerDownX = event.clientX;
    this._pointerDownY = event.clientY;
    this._pointerMoved = false;

    this._pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this._pointers.size === 2) {
      // Start pinch — interrupt any current pan
      this._isPinching.set(true);
      this._isPanning.set(false);
      const pts = [...this._pointers.values()];
      this._initialPinchDistance = this._getPinchDistance(pts[0], pts[1]);
      this._initialPinchScale = this._transformState().scale;
      const stageEl = this._stageElRef()?.nativeElement;
      stageEl?.setPointerCapture(event.pointerId);
    } else if (this._pointers.size === 1 && this._isZoomed()) {
      // Start pan
      this._isPanning.set(true);
      this._isPinching.set(false);
      this._panStartX = event.clientX;
      this._panStartY = event.clientY;
      const t = this._transformState();
      this._panStartTX = t.translateX;
      this._panStartTY = t.translateY;
      const stageEl = this._stageElRef()?.nativeElement;
      stageEl?.setPointerCapture(event.pointerId);
    }
  }

  onStagePointerMove(event: PointerEvent): void {
    const prev = this._pointers.get(event.pointerId);
    if (!prev) return;
    this._pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const dx = event.clientX - this._pointerDownX;
    const dy = event.clientY - this._pointerDownY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) this._pointerMoved = true;

    if (this._isPinching() && this._pointers.size === 2) {
      const pts = [...this._pointers.values()];
      const dist = this._getPinchDistance(pts[0], pts[1]);
      const rawScale = (dist / this._initialPinchDistance) * this._initialPinchScale;
      const clamped = Math.max(this.minZoomScale(), Math.min(this.maxZoomScale(), rawScale));
      const t = this._transformState();
      const clampedXY = this._clampTranslate(t.translateX, t.translateY, clamped);
      this._transformState.set({ ...t, scale: clamped, ...clampedXY });
    } else if (this._isPanning() && this._pointers.size === 1) {
      const ddx = event.clientX - this._panStartX;
      const ddy = event.clientY - this._panStartY;
      const newTX = this._panStartTX + ddx;
      const newTY = this._panStartTY + ddy;
      const t = this._transformState();
      const clamped = this._clampTranslate(newTX, newTY, t.scale);
      this._transformState.set({ ...t, ...clamped });
    }
  }

  onStagePointerUp(event: PointerEvent): void {
    this._pointers.delete(event.pointerId);
    if (this._pointers.size < 2) this._isPinching.set(false);
    if (this._pointers.size === 0) this._isPanning.set(false);
  }

  onStagePointerCancel(event: PointerEvent): void {
    this._pointers.delete(event.pointerId);
    if (this._pointers.size < 2) this._isPinching.set(false);
    if (this._pointers.size === 0) this._isPanning.set(false);
  }

  /** MouseMove pan — image tracks cursor (panMode: 'mousemove'). */
  onStageMouseMove(event: MouseEvent): void {
    if (!this._isVisible() || this.panMode() !== 'mousemove') return;
    if (this._isZoomed() || !this.enableZoom()) return;
    const stageEl = this._stageElRef()?.nativeElement;
    if (!stageEl) return;
    const rect = stageEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const factor = this.mouseMoveFactor();
    const tx = (event.clientX - cx) * factor * 0.08;
    const ty = (event.clientY - cy) * factor * 0.08;
    const t = this._transformState();
    this._transformState.set({ ...t, translateX: tx, translateY: ty });
  }

  // ─── Image click / double-tap ─────────────────────────────────────────────────

  onImageClick(event: MouseEvent): void {
    if (this._pointerMoved) return; // was a drag, not a click
    if (!this.enableZoom() || this.zoomClickAction() === false) return;

    // Double-tap detection
    const now = Date.now();
    const dx = event.clientX - this._lastTapX;
    const dy = event.clientY - this._lastTapY;
    if (now - this._lastTapTime < 350 && Math.hypot(dx, dy) < 40 && this.doubleTapZoom()) {
      this._lastTapTime = 0;
      this._handleDoubleTap();
      return;
    }
    this._lastTapTime = now;
    this._lastTapX = event.clientX;
    this._lastTapY = event.clientY;

    this._handleZoomClick();
  }

  // ─── Keyboard / pointer activity ─────────────────────────────────────────────

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this._isVisible() || !this.enableKeyboard()) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.prev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case 'Home':
        event.preventDefault();
        this.goTo(0);
        break;
      case 'End':
        event.preventDefault();
        this.goTo(this.items().length - 1);
        break;
      case '+':
      case '=':
        event.preventDefault();
        this.zoomIn();
        break;
      case '-':
        event.preventDefault();
        this.zoomOut();
        break;
      case '0':
        event.preventDefault();
        this.zoomReset();
        break;
      case 'R':
      case 'r':
        if (this.showRotate()) {
          event.preventDefault();
          this.rotateCW();
        }
        break;
      case 'Escape':
        event.preventDefault();
        if (this._idleActive()) {
          this.resetIdleTimer();
        } else {
          this.close();
        }
        break;
      case 'I':
      case 'i':
        event.preventDefault();
        if (this._idleActive()) this.resetIdleTimer();
        else {
          this._idleActive.set(true);
          this._clearIdleTimer();
        }
        break;
      case 'F':
      case 'f':
        event.preventDefault();
        this.toggleFullscreen();
        break;
      default:
        this.resetIdleTimer();
    }
  }

  @HostListener('document:pointermove')
  @HostListener('document:pointerdown')
  onPointerActivity(): void {
    if (this._isVisible()) this.resetIdleTimer();
  }

  onWheel(event: WheelEvent): void {
    if (!this._isVisible()) return;
    const action = this.wheelAction();
    if (action === 'slide') {
      event.preventDefault();
      if (event.deltaY > 0) {
        this.next();
      } else {
        this.prev();
      }
    } else if (action === 'zoom' && this.enableZoom()) {
      event.preventDefault();
      if (event.deltaY > 0) {
        this.zoomOut();
      } else {
        this.zoomIn();
      }
    }
  }

  onBackdropClick(): void {
    if (this.closeOnBackdropClick()) this.close();
  }

  onStageClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName === 'IMG') return;
    this.resetIdleTimer();
  }

  onContextMenu(event: MouseEvent): void {
    if (this.protect()) event.preventDefault();
  }

  // ─── Private: animation ───────────────────────────────────────────────────────

  private _animateOpen(): void {
    const el = this._overlayElRef()?.nativeElement;
    if (!el || this.openFrom() === 'none') return;

    const dur = this.animationDuration();
    const ease = this.animationEasing();

    if (this.openFrom() === 'origin' && this._originRect) {
      const { left, top, width, height } = this._originRect;
      const vw = this._doc.documentElement.clientWidth;
      const vh = this._doc.documentElement.clientHeight;
      const dx = left + width / 2 - vw / 2;
      const dy = top + height / 2 - vh / 2;
      const scale = Math.max(0.05, Math.min(width / vw, height / vh));

      el.animate(
        [
          { opacity: '0', transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
          { opacity: '1', transform: 'none' },
        ],
        { duration: dur, easing: ease, fill: 'both' },
      );
    } else {
      el.animate(
        [
          { opacity: '0', transform: 'scale(0.92)' },
          { opacity: '1', transform: 'scale(1)' },
        ],
        { duration: dur, easing: ease, fill: 'both' },
      );
    }
  }

  private _animateClose(): Promise<void> {
    const el = this._overlayElRef()?.nativeElement;
    if (!el || this.openFrom() === 'none') return Promise.resolve();

    const dur = this.animationDuration();
    const ease = this.closeEasing() ?? this.animationEasing();

    return new Promise((resolve) => {
      let keyframes: Keyframe[];

      if (this.openFrom() === 'origin' && this._originRect) {
        const { left, top, width, height } = this._originRect;
        const vw = this._doc.documentElement.clientWidth;
        const vh = this._doc.documentElement.clientHeight;
        const dx = left + width / 2 - vw / 2;
        const dy = top + height / 2 - vh / 2;
        const scale = Math.max(0.05, Math.min(width / vw, height / vh));
        keyframes = [
          { opacity: '1', transform: 'none' },
          { opacity: '0', transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
        ];
      } else {
        keyframes = [
          { opacity: '1', transform: 'scale(1)' },
          { opacity: '0', transform: 'scale(0.92)' },
        ];
      }

      const anim = el.animate(keyframes, { duration: dur, easing: ease, fill: 'both' });
      anim.onfinish = () => resolve();
      anim.oncancel = () => resolve();
    });
  }

  /**
   * Animate slide transition: fade+slide old content out, update index, fade+slide in new.
   * Sprint 4: uses slideEasing ?? animationEasing; direction drives translate direction.
   */
  private async _animateSlide(newIndex: number, direction: 'next' | 'prev'): Promise<void> {
    const stageEl = this._stageElRef()?.nativeElement;
    const dur = this.animationDuration();
    const ease = this.slideEasing() ?? this.animationEasing();
    const halfDur = Math.max(50, dur / 2);
    const dir = direction === 'next' ? -1 : 1;

    this._isTransitioning = true;

    if (stageEl && dur > 0) {
      // Slide current content out
      await stageEl
        .animate(
          [
            { opacity: '1', transform: 'translateX(0)' },
            { opacity: '0', transform: `translateX(${dir * -40}px)` },
          ],
          { duration: halfDur, easing: ease, fill: 'forwards' },
        )
        .finished.catch(() => {});
    }

    // Update slide
    this._currentIndex.set(newIndex);
    this._activePinId.set(null);
    this.changed.emit(newIndex);
    if (this.hashNavigation()) {
      this._doc.defaultView?.history.replaceState({ lightbox: true }, '', this._currentHashValue());
    }

    if (stageEl && dur > 0) {
      // Wait one frame for Angular to render the new image
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      stageEl.animate(
        [
          { opacity: '0', transform: `translateX(${dir * 40}px)` },
          { opacity: '1', transform: 'translateX(0)' },
        ],
        { duration: halfDur, easing: ease, fill: 'forwards' },
      );

      // Wait for in-animation before unblocking next navigation
      await new Promise<void>((r) => setTimeout(r, halfDur));
    }

    this._isTransitioning = false;
    this.resetIdleTimer();
  }

  // ─── Private: zoom click actions ─────────────────────────────────────────────

  private _handleZoomClick(): void {
    const action = this.zoomClickAction();
    if (action === false) return;

    const t = this._transformState();
    const min = this.minZoomScale();
    const max = this.maxZoomScale();

    switch (action) {
      case 'iterateZoom': {
        if (t.scale <= min + 0.01) {
          // fit → 1:1
          this._transformState.set({ ...t, scale: 2, translateX: 0, translateY: 0 });
        } else if (t.scale < max - 0.01) {
          // 1:1 → max
          this._transformState.set({ ...t, scale: max, translateX: 0, translateY: 0 });
        } else {
          // max → fit
          this._resetTransforms();
        }
        break;
      }
      case 'toggleFull': {
        const next = t.scale > min + 0.01 ? min : 2;
        this._transformState.set({ ...t, scale: next, translateX: 0, translateY: 0 });
        break;
      }
      case 'toggleCover': {
        const next = t.scale > min + 0.01 ? min : max;
        this._transformState.set({ ...t, scale: next, translateX: 0, translateY: 0 });
        break;
      }
      case 'toggleMax': {
        const next = t.scale >= max - 0.01 ? min : max;
        this._transformState.set({ ...t, scale: next, translateX: 0, translateY: 0 });
        break;
      }
      case 'zoom': {
        this.zoomIn();
        break;
      }
    }
    this.resetIdleTimer();
  }

  private _handleDoubleTap(): void {
    const t = this._transformState();
    if (this._isZoomed()) {
      this._resetTransforms();
    } else {
      this._transformState.set({ ...t, scale: 2.5, translateX: 0, translateY: 0 });
    }
    this.resetIdleTimer();
  }

  // ─── Private: transform helpers ──────────────────────────────────────────────

  private _resetTransforms(): void {
    this._transformState.set({ ...DEFAULT_TRANSFORM });
  }

  private _clampTranslate(tx: number, ty: number, scale: number): { translateX: number; translateY: number } {
    const img = this._imageElRef()?.nativeElement;
    if (!img || scale <= 1) return { translateX: 0, translateY: 0 };
    const maxTx = (img.offsetWidth * (scale - 1)) / 2;
    const maxTy = (img.offsetHeight * (scale - 1)) / 2;
    return {
      translateX: Math.max(-maxTx, Math.min(maxTx, tx)),
      translateY: Math.max(-maxTy, Math.min(maxTy, ty)),
    };
  }

  private _getPinchDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  // ─── Private: scroll lock / focus trap / idle / resize ───────────────────────

  private _lockScroll(): void {
    if (!this.inline()) this._doc.body.style.overflow = 'hidden';
  }

  private _releaseScrollLock(): void {
    if (!this.inline()) this._doc.body.style.overflow = '';
  }

  private _setupFocusTrap(): void {
    if (this.inline()) return;
    const el = this._overlayElRef()?.nativeElement;
    if (!el) return;
    this._focusTrap = this._focusTrapFactory.create(el);
    void this._focusTrap.focusInitialElementWhenReady();
  }

  private _cleanupFocusTrap(): void {
    this._focusTrap?.destroy();
    this._focusTrap = null;
  }

  private _startIdleTimer(): void {
    const idleMs = this.idle();
    if (idleMs === false) return;
    this._idleTimer = setTimeout(() => this._idleActive.set(true), idleMs);
  }

  private _clearIdleTimer(): void {
    if (this._idleTimer !== null) {
      clearTimeout(this._idleTimer);
      this._idleTimer = null;
    }
  }

  private _setupResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') return;
    this._resizeObserver = new ResizeObserver(() => {
      this._isMobile.set(this._doc.documentElement.clientWidth < this.mobileBreakpoint());
    });
    this._resizeObserver.observe(this._doc.documentElement);
  }

  private readonly _onFullscreenChange = (): void => {
    this._isFullscreen.set(!!this._doc.fullscreenElement);
  };
}

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import type { ClassValue } from 'clsx';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-angular';
import { cn } from '../../utils/cn';
import { ScrollbarDirective } from '../../directives/scrollbar.directive';
import { IconComponent } from '../icon/icon.component';
import {
  CAROUSEL_THUMBS_TOKEN,
  CAROUSEL_TOKEN,
  navBtnClass,
  type CarouselNavShape,
  type CarouselNavVariant,
  type CarouselThumbsApi,
} from './carousel.types';

// ─── Thumb size map ─────────────────────────────────────────────────────────────

const THUMB_SIZE_MAP = {
  sm: { thumbWidth: 60, thumbHeight: 48 },
  md: { thumbWidth: 94, thumbHeight: 76 },
  lg: { thumbWidth: 120, thumbHeight: 96 },
} as const;

export type CarouselThumbSize = keyof typeof THUMB_SIZE_MAP;
export type CarouselThumbType = 'modern' | 'classic' | 'scrollable';

// ─── Thumb Item ─────────────────────────────────────────────────────────────────
// Individual thumb button. Injects CAROUSEL_TOKEN (parent carousel state) and
// CAROUSEL_THUMBS_TOKEN (config from the thumb strip container).

@Component({
  selector: 'ui-carousel-thumb-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'block flex-shrink-0' },
  template: `
    <button
      type="button"
      [class]="btnClass()"
      [style]="btnStyle()"
      (click)="carousel.goTo(index())"
      [attr.aria-label]="'Go to slide ' + (index() + 1)"
      [attr.aria-current]="isActive() ? 'true' : null"
    >
      <div [class]="innerClass()" [style]="innerStyle()">
        <ng-content />
      </div>
    </button>
  `,
})
export class CarouselThumbItemComponent {
  readonly index = input.required<number>();

  protected readonly carousel = inject(CAROUSEL_TOKEN);
  protected readonly thumbs = inject(CAROUSEL_THUMBS_TOKEN);

  protected readonly isActive = computed(() => this.carousel.selectedIndex() === this.index());

  protected readonly btnClass = computed(() => {
    const type = this.thumbs.type();
    const active = this.isActive();

    if (type === 'modern') {
      return cn(
        'relative overflow-hidden cursor-pointer block p-0 border-0 bg-transparent',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
        'transition-all duration-300 ease-in-out',
        !active && 'opacity-60 hover:opacity-90',
      );
    }
    // classic / scrollable — outset ring with offset so the border is always visible
    // over any image content (inset ring blends into bright images).
    return cn(
      'relative flex-shrink-0 cursor-pointer overflow-hidden rounded-md transition-all',
      active ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : 'opacity-50 hover:opacity-100',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    );
  });

  protected readonly btnStyle = computed(() => {
    const type = this.thumbs.type();
    const h = this.thumbs.thumbHeight();
    const w = this.thumbs.thumbWidth();
    const clip = this.thumbs.clipWidth();
    const active = this.isActive();
    const isVertical = this.thumbs.orientation() === 'vertical';

    if (type === 'modern') {
      if (isVertical) {
        return {
          height: `${active ? h : clip}px`,
          width: `${w}px`,
          transition: 'height 0.25s ease-out',
        };
      }
      return {
        width: `${active ? w : clip}px`,
        height: `${h}px`,
        transition: 'width 0.3s ease-in-out, opacity 0.3s ease-in-out',
      };
    }
    return { width: `${w}px`, height: `${h}px` };
  });

  protected readonly innerClass = computed(() =>
    cn('block w-full h-full object-cover overflow-hidden', '[&>img]:w-full [&>img]:h-full [&>img]:object-cover'),
  );

  protected readonly innerStyle = computed(() => {
    const type = this.thumbs.type();
    if (type === 'modern') {
      const w = this.thumbs.thumbWidth();
      const h = this.thumbs.thumbHeight();
      const clip = this.thumbs.clipWidth();
      const active = this.isActive();
      // Center the full-size inner content within the clipped button so the crop
      // shows the middle of the image, not the left edge.
      const marginLeft = active ? 0 : -Math.round((w - clip) / 2);
      return { width: `${w}px`, height: `${h}px`, marginLeft: `${marginLeft}px` };
    }
    return {};
  });
}

// ─── Thumbs Container ───────────────────────────────────────────────────────────
// Wraps projected ui-carousel-thumb-item elements.
// Provides CAROUSEL_THUMBS_TOKEN for items to read config.
// Scrolls active thumb into view when carousel.selectedIndex() changes.

@Component({
  selector: 'ui-carousel-thumbs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [IconComponent, ScrollbarDirective],
  providers: [{ provide: CAROUSEL_THUMBS_TOKEN, useExisting: forwardRef(() => CarouselThumbsComponent) }],
  host: { '[class]': 'computedClass()' },
  template: `
    <div [class]="arrowWrapClass()">
      @if (arrows()) {
        <button
          type="button"
          [class]="arrowBtnClass()"
          [disabled]="!carousel.canScrollPrev()"
          (click)="carousel.prev()"
          aria-label="Previous slide"
        >
          @if (orientation() === 'vertical') {
            <ui-icon [name]="ChevronUpIcon" size="sm" />
          } @else {
            <ui-icon [name]="ChevronLeftIcon" size="sm" />
          }
        </button>
      }
      <div #track [class]="trackClass()" [uiScrollbar]="'thin'" [style]="trackStyle()">
        <ng-content select="ui-carousel-thumb-item" />
      </div>
      @if (arrows()) {
        <button
          type="button"
          [class]="arrowBtnClass()"
          [disabled]="!carousel.canScrollNext()"
          (click)="carousel.next()"
          aria-label="Next slide"
        >
          @if (orientation() === 'vertical') {
            <ui-icon [name]="ChevronDownIcon" size="sm" />
          } @else {
            <ui-icon [name]="ChevronRightIcon" size="sm" />
          }
        </button>
      }
    </div>
  `,
})
export class CarouselThumbsComponent implements CarouselThumbsApi {
  // ── Inputs ───────────────────────────────────────────────────────────────
  readonly type = input<CarouselThumbType>('modern');
  readonly thumbSize = input<CarouselThumbSize>('md');
  readonly clipWidth = input<number>(46);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');
  /** Force square aspect ratio — thumbHeight mirrors thumbWidth (images are cropped). */
  readonly square = input<boolean>(false);
  /** Override thumb width in px (overrides thumbSize map). For vertical strips, controls the visible width. */
  readonly thumbWidthPx = input<number | undefined>(undefined);
  /** Override thumb height in px (overrides thumbSize map). For horizontal strips, controls the visible height. */
  readonly thumbHeightPx = input<number | undefined>(undefined);
  /** Center thumbnails horizontally/vertically within the track. Default true. */
  readonly centered = input<boolean>(true);
  /** Show prev/next arrows at the start and end of the thumbnail strip. */
  readonly arrows = input<boolean>(false);
  /** Visual style for the thumbnail strip arrow buttons. */
  readonly arrowVariant = input<CarouselNavVariant>('default');
  /** Shape for the thumbnail strip arrow buttons. */
  readonly arrowShape = input<CarouselNavShape>('circle');

  // ── Arrow icons ──────────────────────────────────────────────────────────
  protected readonly ChevronLeftIcon = ChevronLeft;
  protected readonly ChevronRightIcon = ChevronRight;
  protected readonly ChevronUpIcon = ChevronUp;
  protected readonly ChevronDownIcon = ChevronDown;

  protected readonly arrowBtnClass = computed(() => navBtnClass(this.arrowVariant(), this.arrowShape(), 'sm'));

  // ── Carousel state ───────────────────────────────────────────────────────
  protected readonly carousel = inject(CAROUSEL_TOKEN);

  // ── Track ref (for scrollIntoView) ───────────────────────────────────────
  private readonly trackRef = viewChild<ElementRef<HTMLElement>>('track');

  // ── Computed thumb dimensions ────────────────────────────────────────────
  // Base values from size map; overridden by thumbWidthPx / thumbHeightPx inputs.
  // square=true forces thumbHeight = thumbWidth (images get cropped).
  readonly thumbWidth = computed(() => this.thumbWidthPx() ?? THUMB_SIZE_MAP[this.thumbSize()].thumbWidth);
  readonly thumbHeight = computed(() => {
    if (this.square()) return this.thumbWidth();
    return this.thumbHeightPx() ?? THUMB_SIZE_MAP[this.thumbSize()].thumbHeight;
  });

  // ── Scroll active thumb into view ────────────────────────────────────────
  // scrollTo() is scoped to the track element only — never causes a document-level scroll.
  // For modern/classic (overflow-hidden) it is a no-op. For scrollable (overflow-auto)
  // it scrolls the strip to bring the active thumb into view.
  // Suppressed while the user is drag-scrolling so it doesn't fight the drag.
  private _userDragging = false;

  constructor() {
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    effect(() => {
      const idx = this.carousel.selectedIndex();
      const track = this.trackRef()?.nativeElement;
      if (!track || this._userDragging) return;
      const thumbs = track.querySelectorAll('ui-carousel-thumb-item');
      const el = thumbs[idx] as HTMLElement | undefined;
      if (!el) return;
      const isVertical = this.orientation() === 'vertical';
      track.scrollTo({
        [isVertical ? 'top' : 'left']: isVertical ? el.offsetTop - track.offsetTop : el.offsetLeft - track.offsetLeft,
        behavior: 'smooth',
      });
    });

    // ── Drag-to-scroll with momentum ────────────────────────────────────
    // Lets users click-drag the thumb strip on desktop. Tracks velocity so
    // the strip glides with inertia on release instead of stopping dead.
    // Pointer listeners are on the track (down) and document (move/up) so
    // capture works even when the cursor leaves the strip. Runs outside
    // Angular zone to avoid unnecessary change detection on every pointermove.
    effect(() => {
      const track = this.trackRef()?.nativeElement;
      if (!track) return;
      const isVertical = this.orientation() === 'vertical';

      let isDragging = false;
      let didDrag = false;
      let startPos = 0;
      let startScroll = 0;
      let lastPos = 0;
      let lastTime = 0;
      let velocity = 0;
      let momentumRaf = 0;
      const DRAG_THRESHOLD = 5;
      const FRICTION = 0.95;
      const MIN_VELOCITY = 0.5;

      const stopMomentum = () => {
        if (momentumRaf) {
          cancelAnimationFrame(momentumRaf);
          momentumRaf = 0;
        }
      };

      const applyMomentum = () => {
        velocity *= FRICTION;
        if (Math.abs(velocity) < MIN_VELOCITY) {
          this._userDragging = false;
          return;
        }
        if (isVertical) {
          track.scrollTop += velocity;
        } else {
          track.scrollLeft += velocity;
        }
        momentumRaf = requestAnimationFrame(applyMomentum);
      };

      const onPointerDown = (e: PointerEvent) => {
        if (e.button !== 0) return;
        stopMomentum();
        isDragging = true;
        didDrag = false;
        this._userDragging = true;
        startPos = isVertical ? e.clientY : e.clientX;
        lastPos = startPos;
        lastTime = e.timeStamp;
        velocity = 0;
        startScroll = isVertical ? track.scrollTop : track.scrollLeft;
        track.style.cursor = 'grabbing';
        track.style.userSelect = 'none';
        e.preventDefault();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const pos = isVertical ? e.clientY : e.clientX;
        const delta = startPos - pos;
        if (Math.abs(delta) > DRAG_THRESHOLD) didDrag = true;

        // Track velocity from recent movement
        const dt = e.timeStamp - lastTime;
        if (dt > 0) {
          velocity = ((lastPos - pos) / dt) * 16; // normalize to ~1 frame
        }
        lastPos = pos;
        lastTime = e.timeStamp;

        if (isVertical) {
          track.scrollTop = startScroll + delta;
        } else {
          track.scrollLeft = startScroll + delta;
        }
      };

      const onPointerUp = () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = '';
        track.style.userSelect = '';
        // Glide with momentum; _userDragging stays true until momentum ends
        if (didDrag && Math.abs(velocity) > MIN_VELOCITY) {
          momentumRaf = requestAnimationFrame(applyMomentum);
        } else {
          this._userDragging = false;
        }
      };

      const onClick = (e: MouseEvent) => {
        if (didDrag) {
          e.preventDefault();
          e.stopPropagation();
          didDrag = false;
        }
      };

      zone.runOutsideAngular(() => {
        track.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
        document.addEventListener('pointercancel', onPointerUp);
        track.addEventListener('click', onClick, true);
      });

      destroyRef.onDestroy(() => {
        stopMomentum();
        track.removeEventListener('pointerdown', onPointerDown);
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointercancel', onPointerUp);
        track.removeEventListener('click', onClick, true);
      });
    });
  }

  // ── Styles ───────────────────────────────────────────────────────────────
  protected readonly computedClass = computed(() => {
    const isVertical = this.orientation() === 'vertical';
    return cn('block', isVertical ? 'h-full' : 'w-full', this.class());
  });

  /** Outer wrapper — flex row/col when arrows are shown so buttons bookend the track. */
  protected readonly arrowWrapClass = computed(() => {
    if (!this.arrows()) return '';
    return this.orientation() === 'vertical'
      ? 'flex flex-col items-center gap-1.5 h-full'
      : 'flex items-center gap-1.5 w-full';
  });

  protected readonly trackClass = computed(() => {
    const type = this.type();
    const isVertical = this.orientation() === 'vertical';
    // flex-1 + min-w-0/min-h-0 let the track fill the space between arrow buttons
    const grow = this.arrows() ? (isVertical ? 'flex-1 min-h-0' : 'flex-1 min-w-0') : '';

    const center = this.centered();

    if (type === 'scrollable') {
      return cn(
        grow,
        'flex gap-2 overflow-auto touch-pan-x cursor-grab',
        center && (isVertical ? 'justify-center' : 'justify-center'),
        // p-1.5: outset ring-2 + ring-offset-1 extends ~3px outside buttons — 6px padding keeps
        // the ring inside the overflow clip boundary so it's never cut off.
        isVertical
          ? 'flex-col overflow-x-hidden overflow-y-auto p-1.5'
          : 'flex-row overflow-y-hidden overflow-x-auto p-1.5',
      );
    }

    // modern + classic: overflow hidden for clip effect; p-1.5 keeps outset ring inside clip boundary.
    return cn(
      grow,
      'flex gap-1.5',
      center && 'justify-center',
      isVertical ? 'flex-col overflow-y-hidden p-1.5' : 'flex-row overflow-x-hidden p-1.5',
    );
  });

  /** Pins horizontal scrollable track height to thumb size so the horizontal scrollbar
   *  doesn't inflate the flex container and push arrow buttons below the image center. */
  protected readonly trackStyle = computed(() => {
    if (this.type() === 'scrollable' && this.orientation() !== 'vertical') {
      // thumbHeight + 12px (p-1.5 top/bottom) + 8px for thin scrollbar track height.
      return { height: `${this.thumbHeight() + 20}px` };
    }
    return {};
  });
}

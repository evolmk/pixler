import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  type InputSignal,
  type Signal,
} from '@angular/core';
import type { ClassValue } from 'clsx';
import { EmblaCarouselDirective } from 'embla-carousel-angular';
import type { EmblaCarouselType, EmblaEventType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel-angular';
import { cn } from '../../utils/cn';
import { CarouselDotsComponent, CarouselNextComponent, CarouselPrevComponent } from './carousel-nav.component';
import { CarouselPluginService } from './carousel-plugin.service';
import {
  CAROUSEL_TOKEN,
  type CarouselApi,
  type CarouselNavShape,
  type CarouselDotsVariant,
  type CarouselNavVariant,
  type CarouselPluginConfig,
} from './carousel.types';
import { carouselContentVariants, carouselItemVariants, carouselVariants } from './carousel.variants';

// ─── Content ──────────────────────────────────────────────────────────────────
// The Embla flex container — direct child of the overflow-hidden viewport.
// Negative margin (-ml-4 / -mt-4) paired with item padding creates the gap.

@Component({
  selector: 'ui-carousel-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content select="ui-carousel-item" />`,
})
export class CarouselContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly carousel = inject(CAROUSEL_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      carouselContentVariants({ orientation: this.carousel.orientation() }),
      // Vertical mode: h-full ensures the flex track fills the viewport so
      // basis-full on items resolves to a concrete pixel height.
      this.carousel.orientation() === 'vertical' ? 'h-full' : '',
      this.class(),
    ),
  );
}

// ─── Item ──────────────────────────────────────────────────────────────────────
// Individual slide. basis-full by default — override with e.g. basis-1/2 for multi-slide.

@Component({
  selector: 'ui-carousel-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"group"',
    '[attr.aria-roledescription]': '"slide"',
  },
  template: `<ng-content />`,
})
export class CarouselItemComponent {
  readonly class = input<ClassValue>('');

  protected readonly carousel = inject(CAROUSEL_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(carouselItemVariants({ orientation: this.carousel.orientation() }), this.class()),
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
// Owns the EmblaCarouselDirective, computes all options from individual inputs,
// exposes public signals via CAROUSEL_TOKEN for child components to consume.
//
// DOM structure:
//   <ui-carousel>                              ← outer wrapper (relative, focusable)
//     <div class="overflow-hidden" emblaCarousel>  ← Embla viewport (internal)
//       <ui-carousel-content />               ← flex track (projected)
//     </div>
//     <ui-carousel-prev />                    ← controls (projected, absolute)
//     <ui-carousel-next />\
//     <ui-carousel-dots />
//   </ui-carousel>
//
// Notes:
//   - Vertical mode requires explicit height on ui-carousel or ui-carousel-content
//   - Consumer overrides slide width via class="basis-1/2" on ui-carousel-item
//   - EmblaCarousel sees the overflow-hidden div as viewport, ui-carousel-content as container

@Component({
  selector: 'ui-carousel',
  exportAs: 'uiCarousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [EmblaCarouselDirective, CarouselPrevComponent, CarouselNextComponent, CarouselDotsComponent],
  providers: [{ provide: CAROUSEL_TOKEN, useExisting: forwardRef(() => CarouselComponent) }, CarouselPluginService],
  host: {
    '[class]': 'computedClass()',
    '[attr.aria-roledescription]': '"carousel"',
    tabindex: '0',
    '(keydown)': 'onKeyDown($event)',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
  template: `
    <!-- Slide area wrapper — position context for built-in controls.
         Scoped to slide height only so buttons/dots don't bleed into thumb strips. -->
    <div [class]="slideAreaClass()">
      <div
        [class]="orientation() === 'vertical' ? 'overflow-hidden h-full' : 'overflow-hidden'"
        emblaCarousel
        [options]="emblaOptions()"
        [plugins]="emblaPlugins()"
        [subscribeToEvents]="emblaEvents"
        (emblaChange)="onEmblaChange($event)"
      >
        <ng-content select="ui-carousel-content" />
      </div>

      @if (controls() === 'button' || controls() === 'button dot') {
        <ui-carousel-prev />
        <ui-carousel-next />
      }
      @if (controls() === 'dot' || controls() === 'button dot') {
        <ui-carousel-dots />
      }
    </div>

    <!-- Manual composition (ui-carousel-thumbs, custom controls, etc.) -->
    <ng-content />
  `,
})
export class CarouselComponent implements CarouselApi {
  // ── Layout ────────────────────────────────────────────────────────────────
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  // ── Embla core options ─────────────────────────────────────────────────────
  readonly align = input<'start' | 'center' | 'end'>('center');
  readonly loop = input<boolean>(false);
  readonly dragFree = input<boolean>(false);
  readonly dragThreshold = input<number>(10);
  readonly slidesToScroll = input<number | 'auto'>(1);
  readonly containScroll = input<false | 'trimSnaps' | 'keepSnaps'>('trimSnaps');
  readonly direction = input<'ltr' | 'rtl'>('ltr');
  /** Controls animation speed — higher = slower. Range: 15 (fast) → 50 (slow). Default: 25. */
  readonly duration = input<number>(25);
  /** 0-indexed starting slide. */
  readonly startIndex = input<number>(0);
  readonly active = input<boolean>(true);
  /** Enable/disable drag. */
  readonly watchDrag = input<boolean>(true);
  readonly skipSnaps = input<boolean>(false);
  readonly inViewThreshold = input<number | number[]>(0);
  readonly breakpoints: InputSignal<Record<string, Partial<EmblaOptionsType>>> = input<
    Record<string, Partial<EmblaOptionsType>>
  >({});

  // ── Plugin inputs ─────────────────────────────────────────────────────────

  // Autoplay
  readonly autoplay = input<boolean>(false);
  readonly autoplayDelay = input<number>(4000);
  readonly autoplayStopOnInteraction = input<boolean>(true);
  readonly autoplayStopOnMouseEnter = input<boolean>(false);
  readonly autoplayStopOnLastSnap = input<boolean>(false);
  /** Show circular progress ring over the carousel (Sprint 4). */
  readonly autoplayShowProgress = input<boolean>(true);

  // Auto scroll (continuous, no snap)
  readonly autoScroll = input<boolean>(false);
  readonly autoScrollSpeed = input<number>(2);
  readonly autoScrollDirection = input<'forward' | 'backward'>('forward');
  readonly autoScrollStopOnInteraction = input<boolean>(true);

  // Auto height
  readonly autoHeight = input<boolean>(false);

  // Transition
  /** 'slide' = default Embla scroll. 'fade' / 'crossfade' activate the Fade plugin. */
  readonly transition = input<'slide' | 'fade' | 'crossfade'>('slide');

  // Class names plugin
  readonly classNames = input<boolean>(false);
  readonly classNameSnapped = input<string>('is-snapped');
  readonly classNameInView = input<string>('is-in-view');
  readonly classNameDraggable = input<string>('is-draggable');
  readonly classNamePointerDown = input<string>('is-pointer-down');

  // Wheel gestures
  readonly wheelGestures = input<boolean>(false);
  readonly wheelForceAxis = input<'x' | 'y' | undefined>(undefined);

  // ── Plugin passthrough (merged with built-in plugins above) ───────────────
  readonly plugins: InputSignal<EmblaPluginType[]> = input<EmblaPluginType[]>([]);

  // ── Controls shortcut ─────────────────────────────────────────────────────
  /** 'button' | 'dot' | 'button dot' | 'none'. Consumer can also compose manually. */
  readonly controls = input<'button' | 'dot' | 'button dot' | 'none'>('button');

  // ── Nav button styling ────────────────────────────────────────────────────
  /** Visual style for prev/next arrow buttons. */
  readonly navVariant = input<CarouselNavVariant>('default');
  /** Shape for prev/next arrow buttons. */
  readonly navShape = input<CarouselNavShape>('circle');
  /** Dot indicator color variant. */
  readonly dotsVariant = input<CarouselDotsVariant>('dark');

  // ── Outputs ───────────────────────────────────────────────────────────────
  readonly emblaInited = output<EmblaCarouselType>();
  readonly slideSelected = output<number>();

  // ── Public signals (CarouselApi) ──────────────────────────────────────────
  readonly selectedIndex = signal<number>(0);
  readonly slideCount = signal<number>(0);
  readonly canScrollPrev = signal<boolean>(false);
  readonly canScrollNext = signal<boolean>(false);
  readonly scrollSnaps = signal<number[]>([]);
  /** True while autoplay or auto-scroll is running. */
  readonly isPlaying = signal<boolean>(false);
  /** Countdown seconds remaining until next slide. */
  readonly progressPercent = signal<number>(0);
  /** Elapsed fraction 0→1 within the current autoplay cycle. Drives progress arc. */
  readonly progressFraction = signal<number>(0);

  // ── Services / cleanup ────────────────────────────────────────────────────
  private readonly pluginService = inject(CarouselPluginService);
  private _countdownInterval: ReturnType<typeof setInterval> | null = null;

  // ── Directive ref ─────────────────────────────────────────────────────────
  protected readonly emblaDir = viewChild.required(EmblaCarouselDirective);

  // Static — subscribe to these Embla events for signal updates
  protected readonly emblaEvents: EmblaEventType[] = ['init', 'select', 'reInit', 'scroll'];

  // ── Computed Embla options from individual inputs ─────────────────────────
  protected readonly emblaOptions: Signal<EmblaOptionsType> = computed<EmblaOptionsType>(() => ({
    axis: this.orientation() === 'vertical' ? 'y' : 'x',
    align: this.align(),
    loop: this.loop(),
    dragFree: this.dragFree(),
    dragThreshold: this.dragThreshold(),
    slidesToScroll: this.slidesToScroll(),
    containScroll: this.containScroll(),
    direction: this.direction(),
    duration: this.duration(),
    startIndex: this.startIndex(),
    active: this.active(),
    watchDrag: this.watchDrag(),
    skipSnaps: this.skipSnaps(),
    inViewThreshold: this.inViewThreshold(),
    breakpoints: this.breakpoints(),
  }));

  // ── Plugin config — consolidated snapshot of all plugin inputs ─────────────
  private readonly pluginConfig = computed<CarouselPluginConfig>(() => ({
    autoplay: this.autoplay(),
    autoplayDelay: this.autoplayDelay(),
    autoplayStopOnInteraction: this.autoplayStopOnInteraction(),
    autoplayStopOnMouseEnter: this.autoplayStopOnMouseEnter(),
    autoplayStopOnLastSnap: this.autoplayStopOnLastSnap(),
    autoScroll: this.autoScroll(),
    autoScrollSpeed: this.autoScrollSpeed(),
    autoScrollDirection: this.autoScrollDirection(),
    autoScrollStopOnInteraction: this.autoScrollStopOnInteraction(),
    autoHeight: this.autoHeight(),
    transition: this.transition(),
    classNames: this.classNames(),
    classNameSnapped: this.classNameSnapped(),
    classNameInView: this.classNameInView(),
    classNameDraggable: this.classNameDraggable(),
    classNamePointerDown: this.classNamePointerDown(),
    wheelGestures: this.wheelGestures(),
    wheelForceAxis: this.wheelForceAxis(),
  }));

  // ── Built + consumer plugins merged ───────────────────────────────────────
  protected readonly emblaPlugins: Signal<EmblaPluginType[]> = computed<EmblaPluginType[]>(() => [
    ...this.pluginService.builtPlugins(),
    ...this.plugins(),
  ]);

  protected readonly computedClass = computed(() => cn(carouselVariants(), this.class()));

  /** Slide-area wrapper class — relative positioning context for built-in buttons/dots,
   *  scoped to the slide viewport height (excludes thumb strips). */
  protected readonly slideAreaClass = computed(() =>
    this.orientation() === 'vertical' ? 'relative h-full' : 'relative',
  );

  constructor() {
    // Rebuild plugin instances whenever plugin inputs change.
    effect(() => {
      this.pluginService.load(this.pluginConfig());
    });

    // Clean up on destroy.
    inject(DestroyRef).onDestroy(() => {
      this._stopCountdown();
    });
  }

  // ── Event handler ─────────────────────────────────────────────────────────
  protected onEmblaChange(event: EmblaEventType): void {
    const api = this.emblaDir().emblaApi;
    if (!api) return;

    if (event === 'init' || event === 'reInit') {
      this.slideCount.set(api.slideNodes().length);
      this.scrollSnaps.set(api.scrollSnapList());
      this.emblaInited.emit(api);
      this._syncIsPlaying(api);
      if (this.autoplay()) {
        this._startCountdown();
      }
    }

    if (event === 'init' || event === 'select' || event === 'reInit' || event === 'scroll') {
      this.selectedIndex.set(api.selectedScrollSnap());
      this.canScrollPrev.set(api.canScrollPrev());
      this.canScrollNext.set(api.canScrollNext());
    }

    if (event === 'select') {
      this.slideSelected.emit(api.selectedScrollSnap());
      // Reset countdown on slide change
      if (this.autoplay() && this.isPlaying()) {
        this._startCountdown();
      }
    }
  }

  // ── Public methods ────────────────────────────────────────────────────────
  prev(): void {
    this.emblaDir().scrollPrev();
  }

  next(): void {
    this.emblaDir().scrollNext();
  }

  goTo(index: number, jump = false): void {
    this.emblaDir().scrollTo(index, jump);
  }

  play(): void {
    const api = this.emblaDir().emblaApi;
    if (!api) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = api.plugins() as any;
    p?.autoplay?.play();
    p?.autoScroll?.play();
    this.isPlaying.set(true);
    this._resumeCountdown();
  }

  pause(): void {
    const api = this.emblaDir().emblaApi;
    if (!api) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = api.plugins() as any;
    p?.autoplay?.stop();
    p?.autoScroll?.stop();
    this.isPlaying.set(false);
    this._stopCountdown();
  }

  // ── Keyboard navigation ───────────────────────────────────────────────────
  protected onKeyDown(event: KeyboardEvent): void {
    if (this.orientation() === 'horizontal') {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.prev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.next();
      }
    } else {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.prev();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.next();
      }
    }
  }

  // ── Hover-pause / resume ────────────────────────────────────────────────────
  protected onMouseEnter(): void {
    if (!this.autoplay() || !this.isPlaying()) return;
    this.pause();
  }

  protected onMouseLeave(): void {
    if (!this.autoplay()) return;
    this.play();
  }

  // ── Private helpers ───────────────────────────────────────────────────────
  private _syncIsPlaying(api: EmblaCarouselType): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = api.plugins() as any;
    const playing = p?.autoplay?.isPlaying?.() ?? p?.autoScroll?.isPlaying?.() ?? false;
    this.isPlaying.set(playing);
  }

  /** Start polling the autoplay plugin's timeUntilNext() to derive countdown + arc.
   *  Polls at 50ms for smooth arc animation. */
  private _startCountdown(): void {
    this._stopCountdown();
    this.progressFraction.set(0);
    this._pollCountdown();
    this._countdownInterval = setInterval(() => this._pollCountdown(), 50);
  }

  /** Resume polling (same as start — reads from plugin so always in sync). */
  private _resumeCountdown(): void {
    this._startCountdown();
  }

  private _pollCountdown(): void {
    const api = this.emblaDir().emblaApi;
    if (!api) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const autoplay = (api.plugins() as any)?.autoplay;
    if (!autoplay) return;
    const timeLeft = autoplay.timeUntilNext?.() as number | null;
    const delay = this.autoplayDelay();
    if (timeLeft != null && timeLeft > 0) {
      this.progressPercent.set(Math.ceil(timeLeft / 1000));
      this.progressFraction.set(Math.max(0, Math.min(1, (delay - timeLeft) / delay)));
    }
  }

  private _stopCountdown(): void {
    if (this._countdownInterval !== null) {
      clearInterval(this._countdownInterval);
      this._countdownInterval = null;
    }
  }
}

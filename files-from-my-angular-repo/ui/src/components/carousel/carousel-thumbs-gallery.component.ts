import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import type { Signal } from '@angular/core';
import {
  CAROUSEL_TOKEN,
  type CarouselApi,
  type CarouselDotsVariant,
  type CarouselNavShape,
  type CarouselNavVariant,
} from './carousel.types';

// ─── ThumbsGalleryComponent ────────────────────────────────────────────────────
// Headless state provider for standalone thumbnail strips.
// Satisfies CAROUSEL_TOKEN without Embla or a slide viewport.
//
// Usage:
//   <ui-thumbs-gallery [count]="images.length" [loop]="true" (selectionChange)="open($event)">
//     <ui-carousel-thumbs type="modern" [arrows]="true">
//       @for (img of images; track img; let i = $index) {
//         <ui-carousel-thumb-item [index]="i"><img [src]="img.thumb"/></ui-carousel-thumb-item>
//       }
//     </ui-carousel-thumbs>
//   </ui-thumbs-gallery>

@Component({
  selector: 'ui-thumbs-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: CAROUSEL_TOKEN, useExisting: forwardRef(() => ThumbsGalleryComponent) }],
  host: { class: 'block' },
  template: `<ng-content />`,
})
export class ThumbsGalleryComponent implements CarouselApi {
  /** Total number of thumbnail items — drives prev/next disabled state. */
  readonly count = input.required<number>();
  /** Whether navigation wraps from last back to first. */
  readonly loop = input<boolean>(false);

  /** Fires whenever the selected index changes (thumb click or arrow press). */
  readonly selectionChange = output<number>();

  // ── CarouselApi ────────────────────────────────────────────────────────
  readonly selectedIndex = signal<number>(0);
  readonly slideCount: Signal<number> = computed(() => this.count());
  readonly canScrollPrev: Signal<boolean> = computed(() => this.loop() || this.selectedIndex() > 0);
  readonly canScrollNext: Signal<boolean> = computed(() => this.loop() || this.selectedIndex() < this.count() - 1);
  readonly scrollSnaps: Signal<number[]> = computed(() => Array.from({ length: this.count() }, (_, i) => i));
  // Not used by thumbs components — satisfy the interface only.
  readonly isPlaying = signal<boolean>(false);
  readonly progressPercent = signal<number>(0);
  readonly progressFraction = signal<number>(0);
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  readonly autoplayDelay = signal<number>(0);
  readonly navVariant = signal<CarouselNavVariant>('default');
  readonly navShape = signal<CarouselNavShape>('circle');
  readonly dotsVariant = signal<CarouselDotsVariant>('dark');

  prev(): void {
    const n = this.count();
    const cur = this.selectedIndex();
    this._select(this.loop() ? (cur - 1 + n) % n : Math.max(0, cur - 1));
  }

  next(): void {
    const n = this.count();
    const cur = this.selectedIndex();
    this._select(this.loop() ? (cur + 1) % n : Math.min(n - 1, cur + 1));
  }

  goTo(index: number): void {
    this._select(index);
  }

  play(): void {}
  pause(): void {}

  private _select(index: number): void {
    this.selectedIndex.set(index);
    this.selectionChange.emit(index);
  }
}

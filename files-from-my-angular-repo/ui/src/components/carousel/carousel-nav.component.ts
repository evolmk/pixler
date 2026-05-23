import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import type { ClassValue } from 'clsx';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-angular';
import { cn } from '../../utils/cn';
import { IconComponent } from '../icon/icon.component';
import { CAROUSEL_TOKEN, navBtnClass } from './carousel.types';

// ─── Prev ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-carousel-prev',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [IconComponent],
  host: { '[class]': 'computedClass()' },
  template: `
    <button
      type="button"
      [class]="btnClass()"
      [disabled]="!carousel.canScrollPrev()"
      (click)="carousel.prev()"
      aria-label="Previous slide"
    >
      @if (carousel.orientation() === 'vertical') {
        <ui-icon [name]="ChevronUpIcon" size="sm" />
      } @else {
        <ui-icon [name]="ChevronLeftIcon" size="sm" />
      }
    </button>
  `,
})
export class CarouselPrevComponent {
  readonly class = input<ClassValue>('');

  protected readonly carousel = inject(CAROUSEL_TOKEN);

  protected readonly ChevronLeftIcon = ChevronLeft;
  protected readonly ChevronUpIcon = ChevronUp;
  protected readonly btnClass = computed(() => navBtnClass(this.carousel.navVariant(), this.carousel.navShape()));

  protected readonly computedClass = computed(() => {
    const isVertical = this.carousel.orientation() === 'vertical';
    return cn(
      'absolute z-10',
      isVertical ? 'top-2 left-1/2 -translate-x-1/2' : 'left-2 top-1/2 -translate-y-1/2',
      this.class(),
    );
  });
}

// ─── Next ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-carousel-next',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [IconComponent],
  host: { '[class]': 'computedClass()' },
  template: `
    <button
      type="button"
      [class]="btnClass()"
      [disabled]="!carousel.canScrollNext()"
      (click)="carousel.next()"
      aria-label="Next slide"
    >
      @if (carousel.orientation() === 'vertical') {
        <ui-icon [name]="ChevronDownIcon" size="sm" />
      } @else {
        <ui-icon [name]="ChevronRightIcon" size="sm" />
      }
    </button>
  `,
})
export class CarouselNextComponent {
  readonly class = input<ClassValue>('');

  protected readonly carousel = inject(CAROUSEL_TOKEN);

  protected readonly ChevronRightIcon = ChevronRight;
  protected readonly ChevronDownIcon = ChevronDown;
  protected readonly btnClass = computed(() => navBtnClass(this.carousel.navVariant(), this.carousel.navShape()));

  protected readonly computedClass = computed(() => {
    const isVertical = this.carousel.orientation() === 'vertical';
    return cn(
      'absolute z-10',
      isVertical ? 'bottom-2 left-1/2 -translate-x-1/2' : 'right-2 top-1/2 -translate-y-1/2',
      this.class(),
    );
  });
}

// ─── Dots ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-carousel-dots',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    @for (snap of carousel.scrollSnaps(); track snap; let i = $index) {
      <button
        type="button"
        [class]="dotClass(i)"
        (click)="carousel.goTo(i)"
        [attr.aria-label]="'Go to slide ' + (i + 1)"
        [attr.aria-current]="carousel.selectedIndex() === i ? 'true' : null"
      ></button>
    }
  `,
})
export class CarouselDotsComponent {
  readonly class = input<ClassValue>('');

  protected readonly carousel = inject(CAROUSEL_TOKEN);

  protected readonly computedClass = computed(() => {
    const isVertical = this.carousel.orientation() === 'vertical';
    return cn(
      'absolute z-10 flex gap-1.5',
      isVertical ? 'right-3 top-1/2 flex-col -translate-y-1/2' : 'bottom-3 left-1/2 -translate-x-1/2',
      this.class(),
    );
  });

  protected dotClass(index: number): string {
    const isActive = this.carousel.selectedIndex() === index;
    const isVertical = this.carousel.orientation() === 'vertical';
    const light = this.carousel.dotsVariant() === 'light';
    const activeBg = light ? 'bg-white' : 'bg-foreground';
    const inactiveBg = light ? 'bg-white/50' : 'bg-foreground/40';
    return cn(
      'cursor-pointer rounded-full transition-all',
      isVertical
        ? isActive
          ? `${activeBg} h-4 w-1.5`
          : `${inactiveBg} h-1.5 w-1.5`
        : isActive
          ? `${activeBg} w-4 h-1.5`
          : `${inactiveBg} w-1.5 h-1.5`,
    );
  }
}

// ─── Counter ──────────────────────────────────────────────────────────────────

export type CarouselCounterVariant = 'dark' | 'light';

@Component({
  selector: 'ui-carousel-counter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <span aria-live="polite" aria-atomic="true">
      {{ carousel.selectedIndex() + 1 }} / {{ carousel.slideCount() }}
    </span>
  `,
})
export class CarouselCounterComponent {
  readonly class = input<ClassValue>('');
  /** Color for the counter text. 'dark' = foreground (default), 'light' = white. */
  readonly variant = input<CarouselCounterVariant>('dark');

  protected readonly carousel = inject(CAROUSEL_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      'absolute bottom-3 right-3 z-10 text-xs tabular-nums font-medium',
      'px-1.5 py-0.5 rounded',
      this.variant() === 'light'
        ? 'text-white bg-black/30 backdrop-blur-sm'
        : 'text-foreground/80 bg-background/60 backdrop-blur-sm',
      this.class(),
    ),
  );
}

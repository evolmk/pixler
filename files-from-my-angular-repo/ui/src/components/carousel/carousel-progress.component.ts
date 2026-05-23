import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import type { ClassValue } from 'clsx';
import { cn } from '../../utils/cn';
import { CAROUSEL_TOKEN } from './carousel.types';

export type CarouselProgressSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<CarouselProgressSize, { px: number; stroke: number; fontSize: string }> = {
  sm: { px: 32, stroke: 3, fontSize: 'text-[9px]' },
  md: { px: 40, stroke: 3.5, fontSize: 'text-[11px]' },
  lg: { px: 48, stroke: 4, fontSize: 'text-xs' },
};

@Component({
  selector: 'ui-carousel-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <svg
      [attr.width]="cfg().px"
      [attr.height]="cfg().px"
      [attr.viewBox]="'0 0 ' + cfg().px + ' ' + cfg().px"
      role="progressbar"
      [attr.aria-valuenow]="carousel.progressPercent()"
      aria-valuemin="0"
      [attr.aria-valuemax]="maxSec()"
      aria-label="Autoplay countdown"
      style="display:block;"
    >
      <!-- Track ring (background) -->
      <circle
        [attr.cx]="center()"
        [attr.cy]="center()"
        [attr.r]="radius()"
        fill="none"
        class="stroke-foreground/15"
        [attr.stroke-width]="cfg().stroke"
      />
      <!-- Progress arc — grows from 0 to full circumference as time elapses -->
      <circle
        [attr.cx]="center()"
        [attr.cy]="center()"
        [attr.r]="radius()"
        fill="none"
        class="stroke-foreground/70"
        [attr.stroke-width]="cfg().stroke"
        stroke-linecap="round"
        [attr.stroke-dasharray]="circumference()"
        [attr.stroke-dashoffset]="dashOffset()"
        [attr.transform]="'rotate(-90 ' + center() + ' ' + center() + ')'"
      />
      <!-- Countdown number -->
      <text
        [attr.x]="center()"
        [attr.y]="center()"
        text-anchor="middle"
        dominant-baseline="central"
        [class]="'fill-foreground tabular-nums font-medium ' + cfg().fontSize"
      >
        {{ carousel.progressPercent() }}
      </text>
    </svg>
  `,
})
export class CarouselProgressComponent {
  readonly size = input<CarouselProgressSize>('md');
  readonly class = input<ClassValue>('');

  protected readonly carousel = inject(CAROUSEL_TOKEN);

  protected readonly cfg = computed(() => SIZE_MAP[this.size()]);
  protected readonly center = computed(() => this.cfg().px / 2);
  protected readonly radius = computed(() => (this.cfg().px - this.cfg().stroke * 2) / 2);
  protected readonly circumference = computed(() => 2 * Math.PI * this.radius());
  protected readonly maxSec = computed(() => Math.ceil(this.carousel.autoplayDelay() / 1000));

  /** offset = circumference * (1 - fraction). fraction=0 → full offset (empty), fraction=1 → 0 offset (full). */
  protected readonly dashOffset = computed(() => this.circumference() * (1 - this.carousel.progressFraction()));

  protected readonly computedClass = computed(() =>
    cn(
      'absolute bottom-4 left-4 z-10 select-none rounded-full bg-background/70 backdrop-blur-sm shadow-sm',
      this.class(),
    ),
  );
}

import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

/** Fixed gradient colors for each bar position (red → orange → yellow → green). */
const BAR_COLORS = [
  'bg-red-500',
  'bg-red-400',
  'bg-orange-400',
  'bg-amber-400',
  'bg-yellow-400',
  'bg-lime-500',
  'bg-green-500',
  'bg-green-600',
] as const;

const TOTAL_BARS = 8;

@Component({
  selector: 'ui-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': '"progressbar"',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
  },
  template: `
    <div class="flex items-center gap-[3px]">
      @for (bar of bars(); track bar.index) {
        <span class="w-2 h-4 rounded-[2px]" [class]="bar.filled ? bar.color : 'bg-muted-foreground/20'"></span>
      }
    </div>
    @if (showLabel()) {
      <span class="text-xs font-medium text-muted-foreground tabular-nums ml-2">{{ clampedValue() }}%</span>
    }
  `,
})
export class ProgressBarComponent {
  readonly value = input<number>(0);
  readonly showLabel = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly clampedValue = computed(() => Math.min(100, Math.max(0, Math.round(this.value()))));

  protected readonly filledCount = computed(() => Math.round(this.clampedValue() / 12.5));

  protected readonly bars = computed(() =>
    Array.from({ length: TOTAL_BARS }, (_, i) => ({
      index: i,
      filled: i < this.filledCount(),
      color: BAR_COLORS[i],
    })),
  );

  protected readonly hostClass = computed(() => cn('inline-flex items-center', this.class()));
}

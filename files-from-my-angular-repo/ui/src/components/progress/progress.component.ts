import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

type ProgressVariant = 'default' | 'destructive' | 'accent';
type ProgressSize = 'sm' | 'default' | 'lg';
type ProgressShape = 'default' | 'square' | 'pill';

const TRACK_VARIANT: Record<ProgressVariant, string> = {
  default: 'bg-secondary',
  destructive: 'bg-destructive/20',
  accent: 'bg-accent',
};

const FILL_VARIANT: Record<ProgressVariant, string> = {
  default: 'bg-primary',
  destructive: 'bg-destructive',
  accent: 'bg-primary',
};

const TRACK_SIZE: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  default: 'h-4',
  lg: 'h-6',
};

const TRACK_SHAPE: Record<ProgressShape, string> = {
  default: 'rounded-full',
  square: 'rounded-none',
  pill: 'rounded-full',
};

@Component({
  selector: 'ui-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"progressbar"',
    '[attr.aria-valuenow]': 'indeterminate() ? null : value()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'indeterminate() ? null : max()',
    '[attr.aria-valuetext]': 'indeterminate() ? "Loading…" : null',
  },
  template: `
    <div
      [class]="fillClass()"
      [style]="indeterminate() ? null : ('transform: translateX(-' + fillOffset() + '%)')"
    ></div>
  `,
})
export class ProgressComponent {
  readonly value = input<number | null>(0);
  readonly max = input<number>(100);
  readonly variant = input<ProgressVariant>('default');
  readonly size = input<ProgressSize>('default');
  readonly shape = input<ProgressShape>('default');
  readonly indeterminate = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'relative w-full overflow-hidden',
      TRACK_SIZE[this.size()],
      TRACK_SHAPE[this.shape()],
      TRACK_VARIANT[this.variant()],
      this.class(),
    ),
  );

  protected readonly fillClass = computed(() =>
    cn(
      'h-full w-full flex-1 transition-all',
      FILL_VARIANT[this.variant()],
      this.indeterminate() ? 'animate-[progress-indeterminate_1.5s_ease-in-out_infinite]' : '',
    ),
  );

  protected readonly fillOffset = computed(() => {
    const v = this.value();
    const m = this.max();
    if (v === null || v === undefined) return 100;
    return 100 - Math.min(100, Math.max(0, (v / m) * 100));
  });
}

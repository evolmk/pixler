import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

type IndicatorShape = 'circle' | 'square' | 'line';
type IndicatorSize = 'sm' | 'default' | 'lg';

const DOT_SIZE: Record<IndicatorSize, string> = {
  sm: 'h-2 w-2',
  default: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
};

const DOT_SHAPE: Record<IndicatorShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-none',
  line: 'h-0.5 w-4 rounded-full',
};

const TEXT_SIZE: Record<IndicatorSize, string> = {
  sm: 'text-xs',
  default: 'text-sm',
  lg: 'text-base',
};

@Component({
  selector: 'ui-legend-indicator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <span [class]="dotClass()" [style.background]="color()"></span>
    <span [class]="textClass()"><ng-content /></span>
  `,
})
export class LegendIndicatorComponent {
  readonly color = input<string>('currentColor');
  readonly shape = input<IndicatorShape>('circle');
  readonly size = input<IndicatorSize>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center gap-1.5', this.class()),
  );

  protected readonly dotClass = computed(() =>
    cn(
      'inline-block shrink-0',
      this.shape() === 'line' ? DOT_SHAPE['line'] : DOT_SIZE[this.size()],
      this.shape() !== 'line' ? DOT_SHAPE[this.shape()] : '',
    ),
  );

  protected readonly textClass = computed(() => TEXT_SIZE[this.size()]);
}

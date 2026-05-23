import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { BadgeComponent } from '../../../components/badge/badge.component';
import type { BadgeVariants } from '../../../components/badge/badge.variants';
import { cn } from '../../../utils/cn';
import { TableDataStatusColor } from '../types/column.types';

const COLOR_TO_VARIANT: Record<TableDataStatusColor, BadgeVariants['variant']> = {
  green: 'success',
  blue: 'info',
  orange: 'warning',
  red: 'destructive',
  gray: 'secondary',
};

@Component({
  selector: 'ui-cell-status-pill',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BadgeComponent],
  host: { '[class]': 'computedClass()' },
  template: `
    <ui-badge [variant]="badgeVariant()" shape="pill">
      {{ label() }}
    </ui-badge>
  `,
})
export class CellStatusPillComponent {
  readonly label = input.required<string>();
  readonly color = input<TableDataStatusColor>('blue');
  readonly class = input<string>('');

  protected readonly badgeVariant = computed(() => COLOR_TO_VARIANT[this.color()]);

  protected readonly computedClass = computed(() => cn('inline-flex', this.class()));
}

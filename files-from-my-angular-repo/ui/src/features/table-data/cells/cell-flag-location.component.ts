import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { cn } from '../../../utils/cn';

@Component({
  selector: 'ui-cell-flag-location',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <span class="leading-none" aria-hidden="true">{{ flag() }}</span>
    <span class="text-foreground">{{ location() }}</span>
  `,
})
export class CellFlagLocationComponent {
  readonly flag = input.required<string>();
  readonly location = input.required<string>();
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('flex items-center gap-1.5', this.class()));
}

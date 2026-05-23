import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { cn } from '../../../utils/cn';

@Component({
  selector: 'ui-cell-company',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <div class="min-w-0 flex-1">
      <p class="truncate font-semibold text-primary hover:underline">{{ name() }}</p>
      @if (description()) {
        <p class="truncate text-xs text-muted-foreground">{{ description() }}</p>
      }
    </div>
  `,
})
export class CellCompanyComponent {
  readonly name = input.required<string>();
  readonly description = input<string>('');
  readonly avatarSrc = input<string | null>(null);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('flex items-center gap-3', this.class()));
}

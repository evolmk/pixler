import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

@Component({
  selector: 'ui-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': 'orientation()',
  },
  template: ``,
})
export class SeparatorComponent {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly decorative = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'shrink-0 bg-border',
      this.orientation() === 'horizontal' ? 'block h-px w-full' : 'inline-block h-full w-px',
      this.class(),
    ),
  );
}

import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

type KbdSize = 'sm' | 'default' | 'lg';

const SIZE_CLASS: Record<KbdSize, string> = {
  sm: 'px-1 py-0.5 text-[10px]',
  default: 'px-1.5 py-1 text-xs',
  lg: 'px-2 py-1.5 text-sm',
};

@Component({
  selector: 'ui-kbd, kbd[uiKbd]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class KbdComponent {
  readonly size = input<KbdSize>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex items-center justify-center rounded border border-border bg-muted',
      'font-mono font-medium text-muted-foreground',
      SIZE_CLASS[this.size()],
      this.class(),
    ),
  );
}

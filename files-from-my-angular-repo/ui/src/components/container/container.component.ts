import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

type ContainerSize = 'sm' | 'default' | 'lg' | 'xl' | 'full';

const SIZE_CLASS: Record<ContainerSize, string> = {
  sm: 'max-w-3xl',
  default: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

@Component({
  selector: 'ui-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class ContainerComponent {
  readonly size = input<ContainerSize>('default');
  readonly centered = input<boolean>(true);
  readonly padded = input<boolean>(true);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'w-full',
      SIZE_CLASS[this.size()],
      this.centered() ? 'mx-auto' : '',
      this.padded() ? 'px-4 sm:px-6 lg:px-8' : '',
      this.class(),
    ),
  );
}

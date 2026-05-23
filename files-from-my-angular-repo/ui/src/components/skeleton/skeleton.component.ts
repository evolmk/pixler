import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: ``,
})
export class SkeletonComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('animate-pulse rounded-md bg-primary/10', this.class()),
  );
}

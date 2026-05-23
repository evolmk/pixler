import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

@Component({
  selector: 'ui-aspect-ratio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[style.aspect-ratio]': 'ratio()',
  },
  template: `<ng-content />`,
})
export class AspectRatioComponent {
  /** e.g. 16/9, 4/3, 1 — pass a number like ratio="1.777" or [ratio]="16/9" */
  readonly ratio = input<number>(1);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('block w-full', this.class()));
}

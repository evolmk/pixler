import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { badgeVariants, type BadgeVariants } from './badge.variants';

@Component({
  selector: 'ui-badge, [uiBadge]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariants['variant']>('default');
  readonly dark = input<BadgeVariants['dark']>(false);
  readonly shape = input<BadgeVariants['shape']>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(badgeVariants({ variant: this.variant(), dark: this.dark(), shape: this.shape() }), this.class()),
  );
}

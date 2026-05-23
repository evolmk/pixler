import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

type DividerOrientation = 'horizontal' | 'vertical';
type DividerSpacing = 'none' | 'sm' | 'default' | 'lg';
type DividerVariant = 'solid' | 'dashed' | 'dotted';

const SPACING_H: Record<DividerSpacing, string> = {
  none: 'my-0',
  sm: 'my-2',
  default: 'my-4',
  lg: 'my-8',
};

const SPACING_V: Record<DividerSpacing, string> = {
  none: 'mx-0',
  sm: 'mx-2',
  default: 'mx-4',
  lg: 'mx-8',
};

const STYLE_CLASS: Record<DividerVariant, string> = {
  solid: '',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

@Component({
  selector: 'ui-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': 'orientation()',
  },
  template: `
    @if (label()) {
      <span class="px-3 text-xs text-muted-foreground whitespace-nowrap">{{ label() }}</span>
    }
  `,
})
export class DividerComponent {
  readonly orientation = input<DividerOrientation>('horizontal');
  readonly spacing = input<DividerSpacing>('default');
  readonly variant = input<DividerVariant>('solid');
  readonly label = input<string>('');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => {
    const horiz = this.orientation() === 'horizontal';
    return cn(
      'flex items-center border-border shrink-0',
      horiz
        ? cn('w-full border-t', SPACING_H[this.spacing()], this.label() ? 'gap-0' : '')
        : cn('h-full border-l self-stretch', SPACING_V[this.spacing()]),
      this.label() ? 'before:flex-1 before:border-t before:border-border after:flex-1 after:border-t after:border-border' : '',
      STYLE_CLASS[this.variant()],
      this.class(),
    );
  });
}

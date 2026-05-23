import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

type IconStyledVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'muted';

type IconStyledShape = 'square' | 'rounded' | 'circle';
type IconStyledSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl';

const VARIANT_CLASS: Record<IconStyledVariant, string> = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/20 text-secondary-foreground',
  destructive: 'bg-destructive/10 text-destructive',
  success: 'bg-green-500/10 text-green-600 dark:text-green-400',
  warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  muted: 'bg-muted/50 text-muted-foreground',
};

const SHAPE_CLASS: Record<IconStyledShape, string> = {
  square: 'rounded-none',
  rounded: 'rounded-lg',
  circle: 'rounded-full',
};

const SIZE_CLASS: Record<IconStyledSize, string> = {
  xs: 'h-6 w-6 [&_svg]:h-3 [&_svg]:w-3',
  sm: 'h-8 w-8 [&_svg]:h-4 [&_svg]:w-4',
  default: 'h-10 w-10 [&_svg]:h-5 [&_svg]:w-5',
  lg: 'h-12 w-12 [&_svg]:h-6 [&_svg]:w-6',
  xl: 'h-16 w-16 [&_svg]:h-8 [&_svg]:w-8',
};

@Component({
  selector: 'ui-icon-styled',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class IconStyledComponent {
  readonly variant = input<IconStyledVariant>('default');
  readonly shape = input<IconStyledShape>('rounded');
  readonly size = input<IconStyledSize>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex shrink-0 items-center justify-center',
      VARIANT_CLASS[this.variant()],
      SHAPE_CLASS[this.shape()],
      SIZE_CLASS[this.size()],
      this.class(),
    ),
  );
}

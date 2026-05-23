import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const alertVariants = cva(
  'block relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        success:
          'border-green-500/50 text-green-700 dark:text-green-400 dark:border-green-500 [&>svg]:text-green-500',
        warning:
          'border-yellow-500/50 text-yellow-700 dark:text-yellow-400 dark:border-yellow-500 [&>svg]:text-yellow-500',
        info: 'border-blue-500/50 text-blue-700 dark:text-blue-400 dark:border-blue-500 [&>svg]:text-blue-500',
        soft: 'border-transparent bg-muted text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export type AlertVariants = VariantProps<typeof alertVariants>;

@Component({
  selector: 'ui-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"alert"',
  },
  template: `<ng-content />`,
})
export class AlertComponent {
  readonly variant = input<AlertVariants['variant']>('default');
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn(alertVariants({ variant: this.variant() }), this.class()),
  );
}

@Component({
  selector: 'ui-alert-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class AlertTitleComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('block font-medium leading-none tracking-tight', this.class()),
  );
}

@Component({
  selector: 'ui-alert-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class AlertDescriptionComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('block text-sm [&_p]:leading-relaxed', this.class()),
  );
}

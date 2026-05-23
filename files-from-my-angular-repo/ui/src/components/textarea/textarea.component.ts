import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

type TextareaSize = 'sm' | 'default' | 'lg';
type TextareaStatus = 'default' | 'error' | 'warning' | 'success';

const TEXTAREA_SIZE: Record<TextareaSize, string> = {
  sm: 'min-h-[48px] px-2 py-1 text-xs',
  default: 'min-h-[60px] px-3 py-2',
  lg: 'min-h-[80px] px-4 py-3 text-base',
};

const TEXTAREA_STATUS: Record<TextareaStatus, string> = {
  default: 'border-input focus-visible:ring-ring',
  error: 'border-destructive focus-visible:ring-destructive',
  warning: 'border-yellow-500 focus-visible:ring-yellow-500',
  success: 'border-green-500 focus-visible:ring-green-500',
};

@Component({
  selector: 'textarea[uiTextarea]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: ``,
})
export class TextareaComponent {
  readonly size = input<TextareaSize>('default');
  readonly status = input<TextareaStatus>('default');
  readonly borderless = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex w-full rounded-md bg-transparent text-base',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'md:text-sm',
      TEXTAREA_SIZE[this.size()],
      this.borderless() ? 'border-0 shadow-none focus-visible:ring-0' : 'border',
      TEXTAREA_STATUS[this.status()],
      this.class(),
    ),
  );
}

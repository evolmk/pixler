import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { INPUT_GROUP_TOKEN } from '../input-group/input-group.component';
import { SpinnerComponent } from '../spinner/spinner.component';

type InputSize = 'sm' | 'default' | 'lg';
type InputStatus = 'default' | 'error' | 'warning' | 'success';

const INPUT_SIZE: Record<InputSize, string> = {
  sm: 'h-7 px-2 py-1 text-xs',
  default: 'h-9 px-3 py-1 text-base md:text-sm',
  lg: 'h-11 px-4 py-2 text-base',
};

const INPUT_STATUS: Record<InputStatus, string> = {
  default: 'border-input focus-visible:ring-ring',
  error: 'border-destructive focus-visible:ring-destructive',
  warning: 'border-yellow-500 focus-visible:ring-yellow-500',
  success: 'border-green-500 focus-visible:ring-green-500',
};

// ── Input wrapper — positions a trailing spinner inside the input border ──────

@Component({
  selector: 'ui-input-wrapper',
  standalone: true,
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <ng-content />
    @if (hint()) {
      <span class="pointer-events-none absolute right-2.5 top-1 text-[10px] leading-none text-muted-foreground">
        {{ hint() }}
      </span>
    }
    @if (loading()) {
      <ui-spinner
        size="sm"
        class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    }
  `,
})
export class InputWrapperComponent {
  readonly loading = input<boolean>(false);
  readonly hint = input<string>('');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('relative flex w-full', this.loading() ? '[&>input]:pr-9' : '', this.class()),
  );
}

// ── Input directive ───────────────────────────────────────────────────────────

@Component({
  selector: 'input[uiInput]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: ``,
})
export class InputComponent {
  readonly size = input<InputSize>('default');
  readonly status = input<InputStatus>('default');
  readonly borderless = input<boolean>(false);
  readonly class = input<string>('');

  private readonly _group = inject(INPUT_GROUP_TOKEN, { optional: true });

  protected readonly computedClass = computed(() => {
    const resolvedSize = this._group?.size() ?? this.size();
    return cn(
      'flex w-full rounded-md bg-transparent transition-colors',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      INPUT_SIZE[resolvedSize],
      this.borderless() ? 'border-0 shadow-none focus-visible:ring-0' : 'border',
      INPUT_STATUS[this.status()],
      this.class(),
    );
  });
}

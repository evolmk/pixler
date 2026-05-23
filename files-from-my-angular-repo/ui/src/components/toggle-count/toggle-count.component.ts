import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, model, output } from '@angular/core';
import { cn } from '../../utils/cn';

type ToggleCountSize = 'sm' | 'default' | 'lg';

const SIZE_BTN: Record<ToggleCountSize, string> = {
  sm: 'h-6 w-6 text-xs',
  default: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
};

const SIZE_DISPLAY: Record<ToggleCountSize, string> = {
  sm: 'min-w-6 px-1 text-xs',
  default: 'min-w-8 px-2 text-sm',
  lg: 'min-w-10 px-3 text-base',
};

@Component({
  selector: 'ui-toggle-count',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <button
      type="button"
      [class]="btnClass()"
      [disabled]="disabled() || value() <= min()"
      (click)="_decrement()"
      aria-label="Decrement"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 12h14" />
      </svg>
    </button>

    <span [class]="displayClass()">{{ value() }}</span>

    <button
      type="button"
      [class]="btnClass()"
      [disabled]="disabled() || value() >= max()"
      (click)="_increment()"
      aria-label="Increment"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </button>
  `,
})
export class ToggleCountComponent {
  readonly value = model<number>(0);
  readonly min = input<number>(0);
  readonly max = input<number>(Infinity);
  readonly step = input<number>(1);
  readonly size = input<ToggleCountSize>('default');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly countChange = output<number>();

  protected readonly computedClass = computed(() => cn('inline-flex items-center gap-1', this.class()));

  protected readonly btnClass = computed(() =>
    cn(
      'inline-flex items-center justify-center rounded-md border border-input',
      'bg-muted text-muted-foreground transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      SIZE_BTN[this.size()],
    ),
  );

  protected readonly displayClass = computed(() =>
    cn('inline-flex items-center justify-center rounded-md font-medium tabular-nums', SIZE_DISPLAY[this.size()]),
  );

  protected _increment(): void {
    const next = Math.min(this.max(), this.value() + this.step());
    this.value.set(next);
    this.countChange.emit(next);
  }

  protected _decrement(): void {
    const next = Math.max(this.min(), this.value() - this.step());
    this.value.set(next);
    this.countChange.emit(next);
  }
}

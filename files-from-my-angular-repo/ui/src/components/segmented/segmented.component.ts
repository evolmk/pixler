import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

export interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type SegmentedSize = 'sm' | 'default' | 'lg';

const SIZE_CLASS: Record<SegmentedSize, string> = {
  sm: 'h-7 px-2 text-xs',
  default: 'h-9 px-3 text-sm',
  lg: 'h-11 px-4 text-base',
};

@Component({
  selector: 'ui-segmented',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"radiogroup"',
  },
  template: `
    @for (opt of options(); track opt.value) {
      <button
        type="button"
        role="radio"
        [attr.aria-checked]="value() === opt.value"
        [attr.aria-label]="opt.label"
        [disabled]="_disabled() || opt.disabled"
        [class]="itemClass(opt.value)"
        (click)="_select(opt.value)"
      >
        {{ opt.label }}
      </button>
    }
  `,
})
export class SegmentedComponent implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly options = input.required<SegmentedOption[]>();
  readonly size = input<SegmentedSize>('default');
  readonly class = input<string>('');

  protected readonly _disabled = signal(false);

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center rounded-lg bg-muted p-0.5 gap-0.5', this.class()),
  );

  protected itemClass(val: string): string {
    return cn(
      'inline-flex items-center justify-center rounded-md font-medium transition-all cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      this.value() === val ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground',
      SIZE_CLASS[this.size()],
    );
  }

  protected _select(val: string): void {
    if (this._disabled()) return;
    this.value.set(val);
    this._onChange(val);
    this._onTouched();
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}

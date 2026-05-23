import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

type InputNumberSize = 'sm' | 'default' | 'lg';
type InputNumberMode = 'default' | 'stepper';

const SIZE_HEIGHT: Record<InputNumberSize, string> = {
  sm: 'h-7',
  default: 'h-9',
  lg: 'h-11',
};

const SIZE_TEXT: Record<InputNumberSize, string> = {
  sm: 'text-xs',
  default: 'text-sm',
  lg: 'text-base',
};

const SIZE_BTN: Record<InputNumberSize, string> = {
  sm: 'h-5 w-5',
  default: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const SIZE_ICON: Record<InputNumberSize, string> = {
  sm: 'h-2 w-2',
  default: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
};

@Component({
  selector: 'ui-input-number',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
  ],
  host: { '[class]': 'hostClass()' },
  template: `
    @if (mode() === 'stepper') {
      <!-- Stepper mode: input with [–][+] on the right -->
      <div [class]="stepperContainerClass()">
        <input
          type="number"
          [value]="_displayValue()"
          [min]="min()"
          [max]="max()"
          [step]="step()"
          [disabled]="_disabled()"
          [class]="stepperInputClass()"
          [style.width]="inputWidth()"
          (input)="_onInput($event)"
          (blur)="_handleBlur()"
          (keydown.arrowup)="$event.preventDefault(); _increment()"
          (keydown.arrowdown)="$event.preventDefault(); _decrement()"
        />

        <div class="flex shrink-0 items-center gap-1 pr-1.5">
          <button
            type="button"
            [class]="stepperBtnClass()"
            [disabled]="_disabled() || _displayValue() <= min()"
            (click)="_decrement()"
            aria-label="Decrement"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              [class]="iconClass()"
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

          <button
            type="button"
            [class]="stepperBtnClass()"
            [disabled]="_disabled() || _displayValue() >= max()"
            (click)="_increment()"
            aria-label="Increment"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              [class]="iconClass()"
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
        </div>
      </div>
    } @else {
      <!-- Default mode: (–) value (+) -->
      <div [class]="defaultWrapperClass()">
        <button
          type="button"
          [class]="defaultBtnClass()"
          [disabled]="_disabled() || _displayValue() <= min()"
          (click)="_decrement()"
          aria-label="Decrement"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            [class]="iconClass()"
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

        <input
          type="number"
          [value]="_displayValue()"
          [min]="min()"
          [max]="max()"
          [step]="step()"
          [disabled]="_disabled()"
          [class]="defaultInputClass()"
          [style.width]="inputWidth()"
          (input)="_onInput($event)"
          (blur)="_handleBlur()"
          (keydown.arrowup)="$event.preventDefault(); _increment()"
          (keydown.arrowdown)="$event.preventDefault(); _decrement()"
        />

        <button
          type="button"
          [class]="defaultBtnClass()"
          [disabled]="_disabled() || _displayValue() >= max()"
          (click)="_increment()"
          aria-label="Increment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            [class]="iconClass()"
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
      </div>
    }
  `,
})
export class InputNumberComponent implements ControlValueAccessor {
  readonly value = model<number>(0);
  readonly min = input<number>(-Infinity);
  readonly max = input<number>(Infinity);
  readonly step = input<number>(1);
  readonly size = input<InputNumberSize>('default');
  readonly mode = input<InputNumberMode>('default');
  /** Default mode only: when true, removes the outer bg/border frame for inline contexts. */
  readonly bare = input<boolean>(false);
  readonly class = input<string>('');
  /** Max decimal places allowed when typing. Step-based rounding only applies to +/- buttons. */
  readonly maxDecimals = input<number | undefined>(undefined);
  /**
   * Debounce outward `valueChange` / `ngModel` emissions by N ms while
   * keeping the displayed value updating instantly. Useful for coalescing
   * rapid +/- clicks or keystrokes into a single emission. Default `0`
   * (no debounce — every change emits immediately).
   *
   * Pending changes are flushed immediately on blur.
   */
  readonly debounce = input<number>(0);

  protected readonly hostClass = computed(() => (this.mode() === 'stepper' ? 'flex w-full' : 'inline-flex'));

  protected readonly _disabled = signal(false);
  /** Instant local mirror used by the template — updated synchronously on every change. */
  protected readonly _displayValue = signal<number>(0);

  private _emitTimer: ReturnType<typeof setTimeout> | null = null;
  private _onChange: (v: number) => void = () => {};
  protected _onTouched: () => void = () => {};

  constructor() {
    // Sync external `value` changes (parent updates, ngModel writeValue) into
    // `_displayValue`, but never overwrite while the user has uncommitted
    // edits pending in the debounce timer.
    effect(() => {
      const v = this.value();
      if (this._emitTimer) return;
      if (untracked(() => this._displayValue()) !== v) {
        this._displayValue.set(v);
      }
    });
  }

  /**
   * Minimum character width for the default-mode input based on step precision:
   * integer steps → 2 chars, 1 decimal → 3 chars, 2+ decimals → 4 chars.
   * Prevents the layout from jumping as values cross digit boundaries.
   */
  private readonly _minInputChars = computed(() => {
    const precision = this._stepPrecision(this.step());
    if (precision === 0) return 2;
    if (precision === 1) return 3;
    return 4;
  });

  /** Width based on digit count — minimum driven by step precision, plus padding for comfort. */
  protected readonly inputWidth = computed(() => {
    if (this.mode() === 'stepper') {
      const digits = Math.max(4, String(this._displayValue()).length);
      return `${digits + 2}ch`;
    }
    const digits = Math.max(this._minInputChars(), String(this._displayValue()).length);
    return `${digits + 1.5}ch`;
  });

  protected readonly iconClass = computed(() => SIZE_ICON[this.size()]);

  /** Stepper mode — shared rounded border wrapping everything */
  protected readonly stepperContainerClass = computed(() =>
    cn(
      'inline-flex items-center rounded-lg border border-input bg-background',
      'has-[input:focus]:ring-1 has-[input:focus]:ring-ring',
      'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
      SIZE_HEIGHT[this.size()],
      this.class(),
    ),
  );

  /** Stepper mode — input sits on the left, grows to fill */
  protected readonly stepperInputClass = computed(() =>
    cn(
      'min-w-0 flex-1 bg-transparent px-3 text-foreground',
      'focus:outline-none',
      'disabled:cursor-not-allowed',
      '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
      SIZE_TEXT[this.size()],
    ),
  );

  /** Stepper mode — rounded buttons inside the container on the right */
  protected readonly stepperBtnClass = computed(() =>
    cn(
      'inline-flex shrink-0 items-center justify-center rounded-md',
      'bg-muted/60 text-muted-foreground transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'active:bg-muted-foreground/20 dark:active:bg-muted-foreground/30',
      'cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      SIZE_BTN[this.size()],
    ),
  );

  /** Default mode — outer rounded frame (hidden when bare) */
  protected readonly defaultWrapperClass = computed(() =>
    cn(
      'inline-flex items-center gap-1',
      !this.bare() && [
        'rounded-lg border border-input bg-background px-1',
        SIZE_HEIGHT[this.size()],
        'has-[input:focus]:ring-1 has-[input:focus]:ring-ring',
        'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
      ],
      this.class(),
    ),
  );

  /** Default mode — input centered between buttons */
  protected readonly defaultInputClass = computed(() =>
    cn(
      'min-w-0 bg-transparent text-center text-foreground',
      'focus:outline-none',
      'disabled:cursor-not-allowed',
      '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
      SIZE_TEXT[this.size()],
    ),
  );

  /** Default mode — rounded buttons: subtle accent fill, no border, slight darken on hover. */
  protected readonly defaultBtnClass = computed(() =>
    cn(
      'inline-flex shrink-0 items-center justify-center rounded-md',
      'text-muted-foreground transition-colors',
      this.bare()
        ? 'border border-transparent hover:border-input hover:bg-muted hover:text-foreground'
        : 'bg-muted hover:bg-muted-foreground/15 hover:text-foreground',
      'active:bg-muted-foreground/25 dark:active:bg-muted-foreground/30',
      'cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      SIZE_BTN[this.size()],
    ),
  );

  protected _increment(): void {
    if (this._disabled()) return;
    const s = this.step();
    const raw = this._displayValue() + s;
    const precision = this._stepPrecision(s);
    const next = Math.min(this.max(), Number(raw.toFixed(precision)));
    this._commit(next);
  }

  protected _decrement(): void {
    if (this._disabled()) return;
    const s = this.step();
    const raw = this._displayValue() - s;
    const precision = this._stepPrecision(s);
    const next = Math.max(this.min(), Number(raw.toFixed(precision)));
    this._commit(next);
  }

  /** Count actual decimal places in the step value (e.g. 0.25 → 2, 0.1 → 1, 1 → 0). */
  private _stepPrecision(step: number): number {
    if (step >= 1) return 0;
    const str = step.toString();
    const dotIndex = str.indexOf('.');
    return dotIndex < 0 ? 0 : str.length - dotIndex - 1;
  }

  protected _onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).valueAsNumber;
    if (!isNaN(raw)) {
      const md = this.maxDecimals();
      // When maxDecimals is set, only clamp to range — no step-based rounding on typed input
      const value = md !== undefined ? Number(raw.toFixed(md)) : raw;
      const clamped = Math.max(this.min(), Math.min(this.max(), value));
      this._commit(clamped);
    }
  }

  /** Updates the displayed value instantly; debounces outward emission when `debounce > 0`. */
  private _commit(next: number): void {
    this._displayValue.set(next);
    if (this._emitTimer) {
      clearTimeout(this._emitTimer);
      this._emitTimer = null;
    }
    const ms = this.debounce();
    if (ms > 0) {
      this._emitTimer = setTimeout(() => {
        this._emitTimer = null;
        this.value.set(next);
        this._onChange(next);
      }, ms);
    } else {
      this.value.set(next);
      this._onChange(next);
    }
  }

  /** Flush pending debounce immediately on blur, then mark as touched. */
  protected _handleBlur(): void {
    if (this._emitTimer) {
      clearTimeout(this._emitTimer);
      this._emitTimer = null;
      const next = this._displayValue();
      this.value.set(next);
      this._onChange(next);
    }
    this._onTouched();
  }

  writeValue(value: number): void {
    const v = value ?? 0;
    if (this._emitTimer) {
      clearTimeout(this._emitTimer);
      this._emitTimer = null;
    }
    this._displayValue.set(v);
    this.value.set(v);
  }

  registerOnChange(fn: (v: number) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}

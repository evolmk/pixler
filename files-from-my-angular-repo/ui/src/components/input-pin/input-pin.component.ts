import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  model,
  signal,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

type InputPinType = 'text' | 'number' | 'password';
type InputPinSize = 'sm' | 'default' | 'lg';

const CELL_SIZE: Record<InputPinSize, string> = {
  sm: 'h-8 w-8 text-sm',
  default: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
};

@Component({
  selector: 'ui-input-pin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPinComponent),
      multi: true,
    },
  ],
  host: { '[class]': '"flex gap-2"' },
  template: `
    @for (cell of cells(); track $index) {
      <input
        #cellInput
        [type]="type() === 'number' ? 'text' : type()"
        [attr.inputmode]="type() === 'number' ? 'numeric' : 'text'"
        maxlength="1"
        [value]="cell"
        [disabled]="_disabled()"
        [class]="cellClass()"
        [attr.aria-label]="'PIN digit ' + ($index + 1)"
        (input)="_onCellInput($event, $index)"
        (keydown)="_onCellKeydown($event, $index)"
        (paste)="_onPaste($event)"
        (focus)="_onCellFocus($index)"
        (blur)="_onTouched()"
      />
    }
  `,
})
export class InputPinComponent implements ControlValueAccessor {
  readonly length = input<number>(4);
  readonly type = input<InputPinType>('text');
  readonly size = input<InputPinSize>('default');
  readonly placeholder = input<string>('○');
  readonly class = input<string>('');

  /** Two-way binding for the full PIN string */
  readonly value = model<string>('');

  protected readonly _disabled = signal(false);

  protected readonly cells = computed(() => {
    const val = this.value();
    return Array.from({ length: this.length() }, (_, i) => val[i] ?? '');
  });

  protected readonly cellClass = computed(() =>
    cn(
      'rounded-md border border-input bg-background text-center font-mono text-foreground',
      'transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      CELL_SIZE[this.size()],
      this.class(),
    ),
  );

  private _onChange: (v: string) => void = () => {};
  protected _onTouched: () => void = () => {};

  private readonly _cellInputs = viewChildren<ElementRef<HTMLInputElement>>('cellInput');

  protected _onCellInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const char = input.value.slice(-1);

    if (this.type() === 'number' && !/^\d$/.test(char)) {
      input.value = this.cells()[index];
      return;
    }

    const arr = this.cells().slice();
    arr[index] = char;
    const next = arr.join('');
    this.value.set(next);
    this._onChange(next);

    if (char && index < this.length() - 1) {
      this._focusCell(index + 1);
    }
  }

  protected _onCellKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      const arr = this.cells().slice();
      if (arr[index]) {
        arr[index] = '';
        const next = arr.join('');
        this.value.set(next);
        this._onChange(next);
      } else if (index > 0) {
        this._focusCell(index - 1);
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this._focusCell(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.length() - 1) {
      this._focusCell(index + 1);
    }
  }

  protected _onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') ?? '').slice(0, this.length()).split('');
    const arr = Array.from({ length: this.length() }, (_, i) => pasted[i] ?? '');
    const next = arr.join('');
    this.value.set(next);
    this._onChange(next);
    const lastFilled = Math.min(pasted.length, this.length() - 1);
    this._focusCell(lastFilled);
  }

  protected _onCellFocus(index: number): void {
    const inputs = this._cellInputs();
    if (inputs[index]) {
      inputs[index].nativeElement.select();
    }
  }

  private _focusCell(index: number): void {
    const inputs = this._cellInputs();
    if (inputs[index]) {
      inputs[index].nativeElement.focus();
    }
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

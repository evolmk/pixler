import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

type CheckboxSize = 'sm' | 'default' | 'lg';
type CheckboxShape = 'default' | 'square' | 'circle';
type CheckboxType = 'default' | 'destructive';

const CB_SIZE: Record<CheckboxSize, string> = {
  sm: 'h-3 w-3',
  default: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const CB_SHAPE: Record<CheckboxShape, string> = {
  default: 'rounded-sm',
  square: 'rounded-none',
  circle: 'rounded-full',
};

const CB_TYPE_CHECKED: Record<CheckboxType, string> = {
  default: 'bg-primary border-primary text-primary-foreground',
  destructive: 'bg-destructive border-destructive text-destructive-foreground',
};

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"checkbox"',
    '[attr.aria-checked]': 'indeterminate() ? "mixed" : checked()',
    '[attr.aria-disabled]': '_disabled() || null',
    '[attr.tabindex]': '_disabled() ? "-1" : "0"',
    '(click)': '_toggle()',
    '(keydown.space)': '$event.preventDefault(); _toggle()',
  },
  template: `
    <div [class]="boxClass()">
      <input
        type="checkbox"
        [id]="_inputId"
        [checked]="checked()"
        class="sr-only"
        tabindex="-1"
        (click)="$event.stopPropagation()"
        (change)="_toggle()"
      />
      @if (checked()) {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-3.5"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      } @else if (indeterminate()) {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-3.5"
        >
          <path d="M5 12h14" />
        </svg>
      }
    </div>
    @if (label()) {
      <span class="text-sm leading-none" [class.cursor-not-allowed]="_disabled()" [class.opacity-50]="_disabled()">{{
        label()
      }}</span>
    }
  `,
})
export class CheckboxComponent implements ControlValueAccessor {
  private static _nextId = 0;
  private readonly _el = inject(ElementRef).nativeElement as HTMLElement;
  protected readonly _inputId: string;

  readonly size = input<CheckboxSize>('default');
  readonly shape = input<CheckboxShape>('default');
  readonly type = input<CheckboxType>('default');
  readonly class = input<string>('');
  readonly checked = model<boolean>(false);
  readonly checkedChange = output<boolean>();
  readonly indeterminate = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly label = input<string>('');

  protected readonly _disabled = computed(() => this.disabled() || this._cvaDisabled());

  constructor() {
    const hostId = this._el.id || null;
    this._inputId = hostId || `ui-cb-${CheckboxComponent._nextId++}`;
    if (hostId) {
      this._el.removeAttribute('id');
    }
  }

  private readonly _cvaDisabled = signal(false);
  private _onChange: (value: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex items-center gap-2',
      'cursor-pointer select-none',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      this._disabled() ? 'cursor-not-allowed' : '',
      this.class(),
    ),
  );

  protected readonly boxClass = computed(() =>
    cn(
      'inline-flex shrink-0 items-center justify-center border shadow',
      CB_SIZE[this.size()],
      CB_SHAPE[this.shape()],
      this._disabled() ? 'opacity-50' : '',
      this.checked() || this.indeterminate() ? CB_TYPE_CHECKED[this.type()] : 'bg-background border-primary',
    ),
  );

  protected _toggle(): void {
    if (this._disabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.checkedChange.emit(next);
    this._onChange(next);
    this._onTouched();
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._cvaDisabled.set(isDisabled);
  }
}

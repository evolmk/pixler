import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

type SwitchSize = 'sm' | 'default' | 'lg';
type SwitchType = 'default' | 'destructive';

const SWITCH_TRACK: Record<SwitchSize, string> = {
  sm: 'h-4 w-7',
  default: 'h-6 w-11',
  lg: 'h-7 w-14',
};

const SWITCH_THUMB: Record<SwitchSize, { base: string; on: string; off: string }> = {
  sm: { base: 'h-3 w-3', on: 'translate-x-3', off: 'translate-x-0' },
  default: { base: 'h-5 w-5', on: 'translate-x-5', off: 'translate-x-0' },
  lg: { base: 'h-6 w-6', on: 'translate-x-7', off: 'translate-x-0' },
};

const SWITCH_CHECKED_COLOR: Record<SwitchType, string> = {
  default: 'bg-primary',
  destructive: 'bg-destructive',
};

@Component({
  selector: 'ui-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': '"flex items-center gap-3 w-fit"',
  },
  template: `
    @if (label() && labelPosition() === 'left') {
      <span class="text-sm text-muted-foreground select-none cursor-pointer" (click)="_toggle()">{{ label() }}</span>
    }
    <button
      type="button"
      role="switch"
      [class]="trackClass()"
      [attr.aria-checked]="checked()"
      [attr.aria-disabled]="_disabled() || null"
      [attr.tabindex]="_disabled() ? '-1' : '0'"
      (click)="_toggle()"
      (keydown.space)="$event.preventDefault(); _toggle()"
    >
      <span [class]="thumbClass()"></span>
    </button>
    @if (showValue()) {
      <span class="text-sm text-muted-foreground select-none cursor-pointer" (click)="_toggle()">{{
        checked() ? 'true' : 'false'
      }}</span>
    }
    @if (label() && labelPosition() === 'right') {
      <span class="text-sm text-muted-foreground select-none cursor-pointer" (click)="_toggle()">{{ label() }}</span>
    }
  `,
})
export class SwitchComponent implements ControlValueAccessor {
  readonly size = input<SwitchSize>('default');
  readonly type = input<SwitchType>('default');
  readonly class = input<string>('');
  readonly showValue = input<boolean>(true);
  readonly label = input<string>('');
  readonly labelPosition = input<'left' | 'right'>('right');
  readonly checked = model<boolean>(false);
  readonly checkedChange = output<boolean>();

  protected readonly _disabled = signal(false);

  private _onChange: (value: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly trackClass = computed(() => {
    const sz = this.size();
    return cn(
      'inline-flex shrink-0 items-center rounded-full border-2 border-transparent',
      'cursor-pointer transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      SWITCH_TRACK[sz],
      this._disabled() ? 'cursor-not-allowed opacity-50' : '',
      this.checked() ? SWITCH_CHECKED_COLOR[this.type()] : 'bg-input',
      this.class(),
    );
  });

  protected readonly thumbClass = computed(() => {
    const sz = this.size();
    const thumbSizes = SWITCH_THUMB[sz];
    return cn(
      'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
      thumbSizes.base,
      this.checked() ? thumbSizes.on : thumbSizes.off,
    );
  });

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
    this._disabled.set(isDisabled);
  }
}

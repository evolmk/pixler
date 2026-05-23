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

type ToggleVariant = 'default' | 'outline';
type ToggleSize = 'sm' | 'default' | 'lg';

const SIZE_CLASS: Record<ToggleSize, string> = {
  sm: 'h-8 px-2.5 text-xs',
  default: 'h-9 px-3 text-sm',
  lg: 'h-10 px-4 text-base',
};

@Component({
  selector: 'ui-toggle, button[uiToggle]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'computedClass()',
    '[attr.aria-pressed]': 'pressed()',
    '[attr.data-state]': 'pressed() ? "on" : "off"',
    '(click)': '_toggle()',
  },
  template: `<ng-content />`,
})
export class ToggleComponent implements ControlValueAccessor {
  readonly pressed = model<boolean>(false);
  readonly variant = input<ToggleVariant>('default');
  readonly size = input<ToggleSize>('default');
  readonly class = input<string>('');

  protected readonly _disabled = signal(false);

  private _onChange: (v: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      // variant
      this.variant() === 'outline'
        ? 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground'
        : 'bg-transparent hover:bg-muted hover:text-muted-foreground',
      // active state
      this.pressed() ? 'bg-accent text-accent-foreground' : '',
      // disabled
      this._disabled() ? 'pointer-events-none opacity-50' : '',
      SIZE_CLASS[this.size()],
      this.class(),
    ),
  );

  protected _toggle(): void {
    if (this._disabled()) return;
    const next = !this.pressed();
    this.pressed.set(next);
    this._onChange(next);
    this._onTouched();
  }

  writeValue(value: boolean): void {
    this.pressed.set(!!value);
  }

  registerOnChange(fn: (v: boolean) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}

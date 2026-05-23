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

type SwitchFilterSize = 'sm' | 'default' | 'lg';

const TRACK_SIZE: Record<SwitchFilterSize, string> = {
  sm: 'h-4 w-7',
  default: 'h-6 w-11',
  lg: 'h-7 w-14',
};

const THUMB_SIZE: Record<SwitchFilterSize, { base: string; on: string; off: string }> = {
  sm: { base: 'h-3 w-3', on: 'translate-x-3', off: 'translate-x-0' },
  default: { base: 'h-5 w-5', on: 'translate-x-5', off: 'translate-x-0' },
  lg: { base: 'h-6 w-6', on: 'translate-x-7', off: 'translate-x-0' },
};

@Component({
  selector: 'ui-switch-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchFilterComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': '"inline-flex items-center gap-2 w-fit"',
  },
  template: `
    <span [class]="labelClass()" (click)="_toggleActive()">
      {{ label() }}
    </span>
    <button
      type="button"
      role="switch"
      [class]="trackClass()"
      [attr.aria-checked]="_switchOn()"
      [attr.aria-label]="label() + ' filter'"
      [attr.tabindex]="_disabled() ? '-1' : '0'"
      (click)="_toggleSwitch()"
      (keydown.space)="$event.preventDefault(); _toggleSwitch()"
    >
      <span [class]="thumbClass()"></span>
    </button>
  `,
})
export class SwitchFilterComponent implements ControlValueAccessor {
  /**
   * The filter label text (e.g. "Locked").
   * Click label to toggle active/inactive.
   */
  readonly label = input.required<string>();

  /** Switch size variant. */
  readonly size = input<SwitchFilterSize>('sm');

  /** Extra CSS classes for the host. */
  readonly class = input<string>('');

  /**
   * Tri-state value:
   * - `null`  = filter inactive (show all)
   * - `true`  = filter active, show TRUE records
   * - `false` = filter active, show FALSE records
   */
  readonly value = model<boolean | null>(null);

  protected readonly _disabled = signal(false);

  private _onChange: (value: boolean | null) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly _active = computed(() => this.value() !== null);
  protected readonly _switchOn = computed(() => this.value() === true);

  protected readonly labelClass = computed(() =>
    cn(
      'text-sm select-none cursor-pointer transition-colors',
      this._active() ? 'text-primary font-medium' : 'text-muted-foreground',
    ),
  );

  protected readonly trackClass = computed(() => {
    const sz = this.size();
    return cn(
      'inline-flex shrink-0 items-center rounded-full border-2 border-transparent',
      'cursor-pointer transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      TRACK_SIZE[sz],
      this._disabled() ? 'cursor-not-allowed opacity-50' : '',
      this._switchOn() ? 'bg-primary' : 'bg-input',
    );
  });

  protected readonly thumbClass = computed(() => {
    const sz = this.size();
    const thumbSizes = THUMB_SIZE[sz];
    return cn(
      'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
      thumbSizes.base,
      this._switchOn() ? thumbSizes.on : thumbSizes.off,
    );
  });

  /** Label click: toggle active/inactive. */
  protected _toggleActive(): void {
    if (this._disabled()) return;
    this._setValue(this._active() ? null : false);
  }

  /** Switch click: toggle direction. Auto-activates if inactive. */
  protected _toggleSwitch(): void {
    if (this._disabled()) return;
    if (!this._active()) {
      this._setValue(true);
    } else {
      this._setValue(this.value() === true ? false : true);
    }
  }

  private _setValue(v: boolean | null): void {
    this.value.set(v);
    this._onChange(v);
    this._onTouched();
  }

  writeValue(value: boolean | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: boolean | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}

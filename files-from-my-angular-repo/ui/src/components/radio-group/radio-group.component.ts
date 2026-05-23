import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

export const RADIO_GROUP_TOKEN = new InjectionToken<RadioGroupComponent>('RADIO_GROUP_TOKEN');

@Component({
  selector: 'ui-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: RADIO_GROUP_TOKEN,
      useExisting: forwardRef(() => RadioGroupComponent),
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"radiogroup"',
    '[attr.aria-orientation]': 'orientation()',
  },
  template: `<ng-content />`,
})
export class RadioGroupComponent implements ControlValueAccessor {
  readonly class = input<string>('');
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  readonly value = model<string>('');

  private readonly _disabled = signal(false);

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly computedClass = computed(() =>
    cn(
      this.orientation() === 'vertical' ? 'flex flex-col gap-2' : 'flex flex-row gap-4',
      this.class(),
    ),
  );

  select(value: string): void {
    if (this._disabled()) return;
    this.value.set(value);
    this._onChange(value);
    this._onTouched();
  }

  isSelected(value: string): boolean {
    return this.value() === value;
  }

  isDisabled(): boolean {
    return this._disabled();
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}

@Component({
  selector: 'ui-radio-group-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"radio"',
    '[attr.aria-checked]': '_group.isSelected(value())',
    '[attr.aria-disabled]': '_group.isDisabled() || null',
    '[attr.tabindex]': '_group.isSelected(value()) ? "0" : "-1"',
    '(click)': '_select()',
    '(keydown.space)': '$event.preventDefault(); _select()',
  },
  template: `
    @if (_group.isSelected(value())) {
      <span class="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-current"></span>
    }
  `,
})
export class RadioGroupItemComponent {
  readonly value = input.required<string>();
  readonly class = input<string>('');

  protected readonly _group = inject(RADIO_GROUP_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      'aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow',
      'inline-flex items-center justify-center',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      'cursor-pointer',
      this._group.isDisabled() ? 'cursor-not-allowed opacity-50' : '',
      this.class(),
    ),
  );

  protected _select(): void {
    this._group.select(this.value());
  }
}

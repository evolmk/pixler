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

type RatingsSize = 'sm' | 'default' | 'lg';

const STAR_SIZE: Record<RatingsSize, string> = {
  sm: 'h-4 w-4',
  default: 'h-6 w-6',
  lg: 'h-8 w-8',
};

@Component({
  selector: 'ui-ratings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingsComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"radiogroup"',
    '[attr.aria-label]': '"Rating"',
  },
  template: `
    @for (star of stars(); track star) {
      <button
        type="button"
        role="radio"
        [attr.aria-label]="star + ' star' + (star === 1 ? '' : 's')"
        [attr.aria-checked]="(hovered() || value()) >= star"
        [disabled]="_disabled() || readonly()"
        [class]="_starClass()"
        (click)="_select(star)"
        (mouseenter)="hovered.set(star)"
        (mouseleave)="hovered.set(0)"
        (focus)="hovered.set(star)"
        (blur)="_onBlur()"
        (keydown.arrowright)="$event.preventDefault(); _select(_clamp(star + 1, 1, count()))"
        (keydown.arrowleft)="$event.preventDefault(); _select(_clamp(star - 1, 1, count()))"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          [class]="starIcon()"
          viewBox="0 0 24 24"
          [attr.fill]="(hovered() || value()) >= star ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          />
        </svg>
      </button>
    }
  `,
})
export class RatingsComponent implements ControlValueAccessor {
  readonly value = model<number>(0);
  readonly count = input<number>(5);
  readonly size = input<RatingsSize>('default');
  readonly readonly = input<boolean>(false);
  readonly allowClear = input<boolean>(true);
  readonly class = input<string>('');

  protected readonly hovered = signal(0);
  protected readonly _disabled = signal(false);
  protected readonly stars = computed(() => Array.from({ length: this.count() }, (_, i) => i + 1));

  protected readonly computedClass = computed(() => cn('inline-flex items-center gap-0.5', this.class()));

  protected readonly starIcon = computed(() => STAR_SIZE[this.size()]);

  protected readonly _starClass = computed(() =>
    cn(
      'transition-colors',
      this._disabled() || this.readonly()
        ? 'cursor-default opacity-70'
        : 'cursor-pointer text-yellow-400 hover:text-yellow-500',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:cursor-not-allowed',
    ),
  );

  private _onChange: (v: number) => void = () => {};
  private _onTouched: () => void = () => {};

  protected _clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
  }

  protected _select(star: number): void {
    if (this._disabled() || this.readonly()) return;
    const next = this.allowClear() && this.value() === star ? 0 : star;
    this.value.set(next);
    this._onChange(next);
    this._onTouched();
  }

  protected _onBlur(): void {
    this.hovered.set(0);
    this._onTouched();
  }

  writeValue(value: number): void {
    this.value.set(value ?? 0);
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

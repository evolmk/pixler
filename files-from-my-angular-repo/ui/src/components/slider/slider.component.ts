import { DOCUMENT } from '@angular/common';
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
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

type SliderOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'ui-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    <span
      #track
      [class]="trackClass()"
      (pointerdown)="onTrackPointerDown($event)"
    >
      <span [class]="fillClass()" [style]="fillStyle()"></span>
    </span>
    <span
      [class]="thumbClass()"
      [style]="thumbStyle()"
      role="slider"
      [attr.aria-valuenow]="value()"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [attr.aria-orientation]="orientation()"
      [attr.tabindex]="_disabled() ? -1 : 0"
      (pointerdown)="onThumbPointerDown($event)"
      (keydown)="onKeyDown($event)"
    ></span>
  `,
})
export class SliderComponent implements ControlValueAccessor {
  private readonly _doc = inject(DOCUMENT);

  readonly class = input<string>('');
  readonly value = model<number>(0);
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly step = input<number>(1);
  readonly orientation = input<SliderOrientation>('horizontal');

  protected readonly _disabled = signal(false);
  protected readonly trackRef = viewChild.required<ElementRef<HTMLElement>>('track');

  private _onChange: (v: number) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly fillPercent = computed(() => {
    const range = this.max() - this.min();
    return range === 0 ? 0 : ((this.value() - this.min()) / range) * 100;
  });

  protected readonly computedClass = computed(() =>
    cn(
      'relative flex touch-none select-none items-center',
      this.orientation() === 'vertical'
        ? 'h-full min-h-[100px] w-5 flex-col'
        : 'w-full',
      this.class(),
    ),
  );

  protected readonly trackClass = computed(() =>
    cn(
      'relative overflow-hidden rounded-full bg-secondary cursor-pointer',
      this.orientation() === 'vertical' ? 'w-2 h-full grow' : 'h-2 w-full grow',
    ),
  );

  protected readonly fillClass = computed(() =>
    cn(
      'absolute bg-primary',
      this.orientation() === 'vertical' ? 'bottom-0 w-full' : 'left-0 h-full',
    ),
  );

  protected readonly fillStyle = computed(() =>
    this.orientation() === 'vertical'
      ? `height: ${this.fillPercent()}%`
      : `width: ${this.fillPercent()}%`,
  );

  protected readonly thumbClass = computed(() =>
    cn(
      'absolute block h-5 w-5 rounded-full border-2 border-primary bg-background shadow ring-offset-background',
      'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      this._disabled() ? 'cursor-not-allowed opacity-50' : 'cursor-grab',
    ),
  );

  protected readonly thumbStyle = computed(() => {
    const pct = this.fillPercent();
    return this.orientation() === 'vertical'
      ? `bottom: ${pct}%; transform: translateY(50%)`
      : `left: ${pct}%; transform: translateX(-50%)`;
  });

  onTrackPointerDown(event: PointerEvent): void {
    if (this._disabled()) return;
    this._updateFromPointer(event);
    this._startDrag();
  }

  onThumbPointerDown(event: PointerEvent): void {
    if (this._disabled()) return;
    event.stopPropagation();
    this._startDrag();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this._disabled()) return;
    const step = this.step();
    let newValue = this.value();
    const isVertical = this.orientation() === 'vertical';
    switch (event.key) {
      case 'ArrowRight':
      case isVertical ? 'ArrowUp' : 'ArrowUp':
        newValue = Math.min(this.max(), newValue + step);
        break;
      case 'ArrowLeft':
      case isVertical ? 'ArrowDown' : 'ArrowDown':
        newValue = Math.max(this.min(), newValue - step);
        break;
      case 'Home':
        newValue = this.min();
        break;
      case 'End':
        newValue = this.max();
        break;
      default:
        return;
    }
    event.preventDefault();
    this._setValue(newValue);
  }

  private _startDrag(): void {
    const onMove = (e: PointerEvent) => this._updateFromPointer(e);
    const onUp = () => {
      this._doc.removeEventListener('pointermove', onMove);
      this._doc.removeEventListener('pointerup', onUp);
      this._onTouched();
    };
    this._doc.addEventListener('pointermove', onMove);
    this._doc.addEventListener('pointerup', onUp);
  }

  private _updateFromPointer(event: PointerEvent): void {
    const track = this.trackRef().nativeElement;
    const rect = track.getBoundingClientRect();
    let pct: number;
    if (this.orientation() === 'vertical') {
      pct = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height));
    } else {
      pct = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    }
    const raw = this.min() + pct * (this.max() - this.min());
    const stepped = Math.round(raw / this.step()) * this.step();
    this._setValue(Math.max(this.min(), Math.min(this.max(), stepped)));
  }

  private _setValue(value: number): void {
    this.value.set(value);
    this._onChange(value);
  }

  writeValue(value: number): void {
    this.value.set(value ?? this.min());
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

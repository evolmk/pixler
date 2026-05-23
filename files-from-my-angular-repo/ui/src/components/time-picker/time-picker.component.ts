import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { cn } from '../../utils/cn';

export type TimeFormat = '12h' | '24h';

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

@Component({
  selector: 'ui-time-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
  ],
  host: { '[class]': 'computedClass()' },
  template: `
    <!-- Trigger button -->
    <button
      type="button"
      [class]="triggerClass()"
      [disabled]="_disabled()"
      (click)="_toggleOpen()"
      [attr.aria-expanded]="_open()"
      aria-haspopup="dialog"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-muted-foreground shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span [class]="value() ? 'text-foreground' : 'text-muted-foreground'">
        {{ value() ? _displayValue() : placeholder() }}
      </span>
    </button>

    <!-- Popup: 3-column layout (Hours | Minutes | AM/PM) -->
    @if (_open()) {
      <div
        class="fixed z-[9999] rounded-lg border border-border bg-popover shadow-md min-w-[260px]"
        [style.top.px]="_popupTop()"
        [style.left.px]="_popupLeft()"
        role="dialog"
        aria-label="Time picker"
      >
        <!-- Column headers -->
        <div
          class="grid border-b border-border"
          [style.grid-template-columns]="format() === '12h' ? '1fr 1fr 48px' : '1fr 1fr'"
        >
          <div class="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Hour</div>
          <div class="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Min</div>
          @if (format() === '12h') {
            <div class="px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider text-center"></div>
          }
        </div>

        <!-- Scrollable columns -->
        <div
          class="grid"
          [style.grid-template-columns]="format() === '12h' ? '1fr 1fr 48px' : '1fr 1fr'"
          style="height: 300px"
        >
          <!-- Hours column -->
          <div class="overflow-y-auto border-r border-border py-1 px-1" #hoursCol>
            @for (h of _hourOptions(); track h) {
              <button
                type="button"
                [class]="_listCellClass(_isHourSelected(h))"
                (click)="_pickHour(h)"
                [attr.data-hour]="h"
              >
                {{ format() === '12h' ? h % 12 || 12 : pad(h) }}
              </button>
            }
          </div>

          <!-- Minutes column -->
          <div
            class="overflow-y-auto py-1 px-1"
            [class.border-r]="format() === '12h'"
            [class.border-border]="format() === '12h'"
            #minutesCol
          >
            @for (m of minuteOptions; track m) {
              <button
                type="button"
                [class]="_listCellClass(m === _selMinute())"
                (click)="_pickMinute(m)"
                [attr.data-minute]="m"
              >
                :{{ pad(m) }}
              </button>
            }
          </div>

          <!-- AM/PM column (12h only) -->
          @if (format() === '12h') {
            <div class="flex flex-col gap-1 py-1 px-1">
              <button type="button" [class]="_listCellClass(_selPeriod() === 'AM')" (click)="_pickPeriod('AM')">
                AM
              </button>
              <button type="button" [class]="_listCellClass(_selPeriod() === 'PM')" (click)="_pickPeriod('PM')">
                PM
              </button>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between border-t border-border px-3 py-2">
          <button
            type="button"
            class="cursor-pointer text-xs font-medium text-destructive hover:text-destructive/80 transition-colors"
            (click)="_clear()"
          >
            Clear
          </button>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="cursor-pointer text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              (click)="_selectCurrent()"
            >
              Select
            </button>
            <button
              type="button"
              class="cursor-pointer text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              (click)="_selectNow()"
            >
              Now
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class TimePickerComponent implements ControlValueAccessor {
  /** Value stored as "HH:MM" in 24h format internally. */
  readonly value = model<string>('');
  readonly format = input<TimeFormat>('12h');
  readonly showSeconds = input<boolean>(false);
  readonly placeholder = input<string>('Pick a time');
  readonly class = input<string>('');

  protected readonly _open = signal(false);
  protected readonly _disabled = signal(false);
  protected readonly _popupTop = signal(0);
  protected readonly _popupLeft = signal(0);
  protected readonly minuteOptions = MINUTES;

  // Selection state — tracks which of the 3 columns have been clicked
  protected readonly _selHour = signal(12);
  protected readonly _selMinute = signal(0);
  protected readonly _selPeriod = signal<'AM' | 'PM'>('AM');
  private _hourPicked = false;
  private _minutePicked = false;
  private _periodPicked = false;

  protected readonly _hourOptions = computed(() => (this.format() === '12h' ? HOURS_12 : HOURS_24));

  protected readonly _displayValue = computed(() => {
    const v = this.value();
    if (!v) return '';
    const [hStr, mStr] = v.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (this.format() === '12h') {
      const period = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${pad(m)} ${period}`;
    }
    return `${pad(h)}:${pad(m)}`;
  });

  private readonly _elRef = inject(ElementRef);
  private readonly _destroyRef = inject(DestroyRef);
  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly computedClass = computed(() => cn('relative inline-block w-full', this.class()));

  protected readonly triggerClass = computed(() =>
    cn(
      'flex w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer',
      'transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
      'hover:bg-accent/30 disabled:cursor-not-allowed disabled:opacity-50',
    ),
  );

  protected pad = pad;

  constructor() {
    fromEvent<MouseEvent>(document, 'mousedown')
      .pipe(
        filter(() => this._open()),
        filter((e) => !this._elRef.nativeElement.contains(e.target as Node)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => this._open.set(false));
  }

  protected _isHourSelected(h: number): boolean {
    const sel = this._selHour();
    if (this.format() === '24h') return h === sel;
    // 12h mode: convert stored 24h hour to 12h display value for comparison
    const sel12 = sel % 12 || 12;
    return h === sel12;
  }

  protected _listCellClass(isSelected: boolean): string {
    return cn(
      'flex w-full items-center justify-center rounded px-2 py-1 text-sm font-medium transition-colors cursor-pointer',
      'hover:bg-accent hover:text-accent-foreground',
      isSelected ? 'bg-primary text-primary-foreground' : '',
    );
  }

  protected _toggleOpen(): void {
    this._open.update((v) => !v);
    if (this._open()) {
      this._resetPicks();
      this._syncFromValue();
      this._positionPopup();
      requestAnimationFrame(() => this._scrollToSelected());
    }
  }

  private _positionPopup(): void {
    const rect = this._elRef.nativeElement.getBoundingClientRect();
    const popupHeight = 380;
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow >= popupHeight) {
      this._popupTop.set(rect.bottom + 4);
    } else {
      this._popupTop.set(rect.top - popupHeight - 4);
    }
    this._popupLeft.set(rect.left);
  }

  protected _pickHour(hour: number): void {
    if (this.format() === '12h') {
      const h24 = this._selPeriod() === 'PM' ? (hour % 12) + 12 : hour % 12;
      this._selHour.set(h24);
    } else {
      this._selHour.set(hour);
    }
    this._hourPicked = true;
    this._tryEmitAndClose();
  }

  protected _pickMinute(minute: number): void {
    this._selMinute.set(minute);
    this._minutePicked = true;
    this._tryEmitAndClose();
  }

  protected _pickPeriod(period: 'AM' | 'PM'): void {
    this._selPeriod.set(period);
    // Adjust 24h hour
    const h = this._selHour();
    if (period === 'PM' && h < 12) {
      this._selHour.set(h + 12);
    } else if (period === 'AM' && h >= 12) {
      this._selHour.set(h - 12);
    }
    this._periodPicked = true;
    this._tryEmitAndClose();
  }

  /** Select using the currently highlighted hour/minute/period without requiring all 3 clicks. */
  protected _selectCurrent(): void {
    this._emit();
    this._open.set(false);
  }

  protected _selectNow(): void {
    const now = new Date();
    const h = now.getHours();
    const rawMin = now.getMinutes();
    const m = Math.ceil(rawMin / 5) * 5;
    this._selHour.set(h);
    this._selMinute.set(m >= 60 ? 0 : m);
    this._selPeriod.set(h >= 12 ? 'PM' : 'AM');
    this._emit();
    this._open.set(false);
  }

  protected _clear(): void {
    this.value.set('');
    this._onChange('');
    this._onTouched();
    this._open.set(false);
  }

  /** Only close and emit after all required columns are picked. */
  private _tryEmitAndClose(): void {
    const allPicked =
      this.format() === '12h'
        ? this._hourPicked && this._minutePicked && this._periodPicked
        : this._hourPicked && this._minutePicked;
    if (allPicked) {
      this._emit();
      this._open.set(false);
    }
  }

  private _resetPicks(): void {
    this._hourPicked = false;
    this._minutePicked = false;
    this._periodPicked = false;
  }

  private _emit(): void {
    const val = `${pad(this._selHour())}:${pad(this._selMinute())}`;
    this.value.set(val);
    this._onChange(val);
    this._onTouched();
  }

  private _syncFromValue(): void {
    const v = this.value();
    if (v) {
      const [hStr, mStr] = v.split(':');
      const h = parseInt(hStr, 10) || 0;
      const m = parseInt(mStr, 10) || 0;
      this._selHour.set(h);
      this._selMinute.set(m);
      this._selPeriod.set(h >= 12 ? 'PM' : 'AM');
    } else {
      // Default to current time rounded up to nearest 5 min
      const now = new Date();
      const h = now.getHours();
      const rawMin = now.getMinutes();
      const m = Math.ceil(rawMin / 5) * 5;
      this._selHour.set(h);
      this._selMinute.set(m >= 60 ? 0 : m);
      this._selPeriod.set(h >= 12 ? 'PM' : 'AM');
    }
  }

  private _scrollToSelected(): void {
    const el = this._elRef.nativeElement as HTMLElement;
    const hourVal = this.format() === '12h' ? this._selHour() % 12 || 12 : this._selHour();
    const hoursBtn = el.querySelector(`[data-hour="${hourVal}"]`);
    const minuteBtn = el.querySelector(`[data-minute="${this._selMinute()}"]`);
    hoursBtn?.scrollIntoView({ block: 'center', behavior: 'instant' });
    minuteBtn?.scrollIntoView({ block: 'center', behavior: 'instant' });
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
    this._syncFromValue();
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

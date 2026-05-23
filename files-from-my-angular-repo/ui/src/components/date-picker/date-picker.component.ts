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

type DatePickerView = 'days' | 'months' | 'years';

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface CalDay {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildCalendar(
  year: number,
  month: number,
  selected: Date | null,
  minDate: Date | null,
  maxDate: Date | null,
): CalDay[][] {
  const today = new Date();
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: CalDay[] = [];

  // Prev month fill
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrev - i);
    cells.push({
      date,
      inMonth: false,
      isToday: sameDay(date, today),
      isSelected: sameDay(date, selected),
      isDisabled: _isDisabled(date, minDate, maxDate),
    });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({
      date,
      inMonth: true,
      isToday: sameDay(date, today),
      isSelected: sameDay(date, selected),
      isDisabled: _isDisabled(date, minDate, maxDate),
    });
  }
  // Next month fill
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    cells.push({
      date,
      inMonth: false,
      isToday: sameDay(date, today),
      isSelected: sameDay(date, selected),
      isDisabled: _isDisabled(date, minDate, maxDate),
    });
  }

  // Split into weeks
  const weeks: CalDay[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function _isDisabled(date: Date, min: Date | null, max: Date | null): boolean {
  if (min && date < min) return true;
  if (max && date > max) return true;
  return false;
}

function formatDate(date: Date | null, fmt: string): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return fmt.replace('YYYY', String(y)).replace('MM', m).replace('DD', d);
}

@Component({
  selector: 'ui-date-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
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
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
      <span [class]="value() ? 'text-foreground' : 'text-muted-foreground'">
        {{ value() ? _displayValue() : placeholder() }}
      </span>
    </button>

    <!-- Calendar popup (fixed to viewport to avoid dialog overflow clipping) -->
    @if (_open()) {
      <div
        class="fixed z-[9999] rounded-lg border border-border bg-popover p-4 shadow-md min-w-[280px]"
        [style.top.px]="_popupTop()"
        [style.left.px]="_popupLeft()"
        role="dialog"
        aria-label="Date picker calendar"
      >
        <!-- Nav row -->
        <div class="mb-3 flex items-center justify-between">
          <button
            type="button"
            class="cursor-pointer rounded px-2 py-0.5 text-sm font-semibold hover:bg-muted transition-colors"
            (click)="_toggleView()"
          >
            @switch (_view()) {
              @case ('days') {
                {{ _monthName() }} {{ _viewYear() }}
              }
              @case ('months') {
                {{ _viewYear() }}
              }
              @case ('years') {
                {{ _yearRangeStart() }} – {{ _yearRangeStart() + 11 }}
              }
            }
          </button>

          <div class="flex items-center gap-1">
            <button type="button" class="cursor-pointer rounded p-1 hover:bg-muted transition-colors" (click)="_prev()">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button type="button" class="cursor-pointer rounded p-1 hover:bg-muted transition-colors" (click)="_next()">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        @switch (_view()) {
          @case ('days') {
            <!-- Day header row -->
            <div class="mb-1 grid grid-cols-7 text-center">
              @for (day of dayNames; track day) {
                <div class="flex h-9 w-9 items-center justify-center text-xs font-medium text-muted-foreground">
                  {{ day }}
                </div>
              }
            </div>

            <!-- Weeks -->
            @for (week of _calendar(); track $index) {
              <div class="grid grid-cols-7">
                @for (cell of week; track cell.date.getTime()) {
                  <button
                    type="button"
                    [disabled]="cell.isDisabled"
                    [class]="dayCellClass(cell)"
                    (click)="_selectDate(cell)"
                    [attr.aria-label]="cell.date.toDateString()"
                    [attr.aria-pressed]="cell.isSelected"
                    [attr.aria-disabled]="cell.isDisabled"
                  >
                    {{ cell.date.getDate() }}
                  </button>
                }
              </div>
            }
          }

          @case ('months') {
            <div class="grid grid-cols-3 gap-1">
              @for (m of monthAbbr; track $index) {
                <button type="button" [class]="_monthCellClass($index)" (click)="_pickMonth($index)">
                  {{ m }}
                </button>
              }
            </div>
          }

          @case ('years') {
            <div class="grid grid-cols-3 gap-1">
              @for (y of _yearRange(); track y) {
                <button type="button" [class]="_yearCellClass(y)" (click)="_pickYear(y)">
                  {{ y }}
                </button>
              }
            </div>
          }
        }

        <!-- Footer -->
        <div class="mt-3 flex items-center justify-between border-t border-border pt-3">
          <button
            type="button"
            class="cursor-pointer text-xs font-medium text-destructive hover:text-destructive/80 transition-colors"
            (click)="_clear()"
          >
            Clear
          </button>
          <button
            type="button"
            class="cursor-pointer text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            (click)="_selectToday()"
          >
            Today
          </button>
        </div>
      </div>
    }
  `,
})
export class DatePickerComponent implements ControlValueAccessor {
  readonly value = model<Date | null>(null);
  readonly placeholder = input<string>('Pick a date');
  readonly dateFormat = input<string>('MM/DD/YYYY');
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly class = input<string>('');

  protected readonly _open = signal(false);
  protected readonly _disabled = signal(false);
  protected readonly _popupTop = signal(0);
  protected readonly _popupLeft = signal(0);
  protected readonly _view = signal<DatePickerView>('days');
  protected readonly dayNames = DAY_NAMES;
  protected readonly monthAbbr = MONTH_ABBR;

  private readonly _today = new Date();
  protected readonly _viewYear = signal(this._today.getFullYear());
  protected readonly _viewMonth = signal(this._today.getMonth());
  protected readonly _yearRangeStart = signal(this._today.getFullYear() - (this._today.getFullYear() % 12));

  protected readonly _monthName = computed(() => MONTH_ABBR[this._viewMonth()].toUpperCase());

  protected readonly _calendar = computed(() =>
    buildCalendar(this._viewYear(), this._viewMonth(), this.value(), this.minDate(), this.maxDate()),
  );

  protected readonly _yearRange = computed(() => {
    const start = this._yearRangeStart();
    return Array.from({ length: 12 }, (_, i) => start + i);
  });

  protected readonly _displayValue = computed(() => formatDate(this.value(), this.dateFormat()));

  private readonly _elRef = inject(ElementRef);
  private readonly _destroyRef = inject(DestroyRef);
  private _onChange: (v: Date | null) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly computedClass = computed(() => cn('relative inline-block w-full', this.class()));

  constructor() {
    // Close on outside click
    fromEvent<MouseEvent>(document, 'mousedown')
      .pipe(
        filter(() => this._open()),
        filter((e) => !this._elRef.nativeElement.contains(e.target as Node)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => this._open.set(false));
  }

  protected readonly triggerClass = computed(() =>
    cn(
      'flex w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer',
      'transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
      'hover:bg-accent/30 disabled:cursor-not-allowed disabled:opacity-50',
    ),
  );

  protected dayCellClass(cell: CalDay): string {
    return cn(
      'flex h-9 w-9 items-center justify-center rounded text-sm font-medium transition-colors cursor-pointer',
      !cell.inMonth && 'text-muted-foreground/40',
      cell.inMonth && !cell.isSelected && !cell.isDisabled && 'hover:bg-accent hover:text-accent-foreground',
      cell.isToday && !cell.isSelected && 'border border-primary text-primary',
      cell.isSelected && 'bg-primary text-primary-foreground',
      cell.isDisabled && 'pointer-events-none opacity-30',
    );
  }

  protected _monthCellClass(monthIndex: number): string {
    const isCurrent = monthIndex === this._today.getMonth() && this._viewYear() === this._today.getFullYear();
    const isSelected = monthIndex === this._viewMonth();
    return cn(
      'flex h-10 items-center justify-center rounded text-sm font-medium transition-colors cursor-pointer',
      'hover:bg-accent hover:text-accent-foreground',
      isCurrent && !isSelected ? 'border border-primary text-primary' : '',
      isSelected ? 'bg-primary text-primary-foreground' : '',
    );
  }

  protected _yearCellClass(year: number): string {
    const isCurrent = year === this._today.getFullYear();
    const isSelected = year === this._viewYear();
    return cn(
      'flex h-10 items-center justify-center rounded text-sm font-medium transition-colors cursor-pointer',
      'hover:bg-accent hover:text-accent-foreground',
      isCurrent && !isSelected ? 'border border-primary text-primary' : '',
      isSelected ? 'bg-primary text-primary-foreground' : '',
    );
  }

  protected _toggleOpen(): void {
    this._open.update((v) => !v);
    if (this._open()) {
      this._view.set('days');
      this._positionPopup();
    }
  }

  private _positionPopup(): void {
    const rect = this._elRef.nativeElement.getBoundingClientRect();
    const popupHeight = 380;
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow >= popupHeight) {
      // Open below
      this._popupTop.set(rect.bottom + 4);
    } else {
      // Open above
      this._popupTop.set(rect.top - popupHeight - 4);
    }
    this._popupLeft.set(rect.left);
  }

  protected _selectToday(): void {
    const today = new Date();
    this._viewYear.set(today.getFullYear());
    this._viewMonth.set(today.getMonth());
    this.value.set(today);
    this._onChange(today);
    this._onTouched();
    this._open.set(false);
  }

  protected _clear(): void {
    this.value.set(null);
    this._onChange(null);
    this._onTouched();
    this._open.set(false);
  }

  protected _selectDate(cell: CalDay): void {
    if (cell.isDisabled) return;
    this.value.set(cell.date);
    this._onChange(cell.date);
    this._onTouched();
    this._open.set(false);
  }

  protected _pickMonth(monthIndex: number): void {
    this._viewMonth.set(monthIndex);
    this._view.set('days');
  }

  protected _pickYear(year: number): void {
    this._viewYear.set(year);
    this._view.set('months');
  }

  protected _toggleView(): void {
    const current = this._view();
    if (current === 'days') {
      this._view.set('months');
    } else if (current === 'months') {
      this._yearRangeStart.set(this._viewYear() - (this._viewYear() % 12));
      this._view.set('years');
    } else {
      this._view.set('days');
    }
  }

  protected _prev(): void {
    const view = this._view();
    if (view === 'years') {
      this._yearRangeStart.update((s) => s - 12);
    } else if (view === 'months') {
      this._viewYear.update((y) => y - 1);
    } else {
      if (this._viewMonth() === 0) {
        this._viewMonth.set(11);
        this._viewYear.update((y) => y - 1);
      } else {
        this._viewMonth.update((v) => v - 1);
      }
    }
  }

  protected _next(): void {
    const view = this._view();
    if (view === 'years') {
      this._yearRangeStart.update((s) => s + 12);
    } else if (view === 'months') {
      this._viewYear.update((y) => y + 1);
    } else {
      if (this._viewMonth() === 11) {
        this._viewMonth.set(0);
        this._viewYear.update((y) => y + 1);
      } else {
        this._viewMonth.update((v) => v + 1);
      }
    }
  }

  writeValue(value: Date | null): void {
    this.value.set(value);
    if (value) {
      this._viewYear.set(value.getFullYear());
      this._viewMonth.set(value.getMonth());
    }
  }

  registerOnChange(fn: (v: Date | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}

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

export type CalendarMode = 'single' | 'multiple' | 'range';
type CalendarView = 'days' | 'months' | 'years';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function inRange(date: Date, from: Date | null, to: Date | null): boolean {
  if (!from || !to) return false;
  const t = date.getTime();
  return t >= from.getTime() && t <= to.getTime();
}

interface CalCell {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
}

function buildCells(year: number, month: number): CalCell[][] {
  const today = new Date();
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: CalCell[] = [];

  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrev - i);
    cells.push({ date, inMonth: false, isToday: sameDay(date, today) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ date, inMonth: true, isToday: sameDay(date, today) });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    cells.push({ date, inMonth: false, isToday: sameDay(date, today) });
  }

  const weeks: CalCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

@Component({
  selector: 'ui-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent),
      multi: true,
    },
  ],
  host: { '[class]': 'computedClass()' },
  template: `
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <button
        type="button"
        class="cursor-pointer rounded p-1 hover:bg-muted transition-colors"
        [attr.aria-label]="
          _view() === 'years' ? 'Previous years' : _view() === 'months' ? 'Previous year' : 'Previous month'
        "
        (click)="_prev()"
      >
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

      <button
        type="button"
        class="cursor-pointer rounded px-2 py-0.5 text-sm font-semibold hover:bg-muted transition-colors"
        (click)="_toggleView()"
      >
        @switch (_view()) {
          @case ('days') {
            {{ _monthName() }} {{ _year() }}
          }
          @case ('months') {
            {{ _year() }}
          }
          @case ('years') {
            {{ _yearRangeStart() }} – {{ _yearRangeStart() + 11 }}
          }
        }
      </button>

      <button
        type="button"
        class="cursor-pointer rounded p-1 hover:bg-muted transition-colors"
        [attr.aria-label]="_view() === 'years' ? 'Next years' : _view() === 'months' ? 'Next year' : 'Next month'"
        (click)="_next()"
      >
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

    @switch (_view()) {
      @case ('days') {
        <!-- Day headers -->
        <div class="grid grid-cols-7 text-center">
          @for (d of dayNames; track d) {
            <div class="flex h-9 w-9 items-center justify-center text-xs font-medium text-muted-foreground">
              {{ d }}
            </div>
          }
        </div>

        <!-- Weeks -->
        @for (week of _calendar(); track $index) {
          <div class="grid grid-cols-7">
            @for (cell of week; track cell.date.getTime()) {
              <button
                type="button"
                [class]="dayCellClass(cell)"
                (click)="_pick(cell.date)"
                [attr.aria-label]="cell.date.toDateString()"
                [attr.aria-pressed]="_isSelected(cell.date)"
                [disabled]="_isDisabled(cell.date)"
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
            <button type="button" [class]="monthCellClass($index)" (click)="_pickMonth($index)">
              {{ m }}
            </button>
          }
        </div>
      }

      @case ('years') {
        <div class="grid grid-cols-3 gap-1">
          @for (y of _yearRange(); track y) {
            <button type="button" [class]="yearCellClass(y)" (click)="_pickYear(y)">
              {{ y }}
            </button>
          }
        </div>
      }
    }
  `,
})
export class CalendarComponent implements ControlValueAccessor {
  readonly mode = input<CalendarMode>('single');
  readonly value = model<Date | Date[] | DateRange | null>(null);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly class = input<string>('');

  protected readonly dayNames = DAY_NAMES;
  protected readonly monthAbbr = MONTH_ABBR;
  private readonly _today = new Date();
  protected readonly _month = signal(this._today.getMonth());
  protected readonly _year = signal(this._today.getFullYear());
  protected readonly _view = signal<CalendarView>('days');
  protected readonly _yearRangeStart = signal(this._today.getFullYear() - (this._today.getFullYear() % 12));
  protected readonly _monthName = computed(() => MONTH_NAMES[this._month()]);
  protected readonly _calendar = computed(() => buildCells(this._year(), this._month()));

  protected readonly _yearRange = computed(() => {
    const start = this._yearRangeStart();
    return Array.from({ length: 12 }, (_, i) => start + i);
  });

  private _onChange: (v: Date | Date[] | DateRange | null) => void = () => {};
  private _onTouched: () => void = () => {};
  private _rangeStart: Date | null = null;

  protected readonly computedClass = computed(() =>
    cn('inline-block select-none rounded-lg border border-border bg-card p-3', this.class()),
  );

  protected _isSelected(date: Date): boolean {
    const v = this.value();
    if (!v) return false;
    const mode = this.mode();
    if (mode === 'single') return sameDay(date, v as Date);
    if (mode === 'multiple') return (v as Date[]).some((d) => sameDay(d, date));
    if (mode === 'range') {
      const r = v as DateRange;
      return sameDay(date, r.from) || sameDay(date, r.to) || inRange(date, r.from, r.to);
    }
    return false;
  }

  protected _isDisabled(date: Date): boolean {
    const min = this.minDate(),
      max = this.maxDate();
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  }

  protected dayCellClass(cell: CalCell): string {
    const sel = this._isSelected(cell.date);
    return cn(
      'flex h-9 w-9 items-center justify-center rounded text-sm font-medium transition-colors cursor-pointer',
      !cell.inMonth ? 'text-muted-foreground/40' : '',
      cell.isToday && !sel ? 'border border-primary text-primary' : '',
      sel ? 'bg-primary text-primary-foreground' : cell.inMonth ? 'hover:bg-accent hover:text-accent-foreground' : '',
      this._isDisabled(cell.date) ? 'pointer-events-none opacity-30' : '',
    );
  }

  protected monthCellClass(monthIndex: number): string {
    const isCurrent = monthIndex === this._month() && this._year() === this._today.getFullYear();
    const isSelected = monthIndex === this._month();
    return cn(
      'flex h-10 items-center justify-center rounded text-sm font-medium transition-colors cursor-pointer',
      'hover:bg-accent hover:text-accent-foreground',
      isCurrent && !isSelected ? 'border border-primary text-primary' : '',
      isSelected ? 'bg-primary text-primary-foreground' : '',
    );
  }

  protected yearCellClass(year: number): string {
    const isCurrent = year === this._today.getFullYear();
    const isSelected = year === this._year();
    return cn(
      'flex h-10 items-center justify-center rounded text-sm font-medium transition-colors cursor-pointer',
      'hover:bg-accent hover:text-accent-foreground',
      isCurrent && !isSelected ? 'border border-primary text-primary' : '',
      isSelected ? 'bg-primary text-primary-foreground' : '',
    );
  }

  protected _pick(date: Date): void {
    if (this._isDisabled(date)) return;
    const mode = this.mode();
    let next: Date | Date[] | DateRange | null;

    if (mode === 'single') {
      next = sameDay(date, this.value() as Date) ? null : date;
    } else if (mode === 'multiple') {
      const arr = (this.value() as Date[]) ?? [];
      next = arr.some((d) => sameDay(d, date)) ? arr.filter((d) => !sameDay(d, date)) : [...arr, date];
    } else {
      // range mode
      if (!this._rangeStart) {
        this._rangeStart = date;
        next = { from: date, to: null };
      } else {
        const from = this._rangeStart < date ? this._rangeStart : date;
        const to = this._rangeStart < date ? date : this._rangeStart;
        next = { from, to };
        this._rangeStart = null;
      }
    }

    this.value.set(next);
    this._onChange(next);
    this._onTouched();
  }

  protected _pickMonth(monthIndex: number): void {
    this._month.set(monthIndex);
    this._view.set('days');
  }

  protected _pickYear(year: number): void {
    this._year.set(year);
    this._view.set('months');
  }

  protected _toggleView(): void {
    const current = this._view();
    if (current === 'days') {
      this._view.set('months');
    } else if (current === 'months') {
      this._yearRangeStart.set(this._year() - (this._year() % 12));
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
      this._year.update((y) => y - 1);
    } else {
      if (this._month() === 0) {
        this._month.set(11);
        this._year.update((y) => y - 1);
      } else {
        this._month.update((m) => m - 1);
      }
    }
  }

  protected _next(): void {
    const view = this._view();
    if (view === 'years') {
      this._yearRangeStart.update((s) => s + 12);
    } else if (view === 'months') {
      this._year.update((y) => y + 1);
    } else {
      if (this._month() === 11) {
        this._month.set(0);
        this._year.update((y) => y + 1);
      } else {
        this._month.update((m) => m + 1);
      }
    }
  }

  writeValue(value: Date | Date[] | DateRange | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (v: Date | Date[] | DateRange | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(): void {}
}

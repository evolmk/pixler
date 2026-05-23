import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';
import { cn } from '../../utils/cn';

type SearchboxSize = 'sm' | 'default' | 'lg';

const SIZE_WRAPPER: Record<SearchboxSize, string> = {
  sm: 'h-8 text-xs',
  default: 'h-9 text-sm',
  lg: 'h-11 text-base',
};

const SIZE_ICON: Record<SearchboxSize, string> = {
  sm: 'h-3 w-3',
  default: 'h-4 w-4',
  lg: 'h-5 w-5',
};

@Component({
  selector: 'ui-searchbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <!-- Search icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [class]="iconClass()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="pointer-events-none absolute left-2.5 text-muted-foreground"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>

    <!-- Input -->
    <input
      type="search"
      [value]="query()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [class]="inputClass()"
      (input)="_onInput($event)"
      (keydown.escape)="_clear()"
      (blur)="_touched()"
    />

    <!-- Clear button -->
    @if (query() && !disabled()) {
      <button
        type="button"
        class="absolute right-2.5 cursor-pointer text-muted-foreground hover:text-foreground"
        (click)="_clear()"
        aria-label="Clear search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          [class]="iconClass()"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    }

    <!-- Loading spinner -->
    @if (loading()) {
      <svg
        xmlns="http://www.w3.org/2000/svg"
        [class]="iconClass()"
        class="absolute right-2.5 animate-spin text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    }
  `,
})
export class SearchboxComponent {
  readonly query = model<string>('');
  readonly placeholder = input<string>('Search…');
  readonly debounce = input<number>(300);
  readonly size = input<SearchboxSize>('default');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly class = input<string>('');

  /** Emits the debounced query value */
  readonly search = output<string>();

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _input$ = new Subject<string>();
  protected readonly _hasFocus = signal(false);

  constructor() {
    this._input$.pipe(debounceTime(300), takeUntilDestroyed(this._destroyRef)).subscribe((q) => this.search.emit(q));
  }

  protected readonly computedClass = computed(() =>
    cn('relative flex w-full items-center', SIZE_WRAPPER[this.size()], this.class()),
  );

  protected readonly inputClass = computed(() =>
    cn(
      'w-full rounded-md border border-input bg-background pr-8 pl-8',
      'text-foreground placeholder:text-muted-foreground',
      'transition-colors',
      'focus:outline-none focus:ring-1 focus:ring-ring',
      'disabled:cursor-not-allowed disabled:opacity-50',
      '[&::-webkit-search-cancel-button]:appearance-none',
      SIZE_WRAPPER[this.size()],
    ),
  );

  protected readonly iconClass = computed(() => SIZE_ICON[this.size()]);

  protected _onInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.query.set(q);
    this._input$.next(q);
  }

  protected _clear(): void {
    this.query.set('');
    this._input$.next('');
    this.search.emit('');
  }

  protected _touched(): void {
    this._hasFocus.set(false);
  }
}

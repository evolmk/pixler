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

export interface ComboboxOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
}

type ComboboxSize = 'sm' | 'default' | 'lg';

const SIZE_CLASS: Record<ComboboxSize, string> = {
  sm: 'h-7 text-xs',
  default: 'h-9 text-sm',
  lg: 'h-11 text-base',
};

@Component({
  selector: 'ui-combobox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true,
    },
  ],
  host: { '[class]': '"relative inline-block w-full"' },
  template: `
    <!-- Trigger -->
    <button
      type="button"
      [class]="triggerClass()"
      [disabled]="_disabled()"
      (click)="_toggleOpen()"
      [attr.aria-expanded]="_open()"
      aria-haspopup="listbox"
    >
      <span [class]="_selectedLabel() ? 'text-foreground' : 'text-muted-foreground'">
        {{ _selectedLabel() || placeholder() }}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ml-auto h-3.5 w-3.5 text-muted-foreground shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m7 15 5 5 5-5" />
        <path d="m7 9 5-5 5 5" />
      </svg>
    </button>

    <!-- Dropdown -->
    @if (_open()) {
      <div class="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
        <!-- Search input -->
        @if (searchable()) {
          <div class="border-b border-border p-2">
            <input
              #searchInput
              type="text"
              [value]="_query()"
              placeholder="Search…"
              class="w-full rounded border-0 bg-transparent px-1 py-0.5 text-sm focus:outline-none"
              (input)="_query.set($any($event.target).value)"
              (keydown.escape)="_open.set(false)"
              (keydown.arrowdown)="$event.preventDefault()"
            />
          </div>
        }

        <!-- Options list -->
        <ul role="listbox" class="max-h-60 overflow-auto py-1" [attr.aria-label]="placeholder()">
          @if (_filtered().length === 0) {
            <li class="px-3 py-2 text-sm text-muted-foreground">No results</li>
          }
          @for (group of _groups(); track group) {
            @if (group) {
              <li class="px-3 pt-2 pb-0.5 eyebrow text-muted-foreground">
                {{ group }}
              </li>
            }
            @for (opt of _filteredByGroup(group); track opt.value) {
              <li
                role="option"
                [attr.aria-selected]="value() === opt.value"
                [attr.aria-disabled]="opt.disabled"
                [class]="optionClass(opt.value, opt.disabled)"
                (click)="!opt.disabled && _select(opt)"
                (keydown.enter)="!opt.disabled && _select(opt)"
                tabindex="0"
              >
                @if (value() === opt.value) {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-2 h-3.5 w-3.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                } @else {
                  <span class="mr-2 h-3.5 w-3.5 shrink-0"></span>
                }
                {{ opt.label }}
              </li>
            }
          }
        </ul>
      </div>
    }
  `,
})
export class ComboboxComponent implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly options = input.required<ComboboxOption[]>();
  readonly placeholder = input<string>('Select…');
  readonly searchable = input<boolean>(true);
  readonly size = input<ComboboxSize>('default');
  readonly class = input<string>('');

  protected readonly _open = signal(false);
  protected readonly _query = signal('');
  protected readonly _disabled = signal(false);

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly triggerClass = computed(() =>
    cn(
      'flex w-full cursor-pointer items-center rounded-md border border-input bg-background px-3',
      'transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
      'hover:bg-accent/30 disabled:cursor-not-allowed disabled:opacity-50',
      SIZE_CLASS[this.size()],
    ),
  );

  protected readonly _selectedLabel = computed(() => {
    const opt = this.options().find((o) => o.value === this.value());
    return opt?.label ?? '';
  });

  protected readonly _filtered = computed(() => {
    const q = this._query().toLowerCase();
    return q ? this.options().filter((o) => o.label.toLowerCase().includes(q)) : this.options();
  });

  protected readonly _groups = computed(() => {
    const groups = [...new Set(this._filtered().map((o) => o.group ?? ''))];
    return groups;
  });

  protected _filteredByGroup(group: string): ComboboxOption[] {
    return this._filtered().filter((o) => (o.group ?? '') === group);
  }

  protected optionClass(val: string, disabled?: boolean): string {
    return cn(
      'flex cursor-pointer items-center px-3 py-1.5 text-sm transition-colors',
      this.value() === val ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
      disabled ? 'pointer-events-none opacity-50' : '',
    );
  }

  protected _toggleOpen(): void {
    this._open.update((v) => !v);
  }

  protected _select(opt: ComboboxOption): void {
    this.value.set(opt.value);
    this._onChange(opt.value);
    this._onTouched();
    this._open.set(false);
    this._query.set('');
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
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

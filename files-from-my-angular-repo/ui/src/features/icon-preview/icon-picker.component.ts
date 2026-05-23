import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../../components/icon';
import { PopoverComponent, PopoverContentComponent, PopoverTriggerDirective } from '../../components/popover';
import { cn } from '../../utils/cn';
import { ICON_CATALOG, type IconCatalogEntry, resolveIconSlug } from './icon-preview.maps';

/**
 * Visual icon picker. Button trigger shows the current Lucide icon + label;
 * popover holds a searchable grouped grid.
 *
 * Works both as a simple `[value] / (valueChange)` control and as an
 * Angular `ControlValueAccessor`. Accepts either a Lucide slug or a legacy
 * FA/iconm class for inbound values.
 */
@Component({
  selector: 'ui-icon-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    PopoverComponent,
    PopoverContentComponent,
    PopoverTriggerDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconPickerComponent),
      multi: true,
    },
  ],
  host: { '[class]': '"relative inline-block w-full"' },
  template: `
    <ui-popover #popover>
      <button
        type="button"
        uiPopoverTrigger
        [class]="triggerClass()"
        [disabled]="_disabled()"
        [attr.aria-haspopup]="'listbox'"
      >
        @if (_selectedEntry()) {
          <ui-icon [name]="_selectedEntry()!.icon" size="sm" class="shrink-0" />
          <span class="flex-1 text-start truncate">{{ _selectedEntry()!.label }}</span>
        } @else {
          <span class="flex-1 text-start text-muted-foreground">{{ placeholder() }}</span>
        }
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="ml-auto opacity-50 shrink-0"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <ui-popover-content class="!w-[360px] !p-3">
        <input
          type="text"
          [ngModel]="_query()"
          (ngModelChange)="_query.set($event)"
          [placeholder]="searchPlaceholder()"
          class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <div class="mt-3 max-h-[280px] overflow-y-auto space-y-3 pr-1">
          @for (group of _groupedFiltered(); track group.name) {
            <div>
              <div class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">
                {{ group.name }}
              </div>
              <div class="grid grid-cols-7 gap-1">
                @for (opt of group.items; track opt.slug) {
                  <button
                    type="button"
                    [title]="opt.label"
                    [attr.aria-label]="opt.label"
                    [attr.aria-selected]="opt.slug === _currentSlug()"
                    (click)="_select(opt.slug); popover.close()"
                    [class]="_itemClass(opt.slug === _currentSlug())"
                  >
                    <ui-icon [name]="opt.icon" size="default" />
                  </button>
                }
              </div>
            </div>
          }

          @if (_filtered().length === 0) {
            <div class="py-8 text-center text-sm text-muted-foreground">No icons found</div>
          }
        </div>

        @if (clearable() && _currentSlug()) {
          <button
            type="button"
            class="mt-3 w-full text-xs text-muted-foreground hover:text-foreground underline"
            (click)="_select(''); popover.close()"
          >
            Clear selection
          </button>
        }
      </ui-popover-content>
    </ui-popover>
  `,
})
export class IconPickerComponent implements ControlValueAccessor {
  @ViewChild('popover') protected popover!: PopoverComponent;

  readonly value = model<string>('');
  readonly valueChange = output<string>();
  readonly placeholder = input<string>('Select icon');
  readonly searchPlaceholder = input<string>('Search icons...');
  readonly options = input<IconCatalogEntry[]>(ICON_CATALOG);
  readonly clearable = input<boolean>(true);

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly _disabled = signal(false);
  protected readonly _query = signal('');

  protected readonly _currentSlug = computed(() => resolveIconSlug(this.value()));

  protected readonly _selectedEntry = computed<IconCatalogEntry | null>(() => {
    const slug = this._currentSlug();
    if (!slug) return null;
    return this.options().find((o) => o.slug === slug) ?? null;
  });

  protected readonly _filtered = computed(() => {
    const q = this._query().toLowerCase().trim();
    const opts = this.options();
    if (!q) return opts;
    return opts.filter((o) => o.slug.includes(q) || o.label.toLowerCase().includes(q));
  });

  protected readonly _groupedFiltered = computed<{ name: string; items: IconCatalogEntry[] }[]>(() => {
    const groups = new Map<string, IconCatalogEntry[]>();
    for (const opt of this._filtered()) {
      const arr = groups.get(opt.group) ?? [];
      arr.push(opt);
      groups.set(opt.group, arr);
    }
    return Array.from(groups.entries()).map(([name, items]) => ({ name, items }));
  });

  protected readonly triggerClass = computed(() =>
    cn(
      'flex w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-background',
      'h-10 px-3 py-2 text-sm ring-offset-background',
      'hover:border-foreground/25 dark:hover:border-foreground/25',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ),
  );

  protected _itemClass(selected: boolean): string {
    return cn(
      'flex items-center justify-center rounded-md aspect-square p-2 transition-colors',
      selected ? 'bg-primary/10 text-primary ring-1 ring-primary' : 'hover:bg-accent hover:text-accent-foreground',
    );
  }

  protected _select(slug: string): void {
    this.value.set(slug);
    this._onChange(slug);
    this._onTouched();
    this.valueChange.emit(slug);
  }

  writeValue(v: string): void {
    this.value.set(v ?? '');
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

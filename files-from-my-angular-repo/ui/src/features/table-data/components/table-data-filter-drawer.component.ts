import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';
import { DrawerComponent, DrawerContentComponent } from '../../../components/drawer/drawer.component';
import { SeparatorComponent } from '../../../components/separator/separator.component';
import { cn } from '../../../utils/cn';
import {
  TableDataFilterSection,
  TableDataFilterState,
  TableDataFilterValue,
  TableDataRangeValue,
  isFilterActive,
} from '../types/filter.types';
import { FilterCheckboxComponent } from './filters/filter-checkbox.component';
import { SwitchFilterComponent } from '../../../components/switch-filter/switch-filter.component';
import { FilterDateRangeComponent } from './filters/filter-date-range.component';
import { FilterNumberRangeComponent } from './filters/filter-number-range.component';
import { FilterTextSearchComponent } from './filters/filter-text-search.component';
import { FilterSelectComponent } from './filters/filter-select.component';

@Component({
  selector: 'ui-table-data-filter-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    DrawerComponent,
    DrawerContentComponent,
    ButtonComponent,
    SeparatorComponent,
    FilterCheckboxComponent,
    FilterTextSearchComponent,
    FilterNumberRangeComponent,
    FilterDateRangeComponent,
    SwitchFilterComponent,
    FilterSelectComponent,
  ],
  host: { '[class]': 'computedClass()' },
  template: `
    <ui-drawer #drawerRef>
      <ui-drawer-content side="right" size="default" [showClose]="false" class="flex flex-col">
        <!-- Header -->
        <div class="shrink-0 flex items-center justify-between border-b pb-4">
          <div class="flex items-center gap-3">
            <span class="text-lg font-semibold text-foreground">Filters</span>
            @if (pinnedSection(); as pinned) {
              <div class="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 p-0.5">
                @for (opt of pinned.options ?? []; track opt) {
                  <button
                    type="button"
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors"
                    [class]="
                      getStringValue(pinned.key) === opt
                        ? 'bg-foreground text-background shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    "
                    (click)="onValueChange(pinned.key, opt)"
                  >
                    {{ opt }}
                  </button>
                }
              </div>
            }
          </div>
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            (click)="close()"
          >
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
              class="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span class="sr-only">Close</span>
          </button>
        </div>

        <!-- Sections (scrollable) -->
        <div class="flex-1 min-h-0 overflow-y-auto py-4 space-y-6">
          @for (section of orderedSections(); track section.key) {
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-semibold text-foreground">{{ section.label }}</h3>
                @if (isSectionActive(section.key)) {
                  <button
                    type="button"
                    class="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    (click)="clearSection(section.key, section.type)"
                  >
                    Clear
                  </button>
                }
              </div>

              @switch (section.type) {
                @case ('checkbox') {
                  <ui-filter-checkbox
                    [options]="section.options ?? []"
                    [selectOptions]="section.selectOptions"
                    [maxLabelCount]="section.maxLabelCount ?? 0"
                    [value]="getCheckboxValue(section.key)"
                    (valueChange)="onValueChange(section.key, $event)"
                  />
                }
                @case ('tags') {
                  <ui-filter-checkbox
                    [options]="section.options ?? []"
                    [selectOptions]="section.selectOptions"
                    [maxLabelCount]="section.maxLabelCount ?? 0"
                    [value]="getCheckboxValue(section.key)"
                    (valueChange)="onValueChange(section.key, $event)"
                  />
                }
                @case ('multi-substring') {
                  <ui-filter-checkbox
                    [options]="section.options ?? []"
                    [selectOptions]="section.selectOptions"
                    [maxLabelCount]="section.maxLabelCount ?? 0"
                    [value]="getCheckboxValue(section.key)"
                    (valueChange)="onValueChange(section.key, $event)"
                  />
                }
                @case ('text-search') {
                  <ui-filter-text-search
                    [value]="getStringValue(section.key)"
                    (valueChange)="onValueChange(section.key, $event)"
                  />
                }
                @case ('number-range') {
                  <ui-filter-number-range
                    [value]="getRangeValue(section.key)"
                    (valueChange)="onValueChange(section.key, $event)"
                  />
                }
                @case ('date-range') {
                  <ui-filter-date-range
                    [value]="getRangeValue(section.key)"
                    (valueChange)="onValueChange(section.key, $event)"
                  />
                }
                @case ('select') {
                  <ui-filter-select
                    [options]="section.options ?? []"
                    [value]="getStringValue(section.key)"
                    (valueChange)="onValueChange(section.key, $event)"
                  />
                }
                @case ('boolean') {
                  <ui-switch-filter
                    [label]="section.label"
                    [value]="getBooleanValue(section.key)"
                    (valueChange)="onValueChange(section.key, $event)"
                  />
                }
              }
            </div>

            @if (!$last) {
              <ui-separator />
            }
          }
        </div>

        <!-- Footer -->
        <div class="shrink-0 flex gap-2 border-t pt-4">
          <button ui-button variant="outline" class="flex-1" type="button" (click)="onClearAll()">
            Clear all filters
          </button>
          @if (applyMode() === 'manual') {
            <button ui-button variant="default" class="flex-1" type="button" (click)="onSave()">Save</button>
          }
        </div>
      </ui-drawer-content>
    </ui-drawer>
  `,
})
export class TableDataFilterDrawerComponent {
  @ViewChild('drawerRef') private _drawer!: DrawerComponent;

  readonly sections = input.required<TableDataFilterSection[]>();

  /** Pinned section (rendered in header, e.g. Active/Archived toggle). */
  protected readonly pinnedSection = computed(() => this.sections().find((s) => s.pinned));

  /** Non-pinned sections sorted by type: text/checkbox → number-range → boolean → date-range. */
  protected readonly orderedSections = computed(() => {
    const order: Record<string, number> = {
      checkbox: 0,
      tags: 0,
      'text-search': 0,
      select: 0,
      'number-range': 1,
      boolean: 2,
      'date-range': 3,
    };
    return [...this.sections()].filter((s) => !s.pinned).sort((a, b) => (order[a.type] ?? 0) - (order[b.type] ?? 0));
  });
  readonly state = input<TableDataFilterState>({});
  readonly defaultState = input<TableDataFilterState>({});
  readonly applyMode = input<'immediate' | 'manual'>('immediate');
  readonly class = input<string>('');

  readonly stateChange = output<TableDataFilterState>();
  readonly clearAll = output<void>();

  /** Local working copy — used in manual mode. In immediate mode, reflects live state. */
  protected readonly _localState = signal<TableDataFilterState>({});

  open(): void {
    this._localState.set(structuredClone(this.state()));
    this._drawer.open();
  }

  close(): void {
    this._drawer.close();
  }

  protected isSectionActive(sectionKey: string): boolean {
    const val = this._localState()[sectionKey];
    if (val == null || !isFilterActive(val)) return false;
    const defVal = this.defaultState()[sectionKey];
    if (defVal != null && JSON.stringify(val) === JSON.stringify(defVal)) return false;
    return true;
  }

  protected getCheckboxValue(sectionKey: string): string[] {
    const val = this._localState()[sectionKey];
    return Array.isArray(val) ? val : [];
  }

  protected getStringValue(sectionKey: string): string {
    const val = this._localState()[sectionKey];
    return typeof val === 'string' ? val : '';
  }

  protected getRangeValue(sectionKey: string): TableDataRangeValue | null {
    const val = this._localState()[sectionKey];
    return val != null && typeof val === 'object' && !Array.isArray(val) ? val : null;
  }

  protected getBooleanValue(sectionKey: string): boolean | null {
    const val = this._localState()[sectionKey];
    return typeof val === 'boolean' ? val : null;
  }

  protected onValueChange(sectionKey: string, value: TableDataFilterValue): void {
    const current = { ...this._localState() };
    current[sectionKey] = value;
    this._localState.set(current);

    if (this.applyMode() === 'immediate') {
      this.stateChange.emit(structuredClone(current));
    }
  }

  protected clearSection(sectionKey: string, type: string): void {
    const current = { ...this._localState() };
    const defVal = this.defaultState()[sectionKey];
    if (defVal != null) {
      current[sectionKey] = structuredClone(defVal);
    } else if (type === 'checkbox' || type === 'tags' || type === 'multi-substring') {
      current[sectionKey] = [];
    } else if (type === 'text-search' || type === 'select') {
      current[sectionKey] = '';
    } else if (type === 'number-range' || type === 'date-range') {
      current[sectionKey] = { min: null, max: null };
    } else if (type === 'boolean') {
      current[sectionKey] = null;
    }
    this._localState.set(current);

    if (this.applyMode() === 'immediate') {
      this.stateChange.emit(structuredClone(current));
    }
  }

  protected onClearAll(): void {
    const def = structuredClone(this.defaultState());
    this._localState.set(def);
    this.clearAll.emit();
    this.stateChange.emit(def);
    this.close();
  }

  protected onSave(): void {
    this.stateChange.emit(structuredClone(this._localState()));
    this._drawer.close();
  }

  protected readonly computedClass = computed(() => cn('block', this.class()));
}

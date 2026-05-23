import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewEncapsulation,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Plus, Settings2 } from 'lucide-angular';
import { SelectComponent } from '../../../components/select/select.component';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { IconComponent } from '../../../components/icon/icon.component';
import { SearchboxComponent } from '../../../components/searchbox/searchbox.component';
import { SwitchFilterComponent } from '../../../components/switch-filter/switch-filter.component';
import { TabsComponent, TabsListComponent, TabsTriggerComponent } from '../../../components/tabs/tabs.component';
import { cn } from '../../../utils/cn';
import { TableDataTab } from '../types/tab.types';
import { InlineFilterConfig } from './table-data.component';

@Component({
  selector: 'ui-table-data-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgTemplateOutlet,
    SelectComponent,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    BadgeComponent,
    IconComponent,
    SearchboxComponent,
    SwitchFilterComponent,
    ButtonComponent,
  ],
  host: { '[class]': 'computedClass()' },
  template: `
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <!-- Left: title, description, or tabs -->
      @if (title()) {
        <h2 class="text-3xl font-bold text-foreground">{{ title() }}</h2>
      } @else if (description()) {
        <p class="text-muted-foreground">{{ description() }}</p>
      } @else if (tabs().length > 0) {
        <ui-tabs variant="underline" [value]="activeTab()" (valueChange)="activeTab.set($event)">
          <ui-tabs-list>
            @for (tab of tabs(); track tab.value) {
              <ui-tabs-trigger [value]="tab.value" class="gap-2">
                {{ tab.label }}
                <ui-badge
                  [variant]="activeTab() === tab.value ? 'info' : 'secondary'"
                  shape="default"
                  class="rounded-full px-2 py-0 text-xs"
                >
                  {{ tab.count }}
                </ui-badge>
              </ui-tabs-trigger>
            }
          </ui-tabs-list>
        </ui-tabs>
      }

      <!-- Left: projected content (hidden on mobile — use filter drawer instead) -->
      @if (headerLeftRef()) {
        <div class="hidden lg:contents">
          <ng-container *ngTemplateOutlet="headerLeftRef()!" />
        </div>
      }

      <!-- Inline filters (auto-generated from column definitions) -->
      @if (inlineFilters().length > 0) {
        <div class="hidden sm:flex items-center gap-3 min-w-0 flex-1 lg:flex-initial">
          @for (filter of inlineFilters(); track filter.key) {
            @if (filter.type === 'group-select') {
              <ui-select
                [options]="filter.options ?? []"
                [value]="$any(inlineFilterState()[filter.key]) ?? []"
                (valueChange)="inlineFilterChange.emit({ key: filter.key, value: $event })"
                [multiple]="filter.multiple ?? false"
                [searchable]="filter.searchable ?? false"
                [groupSelect]="filter.groupSelect ?? false"
                [maxLabelCount]="filter.maxLabelCount ?? 1"
                [placeholder]="filter.placeholder ?? 'Select'"
                class="flex-1 lg:flex-none lg:!w-48"
              />
            } @else if (filter.type === 'switch') {
              <ui-switch-filter
                [label]="filter.label"
                [value]="$any(inlineFilterState()[filter.key]) ?? null"
                (valueChange)="inlineFilterChange.emit({ key: filter.key, value: $event })"
              />
            }
          }
          <button
            type="button"
            class="eyebrow text-muted-foreground hover:text-foreground transition-colors"
            [class.invisible]="!hasActiveInlineFilters()"
            (click)="clearInlineFilters.emit()"
          >
            Clear Filters
          </button>
        </div>
      }

      <!-- Sync spinner -->
      @if (syncing()) {
        <div class="flex items-center gap-1.5 text-muted-foreground" title="Loading additional data...">
          <svg
            class="size-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span class="text-xs hidden lg:inline">Syncing</span>
        </div>
      }

      <!-- Right controls -->
      <div class="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
        <!-- Inline filters (hidden on mobile — use filter drawer instead) -->
        @if (filtersRef()) {
          <div class="hidden lg:contents">
            <ng-container *ngTemplateOutlet="filtersRef()!" />
          </div>
        }

        <!-- Search -->
        <ui-searchbox
          [query]="searchQuery()"
          (queryChange)="searchQuery.set($event)"
          placeholder=""
          size="default"
          class="flex-1 sm:flex-none sm:w-40 lg:w-[240px]"
        />

        <!-- Column settings button -->
        @if (showColumnSettings()) {
          <ui-button variant="outline" size="icon" class="size-9" (click)="columnSettingsClick.emit()">
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
              class="size-4"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span class="sr-only">Manage columns</span>
          </ui-button>
        }

        <!-- Filter button + optional badge + clear -->
        @if (showFilterButton()) {
          <div class="flex items-center gap-1">
            <ui-button variant="outline" size="default" class="gap-1 px-2 lg:px-4" (click)="filterClick.emit()">
              <ui-icon [name]="Settings2Icon" [size]="16" [strokeWidth]="2" />
              <span class="hidden lg:inline">Filter</span>
              @if (activeFilterCount() > 0) {
                <ui-badge variant="info" shape="pill" class="px-1.5 py-0 text-xs">
                  {{ activeFilterCount() }}
                </ui-badge>
                <button
                  type="button"
                  class="-mr-1 inline-flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground hover:text-destructive transition-colors"
                  title="Clear filters"
                  (click)="onClearFilters($event)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  <span class="sr-only">Clear filters</span>
                </button>
              }
            </ui-button>
          </div>
        }

        <!-- Built-in Create button -->
        @if (showCreate()) {
          <button ui-button size="icon" class="gap-1 lg:w-auto lg:px-4" type="button" (click)="createClick.emit()">
            <ui-icon [name]="PlusIcon" [size]="16" />
            <span class="hidden lg:inline">Create</span>
          </button>
        }

        <!-- Projected action buttons (fallback for unmigrated pages) -->
        @if (actionsRef()) {
          <ng-container *ngTemplateOutlet="actionsRef()!" />
        }
      </div>
    </div>
  `,
})
export class TableDataHeaderComponent {
  protected readonly Settings2Icon = Settings2;
  protected readonly PlusIcon = Plus;
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly tabs = input<TableDataTab[]>([]);
  readonly activeTab = model<string>('');
  readonly searchQuery = model<string>('');
  readonly activeFilterCount = input<number>(0);
  readonly syncing = input<boolean>(false);
  readonly showFilterButton = input<boolean>(true);
  readonly showColumnSettings = input<boolean>(false);
  readonly showCreate = input<boolean>(false);
  readonly actionsRef = input<TemplateRef<unknown> | null>(null);
  readonly filtersRef = input<TemplateRef<unknown> | null>(null);
  readonly headerLeftRef = input<TemplateRef<unknown> | null>(null);
  readonly inlineFilters = input<InlineFilterConfig[]>([]);
  readonly inlineFilterState = input<Record<string, unknown>>({});
  readonly hasActiveInlineFilters = input<boolean>(false);
  readonly class = input<string>('');

  readonly createClick = output<void>();
  readonly filterClick = output<void>();
  readonly clearFilters = output<void>();
  readonly columnSettingsClick = output<void>();
  readonly inlineFilterChange = output<{ key: string; value: unknown }>();
  readonly clearInlineFilters = output<void>();

  protected onClearFilters(event: MouseEvent): void {
    event.stopPropagation();
    this.clearFilters.emit();
  }

  protected readonly computedClass = computed(() => cn('block', this.class()));
}

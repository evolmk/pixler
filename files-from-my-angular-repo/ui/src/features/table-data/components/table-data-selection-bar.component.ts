import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../components/button/button.component';
import { SwitchComponent } from '../../../components/switch/switch.component';
import { GroupSelectComponent } from '../../group-select/group-select.component';
import { TableDataColumn } from '../types/column.types';

@Component({
  selector: 'ui-table-data-selection-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, ButtonComponent, SwitchComponent, GroupSelectComponent],
  template: `
    <div class="flex items-center gap-3 rounded-lg bg-primary px-4 py-2.5 text-primary-foreground">
      <!-- Close button -->
      <button
        type="button"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-primary-foreground/10 transition-colors"
        (click)="clearSelection.emit()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span class="sr-only">Clear selection</span>
      </button>

      <!-- Selected count -->
      <span class="font-medium whitespace-nowrap"> {{ selectedCount() }} Selected </span>

      <!-- Separator -->
      <div class="h-5 w-px bg-primary-foreground/30"></div>

      <!-- Field dropdown -->
      <select
        class="h-9 w-44 cursor-pointer rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-2.5 text-primary-foreground focus:outline-none focus:ring-1 focus:ring-primary-foreground/40"
        [ngModel]="_selectedField()"
        (ngModelChange)="_selectedField.set($event)"
      >
        <option value="" disabled class="text-muted-foreground bg-popover">Choose field...</option>
        @for (opt of fieldOptions(); track opt.value) {
          <option [value]="opt.value" class="text-foreground bg-popover">{{ opt.label }}</option>
        }
      </select>

      <!-- Dynamic value input -->
      @if (activeEditType() === 'text') {
        <input
          type="text"
          class="h-9 w-48 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary-foreground/40"
          placeholder="Enter value..."
          [ngModel]="_textValue()"
          (ngModelChange)="_textValue.set($event)"
        />
      } @else if (activeEditType() === 'number') {
        <input
          type="number"
          class="h-9 w-36 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary-foreground/40"
          placeholder="0"
          [ngModel]="_numberValue()"
          (ngModelChange)="_numberValue.set($event)"
        />
      } @else if (activeEditType() === 'boolean') {
        <ui-switch [checked]="_boolValue()" (checkedChange)="_boolValue.set($event)" size="sm" [showValue]="true" />
      } @else if (activeEditType() === 'date') {
        <input
          type="date"
          class="h-9 w-44 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 text-primary-foreground focus:outline-none focus:ring-1 focus:ring-primary-foreground/40"
          [ngModel]="_dateStringValue()"
          (ngModelChange)="onDateStringChange($event)"
        />
      } @else if (activeEditType() === 'select') {
        <select
          class="h-9 w-44 cursor-pointer rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-2.5 text-primary-foreground focus:outline-none focus:ring-1 focus:ring-primary-foreground/40"
          [ngModel]="_selectValue()"
          (ngModelChange)="_selectValue.set($event)"
        >
          <option value="" disabled class="text-muted-foreground bg-popover">Select...</option>
          @for (opt of activeEditOptions(); track opt.value) {
            <option [value]="opt.value" class="text-foreground bg-popover">{{ opt.label }}</option>
          }
        </select>
      } @else if (activeEditType() === 'group') {
        <ui-group-select [groupTypeAbbr]="activeGroupTypeAbbr()" [(value)]="_groupValue" class="w-56" />
      }

      <!-- Update Selected button -->
      <button
        ui-button
        variant="secondary"
        size="sm"
        [disabled]="!canUpdate() || bulkSaving()"
        [loading]="bulkSaving()"
        loadingText="Saving…"
        (click)="onUpdate()"
      >
        Update Selected
      </button>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Archive Selected button -->
      <button
        ui-button
        variant="secondary"
        size="sm"
        class="text-destructive hover:text-destructive"
        [disabled]="bulkSaving()"
        [loading]="bulkSaving()"
        loadingText="Archiving…"
        (click)="bulkArchive.emit()"
      >
        Archive Selected
      </button>
    </div>
  `,
})
export class TableDataSelectionBarComponent {
  readonly selectedCount = input.required<number>();
  readonly columns = input.required<TableDataColumn<any>[]>();
  /** When true, both Update Selected and Archive Selected show a spinner and stay disabled. */
  readonly bulkSaving = input<boolean>(false);

  readonly clearSelection = output<void>();
  readonly bulkUpdate = output<{ field: string; value: unknown }>();
  readonly bulkArchive = output<void>();

  protected readonly _selectedField = signal('');
  protected readonly _textValue = signal('');
  protected readonly _numberValue = signal<number | null>(null);
  protected readonly _boolValue = signal(false);
  protected readonly _dateValue = signal<Date | null>(null);
  protected readonly _selectValue = signal('');
  protected readonly _groupValue = signal('');

  /** Options for the field dropdown — only editable columns. */
  readonly fieldOptions = computed<{ value: string; label: string }[]>(() =>
    this.columns()
      .filter((c) => c.editable)
      .map((c) => ({ value: c.key, label: c.label })),
  );

  /** The editType of the currently selected field. */
  readonly activeEditType = computed(() => {
    const field = this._selectedField();
    if (!field) return null;
    return this.columns().find((c) => c.key === field)?.editType ?? null;
  });

  /** Date value as YYYY-MM-DD string for native date input. */
  readonly _dateStringValue = computed(() => {
    const d = this._dateValue();
    if (!d) return '';
    return d.toISOString().split('T')[0];
  });

  /** Edit options for select-type fields. */
  readonly activeEditOptions = computed<{ value: string; label: string }[]>(() => {
    const field = this._selectedField();
    if (!field) return [];
    const col = this.columns().find((c) => c.key === field);
    return col?.editOptions?.map((o) => ({ value: o.value, label: o.label })) ?? [];
  });

  /** Group type abbreviation for the active group-edit column. */
  readonly activeGroupTypeAbbr = computed(() => {
    const field = this._selectedField();
    if (!field) return '';
    const col = this.columns().find((c) => c.key === field);
    return col?.cellData?.groupTypeAbbr ?? '';
  });

  /** Whether the Update button should be enabled. */
  readonly canUpdate = computed(() => {
    const type = this.activeEditType();
    if (!type) return false;
    switch (type) {
      case 'text':
        return this._textValue().trim().length > 0;
      case 'number':
        return this._numberValue() != null;
      case 'boolean':
        return true;
      case 'date':
        return this._dateValue() != null;
      case 'select':
        return !!this._selectValue();
      case 'group':
        return !!this._groupValue();
      default:
        return false;
    }
  });

  protected onDateStringChange(value: string): void {
    this._dateValue.set(value ? new Date(value + 'T00:00:00') : null);
  }

  protected onUpdate(): void {
    const type = this.activeEditType();
    const field = this._selectedField();
    if (!field || !type) return;

    let value: unknown;
    switch (type) {
      case 'text':
        value = this._textValue();
        break;
      case 'number':
        value = this._numberValue();
        break;
      case 'boolean':
        value = this._boolValue();
        break;
      case 'date':
        value = this._dateValue();
        break;
      case 'select':
        value = this._selectValue();
        break;
      case 'group':
        value = this._groupValue();
        break;
    }

    this.bulkUpdate.emit({ field, value });
  }
}

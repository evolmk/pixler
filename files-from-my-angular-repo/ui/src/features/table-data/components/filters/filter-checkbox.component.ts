import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';
import { SelectComponent, type SelectOption } from '../../../../components/select/select.component';
import { TableDataFilterSelectOption } from '../../types/filter.types';

@Component({
  selector: 'ui-filter-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [SelectComponent],
  template: `
    <ui-select
      [options]="resolvedOptions()"
      [value]="value()"
      [multiple]="true"
      [searchable]="resolvedOptions().length > 8"
      [groupSelect]="true"
      [maxLabelCount]="maxLabelCount()"
      placeholder="Any"
      (valueChange)="onValueChange($event)"
    />
  `,
})
export class FilterCheckboxComponent {
  readonly maxLabelCount = input<number>(0);
  readonly options = input<string[]>([]);
  /** Pre-built select options with optional group headers (takes precedence over options). */
  readonly selectOptions = input<TableDataFilterSelectOption[]>();
  readonly value = input<string[]>([]);
  readonly valueChange = output<string[]>();

  protected readonly resolvedOptions = computed<SelectOption[]>(() => {
    const grouped = this.selectOptions();
    if (grouped && grouped.length > 0) {
      return grouped;
    }

    // Flat string options — sort with empty first, map to SelectOption
    const opts = this.options();
    const sorted = [...opts].sort((a, b) => {
      if (a === '') return -1;
      if (b === '') return 1;
      return a.localeCompare(b);
    });
    return sorted.map((o) => ({
      value: o,
      label: o === '' ? '[No Group]' : o,
    }));
  });

  protected onValueChange(val: string | string[]): void {
    this.valueChange.emit(Array.isArray(val) ? val : [val]);
  }
}

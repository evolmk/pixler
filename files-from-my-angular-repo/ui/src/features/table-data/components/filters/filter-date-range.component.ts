import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';
import { DatePickerComponent } from '../../../../components/date-picker/date-picker.component';
import { TableDataRangeValue } from '../../types/filter.types';

@Component({
  selector: 'ui-filter-date-range',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePickerComponent],
  template: `
    <div class="flex items-center gap-2">
      <ui-date-picker
        [value]="fromDate()"
        placeholder="From"
        dateFormat="YYYY-MM-DD"
        (valueChange)="onFromChange($event)"
        class="flex-1"
      />
      <span class="text-xs text-muted-foreground">to</span>
      <ui-date-picker
        [value]="toDate()"
        placeholder="To"
        dateFormat="YYYY-MM-DD"
        (valueChange)="onToChange($event)"
        class="flex-1"
      />
    </div>
  `,
})
export class FilterDateRangeComponent {
  readonly value = input<TableDataRangeValue | null>(null);
  readonly valueChange = output<TableDataRangeValue>();

  protected readonly fromDate = computed(() => {
    const v = this.value()?.min;
    return v ? new Date(v as string) : null;
  });

  protected readonly toDate = computed(() => {
    const v = this.value()?.max;
    return v ? new Date(v as string) : null;
  });

  protected onFromChange(date: Date | null): void {
    const current = this.value() ?? {};
    this.valueChange.emit({
      ...current,
      min: date ? date.toISOString().split('T')[0] : null,
    });
  }

  protected onToChange(date: Date | null): void {
    const current = this.value() ?? {};
    this.valueChange.emit({
      ...current,
      max: date ? date.toISOString().split('T')[0] : null,
    });
  }
}

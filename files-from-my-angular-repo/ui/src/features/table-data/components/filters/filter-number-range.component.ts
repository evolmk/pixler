import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';
import { InputComponent } from '../../../../components/input/input.component';
import { TableDataRangeValue } from '../../types/filter.types';

@Component({
  selector: 'ui-filter-number-range',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [InputComponent],
  template: `
    <div class="flex items-center gap-2">
      <input
        uiInput
        type="number"
        size="sm"
        placeholder="Min"
        [value]="currentMin()"
        (input)="onMinChange($event)"
        class="flex-1"
      />
      <span class="text-xs text-muted-foreground">to</span>
      <input
        uiInput
        type="number"
        size="sm"
        placeholder="Max"
        [value]="currentMax()"
        (input)="onMaxChange($event)"
        class="flex-1"
      />
    </div>
  `,
})
export class FilterNumberRangeComponent {
  readonly value = input<TableDataRangeValue | null>(null);
  readonly valueChange = output<TableDataRangeValue>();

  protected currentMin(): string {
    const v = this.value();
    return v?.min != null ? String(v.min) : '';
  }

  protected currentMax(): string {
    const v = this.value();
    return v?.max != null ? String(v.max) : '';
  }

  protected onMinChange(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const min = raw === '' ? null : Number(raw);
    const current = this.value() ?? {};
    this.valueChange.emit({ ...current, min });
  }

  protected onMaxChange(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const max = raw === '' ? null : Number(raw);
    const current = this.value() ?? {};
    this.valueChange.emit({ ...current, max });
  }
}

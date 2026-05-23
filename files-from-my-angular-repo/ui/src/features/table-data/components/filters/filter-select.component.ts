import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';
import { SelectComponent, type SelectOption } from '../../../../components/select/select.component';

@Component({
  selector: 'ui-filter-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [SelectComponent],
  template: `
    <ui-select [options]="selectOptions()" [value]="value()" (valueChange)="onValueChange($event)" class="w-48" />
  `,
})
export class FilterSelectComponent {
  readonly options = input<string[]>([]);
  readonly value = input<string>('');
  readonly valueChange = output<string>();

  protected readonly selectOptions = computed<SelectOption[]>(() =>
    this.options().map((o) => ({ value: o, label: o })),
  );

  protected onValueChange(event: string | string[]): void {
    this.valueChange.emit(Array.isArray(event) ? (event[0] ?? '') : event);
  }
}

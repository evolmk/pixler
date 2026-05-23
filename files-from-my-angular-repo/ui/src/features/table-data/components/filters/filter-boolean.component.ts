import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';
import { SwitchComponent } from '../../../../components/switch/switch.component';

@Component({
  selector: 'ui-filter-boolean',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [SwitchComponent],
  template: `
    <div class="flex items-center gap-3">
      <ui-switch [checked]="value() ?? false" (checkedChange)="onToggle($event)" size="sm" />
      <span class="text-muted-foreground">
        {{ value() ? 'Yes' : 'No' }}
      </span>
    </div>
  `,
})
export class FilterBooleanComponent {
  readonly value = input<boolean | null>(null);
  readonly valueChange = output<boolean | null>();

  protected onToggle(checked: boolean): void {
    this.valueChange.emit(checked);
  }
}

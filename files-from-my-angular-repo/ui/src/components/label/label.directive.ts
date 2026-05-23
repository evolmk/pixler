import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { FORM_FIELD_TOKEN } from '../form-field/form-field.component';

@Component({
  selector: 'label[uiLabel]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class LabelComponent {
  readonly required = input<boolean>(false);
  readonly class = input<string>('');

  private readonly _field = inject(FORM_FIELD_TOKEN, { optional: true });

  protected readonly computedClass = computed(() =>
    cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      this._field?.status() === 'error' ? 'text-destructive' : 'text-foreground',
      this.required() ? 'after:ml-0.5 after:text-destructive after:content-["*"]' : '',
      this.class(),
    ),
  );
}

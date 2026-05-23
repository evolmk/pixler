import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { cn } from '../../utils/cn';

export const FORM_FIELD_TOKEN = new InjectionToken<FormFieldComponent>('FORM_FIELD_TOKEN');

type FormMessageType = 'default' | 'error' | 'success' | 'warning';

// ── Form Field (root wrapper) ─────────────────────────────────────────────────

@Component({
  selector: 'ui-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: FORM_FIELD_TOKEN, useExisting: forwardRef(() => FormFieldComponent) }],
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class FormFieldComponent {
  readonly class = input<string>('');
  /** Propagated to FormMessage for colour — set by FormControlComponent or externally */
  readonly status = signal<'default' | 'error' | 'success' | 'warning'>('default');

  protected readonly computedClass = computed(() => cn('flex flex-col gap-1.5', this.class()));
}

// ── Form Message ──────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-form-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class FormMessageComponent {
  readonly type = input<FormMessageType>('default');
  readonly class = input<string>('');

  private readonly _field = inject(FORM_FIELD_TOKEN, { optional: true });

  protected readonly computedClass = computed(() => {
    const t = this.type();
    const fieldStatus = this._field?.status();
    const effective = t !== 'default' ? t : (fieldStatus ?? 'default');
    return cn(
      'text-xs font-medium',
      effective === 'error'
        ? 'text-destructive'
        : effective === 'success'
          ? 'text-green-600 dark:text-green-400'
          : effective === 'warning'
            ? 'text-yellow-600 dark:text-yellow-400'
            : 'text-muted-foreground',
      this.class(),
    );
  });
}

// ── Form Control (description / help text wrapper) ───────────────────────────

@Component({
  selector: 'ui-form-control',
  standalone: true,
  imports: [FormMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"relative"' },
  template: `
    <ng-content />
    @if (errorMessage()) {
      <ui-form-message type="error">{{ errorMessage() }}</ui-form-message>
    } @else if (helpText()) {
      <ui-form-message>{{ helpText() }}</ui-form-message>
    }
  `,
})
export class FormControlComponent {
  readonly errorMessage = input<string>('');
  readonly helpText = input<string>('');
}

import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { SpinnerComponent } from '../spinner/spinner.component';

export const INPUT_GROUP_TOKEN = new InjectionToken<InputGroupComponent>('INPUT_GROUP_TOKEN');

type InputGroupSize = 'sm' | 'default' | 'lg';

const ADDON_SIZE: Record<InputGroupSize, string> = {
  sm: 'h-7 px-2 text-xs',
  default: 'h-9 px-3 text-base md:text-sm',
  lg: 'h-11 px-4 text-base',
};

// ── Root ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-input-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      ui-input-group > *:first-child:not(:last-child) {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }
      ui-input-group > *:last-child:not(:first-child) {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
      ui-input-group > *:not(:first-child):not(:last-child) {
        border-radius: 0 !important;
      }
    `,
  ],
  providers: [{ provide: INPUT_GROUP_TOKEN, useExisting: forwardRef(() => InputGroupComponent) }],
  host: { '[class]': '"flex w-full items-stretch"' },
  template: `<ng-content />`,
})
export class InputGroupComponent {
  readonly size = input<InputGroupSize>('default');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
}

// ── Addon ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-input-addon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class InputAddonComponent {
  readonly class = input<string>('');

  private readonly _group = inject(INPUT_GROUP_TOKEN, { optional: true });

  protected readonly computedClass = computed(() => {
    const size = this._group?.size() ?? 'default';
    return cn(
      'inline-flex items-center justify-center border border-input bg-muted text-muted-foreground',
      'first:rounded-l-md first:border-r-0 last:rounded-r-md last:border-l-0',
      ADDON_SIZE[size],
      this.class(),
    );
  });
}

// ── Loading spinner inside group ──────────────────────────────────────────────

@Component({
  selector: 'ui-input-group-spinner',
  standalone: true,
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"inline-flex items-center justify-center px-2 text-muted-foreground"',
    '[attr.aria-hidden]': '"true"',
  },
  template: `<ui-spinner size="sm" />`,
})
export class InputGroupSpinnerComponent {}

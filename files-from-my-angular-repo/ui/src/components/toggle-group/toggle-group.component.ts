import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

export const TOGGLE_GROUP_TOKEN = new InjectionToken<ToggleGroupComponent>('TOGGLE_GROUP_TOKEN');

export type ToggleGroupMode = 'single' | 'multiple';
type ToggleGroupSize = 'sm' | 'default' | 'lg';

// Item heights are one step smaller than the button equivalents so that the
// wrapper's p-0.5 frame produces a total height matching uiButton at the
// same size (sm → 32px, default → 36px, lg → 40px).
const SIZE_CLASS: Record<ToggleGroupSize, string> = {
  sm: 'h-7 px-2.5 text-xs',
  default: 'h-8 px-3 text-sm',
  lg: 'h-9 px-4 text-base',
};

// ── Root ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-toggle-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: TOGGLE_GROUP_TOKEN, useExisting: forwardRef(() => ToggleGroupComponent) },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleGroupComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"group"',
  },
  template: `<ng-content />`,
})
export class ToggleGroupComponent implements ControlValueAccessor {
  readonly value = model<string | string[]>('');
  readonly mode = input<ToggleGroupMode>('single');
  readonly size = input<ToggleGroupSize>('default');
  readonly disabled = signal(false);
  readonly class = input<string>('');

  readonly valueChange = output<string | string[]>();

  private _onChange: (v: string | string[]) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center rounded-md border border-input bg-muted p-px gap-0.5', this.class()),
  );

  isActive(val: string): boolean {
    const v = this.value();
    return Array.isArray(v) ? v.includes(val) : v === val;
  }

  toggle(val: string): void {
    if (this.disabled()) return;
    let next: string | string[];
    if (this.mode() === 'multiple') {
      const arr = Array.isArray(this.value()) ? (this.value() as string[]) : [];
      next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
    } else {
      next = this.value() === val ? '' : val;
    }
    this.value.set(next);
    this._onChange(next);
    this._onTouched();
    this.valueChange.emit(next);
  }

  writeValue(value: string | string[]): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (v: string | string[]) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}

// ── Item ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-toggle-group-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.aria-pressed]': '_group.isActive(value())',
    '[attr.data-state]': '_group.isActive(value()) ? "on" : "off"',
    '(click)': '_group.toggle(value())',
  },
  template: `<ng-content />`,
})
export class ToggleGroupItemComponent {
  readonly value = input.required<string>();
  readonly class = input<string>('');

  protected readonly _group = inject(TOGGLE_GROUP_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex cursor-pointer items-center justify-center gap-1 rounded font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      this._group.isActive(this.value())
        ? 'bg-background text-foreground'
        : 'text-muted-foreground hover:text-foreground',
      SIZE_CLASS[this._group.size()],
      this.class(),
    ),
  );
}

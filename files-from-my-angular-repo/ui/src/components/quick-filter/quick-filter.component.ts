import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';
import { cn } from '../../utils/cn';

export interface QuickFilterButton {
  label: string;
  value: string;
  /** Optional color classes applied when active (e.g. 'bg-green-600 border-green-600 text-white') */
  activeClass?: string;
  /** Optional color classes applied when inactive (e.g. 'text-green-600 border-green-300') */
  inactiveClass?: string;
}

@Component({
  selector: 'ui-quick-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    @for (btn of buttons(); track btn.value) {
      <button type="button" [class]="buttonClass(btn.value)" (click)="toggle(btn.value)">
        {{ btn.label }}
      </button>
    }
  `,
})
export class QuickFilterComponent {
  readonly buttons = input.required<QuickFilterButton[]>();
  /**
   * Active value(s). Single-select mode (default) accepts `string | null`;
   * multi-select mode (`multiple = true`) accepts `string[] | null`.
   */
  readonly value = input<string | string[] | null>(null);
  readonly variant = input<'primary' | 'outline'>('outline');
  /** When true, multiple buttons can be active at once and `value` is treated as an array. */
  readonly multiple = input<boolean>(false);
  readonly class = input<string>('');

  readonly valueChange = output<string | string[] | null>();

  protected readonly computedClass = computed(() => cn('flex flex-wrap items-center gap-1.5', this.class()));

  protected buttonClass(val: string): string {
    const active = this.isActive(val);
    const btn = this.buttons().find((b) => b.value === val);
    const base = 'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer';

    if (active) {
      if (btn?.activeClass) return cn(base, btn.activeClass);
      return cn(
        base,
        this.variant() === 'primary'
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-foreground bg-foreground text-background',
      );
    }

    if (btn?.inactiveClass) return cn(base, btn.inactiveClass, 'hover:opacity-80');
    return cn(base, 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground');
  }

  private isActive(val: string): boolean {
    const v = this.value();
    return Array.isArray(v) ? v.includes(val) : v === val;
  }

  protected toggle(val: string): void {
    if (this.multiple()) {
      const current = Array.isArray(this.value()) ? (this.value() as string[]) : [];
      const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
      this.valueChange.emit(next.length ? next : null);
      return;
    }
    this.valueChange.emit(this.value() === val ? null : val);
  }
}

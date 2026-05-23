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

export const LIST_GROUP_TOKEN = new InjectionToken<ListGroupComponent>('LIST_GROUP_TOKEN');

type ListGroupVariant = 'default' | 'flush';

// ── Root ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-list-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: LIST_GROUP_TOKEN, useExisting: forwardRef(() => ListGroupComponent) }],
  host: { '[class]': 'computedClass()', '[attr.role]': '"list"' },
  template: `<ng-content />`,
})
export class ListGroupComponent {
  readonly variant = input<ListGroupVariant>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-col',
      this.variant() === 'default'
        ? 'rounded-lg border border-border overflow-hidden divide-y divide-border'
        : 'divide-y divide-border',
      this.class(),
    ),
  );
}

// ── Item ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-list-group-item, a[uiListGroupItem], button[uiListGroupItem]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()', '[attr.role]': '"listitem"' },
  template: `<ng-content />`,
})
export class ListGroupItemComponent {
  readonly active = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  private readonly _group = inject(LIST_GROUP_TOKEN, { optional: true });

  protected readonly computedClass = computed(() =>
    cn(
      'flex items-center px-4 py-3 text-sm transition-colors',
      this.active()
        ? 'bg-primary text-primary-foreground'
        : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
      this.disabled() ? 'pointer-events-none opacity-50' : '',
      this.class(),
    ),
  );
}

import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';

/** Color map for known part parent groups. Apps can extend via the colorMap input. */
const DEFAULT_GROUP_COLORS: Record<string, string> = {
  LAZAR: 'text-green-600 dark:text-green-400',
  PURCHASED: 'text-amber-600 dark:text-amber-400',
  MATERIAL: 'text-blue-600 dark:text-blue-400',
  TOOLING: 'text-red-600 dark:text-red-400',
};

@Component({
  selector: 'ui-cell-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"flex flex-col gap-0.5"' },
  template: `
    @if (typeName() || groupName()) {
      <span class="text-xs leading-tight" [class]="typeColorClass()">{{ typeName() }}</span>
      <span class="text-xs font-medium text-foreground leading-tight">{{ groupName() }}</span>
    } @else {
      <span class="text-muted-foreground">—</span>
    }
  `,
})
export class CellGroupComponent {
  readonly typeName = input<string>('');
  readonly groupName = input<string>('');
  /** Optional override map of uppercase group name → Tailwind color classes. */
  readonly colorMap = input<Record<string, string>>({});

  protected readonly typeColorClass = computed(() => {
    const name = this.typeName().toUpperCase();
    const custom = this.colorMap();
    return custom[name] ?? DEFAULT_GROUP_COLORS[name] ?? 'text-muted-foreground';
  });
}

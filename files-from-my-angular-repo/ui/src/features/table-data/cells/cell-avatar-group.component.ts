import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import {
  AvatarComponent,
  AvatarFallbackComponent,
  AvatarGroupComponent,
} from '../../../components/avatar/avatar.component';
import { TooltipDirective } from '../../../directives/tooltip.directive';
import { cn } from '../../../utils/cn';
import { avatarBgFromName } from '../utils/avatar-color';

export interface AvatarGroupItem {
  name: string;
  tooltip?: string;
  tooltipDescription?: string;
  avatarSrc?: string | null;
}

@Component({
  selector: 'ui-cell-avatar-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [AvatarComponent, AvatarFallbackComponent, AvatarGroupComponent, TooltipDirective],
  host: { '[class]': 'computedClass()' },
  template: `
    @if (items().length === 0) {
      <span class="text-muted-foreground">—</span>
    } @else {
      <ui-avatar-group [max]="max()">
        @for (item of displayItems(); track $index) {
          <ui-avatar
            size="xs"
            class="transition-transform hover:-translate-x-2 hover:scale-110"
            [uiTooltip]="item.tooltip || item.name"
            [uiTooltipDescription]="item.tooltipDescription || ''"
            uiTooltipPlacement="top"
          >
            <ui-avatar-fallback [class]="fallbackClass(item.name)">
              {{ item.name.charAt(0).toUpperCase() }}
            </ui-avatar-fallback>
          </ui-avatar>
        }
        @if (overflow() > 0) {
          <ui-avatar size="xs">
            <ui-avatar-fallback class="bg-muted text-muted-foreground text-[9px] font-semibold">
              +{{ overflow() }}
            </ui-avatar-fallback>
          </ui-avatar>
        }
      </ui-avatar-group>
    }
  `,
})
export class CellAvatarGroupComponent {
  readonly items = input<AvatarGroupItem[]>([]);
  readonly max = input<number>(4);
  readonly class = input<string>('');

  protected readonly displayItems = computed(() => {
    const all = this.items();
    const m = this.max();
    return all.length > m ? all.slice(0, m) : all;
  });

  protected readonly overflow = computed(() => {
    const all = this.items();
    const m = this.max();
    return all.length > m ? all.length - m : 0;
  });

  protected fallbackClass(name: string): string {
    return cn('text-foreground text-[9px] font-semibold', avatarBgFromName(name));
  }

  protected readonly computedClass = computed(() => cn('flex items-center', this.class()));
}

import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { LucideAngularModule, type LucideIconData } from 'lucide-angular';
import { cn } from '../../utils/cn';
import { iconVariants, type IconSize, ICON_SIZE_MAP } from './icon.variants';

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-icon]': 'iconKey()',
    '[attr.aria-label]': 'iconKey() || null',
    '[attr.title]': 'iconKey() || null',
    '[attr.role]': 'iconKey() ? "img" : null',
    '[attr.aria-hidden]': 'iconKey() ? null : "true"',
  },
  template: `
    <lucide-angular
      [img]="name()"
      [size]="computedSize()"
      [strokeWidth]="strokeWidth()"
      [absoluteStrokeWidth]="absoluteStrokeWidth()"
    />
  `,
})
export class IconComponent {
  readonly name = input.required<LucideIconData>();
  readonly iconKey = input<string>();
  readonly size = input<IconSize | number>('default');
  readonly strokeWidth = input<number>(2);
  readonly absoluteStrokeWidth = input<boolean>(false);
  readonly mirror = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly computedSize = computed(() => {
    const s = this.size();
    return typeof s === 'number' ? s : ICON_SIZE_MAP[s];
  });

  protected readonly computedClass = computed(() => cn(iconVariants(), this.mirror() && '-scale-x-100', this.class()));
}

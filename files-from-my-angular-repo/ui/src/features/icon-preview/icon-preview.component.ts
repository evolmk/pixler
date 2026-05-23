import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../components/icon';
import type { IconSize } from '../../components/icon';
import { DEFAULT_BG, SHAPE_RADIUS, resolveColor, resolveIcon } from './icon-preview.maps';

type IconPreviewSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl';

const CONTAINER_SIZE: Record<IconPreviewSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  default: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const GLYPH_SIZE: Record<IconPreviewSize, IconSize> = {
  xs: 'sm',
  sm: 'default',
  default: 'lg',
  lg: 'xl',
  xl: 'xxl',
};

const TEXT_SIZE: Record<IconPreviewSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  default: 'text-lg',
  lg: 'text-xl',
  xl: 'text-3xl',
};

/**
 * Renders a legacy Lazar icon: an optional shape container (circle/rounded/square)
 * filled with either a mapped Lucide icon or a short text glyph.
 *
 * Accepts the same values stored on the `Icon` model (icon class, iconText, color,
 * shape, shapeColor). Used by `ManualViewComponent` for end-user rendering and by
 * the admin Icons page for authoring previews — keeping both in perfect sync.
 */
@Component({
  selector: 'ui-icon-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, IconComponent],
  template: `
    <div
      class="inline-flex items-center justify-center"
      [ngClass]="[containerSize(), radius()]"
      [style.background-color]="backgroundColor()"
    >
      @if (showText()) {
        <span class="font-bold leading-none" [ngClass]="textSize()" [style.color]="foregroundColor()">
          {{ iconText() }}
        </span>
      } @else {
        <ui-icon [name]="glyph()" [size]="glyphSize()" [style.color]="foregroundColor()" />
      }
    </div>
  `,
})
export class IconPreviewComponent {
  readonly icon = input<string | null | undefined>('');
  readonly iconText = input<string | null | undefined>('');
  readonly color = input<string | null | undefined>('');
  readonly shape = input<string | null | undefined>('');
  readonly shapeColor = input<string | null | undefined>('');
  readonly size = input<IconPreviewSize>('default');

  protected readonly containerSize = computed(() => CONTAINER_SIZE[this.size()]);
  protected readonly textSize = computed(() => TEXT_SIZE[this.size()]);
  protected readonly glyphSize = computed(() => GLYPH_SIZE[this.size()]);

  protected readonly radius = computed(() => {
    const shape = this.shape();
    if (!shape) return '';
    return SHAPE_RADIUS[shape] ?? '';
  });

  protected readonly backgroundColor = computed(() => {
    const shapeColor = this.shapeColor();
    if (!this.shape() && !shapeColor) return DEFAULT_BG;
    return resolveColor(shapeColor, DEFAULT_BG);
  });

  protected readonly foregroundColor = computed(() => resolveColor(this.color()));

  protected readonly showText = computed(() => {
    const text = this.iconText();
    if (!text || text === 'fgd') return false;
    return !this.icon();
  });

  protected readonly glyph = computed(() => resolveIcon(this.icon()));
}

import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { cn } from '../../../utils/cn';
import { BadgeComponent } from '../../../components/badge/badge.component';

const ICON_BASE_URL = 'https://lazar.s3.amazonaws.com/site/icons';

/** Extensions that have a matching icon at `{ICON_BASE_URL}/{ext}.png` */
const ICON_EXTENSIONS = new Set(['ai', 'doc', 'dwg', 'dxf', 'file', 'pdf', 'png', 'zip']);

@Component({
  selector: 'ui-cell-file-ext',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BadgeComponent],
  host: { '[class]': 'computedClass()' },
  template: `
    @if (hasIcon()) {
      <div class="size-[46px] rounded border border-border bg-white overflow-hidden flex items-center justify-center">
        <img [src]="iconUrl()" [alt]="normalizedExt()" class="size-8 object-contain" loading="lazy" />
      </div>
    } @else if (normalizedExt()) {
      <ui-badge variant="secondary" shape="pill">
        {{ normalizedExt() }}
      </ui-badge>
    } @else {
      <span class="text-muted-foreground">—</span>
    }
  `,
})
export class CellFileExtComponent {
  readonly ext = input<string | null>(null);
  readonly class = input<string>('');

  protected readonly normalizedExt = computed(() => {
    const raw = this.ext();
    if (!raw) return '';
    return raw.replace(/^\./, '').toLowerCase();
  });

  protected readonly hasIcon = computed(() => ICON_EXTENSIONS.has(this.normalizedExt()));

  protected readonly iconUrl = computed(() => `${ICON_BASE_URL}/${this.normalizedExt()}.png`);

  protected readonly computedClass = computed(() => cn('inline-flex items-center', this.class()));
}

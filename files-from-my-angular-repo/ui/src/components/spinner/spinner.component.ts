import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { LucideAngularModule, type LucideIconData } from 'lucide-angular';
import { cn } from '../../utils/cn';

export type SpinnerSize = 'sm' | 'default' | 'lg';

const SIZE_PX: Record<SpinnerSize, number> = {
  sm: 16,
  default: 20,
  lg: 32,
};

const SIZE_CLASS: Record<SpinnerSize, string> = {
  sm: 'size-4',
  default: 'size-5',
  lg: 'size-8',
};

// ── Arc segment geometry ──────────────────────────────────────────────────────

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcSegmentPath(startDeg: number, endDeg: number, r = 9, cx = 12, cy = 12): string {
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x.toFixed(4)} ${s.y.toFixed(4)} A ${r} ${r} 0 ${largeArc} 1 ${e.x.toFixed(4)} ${e.y.toFixed(4)}`;
}

// 20 segments covering 300° (60° gap at tail). Opacity goes from 0.05 → 1.0 (tail → head).
const NUM_SEGMENTS = 20;
const ARC_COVERAGE = 300;

const SPINNER_SEGMENTS = Array.from({ length: NUM_SEGMENTS }, (_, i) => ({
  d: arcSegmentPath((i / NUM_SEGMENTS) * ARC_COVERAGE, ((i + 1) / NUM_SEGMENTS) * ARC_COVERAGE),
  opacity: Number(((i + 1) / NUM_SEGMENTS).toFixed(3)),
}));

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.role]': '"status"',
  },
  template: `
    @if (icon(); as iconData) {
      <!-- Custom Lucide icon override -->
      <lucide-angular
        [img]="iconData"
        [size]="sizePx()"
        [strokeWidth]="strokeWidth()"
        class="motion-safe:animate-[spin_1.5s_linear_infinite] text-current"
        aria-hidden="true"
      />
    } @else {
      <!-- Default: gradient arc spinner (12-segment comet tail) -->
      <svg
        [attr.width]="sizePx()"
        [attr.height]="sizePx()"
        viewBox="0 0 24 24"
        fill="none"
        class="motion-safe:animate-[spin_1.5s_linear_infinite]"
        aria-hidden="true"
      >
        @for (seg of segments; track $index) {
          <path
            [attr.d]="seg.d"
            stroke="currentColor"
            [attr.stroke-width]="strokeWidth()"
            stroke-linecap="round"
            [attr.stroke-opacity]="seg.opacity"
            fill="none"
          />
        }
      </svg>
    }
  `,
})
export class SpinnerComponent {
  /** Optional Lucide icon to use instead of the default gradient arc. */
  readonly icon = input<LucideIconData | null>(null);
  readonly size = input<SpinnerSize>('default');
  readonly strokeWidth = input<number>(2);
  readonly ariaLabel = input<string>('Loading');
  readonly class = input<string>('');

  protected readonly sizePx = computed(() => SIZE_PX[this.size()]);
  protected readonly segments = SPINNER_SEGMENTS;

  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center justify-center text-current', SIZE_CLASS[this.size()], this.class()),
  );
}

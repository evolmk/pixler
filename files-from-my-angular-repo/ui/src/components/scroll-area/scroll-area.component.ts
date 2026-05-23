import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

// ── Root ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-scroll-area',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <!-- Viewport: the visible scrollable region -->
    <div
      class="h-full w-full overflow-auto rounded-[inherit]"
      style="scrollbar-width: thin; scrollbar-color: var(--color-border) transparent"
    >
      <ng-content />
    </div>
  `,
})
export class ScrollAreaComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('block relative overflow-hidden', this.class()));
}

// ── ScrollBar (optional; auto-hidden by CSS) ─────────────────────────────────

@Component({
  selector: 'ui-scroll-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<div class="relative flex-1 rounded-full bg-border"></div>`,
})
export class ScrollBarComponent {
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => {
    const isVertical = this.orientation() === 'vertical';
    return cn(
      'flex touch-none select-none transition-colors',
      isVertical
        ? 'h-full w-2.5 border-l border-l-transparent p-[1px]'
        : 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      this.class(),
    );
  });
}

import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

// ── Grid ──────────────────────────────────────────────────────────────────────

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const COL_MAP: Record<GridCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
};

const GAP_MAP: Record<GridGap, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

@Component({
  selector: 'ui-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class GridComponent {
  readonly columns = input<GridCols>(12);
  readonly gap = input<GridGap>('md');
  readonly rowGap = input<GridGap | null>(null);
  readonly colGap = input<GridGap | null>(null);
  readonly flow = input<'row' | 'col' | 'dense'>('row');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => {
    const rg = this.rowGap();
    const cg = this.colGap();
    const gapClass = rg || cg
      ? cn(rg ? `row-gap-${rg}` : '', cg ? `col-gap-${cg}` : '')
      : GAP_MAP[this.gap()];

    const flowMap: Record<string, string> = {
      row: 'grid-flow-row',
      col: 'grid-flow-col',
      dense: 'grid-flow-dense',
    };

    return cn(
      'grid',
      COL_MAP[this.columns()],
      gapClass,
      flowMap[this.flow()] ?? '',
      this.class(),
    );
  });
}

// ── Column ────────────────────────────────────────────────────────────────────

type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full' | 'auto';
type ColStart = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'auto';

const SPAN_MAP: Record<string, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
  full: 'col-span-full',
  auto: 'col-auto',
};

const START_MAP: Record<string, string> = {
  1: 'col-start-1',
  2: 'col-start-2',
  3: 'col-start-3',
  4: 'col-start-4',
  5: 'col-start-5',
  6: 'col-start-6',
  7: 'col-start-7',
  8: 'col-start-8',
  9: 'col-start-9',
  10: 'col-start-10',
  11: 'col-start-11',
  12: 'col-start-12',
  13: 'col-start-13',
  auto: 'col-start-auto',
};

@Component({
  selector: 'ui-col, ui-column',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class ColumnComponent {
  readonly span = input<ColSpan>(1);
  readonly start = input<ColStart | null>(null);
  /** sm breakpoint span override */
  readonly smSpan = input<ColSpan | null>(null);
  /** md breakpoint span override */
  readonly mdSpan = input<ColSpan | null>(null);
  /** lg breakpoint span override */
  readonly lgSpan = input<ColSpan | null>(null);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => {
    const sm = this.smSpan();
    const md = this.mdSpan();
    const lg = this.lgSpan();
    const start = this.start();

    return cn(
      SPAN_MAP[String(this.span())] ?? 'col-span-1',
      sm ? `sm:${SPAN_MAP[String(sm)] ?? ''}` : '',
      md ? `md:${SPAN_MAP[String(md)] ?? ''}` : '',
      lg ? `lg:${SPAN_MAP[String(lg)] ?? ''}` : '',
      start ? START_MAP[String(start)] ?? '' : '',
      this.class(),
    );
  });
}

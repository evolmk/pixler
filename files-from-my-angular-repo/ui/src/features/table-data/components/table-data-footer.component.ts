import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, model, output } from '@angular/core';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { cn } from '../../../utils/cn';

const PAGE_SIZE_OPTIONS = [5, 9, 10, 25, 50, 100, 500, 0]; // 0 renders as "All"

@Component({
  selector: 'ui-table-data-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [PaginationComponent],
  host: { '[class]': 'computedClass()' },
  template: `
    <ui-pagination
      [total]="total()"
      [pageSize]="effectivePageSize()"
      [(pageIndex)]="pageIndex"
      [showFirstLast]="false"
      [maxVisiblePages]="7"
      [showPageSize]="true"
      [pageSizeOptions]="pageSizeOptions"
      [showCount]="true"
      (pageSizeChange)="onPageSizeChange($event)"
    />
  `,
})
export class TableDataFooterComponent {
  readonly total = input<number>(0);
  readonly pageIndex = model<number>(1);
  readonly pageSize = model<number>(25);
  readonly class = input<string>('');

  readonly pageSizeChange = output<number>();

  protected readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

  protected readonly effectivePageSize = computed(() => {
    const ps = this.pageSize();
    return ps === 0 ? Math.max(1, this.total()) : ps;
  });

  protected onPageSizeChange(value: number): void {
    this.pageSize.set(value);
    this.pageIndex.set(1);
    this.pageSizeChange.emit(value);
  }

  protected readonly computedClass = computed(() => cn('block', this.class()));
}

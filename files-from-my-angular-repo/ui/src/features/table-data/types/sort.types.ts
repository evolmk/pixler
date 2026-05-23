export type SortDirection = 'asc' | 'desc' | null;

export interface TableDataSort {
  columnKey: string;
  direction: SortDirection;
}

import { TableDataFilterType } from './column.types';

export interface TableDataFilterSelectOption {
  value: string;
  label: string;
  group?: string;
}

export interface TableDataFilterSection {
  key: string;
  label: string;
  type: TableDataFilterType | 'tags';
  options?: string[];
  /** Pre-built select options with optional group headers (used instead of options when provided). */
  selectOptions?: TableDataFilterSelectOption[];
  /** Max labels shown in the drawer select trigger. Defaults to 0 ("N selected"). */
  maxLabelCount?: number;
  /** When true, renders in the drawer header instead of the scrollable section list. */
  pinned?: boolean;
}

/** Value for a single filter — varies by filter type. */
export type TableDataFilterValue = string[] | string | TableDataRangeValue | boolean | null;

export interface TableDataRangeValue {
  min?: number | string | null;
  max?: number | string | null;
}

/** Maps each filter section key to its current value. */
export type TableDataFilterState = Record<string, TableDataFilterValue>;

/**
 * Check whether a filter value is "active" (non-empty).
 * Used for computing active filter count.
 */
export function isFilterActive(value: TableDataFilterValue): boolean {
  if (value == null) return false;
  if (typeof value === 'boolean') return true;
  if (typeof value === 'string') return value.length > 0;
  if (Array.isArray(value)) return value.length > 0;
  // Range value
  return value.min != null || value.max != null;
}

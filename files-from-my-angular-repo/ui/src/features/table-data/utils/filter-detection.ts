import { TableDataColumn, TableDataFilterType } from '../types/column.types';

/** Threshold: columns with ≤ this many unique string values get checkboxes. */
const CHECKBOX_THRESHOLD = 15;

/**
 * Inspects the values for a given column across all data rows
 * and returns the most appropriate filter type.
 */
export function detectFilterType<T>(column: TableDataColumn<T>, data: T[]): TableDataFilterType {
  // editType / cellType takes precedence over data-based detection
  if (column.cellType === 'group') return 'checkbox';
  if (column.editType === 'boolean') return 'boolean';
  if (column.editType === 'number') return 'number-range';
  if (column.editType === 'date') return 'date-range';

  const values = data.map((row) => row[column.key as keyof T]).filter((v) => v != null);

  if (values.length === 0) return 'text-search';

  // Check booleans first (typeof check on actual values)
  if (values.every((v) => typeof v === 'boolean')) return 'boolean';

  // Check numbers
  if (values.every((v) => typeof v === 'number' || (typeof v === 'string' && !isNaN(Number(v)) && v !== ''))) {
    return 'number-range';
  }

  // Check dates (Date objects or ISO-like date strings)
  if (values.every((v) => v instanceof Date || (typeof v === 'string' && isDateString(v)))) {
    return 'date-range';
  }

  // String values — decide by cardinality
  const unique = new Set(values.map((v) => String(v)));
  return unique.size <= CHECKBOX_THRESHOLD ? 'checkbox' : 'text-search';
}

/**
 * Extracts unique string values from a column's data.
 * Used to populate checkbox filter options.
 */
export function extractUniqueValues<T>(column: TableDataColumn<T>, data: T[]): string[] {
  const values = data
    .map((row) => row[column.key as keyof T])
    .filter((v) => v != null)
    .map((v) => String(v));

  return [...new Set(values)].sort();
}

/** Rough check for ISO-like date strings (YYYY-MM-DD or ISO 8601). */
function isDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}/.test(value) && !isNaN(Date.parse(value));
}

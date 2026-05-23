import { TableDataColumn } from '../types/column.types';

/**
 * Client-side search engine.
 * Performs case-insensitive text search across:
 *   - all visible columns, plus
 *   - any column with `searchable: true` (lets hidden columns opt in).
 * When a column defines `searchValue`, that getter provides the searched string;
 * otherwise the cell value at `col.key` is stringified.
 */
export function applyClientSearch<T extends Record<string, unknown>>(
  data: T[],
  query: string,
  columns: TableDataColumn<T>[],
): T[] {
  if (!query) return data;

  const lowerQuery = query.toLowerCase();
  const searchableColumns = columns.filter((col) => col.visible !== false || col.searchable === true);

  return data.filter((row) =>
    searchableColumns.some((col) => {
      const raw = col.searchValue ? col.searchValue(row) : cellToString(row[col.key]);
      return raw.toLowerCase().includes(lowerQuery);
    }),
  );
}

/** Safely convert unknown cell value to string. */
function cellToString(cellValue: unknown): string {
  if (cellValue == null) return '';
  if (typeof cellValue === 'string') return cellValue;
  if (typeof cellValue === 'number' || typeof cellValue === 'boolean') return String(cellValue);
  return '';
}

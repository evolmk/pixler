import { TableDataSort } from '../types/sort.types';

/**
 * Client-side sort engine.
 * Sorts data by a column using locale-aware comparison with numeric support.
 * Returns original array if sort is null/cleared. Returns a new sorted array (never mutates).
 */
export function applyClientSort<T extends Record<string, unknown>>(data: T[], sort: TableDataSort | null): T[] {
  if (!sort || !sort.direction) return data;

  const { columnKey, direction } = sort;

  return [...data].sort((a, b) => {
    const cmp = compareCellValues(a[columnKey], b[columnKey]);
    return direction === 'asc' ? cmp : -cmp;
  });
}

/** Compare two cell values. Numbers are compared numerically, strings locale-aware. */
function compareCellValues(aRaw: unknown, bRaw: unknown): number {
  const aNum = toNumberOrNull(aRaw);
  const bNum = toNumberOrNull(bRaw);
  if (aNum !== null && bNum !== null) return aNum - bNum;
  if (aNum !== null) return -1; // numbers sort before non-numeric
  if (bNum !== null) return 1;
  return cellToString(aRaw).localeCompare(cellToString(bRaw), undefined, { numeric: true });
}

/** Returns a finite number for numeric cell values (including arrays → length), else null. */
function toNumberOrNull(cellValue: unknown): number | null {
  if (typeof cellValue === 'number' && Number.isFinite(cellValue)) return cellValue;
  if (typeof cellValue === 'boolean') return cellValue ? 1 : 0;
  if (Array.isArray(cellValue)) return cellValue.length;
  return null;
}

/** Safely convert unknown cell value to string for comparison. */
function cellToString(cellValue: unknown): string {
  if (cellValue == null) return '';
  if (typeof cellValue === 'string') return cellValue;
  if (typeof cellValue === 'number' || typeof cellValue === 'boolean') return String(cellValue);
  if (Array.isArray(cellValue)) return String(cellValue.length);
  return '';
}

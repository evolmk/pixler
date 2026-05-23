import { TableDataFilterSection } from '../types/filter.types';
import { TableDataFilterState, TableDataFilterValue, TableDataRangeValue, isFilterActive } from '../types/filter.types';

/**
 * Client-side filtering engine.
 * Applies the current filter state to a data array and returns matching rows.
 */
export function applyClientFilters<T extends Record<string, unknown>>(
  data: T[],
  filterState: TableDataFilterState,
  sections: TableDataFilterSection[],
): T[] {
  // Build a map of active filters only
  const activeFilters = Object.entries(filterState).filter(([, val]) => isFilterActive(val));

  if (activeFilters.length === 0) return data;

  const sectionMap = new Map(sections.map((s) => [s.key, s]));

  return data.filter((row) =>
    activeFilters.every(([key, value]) => {
      const section = sectionMap.get(key);
      if (!section) return true;
      return matchesFilter(row, key, value, section.type);
    }),
  );
}

/** Parse a cell value into a Date object. Returns null if not parseable. */
function toDate(cellValue: unknown): Date | null {
  if (!cellValue) return null;
  if (cellValue instanceof Date) {
    return isNaN(cellValue.getTime()) ? null : cellValue;
  }
  if (typeof cellValue === 'string') {
    const parsed = new Date(cellValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof cellValue === 'number') {
    const parsed = new Date(cellValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

/** Extract a number from a cell value, stripping currency symbols and unit suffixes. */
function toNumber(cellValue: unknown): number {
  if (typeof cellValue === 'number') return cellValue;
  if (typeof cellValue === 'string') {
    // Strip currency symbols and commas; parseFloat stops at non-numeric suffix (e.g. "/ea")
    const cleaned = cellValue.replace(/[$€£,]/g, '');
    if (cleaned === '' || cleaned === '—') return NaN;
    return parseFloat(cleaned);
  }
  return NaN;
}

/** Safely convert unknown cell value to string. */
function cellToString(cellValue: unknown): string {
  if (cellValue == null) return '';
  if (typeof cellValue === 'string') return cellValue;
  if (typeof cellValue === 'number' || typeof cellValue === 'boolean') return String(cellValue);
  return '';
}

function matchesFilter(row: Record<string, unknown>, key: string, value: TableDataFilterValue, type: string): boolean {
  const cellValue = row[key];

  switch (type) {
    case 'checkbox':
    case 'tags': {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(cellToString(cellValue));
    }

    case 'text-search': {
      if (typeof value !== 'string' || value === '') return true;
      return cellToString(cellValue).toLowerCase().includes(value.toLowerCase());
    }

    case 'multi-substring': {
      if (!Array.isArray(value) || value.length === 0) return true;
      const cell = cellToString(cellValue).toLowerCase();
      return value.every((v) => typeof v === 'string' && cell.includes(v.toLowerCase()));
    }

    case 'number-range': {
      const range = value as TableDataRangeValue;
      if (range.min == null && range.max == null) return true;
      const num = toNumber(cellValue);
      if (isNaN(num)) return false;
      if (range.min != null && num < Number(range.min)) return false;
      if (range.max != null && num > Number(range.max)) return false;
      return true;
    }

    case 'date-range': {
      const range = value as TableDataRangeValue;
      if (range.min == null && range.max == null) return true;

      // Parse cell value to a Date object
      const cellDate = toDate(cellValue);
      if (!cellDate) return false;

      // Compare using Date objects (proven approach from legacy code)
      if (range.min != null) {
        const minDate = new Date(String(range.min) + 'T00:00:00');
        if (cellDate < minDate) return false;
      }
      if (range.max != null) {
        // End of day: max date is inclusive, so add 1 day
        const maxDate = new Date(String(range.max) + 'T23:59:59');
        if (cellDate > maxDate) return false;
      }
      return true;
    }

    case 'select': {
      if (typeof value !== 'string' || value === '') return true;
      return cellToString(cellValue) === value;
    }

    case 'boolean': {
      if (typeof value !== 'boolean') return true;
      if (typeof cellValue === 'boolean') return cellValue === value;
      // Coerce string representations ("Yes"/"No", "true"/"false") to boolean
      const str = cellToString(cellValue).toLowerCase();
      const cellBool = str === 'yes' || str === 'true';
      return cellBool === value;
    }

    default:
      return true;
  }
}

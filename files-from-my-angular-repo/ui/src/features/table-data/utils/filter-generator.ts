import { TableDataColumn } from '../types/column.types';
import { TableDataFilterSection, TableDataFilterSelectOption } from '../types/filter.types';
import { detectFilterType, extractUniqueValues } from './filter-detection';

/**
 * Auto-generates filter sections from column definitions and data.
 * Columns with `filterable: true` get a filter section based on detected data type.
 * Manual `filterOverride` on columns takes precedence over auto-detection.
 */
export function generateFilterSections<T>(columns: TableDataColumn<T>[], data: T[]): TableDataFilterSection[] {
  const sections: TableDataFilterSection[] = [];

  for (const col of columns) {
    if (!col.filterable) continue;

    const override = col.filterOverride;

    // Skip if explicitly excluded
    if (override?.exclude) continue;

    // Determine filter type: override > auto-detect
    const type = override?.type ?? detectFilterType(col, data);

    // Determine label: override > column label
    const label = override?.label ?? col.label;

    // Build section
    const section: TableDataFilterSection = {
      key: col.key,
      label,
      type,
      ...(override?.pinned && { pinned: true }),
    };

    // For checkbox type, populate options
    if (type === 'checkbox') {
      // Group columns: build grouped select options with parent>child headers
      if (col.cellType === 'group' && col.cellData?.parentGroupKey) {
        section.selectOptions = extractGroupedOptions(col, data);
      } else {
        section.options = override?.options ?? extractUniqueValues(col, data);
      }
      if (col.cellData?.drawerMaxLabelCount != null) {
        section.maxLabelCount = col.cellData.drawerMaxLabelCount;
      }
    }

    // For select type, populate options
    if (type === 'select') {
      section.options = override?.options ?? extractUniqueValues(col, data);
    }

    sections.push(section);
  }

  return sections;
}

/**
 * Extracts grouped select options for group-type columns.
 * Groups child values under their parent group type as non-selectable headers.
 * Empty values become "[No Group]" and appear first.
 */
function extractGroupedOptions<T>(col: TableDataColumn<T>, data: T[]): TableDataFilterSelectOption[] {
  const parentKey = col.cellData!.parentGroupKey! as keyof T;
  const valueKey = col.key as keyof T;

  // Collect unique value → parent group mappings
  const valueToGroup = new Map<string, string>();
  for (const row of data) {
    const val = row[valueKey];
    const parent = row[parentKey];
    if (val != null) {
      valueToGroup.set(String(val), parent != null ? String(parent) : '');
    }
  }

  // Separate empty values and grouped values
  const noGroup: TableDataFilterSelectOption[] = [];
  const grouped = new Map<string, string[]>();

  for (const [value, groupType] of valueToGroup) {
    if (value === '') {
      noGroup.push({ value: '', label: '[No Group]' });
    } else if (groupType === '') {
      noGroup.push({ value, label: value });
    } else {
      if (!grouped.has(groupType)) grouped.set(groupType, []);
      grouped.get(groupType)!.push(value);
    }
  }

  // Sort groups and their children
  const sortedGroups = [...grouped.keys()].sort();
  const result: TableDataFilterSelectOption[] = [...noGroup];
  for (const groupType of sortedGroups) {
    const children = grouped.get(groupType)!.sort();
    for (const child of children) {
      result.push({ value: child, label: child, group: groupType });
    }
  }

  return result;
}

/**
 * Merges auto-generated filter sections with manually provided ones.
 * Manual sections override auto-generated ones by key.
 * Manual sections not matching any column key are appended at the end.
 */
export function mergeFilterSections(
  autoSections: TableDataFilterSection[],
  manualSections: TableDataFilterSection[],
): TableDataFilterSection[] {
  if (manualSections.length === 0) return autoSections;
  if (autoSections.length === 0) return manualSections;

  const manualMap = new Map(manualSections.map((s) => [s.key, s]));
  const usedManualKeys = new Set<string>();

  // Replace auto sections with manual overrides where keys match
  const merged = autoSections.map((auto) => {
    const manual = manualMap.get(auto.key);
    if (manual) {
      usedManualKeys.add(auto.key);
      return manual;
    }
    return auto;
  });

  // Append manual sections that don't match any auto-generated column
  for (const manual of manualSections) {
    if (!usedManualKeys.has(manual.key)) {
      merged.push(manual);
    }
  }

  return merged;
}

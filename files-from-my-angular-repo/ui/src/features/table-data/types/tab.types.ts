export interface TableDataTab {
  value: string;
  label: string;
  /** Explicit count. If omitted and filterKey is set, auto-computed from data. */
  count?: number;
  /** Row field to filter by when this tab is active. */
  filterKey?: string;
  /** Value to match against filterKey. Omit for a "show all" tab. */
  filterValue?: unknown;
}

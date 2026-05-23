export interface TableDataRowAction<T = Record<string, unknown>> {
  row: T;
  action: string;
}

export interface TableDataCustomAction {
  /** Emitted as the action string (e.g. 'tree-view') */
  key: string;
  /** Display label (e.g. 'Tree View') */
  label: string;
  /** SVG <path d="..."> values (Lucide 24×24 viewBox) */
  iconPaths?: string[];
  /** Render a divider line above this item */
  separator?: boolean;
  /** Disable the button */
  disabled?: boolean;
  /** Override text color class (e.g. 'text-destructive') */
  textClass?: string;
  /** Per-row visibility callback — return false to hide this action for the given row */
  visible?: (row: any) => boolean;
}

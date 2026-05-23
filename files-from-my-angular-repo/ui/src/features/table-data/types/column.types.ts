export type TableDataCellType =
  | 'text'
  | 'image'
  | 'company'
  | 'flag-location'
  | 'contact'
  | 'status-pill'
  | 'avatar-group'
  | 'text-lines'
  | 'group'
  | 'part-link'
  | 'text-image'
  | 'date'
  | 'link'
  | 'file-ext'
  | 'number'
  | 'progress'
  | 'switch'
  | 'custom';

export type TableDataStatusColor = 'green' | 'blue' | 'orange' | 'red' | 'gray';

export interface TableDataCellData {
  /** Key on the row object for the secondary description line (company cell). */
  descriptionKey?: string;
  /** Key on the row object for the flag emoji (flag-location cell). */
  flagKey?: string;
  /** Key on the row object for the avatar image URL. */
  avatarKey?: string;
  /** Maps a status string to a color (status-pill cell). */
  colorMap?: Record<string, TableDataStatusColor>;
  /** Max character length before truncation. */
  maxLength?: number;
  /** Key on the row object for the group type name (group cell). */
  groupTypeKey?: string;
  /** Abbreviation of the group type — used by the group edit type in the bulk-edit bar. */
  groupTypeAbbr?: string;
  /** Key on the row object for the parent group name — used for filter dropdown grouping. */
  parentGroupKey?: string;
  /** Key on the row object for a tooltip value (rendered as title attribute on text cells). */
  tooltipKey?: string;
  /** Enable clickable group headers in the inline select dropdown (selects/deselects all children). Defaults to false. */
  groupSelect?: boolean;
  /** Max number of selected labels to show before collapsing to "+N" in the inline select trigger. Defaults to 1. */
  maxLabelCount?: number;
  /** Max number of selected labels in the filter drawer select. Defaults to 0 ("N selected"). */
  drawerMaxLabelCount?: number;
  /** Key on the row object for the linked entity's ID (part-link cell). */
  linkIdKey?: string;
  /** Key on the row object for a hover image URL (text-image cell). */
  imageKey?: string;
  /** Key on the row object for the link href (link cell). When set, the display value comes from the column key while the href comes from this key. */
  linkKey?: string;
  /** Key on the row object for avatar initials source (contact cell). Overrides using name for initials. */
  initialsKey?: string;
  /** Key on the row object for the image count badge (image cell). */
  countKey?: string;
}

export type TableDataEditType = 'text' | 'number' | 'boolean' | 'date' | 'select' | 'group';

export interface TableDataColumn<T = Record<string, unknown>> {
  key: keyof T & string;
  label: string;
  visible?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  filterOverride?: TableDataFilterOverride;
  /**
   * When true, this column participates in the toolbar search even if `visible` is false.
   * By default, only visible columns are searched. Set to explicitly opt a hidden column in.
   */
  searchable?: boolean;
  /**
   * Optional getter that returns the searchable string for a row in this column.
   * Used when the displayed cell value differs from what should be searched (e.g. an array
   * cell that displays a count but should match by joined names). When omitted, the search
   * engine falls back to converting `row[key]` to a string.
   */
  searchValue?: (row: T) => string;
  width?: string;
  /** When true, the column shrinks to fit its content (no extra space allocated). */
  fit?: boolean;
  cellType: TableDataCellType;
  cellData?: TableDataCellData;

  // Column management
  locked?: boolean;
  /** When false, this column is hidden on mobile/small screens (< 640px). Defaults to true. */
  mobile?: boolean;
  /** Abbreviated label shown on mobile (< 640px). Falls back to `label` when not set. */
  mobileLabel?: string;
  /** When false, this column is hidden on tablet screens (640–767px). Defaults to `mobile` value. */
  tablet?: boolean;
  /** When true, cell text is truncated with ellipsis. Auto-enables tooltip. */
  truncate?: boolean;

  /** Show the cell's own value as a native title tooltip on hover (useful for truncated text). */
  tooltip?: boolean;

  /** Show a copy-to-clipboard icon next to the cell value. */
  copyable?: boolean;

  /** Render this column's filter inline in the table header (auto-detected type from cellType/editType). */
  inline?: boolean;

  // Bulk edit
  editable?: boolean;
  editType?: TableDataEditType;
  editOptions?: { value: string; label: string }[];
}

export interface TableDataFilterOverride {
  /** Custom label for the filter section (defaults to column label). */
  label?: string;
  /** Force a specific filter type instead of auto-detection. */
  type?: TableDataFilterType;
  /** Explicit options list (checkbox only). Overrides auto-extracted values. */
  options?: string[];
  /** Exclude this column from auto-filter generation. */
  exclude?: boolean;
  /** Pin this filter to the drawer header (e.g. Active/Archived toggle). */
  pinned?: boolean;
}

export type TableDataFilterType =
  | 'checkbox'
  | 'text-search'
  | 'number-range'
  | 'date-range'
  | 'boolean'
  | 'select'
  /**
   * Multi-substring AND match — value is `string[]`, every entry must appear as a (case-insensitive)
   * substring of the cell value. Used by quick-filter pill groups that should narrow results
   * progressively as more pills are activated (e.g. parts groups: Build + Electrical → "Electrical Build").
   */
  | 'multi-substring';

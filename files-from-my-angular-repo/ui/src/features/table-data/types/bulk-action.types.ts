export interface TableDataBulkUpdate<T = Record<string, unknown>> {
  field: string;
  value: unknown;
  selectedRows: T[];
}

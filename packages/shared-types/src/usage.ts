export interface UsageWindow {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  totalTokens: number;
  capEstimate: number;
  percent: number;
  windowHours: number;
  windowStart: number;
  windowEnd: number;
}

export interface UsagePerModel {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  totalTokens: number;
}

export interface UsagePerWorkspace {
  workspaceId: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  totalTokens: number;
}

export interface UsageHistoricalPoint {
  date: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  totalTokens: number;
}

export interface McpOverheadEntry {
  workspaceId: string;
  schemaTokens: number;
  callCount: number;
  estimatedTokens: number;
}

export interface McpOverheadSummary {
  entries: McpOverheadEntry[];
  totalEstimatedTokens: number;
}

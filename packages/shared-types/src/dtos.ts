export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface HealthResponse {
  ok: boolean;
  version: string;
  uptimeMs: number;
  env: 'dev' | 'prod';
}

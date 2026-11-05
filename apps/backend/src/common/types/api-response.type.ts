export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  meta?: PaginationMeta | CursorMeta;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CursorMeta {
  limit: number;
  total: number;
  hasMore: boolean;
}

// Shared types for the API, the admin dashboard and any other client.

export type Role = 'ADMIN' | 'USER';

export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Admin',
  USER: 'User',
};

/** Envelope every API response is wrapped in. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  meta?: { page: number; limit: number; total: number; totalPages: number };
  errors?: Record<string, string[]>;
}

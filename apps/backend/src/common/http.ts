import { BadRequestException, ConflictException, ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@app/db';
import { Envelope } from './interceptors/response.interceptor';

export const ok = <T,>(data: T, message = 'OK') => new Envelope(data, message);

export interface PageArgs {
  page: number;
  limit: number;
  skip: number;
}

/** Reads ?page & ?limit (defaults 1 / 20, max 100). */
export function pageArgs(q: Record<string, unknown> = {}): PageArgs {
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(q.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

/** Paginated envelope. `extra` puts items under data.items next to extra keys (summary/stats). */
export function paged<T>(items: T[], total: number, p: PageArgs, extra?: Record<string, unknown>) {
  const meta = { page: p.page, limit: p.limit, total, totalPages: Math.max(1, Math.ceil(total / p.limit)) };
  return new Envelope(extra ? { ...extra, items } : items, 'OK', meta);
}

/** Paginates an in-memory array. */
export function pageOf<T>(all: T[], p: PageArgs, extra?: Record<string, unknown>) {
  return paged(all.slice(p.skip, p.skip + p.limit), all.length, p, extra);
}

export const notFound = (what: string) => new NotFoundException(`${what} not found`);
export const badRequest = (message: string) => new BadRequestException(message);
export const conflict = (message: string) => new ConflictException(message);
export const forbidden = (message = 'You are not allowed to use this endpoint') => new ForbiddenException(message);
export const invalid = (errors: Record<string, string[]>) => new UnprocessableEntityException({ message: 'Validation failed', errors });

/** Decimal / null → number with 2 decimals. */
export const n = (v: Prisma.Decimal | number | null | undefined) => (v === null || v === undefined ? 0 : Math.round(Number(v) * 100) / 100);
export const D = (v: number) => new Prisma.Decimal((Math.round(v * 100) / 100).toFixed(2));
export const iso = (d: Date | null | undefined) => (d ? d.toISOString() : null);
export const dateOnly = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : null);
export const round = (v: number, dp = 2) => Math.round(v * 10 ** dp) / 10 ** dp;

/** Percentage change from `before` to `now` (100 when growing from zero). */
export const pct = (now: number, before: number) => (before ? Math.round(((now - before) / before) * 100) : now ? 100 : 0);

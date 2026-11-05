import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

// Local development: read apps/backend/.env or the monorepo root .env. Variables that are
// already set (Docker env_file, the shell) are never overwritten.
for (const file of [resolve(process.cwd(), '.env'), resolve(process.cwd(), '../../.env')]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

// All configuration comes from environment variables (the server .env in production).
const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8080),
  API_PREFIX: z.string().default('api/v1'),
  PUBLIC_URL: z.string().default('http://localhost:8080'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL_DAYS: z.coerce.number().default(30),
  UPLOAD_DIR: z.string().default('./uploads'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default('App <no-reply@example.com>'),
});

export type Env = z.infer<typeof schema>;

let cached: Env | null = null;

export function env(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment configuration:\n${lines}`);
  }
  cached = parsed.data;
  return cached;
}

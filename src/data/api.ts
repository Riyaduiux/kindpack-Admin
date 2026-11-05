// HTTP client for the API. Adds the admin's access token, refreshes it
// once when it expires, and broadcasts failures so the UI can show them.

export const API_BASE_URL = ((import.meta.env.VITE_API_URL as string | undefined) ?? '/api/v1').replace(/\/$/, '');
const SESSION_KEY = 'admin-session';

export interface Session {
  user: { id: string; name: string; email: string; role: string };
  accessToken: string;
  refreshToken: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors?: Record<string, string[]>,
  ) {
    super(message);
  }
}

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function writeSession(s: Session | null) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* private mode: session lasts until refresh */
  }
}

/** UI events: `app:api-error` (detail: message) and `app:session-expired`. */
const emit = (name: string, detail?: unknown) => window.dispatchEvent(new CustomEvent(name, { detail }));

let refreshing: Promise<boolean> | null = null;
async function refreshTokens(): Promise<boolean> {
  const s = readSession();
  if (!s?.refreshToken) return false;
  refreshing ??= fetch(`${API_BASE_URL}/auth/refresh`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ refreshToken: s.refreshToken }) })
    .then(async (r) => {
      const j = await r.json().catch(() => null);
      if (!r.ok || !j?.data?.tokens) return false;
      writeSession({ ...s, accessToken: j.data.tokens.accessToken, refreshToken: j.data.tokens.refreshToken });
      return true;
    })
    .catch(() => false)
    .finally(() => setTimeout(() => (refreshing = null), 0));
  return refreshing;
}

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/** Calls the API and returns `data` from the response envelope. Throws ApiError on failure. */
export async function api<T = unknown>(method: Method, path: string, body?: unknown, opts: { silent?: boolean; retry?: boolean } = {}): Promise<T> {
  const s = readSession();
  const isForm = body instanceof FormData;
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { ...(s ? { authorization: `Bearer ${s.accessToken}` } : {}), ...(body !== undefined && !isForm ? { 'content-type': 'application/json' } : {}) },
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    const err = new ApiError('Cannot reach the server. Check your connection.', 0);
    if (!opts.silent) emit('app:api-error', err.message);
    throw err;
  }
  if (res.status === 401 && opts.retry !== false && s && !path.startsWith('/auth/')) {
    if (await refreshTokens()) return api<T>(method, path, body, { ...opts, retry: false });
    emit('app:session-expired');
  }
  const j = await res.json().catch(() => null);
  if (!res.ok || j?.success === false) {
    const first = j?.errors ? Object.values(j.errors as Record<string, string[]>)[0]?.[0] : undefined;
    const err = new ApiError(first ?? j?.message ?? `Request failed (${res.status})`, res.status, j?.errors);
    if (!opts.silent) emit('app:api-error', err.message);
    throw err;
  }
  return (j?.data ?? null) as T;
}

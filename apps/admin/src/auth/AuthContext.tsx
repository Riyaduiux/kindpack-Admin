import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, readSession, writeSession, type Session } from '../data/api';

// Authentication against the API: POST /auth/login, then GET /auth/me for the profile.
// Only ADMIN accounts may use the dashboard. Tokens are kept in localStorage and
// refreshed automatically by data/api.ts.

export type AdminUser = Session['user'];

interface AuthContextValue {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => readSession()?.user ?? null);

  const logout = useCallback(() => {
    const s = readSession();
    if (s) void api('POST', '/auth/logout', { refreshToken: s.refreshToken }, { silent: true }).catch(() => undefined);
    writeSession(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const onExpired = () => logout();
    window.addEventListener('app:session-expired', onExpired);
    return () => window.removeEventListener('app:session-expired', onExpired);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ user: AdminUser; tokens: { accessToken: string; refreshToken: string } }>('POST', '/auth/login', { email: email.trim(), password }, { silent: true });
    if (res.user.role !== 'ADMIN') {
      void api('POST', '/auth/logout', { refreshToken: res.tokens.refreshToken }, { silent: true }).catch(() => undefined);
      throw new Error('This account cannot access the admin dashboard');
    }
    writeSession({ user: res.user, ...res.tokens });
    setUser(res.user);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

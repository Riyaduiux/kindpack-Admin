import { DESIGN_PREVIEW } from '../preview';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, Navigate, useLocation } from 'react-router';
import { Box, Button, Link, Typography } from '@mui/material';
import GppGoodOutlined from '@mui/icons-material/GppGoodOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import ArrowForward from '@mui/icons-material/ArrowForward';
import AuthShell, { AuthIcon } from '../layout/AuthShell';
import { writeSession } from '../data/api';
import { brand, shadows } from '../theme';

const LENGTH = 6;
const TTL = 5 * 60;

/** Two-factor verification. Design preview (dev builds): any code signs in; there is no 2FA API yet. */
export default function TwoFactor() {
  const state = useLocation().state as { email?: string; from?: string } | null;
  const email = state?.email ?? 'admin@kindpack.com';
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const [secs, setSecs] = useState(TTL);
  const [focus, setFocus] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => refs.current[0]?.focus(), []);

  if (!DESIGN_PREVIEW) return <Navigate to="/login" replace />;

  const set = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1);
    setDigits((cur) => cur.map((x, k) => (k === i ? d : x)));
    if (d && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const verify = () => {
    const name = email.split('@')[0]?.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Admin';
    writeSession({ user: { id: 'preview', name, email, role: 'ADMIN' }, accessToken: 'preview', refreshToken: 'preview' });
    window.location.assign(state?.from ?? '/');
  };

  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <AuthShell badge="Security check" title="One more step to keep every account safe." description="Admins can approve payouts, change roles and see personal data — so we always ask for a one-time code.">
      <Box>
        <AuthIcon>
          <GppGoodOutlined />
        </AuthIcon>
        <Typography component="h1" sx={{ fontWeight: 600, fontSize: 30, lineHeight: 1.18 }}>
          Two-factor verification
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 15, mt: 1 }}>Enter the 6-digit code from your authenticator app for {email}.</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.25 }}>
        {digits.map((d, i) => (
          <Box
            key={i}
            component="input"
            ref={(el: HTMLInputElement | null) => {
              refs.current[i] = el;
            }}
            value={d}
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label={`Digit ${i + 1}`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => set(i, e.target.value)}
            onFocus={() => setFocus(i)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Backspace' && !d && i > 0) refs.current[i - 1]?.focus();
              if (e.key === 'Enter') verify();
            }}
            onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
              const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
              if (!text) return;
              e.preventDefault();
              setDigits(Array.from({ length: LENGTH }, (_, k) => text[k] ?? ''));
              refs.current[Math.min(text.length, LENGTH - 1)]?.focus();
            }}
            sx={{
              flex: 1,
              minWidth: 0,
              height: 64,
              textAlign: 'center',
              font: 'inherit',
              fontSize: 24,
              fontWeight: 600,
              color: brand.ink,
              borderRadius: '16px',
              outline: 0,
              bgcolor: focus === i ? '#fff' : brand.field,
              border: focus === i ? '2px solid #1F6B45' : '1px solid rgba(11,46,31,0.08)',
              boxShadow: focus === i ? shadows.card : 'none',
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: '14px', borderRadius: '16px', bgcolor: brand.primarySoft, color: brand.primary }}>
        <LockOutlined sx={{ fontSize: 18 }} />
        <Typography sx={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'inherit' }}>{secs > 0 ? `Code expires in ${mm}:${ss}` : 'Code expired — go back and sign in again'}</Typography>
      </Box>

      <Button variant="contained" onClick={verify} disabled={secs === 0} endIcon={<ArrowForward sx={{ fontSize: 16 }} />} sx={{ height: 56 }}>
        Verify and continue
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
        <Link component="button" type="button" underline="hover" sx={{ color: '#1F6B45', font: 'inherit', fontSize: 14, fontWeight: 500 }}>
          Use a backup code
        </Link>
        <Link component={RouterLink} to="/login" underline="hover" sx={{ color: 'text.secondary', fontSize: 14 }}>
          Back to sign in
        </Link>
      </Box>
    </AuthShell>
  );
}

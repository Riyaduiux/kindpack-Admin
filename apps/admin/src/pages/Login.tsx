import { useState, type FormEvent, type ReactNode } from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router';
import { Alert, Box, Button, Checkbox, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import GppGoodOutlined from '@mui/icons-material/GppGoodOutlined';
import MailOutline from '@mui/icons-material/MailOutline';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForward from '@mui/icons-material/ArrowForward';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import EnergySavingsLeafOutlined from '@mui/icons-material/EnergySavingsLeafOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import { useAuth } from '../auth/AuthContext';
import AuthShell, { AuthIcon } from '../layout/AuthShell';
import { APP_NAME, brand } from '../theme';

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <Box sx={{ width: 190, p: '18px', borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      <Box sx={{ width: 38, height: 38, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.15)', display: 'grid', placeItems: 'center', '& svg': { fontSize: 19, color: '#fff' } }}>{icon}</Box>
      <Typography sx={{ color: '#fff', fontSize: 22, fontWeight: 600, lineHeight: 1.4 }}>{value}</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{label}</Typography>
    </Box>
  );
}

export const authFieldSx = { '& .MuiOutlinedInput-root': { height: 56, borderRadius: '16px', pl: 1 }, '& .MuiOutlinedInput-input': { fontSize: 15 } };
export const authLabel = { fontSize: 13, fontWeight: 500, mb: 1, display: 'block' } as const;
export const startIcon = (icon: ReactNode) => (
  <InputAdornment position="start" sx={{ color: brand.slate, '& svg': { fontSize: 20 } }}>
    {icon}
  </InputAdornment>
);

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/';
  if (user) return <Navigate to={from} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (import.meta.env.DEV) {
      // Design preview (dev builds only): any email/password continues to the two-factor screen.
      navigate('/verify', { state: { email: email || 'admin@kindpack.com', from } });
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Admin Console"
      title="Run every roll, refill and rewarded kid — from one place."
      description="Approve heroes, dispatch deliveries, pay schools and report real impact across families, schools and businesses."
      footer={
        <>
          <Stat icon={<LocalShippingOutlined />} value="58" label="Heroes online" />
          <Stat icon={<EnergySavingsLeafOutlined />} value="56,840 kg" label="CO₂ saved · illustrative" />
          <Stat icon={<FlagOutlined />} value="312" label="Schools funded" />
        </>
      }
    >
      <Box>
        <AuthIcon>
          <GppGoodOutlined />
        </AuthIcon>
        <Typography component="h1" sx={{ fontWeight: 600, fontSize: 32, lineHeight: 1.18 }}>
          Welcome back
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 15, mt: 1 }}>Sign in to the {APP_NAME} admin console.</Typography>
      </Box>

      {import.meta.env.DEV && (
        <Alert severity="info" sx={{ borderRadius: '16px', alignItems: 'center' }}>
          Design preview: type anything and sign in.
        </Alert>
      )}

      <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography component="label" htmlFor="email" sx={authLabel}>
            Work email
          </Typography>
          <TextField id="email" type="email" autoComplete="email" required={!import.meta.env.DEV} fullWidth placeholder="admin@kindpack.com" value={email} onChange={(e) => setEmail(e.target.value)} sx={authFieldSx} slotProps={{ input: { startAdornment: startIcon(<MailOutline />) } }} />
        </Box>
        <Box>
          <Typography component="label" htmlFor="password" sx={authLabel}>
            Password
          </Typography>
          <TextField
            id="password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            required={!import.meta.env.DEV}
            fullWidth
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={authFieldSx}
            slotProps={{
              input: {
                startAdornment: startIcon(<LockOutlined />),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShow((s) => !s)} edge="end" aria-label={show ? 'Hide password' : 'Show password'} sx={{ color: brand.slate }}>
                      {show ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer', fontSize: 14 }}>
            <Checkbox defaultChecked size="small" sx={{ p: 0.25 }} />
            Keep me signed in
          </Box>
          <Link component={RouterLink} to="/forgot-password" underline="hover" sx={{ fontSize: 14, fontWeight: 500, color: '#1F6B45' }}>
            Forgot password?
          </Link>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Button type="submit" variant="contained" disabled={loading} endIcon={<ArrowForward sx={{ fontSize: 16 }} />} sx={{ height: 56 }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: '14px', borderRadius: '16px', bgcolor: brand.primarySoft, color: brand.primary }}>
        <LockOutlined sx={{ fontSize: 18 }} />
        <Typography sx={{ flex: 1, fontSize: 12, color: 'inherit' }}>Protected with two-factor authentication. All activity is logged.</Typography>
      </Box>
    </AuthShell>
  );
}

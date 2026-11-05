import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router';
import { Box, Button, Link, TextField, Typography } from '@mui/material';
import LockOutlined from '@mui/icons-material/LockOutlined';
import MailOutline from '@mui/icons-material/MailOutline';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import AuthShell, { AuthIcon } from '../layout/AuthShell';
import { authFieldSx, authLabel, startIcon } from './Login';
import { gradients, shadows } from '../theme';

const backLink = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#1F6B45', fontSize: 14, fontWeight: 500, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } } as const;

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // No reset-password API yet: this only continues the flow.
    navigate('/forgot-password/sent', { state: { email: email || 'admin@kindpack.com' } });
  };

  return (
    <AuthShell badge="Account recovery" title="Locked out? We will get you back in." description="Enter your admin email and we will send a secure link to reset your password.">
      <Box>
        <AuthIcon>
          <LockOutlined />
        </AuthIcon>
        <Typography component="h1" sx={{ fontWeight: 600, fontSize: 30, lineHeight: 1.18 }}>
          Forgot your password?
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 15, mt: 1 }}>No worries — enter your work email and we will send you a reset link.</Typography>
      </Box>
      <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography component="label" htmlFor="reset-email" sx={authLabel}>
            Work email
          </Typography>
          <TextField id="reset-email" type="email" autoFocus fullWidth placeholder="admin@kindpack.com" value={email} onChange={(e) => setEmail(e.target.value)} sx={authFieldSx} slotProps={{ input: { startAdornment: startIcon(<MailOutline />) } }} />
        </Box>
        <Button type="submit" variant="contained" endIcon={<ArrowForward sx={{ fontSize: 16 }} />} sx={{ height: 56 }}>
          Send reset link
        </Button>
        <Link component={RouterLink} to="/login" sx={backLink}>
          <ChevronLeft sx={{ fontSize: 16 }} /> Back to sign in
        </Link>
      </Box>
    </AuthShell>
  );
}

export function CheckEmail() {
  const email = (useLocation().state as { email?: string } | null)?.email ?? 'admin@kindpack.com';
  const [resent, setResent] = useState(false);

  return (
    <AuthShell badge="Reset link sent" title="Check your inbox." description="The reset link is valid for 30 minutes. If you do not see it, check your spam folder.">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1.25 }}>
        <Box sx={{ width: 96, height: 96, borderRadius: '48px', bgcolor: '#EEF5EF', display: 'grid', placeItems: 'center' }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '32px', display: 'grid', placeItems: 'center', background: gradients.icon, boxShadow: shadows.card }}>
            <MailOutline sx={{ color: '#fff', fontSize: 30 }} />
          </Box>
        </Box>
        <Typography component="h1" sx={{ fontWeight: 600, fontSize: 30, lineHeight: 1.18, mt: 0.75 }}>
          Check your email
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>We sent a password reset link to</Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 600, mt: -0.75, wordBreak: 'break-all' }}>{email}</Typography>
      </Box>
      <Button variant="contained" component="a" href="mailto:" startIcon={<MailOutline sx={{ fontSize: 16 }} />} sx={{ height: 56 }}>
        Open email app
      </Button>
      <Button variant="outlined" onClick={() => setResent(true)} sx={{ height: 52 }}>
        {resent ? 'Link sent again' : 'Resend link'}
      </Button>
      <Link component={RouterLink} to="/login" sx={backLink}>
        <ChevronLeft sx={{ fontSize: 16 }} /> Back to sign in
      </Link>
    </AuthShell>
  );
}

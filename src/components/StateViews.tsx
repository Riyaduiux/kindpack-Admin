import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, Typography } from '@mui/material';
import WarningAmber from '@mui/icons-material/WarningAmber';
import Refresh from '@mui/icons-material/Refresh';
import SupportOutlined from '@mui/icons-material/SupportOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import MailOutline from '@mui/icons-material/MailOutline';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import Close from '@mui/icons-material/Close';
import { brand, gradients, shadows, statusColors } from '../theme';

const panel = { position: 'relative', bgcolor: '#fff', borderRadius: '24px', boxShadow: shadows.card, minHeight: 533, p: 3 } as const;

/** Big round icon + title + text + code pill + actions, centred in a white card (error / no access / empty). */
function StatePanel({ tone, icon, title, body, code, actions, toast }: { tone: 'red' | 'amber'; icon: ReactNode; title: string; body: string; code: string; actions: ReactNode; toast?: ReactNode }) {
  const c = statusColors[tone];
  const grad = tone === 'red' ? gradients.coral : gradients.amber;
  const halo = tone === 'red' ? '#FBE3E0' : '#FBEFD3';
  return (
    <Box sx={{ ...panel, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 1.25 }}>
      {toast}
      <Box sx={{ width: 168, height: 168, borderRadius: '84px', bgcolor: halo, display: 'grid', placeItems: 'center', mb: 1.5 }}>
        <Box sx={{ width: 110, height: 110, borderRadius: '55px', background: grad, display: 'grid', placeItems: 'center', '& svg': { color: '#fff', fontSize: 52 } }}>{icon}</Box>
      </Box>
      <Typography component="h2" sx={{ fontSize: 24, fontWeight: 600, lineHeight: 1.2 }}>
        {title}
      </Typography>
      <Typography sx={{ maxWidth: 470, fontSize: 14, color: 'text.secondary', lineHeight: 1.45 }}>{body}</Typography>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: '4px', borderRadius: 999, bgcolor: c.bg, color: c.fg, fontSize: 11, fontWeight: 500 }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '3px', bgcolor: c.fg }} />
        {code}
      </Box>
      <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', justifyContent: 'center', mt: 1.5 }}>{actions}</Box>
    </Box>
  );
}

/** "Something went wrong" (5xx / network). */
export function ErrorState({ what = 'the dashboard', code = 'Error code · 503 Service unavailable', message = 'Could not reach the server', onRetry }: { what?: string; code?: string; message?: string; onRetry?: () => void }) {
  const navigate = useNavigate();
  return (
    <StatePanel
      tone="red"
      icon={<WarningAmber />}
      title="Something went wrong"
      body={`We could not load ${what}. This is usually temporary — please try again in a moment.`}
      code={code}
      toast={
        <Box role="alert" sx={{ position: 'absolute', top: 16, right: 24, display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderRadius: '14px', bgcolor: '#0B2E1F', boxShadow: shadows.card, textAlign: 'left' }}>
          <Box sx={{ width: 30, height: 30, borderRadius: '15px', bgcolor: brand.coral, display: 'grid', placeItems: 'center' }}>
            <Close sx={{ color: '#fff', fontSize: 16 }} />
          </Box>
          <Box>
            <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>Request failed</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{message}</Typography>
          </Box>
        </Box>
      }
      actions={
        <>
          <Button variant="contained" startIcon={<Refresh />} onClick={onRetry ?? (() => window.location.reload())} sx={{ minHeight: 44 }}>
            Try again
          </Button>
          <Button variant="outlined" startIcon={<SupportOutlined />} onClick={() => navigate('/support')} sx={{ minHeight: 44 }}>
            Contact support
          </Button>
        </>
      }
    />
  );
}

/** 403: the signed-in role may not open this area. */
export function NoAccess({ area, role = 'Support', permission = 'Finance' }: { area: string; role?: string; permission?: string }) {
  const navigate = useNavigate();
  return (
    <StatePanel
      tone="amber"
      icon={<LockOutlined />}
      title={`You don’t have access to ${area}`}
      body={`Your role (${role}) cannot view or run ${area.toLowerCase()}. Ask a Super admin to grant the ${permission} permission if you need it.`}
      code="Error code · 403 Forbidden"
      actions={
        <>
          <Button variant="contained" startIcon={<MailOutline />} onClick={() => navigate('/support')} sx={{ minHeight: 44 }}>
            Request access
          </Button>
          <Button variant="outlined" startIcon={<DashboardOutlined />} onClick={() => navigate('/')} sx={{ minHeight: 44 }}>
            Go to dashboard
          </Button>
        </>
      }
    />
  );
}

const shimmer = {
  bgcolor: '#E9EEE8',
  borderRadius: '12px',
  animation: 'kp-pulse 1.4s ease-in-out infinite',
  '@keyframes kp-pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.55 } },
} as const;

const Bar = ({ w, h = 14, r = 8 }: { w: number | string; h?: number; r?: number }) => <Box sx={{ ...shimmer, width: w, height: h, borderRadius: `${r}px`, maxWidth: '100%' }} />;

/** Placeholder layout shown while the dashboard loads. */
export function DashboardSkeleton() {
  return (
    <Box aria-busy aria-label="Loading dashboard">
      <Box sx={{ ...shimmer, height: 172, borderRadius: '30px', bgcolor: 'rgba(11,46,31,0.06)', p: 4, display: 'flex', flexDirection: 'column', gap: 1.5, justifyContent: 'center', mb: 3 }}>
        <Bar w={216} h={16} r={999} />
        <Bar w={433} h={28} />
        <Bar w={350} h={12} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} sx={{ bgcolor: '#fff', borderRadius: '24px', p: '22px', height: 139, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Bar w={38} h={38} r={12} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Bar w={116} h={22} />
              <Bar w={91} h={10} />
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.79fr 1fr' }, gap: 3, mb: 3, alignItems: 'start' }}>
        <Box sx={{ bgcolor: '#fff', borderRadius: '24px', p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Bar w={167} h={14} />
          <Bar w={133} h={22} />
          <Box sx={{ ...shimmer, height: 190, borderRadius: '14px', mt: 1 }} />
        </Box>
        <Box sx={{ bgcolor: '#fff', borderRadius: '24px', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Bar w={134} h={14} />
          <Box sx={{ width: 183, height: 183, borderRadius: '50%', border: '36px solid #E9EEE8', boxSizing: 'border-box', mx: 'auto', mt: 1, animation: 'kp-pulse 1.4s ease-in-out infinite' }} />
        </Box>
      </Box>
      <Box sx={{ bgcolor: '#fff', borderRadius: '24px', p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Bar w={167} h={14} />
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Bar w={40} h={40} r={20} />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Bar w={216} h={10} />
              <Bar w={150} h={8} />
            </Box>
            <Bar w={83} h={10} />
            <Bar w={74} h={22} r={11} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

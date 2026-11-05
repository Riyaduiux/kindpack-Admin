import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import LockOutlined from '@mui/icons-material/LockOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import GppGoodOutlined from '@mui/icons-material/GppGoodOutlined';
import { APP_NAME, brand, gradients, shadows } from '../theme';

const FEATURES = [
  { icon: <LockOutlined />, label: 'Encrypted sessions' },
  { icon: <DescriptionOutlined />, label: 'Full audit trail' },
  { icon: <GppGoodOutlined />, label: 'Role-based access' },
];

interface Props {
  badge: string;
  title: string;
  description: string;
  /** Bottom row of the brand panel. Defaults to the three security feature cards. */
  footer?: ReactNode;
  children: ReactNode;
}

/** Two-column auth layout used by login, two-factor, forgot password and check-your-email. */
export default function AuthShell({ badge, title, description, footer, children }: Props) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.14fr 1fr' }, gap: { md: 2 }, p: { xs: 0, md: 3 }, background: gradients.page }}>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', p: { md: 5, xl: 9 }, borderRadius: '36px', boxShadow: shadows.card, background: gradients.panel }}>
        <Box component="img" src="/assets/login-decor-lg.svg" alt="" aria-hidden sx={{ position: 'absolute', right: -40, top: -120, width: 520, height: 520 }} />
        <Box component="img" src="/assets/login-decor-lg.svg" alt="" aria-hidden sx={{ position: 'absolute', left: -160, bottom: -80, width: 520, height: 520 }} />
        <Box component="img" src="/assets/login-decor-sm.svg" alt="" aria-hidden sx={{ position: 'absolute', left: '42%', bottom: 200, width: 300, height: 300 }} />

        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1.75 }}>
          <Box sx={{ width: 52, height: 52, borderRadius: '15.6px', bgcolor: '#fff', display: 'grid', placeItems: 'center' }}>
            <Box component="img" src="/assets/logo-mark.png" alt="" sx={{ width: 32, height: 32 }} />
          </Box>
          <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 26 }}>{APP_NAME}</Typography>
        </Box>

        <Box sx={{ position: 'relative', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1, px: '14px', py: '6px', borderRadius: 999, bgcolor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '4px', bgcolor: brand.lime }} />
            <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{badge}</Typography>
          </Box>
          <Typography component="h2" sx={{ color: '#fff', fontWeight: 600, fontSize: { md: 38, xl: 50 }, lineHeight: 1.12 }}>
            {title}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, lineHeight: 1.4 }}>{description}</Typography>
        </Box>

        <Box sx={{ position: 'relative', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {footer ??
            FEATURES.map((f) => (
              <Box key={f.label} sx={{ width: 190, p: '18px', borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                <Box sx={{ width: 38, height: 38, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.15)', display: 'grid', placeItems: 'center', '& svg': { fontSize: 19, color: '#fff' } }}>{f.icon}</Box>
                <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{f.label}</Typography>
              </Box>
            ))}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', placeItems: 'center', p: { xs: 2, sm: 4 } }}>
        <Box sx={{ width: '100%', maxWidth: 520, p: { xs: 3, sm: '44px' }, bgcolor: '#fff', borderRadius: '32px', border: '1px solid rgba(11,46,31,0.04)', boxShadow: shadows.card, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

/** Rounded gradient icon tile that opens every auth card. */
export function AuthIcon({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ width: 56, height: 56, borderRadius: '18px', display: 'grid', placeItems: 'center', background: gradients.primary, boxShadow: shadows.card, mb: 1.75, '& svg': { color: '#fff', fontSize: 26 } }}>{children}</Box>
  );
}

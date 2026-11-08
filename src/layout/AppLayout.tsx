import { useMemo, useState } from 'react';
import { FeedbackProvider } from '../components/popups';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { Box, Drawer, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import EnergySavingsLeafOutlined from '@mui/icons-material/EnergySavingsLeafOutlined';
import { isActive, navigation } from './navigation';
import { LayoutContext } from './LayoutContext';
import { useAuth } from '../auth/AuthContext';
import { initials } from '../components/cells';
import { APP_NAME, brand, gradients, shadows } from '../theme';

const SIDEBAR_WIDTH = 272;
const GUTTER = 24;

const decor = (src: string, sx: object) => (
  <Box component="img" src={src} alt="" aria-hidden sx={{ position: 'absolute', pointerEvents: 'none', ...sx }} />
);

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        px: '18px',
        py: '22px',
        borderRadius: '28px',
        boxShadow: shadows.card,
        background: gradients.sidebar,
      }}
    >
      {decor('/assets/side-decor-a.svg', { left: 180, top: -60, width: 260, height: 260 })}
      {decor('/assets/side-decor-b.svg', { left: -90, bottom: 60, width: 300, height: 300 })}

      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1.5, px: 0.5, py: 0.25 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: '12.6px', bgcolor: '#fff', display: 'grid', placeItems: 'center' }}>
          <Box component="img" src="/assets/logo-mark.png" alt="" sx={{ width: 26, height: 26 }} />
        </Box>
        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 19 }}>{APP_NAME}</Typography>
      </Box>
      <Typography sx={{ position: 'relative', color: brand.lime, fontSize: 10, fontWeight: 500, mt: 0.25 }}>ADMIN CONSOLE</Typography>

      <Box sx={{ position: 'relative', flex: 1, minHeight: 0, overflowY: 'auto', mt: 1.25, mx: -0.5, px: 0.5, '&::-webkit-scrollbar': { width: 0 } }}>
        {navigation.map((group) => (
          <Box key={group.label} sx={{ mb: 1 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 500, letterSpacing: '0.6px', mb: '3px', textTransform: 'uppercase' }}>
              {group.label}
            </Typography>
            {group.items.map((item) => {
              const active = isActive(item, pathname);
              return (
                <Box
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  onClick={onNavigate}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: '14px',
                    py: '11px',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    color: active ? forestText : 'rgba(255,255,255,0.85)',
                    bgcolor: active ? '#fff' : 'transparent',
                    boxShadow: active ? shadows.card : 'none',
                    '&:hover': { bgcolor: active ? '#fff' : 'rgba(255,255,255,0.08)' },
                    '& svg': { fontSize: 19, flexShrink: 0 },
                  }}
                >
                  {item.icon}
                  <Typography component="span" sx={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: active ? 600 : 400, color: 'inherit', lineHeight: 1.3 }}>
                    {item.label}
                  </Typography>
                  {item.badge ? (
                    <Box sx={{ bgcolor: brand.coral, color: '#fff', fontSize: 10, fontWeight: 600, px: '7px', py: '2px', borderRadius: 999 }}>{item.badge}</Box>
                  ) : null}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      <Box
        sx={{ position: 'relative', mt: 1.5, p: 2, borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: gradients.impact, display: 'flex', flexDirection: 'column', gap: 1 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.85)' }}>
          <EnergySavingsLeafOutlined sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'inherit' }}>This week’s impact</Typography>
        </Box>
        <Typography sx={{ color: '#fff', fontSize: 20, fontWeight: 600, lineHeight: 1.4 }}>CO₂ impact · illustrative</Typography>
        <Box
          component="button"
          type="button"
          onClick={() => {
            onNavigate?.();
            navigate('/esg');
          }}
          sx={{ height: 36, border: 0, borderRadius: '12px', bgcolor: '#fff', color: forestText, font: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
        >
          View report
        </Box>
      </Box>

      <Box sx={{ position: 'relative', mt: 1.25, p: '10px', borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: '19px', bgcolor: '#DCEFE0', color: '#145233', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 600 }}>
          {initials(user?.name ?? 'A')}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography noWrap sx={{ color: '#fff', fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>
            {user?.name ?? 'Admin'}
          </Typography>
          <Typography noWrap sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>
            Super admin
          </Typography>
        </Box>
        <MoreHoriz sx={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }} />
      </Box>
    </Box>
  );
}

const forestText = '#0E3B26';

const TABS = [
  { label: 'Home', to: '/', icon: <HomeOutlined />, match: (p: string) => p === '/' },
  { label: 'Approvals', to: '/approvals', icon: <TaskAltOutlined />, match: (p: string) => p.startsWith('/approvals') || p.startsWith('/referrals') },
  { label: 'Orders', to: '/orders', icon: <ShoppingBagOutlined />, match: (p: string) => p.startsWith('/orders') },
  { label: 'Stock', to: '/inventory/stock', icon: <Inventory2Outlined />, match: (p: string) => p.startsWith('/inventory') },
];

/** Figma mobile tab bar: Home, Approvals, Orders, Stock and More (opens the full menu). */
function TabBar({ onMore }: { onMore: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const item = (on: boolean) => ({ flex: 1, border: 0, bgcolor: 'transparent', font: 'inherit', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '3px', cursor: 'pointer', color: on ? '#145233' : brand.slate, fontSize: 11, fontWeight: on ? 600 : 500, '& svg': { fontSize: 24 } });
  return (
    <Box component="nav" aria-label="Main" sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1100, height: 72, px: 1, pt: '10px', display: 'flex', bgcolor: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(11,46,31,0.07)', boxShadow: '0 -8px 24px rgba(11,46,31,0.06)' }}>
      {TABS.map((t) => (
        <Box key={t.label} component="button" type="button" onClick={() => navigate(t.to)} sx={item(t.match(pathname))}>
          {t.icon}
          {t.label}
        </Box>
      ))}
      <Box component="button" type="button" onClick={onMore} sx={item(false)}>
        <MoreHoriz />
        More
      </Box>
    </Box>
  );
}

export default function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const ctx = useMemo(() => ({ openMenu: () => setMobileOpen(true), isDesktop }), [isDesktop]);

  return (
    <LayoutContext.Provider value={ctx}>
      <Box sx={{ minHeight: '100vh' }}>
        {isDesktop ? (
          <Box component="nav" sx={{ position: 'fixed', left: GUTTER, top: GUTTER, bottom: GUTTER, width: SIDEBAR_WIDTH, zIndex: 10 }}>
            <SidebarContent />
          </Box>
        ) : (
          <Drawer
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH + 2 * 12, p: 1.5, bgcolor: 'transparent', boxShadow: 'none', backgroundImage: 'none' } }}
          >
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </Drawer>
        )}
        {!isDesktop ? <TabBar onMore={() => setMobileOpen(true)} /> : null}
        <Box component="main" sx={{ ml: { lg: `${SIDEBAR_WIDTH + 2 * GUTTER}px` }, pr: { xs: 2, md: 3 }, pl: { xs: 2, md: 3, lg: 0 }, py: { xs: 2, md: 3.5 }, pb: { xs: '96px', lg: 3.5 }, minWidth: 0 }}>
          <FeedbackProvider>
            <Outlet />
          </FeedbackProvider>
        </Box>
      </Box>
    </LayoutContext.Provider>
  );
}

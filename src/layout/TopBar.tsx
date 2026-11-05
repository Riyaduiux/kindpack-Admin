import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Popover, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import { useAuth } from '../auth/AuthContext';
import { initials } from '../components/cells';
import { brand, gradients, shadows } from '../theme';
import { useLayout } from './LayoutContext';

const NOTIFICATIONS = [
  { title: 'New hero application', sub: 'James K. applied for Zone 4', time: '20 min', color: '#E5574B' },
  { title: 'Refund requested on #KP-10479', sub: 'Grace Walker · item damaged · refund AUD 6.00', time: '30 min', color: '#E5574B' },
  { title: 'Payout failed for Parkside Primary', sub: 'Bank transfer rejected', time: '1h', color: '#E5574B' },
  { title: 'Low stock: All-purpose cleaner', sub: '18 units left at Greenfield Warehouse', time: '2h', color: '#D99A1E' },
  { title: 'Campaign submitted for review', sub: 'Playground Upgrade', time: 'Yesterday', color: '#1D4F91' },
];

const circle = { width: 46, height: 46, bgcolor: '#fff', boxShadow: shadows.card, color: brand.ink, '&:hover': { bgcolor: '#fff' } } as const;

/** Page title on the left, search + calendar + bell + profile on the right. */
export default function TopBar({ title, helper }: { title: ReactNode; helper?: ReactNode }) {
  const { user, logout } = useAuth();
  const { openMenu, isDesktop } = useLayout();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [bellAnchor, setBellAnchor] = useState<HTMLElement | null>(null);
  const [unread, setUnread] = useState(true);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        {!isDesktop && (
          <IconButton onClick={openMenu} aria-label="Open menu" sx={circle}>
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography component="h1" sx={{ fontWeight: 600, fontSize: { xs: 24, md: 30 }, lineHeight: 1.2 }}>
            {title}
          </Typography>
          {helper ? (
            <Typography sx={{ color: 'text.secondary', fontSize: 14, mt: 0.25 }}>{helper}</Typography>
          ) : null}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.25, height: 46, width: 340, px: 2, borderRadius: '23px', bgcolor: '#fff', boxShadow: shadows.card }}>
          <SearchOutlined sx={{ fontSize: 18, color: brand.slate }} />
          <Box component="input" placeholder="Search anything…" aria-label="Search" sx={{ flex: 1, minWidth: 0, border: 0, outline: 0, bgcolor: 'transparent', font: 'inherit', fontSize: 14, color: brand.ink, '&::placeholder': { color: brand.placeholder } }} />
          <Box sx={{ bgcolor: brand.chip, color: brand.slate, fontSize: 11, fontWeight: 500, px: 1, py: '2px', borderRadius: '8px' }}>⌘K</Box>
        </Box>
        <IconButton aria-label="Calendar" sx={circle}>
          <CalendarTodayOutlined sx={{ fontSize: 19 }} />
        </IconButton>
        <IconButton aria-label="Notifications" onClick={(e) => setBellAnchor(e.currentTarget)} sx={{ ...circle, position: 'relative' }}>
          <NotificationsNoneOutlined sx={{ fontSize: 20 }} />
          {unread ? <Box sx={{ position: 'absolute', top: 10, right: 11, width: 9, height: 9, borderRadius: '5px', bgcolor: brand.coral, border: '2px solid #fff', boxSizing: 'content-box', m: '-2px' }} /> : null}
        </IconButton>
        <Popover
          open={!!bellAnchor}
          anchorEl={bellAnchor}
          onClose={() => setBellAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { mt: 1.5, width: 380, maxWidth: 'calc(100vw - 24px)', p: 2.5, borderRadius: '24px', boxShadow: '0 24px 60px rgba(11,46,31,0.18)' } } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Notifications</Typography>
            <Box component="button" type="button" onClick={() => setUnread(false)} sx={{ border: 0, bgcolor: 'transparent', font: 'inherit', fontSize: 12, fontWeight: 500, color: '#1F6B45', cursor: 'pointer' }}>
              Mark all as read
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {NOTIFICATIONS.map((n) => (
              <Box key={n.title} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: '12px 14px', borderRadius: '14px', bgcolor: '#F6F8F5' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '4px', mt: '7px', flexShrink: 0, bgcolor: unread ? n.color : '#CBD2CC' }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>{n.title}</Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{n.sub}</Typography>
                </Box>
                <Typography sx={{ fontSize: 11, color: brand.placeholder, whiteSpace: 'nowrap' }}>{n.time}</Typography>
              </Box>
            ))}
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => {
              setBellAnchor(null);
              navigate('/notifications');
            }}
            sx={{ mt: 2, width: '100%', height: 44, border: 0, borderRadius: '12px', background: gradients.primary, color: '#fff', font: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', boxShadow: shadows.card }}
          >
            View all notifications
          </Box>
        </Popover>
        <IconButton
          aria-label="Account menu"
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{ width: 50, height: 50, color: '#fff', fontSize: 14, fontWeight: 600, border: '3px solid #fff', background: gradients.impact, boxShadow: shadows.card, '&:hover': { background: gradients.impact } }}
        >
          {initials(user?.name ?? 'A')}
        </IconButton>
        <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
          <MenuItem disabled>
            <Typography variant="body2">{user?.email}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchor(null);
              navigate('/settings');
            }}
          >
            <ListItemIcon>
              <SettingsOutlined fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchor(null);
              logout();
              navigate('/login');
            }}
          >
            <ListItemIcon>
              <LogoutOutlined fontSize="small" />
            </ListItemIcon>
            Log out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

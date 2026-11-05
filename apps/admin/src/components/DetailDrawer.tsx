import type { ReactNode } from 'react';
import { Avatar, Box, Divider, Drawer, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StatusChip from './StatusChip';
import { brand } from '../theme';

export interface DetailSection {
  title: string;
  rows: [string, ReactNode][];
}

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  status?: string;
  avatar?: string;
  sections?: DetailSection[];
  actions?: ReactNode;
  children?: ReactNode;
  width?: number;
}

/** Right-side detail drawer (Brief v2 prefers drawers over crowded screens). */
export default function DetailDrawer({ open, onClose, title, subtitle, status, avatar, sections = [], actions, children, width = 460 }: Props) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: width }, borderRadius: 0 } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2.5 }}>
        {avatar !== undefined ? (
          <Avatar sx={{ bgcolor: brand.primarySoft, color: brand.primary, fontWeight: 700 }}>{avatar}</Avatar>
        ) : null}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
          {status ? (
            <Box sx={{ mt: 1 }}>
              <StatusChip status={status} />
            </Box>
          ) : null}
        </Box>
        <IconButton onClick={onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {sections.map((s) => (
          <Box key={s.title}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.8 }}>
              {s.title}
            </Typography>
            <Box sx={{ mt: 0.5, border: `1px solid ${brand.border}`, borderRadius: 3, overflow: 'hidden' }}>
              {s.rows.map(([label, value], i) => (
                <Box
                  key={label}
                  sx={{ display: 'flex', gap: 2, px: 2, py: 1.25, bgcolor: i % 2 ? '#FBFAF7' : '#fff', alignItems: 'center' }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                    {label}
                  </Typography>
                  <Box sx={{ fontSize: 14, fontWeight: 500, minWidth: 0, wordBreak: 'break-word' }}>{value}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
        {children}
      </Box>
      {actions ? (
        <>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>{actions}</Box>
        </>
      ) : null}
    </Drawer>
  );
}

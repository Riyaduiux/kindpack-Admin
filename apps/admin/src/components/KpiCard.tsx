import type { ReactNode } from 'react';
import { Box, Card, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { brand, statusColors } from '../theme';

export interface Kpi {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down';
  helper?: string;
  icon?: ReactNode;
  tone?: keyof typeof statusColors | 'brand';
}

export function KpiCard({ label, value, delta, trend, helper, icon, tone = 'brand' }: Kpi) {
  const accent = tone === 'brand' ? { fg: brand.primary, bg: brand.primarySoft } : statusColors[tone];
  return (
    <Card sx={{ p: 2.25, display: 'flex', flexDirection: 'column', gap: 1, minHeight: 118 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
        {icon ? (
          <Box sx={{ width: 34, height: 34, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: accent.bg, color: accent.fg, '& svg': { fontSize: 19 } }}>
            {icon}
          </Box>
        ) : null}
      </Box>
      <Typography variant="h5" sx={{ fontSize: 26, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Typography>
      {delta || helper ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {delta ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, color: trend === 'down' ? statusColors.red.fg : statusColors.green.fg, fontSize: 13, fontWeight: 600 }}>
              {trend === 'down' ? <TrendingDownIcon sx={{ fontSize: 16 }} /> : <TrendingUpIcon sx={{ fontSize: 16 }} />}
              {delta}
            </Box>
          ) : null}
          {helper ? (
            <Typography variant="caption" color="text.secondary">
              {helper}
            </Typography>
          ) : null}
        </Box>
      ) : null}
    </Card>
  );
}

export function KpiRow({ items, min = 200 }: { items: Kpi[]; min?: number }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: `repeat(auto-fit, minmax(${min}px, 1fr))` }, gap: { xs: 1.5, sm: 2 }, mb: 3 }}>
      {items.map((k) => (
        <KpiCard key={k.label} {...k} />
      ))}
    </Box>
  );
}

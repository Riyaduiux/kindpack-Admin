import { useState, type ReactNode } from 'react';
import { Avatar, Box, LinearProgress, Tab, Tabs, Typography } from '@mui/material';
import { brand } from '../theme';

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/** Avatar + primary text + secondary text, for the first column of people tables. */
export function NameCell({ name, sub, square }: { name: string; sub?: string; square?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
      <Avatar variant={square ? 'rounded' : 'circular'} sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 700, bgcolor: brand.primarySoft, color: brand.primary }}>
        {initials(name)}
      </Avatar>
      <Box sx={{ minWidth: 0, lineHeight: 1.25 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {name}
        </Typography>
        {sub ? (
          <Typography variant="caption" color="text.secondary" noWrap component="div">
            {sub}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}

export function ProgressCell({ value, label }: { value: number; label?: string }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" fontWeight={600}>
          {label ?? `${Math.round(value)}%`}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(value, 100)}
        sx={{ height: 6, borderRadius: 3, bgcolor: '#EEEDE8', '& .MuiLinearProgress-bar': { bgcolor: value >= 100 ? '#2E7D4F' : brand.primary, borderRadius: 3 } }}
      />
    </Box>
  );
}

/** Section tabs used on screens that hold several sitemap sub-pages. */
export function PageTabs({ tabs, children }: { tabs: { label: string; count?: number }[]; children: (index: number) => ReactNode }) {
  const [index, setIndex] = useState(0);
  return (
    <>
      <Tabs
        value={index}
        onChange={(_, v) => setIndex(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        {tabs.map((t) => (
          <Tab key={t.label} label={t.count !== undefined ? `${t.label} (${t.count})` : t.label} />
        ))}
      </Tabs>
      {children(index)}
    </>
  );
}

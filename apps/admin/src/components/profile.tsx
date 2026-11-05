import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Avatar, Btn, Card, hair, Pill, Segmented, type AvatarTone, type Tone, cardSx } from './kit';
import { brand, forest, gradients, shadows } from '../theme';

/** Back button + status pills on the left, page actions on the right. */
export function DetailBar({ pills, actions }: { pills?: ReactNode; actions?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mt: -1, mb: 3 }}>
      <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ width: 40, height: 40, border: hair, bgcolor: '#fff', '&:hover': { bgcolor: '#fff' } }}>
        <ChevronLeft />
      </IconButton>
      {pills}
      <Box sx={{ flex: 1 }} />
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>{actions}</Box>
    </Box>
  );
}

/** Green cover banner + avatar + name + meta + stat chips (user / school / business profiles). */
export function ProfileHero({ initials, tone, name, badge, meta, stats }: { initials: string; tone?: AvatarTone; name: string; badge?: ReactNode; meta: string; stats: { value: string; label: string }[] }) {
  return (
    <Box sx={{ ...cardSx, overflow: 'hidden', borderRadius: '28px' }}>
      <Box sx={{ position: 'relative', height: 112, background: gradients.hero, overflow: 'hidden' }}>
        <Box component="img" src="/assets/hero-decor-a.svg" alt="" aria-hidden sx={{ position: 'absolute', left: '36%', top: -80, width: 260, height: 260 }} />
        <Box component="img" src="/assets/hero-decor-a.svg" alt="" aria-hidden sx={{ position: 'absolute', left: '60%', top: -150, width: 380, height: 380 }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, px: 3, pb: 2.5, flexWrap: 'wrap' }}>
        <Box sx={{ mt: '-40px', p: '5px', borderRadius: '50%', bgcolor: '#fff', boxShadow: shadows.card }}>
          <Avatar initials={initials} tone={tone} size={80} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 260, pt: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3 }}>{name}</Typography>
            {badge}
          </Box>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.25 }}>{meta}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', pt: 1.5 }}>
          {stats.map((s) => (
            <Box key={s.label} sx={{ minWidth: 88, px: 2, py: 1.25, borderRadius: '16px', bgcolor: '#F3F6F2' }}>
              <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export function SubTabs({ tabs, value, onChange }: { tabs: string[]; value: string; onChange: (t: string) => void }) {
  return (
    <Box role="tablist" sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
      {tabs.map((t) => {
        const on = t === value;
        return (
          <Box key={t} role="tab" aria-selected={on} component="button" type="button" onClick={() => onChange(t)} sx={{ border: on ? 0 : hair, px: '18px', height: 38, borderRadius: 999, font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', bgcolor: on ? undefined : '#fff', background: on ? gradients.primary : undefined, color: on ? '#fff' : brand.ink }}>
            {t}
          </Box>
        );
      })}
    </Box>
  );
}

/** Icon tile + small label + value (profile / details lists). */
export function InfoRow({ icon, label, value, last }: { icon: ReactNode; label: string; value: ReactNode; last?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, py: 1.5, borderBottom: last ? 0 : hair }}>
      <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: '#EEF5EF', color: forest[700], display: 'grid', placeItems: 'center', flexShrink: 0, '& svg': { fontSize: 19 } }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{label}</Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 500, wordBreak: 'break-word' }}>{value}</Typography>
      </Box>
    </Box>
  );
}

/** Vertical bars; the last one is the dark highlight. */
export function BarChart({ values, labels, height = 120, color = '#BFE3C8', highlight = forest[700] }: { values: number[]; labels?: string[]; height?: number; color?: string; highlight?: string }) {
  const max = Math.max(...values) || 1;
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: { xs: 0.75, md: 1.75 }, height }}>
        {values.map((v, i) => (
          <Box key={i} sx={{ flex: 1, height: `${Math.max(8, (v / max) * 100)}%`, borderRadius: '10px', bgcolor: i === values.length - 1 ? highlight : color }} />
        ))}
      </Box>
      {labels ? (
        <Box sx={{ display: 'flex', gap: { xs: 0.75, md: 1.75 }, mt: 1.25 }}>
          {labels.map((l) => (
            <Typography key={l} sx={{ flex: 1, textAlign: 'right', fontSize: 12, color: brand.placeholder }}>
              {l}
            </Typography>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

/** Card with a Segmented range switch + bar chart. */
export function BarCard({ title, subtitle, ranges, data, labels, height }: { title: string; subtitle: string; ranges: string[]; data: Record<string, number[]>; labels?: Record<string, string[]>; height?: number }) {
  const [r, setR] = useState(ranges[0]);
  return (
    <Card title={title} subtitle={subtitle} right={<Segmented options={ranges} value={r} onChange={setR} />}>
      <BarChart values={data[r]} labels={labels?.[r]} height={height} />
    </Card>
  );
}

/** Three green tiles with big numbers + footnote + "View ESG roll-up". */
export function ImpactCard({ title, subtitle, tiles, note }: { title: string; subtitle: string; tiles: { value: string; label: string }[]; note: string }) {
  const navigate = useNavigate();
  return (
    <Card title={title} subtitle={subtitle}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: `repeat(${tiles.length}, 1fr)` }, gap: 2 }}>
        {tiles.map((t) => (
          <Box key={t.label} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#EEF5EF' }}>
            <Typography sx={{ fontSize: 24, fontWeight: 600, color: forest[700], lineHeight: 1.3 }}>{t.value}</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{t.label}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{note}</Typography>
        <Btn small icon={<ArrowForward sx={{ fontSize: 14 }} />} onClick={() => navigate('/esg')}>
          View ESG roll-up
        </Btn>
      </Box>
    </Card>
  );
}

export { Pill };
export type { Tone };

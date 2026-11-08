import { useState, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Checkbox, Dialog, IconButton, InputBase, Typography, useMediaQuery } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Close from '@mui/icons-material/Close';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import WarningAmber from '@mui/icons-material/WarningAmber';
import { brand, forest, gradients, shadows, statusColors } from '../theme';

// Shared building blocks for every Admin Panel screen (Figma: Admin Panel › Design system + screens).

export type Tone = keyof typeof statusColors;
export type AvatarTone = 'green' | 'amber' | 'blue' | 'red' | 'purple';
const avatarTones: Record<AvatarTone, { bg: string; fg: string }> = {
  green: { bg: '#DCEFE0', fg: '#145233' },
  amber: { bg: '#FBE9C4', fg: '#8A5A00' },
  blue: { bg: '#DCEAF8', fg: '#1D4F91' },
  red: { bg: '#F4DAD5', fg: '#B3261E' },
  purple: { bg: '#E7E0F6', fg: '#5B3FA8' },
};

/** True on phones and small tablets: the Figma mobile layouts (cards instead of tables, bottom sheets instead of dialogs). */
export const useIsMobile = () => useMediaQuery('(max-width:899.95px)');

export const hair = '1px solid rgba(11,46,31,0.07)';

/* ───────────── atoms ───────────── */

export function Pill({ tone = 'green', children, dot = true, sx }: { tone?: Tone; children: ReactNode; dot?: boolean; sx?: object }) {
  const c = statusColors[tone];
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: '10px', py: '4px', borderRadius: 999, bgcolor: c.bg, color: c.fg, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', ...sx }}>
      {dot ? <Box sx={{ width: 6, height: 6, borderRadius: '3px', bgcolor: c.fg }} /> : null}
      {children}
    </Box>
  );
}

/** Small rounded-rectangle tag (role / type labels in tables). */
export function Tag({ tone = 'green', children }: { tone?: Tone; children: ReactNode }) {
  const c = statusColors[tone];
  return <Box sx={{ display: 'inline-block', px: '10px', py: '3px', borderRadius: '8px', bgcolor: c.bg, color: c.fg, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>{children}</Box>;
}

export function Avatar({ initials, tone = 'green', size = 40 }: { initials: string; tone?: AvatarTone; size?: number }) {
  const t = avatarTones[tone];
  return (
    <Box sx={{ width: size, height: size, borderRadius: `${size / 2}px`, bgcolor: t.bg, color: t.fg, display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: size >= 56 ? 20 : size > 40 ? 16 : size < 36 ? 12 : 14, flexShrink: 0 }}>
      {initials}
    </Box>
  );
}

export function Person({ initials, tone, name, sub, size = 46 }: { initials: string; tone?: AvatarTone; name: ReactNode; sub?: ReactNode; size?: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
      <Avatar initials={initials} tone={tone} size={size} />
      <Box sx={{ minWidth: 0 }}>
        <Typography noWrap sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{name}</Typography>
        {sub ? <Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>{sub}</Typography> : null}
      </Box>
    </Box>
  );
}

type BtnKind = 'primary' | 'secondary' | 'danger' | 'light' | 'ghost';
export function Btn({ kind = 'secondary', icon, endIcon, children, onClick, to, disabled, small, full, sx }: { kind?: BtnKind; icon?: ReactNode; endIcon?: ReactNode; children?: ReactNode; onClick?: () => void; to?: string; disabled?: boolean; small?: boolean; full?: boolean; sx?: object }) {
  const base = { height: small ? 38 : 44, minHeight: small ? 38 : 44, px: small ? '16px' : '20px', borderRadius: '12px', fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', width: full ? '100%' : undefined } as const;
  const styles: Record<BtnKind, object> = {
    primary: { background: gradients.primary, color: '#fff', boxShadow: shadows.card, '&:hover': { background: gradients.primary, filter: 'brightness(1.12)' } },
    danger: { background: gradients.danger, color: '#fff', boxShadow: shadows.card, '&:hover': { background: gradients.danger, filter: 'brightness(1.05)' } },
    secondary: { bgcolor: '#fff', color: brand.ink, border: '1px solid rgba(11,46,31,0.07)', '&:hover': { bgcolor: '#fff', borderColor: 'rgba(11,46,31,0.2)' } },
    light: { bgcolor: '#EEF5EF', color: forest[700], '&:hover': { bgcolor: '#E3EEE5' } },
    ghost: { color: '#1F6B45', '&:hover': { bgcolor: 'rgba(31,107,69,0.06)' } },
  };
  const link = to ? { component: RouterLink, to } : {};
  return (
    <Button {...link} onClick={onClick} disabled={disabled} startIcon={icon} endIcon={endIcon} sx={{ ...base, ...styles[kind], '&.Mui-disabled': { bgcolor: '#E6ECE7', color: brand.placeholder, boxShadow: 'none', background: '#E6ECE7' }, ...sx }}>
      {children}
    </Button>
  );
}

export function RoundBtn({ children, label, onClick, solid }: { children: ReactNode; label: string; onClick?: () => void; solid?: boolean }) {
  return (
    <IconButton aria-label={label} onClick={onClick} sx={{ width: 40, height: 40, border: solid ? 0 : hair, bgcolor: solid ? undefined : '#fff', background: solid ? gradients.primary : undefined, color: solid ? '#fff' : brand.slate, '& svg': { fontSize: 18 }, '&:hover': { bgcolor: solid ? undefined : '#F6F8F5' } }}>
      {children}
    </IconButton>
  );
}

/* ───────────── cards ───────────── */

export const cardSx = { bgcolor: '#fff', border: '1px solid rgba(11,46,31,0.04)', borderRadius: '24px', boxShadow: shadows.card, minWidth: 0 } as const;

export function Card({ title, subtitle, right, children, pad = 3, sx }: { title?: ReactNode; subtitle?: ReactNode; right?: ReactNode; children?: ReactNode; pad?: number; sx?: object }) {
  return (
    <Box sx={{ ...cardSx, p: pad ? { xs: Math.min(pad, 2.1), md: pad } : 0, borderRadius: { xs: '20px', md: '24px' }, display: 'flex', flexDirection: 'column', gap: 2, ...sx }}>
      {title ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.4 }}>{title}</Typography>
            {subtitle ? <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{subtitle}</Typography> : null}
          </Box>
          {right}
        </Box>
      ) : null}
      {children}
    </Box>
  );
}

export function Grid({ cols, gap = 3, children, sx }: { cols: string | Record<string, string>; gap?: number; children: ReactNode; sx?: object }) {
  return <Box sx={{ display: 'grid', gridTemplateColumns: typeof cols === 'string' ? { xs: '1fr', lg: cols } : cols, gap, alignItems: 'start', ...sx }}>{children}</Box>;
}

export function Stack({ gap = 3, children, sx }: { gap?: number; children: ReactNode; sx?: object }) {
  return <Box sx={{ display: 'flex', flexDirection: 'column', gap, minWidth: 0, ...sx }}>{children}</Box>;
}

export interface StatDef {
  label: string;
  value: string;
  icon: ReactNode;
  color?: 'green' | 'amber' | 'blue' | 'red' | 'purple' | 'sage';
  hint?: string;
}
const statGrad = { green: gradients.icon, amber: gradients.amber, blue: gradients.sky, red: gradients.coral, purple: 'linear-gradient(135deg,#8B6FD1 14.286%,#5B3FA8 85.714%)', sage: gradients.impact };

export function StatRow({ stats }: { stats: StatDef[] }) {
  const n = stats.length;
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', xl: `repeat(${Math.min(n, 4)}, 1fr)` }, gap: { xs: 1.5, md: 3.5 } }}>
      {stats.map((s) => (
        <Box key={s.label} sx={{ ...cardSx, p: { xs: '15px', md: '21px' }, borderRadius: { xs: '18px', md: '24px' }, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 52, height: 52, borderRadius: '17px', background: statGrad[s.color ?? 'green'], display: { xs: 'none', md: 'grid' }, placeItems: 'center', flexShrink: 0, '& svg': { color: '#fff', fontSize: 24 } }}>{s.icon}</Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 600, lineHeight: 1.15 }}>{s.value}</Typography>
            <Typography sx={{ fontSize: { xs: 12, md: 13 }, color: 'text.secondary' }}>{s.hint ?? s.label}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/* ───────────── list screen pieces ───────────── */

export function RelatedLinks({ links }: { links: { label: string; to: string }[] }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
      <Typography sx={{ fontSize: 11, color: brand.placeholder, fontWeight: 500, mr: 0.5 }}>RELATED</Typography>
      {links.map((l) => (
        <Btn key={l.label} to={l.to} small endIcon={<ArrowForward sx={{ fontSize: 13 }} />}>
          {l.label}
        </Btn>
      ))}
    </Box>
  );
}

export function PillTabs({ tabs, value, onChange }: { tabs: string[]; value: string; onChange: (t: string) => void }) {
  return (
    <Box role="tablist" sx={{ display: 'flex', gap: 1.25, flexWrap: { xs: 'nowrap', md: 'wrap' }, overflowX: { xs: 'auto', md: 'visible' }, maxWidth: '100%', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
      {tabs.map((t) => {
        const on = t === value;
        return (
          <Box
            key={t}
            role="tab"
            aria-selected={on}
            component="button"
            type="button"
            onClick={() => onChange(t)}
            sx={{ flexShrink: 0, border: on ? 0 : '1px solid rgba(11,46,31,0.08)', px: '18px', height: 40, borderRadius: 999, font: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', bgcolor: on ? undefined : '#fff', background: on ? 'linear-gradient(148deg,#145233 14.286%,#0E3B26 85.714%)' : undefined, color: on ? '#fff' : brand.ink, boxShadow: on ? shadows.card : 'none' }}
          >
            {t}
          </Box>
        );
      })}
    </Box>
  );
}

export function SearchField({ placeholder, value, onChange, width = 300 }: { placeholder: string; value?: string; onChange?: (v: string) => void; width?: number | string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, height: 44, px: 2, width: { xs: '100%', md: width }, borderRadius: '22px', bgcolor: '#fff', boxShadow: shadows.card }}>
      <SearchOutlined sx={{ fontSize: 17, color: brand.slate }} />
      <InputBase placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)} sx={{ flex: 1, fontSize: 14 }} inputProps={{ 'aria-label': placeholder }} />
    </Box>
  );
}

export function Toolbar({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
      <Box sx={{ minWidth: 0 }}>{left}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>{right}</Box>
    </Box>
  );
}

export interface Column<T> {
  label: string;
  /** Fixed width in px; columns without one share the free space. */
  w?: number;
  render: (row: T, i: number) => ReactNode;
  align?: 'left' | 'right' | 'center';
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  rows,
  selectable,
  rowActions,
  selected,
  onSelect,
  onRow,
  footer,
  minWidth,
}: {
  columns: Column<T>[];
  rows: T[];
  selectable?: boolean;
  rowActions?: boolean;
  selected?: Set<number>;
  onSelect?: (s: Set<number>) => void;
  onRow?: (row: T, i: number) => void;
  footer?: ReactNode;
  minWidth?: number;
}) {
  const mobile = useIsMobile();
  const cols = [selectable ? '44px' : null, ...columns.map((c) => (c.w ? `${c.w}px` : 'minmax(160px,1fr)')), rowActions ? '92px' : null].filter(Boolean).join(' ');
  const sel = selected ?? new Set<number>();
  const all = rows.length > 0 && sel.size === rows.length;
  const toggle = (i: number) => {
    const n = new Set(sel);
    n.has(i) ? n.delete(i) : n.add(i);
    onSelect?.(n);
  };
  if (mobile) {
    const [first, ...rest] = columns;
    const data = rest.filter((c) => c.label);
    const acts = rest.filter((c) => !c.label);
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 0 }}>
        {rows.map((r, i) => (
          <Box key={r.id ?? i} onClick={() => onRow?.(r, i)} sx={{ ...cardSx, borderRadius: '18px', p: '16px', display: 'flex', flexDirection: 'column', gap: 1.5, cursor: onRow ? 'pointer' : 'default' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {selectable ? <Checkbox size="small" checked={sel.has(i)} onClick={(e) => e.stopPropagation()} onChange={() => toggle(i)} sx={{ p: 0.25 }} inputProps={{ 'aria-label': `Select row ${i + 1}` }} /> : null}
              <Box sx={{ flex: 1, minWidth: 0 }}>{first.render(r, i)}</Box>
            </Box>
            {data.length ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 12px', pt: 1.5, borderTop: hair }}>
                {data.map((c) => (
                  <Box key={c.label} sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 10, color: brand.placeholder, letterSpacing: 0.3, textTransform: 'uppercase', mb: '2px' }}>{c.label}</Typography>
                    <Box sx={{ fontSize: 13 }}>{c.render(r, i)}</Box>
                  </Box>
                ))}
              </Box>
            ) : null}
            {acts.length || rowActions ? (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                {acts.map((c, k) => <Box key={k}>{c.render(r, i)}</Box>)}
                {rowActions ? <RoundBtn label="View"><VisibilityOutlined /></RoundBtn> : null}
              </Box>
            ) : null}
          </Box>
        ))}
        {footer ? <Box sx={{ ...cardSx, borderRadius: '18px' }}>{footer}</Box> : null}
      </Box>
    );
  }
  return (
    <Box sx={{ ...cardSx, overflow: 'hidden' }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: minWidth ?? 900 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: cols, columnGap: 2, alignItems: 'center', px: 3, py: '18px', bgcolor: '#F8FAF7', borderBottom: hair }}>
            {selectable ? <Checkbox size="small" checked={all} indeterminate={sel.size > 0 && !all} onChange={() => onSelect?.(all ? new Set() : new Set(rows.map((_, i) => i)))} sx={{ p: 0.25 }} inputProps={{ 'aria-label': 'Select all' }} /> : null}
            {columns.map((c) => (
              <Typography key={c.label} sx={{ fontSize: 11, fontWeight: 500, color: brand.placeholder, letterSpacing: 0.3, textTransform: 'uppercase', textAlign: c.align }}>
                {c.label}
              </Typography>
            ))}
            {rowActions ? <span /> : null}
          </Box>
          {rows.map((r, i) => (
            <Box
              key={r.id ?? i}
              onClick={() => onRow?.(r, i)}
              sx={{ display: 'grid', gridTemplateColumns: cols, columnGap: 2, alignItems: 'center', px: 3, py: '13px', minHeight: 72, borderTop: i ? hair : 0, bgcolor: sel.has(i) ? '#EEF5EF' : 'transparent', cursor: onRow ? 'pointer' : 'default', '&:hover': { bgcolor: sel.has(i) ? '#EEF5EF' : '#FAFBF9' } }}
            >
              {selectable ? <Checkbox size="small" checked={sel.has(i)} onClick={(e) => e.stopPropagation()} onChange={() => toggle(i)} sx={{ p: 0.25 }} inputProps={{ 'aria-label': `Select row ${i + 1}` }} /> : null}
              {columns.map((c) => (
                <Box key={c.label} sx={{ fontSize: 14, minWidth: 0, textAlign: c.align }}>
                  {c.render(r, i)}
                </Box>
              ))}
              {rowActions ? (
                <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                  <RoundBtn label="View">
                    <VisibilityOutlined />
                  </RoundBtn>
                  <RoundBtn label="More actions">
                    <MoreHoriz />
                  </RoundBtn>
                </Box>
              ) : null}
            </Box>
          ))}
        </Box>
      </Box>
      {footer}
    </Box>
  );
}

export function Pager({ text, pages = ['1', '2', '3', '…', '2,304'] }: { text: string; pages?: string[] }) {
  const [cur, setCur] = useState(pages[0]);
  const b = (on: boolean) => ({ width: 38, height: 38, borderRadius: '12px', border: on ? 0 : hair, background: on ? gradients.primary : '#fff', color: on ? '#fff' : brand.ink, font: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'grid', placeItems: 'center' }) as const;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', px: 3, py: 2.25, borderTop: hair }}>
      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{text}</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box component="button" type="button" aria-label="Previous page" sx={b(false)}>
          <ChevronLeft sx={{ fontSize: 18 }} />
        </Box>
        {pages.map((p, i) => (
          <Box key={i} component="button" type="button" onClick={() => p !== '…' && setCur(p)} sx={{ ...b(p === cur), minWidth: 38, width: 'auto', px: 1 }}>
            {p}
          </Box>
        ))}
        <Box component="button" type="button" aria-label="Next page" sx={b(false)}>
          <ChevronRight sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Box>
  );
}

/** Floating dark bar shown when rows are selected. */
export function SelectionBar({ count, children }: { count: number; children: ReactNode }) {
  if (!count) return null;
  return (
    <Box sx={{ position: 'sticky', bottom: 24, zIndex: 5, display: 'flex', justifyContent: 'center', mt: 2, pointerEvents: 'none' }}>
      <Box sx={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 1.5, p: '10px 12px 10px 14px', borderRadius: '20px', bgcolor: '#0B2E1F', boxShadow: shadows.card, color: '#fff' }}>
        <Box sx={{ width: 26, height: 26, borderRadius: '13px', bgcolor: brand.lime, color: '#0B2E1F', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600 }}>{count}</Box>
        <Typography sx={{ fontSize: 14, color: '#fff', pr: 1, borderRight: '1px solid rgba(255,255,255,0.15)', mr: 0.5, py: 0.5 }}>selected</Typography>
        {children}
      </Box>
    </Box>
  );
}

export function BarBtn({ children, icon, light, onClick }: { children: ReactNode; icon?: ReactNode; light?: boolean; onClick?: () => void }) {
  return (
    <Button onClick={onClick} startIcon={icon} sx={{ height: 40, px: 2, borderRadius: '12px', fontSize: 14, fontWeight: 500, color: light ? '#0E3B26' : '#fff', bgcolor: light ? '#fff' : 'rgba(255,255,255,0.1)', border: light ? 0 : '1px solid rgba(255,255,255,0.12)', '&:hover': { bgcolor: light ? '#F2F6F2' : 'rgba(255,255,255,0.18)' } }}>
      {children}
    </Button>
  );
}

/* ───────────── forms ───────────── */

/** Small coloured chip placed next to a field label (shows where the value is used). */
export function Chip({ children, tone = 'purple' }: { children: ReactNode; tone?: Tone }) {
  const c = statusColors[tone];
  return <Box component="span" sx={{ display: 'inline-block', ml: 1, px: '8px', py: '1px', borderRadius: '8px', bgcolor: c.bg, color: c.fg, fontSize: 10, fontWeight: 500, verticalAlign: 'middle' }}>{children}</Box>;
}

export function Field({ label, hint, error, children, req, chip, chipTone }: { label: string; hint?: string; error?: string; children: ReactNode; req?: boolean; chip?: string; chipTone?: Tone }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
      <Typography component="label" sx={{ fontSize: 13, fontWeight: 500 }}>
        {label}
        {req ? <Box component="span" sx={{ color: brand.coral }}> *</Box> : null}
        {chip ? <Chip tone={chipTone}>{chip}</Chip> : null}
      </Typography>
      {children}
      {error ? (
        <Typography sx={{ fontSize: 12, color: '#C94A3C', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <WarningAmber sx={{ fontSize: 14 }} /> {error}
        </Typography>
      ) : hint ? (
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{hint}</Typography>
      ) : null}
    </Box>
  );
}

const inputBox = (error?: boolean) => ({ display: 'flex', alignItems: 'center', gap: 1.25, height: 52, px: 2, borderRadius: '14px', bgcolor: brand.field, border: error ? '2px solid #E86A5B' : '1px solid rgba(11,46,31,0.08)', '&:focus-within': { border: error ? '2px solid #E86A5B' : '2px solid #1F6B45', px: '15px' } }) as const;

export function Input({ placeholder, value, onChange, error, icon, suffix, type, readOnly }: { placeholder?: string; value?: string; onChange?: (v: string) => void; error?: boolean; icon?: ReactNode; suffix?: ReactNode; type?: string; readOnly?: boolean }) {
  const [v, setV] = useState(value ?? '');
  return (
    <Box sx={{ ...inputBox(error), ...(readOnly ? { bgcolor: '#EEF1EC' } : {}), ...(error ? { bgcolor: '#FDF1EF' } : {}) }}>
      {icon ? <Box sx={{ display: 'grid', color: brand.slate, '& svg': { fontSize: 18 } }}>{icon}</Box> : null}
      <InputBase type={type} fullWidth readOnly={readOnly} placeholder={placeholder} value={value ?? v} onChange={(e) => (onChange ? onChange(e.target.value) : setV(e.target.value))} sx={{ fontSize: 14 }} />
      {suffix ? <Typography sx={{ fontSize: 13, color: 'text.secondary', whiteSpace: 'nowrap' }}>{suffix}</Typography> : null}
    </Box>
  );
}

export function Select({ value, options, onChange, error }: { value?: string; options?: string[]; onChange?: (v: string) => void; error?: boolean }) {
  const [v, setV] = useState(value ?? options?.[0] ?? '');
  return (
    <Box sx={{ ...inputBox(error), ...(error ? { bgcolor: '#FDF1EF' } : {}), position: 'relative', justifyContent: 'space-between' }}>
      <Typography sx={{ fontSize: 14, color: v ? brand.ink : brand.placeholder }}>{v || 'Select…'}</Typography>
      <KeyboardArrowDown sx={{ fontSize: 20, color: brand.slate }} />
      <Box component="select" value={v} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => (setV(e.target.value), onChange?.(e.target.value))} aria-label="Select" sx={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}>
        {(options ?? [v]).map((o) => (
          <option key={o}>{o}</option>
        ))}
      </Box>
    </Box>
  );
}

export function TextArea({ placeholder, value, rows = 4 }: { placeholder?: string; value?: string; rows?: number }) {
  return (
    <Box component="textarea" defaultValue={value} placeholder={placeholder} rows={rows} sx={{ width: '100%', resize: 'vertical', p: 2, borderRadius: '14px', bgcolor: brand.field, border: '1px solid rgba(11,46,31,0.08)', font: 'inherit', fontSize: 14, outline: 0, '&:focus': { border: '2px solid #1F6B45', p: '15px' }, '&::placeholder': { color: brand.placeholder } }} />
  );
}

export function Toggle({ on: init = false, onChange }: { on?: boolean; onChange?: (v: boolean) => void }) {
  const [on, setOn] = useState(init);
  return (
    <Box component="button" type="button" role="switch" aria-checked={on} onClick={() => (setOn(!on), onChange?.(!on))} sx={{ width: 46, height: 26, p: '3px', border: 0, borderRadius: '13px', display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start', alignItems: 'center', cursor: 'pointer', background: on ? gradients.primary : '#CBD2CC', flexShrink: 0 }}>
      <Box sx={{ width: 20, height: 20, borderRadius: '10px', bgcolor: '#fff' }} />
    </Box>
  );
}

export function SwitchRow({ title, sub, on }: { title: string; sub?: string; on?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 1.5 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{title}</Typography>
        {sub ? <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{sub}</Typography> : null}
      </Box>
      <Toggle on={on} />
    </Box>
  );
}

export function Check({ label, on: init = false }: { label: string; on?: boolean }) {
  const [on, setOn] = useState(init);
  return (
    <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, fontSize: 14, cursor: 'pointer' }}>
      <Checkbox size="small" checked={on} onChange={() => setOn(!on)} sx={{ p: 0.25 }} />
      {label}
    </Box>
  );
}

export function Segmented({ options, value, onChange }: { options: string[]; value?: string; onChange?: (v: string) => void }) {
  const [v, setV] = useState(value ?? options[0]);
  return (
    <Box role="tablist" sx={{ display: 'inline-flex', gap: '2px', p: '4px', borderRadius: '12px', bgcolor: brand.chip }}>
      {options.map((o) => (
        <Box key={o} role="tab" aria-selected={o === v} component="button" type="button" onClick={() => (setV(o), onChange?.(o))} sx={{ border: 0, px: '14px', py: '7px', borderRadius: '9px', font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', bgcolor: o === v ? '#fff' : 'transparent', color: o === v ? '#0E3B26' : brand.slate, boxShadow: o === v ? shadows.card : 'none' }}>
          {o}
        </Box>
      ))}
    </Box>
  );
}

/* ───────────── misc ───────────── */

export function Banner({ tone = 'green', icon, title, children, action }: { tone?: Tone; icon?: ReactNode; title?: string; children?: ReactNode; action?: ReactNode }) {
  const c = statusColors[tone];
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '14px 18px', borderRadius: '16px', bgcolor: c.bg, color: c.fg }}>
      {icon ? <Box sx={{ display: 'grid', '& svg': { fontSize: 20 } }}>{icon}</Box> : null}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {title ? <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'inherit' }}>{title}</Typography> : null}
        {children ? <Typography sx={{ fontSize: 13, color: 'inherit' }}>{children}</Typography> : null}
      </Box>
      {action}
    </Box>
  );
}

export function KV({ rows, cols = 1 }: { rows: [ReactNode, ReactNode][]; cols?: number }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: `repeat(${cols}, 1fr)` }, columnGap: 4 }}>
      {rows.map(([k, v], i) => (
        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.5, borderTop: i >= cols ? hair : 0, alignItems: 'center' }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{k}</Typography>
          <Typography component="div" sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>{v}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export function Progress({ value, color = forest[700], height = 8 }: { value: number; color?: string; height?: number }) {
  return (
    <Box sx={{ height, borderRadius: height, bgcolor: '#EAEFEA', overflow: 'hidden' }}>
      <Box sx={{ width: `${Math.min(100, value)}%`, height: '100%', borderRadius: height, bgcolor: color }} />
    </Box>
  );
}

export function Timeline({ items }: { items: { title: string; sub?: string; time?: string; tone?: Tone; done?: boolean }[] }) {
  return (
    <Box>
      {items.map((it, i) => {
        const c = it.tone ? statusColors[it.tone].fg : it.done === false ? '#CBD2CC' : forest[600];
        return (
          <Box key={i} sx={{ display: 'flex', gap: 1.75 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '6px', bgcolor: c, mt: '5px', flexShrink: 0 }} />
              {i < items.length - 1 ? <Box sx={{ flex: 1, width: 2, bgcolor: '#E3EAE3', my: 0.5 }} /> : null}
            </Box>
            <Box sx={{ pb: 2.25, flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{it.title}</Typography>
                {it.time ? <Typography sx={{ fontSize: 12, color: brand.placeholder, whiteSpace: 'nowrap' }}>{it.time}</Typography> : null}
              </Box>
              {it.sub ? <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{it.sub}</Typography> : null}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export function Modal({ open, onClose, title, subtitle, icon, tone = 'green', width = 560, children, footer }: { open: boolean; onClose: () => void; title: string; subtitle?: string; icon?: ReactNode; tone?: 'green' | 'red' | 'amber'; width?: number; children?: ReactNode; footer?: ReactNode }) {
  const g = tone === 'red' ? gradients.coral : tone === 'amber' ? gradients.amber : gradients.primary;
  const sheet = useIsMobile();
  const paper: Record<string, unknown> = sheet
    ? { position: 'fixed', left: 0, right: 0, bottom: 0, m: 0, width: '100%', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '28px 28px 0 0', p: '20px', boxShadow: '0 -20px 60px rgba(11,46,31,0.25)', display: 'flex', flexDirection: 'column', gap: 2 }
    : { width, maxWidth: 'calc(100% - 32px)', borderRadius: '28px', p: '32px', boxShadow: '0 30px 80px rgba(11,46,31,0.25)', display: 'flex', flexDirection: 'column', gap: 2.5 };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={false} slotProps={{ backdrop: { sx: { bgcolor: 'rgba(11,26,18,0.45)', backdropFilter: 'blur(2px)' } }, paper: { sx: paper } }}>
      {sheet ? <Box sx={{ width: 44, height: 5, borderRadius: 3, bgcolor: '#D5DBD6', mx: 'auto', mb: -0.5, flexShrink: 0 }} /> : null}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        {icon ? <Box sx={{ width: 48, height: 48, borderRadius: '16px', background: g, display: 'grid', placeItems: 'center', flexShrink: 0, '& svg': { color: '#fff', fontSize: 24 } }}>{icon}</Box> : null}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 600, lineHeight: 1.25 }}>{title}</Typography>
          {subtitle ? <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>{subtitle}</Typography> : null}
        </Box>
        <IconButton onClick={onClose} aria-label="Close" sx={{ border: hair, width: 36, height: 36 }}>
          <Close sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
      {children}
      {footer ? <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, flexWrap: 'wrap', ...(sheet ? { flexDirection: 'column-reverse', '& > *': { width: '100%', height: 48 } } : {}) }}>{footer}</Box> : null}
    </Dialog>
  );
}

/** Pill-shaped filter chip: "Label: Value ⌄". */
export function FilterChip({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, height: 44, px: 2, borderRadius: '22px', bgcolor: '#fff', boxShadow: shadows.card, fontSize: 13, whiteSpace: 'nowrap', cursor: 'pointer' }}>
      <Box component="span" sx={{ color: 'text.secondary' }}>{label}:</Box>
      <b>{value}</b>
      <KeyboardArrowDown sx={{ fontSize: 18 }} />
    </Box>
  );
}

/** Right-hand slide-over panel (e.g. Adjust stock). */
export function SidePanel({ open, onClose, title, subtitle, children, footer, width = 468 }: { open: boolean; onClose: () => void; title: string; subtitle?: string; children: ReactNode; footer?: ReactNode; width?: number }) {
  const sheet = useIsMobile();
  return (
    <Dialog open={open} onClose={onClose} fullScreen slotProps={{ backdrop: { sx: { bgcolor: 'rgba(11,26,18,0.45)' } }, paper: { sx: { bgcolor: 'transparent', boxShadow: 'none', alignItems: sheet ? 'stretch' : 'flex-end', justifyContent: sheet ? 'flex-end' : 'flex-start' } } }} transitionDuration={150}>
      <Box sx={{ width: sheet ? '100%' : width, maxWidth: '100%', height: sheet ? 'auto' : '100%', maxHeight: sheet ? '90vh' : undefined, borderRadius: sheet ? '28px 28px 0 0' : 0, bgcolor: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(11,46,31,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: '22px 20px 8px 24px' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 600, lineHeight: 1.3 }}>{title}</Typography>
            {subtitle ? <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{subtitle}</Typography> : null}
          </Box>
          <IconButton onClick={onClose} aria-label="Close" sx={{ border: hair, width: 36, height: 36 }}>
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', p: '8px 24px 24px', display: 'flex', flexDirection: 'column', gap: 2.25 }}>{children}</Box>
        {footer ? <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, p: '16px 24px 24px' }}>{footer}</Box> : null}
      </Box>
    </Dialog>
  );
}

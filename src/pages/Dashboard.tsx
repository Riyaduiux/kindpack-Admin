import { useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Close from '@mui/icons-material/Close';
import Check from '@mui/icons-material/Check';
import TopBar from '../layout/TopBar';
import { DashboardSkeleton, ErrorState } from '../components/StateViews';
import { AreaChart, Donut, Sparkline } from '../components/charts';
import { useAuth } from '../auth/AuthContext';
import { brand, forest, gradients, shadows, statusColors } from '../theme';

// Illustrative numbers from the design. Replace with API data as the endpoints become available.
const REVENUE = {
  Week: { values: [12.1, 13.4, 12.8, 15.2, 14.6, 16.9, 18.4], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], total: 'AUD 28.6k', delta: '↑ 6.1% vs last week', tip: 'Today' },
  Month: { values: [88, 94, 91, 99, 104, 101, 110, 116, 112, 121, 125, 128.4], labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'], total: 'AUD 128.4k', delta: '↑ 12% vs last month', tip: 'This month' },
  Year: { values: [62, 70, 76, 72, 80, 84, 82, 92, 98, 106, 114, 128.4], labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], total: 'AUD 1.24M', delta: '↑ 18.4% vs last year', tip: 'Oct 2026' },
} as const;
type Range = keyof typeof REVENUE;

const ROLE_SLICES = [
  { label: 'Families', value: 46, color: forest[700] },
  { label: 'Schools', value: 22, color: brand.sage },
  { label: 'Businesses', value: 18, color: brand.amber },
  { label: 'Heroes', value: 14, color: brand.mint },
];

type Tone = 'green' | 'amber' | 'blue' | 'red' | 'purple';
const avatarTones: Record<Tone, { bg: string; fg: string }> = {
  green: { bg: '#DCEFE0', fg: '#145233' },
  amber: { bg: '#FBE9C4', fg: '#8A5A00' },
  blue: { bg: '#DCEAF8', fg: '#1D4F91' },
  red: { bg: '#F4DAD5', fg: '#B3261E' },
  purple: { bg: '#E7E0F6', fg: '#5B3FA8' },
};

const ORDERS: { id: string; initials: string; tone: Tone; name: string; sub: string; amount: string; status: string; statusTone: keyof typeof statusColors }[] = [
  { id: '#KP-10482', initials: 'SS', tone: 'green', name: 'Smith Family', sub: 'Greenfield Primary · Subscription', amount: 'AUD 29.00', status: 'Delivered', statusTone: 'green' },
  { id: '#KP-10481', initials: 'BC', tone: 'amber', name: 'Brew & Co. Cafe', sub: 'Business · Bulk order', amount: 'AUD 99.00', status: 'On the way', statusTone: 'blue' },
  { id: '#KP-10480', initials: 'SM', tone: 'blue', name: 'St. Mary’s Primary', sub: 'School · Place order', amount: 'AUD 214.50', status: 'Packing', statusTone: 'amber' },
  { id: '#KP-10479', initials: 'GW', tone: 'red', name: 'Grace Walker', sub: 'Family member · Refill', amount: 'AUD 100.00', status: 'Refund req.', statusTone: 'red' },
];

const APPROVALS: { id: string; initials: string; tone: Tone; name: string; sub: string }[] = [
  { id: 'a1', initials: 'JK', tone: 'amber', name: 'James K.', sub: 'Hero application · Zone 4' },
  { id: 'a2', initials: 'PP', tone: 'blue', name: 'Parkside Primary', sub: 'School verification' },
  { id: 'a3', initials: 'LM', tone: 'red', name: 'Library Books Fund', sub: 'Campaign · AUD 1,000' },
  { id: 'a4', initials: 'BC', tone: 'purple', name: 'Brew & Co. Cafe', sub: 'Business account' },
];

const card = { bgcolor: '#fff', border: '1px solid rgba(11,46,31,0.04)', borderRadius: '24px', boxShadow: shadows.card, p: 3, minWidth: 0 } as const;

function Pill({ tone = 'green', children, dot }: { tone?: keyof typeof statusColors; children: ReactNode; dot?: boolean }) {
  const c = statusColors[tone];
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: '10px', py: '4px', borderRadius: 999, bgcolor: c.bg, color: c.fg, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {dot ? <Box sx={{ width: 6, height: 6, borderRadius: '3px', bgcolor: c.fg }} /> : null}
      {children}
    </Box>
  );
}

function Avatar({ initials, tone, size = 40 }: { initials: string; tone: Tone; size?: number }) {
  const t = avatarTones[tone];
  return (
    <Box sx={{ width: size, height: size, borderRadius: `${size / 2}px`, bgcolor: t.bg, color: t.fg, display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: size > 40 ? 16 : 14, flexShrink: 0 }}>
      {initials}
    </Box>
  );
}

function CardHeader({ title, subtitle, right }: { title: string; subtitle: string; right?: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.4 }}>{title}</Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{subtitle}</Typography>
      </Box>
      {right}
    </Box>
  );
}

function Kpi({ icon, iconBg, label, value, pill, pillTone = 'green', spark, sparkColor }: { icon: ReactNode; iconBg: string; label: string; value: string; pill: string; pillTone?: keyof typeof statusColors; spark: number[]; sparkColor: string }) {
  return (
    <Box sx={{ ...card, p: '22px', display: 'flex', flexDirection: 'column', gap: 1.75 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ width: 46, height: 46, borderRadius: '15px', background: iconBg, display: 'grid', placeItems: 'center', '& svg': { color: '#fff', fontSize: 22 } }}>{icon}</Box>
        <Pill tone={pillTone}>{pill}</Pill>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 32, fontWeight: 600, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{value}</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{label}</Typography>
        </Box>
        <Sparkline values={spark} color={sparkColor} />
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // ?state=loading | error previews the loading / failed-to-load screens.
  const [params] = useSearchParams();
  const view = params.get('state');
  const [range, setRange] = useState<Range>('Year');
  const [approvals, setApprovals] = useState(APPROVALS);
  const rev = REVENUE[range];
  const first = user?.name?.split(' ')[0] ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const resolve = (id: string) => setApprovals((rows) => rows.filter((r) => r.id !== id));

  if (view === 'loading') {
    return (
      <>
        <TopBar title={`${greeting}, ${first} 👋`} helper="Loading your overview…" />
        <DashboardSkeleton />
      </>
    );
  }
  if (view === 'error') {
    return (
      <>
        <TopBar title="Dashboard" helper="Here is what is happening across Kind Pack today." />
        <ErrorState onRetry={() => navigate('/')} />
      </>
    );
  }

  return (
    <>
      <TopBar title={`${greeting}, ${first} 👋`} helper="Here is what is happening across Kind Pack today." />

      {/* Hero banner */}
      <Box sx={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', px: { xs: 3, md: '36px' }, py: '30px', mb: 3, borderRadius: '30px', boxShadow: shadows.card, background: gradients.hero }}>
        <Box component="img" src="/assets/hero-decor-a.svg" alt="" aria-hidden sx={{ position: 'absolute', right: 120, top: -140, width: 380, height: 380 }} />
        <Box component="img" src="/assets/hero-decor-b.svg" alt="" aria-hidden sx={{ position: 'absolute', right: 520, top: 40, width: 260, height: 260 }} />
        <Box component="img" src="/assets/hero-decor-c.svg" alt="" aria-hidden sx={{ position: 'absolute', right: -20, top: 60, width: 200, height: 200 }} />
        <Box sx={{ position: 'relative', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: '5px', borderRadius: 999, bgcolor: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 12, fontWeight: 500 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: brand.lime }} />
            Live overview · {dayjs().format('D MMM YYYY')}
          </Box>
          <Typography sx={{ color: '#fff', fontSize: { xs: 26, md: 32 }, fontWeight: 600, lineHeight: 1.18 }}>Revenue is up 12% this month</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>AUD 128.4k earned · 342 orders today · {approvals.length} items waiting for your approval</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 0.5 }}>
            <Button onClick={() => navigate('/referrals')} endIcon={<ArrowForward sx={{ fontSize: 16 }} />} sx={{ bgcolor: '#fff', color: '#0E3B26', '&:hover': { bgcolor: '#fff', filter: 'brightness(0.96)' } }}>
              Review approvals
            </Button>
            <Button onClick={() => navigate('/reports')} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' } }}>
              Download report
            </Button>
          </Box>
        </Box>
        <Box sx={{ position: 'relative', display: 'flex', gap: 1.75, flexWrap: 'wrap' }}>
          {[
            { l: 'Active families', v: '9,870', d: '+4.2%' },
            { l: 'Heroes online', v: '58', d: 'All active' },
            { l: 'Schools', v: '312', d: '+6 this week' },
          ].map((s) => (
            <Box key={s.l} sx={{ width: 176, p: '18px', borderRadius: '22px', bgcolor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{s.l}</Typography>
              <Typography sx={{ color: '#fff', fontSize: 28, fontWeight: 600, lineHeight: 1.18, mt: 0.5 }}>{s.v}</Typography>
              <Typography sx={{ color: brand.lime, fontSize: 12, fontWeight: 500, mt: 0.5 }}>{s.d}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* KPI row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 3.5, mb: 3 }}>
        <Kpi icon={<PeopleAltOutlined />} iconBg={gradients.icon} label="Total users" value="18,432" pill="↑ 8.2%" spark={[4, 5, 4.6, 6, 5.6, 7, 6.6, 8, 9]} sparkColor={forest[700]} />
        <Kpi icon={<ShoppingBagOutlined />} iconBg={gradients.amber} label="Orders today" value="342" pill="↑ 12%" spark={[5, 4.4, 6, 5.2, 7, 6.2, 8, 7.4, 9]} sparkColor={brand.amber} />
        <Kpi icon={<AccountBalanceWalletOutlined />} iconBg={gradients.sky} label="Revenue (MTD)" value="AUD 128.4k" pill="↑ 5.6%" spark={[3, 4, 3.6, 5, 5.4, 6, 6.6, 7.4, 8.4]} sparkColor="#3F7FBF" />
        <Kpi icon={<TaskAltOutlined />} iconBg={gradients.coral} label="Pending approvals" value={String(approvals.length)} pill="4 overdue" spark={[9, 8, 8.6, 7, 7.6, 6, 6.4, 5, 4.4]} sparkColor={brand.coral} />
      </Box>

      {/* Charts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.79fr 1fr' }, gap: 3, mb: 3 }}>
        <Box sx={{ ...card, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CardHeader
            title="Revenue overview"
            subtitle={`Last 12 ${range === 'Year' ? 'months' : range === 'Month' ? 'weeks' : 'days'} · all roles`.replace('Last 12 days', 'This week')}
            right={
              <Box role="tablist" sx={{ display: 'flex', gap: '2px', p: '4px', borderRadius: '12px', bgcolor: brand.chip }}>
                {(Object.keys(REVENUE) as Range[]).map((r) => (
                  <Box
                    key={r}
                    role="tab"
                    aria-selected={r === range}
                    component="button"
                    type="button"
                    onClick={() => setRange(r)}
                    sx={{ border: 0, px: '14px', py: '7px', borderRadius: '9px', font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', bgcolor: r === range ? '#fff' : 'transparent', color: r === range ? '#0E3B26' : brand.slate, boxShadow: r === range ? shadows.card : 'none' }}
                  >
                    {r}
                  </Box>
                ))}
              </Box>
            }
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 34, fontWeight: 600, lineHeight: 1.15 }}>{rev.total}</Typography>
            <Pill>{rev.delta}</Pill>
          </Box>
          <AreaChart values={[...rev.values]} labels={[...rev.labels]} color={forest[700]} tooltip={{ title: rev.tip, value: `AUD ${rev.values[rev.values.length - 1]}k` }} />
        </Box>

        <Box sx={{ ...card, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
          <CardHeader
            title="Orders by role"
            subtitle="This month"
            right={
              <Box sx={{ px: '10px', py: '4px', borderRadius: 999, bgcolor: brand.primarySoft, color: forest[700], fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>12,480 total</Box>
            }
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Donut slices={ROLE_SLICES}>
              <Typography sx={{ fontSize: 26, fontWeight: 600, lineHeight: 1.15 }}>12,480</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>orders</Typography>
            </Donut>
            <Box sx={{ flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
              {ROLE_SLICES.map((s) => (
                <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '5px', bgcolor: s.color }} />
                  <Typography sx={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s.value}%</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Lists */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.79fr 1fr' }, gap: 3 }}>
        <Box sx={{ ...card, display: 'flex', flexDirection: 'column', gap: 0.75, overflowX: 'auto' }}>
          <CardHeader
            title="Recent orders"
            subtitle="Latest activity across all roles"
            right={
              <Button variant="outlined" onClick={() => navigate('/orders')} sx={{ minHeight: 38, height: 38 }}>
                View all
              </Button>
            }
          />
          <Box sx={{ minWidth: 640 }}>
            <Box sx={{ display: 'flex', gap: 1.5, py: 1, color: brand.placeholder, fontSize: 11, fontWeight: 500, borderBottom: '1px solid rgba(11,46,31,0.07)' }}>
              <Box sx={{ width: 170 }}>ORDER</Box>
              <Box sx={{ flex: 1 }}>CUSTOMER</Box>
              <Box sx={{ width: 110 }}>AMOUNT</Box>
              <Box sx={{ width: 140 }}>STATUS</Box>
            </Box>
            {ORDERS.map((o, i) => (
              <Box key={o.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5, borderTop: i ? '1px solid rgba(11,46,31,0.07)' : 0 }}>
                <Box sx={{ width: 170, fontSize: 13, fontWeight: 500, color: 'text.secondary' }}>{o.id}</Box>
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar initials={o.initials} tone={o.tone} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography noWrap sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{o.name}</Typography>
                    <Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>{o.sub}</Typography>
                  </Box>
                </Box>
                <Box sx={{ width: 110, fontSize: 14, fontWeight: 600 }}>{o.amount}</Box>
                <Box sx={{ width: 140 }}>
                  <Pill tone={o.statusTone} dot>{o.status}</Pill>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ ...card, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <CardHeader title="Needs your approval" subtitle="Oldest first" right={<Pill tone="red">{approvals.length} pending</Pill>} />
          <Box sx={{ borderTop: '1px solid rgba(11,46,31,0.07)', mt: 1 }}>
            {approvals.length === 0 ? (
              <Typography sx={{ py: 4, textAlign: 'center', color: 'text.secondary', fontSize: 14 }}>All caught up — nothing needs approval.</Typography>
            ) : (
              approvals.map((a, i) => (
                <Box key={a.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, borderTop: i ? '1px solid rgba(11,46,31,0.07)' : 0 }}>
                  <Avatar initials={a.initials} tone={a.tone} size={44} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{a.name}</Typography>
                    <Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>{a.sub}</Typography>
                  </Box>
                  <Box component="button" type="button" aria-label={`Reject ${a.name}`} onClick={() => resolve(a.id)} sx={{ width: 38, height: 38, borderRadius: '19px', border: '1px solid rgba(11,46,31,0.07)', bgcolor: '#fff', color: brand.coral, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                    <Close sx={{ fontSize: 17 }} />
                  </Box>
                  <Box component="button" type="button" aria-label={`Approve ${a.name}`} onClick={() => resolve(a.id)} sx={{ width: 38, height: 38, borderRadius: '19px', border: 0, background: gradients.primary, boxShadow: shadows.card, color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                    <Check sx={{ fontSize: 17 }} />
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

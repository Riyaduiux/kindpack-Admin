import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import NavigationOutlined from '@mui/icons-material/NavigationOutlined';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import ArrowForward from '@mui/icons-material/ArrowForward';
import TopBar from '../../layout/TopBar';
import { Avatar, Btn, Card, cardSx, DataTable, Field, Grid, hair, Modal, Person, Pill, RoundBtn, SearchField, Stack, StatRow, type AvatarTone, type Tone } from '../../components/kit';
import { RelatedLinks } from '../../components/kit';
import { brand, forest } from '../../theme';

const ORDERS: { id: string; addr: string; tag: string; t: Tone; urgent?: boolean }[] = [
  { id: 'KP-10486', addr: '12 Oak Lane · Zone 4', tag: 'Today', t: 'amber' },
  { id: 'KP-10485', addr: '8 River Rd · Zone 2', tag: 'Urgent', t: 'red', urgent: true },
  { id: 'KP-10484', addr: '3 Harbour St · Zone 1', tag: 'Today', t: 'amber' },
  { id: 'KP-10483', addr: '44 Hill View · Zone 5', tag: 'Tomorrow', t: 'grey' },
  { id: 'KP-10482', addr: '21 Park Ave · Zone 3', tag: 'Today', t: 'amber' },
];
const HEROES: { id: number; i: string; t: AvatarTone; n: string; sub: string; zone: string; veh: string; stops: number; rate: string; st: string; s: Tone }[] = [
  { id: 1, i: 'JK', t: 'green', n: 'James K.', sub: 'Shift ends 6:00 PM', zone: 'Zone 4 · Greenfield', veh: 'E-cargo bike', stops: 4, rate: '★ 4.9', st: 'On route', s: 'green' },
  { id: 2, i: 'OD', t: 'amber', n: 'Omar D.', sub: 'Shift ends 5:00 PM', zone: 'Zone 2 · Riverside', veh: 'Scooter', stops: 2, rate: '★ 4.8', st: 'On route', s: 'green' },
  { id: 3, i: 'MA', t: 'blue', n: 'Maya A.', sub: 'Starts 2:00 PM', zone: 'Zone 1 · Harbour', veh: 'Cargo van', stops: 0, rate: '★ 4.7', st: 'Off shift', s: 'grey' },
];
const CANDIDATES = [
  { i: 'OD', t: 'amber' as const, n: 'Omar D.', sub: '0.8 km away · 2 stops left · ★ 4.8', best: true },
  { i: 'JK', t: 'green' as const, n: 'James K.', sub: '2.1 km away · 4 stops left · ★ 4.9' },
  { i: 'LC', t: 'blue' as const, n: 'Lena C.', sub: '3.4 km away · 1 stop left · ★ 4.7' },
  { i: 'GW', t: 'red' as const, n: 'Greenfield Warehouse · Big Hero', sub: '6.2 km away · full stock · dispatch in 2 h' },
];

const pins: [string, string, number, number][] = [['JK', 'left', 13, 25], ['OD', 'left', 47, 13], ['LC', 'left', 70, 29], ['MA', 'left', 90, 40], ['KN', 'left', 28, 72]];

export default function Dispatch() {
  const [params] = useSearchParams();
  const [assign, setAssign] = useState(params.get('modal') === 'assign');
  const [pick, setPick] = useState(0);
  const [mapTab, setMapTab] = useState('Heroes');
  const [q, setQ] = useState('');

  return (
    <Stack gap={3}>
      <TopBar title="Dispatch" helper="Live view of heroes, routes and unassigned orders." />
      <RelatedLinks links={[{ label: 'Hero & Big Hero selection', to: '/fulfilment/choose' }, { label: 'Big Heroes', to: '/big-heroes' }, { label: 'Delivery & exceptions', to: '/fulfilment/deliveries' }]} />
      <StatRow
        stats={[
          { label: 'Heroes on route', value: '58', icon: <LocalShippingOutlined />, color: 'green' },
          { label: 'Unassigned orders', value: '17', icon: <Inventory2Outlined />, color: 'amber' },
          { label: 'On-time today', value: '96%', icon: <CheckCircleOutline />, color: 'blue' },
          { label: 'Active zones', value: '12', icon: <PlaceOutlined />, color: 'red' },
        ]}
      />
      <Grid cols={{ xs: '1fr', lg: '1.6fr 1fr' }} gap={3.5}>
        <Box sx={{ ...cardSx, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: '16px 24px 12px', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Live map</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Greenfield region</Typography>
            </Box>
            <Box sx={{ display: 'flex', p: '4px', borderRadius: 999, bgcolor: '#F3F6F2' }}>
              {['Heroes', 'Orders', 'Zones'].map((t) => (
                <Box key={t} component="button" type="button" onClick={() => setMapTab(t)} sx={{ border: 0, px: '14px', height: 28, borderRadius: 999, font: 'inherit', fontSize: 11, fontWeight: 500, cursor: 'pointer', bgcolor: mapTab === t ? '#fff' : 'transparent', color: mapTab === t ? brand.ink : brand.slate, boxShadow: mapTab === t ? '0 1px 4px rgba(11,46,31,0.12)' : 'none' }}>{t}</Box>
              ))}
            </Box>
          </Box>
          {/* stylised map */}
          <Box sx={{ position: 'relative', height: 440, bgcolor: '#EDF3EC', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', left: 0, right: 0, top: '58%', height: 60, bgcolor: '#D6E6F5', transform: 'skewY(-3deg)' }} />
            {[22, 52].map((y) => <Box key={y} sx={{ position: 'absolute', left: 0, right: 0, top: `${y}%`, height: 10, bgcolor: '#fff' }} />)}
            {[30, 60].map((x) => <Box key={x} sx={{ position: 'absolute', top: 0, bottom: 0, left: `${x}%`, width: 14, bgcolor: '#fff' }} />)}
            {[[64, 6, 22, 20], [8, 62, 20, 16], [78, 56, 16, 20]].map(([l, t, w, h], k) => <Box key={k} sx={{ position: 'absolute', left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%`, bgcolor: '#D4E8D2', borderRadius: '16px' }} />)}
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              <path d="M13 25 Q 25 20 40 16 T 75 28 T 92 42" fill="none" stroke="#145233" strokeWidth="0.6" strokeDasharray="1 1.4" vectorEffect="non-scaling-stroke" />
            </svg>
            {pins.map(([n, , x, y]) => (
              <Box key={n} sx={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 32, height: 32, ml: '-16px', mt: '-16px', borderRadius: '16px', bgcolor: forest[700], color: '#fff', border: '3px solid #fff', fontSize: 10, fontWeight: 600, display: 'grid', placeItems: 'center', boxShadow: '0 3px 8px rgba(11,46,31,0.3)' }}>{n}</Box>
            ))}
            <Box sx={{ position: 'absolute', left: '47%', top: '60%', width: 32, height: 32, borderRadius: '16px', bgcolor: '#E5574B', border: '3px solid #fff', display: 'grid', placeItems: 'center', '& svg': { color: '#fff', fontSize: 16 } }}><ErrorOutline /></Box>
            <Box sx={{ position: 'absolute', left: 16, top: 16, width: 240, p: '14px 16px', borderRadius: '16px', bgcolor: '#fff', boxShadow: '0 8px 24px rgba(11,46,31,0.12)', display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>58 heroes online</Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', pb: 1, borderBottom: hair, mb: 1 }}>12 zones · 4 stops average per hero</Typography>
              {[['JK', 'green', 'James K.', '4 stops left'], ['OD', 'blue', 'Omar D.', '2 stops left']].map(([i, t, n, s]) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, py: 0.5 }}>
                  <Avatar initials={i} tone={t as AvatarTone} size={32} />
                  <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 12, fontWeight: 600 }}>{n}</Typography><Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{s}</Typography></Box>
                  <RoundBtn label="Message"><ChatBubbleOutline /></RoundBtn>
                </Box>
              ))}
            </Box>
            <Box sx={{ position: 'absolute', right: 16, top: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['+', '−'].map((s) => <Box key={s} sx={{ width: 36, height: 36, borderRadius: '12px', bgcolor: '#fff', display: 'grid', placeItems: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(11,46,31,0.12)' }}>{s}</Box>)}
            </Box>
          </Box>
        </Box>

        <Card title="Unassigned orders" subtitle="Assign a hero" right={<Btn kind="primary" small icon={<NavigationOutlined sx={{ fontSize: 16 }} />}>Auto-assign</Btn>}>
          {ORDERS.map((o, k) => (
            <Box key={o.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: k ? 1.5 : 0, borderTop: k ? hair : 0 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: o.urgent ? '#FBE3E0' : o.t === 'grey' ? '#ECEEEA' : '#FBEFD3', display: 'grid', placeItems: 'center', '& svg': { fontSize: 20, color: o.urgent ? '#B3261E' : o.t === 'grey' ? '#5A625C' : '#8A5A00' } }}><Inventory2Outlined /></Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>#{o.id}</Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{o.addr}</Typography>
              </Box>
              <Pill tone={o.t} dot={false}>{o.tag}</Pill>
              <Btn small onClick={() => setAssign(true)}>Assign</Btn>
            </Box>
          ))}
        </Card>
      </Grid>

      <Card title="Heroes" subtitle="Shift status and capacity" pad={0} sx={{ overflow: 'hidden' }}>
        <DataTable
          minWidth={820}
          rows={HEROES}
          columns={[
            { label: 'Hero', render: (r) => <Person initials={r.i} tone={r.t} name={r.n} sub={r.sub} /> },
            { label: 'Zone', w: 170, render: (r) => <span style={{ fontSize: 12 }}>{r.zone}</span> },
            { label: 'Vehicle', w: 120, render: (r) => <span style={{ fontSize: 12 }}>{r.veh}</span> },
            { label: 'Stops left', w: 90, render: (r) => <span style={{ fontSize: 12 }}>{r.stops}</span> },
            { label: 'Rating', w: 70, render: (r) => <span style={{ fontSize: 12 }}>{r.rate}</span> },
            { label: 'Status', w: 100, render: (r) => <Pill tone={r.s}>{r.st}</Pill> },
            { label: '', w: 44, render: () => <RoundBtn label="Message"><ChatBubbleOutline /></RoundBtn> },
          ]}
        />
      </Card>

      <Modal
        open={assign}
        onClose={() => setAssign(false)}
        title="Assign a Hero or Big Hero"
        subtitle="Choose who delivers this order. Nearby Heroes come first, then Big Heroes."
        icon={<LocalShippingOutlined />}
        width={600}
        footer={<><Btn to="/fulfilment/choose" endIcon={<ArrowForward />}>Compare options</Btn><Btn onClick={() => setAssign(false)}>Cancel</Btn><Btn kind="primary" onClick={() => setAssign(false)}>Assign {CANDIDATES[pick].n.split(' ·')[0]}</Btn></>}
      >
        <SearchField placeholder="Search Heroes and Big Heroes…" value={q} onChange={setQ} width="100%" />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {CANDIDATES.filter((c) => !q || c.n.toLowerCase().includes(q.toLowerCase())).map((c, k) => (
            <Box key={c.n} component="button" type="button" onClick={() => setPick(k)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '12px 14px', borderRadius: '16px', border: pick === k ? '2px solid #145233' : hair, bgcolor: pick === k ? '#F0F7F1' : '#fff', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
              <Avatar initials={c.i} tone={c.t} size={40} />
              <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 14, fontWeight: 600 }}>{c.n}</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{c.sub}</Typography></Box>
              {c.best ? <Pill dot={false}>Best match</Pill> : null}
            </Box>
          ))}
        </Box>
      </Modal>
    </Stack>
  );
}

export { Field };

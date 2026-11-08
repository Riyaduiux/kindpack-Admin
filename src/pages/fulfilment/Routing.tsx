import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Box, Typography } from '@mui/material';
import AltRouteOutlined from '@mui/icons-material/AltRouteOutlined';
import Check from '@mui/icons-material/Check';
import EditOutlined from '@mui/icons-material/EditOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import WarningAmber from '@mui/icons-material/WarningAmber';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import WarehouseOutlined from '@mui/icons-material/WarehouseOutlined';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import HourglassEmpty from '@mui/icons-material/HourglassEmpty';
import ReportProblemOutlined from '@mui/icons-material/ReportProblemOutlined';
import TopBar from '../../layout/TopBar';
import { Avatar, Banner, Btn, Card, cardSx, DataTable, Grid, hair, KV, Pill, Progress, Stack, StatRow, PillTabs, type AvatarTone, type Tone } from '../../components/kit';
import { brand, forest } from '../../theme';

/* ───────────── Routing decision ───────────── */

const ALLOC: { id: number; item: string; sku: string; qty: number; src: string; srcT: Tone; who: string; prog: string; st: string; stT: Tone; conf: string; cT: Tone }[] = [
  { id: 1, item: 'Toilet paper rolls', sku: 'KP-TP-12', qty: 12, src: 'Hero · James K.', srcT: 'green', who: 'James K. · Zone 4', prog: 'Packed → out for delivery', st: 'Out for delivery', stT: 'blue', conf: 'Awaiting proof', cT: 'amber' },
  { id: 2, item: 'Dishwashing liquid refill', sku: 'KP-DW-02', qty: 10, src: 'Main centre', srcT: 'blue', who: 'Warehouse team', prog: 'Picking at B-02', st: 'Picking', stT: 'amber', conf: 'Not started', cT: 'grey' },
  { id: 3, item: 'Colouring activity book', sku: 'KP-CB-01', qty: 6, src: 'Main centre', srcT: 'blue', who: 'Warehouse team', prog: 'Picking at C-01', st: 'Picking', stT: 'amber', conf: 'Not started', cT: 'grey' },
];

export function RoutingDecision() {
  const [mode, setMode] = useState(2);
  const opts = [
    { icon: <LocalShippingOutlined />, t: 'Local Hero', s: 'Hero has all items nearby' },
    { icon: <WarehouseOutlined />, t: 'Main fulfilment centre', s: 'Large or school-direct orders' },
    { icon: <AltRouteOutlined />, t: 'Hybrid', s: 'Split between Hero and centre' },
  ];
  return (
    <Stack gap={3}>
      <TopBar title="Routing decision · Order #KP-10480" helper="St. Mary’s Primary · 28 units · why the system chose this route and what each source fulfils" extra={<><Btn icon={<AltRouteOutlined />}>Override route</Btn><Btn kind="primary" icon={<Check />}>Confirm routing</Btn></>} />
      <Grid cols={{ xs: '1fr', lg: '1.2fr 1fr' }} gap={3.5}>
        <Card title="Routing inputs" subtitle="What the decision was based on">
          <KV rows={[['Customer location', '12 Oak Lane, Greenfield'], ['Hero coverage', 'Zone 4 · James K. covers this address'], ['Hero availability', 'Available · 6 of 10 deliveries today'], ['Relevant stock · Hero', '12 of 28 units'], ['Relevant stock · main centre', 'Full 28 units'], ['Order size', '28 units · 3 products']]} />
        </Card>
        <Card title="Decision" subtitle="Outcome based on configurable thresholds" right={<Pill tone="purple" dot={false}>Hybrid fulfilment</Pill>}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.25 }}>
            {opts.map((o, k) => (
              <Box key={o.t} component="button" type="button" onClick={() => setMode(k)} sx={{ textAlign: 'left', p: '14px', borderRadius: '14px', border: mode === k ? '2px solid #145233' : hair, bgcolor: mode === k ? '#F0F7F1' : '#fff', font: 'inherit', cursor: 'pointer' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, '& svg': { fontSize: 17, color: forest[700] } }}>{o.icon}<Typography sx={{ fontSize: 12, fontWeight: 600 }}>{o.t}</Typography></Box>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>{o.s}</Typography>
              </Box>
            ))}
          </Box>
          <Banner tone="blue" icon={<InfoOutlined />} title="Route reason">James K. holds 12 of the 28 units and is in range, so he fulfils those. The other 16 come from the main centre. School direct large orders go to the main centre.</Banner>
        </Card>
      </Grid>
      <Card title="Allocated items by source" subtitle="Each source has its own progress and delivery confirmation" pad={0} sx={{ overflow: 'hidden' }}>
        <DataTable
          minWidth={1000}
          rows={ALLOC}
          columns={[
            { label: 'Item', render: (r) => <Box><Typography sx={{ fontSize: 12, fontWeight: 600 }}>{r.item}</Typography><Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{r.sku}</Typography></Box> },
            { label: 'Qty', w: 50, render: (r) => <span style={{ fontSize: 12 }}>{r.qty}</span> },
            { label: 'Source', w: 130, render: (r) => <Pill tone={r.srcT} dot={false}>{r.src}</Pill> },
            { label: 'Assigned', w: 140, render: (r) => <span style={{ fontSize: 12 }}>{r.who}</span> },
            { label: 'Progress', w: 170, render: (r) => <span style={{ fontSize: 12 }}>{r.prog}</span> },
            { label: 'Dispatch status', w: 130, render: (r) => <Pill tone={r.stT}>{r.st}</Pill> },
            { label: 'Delivery confirmation', w: 150, render: (r) => <Pill tone={r.cT}>{r.conf}</Pill> },
          ]}
        />
      </Card>
      <Grid cols={{ xs: '1fr', lg: '1.5fr 1fr' }} gap={3.5}>
        <Card title="Progress by source">
          <Box><Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>Hero · James K. — 12 units</Typography><Progress value={43} color="#1D4F91" height={6} /><Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>Out for delivery · ETA 2:15 pm</Typography></Box>
          <Box><Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>Main centre — 16 units</Typography><Progress value={22} color="#8A5A00" height={6} /><Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>Picking · dispatch expected tomorrow</Typography></Box>
          <Banner tone="amber" icon={<WarningAmber />} title="Order status: partially dispatched">Becomes Delivered when both sources are confirmed.</Banner>
        </Card>
        <Card title="Routing thresholds" subtitle="Configurable in Settings · Routing rules" right={<Btn small icon={<EditOutlined sx={{ fontSize: 16 }} />}>Edit</Btn>}>
          <KV rows={[['Max Hero distance', '5 km'], ['Large order goes to main centre from', '25 units'], ['School direct orders', 'Always main centre'], ['Hybrid split allowed', 'Yes'], ['Minimum Hero stock to fulfil an item', '1 unit']]} />
        </Card>
      </Grid>
    </Stack>
  );
}

/* ───────────── Routing exceptions ───────────── */

function ExCard({ title, tag, tagT, order, head, text, rows, actions }: { title: string; tag: string; tagT: Tone; order: string; head: string; text: string; rows: ReactNode; actions: ReactNode }) {
  return (
    <Box sx={{ ...cardSx, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography sx={{ fontSize: 18, fontWeight: 600 }}>{title}</Typography><Pill tone={tagT}>{tag}</Pill></Box>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: -1.5 }}>{order}</Typography>
      <Banner tone={tagT === 'red' ? 'red' : 'amber'} icon={<ReportProblemOutlined />} title={head}>{text}</Banner>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>{rows}</Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', borderTop: hair, pt: 2 }}>{actions}</Box>
    </Box>
  );
}
const heroRow = (i: string, t: AvatarTone, n: string, s: string, tone: Tone) => (
  <Box key={n} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Avatar initials={i} tone={t} size={36} />
    <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{n}</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{s}</Typography></Box>
    <Pill tone={tone} dot={false}>{tone === 'green' ? 'Available' : 'Unavailable'}</Pill>
  </Box>
);

export function RoutingExceptions() {
  return (
    <Stack gap={3}>
      <TopBar title="Routing exceptions" helper="What admins see when no Hero is available or stock cannot cover the order" />
      <Grid cols={{ xs: '1fr', lg: '1fr 1fr' }} gap={3.5}>
        <ExCard
          title="No Hero available" tag="Needs action" tagT="amber" order="Order #KP-10484 · Greenfield Primary · 8 units"
          head="No Hero can take this order" text="Everyone in range is unavailable. The order is waiting for a routing decision."
          rows={<>{heroRow('JK', 'green', 'James K.', 'At capacity · 10 of 10 deliveries today', 'red')}{heroRow('PS', 'blue', 'Priya S.', 'Outside coverage · Zone 2 is 9 km away', 'red')}{heroRow('ML', 'amber', 'Marcus L.', 'Unavailable · off today', 'red')}</>}
          actions={<><Btn kind="primary" small>Assign Hero manually</Btn><Btn small>Send to main centre</Btn><Btn small>Hold order</Btn></>}
        />
        <ExCard
          title="Insufficient stock" tag="Blocked" tagT="red" order="Order #KP-10485 · Dishwashing liquid × 24"
          head="Not enough stock to fulfil in full" text="Main centre has 18 and Heroes hold 6 nearby. 24 are needed."
          rows={<KV rows={[['Requested', '24 bottles'], ['Available · main centre', '18 bottles'], ['Available · Heroes in range', '6 bottles'], ['Shortfall if centre only', '6 bottles']]} />}
          actions={<><Btn kind="primary" small>Fulfil 24 as hybrid</Btn><Btn small>Partial now, backorder 6</Btn><Btn small>Create PO</Btn></>}
        />
      </Grid>
    </Stack>
  );
}

/* ───────────── Delivery & exceptions ───────────── */

const DELIVERIES: { id: string; by: string; cust: string; when: string; conf: string; st: string; s: Tone; act: string }[] = [
  { id: 'KP-10486', by: 'Hero · James K.', cust: 'Sarah Smith · Greenfield', when: 'Today 2:40 pm', conf: 'Hero confirmed', st: 'Awaiting customer', s: 'amber', act: 'Open order' },
  { id: 'KP-10485', by: 'Main centre', cust: 'St. Mary’s Primary', when: 'Today 1:15 pm', conf: 'Photo proof', st: 'Awaiting confirmation', s: 'amber', act: 'Open order' },
  { id: 'KP-10483', by: 'Hybrid · Hero + main', cust: 'Brew & Co. Cafe', when: 'Yesterday', conf: 'Both parts confirmed', st: 'Confirmed', s: 'green', act: 'Open order' },
  { id: 'KP-10479', by: 'Hero · Priya S.', cust: 'Grace Walker', when: 'Yesterday', conf: 'Not delivered', st: 'Failed', s: 'red', act: 'Resolve' },
];

export function Deliveries() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Awaiting confirmation');
  return (
    <Stack gap={3}>
      <TopBar title="Delivery & exceptions" helper="Confirm every delivery and resolve the ones that failed." />
      <StatRow stats={[
        { label: 'Delivered today', value: '142', icon: <CheckCircleOutline />, color: 'green' },
        { label: 'Awaiting confirmation', value: '9', icon: <HourglassEmpty />, color: 'amber' },
        { label: 'Failed deliveries', value: '5', icon: <ErrorOutline />, color: 'red' },
        { label: 'Need admin action', value: '3', icon: <ReportProblemOutlined />, color: 'blue' },
      ]} />
      <PillTabs tabs={['Awaiting confirmation', 'Confirmed', 'Failed / exceptions']} value={tab} onChange={setTab} />
      <Card title="Deliveries" subtitle="Hero, main centre and hybrid orders in one list" pad={0} sx={{ overflow: 'hidden' }}>
        <DataTable
          minWidth={960}
          rows={DELIVERIES.map((d) => ({ ...d, id: d.id }))}
          columns={[
            { label: 'Order', w: 100, render: (r) => <span style={{ fontSize: 12 }}>#{r.id}</span> },
            { label: 'Fulfilled by', w: 160, render: (r) => <span style={{ fontSize: 12 }}>{r.by}</span> },
            { label: 'Customer', render: (r) => <span style={{ fontSize: 12 }}>{r.cust}</span> },
            { label: 'Delivered', w: 110, render: (r) => <span style={{ fontSize: 12 }}>{r.when}</span> },
            { label: 'Confirmation', w: 150, render: (r) => <span style={{ fontSize: 12 }}>{r.conf}</span> },
            { label: 'Status', w: 170, render: (r) => <Pill tone={r.s}>{r.st}</Pill> },
            { label: '', w: 110, render: (r) => <Btn small onClick={() => navigate('/orders/KP-10479')}>{r.act}</Btn> },
          ]}
        />
      </Card>
      <Card title="Failed deliveries and how to resolve them" subtitle="Each outcome has a next step · nothing closes without one">
        <Grid cols={{ xs: '1fr', sm: '1fr 1fr', xl: 'repeat(4, 1fr)' }} gap={2}>
          {[['Customer not home', 'Reschedule the stop', 'Reassign'], ['Wrong address', 'Contact the customer, then reassign', 'Send message'], ['Damaged in transit', 'Review a refund or resend', 'Review refund'], ['Hero stock short', 'Route the missing items to the main centre', 'Open routing']].map(([t, s, a]) => (
            <Box key={t} sx={{ p: '18px', borderRadius: '16px', bgcolor: '#F6F8F5', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{t}</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', flex: 1 }}>{s}</Typography>
              <Btn small>{a}</Btn>
            </Box>
          ))}
        </Grid>
      </Card>
      <Banner tone="blue" icon={<InfoOutlined />} title="Hero confirms, customer confirms, or photo proof">A delivery closes once one of these is recorded. The same record updates Hero stock and the order.</Banner>
    </Stack>
  );
}

/* ───────────── Choose who fulfils an order ───────────── */

const SOURCES: { id: number; n: string; sub: string; type: string; d: string; stock: string; cap: string; ready: string; fit: string; fT: Tone }[] = [
  { id: 1, n: 'Omar D.', sub: 'Zone 2', type: 'Hero', d: '0.8 km', stock: '12 of 28 units', cap: '2 stops left', ready: '35 min', fit: 'Partial stock', fT: 'amber' },
  { id: 2, n: 'James K.', sub: 'Zone 4', type: 'Hero', d: '2.1 km', stock: '4 of 28 units', cap: '4 stops left', ready: '55 min', fit: 'Low stock', fT: 'amber' },
  { id: 3, n: 'Lena C.', sub: 'Zone 3', type: 'Hero', d: '3.4 km', stock: '0 of 28 units', cap: '1 stop left', ready: '1 h', fit: 'No stock', fT: 'red' },
  { id: 4, n: 'Greenfield Warehouse', sub: '', type: 'Big Hero', d: '6.2 km', stock: '28 of 28 units', cap: 'Dispatch queue 5', ready: '2 h', fit: 'Full stock', fT: 'green' },
  { id: 5, n: 'Northside Warehouse', sub: '', type: 'Big Hero', d: '9.0 km', stock: '22 of 28 units', cap: 'Dispatch queue 3', ready: '3 h', fit: 'Partial stock', fT: 'amber' },
];

export function ChooseSource() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(2);
  const modes = [['Single Hero', 'One Hero delivers all items. Needs full stock.'], ['Single Big Hero', 'The warehouse dispatches everything. Best for large and school orders.'], ['Hybrid (suggested)', 'Omar D. 12 units · Greenfield Warehouse 16 units. Each source has its own progress.']];
  return (
    <Stack gap={3}>
      <TopBar title="Choose who fulfils this order" helper="Order #KP-10485 · 28 units · 8 River Rd, Zone 2 · compare Heroes and Big Heroes" />
      <Grid cols={{ xs: '1fr', lg: '1.7fr 1fr' }} gap={3.5}>
        <Card title="Order #KP-10485" subtitle="Urgent · school direct order · 3 products">
          <KV rows={[['Toilet paper rolls', '12 units'], ['Dishwashing liquid refill', '10 units'], ['Colouring activity book', '6 units'], ['Total', '28 units']]} />
        </Card>
        <Card title="What the routing rules say" subtitle="Thresholds are set in Settings · Routing & rules">
          <KV rows={[['Distance', 'Local Hero within 5 km'], ['Order size', '28 units · over the 25 unit limit'], ['Stock', 'No single Hero holds all 28']]} />
          <Banner tone="purple" icon={<AltRouteOutlined />} title="Suggested: hybrid">Omar D. delivers 12 units nearby, Greenfield Warehouse (Big Hero) sends the other 16.</Banner>
        </Card>
      </Grid>
      <Card title="Available Heroes and Big Heroes" subtitle="Only sources with stock for this order are marked as a fit" pad={0} sx={{ overflow: 'hidden' }}>
        <DataTable
          minWidth={960}
          rows={SOURCES}
          columns={[
            { label: 'Source', render: (r) => <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{r.n}{r.sub ? ` · ${r.sub}` : ''}</Typography> },
            { label: 'Type', w: 90, render: (r) => <span style={{ fontSize: 12 }}>{r.type}</span> },
            { label: 'Distance', w: 80, render: (r) => <span style={{ fontSize: 12 }}>{r.d}</span> },
            { label: 'Stock for this order', w: 150, render: (r) => <span style={{ fontSize: 12 }}>{r.stock}</span> },
            { label: 'Capacity', w: 130, render: (r) => <span style={{ fontSize: 12 }}>{r.cap}</span> },
            { label: 'Ready in', w: 80, render: (r) => <span style={{ fontSize: 12 }}>{r.ready}</span> },
            { label: 'Fit', w: 130, render: (r) => <Pill tone={r.fT}>{r.fit}</Pill> },
          ]}
        />
      </Card>
      <Card title="How to fulfil" subtitle="Admin can override the suggestion · every override is recorded in the audit log">
        <Grid cols={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
          {modes.map(([t, s], k) => (
            <Box key={t} component="button" type="button" onClick={() => setMode(k)} sx={{ textAlign: 'left', p: '18px', borderRadius: '16px', border: mode === k ? '2px solid #145233' : hair, bgcolor: mode === k ? '#F0F7F1' : '#fff', font: 'inherit', cursor: 'pointer' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{t}</Typography>
              <Typography sx={{ fontSize: 12, color: brand.slate, mt: 0.5 }}>{s}</Typography>
            </Box>
          ))}
        </Grid>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Btn onClick={() => navigate('/fulfilment')}>Cancel</Btn>
        <Btn kind="primary" onClick={() => navigate('/fulfilment')}>Assign hybrid fulfilment</Btn>
      </Box>
    </Stack>
  );
}

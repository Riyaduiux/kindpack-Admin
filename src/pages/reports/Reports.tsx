import { useState, type ReactNode } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import BookmarkBorder from '@mui/icons-material/BookmarkBorder';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import TopBar from '../../layout/TopBar';
import { Banner, Btn, Card, DataTable, Field, FilterChip, Grid, hair, Input, KV, Modal, Pager, PillTabs, Pill, Select, Stack, type Tone, cardSx } from '../../components/kit';

const cell = (t: ReactNode) => <span style={{ fontSize: 12 }}>{t}</span>;
const T = (s: string): Tone => (/^(Completed|Delivered|Verified|Sent|In stock|Measured|Evidence attached|Ready|Confirmed|Allocated)/.test(s) ? 'green' : /^(In transit|Part|Pending|Not sent|Unverified|Low|Generating|Booking pending|Refund request|Measured zero)/.test(s) ? 'amber' : /^(Failed|Critical|Out of stock|Missing|Needs action)/.test(s) ? 'red' : 'grey');

/* ───────────── Reports hub ───────────── */

const HUB: { key: string; phase: string; t: string; d: string }[] = [
  { key: 'sales', phase: 'Phase 1', t: 'Sales & orders', d: 'Revenue, orders, average order value, refunds' },
  { key: 'inventory', phase: 'Phase 1', t: 'Inventory', d: 'Stock levels, movements, low stock' },
  { key: 'fulfilment', phase: 'Phase 2', t: 'Fulfilment', d: 'Hero vs warehouse, delays, exceptions' },
  { key: 'finance', phase: 'Phase 2', t: 'Finance', d: 'Cost, profit, allocations, payouts' },
  { key: 'donations', phase: 'Phase 2–3', t: 'Donations & fundraising', d: 'Donations, campaigns, conversion' },
  { key: 'esg', phase: 'Phase 4', t: 'ESG & impact', d: 'Product, logistics and recycling impact' },
  { key: 'performance', phase: 'Phase 2–3', t: 'School & Hero performance', d: 'Schools and Heroes side by side' },
];
const RECENT = [
  { id: 1, n: 'Term 4 sales · Greenfield', r: 'Sales & orders', f: 'Period: this term · School: Greenfield', fm: 'CSV', c: '12 Oct', s: 'Ready' },
  { id: 2, n: 'Low stock weekly', r: 'Inventory', f: 'Status: low stock · Warehouse: Main', fm: 'XLSX', c: '11 Oct', s: 'Ready' },
  { id: 3, n: 'Impact Q3 (illustrative)', r: 'ESG & impact', f: 'Period: Q3', fm: 'XLSX', c: '10 Oct', s: 'Generating' },
];

export function ReportsHub() {
  const navigate = useNavigate();
  return (
    <Stack gap={3}>
      <TopBar title="Reports" helper="Basic views come with each phase; advanced reporting is Phase 4. Every report can be exported." extra={<Btn icon={<FileDownloadOutlined />}>Export centre</Btn>} />
      <Grid cols={{ xs: '1fr', sm: '1fr 1fr', xl: 'repeat(4, 1fr)' }} gap={3}>
        {HUB.map((h) => (
          <Box key={h.key} sx={{ ...cardSx, p: 3, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <Pill tone={h.phase === 'Phase 1' ? 'green' : h.phase === 'Phase 4' ? 'purple' : 'blue'} dot={false} sx={{ alignSelf: 'flex-start' }}>{h.phase}</Pill>
            <Typography sx={{ fontSize: 17, fontWeight: 600 }}>{h.t}</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', flex: 1 }}>{h.d}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Btn small kind="primary" onClick={() => navigate(`/reports/${h.key}`)}>Open report</Btn>
              <Btn small icon={<FileDownloadOutlined sx={{ fontSize: 16 }} />}>Export</Btn>
            </Box>
          </Box>
        ))}
      </Grid>
      <Card title="Saved filters & recent exports" pad={0} sx={{ overflow: 'hidden' }}>
        <DataTable minWidth={760} rows={RECENT} columns={[{ label: 'Name', render: (r) => <b style={{ fontSize: 13 }}>{r.n}</b> }, { label: 'Report', w: 120, render: (r) => cell(r.r) }, { label: 'Filters', w: 260, render: (r) => cell(r.f) }, { label: 'Format', w: 70, render: (r) => cell(r.fm) }, { label: 'Created', w: 70, render: (r) => cell(r.c) }, { label: 'Status', w: 110, render: (r) => <Pill tone={T(r.s)}>{r.s}</Pill> }]} />
      </Card>
    </Stack>
  );
}

/* ───────────── Individual report ───────────── */

interface Report {
  title: string;
  helper: string;
  filters: [string, string][];
  stats: [string, string][];
  detail: string;
  cols: { label: string; w?: number; status?: boolean }[];
  rows: string[][];
  count: string;
  defs: [string, string][];
  note?: [Tone, string, string];
}

const REPORTS: Record<string, Report> = {
  sales: { title: 'Sales & orders', helper: 'Orders and revenue for the selected period · all amounts in AUD', filters: [['Period', '1 Sep – 12 Oct 2026'], ['Role', 'All'], ['School', 'All'], ['Warehouse', 'All']], stats: [['Orders', '1,842'], ['Order value (incl. GST · awaiting basis)', 'AUD 214,300'], ['Average order value', 'AUD 116.30'], ['Refunds', 'AUD 3,180']], detail: 'One row per order', cols: [{ label: 'Order', w: 90 }, { label: 'Customer' }, { label: 'Role', w: 100 }, { label: 'School', w: 150 }, { label: 'Total', w: 90 }, { label: 'Status', w: 110, status: true }], rows: [['#KP-10482', 'Smith Family', 'Family', 'Greenfield Primary', 'AUD 29.00', 'Completed'], ['#KP-10481', 'Brew & Co. Cafe', 'Business', 'Greenfield Primary', 'AUD 99.00', 'In transit'], ['#KP-10480', 'St. Mary’s Primary', 'School', '—', 'AUD 214.50', 'Allocated'], ['#KP-10479', 'Grace Walker', 'Family member', 'Greenfield Primary', 'AUD 100.00', 'Refund request']], count: 'Showing 4 of 1,842 orders', defs: [['Orders', 'Count of orders placed in the period'], ['Order value', 'Sum of order totals · tax basis awaiting agreement'], ['Average order value', 'Order value ÷ orders'], ['Refunds', 'Approved refund amounts']] },
  inventory: { title: 'Inventory', helper: 'Stock levels and movements for the selected period · quantities in units', filters: [['Period', '1 Sep – 12 Oct 2026'], ['Role', 'All'], ['School', 'All'], ['Warehouse', 'All']], stats: [['Warehouse on hand', '4,820 units'], ['Held by Heroes', '612 units'], ['Products below reorder point', '7'], ['Out of stock', '2']], detail: 'One row per product and location', cols: [{ label: 'Product' }, { label: 'Location', w: 100 }, { label: 'On hand', w: 70 }, { label: 'Reserved', w: 70 }, { label: 'Available', w: 70 }, { label: 'Reorder pt', w: 80 }, { label: 'Status', w: 100, status: true }], rows: [['Toilet paper rolls · KP-TP-12', 'Main · A-01', '1,240', '180', '1,060', '400', 'In stock'], ['Dishwashing liquid · KP-DW-02', 'Main · B-02', '90', '20', '70', '200', 'Low stock'], ['All-purpose cleaner · KP-AP-01', 'Main · B-02', '22', '4', '18', '150', 'Critical'], ['Colouring book · KP-CB-01', 'Main · C-01', '0', '0', '0', '250', 'Out of stock']], count: 'Showing 4 of 142 products', defs: [['On hand', 'Units physically in the warehouse'], ['Reserved', 'Units committed to open orders and approved Hero requests'], ['Available', 'On hand minus reserved'], ['Reorder point', 'Level below which a restock is suggested']] },
  fulfilment: { title: 'Fulfilment', helper: 'How orders were fulfilled: local Hero, main centre or hybrid', filters: [['Period', '1 Sep – 12 Oct 2026'], ['Source', 'All'], ['School', 'All'], ['Zone', 'All']], stats: [['Hero fulfilment', '61 %'], ['Main centre', '27 %'], ['Hybrid', '12 %'], ['Exceptions', '14']], detail: 'One row per order', cols: [{ label: 'Order', w: 90 }, { label: 'Customer' }, { label: 'Source', w: 100 }, { label: 'Assigned', w: 150 }, { label: 'Dispatched', w: 90 }, { label: 'Delivered', w: 80 }, { label: 'Status', w: 110, status: true }], rows: [['#KP-10482', 'Smith Family', 'Hero', 'James K.', '12 Oct', '12 Oct', 'Delivered'], ['#KP-10481', 'Brew & Co. Cafe', 'Main centre', 'Courier', '12 Oct', '—', 'In transit'], ['#KP-10480', 'St. Mary’s Primary', 'Hybrid', 'James K. + warehouse', '12 Oct', '—', 'Part dispatched'], ['#KP-10484', 'Greenfield Primary', 'No Hero', 'Unassigned', '—', '—', 'Needs action']], count: 'Showing 4 of 1,842 orders', defs: [['Hero fulfilment', 'Share of orders fully fulfilled by a local Hero'], ['Main centre', 'Share fulfilled from the warehouse'], ['Hybrid', 'Orders split between a Hero and the warehouse'], ['Exceptions', 'Orders with no Hero or insufficient stock']] },
  finance: { title: 'Finance', helper: 'Cost, profit and profit allocation · all amounts in AUD · illustrative', filters: [['Period', '1 Sep – 12 Oct 2026'], ['Role', 'All'], ['School', 'All'], ['Warehouse', 'All']], stats: [['Selling amount', 'AUD 214,300'], ['Total cost', 'AUD 150,100'], ['Profit', 'AUD 64,200'], ['School share (50 %)', 'AUD 32,100']], detail: 'One row per order · tax basis awaiting agreement', cols: [{ label: 'Order', w: 90 }, { label: 'Selling', w: 90 }, { label: 'Landing', w: 90 }, { label: 'Operating', w: 90 }, { label: 'Profit', w: 90 }, { label: 'School 50 %', w: 100 }, { label: 'Hero 10 %', w: 100 }], rows: [['#KP-10482', 'AUD 29.00', 'AUD 17.40', 'AUD 2.90', 'AUD 8.70', 'AUD 4.35', 'AUD 0.87'], ['#KP-10481', 'AUD 99.00', 'AUD 59.40', 'AUD 9.90', 'AUD 29.70', 'AUD 14.85', 'AUD 2.97'], ['#KP-10479', 'AUD 100.00', 'AUD 60.00', 'AUD 10.00', 'AUD 30.00', 'AUD 15.00', 'AUD 3.00'], ['#KP-10477', 'AUD 320.00', 'AUD 205.00', 'AUD 130.00', '−AUD 15.00', 'Not allocated', 'Not allocated']], count: 'Showing 4 of 1,842 orders', defs: [['Selling amount', 'Order total on the same basis as costs'], ['Total cost', 'Landing cost plus operating cost'], ['Profit', 'Selling amount minus total cost'], ['Allocation', 'School 50 %, Hero 10 %, Kids 5 %, KindPack 35 % of profit']] },
  donations: { title: 'Donations & fundraising', helper: 'Donations received and campaign progress · all amounts in AUD', filters: [['Period', '1 Sep – 12 Oct 2026'], ['School', 'All'], ['Campaign', 'All'], ['Payment', 'All']], stats: [['Donations received', 'AUD 84,230'], ['Donors', '1,926'], ['Awaiting verification', '65'], ['Receipts pending', '38']], detail: 'Donations are separate from profit allocation', cols: [{ label: 'Donor' }, { label: 'Amount', w: 90 }, { label: 'School / campaign', w: 230 }, { label: 'Payment', w: 90, status: true }, { label: 'Receipt', w: 90, status: true }, { label: 'Date', w: 60 }], rows: [['Emma Carter', 'AUD 50.00', 'Greenfield Primary · general', 'Verified', 'Sent', '11 Oct'], ['Anonymous', 'AUD 200.00', 'St. Mary’s Primary · Library Books Fund', 'Pending', 'Not sent', '11 Oct'], ['David Wong', 'AUD 25.00', 'Greenfield Primary · general', 'Verified', 'Failed', '10 Oct'], ['Jack Brown', 'AUD 10.00', 'Northside Primary · Winter coats', 'Failed', 'None', '10 Oct']], count: 'Showing 4 of 1,926 donations', defs: [['Donations received', 'Verified and pending donations in the period'], ['Donors', 'Distinct donors, anonymous counted once'], ['Receipts pending', 'Verified donations without a sent receipt'], ['Campaign progress', 'Raised amount divided by target']] },
  esg: { title: 'ESG & impact', helper: 'Product, logistics and recycling impact · illustrative figures', filters: [['Period', '1 Sep – 12 Oct 2026'], ['Source', 'All'], ['School', 'All'], ['Region', 'All']], stats: [['Total impact · illustrative', '6.4 t CO₂e'], ['Product contribution', '3.1 t'], ['Logistics contribution', '1.2 t'], ['Recycling & returns', '2.1 t']], detail: 'Missing and unverified inputs are shown separately from measured zero', cols: [{ label: 'Source' }, { label: 'Record', w: 90 }, { label: 'Period', w: 80 }, { label: 'Value', w: 110 }, { label: 'Evidence', w: 140 }, { label: 'Status', w: 100, status: true }], rows: [['Product · KP-TP-12', 'ESG-2210', 'Oct 2026', '0.42 kg CO₂e', 'LCA report v2', 'Measured'], ['Logistics · van route', 'ESG-2211', 'Oct 2026', '1.8 kg CO₂e', 'GPS trip T-8841', 'Unverified'], ['Recycling · PET bottles', 'ESG-2212', 'Oct 2026', '0.6 kg CO₂e', 'Warehouse count', 'Measured'], ['Product · KP-DW-02', 'ESG-2213', 'Oct 2026', '—', 'None', 'Missing']], count: 'Showing 4 of 473 records', defs: [['Total impact', 'Product + logistics + recycling, each activity counted once'], ['Unverified', 'Value without confirmed evidence'], ['Missing', 'No value and no evidence · excluded from totals'], ['Measured zero', 'A real zero · included']] },
  performance: { title: 'School & Hero performance', helper: 'Compare schools and Heroes over the same period · illustrative figures', filters: [], stats: [['Schools active', '32'], ['Raised for schools', 'AUD 18,450'], ['Active families', '3,420'], ['Working Heroes active', '46']], detail: 'Period: this term · orders are linked to one school each', cols: [{ label: 'School' }, { label: 'Families', w: 70 }, { label: 'Orders', w: 70 }, { label: 'Revenue (AUD)', w: 110 }, { label: 'School share (AUD)', w: 130 }, { label: 'Kids tasks', w: 80 }], rows: [['Greenfield Primary', '148', '612', '18,420', '2,940', '1,024'], ['Riverside Primary', '96', '401', '12,060', '1,880', '760'], ['Northside College', '71', '288', '8,640', '1,310', '512'], ['Westbank School', '54', '190', '5,700', '905', '340']], count: 'Showing 4 of 32 schools', defs: [] },
};
const HERO_PERF = { cols: [{ label: 'Hero' }, { label: 'Zone', w: 150 }, { label: 'Deliveries', w: 90 }, { label: 'On time', w: 80 }, { label: 'Failed', w: 70 }, { label: 'Hero share (AUD)', w: 130 }], rows: [['James K.', 'Zone 4 · Greenfield', '312', '97 %', '2', '936.00'], ['Omar D.', 'Zone 2 · Riverside', '288', '95 %', '4', '864.00'], ['Priya S.', 'Zone 3 · Parkside', '241', '96 %', '1', '723.00']] };

export function ReportPage() {
  const { kind = 'sales' } = useParams();
  const [params] = useSearchParams();
  const r = REPORTS[kind] ?? REPORTS.sales;
  const [exp, setExp] = useState(params.get('modal') === 'export');
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('School performance');
  const perf = kind === 'performance';
  const cols = perf && tab === 'Hero performance' ? HERO_PERF.cols : r.cols;
  const rows = perf && tab === 'Hero performance' ? HERO_PERF.rows : r.rows;
  const data = rows.map((row, i) => ({ id: i, row }));
  return (
    <Stack gap={3}>
      <TopBar title={r.title} helper={r.helper} extra={<><Btn icon={<BookmarkBorder />}>Save filter</Btn><Btn kind="primary" icon={<FileDownloadOutlined />} onClick={() => { setReady(false); setExp(true); }}>Export</Btn></>} />
      {perf ? <PillTabs tabs={['School performance', 'Hero performance']} value={tab} onChange={setTab} /> : null}
      {r.filters.length ? <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>{r.filters.map(([l, v]) => <FilterChip key={l} label={l} value={v} />)}</Box> : null}
      <Grid cols={{ xs: '1fr', sm: '1fr 1fr', xl: 'repeat(4, 1fr)' }} gap={3.5}>
        {r.stats.map(([l, v]) => <Box key={l} sx={{ ...cardSx, p: '20px 24px' }}><Typography sx={{ fontSize: 26, fontWeight: 600, lineHeight: 1.2 }}>{v}</Typography><Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{l}</Typography></Box>)}
      </Grid>
      <Grid cols={{ xs: '1fr', xl: r.defs.length ? '2.2fr 1fr' : '1fr' }} gap={3.5}>
        <Card title="Detail" subtitle={r.detail} pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable minWidth={760} rows={data} columns={cols.map((c, ci) => ({ label: c.label, w: (c as { w?: number }).w, render: (d: { row: string[] }) => ('status' in c && (c as { status?: boolean }).status ? <Pill tone={T(d.row[ci])}>{d.row[ci]}</Pill> : ci === 0 ? <b style={{ fontSize: 12 }}>{d.row[ci]}</b> : cell(d.row[ci])) }))} footer={<Pager text={r.count} pages={['1', '2', '3']} />} />
        </Card>
        {r.defs.length ? (
          <Card title="Metric definitions" subtitle="What each total means">
            <KV rows={r.defs.map(([k, v]) => [<b key={k}>{k}</b>, <span key={v} style={{ fontSize: 12, fontWeight: 400 }}>{v}</span>] as [ReactNode, ReactNode])} />
          </Card>
        ) : null}
      </Grid>
      <Modal open={exp} onClose={() => setExp(false)} title={ready ? 'Report ready' : 'Export report'} subtitle={ready ? 'Reference EXP-20261012-0418' : r.title} icon={<FileDownloadOutlined />} footer={ready ? <><Btn onClick={() => setExp(false)}>Close</Btn><Btn kind="primary" icon={<FileDownloadOutlined />} onClick={() => setExp(false)}>Download</Btn></> : <><Btn onClick={() => setExp(false)}>Cancel</Btn><Btn kind="primary" onClick={() => setReady(true)}>Create export</Btn></>}>
        {ready ? <KV rows={[['Report', r.title], ['Period', '1 Sep – 12 Oct 2026'], ['Format', 'CSV'], ['Rows', '1,842'], ['File size', '380 KB'], ['Created by', 'Md Riyad · 12 Oct 2026, 9:41 am']]} /> : <><Field label="Format"><Select value="CSV" options={['CSV', 'XLSX', 'PDF']} /></Field><Field label="Period"><Input value="1 Sep – 12 Oct 2026" /></Field></>}
      </Modal>
    </Stack>
  );
}

/* ───────────── Containers for Change ───────────── */

export function ContainersForChange() {
  return (
    <Stack gap={3}>
      <TopBar title="Containers for Change" helper="Booking connection for recycling drop-offs · dependent on partner access" extra={<Btn>Test connection</Btn>} />
      <Banner tone="amber" icon={<InfoOutlined />} title="Awaiting partner confirmation">A public booking API is not confirmed. Access and supported capabilities must be agreed with the partner before this connection can be built.</Banner>
      <Grid cols={{ xs: '1fr', lg: '1fr 1fr' }} gap={3.5}>
        <Card title="Configuration" subtitle="Shown once partner access is confirmed" right={<Pill tone="grey">Not connected</Pill>}>
          <Grid cols="1fr 1fr" gap={2}>
            <Field label="Partner account"><Input placeholder="Not set" /></Field>
            <Field label="Environment"><Select value="Sandbox" options={['Sandbox', 'Production']} /></Field>
            <Field label="API key"><Input value="•••• •••• ••••" /></Field>
            <Field label="Webhook URL"><Input placeholder="https://…" /></Field>
          </Grid>
          <Field label="Default drop-off location"><Select value="Main warehouse · Greenfield" options={['Main warehouse · Greenfield', 'Eastwood depot']} /></Field>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}><Btn>Cancel</Btn><Btn kind="primary">Save & connect</Btn></Box>
        </Card>
        <Card title="Connection & booking states" subtitle="Designed for when the connection exists">
          {[['Not connected', 'grey', 'No partner access configured.'], ['Connected', 'green', 'Credentials valid · last checked just now.'], ['Booking pending', 'amber', 'Sent to partner · waiting for confirmation.'], ['Booking confirmed', 'green', 'Drop-off confirmed with reference.'], ['Booking failed', 'red', 'Partner rejected or unreachable · retry or contact partner.']].map(([t, tone, s], k) => (
            <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: k ? 1.25 : 0, borderTop: k ? hair : 0 }}><Pill tone={tone as Tone}>{t}</Pill><Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s}</Typography></Box>
          ))}
        </Card>
      </Grid>
      <Card title="Booking results" subtitle="Illustrative" pad={0} sx={{ overflow: 'hidden' }}>
        <DataTable minWidth={720} rows={[{ id: 1, b: 'BK-0091', d: 'Main warehouse · Greenfield', c: '240', r: '12 Oct', p: '—', s: 'Pending' }, { id: 2, b: 'BK-0090', d: 'Eastwood depot', c: '180', r: '8 Oct', p: 'CFC-77120', s: 'Confirmed' }, { id: 3, b: 'BK-0089', d: 'Riverside school', c: '90', r: '2 Oct', p: '—', s: 'Failed' }]} columns={[{ label: 'Booking', w: 90, render: (r) => <b style={{ fontSize: 12 }}>{r.b}</b> }, { label: 'Drop-off', render: (r) => cell(r.d) }, { label: 'Containers', w: 90, render: (r) => cell(r.c) }, { label: 'Requested', w: 80, render: (r) => cell(r.r) }, { label: 'Partner reference', w: 130, render: (r) => cell(r.p) }, { label: 'Status', w: 100, render: (r) => <Pill tone={T(r.s)}>{r.s}</Pill> }]} />
      </Card>
    </Stack>
  );
}


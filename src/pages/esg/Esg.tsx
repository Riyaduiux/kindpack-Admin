import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Box, Typography } from '@mui/material';
import EnergySavingsLeafOutlined from '@mui/icons-material/EnergySavingsLeafOutlined';
import WaterDropOutlined from '@mui/icons-material/WaterDropOutlined';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import ArrowForward from '@mui/icons-material/ArrowForward';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import TopBar from '../../layout/TopBar';
import { AreaChart } from '../../components/charts';
import { Banner, Btn, Card, DataTable, Field, FilterChip, Grid, hair, Input, Modal, Pill, PillTabs, Progress, Select, Stack, StatRow, Toggle, type Tone, cardSx } from '../../components/kit';
import { forest } from '../../theme';

const cell = (t: ReactNode) => <span style={{ fontSize: 12 }}>{t}</span>;
const T = (s: string): Tone => (/^(Measured zero|Unverified)/.test(s) ? 'amber' : /^(Measured|Evidence attached|Verified|On)/.test(s) ? 'green' : /^(Missing|Off)/.test(s) ? 'red' : 'grey');

/* ───────────── Impact (ESG) overview ───────────── */

export function EsgOverview() {
  const navigate = useNavigate();
  const [range, setRange] = useState('Year');
  return (
    <Stack gap={3}>
      <TopBar title="Impact (ESG)" helper="Environmental impact across every family, school and business." extra={<Btn onClick={() => navigate('/esg/inputs')}>Calculation inputs</Btn>} />
      <StatRow stats={[
        { label: 'CO₂ · illustr.', value: '56,840 kg', icon: <EnergySavingsLeafOutlined />, color: 'green', hint: 'CO₂ · illustr.  ↑ 11%' },
        { label: 'Plastic bottles avoided', value: '320k', icon: <Inventory2Outlined />, color: 'blue', hint: 'Plastic bottles avoided  ↑ 9%' },
        { label: 'Raised for schools', value: 'AUD 48.5k', icon: <FavoriteBorder />, color: 'amber', hint: 'Raised for schools  ↑ 13%' },
        { label: 'Water saved', value: '89,450 L', icon: <WaterDropOutlined />, color: 'purple', hint: 'Water saved  ↑ 7%' },
      ]} />
      <Grid cols={{ xs: '1fr', xl: '1.7fr 1fr' }} gap={3.5}>
        <Card title="CO₂ saved (kg) · illustrative" subtitle="Last 12 months · all regions" right={<PillTabs tabs={['Quarter', 'Year', 'All']} value={range} onChange={setRange} />}>
          <AreaChart color={forest[600]} values={[3200, 3600, 3900, 4100, 4400, 4600, 4900, 5200, 5400, 5700, 6000, 6400]} labels={['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']} />
        </Card>
        <Card title="By zone" subtitle="Share of total impact">
          {[['Zone 4 · Greenfield', 28], ['Zone 2 · Riverside', 22], ['Zone 1 · Harbour', 19], ['Zone 3 · Parkside', 17], ['Zone 5 · Hillview', 14]].map(([n, p]) => (
            <Box key={n}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography sx={{ fontSize: 12, fontWeight: 500 }}>{n}</Typography><Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{p}%</Typography></Box><Progress value={(p as number) * 3} height={6} /></Box>
          ))}
        </Card>
      </Grid>
      <Card title="Reports" subtitle="CSR / ESG reports for schools, businesses and regulators" right={<Btn kind="primary" small onClick={() => navigate('/reports/esg')}>Generate report</Btn>} pad={0} sx={{ overflow: 'hidden' }}>
        <DataTable minWidth={720} rows={[{ id: 1, i: 'Quarterly impact summary', s: 'All regions', a: 'Public', p: 'Q3 2026', g: '02 Oct 2026' }, { id: 2, i: 'CSR report – Brew & Co. Cafe', s: 'Business account', a: 'Business', p: 'Jul–Sep 2026', g: '01 Oct 2026' }, { id: 3, i: 'School impact – Greenfield Primary', s: 'School account', a: 'School', p: 'Term 3', g: '28 Sep 2026' }]} columns={[{ label: 'Report', render: (r) => <Box><b style={{ fontSize: 13 }}>{r.i}</b><div style={{ fontSize: 11, color: '#5A625C' }}>{r.s}</div></Box> }, { label: 'Audience', w: 90, render: (r) => cell(r.a) }, { label: 'Period', w: 110, render: (r) => cell(r.p) }, { label: 'Generated', w: 100, render: (r) => cell(r.g) }, { label: 'Format', w: 60, render: () => <Pill tone="grey" dot={false}>PDF</Pill> }]} />
      </Card>
    </Stack>
  );
}

/* ───────────── Calculation inputs (3 tabs) ───────────── */

const LEGEND = (
  <Card title="How missing data is shown">
    {[['Missing', 'red', 'No value, no evidence. Left out of totals.'], ['Unverified', 'amber', 'Value given, evidence not confirmed.'], ['Measured zero', 'green', 'A real zero. Included as 0.']].map(([t, tone, s]) => (
      <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Pill tone={tone as Tone}>{t}</Pill><Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s}</Typography></Box>
    ))}
  </Card>
);

export function EsgInputs() {
  const [tab, setTab] = useState('Product values');
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const help = tab === 'Product values' ? ['Entered on the product, not here', 'Change a value in Products → Add / Edit product → Sustainability. This table only shows what the roll-up uses.'] : tab === 'Logistics' ? ['Entered from delivery records', 'Distance comes from the route log and the vehicle from the Hero or fleet profile. Change a factor in Settings.'] : ['Entered per return or collection', 'Quantities come from return scans. The Containers for Change booking connects here once partner access is confirmed.'];
  const tables: Record<string, { t: string; s: string; cols: [string, number?][]; rows: string[][] }> = {
    'Product values': { t: 'Product impact values', s: 'Used as quantity × value for every order', cols: [['Product'], ['CO₂ / unit (kg)', 90], ['Plastic / unit (g)', 90], ['Recycled %', 80], ['Biodegradable', 90], ['Refillable', 80], ['Water / unit (L)', 90], ['Evidence', 130], ['Status', 120]], rows: [['Toilet paper rolls · KP-TP-12', '0.42', '0', '78 %', 'Yes', 'No', '—', 'LCA report v2', 'Evidence attached'], ['Gentle shampoo refill · KP-SH-05', '0.18', '52', '40 %', 'No', 'Yes', '1.2', 'Supplier declaration', 'Unverified'], ['Dishwashing liquid refill · KP-DW-02', '—', '—', '—', '—', 'Yes', '—', 'None', 'Missing'], ['Colouring activity book · KP-CB-01', '0.00', '0', '100 %', 'Yes', 'No', '—', 'Supplier measurement', 'Measured zero']] },
    Logistics: { t: 'Delivery distance and vehicle', s: 'One line per Hero or fleet · a missing record is not the same as zero', cols: [['Hero / fleet'], ['Vehicle', 100], ['Distance (km)', 90], ['Factor (kg CO₂/km)', 120], ['CO₂ (kg)', 80], ['Source', 130], ['Status', 120]], rows: [['James K. · Zone 4', 'E-cargo bike', '142', '0.00', '0.0', 'GPS route log', 'Measured zero'], ['Omar D. · Zone 2', 'Van', '86', '0.21', '18.1', 'GPS route log', 'Evidence attached'], ['Main centre dispatch', 'Van', '412', '0.24', '98.9', 'Fleet log (manual)', 'Unverified'], ['Courier partner', '—', '—', '—', '—', 'None', 'Missing']] },
    'Recycling & returns': { t: 'Returned material', s: 'Quantity, material and the calculation inputs', cols: [['Material'], ['Quantity (units)', 100], ['Weight (kg)', 90], ['Factor (kg CO₂/kg)', 120], ['CO₂ avoided (kg)', 110], ['Source', 110], ['Status', 120]], rows: [['Plastic bottles (PET)', '340', '10.2', '1.50', '15.3', 'Return scan', 'Evidence attached'], ['Cardboard', '120', '18.0', '0.90', '16.2', 'Return scan', 'Unverified'], ['Soft plastics', '—', '—', '—', '—', 'None', 'Missing'], ['Glass jars', '0', '0.0', '0.00', '0.0', 'Return scan', 'Measured zero']] },
  };
  const tb = tables[tab];
  return (
    <Stack gap={3}>
      <TopBar title="ESG calculation inputs" helper={tab === 'Product values' ? 'The six impact values per product. Entered on each product, shown here for review · illustrative' : tab === 'Logistics' ? 'Logistics emissions inputs from GPS records · illustrative' : 'Returned material quantities and the factors used · illustrative'} extra={<Btn kind="primary" icon={<AddIcon />} onClick={() => setModal(true)}>Add factor</Btn>} />
      <Banner tone="blue" icon={<InfoOutlined />} title={help[0]}>{help[1]}</Banner>
      <PillTabs tabs={['Product values', 'Logistics', 'Recycling & returns']} value={tab} onChange={setTab} />
      <Grid cols={{ xs: '1fr', xl: '2.4fr 1fr' }} gap={3.5}>
        <Card title={tb.t} subtitle={tb.s} pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable minWidth={900} rows={tb.rows.map((row, i) => ({ id: i, row }))} columns={tb.cols.map(([label, w], ci) => ({ label, w, render: (d: { row: string[] }) => (ci === tb.cols.length - 1 ? <Pill tone={T(d.row[ci])}>{d.row[ci]}</Pill> : ci === 0 ? <b style={{ fontSize: 12 }}>{d.row[ci]}</b> : cell(d.row[ci])) }))} />
        </Card>
        <Stack gap={3.5}>
          {tab === 'Product values' ? LEGEND : (
            <Card title="Share of total impact" subtitle="Reporting period: October 2026 · illustrative">
              {[['Product values', 62], ['Logistics', 28], ['Recycling & returns', 10]].map(([n, p]) => <Box key={n}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography sx={{ fontSize: 12, fontWeight: 500 }}>{n}</Typography><Typography sx={{ fontSize: 12 }}>{p} %</Typography></Box><Progress value={p as number} height={6} /></Box>)}
            </Card>
          )}
          <Card title="Where these values go" subtitle="Click to open">
            {[['Order impact (quantity × value)', '/esg/rollup'], ['Public counters (verified only)', '/esg/public'], ['Order detail card', '/orders/KP-10479']].map(([t, to]) => (
              <Box key={t} component="button" type="button" onClick={() => navigate(to)} sx={{ display: 'flex', alignItems: 'center', p: '12px 14px', borderRadius: '12px', border: hair, bgcolor: '#fff', font: 'inherit', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}><Box sx={{ flex: 1 }}>{t}</Box><ArrowForward sx={{ fontSize: 16, color: forest[700] }} /></Box>
            ))}
          </Card>
        </Stack>
      </Grid>
      <Modal open={modal} onClose={() => setModal(false)} title="Add ESG factor" subtitle="Factors are versioned and recorded in the audit log." icon={<AddIcon />} footer={<><Btn onClick={() => setModal(false)}>Cancel</Btn><Btn kind="primary" onClick={() => setModal(false)}>Add factor</Btn></>}>
        <Field label="Factor name" req><Input placeholder="e.g. Van emission factor" /></Field>
        <Grid cols="1fr 1fr" gap={2}>
          <Field label="Value" req><Input placeholder="0.21" /></Field>
          <Field label="Unit"><Select value="kg CO₂/km" options={['kg CO₂/km', 'kg CO₂/kg', 'g / unit']} /></Field>
        </Grid>
        <Field label="Evidence / source"><Input placeholder="e.g. Supplier declaration" /></Field>
      </Modal>
    </Stack>
  );
}

/* ───────────── Impact results ───────────── */

export function ImpactResults() {
  const navigate = useNavigate();
  return (
    <Stack gap={3}>
      <TopBar title="Impact results" helper="Product, logistics and recycling contributions for the reporting period · illustrative" extra={<><Btn onClick={() => navigate('/esg/social')}>Social engagement</Btn><Btn kind="primary" icon={<FileDownloadOutlined />}>Export report</Btn></>} />
      <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>{[['Period', '1 Sep – 12 Oct 2026'], ['School', 'All'], ['Region', 'All']].map(([l, v]) => <FilterChip key={l} label={l} value={v} />)}</Box>
      <Banner tone="amber" icon={<InfoOutlined />} title="Illustrative figures">Values below are examples. Nothing is shown as measured until its method and evidence are defined and confirmed.</Banner>
      <StatRow stats={[
        { label: 'Total impact · illustrative', value: '6.4 t CO₂e', icon: <EnergySavingsLeafOutlined />, color: 'green' },
        { label: 'Product contribution', value: '3.1 t', icon: <Inventory2Outlined />, color: 'blue' },
        { label: 'Logistics contribution', value: '1.2 t', icon: <FileDownloadOutlined />, color: 'amber' },
        { label: 'Recycling & returns', value: '2.1 t', icon: <WaterDropOutlined />, color: 'purple' },
      ]} />
      <Grid cols={{ xs: '1fr', lg: '1.4fr 1fr' }} gap={3.5}>
        <Card title="Contribution to total impact" subtitle="Share of each source · counts each activity once">
          {[['Product ESG', 48, '3.1 t · 1 product unverified', '#145233'], ['Logistics ESG', 19, '1.2 t · van factor needs a source', '#1D4F91'], ['Recycling & returns', 33, '2.1 t · counted at warehouse', '#8A5A00']].map(([n, p, s, c]) => (
            <Box key={n as string}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{n}</Typography><Typography sx={{ fontSize: 13 }}>{p} %</Typography></Box><Progress value={(p as number) * 2} color={c as string} height={8} /><Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>{s}</Typography></Box>
          ))}
        </Card>
        <Card title="Data quality" subtitle="Records feeding this period">
          {[['Measured', '412 records', 'green'], ['Unverified', '38 records', 'amber'], ['Missing input', '9 records', 'red'], ['Measured zero', '14 records', 'grey']].map(([t, n, tone]) => <Box key={t} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Pill tone={tone as Tone}>{t}</Pill><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{n}</Typography></Box>)}
        </Card>
      </Grid>
      <Card title="Source records" subtitle="Open a record to see its calculation" pad={0} sx={{ overflow: 'hidden' }}>
        <DataTable minWidth={800} rows={[{ id: 1, r: 'ESG-2210', t: 'Product · KP-TP-12', s: 'Order #KP-10482', v: '0.42 kg CO₂e', st: 'Measured' }, { id: 2, r: 'ESG-2211', t: 'Logistics · van route', s: 'GPS trip T-8841', v: '1.8 kg CO₂e', st: 'Unverified' }, { id: 3, r: 'ESG-2212', t: 'Recycling · PET bottles', s: 'Warehouse count W-0412', v: '0.6 kg CO₂e', st: 'Measured' }, { id: 4, r: 'ESG-2213', t: 'Product · KP-DW-02', s: 'No factor', v: '—', st: 'Missing' }, { id: 5, r: 'ESG-2214', t: 'Logistics · bicycle', s: 'GPS trip T-8852', v: '0.00 kg CO₂e', st: 'Measured zero' }]} columns={[{ label: 'Record', w: 90, render: (r) => <b style={{ fontSize: 12 }}>{r.r}</b> }, { label: 'Type', render: (r) => cell(r.t) }, { label: 'Source', w: 170, render: (r) => cell(r.s) }, { label: 'Period', w: 80, render: () => cell('Oct 2026') }, { label: 'Value', w: 110, render: (r) => cell(r.v) }, { label: 'Status', w: 120, render: (r) => <Pill tone={T(r.st)}>{r.st}</Pill> }]} />
      </Card>
    </Stack>
  );
}

/* ───────────── Public impact counters ───────────── */

export function PublicCounters() {
  const [rows, setRows] = useState([{ id: 1, n: 'Plastic bottles avoided', b: 'Returns × baseline', r: 'Nearest 100', on: true, st: 'Verified' }, { id: 2, n: 'Carbon saved', b: 'Product + logistics', r: 'Nearest 0.1 t', on: false, st: 'Unverified' }, { id: 3, n: 'Deliveries by bicycle', b: 'GPS trips', r: 'Nearest 10', on: true, st: 'Verified' }, { id: 4, n: 'Funds raised for schools', b: 'Verified donations', r: 'Nearest AUD 100', on: true, st: 'Verified' }]);
  return (
    <Stack gap={3}>
      <TopBar title="Public impact counters" helper="Counters shown to the public use the same calculations as the role dashboards." extra={<Btn kind="primary">Publish changes</Btn>} />
      <Banner tone="amber" icon={<InfoOutlined />} title="Counters are hidden until figures are verified">Publish only values with a defined method and evidence. Unverified or missing inputs are never shown as measured.</Banner>
      <Grid cols={{ xs: '1fr', xl: '1.5fr 1fr' }} gap={3.5}>
        <Card title="Counter settings" subtitle="Choose what the public sees" pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable minWidth={620} rows={rows} columns={[{ label: 'Counter', render: (r) => <b style={{ fontSize: 13 }}>{r.n}</b> }, { label: 'Based on', w: 140, render: (r) => cell(r.b) }, { label: 'Rounding', w: 110, render: (r) => cell(r.r) }, { label: 'Show', w: 60, render: (r) => <Toggle on={r.on} onChange={(v) => setRows(rows.map((x) => (x.id === r.id ? { ...x, on: v } : x)))} /> }, { label: 'Data status', w: 100, render: (r) => <Pill tone={T(r.st)}>{r.st}</Pill> }]} />
        </Card>
        <Card title="Public preview" subtitle="What visitors see on the website" right={<Pill tone="amber" dot={false}>Illustrative preview</Pill>}>
          <Box sx={{ p: 3, borderRadius: '20px', color: '#fff', background: 'linear-gradient(148deg,#145233 14.286%,#0B2E1F 85.714%)' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 2 }}>Together we have made a difference</Typography>
            <Grid cols="1fr 1fr 1fr" gap={1.5}>
              {[['12,400', 'Plastic bottles avoided'], ['3,480', 'Deliveries by bicycle'], ['AUD 84,200', 'Raised for schools']].map(([v, l]) => <Box key={l}><Typography sx={{ fontSize: 20, fontWeight: 600 }}>{v}</Typography><Typography sx={{ fontSize: 10, opacity: 0.8 }}>{l}</Typography></Box>)}
            </Grid>
          </Box>
        </Card>
      </Grid>
    </Stack>
  );
}

/* ───────────── ESG roll-up ───────────── */

export function EsgRollup() {
  const navigate = useNavigate();
  const steps = [['1', 'Product', 'Entered per product', '0.42 kg CO₂ per pack', 'Open Product values', '/esg/inputs'], ['2', 'Order', 'Σ quantity × product value', '#KP-10479 · 2.58 kg CO₂e', 'Open Order detail', '/orders/KP-10479'], ['3', 'Family', 'Σ all family orders', 'Smith Family · 12.4 kg this month', 'Open Family detail', '/users/family'], ['4', 'School', 'Σ all linked orders', 'Greenfield Primary · 2.1 t', 'Open School detail', '/users/school'], ['5', 'Platform', 'Σ all orders', '6.4 t CO₂e · 126k bottles', 'Open Impact results', '/esg/results']];
  return (
    <Stack gap={3}>
      <TopBar title="ESG roll-up" helper="How a product value becomes an order, family, school and platform total · illustrative figures" extra={<Btn onClick={() => navigate('/esg/social')}>Social engagement</Btn>} />
      <Banner tone="amber" icon={<InfoOutlined />} title="Illustrative figures">Nothing is shown as measured until each product value has a defined method and evidence.</Banner>
      <Grid cols={{ xs: '1fr', md: 'repeat(5, 1fr)' }} gap={2}>
        {steps.map(([n, t, s, v, l, to]) => (
          <Box key={n} sx={{ ...cardSx, p: 2.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '14px', bgcolor: forest[700], color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600 }}>{n}</Box>
            <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{t}</Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{s}</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 500, flex: 1 }}>{v}</Typography>
            <Btn small onClick={() => navigate(to)}>{l}</Btn>
          </Box>
        ))}
      </Grid>
      <Grid cols={{ xs: '1fr', xl: '1.7fr 1fr' }} gap={3.5}>
        <Card title="Worked example · Order #KP-10479" subtitle="Impact of one order = quantity × the value saved on each product" pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable minWidth={700} rows={[{ id: 1, i: 'Toilet paper rolls', q: '4', u: '0.42 kg', c: '1.68 kg', p: '0 g', v: 'Product → Sustainability' }, { id: 2, i: 'Gentle shampoo refill', q: '5', u: '0.18 kg', c: '0.90 kg', p: '260 g', v: 'Product → Sustainability' }, { id: 3, i: 'Dishwashing refill', q: '4', u: 'No data', c: '—', p: '—', v: 'Missing · left out' }, { id: 4, i: 'Order total', q: '', u: '', c: '2.58 kg', p: '260 g', v: 'Calculated' }]} columns={[{ label: 'Item', render: (r) => <b style={{ fontSize: 12 }}>{r.i}</b> }, { label: 'Qty', w: 40, render: (r) => cell(r.q) }, { label: 'CO₂ / unit', w: 80, render: (r) => cell(r.u) }, { label: 'CO₂', w: 70, render: (r) => cell(r.c) }, { label: 'Plastic', w: 70, render: (r) => cell(r.p) }, { label: 'Value from', w: 170, render: (r) => cell(r.v) }]} />
        </Card>
        <Stack gap={3.5}>
          <Card title="What people see" subtitle="Shown on role dashboards · illustrative">
            {[['“You saved 12.4 kg CO₂ this month”', 'Family dashboard'], ['“Your family prevented 340 plastic bottles from landfill”', 'Family dashboard'], ['“Your school reduced 2.1 tons of emissions”', 'School dashboard']].map(([q, w]) => <Box key={q} sx={{ p: '12px 14px', borderRadius: '12px', bgcolor: '#EEF5EF' }}><Typography sx={{ fontSize: 13, fontWeight: 500 }}>{q}</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{w}</Typography></Box>)}
          </Card>
          <Banner tone="blue" icon={<InfoOutlined />} title="Each activity is counted once">An order adds to its family, its linked school and the platform. A bottle is never added twice.</Banner>
        </Stack>
      </Grid>
    </Stack>
  );
}

/* ───────────── Social engagement ───────────── */

export function SocialEngagement() {
  const navigate = useNavigate();
  return (
    <Stack gap={3}>
      <TopBar title="Social engagement" helper="The social side of ESG: families, schools, kids and Heroes taking part · illustrative figures" extra={<Btn onClick={() => navigate('/esg/rollup')}>ESG roll-up</Btn>} />
      <Banner tone="amber" icon={<InfoOutlined />} title="Definitions awaiting agreement">What counts as "engagement" has not been confirmed by the business. These figures are examples of what the panel could show.</Banner>
      <Grid cols={{ xs: '1fr 1fr', xl: 'repeat(6, 1fr)' }} gap={2.5}>
        {[['3,420', 'Active families', 'Placed an order this quarter'], ['32', 'Schools supported', 'Linked to at least one family'], ['12,840', 'Kids tasks completed', 'Approved by a parent or school'], ['AUD 18,450', 'Raised for schools', 'School share of profit'], ['46', 'Working Heroes active', 'Delivered an order this month'], ['9', 'Campaigns funded', 'Approved and paid out']].map(([v, l, s]) => (
          <Box key={l} sx={{ ...cardSx, p: 2.5 }}><Typography sx={{ fontSize: 22, fontWeight: 600 }}>{v}</Typography><Typography sx={{ fontSize: 12, fontWeight: 500 }}>{l}</Typography><Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{s}</Typography></Box>
        ))}
      </Grid>
      <Grid cols={{ xs: '1fr', xl: '1.8fr 1fr' }} gap={3.5}>
        <Card title="Engagement by school" subtitle="Orders and families are linked to a school at registration" pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable minWidth={620} rows={[{ id: 1, s: 'Greenfield Primary', f: '148', o: '612', r: '2,940', k: '1,024' }, { id: 2, s: 'Riverside Primary', f: '96', o: '401', r: '1,880', k: '760' }, { id: 3, s: 'Northside College', f: '71', o: '288', r: '1,310', k: '512' }, { id: 4, s: 'Westbank School', f: '54', o: '190', r: '905', k: '340' }]} columns={[{ label: 'School', render: (r) => <b style={{ fontSize: 13 }}>{r.s}</b> }, { label: 'Families', w: 70, render: (r) => cell(r.f) }, { label: 'Orders', w: 70, render: (r) => cell(r.o) }, { label: 'Raised (AUD)', w: 100, render: (r) => cell(r.r) }, { label: 'Kids tasks', w: 90, render: (r) => cell(r.k) }]} />
        </Card>
        <Stack gap={3.5}>
          <Card title="Where these numbers come from" subtitle="Click to open">
            {[['Kids tasks completed', '/rewards/review'], ['Funds raised for schools', '/finance/earnings'], ['Families and orders per school', '/reports/performance'], ['Campaigns funded', '/fundraising']].map(([t, to]) => (
              <Box key={t} component="button" type="button" onClick={() => navigate(to)} sx={{ display: 'flex', alignItems: 'center', p: '12px 14px', borderRadius: '12px', border: hair, bgcolor: '#fff', font: 'inherit', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}><Box sx={{ flex: 1 }}>{t}</Box><ArrowForward sx={{ fontSize: 16, color: forest[700] }} /></Box>
            ))}
          </Card>
          <Banner tone="blue" icon={<InfoOutlined />} title="Counted once, linked to a school">Each family, order and task is counted once and sits under one school. Points have no cash value and are not counted as money.</Banner>
        </Stack>
      </Grid>
    </Stack>
  );
}


import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import WarningAmber from '@mui/icons-material/WarningAmber';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Check from '@mui/icons-material/Check';
import TopBar from '../../layout/TopBar';
import { Banner, Btn, Card, Check as Tick, DataTable, Field, Grid, hair, Input, KV, Modal, Pill, Select, Stack, type Tone } from '../../components/kit';
import { SubTabs } from '../../components/profile';
import { brand, forest } from '../../theme';

/* ───────────── Profit allocation ───────────── */

const SHARES: { k: string; label: string; sub: string; init: number }[] = [
  { k: 'school', label: 'School share', sub: 'Linked school of the order', init: 50 },
  { k: 'hero', label: 'Working Hero share', sub: 'Hero who fulfils the order', init: 10 },
  { k: 'kids', label: 'Kids share', sub: 'Kids rewards pool', init: 5 },
  { k: 'kp', label: 'KindPack share', sub: 'Platform operations', init: 35 },
];

export function ProfitAllocation() {
  const [params] = useSearchParams();
  const err = params.get('state') === 'error';
  const [confirm, setConfirm] = useState(params.get('state') === 'confirm');
  const [saved, setSaved] = useState(false);
  const [vals, setVals] = useState<Record<string, number>>(Object.fromEntries(SHARES.map((s) => [s.k, err && s.k === 'kp' ? 40 : s.init])));
  const total = Object.values(vals).reduce((a, b) => a + b, 0);
  const bad = total !== 100;
  const profit = 30;
  const amt = (k: string) => `AUD ${((profit * (vals[k] || 0)) / 100).toFixed(2)}`;

  return (
    <Stack gap={3}>
      <TopBar title="Profit allocation" helper="School 50 %, working Hero 10 %, Kids 5 %, KindPack 35 % of profit — all configurable." />
      {bad ? <Banner tone="red" icon={<WarningAmber />} title="Allocation must total 100 %">The four shares add up to {total} %. Adjust the percentages before saving.</Banner> : null}
      {saved ? <Banner tone="green" icon={<Check />} title="Allocation rule v4 saved">Applies to orders placed on or after 1 Nov 2026.</Banner> : null}
      <Grid cols={{ xs: '1fr', lg: '1.15fr 1fr' }} gap={3.5}>
        <Stack gap={3.5}>
          <Card title="Share of profit" subtitle="Applied to profit after landing and operating cost. Every percentage is configurable.">
            <Grid cols={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
              {SHARES.map((s) => (
                <Field key={s.k} label={s.label} hint={s.sub} error={bad && s.k === 'kp' ? `Total is ${total} %. It must equal 100 %.` : undefined}>
                  <Input value={String(vals[s.k])} suffix="% of profit" error={bad && s.k === 'kp'} onChange={(v) => setVals({ ...vals, [s.k]: Number(v.replace(/\D/g, '')) || 0 })} />
                </Field>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, pt: 1 }}>
              <Pill tone={bad ? 'red' : 'green'}>{bad ? `Total allocation is ${total} %` : 'Total allocation is 100 %'}</Pill>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Btn>Cancel</Btn>
                <Btn kind="primary" disabled={bad} onClick={() => setConfirm(true)}>Review & save</Btn>
              </Box>
            </Box>
          </Card>
          <Card title="Rule details" subtitle="Version history is kept for audit">
            <KV rows={[['Version', 'v4 (draft) · current live rule v3'], ['Effective from', '1 Nov 2026'], ['Applies to', 'Orders placed on or after the effective date'], ['Changed by', 'Md Riyad · Super admin']]} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Pill tone="amber" dot={false}>Needs business confirmation</Pill><Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Not approved — shown for decision</Typography></Box>
            <Grid cols={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
              <Field label="Where the Hero share goes when no Hero is assigned" hint="It applies only when a Hero is assigned"><Select value="Back to KindPack" options={['Back to KindPack', 'Kids pool', 'School']} /></Field>
              <Field label="Tax basis (prices incl. or excl. GST)"><Select value="Excluding GST" options={['Excluding GST', 'Including GST']} /></Field>
              <Field label="Rounding of cents"><Select value="Round half up" options={['Round half up', 'Round down']} /></Field>
              <Field label="Treatment when profit is negative"><Select value="Awaiting decision" options={['Awaiting decision', 'No allocation', 'KindPack absorbs']} /></Field>
            </Grid>
          </Card>
        </Stack>
        <Card title="Calculation preview" subtitle="Illustrative profit — change the amount to test">
          <Field label="Profit to allocate (AUD)"><Input value="AUD 30.00" /></Field>
          {bad ? (
            <Box sx={{ p: 4, textAlign: 'center', borderRadius: '16px', bgcolor: '#FBEFD3', color: '#8A5A00' }}>
              <Typography sx={{ fontWeight: 600 }}>Preview unavailable</Typography>
              <Typography sx={{ fontSize: 13 }}>Fix the total to 100 % to see the split.</Typography>
            </Box>
          ) : (
            <Box>
              {[['School', 'Greenfield Primary', 'school'], ['Working Hero', 'Omar D. (fulfilling Hero)', 'hero'], ['Kids', 'Kids rewards pool', 'kids'], ['KindPack', 'Platform', 'kp']].map(([n, s, k], i) => (
                <Box key={n} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.75, borderTop: i ? hair : 0 }}>
                  <Box><Typography sx={{ fontSize: 14, fontWeight: 600 }}>{n}</Typography><Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{s}</Typography></Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{amt(k)}</Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: hair }}><Typography sx={{ fontWeight: 600 }}>Total</Typography><Typography sx={{ fontSize: 20, fontWeight: 600, color: forest[700] }}>AUD 30.00</Typography></Box>
            </Box>
          )}
        </Card>
      </Grid>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Save new allocation rule (v4)?"
        subtitle="The new rule applies to orders placed on or after 1 Nov 2026. Past orders keep the rule they were calculated with."
        icon={<InfoOutlined />}
        footer={<><Btn onClick={() => setConfirm(false)}>Cancel</Btn><Btn kind="primary" onClick={() => { setConfirm(false); setSaved(true); }}>Confirm and save</Btn></>}
      >
        <DataTable
          minWidth={420}
          rows={[{ id: 1, r: 'School', a: '40 %', b: '50 %' }, { id: 2, r: 'Working Hero', a: '10 %', b: '10 %' }, { id: 3, r: 'Kids', a: '5 %', b: '5 %' }, { id: 4, r: 'KindPack', a: '45 %', b: '35 %' }, { id: 5, r: 'Total', a: '100 %', b: '100 %' }]}
          columns={[{ label: 'Recipient', render: (r) => <b style={{ fontSize: 13 }}>{r.r}</b> }, { label: 'Current (v3)', w: 100, render: (r) => r.a }, { label: 'New (v4)', w: 100, render: (r) => <b>{r.b}</b> }]}
        />
        <Tick label="I understand this changes how profit is shared for new orders." />
      </Modal>
    </Stack>
  );
}

/* ───────────── Cost & profit ───────────── */

const ITEMS = [
  { id: 1, i: 'Toilet paper rolls', sku: 'KP-TP-12', q: 4, s: 'AUD 6.00', f: 'AUD 1.00', t: 'AUD 28.00' },
  { id: 2, i: 'Gentle shampoo refill', sku: 'KP-SH-05', q: 5, s: 'AUD 3.20', f: 'AUD 0.40', t: 'AUD 18.00' },
  { id: 3, i: 'Dishwashing liquid refill', sku: 'KP-DW-02', q: 4, s: 'AUD 3.00', f: 'AUD 0.50', t: 'AUD 14.00' },
];

const EXC: { t: string; tag: string; tone: Tone; head: string; text: string; rows: [string, string][] }[] = [
  { t: 'Low profit', tag: 'Review', tone: 'amber', head: 'Profit is below the review threshold', text: 'Margin 4 %. Allocations are calculated but flagged for finance review.', rows: [['Selling amount', 'AUD 100.00'], ['Total cost', 'AUD 96.00'], ['Profit', 'AUD 4.00 · 4 % margin'], ['School 50 %', 'AUD 2.00'], ['Working Hero 10 %', 'AUD 0.40'], ['Kids 5 %', 'AUD 0.20'], ['KindPack 35 %', 'AUD 1.40']] },
  { t: 'Negative profit (loss)', tag: 'Needs decision', tone: 'red', head: 'Order sold at a loss', text: 'No allocation is made. Loss treatment is awaiting a business decision.', rows: [['Selling amount', 'AUD 100.00'], ['Total cost', 'AUD 108.00'], ['Profit', '−AUD 8.00'], ['School / Hero / Kids / KindPack', 'Not allocated'], ['Loss allocation rule', 'Awaiting business decision']] },
  { t: 'Missing cost input', tag: 'Incomplete', tone: 'amber', head: 'Landing cost missing for KP-SH-05', text: 'Profit cannot be calculated until supplier cost and freight are entered.', rows: [['Selling amount', 'AUD 100.00'], ['Landing cost', 'Missing'], ['Operating cost', 'AUD 10.00'], ['Profit', '—'], ['Allocations', 'Not calculated']] },
  { t: 'No Hero fulfilled the order', tag: 'Needs decision', tone: 'amber', head: 'Warehouse fulfilled this order', text: 'The working Hero share has no recipient. Treatment is awaiting a business decision.', rows: [['Profit', 'AUD 30.00'], ['School 50 %', 'AUD 15.00'], ['Working Hero 10 %', 'AUD 3.00 · recipient to be decided'], ['Kids 5 %', 'AUD 1.50'], ['KindPack 35 %', 'AUD 10.50']] },
];

export function CostProfit() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'exceptions' ? 'Exceptions' : 'Summary');
  const navigate = useNavigate();
  return (
    <Stack gap={3}>
      <TopBar title="Cost & profit breakdown" helper={tab === 'Exceptions' ? 'How the breakdown behaves when profit is low, negative, or inputs are missing · illustrative' : 'Sample order · all values are order totals in AUD · illustrative example from the brief'} extra={<Btn icon={<FileDownloadOutlined />}>Export</Btn>} />
      <SubTabs tabs={['Summary', 'Cost inputs', 'Allocation', 'Exceptions']} value={tab} onChange={setTab} />
      {tab === 'Exceptions' ? (
        <Grid cols={{ xs: '1fr', lg: '1fr 1fr' }} gap={3.5}>
          {EXC.map((e) => (
            <Card key={e.t} title={e.t} right={<Pill tone={e.tone}>{e.tag}</Pill>}>
              <Banner tone={e.tone === 'red' ? 'red' : 'amber'} icon={<WarningAmber />} title={e.head}>{e.text}</Banner>
              <KV rows={e.rows} />
            </Card>
          ))}
        </Grid>
      ) : (
        <>
          <Grid cols={{ xs: '1fr', lg: '1.3fr 1fr' }} gap={3.5}>
            <Card title="Cost build-up" subtitle="Landing cost + operating cost = total cost · selling amount − total cost = profit">
              <KV rows={[['Selling amount (same basis as costs)', 'AUD 100.00']]} />
              <Typography sx={{ fontSize: 11, color: brand.placeholder, letterSpacing: 0.4 }}>LANDING COST</Typography>
              <KV rows={[['Supplier cost', 'AUD 52.00'], ['Inbound freight', 'AUD 8.00'], [<b key="l">Landing cost</b>, <b key="lv">AUD 60.00</b>]]} />
              <Typography sx={{ fontSize: 11, color: brand.placeholder, letterSpacing: 0.4 }}>OPERATING COST</Typography>
              <KV rows={[['Packing', 'AUD 3.00'], ['Local Hero delivery', 'AUD 5.00'], ['Handling', 'AUD 2.00'], [<b key="o">Operating cost</b>, <b key="ov">AUD 10.00</b>]]} />
              <KV rows={[['Total cost (landing + operating)', 'AUD 70.00'], [<b key="p">Profit (selling − total cost)</b>, <b key="pv" style={{ color: forest[700] }}>AUD 30.00 · 30 % margin</b>]]} />
            </Card>
            <Stack gap={3.5}>
              <Card title="Profit allocation" subtitle="Rule v3 · 50 / 10 / 5 / 35">
                <DataTable
                  minWidth={380}
                  rows={[{ id: 1, b: 'School', s: '50 %', a: '15.00', n: 'Greenfield Primary (linked school)' }, { id: 2, b: 'Working Hero', s: '10 %', a: '3.00', n: 'Omar D. (fulfilled)' }, { id: 3, b: 'Kids', s: '5 %', a: '1.50', n: 'Kids rewards pool' }, { id: 4, b: 'KindPack', s: '35 %', a: '10.50', n: 'Platform' }, { id: 5, b: 'Total', s: '100 %', a: '30.00', n: '' }]}
                  columns={[{ label: 'Beneficiary', render: (r) => <Box><b style={{ fontSize: 13 }}>{r.b}</b><div style={{ fontSize: 11, color: '#5A625C' }}>{r.n}</div></Box> }, { label: 'Share', w: 60, render: (r) => r.s }, { label: 'AUD', w: 60, render: (r) => <b>{r.a}</b> }]}
                />
              </Card>
              <Card title="Customer donation" subtitle="Kept separate from profit allocation">
                <KV rows={[['Donation to Greenfield Primary campaign', 'AUD 5.00']]} />
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>100 % goes to the chosen school or campaign. It is not part of profit and is not split.</Typography>
              </Card>
            </Stack>
          </Grid>
          <Grid cols={{ xs: '1fr', lg: '1.6fr 1fr' }} gap={3.5}>
            <Card title="Product cost inputs → landing cost" subtitle="Supplier cost + inbound freight per item" pad={0} sx={{ overflow: 'hidden' }}>
              <DataTable
                minWidth={620}
                rows={ITEMS}
                columns={[
                  { label: 'Item', render: (r) => <Box><b style={{ fontSize: 12 }}>{r.i}</b><div style={{ fontSize: 10, color: '#5A625C' }}>{r.sku}</div></Box> },
                  { label: 'Qty', w: 40, render: (r) => r.q },
                  { label: 'Supplier / unit', w: 100, render: (r) => r.s },
                  { label: 'Freight / unit', w: 100, render: (r) => r.f },
                  { label: 'Landing total', w: 100, render: (r) => <b>{r.t}</b> },
                ]}
              />
            </Card>
            <Stack gap={3.5}>
              <Banner tone="blue" icon={<InfoOutlined />} title="Avoid double counting">Supplier cost and inbound freight are already in landing cost. Do not enter them again as operating cost.</Banner>
              <Card title="Needs business confirmation" subtitle="Shown as open decisions, not approved rules">
                {['Tax basis: price incl. or excl. GST', 'Rounding of cents and remainders', 'Loss allocation when profit is negative', 'Separate delivery fee, if any'].map((t) => <Typography key={t} sx={{ fontSize: 13, py: 0.75, borderTop: hair }}>{t}</Typography>)}
                <Btn small onClick={() => navigate('/finance/profit')}>Open profit allocation</Btn>
              </Card>
            </Stack>
          </Grid>
        </>
      )}
    </Stack>
  );
}

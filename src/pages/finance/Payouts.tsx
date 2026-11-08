import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import EventOutlined from '@mui/icons-material/EventOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import PlayArrowOutlined from '@mui/icons-material/PlayArrowOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import UploadFileOutlined from '@mui/icons-material/UploadFileOutlined';
import Check from '@mui/icons-material/Check';
import LockOutlined from '@mui/icons-material/LockOutlined';
import TopBar from '../../layout/TopBar';
import { Btn, Card, DataTable, Field, Grid, hair, Input, KV, Modal, Pager, Person, Pill, PillTabs, RelatedLinks, SearchField, SelectionBar, BarBtn, Stack, StatRow, TextArea, Toolbar, type AvatarTone, type Tone } from '../../components/kit';
import { brand, forest } from '../../theme';

const SCHOOLS: { id: number; i: string; t: AvatarTone; n: string; bank: string; period: string; p: string; f: string; tot: string; st: string; s: Tone }[] = [
  { id: 1, i: 'GP', t: 'green', n: 'Greenfield Primary', bank: 'Bank ••4821', period: 'Sep 2026', p: 'AUD 2,400', f: 'AUD 4,200', tot: 'AUD 6,600', st: 'Pending', s: 'amber' },
  { id: 2, i: 'SM', t: 'blue', n: 'St. Mary’s Primary', bank: 'Bank ••1190', period: 'Sep 2026', p: 'AUD 1,980', f: 'AUD 1,300', tot: 'AUD 3,280', st: 'Pending', s: 'amber' },
  { id: 3, i: 'RP', t: 'amber', n: 'Riverside Primary', bank: 'Bank ••7733', period: 'Sep 2026', p: 'AUD 1,430', f: 'AUD 800', tot: 'AUD 2,230', st: 'Pending', s: 'amber' },
  { id: 4, i: 'PP', t: 'red', n: 'Parkside Primary', bank: 'Bank ••5502', period: 'Sep 2026', p: 'AUD 980', f: 'AUD 0', tot: 'AUD 980', st: 'Failed', s: 'red' },
  { id: 5, i: 'HV', t: 'purple', n: 'Hillview Primary', bank: 'Bank ••0914', period: 'Aug 2026', p: 'AUD 1,120', f: 'AUD 540', tot: 'AUD 1,660', st: 'Paid', s: 'green' },
];

export function Payouts() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState('School payouts');
  const [sel, setSel] = useState<Set<number>>(new Set([0, 1, 2]));
  const [modal, setModal] = useState(params.get('modal') === 'batch');
  const [paid, setPaid] = useState(false);
  return (
    <Stack gap={3}>
      <TopBar title="Payouts" helper="Pay out school earnings and Hero earnings." />
      <RelatedLinks links={[{ label: 'Payout requests', to: '/finance/requests' }, { label: 'Earnings & donations', to: '/finance/earnings' }, { label: 'Profit allocation', to: '/finance/profit' }, { label: 'Cost & profit', to: '/finance/cost-profit' }]} />
      <StatRow stats={[
        { label: 'Pending payouts', value: 'AUD 18.4k', icon: <AccountBalanceWalletOutlined />, color: 'amber' },
        { label: 'Paid this month', value: 'AUD 96.2k', icon: <CheckCircleOutline />, color: 'green' },
        { label: 'Failed transfers', value: '2', icon: <ErrorOutline />, color: 'red' },
        { label: 'Proposed next batch', value: 'Fri 16 Oct', icon: <EventOutlined />, color: 'blue' },
      ]} />
      <Toolbar left={<PillTabs tabs={['School payouts', 'Hero payouts', 'Business refunds']} value={tab} onChange={setTab} />} right={<><Btn icon={<FileDownloadOutlined />}>Export</Btn><Btn kind="primary" icon={<PlayArrowOutlined />} onClick={() => setModal(true)}>{paid ? 'Batch sent' : 'Run payout batch'}</Btn></>} />
      {sel.size ? (
        <SelectionBar count={sel.size}>
          <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Total AUD 12,110.00 · 3 schools</Typography>
          <BarBtn light>Hold</BarBtn>
          <BarBtn onClick={() => setModal(true)}>Approve & pay selected</BarBtn>
        </SelectionBar>
      ) : null}
      <Grid cols={{ xs: '1fr', xl: '2.2fr 1fr' }} gap={3.5}>
        <Card title={tab} subtitle="School profit share + fundraising donations" pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable
            minWidth={820}
            selectable
            selected={sel}
            onSelect={setSel}
            rows={SCHOOLS}
            columns={[
              { label: 'School', render: (r) => <Person initials={r.i} tone={r.t} name={r.n} sub={r.bank} size={40} /> },
              { label: 'Period', w: 80, render: (r) => <span style={{ fontSize: 12 }}>{r.period}</span> },
              { label: 'Profit share', w: 90, render: (r) => <span style={{ fontSize: 12 }}>{r.p}</span> },
              { label: 'Fundraising', w: 90, render: (r) => <span style={{ fontSize: 12 }}>{r.f}</span> },
              { label: 'Total', w: 90, render: (r) => <b style={{ fontSize: 12 }}>{r.tot}</b> },
              { label: 'Status', w: 90, render: (r) => <Pill tone={r.s}>{r.st}</Pill> },
            ]}
            footer={<Pager text="Showing 5 of 23 payouts" pages={['1', '2', '3']} />}
          />
        </Card>
        <Stack gap={3.5}>
          <Box sx={{ p: 3, borderRadius: '24px', color: '#fff', background: 'linear-gradient(148deg,#145233 14.286%,#0B2E1F 85.714%)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography sx={{ fontSize: 11, letterSpacing: 0.6, opacity: 0.75 }}>NEXT PAYOUT RUN</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 600 }}>Friday, 16 Oct</Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {[['03', 'days'], ['14', 'hours'], ['27', 'min']].map(([v, l]) => <Box key={l} sx={{ flex: 1, textAlign: 'center', p: '10px', borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.12)' }}><Typography sx={{ fontSize: 20, fontWeight: 600 }}>{v}</Typography><Typography sx={{ fontSize: 11, opacity: 0.75 }}>{l}</Typography></Box>)}
            </Box>
            <Typography sx={{ fontSize: 12, opacity: 0.8 }}>23 recipients · est. AUD 18.4k</Typography>
          </Box>
          <Card title="Payout rules" subtitle="Applied to every batch" right={<Btn small icon={<EditOutlined sx={{ fontSize: 16 }} />}>Edit rules</Btn>}>
            <KV rows={[['Schedule', 'Manual · awaiting agreement'], ['Kids share of profit', '5%'], ['School share', '50%'], ['Working Hero share', '10%'], ['Minimum payout', 'AUD 50.00'], ['Fraud hold window · awaiting agreement', '48 hours']]} />
          </Card>
        </Stack>
      </Grid>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Run payout batch"
        subtitle="3 school payouts will be sent now. This action is recorded in the audit log."
        icon={<PlayArrowOutlined />}
        footer={<><Btn onClick={() => setModal(false)}>Cancel</Btn><Btn kind="primary" onClick={() => { setModal(false); setPaid(true); setSel(new Set()); }}>Pay now</Btn></>}
      >
        <KV rows={[['Greenfield Primary', 'AUD 6,600.00'], ['St. Mary’s Primary', 'AUD 3,280.00'], ['Riverside Primary', 'AUD 2,230.00'], [<b key="t">Total</b>, <b key="tv">AUD 12,110.00</b>]]} />
        <Field label="Enter your 2FA code to confirm"><Input placeholder="••••••" icon={<LockOutlined />} /></Field>
      </Modal>
    </Stack>
  );
}

/* ───────────── Earnings & donations ───────────── */

const EARN = [
  { id: 1, o: 'Order #KP-10482', c: 'Order profit share', a: 'AUD 15.00', st: 'Pending', s: 'amber' as Tone, d: '12 Oct' },
  { id: 2, o: 'Order #KP-10479', c: 'Order profit share', a: 'AUD 15.00', st: 'Pending', s: 'amber' as Tone, d: '12 Oct' },
  { id: 3, o: 'Donation D-0412 · Emma Carter', c: 'Donation allocation', a: 'AUD 50.00', st: 'Paid', s: 'green' as Tone, d: '11 Oct' },
  { id: 4, o: 'Order #KP-10470', c: 'Order profit share', a: 'AUD 22.50', st: 'Paid', s: 'green' as Tone, d: '2 Oct' },
];
const DON: { id: number; i: string; t: AvatarTone; n: string; a: string; w: string; pay: string; pT: Tone; rec: string; rT: Tone; m: string; d: string }[] = [
  { id: 1, i: 'EC', t: 'green', n: 'Emma Carter', a: 'AUD 50.00', w: 'Greenfield Primary · general', pay: 'Verified', pT: 'green', rec: 'Sent', rT: 'green', m: '“Keep up the great work!”', d: '11 Oct' },
  { id: 2, i: '?', t: 'amber', n: 'Anonymous', a: 'AUD 200.00', w: 'Greenfield Primary · general', pay: 'Pending', pT: 'amber', rec: 'Not sent', rT: 'grey', m: '—', d: '11 Oct' },
  { id: 3, i: 'DW', t: 'blue', n: 'David Wong', a: 'AUD 25.00', w: 'Greenfield Primary · general', pay: 'Verified', pT: 'green', rec: 'Failed', rT: 'red', m: '“For the kids.”', d: '10 Oct' },
];

export function Earnings() {
  const [tab, setTab] = useState('Earnings');
  return (
    <Stack gap={3}>
      <TopBar title="School earnings & donations" helper="Greenfield Primary · available, pending and paid are tracked separately · amounts in AUD" extra={<><Btn icon={<FileDownloadOutlined />}>Export</Btn><Btn kind="primary" to="/finance/requests/PO-3318">Request payout</Btn></>} />
      <StatRow stats={[
        { label: 'Available balance', value: 'AUD 6,420.00', icon: <AccountBalanceWalletOutlined />, color: 'green' },
        { label: 'Pending earnings', value: 'AUD 3,180.00', icon: <EventOutlined />, color: 'amber' },
        { label: 'Paid earnings', value: 'AUD 28,940.00', icon: <CheckCircleOutline />, color: 'blue' },
        { label: 'Donations received', value: 'AUD 12,610.00', icon: <AccountBalanceWalletOutlined />, color: 'red' },
      ]} />
      <Toolbar left={<PillTabs tabs={['Earnings', 'Donations', 'Balances']} value={tab} onChange={setTab} />} right={<><SearchField placeholder="Order, donor or reference…" width={240} /><Btn>State: All</Btn><Btn>Period: This term</Btn></>} />
      {tab !== 'Donations' ? (
        <Card title="Earnings records" subtitle="School share of profit (50 %) from orders linked to this school" pad={0} sx={{ overflow: 'hidden' }}>
          <DataTable
            minWidth={820}
            rows={EARN}
            columns={[
              { label: 'Beneficiary', render: () => <Person initials="GP" tone="green" name="Greenfield Primary" sub="School" size={40} /> },
              { label: 'Originating order / donation', w: 230, render: (r) => <span style={{ fontSize: 12 }}>{r.o}</span> },
              { label: 'Source category', w: 150, render: (r) => <span style={{ fontSize: 12 }}>{r.c}</span> },
              { label: 'Allocated', w: 90, render: (r) => <b style={{ fontSize: 12 }}>{r.a}</b> },
              { label: 'State', w: 90, render: (r) => <Pill tone={r.s}>{r.st}</Pill> },
              { label: 'Date', w: 60, render: (r) => <span style={{ fontSize: 12 }}>{r.d}</span> },
            ]}
          />
        </Card>
      ) : null}
      {tab !== 'Earnings' ? (
        <Card title="Donation records" subtitle="Customer donations are separate from profit allocation and go to the chosen school or campaign" pad={0} sx={{ overflow: 'hidden' }}>
          <DataTable
            minWidth={980}
            rows={DON}
            columns={[
              { label: 'Donor', render: (r) => <Person initials={r.i} tone={r.t} name={r.n} size={36} /> },
              { label: 'Amount', w: 90, render: (r) => <b style={{ fontSize: 12 }}>{r.a}</b> },
              { label: 'School / campaign', w: 190, render: (r) => <span style={{ fontSize: 12 }}>{r.w}</span> },
              { label: 'Payment', w: 90, render: (r) => <Pill tone={r.pT}>{r.pay}</Pill> },
              { label: 'Receipt', w: 90, render: (r) => <Pill tone={r.rT}>{r.rec}</Pill> },
              { label: 'Message', w: 170, render: (r) => <span style={{ fontSize: 12 }}>{r.m}</span> },
              { label: 'Date', w: 60, render: (r) => <span style={{ fontSize: 12 }}>{r.d}</span> },
            ]}
          />
        </Card>
      ) : null}
      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Donation allocation is Phase 2. Fundraising campaigns and campaign donations are Phase 3 and keep their own screens.</Typography>
    </Stack>
  );
}

/* ───────────── Payout requests & detail ───────────── */

const REQS: { id: string; i: string; t: AvatarTone; n: string; req: string; bal: string; bank: string; on: string; paid: string; st: string; s: Tone }[] = [
  { id: 'PO-3318', i: 'GP', t: 'green', n: 'Greenfield Primary', req: 'AUD 3,420.00', bal: 'AUD 6,420.00', bank: 'Bank ••••4821', on: '10 Oct', paid: '—', st: 'Under review', s: 'blue' },
  { id: 'PO-3317', i: 'SM', t: 'blue', n: 'St. Mary’s Primary', req: 'AUD 2,180.00', bal: 'AUD 2,180.00', bank: 'Bank ••••1190', on: '9 Oct', paid: '—', st: 'Pending', s: 'amber' },
  { id: 'PO-3312', i: 'RP', t: 'amber', n: 'Riverside Primary', req: 'AUD 1,430.00', bal: 'AUD 1,430.00', bank: 'Bank ••••7733', on: '7 Oct', paid: '—', st: 'Processing', s: 'purple' },
  { id: 'PO-3309', i: 'EP', t: 'purple', n: 'Eastwood Primary', req: 'AUD 980.00', bal: 'AUD 1,500.00', bank: 'Bank ••••9004', on: '3 Oct', paid: '8 Oct', st: 'Paid', s: 'green' },
  { id: 'PO-3305', i: 'NP', t: 'red', n: 'Northside Primary', req: 'AUD 540.00', bal: 'AUD 540.00', bank: 'Bank ••••5502', on: '1 Oct', paid: '—', st: 'On hold', s: 'grey' },
  { id: 'PO-3301', i: 'PP', t: 'red', n: 'Parkside Primary', req: 'AUD 6,000.00', bal: 'AUD 1,220.00', bank: 'Bank ••••0914', on: '30 Sep', paid: '—', st: 'Rejected', s: 'red' },
];

export function PayoutRequests() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All 24');
  return (
    <Stack gap={3}>
      <TopBar title="Payout requests" helper="Seven statuses from request to payment · amounts in AUD" extra={<Btn icon={<FileDownloadOutlined />}>Export</Btn>} />
      <RelatedLinks links={[{ label: 'Payout history', to: '/finance' }, { label: 'Earnings & donations', to: '/finance/earnings' }]} />
      <Toolbar left={<PillTabs tabs={['All 24', 'Pending 5', 'Under review 4', 'Approved 3', 'Processing 2', 'Paid 8', 'On hold 1', 'Rejected 1']} value={tab} onChange={setTab} />} right={<SearchField placeholder="School or reference…" width={220} />} />
      <DataTable
        minWidth={1000}
        rows={REQS.filter((r) => tab === 'All 24' || tab.startsWith(r.st))}
        onRow={(r) => navigate(`/finance/requests/${r.id}`)}
        columns={[
          { label: 'School', render: (r) => <Person initials={r.i} tone={r.t} name={r.n} sub={r.id} size={40} /> },
          { label: 'Requested', w: 110, render: (r) => <b style={{ fontSize: 12 }}>{r.req}</b> },
          { label: 'Available balance', w: 120, render: (r) => <span style={{ fontSize: 12 }}>{r.bal}</span> },
          { label: 'Method', w: 110, render: (r) => <span style={{ fontSize: 12 }}>{r.bank}</span> },
          { label: 'Requested on', w: 90, render: (r) => <span style={{ fontSize: 12 }}>{r.on}</span> },
          { label: 'Paid on', w: 70, render: (r) => <span style={{ fontSize: 12 }}>{r.paid}</span> },
          { label: 'Status', w: 120, render: (r) => <Pill tone={r.s}>{r.st}</Pill> },
        ]}
        rowActions
        footer={<Pager text="Showing 6 of 24 payout requests" pages={['1', '2', '3']} />}
      />
    </Stack>
  );
}

const FLOW = ['Pending', 'Under review', 'Approved', 'Processing', 'Paid'];

export function PayoutDetail() {
  const { id } = useParams();
  const [step, setStep] = useState(1);
  return (
    <Stack gap={3}>
      <TopBar title={`Payout ${id ?? 'PO-3318'}`} helper="Greenfield Primary · requested 10 Oct 2026" extra={<Pill tone="blue">{FLOW[step]}</Pill>} />
      <Grid cols={{ xs: '1fr', lg: '1.4fr 1fr' }} gap={3.5}>
        <Stack gap={3.5}>
          <Card title="Requested amount">
            <Typography sx={{ fontSize: 34, fontWeight: 600 }}>AUD 3,420.00</Typography>
            <KV rows={[['Available balance', 'AUD 6,420.00'], ['Pending earnings (not payable yet)', 'AUD 3,180.00'], ['Balance after this payout', 'AUD 3,000.00'], ['Method', 'Bank transfer'], ['Account', 'Greenfield Primary P&C · •••• 4821'], ['Requested', '10 Oct 2026'], ['Paid', '—']]} />
          </Card>
          <Card title="Status flow" subtitle="Also available: On hold · Rejected (reason required)">
            <Box sx={{ display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
              {FLOW.map((f, i) => (
                <Box key={f} sx={{ display: 'flex', alignItems: 'center', flex: i < FLOW.length - 1 ? 1 : 'none', minWidth: i < FLOW.length - 1 ? 90 : 0 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ width: 30, height: 30, mx: 'auto', borderRadius: '15px', bgcolor: i <= step ? forest[700] : '#E3EAE3', display: 'grid', placeItems: 'center', '& svg': { color: '#fff', fontSize: 17 } }}>{i < step ? <Check /> : <span style={{ fontSize: 11, color: i <= step ? '#fff' : brand.placeholder, fontWeight: 600 }}>{i + 1}</span>}</Box>
                    <Typography sx={{ fontSize: 11, mt: 0.5, fontWeight: i === step ? 600 : 400 }}>{f}</Typography>
                  </Box>
                  {i < FLOW.length - 1 ? <Box sx={{ flex: 1, height: 3, mx: 1, mb: 2, borderRadius: 2, bgcolor: i < step ? forest[700] : '#E3EAE3' }} /> : null}
                </Box>
              ))}
            </Box>
          </Card>
        </Stack>
        <Card title="Decision">
          <Field label="Upload payment evidence (required to mark Paid)">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2.5, borderRadius: '14px', border: '1.5px dashed rgba(11,46,31,0.2)', color: brand.slate, fontSize: 13 }}><UploadFileOutlined /> Drop a file or click to upload</Box>
          </Field>
          <Field label="Internal note"><TextArea placeholder="Add a note for finance…" rows={3} /></Field>
          <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', borderTop: hair, pt: 2 }}>
            <Btn sx={{ color: '#B3261E' }}>Reject…</Btn>
            <Btn>Put on hold</Btn>
            <Btn kind="primary" icon={<Check />} onClick={() => setStep(Math.min(step + 1, 4))}>Approve</Btn>
          </Box>
        </Card>
      </Grid>
    </Stack>
  );
}

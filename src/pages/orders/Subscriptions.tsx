import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import AutorenewOutlined from '@mui/icons-material/AutorenewOutlined';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import AddIcon from '@mui/icons-material/Add';
import Check from '@mui/icons-material/Check';
import EditOutlined from '@mui/icons-material/EditOutlined';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { useFeedback } from '../../components/popups';
import TopBar from '../../layout/TopBar';
import { Btn, Card, DataTable, Field, Grid, Input, Modal, Person, Pill, RoundBtn, SearchField, Select, Stack, StatRow, SwitchRow, type AvatarTone, type Tone } from '../../components/kit';
import { brand } from '../../theme';

const PLANS = [
  { name: 'Family Essentials', tag: 'Recommended', price: 'AUD 29', subs: '4,812 subscribers', feats: ['12× toilet paper rolls', '2× refillable shampoo', 'Doorstep or hero pickup', 'Saves ~3 kg plastic / month'], dark: true },
  { name: 'Business Essentials', tag: 'CSR dashboard', price: 'AUD 99', subs: '612 subscribers', feats: ['48× toilet paper rolls', 'Bulk monthly delivery', 'Account manager', 'Eco badges & CSR report'] },
  { name: 'Custom Pack', tag: 'Customisable', price: 'from AUD 19', subs: '1,790 subscribers', feats: ['Pick your own items', 'Monthly or fortnightly', 'Teaches kids eco habits', 'Reward chart included'] },
];
const SUBS: { id: number; i: string; t: AvatarTone; n: string; w: string; plan: string; next: string; del: string; amt: string; st: string; s: Tone }[] = [
  { id: 1, i: 'SS', t: 'green', n: 'Smith Family', w: 'Greenfield Primary', plan: 'Family Essentials', next: '12 Nov', del: 'Doorstep', amt: 'AUD 29.00', st: 'Active', s: 'green' },
  { id: 2, i: 'BC', t: 'amber', n: 'Brew & Co. Cafe', w: 'Business', plan: 'Business Essentials', next: '15 Nov', del: 'Bulk', amt: 'AUD 99.00', st: 'Active', s: 'green' },
  { id: 3, i: 'RP', t: 'blue', n: 'Patel Family', w: 'Parkside Primary', plan: 'Custom Pack', next: '—', del: 'Hero pickup', amt: 'AUD 34.00', st: 'Paused', s: 'amber' },
  { id: 4, i: 'LW', t: 'red', n: 'Walker Family', w: 'Riverside Primary', plan: 'Family Essentials', next: '—', del: 'Doorstep', amt: 'AUD 29.00', st: 'Payment failed', s: 'red' },
];

export default function Subscriptions() {
  const [params] = useSearchParams();
  const [modal, setModal] = useState(params.get('modal') === 'plan');
  const [q, setQ] = useState('');
  const { popup } = useFeedback();
  const rows = SUBS.filter((s) => !q || `${s.n} ${s.plan}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Stack gap={3}>
      <TopBar title="Subscriptions" helper="Plans, subscribers and recurring revenue." />
      <StatRow
        stats={[
          { label: 'Active subscriptions', value: '7,214', icon: <AutorenewOutlined />, color: 'green' },
          { label: 'Monthly recurring revenue', value: 'AUD 182.6k', icon: <AccountBalanceWalletOutlined />, color: 'blue' },
          { label: 'Monthly churn', value: '2.1%', icon: <ErrorOutline />, color: 'red' },
          { label: 'Paused', value: '312', icon: <Inventory2Outlined />, color: 'amber' },
        ]}
      />
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Plans</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>What customers can subscribe to</Typography>
        </Box>
        <Btn kind="primary" icon={<AddIcon />} onClick={() => setModal(true)}>New plan</Btn>
      </Box>
      <Grid cols={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={3.5}>
        {PLANS.map((p) => (
          <Box key={p.name} sx={{ position: 'relative', overflow: 'hidden', p: '28px', borderRadius: '28px', bgcolor: p.dark ? undefined : '#fff', background: p.dark ? 'linear-gradient(148deg,#145233 14.286%,#0B2E1F 85.714%)' : undefined, color: p.dark ? '#fff' : brand.ink, boxShadow: '0 8px 24px rgba(11,46,31,0.07)', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 600 }}>{p.name}</Typography>
              <Box sx={{ px: '10px', py: '3px', borderRadius: 999, fontSize: 10, fontWeight: 500, bgcolor: p.dark ? 'rgba(255,255,255,0.14)' : '#E3F1E7', color: p.dark ? '#fff' : '#1C6B3B' }}>{p.tag}</Box>
            </Box>
            <Box>
              <Typography component="span" sx={{ fontSize: 34, fontWeight: 600 }}>{p.price}</Typography>
              <Typography component="span" sx={{ fontSize: 13, opacity: 0.75, ml: 1 }}>/ month</Typography>
              <Typography sx={{ fontSize: 12, opacity: 0.7, mt: 0.75 }}>{p.subs}</Typography>
            </Box>
            <Box sx={{ borderTop: `1px solid ${p.dark ? 'rgba(255,255,255,0.12)' : 'rgba(11,46,31,0.07)'}`, pt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {p.feats.map((f) => (
                <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, fontSize: 13 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '10px', bgcolor: p.dark ? 'rgba(255,255,255,0.18)' : '#E3F1E7', display: 'grid', placeItems: 'center', '& svg': { fontSize: 13, color: p.dark ? '#fff' : '#1C6B3B' } }}><Check /></Box>
                  {f}
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1.25, mt: 'auto', pt: 1 }}>
              <Btn full icon={<EditOutlined />} onClick={() => popup('editPlan')} sx={p.dark ? { color: '#145233' } : undefined}>Edit plan</Btn>
              <Btn full onClick={() => popup('subscribers')} sx={p.dark ? { bgcolor: 'rgba(255,255,255,0.14)', color: '#fff', border: 0, '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } } : undefined}>Subscribers</Btn>
            </Box>
          </Box>
        ))}
      </Grid>
      <Card title="Subscribers" subtitle="Latest changes" right={<SearchField placeholder="Search subscribers…" value={q} onChange={setQ} width={240} />} pad={0} sx={{ overflow: 'hidden' }}>
        <DataTable
          minWidth={900}
          rows={rows}
          columns={[
            { label: 'Customer', render: (r) => <Person initials={r.i} tone={r.t} name={r.n} sub={r.w} /> },
            { label: 'Plan', w: 160, render: (r) => <span style={{ fontSize: 12 }}>{r.plan}</span> },
            { label: 'Next delivery', w: 110, render: (r) => <span style={{ fontSize: 12 }}>{r.next}</span> },
            { label: 'Delivery', w: 100, render: (r) => <span style={{ fontSize: 12 }}>{r.del}</span> },
            { label: 'Amount', w: 100, render: (r) => <b style={{ fontSize: 12 }}>{r.amt}</b> },
            { label: 'Status', w: 130, render: (r) => <Pill tone={r.s}>{r.st}</Pill> },
            { label: '', w: 44, render: () => <RoundBtn label="More actions"><MoreHoriz /></RoundBtn> },
          ]}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Create a new plan" subtitle="Set the price, billing cycle and what is included." icon={<AddIcon />} width={600} footer={<><Btn onClick={() => setModal(false)}>Cancel</Btn><Btn kind="primary" onClick={() => setModal(false)}>Create plan</Btn></>}>
        <Grid cols={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
          <Field label="Plan name"><Input placeholder="e.g. School Starter" /></Field>
          <Field label="Price (per month)"><Input placeholder="AUD 19.00" /></Field>
          <Field label="Billing cycle"><Select value="Monthly" options={['Monthly', 'Fortnightly', 'Quarterly']} /></Field>
          <Field label="Delivery"><Select value="Doorstep or pickup" options={['Doorstep or pickup', 'Doorstep', 'Hero pickup', 'Bulk']} /></Field>
        </Grid>
        <Field label="Included items">
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Pill tone="green" dot={false}>6× Toilet paper</Pill>
            <Pill tone="green" dot={false}>1× Shampoo refill</Pill>
            <Pill tone="green" dot={false}>Reward chart</Pill>
            <Btn small icon={<AddIcon />}>Add item</Btn>
          </Box>
        </Field>
        <SwitchRow title="Show this plan on the public website" on />
      </Modal>
    </Stack>
  );
}

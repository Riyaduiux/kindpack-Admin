import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import HourglassEmpty from '@mui/icons-material/HourglassEmpty';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Check from '@mui/icons-material/Check';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import TopBar from '../../layout/TopBar';
import { Btn, Card, Check as Tick, DataTable, Field, Grid, Input, KV, Modal, Pager, Person, Pill, PillTabs, Progress, SearchField, Select, Stack, StatRow, TextArea, type AvatarTone, type Tone, cardSx } from '../../components/kit';
import { brand } from '../../theme';

const PENDING = [
  { n: 'Playground Upgrade', who: 'Greenfield Primary · goal AUD 2,000', d: 'Replace worn play equipment for 300 students.', by: 'Mr. Reed · 2 days ago' },
  { n: 'Library Books Fund', who: 'St. Mary’s Primary · goal AUD 1,000', d: 'New eco-reading books for every classroom.', by: 'Ms. Hart · 1 day ago' },
];
const ALL: { id: number; i: string; t: AvatarTone; n: string; by: string; sc: string; goal: string; p: number; ends: string; st: string; s: Tone }[] = [
  { id: 1, i: 'EC', t: 'green', n: 'Eco Supplies Drive', by: 'Sarah M.', sc: 'Greenfield Primary', goal: 'AUD 5,000', p: 100, ends: '12 days', st: 'Completed', s: 'blue' },
  { id: 2, i: 'SE', t: 'amber', n: 'Sports Equipment', by: 'Mr. Lee', sc: 'Riverside Primary', goal: 'AUD 800', p: 72, ends: '40 days', st: 'Live', s: 'green' },
  { id: 3, i: 'SD', t: 'blue', n: 'Science Day Trip', by: 'Ms. Patel', sc: 'Parkside Primary', goal: 'AUD 600', p: 45, ends: '45 days', st: 'Live', s: 'green' },
  { id: 4, i: 'PU', t: 'purple', n: 'Playground Upgrade', by: 'Mr. Reed', sc: 'Greenfield Primary', goal: 'AUD 2,000', p: 0, ends: '—', st: 'Pending', s: 'amber' },
];

export function Campaigns() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All 112');
  const rows = ALL.filter((r) => tab === 'All 112' || tab.startsWith(r.st === 'Pending' ? 'Pending' : r.st));
  return (
    <Stack gap={3}>
      <TopBar title="Campaigns" helper="Review and moderate school fundraising campaigns." />
      <StatRow stats={[
        { label: 'Live campaigns', value: '38', icon: <FavoriteBorder />, color: 'green' },
        { label: 'Pending review', value: '4', icon: <HourglassEmpty />, color: 'amber' },
        { label: 'Raised this month', value: 'AUD 62.4k', icon: <AccountBalanceWalletOutlined />, color: 'blue' },
        { label: 'Avg. goal progress', value: '61%', icon: <TrendingUp />, color: 'red' },
      ]} />
      <PillTabs tabs={['All 112', 'Pending review 4', 'Live 38', 'Completed 64', 'Rejected 6']} value={tab} onChange={setTab} />
      <Grid cols={{ xs: '1fr', md: '1fr 1fr' }} gap={3.5}>
        {PENDING.map((c) => (
          <Box key={c.n} sx={{ ...cardSx, p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 18, fontWeight: 600 }}>{c.n}</Typography>
              <Pill tone="amber">Needs review</Pill>
            </Box>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{c.who}</Typography>
            <Typography sx={{ fontSize: 14 }}>{c.d}</Typography>
            <Typography sx={{ fontSize: 12, color: brand.placeholder }}>Submitted by {c.by}</Typography>
            <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', pt: 0.5 }}>
              <Btn kind="primary" small icon={<Check sx={{ fontSize: 16 }} />} onClick={() => navigate('/fundraising/C-0182?modal=approve')}>Approve</Btn>
              <Btn small onClick={() => navigate('/fundraising/C-0182?modal=changes')}>Request changes</Btn>
              <Btn small sx={{ color: '#B3261E' }} onClick={() => navigate('/fundraising/C-0182?modal=reject')}>Reject</Btn>
            </Box>
          </Box>
        ))}
      </Grid>
      <Card title="All campaigns" right={<SearchField placeholder="Search campaigns…" width={240} />} pad={0} sx={{ overflow: 'hidden' }}>
        <DataTable
          minWidth={860}
          rows={rows}
          onRow={() => navigate('/fundraising/C-0182')}
          columns={[
            { label: 'Campaign', render: (r) => <Person initials={r.i} tone={r.t} name={r.n} sub={`Submitted by ${r.by}`} size={40} /> },
            { label: 'School', w: 150, render: (r) => <span style={{ fontSize: 12 }}>{r.sc}</span> },
            { label: 'Goal', w: 90, render: (r) => <span style={{ fontSize: 12 }}>{r.goal}</span> },
            { label: 'Progress', w: 140, render: (r) => <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ flex: 1 }}><Progress value={r.p} height={6} /></Box><span style={{ fontSize: 11 }}>{r.p}%</span></Box> },
            { label: 'Ends', w: 70, render: (r) => <span style={{ fontSize: 12 }}>{r.ends}</span> },
            { label: 'Status', w: 100, render: (r) => <Pill tone={r.s}>{r.st}</Pill> },
          ]}
          footer={<Pager text={`Showing ${rows.length} of 112 campaigns`} pages={['1', '2', '3']} />}
        />
      </Card>
    </Stack>
  );
}

/* ───────────── Campaign review & details ───────────── */

export function CampaignDetail() {
  const [params] = useSearchParams();
  const [modal, setModal] = useState<string | null>(params.get('modal'));
  const [status, setStatus] = useState('Awaiting review');
  const close = () => setModal(null);
  const done = (s: string) => { setStatus(s); close(); };
  return (
    <Stack gap={3}>
      <TopBar
        title="Library Books Fund"
        helper="St. Mary’s Primary · campaign C-0182 · submitted 9 Oct 2026 · awaiting review"
        extra={status === 'Awaiting review' ? <><Btn onClick={() => setModal('changes')}>Request changes</Btn><Btn sx={{ color: '#B3261E' }} onClick={() => setModal('reject')}>Reject…</Btn><Btn kind="primary" icon={<Check />} onClick={() => setModal('approve')}>Approve campaign</Btn></> : <Pill tone={status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'amber'}>{status}</Pill>}
      />
      <Grid cols={{ xs: '1fr', lg: '1.5fr 1fr' }} gap={3.5}>
        <Stack gap={3.5}>
          <Card title="Campaign details" right={<Pill tone={status === 'Approved' ? 'green' : 'amber'}>{status}</Pill>} subtitle="Submitted by the school">
            <Field label="Campaign name"><Input value="Library Books Fund" readOnly /></Field>
            <Field label="Short description"><Input value="Help us fill our library with new books for every reader." readOnly /></Field>
            <Field label="Full description"><TextArea value="Our library has not been restocked in five years. Funds will buy about 400 new books, including picture books, early readers and non-fiction on sustainability." rows={3} /></Field>
            <Grid cols={{ xs: '1fr', sm: 'repeat(3, 1fr)' }} gap={2}>
              <Field label="Category"><Input value="Education" readOnly /></Field>
              <Field label="Purpose"><Input value="New library books" readOnly /></Field>
              <Field label="Target (AUD)"><Input value="AUD 1,000.00" readOnly /></Field>
              <Field label="Start date & time"><Input value="1 Nov 2026 · 9:00 am" readOnly /></Field>
              <Field label="End date & time"><Input value="30 Jan 2027 · 5:00 pm" readOnly /></Field>
              <Field label="School"><Input value="St. Mary’s Primary" readOnly /></Field>
            </Grid>
          </Card>
          <Card title="Contact & payout details" subtitle="Used for donations and the payout request">
            <Grid cols={{ xs: '1fr', sm: 'repeat(3, 1fr)' }} gap={2}>
              <Field label="Contact person"><Input value="Ms. Hart · School admin" readOnly /></Field>
              <Field label="Contact email"><Input value="m.hart@stmarys.edu" readOnly /></Field>
              <Field label="Contact phone"><Input value="+61 3 9000 1234" readOnly /></Field>
              <Field label="Account name"><Input value="St. Mary’s Primary P&C" readOnly /></Field>
              <Field label="Bank"><Input value="ANZ · BSB 012-345" readOnly /></Field>
              <Field label="Account"><Input value="•••• 4821" readOnly /></Field>
            </Grid>
          </Card>
        </Stack>
        <Stack gap={3.5}>
          <Card title="Campaign image">
            <Box sx={{ height: 150, borderRadius: '16px', bgcolor: '#EEF5EF', display: 'grid', placeItems: 'center', color: brand.slate }}><Box sx={{ textAlign: 'center' }}><ImageOutlined sx={{ fontSize: 36 }} /><Typography sx={{ fontSize: 12 }}>library-books.jpg</Typography></Box></Box>
          </Card>
          <Card title="Progress" subtitle="Metrics start once the campaign is live">
            <KV rows={[['Raised', 'AUD 0.00 of AUD 1,000.00'], ['Donors', '0'], ['Time left', 'Not live yet'], ['Approval status', status]]} />
          </Card>
          <Card title="Donations">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>No donations yet</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Donations appear here after the campaign goes live. The same view lists donor, amount, payment and receipt status.</Typography>
          </Card>
        </Stack>
      </Grid>

      <Modal open={modal === 'reject'} onClose={close} tone="red" title="Reject “Library Books Fund”?" subtitle="The school is notified with your reason and can resubmit a new version." icon={<Check />} footer={<><Btn onClick={close}>Cancel</Btn><Btn kind="danger" onClick={() => done('Rejected')}>Reject campaign</Btn></>}>
        <Field label="Reason" req><Select value="" options={['Select a reason', 'Content not suitable', 'Goal unrealistic', 'Missing payout details']} /></Field>
        <Field label="Message to the school" req hint="A reason and message are required to reject."><TextArea placeholder="Explain what is not acceptable…" rows={3} /></Field>
      </Modal>
      <Modal open={modal === 'changes'} onClose={close} tone="amber" title="Request changes" subtitle="Choose what the school should update. The campaign stays in review." icon={<Check />} footer={<><Btn onClick={close}>Cancel</Btn><Btn kind="primary" onClick={() => done('Changes requested')}>Send request</Btn></>}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {['Descriptions', 'Campaign image', 'Target amount', 'Dates', 'Payout details'].map((l, i) => <Tick key={l} label={l} on={i === 0 || i === 2} />)}
        </Box>
        <Field label="Message to the school" req><TextArea value="Please shorten the full description and confirm the 1,000 AUD target…" rows={3} /></Field>
      </Modal>
      <Modal open={modal === 'approve'} onClose={close} title="Approve “Library Books Fund”?" subtitle="The campaign goes live on its start date. The school and its families are notified." icon={<Check />} footer={<><Btn onClick={close}>Cancel</Btn><Btn kind="primary" onClick={() => done('Approved')}>Approve and schedule</Btn></>}>
        <KV rows={[['Target', 'AUD 1,000.00'], ['Goes live', '1 Nov 2026 · 9:00 am'], ['Ends', '30 Jan 2027 · 5:00 pm'], ['Payout to', 'St. Mary’s Primary P&C · •••• 4821']]} />
      </Modal>
    </Stack>
  );
}

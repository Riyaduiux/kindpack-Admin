import { useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import StarBorder from '@mui/icons-material/StarBorder';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import BlockOutlined from '@mui/icons-material/BlockOutlined';
import ListAltOutlined from '@mui/icons-material/ListAltOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import Check from '@mui/icons-material/Check';
import ArrowForward from '@mui/icons-material/ArrowForward';
import LaptopMacOutlined from '@mui/icons-material/LaptopMacOutlined';
import PhoneIphoneOutlined from '@mui/icons-material/PhoneIphoneOutlined';
import TopBar from '../../layout/TopBar';
import { Avatar, Btn, Card, DataTable, Field, FilterChip, Grid, hair, Input, KV, Pager, Person, Pill, PillTabs, RelatedLinks, SearchField, Segmented, Select, Stack, StatRow, SwitchRow, Toolbar, type AvatarTone, type Tone, cardSx } from '../../components/kit';
import { SubTabs } from '../../components/profile';
import { brand, forest } from '../../theme';

const cell = (t: ReactNode) => <span style={{ fontSize: 12 }}>{t}</span>;

/* ───────────── Support tickets ───────────── */

const TICKETS: { id: string; i: string; t: AvatarTone; subj: string; tag: string; from: string; pr: string; pT: Tone; as: string; up: string }[] = [
  { id: '#T-2041', i: 'GW', t: 'red', subj: 'Damaged item in order #KP-10479', tag: 'Refund request', from: 'Family', pr: 'Urgent', pT: 'red', as: 'Unassigned', up: '12 min' },
  { id: '#T-2040', i: 'RP', t: 'purple', subj: 'Cannot log in with OTP', tag: 'Account access', from: 'Kid', pr: 'High', pT: 'amber', as: 'Sam L.', up: '1 h' },
  { id: '#T-2039', i: 'JK', t: 'green', subj: 'Gate locked at stop 3', tag: 'Reported by hero', from: 'Hero', pr: 'High', pT: 'amber', as: 'Nina R.', up: '2 h' },
  { id: '#T-2038', i: 'BC', t: 'amber', subj: 'Invoice shows wrong ABN', tag: 'Billing', from: 'Business', pr: 'Normal', pT: 'blue', as: 'Sam L.', up: '5 h' },
  { id: '#T-2037', i: 'SM', t: 'blue', subj: 'How do I create a campaign?', tag: 'How-to', from: 'School', pr: 'Low', pT: 'grey', as: 'Nina R.', up: '1 d' },
];

export function Support() {
  const [tab, setTab] = useState('Open 8');
  const [sel, setSel] = useState(0);
  const [msgs, setMsgs] = useState<{ me: boolean; who: string; t: string; m: string }[]>([
    { me: false, who: 'Grace · 3:40 pm', t: '', m: 'Hi, one bottle in my last order arrived cracked and leaked on the other items. Can I get a refund?' },
    { me: true, who: 'You · 3:52 pm', t: '', m: 'Sorry about that, Grace. We are checking order #KP-10479 now and will confirm your refund shortly.' },
  ]);
  const [reply, setReply] = useState('');
  const navigate = useNavigate();
  const tk = TICKETS[sel];
  return (
    <Stack gap={3}>
      <TopBar title="Tickets" helper="Help families, schools, heroes and businesses." />
      <StatRow stats={[
        { label: 'Open tickets', value: '8', icon: <SupportAgentOutlined />, color: 'green' },
        { label: 'Avg. first response', value: '12 min', icon: <AccessTimeOutlined />, color: 'blue' },
        { label: 'Customer satisfaction', value: '4.8', icon: <StarBorder />, color: 'amber' },
        { label: 'Escalated', value: '2', icon: <ErrorOutline />, color: 'red' },
      ]} />
      <Toolbar left={<PillTabs tabs={['Open 8', 'Pending customer 5', 'Resolved 214', 'Escalated 2']} value={tab} onChange={setTab} />} right={<SearchField placeholder="Search tickets…" width={240} />} />
      <Grid cols={{ xs: '1fr', xl: '1.4fr 1fr' }} gap={3.5}>
        <Card title="Inbox" subtitle="Sorted by priority" pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable
            minWidth={780}
            rows={TICKETS}
            onRow={(_, i) => setSel(i)}
            columns={[
              { label: 'Ticket', render: (r) => <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Avatar initials={r.i} tone={r.t} size={36} /><Box sx={{ minWidth: 0 }}><Typography noWrap sx={{ fontSize: 13, fontWeight: 600 }}>{r.subj}</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{r.id} · {r.tag}</Typography></Box></Box> },
              { label: 'From', w: 80, render: (r) => cell(r.from) },
              { label: 'Priority', w: 80, render: (r) => <Pill tone={r.pT} dot={false}>{r.pr}</Pill> },
              { label: 'Assignee', w: 90, render: (r) => cell(r.as) },
              { label: 'Updated', w: 70, render: (r) => cell(r.up) },
            ]}
            footer={<Pager text="Showing 5 of 8 open tickets" pages={['1', '2', '3']} />}
          />
        </Card>
        <Card title={tk.subj} right={<Pill tone={tk.pT} dot={false}>{tk.pr}</Pill>} subtitle={`${tk.id} · ${tk.from} · ${tk.tag}`}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {msgs.map((m, i) => (
              <Box key={i} sx={{ alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '86%', p: '12px 16px', borderRadius: '16px', bgcolor: m.me ? forest[700] : '#F3F6F2', color: m.me ? '#fff' : brand.ink }}>
                <Typography sx={{ fontSize: 11, opacity: 0.7 }}>{m.who}</Typography>
                <Typography sx={{ fontSize: 13 }}>{m.m}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ p: '12px 14px', borderRadius: '14px', bgcolor: '#F6F8F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Box><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Linked order</Typography><Typography sx={{ fontSize: 13, fontWeight: 600 }}>#KP-10479 · AUD 18.00 · Delivered</Typography></Box>
            <Pill tone="green" dot={false}>Open</Pill>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box component="input" value={reply} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReply(e.target.value)} placeholder="Write a reply…" sx={{ flex: 1, height: 46, px: 2, borderRadius: '14px', border: '1px solid rgba(11,46,31,0.08)', bgcolor: brand.field, font: 'inherit', fontSize: 14, outline: 0 }} />
            <Btn kind="primary" icon={<SendOutlined />} onClick={() => { if (reply) { setMsgs([...msgs, { me: true, who: 'You · now', t: '', m: reply }]); setReply(''); } }}>Send</Btn>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}><Btn small>Assign</Btn><Btn small icon={<Check sx={{ fontSize: 16 }} />}>Resolve</Btn><Btn small endIcon={<ArrowForward sx={{ fontSize: 16 }} />} onClick={() => navigate('/orders/KP-10479')}>Open order</Btn></Box>
        </Card>
      </Grid>
    </Stack>
  );
}

/* ───────────── Settings ───────────── */

const NumField = ({ label, hint, v, unit }: { label: string; hint?: string; v: string; unit: string }) => (
  <Field label={label} hint={hint}><Input value={v} suffix={unit} /></Field>
);

export function Settings() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(params.get('tab') ?? 'Routing & rules');
  const [saved, setSaved] = useState(false);
  return (
    <Stack gap={3}>
      <TopBar title="Settings" helper={tab === 'Routing & rules' ? 'Routing, order, referral and reorder rules. Every threshold is configurable.' : 'Fees, security and platform preferences.'} extra={<><Btn>Discard</Btn><Btn kind="primary" onClick={() => setSaved(true)}>{saved ? 'Saved' : 'Save changes'}</Btn></>} />
      <RelatedLinks links={[{ label: 'Audit log', to: '/audit' }, { label: 'Roles & permissions', to: '/roles' }]} />
      <SubTabs tabs={['General', 'Payments & fees', 'Notifications', 'Integrations', 'Security', 'Routing & rules', 'Profit allocation']} value={tab} onChange={(t) => (t === 'Profit allocation' ? navigate('/finance/profit') : setTab(t))} />
      {tab === 'Routing & rules' ? (
        <Grid cols={{ xs: '1fr', xl: '1.4fr 1fr' }} gap={3.5}>
          <Stack gap={3.5}>
            <Card title="Routing thresholds" subtitle="Decide whether an order goes to a local Hero, the main centre or both">
              <Grid cols={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
                <NumField label="Local Hero maximum distance" hint="Customer further away goes to the main centre" v="5" unit="km" />
                <NumField label="Hero maximum open stops" hint="A Hero at this limit is not offered new orders" v="8" unit="stops" />
                <NumField label="Large order goes to main centre from" hint="School direct and bulk orders" v="25" unit="units" />
                <NumField label="Minimum Hero stock to fulfil an item" hint="A Hero with less than this is skipped for that item" v="1" unit="unit" />
              </Grid>
              <SwitchRow title="Hybrid fulfilment" sub="Split an order between Hero and main centre when stock is short" on />
            </Card>
            <Card title="Order rules" subtitle="Refunds follow existing order totals · no refund allocation policy is set here">
              <Grid cols={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
                <NumField label="Refund request window" hint="Days after delivery" v="14" unit="days" />
                <NumField label="Cancel unpaid orders after" v="24" unit="hours" />
              </Grid>
              <SwitchRow title="Delivery confirmation required" sub="Hero or customer confirms before the order closes" on />
            </Card>
          </Stack>
          <Stack gap={3.5}>
            <Card title="Referral rules" subtitle="Who can invite whom">
              <KV rows={[['School', 'Families · Heroes · Businesses'], ['Family', 'Family members · Businesses'], ['Family member', 'Businesses']]} />
            </Card>
            <Card title="Hero reorder rules" subtitle="Used for suggested reorder quantities · no AI forecasting">
              <Grid cols="1fr 1fr" gap={2}>
                <NumField label="Sales history window" v="14" unit="days" />
                <NumField label="Safety stock" hint="Added on top of expected sales" v="20" unit="%" />
              </Grid>
              <SwitchRow title="Admin approval required" sub="Heroes cannot raise their own stock" on />
            </Card>
            <Card title="Related settings" right={<Pill tone="amber" dot={false}>Awaiting agreement</Pill>}>
              {[['Profit allocation (School 50 · Hero 10 · Kids 5 · KindPack 35)', '/finance/profit'], ['ESG calculation inputs', '/esg/inputs'], ['Payout schedule', '/finance']].map(([t, to]) => <Box key={t} component="button" type="button" onClick={() => navigate(to)} sx={{ display: 'flex', alignItems: 'center', p: '12px 14px', borderRadius: '12px', border: hair, bgcolor: '#fff', font: 'inherit', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}><Box sx={{ flex: 1 }}>{t}</Box><ArrowForward sx={{ fontSize: 16, color: forest[700] }} /></Box>)}
            </Card>
          </Stack>
        </Grid>
      ) : (
        <Grid cols={{ xs: '1fr', xl: '1.4fr 1fr' }} gap={3.5}>
          <Stack gap={3.5}>
            <Card title="Profit allocation (configurable)" subtitle="Applied to new orders from today" right={<Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Last changed 02 Oct</Typography>}>
              <Grid cols={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
                <NumField label="School share of profit" v="50" unit="%" />
                <NumField label="Working Hero share of profit" v="10" unit="%" />
                <NumField label="KindPack share of profit" v="35" unit="%" />
                <NumField label="Kids share of profit" v="5" unit="%" />
              </Grid>
            </Card>
            <Card title="Platform" subtitle="Shown to customers and in emails">
              <Grid cols={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
                <Field label="Platform name"><Input value="Kind Pack" /></Field>
                <Field label="Support email"><Input value="support@kindpack.com" /></Field>
                <Field label="Time zone"><Select value="Australia/Melbourne" options={['Australia/Melbourne', 'Australia/Sydney']} /></Field>
                <Field label="Default language"><Select value="English" options={['English']} /></Field>
                <Field label="Default currency"><Select value="AUD – Australian dollar" options={['AUD – Australian dollar']} /></Field>
                <Field label="Payout schedule" chip="Awaiting agreement" chipTone="amber"><Select value="Manual" options={['Manual', 'Weekly', 'Fortnightly']} /></Field>
              </Grid>
            </Card>
          </Stack>
          <Stack gap={3.5}>
            <Card title="Security">
              <SwitchRow title="Require 2FA for admins" sub="Authenticator app or SMS" on />
              <Box sx={{ borderTop: hair }}><SwitchRow title="Session timeout" sub="Auto sign-out after 30 minutes" on /></Box>
              <Box sx={{ borderTop: hair }}><SwitchRow title="IP allow-list · awaiting agreement" sub="Only approved office networks" /></Box>
            </Card>
            <Card title="Notifications" subtitle="Who gets emailed">
              <KV rows={[['New hero application', 'Email operations team'], ['Refund requested', 'Email finance + support'], ['Low stock alert', 'Email warehouse admins'], ['Failed payout', 'Email finance team']]} />
            </Card>
          </Stack>
        </Grid>
      )}
    </Stack>
  );
}

/* ───────────── My account ───────────── */

export function Account() {
  const [theme, setTheme] = useState('Light');
  return (
    <Stack gap={3}>
      <TopBar title="My account" helper="Your profile, security and preferences." extra={<Btn kind="primary">Save changes</Btn>} />
      <Box sx={{ ...cardSx, p: 3, display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
        <Avatar initials="RA" tone="green" size={72} />
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 600 }}>Md Riyad</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Super admin · md.riyad@kindpack.com</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}><Pill>2FA enabled</Pill><Pill tone="grey" dot={false}>Joined Jan 2026</Pill></Box>
        </Box>
        <Btn>Change photo</Btn>
      </Box>
      <Grid cols={{ xs: '1fr', xl: '1.3fr 1fr' }} gap={3.5}>
        <Stack gap={3.5}>
          <Card title="Personal information" subtitle="Visible to other admins">
            <Grid cols={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
              <Field label="Full name"><Input value="Md Riyad" /></Field>
              <Field label="Work email"><Input value="md.riyad@kindpack.com" /></Field>
              <Field label="Phone"><Input value="+61 412 000 111" /></Field>
              <Field label="Role"><Input value="Super admin (managed in Roles)" readOnly /></Field>
            </Grid>
          </Card>
          <Card title="Password & security">
            <KV rows={[['Password', 'Last changed 41 days ago'], ['Two-factor authentication', 'Authenticator app · required for admins']]} />
            <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}><Btn small>Change password</Btn><Btn small>Sign out</Btn></Box>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>You will need to sign in again with 2FA</Typography>
          </Card>
        </Stack>
        <Stack gap={3.5}>
          <Card title="Preferences">
            <Field label="Theme"><Segmented options={['Light', 'Dark', 'System']} value={theme} onChange={setTheme} /></Field>
            <Field label="Language"><Select value="English" options={['English']} /></Field>
            <Field label="Time zone"><Select value="Australia/Melbourne" options={['Australia/Melbourne', 'Australia/Sydney']} /></Field>
          </Card>
          <Card title="Active sessions" subtitle="Where you are signed in" right={<Btn small>Sign out all others</Btn>}>
            {[[<LaptopMacOutlined key="a" />, 'MacBook Pro · Melbourne', 'Chrome · this device · now', 'This device'], [<PhoneIphoneOutlined key="b" />, 'iPhone 15 · Melbourne', 'Safari · 2 hours ago', 'Sign out']].map(([ic, n, s, a], k) => (
              <Box key={n as string} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: k ? 1.5 : 0, borderTop: k ? hair : 0 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: '#EEF5EF', display: 'grid', placeItems: 'center', '& svg': { color: forest[700] } }}>{ic}</Box>
                <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{n}</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{s}</Typography></Box>
                {k ? <Btn small>{a}</Btn> : <Pill dot={false}>{a}</Pill>}
              </Box>
            ))}
          </Card>
        </Stack>
      </Grid>
    </Stack>
  );
}

/* ───────────── Audit log ───────────── */

const EVENTS: { id: number; time: string; i: string; t: AvatarTone; n: string; role: string; act: string; tar: string; ip: string; res: string; r: Tone }[] = [
  { id: 1, time: '12 Oct · 15:52', i: 'SL', t: 'blue', n: 'Sam L.', role: 'Support', act: 'Replied to ticket', tar: '#T-2041', ip: '203.0.113.24', res: 'Success', r: 'green' },
  { id: 2, time: '12 Oct · 15:31', i: 'FO', t: 'amber', n: 'Farah O.', role: 'Finance', act: 'Approved payout batch', tar: '3 schools · AUD 12,110', ip: '203.0.113.57', res: 'Success', r: 'green' },
  { id: 3, time: '12 Oct · 14:08', i: 'DT', t: 'purple', n: 'Dev T.', role: 'Operations', act: 'Approved hero application', tar: 'James K. (Hero)', ip: '198.51.100.9', res: 'Success', r: 'green' },
  { id: 4, time: '12 Oct · 13:44', i: 'MK', t: 'green', n: 'Mia K.', role: 'Moderator', act: 'Rejected campaign', tar: 'Playground Upgrade', ip: '198.51.100.31', res: 'Needs review', r: 'amber' },
  { id: 5, time: '12 Oct · 11:20', i: 'RA', t: 'green', n: 'Md Riyad', role: 'Super admin', act: 'Changed role permissions', tar: 'Support · Issue refunds', ip: '203.0.113.5', res: 'Success', r: 'green' },
  { id: 6, time: '12 Oct · 09:02', i: '?', t: 'red', n: 'Unknown', role: 'Not an admin', act: 'Admin sign-in attempt', tar: 'admin@kindpack.com', ip: '192.0.2.88', res: 'Blocked', r: 'red' },
  { id: 7, time: '11 Oct · 17:45', i: 'NR', t: 'blue', n: 'Nina R.', role: 'Support', act: 'Suspended user', tar: 'Tom B. (Hero)', ip: '203.0.113.62', res: 'Success', r: 'green' },
];

export function AuditLog() {
  const [q, setQ] = useState('');
  const rows = EVENTS.filter((e) => !q || `${e.n} ${e.act} ${e.tar}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Stack gap={3}>
      <TopBar title="Audit log" helper="Every admin action, recorded and searchable." />
      <StatRow stats={[
        { label: 'Events (7 days)', value: '1,284', icon: <ListAltOutlined />, color: 'green' },
        { label: 'Active admins', value: '6', icon: <PeopleAltOutlined />, color: 'blue' },
        { label: 'Blocked sign-ins', value: '3', icon: <BlockOutlined />, color: 'red' },
        { label: '2FA coverage', value: '100%', icon: <ShieldOutlined />, color: 'amber' },
      ]} />
      <Toolbar left={<SearchField placeholder="Search by admin, action or target…" value={q} onChange={setQ} width={340} />} right={<><FilterChip label="" value="Last 7 days" /><FilterChip label="" value="All admins" /><FilterChip label="" value="All actions" /><Btn icon={<FileDownloadOutlined />}>Export log</Btn></>} />
      <DataTable
        minWidth={960}
        rows={rows}
        columns={[
          { label: 'Time', w: 120, render: (r) => cell(r.time) },
          { label: 'Admin', w: 190, render: (r) => <Person initials={r.i} tone={r.t} name={r.n} sub={r.role} size={36} /> },
          { label: 'Action', w: 200, render: (r) => <b style={{ fontSize: 12 }}>{r.act}</b> },
          { label: 'Target', render: (r) => cell(r.tar) },
          { label: 'IP address', w: 120, render: (r) => cell(r.ip) },
          { label: 'Result', w: 110, render: (r) => <Pill tone={r.r}>{r.res}</Pill> },
        ]}
        footer={<Pager text={`Showing 1–${rows.length} of 1,284 events`} pages={['1', '2', '3']} />}
      />
    </Stack>
  );
}


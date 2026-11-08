import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import OutlinedFlag from '@mui/icons-material/OutlinedFlag';
import SupportOutlined from '@mui/icons-material/SupportOutlined';
import EnergySavingsLeafOutlined from '@mui/icons-material/EnergySavingsLeafOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import TopBar from '../layout/TopBar';
import { Btn, Card, cardSx, DataTable, Field, Grid, hair, Input, PillTabs, Pill, Select, Stack, SwitchRow, TextArea, type Tone } from '../components/kit';
import { brand } from '../theme';

type N = { id: number; icon: ReactNode; tint: string; fg: string; title: string; sub: string; time: string; action?: string; group: 'Today' | 'Yesterday'; cat: string; unread: boolean };

const ITEMS: N[] = [
  { id: 1, icon: <TaskAltOutlined />, tint: '#FBEFD3', fg: '#8A5A00', title: 'New hero application', sub: 'James K. applied for Zone 4 · Greenfield', time: '10 min', action: 'Review', group: 'Today', cat: 'Approvals', unread: true },
  { id: 2, icon: <ErrorOutline />, tint: '#FBE3E0', fg: '#B3261E', title: 'Refund requested on #KP-10479', sub: 'Grace Walker · “Item damaged” · refund AUD 6.00', time: '32 min', action: 'Open', group: 'Today', cat: 'Orders', unread: true },
  { id: 3, icon: <AccountBalanceWalletOutlined />, tint: '#FBE3E0', fg: '#B3261E', title: 'Payout failed for Parkside Primary', sub: 'Bank transfer was rejected · retry needed', time: '1 h', action: 'Retry', group: 'Today', cat: 'System', unread: true },
  { id: 4, icon: <Inventory2Outlined />, tint: '#FBEFD3', fg: '#8A5A00', title: 'Low stock: All-purpose cleaner', sub: 'Only 12 units left at Greenfield Warehouse (reorder point 200)', time: '2 h', action: 'Restock', group: 'Today', cat: 'System', unread: true },
  { id: 5, icon: <OutlinedFlag />, tint: '#E0ECFB', fg: '#1D4F91', title: 'Campaign submitted for review', sub: 'Playground Upgrade · Greenfield Primary', time: 'Yesterday', action: 'Review', group: 'Yesterday', cat: 'Approvals', unread: false },
  { id: 6, icon: <SupportOutlined />, tint: '#E3F1E7', fg: '#1C6B3B', title: 'Ticket #T-2038 resolved', sub: 'Invoice shows wrong ABN · by Sam L.', time: 'Yesterday', group: 'Yesterday', cat: 'System', unread: false },
  { id: 7, icon: <EnergySavingsLeafOutlined />, tint: '#E3F1E7', fg: '#1C6B3B', title: 'Weekly impact report ready', sub: 'Illustrative CO₂ impact across all zones', time: 'Yesterday', action: 'Download', group: 'Yesterday', cat: 'System', unread: false },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All 24');
  const [read, setRead] = useState<Set<number>>(new Set());
  const isUnread = (n: N) => n.unread && !read.has(n.id);
  const unreadCount = ITEMS.filter(isUnread).length;
  const shown = ITEMS.filter((n) => tab === 'All 24' || (tab.startsWith('Unread') && isUnread(n)) || tab === n.cat);
  const groups = (['Today', 'Yesterday'] as const).map((g) => ({ g, rows: shown.filter((n) => n.group === g) })).filter((x) => x.rows.length);

  return (
    <Stack gap={3}>
      <TopBar title="Notifications" helper="Everything that needs your attention." extra={<Btn onClick={() => navigate('/notifications/templates')}>Templates</Btn>} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <PillTabs tabs={['All 24', `Unread ${unreadCount}`, 'Approvals', 'Orders', 'System']} value={tab.startsWith('Unread') ? `Unread ${unreadCount}` : tab} onChange={setTab} />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Btn icon={<CheckIcon />} onClick={() => setRead(new Set(ITEMS.map((n) => n.id)))}>Mark all as read</Btn>
          <Btn icon={<SettingsOutlined />}>Settings</Btn>
        </Box>
      </Box>
      <Grid cols={{ xs: '1fr', lg: '1.75fr 1fr' }} gap={3.5}>
        <Box sx={{ ...cardSx, overflow: 'hidden', alignSelf: 'start' }}>
          {groups.length === 0 ? <Typography sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>Nothing here — you’re all caught up.</Typography> : null}
          {groups.map(({ g, rows }) => (
            <Box key={g}>
              <Typography sx={{ px: 3, py: 2, fontSize: 11, fontWeight: 500, letterSpacing: 0.4, color: brand.placeholder, textTransform: 'uppercase', bgcolor: '#F8FAF7' }}>{g}</Typography>
              {rows.map((n, i) => (
                <Box key={n.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: '15px', borderTop: i ? hair : hair, bgcolor: isUnread(n) ? '#FBFCFA' : '#fff' }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: n.tint, color: n.fg, display: 'grid', placeItems: 'center', flexShrink: 0, '& svg': { fontSize: 22 } }}>{n.icon}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{n.title}</Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{n.sub}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: brand.placeholder, whiteSpace: 'nowrap' }}>{n.time}</Typography>
                  {n.action ? <Btn small onClick={() => setRead(new Set(read).add(n.id))}>{n.action}</Btn> : null}
                  <Box sx={{ width: 8, height: 8, borderRadius: '4px', bgcolor: isUnread(n) ? '#E5574B' : 'transparent', flexShrink: 0 }} />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <Stack gap={3.5}>
          <Card title="Notification settings" subtitle="Choose what reaches you">
            <SwitchRow title="Approvals & applications" sub="New heroes, schools, businesses" on />
            <Box sx={{ borderTop: hair }}><SwitchRow title="Refunds & payments" sub="Failed payments and refund requests" on /></Box>
            <Box sx={{ borderTop: hair }}><SwitchRow title="Inventory alerts" sub="Low stock and shipments" on /></Box>
            <Box sx={{ borderTop: hair }}><SwitchRow title="Weekly impact report" sub="Every Monday, 8 am" /></Box>
          </Card>
          <Card title="Delivery channels">
            <SwitchRow title="In-app" sub="Bell icon and this page" on />
            <Box sx={{ borderTop: hair }}><SwitchRow title="Email" sub="md.riyad@kindpack.com" on /></Box>
            <Box sx={{ borderTop: hair }}><SwitchRow title="SMS" sub="For urgent items only" /></Box>
          </Card>
        </Stack>
      </Grid>
    </Stack>
  );
}

/* ───────────── Templates & broadcasts ───────────── */

const TEMPLATES: { id: number; n: string; when: string; ch: string; ed: string; st: string; t: Tone }[] = [
  { id: 1, n: 'Registration approved', when: 'Admin approves a registration', ch: 'Email · In-app', ed: '10 Oct', st: 'Live', t: 'green' },
  { id: 2, n: 'Refund requested', when: 'Customer requests a refund', ch: 'Email', ed: '09 Oct', st: 'Live', t: 'green' },
  { id: 3, n: 'Low stock alert', when: 'Product falls below reorder point', ch: 'Email · SMS', ed: '08 Oct', st: 'Live', t: 'green' },
  { id: 4, n: 'Payout failed', when: 'A bank transfer is rejected', ch: 'Email', ed: '06 Oct', st: 'Live', t: 'green' },
  { id: 5, n: 'Campaign decision', when: 'Campaign approved, rejected or changes requested', ch: 'Email · In-app', ed: '03 Oct', st: 'Draft', t: 'amber' },
  { id: 6, n: 'Weekly impact report', when: 'Every Monday, 8 am · illustrative figures', ch: 'Email', ed: '01 Oct', st: 'Draft', t: 'amber' },
];

export function Templates() {
  const [tab, setTab] = useState('Email templates');
  const [sent, setSent] = useState(false);
  return (
    <Stack gap={3}>
      <TopBar title="Templates & broadcasts" helper="Operational messages only: email, SMS, in-app and announcements. No marketing campaigns." />
      <PillTabs tabs={['Email templates', 'SMS / alerts', 'In-app messages', 'Broadcasts']} value={tab} onChange={setTab} />
      <Grid cols={{ xs: '1fr', lg: '1.8fr 1fr' }} gap={3.5}>
        <Card title={tab === 'Broadcasts' ? 'Recent broadcasts' : tab} subtitle="Sent automatically when the event happens" pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable
            minWidth={640}
            rows={TEMPLATES}
            columns={[
              { label: 'Template', w: 190, render: (r) => <b style={{ fontSize: 13 }}>{r.n}</b> },
              { label: 'Sent when', render: (r) => <span style={{ fontSize: 12 }}>{r.when}</span> },
              { label: 'Channels', w: 110, render: (r) => <span style={{ fontSize: 12 }}>{r.ch}</span> },
              { label: 'Edited', w: 70, render: (r) => <span style={{ fontSize: 12 }}>{r.ed}</span> },
              { label: 'Status', w: 80, render: (r) => <Pill tone={r.t}>{r.st}</Pill> },
            ]}
          />
        </Card>
        <Card title="Announcement broadcast" subtitle="One message to a chosen group" sx={{ alignSelf: 'start' }}>
          <Field label="Audience"><Select value="All families at Greenfield Primary" options={['All families at Greenfield Primary', 'All heroes', 'All schools', 'All businesses']} /></Field>
          <Field label="Channel"><Select value="In-app message + email" options={['In-app message + email', 'In-app message', 'Email', 'SMS (urgent only)']} /></Field>
          <Field label="Message"><TextArea value="Your October impact summary is ready. Thank you for taking part." rows={3} /></Field>
          <Field label="Send"><Select value="Now" options={['Now', 'Schedule for later']} /></Field>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Btn full>Preview</Btn>
            <Btn kind="primary" full icon={<SendOutlined />} onClick={() => setSent(true)}>{sent ? 'Broadcast sent' : 'Send broadcast'}</Btn>
          </Box>
        </Card>
      </Grid>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '16px 20px', borderRadius: '20px', bgcolor: '#E0ECFB', color: '#1D4F91' }}>
        <InfoOutlined sx={{ fontSize: 20 }} />
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Messages follow the notification settings</Typography>
          <Typography sx={{ fontSize: 12 }}>Each person still controls their own channels in Notification settings. Urgent items use SMS only.</Typography>
        </Box>
      </Box>
    </Stack>
  );
}

export { Input };

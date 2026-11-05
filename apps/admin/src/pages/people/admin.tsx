import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Box, Checkbox, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import WarningAmber from '@mui/icons-material/WarningAmber';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import ShareOutlined from '@mui/icons-material/ShareOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import BlockOutlined from '@mui/icons-material/BlockOutlined';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import PageHeader from '../../components/PageHeader';
import TopBar from '../../layout/TopBar';
import { Avatar, Btn, Card, DataTable, Grid, hair, Pager, Person, Pill, PillTabs, RoundBtn, SearchField, Stack, StatRow, Tag, TextArea, Timeline, Toolbar, type AvatarTone, type Tone } from '../../components/kit';
import { DetailBar } from '../../components/profile';
import { brand, forest, gradients, shadows, statusColors } from '../../theme';
import { useModals } from './modals';

/* ───────────── Roles & permissions ───────────── */

const ROLE_COLS = ['Super admin', 'Operations', 'Finance', 'Support', 'Moderator', 'Big Hero'];
const PERMS: [string, string][] = [
  ['View users & profiles', '110110'],
  ['Suspend / ban users', '110010'],
  ['Approve heroes, schools & businesses', '110010'],
  ['View & manage orders', '110101'],
  ['Issue refunds', '101100'],
  ['Run payout batches', '101000'],
  ['Edit profit allocation', '101000'],
  ['Manage tasks & rewards', '110010'],
  ['Manage roles & admins', '100000'],
  ['View audit log', '111000'],
  ['Choose Hero or Big Hero for dispatch', '110001'],
  ['Manage Big Hero stock & shipments', '110001'],
  ['Approve Hero stock requests', '110001'],
  ['Edit product costs & ESG values', '101000'],
  ['Edit routing & order rules', '110000'],
];
const TEAM: { i: string; t: AvatarTone; n: string; e: string; r: string; rt: Tone }[] = [
  { i: 'RA', t: 'green', n: 'Md Riyad', e: 'mdriyad@kindpack.com', r: 'Super admin', rt: 'green' },
  { i: 'SL', t: 'amber', n: 'Sam L.', e: 'saml@kindpack.com', r: 'Support', rt: 'blue' },
  { i: 'NR', t: 'blue', n: 'Nina R.', e: 'ninar@kindpack.com', r: 'Support', rt: 'blue' },
  { i: 'FO', t: 'red', n: 'Farah O.', e: 'faraho@kindpack.com', r: 'Finance', rt: 'amber' },
  { i: 'DT', t: 'purple', n: 'Dev T.', e: 'devt@kindpack.com', r: 'Operations', rt: 'purple' },
  { i: 'MK', t: 'green', n: 'Mia K.', e: 'miak@kindpack.com', r: 'Moderator', rt: 'grey' },
];

const Tick = ({ on }: { on: boolean }) =>
  on ? (
    <Box sx={{ width: 22, height: 22, borderRadius: '11px', bgcolor: '#DCEFE0', color: forest[700], display: 'grid', placeItems: 'center', mx: 'auto' }}>
      <Check sx={{ fontSize: 14 }} />
    </Box>
  ) : (
    <Typography sx={{ textAlign: 'center', color: '#C5CCC6' }}>—</Typography>
  );

export function Roles() {
  const [tab, setTab] = useState('Permission matrix');
  return (
    <Stack gap={3}>
      <TopBar title="Roles & permissions" helper="Control what each admin can see and do." />
      <Toolbar
        left={<PillTabs tabs={['Permission matrix', 'Admin team']} value={tab} onChange={setTab} />}
        right={
          <>
            <Btn icon={<AddIcon />}>New role</Btn>
            <Btn kind="primary" icon={<AddIcon />}>Invite admin</Btn>
          </>
        }
      />
      <Grid cols="1.79fr 1fr">
        <Box sx={{ display: tab === 'Admin team' ? { xs: 'none', lg: 'block' } : 'block' }}>
          <Card title="Permission matrix" subtitle="What each admin role can do · draft, awaiting confirmation" pad={0} sx={{ overflow: 'hidden' }}>
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 760 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr repeat(6, 92px)', alignItems: 'center', px: 3, py: 2, bgcolor: '#F8FAF7', borderTop: hair }}>
                  <Typography sx={{ fontSize: 11, color: brand.placeholder, fontWeight: 500 }}>PERMISSION</Typography>
                  {ROLE_COLS.map((c) => (
                    <Typography key={c} sx={{ fontSize: 11, color: brand.placeholder, fontWeight: 500, textAlign: 'center' }}>{c.toUpperCase()}</Typography>
                  ))}
                </Box>
                {PERMS.map(([p, bits]) => (
                  <Box key={p} sx={{ display: 'grid', gridTemplateColumns: '1fr repeat(6, 92px)', alignItems: 'center', px: 3, height: 41.3, borderTop: hair }}>
                    <Typography sx={{ fontSize: 13 }}>{p}</Typography>
                    {bits.split('').map((b, i) => (
                      <Tick key={i} on={b === '1'} />
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
        </Box>
        <Card title="Admin team" subtitle="6 members" right={<Pill>2FA on for all</Pill>}>
          {TEAM.map((m, i) => (
            <Box key={m.n} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, borderTop: i ? hair : 0 }}>
              <Avatar initials={m.i} tone={m.t} size={44} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{m.n}</Typography>
                <Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>{m.e}</Typography>
              </Box>
              <Tag tone={m.rt}>{m.r}</Tag>
            </Box>
          ))}
        </Card>
      </Grid>
    </Stack>
  );
}

/* ───────────── Approvals queue ───────────── */

interface QRow { ini: string; tone: AvatarTone; name: string; sub: string; c1: string; c2: string; p: [string, Tone]; w: [string, Tone] }
interface Queue {
  helper: string;
  stats: { v: string; l: string; i: React.ReactNode; c: 'amber' | 'blue' | 'green' | 'red' }[];
  title: string;
  pick: string;
  cols: [string, string, string, string, string];
  rows: QRow[];
  total: string;
  panelSub: (r: QRow) => string;
  checklistTitle: string;
  checks: [string, boolean][];
}

const bagStat = (v: string): Queue['stats'][number] => ({ v, l: 'Business accounts', i: <ShoppingBagOutlined />, c: 'green' });
const overdue: Queue['stats'][number] = { v: '4', l: 'Overdue (> 48 h)', i: <WarningAmber />, c: 'red' };
const heroChecks: [string, boolean][] = [['Identity verified', true], ['Driver licence valid', true], ['Police clearance · optional, awaiting agreement', false], ['Vehicle photo approved', true], ['Bank details confirmed', true]];

const QUEUES: Record<string, Queue> = {
  'Family registrations': {
    helper: '23 items waiting · family registrations are approved by the linked school or admin, members by the family or admin',
    stats: [{ v: '2', l: 'Family registrations', i: <LocalShippingOutlined />, c: 'amber' }, { v: '1', l: 'Family members', i: <FlagOutlined />, c: 'blue' }, bagStat('4'), overdue],
    title: 'Family registrations', pick: 'Select a family to review',
    cols: ['Family / member', 'Linked school', 'Applied', 'Approver', 'Waiting'],
    rows: [
      { ini: 'SF', tone: 'green', name: 'Smith Family', sub: '4 members · via Greenfield Primary', c1: 'Greenfield Primary', c2: '10 Oct', p: ['School', 'green'], w: ['4 days', 'red'] },
      { ini: 'WF', tone: 'amber', name: 'Walker Family', sub: '3 members · via Smith Family', c1: 'Riverside Primary', c2: '11 Oct', p: ['School', 'amber'], w: ['3 days', 'red'] },
      { ini: 'ES', tone: 'blue', name: 'Ella Smith', sub: 'Member of Smith Family', c1: 'Greenfield Primary', c2: '11 Oct', p: ['Family', 'amber'], w: ['2 days', 'amber'] },
    ],
    total: 'Showing 3 of 3 applications', panelSub: (r) => `Family registration · linked to ${r.c1}`,
    checklistTitle: 'Approval checklist',
    checks: [['Parent identity confirmed', true], ['Linked school confirmed: Greenfield Primary', true], ['Approver rule: school or admin; members: family or admin', false], ['Referral link valid and unused', true], ['Members listed: 4 (1 child, 3 adults)', true]],
  },
  'Family members': {
    helper: '23 items waiting · members are approved by the family or admin',
    stats: [{ v: '2', l: 'Family registrations', i: <LocalShippingOutlined />, c: 'amber' }, { v: '1', l: 'Family members', i: <FlagOutlined />, c: 'blue' }, bagStat('4'), overdue],
    title: 'Family members', pick: 'Select a member to review',
    cols: ['Member', 'Family', 'Applied', 'Approver', 'Waiting'],
    rows: [{ ini: 'LS', tone: 'red', name: 'Liam Smith', sub: 'Child · age 7', c1: 'Smith Family', c2: '10 Oct', p: ['Family', 'amber'], w: ['2 days', 'amber'] }],
    total: 'Showing 1 of 1 applications', panelSub: () => 'Family member · child, age 7',
    checklistTitle: 'Approval checklist',
    checks: [['Added by a registered parent', true], ['Age confirmed (7)', true], ['Approver rule: family or admin', false]],
  },
  'Hero applications': {
    helper: '23 items waiting · oldest first · SLA 48 hours',
    stats: [{ v: '6', l: 'Hero applications', i: <LocalShippingOutlined />, c: 'amber' }, { v: '6', l: 'School verifications', i: <FlagOutlined />, c: 'blue' }, bagStat('4'), overdue],
    title: 'Hero applications', pick: 'Select an applicant to review',
    cols: ['Applicant', 'Zone', 'Applied', 'Documents', 'Waiting'],
    rows: [
      { ini: 'MA', tone: 'green', name: 'Maya A.', sub: 'Cargo van', c1: 'Zone 1 · Harbour', c2: '24 Sep', p: ['Complete', 'green'], w: ['4 days', 'red'] },
      { ini: 'RP', tone: 'amber', name: 'Ravi P.', sub: 'Bicycle', c1: 'Zone 3 · Parkside', c2: '25 Sep', p: ['2 missing', 'amber'], w: ['3 days', 'red'] },
      { ini: 'JK', tone: 'blue', name: 'James K.', sub: 'E-cargo bike', c1: 'Zone 4 · Greenfield', c2: '28 Sep', p: ['1 to review', 'amber'], w: ['2 days', 'amber'] },
      { ini: 'LC', tone: 'red', name: 'Lena C.', sub: 'E-cargo bike', c1: 'Zone 4 · Greenfield', c2: '29 Sep', p: ['Complete', 'green'], w: ['1 day', 'amber'] },
      { ini: 'OD', tone: 'purple', name: 'Omar D.', sub: 'Scooter', c1: 'Zone 2 · Riverside', c2: '30 Sep', p: ['Complete', 'green'], w: ['12 h', 'green'] },
      { ini: 'KN', tone: 'green', name: 'Kim N.', sub: 'Bicycle', c1: 'Zone 5 · Hillview', c2: '01 Oct', p: ['1 missing', 'amber'], w: ['6 h', 'green'] },
    ],
    total: 'Showing 6 of 9 applications', panelSub: (r) => `Hero · ${r.c1.split(' · ')[0]} · ${r.sub}`,
    checklistTitle: 'Verification checklist', checks: heroChecks,
  },
  'School verification': {
    helper: '23 items waiting · oldest first · SLA 48 hours',
    stats: [{ v: '6', l: 'Hero applications', i: <LocalShippingOutlined />, c: 'amber' }, { v: '6', l: 'School verifications', i: <FlagOutlined />, c: 'blue' }, bagStat('4'), overdue],
    title: 'School verification', pick: 'Select a school to review',
    cols: ['School', 'Suburb', 'Applied', 'Documents', 'Waiting'],
    rows: [
      { ini: 'PP', tone: 'blue', name: 'Parkside Primary', sub: 'Principal: Mr. Lee', c1: 'Parkside', c2: '26 Sep', p: ['Complete', 'green'], w: ['3 days', 'red'] },
      { ini: 'RP', tone: 'green', name: 'Riverside Primary', sub: 'Principal: Ms. Cole', c1: 'Riverside', c2: '28 Sep', p: ['1 missing', 'amber'], w: ['2 days', 'amber'] },
    ],
    total: 'Showing 2 of 6 schools', panelSub: (r) => `School · ${r.c1}`,
    checklistTitle: 'Verification checklist', checks: [['ABN verified', true], ['Principal contact confirmed', true], ['Bank account for payouts', false], ['Registered with state education dept.', true]],
  },
  'Business accounts': {
    helper: '23 items waiting · oldest first · SLA 48 hours',
    stats: [{ v: '6', l: 'Hero applications', i: <LocalShippingOutlined />, c: 'amber' }, { v: '6', l: 'School verifications', i: <FlagOutlined />, c: 'blue' }, bagStat('4'), overdue],
    title: 'Business accounts', pick: 'Select a business to review',
    cols: ['Business', 'Requested by', 'Applied', 'Approver', 'Waiting'],
    rows: [
      { ini: 'BC', tone: 'purple', name: 'Brew & Co. Cafe', sub: 'Cafe · 3 team members', c1: 'Greenfield Primary', c2: '30 Sep', p: ['Referrer', 'amber'], w: ['2 days', 'amber'] },
      { ini: 'GG', tone: 'green', name: 'Green Grocer', sub: 'Retail', c1: 'Sarah Smith', c2: '01 Oct', p: ['Referrer', 'amber'], w: ['1 day', 'amber'] },
    ],
    total: 'Showing 2 of 4 businesses', panelSub: () => 'Business account',
    checklistTitle: 'Approval checklist', checks: [['ABN verified', true], ['Billing email confirmed', true], ['Approval route confirmed with the business', false]],
  },
  Campaigns: {
    helper: '23 items waiting · oldest first · SLA 48 hours',
    stats: [{ v: '6', l: 'Hero applications', i: <LocalShippingOutlined />, c: 'amber' }, { v: '6', l: 'School verifications', i: <FlagOutlined />, c: 'blue' }, bagStat('4'), overdue],
    title: 'Campaigns', pick: 'Select a campaign to review',
    cols: ['Campaign', 'School', 'Goal', 'Documents', 'Waiting'],
    rows: [{ ini: 'LM', tone: 'red', name: 'Library Books Fund', sub: 'Books for Year 3', c1: 'St. Mary’s Primary', c2: 'AUD 1,000', p: ['Complete', 'green'], w: ['2 days', 'amber'] }],
    total: 'Showing 1 of 3 campaigns', panelSub: (r) => `Campaign · ${r.c2}`,
    checklistTitle: 'Review checklist', checks: [['Goal is reasonable', true], ['School verified', true], ['Description reviewed', false]],
  },
  'Payout holds': {
    helper: '23 items waiting · oldest first · SLA 48 hours',
    stats: [{ v: '6', l: 'Hero applications', i: <LocalShippingOutlined />, c: 'amber' }, { v: '6', l: 'School verifications', i: <FlagOutlined />, c: 'blue' }, bagStat('4'), overdue],
    title: 'Payout holds', pick: 'Select a hold to review',
    cols: ['Payee', 'Reason', 'Amount', 'Status', 'Waiting'],
    rows: [{ ini: 'TB', tone: 'blue', name: 'Tom B.', sub: 'Hero', c1: 'Account suspended', c2: 'AUD 212.00', p: ['On hold', 'red'], w: ['5 days', 'red'] }],
    total: 'Showing 1 of 1 holds', panelSub: (r) => `Payout hold · ${r.c2}`,
    checklistTitle: 'Release checklist', checks: [['Account reinstated', false], ['Bank details verified', true]],
  },
};
const QUEUE_TABS: [string, number][] = [['Family registrations', 2], ['Family members', 1], ['Hero applications', 6], ['School verification', 6], ['Business accounts', 4], ['Campaigns', 3], ['Payout holds', 1]];

export function Approvals({ initial = 'Hero applications' }: { initial?: string }) {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(initial);
  const m = useModals(params.get('modal') === 'reject' ? 'reject' : null);
  const q = QUEUES[tab];
  const [selIdx, setSelIdx] = useState<Record<string, number>>({ 'Hero applications': 2, 'Family registrations': 2 });
  const si = Math.min(selIdx[tab] ?? 0, q.rows.length - 1);
  const sel = q.rows[si];
  const [checks, setChecks] = useState<Record<string, boolean[]>>({});
  const cur = checks[tab] ?? q.checks.map((c) => c[1]);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  return (
    <Stack gap={3}>
      <TopBar title="Approvals" helper={q.helper} />
      <Box sx={{ mt: -1.5 }}>
        <StatRow stats={q.stats.map((s) => ({ label: s.l, value: s.v, icon: s.i, color: s.c }))} />
      </Box>
      <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
        {QUEUE_TABS.map(([t, n]) => {
          const on = t === tab;
          return (
            <Box key={t} component="button" type="button" onClick={() => setTab(t)} sx={{ height: 40, px: '18px', borderRadius: 999, border: on ? 0 : '1px solid rgba(11,46,31,0.08)', font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', bgcolor: on ? undefined : '#fff', background: on ? 'linear-gradient(148deg,#145233,#0E3B26)' : undefined, color: on ? '#fff' : brand.ink, boxShadow: on ? shadows.card : 'none' }}>
              {t} <Box component="span" sx={{ ml: 0.5 }}>{n}</Box>
            </Box>
          );
        })}
      </Box>
      <Grid cols="1.79fr 1fr">
        <Card title={q.title} subtitle={q.pick} right={<Btn kind="primary" small icon={<Check />} disabled={picked.size === 0 && false}>Approve selected</Btn>} pad={0} sx={{ overflow: 'hidden' }}>
          <DataTable
            selectable
            minWidth={680}
            rows={q.rows.map((r, i) => ({ ...r, id: i }))}
            selected={picked.size ? new Set([...picked].map(Number)) : new Set([si])}
            onSelect={(s) => setPicked(new Set([...s].map(String)))}
            onRow={(_, i) => setSelIdx({ ...selIdx, [tab]: i })}
            columns={[
              { label: q.cols[0], render: (r) => <Person initials={r.ini} tone={r.tone} name={r.name} sub={r.sub} size={40} /> },
              { label: q.cols[1], w: 140, render: (r) => <Typography sx={{ fontSize: 13 }}>{r.c1}</Typography> },
              { label: q.cols[2], w: 80, render: (r) => <Typography sx={{ fontSize: 13 }}>{r.c2}</Typography> },
              { label: q.cols[3], w: 110, render: (r) => <Pill tone={r.p[1]}>{r.p[0]}</Pill> },
              { label: q.cols[4], w: 90, render: (r) => <Pill tone={r.w[1]}>{r.w[0]}</Pill> },
            ]}
            footer={<Pager text={q.total} pages={['1', '2', '3']} />}
          />
        </Card>
        <Box sx={{ bgcolor: '#fff', borderRadius: '24px', boxShadow: shadows.card, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, p: 2.5, background: gradients.hero }}>
            <Avatar initials={sel.ini} tone="amber" size={44} />
            <Box>
              <Typography sx={{ color: '#fff', fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}>{sel.name}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{q.panelSub(sel)}</Typography>
            </Box>
          </Box>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{q.checklistTitle}</Typography>
            {q.checks.map(([label], i) => (
              <Box key={label} component="label" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, fontSize: 13, cursor: 'pointer', color: cur[i] ? brand.ink : brand.slate }}>
                <Checkbox size="small" checked={cur[i]} onChange={() => setChecks({ ...checks, [tab]: cur.map((v, k) => (k === i ? !v : v)) })} sx={{ p: 0.25 }} />
                {label}
              </Box>
            ))}
            <Typography sx={{ fontSize: 13, fontWeight: 500, mt: 0.5 }}>Decision note (optional)</Typography>
            <TextArea placeholder="Add a note for the applicant…" rows={3} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.25 }}>
              <Btn icon={<Close />} onClick={m.reject} sx={{ color: '#C94A3C', borderColor: '#F3C9C3' }}>Reject</Btn>
              <Btn>Request info</Btn>
              <Btn kind="primary" icon={<Check />}>Approve</Btn>
            </Box>
          </Box>
        </Box>
      </Grid>
      {m.render}
    </Stack>
  );
}

export const FamilyApprovals = () => <Approvals initial="Family registrations" />;

/* ───────────── Referrals ───────────── */

const LINKS: { id: number; ini: string; tone: AvatarTone; issuer: string; kind: string; role: string; rt: Tone; code: string; reg: string; status: string; st: Tone; rel: string; goes: string }[] = [
  { id: 1, ini: 'GP', tone: 'green', issuer: 'Greenfield Primary', kind: 'School', role: 'Family', rt: 'green', code: 'kindpack.org/r/GRN-F-7Q2', reg: '48 · 4 pending', status: 'Active', st: 'green', rel: 'Family → Greenfield Primary', goes: 'Approvals · Families' },
  { id: 2, ini: 'GP', tone: 'green', issuer: 'Greenfield Primary', kind: 'School', role: 'Hero', rt: 'purple', code: 'kindpack.org/r/GRN-H-3K9', reg: '5 · 1 pending', status: 'Active', st: 'green', rel: 'Hero → Greenfield Primary', goes: 'Approvals · Heroes' },
  { id: 3, ini: 'GP', tone: 'green', issuer: 'Greenfield Primary', kind: 'School', role: 'Business', rt: 'amber', code: 'kindpack.org/r/GRN-B-8D1', reg: '3 · 0 pending', status: 'Active', st: 'green', rel: 'Business → Greenfield Primary', goes: 'Approvals · Businesses' },
  { id: 4, ini: 'SS', tone: 'blue', issuer: 'Smith Family', kind: 'Family', role: 'Family member', rt: 'blue', code: 'kindpack.org/r/SMF-M-2A4', reg: '2 · 1 pending', status: 'Active', st: 'green', rel: 'Member → Smith Family', goes: 'Approvals · Members' },
  { id: 5, ini: 'WF', tone: 'red', issuer: 'Walker Family', kind: 'Family', role: 'Business', rt: 'amber', code: 'kindpack.org/r/WKF-B-6P0', reg: '1 · 0 pending', status: 'Used', st: 'grey', rel: 'Business → Walker Family', goes: 'Approvals · Businesses' },
];

export function Referrals() {
  const [tab, setTab] = useState('All links');
  const rows = LINKS.filter((r) => tab === 'All links' || (tab === 'School invites' && r.kind === 'School') || (tab === 'Family invites' && r.kind === 'Family' && r.role !== 'Family member') || (tab === 'Member referrals' && r.role === 'Family member'));
  return (
    <Stack gap={3}>
      <TopBar title="Referrals" helper="Links issued by schools, families and family members, and the registrations they create." />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -2 }}>
        <Btn kind="primary" icon={<AddIcon />}>Create link</Btn>
      </Box>
      <StatRow
        stats={[
          { label: 'Active links', value: '64', icon: <LinkOutlined />, color: 'green' },
          { label: 'Registrations', value: '212', icon: <GroupOutlined />, color: 'blue' },
          { label: 'Awaiting approval', value: '23', icon: <AccessTimeOutlined />, color: 'amber' },
          { label: 'Invalid or used', value: '9', icon: <WarningAmber />, color: 'red' },
        ]}
      />
      <Toolbar
        left={<PillTabs tabs={['All links', 'School invites', 'Family invites', 'Member referrals']} value={tab} onChange={setTab} />}
        right={
          <>
            <SearchField placeholder="Issuer or link code…" width={280} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 44, px: 2, borderRadius: '22px', bgcolor: '#fff', boxShadow: shadows.card, fontSize: 13 }}>
              <Box component="span" sx={{ color: 'text.secondary' }}>Status:</Box> <b>All</b> <KeyboardArrowDown sx={{ fontSize: 18 }} />
            </Box>
          </>
        }
      />
      <DataTable
        minWidth={1180}
        rows={rows}
        columns={[
          { label: 'Issuer', render: (r) => <Person initials={r.ini} tone={r.tone} name={r.issuer} sub={r.kind} size={40} /> },
          { label: 'Target role', w: 120, render: (r) => <Tag tone={r.rt}>{r.role}</Tag> },
          { label: 'Link', w: 150, render: (r) => <Typography sx={{ fontSize: 12, wordBreak: 'break-all' }}>{r.code}</Typography> },
          { label: 'Registrations', w: 110, render: (r) => <Typography sx={{ fontSize: 13 }}>{r.reg}</Typography> },
          { label: 'Status', w: 90, render: (r) => <Pill tone={r.st}>{r.status}</Pill> },
          { label: 'Resulting relationship', w: 170, render: (r) => <Typography sx={{ fontSize: 12 }}>{r.rel}</Typography> },
          { label: 'Approval goes to', w: 140, render: (r) => <Typography sx={{ fontSize: 12 }}>{r.goes}</Typography> },
          {
            label: 'Actions',
            w: 190,
            render: () => (
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                <RoundBtn label="Copy link"><ContentCopyOutlined /></RoundBtn>
                <RoundBtn label="Share"><ShareOutlined /></RoundBtn>
                <RoundBtn label="View"><VisibilityOutlined /></RoundBtn>
                <Box component="button" type="button" aria-label="Disable link" sx={{ width: 40, height: 40, borderRadius: '20px', border: 0, bgcolor: '#FBE3E0', color: '#C94A3C', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                  <BlockOutlined sx={{ fontSize: 18 }} />
                </Box>
              </Box>
            ),
          },
        ]}
      />
      <Grid cols="1fr 1fr">
        <Card title="Who can invite whom" subtitle="Agreed referral rules">
          {[['School', 'Families · Heroes · Businesses'], ['Family', 'Family members · Businesses'], ['Family member', 'Businesses'], ['Hero', 'No referral links in the agreed scope']].map(([a, b]) => (
            <Box key={a} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, p: '12px 16px', borderRadius: '12px', bgcolor: '#F3F6F2' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{a}</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', textAlign: 'right' }}>{b}</Typography>
            </Box>
          ))}
        </Card>
        <Card title="Registration link outcomes" subtitle="What a person sees when opening a link">
          {([['Valid link', 'Registration form opens and goes to the approval queue.', 'green'], ['Invalid or disabled link', 'This link is no longer active. Ask the sender for a new one.', 'red'], ['Already used', 'This link has already been used for a registration.', 'amber']] as [string, string, Tone][]).map(([a, b, t]) => (
            <Box key={a} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '12px 16px', borderRadius: '12px', bgcolor: statusColors[t].bg, color: statusColors[t].fg }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
                <Box sx={{ width: 6, height: 6, borderRadius: 3, bgcolor: 'currentColor' }} />
                {a}
              </Box>
              <Typography sx={{ fontSize: 12, color: 'inherit' }}>{b}</Typography>
            </Box>
          ))}
        </Card>
      </Grid>
    </Stack>
  );
}

/* ───────────── Family member ───────────── */

export function MemberDetail() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Emma Smith" helper="Family member · Kid · part of Smith Family · registered 12 Mar 2026" />
      <DetailBar actions={<><Btn icon={<VisibilityOutlined />} onClick={() => navigate('/users/family')}>Back to family</Btn><Btn>Remove from family</Btn></>} />
      <Stack>
        <Grid cols="1fr 1fr">
          <Card title="Identity" subtitle="Registered through Smith Family">
            <Person initials="ES" tone="amber" name="Emma Smith" sub={<Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}><Pill>Approved by family</Pill><Pill tone="blue">Kid</Pill></Box>} size={56} />
            <Box>
              {[['Age', '10'], ['Family', 'Smith Family'], ['Linked schools', 'Greenfield Primary · St. Mary’s Primary'], ['Registered by', 'Sarah Smith (parent)'], ['Approval', 'Family approved 12 Mar 2026']].map(([k, v], i) => (
                <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.5, borderTop: i ? hair : 0 }}>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{k}</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{v}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
          <Card title="Registration & approval history" subtitle="Member registration needs family or admin approval">
            <Timeline items={[{ title: 'Added by Sarah Smith', sub: '12 Mar 2026 · 8:10 am' }, { title: 'Approved by family', sub: '12 Mar 2026 · 8:12 am' }, { title: 'Linked to St. Mary’s Primary', sub: '21 Jun 2026 · 2:05 pm', tone: 'blue' }]} />
          </Card>
        </Grid>
        <Card title="Activity linked to this member" subtitle="Orders and contributions show the school they support">
          {[['Order #KP-10482 · Smith Family', 'Greenfield Primary · AUD 29.00'], ['Referral · Brew & Co. Cafe', 'Business · approved'], ['Points wallet', '840 points · see Kids wallet']].map(([a, b], i) => (
            <Box key={a} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 2, borderBottom: hair, mt: i ? 0 : -1 }}>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{a}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{b}</Typography>
            </Box>
          ))}
        </Card>
      </Stack>
    </>
  );
}

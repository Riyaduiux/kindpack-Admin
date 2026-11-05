import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import Close from '@mui/icons-material/Close';
import Check from '@mui/icons-material/Check';
import WarningAmber from '@mui/icons-material/WarningAmber';
import EditOutlined from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import PauseOutlined from '@mui/icons-material/PauseOutlined';
import MailOutline from '@mui/icons-material/MailOutline';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import BadgeOutlined from '@mui/icons-material/BadgeOutlined';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import CameraAltOutlined from '@mui/icons-material/CameraAltOutlined';
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import BusinessOutlined from '@mui/icons-material/BusinessOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import PageHeader from '../../components/PageHeader';
import { Avatar, Btn, Card, DataTable, Grid, hair, Person, Pill, Progress, RoundBtn, Stack, Tag, TextArea, Timeline, type Tone } from '../../components/kit';
import { BarCard, DetailBar, ImpactCard, InfoRow, ProfileHero, SubTabs } from '../../components/profile';
import { brand, forest } from '../../theme';
import { useModals } from './modals';

const Muted = ({ children }: { children: React.ReactNode }) => <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{children}</Typography>;

/* ───────────── Hero application ───────────── */

const DOCS: { icon: React.ReactNode; tone: string; name: string; meta: string; status: string; tint: Tone }[] = [
  { icon: <BadgeOutlined />, tone: '#E3F1E7', name: 'Driver licence', meta: 'PDF · 1.2 MB · 28 Sep', status: 'Verified', tint: 'green' },
  { icon: <ShieldOutlined />, tone: '#FBEFD3', name: 'Police clearance · optional, awaiting agreement', meta: 'PDF · 860 KB · 28 Sep', status: 'Needs review', tint: 'amber' },
  { icon: <CameraAltOutlined />, tone: '#E0ECFB', name: 'Vehicle photo – E-cargo bike', meta: 'JPG · 2.4 MB · 29 Sep', status: 'Verified', tint: 'green' },
  { icon: <AccountBalanceOutlined />, tone: '#FBE3E0', name: 'Bank details for payouts', meta: 'Submitted in app · 29 Sep', status: 'Verified', tint: 'green' },
];

export function HeroDetail() {
  const [tab, setTab] = useState('Documents');
  const m = useModals();
  return (
    <>
      <PageHeader title="James K." helper="Hero application · applied 28 Sep 2026" />
      <DetailBar
        pills={
          <>
            <Pill tone="amber">Pending approval</Pill>
            <Pill tone="amber" dot={false}>Hero</Pill>
          </>
        }
        actions={
          <>
            <Btn icon={<ChatBubbleOutline />} onClick={m.message}>Message</Btn>
            <Btn icon={<Close />} onClick={m.reject} sx={{ color: '#C94A3C', borderColor: '#F3C9C3' }}>Reject</Btn>
            <Btn kind="primary" icon={<Check />}>Approve hero</Btn>
          </>
        }
      />
      <Stack gap={3}>
        <ProfileHero initials="JK" tone="amber" name="James K." meta="Zone 4 · Greenfield district · E-cargo bike · Mon–Fri 12 pm – 6 pm" stats={[{ value: '312', label: 'Deliveries' }, { value: '4.9', label: 'Rating' }, { value: '97%', label: 'On-time' }, { value: '184 kg', label: 'CO₂ · illustr.' }]} />
        <SubTabs tabs={['Overview', 'Documents', 'Deliveries', 'Earnings', 'Activity']} value={tab} onChange={setTab} />
        <Grid cols="1.79fr 1fr">
          <Stack>
            <Card title="Document verification" subtitle="3 of 4 documents reviewed" right={<Pill tone="amber">1 needs review</Pill>} pad={3}>
              <Box sx={{ mx: -3, mb: -3 }}>
                {DOCS.map((d, i) => (
                  <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 1.75, borderTop: hair, ...(i === 3 ? { pb: 2.5 } : {}) }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: d.tone, display: 'grid', placeItems: 'center', color: forest[700], flexShrink: 0 }}>{d.icon}</Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{d.name}</Typography>
                      <Muted>{d.meta}</Muted>
                    </Box>
                    <Pill tone={d.tint}>{d.status}</Pill>
                    <RoundBtn label="View"><VisibilityOutlined /></RoundBtn>
                    <RoundBtn label="Download"><FileDownloadOutlined /></RoundBtn>
                  </Box>
                ))}
              </Box>
            </Card>
            <BarCard title="Deliveries per week" subtitle="Last 12 weeks" ranges={['8w', '12w', 'All']} data={{ '8w': [20, 26, 24, 31, 28, 35, 40, 48], '12w': [22, 28, 25, 33, 30, 36, 34, 40, 38, 44, 42, 52], All: [10, 14, 18, 22, 26, 30, 28, 34, 40, 44, 42, 52] }} height={110} />
          </Stack>
          <Stack>
            <Card title="Profile" pad={3}>
              <Box sx={{ mt: -1 }}>
                <InfoRow icon={<MailOutline />} label="Email" value="james.k@mail.com" />
                <InfoRow icon={<PhoneOutlined />} label="Phone" value="+61 412 345 678" />
                <InfoRow icon={<LocalShippingOutlined />} label="Vehicle" value="E-cargo bike" />
                <InfoRow icon={<PlaceOutlined />} label="Linked warehouse" value="Greenfield Warehouse" last />
              </Box>
            </Card>
            <Card title="Admin notes" subtitle="Only visible to admins">
              <TextArea placeholder="Add an internal note about this applicant…" rows={3} />
              <Box><Btn small>Save note</Btn></Box>
            </Card>
            <Card title="Account controls">
              <Btn full icon={<LockOutlined />}>Reset password</Btn>
              <Btn full icon={<WarningAmber />} onClick={m.suspend} sx={{ color: '#C94A3C', borderColor: '#F3C9C3' }}>Suspend account</Btn>
            </Card>
          </Stack>
        </Grid>
      </Stack>
      {m.render}
    </>
  );
}

/* ───────────── Family ───────────── */

const SCHOOLS = [
  { id: 1, ini: 'GP', tone: 'green' as const, name: 'Greenfield Primary', sub: 'Linked 3 Mar 2026', rel: 'Primary school', relTone: 'green' as Tone, orders: '18', aud: 'AUD 412.00', last: '12 Oct' },
  { id: 2, ini: 'SM', tone: 'amber' as const, name: 'St. Mary’s Primary', sub: 'Linked 21 Jun 2026', rel: 'Also supports', relTone: 'blue' as Tone, orders: '6', aud: 'AUD 96.00', last: '28 Sep' },
];

const MEMBERS: { id: number; ini: string; tone: 'green' | 'blue' | 'amber' | 'red'; name: string; sub: string; rel: string; role: string; status: string; tint: Tone }[] = [
  { id: 1, ini: 'SS', tone: 'green', name: 'Sarah Smith', sub: 'Primary contact', rel: 'Parent', role: 'Adult', status: 'Approved', tint: 'green' },
  { id: 2, ini: 'TS', tone: 'blue', name: 'Tom Smith', sub: 'tom.smith@mail.com', rel: 'Parent', role: 'Adult', status: 'Approved', tint: 'green' },
  { id: 3, ini: 'ES', tone: 'amber', name: 'Emma Smith', sub: 'Age 10', rel: 'Child', role: 'Kid', status: 'Approved by family', tint: 'green' },
  { id: 4, ini: 'LS', tone: 'red', name: 'Liam Smith', sub: 'Age 7', rel: 'Child', role: 'Kid', status: 'Awaiting family approval', tint: 'amber' },
];

export function FamilyDetail() {
  const m = useModals();
  return (
    <>
      <PageHeader title="Smith Family" helper="Family · linked to 2 schools · registered 3 Mar 2026" />
      <DetailBar
        pills={<><Pill>Active</Pill><Pill tone="green" dot={false}>Family</Pill></>}
        actions={
          <>
            <Btn icon={<PauseOutlined />}>Pause</Btn>
            <Btn icon={<AddIcon />}>Link another school</Btn>
            <Btn kind="primary" icon={<EditOutlined />}>Edit</Btn>
          </>
        }
      />
      <Stack>
        <Grid cols="1.79fr 1fr">
          <Card title="Identity" subtitle="Primary contact and registration">
            <Person initials="SF" name="Sarah Smith" sub={<Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}><Pill>Active</Pill><Pill tone="green" dot={false}>Family</Pill></Box>} size={56} />
            <Box>
              {[
                ['Email', 'sarah.smith@mail.com'],
                ['Phone', '+61 412 345 678'],
                ['Referred by', 'Greenfield Primary · link GRN-F-7Q2'],
                ['Registration approved', '4 Mar 2026 · Anna K. (school admin)'],
                ['Household members', '4 (1 awaiting approval)'],
              ].map(([k, v], i) => (
                <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.75, borderTop: i ? hair : 0 }}>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{k}</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{v}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
          <Card title="Approval rules" subtitle="Who approves each registration">
            {[
              ['Family', 'green', 'School or admin approval'],
              ['Family member', 'blue', 'Family or admin approval'],
              ['Hero', 'purple', 'School or admin approval'],
              ['Business', 'amber', 'Referring or requesting user, or admin'],
            ].map(([t, tone, rule]) => (
              <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '10px 14px', borderRadius: '12px', bgcolor: '#F3F6F2' }}>
                <Tag tone={tone as Tone}>{t}</Tag>
                <Typography sx={{ fontSize: 13 }}>{rule}</Typography>
              </Box>
            ))}
            <Typography sx={{ fontSize: 12, color: '#8A5A00' }}>Business approval route to be confirmed with the business.</Typography>
          </Card>
        </Grid>

        <Card title="Linked schools" subtitle="Each order and contribution is tagged with the school it supports" pad={0} sx={{ overflow: 'hidden' }}>
          <Box sx={{ pt: 0 }}>
            <DataTable
              minWidth={900}
              rows={SCHOOLS}
              columns={[
                { label: 'School', render: (r) => <Person initials={r.ini} tone={r.tone} name={r.name} sub={r.sub} size={36} /> },
                { label: 'Relationship', w: 140, render: (r) => <Tag tone={r.relTone}>{r.rel}</Tag> },
                { label: 'Orders', w: 70, render: (r) => r.orders },
                { label: 'Contribution (AUD)', w: 160, render: (r) => <b>{r.aud}</b> },
                { label: 'Last order', w: 100, render: (r) => r.last },
                { label: 'Status', w: 100, render: () => <Pill>Active</Pill> },
              ]}
              rowActions
            />
          </Box>
        </Card>

        <Grid cols="1.79fr 1fr">
          <Card title="Family members" subtitle="Registered through the family" pad={0} sx={{ overflow: 'hidden' }}>
            <DataTable
              minWidth={780}
              rows={MEMBERS}
              columns={[
                { label: 'Member', render: (r) => <Person initials={r.ini} tone={r.tone} name={r.name} sub={r.sub} size={36} /> },
                { label: 'Relationship', w: 110, render: (r) => r.rel },
                { label: 'Role', w: 70, render: (r) => r.role },
                { label: 'Approval', w: 190, render: (r) => <Pill tone={r.tint}>{r.status}</Pill> },
              ]}
              rowActions
            />
          </Card>
          <Card title="Registration & approval history">
            <Timeline
              items={[
                { title: 'Family registered via Greenfield Primary link', sub: '3 Mar 2026 · 9:12' },
                { title: 'Approved by Anna K. (school admin)', sub: '4 Mar 2026 · 10:30' },
                { title: 'Linked to St. Mary’s Primary', sub: '21 Jun 2026 · 2:05', tone: 'blue' },
                { title: 'Liam Smith added — awaiting family approval', sub: '10 Oct 2026 · 7:40', tone: 'amber' },
              ]}
            />
          </Card>
        </Grid>

        <ImpactCard title="Family impact · this month" subtitle="Illustrative · total of all orders by this family" tiles={[{ value: '12.4 kg', label: 'CO₂e saved' }, { value: '340', label: 'Plastic bottles avoided' }, { value: '18', label: 'Orders counted' }]} note="Sum of every order placed by Smith Family." />
      </Stack>
      {m.render}
    </>
  );
}

/* ───────────── School ───────────── */

const CAMPAIGNS = [
  { id: 1, ini: 'LB', tone: 'amber' as const, name: 'Library Books Fund', sub: 'Ends in 28 days', goal: 'AUD 1,000', pct: 62, status: 'Live', tint: 'blue' as Tone },
  { id: 2, ini: 'ES', tone: 'amber' as const, name: 'Eco Supplies Drive', sub: 'Completed', goal: 'AUD 5,000', pct: 100, status: 'Completed', tint: 'green' as Tone },
  { id: 3, ini: 'PU', tone: 'red' as const, name: 'Playground Upgrade', sub: 'Submitted 2 days ago', goal: 'AUD 2,000', pct: 0, status: 'Pending', tint: 'amber' as Tone },
];

export function SchoolDetail() {
  const [tab, setTab] = useState('Overview');
  const m = useModals();
  return (
    <>
      <PageHeader title="St. Mary’s Primary" helper="School · Greenfield district · joined 02 Feb 2026" />
      <DetailBar
        pills={<><Pill>Verified</Pill><Pill tone="purple" dot={false}>School</Pill></>}
        actions={
          <>
            <Btn icon={<ChatBubbleOutline />} onClick={m.message}>Message</Btn>
            <Btn icon={<WarningAmber />} onClick={m.suspend} sx={{ color: '#C94A3C', borderColor: '#F3C9C3' }}>Suspend</Btn>
            <Btn kind="primary" icon={<EditOutlined />}>Edit school</Btn>
          </>
        }
      />
      <Stack>
        <ProfileHero initials="SM" tone="purple" name="St. Mary’s Primary" badge={<Pill>Verified</Pill>} meta="142 linked families · 2 heroes assigned · Principal: Ms. Hart" stats={[{ value: '142', label: 'Families' }, { value: 'AUD 6,600', label: 'Raised (Sep)' }, { value: '3', label: 'Live campaigns' }, { value: '—', label: 'ESG score · tbd' }]} />
        <SubTabs tabs={['Overview', 'Campaigns', 'Families', 'Payouts', 'Documents']} value={tab} onChange={setTab} />
        <Grid cols="1.79fr 1fr">
          <Stack>
            <Card title="Campaigns" subtitle="Fundraising by this school" right={<Btn small icon={<AddIcon />}>New campaign</Btn>} pad={3}>
              <Box sx={{ mx: -3, mb: -3 }}>
                <DataTable
                  minWidth={620}
                  rows={CAMPAIGNS}
                  columns={[
                    { label: 'Campaign', render: (r) => <Person initials={r.ini} tone={r.tone} name={r.name} sub={r.sub} size={40} /> },
                    { label: 'Goal', w: 100, render: (r) => r.goal },
                    { label: 'Progress', w: 170, render: (r) => <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Box sx={{ flex: 1 }}><Progress value={r.pct} /></Box><Muted>{r.pct}%</Muted></Box> },
                    { label: 'Status', w: 110, render: (r) => <Pill tone={r.tint}>{r.status}</Pill> },
                  ]}
                />
              </Box>
            </Card>
            <BarCard title="Earnings per month" subtitle="Subscriptions + fundraising (AUD)" ranges={['6m', '12m']} data={{ '6m': [20, 28, 34, 44, 52, 90], '12m': [14, 18, 22, 20, 26, 30, 28, 34, 44, 52, 58, 90] }} labels={{ '6m': ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], '12m': ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] }} height={140} />
          </Stack>
          <Stack>
            <Card title="School details">
              <Box sx={{ mt: -1 }}>
                <InfoRow icon={<MailOutline />} label="Admin email" value="admin@stmarys.edu" />
                <InfoRow icon={<PhoneOutlined />} label="Phone" value="+61 3 9000 1122" />
                <InfoRow icon={<PlaceOutlined />} label="Address" value="14 Church St, Greenfield" />
                <InfoRow icon={<DescriptionOutlined />} label="ABN" value="51 824 753 556" last />
              </Box>
            </Card>
            <Card title="Payout account" subtitle="Used for payouts" right={<Pill>Verified</Pill>}>
              <Person initials="" name="Commonwealth Bank" sub="BSB 063-000 · ••••4821" size={44} />
            </Card>
            <Card title="Assigned heroes">
              {[{ i: 'JK', t: 'amber' as const, n: 'James K.' }, { i: 'LC', t: 'blue' as const, n: 'Lena C.' }].map((h, k) => (
                <Box key={h.i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: k ? 1.5 : 0, borderTop: k ? hair : 0 }}>
                  <Avatar initials={h.i} tone={h.t} size={40} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{h.n}</Typography>
                    <Muted>Zone 4</Muted>
                  </Box>
                  <RoundBtn label="Message"><ChatBubbleOutline /></RoundBtn>
                </Box>
              ))}
            </Card>
          </Stack>
        </Grid>
        <ImpactCard title="School impact" subtitle="Illustrative · total of all orders linked to this school" tiles={[{ value: '2.1 t', label: 'CO₂e reduced' }, { value: '612', label: 'Orders linked' }, { value: '148', label: 'Families linked' }]} note="Sum of every order linked to Greenfield Primary." />
      </Stack>
      {m.render}
    </>
  );
}

/* ───────────── Business ───────────── */

export function BusinessDetail() {
  const [tab, setTab] = useState('Overview');
  const m = useModals();
  return (
    <>
      <PageHeader title="Brew & Co. Cafe" helper="Business · Gold sponsor · linked since 14 Jan 2026" />
      <DetailBar
        pills={<><Pill>Approved</Pill><Pill tone="green" dot={false}>Business</Pill></>}
        actions={
          <>
            <Btn icon={<ChatBubbleOutline />} onClick={m.message}>Message</Btn>
            <Btn icon={<WarningAmber />} onClick={m.suspend} sx={{ color: '#C94A3C', borderColor: '#F3C9C3' }}>Suspend</Btn>
            <Btn kind="primary" icon={<EditOutlined />}>Edit account</Btn>
          </>
        }
      />
      <Stack>
        <ProfileHero initials="BC" tone="blue" name="Brew & Co. Cafe" badge={<Pill>Approved</Pill>} meta="3 team members · 3 schools sponsored · Account manager: Priya S." stats={[{ value: '26', label: 'Orders' }, { value: 'AUD 2.4k', label: 'Total spend' }, { value: '312 kg', label: 'CO₂ · tbd' }, { value: '4', label: 'Eco badges' }]} />
        <SubTabs tabs={['Overview', 'Orders', 'Invoices', 'ESG & badges', 'Team']} value={tab} onChange={setTab} />
        <Grid cols="1.79fr 1fr">
          <Stack>
            <Card title="Recent orders" right={<Btn small>View all</Btn>}>
              <Box sx={{ mx: -3, mb: -3 }}>
                <DataTable
                  minWidth={620}
                  rows={[
                    { id: 1, o: '#KP-10481', t: 'Bulk order · 48 rolls', a: 'AUD 99.00', d: '12 Oct', s: 'On the way', tint: 'blue' as Tone },
                    { id: 2, o: '#KP-10392', t: 'Business Essentials', a: 'AUD 99.00', d: '12 Sep', s: 'Delivered', tint: 'green' as Tone },
                    { id: 3, o: '#KP-10301', t: 'Custom order', a: 'AUD 64.00', d: '02 Sep', s: 'Delivered', tint: 'green' as Tone },
                  ]}
                  columns={[
                    { label: 'Order', w: 110, render: (r) => r.o },
                    { label: 'Type', render: (r) => r.t },
                    { label: 'Amount', w: 110, render: (r) => <b>{r.a}</b> },
                    { label: 'Delivery', w: 90, render: (r) => r.d },
                    { label: 'Status', w: 120, render: (r) => <Pill tone={r.tint}>{r.s}</Pill> },
                  ]}
                />
              </Box>
            </Card>
            <Card title="Invoices" right={<Pill tone="amber">AUD 640 due 20 Oct</Pill>}>
              <Box sx={{ mx: -3, mb: -3 }}>
                <DataTable
                  minWidth={620}
                  rows={[
                    { id: 1, n: 'INV-0291', p: 'Sep 2026', a: 'AUD 640.00', s: 'Due soon', tint: 'amber' as Tone },
                    { id: 2, n: 'INV-0245', p: 'Aug 2026', a: 'AUD 580.00', s: 'Paid', tint: 'green' as Tone },
                  ]}
                  columns={[
                    { label: 'Invoice', w: 110, render: (r) => r.n },
                    { label: 'Period', render: (r) => r.p },
                    { label: 'Amount', w: 130, render: (r) => <b>{r.a}</b> },
                    { label: 'Status', w: 120, render: (r) => <Pill tone={r.tint}>{r.s}</Pill> },
                    { label: '', w: 50, render: () => <RoundBtn label="Download"><FileDownloadOutlined /></RoundBtn> },
                  ]}
                />
              </Box>
            </Card>
          </Stack>
          <Stack>
            <Card title="Account manager">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar initials="PS" size={44} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Priya S.</Typography>
                  <Muted>priya@kindpack.com</Muted>
                </Box>
                <Btn small onClick={m.message}>Message</Btn>
              </Box>
            </Card>
            <Card title="ESG badges" subtitle="Eco-certifications · evidence required">
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[['Plastic-free', 'green'], ['Carbon aware', 'blue'], ['School sponsor', 'purple'], ['Zero waste', 'amber']].map(([l, t]) => (
                  <Pill key={l} tone={t as Tone} dot={false} sx={{ fontSize: 12, px: 1.5, py: 0.75, gap: 0.75 }}>
                    <WorkspacePremiumOutlined sx={{ fontSize: 15 }} /> {l}
                  </Pill>
                ))}
              </Box>
            </Card>
            <Card title="Company details">
              <Box sx={{ mt: -1 }}>
                <InfoRow icon={<BusinessOutlined />} label="Legal name" value="Brew & Co. Pty Ltd" />
                <InfoRow icon={<ReceiptLongOutlined />} label="ABN" value="88 120 331 450" />
                <InfoRow icon={<MailOutline />} label="Billing email" value="accounts@brewco.com" last />
              </Box>
            </Card>
          </Stack>
        </Grid>
      </Stack>
      {m.render}
    </>
  );
}

export { brand, CreditCardOutlined };

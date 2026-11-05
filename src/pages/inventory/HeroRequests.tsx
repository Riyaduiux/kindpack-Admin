import { useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import TopBar from '../../layout/TopBar';
import PageHeader from '../../components/PageHeader';
import { Btn, Card, DataTable, Field, FilterChip, Grid, Input, Modal, Pill, Person, SearchField, Select, SidePanel, Stack, StatRow, TextArea, type AvatarTone, type Tone } from '../../components/kit';
import { brand, statusColors } from '../../theme';

type Panel = 'review' | 'prepare' | 'damaged' | null;

const TABS: [string, number][] = [['Awaiting review', 9], ['Approved', 6], ['Awaiting receipt', 4], ['Received', 31], ['Rejected', 2]];
const REQ: { id: number; ini: string; tone: AvatarTone; name: string; zone: string; product: string; stock: string; sales: string; sug: string; req: string; st: string; tint: Tone }[] = [
  { id: 1, ini: 'JK', tone: 'green', name: 'James K.', zone: 'Zone 4 · Greenfield', product: 'Dishwashing liquid', stock: '6', sales: '31', sug: '24', req: '24', st: 'Awaiting review', tint: 'amber' },
  { id: 2, ini: 'PS', tone: 'amber', name: 'Priya S.', zone: 'Zone 2 · Riverside', product: 'Toilet paper rolls', stock: '10', sales: '44', sug: '36', req: '36', st: 'Awaiting review', tint: 'amber' },
  { id: 3, ini: 'ML', tone: 'blue', name: 'Marcus L.', zone: 'Zone 1 · Northside', product: 'Gentle shampoo refill', stock: '4', sales: '22', sug: '18', req: '20', st: 'Awaiting review', tint: 'amber' },
  { id: 4, ini: 'AO', tone: 'red', name: 'Amara O.', zone: 'Zone 3 · Eastwood', product: 'All-purpose cleaner', stock: '2', sales: '12', sug: '10', req: '12', st: 'Approved · 12', tint: 'blue' },
  { id: 5, ini: 'TN', tone: 'purple', name: 'Tuan N.', zone: 'Zone 5 · Westbank', product: 'Colouring activity book', stock: '15', sales: '8', sug: '0', req: '10', st: 'Rejected', tint: 'red' },
];

/** 4-step progress pills: Request → Review/Approved → Dispatch → Receipt. */
function Stepper({ step, labels = ['Request', 'Review', 'Dispatch', 'Receipt'], size = 'md' }: { step: number; labels?: string[]; size?: 'md' | 'sm' }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${labels.length}, 1fr)`, gap: 1 }}>
      {labels.map((l, i) => {
        const n = i + 1;
        const done = n < step;
        const cur = n === step;
        return (
          <Box key={l} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.25, height: size === 'sm' ? 30 : 34, borderRadius: '10px', bgcolor: done || cur ? '#E3F1E7' : '#EEF1EC', color: done || cur ? '#145233' : '#98A39B', fontSize: 11, fontWeight: 500, minWidth: 0 }}>
            <Box sx={{ width: 18, height: 18, borderRadius: '9px', flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600, bgcolor: done || cur ? '#145233' : '#CBD2CC', color: '#fff' }}>
              {done ? <Check sx={{ fontSize: 12 }} /> : n}
            </Box>
            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l}</Box>
          </Box>
        );
      })}
    </Box>
  );
}

const Note = ({ tone, icon, title, children }: { tone: Tone; icon: ReactNode; title: string; children: ReactNode }) => (
  <Box sx={{ display: 'flex', gap: 1.5, p: '14px 16px', borderRadius: '14px', bgcolor: statusColors[tone].bg, color: statusColors[tone].fg }}>
    <Box sx={{ display: 'grid', '& svg': { fontSize: 20 } }}>{icon}</Box>
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'inherit' }}>{title}</Typography>
      <Typography sx={{ fontSize: 12, color: 'inherit' }}>{children}</Typography>
    </Box>
  </Box>
);

function ReviewPanel({ open, onClose, onApprove }: { open: boolean; onClose: () => void; onApprove: () => void }) {
  return (
    <SidePanel open={open} onClose={onClose} width={500} title="Stock request #SR-2041" subtitle="James K. · Zone 4 · submitted 12 Oct, 8:40 am" footer={<><Btn full icon={<Close />} onClick={onClose} sx={{ color: '#C94A3C', borderColor: '#F3C9C3' }}>Reject…</Btn><Btn kind="primary" full icon={<Check />} onClick={onApprove}>Approve request</Btn></>}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Pill tone="amber">Awaiting review</Pill>
        <Pill tone="blue" dot={false}>Suggested by sales history</Pill>
      </Box>
      <Stepper step={2} />
      <Box sx={{ border: '1px solid rgba(11,46,31,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 44px 50px 52px 52px 70px', gap: 1, px: 2, py: 1.25, bgcolor: '#F8FAF7', fontSize: 10, color: brand.placeholder, fontWeight: 500 }}>
          {['PRODUCT', 'STOCK', 'SALES 14D', 'SUGGEST', 'REQUEST', 'APPROVE'].map((h) => <span key={h}>{h}</span>)}
        </Box>
        {[['Dishwashing liquid', '6', '31', '24', '24', '24'], ['Toilet paper rolls', '10', '44', '12', '12', '12']].map((r) => (
          <Box key={r[0]} sx={{ display: 'grid', gridTemplateColumns: '1fr 44px 50px 52px 52px 70px', gap: 1, px: 2, py: 1.5, alignItems: 'center', fontSize: 12, borderTop: '1px solid rgba(11,46,31,0.07)' }}>
            <b>{r[0]}</b>
            {r.slice(1, 5).map((v, i) => <span key={i}>{v}</span>)}
            <Box component="input" defaultValue={r[5]} sx={{ width: 56, height: 32, textAlign: 'center', border: '2px solid #1F6B45', borderRadius: '10px', font: 'inherit', fontSize: 12, fontWeight: 600, outline: 0 }} />
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 2, borderRadius: '14px', bgcolor: '#F3F6F2', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {[['Warehouse on hand (dishwashing liquid)', '90', false], ['After approval: committed to James K.', '24', true], ['Available after commitment', '66', false]].map(([a, b, bold]) => (
          <Box key={a as string} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: bold ? 'text.primary' : 'text.secondary', fontWeight: bold ? 500 : 400 }}>
            <span>{a}</span>
            <b>{b}</b>
          </Box>
        ))}
      </Box>
      <Note tone="blue" icon={<InfoOutlined />} title="Approval is not receipt">Approving commits warehouse stock. Hero stock does not change until James K. confirms receipt.</Note>
      <Field label="Decision note"><TextArea placeholder="Optional note to the Hero…" rows={3} /></Field>
    </SidePanel>
  );
}

function PreparePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [how, setHow] = useState('pick');
  return (
    <SidePanel open={open} onClose={onClose} width={500} title="Prepare pickup or dispatch" subtitle="Request #SR-2041 · approved 12 Oct, 9:05 am" footer={<><Btn full onClick={onClose}>Back</Btn><Btn kind="primary" full icon={<LocalShippingOutlined />} onClick={onClose}>Confirm pickup / dispatch</Btn></>}>
      <Stepper step={3} labels={['Request', 'Approved', 'Dispatch', 'Receipt']} size="sm" />
      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>How will James K. get the stock?</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        {[['pick', 'Hero picks up', 'Hero collects from the warehouse', <PlaceOutlined key="p" />], ['ship', 'Warehouse dispatch', 'Courier or route delivers to the Hero', <LocalShippingOutlined key="s" />]].map(([k, t, s, ic]) => (
          <Box key={k as string} component="button" type="button" onClick={() => setHow(k as string)} sx={{ textAlign: 'left', p: 1.75, borderRadius: '14px', font: 'inherit', cursor: 'pointer', border: how === k ? '2px solid #1F6B45' : '1px solid rgba(11,46,31,0.1)', bgcolor: how === k ? '#EAF3EB' : '#fff' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.75, '& svg': { fontSize: 16 } }}>{ic as ReactNode} {t as string}</Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>{s as string}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Field label="Pickup window"><Select value="Tue 13 Oct · 9:00–10:00" options={['Tue 13 Oct · 9:00–10:00', 'Tue 13 Oct · 10:00–11:00', 'Wed 14 Oct · 9:00–10:00']} /></Field>
        <Field label="Location"><Input value="Main warehouse · Bay 4" readOnly /></Field>
      </Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Outgoing stock record (created on confirm)</Typography>
      <Box sx={{ p: 2, borderRadius: '14px', bgcolor: '#F3F6F2', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {[['Reference', 'OUT-2041'], ['From', 'Main warehouse · B-02'], ['To', 'Hero · James K.'], ['Dishwashing liquid refill', '24 bottles'], ['Toilet paper rolls', '12 packs'], ['Warehouse on hand after', '90 → 66 (dishwashing)']].map(([a, b]) => (
          <Box key={a} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <Box component="span" sx={{ color: 'text.secondary' }}>{a}</Box>
            <b>{b}</b>
          </Box>
        ))}
      </Box>
      <Note tone="amber" icon={<ErrorOutline />} title="Status after confirming: Awaiting Hero receipt">Stock leaves the warehouse now but is not added to the Hero until receipt is confirmed.</Note>
    </SidePanel>
  );
}

function DamagedModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Stock report HR-118" subtitle="Reported by James K. · Zone 4 · 12 Oct, 4:12 pm" width={460} footer={<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 1.25, width: '100%' }}><Btn full icon={<Close />} onClick={onClose} sx={{ color: '#C94A3C', borderColor: '#F3C9C3' }}>Reject</Btn><Btn full icon={<ChatBubbleOutline />} onClick={onClose}>Ask for info</Btn><Btn kind="primary" full icon={<Check />} onClick={onClose}>Accept & adjust</Btn></Box>}>
      <Box sx={{ display: 'flex', gap: 1, mt: -1 }}>
        <Pill tone="red">Damaged</Pill>
        <Pill tone="amber">Awaiting review</Pill>
      </Box>
      <Box>
        {[['Product', 'Dishwashing liquid refill · KP-DW-02'], ['Quantity', '3 bottles'], ['What happened', 'Pallet dropped during pickup']].map(([a, b]) => (
          <Box key={a} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, fontSize: 12, borderBottom: '1px solid rgba(11,46,31,0.07)' }}>
            <Box component="span" sx={{ color: 'text.secondary' }}>{a}</Box>
            <b>{b}</b>
          </Box>
        ))}
      </Box>
      <Box sx={{ height: 90, borderRadius: '14px', background: 'linear-gradient(135deg,#FBE3E0,#F8D3CE)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: '#B3261E' }}>
        <ImageOutlined />
        <Typography sx={{ fontSize: 11, color: 'inherit' }}>Photo from the Hero</Typography>
      </Box>
      <Box sx={{ p: 2, borderRadius: '14px', bgcolor: '#F3F6F2' }}>
        <Typography sx={{ fontSize: 10, color: brand.placeholder, fontWeight: 500, mb: 1 }}>IF YOU ACCEPT</Typography>
        {[['James K. stock', '18 → 15 bottles'], ['Warehouse stock', 'Unchanged'], ['Recorded in', 'Stock movement history']].map(([a, b]) => (
          <Box key={a} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, fontSize: 12 }}>
            <Box component="span" sx={{ color: 'text.secondary' }}>{a}</Box>
            <b>{b}</b>
          </Box>
        ))}
      </Box>
    </Modal>
  );
}

export default function HeroRequests() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState('Awaiting review');
  const [panel, setPanel] = useState<Panel>((params.get('panel') as Panel) ?? null);
  return (
    <Stack gap={3}>
      <TopBar title="Hero stock requests" helper="Sales history → suggested reorder → Hero request → admin review → pickup or dispatch → Hero confirms receipt." />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: -2 }}>
        <Btn icon={<ErrorOutline />} onClick={() => setPanel('damaged')}>Damaged reports · 2</Btn>
        <Btn icon={<ErrorOutline />}>Reorder rules</Btn>
      </Box>
      <StatRow
        stats={[
          { label: 'Awaiting review', value: '9', icon: <AccessTimeOutlined />, color: 'amber' },
          { label: 'Approved · to pick up or dispatch', value: '6', icon: <CheckCircleOutline />, color: 'blue' },
          { label: 'Dispatched · awaiting receipt', value: '4', icon: <LocalShippingOutlined />, color: 'blue' },
          { label: 'Heroes with a suggested reorder', value: '12', icon: <GroupOutlined />, color: 'purple' },
        ]}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
          {TABS.map(([t, n]) => {
            const on = t === tab;
            return (
              <Box key={t} component="button" type="button" onClick={() => setTab(t)} sx={{ height: 38, px: '16px', borderRadius: 999, border: on ? 0 : '1px solid rgba(11,46,31,0.08)', font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', bgcolor: on ? undefined : '#fff', background: on ? 'linear-gradient(148deg,#145233,#0E3B26)' : undefined, color: on ? '#fff' : brand.ink }}>
                {t} <Box component="span" sx={{ ml: 0.5 }}>{n}</Box>
              </Box>
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <SearchField placeholder="Hero or product…" width={230} />
          <FilterChip label="Zone" value="All" />
          <FilterChip label="Date" value="Last 14 days" />
        </Box>
      </Box>
      <Card title="Requests" subtitle="Suggested quantity = sales in the last 14 days × cover days − current stock (rule configurable)" pad={0} sx={{ overflow: 'hidden' }}>
        <DataTable
          minWidth={980}
          rows={REQ}
          selected={new Set([0])}
          columns={[
            { label: 'Hero', render: (r) => <Person initials={r.ini} tone={r.tone} name={r.name} sub={r.zone} size={36} /> },
            { label: 'Product', w: 190, render: (r) => <Typography sx={{ fontSize: 12 }}>{r.product}</Typography> },
            { label: 'Current stock', w: 100, render: (r) => r.stock },
            { label: 'Sales · 14 days', w: 100, render: (r) => r.sales },
            { label: 'Suggested', w: 90, render: (r) => r.sug },
            { label: 'Requested', w: 90, render: (r) => r.req },
            { label: 'Status', w: 140, render: (r) => <Pill tone={r.tint}>{r.st}</Pill> },
            {
              label: 'Actions',
              w: 140,
              render: () => (
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  <Box component="button" type="button" aria-label="Review" onClick={() => setPanel('review')} sx={{ width: 34, height: 34, borderRadius: '17px', border: '1px solid rgba(11,46,31,0.07)', bgcolor: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><VisibilityOutlined sx={{ fontSize: 16 }} /></Box>
                  <Box component="button" type="button" aria-label="Approve" onClick={() => setPanel('review')} sx={{ width: 34, height: 34, borderRadius: '17px', border: 0, bgcolor: '#E3F1E7', color: '#1C6B3B', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Check sx={{ fontSize: 16 }} /></Box>
                  <Box component="button" type="button" aria-label="Reject" sx={{ width: 34, height: 34, borderRadius: '17px', border: 0, bgcolor: '#FBE3E0', color: '#B3261E', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Close sx={{ fontSize: 16 }} /></Box>
                </Box>
              ),
            },
          ]}
        />
      </Card>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: -1.5 }}>Approval commits warehouse stock only. Hero stock changes when the Hero confirms receipt.</Typography>
      <Card title="What Heroes can and cannot do" subtitle="Heroes only manage the stock assigned to them">
        <Grid cols="1fr 1fr" gap={2}>
          <Box sx={{ p: 2.5, borderRadius: '14px', bgcolor: statusColors.green.bg, color: statusColors.green.fg }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'inherit', mb: 1 }}>Heroes can</Typography>
            {['View assigned inventory and history', 'Request more stock', 'Confirm stock received', 'Mark stock delivered', 'Report damaged or missing stock', 'See low-stock alerts'].map((t) => (
              <Typography key={t} sx={{ fontSize: 12, color: 'inherit', display: 'flex', gap: 1, py: 0.35 }}><Check sx={{ fontSize: 14 }} /> {t}</Typography>
            ))}
          </Box>
          <Box sx={{ p: 2.5, borderRadius: '14px', bgcolor: statusColors.red.bg, color: statusColors.red.fg, alignSelf: 'start' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'inherit', mb: 1 }}>Heroes cannot</Typography>
            {['Create products', 'Edit prices', 'Change warehouse stock', 'Approve their own stock increases'].map((t) => (
              <Typography key={t} sx={{ fontSize: 12, color: 'inherit', display: 'flex', gap: 1, py: 0.35 }}><Close sx={{ fontSize: 14 }} /> {t}</Typography>
            ))}
          </Box>
        </Grid>
      </Card>
      <ReviewPanel open={panel === 'review'} onClose={() => setPanel(null)} onApprove={() => setPanel('prepare')} />
      <PreparePanel open={panel === 'prepare'} onClose={() => setPanel(null)} />
      <DamagedModal open={panel === 'damaged'} onClose={() => setPanel(null)} />
    </Stack>
  );
}

/* ───────── Request status & receipt ───────── */

function StatusCard({ title, badge, badgeTone, step, rows, note }: { title: string; badge: string; badgeTone: Tone; step: number; rows: [string, string, string?][]; note: { tone: Tone; icon: ReactNode; title: string; text: string } }) {
  return (
    <Card title={title} right={<Pill tone={badgeTone}>{badge}</Pill>} sx={{ gap: 2 }}>
      <Stepper step={step} labels={['Approved', 'Dispatched', 'Received']} size="sm" />
      <Box>
        {rows.map(([a, b, c]) => (
          <Box key={a} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.25, fontSize: 12 }}>
            <Box component="span" sx={{ color: 'text.secondary' }}>{a}</Box>
            <b style={{ color: c }}>{b}</b>
          </Box>
        ))}
      </Box>
      <Note tone={note.tone} icon={note.icon} title={note.title}>{note.text}</Note>
    </Card>
  );
}

export function RequestStatus() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Request #SR-2041 · status & receipt" helper="Approval, warehouse commitment and actual receipt are three different events." />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -2, mb: 3 }}>
        <Btn icon={<ArrowForward sx={{ fontSize: 16 }} />} onClick={() => navigate('/inventory/requests')}>Back to requests</Btn>
      </Box>
      <Stack>
        <Grid cols="1fr 1fr 1fr">
          <StatusCard title="Approved – stock committed" badge="Approved" badgeTone="blue" step={1} rows={[['Warehouse on hand', '90'], ['Committed to James K.', '24'], ['Available', '66'], ['Hero stock (James K.)', '6 · unchanged']]} note={{ tone: 'blue', icon: <InfoOutlined />, title: 'Waiting for pickup or dispatch', text: 'Nothing has left the warehouse yet.' }} />
          <StatusCard title="Awaiting Hero receipt" badge="Awaiting receipt" badgeTone="amber" step={2} rows={[['Warehouse on hand', '66 · OUT-2041 recorded'], ['In transit / picked up', '24'], ['Hero stock (James K.)', '6 · unchanged'], ['Dispatched', '13 Oct · 9:30 am']]} note={{ tone: 'amber', icon: <ErrorOutline />, title: 'James K. must confirm receipt', text: 'Reminder is sent after 24 hours.' }} />
          <StatusCard title="Receipt confirmed – Hero stock updated" badge="Received" badgeTone="green" step={4} rows={[['Warehouse on hand', '66'], ['In transit', '0'], ['Hero stock (James K.)', '30 · +24 added', '#1C6B3B'], ['Received by Hero', '13 Oct · 2:10 pm']]} note={{ tone: 'green', icon: <InfoOutlined />, title: 'Hero inventory updated', text: 'Movement logged: HR-2041, +24 dishwashing liquid.' }} />
        </Grid>
        <Card title="Receipt exceptions" subtitle="When the delivered quantity differs from the approved quantity">
          <Grid cols="1fr 1fr" gap={2}>
            <Box sx={{ p: 2, borderRadius: '14px', bgcolor: statusColors.amber.bg, color: statusColors.amber.fg }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'inherit' }}>Short delivery</Typography>
              <Typography sx={{ fontSize: 12, color: 'inherit' }}>Hero confirms 20 of 24. The missing 4 stay in transit and are flagged for admin follow-up.</Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: '14px', bgcolor: statusColors.red.bg, color: statusColors.red.fg }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'inherit' }}>Not received after 3 days</Typography>
              <Typography sx={{ fontSize: 12, color: 'inherit' }}>Request moves to “Needs follow-up” and the Hero is notified.</Typography>
            </Box>
          </Grid>
        </Card>
      </Stack>
    </>
  );
}

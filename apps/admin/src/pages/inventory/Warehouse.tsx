import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import EditOutlined from '@mui/icons-material/EditOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import PageHeader from '../../components/PageHeader';
import { Avatar, Btn, Card, DataTable, Grid, hair, Pill, Progress, Stack, Tag, type Tone } from '../../components/kit';
import { DetailBar, InfoRow, ProfileHero, SubTabs } from '../../components/profile';

const ZONES: [string, number, string][] = [
  ['Bay A · Paper goods', 88, '#145233'],
  ['Bay B · Cleaning refills', 76, '#145233'],
  ['Bay C · Kids & rewards', 58, '#4F8A63'],
  ['Bay D · Packing area', 94, '#E5574B'],
];
const SHIPMENTS: { id: number; n: string; s: string; i: string; a: string; st: string; t: Tone }[] = [
  { id: 1, n: 'SH-3381', s: 'EcoSupply Co.', i: '2 pallets', a: 'Tomorrow 9 am', st: 'In transit', t: 'blue' },
  { id: 2, n: 'SH-3374', s: 'GreenPaper Ltd', i: '5 pallets', a: '16 Oct', st: 'Scheduled', t: 'amber' },
  { id: 3, n: 'SH-3360', s: 'CleanRefill Co.', i: '1 pallet', a: '10 Oct', st: 'Received', t: 'green' },
];

export default function Warehouse() {
  const [tab, setTab] = useState('Overview');
  return (
    <>
      <PageHeader title="Greenfield Warehouse" helper="Big Hero · Main fulfilment centre · live since 05 Jan 2026" />
      <DetailBar
        pills={<><Pill>Active</Pill><Pill tone="red" dot={false}>Big Hero</Pill></>}
        actions={
          <>
            <Btn icon={<ChatBubbleOutline />}>Message</Btn>
            <Btn icon={<Inventory2Outlined />}>Restock order</Btn>
            <Btn kind="primary" icon={<EditOutlined />}>Edit warehouse</Btn>
          </>
        }
      />
      <Stack>
        <ProfileHero initials="GW" tone="red" name="Greenfield Warehouse" badge={<Pill>Active</Pill>} meta="12 heroes assigned · Bay capacity 82% · Manager: Dev T." stats={[{ value: '4,820', label: 'Units in stock' }, { value: '82%', label: 'Bay space used' }, { value: '12', label: 'Heroes' }, { value: '3', label: 'Requests' }]} />
        <SubTabs tabs={['Overview', 'Inventory', 'Shipments', 'Heroes', 'Costs']} value={tab} onChange={setTab} />
        <Grid cols="1.79fr 1fr">
          <Stack>
            <Card title="Capacity by zone" subtitle="Share of each bay’s capacity in use">
              {ZONES.map(([n, p, c]) => (
                <Box key={n}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{n}</Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{p}%</Typography>
                  </Box>
                  <Progress value={p} color={c} />
                </Box>
              ))}
            </Card>
            <Card title="Incoming shipments" right={<Btn small icon={<AddIcon sx={{ fontSize: 16 }} />}>Schedule</Btn>}>
              <Box sx={{ mx: -3, mb: -3 }}>
                <DataTable
                  minWidth={640}
                  rows={SHIPMENTS}
                  columns={[
                    { label: 'Shipment', w: 100, render: (r) => <Typography sx={{ fontSize: 12 }}>{r.n}</Typography> },
                    { label: 'Supplier', render: (r) => <Typography sx={{ fontSize: 12 }}>{r.s}</Typography> },
                    { label: 'Items', w: 90, render: (r) => <Typography sx={{ fontSize: 12 }}>{r.i}</Typography> },
                    { label: 'Arrives', w: 120, render: (r) => <Typography sx={{ fontSize: 12 }}>{r.a}</Typography> },
                    { label: 'Status', w: 110, render: (r) => <Pill tone={r.t}>{r.st}</Pill> },
                  ]}
                />
              </Box>
            </Card>
          </Stack>
          <Stack>
            <Card title="Manager">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar initials="DT" tone="purple" size={44} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Dev T.</Typography>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Operations manager</Typography>
                </Box>
                <Btn small>Message</Btn>
              </Box>
            </Card>
            <Card title="Location">
              <Box sx={{ mt: -1 }}>
                <InfoRow icon={<PlaceOutlined />} label="Address" value="4 Industrial Row, Greenfield" />
                <InfoRow icon={<PhoneOutlined />} label="Phone" value="+61 3 9000 4488" />
                <InfoRow icon={<AccessTimeOutlined />} label="Hours" value="Mon–Sat · 6 am – 7 pm" last />
              </Box>
            </Card>
            <Card title="Heroes on site today" right={<Pill dot={false}>4 of 12</Pill>}>
              {[{ i: 'JK', t: 'green' as const, n: 'James K.', s: 'Loading · Bay A' }, { i: 'LC', t: 'amber' as const, n: 'Lena C.', s: 'Packing · Bay D' }, { i: 'OD', t: 'blue' as const, n: 'Omar D.', s: 'Pickup · Dock 2' }].map((h, k) => (
                <Box key={h.i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: k ? 1.5 : 0, borderTop: k ? hair : 0 }}>
                  <Avatar initials={h.i} tone={h.t} size={40} />
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{h.n}</Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{h.s}</Typography>
                  </Box>
                </Box>
              ))}
            </Card>
          </Stack>
        </Grid>
      </Stack>
    </>
  );
}

export { Tag };

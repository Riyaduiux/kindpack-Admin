import { useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import Check from '@mui/icons-material/Check';
import PrintOutlined from '@mui/icons-material/PrintOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import MailOutline from '@mui/icons-material/MailOutline';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import ArrowForward from '@mui/icons-material/ArrowForward';
import PageHeader from '../../components/PageHeader';
import { Avatar, Btn, Card, Check as Tick, Field, Grid, hair, Input, KV, Modal, Pill, Stack, Tag } from '../../components/kit';
import { DetailBar, InfoRow } from '../../components/profile';
import { brand, forest } from '../../theme';

const STEPS: [string, string][] = [['Placed', '9:14 am'], ['Paid', '9:15 am'], ['Packed', '10:02 am'], ['Picked up', '11:20 am'], ['Delivered', '12:05 pm']];
const ITEMS = [
  { n: 'Toilet paper rolls (recycled)', s: 'Pack of 12 · 100% recycled', q: 4, p: 'AUD 48.00', t: 'green' },
  { n: 'Gentle shampoo refill', s: '500 ml · certification evidence pending', q: 5, p: 'AUD 30.00', t: 'amber' },
  { n: 'Dishwashing liquid refill', s: '1 L · KP-DW-02 · ESG data missing', q: 4, p: 'AUD 22.00', t: 'amber' },
];
const ACTIVITY: { i: ReactNode; red?: boolean; t: string; s: string; time: string }[] = [
  { i: <ErrorOutline />, red: true, t: 'Refund requested', s: '“Item damaged” · Grace Walker', time: '3:40 pm' },
  { i: <Check />, t: 'Delivered to doorstep', s: 'Signed by customer · photo receipt', time: '12:05 pm' },
  { i: <LocalShippingOutlined />, t: 'Picked up by Omar D.', s: 'Zone 2 · Scooter', time: '11:20 am' },
  { i: <Inventory2Outlined />, t: 'Packed at Greenfield warehouse', s: 'Packer: Dev T.', time: '10:02 am' },
  { i: <ShoppingBagOutlined />, t: 'Order placed & paid', s: 'Card ending 4821', time: '9:14 am' },
];

export default function OrderDetail() {
  const [params] = useSearchParams();
  const [modal, setModal] = useState(params.get('modal') === 'refund');
  const [done, setDone] = useState<'approved' | 'rejected' | null>(null);

  return (
    <>
      <PageHeader title="Order #KP-10479" helper="Refill order · placed 12 Oct 2026, 9:14 am" />
      <DetailBar
        pills={
          <>
            <Pill>Delivered</Pill>
            <Pill tone={done === 'approved' ? 'green' : done === 'rejected' ? 'grey' : 'red'}>{done === 'approved' ? 'Refund approved' : done === 'rejected' ? 'Refund rejected' : 'Refund requested'}</Pill>
          </>
        }
        actions={
          <>
            <Btn icon={<PrintOutlined />}>View cost & profit</Btn>
            <Btn icon={<PrintOutlined />}>Print</Btn>
            <Btn icon={<LocalShippingOutlined />}>Reassign hero</Btn>
            <Btn sx={{ color: '#B3261E', borderColor: 'rgba(179,38,30,0.25)' }} onClick={() => setDone('rejected')}>Reject refund</Btn>
            <Btn kind="primary" icon={<Check />} onClick={() => setModal(true)}>Approve refund</Btn>
          </>
        }
      />
      <Stack gap={3.5}>
        <Card title="Delivery progress" subtitle="All steps completed — refund requested after delivery">
          <Box sx={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', pb: 0.5 }}>
            {STEPS.map(([n, t], i) => (
              <Box key={n} sx={{ display: 'flex', alignItems: 'flex-start', flex: i < STEPS.length - 1 ? 1 : 'none', minWidth: i < STEPS.length - 1 ? 110 : 0 }}>
                <Box sx={{ textAlign: 'center', width: 64, flexShrink: 0 }}>
                  <Box sx={{ width: 34, height: 34, mx: 'auto', borderRadius: '17px', bgcolor: forest[700], display: 'grid', placeItems: 'center', '& svg': { color: '#fff', fontSize: 19 } }}><Check /></Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, mt: 0.75 }}>{n}</Typography>
                  <Typography sx={{ fontSize: 11, color: brand.placeholder }}>{t}</Typography>
                </Box>
                {i < STEPS.length - 1 ? <Box sx={{ flex: 1, height: 3, mt: '15px', mx: 1, borderRadius: 2, bgcolor: forest[700] }} /> : null}
              </Box>
            ))}
          </Box>
        </Card>

        <Grid cols={{ xs: '1fr', lg: '1.75fr 1fr' }} gap={3.5}>
          <Stack gap={3.5}>
            <Card title="Items" subtitle="3 products · 13 units">
              {ITEMS.map((it, k) => (
                <Box key={it.n} sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: k ? 2 : 0, borderTop: k ? hair : 0 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: it.t === 'green' ? '#E3F1E7' : '#FBEFD3', display: 'grid', placeItems: 'center', '& svg': { color: it.t === 'green' ? '#1C6B3B' : '#8A5A00' } }}><Inventory2Outlined /></Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{it.n}</Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{it.s}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>× {it.q}</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, minWidth: 80, textAlign: 'right' }}>{it.p}</Typography>
                </Box>
              ))}
            </Card>
            <Card title="Activity" subtitle="Everything that happened on this order">
              {ACTIVITY.map((a) => (
                <Box key={a.t} sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: a.red ? '#FBE3E0' : '#E8F2EA', display: 'grid', placeItems: 'center', '& svg': { fontSize: 20, color: a.red ? '#B3261E' : '#1C6B3B' } }}>{a.i}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{a.t}</Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{a.s}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: brand.placeholder }}>{a.time}</Typography>
                </Box>
              ))}
            </Card>
          </Stack>

          <Stack gap={3.5}>
            <Card title="Customer">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar initials="GW" tone="blue" size={46} />
                <Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 600 }}>Grace Walker</Typography>
                  <Tag>Family member</Tag>
                </Box>
              </Box>
              <Box>
                <InfoRow icon={<MailOutline />} label="" value="grace.walker@mail.com" />
                <InfoRow icon={<PhoneOutlined />} label="" value="+61 412 998 120" />
                <InfoRow icon={<PlaceOutlined />} label="" value="12 Oak Lane, Greenfield" last />
              </Box>
            </Card>
            <Card title="Payment">
              <KV rows={[['Subtotal', 'AUD 100.00'], ['Delivery', 'AUD 0.00'], ['School profit share (50% of AUD 30.00 profit) · illustrative', 'AUD 15.00']]} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: hair, pt: 2 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Total paid</Typography>
                <Typography sx={{ fontSize: 24, fontWeight: 600 }}>AUD 100.00</Typography>
              </Box>
            </Card>
            <Card title="Refund request" subtitle="Needs a decision">
              <Pill tone="red" dot={false}>Customer reason</Pill>
              <Typography sx={{ fontSize: 13 }}>“One bottle arrived cracked and leaked onto the other items.”</Typography>
              <Field label="Refund amount"><Input value="AUD 6.00" /></Field>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Btn full sx={{ color: '#B3261E', borderColor: 'rgba(179,38,30,0.25)' }} onClick={() => setDone('rejected')}>Reject</Btn>
                <Btn kind="primary" full icon={<Check />} onClick={() => setModal(true)}>Approve refund</Btn>
              </Box>
            </Card>
            <Card title="School & fulfilment" subtitle="Linked school and fulfilment source">
              <KV rows={[['Customer role', 'Family member'], ['Linked school', 'Greenfield Primary'], ['Fulfilment source', 'Local Hero · Omar D.'], ['Items', '3 products · 13 units'], ['Payment status', 'Paid · card ending 4821'], ['Receipt', 'Sent 12 Oct · 9:15 am']]} />
            </Card>
          </Stack>
        </Grid>

        <Card title="Impact of this order" subtitle="Illustrative · quantity × the value saved on each product">
          <Grid cols={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
            {[['2.58 kg', 'CO₂e saved'], ['260 g', 'Plastic avoided'], ['—', 'Water (not set)']].map(([v, l]) => (
              <Box key={l} sx={{ p: '18px 20px', borderRadius: '14px', bgcolor: '#EEF5EF' }}>
                <Typography sx={{ fontSize: 24, fontWeight: 600, color: forest[800] }}>{v}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{l}</Typography>
              </Box>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Dishwashing refill has no ESG data yet, so it is left out. Adds to family, school and platform totals.</Typography>
            <Btn small endIcon={<ArrowForward />} to="/esg">View ESG roll-up</Btn>
          </Box>
        </Card>
      </Stack>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Approve refund of AUD 6.00?"
        subtitle="The money goes back to the original payment method within 3–5 business days."
        icon={<Check />}
        footer={<><Btn onClick={() => setModal(false)}>Cancel</Btn><Btn kind="primary" icon={<Check />} onClick={() => { setDone('approved'); setModal(false); }}>Approve refund</Btn></>}
      >
        <KV rows={[['Order', '#KP-10479'], ['Customer', 'Grace Walker'], ['Refund to', 'Visa ••••4821'], ['School contribution', '–AUD 0.60']]} />
        <Tick label="Notify Grace by email" on />
      </Modal>
    </>
  );
}

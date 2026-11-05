import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlined from '@mui/icons-material/EditOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import WarningAmber from '@mui/icons-material/WarningAmber';
import TopBar from '../../layout/TopBar';
import { Avatar, Btn, Card, DataTable, Grid, hair, Person, Pill, PillTabs, Progress, RelatedLinks, RoundBtn, SearchField, Stack, Toolbar, type AvatarTone, type Tone } from '../../components/kit';
import { brand, forest } from '../../theme';

const PRODUCTS: { id: number; ini: string; tone: AvatarTone; name: string; sub: string; sku: string; pct: number; label: string; price: string; status: string; tint: Tone; bar: string }[] = [
  { id: 1, ini: 'TP', tone: 'green', name: 'Toilet paper rolls', sub: '100% recycled · 12 pack', sku: 'KP-TP-12', pct: 82, label: '82%', price: 'AUD 12.00', status: 'In stock', tint: 'green', bar: forest[700] },
  { id: 2, ini: 'SH', tone: 'amber', name: 'Gentle shampoo', sub: 'Refillable · 500 ml', sku: 'KP-SH-05', pct: 34, label: '210 units', price: 'AUD 6.00', status: 'Low', tint: 'amber', bar: '#E8A63A' },
  { id: 3, ini: 'DW', tone: 'blue', name: 'Dishwashing refill', sub: 'Certification evidence pending', sku: 'KP-DW-02', pct: 78, label: '640 units', price: 'AUD 5.50', status: 'In stock', tint: 'green', bar: forest[700] },
  { id: 4, ini: 'AP', tone: 'red', name: 'All-purpose cleaner', sub: '1 L refill', sku: 'KP-AP-01', pct: 9, label: '48 units', price: 'AUD 7.00', status: 'Reorder', tint: 'red', bar: '#E5574B' },
  { id: 5, ini: 'CB', tone: 'purple', name: 'Colouring book', sub: 'Eco-learning', sku: 'KP-CB-01', pct: 80, label: '710 units', price: 'AUD 4.00', status: 'In stock', tint: 'green', bar: forest[700] },
  { id: 6, ini: 'RC', tone: 'red', name: 'Reward chart', sub: 'Gamified tasks', sku: 'KP-RC-01', pct: 8, label: '27 units', price: 'AUD 3.00', status: 'Reorder', tint: 'red', bar: '#E5574B' },
];

const REQUESTS: { i: string; t: AvatarTone; n: string; s: string; st: string; tone: Tone }[] = [
  { i: 'JK', t: 'green', n: 'James K.', s: 'Zone 4 · 6 × Shampoo', st: 'Pending', tone: 'amber' },
  { i: 'LC', t: 'amber', n: 'Lena C.', s: 'Zone 4 · 12 × Toilet paper', st: 'Packing', tone: 'blue' },
  { i: 'MA', t: 'blue', n: 'Maya A.', s: 'Zone 1 · 4 × All-purpose', st: 'Pending', tone: 'amber' },
];

export default function Products() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Products');
  const [q, setQ] = useState('');
  const rows = PRODUCTS.filter((p) => !q || (p.name + p.sku).toLowerCase().includes(q.toLowerCase()));
  return (
    <Stack gap={3}>
      <TopBar title="Product list" helper="Stock levels, products and restock requests." />
      <Box sx={{ mt: -1.5 }}>
        <RelatedLinks links={[{ label: 'Categories', to: '/catalog/categories' }, { label: 'Stock quantities', to: '/inventory/stock' }]} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '18px 24px', borderRadius: '20px', background: 'linear-gradient(95deg,#F6D589,#F2B84B)', flexWrap: 'wrap' }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.4)', display: 'grid', placeItems: 'center', color: '#5C3A00' }}>
          <WarningAmber />
        </Box>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#3A2800' }}>3 products are below the reorder level</Typography>
          <Typography sx={{ fontSize: 13, color: '#5C3A00' }}>Greenfield Warehouse · Shampoo, All-purpose cleaner, Reward chart</Typography>
        </Box>
        <Btn kind="primary" onClick={() => navigate('/inventory/stock')}>Create restock order</Btn>
      </Box>

      <Toolbar
        left={<PillTabs tabs={['Products', 'Bundles', 'Big Heroes', 'Restock orders']} value={tab} onChange={setTab} />}
        right={
          <>
            <SearchField placeholder="Search products or SKU…" value={q} onChange={setQ} width={290} />
            <Btn icon={<FileDownloadOutlined />}>Import</Btn>
            <Btn kind="primary" icon={<AddIcon />} onClick={() => navigate('/catalog/new')}>Add product</Btn>
          </>
        }
      />

      <Grid cols="1.79fr 1fr">
        <Card title="Products" subtitle="1,842 units in stock · 128 SKUs" pad={0} sx={{ overflow: 'hidden' }}>
          <Box sx={{ pt: 0.5 }}>
            <DataTable
              minWidth={760}
              rows={rows}
              columns={[
                { label: 'Product', render: (r) => <Person initials={r.ini} tone={r.tone} name={r.name} sub={r.sub} size={44} /> },
                { label: 'SKU', w: 110, render: (r) => <Typography sx={{ fontSize: 13 }}>{r.sku}</Typography> },
                { label: 'Units on hand', w: 190, render: (r) => <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Box sx={{ width: 90 }}><Progress value={r.pct} color={r.bar} /></Box><Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{r.label}</Typography></Box> },
                { label: 'Price', w: 100, render: (r) => <b>{r.price}</b> },
                { label: 'Status', w: 100, render: (r) => <Pill tone={r.tint}>{r.status}</Pill> },
                { label: '', w: 44, render: () => <RoundBtn label="Edit product" onClick={() => navigate('/catalog/new')}><EditOutlined /></RoundBtn> },
              ]}
            />
          </Box>
        </Card>
        <Card title="Hero refill requests" subtitle="Awaiting warehouse" right={<Pill tone="amber" dot={false}>3 pending</Pill>}>
          <Box>
            {REQUESTS.map((r) => (
              <Box key={r.n} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.75, borderTop: hair }}>
                <Avatar initials={r.i} tone={r.t} size={44} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{r.n}</Typography>
                  <Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>{r.s}</Typography>
                </Box>
                <Pill tone={r.tone}>{r.st}</Pill>
              </Box>
            ))}
          </Box>
          <Btn full onClick={() => navigate('/inventory/requests')}>Review all requests</Btn>
        </Card>
      </Grid>
    </Stack>
  );
}

export { brand };

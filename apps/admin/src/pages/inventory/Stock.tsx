import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import WarningAmber from '@mui/icons-material/WarningAmber';
import WarehouseOutlined from '@mui/icons-material/WarehouseOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import ViewInArOutlined from '@mui/icons-material/ViewInArOutlined';
import TopBar from '../../layout/TopBar';
import { Btn, DataTable, Field, FilterChip, Input, Pager, Pill, PillTabs, Progress, RelatedLinks, RoundBtn, SearchField, Select, SidePanel, Stack, StatRow, TextArea, Toolbar, type Tone } from '../../components/kit';
import { statusColors } from '../../theme';

const TILES: Record<string, { bg: string; fg: string }> = {
  green: { bg: '#DCEFE0', fg: '#145233' },
  amber: { bg: '#FBE9C4', fg: '#8A5A00' },
  blue: { bg: '#DCEAF8', fg: '#1D4F91' },
  red: { bg: '#F4DAD5', fg: '#B3261E' },
  purple: { bg: '#E7E0F6', fg: '#5B3FA8' },
};
export const ProductCell = ({ name, sku, tone }: { name: string; sku: string; tone: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: TILES[tone].bg, color: TILES[tone].fg, display: 'grid', placeItems: 'center' }}>
      <ViewInArOutlined sx={{ fontSize: 20 }} />
    </Box>
    <Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{name}</Typography>
      <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{sku}</Typography>
    </Box>
  </Box>
);

const STOCK: { id: number; name: string; sku: string; tone: string; loc: string; wh: string; hero: string; heroSub: string; unit: string; rp: string; pct: number; bar: string; status: string; tint: Tone }[] = [
  { id: 1, name: 'Toilet paper rolls', sku: 'KP-TP-12', tone: 'green', loc: 'Main · A-01 · Bay 2', wh: '1,240', hero: '38 units', heroSub: 'James K. 12 · Priya S. 14 · 2 more', unit: 'packs', rp: '400', pct: 100, bar: '#1F6B45', status: 'In stock', tint: 'green' },
  { id: 2, name: 'Gentle shampoo refill', sku: 'KP-SH-05', tone: 'amber', loc: 'Main · A-03 · Bay 1', wh: '860', hero: '74 units', heroSub: 'Marcus L. 30 · Amara O. 24 · 2 more', unit: 'bottles', rp: '300', pct: 100, bar: '#1F6B45', status: 'In stock', tint: 'green' },
  { id: 3, name: 'Dishwashing liquid refill', sku: 'KP-DW-02', tone: 'blue', loc: 'Main · B-02 · Bay 4', wh: '90', hero: '18 units', heroSub: 'James K. 6 · Tuan N. 12', unit: 'bottles', rp: '200', pct: 45, bar: '#8A5A00', status: 'Low stock', tint: 'amber' },
  { id: 4, name: 'All-purpose cleaner', sku: 'KP-AP-01', tone: 'red', loc: 'Main · B-02 · Bay 5', wh: '22', hero: '2 units', heroSub: 'Amara O. 2', unit: 'bottles', rp: '150', pct: 15, bar: '#C0392B', status: 'Critical', tint: 'red' },
  { id: 5, name: 'Colouring activity book', sku: 'KP-CB-01', tone: 'purple', loc: 'Main · C-01 · Bay 1', wh: '0', hero: '15 units', heroSub: 'Tuan N. 15', unit: 'books', rp: '250', pct: 6, bar: '#C0392B', status: 'Out of stock', tint: 'red' },
];

export function AdjustStockPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState('Remove');
  const [qty, setQty] = useState('20');
  const n = Number(qty) || 0;
  const before = 90;
  const after = mode === 'Remove' ? before - n : mode === 'Add' ? before + n : n;
  const label = mode === 'Remove' ? 'Quantity to remove' : mode === 'Add' ? 'Quantity to add' : 'Revised quantity';
  return (
    <SidePanel open={open} onClose={onClose} title="Adjust stock" subtitle="Changes are logged with reason and actor" footer={<><Btn full onClick={onClose}>Cancel</Btn><Btn kind="primary" full icon={<Check />} onClick={onClose}>Confirm adjustment</Btn></>}>
      <Field label="Product"><Select value="Dishwashing liquid refill · KP-DW-02" options={['Dishwashing liquid refill · KP-DW-02', 'Toilet paper rolls · KP-TP-12', 'All-purpose cleaner · KP-AP-01']} /></Field>
      <Field label="Location"><Select value="Main warehouse · B-02 · Bay 4" options={['Main warehouse · B-02 · Bay 4', 'Main warehouse · A-01 · Bay 2']} /></Field>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Field label="Current quantity"><Input value="90 bottles" readOnly /></Field>
        <Field label="Unit"><Input value="bottles" readOnly /></Field>
      </Box>
      <Field label="Adjustment"><PillTabs tabs={['Remove', 'Add', 'Set revised quantity']} value={mode} onChange={setMode} /></Field>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Field label={label}><Input value={qty} onChange={setQty} /></Field>
        <Field label="Reason" req><Select value="Damaged" options={['Damaged', 'Recount', 'Found', 'Expired', 'Other']} /></Field>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '14px 18px', borderRadius: '14px', bgcolor: '#F3F6F2', flexWrap: 'wrap' }}>
        <Box>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Before</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>{before}</Typography>
        </Box>
        <Typography sx={{ flex: 1, textAlign: 'center', color: 'text.secondary' }}>→</Typography>
        <Box>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>After</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 600, color: after < 200 ? '#8A5A00' : 'inherit' }}>{after}</Typography>
        </Box>
        {after < 200 ? <Pill tone="amber" sx={{ ml: 'auto' }}>Below reorder point (200)</Pill> : null}
      </Box>
      <Field label="Note (optional)"><TextArea placeholder="e.g. Pallet damaged during unloading" rows={3} /></Field>
      <Box sx={{ display: 'flex', gap: 1.5, p: 2, borderRadius: '14px', bgcolor: statusColors.amber.bg, color: statusColors.amber.fg }}>
        <WarningAmber sx={{ fontSize: 20 }} />
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'inherit' }}>This changes live stock</Typography>
          <Typography sx={{ fontSize: 12, color: 'inherit' }}>Open orders that reserve this product are re-checked after saving.</Typography>
        </Box>
      </Box>
    </SidePanel>
  );
}

export function StockQuantities() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [tab, setTab] = useState('All locations');
  const [adjust, setAdjust] = useState(params.get('panel') === 'adjust');
  const [q, setQ] = useState('');
  const rows = STOCK.filter((r) => !q || (r.name + r.sku).toLowerCase().includes(q.toLowerCase()));
  return (
    <Stack gap={3}>
      <TopBar title="Stock quantities" helper="Units on hand by location. Level % = units on hand ÷ reorder point (units)." />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mt: -1.5 }}>
        <Box sx={{ flex: 1 }}>
          <RelatedLinks links={[{ label: 'Big Heroes', to: '/big-heroes' }]} />
        </Box>
        <Btn icon={<AccessTimeOutlined />} onClick={() => navigate('/inventory/movements')}>Movement history</Btn>
        <Btn kind="primary" icon={<EditOutlined />} onClick={() => setAdjust(true)}>Adjust stock</Btn>
      </Box>
      <StatRow
        stats={[
          { label: 'Warehouse stock', value: '4,820 units', icon: <WarehouseOutlined />, color: 'green' },
          { label: 'Held by Heroes', value: '612 units', icon: <LocalShippingOutlined />, color: 'blue' },
          { label: 'Low-stock products', value: '7', icon: <WarningAmber />, color: 'amber' },
          { label: 'Out of stock', value: '2', icon: <Close />, color: 'red' },
        ]}
      />
      <Toolbar
        left={<PillTabs tabs={['All locations', 'Main warehouse', 'Heroes']} value={tab} onChange={setTab} />}
        right={
          <>
            <SearchField placeholder="Search product or SKU…" value={q} onChange={setQ} width={260} />
            <FilterChip label="Location" value="All" />
            <FilterChip label="Hero" value="All" />
            <FilterChip label="Status" value="All" />
          </>
        }
      />
      <DataTable
        minWidth={1180}
        rows={rows}
        selected={new Set([2])}
        columns={[
          { label: 'Product', render: (r) => <ProductCell name={r.name} sku={r.sku} tone={r.tone} /> },
          { label: 'Location', w: 140, render: (r) => <Typography sx={{ fontSize: 12 }}>{r.loc}</Typography> },
          { label: 'Warehouse', w: 90, render: (r) => r.wh },
          { label: 'Hero stock', w: 220, render: (r) => <Box><Typography sx={{ fontSize: 13, fontWeight: 500 }}>{r.hero}</Typography><Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{r.heroSub}</Typography></Box> },
          { label: 'Unit', w: 70, render: (r) => <Typography sx={{ fontSize: 13 }}>{r.unit}</Typography> },
          { label: 'Reorder pt', w: 90, render: (r) => r.rp },
          { label: 'Level', w: 150, render: (r) => <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 80 }}><Progress value={r.pct} color={r.bar} /></Box><Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{r.pct}%</Typography></Box> },
          { label: 'Status', w: 110, render: (r) => <Pill tone={r.tint}>{r.status}</Pill> },
          { label: 'Actions', w: 96, render: () => <Box sx={{ display: 'flex', gap: 0.75 }}><RoundBtn label="Adjust" onClick={() => setAdjust(true)}><EditOutlined /></RoundBtn><RoundBtn label="History" onClick={() => navigate('/inventory/movements')}><AccessTimeOutlined /></RoundBtn></Box> },
        ]}
        footer={<Pager text="Showing 5 of 142 products" pages={['1', '2', '3']} />}
      />
      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Warehouse quantity and Hero quantity are separate counts in the same unit. Hero stock is listed by Hero; open a product to see every Hero.</Typography>
      <AdjustStockPanel open={adjust} onClose={() => setAdjust(false)} />
    </Stack>
  );
}

const MOVES: { id: number; when: string; name: string; sku: string; where: string; change: string; ba: string; reason: string; tint: Tone; by: string; ref: string }[] = [
  { id: 1, when: '12 Oct · 9:41', name: 'Dishwashing liquid refill', sku: 'KP-DW-02', where: 'Main warehouse', change: '−20', ba: '90 → 70', reason: 'Damaged', tint: 'amber', by: 'Tom L.', ref: 'ADJ-2208' },
  { id: 2, when: '12 Oct · 9:05', name: 'Toilet paper rolls', sku: 'KP-TP-12', where: 'Hero · James K.', change: '+12', ba: '0 → 12', reason: 'Hero receipt', tint: 'green', by: 'James K.', ref: 'SR-2041' },
  { id: 3, when: '12 Oct · 8:30', name: 'Toilet paper rolls', sku: 'KP-TP-12', where: 'Main warehouse', change: '−12', ba: '1,252 → 1,240', reason: 'Hero transfer', tint: 'blue', by: 'Tom L.', ref: 'SR-2041' },
  { id: 4, when: '11 Oct · 4:12', name: 'Gentle shampoo refill', sku: 'KP-SH-05', where: 'Main warehouse', change: '+600', ba: '260 → 860', reason: 'Received', tint: 'green', by: 'Anna K.', ref: 'PO-0481' },
  { id: 5, when: '11 Oct · 2:20', name: 'All-purpose cleaner', sku: 'KP-AP-01', where: 'Main warehouse', change: '−6', ba: '28 → 22', reason: 'Order #KP-10479', tint: 'grey', by: 'System', ref: 'ORD-10479' },
  { id: 6, when: '10 Oct · 5:48', name: 'Colouring activity book', sku: 'KP-CB-01', where: 'Main warehouse', change: '−2', ba: '2 → 0', reason: 'Recount', tint: 'amber', by: 'Tom L.', ref: 'ADJ-2201' },
];

export function MovementHistory() {
  return (
    <Stack gap={3}>
      <TopBar title="Stock movement history" helper="Every change to warehouse and Hero stock, with reason and who made it." />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -2 }}>
        <Btn icon={<FileDownloadOutlined />}>Export</Btn>
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchField placeholder="Product, SKU or reference…" width={250} />
        <FilterChip label="Location" value="All" />
        <FilterChip label="Hero" value="All" />
        <FilterChip label="Reason" value="All" />
        <FilterChip label="Date" value="Last 30 days" />
      </Box>
      <DataTable
        minWidth={1100}
        rows={MOVES}
        columns={[
          { label: 'Date / time', w: 130, render: (r) => <Typography sx={{ fontSize: 12 }}>{r.when}</Typography> },
          { label: 'Product', render: (r) => <Box><Typography sx={{ fontSize: 13, fontWeight: 500 }}>{r.name}</Typography><Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{r.sku}</Typography></Box> },
          { label: 'Location / Hero', w: 190, render: (r) => <Typography sx={{ fontSize: 12 }}>{r.where}</Typography> },
          { label: 'Change', w: 80, render: (r) => <Typography sx={{ fontSize: 13, fontWeight: 600, color: r.change.startsWith('+') ? '#1C6B3B' : '#B3261E' }}>{r.change}</Typography> },
          { label: 'Before → after', w: 130, render: (r) => <Typography sx={{ fontSize: 12 }}>{r.ba}</Typography> },
          { label: 'Reason', w: 150, render: (r) => <Pill tone={r.tint}>{r.reason}</Pill> },
          { label: 'By', w: 90, render: (r) => <Typography sx={{ fontSize: 12 }}>{r.by}</Typography> },
          { label: 'Reference', w: 100, render: (r) => <Typography sx={{ fontSize: 12 }}>{r.ref}</Typography> },
        ]}
        footer={<Pager text="Showing 6 of 482 movements" pages={['1', '2', '3']} />}
      />
    </Stack>
  );
}

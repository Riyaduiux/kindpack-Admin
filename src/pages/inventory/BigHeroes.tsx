import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForward from '@mui/icons-material/ArrowForward';
import TopBar from '../../layout/TopBar';
import { Btn, Card, cardSx, DataTable, Grid, Pill, PillTabs, Stack, Toolbar, type Tone } from '../../components/kit';

const ROWS: { id: number; name: string; loc: string; mgr: string; heroes: string; stock: string; cap: string; open: string; st: string; tint: Tone }[] = [
  { id: 1, name: 'Greenfield Warehouse', loc: '4 Industrial Row, Greenfield', mgr: 'Dev T.', heroes: '12', stock: '4,820', cap: '82 %', open: '5', st: 'Active', tint: 'green' },
  { id: 2, name: 'Northside Warehouse', loc: 'Northside Business Park', mgr: 'Anika P.', heroes: '8', stock: '1,100', cap: '61 %', open: '3', st: 'Active', tint: 'green' },
  { id: 3, name: 'Westbank Depot', loc: 'Westbank Docks', mgr: 'Sam R.', heroes: '6', stock: '500', cap: '35 %', open: '1', st: 'Onboarding', tint: 'amber' },
];

export default function BigHeroes() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All 3');
  const rows = ROWS.filter((r) => tab === 'All 3' || (tab === 'Active 2' && r.st === 'Active') || (tab === 'Onboarding 1' && r.st === 'Onboarding'));
  return (
    <Stack gap={3}>
      <TopBar title="Big Heroes" helper="Warehouses that hold main stock, supply Heroes and dispatch bulk and school orders" />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 3.5 }}>
        {[['3', 'Big Heroes', '#145233'], ['6,420', 'Units in stock', '#1D4F91'], ['26', 'Heroes supplied', '#1C6B3B'], ['9', 'Open dispatch orders', '#8A5A00']].map(([v, l, c]) => (
          <Box key={l} sx={{ ...cardSx, p: '21px 24px' }}>
            <Typography sx={{ fontSize: 28, fontWeight: 600, color: c, lineHeight: 1.2 }}>{v}</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{l}</Typography>
          </Box>
        ))}
      </Box>
      <Toolbar left={<PillTabs tabs={['All 3', 'Active 2', 'Onboarding 1']} value={tab} onChange={setTab} />} right={<Btn kind="primary" icon={<AddIcon />}>Add Big Hero</Btn>} />
      <Card title="Big Hero directory" subtitle="Click a Big Hero to open its stock, shipments and Heroes" pad={0} sx={{ overflow: 'hidden' }}>
        <DataTable
          minWidth={900}
          rows={rows}
          onRow={() => navigate('/inventory/warehouse')}
          columns={[
            { label: 'Big Hero', render: (r) => <b style={{ fontSize: 13 }}>{r.name}</b> },
            { label: 'Location', w: 230, render: (r) => <b style={{ fontSize: 12 }}>{r.loc}</b> },
            { label: 'Manager', w: 100, render: (r) => <span style={{ fontSize: 12 }}>{r.mgr}</span> },
            { label: 'Heroes', w: 70, render: (r) => <span style={{ fontSize: 12 }}>{r.heroes}</span> },
            { label: 'Stock (units)', w: 110, render: (r) => <span style={{ fontSize: 12 }}>{r.stock}</span> },
            { label: 'Capacity', w: 90, render: (r) => <span style={{ fontSize: 12 }}>{r.cap}</span> },
            { label: 'Open dispatch', w: 110, render: (r) => <span style={{ fontSize: 12 }}>{r.open}</span> },
            { label: 'Status', w: 110, render: (r) => <Pill tone={r.tint}>{r.st}</Pill> },
          ]}
        />
      </Card>
      <Grid cols="1fr 1fr">
        <Card title="Big Hero or Hero?" subtitle="Who does what">
          {[['Big Hero (warehouse)', 'Holds main stock · supplies Heroes · dispatches bulk and school orders · receives shipments'], ['Hero', 'Delivers locally with the stock they hold · requests more stock from a Big Hero']].map(([a, b]) => (
            <Box key={a} sx={{ p: '14px 16px', borderRadius: '12px', bgcolor: '#F3F6F2' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{a}</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{b}</Typography>
            </Box>
          ))}
        </Card>
        <Card title="Related" subtitle="Click to open">
          {[['Choose who fulfils an order', '/fulfilment'], ['Hero stock requests', '/inventory/requests'], ['Routing thresholds', '/fulfilment']].map(([a, to]) => (
            <Box key={a} component="button" type="button" onClick={() => navigate(to)} sx={{ display: 'flex', alignItems: 'center', p: '14px 16px', borderRadius: '12px', border: '1px solid rgba(11,46,31,0.07)', bgcolor: '#fff', font: 'inherit', fontSize: 13, fontWeight: 500, textAlign: 'left', cursor: 'pointer' }}>
              <Box sx={{ flex: 1 }}>{a}</Box>
              <ArrowForward sx={{ fontSize: 16, color: '#145233' }} />
            </Box>
          ))}
        </Card>
      </Grid>
    </Stack>
  );
}

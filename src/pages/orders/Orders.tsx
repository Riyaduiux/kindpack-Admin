import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import SearchOff from '@mui/icons-material/SearchOff';
import AddIcon from '@mui/icons-material/Add';
import { useFeedback } from '../../components/popups';
import TopBar from '../../layout/TopBar';
import { Btn, DataTable, Pager, Person, Pill, PillTabs, SearchField, Stack, StatRow, Toolbar, type AvatarTone, type Tone, cardSx } from '../../components/kit';

export type Order = { id: string; init: string; tone: AvatarTone; name: string; who: string; type: string; hero: string; amt: string; pay: string; payT: Tone; st: string; stT: Tone };

export const ORDERS: Order[] = [
  { id: 'KP-10482', init: 'SS', tone: 'green', name: 'Smith Family', who: 'Greenfield Primary', type: 'Subscription', hero: 'James K.', amt: 'AUD 29.00', pay: 'Paid', payT: 'green', st: 'Delivered', stT: 'green' },
  { id: 'KP-10481', init: 'BC', tone: 'amber', name: 'Brew & Co. Cafe', who: 'Business', type: 'Bulk order', hero: 'Lena C.', amt: 'AUD 99.00', pay: 'Paid', payT: 'green', st: 'On the way', stT: 'blue' },
  { id: 'KP-10480', init: 'SM', tone: 'blue', name: 'St. Mary’s Primary', who: 'School', type: 'Place order', hero: '—', amt: 'AUD 214.50', pay: 'Paid', payT: 'green', st: 'Packing', stT: 'amber' },
  { id: 'KP-10479', init: 'GW', tone: 'red', name: 'Grace Walker', who: 'Family member', type: 'Refill', hero: 'Omar D.', amt: 'AUD 100.00', pay: 'Refunding', payT: 'amber', st: 'Refund request', stT: 'red' },
  { id: 'KP-10478', init: 'EL', tone: 'purple', name: 'Ella Smith', who: 'Kid · rewards', type: 'Reward item', hero: 'James K.', amt: 'AUD 0.00', pay: 'Points', payT: 'grey', st: 'Delivered', stT: 'green' },
  { id: 'KP-10477', init: 'GP', tone: 'green', name: 'Greenfield Primary', who: 'School', type: 'Place order', hero: 'Maya A.', amt: 'AUD 320.00', pay: 'Failed', payT: 'red', st: 'On hold', stT: 'amber' },
  { id: 'KP-10476', init: 'NS', tone: 'amber', name: 'Noah Smith', who: 'Family', type: 'Subscription', hero: 'Kim N.', amt: 'AUD 29.00', pay: 'Paid', payT: 'green', st: 'Delivered', stT: 'green' },
];

const TABS = ['All 342', 'New 41', 'Packing 67', 'On the way 58', 'Delivered 162', 'Refunds 14'];
const TAB_STATUS: Record<string, string[]> = { 'New 41': ['New'], 'Packing 67': ['Packing'], 'On the way 58': ['On the way'], 'Delivered 162': ['Delivered'], 'Refunds 14': ['Refund request'] };

export default function Orders() {
  const navigate = useNavigate();
  const { popup } = useFeedback();
  const [params] = useSearchParams();
  const emptyState = params.get('state') === 'empty';
  const [tab, setTab] = useState('All 342');
  const [q, setQ] = useState(emptyState ? 'KP-99999' : '');
  const rows = ORDERS.filter((o) => (tab === 'All 342' || TAB_STATUS[tab]?.includes(o.st)) && (!q || `${o.id} ${o.name} ${o.hero}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <Stack gap={3}>
      <TopBar title="Orders" helper="Every order across families, schools, businesses and heroes." />
      <StatRow
        stats={[
          { label: 'Orders today', value: '342', icon: <ShoppingBagOutlined />, color: 'green' },
          { label: 'Out for delivery', value: '58', icon: <LocalShippingOutlined />, color: 'blue' },
          { label: 'Refund requests', value: '14', icon: <ErrorOutline />, color: 'red' },
          { label: 'Revenue today', value: 'AUD 14.2k', icon: <AccountBalanceWalletOutlined />, color: 'amber' },
        ]}
      />
      <Toolbar
        left={<PillTabs tabs={TABS} value={tab} onChange={setTab} />}
        right={
          <>
            <SearchField placeholder="Order #, customer or hero…" value={q} onChange={setQ} width={230} />
            <Btn icon={<CalendarTodayOutlined />} onClick={() => popup('dateRange')}>Last 7 days</Btn>
            <Btn icon={<FilterAltOutlined />} onClick={() => popup('filters')}>{emptyState ? 'Filters 1' : 'Filters'}</Btn>
            <Btn icon={<FileDownloadOutlined />}>Export</Btn>
          </>
        }
      />
      {rows.length === 0 ? (
        <Box sx={{ ...cardSx, py: 9, px: 3, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: '20px', bgcolor: '#EEF5EF', display: 'grid', placeItems: 'center' }}>
            <SearchOff sx={{ color: '#145233', fontSize: 30 }} />
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>No orders found</Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary', maxWidth: 440, mx: 'auto', mt: 0.5 }}>
            We could not find any order matching “{q || 'your search'}” with your current filters. Try a different search or clear the filters.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 3 }}>
            <Btn onClick={() => { setQ(''); setTab('All 342'); }}>Clear filters</Btn>
            <Btn kind="primary" icon={<AddIcon />}>Create order</Btn>
          </Box>
        </Box>
      ) : (
        <DataTable
          minWidth={980}
          rows={rows.map((o) => ({ ...o, id: o.id }))}
          rowActions={false}
          onRow={(o) => navigate(`/orders/${o.id}`)}
          columns={[
            { label: 'Order', w: 100, render: (o) => <span style={{ fontSize: 12 }}>#{o.id}</span> },
            { label: 'Customer', render: (o) => <Person initials={o.init} tone={o.tone} name={o.name} sub={o.who} /> },
            { label: 'Type', w: 100, render: (o) => <span style={{ fontSize: 12 }}>{o.type}</span> },
            { label: 'Hero', w: 80, render: (o) => <span style={{ fontSize: 12 }}>{o.hero}</span> },
            { label: 'Amount', w: 100, render: (o) => <b style={{ fontSize: 12 }}>{o.amt}</b> },
            { label: 'Payment', w: 100, render: (o) => <Pill tone={o.payT}>{o.pay}</Pill> },
            { label: 'Status', w: 130, render: (o) => <Pill tone={o.stT}>{o.st}</Pill> },
          ]}
          footer={<Pager text={`Showing 1–${rows.length} of 342 orders`} pages={['1', '2', '3']} />}
        />
      )}
    </Stack>
  );
}

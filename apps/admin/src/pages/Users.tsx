import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import WarningAmber from '@mui/icons-material/WarningAmber';
import Check from '@mui/icons-material/Check';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import { Box, Typography } from '@mui/material';
import TopBar from '../layout/TopBar';
import { BarBtn, Btn, DataTable, Pager, PillTabs, Person, Pill, RelatedLinks, SearchField, SelectionBar, Stack, StatRow, Tag, Toolbar, type AvatarTone, type Tone } from '../components/kit';
import { useModals } from './people/modals';

interface Row {
  id: number;
  ini: string;
  tone: AvatarTone;
  name: string;
  sub: string;
  role: string;
  roleTone: Tone;
  org: string;
  orders: string;
  joined: string;
  status: string;
  statusTone: Tone;
  to: string;
}

const ROWS: Row[] = [
  { id: 1, ini: 'SS', tone: 'green', name: 'Sarah Smith', sub: 'sarah.smith@mail.com', role: 'Family', roleTone: 'green', org: 'Greenfield Primary', orders: '48', joined: '12 Mar 2026', status: 'Active', statusTone: 'green', to: '/users/family' },
  { id: 2, ini: 'EL', tone: 'amber', name: 'Ella Smith', sub: 'Kid · 850 pts', role: 'Kid', roleTone: 'blue', org: 'Greenfield Primary', orders: '12', joined: '12 Mar 2026', status: 'Active', statusTone: 'green', to: '/users/member' },
  { id: 3, ini: 'SM', tone: 'blue', name: 'St. Mary’s Primary', sub: 'admin@stmarys.edu', role: 'School', roleTone: 'purple', org: '142 linked families', orders: '—', joined: '02 Feb 2026', status: 'Verified', statusTone: 'green', to: '/users/school' },
  { id: 4, ini: 'JK', tone: 'red', name: 'James K.', sub: 'james.k@mail.com', role: 'Hero', roleTone: 'amber', org: 'Zone 4 · Greenfield', orders: '312', joined: '28 Sep 2026', status: 'Pending', statusTone: 'amber', to: '/users/hero' },
  { id: 5, ini: 'BC', tone: 'purple', name: 'Brew & Co. Cafe', sub: 'accounts@brewco.com', role: 'Business', roleTone: 'grey', org: '3 team members', orders: '26', joined: '14 Jan 2026', status: 'Active', statusTone: 'green', to: '/users/business' },
  { id: 6, ini: 'GW', tone: 'green', name: 'Greenfield Warehouse', sub: 'ops@greenfield.com', role: 'Big Hero', roleTone: 'red', org: 'Main fulfilment centre', orders: '—', joined: '05 Jan 2026', status: 'Active', statusTone: 'green', to: '/big-heroes' },
  { id: 7, ini: 'GR', tone: 'amber', name: 'Grace Walker', sub: 'Family member', role: 'Family', roleTone: 'green', org: 'Greenfield Primary', orders: '9', joined: '03 Jul 2026', status: 'Invited', statusTone: 'grey', to: '/users/member' },
  { id: 8, ini: 'TB', tone: 'blue', name: 'Tom B.', sub: 'tom.b@mail.com', role: 'Hero', roleTone: 'amber', org: 'Zone 2 · Riverside', orders: '141', joined: '19 Aug 2026', status: 'Suspended', statusTone: 'red', to: '/users/hero' },
];

const TABS: [string, string | null][] = [['All 18,432', null], ['Families', 'Family'], ['Kids', 'Kid'], ['Schools', 'School'], ['Heroes', 'Hero'], ['Businesses', 'Business'], ['Big Heroes', 'Big Hero']];

export default function Users() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const m = useModals(params.get('modal') === 'invite' ? 'invite' : params.get('modal') === 'message' ? 'message' : null);
  const [tab, setTab] = useState(TABS[0][0]);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<Set<number>>(new Set([3]));
  const role = TABS.find((t) => t[0] === tab)?.[1];
  const rows = ROWS.filter((r) => (!role || r.role === role) && (!q || (r.name + r.sub).toLowerCase().includes(q.toLowerCase())));

  return (
    <Stack gap={3}>
      <TopBar title="Users" helper="Manage every family, school, hero and business on Kind Pack." />
      <Box sx={{ mt: -1.5 }}>
        <RelatedLinks links={[{ label: 'Roles & permissions', to: '/roles' }, { label: 'Approvals queue', to: '/approvals' }, { label: 'Big Heroes', to: '/big-heroes' }]} />
      </Box>
      <StatRow
        stats={[
          { label: 'Total users', value: '18,432', icon: <PeopleAltOutlined />, color: 'green' },
          { label: 'New this month', value: '1,284', icon: <AddIcon />, color: 'blue' },
          { label: 'Awaiting approval', value: '23', icon: <TaskAltOutlined />, color: 'amber' },
          { label: 'Suspended accounts', value: '14', icon: <WarningAmber />, color: 'red' },
        ]}
      />
      <Toolbar
        left={<PillTabs tabs={TABS.map((t) => t[0])} value={tab} onChange={setTab} />}
        right={
          <>
            <SearchField placeholder="Search users…" value={q} onChange={setQ} />
            <Btn icon={<FilterListOutlined />}>Filters</Btn>
            <Btn icon={<FileDownloadOutlined />}>Export</Btn>
            <Btn kind="primary" icon={<AddIcon />} onClick={m.invite}>Invite user</Btn>
          </>
        }
      />
      <DataTable
        selectable
        rowActions
        selected={sel}
        onSelect={setSel}
        onRow={(r) => navigate(r.to)}
        rows={rows}
        columns={[
          { label: 'User', render: (r) => <Person initials={r.ini} tone={r.tone} name={r.name} sub={r.sub} /> },
          { label: 'Role', w: 130, render: (r) => <Tag tone={r.roleTone}>{r.role}</Tag> },
          { label: 'Organisation', w: 230, render: (r) => r.org },
          { label: 'Orders', w: 80, render: (r) => <b>{r.orders}</b> },
          { label: 'Joined', w: 120, render: (r) => <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{r.joined}</Typography> },
          { label: 'Status', w: 130, render: (r) => <Pill tone={r.statusTone}>{r.status}</Pill> },
        ]}
        footer={<Pager text={`Showing 1–${rows.length} of 18,432 users`} />}
        minWidth={1100}
      />
      <SelectionBar count={sel.size}>
        <BarBtn icon={<ChatBubbleOutline />} onClick={m.message}>Message</BarBtn>
        <BarBtn onClick={m.suspend}>Suspend</BarBtn>
        <BarBtn light icon={<Check />}>Approve hero</BarBtn>
      </SelectionBar>
      {m.render}
    </Stack>
  );
}

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Refresh from '@mui/icons-material/Refresh';
import SellOutlined from '@mui/icons-material/SellOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import ArchiveOutlined from '@mui/icons-material/ArchiveOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import DragIndicator from '@mui/icons-material/DragIndicator';
import WarningAmber from '@mui/icons-material/WarningAmber';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import TopBar from '../../layout/TopBar';
import { Btn, Card, DataTable, Field, Grid, Input, Pager, Pill, RoundBtn, SearchField, Select, Stack, StatRow, type Tone } from '../../components/kit';
import { shadows } from '../../theme';

const CATS: { id: number; name: string; sub: string; order: string; products: string; status: string; tint: Tone; tile: string; fg: string }[] = [
  { id: 1, name: 'Paper goods', sub: 'Toilet paper, tissues', order: '1', products: '28', status: 'Active', tint: 'green', tile: 'linear-gradient(135deg,#DCEFE0,#C4E4CB)', fg: '#145233' },
  { id: 2, name: 'Personal care', sub: 'Shampoo, soap', order: '2', products: '22', status: 'Active', tint: 'green', tile: 'linear-gradient(135deg,#FBEFD3,#F6DDA0)', fg: '#8A5A00' },
  { id: 3, name: 'Cleaning', sub: 'Refills and sprays', order: '3', products: '31', status: 'Active', tint: 'green', tile: 'linear-gradient(135deg,#E0ECFB,#C6DBF5)', fg: '#1D4F91' },
  { id: 4, name: 'Kids', sub: 'Books and reward items', order: '4', products: '19', status: 'Active', tint: 'green', tile: 'linear-gradient(135deg,#ECE6FA,#D9CEF4)', fg: '#5B3FA8' },
  { id: 5, name: 'Seasonal', sub: 'Limited editions', order: '5', products: '12', status: 'In use', tint: 'amber', tile: 'linear-gradient(135deg,#FBE3E0,#F4C9C3)', fg: '#B3261E' },
];

export default function Categories() {
  const [assigned, setAssigned] = useState(['Summer sunscreen', 'Holiday soap', 'Gift pack']);
  return (
    <Stack gap={3}>
      <TopBar title="Categories" helper="Create, edit and assign categories. Categories in use cannot be removed until products are reassigned." />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -2 }}>
        <Btn kind="primary" icon={<AddIcon />}>Create category</Btn>
      </Box>
      <StatRow
        stats={[
          { label: 'Categories', value: '12', icon: <SellOutlined />, color: 'green' },
          { label: 'Active', value: '9', icon: <TaskAltOutlined />, color: 'blue' },
          { label: 'Archived', value: '3', icon: <ArchiveOutlined />, color: 'purple' },
          { label: 'Products assigned', value: '142', icon: <Inventory2Outlined />, color: 'amber' },
        ]}
      />
      <Grid cols="1.79fr 1fr">
        <Card title="All categories" subtitle="Drag to change display order" pad={0} sx={{ overflow: 'hidden' }}>
          <Box sx={{ px: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <SearchField placeholder="Search categories…" width={260} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 44, px: 2, borderRadius: '22px', bgcolor: '#fff', border: '1px solid rgba(11,46,31,0.07)', fontSize: 13 }}>
              <Box component="span" sx={{ color: 'text.secondary' }}>Status:</Box> <b>All</b> <KeyboardArrowDown sx={{ fontSize: 18 }} />
            </Box>
          </Box>
          <DataTable
            minWidth={640}
            rows={CATS}
            columns={[
              { label: '', w: 28, render: () => <DragIndicator sx={{ color: '#98A39B', fontSize: 20 }} /> },
              {
                label: 'Category',
                render: (r) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: r.tile, color: r.fg, display: 'grid', placeItems: 'center' }}>
                      <SellOutlined sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{r.name}</Typography>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{r.sub}</Typography>
                    </Box>
                  </Box>
                ),
              },
              { label: 'Order', w: 60, render: (r) => r.order },
              { label: 'Products', w: 80, render: (r) => r.products },
              { label: 'Status', w: 100, render: (r) => <Pill tone={r.tint}>{r.status}</Pill> },
              {
                label: 'Actions',
                w: 140,
                render: (r) => (
                  <Box sx={{ display: 'flex', gap: 0.75 }}>
                    <RoundBtn label="Edit"><EditOutlined /></RoundBtn>
                    <Box component="button" type="button" aria-label="Archive" sx={{ width: 40, height: 40, borderRadius: '20px', border: r.id === 5 ? 0 : '1px solid rgba(11,46,31,0.07)', bgcolor: r.id === 5 ? '#FBE3E0' : '#fff', color: r.id === 5 ? '#C94A3C' : '#5F6B62', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                      <ArchiveOutlined sx={{ fontSize: 18 }} />
                    </Box>
                    <RoundBtn label="Assign products"><GroupOutlined /></RoundBtn>
                  </Box>
                ),
              },
            ]}
            footer={<Pager text="Showing 5 of 12 categories" pages={['1', '2', '3']} />}
          />
        </Card>
        <Stack gap={3}>
          <Card title="Edit category" subtitle="Seasonal">
            <Field label="Category name" req>
              <Input value="Seasonal" />
            </Field>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Field label="Display order"><Input value="5" /></Field>
              <Field label="Status"><Select value="Active" options={['Active', 'Archived']} /></Field>
            </Box>
            <Field label="Assigned products">
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {assigned.map((p) => (
                  <Box key={p} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.5, height: 32, borderRadius: 999, bgcolor: '#E3F1E7', color: '#1C6B3B', fontSize: 11, fontWeight: 500 }}>
                    {p}
                    <Close onClick={() => setAssigned(assigned.filter((x) => x !== p))} sx={{ fontSize: 13, cursor: 'pointer' }} />
                  </Box>
                ))}
              </Box>
              <Box><Btn small icon={<AddIcon />}>Assign products</Btn></Box>
            </Field>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Btn>Cancel</Btn>
              <Btn kind="primary" icon={<Check />}>Save category</Btn>
            </Box>
          </Card>
          <Box sx={{ bgcolor: '#fff', borderRadius: '24px', boxShadow: shadows.card, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1.5, p: 2, borderRadius: '14px', bgcolor: '#FBEFD3', color: '#8A5A00' }}>
              <WarningAmber sx={{ fontSize: 20 }} />
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'inherit' }}>“Seasonal” is used by 12 products</Typography>
                <Typography sx={{ fontSize: 12, color: 'inherit' }}>It stays active until every product is moved to another category. Archiving is blocked while products are assigned.</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Btn>Cancel</Btn>
              <Btn kind="primary" icon={<Refresh />}>Reassign 12 products</Btn>
            </Box>
          </Box>
        </Stack>
      </Grid>
    </Stack>
  );
}

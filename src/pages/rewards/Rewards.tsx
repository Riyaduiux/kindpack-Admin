import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ChecklistOutlined from '@mui/icons-material/ChecklistOutlined';
import StarBorder from '@mui/icons-material/StarBorder';
import CardGiftcardOutlined from '@mui/icons-material/CardGiftcardOutlined';
import ChildCareOutlined from '@mui/icons-material/ChildCareOutlined';
import HourglassEmpty from '@mui/icons-material/HourglassEmpty';
import AddIcon from '@mui/icons-material/Add';
import Check from '@mui/icons-material/Check';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import { useFeedback } from '../../components/popups';
import TopBar from '../../layout/TopBar';
import { Banner, Btn, Card, Check as Tick, DataTable, Field, Grid, hair, Input, KV, Modal, Pager, Person, Pill, PillTabs, Progress, RelatedLinks, SearchField, Select, Stack, StatRow, TextArea, Toggle, Toolbar, type AvatarTone, type Tone } from '../../components/kit';
import { brand, forest } from '../../theme';

const cell = (t: string) => <span style={{ fontSize: 12 }}>{t}</span>;

/* ───────────── Tasks & rewards (overview) ───────────── */

const TASKS: { id: number; i: string; t: AvatarTone; n: string; cat: string; p: number; f: string; ap: string; ev: string; on: boolean }[] = [
  { id: 1, i: 'RT', t: 'green', n: 'Recycle a bottle or can', cat: 'Recycling', p: 60, f: 'Daily', ap: 'Parent', ev: 'Photo proof', on: true },
  { id: 2, i: 'WS', t: 'blue', n: 'Save water while brushing', cat: 'Water', p: 20, f: 'Daily', ap: 'None', ev: 'Self-report', on: true },
  { id: 3, i: 'RF', t: 'amber', n: 'Refill a bottle at home', cat: 'Reuse', p: 40, f: 'Weekly', ap: 'Parent', ev: 'Photo proof', on: true },
  { id: 4, i: 'ES', t: 'purple', n: 'Eco story at school', cat: 'Learning', p: 100, f: 'Weekly', ap: 'Teacher', ev: 'Teacher review', on: true },
  { id: 5, i: 'LW', t: 'amber', n: 'Lights off when leaving', cat: 'Energy', p: 15, f: 'Daily', ap: 'None', ev: 'Self-report', on: false },
];

export function RewardsOverview() {
  const [tab, setTab] = useState('Eco tasks');
  const [modal, setModal] = useState(false);
  return (
    <Stack gap={3}>
      <TopBar title="Tasks & Rewards" helper="Configure what kids can do, earn and redeem." />
      <RelatedLinks links={[{ label: 'Points rules, badges & rewards', to: '/rewards/rules' }, { label: 'Leaderboards', to: '/rewards/leaderboards' }, { label: 'Kids wallet', to: '/rewards/wallet' }, { label: 'Task review', to: '/rewards/review' }]} />
      <StatRow stats={[
        { label: 'Tasks completed (30d)', value: '48,210', icon: <ChecklistOutlined />, color: 'green' },
        { label: 'Points awarded', value: '2.9M', icon: <StarBorder />, color: 'amber' },
        { label: 'Rewards redeemed', value: '1,204', icon: <CardGiftcardOutlined />, color: 'blue' },
        { label: 'Active kids', value: '5,214', icon: <ChildCareOutlined />, color: 'purple' },
      ]} />
      <Toolbar left={<PillTabs tabs={['Eco tasks', 'Rewards shop', 'Points rules', 'Leaderboards']} value={tab} onChange={setTab} />} right={<Btn kind="primary" icon={<AddIcon />} onClick={() => setModal(true)}>New task</Btn>} />
      <Grid cols={{ xs: '1fr', xl: '2fr 1fr' }} gap={3.5}>
        <Card title="Task catalogue" subtitle="Tasks kids can complete at home and school" right={<Btn small>Manage</Btn>} pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable
            minWidth={780}
            rows={TASKS}
            columns={[
              { label: 'Task', render: (r) => <Person initials={r.i} tone={r.t} name={r.n} size={38} /> },
              { label: 'Category', w: 90, render: (r) => cell(r.cat) },
              { label: 'Points', w: 60, render: (r) => <b style={{ fontSize: 12 }}>{r.p}</b> },
              { label: 'Frequency', w: 80, render: (r) => cell(r.f) },
              { label: 'Approval', w: 120, render: (r) => <Box><div style={{ fontSize: 12 }}>{r.ap}</div><div style={{ fontSize: 10, color: '#5A625C' }}>{r.ev}</div></Box> },
              { label: 'Active', w: 60, render: (r) => <Toggle on={r.on} /> },
            ]}
          />
        </Card>
        <Stack gap={3.5}>
          <Card title="Rewards shop" subtitle="Top redeemed this month">
            {[['Reward chart', '300 pts', '412 redeemed'], ['Colouring book', '450 pts', '286 redeemed'], ['Seed kit', '800 pts', '141 redeemed']].map(([n, p, r], k) => (
              <Box key={n} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: k ? 1.5 : 0, borderTop: k ? hair : 0 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: '#FBEFD3', display: 'grid', placeItems: 'center' }}><CardGiftcardOutlined sx={{ color: '#8A5A00', fontSize: 20 }} /></Box>
                <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{n}</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{r}</Typography></Box>
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{p}</Typography>
              </Box>
            ))}
          </Card>
          <Card title="Points rules">
            <KV rows={[['Points to wallet conversion · awaiting agreement', 'Not set'], ['Daily cap per kid', '200 pts'], ['7-day streak bonus', '+50 pts'], ['School leaderboard reset', 'Monthly']]} />
          </Card>
        </Stack>
      </Grid>
      <CreateTask open={modal} onClose={() => setModal(false)} />
    </Stack>
  );
}

function CreateTask({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Create task" subtitle="Define what kids can do to earn points. Points have no cash value." icon={<AddIcon />} width={620} footer={<><Btn onClick={onClose}>Cancel</Btn><Btn kind="primary" onClick={onClose}>Save task</Btn></>}>
      <Field label="Task name" req><Input placeholder="e.g. Sort the recycling" /></Field>
      <Field label="Task description" req><TextArea placeholder="What should the kid do?" rows={2} /></Field>
      <Grid cols={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
        <Field label="Points" req><Input placeholder="15" /></Field>
        <Field label="Frequency"><Select value="Weekly" options={['Daily', 'Weekly', 'Per order', 'Per sign-up']} /></Field>
        <Field label="Evidence required"><Select value="Photo" options={['None (auto)', 'Photo', 'Self-report', 'Teacher review']} /></Field>
        <Field label="Approval route"><Select value="Parent / family" options={['Parent / family', 'School admin', 'Teacher', 'System']} /></Field>
      </Grid>
    </Modal>
  );
}

/* ───────────── Kids tasks – create & edit ───────────── */

const KT: { id: number; n: string; cat: string; p: string; f: string; ev: string; by: string; on: boolean }[] = [
  { id: 1, n: 'Complete a refill', cat: 'Order-linked', p: '+20', f: 'Per order', ev: 'None (auto)', by: 'System', on: true },
  { id: 2, n: 'Eco quiz', cat: 'Kids learning', p: '+10', f: 'Daily', ev: 'None (auto)', by: 'System', on: true },
  { id: 3, n: 'Sort the recycling', cat: 'At home', p: '+15', f: 'Weekly', ev: 'Photo', by: 'Parent', on: true },
  { id: 4, n: 'Share the school link', cat: 'Referral', p: '+50', f: 'Per sign-up', ev: 'None (auto)', by: 'System', on: true },
  { id: 5, n: 'Reusable bottle week', cat: 'School challenge', p: '+30', f: 'Weekly', ev: 'Photo', by: 'School admin', on: true },
];

export function KidsTasks() {
  return (
    <Stack gap={3}>
      <TopBar title="Kids tasks" helper="Define what kids can do to earn points. Points have no cash value." extra={<Btn kind="primary" icon={<AddIcon />}>Create task</Btn>} />
      <StatRow stats={[
        { label: 'Active tasks', value: '14', icon: <ChecklistOutlined />, color: 'green' },
        { label: 'Awaiting review', value: '9', icon: <HourglassEmpty />, color: 'amber' },
        { label: 'Tasks completed this month', value: '2,934', icon: <Check />, color: 'blue' },
        { label: 'Points awarded this month', value: '48,210', icon: <StarBorder />, color: 'purple' },
      ]} />
      <Grid cols={{ xs: '1fr', xl: '1.5fr 1fr' }} gap={3.5}>
        <Card title="All tasks" pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable
            minWidth={760}
            rows={KT}
            columns={[
              { label: 'Task', render: (r) => <Box><b style={{ fontSize: 13 }}>{r.n}</b><div style={{ fontSize: 11, color: '#5A625C' }}>{r.cat}</div></Box> },
              { label: 'Points', w: 60, render: (r) => <b style={{ fontSize: 12 }}>{r.p}</b> },
              { label: 'Frequency', w: 90, render: (r) => cell(r.f) },
              { label: 'Evidence', w: 100, render: (r) => cell(r.ev) },
              { label: 'Approved by', w: 100, render: (r) => cell(r.by) },
              { label: 'Active', w: 60, render: (r) => <Toggle on={r.on} /> },
            ]}
          />
        </Card>
        <Card title="Edit task" subtitle="Evidence and approval route are set per task" right={<Pill>Active</Pill>}>
          <Field label="Task name"><Input value="Sort the recycling" /></Field>
          <Field label="Task description" req><TextArea value="Sort the household recycling into the right bins." rows={2} /></Field>
          <Grid cols="1fr 1fr" gap={2}>
            <Field label="Points" req><Input value="15" /></Field>
            <Field label="Frequency"><Select value="Weekly" options={['Daily', 'Weekly', 'Per order']} /></Field>
            <Field label="Evidence required"><Select value="Photo" options={['None (auto)', 'Photo', 'Self-report']} /></Field>
            <Field label="Approval route"><Select value="Parent / family" options={['Parent / family', 'School admin', 'System']} /></Field>
            <Field label="Limit per period"><Input value="1" /></Field>
          </Grid>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Toggle on /><Typography sx={{ fontSize: 13 }}>Kids can see and submit this task</Typography></Box>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Points are for rewards and badges only. No cash conversion.</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}><Btn>Cancel</Btn><Btn kind="primary">Save task</Btn></Box>
        </Card>
      </Grid>
    </Stack>
  );
}

/* ───────────── Task review & points award ───────────── */

const SUBS: { id: number; i: string; t: AvatarTone; n: string; sub: string; task: string; ev: string; ap: string; d: string; st: string; s: Tone }[] = [
  { id: 1, i: 'ES', t: 'green', n: 'Emma S.', sub: 'Greenfield · Smith Family', task: 'Sort the recycling', ev: 'Photo', ap: 'Parent', d: '12 Oct', st: 'Awaiting review', s: 'amber' },
  { id: 2, i: 'LW', t: 'blue', n: 'Liam W.', sub: 'St. Mary’s · Walker Family', task: 'Reusable bottle week', ev: 'Photo', ap: 'School admin', d: '12 Oct', st: 'Awaiting review', s: 'amber' },
  { id: 3, i: 'ZH', t: 'purple', n: 'Zara H.', sub: 'Eastwood · Hill Family', task: 'Sort the recycling', ev: 'Photo', ap: 'Parent', d: '11 Oct', st: 'Info requested', s: 'blue' },
];

export function TaskReview() {
  const [tab, setTab] = useState('Awaiting review 9');
  const [res, setRes] = useState<string | null>(null);
  const { flash } = useFeedback();
  return (
    <Stack gap={3}>
      <TopBar title="Task review" helper="Review submitted evidence and award points." />
      <Toolbar left={<PillTabs tabs={['Awaiting review 9', 'Approved 212', 'Info requested 4', 'Rejected 7']} value={tab} onChange={setTab} />} right={<SearchField placeholder="Kid or task…" width={220} />} />
      <Grid cols={{ xs: '1fr', xl: '1.4fr 1fr' }} gap={3.5}>
        <Card title="Submissions" pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable
            minWidth={760}
            rows={SUBS}
            columns={[
              { label: 'Kid', render: (r) => <Person initials={r.i} tone={r.t} name={r.n} sub={r.sub} size={38} /> },
              { label: 'Task', w: 150, render: (r) => cell(r.task) },
              { label: 'Evidence', w: 70, render: (r) => cell(r.ev) },
              { label: 'Approver', w: 90, render: (r) => cell(r.ap) },
              { label: 'Submitted', w: 70, render: (r) => cell(r.d) },
              { label: 'Status', w: 130, render: (r) => <Pill tone={r.s}>{r.st}</Pill> },
            ]}
          />
        </Card>
        <Card title="Emma S. · Sort the recycling" subtitle="Submitted 12 Oct, 4:20 pm · approver: parent">
          <Box sx={{ height: 160, borderRadius: '16px', bgcolor: '#EEF5EF', display: 'grid', placeItems: 'center', color: brand.slate }}><Box sx={{ textAlign: 'center' }}><ImageOutlined sx={{ fontSize: 36 }} /><Typography sx={{ fontSize: 12 }}>Photo evidence</Typography></Box></Box>
          <Field label="Points to award"><Input value="+15 points" /></Field>
          <Field label="Message to kid (optional)"><TextArea value="Great job sorting everything!" rows={2} /></Field>
          {res ? <Banner tone={res === 'Approved' ? 'green' : res === 'Rejected' ? 'red' : 'blue'} title={res}>{res === 'Approved' ? '+15 points added to Emma S.’s wallet. New balance 855.' : res === 'Rejected' ? 'Reason sent to the kid and parent.' : 'Kid sees your question and can resubmit.'}</Banner> : null}
          <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
            <Btn sx={{ color: '#B3261E' }} onClick={() => setRes('Rejected')}>Reject…</Btn>
            <Btn onClick={() => { setRes('Information requested'); flash('task-info'); }}>Ask for info</Btn>
            <Btn kind="primary" icon={<Check />} onClick={() => { setRes('Approved'); flash('task-approved'); }}>Approve & award</Btn>
          </Box>
        </Card>
      </Grid>
      <Card title="Outcomes" subtitle="What happens after each decision">
        <Grid cols={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
          {[['Approved', 'green', '+15 points added to Emma S.’s wallet. New balance 855. Kid is notified.'], ['Information requested', 'blue', 'Kid sees your question and can resubmit. No points yet.'], ['Rejected', 'red', 'Reason is sent to the kid and parent. No points awarded.']].map(([t, tone, s]) => (
            <Box key={t} sx={{ p: '16px', borderRadius: '16px', bgcolor: '#F6F8F5' }}><Pill tone={tone as Tone}>{t}</Pill><Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>{s}</Typography></Box>
          ))}
        </Grid>
      </Card>
    </Stack>
  );
}

/* ───────────── Points rules, badges & rewards ───────────── */

export function PointsRules() {
  const [badge, setBadge] = useState(false);
  const [reward, setReward] = useState(false);
  return (
    <Stack gap={3}>
      <TopBar title="Points, badges & rewards" helper="Configurable rules for earning points and what kids can redeem them for." extra={<><Btn onClick={() => setBadge(true)}>Create badge</Btn><Btn kind="primary" icon={<AddIcon />} onClick={() => setReward(true)}>Add reward</Btn></>} />
      <Banner tone="blue" icon={<InfoOutlined />} title="Points have no cash value">There is no conversion to AUD and no withdrawal. A points-to-dollar rate is not defined and is awaiting business agreement.</Banner>
      <Grid cols={{ xs: '1fr', xl: '1fr 1fr' }} gap={3.5}>
        <Card title="Points rules" subtitle="Illustrative values · configurable" pad={0} sx={{ overflow: 'hidden' }}>
          <DataTable minWidth={460} rows={[{ id: 1, t: 'Order completed', p: '+20', c: 'Per order' }, { id: 2, t: 'Refill order completed', p: '+20', c: 'Per order' }, { id: 3, t: 'Referral registered & approved', p: '+50', c: 'Per sign-up' }, { id: 4, t: 'First order bonus', p: '+100', c: 'Once' }]} columns={[{ label: 'Trigger', render: (r) => cell(r.t) }, { label: 'Points', w: 60, render: (r) => <b style={{ fontSize: 12 }}>{r.p}</b> }, { label: 'Cap', w: 90, render: (r) => cell(r.c) }, { label: 'Active', w: 60, render: () => <Toggle on /> }]} />
        </Card>
        <Card title="Badge rules" subtitle="Award criteria" pad={0} sx={{ overflow: 'hidden' }}>
          <DataTable minWidth={520} rows={[{ id: 1, b: 'Eco Starter', k: 'Bronze', c: 'First refill', a: '412', s: 'Active', t: 'green' as Tone }, { id: 2, b: 'Green Hero', k: 'Gold', c: '50 deliveries', a: '86', s: 'Active', t: 'green' as Tone }, { id: 3, b: 'School Champion', k: 'Silver', c: 'Top 3 school', a: '64', s: 'Active', t: 'green' as Tone }, { id: 4, b: 'Plastic Saver', k: 'Seasonal', c: '10 refills', a: '50', s: 'Draft', t: 'amber' as Tone }]} columns={[{ label: 'Badge', render: (r) => <Box><b style={{ fontSize: 12 }}>{r.b}</b><div style={{ fontSize: 10, color: '#5A625C' }}>{r.k}</div></Box> }, { label: 'Criterion', w: 110, render: (r) => cell(r.c) }, { label: 'Awarded', w: 70, render: (r) => cell(r.a) }, { label: 'Status', w: 80, render: (r) => <Pill tone={r.t}>{r.s}</Pill> }]} />
        </Card>
        <Card title="Reward catalog" subtitle="Items kids can redeem with points" pad={0} sx={{ overflow: 'hidden' }}>
          <DataTable minWidth={560} rows={[{ id: 1, r: 'Plant-a-tree certificate', k: 'Digital', c: '200 pts', s: 'Unlimited', d: '126', st: 'Active', t: 'green' as Tone }, { id: 2, r: 'Reusable bottle', k: 'Physical', c: '600 pts', s: '40', d: '18', st: 'Low stock', t: 'amber' as Tone }, { id: 3, r: 'Eco sticker pack', k: 'Physical', c: '100 pts', s: '180', d: '212', st: 'Active', t: 'green' as Tone }, { id: 4, r: 'School badge pin', k: 'Physical', c: '150 pts', s: '0', d: '31', st: 'Out of stock', t: 'red' as Tone }]} columns={[{ label: 'Reward', render: (r) => <Box><b style={{ fontSize: 12 }}>{r.r}</b><div style={{ fontSize: 10, color: '#5A625C' }}>{r.k}</div></Box> }, { label: 'Cost', w: 70, render: (r) => cell(r.c) }, { label: 'In stock', w: 80, render: (r) => cell(r.s) }, { label: 'Redeemed', w: 80, render: (r) => cell(r.d) }, { label: 'Status', w: 100, render: (r) => <Pill tone={r.t}>{r.st}</Pill> }]} />
        </Card>
        <Card title="Redemption states" subtitle="Recent requests">
          {[['ES', 'green', 'Emma S.', 'Fulfilled', 'green'], ['LW', 'blue', 'Liam W.', 'Requested', 'amber'], ['ZH', 'purple', 'Zara H.', 'Approved · ready', 'blue'], ['NP', 'amber', 'Noah P.', 'Declined · out of stock', 'red']].map(([i, t, n, s, tone]) => (
            <Box key={n} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}><Person initials={i} tone={t as AvatarTone} name={n} size={36} /><Pill tone={tone as Tone}>{s}</Pill></Box>
          ))}
        </Card>
      </Grid>
      <Modal open={badge} onClose={() => setBadge(false)} title="Create badge" subtitle="Badges are awarded automatically when the criterion is met." icon={<StarBorder />} footer={<><Btn onClick={() => setBadge(false)}>Cancel</Btn><Btn kind="primary" onClick={() => setBadge(false)}>Create badge</Btn></>}>
        <Field label="Badge name" req><Input placeholder="e.g. Water Saver" /></Field>
        <Field label="Tier"><Select value="Bronze" options={['Bronze', 'Silver', 'Gold', 'Seasonal']} /></Field>
        <Field label="Award criterion" req><Input placeholder="e.g. 10 refills" /></Field>
      </Modal>
      <Modal open={reward} onClose={() => setReward(false)} title="Add reward" subtitle="Items kids can redeem with points." icon={<CardGiftcardOutlined />} footer={<><Btn onClick={() => setReward(false)}>Cancel</Btn><Btn kind="primary" onClick={() => setReward(false)}>Add reward</Btn></>}>
        <Field label="Reward name" req><Input placeholder="e.g. Seed kit" /></Field>
        <Grid cols="1fr 1fr" gap={2}>
          <Field label="Points cost" req><Input placeholder="450" /></Field>
          <Field label="Type"><Select value="Physical" options={['Physical', 'Digital']} /></Field>
        </Grid>
        <Tick label="Limited stock" />
      </Modal>
    </Stack>
  );
}

/* ───────────── Kids wallet ───────────── */

export function KidsWallet() {
  const [adj, setAdj] = useState(false);
  return (
    <Stack gap={3}>
      <TopBar title="Emma Smith · points wallet" helper="Kid · Greenfield Primary · Smith Family · points are not cash and cannot be withdrawn" extra={<Btn kind="primary" onClick={() => setAdj(true)}>Adjust points…</Btn>} />
      <StatRow stats={[
        { label: 'Points earned', value: '1,240', icon: <StarBorder />, color: 'green' },
        { label: 'Points spent on rewards', value: '400', icon: <CardGiftcardOutlined />, color: 'amber' },
        { label: 'Current points', value: '840', icon: <StarBorder />, color: 'blue' },
        { label: 'Badges earned', value: '3', icon: <Check />, color: 'purple' },
      ]} />
      <Grid cols={{ xs: '1fr', xl: '1.6fr 1fr' }} gap={3.5}>
        <Card title="Transactions" subtitle="Every change with its reason and linked task or reward" pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable
            minWidth={640}
            rows={[{ id: 1, d: '12 Oct', r: 'Task approved', l: 'Complete a refill', p: '+20', b: '840' }, { id: 2, d: '10 Oct', r: 'Reward redeemed', l: 'Plant-a-tree certificate', p: '−200', b: '820' }, { id: 3, d: '8 Oct', r: 'Task approved', l: 'Eco quiz', p: '+10', b: '1,020' }, { id: 4, d: '5 Oct', r: 'Referral approved', l: 'Referral registered', p: '+50', b: '1,010' }, { id: 5, d: '1 Oct', r: 'Reward redeemed', l: 'Eco sticker pack', p: '−200', b: '960' }, { id: 6, d: '28 Sep', r: 'Task approved', l: 'First order bonus', p: '+100', b: '1,160' }]}
            columns={[{ label: 'Date', w: 70, render: (r) => cell(r.d) }, { label: 'Reason', w: 150, render: (r) => cell(r.r) }, { label: 'Linked to', render: (r) => cell(r.l) }, { label: 'Points', w: 70, render: (r) => <b style={{ fontSize: 12, color: r.p.startsWith('+') ? forest[700] : '#B3261E' }}>{r.p}</b> }, { label: 'Balance', w: 70, render: (r) => cell(r.b) }]}
            footer={<Pager text="Showing 6 of 38 transactions" pages={['1', '2', '3']} />}
          />
        </Card>
        <Stack gap={3.5}>
          <Card title="Progress" subtitle="Towards the next badge">
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Green Hero · Gold</Typography>
            <Progress value={84} height={8} />
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>160 points to go</Typography>
          </Card>
          <Card title="Badges earned">
            {[['Eco Starter', 'Bronze · 12 Sep'], ['School Champion', 'Silver · 2 Oct'], ['Plastic Saver', 'Seasonal · 8 Oct']].map(([n, s]) => <Box key={n} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Box sx={{ width: 40, height: 40, borderRadius: '20px', bgcolor: '#FBEFD3', display: 'grid', placeItems: 'center' }}><StarBorder sx={{ color: '#8A5A00' }} /></Box><Box><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{n}</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{s}</Typography></Box></Box>)}
          </Card>
        </Stack>
      </Grid>
      <Modal open={adj} onClose={() => setAdj(false)} title="Adjust points" subtitle="Every adjustment is recorded with a reason in the wallet history." icon={<StarBorder />} footer={<><Btn onClick={() => setAdj(false)}>Cancel</Btn><Btn kind="primary" onClick={() => setAdj(false)}>Save adjustment</Btn></>}>
        <Grid cols="1fr 1fr" gap={2}>
          <Field label="Type"><Select value="Add points" options={['Add points', 'Remove points']} /></Field>
          <Field label="Points" req><Input placeholder="25" /></Field>
        </Grid>
        <Field label="Reason" req><TextArea placeholder="Why is this adjustment needed?" rows={3} /></Field>
      </Modal>
    </Stack>
  );
}

/* ───────────── Leaderboards ───────────── */

export function Leaderboards() {
  const [tab, setTab] = useState('Schools');
  return (
    <Stack gap={3}>
      <TopBar title="Leaderboards" helper="School and kid rankings with participation context. Resets monthly." extra={<Btn icon={<FileDownloadOutlined />}>Export</Btn>} />
      <StatRow stats={[
        { label: 'Kids participating (78 %)', value: '612 of 780', icon: <ChildCareOutlined />, color: 'green' },
        { label: 'Active this week', value: '402', icon: <Check />, color: 'blue' },
        { label: 'Schools on the board', value: '148', icon: <StarBorder />, color: 'amber' },
        { label: 'Until monthly reset', value: '18 days', icon: <HourglassEmpty />, color: 'purple' },
      ]} />
      <Toolbar left={<PillTabs tabs={['Schools', 'Kids (within a school)']} value={tab} onChange={setTab} />} right={<><Btn>Period: This month</Btn><Btn>Region: All</Btn></>} />
      <Grid cols={{ xs: '1fr', xl: '1.8fr 1fr' }} gap={3.5}>
        <Card title="School leaderboard" subtitle="Points earned by kids at each school this month" pad={0} sx={{ overflow: 'hidden', alignSelf: 'start' }}>
          <DataTable
            minWidth={620}
            rows={[{ id: 1, r: '#1', i: 'GP', t: 'green' as AvatarTone, n: 'Greenfield Primary', a: '86 kids active', p: '18,420', pa: '86 % of kids', v: '▲ 2 places' }, { id: 2, r: '#2', i: 'SM', t: 'blue' as AvatarTone, n: 'St. Mary’s Primary', a: '71 kids active', p: '15,980', pa: '74 % of kids', v: 'No change' }, { id: 3, r: '#3', i: 'RP', t: 'amber' as AvatarTone, n: 'Riverside Primary', a: '64 kids active', p: '12,310', pa: '69 % of kids', v: '▼ 1 place' }, { id: 4, r: '#4', i: 'EP', t: 'purple' as AvatarTone, n: 'Eastwood Primary', a: '52 kids active', p: '10,050', pa: '61 % of kids', v: '▲ 1 place' }, { id: 5, r: '#5', i: 'NP', t: 'red' as AvatarTone, n: 'Northside Primary', a: '44 kids active', p: '8,740', pa: '58 % of kids', v: 'No change' }]}
            columns={[{ label: 'Rank', w: 50, render: (r) => <b style={{ fontSize: 12 }}>{r.r}</b> }, { label: 'School', render: (r) => <Person initials={r.i} tone={r.t} name={r.n} sub={r.a} size={38} /> }, { label: 'Points', w: 70, render: (r) => <b style={{ fontSize: 12 }}>{r.p}</b> }, { label: 'Participation', w: 110, render: (r) => cell(r.pa) }, { label: 'vs last month', w: 100, render: (r) => cell(r.v) }]}
          />
        </Card>
        <Stack gap={3.5}>
          <Card title="Top kids · Greenfield Primary" subtitle="First name and initial only">
            {[['#1', 'ES', 'green', 'Emma S.', '1,240 pts'], ['#2', 'NP', 'blue', 'Noah P.', '1,105 pts'], ['#3', 'AL', 'amber', 'Ava L.', '980 pts'], ['#4', 'LW', 'purple', 'Liam W.', '905 pts']].map(([r, i, t, n, p]) => (
              <Box key={n} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Typography sx={{ fontSize: 12, fontWeight: 600, width: 24 }}>{r}</Typography><Avatar2 i={i} t={t as AvatarTone} /><Typography sx={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{n}</Typography><Typography sx={{ fontSize: 12 }}>{p}</Typography></Box>
            ))}
          </Card>
          <Card title="Board settings">
            <KV rows={[['Reset', 'Monthly · next reset 1 Nov'], ['Minimum activity to appear', '1 approved task'], ['Show kid names', 'First name + initial']]} />
          </Card>
        </Stack>
      </Grid>
    </Stack>
  );
}
function Avatar2({ i, t }: { i: string; t: AvatarTone }) {
  return <Person initials={i} tone={t} name="" size={34} />;
}

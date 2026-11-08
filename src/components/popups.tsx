import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { Box, Typography } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import Close from '@mui/icons-material/Close';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import UploadFileOutlined from '@mui/icons-material/UploadFileOutlined';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import Check from '@mui/icons-material/Check';
import WarningAmber from '@mui/icons-material/WarningAmber';
import { Btn, Check as Tick, Field, Grid, hair, Input, KV, Modal, Pill, Segmented, Select, TextArea, type Tone } from './kit';
import { brand, statusColors } from '../theme';

/* ───────────── pop-up definitions (Figma: 08 Shared pop-ups, 09 Result states) ───────────── */

type Part =
  | { f: 'input'; label: string; value?: string; placeholder?: string; req?: boolean }
  | { f: 'select'; label: string; value?: string; options?: string[]; req?: boolean }
  | { f: 'area'; label: string; value?: string; placeholder?: string; req?: boolean; rows?: number }
  | { f: 'row'; items: Part[] }
  | { f: 'checks'; items: string[]; on?: number[] }
  | { f: 'kv'; rows: [string, string][] }
  | { f: 'seg'; options: string[] }
  | { f: 'upload'; text: string; hint?: string }
  | { f: 'note'; text: string; tone?: Tone }
  | { f: 'people'; rows: [string, string, string, Tone][] };

interface Spec { title: string; subtitle?: string; icon?: ReactNode; tone?: 'green' | 'red' | 'amber'; width?: number; parts: Part[]; cancel?: string; ok: string; okKind?: 'primary' | 'danger'; done?: string }

const I = (label: string, value?: string, placeholder?: string, req?: boolean): Part => ({ f: 'input', label, value, placeholder, req });
const S = (label: string, value: string, options?: string[], req?: boolean): Part => ({ f: 'select', label, value, options: options ?? [value], req });
const A = (label: string, placeholder?: string, value?: string, req?: boolean): Part => ({ f: 'area', label, placeholder, value, req });
const R = (...items: Part[]): Part => ({ f: 'row', items });

export const POPUPS: Record<string, Spec> = {
  message: { title: 'Send message', subtitle: 'To 1 selected user · James K. (Hero)', icon: <SendOutlined />, parts: [S('Channel', 'Email and in-app', ['Email and in-app', 'In-app only', 'Email only']), I('Subject', 'Your stock request'), A('Message', 'Write your message…')], ok: 'Send message', done: 'message-sent' },
  filters: { title: 'Filters', subtitle: 'Narrow the list', icon: <FilterAltOutlined />, parts: [R(S('Role', 'All roles', ['All roles', 'Hero', 'Family', 'School', 'Business']), S('Status', 'All statuses', ['All statuses', 'Active', 'Pending', 'Suspended'])), R(S('School', 'All schools'), S('Zone', 'All zones')), S('Date joined', 'Any time', ['Any time', 'Last 7 days', 'Last 30 days'])], ok: 'Apply filters' },
  editPlan: { title: 'Edit plan', subtitle: 'Family plan · changes apply to new subscriptions', icon: <EditOutlined />, parts: [R(I('Plan name', 'Family'), I('Price (AUD)', 'AUD 29.00')), R(S('Billing period', 'Monthly', ['Monthly', 'Fortnightly']), I('Deliveries per period', '1 refill delivery')), S('Status', 'Active', ['Active', 'Paused', 'Archived']), { f: 'note', tone: 'amber', text: 'A new billing policy needs business agreement before it is published.' }], ok: 'Save plan', done: 'saved' },
  subscribers: { title: 'Family plan · subscribers', subtitle: '1,284 active · showing 5', parts: [{ f: 'people', rows: [['Smith Family', 'Greenfield Primary', 'Active', 'green'], ['Walker Family', 'St. Mary’s Primary', 'Active', 'green'], ['Nguyen Family', 'Riverside Primary', 'Paused', 'amber'], ['Hill Family', 'Eastwood Primary', 'Active', 'green'], ['Brown Family', 'Northside Primary', 'Payment failed', 'red']] }], cancel: 'Export list', ok: 'Close' },
  moreInfo: { title: 'Request more information', subtitle: 'The applicant is notified and the request stays in review', tone: 'amber', parts: [{ f: 'checks', items: ['Identity document', 'Proof of address', 'Reference contact', 'School confirmation'], on: [1] }, A('Message to applicant', 'Please upload a clear photo of your ID…', undefined, true)], ok: 'Send request', done: 'info-requested' },
  confirmApproval: { title: 'Approve this request?', subtitle: 'The person is notified and gains access for their role.', icon: <Check />, parts: [{ f: 'kv', rows: [['Applicant', 'Smith Family'], ['Type', 'Family registration'], ['Referred by', 'Greenfield Primary'], ['Members', 'Greenfield Primary']] }], ok: 'Approve', done: 'family-approved' },
  resetPassword: { title: 'Reset password', subtitle: 'A reset link is sent to the user’s email. Their current password stops working after they set a new one.', parts: [{ f: 'kv', rows: [['User', 'Sarah Smith'], ['Email', 'sarah.smith@mail.com']] }], ok: 'Send reset link', done: 'saved' },
  saved: { title: 'Saved', subtitle: 'Your changes were saved and are now in effect. This action is recorded in the audit log.', icon: <CheckCircleOutline />, parts: [], ok: 'Close' },
  dateRange: { title: 'Date range', subtitle: 'Choose the period to show', parts: [{ f: 'seg', options: ['Today', 'Last 7 days', 'Last 30 days', 'This term', 'Custom range'] }, R(I('From', '1 Oct 2026'), I('To', '12 Oct 2026'))], ok: 'Apply' },
  editDetails: { title: 'Edit details', subtitle: 'Update the profile. Changes are logged.', icon: <EditOutlined />, parts: [R(I('Name', 'Greenfield Primary'), I('Contact person', 'Anna K.')), R(I('Email', 'anna.k@greenfield.edu'), I('Phone', '+61 3 9000 1234')), S('Status', 'Active', ['Active', 'Paused'])], ok: 'Save changes', done: 'saved' },
  linkSchool: { title: 'Link another school', subtitle: 'Orders and contributions are tagged with the school they support.', parts: [I('School', undefined, 'Search schools…'), S('Relationship', 'Also supports', ['Also supports', 'Primary school']), { f: 'note', tone: 'blue', text: 'The school or an admin approves the link before it takes effect.' }], ok: 'Send for approval', done: 'saved' },
  pauseSub: { title: 'Pause subscription?', subtitle: 'Smith Family will not be charged or sent refills while paused. They can resume at any time.', tone: 'amber', parts: [{ f: 'kv', rows: [['Plan', 'Family · AUD 29.00 / month'], ['Next delivery', '19 Oct 2026'], ['Pause until', 'Resumed manually']] }], ok: 'Pause subscription', done: 'saved' },
  newRole: { title: 'New role', subtitle: 'Choose what this role can see and do', parts: [I('Role name', undefined, 'e.g. Warehouse lead'), { f: 'checks', items: ['View orders', 'Manage stock', 'Approve registrations', 'Approve payouts'], on: [0] }], ok: 'Create role', done: 'saved' },
  importProducts: { title: 'Import products', subtitle: 'Upload a CSV with name, SKU, category, price and pack size.', icon: <UploadFileOutlined />, parts: [{ f: 'upload', text: 'Drag a CSV here or browse', hint: 'Download the template' }], ok: 'Import', done: 'saved' },
  referralLink: { title: 'Create referral link', subtitle: 'Pick who is inviting and who they can invite.', parts: [R(S('Issuer', 'Greenfield Primary (school)'), S('Invite role', 'Family', ['Family', 'Hero', 'Business'])), R(S('Link expiry', '90 days', ['30 days', '90 days', 'Never']), S('Use limit', 'Unlimited', ['Unlimited', '10', '100'])), { f: 'note', tone: 'blue', text: 'Schools can invite families, Heroes and businesses. Families can invite members and businesses.' }], ok: 'Create link', done: 'link-copied' },
  esgFactor: { title: 'Add ESG factor', subtitle: 'Only add a factor if there is a source or evidence for it.', parts: [R(S('Applies to', 'Product · KP-DW-02'), I('Factor per unit', '0.00')), R(S('Measurement unit', 'kg CO₂e per bottle'), S('Baseline', 'New bottle')), { f: 'upload', text: 'Attach evidence or source (PDF, link)' }, { f: 'note', tone: 'amber', text: 'Without evidence the factor is saved as “Unverified” and excluded from public counters.' }], ok: 'Add factor', done: 'draft-saved' },
  badge: { title: 'Create badge', subtitle: 'Badges are earned from approved activity.', parts: [R(I('Badge name', undefined, 'e.g. Refill Champion'), S('Level', 'Bronze', ['Bronze', 'Silver', 'Gold', 'Seasonal'])), I('Award criterion', '10 completed refills'), A('Description', 'Shown to the kid and on the leaderboard')], ok: 'Create badge', done: 'saved' },
  reward: { title: 'Add reward', subtitle: 'Kids redeem points for this item. Points have no cash value.', parts: [R(I('Reward name', undefined, 'e.g. Eco sticker pack'), S('Type', 'Physical', ['Physical', 'Digital'])), R(I('Points cost', '100'), I('Stock', '180'))], ok: 'Add reward', done: 'saved' },
  adjustPoints: { title: 'Adjust points', subtitle: 'Emma Smith · current 840 points · every change is logged', parts: [{ f: 'seg', options: ['Add points', 'Remove points'] }, R(I('Points', '30'), S('Reason', 'Correction', ['Correction', 'Goodwill', 'Fraud reversal'], true)), A('Note', 'Add a note for the audit log…'), { f: 'note', tone: 'blue', text: 'Balance after: 810 points · Not a cash value' }], ok: 'Apply adjustment', done: 'saved' },
  createTask: { title: 'Create task', subtitle: 'Add a new task kids can complete.', parts: [A('Task description', 'e.g. Sort the household recycling', undefined, true), R(S('Evidence', 'Photo', ['None (auto)', 'Photo', 'Self-report']), S('Approval route', 'Parent / family', ['Parent / family', 'School admin', 'System'])), R(I('Points', '15'), S('Frequency', 'Weekly', ['Daily', 'Weekly', 'Per order']))], ok: 'Create task', done: 'saved' },
  createCategory: { title: 'Create category', subtitle: 'Categories group products in the catalog.', parts: [I('Category name', undefined, 'e.g. Personal care', true), R(I('Display order', '6'), S('Status', 'Active', ['Active', 'Hidden']))], ok: 'Create category', done: 'saved' },
  pendingPartner: { title: 'Cannot connect yet', subtitle: 'Partner access and the booking API are not confirmed. The configuration is saved as a draft and the connection stays off until access is granted.', tone: 'amber', icon: <WarningAmber />, parts: [], ok: 'OK, keep as draft' },
  uploadImage: { title: 'Upload product image', subtitle: 'JPG or PNG, up to 5 MB.', icon: <UploadFileOutlined />, parts: [{ f: 'upload', text: 'Drag an image here or browse' }, { f: 'note', tone: 'grey', text: 'If an upload fails you see: “File is larger than 5 MB — try again.”' }], ok: 'Upload', done: 'saved' },
  rejectStock: { title: 'Reject stock request #SR-2041?', subtitle: 'James K. is notified with your reason. No warehouse stock is committed.', tone: 'red', parts: [S('Reason', 'Select a reason', ['Select a reason', 'Not enough stock', 'Duplicate request', 'Other'], true), A('Message to the Hero', 'Explain the decision…')], ok: 'Reject request', okKind: 'danger', done: 'stock-rejected' },
  approvePayout: { title: 'Approve payout PO-3318?', subtitle: 'AUD 3,420.00 to Greenfield Primary P&C · ANZ •••• 4821', icon: <Check />, parts: [{ f: 'kv', rows: [['Available balance', 'AUD 6,420.00'], ['Balance after payout', 'AUD 3,000.00'], ['Next status', 'Approved → Processing']] }], ok: 'Approve payout', done: 'payout-approved' },
  rejectApplication: { title: 'Reject registration?', subtitle: 'The applicant is notified with your reason.', tone: 'red', parts: [S('Reason', 'Duplicate account', ['Duplicate account', 'Cannot verify identity', 'Outside service area'], true), A('Message to applicant', 'Explain the decision…')], ok: 'Reject registration', okKind: 'danger', done: 'registration-rejected' },
};

export const RESULTS: Record<string, { title: string; text: string; tone: Tone }> = {
  'link-copied': { title: 'Link copied: kindpack.org/r/GRN-F-7Q2', text: '', tone: 'green' },
  'message-sent': { title: 'Message sent', text: 'James K. will see it by email and in the app.', tone: 'green' },
  saved: { title: 'Saved', text: 'Your changes were saved and are now in effect. This action is recorded in the audit log.', tone: 'green' },
  'family-approved': { title: 'Smith Family approved', text: 'Registration approved by Anna K. (school admin). The family can now order and invite members.', tone: 'green' },
  'info-requested': { title: 'Information requested from Sarah Smith', text: 'Waiting for a reply · proof of address. The registration stays pending until it is answered.', tone: 'blue' },
  'registration-rejected': { title: 'Registration rejected', text: 'Reason sent to Sarah Smith: duplicate account. The family can register again with the correct details.', tone: 'red' },
  'stock-rejected': { title: 'Request #SR-2041 rejected', text: 'James K. was notified. No warehouse stock was committed.', tone: 'red' },
  'fulfilment-assigned': { title: 'Fulfilment assigned', text: 'Toilet paper to James K. (Hero), dishwashing liquid and colouring book to the main centre. Dispatch has started.', tone: 'green' },
  'payout-approved': { title: 'Payout PO-3318 approved', text: 'AUD 3,420.00 for Greenfield Primary moves to Processing. Upload payment evidence once paid.', tone: 'green' },
  'payout-hold': { title: 'Payout PO-3318 put on hold', text: 'Greenfield Primary is told the payout is paused. Add a note and release it when the issue is resolved.', tone: 'amber' },
  'campaign-approved': { title: 'Library Books Fund approved', text: 'Goes live on 1 Nov 2026 at 9:00 am. St. Mary’s Primary was notified.', tone: 'green' },
  'campaign-changes': { title: 'Changes requested', text: 'St. Mary’s Primary was asked to update: descriptions and target amount. The campaign stays in review.', tone: 'amber' },
  'campaign-rejected': { title: 'Library Books Fund rejected', text: 'The reason was sent to St. Mary’s Primary. They can submit a new version.', tone: 'red' },
  'task-approved': { title: 'Task approved · +15 points awarded', text: 'Emma S. now has 855 points. She was notified.', tone: 'green' },
  'task-info': { title: 'Information requested', text: 'Emma S. can see your question and resubmit. No points have been awarded yet.', tone: 'blue' },
  'draft-saved': { title: 'Draft saved', text: 'Dishwashing liquid refill saved as “Unverified”. It stays out of public counters until evidence is attached.', tone: 'amber' },
};

/* ───────────── provider ───────────── */

interface Ctx { popup: (key: string) => void; flash: (key: string) => void }
const FeedbackCtx = createContext<Ctx>({ popup: () => {}, flash: () => {} });
export const useFeedback = () => useContext(FeedbackCtx);

function Part({ p }: { p: Part }): ReactNode {
  switch (p.f) {
    case 'input': return <Field label={p.label} req={p.req}><Input value={p.value} placeholder={p.placeholder} /></Field>;
    case 'select': return <Field label={p.label} req={p.req}><Select value={p.value} options={p.options} /></Field>;
    case 'area': return <Field label={p.label} req={p.req}><TextArea value={p.value} placeholder={p.placeholder} rows={p.rows ?? 3} /></Field>;
    case 'row': return <Grid cols={{ xs: '1fr', sm: `repeat(${p.items.length}, 1fr)` }} gap={2}>{p.items.map((x, i) => <Part key={i} p={x} />)}</Grid>;
    case 'checks': return <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>{p.items.map((l, i) => <Tick key={l} label={l} on={p.on?.includes(i)} />)}</Box>;
    case 'kv': return <KV rows={p.rows} />;
    case 'seg': return <Segmented options={p.options} value={p.options[0]} />;
    case 'upload': return (
      <Box sx={{ p: 3, borderRadius: '16px', border: '1.5px dashed rgba(11,46,31,0.2)', textAlign: 'center', color: brand.slate }}>
        <UploadFileOutlined sx={{ fontSize: 30 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: brand.ink }}>{p.text}</Typography>
        {p.hint ? <Typography sx={{ fontSize: 12, color: '#1F6B45' }}>{p.hint}</Typography> : null}
      </Box>
    );
    case 'note': { const c = statusColors[p.tone ?? 'blue']; return <Box sx={{ display: 'flex', gap: 1, p: '12px 14px', borderRadius: '14px', bgcolor: c.bg, color: c.fg, fontSize: 12 }}><InfoOutlined sx={{ fontSize: 17 }} />{p.text}</Box>; }
    case 'people': return <Box>{p.rows.map(([n, s, st, t], i) => <Box key={n} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.25, borderTop: i ? hair : 0 }}><Box><Typography sx={{ fontSize: 14, fontWeight: 600 }}>{n}</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{s}</Typography></Box><Pill tone={t}>{st}</Pill></Box>)}</Box>;
  }
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = useCallback((key: string) => {
    if (RESULTS[key]) {
      setToast(key);
    }
  }, []);
  const popup = useCallback((key: string) => POPUPS[key] && setOpen(key), []);

  // Deep links: ?popup=filters and ?result=family-approved open straight away (handy for design review).
  useEffect(() => {
    const p = params.get('popup');
    const r = params.get('result');
    if (p && POPUPS[p]) setOpen(p);
    if (r && RESULTS[r]) setToast(r);
  }, [params]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [toast]);

  const value = useMemo(() => ({ popup, flash }), [popup, flash]);
  const spec = open ? POPUPS[open] : null;
  const close = () => {
    setOpen(null);
    if (params.get('popup')) { params.delete('popup'); setParams(params, { replace: true }); }
  };
  const res = toast ? RESULTS[toast] : null;
  const rc = res ? statusColors[res.tone] : null;

  return (
    <FeedbackCtx.Provider value={value}>
      {children}
      {res && rc ? (
        <Box role="status" sx={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 2000, width: 'min(640px, calc(100vw - 32px))', display: 'flex', alignItems: 'center', gap: 1.5, p: '14px 18px', borderRadius: '18px', bgcolor: rc.bg, color: rc.fg, boxShadow: '0 16px 40px rgba(11,46,31,0.18)' }}>
          <CheckCircleOutline />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'inherit' }}>{res.title}</Typography>
            {res.text ? <Typography sx={{ fontSize: 13, color: 'inherit' }}>{res.text}</Typography> : null}
          </Box>
          <Box component="button" type="button" aria-label="Dismiss" onClick={() => setToast(null)} sx={{ border: 0, bgcolor: 'transparent', color: 'inherit', cursor: 'pointer', display: 'grid' }}><Close sx={{ fontSize: 18 }} /></Box>
        </Box>
      ) : null}
      {spec ? (
        <Modal
          open
          onClose={close}
          title={spec.title}
          subtitle={spec.subtitle}
          icon={spec.icon}
          tone={spec.tone}
          width={spec.width ?? 560}
          footer={
            <>
              {spec.cancel !== undefined ? <Btn onClick={close}>{spec.cancel}</Btn> : spec.ok !== 'Close' && spec.ok !== 'OK, keep as draft' ? <Btn onClick={close}>Cancel</Btn> : null}
              <Btn kind={spec.okKind ?? 'primary'} onClick={() => { close(); if (spec.done) flash(spec.done); }}>{spec.ok}</Btn>
            </>
          }
        >
          {spec.parts.map((p, i) => <Part key={i} p={p} />)}
        </Modal>
      ) : null}
    </FeedbackCtx.Provider>
  );
}

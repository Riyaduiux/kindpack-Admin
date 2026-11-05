import { useState, type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import ApartmentOutlined from '@mui/icons-material/ApartmentOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import MailOutline from '@mui/icons-material/MailOutline';
import WarningAmber from '@mui/icons-material/WarningAmber';
import Close from '@mui/icons-material/Close';
import Check from '@mui/icons-material/Check';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import { Btn, Check as CheckRow, Field, hair, Input, Modal, Select, TextArea, Toggle } from '../../components/kit';
import { brand, forest, shadows } from '../../theme';

type Kind = 'invite' | 'suspend' | 'reject' | 'message' | null;

const ROLES: [string, ReactNode][] = [
  ['Family', <HomeOutlined key="f" />],
  ['School', <SchoolOutlined key="s" />],
  ['Hero', <LocalShippingOutlined key="h" />],
  ['Business', <ApartmentOutlined key="b" />],
  ['Warehouse', <Inventory2Outlined key="w" />],
  ['Family member', <GroupOutlined key="m" />],
];

export function InviteUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [role, setRole] = useState('Hero');
  return (
    <Modal open={open} onClose={onClose} title="Invite a user" subtitle="They will get an email with a secure link to set up their account." icon={<GroupOutlined />} width={540} footer={<><Btn onClick={onClose}>Cancel</Btn><Btn kind="primary" icon={<MailOutline />} onClick={onClose}>Send invite</Btn></>}>
      <Field label="Role">
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
          {ROLES.map(([r, icon]) => {
            const on = r === role;
            return (
              <Box key={r} component="button" type="button" onClick={() => setRole(r)} sx={{ height: 58, border: on ? '2px solid #1F6B45' : hair, borderRadius: '14px', bgcolor: on ? '#EEF5EF' : '#fff', font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: brand.ink, '& .ic': { width: 28, height: 28, borderRadius: '9px', display: 'grid', placeItems: 'center', bgcolor: on ? 'transparent' : '#F3F6F2', background: on ? 'linear-gradient(135deg,#145233,#0E3B26)' : undefined, color: on ? '#fff' : forest[700], '& svg': { fontSize: 16 } } }}>
                <Box className="ic">{icon}</Box>
                {r}
              </Box>
            );
          })}
        </Box>
      </Field>
      <Field label="Email address"><Input icon={<MailOutline />} placeholder="hero.new@example.com" /></Field>
      <Field label="Personal message (optional)"><TextArea placeholder="Welcome to Kind Pack…" rows={3} /></Field>
    </Modal>
  );
}

export function SuspendModal({ open, onClose, name = 'James K.' }: { open: boolean; onClose: () => void; name?: string }) {
  const [typed, setTyped] = useState('');
  return (
    <Modal open={open} onClose={onClose} title="Suspend this account?" subtitle={`${name} will be signed out and cannot take deliveries until you reactivate the account.`} icon={<WarningAmber />} tone="amber" width={540} footer={<><Btn onClick={onClose}>Cancel</Btn><Btn kind="danger" icon={<WarningAmber />} disabled={typed !== 'SUSPEND'} onClick={onClose}>Suspend account</Btn></>}>
      <Field label="Reason"><Select value="" options={['', 'Policy breach', 'Safety concern', 'Fraud suspected', 'Requested by user', 'Other']} /></Field>
      <CheckRow label="Notify the user by email" on />
      <Field label="Type SUSPEND to confirm"><Input value={typed} onChange={setTyped} error={typed.length > 0 && typed !== 'SUSPEND'} /></Field>
    </Modal>
  );
}

const REASONS = ['Missing documents', 'Failed background check', 'Outside service area', 'Other'];
export function RejectModal({ open, onClose, name = 'James K.', what = 'hero application' }: { open: boolean; onClose: () => void; name?: string; what?: string }) {
  const [reason, setReason] = useState(REASONS[0]);
  return (
    <Modal open={open} onClose={onClose} title="Reject this application?" subtitle={`${name} will be told the ${what} was not approved. This cannot be undone.`} icon={<Close />} tone="red" width={540} footer={<><Btn onClick={onClose}>Cancel</Btn><Btn kind="danger" icon={<Close />} onClick={onClose}>Reject & notify</Btn></>}>
      <Field label="Reason">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
          {REASONS.map((r) => {
            const on = r === reason;
            return (
              <Box key={r} component="button" type="button" onClick={() => setReason(r)} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, height: 36, px: 2, borderRadius: 999, border: on ? 0 : hair, font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer', bgcolor: on ? undefined : '#fff', background: on ? 'linear-gradient(135deg,#E5675A,#C94A3C)' : undefined, color: on ? '#fff' : brand.ink, boxShadow: on ? shadows.card : 'none' }}>
                {on ? <Check sx={{ fontSize: 14 }} /> : null}
                {r}
              </Box>
            );
          })}
        </Box>
      </Field>
      <Field label="Message to applicant (optional)"><TextArea placeholder="Add a short note so they know what to fix…" rows={3} /></Field>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Toggle on />
        <Typography sx={{ fontSize: 13 }}>Send the decision by email and in-app notification</Typography>
      </Box>
    </Modal>
  );
}

export function MessageModal({ open, onClose, to = 'James K. (Hero)' }: { open: boolean; onClose: () => void; to?: string }) {
  return (
    <Modal open={open} onClose={onClose} title="Send message" subtitle={`To 1 selected user · ${to}`} width={500} footer={<><Btn onClick={onClose}>Cancel</Btn><Btn kind="primary" icon={<ChatBubbleOutline />} onClick={onClose}>Send message</Btn></>}>
      <Field label="Channel"><Select value="Email and in-app" options={['Email and in-app', 'Email only', 'In-app only', 'SMS']} /></Field>
      <Field label="Subject"><Input value="Your stock request" /></Field>
      <Field label="Message"><TextArea placeholder="Write your message…" rows={3} /></Field>
    </Modal>
  );
}

/** Opens one of the shared people modals. `render` must be placed once in the page. */
export function useModals(initial: Kind = null, ctx?: { name?: string; what?: string }) {
  const [k, setK] = useState<Kind>(initial);
  const close = () => setK(null);
  return {
    invite: () => setK('invite'),
    suspend: () => setK('suspend'),
    reject: () => setK('reject'),
    message: () => setK('message'),
    render: (
      <>
        <InviteUserModal open={k === 'invite'} onClose={close} />
        <SuspendModal open={k === 'suspend'} onClose={close} name={ctx?.name} />
        <RejectModal open={k === 'reject'} onClose={close} name={ctx?.name} what={ctx?.what} />
        <MessageModal open={k === 'message'} onClose={close} />
      </>
    ),
  };
}

import { Chip } from '@mui/material';
import { statusColors } from '../theme';

type Tone = keyof typeof statusColors;

// Brief v2 colour rules: green healthy/approved/completed, amber pending/attention,
// red blocked/rejected/critical, blue scheduled/in-progress.
const TONES: Record<Tone, string[]> = {
  green: ['approved', 'active', 'completed', 'delivered', 'paid', 'healthy', 'verified', 'resolved', 'received', 'in stock', 'sent', 'success', 'live', 'available', 'issued', 'online', 'confirmed', 'enabled', 'open'],
  amber: ['pending', 'partially approved', 'attention', 'low stock', 'on hold', 'requested', 'awaiting', 'review', 'paused', 'draft review', 'unverified', 'reorder', 'busy', 'needs info', 'escalated', 'medium', 'awaiting pickup', 'invited', 'queued review'],
  red: ['rejected', 'blocked', 'suspended', 'cancelled', 'failed', 'critical', 'out of stock', 'damaged', 'overdue', 'high', 'reversed', 'deactivated', 'missing'],
  blue: ['scheduled', 'in progress', 'dispatched', 'processing', 'in transit', 'allocated', 'ready', 'assigned', 'picked up', 'upcoming', 'new', 'info', 'queued'],
  purple: [],
  grey: ['archived', 'draft', 'inactive', 'expired', 'revoked', 'closed', 'ended', 'offline', 'disabled', 'low', 'anonymous', 'refunded', 'none'],
};

export function toneFor(status: string): Tone {
  const s = status.toLowerCase().replace(/_/g, ' ');
  for (const tone of Object.keys(TONES) as Tone[]) {
    if (TONES[tone].includes(s)) return tone;
  }
  return 'grey';
}

export default function StatusChip({ status, tone }: { status: string; tone?: Tone }) {
  const c = statusColors[tone ?? toneFor(status)];
  const label = status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (ch) => ch.toUpperCase());
  return <Chip size="small" label={label} sx={{ bgcolor: c.bg, color: c.fg, height: 24, fontSize: 12, borderRadius: 1.5 }} />;
}

import type { ReactNode } from 'react';
import { Box, Card, Typography } from '@mui/material';

interface Props {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  /** Remove inner padding (for tables that run edge to edge). */
  flush?: boolean;
  /** Stronger contrast for critical queues (Brief v2). */
  emphasis?: boolean;
}

export default function SectionCard({ title, subtitle, action, children, flush, emphasis }: Props) {
  return (
    <Card sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', ...(emphasis ? { borderColor: '#E9C77B', boxShadow: '0 0 0 1px #F3DDA6' } : {}) }}>
      {title ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, pt: 2, pb: flush ? 1.5 : 0 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6">{title}</Typography>
            {subtitle ? (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {action}
        </Box>
      ) : null}
      <Box sx={{ p: flush ? 0 : 2.5, flex: 1 }}>{children}</Box>
    </Card>
  );
}

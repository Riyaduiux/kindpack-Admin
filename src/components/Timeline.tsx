import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { brand } from '../theme';

/** Vertical step list: steps up to `current` are shown as done. */
export default function StatusTimeline({ steps, current }: { steps: string[]; current: number }) {
  return (
    <Box sx={{ mt: 1 }}>
      {steps.map((s, i) => {
        const done = i <= current;
        return (
          <Box key={s} sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: done ? brand.primary : '#fff',
                  border: `2px solid ${done ? brand.primary : brand.border}`,
                  color: '#fff',
                }}
              >
                {done ? <CheckIcon sx={{ fontSize: 14 }} /> : null}
              </Box>
              {i < steps.length - 1 && <Box sx={{ width: 2, flex: 1, minHeight: 18, bgcolor: i < current ? brand.primary : brand.border }} />}
            </Box>
            <Typography variant="body2" sx={{ pb: 1.5, fontWeight: done ? 600 : 400, color: done ? 'text.primary' : 'text.secondary' }}>
              {s}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

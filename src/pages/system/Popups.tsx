import { Box, Typography } from '@mui/material';
import TopBar from '../../layout/TopBar';
import { Btn, Card, Grid, Pill, Stack } from '../../components/kit';
import { POPUPS, RESULTS, useFeedback } from '../../components/popups';

/** Design review page: opens every shared pop-up and result message from Figma sections 08 and 09. */
export default function Popups() {
  const { popup, flash } = useFeedback();
  return (
    <Stack gap={3}>
      <TopBar title="Pop-ups & results" helper="Every shared pop-up and result message. Also available on any page with ?popup=<name> or ?result=<name>." />
      <Card title="Shared pop-ups" subtitle={`${Object.keys(POPUPS).length} dialogs`}>
        <Grid cols={{ xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }} gap={1.5}>
          {Object.entries(POPUPS).map(([k, s]) => (
            <Box key={k} component="button" type="button" onClick={() => popup(k)} sx={{ textAlign: 'left', p: '14px 16px', borderRadius: '14px', border: '1px solid rgba(11,46,31,0.08)', bgcolor: '#fff', font: 'inherit', cursor: 'pointer', '&:hover': { bgcolor: '#F6F8F5' } }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{s.title}</Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>?popup={k}</Typography>
            </Box>
          ))}
        </Grid>
      </Card>
      <Card title="Result messages" subtitle={`${Object.keys(RESULTS).length} confirmations`}>
        <Grid cols={{ xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }} gap={1.5}>
          {Object.entries(RESULTS).map(([k, r]) => (
            <Box key={k} sx={{ p: '14px 16px', borderRadius: '14px', border: '1px solid rgba(11,46,31,0.08)', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Pill tone={r.tone} dot={false} sx={{ alignSelf: 'flex-start' }}>{r.tone}</Pill>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{r.title}</Typography>
              <Btn small onClick={() => flash(k)}>Show</Btn>
            </Box>
          ))}
        </Grid>
      </Card>
    </Stack>
  );
}

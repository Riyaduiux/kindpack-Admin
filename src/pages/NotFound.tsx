import { useNavigate } from 'react-router';
import { Box, Button, Typography } from '@mui/material';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: 'center', py: 12 }}>
      <Typography variant="h3" sx={{ color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ mt: 1 }}>
        This page doesn’t exist
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        The link may be old or the record was removed.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Back to dashboard
      </Button>
    </Box>
  );
}

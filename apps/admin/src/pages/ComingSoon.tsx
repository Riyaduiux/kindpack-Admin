import { useLocation } from 'react-router';
import { Box, Typography } from '@mui/material';
import ConstructionOutlined from '@mui/icons-material/ConstructionOutlined';
import PageHeader from '../components/PageHeader';
import { findNav } from '../layout/navigation';
import { brand, gradients, shadows } from '../theme';

/** Placeholder for sidebar sections whose Figma screens are not built yet. */
export default function ComingSoon({ title: forced }: { title?: string }) {
  const { pathname } = useLocation();
  const nav = findNav(pathname);
  const title = forced ?? nav?.item.label ?? 'Page';
  return (
    <>
      <PageHeader title={title} helper="This section is being built from the Figma design." />
      <Box sx={{ bgcolor: '#fff', borderRadius: '24px', boxShadow: shadows.card, py: 10, px: 3, textAlign: 'center' }}>
        <Box sx={{ width: 56, height: 56, mx: 'auto', mb: 2, borderRadius: '18px', background: gradients.primary, display: 'grid', placeItems: 'center' }}>
          <ConstructionOutlined sx={{ color: '#fff' }} />
        </Box>
        <Typography variant="h6">{title} is coming soon</Typography>
        <Typography sx={{ color: brand.slate, mt: 0.5 }}>The screens for this section are not implemented yet.</Typography>
      </Box>
    </>
  );
}

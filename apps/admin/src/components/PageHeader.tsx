import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TopBar from '../layout/TopBar';

interface Props {
  title: string;
  helper: string;
  actions?: ReactNode;
  /** Extra breadcrumb levels, e.g. a record name. Shown above the page actions when present. */
  crumbs?: { label: string; to?: string }[];
}

/** Every screen: title + helper on the left, search/notifications/profile on the right, then the primary actions. */
export default function PageHeader({ title, helper, actions, crumbs = [] }: Props) {
  return (
    <>
      <TopBar title={title} helper={helper} />
      {crumbs.length > 0 || actions ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mt: -1, mb: 3 }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            {crumbs.length > 0 ? (
              <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 16 }} />}>
                {crumbs.map((c) =>
                  c.to ? (
                    <Link key={c.label} component={RouterLink} to={c.to} underline="hover" color="text.secondary" fontSize={13}>
                      {c.label}
                    </Link>
                  ) : (
                    <Typography key={c.label} fontSize={13} color="text.primary">
                      {c.label}
                    </Typography>
                  ),
                )}
              </Breadcrumbs>
            ) : null}
          </Box>
          {actions ? <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{actions}</Box> : null}
        </Box>
      ) : null}
    </>
  );
}

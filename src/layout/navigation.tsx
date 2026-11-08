import type { ReactElement } from 'react';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import WarehouseOutlined from '@mui/icons-material/WarehouseOutlined';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined';
import EnergySavingsLeafOutlined from '@mui/icons-material/EnergySavingsLeafOutlined';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import HelpOutlineOutlined from '@mui/icons-material/HelpOutlineOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

export interface NavItem {
  label: string;
  path: string;
  icon: ReactElement;
  /** Small coral counter shown at the end of the row. */
  badge?: number;
  /** False while the screen is not built yet (shows a "coming soon" page). */
  ready?: boolean;
  /** Other path prefixes that keep this item highlighted (sub-screens). */
  also?: string[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Sidebar menu (Figma: Admin Panel › Dashboard Overview). Add a group/item here and a <Route> in App.tsx. */
export const navigation: NavGroup[] = [
  { label: 'Overview', items: [{ label: 'Dashboard', path: '/', icon: <DashboardOutlined />, ready: true }] },
  {
    label: 'People',
    items: [
      { label: 'Users & Access', path: '/users', icon: <PeopleAltOutlined />, ready: true, also: ['/roles'] },
      { label: 'Referrals & Onboarding', path: '/referrals', icon: <LinkOutlined />, badge: 23, ready: true, also: ['/approvals'] },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { label: 'Product Catalog', path: '/catalog', icon: <Inventory2Outlined />, ready: true },
      { label: 'Inventory & Warehouse', path: '/inventory', icon: <WarehouseOutlined />, ready: true },
      { label: 'Orders', path: '/orders', ready: true, icon: <ShoppingBagOutlined /> },
      { label: 'Fulfilment & Dispatch', path: '/fulfilment', ready: true, icon: <LocalShippingOutlined />, also: ['/big-heroes'] },
    ],
  },
  {
    label: 'Money',
    items: [
      { label: 'Finance', path: '/finance', ready: true, icon: <AccountBalanceWalletOutlined /> },
      { label: 'Fundraising & Donations', path: '/fundraising', ready: true, icon: <FavoriteBorderOutlined /> },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { label: 'Gamification & Rewards', path: '/rewards', ready: true, icon: <EmojiEventsOutlined /> },
      { label: 'ESG & Impact', path: '/esg', ready: true, icon: <EnergySavingsLeafOutlined /> },
      { label: 'Reports', path: '/reports', ready: true, icon: <BarChartOutlined /> },
    ],
  },
  {
    label: 'Communication',
    items: [
      { label: 'Support', path: '/support', icon: <HelpOutlineOutlined /> },
    ],
  },
  { label: 'System', items: [{ label: 'Settings', path: '/settings', icon: <SettingsOutlined /> }] },
];

/** Finds the sidebar group + item for a path (used for breadcrumbs). */
export function findNav(pathname: string) {
  for (const group of navigation) {
    for (const item of group.items) {
      const match = isActive(item, pathname);
      if (match) return { group, item };
    }
  }
  return null;
}

/** True when the path belongs to this sidebar item (its own path, a sub-path or an `also` prefix). */
export function isActive(item: NavItem, pathname: string) {
  if (item.path === '/') return pathname === '/';
  return [item.path, ...(item.also ?? [])].some((p) => pathname === p || pathname.startsWith(p + '/'));
}

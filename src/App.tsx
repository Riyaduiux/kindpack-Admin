import type { ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { useAuth } from './auth/AuthContext';
import AppLayout from './layout/AppLayout';
import { navigation } from './layout/navigation';
import Login from './pages/Login';
import TwoFactor from './pages/TwoFactor';
import { ForgotPassword, CheckEmail } from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import { HeroDetail, FamilyDetail, SchoolDetail, BusinessDetail } from './pages/people/details';
import { Roles, Approvals, FamilyApprovals, Referrals, MemberDetail } from './pages/people/admin';
import ComingSoon from './pages/ComingSoon';
import Products from './pages/catalog/Products';
import Categories from './pages/catalog/Categories';
import AddProduct from './pages/catalog/AddProduct';
import { StockQuantities, MovementHistory } from './pages/inventory/Stock';
import Warehouse from './pages/inventory/Warehouse';
import BigHeroes from './pages/inventory/BigHeroes';
import HeroRequests, { RequestStatus } from './pages/inventory/HeroRequests';
import Notifications, { Templates } from './pages/Notifications';
import Orders from './pages/orders/Orders';
import OrderDetail from './pages/orders/OrderDetail';
import Subscriptions from './pages/orders/Subscriptions';
import Dispatch from './pages/fulfilment/Dispatch';
import { RoutingDecision, RoutingExceptions, Deliveries, ChooseSource } from './pages/fulfilment/Routing';
import { ProfitAllocation, CostProfit } from './pages/finance/Profit';
import { Payouts, Earnings, PayoutRequests, PayoutDetail } from './pages/finance/Payouts';
import { Campaigns, CampaignDetail } from './pages/finance/Campaigns';
import PageHeader from './components/PageHeader';
import { NoAccess } from './components/StateViews';
import NotFound from './pages/NotFound';

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

// Sidebar entries that have no page yet render <ComingSoon />. Replace the element when a screen is built.
const pending = navigation.flatMap((g) => g.items).filter((i) => !i.ready);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<TwoFactor />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password/sent" element={<CheckEmail />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/hero" element={<HeroDetail />} />
        <Route path="users/family" element={<FamilyDetail />} />
        <Route path="users/school" element={<SchoolDetail />} />
        <Route path="users/business" element={<BusinessDetail />} />
        <Route path="users/member" element={<MemberDetail />} />
        <Route path="catalog" element={<Products />} />
        <Route path="catalog/categories" element={<Categories />} />
        <Route path="catalog/new" element={<AddProduct />} />
        <Route path="inventory" element={<StockQuantities />} />
        <Route path="inventory/stock" element={<StockQuantities />} />
        <Route path="inventory/movements" element={<MovementHistory />} />
        <Route path="inventory/requests" element={<HeroRequests />} />
        <Route path="inventory/requests/sr-2041" element={<RequestStatus />} />
        <Route path="inventory/warehouse" element={<Warehouse />} />
        <Route path="big-heroes" element={<BigHeroes />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="notifications/templates" element={<Templates />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/subscriptions" element={<Subscriptions />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="finance" element={<Payouts />} />
        <Route path="finance/profit" element={<ProfitAllocation />} />
        <Route path="finance/cost-profit" element={<CostProfit />} />
        <Route path="finance/earnings" element={<Earnings />} />
        <Route path="finance/requests" element={<PayoutRequests />} />
        <Route path="finance/requests/:id" element={<PayoutDetail />} />
        <Route path="fundraising" element={<Campaigns />} />
        <Route path="fundraising/:id" element={<CampaignDetail />} />
        <Route path="fulfilment" element={<Dispatch />} />
        <Route path="fulfilment/routing" element={<RoutingDecision />} />
        <Route path="fulfilment/exceptions" element={<RoutingExceptions />} />
        <Route path="fulfilment/deliveries" element={<Deliveries />} />
        <Route path="fulfilment/choose" element={<ChooseSource />} />
        <Route path="roles" element={<Roles />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="approvals/families" element={<FamilyApprovals />} />
        <Route path="referrals" element={<Referrals />} />
        <Route
          path="403"
          element={
            <>
              <PageHeader title="Payouts" helper="Pay out school earnings and Hero earnings." />
              <NoAccess area="Payouts" />
            </>
          }
        />
        {pending.map((i) => (
          <Route key={i.path} path={i.path.slice(1)} element={<ComingSoon />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

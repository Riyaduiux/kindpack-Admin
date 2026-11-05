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
        <Route path="notifications" element={<ComingSoon title="Notifications" />} />
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

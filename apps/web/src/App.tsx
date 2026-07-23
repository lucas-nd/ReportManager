import type { AuthenticatedUser } from '@report-manager/shared';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { RouteAccessGuard } from './auth/RouteAccessGuard.js';
import { getRoleHomePath } from './auth/roleHome.js';
import { SessionProvider, useSession } from './auth/SessionContext.js';
import { AppLayout } from './components/layout/AppLayout.js';
import {
  AdminHomePage,
  ForbiddenPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './routes/AccessPages.js';
import { LoginPage } from './routes/LoginPage.js';
import {
  AccountPage,
  PendingUploadsPage,
  ReportsPage,
  ServicesPage,
  SyncPage,
  TechnicianDashboardPage,
} from './routes/TechnicianPages.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

function HomeRedirect() {
  const { user } = useSession();

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return <Navigate replace to={getRoleHomePath(user.role)} />;
}

function AdminLayoutRoute() {
  return (
    <RouteAccessGuard access={{ type: 'roles', roles: ['administrator'] }}>
      <AppLayout />
    </RouteAccessGuard>
  );
}

function TechnicianLayoutRoute() {
  return (
    <RouteAccessGuard access={{ type: 'roles', roles: ['technician'] }}>
      <AppLayout />
    </RouteAccessGuard>
  );
}

type AppProps = {
  currentUser?: AuthenticatedUser | null;
};

export function App({ currentUser }: AppProps) {
  return (
    <ThemeProvider>
      <SessionProvider user={currentUser}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route
              path="/login"
              element={
                <RouteAccessGuard access={{ type: 'guest-only' }}>
                  <LoginPage />
                </RouteAccessGuard>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <RouteAccessGuard access={{ type: 'guest-only' }}>
                  <ForgotPasswordPage />
                </RouteAccessGuard>
              }
            />
            <Route
              path="/reset-password"
              element={
                <RouteAccessGuard access={{ type: 'guest-only' }}>
                  <ResetPasswordPage />
                </RouteAccessGuard>
              }
            />
            <Route
              path="/forbidden"
              element={
                <RouteAccessGuard access={{ type: 'authenticated' }}>
                  <ForbiddenPage />
                </RouteAccessGuard>
              }
            />
            <Route element={<AdminLayoutRoute />}>
              <Route path="/admin" element={<AdminHomePage />} />
            </Route>
            <Route element={<TechnicianLayoutRoute />}>
              <Route path="/dashboard" element={<TechnicianDashboardPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/pending-uploads" element={<PendingUploadsPage />} />
              <Route path="/sync" element={<SyncPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </ThemeProvider>
  );
}

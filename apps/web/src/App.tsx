import type { AuthenticatedUser } from '@report-manager/shared';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { RouteAccessGuard } from './auth/RouteAccessGuard.js';
import { getRoleHomePath } from './auth/roleHome.js';
import { SessionProvider, useSession } from './auth/SessionContext.js';
import {
  AdminHomePage,
  ForbiddenPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  TechnicianHomePage,
} from './routes/AccessPages.js';
import { LoginPage } from './routes/LoginPage.js';

function HomeRedirect() {
  const { user } = useSession();

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return <Navigate replace to={getRoleHomePath(user.role)} />;
}

type AppProps = {
  currentUser?: AuthenticatedUser | null;
};

export function App({ currentUser = null }: AppProps) {
  return (
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
          <Route
            path="/admin"
            element={
              <RouteAccessGuard
                access={{ type: 'roles', roles: ['administrator'] }}
              >
                <AdminHomePage />
              </RouteAccessGuard>
            }
          />
          <Route
            path="/services"
            element={
              <RouteAccessGuard
                access={{ type: 'roles', roles: ['technician'] }}
              >
                <TechnicianHomePage />
              </RouteAccessGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}

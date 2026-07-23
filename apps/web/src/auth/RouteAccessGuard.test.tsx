import type { AuthenticatedUser, RouteAccess } from '@report-manager/shared';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { RouteAccessGuard } from './RouteAccessGuard.js';
import { SessionProvider } from './SessionContext.js';

function renderRoute(access: RouteAccess, user: AuthenticatedUser | null) {
  render(
    <SessionProvider user={user}>
      <MemoryRouter initialEntries={['/requested']}>
        <Routes>
          <Route path="/login" element={<p>Login</p>} />
          <Route path="/admin" element={<p>Início administrador</p>} />
          <Route path="/dashboard" element={<p>Início técnico</p>} />
          <Route path="/forbidden" element={<p>Acesso negado</p>} />
          <Route
            path="/requested"
            element={
              <RouteAccessGuard access={access}>
                <p>Conteúdo solicitado</p>
              </RouteAccessGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    </SessionProvider>,
  );
}

describe('RouteAccessGuard', () => {
  it('allows public routes without a user', () => {
    renderRoute({ type: 'public' }, null);

    expect(screen.getByText('Conteúdo solicitado')).toBeInTheDocument();
  });

  it('allows a guest into guest-only routes', () => {
    renderRoute({ type: 'guest-only' }, null);

    expect(screen.getByText('Conteúdo solicitado')).toBeInTheDocument();
  });

  it('redirects an authenticated user away from guest-only routes', () => {
    renderRoute(
      { type: 'guest-only' },
      { id: 'admin-1', role: 'administrator' },
    );

    expect(screen.getByText('Início administrador')).toBeInTheDocument();
  });

  it('redirects a technician away from guest-only routes to dashboard', () => {
    renderRoute({ type: 'guest-only' }, { id: 'tech-1', role: 'technician' });

    expect(screen.getByText('Início técnico')).toBeInTheDocument();
  });

  it('redirects a guest to login from an authenticated route', () => {
    renderRoute({ type: 'authenticated' }, null);

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('allows any authenticated user into an authenticated route', () => {
    renderRoute(
      { type: 'authenticated' },
      { id: 'tech-1', role: 'technician' },
    );

    expect(screen.getByText('Conteúdo solicitado')).toBeInTheDocument();
  });

  it('shows forbidden when the authenticated role is not allowed', () => {
    renderRoute(
      { type: 'roles', roles: ['administrator'] },
      { id: 'tech-1', role: 'technician' },
    );

    expect(screen.getByText('Acesso negado')).toBeInTheDocument();
  });

  it('allows an authenticated role listed by the route', () => {
    renderRoute(
      { type: 'roles', roles: ['administrator', 'technician'] },
      { id: 'tech-1', role: 'technician' },
    );

    expect(screen.getByText('Conteúdo solicitado')).toBeInTheDocument();
  });
});

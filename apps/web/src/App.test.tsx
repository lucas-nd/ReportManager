import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from './App.js';

describe('App', () => {
  it('renders the login page at /login', () => {
    window.history.pushState({}, '', '/login');

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Acesse sua conta' }),
    ).toBeInTheDocument();
  });

  it('redirects an authenticated administrator away from login', () => {
    window.history.pushState({}, '', '/login');

    render(<App currentUser={{ id: 'admin-1', role: 'administrator' }} />);

    expect(
      screen.getByRole('heading', { name: 'Painel administrativo' }),
    ).toBeInTheDocument();
  });

  it('redirects a guest from an administrator route to login', () => {
    window.history.pushState({}, '', '/admin');

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Acesse sua conta' }),
    ).toBeInTheDocument();
  });

  it('shows forbidden when a technician opens an administrator route', () => {
    window.history.pushState({}, '', '/admin');

    render(<App currentUser={{ id: 'tech-1', role: 'technician' }} />);

    expect(
      screen.getByRole('heading', { name: 'Acesso negado' }),
    ).toBeInTheDocument();
  });

  it('renders the forgot-password page for a guest', () => {
    window.history.pushState({}, '', '/forgot-password');

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Recuperar senha' }),
    ).toBeInTheDocument();
  });
});

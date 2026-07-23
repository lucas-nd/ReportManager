import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { App } from './App.js';

function signIn(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('E-mail'), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText('Senha'), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole('button', { name: /^Entrar$/ }));
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the login page at /login', () => {
    window.history.pushState({}, '', '/login');

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Acesse sua conta' }),
    ).toBeInTheDocument();
  });

  it('signs an administrator in with the mock authentication adapter', () => {
    window.history.pushState({}, '', '/login');

    render(<App />);

    signIn('admin@fieldflow.local', 'admin123');

    expect(
      screen.getByRole('heading', { name: 'Painel administrativo' }),
    ).toBeInTheDocument();
  });

  it('signs a technician in and opens the dashboard', () => {
    window.history.pushState({}, '', '/login');

    render(<App />);

    signIn('tecnico@fieldflow.local', 'tecnico123');

    expect(
      screen.getByRole('heading', { name: 'Visão geral' }),
    ).toBeInTheDocument();
  });

  it('restores the authenticated user after the application remounts', () => {
    window.history.pushState({}, '', '/login');

    const { unmount } = render(<App />);

    signIn('admin@fieldflow.local', 'admin123');

    unmount();
    window.history.pushState({}, '', '/admin');
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Painel administrativo' }),
    ).toBeInTheDocument();
  });

  it('ignores an invalid persisted session', () => {
    window.localStorage.setItem(
      'report-manager-session',
      JSON.stringify({ id: 'admin-1', role: 'unsupported' }),
    );
    window.history.pushState({}, '', '/admin');

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Acesse sua conta' }),
    ).toBeInTheDocument();
  });

  it('honors an explicitly signed-out user over persisted data', () => {
    window.localStorage.setItem(
      'report-manager-session',
      JSON.stringify({ id: 'admin-1', role: 'administrator' }),
    );
    window.history.pushState({}, '', '/admin');

    render(<App currentUser={null} />);

    expect(
      screen.getByRole('heading', { name: 'Acesse sua conta' }),
    ).toBeInTheDocument();
  });

  it('does not restore the user after sign out', () => {
    window.history.pushState({}, '', '/login');

    const { unmount } = render(<App />);

    signIn('tecnico@fieldflow.local', 'tecnico123');
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

    unmount();
    window.history.pushState({}, '', '/dashboard');
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Acesse sua conta' }),
    ).toBeInTheDocument();
  });

  it('shows a generic error for invalid mock credentials', () => {
    window.history.pushState({}, '', '/login');

    render(<App />);

    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'unknown@reportmanager.local' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'incorrect' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Entrar$/ }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'E-mail ou senha inválidos.',
    );
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

  it('renders the shared header and menu in the administrator context', () => {
    window.history.pushState({}, '', '/admin');

    render(<App currentUser={{ id: 'admin-1', role: 'administrator' }} />);

    expect(screen.getByText('Área administrativa')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Navegação principal' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Recolher menu lateral' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Administrador')).toHaveLength(2);
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

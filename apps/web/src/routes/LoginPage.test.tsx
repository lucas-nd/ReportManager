import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { SessionProvider } from '../auth/SessionContext.js';
import { LoginPage } from './LoginPage.js';

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <SessionProvider user={null}>
        <LoginPage />
      </SessionProvider>
    </MemoryRouter>,
  );
}

describe('login page', () => {
  it('renders the account access form', () => {
    renderLoginPage();

    expect(
      screen.getByRole('heading', { name: 'Acesse sua conta' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
    expect(
      screen.getByRole('button', { name: /^Entrar$/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Esqueci minha senha' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Entrar com SSO corporativo' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/admin@fieldflow\.local/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/tecnico@fieldflow\.local/i),
    ).not.toBeInTheDocument();
  });

  it('lets the user reveal and hide the password', () => {
    renderLoginPage();

    const password = screen.getByLabelText('Senha');
    const toggle = screen.getByRole('button', { name: 'Mostrar senha' });

    fireEvent.click(toggle);
    expect(password).toHaveAttribute('type', 'text');
    expect(toggle).toHaveAccessibleName('Ocultar senha');

    fireEvent.click(toggle);
    expect(password).toHaveAttribute('type', 'password');
  });

  it('keeps the remember-me checkbox controlled locally', () => {
    renderLoginPage();

    const checkbox = screen.getByRole('checkbox', {
      name: 'Manter-me conectado',
    });

    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('places password recovery after the primary login action', () => {
    renderLoginPage();

    const login = screen.getByRole('button', { name: /^Entrar$/ });
    const forgotPassword = screen.getByRole('button', {
      name: 'Esqueci minha senha',
    });

    expect(login).toAppearBefore(forgotPassword);
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoginPage } from './LoginPage.js';

describe('login page', () => {
  it('renders the account access form', () => {
    render(<LoginPage />);

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
  });

  it('lets the user reveal and hide the password', () => {
    render(<LoginPage />);

    const password = screen.getByLabelText('Senha');
    const toggle = screen.getByRole('button', { name: 'Mostrar senha' });

    fireEvent.click(toggle);
    expect(password).toHaveAttribute('type', 'text');
    expect(toggle).toHaveAccessibleName('Ocultar senha');

    fireEvent.click(toggle);
    expect(password).toHaveAttribute('type', 'password');
  });

  it('keeps the remember-me checkbox controlled locally', () => {
    render(<LoginPage />);

    const checkbox = screen.getByRole('checkbox', {
      name: 'Manter-me conectado',
    });

    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('places password recovery after the primary login action', () => {
    render(<LoginPage />);

    const login = screen.getByRole('button', { name: /^Entrar$/ });
    const forgotPassword = screen.getByRole('button', {
      name: 'Esqueci minha senha',
    });

    expect(login).toAppearBefore(forgotPassword);
  });
});

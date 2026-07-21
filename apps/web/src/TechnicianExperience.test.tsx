import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { App } from './App.js';

const technician = { id: 'tech-1', role: 'technician' } as const;
const administrator = { id: 'admin-1', role: 'administrator' } as const;

describe('technician experience', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    });
  });

  it('shows every dashboard metric, the pending badge and next service', () => {
    window.history.pushState({}, '', '/dashboard');

    render(<App currentUser={technician} />);

    const metrics: Array<readonly [string, string]> = [
      ['Serviços pendentes', '5'],
      ['Em andamento', '2'],
      ['Relatórios enviados', '154'],
      ['Sincronizações pendentes', '18'],
    ];

    for (const [label, value] of metrics) {
      const card = screen.getByText(label).closest('article');

      expect(card).not.toBeNull();
      expect(within(card!).getByText(value)).toBeInTheDocument();
    }

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('FrioSul Alimentos')).toBeInTheDocument();
    expect(
      screen.getByText('Av. das Indústrias, 1840 · Distrito Industrial'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Iniciar atendimento' }),
    ).toBeInTheDocument();
  });

  it('keeps the shell and exposes the correct title for every route', () => {
    window.history.pushState({}, '', '/dashboard');

    render(<App currentUser={technician} />);

    const destinations: Array<readonly [string, string]> = [
      ['Serviços', '/services'],
      ['Relatórios', '/reports'],
      ['Uploads pendentes', '/pending-uploads'],
      ['Sincronização', '/sync'],
      ['Minha conta', '/account'],
      ['Dashboard', '/dashboard'],
    ];

    for (const [label, path] of destinations) {
      fireEvent.click(
        screen.getByRole('link', {
          name:
            label === 'Uploads pendentes'
              ? /^Uploads pendentes/
              : new RegExp(`^${label}$`),
        }),
      );

      expect(window.location.pathname).toBe(path);
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: path === '/dashboard' ? 'Visão geral' : label,
        }),
      ).toBeInTheDocument();
    }

    expect(screen.getByText('Report Manager')).toBeInTheDocument();
  });

  it('shows the synchronization summary and action', () => {
    window.history.pushState({}, '', '/sync');

    render(<App currentUser={technician} />);

    expect(screen.getByText('Último envio')).toBeInTheDocument();
    expect(screen.getByText('Último download')).toBeInTheDocument();
    expect(screen.getByText('18 itens pendentes')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sincronizar agora' }),
    ).toBeInTheDocument();
  });

  it('keeps the sidebar control beside the technician area at every width', () => {
    window.history.pushState({}, '', '/dashboard');

    render(<App currentUser={technician} />);

    const areaLabel = screen.getByText('Área do técnico');
    const collapseButton = screen.getByRole('button', {
      name: 'Recolher menu lateral',
    });
    const mobileMenuButton = screen.getByRole('button', {
      name: 'Abrir menu',
    });

    const titleBlock = areaLabel.parentElement;
    const headerStart = titleBlock?.parentElement;

    expect(titleBlock).toContainElement(
      screen.getByRole('heading', { name: 'Visão geral' }),
    );
    expect(headerStart).toContainElement(collapseButton);
    expect(headerStart).toContainElement(mobileMenuButton);
    expect(headerStart?.children[0]).toBe(mobileMenuButton);
    expect(headerStart?.children[1]).toBe(collapseButton);
    expect(headerStart?.children[2]).toBe(titleBlock);

    fireEvent.click(collapseButton);

    expect(
      screen.getByRole('button', { name: 'Expandir menu lateral' }),
    ).toBeInTheDocument();
  });

  it('places the signed-in technician information after the theme button', () => {
    window.history.pushState({}, '', '/dashboard');

    render(<App currentUser={technician} />);

    const themeButton = screen.getByRole('button', {
      name: 'Ativar modo escuro',
    });
    const profileName = screen.getByText('Lucas Diniz');

    expect(themeButton.nextElementSibling).toContainElement(profileName);
  });

  it('opens and closes the accessible mobile navigation drawer', async () => {
    window.history.pushState({}, '', '/dashboard');

    render(<App currentUser={technician} />);

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));

    expect(
      await screen.findByRole('dialog', { name: 'Menu principal' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Fechar menu' }));

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Menu principal' }),
      ).not.toBeInTheDocument();
    });
  });

  it('reports connectivity changes and gives offline guidance', () => {
    window.history.pushState({}, '', '/dashboard');

    render(<App currentUser={technician} />);

    expect(screen.getByRole('status')).toHaveTextContent('Online');

    fireEvent(window, new Event('offline'));

    expect(screen.getByRole('status')).toHaveTextContent('Offline');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Alterações ficarão neste dispositivo',
    );
  });

  it('persists the selected color theme', () => {
    window.history.pushState({}, '', '/dashboard');

    render(<App currentUser={technician} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ativar modo escuro' }));

    expect(document.documentElement).toHaveClass('dark');
    expect(window.localStorage.getItem('report-manager-theme')).toBe('dark');
    expect(
      screen.getByRole('button', { name: 'Ativar modo claro' }),
    ).toBeInTheDocument();
  });

  it('signs the technician out from the sidebar', () => {
    window.history.pushState({}, '', '/dashboard');

    render(<App currentUser={technician} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

    expect(window.location.pathname).toBe('/login');
    expect(
      screen.getByRole('heading', { name: 'Acesse sua conta' }),
    ).toBeInTheDocument();
  });

  it('redirects a guest away from technician routes', () => {
    window.history.pushState({}, '', '/reports');

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Acesse sua conta' }),
    ).toBeInTheDocument();
  });

  it('rejects an administrator from technician routes', () => {
    window.history.pushState({}, '', '/sync');

    render(<App currentUser={administrator} />);

    expect(
      screen.getByRole('heading', { name: 'Acesso negado' }),
    ).toBeInTheDocument();
  });
});

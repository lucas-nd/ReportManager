import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../App.js';
const technician = { id: 'tech-1', role: 'technician' } as const;
describe('attendance flow', () => {
  it('starts from order checking and blocks incomplete steps', () => {
    window.history.pushState({}, '', '/services/OS-2026-0142/attendance');
    render(<App currentUser={technician} />);
    expect(
      screen.getByRole('heading', { name: 'Conferência da ordem de serviço' }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar e iniciar' }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Nova etapa' }));
    fireEvent.click(screen.getByRole('button', { name: 'Concluir etapa' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Informe o tipo da etapa',
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'O resumo é obrigatório',
    );
  });
  it('starts fresh when mounted again', () => {
    window.history.pushState({}, '', '/services/OS-2026-0142/attendance');
    const first = render(<App currentUser={technician} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar e iniciar' }),
    );
    first.unmount();
    render(<App currentUser={technician} />);
    expect(
      screen.getByRole('heading', { name: 'Conferência da ordem de serviço' }),
    ).toBeInTheDocument();
  });
});

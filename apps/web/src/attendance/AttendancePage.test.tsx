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
    const startButton = screen.getByRole('button', {
      name: 'Confirmar e iniciar',
    });
    expect(startButton).toHaveClass('px-4', 'whitespace-normal');
    expect(screen.getByLabelText('Razão social')).toHaveValue(
      'FrioSul Alimentos S.A.',
    );
    expect(screen.getByLabelText('Nome fantasia')).toHaveValue(
      'FrioSul Alimentos',
    );
    expect(screen.getByLabelText('CNPJ')).toHaveValue('12.345.678/0001-90');
    fireEvent.change(screen.getByLabelText('Endereço da empresa'), {
      target: { value: '' },
    });
    expect(screen.getByLabelText('Endereço da empresa')).toHaveValue('');
    fireEvent.change(screen.getByLabelText('Endereço da empresa'), {
      target: { value: 'Rua atualizada, 10' },
    });
    fireEvent.change(screen.getByLabelText('Nome fantasia'), {
      target: { value: 'FrioSul Atualizada' },
    });
    fireEvent.click(startButton);
    expect(screen.getByText('FrioSul Atualizada')).toBeInTheDocument();
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

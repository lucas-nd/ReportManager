import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../App.js';
const technician = { id: 'tech-1', role: 'technician' } as const;
describe('attendance flow', () => {
  it('opens attendance when secure-context UUID is unavailable', () => {
    const originalRandomUuid = globalThis.crypto.randomUUID;
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      globalThis.crypto,
      'randomUUID',
    );
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      configurable: true,
      value: undefined,
    });
    try {
      window.history.pushState({}, '', '/services/OS-2026-0142/attendance');
      render(<App currentUser={technician} />);
      expect(
        screen.getByRole('heading', {
          name: 'Conferência da ordem de serviço',
        }),
      ).toBeInTheDocument();
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(
          globalThis.crypto,
          'randomUUID',
          originalDescriptor,
        );
      } else {
        delete (globalThis.crypto as Partial<Crypto>).randomUUID;
      }
    }
  });
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
    fireEvent.click(screen.getByRole('combobox', { name: 'Tipo da etapa' }));
    expect(screen.getByRole('listbox', { name: 'Tipo da etapa' })).toHaveClass(
      'bg-surface',
    );
    expect(
      screen.getByRole('option', { name: 'Diagnóstico' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Início' }));
    expect(
      screen.getByRole('dialog', { name: 'Escolher data e hora' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Início' }));
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: () => 'blob:preview-photo',
    });
    fireEvent.change(screen.getByLabelText('Adicionar foto'), {
      target: {
        files: [new File(['photo'], 'equipamento.jpg', { type: 'image/jpeg' })],
      },
    });
    expect(
      screen.getByRole('img', { name: 'Preview de equipamento.jpg' }),
    ).toHaveAttribute('src', 'blob:preview-photo');
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

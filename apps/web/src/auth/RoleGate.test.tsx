import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RoleGate } from './RoleGate.js';
import { SessionProvider } from './SessionContext.js';

describe('RoleGate', () => {
  it('renders content for an allowed role', () => {
    render(
      <SessionProvider user={{ id: 'admin-1', role: 'administrator' }}>
        <RoleGate allow={['administrator']}>Administração</RoleGate>
      </SessionProvider>,
    );

    expect(screen.getByText('Administração')).toBeInTheDocument();
  });

  it('hides content from a role that is not allowed', () => {
    render(
      <SessionProvider user={{ id: 'tech-1', role: 'technician' }}>
        <RoleGate allow={['administrator']}>Administração</RoleGate>
      </SessionProvider>,
    );

    expect(screen.queryByText('Administração')).not.toBeInTheDocument();
  });

  it('hides content when there is no authenticated user', () => {
    render(
      <SessionProvider user={null}>
        <RoleGate allow={['technician']}>Atendimento</RoleGate>
      </SessionProvider>,
    );

    expect(screen.queryByText('Atendimento')).not.toBeInTheDocument();
  });
});

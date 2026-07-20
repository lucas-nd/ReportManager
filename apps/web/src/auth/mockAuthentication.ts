import type { AuthenticatedUser } from '@report-manager/shared';

type MockAccount = {
  email: string;
  password: string;
  user: AuthenticatedUser;
};

const mockAccounts: MockAccount[] = [
  {
    email: 'admin@fieldflow.local',
    password: 'admin123',
    user: { id: 'mock-administrator', role: 'administrator' },
  },
  {
    email: 'tecnico@fieldflow.local',
    password: 'tecnico123',
    user: { id: 'mock-technician', role: 'technician' },
  },
];

export function authenticateWithMock(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = mockAccounts.find(
    (candidate) =>
      candidate.email === normalizedEmail && candidate.password === password,
  );

  return account?.user ?? null;
}

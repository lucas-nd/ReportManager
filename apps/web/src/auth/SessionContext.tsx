import type { AuthenticatedUser } from '@report-manager/shared';
import { createContext, useContext, type ReactNode } from 'react';

const SessionContext = createContext<AuthenticatedUser | null | undefined>(
  undefined,
);

type SessionProviderProps = {
  children: ReactNode;
  user: AuthenticatedUser | null;
};

export function SessionProvider({ children, user }: SessionProviderProps) {
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const user = useContext(SessionContext);

  if (user === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return user;
}

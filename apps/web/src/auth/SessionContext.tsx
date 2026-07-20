import type { AuthenticatedUser } from '@report-manager/shared';
import { createContext, useContext, useState, type ReactNode } from 'react';

import { authenticateWithMock } from './mockAuthentication.js';

type Session = {
  signIn: (email: string, password: string) => boolean;
  user: AuthenticatedUser | null;
};

const SessionContext = createContext<Session | undefined>(undefined);

type SessionProviderProps = {
  children: ReactNode;
  user: AuthenticatedUser | null;
};

export function SessionProvider({ children, user }: SessionProviderProps) {
  const [currentUser, setCurrentUser] = useState(user);

  function signIn(email: string, password: string) {
    const authenticatedUser = authenticateWithMock(email, password);

    if (!authenticatedUser) {
      return false;
    }

    setCurrentUser(authenticatedUser);
    return true;
  }

  return (
    <SessionContext.Provider value={{ signIn, user: currentUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const session = useContext(SessionContext);

  if (session === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return session;
}

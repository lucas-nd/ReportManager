import {
  AuthenticatedUserSchema,
  type AuthenticatedUser,
} from '@report-manager/shared';
import { createContext, useContext, useState, type ReactNode } from 'react';

import { authenticateWithMock } from './mockAuthentication.js';

type Session = {
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
  user: AuthenticatedUser | null;
};

const SessionContext = createContext<Session | undefined>(undefined);
const sessionStorageKey = 'report-manager-session';

function readStoredUser() {
  const storedSession = window.localStorage.getItem(sessionStorageKey);

  if (!storedSession) {
    return null;
  }

  try {
    const authenticatedUser = AuthenticatedUserSchema.safeParse(
      JSON.parse(storedSession),
    );

    if (authenticatedUser.success) {
      return authenticatedUser.data;
    }
  } catch {
    // Invalid persisted data is treated as an expired session.
  }

  window.localStorage.removeItem(sessionStorageKey);
  return null;
}

type SessionProviderProps = {
  children: ReactNode;
  user?: AuthenticatedUser | null;
};

export function SessionProvider({ children, user }: SessionProviderProps) {
  const [currentUser, setCurrentUser] = useState(() =>
    user === undefined ? readStoredUser() : user,
  );

  function signIn(email: string, password: string) {
    const authenticatedUser = authenticateWithMock(email, password);

    if (!authenticatedUser) {
      return false;
    }

    window.localStorage.setItem(
      sessionStorageKey,
      JSON.stringify(authenticatedUser),
    );
    setCurrentUser(authenticatedUser);
    return true;
  }

  function signOut() {
    window.localStorage.removeItem(sessionStorageKey);
    setCurrentUser(null);
  }

  return (
    <SessionContext.Provider value={{ signIn, signOut, user: currentUser }}>
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

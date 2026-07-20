import type { RouteAccess } from '@report-manager/shared';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { getRoleHomePath } from './roleHome.js';
import { useSession } from './SessionContext.js';

type RouteAccessGuardProps = {
  access: RouteAccess;
  children: ReactNode;
};

export function RouteAccessGuard({ access, children }: RouteAccessGuardProps) {
  const { user } = useSession();

  switch (access.type) {
    case 'public':
      return children;
    case 'guest-only':
      return user ? (
        <Navigate replace to={getRoleHomePath(user.role)} />
      ) : (
        children
      );
    case 'authenticated':
      return user ? children : <Navigate replace to="/login" />;
    case 'roles':
      if (!user) {
        return <Navigate replace to="/login" />;
      }

      return access.roles.includes(user.role) ? (
        children
      ) : (
        <Navigate replace to="/forbidden" />
      );
  }
}

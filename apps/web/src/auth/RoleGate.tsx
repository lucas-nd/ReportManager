import type { UserRole } from '@report-manager/shared';
import type { ReactNode } from 'react';

import { useSession } from './SessionContext.js';

type RoleGateProps = {
  allow: readonly [UserRole, ...UserRole[]];
  children: ReactNode;
};

export function RoleGate({ allow, children }: RoleGateProps) {
  const user = useSession();

  if (!user || !allow.includes(user.role)) {
    return null;
  }

  return children;
}

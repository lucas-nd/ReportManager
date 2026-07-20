import type { UserRole } from '@report-manager/shared';

const homePathByRole: Record<UserRole, string> = {
  administrator: '/admin',
  technician: '/services',
};

export function getRoleHomePath(role: UserRole) {
  return homePathByRole[role];
}

import { describe, expect, it } from 'vitest';

import {
  AuthenticatedUserSchema,
  RouteAccessSchema,
  UserRoleSchema,
  type RouteAccess,
} from './auth.js';

describe('authorization contracts', () => {
  it('accepts only the administrator and technician roles', () => {
    expect(UserRoleSchema.parse('administrator')).toBe('administrator');
    expect(UserRoleSchema.parse('technician')).toBe('technician');
    expect(UserRoleSchema.safeParse('supervisor').success).toBe(false);
  });

  it('validates an authenticated user', () => {
    expect(
      AuthenticatedUserSchema.parse({ id: 'user-1', role: 'technician' }),
    ).toEqual({ id: 'user-1', role: 'technician' });
  });

  it('requires at least one role for role-restricted access', () => {
    expect(
      RouteAccessSchema.parse({
        type: 'roles',
        roles: ['administrator', 'technician'],
      }),
    ).toEqual({
      type: 'roles',
      roles: ['administrator', 'technician'],
    });
    expect(
      RouteAccessSchema.safeParse({ type: 'roles', roles: [] }).success,
    ).toBe(false);

    // @ts-expect-error Role-restricted access must contain at least one role.
    const accessWithoutRoles: RouteAccess = { type: 'roles', roles: [] };
    expect(accessWithoutRoles).toBeDefined();
  });
});

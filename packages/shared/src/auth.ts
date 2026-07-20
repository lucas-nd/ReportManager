import { z } from 'zod';

export const UserRoleSchema = z.enum(['administrator', 'technician']);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const AuthenticatedUserSchema = z.object({
  id: z.string().min(1),
  role: UserRoleSchema,
});

export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;

export const RouteAccessSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('public') }),
  z.object({ type: z.literal('guest-only') }),
  z.object({ type: z.literal('authenticated') }),
  z.object({
    type: z.literal('roles'),
    roles: z.tuple([UserRoleSchema], UserRoleSchema),
  }),
]);

export type RouteAccess = z.infer<typeof RouteAccessSchema>;

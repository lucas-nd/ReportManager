import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@report-manager/shared';

import { ALLOWED_ROLES_METADATA } from './auth.metadata.js';

export const allowRoles = (role: UserRole, ...additionalRoles: UserRole[]) =>
  SetMetadata(ALLOWED_ROLES_METADATA, [role, ...additionalRoles]);

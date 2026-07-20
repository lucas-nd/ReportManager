import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AuthenticatedUserSchema,
  type AuthenticatedUser,
} from '@report-manager/shared';

import { PUBLIC_ROUTE_METADATA } from './auth.metadata.js';

type RequestWithUser = {
  // Populated by the authentication adapter before authorization runs.
  user?: unknown;
};

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_ROUTE_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authenticatedUser = AuthenticatedUserSchema.safeParse(request.user);

    if (!authenticatedUser.success) {
      throw new UnauthorizedException();
    }

    (request as { user: AuthenticatedUser }).user = authenticatedUser.data;
    return true;
  }
}

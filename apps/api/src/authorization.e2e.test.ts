import { Controller, Get, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser, UserRole } from '@report-manager/shared';
import request from 'supertest';
import { afterEach, describe, it } from 'vitest';

import { AppModule } from './app.module.js';
import { allowRoles } from './auth/roles.decorator.js';

@Controller('authorization-test')
class AuthorizationTestController {
  @Get('authenticated')
  authenticated() {
    return { access: 'authenticated' };
  }

  @Get('administrator')
  @allowRoles('administrator')
  administrator() {
    return { access: 'administrator' };
  }

  @Get('shared')
  @allowRoles('administrator', 'technician')
  shared() {
    return { access: 'shared' };
  }
}

describe('authorization guards', () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
  });

  async function createApp() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AuthorizationTestController],
    }).compile();
    app = module.createNestApplication();
    app.use(
      (
        incomingRequest: {
          headers: Record<string, string | string[] | undefined>;
          user?: AuthenticatedUser;
        },
        _response: unknown,
        next: () => void,
      ) => {
        const role = incomingRequest.headers['x-test-user-role'] as
          UserRole | undefined;

        if (role) {
          incomingRequest.user = { id: 'test-user', role };
        }

        next();
      },
    );
    await app.init();
  }

  it('allows explicitly public endpoints without a user', async () => {
    await createApp();

    await request(app!.getHttpServer()).get('/health').expect(200);
  });

  it('returns 401 for a protected endpoint without a user', async () => {
    await createApp();

    await request(app!.getHttpServer())
      .get('/authorization-test/authenticated')
      .expect(401);
  });

  it('allows any authenticated profile when no roles are required', async () => {
    await createApp();

    await request(app!.getHttpServer())
      .get('/authorization-test/authenticated')
      .set('x-test-user-role', 'technician')
      .expect(200)
      .expect({ access: 'authenticated' });
  });

  it('returns 403 when the authenticated profile is not allowed', async () => {
    await createApp();

    await request(app!.getHttpServer())
      .get('/authorization-test/administrator')
      .set('x-test-user-role', 'technician')
      .expect(403);
  });

  it('allows every profile declared by a shared route', async () => {
    await createApp();

    await request(app!.getHttpServer())
      .get('/authorization-test/shared')
      .set('x-test-user-role', 'administrator')
      .expect(200);
    await request(app!.getHttpServer())
      .get('/authorization-test/shared')
      .set('x-test-user-role', 'technician')
      .expect(200);
  });
});

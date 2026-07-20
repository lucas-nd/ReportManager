import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthenticationGuard } from './auth/authentication.guard.js';
import { RolesGuard } from './auth/roles.guard.js';
import { HealthController } from './health.controller.js';

@Module({
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

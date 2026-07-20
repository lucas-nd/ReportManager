import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@report-manager/shared';

import { publicRoute } from './auth/public.decorator.js';

@Controller('health')
@publicRoute()
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return { status: 'ok' };
  }
}

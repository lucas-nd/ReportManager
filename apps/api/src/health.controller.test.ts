import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';

import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('returns the healthy status', async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    expect(module.get(HealthController).getHealth()).toEqual({ status: 'ok' });
  });
});

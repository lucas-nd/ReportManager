import { describe, expect, it } from 'vitest';

import { HealthResponseSchema } from './health.js';

describe('HealthResponseSchema', () => {
  it('accepts the API health response', () => {
    expect(HealthResponseSchema.parse({ status: 'ok' })).toEqual({
      status: 'ok',
    });
  });

  it('rejects an incompatible status', () => {
    expect(() => HealthResponseSchema.parse({ status: 'error' })).toThrow();
  });
});

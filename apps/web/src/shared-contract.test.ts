import { HealthResponseSchema } from '@report-manager/shared';
import { describe, expect, it } from 'vitest';

describe('shared workspace contract', () => {
  it('consumes the health response schema through the package interface', () => {
    expect(HealthResponseSchema.parse({ status: 'ok' })).toEqual({
      status: 'ok',
    });
  });
});

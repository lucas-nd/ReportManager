import { describe, expect, it } from 'vitest';
import {
  evaluateCondition,
  RendererRegistry,
  resolveOptions,
  validateFields,
} from './engine.js';

describe('workflow engine', () => {
  it('evaluates safe nested conditions', () =>
    expect(
      evaluateCondition(
        {
          operator: 'all',
          conditions: [
            { operator: 'exists', binding: 'name' },
            {
              operator: 'not',
              condition: {
                operator: 'equals',
                binding: 'status',
                value: 'closed',
              },
            },
          ],
        },
        { name: 'Motor', status: 'open' },
      ),
    ).toBe(true));
  it('validates conditional requirements', () =>
    expect(
      validateFields(
        [
          {
            id: 'reason',
            label: 'Motivo',
            binding: 'reason',
            type: 'text',
            rules: {
              requiredWhen: {
                operator: 'equals',
                binding: 'incomplete',
                value: true,
              },
            },
          },
        ],
        { incomplete: true },
      ),
    ).toEqual({ reason: 'Campo obrigatório' }));
  it('resolves referenced option sources', () =>
    expect(
      resolveOptions(
        {
          id: 'equipment',
          label: 'Equipamento',
          binding: 'equipment',
          type: 'select',
          optionSource: 'equipment',
        },
        { equipment: [{ value: 'chiller', label: 'Chiller' }] },
      ),
    ).toHaveLength(1));
  it('fails explicitly for an unregistered renderer', () =>
    expect(() => new RendererRegistry().get('signature')).toThrow(/signature/));
});

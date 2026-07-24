import { describe, expect, it } from 'vitest';
import { parseWorkflowTemplate } from './workflow.js';
const template = {
  schemaVersion: 1,
  id: 'attendance',
  version: '1',
  name: 'Atendimento',
  initialStateId: 'checking',
  initialScreenId: 'check',
  optionSources: ['equipment'],
  states: [
    { id: 'checking', screenId: 'check' },
    { id: 'active', screenId: 'hub' },
  ],
  screens: [
    {
      id: 'check',
      title: 'Conferência',
      sections: [
        {
          id: 'order',
          title: 'OS',
          fields: [
            {
              id: 'equipment',
              type: 'select',
              label: 'Equipamento',
              binding: 'equipment',
              optionSource: 'equipment',
            },
          ],
        },
      ],
      actions: [],
    },
    { id: 'hub', title: 'Atendimento', sections: [], actions: [] },
  ],
  transitions: [{ id: 'start', from: 'checking', to: 'active' }],
  subflows: [],
} as const;
describe('WorkflowTemplate', () => {
  it('survives a JSON round trip', () =>
    expect(
      parseWorkflowTemplate(JSON.parse(JSON.stringify(template))),
    ).toMatchObject({ id: 'attendance', version: '1' }));
  it('rejects duplicate ids', () =>
    expect(() =>
      parseWorkflowTemplate({
        ...template,
        states: [template.states[0], template.states[0]],
      }),
    ).toThrow(/Duplicate/));
  it('rejects missing destinations', () =>
    expect(() =>
      parseWorkflowTemplate({
        ...template,
        transitions: [{ id: 'bad', from: 'checking', to: 'missing' }],
      }),
    ).toThrow(/Invalid transition/));
  it('rejects invalid bindings and option sources', () =>
    expect(() =>
      parseWorkflowTemplate({
        ...template,
        screens: [
          {
            ...template.screens[0],
            sections: [
              {
                ...template.screens[0].sections[0],
                fields: [
                  {
                    ...template.screens[0].sections[0].fields[0],
                    optionSource: 'missing',
                    rules: {
                      requiredWhen: { operator: 'exists', binding: 'unknown' },
                    },
                  },
                ],
              },
            ],
          },
          template.screens[1],
        ],
      }),
    ).toThrow());
});

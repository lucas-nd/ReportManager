import { z } from 'zod';

const identifier = z
  .string()
  .min(1)
  .regex(/^[a-z][a-zA-Z0-9._-]*$/);
export const WorkflowValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.string()),
]);
export type WorkflowValue = z.infer<typeof WorkflowValueSchema>;
export type WorkflowCondition =
  | { operator: 'equals' | 'includes'; binding: string; value: WorkflowValue }
  | { operator: 'exists'; binding: string }
  | { operator: 'all' | 'any'; conditions: WorkflowCondition[] }
  | { operator: 'not'; condition: WorkflowCondition };
export const WorkflowConditionSchema: z.ZodType<WorkflowCondition> = z.lazy(
  () =>
    z.union([
      z.object({
        operator: z.enum(['equals', 'includes']),
        binding: identifier,
        value: WorkflowValueSchema,
      }),
      z.object({ operator: z.literal('exists'), binding: identifier }),
      z.object({
        operator: z.enum(['all', 'any']),
        conditions: z.array(WorkflowConditionSchema).min(1),
      }),
      z.object({
        operator: z.literal('not'),
        condition: WorkflowConditionSchema,
      }),
    ]),
);
const rules = z.object({
  visibleWhen: WorkflowConditionSchema.optional(),
  requiredWhen: WorkflowConditionSchema.optional(),
  enabledWhen: WorkflowConditionSchema.optional(),
});
const base = {
  id: identifier,
  label: z.string().min(1),
  binding: identifier,
  helpText: z.string().optional(),
  required: z.boolean().optional(),
  rules: rules.optional(),
};
const simple = z.object({
  ...base,
  type: z.enum([
    'text',
    'textarea',
    'number',
    'boolean',
    'date',
    'datetime',
    'file',
    'image',
    'signature',
  ]),
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().int().nonnegative().optional(),
  maxLength: z.number().int().positive().optional(),
});
const selection = z.object({
  ...base,
  type: z.enum(['select', 'multiselect']),
  options: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
  optionSource: identifier.optional(),
});
export type WorkflowField =
  | z.infer<typeof simple>
  | z.infer<typeof selection>
  | {
      id: string;
      label: string;
      binding: string;
      type: 'group';
      helpText?: string;
      required?: boolean;
      rules?: z.infer<typeof rules>;
      fields: WorkflowField[];
    }
  | {
      id: string;
      label: string;
      binding: string;
      type: 'collection';
      helpText?: string;
      required?: boolean;
      rules?: z.infer<typeof rules>;
      itemWorkflow: string;
    };
export const WorkflowFieldSchema: z.ZodType<WorkflowField> = z.lazy(() =>
  z.union([
    simple,
    selection.refine(
      (field) => Boolean(field.options) !== Boolean(field.optionSource),
      'Selection fields require exactly one option source',
    ),
    z.object({
      ...base,
      type: z.literal('group'),
      fields: z.array(WorkflowFieldSchema).min(1),
    }),
    z.object({
      ...base,
      type: z.literal('collection'),
      itemWorkflow: identifier,
    }),
  ]),
);
const action = z.discriminatedUnion('type', [
  z.object({ type: z.literal('navigate'), screenId: identifier }),
  z.object({ type: z.literal('setState'), stateId: identifier }),
  z.object({
    type: z.enum(['createItem', 'editItem']),
    collectionBinding: identifier,
  }),
  z.object({ type: z.enum(['pause', 'resume', 'submit']) }),
]);
const rawTemplate = z.object({
  schemaVersion: z.literal(1),
  id: identifier,
  version: z.string().min(1),
  name: z.string().min(1),
  initialStateId: identifier,
  initialScreenId: identifier,
  optionSources: z.array(identifier).default([]),
  states: z
    .array(
      z.object({
        id: identifier,
        screenId: identifier,
        readOnly: z.boolean().optional(),
      }),
    )
    .min(1),
  screens: z
    .array(
      z.object({
        id: identifier,
        title: z.string().min(1),
        description: z.string().optional(),
        sections: z.array(
          z.object({
            id: identifier,
            title: z.string().min(1),
            fields: z.array(WorkflowFieldSchema),
          }),
        ),
        actions: z.array(
          z.object({
            id: identifier,
            label: z.string().min(1),
            action,
            when: WorkflowConditionSchema.optional(),
          }),
        ),
      }),
    )
    .min(1),
  transitions: z.array(
    z.object({
      id: identifier,
      from: identifier,
      to: identifier,
      when: WorkflowConditionSchema.optional(),
    }),
  ),
  subflows: z
    .array(
      z.object({
        id: identifier,
        initialStateId: identifier,
        states: z.array(z.object({ id: identifier })).min(1),
      }),
    )
    .default([]),
});
export type WorkflowTemplate = z.infer<typeof rawTemplate>;
export type WorkflowAnswers = Record<string, unknown>;
const leaves = (condition?: WorkflowCondition): WorkflowCondition[] =>
  !condition
    ? []
    : condition.operator === 'all' || condition.operator === 'any'
      ? condition.conditions.flatMap(leaves)
      : condition.operator === 'not'
        ? leaves(condition.condition)
        : [condition];
export const WorkflowTemplateSchema = rawTemplate.superRefine(
  (template, context) => {
    const allIds = [
      ...template.states,
      ...template.screens,
      ...template.transitions,
      ...template.subflows,
    ].map((item) => item.id);
    const duplicate = allIds.find(
      (value, index) => allIds.indexOf(value) !== index,
    );
    if (duplicate)
      context.addIssue({
        code: 'custom',
        message: `Duplicate id: ${duplicate}`,
      });
    const stateIds = new Set(template.states.map(({ id }) => id));
    const screenIds = new Set(template.screens.map(({ id }) => id));
    const subflows = new Set(template.subflows.map(({ id }) => id));
    const sources = new Set(template.optionSources);
    const bindings = new Set<string>();
    const fieldIds: string[] = [];
    const conditions = template.transitions.flatMap(({ when }) => leaves(when));
    const visit = (field: WorkflowField) => {
      fieldIds.push(field.id);
      bindings.add(field.binding);
      Object.values(field.rules ?? {}).forEach((condition) =>
        conditions.push(...leaves(condition)),
      );
      if (field.type === 'group') field.fields.forEach(visit);
      if (field.type === 'collection' && !subflows.has(field.itemWorkflow))
        context.addIssue({
          code: 'custom',
          message: `Unknown subflow: ${field.itemWorkflow}`,
        });
      if (
        (field.type === 'select' || field.type === 'multiselect') &&
        field.optionSource &&
        !sources.has(field.optionSource)
      )
        context.addIssue({
          code: 'custom',
          message: `Unknown option source: ${field.optionSource}`,
        });
    };
    template.screens.forEach((screen) => {
      screen.sections.forEach((section) => section.fields.forEach(visit));
      screen.actions.forEach(({ when }) => conditions.push(...leaves(when)));
    });
    const duplicateField = fieldIds.find(
      (value, index) => fieldIds.indexOf(value) !== index,
    );
    if (duplicateField)
      context.addIssue({
        code: 'custom',
        message: `Duplicate field id: ${duplicateField}`,
      });
    if (!stateIds.has(template.initialStateId))
      context.addIssue({ code: 'custom', message: 'Unknown initial state' });
    if (!screenIds.has(template.initialScreenId))
      context.addIssue({ code: 'custom', message: 'Unknown initial screen' });
    template.states.forEach((state) => {
      if (!screenIds.has(state.screenId))
        context.addIssue({
          code: 'custom',
          message: `Unknown screen: ${state.screenId}`,
        });
    });
    template.transitions.forEach((transition) => {
      if (!stateIds.has(transition.from) || !stateIds.has(transition.to))
        context.addIssue({
          code: 'custom',
          message: `Invalid transition: ${transition.id}`,
        });
    });
    conditions.forEach((condition) => {
      if (
        'binding' in condition &&
        !bindings.has(condition.binding) &&
        !condition.binding.startsWith('context.')
      )
        context.addIssue({
          code: 'custom',
          message: `Unknown binding: ${condition.binding}`,
        });
    });
  },
);
export const WorkflowInstanceSchema = z.object({
  id: identifier,
  templateId: identifier,
  templateVersion: z.string().min(1),
  stateId: identifier,
  screenId: identifier,
  status: z.enum(['draft', 'active', 'paused', 'completed']),
  answers: z.record(z.string(), z.unknown()),
});
export type WorkflowInstance = z.infer<typeof WorkflowInstanceSchema>;
export const parseWorkflowTemplate = (input: unknown) =>
  WorkflowTemplateSchema.parse(input);

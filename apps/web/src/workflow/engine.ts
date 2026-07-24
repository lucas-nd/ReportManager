import { createSessionId } from '../lib/sessionId.js';

import type {
  WorkflowAnswers,
  WorkflowCondition,
  WorkflowField,
  WorkflowInstance,
  WorkflowTemplate,
} from '@report-manager/shared';

export type Option = { value: string; label: string };
export type OptionSources = Record<string, Option[]>;
export const readBinding = (answers: WorkflowAnswers, binding: string) =>
  binding
    .split('.')
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === 'object'
          ? (value as Record<string, unknown>)[key]
          : undefined,
      answers,
    );
export function evaluateCondition(
  condition: WorkflowCondition | undefined,
  answers: WorkflowAnswers,
): boolean {
  if (!condition) return true;
  if (condition.operator === 'all')
    return condition.conditions.every((item) =>
      evaluateCondition(item, answers),
    );
  if (condition.operator === 'any')
    return condition.conditions.some((item) =>
      evaluateCondition(item, answers),
    );
  if (condition.operator === 'not')
    return !evaluateCondition(condition.condition, answers);
  if (!('binding' in condition)) return false;
  const actual = readBinding(answers, condition.binding);
  if (condition.operator === 'exists')
    return actual !== undefined && actual !== null && actual !== '';
  if (!('value' in condition)) return false;
  if (condition.operator === 'equals') return actual === condition.value;
  return Array.isArray(actual)
    ? actual.includes(condition.value)
    : typeof actual === 'string' &&
        typeof condition.value === 'string' &&
        actual.includes(condition.value);
}
export const resolveOptions = (
  field: WorkflowField,
  sources: OptionSources,
): Option[] =>
  field.type === 'select' || field.type === 'multiselect'
    ? (field.options ?? sources[field.optionSource ?? ''] ?? [])
    : [];
export function validateFields(
  fields: WorkflowField[],
  answers: WorkflowAnswers,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    if (
      field.rules?.visibleWhen &&
      !evaluateCondition(field.rules.visibleWhen, answers)
    )
      continue;
    if (field.type === 'group')
      Object.assign(errors, validateFields(field.fields, answers));
    const required =
      field.required || evaluateCondition(field.rules?.requiredWhen, answers);
    const value = readBinding(answers, field.binding);
    if (
      required &&
      (value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0))
    )
      errors[field.binding] = 'Campo obrigatório';
    if (
      'minLength' in field &&
      field.minLength &&
      typeof value === 'string' &&
      value.length < field.minLength
    )
      errors[field.binding] = `Informe ao menos ${field.minLength} caracteres`;
  }
  return errors;
}
export function createInstance(
  template: WorkflowTemplate,
  id = `instance-${Date.now()}`,
): WorkflowInstance {
  return {
    id,
    templateId: template.id,
    templateVersion: template.version,
    stateId: template.initialStateId,
    screenId: template.initialScreenId,
    status: 'draft',
    answers: {},
  };
}
export function transition(
  template: WorkflowTemplate,
  instance: WorkflowInstance,
  to: string,
): WorkflowInstance {
  const allowed = template.transitions.some(
    (item) =>
      item.from === instance.stateId &&
      item.to === to &&
      evaluateCondition(item.when, instance.answers),
  );
  if (!allowed)
    throw new Error(`Transition ${instance.stateId} → ${to} is not allowed`);
  const state = template.states.find((item) => item.id === to);
  if (!state) throw new Error(`Unknown state: ${to}`);
  return {
    ...instance,
    stateId: to,
    screenId: state.screenId,
    status:
      to === 'completed' ? 'completed' : to === 'paused' ? 'paused' : 'active',
  };
}
export class AttachmentStore {
  private files = new Map<string, File>();
  private previews = new Map<string, string>();
  add(file: File) {
    const id = createSessionId('attachment');
    this.files.set(id, file);
    return id;
  }
  get(id: string) {
    return this.files.get(id);
  }
  preview(id: string) {
    const existing = this.previews.get(id);
    if (existing) return existing;
    const file = this.files.get(id);
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    this.previews.set(id, url);
    return url;
  }
  clear() {
    this.previews.forEach((url) => URL.revokeObjectURL?.(url));
    this.previews.clear();
    this.files.clear();
  }
}
export class RendererRegistry<T> {
  private renderers = new Map<string, T>();
  register(type: string, renderer: T) {
    this.renderers.set(type, renderer);
    return this;
  }
  get(type: string): T {
    const renderer = this.renderers.get(type);
    if (!renderer)
      throw new Error(`No renderer registered for field type: ${type}`);
    return renderer;
  }
}

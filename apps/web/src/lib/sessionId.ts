export function createSessionId(prefix: string): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return `${prefix}-${uuid}`;

  if (globalThis.crypto?.getRandomValues) {
    const entropy = new Uint32Array(2);
    globalThis.crypto.getRandomValues(entropy);
    return `${prefix}-${Array.from(entropy, (value) => value.toString(36)).join('-')}`;
  }

  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

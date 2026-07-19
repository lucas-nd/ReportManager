# Report Manager

Monorepo da plataforma de gestão de serviços técnicos em campo.

## Requisitos

- Node.js 24
- pnpm 11

## Workspaces

- `apps/web`: aplicação React + Vite, preparada como PWA.
- `apps/api`: API NestJS.
- `packages/shared`: contratos e tipos compartilhados.

## Comandos

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
```

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

Por padrão, o web fica disponível em `http://localhost:5174` e a API em
`http://localhost:3001`. Use `PORT` para sobrescrever a porta da API.

## Autenticação

A autenticação atual é uma implementação de demonstração e persiste apenas os
dados do usuário no `localStorage`. Quando a autenticação real for integrada,
provavelmente com Supabase, a estratégia de sessão deve ser reavaliada antes de
armazenar tokens no navegador. A preferência deve ser por cookies seguros,
quando compatíveis com a arquitetura adotada, em vez de `localStorage`.

Consulte a consideração arquitetural em `IDEA.md` antes de implementar esse
fluxo.

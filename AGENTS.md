# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm TypeScript monorepo with three workspaces:

- `apps/web`: React and Vite client. Source and colocated tests live in `src/`; installable PWA assets live in `public/`.
- `apps/api`: Minimal NestJS API. Controllers, modules, bootstrap code, unit tests, and HTTP tests live in `src/`.
- `packages/shared`: Zod schemas and inferred types shared through the `@report-manager/shared` package interface.

Generated `dist/`, coverage output, and dependencies are ignored. Do not edit generated files. Product context is documented in `IDEA.md`.

## Build, Test, and Development Commands

Use Node.js 24 and pnpm 11.

- `pnpm install`: install all workspace dependencies and update the lockfile.
- `pnpm dev`: build/watch the shared package and start the web and API development servers.
- `pnpm build`: build shared first, then the API and production PWA.
- `pnpm typecheck`: generate shared declarations and type-check every workspace.
- `pnpm test`: run all Vitest suites.
- `pnpm lint`: run ESLint across the repository.
- `pnpm format:check`: verify Prettier formatting; use `pnpm format` to fix it.

For focused work, use workspace filters, for example `pnpm --filter @report-manager/api test`.

## Coding Style & Naming Conventions

Prettier is authoritative: two-space indentation, single quotes, semicolons, and trailing commas. TypeScript runs in strict mode. Keep package interfaces small; consumers must import shared contracts from `@report-manager/shared`, never internal source paths.

Use PascalCase for React components, NestJS classes, and exported types; camelCase for functions and variables. Follow existing descriptive filenames such as `health.controller.ts` and `health.e2e.test.ts`.

## Testing Guidelines

Vitest is used throughout. Name tests `*.test.ts` or `*.test.tsx` and colocate them with the code. Cover schema validation, controller behavior, HTTP contracts, and rendered UI behavior as appropriate. There is no numeric coverage threshold; every behavior change should include a focused regression test. Run `pnpm test` and `pnpm typecheck` before submitting.

## Commit & Pull Request Guidelines

Recent commits use Conventional Commit subjects such as `chore: scaffold ...` and `fix: harden ...`. Continue with concise, imperative subjects (`feat:`, `fix:`, `test:`, `docs:`, `chore:`), keeping each commit focused.

Pull requests should explain the change and motivation, link relevant issues, list validation commands, and include screenshots for visible web changes. Call out PWA, contract, or compatibility implications explicitly. Never commit secrets; local `.env*` files are ignored except examples.

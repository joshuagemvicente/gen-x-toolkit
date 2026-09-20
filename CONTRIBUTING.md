# Contributing

Thanks for helping. This document covers the workflow; the rules the code must
follow are in [AGENTS.md](AGENTS.md) and they apply to every contribution.

> **Clean code best practices MUST be applied to every change.** SOLID and DRY
> are part of the definition of done here, not optional polish. See
> [AGENTS.md](AGENTS.md) for what that means concretely.

## Getting started

```sh
npm install          # Node >= 24, npm 11 (see package.json engines)
cp .env.example .env # optional: every variable has a working default
npm run dev          # starts every app through Turbo
```

| App | URL | Notes |
| --- | --- | --- |
| `apps/web` | http://localhost:3000 | Next.js frontend |
| `apps/docs` | http://localhost:3001 | Next.js documentation |
| `apps/api` | http://localhost:4000 | NestJS service |

`npm run dev` builds dependencies first, so a clean checkout works in one
command: `packages/contracts` compiles before either app starts.

## Commands

| Command | Effect |
| --- | --- |
| `npm run dev` | every app in watch mode |
| `npm run build` | build all apps and packages, in dependency order |
| `npm run lint` | ESLint across the workspace |
| `npm run check-types` | `tsc --noEmit` / `next typegen` per workspace |
| `npm run test` | unit and contract tests |
| `npm run format` | Prettier over the workspace |
| `npm run build -- --filter=api` | scope any task to one workspace |

## Repository layout

```
apps/web                    Next.js frontend
apps/docs                   Next.js documentation
apps/api                    NestJS service (domain / application / infrastructure / transport)
packages/contracts          HTTP payload schemas shared by both apps
packages/ui                 shared React components
packages/eslint-config      shared ESLint flat configs (base, nest, next-js, react-internal)
packages/typescript-config  shared tsconfig bases (base, nestjs, nextjs, react-library)
```

## Adding a feature end to end

1. **Contract first.** Add the request/response schemas to
   `packages/contracts/src/<feature>.ts` and export them from `index.ts`. This
   is the only place the shape is declared.
2. **Domain.** Add the entity and its invariants in
   `apps/api/src/modules/<feature>/domain/`. No framework, no I/O, no schemas —
   ESLint enforces this.
3. **Port.** Declare what the use case needs from the outside in
   `application/<feature>.repository.port.ts` (interface plus injection token).
4. **Use case.** Implement it in `application/<feature>.service.ts`, depending
   on the port, not on any adapter.
5. **Adapter.** Implement the port in `infrastructure/` (in-memory, database,
   HTTP — whatever the environment provides).
6. **Transport.** Add the controller in `transport/`, validate input with the
   contract schema via `ZodValidationPipe`, and map domain values to contract
   payloads explicitly.
7. **Wire.** Bind port to adapter in `modules/<feature>/<feature>.module.ts` and
   list the module in `apps/api/src/app.module.ts`.
8. **Consume.** Call it from the web app through `lib/api-client.ts` so the
   response is parsed against the same schema.
9. **Prove it.** Unit-test invariants and adapter boundaries; extend
   `apps/api/test/api.e2e-spec.ts` so the new endpoint is parsed with its
   contract schema.

Steps 1–9 are one change. A contract without its consumers, or a use case
without its wiring, is an incomplete change.

## Adding a workspace package

- Name application-side packages `@repo/<name>` (or a bare name for apps, to
  match `apps/web`, `apps/docs`, `apps/api`).
- Extend `@repo/typescript-config` and `@repo/eslint-config`; never add a
  second ESLint or tsconfig convention.
- Package consumed by `tsc` (like the API) → build it to `dist` and let Turbo
  order the build. Package consumed only by a bundler → keep it source-only and
  add it to that app's `transpilePackages`.

## Pull requests

- One concern per pull request; no drive-by refactors.
- State the behaviour change and how you verified it.
- `npm run lint && npm run check-types && npm run build && npm run test` passes.
- New behaviour is exercised at runtime, not only type-checked.
- Documentation that describes changed behaviour is updated in the same pull
  request (`README.md`, `AGENTS.md`, this file, or the app READMEs).

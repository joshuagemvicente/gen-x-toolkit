# apps/api

NestJS service for the toolkit. It owns HTTP, persistence and its own
configuration; every shape it exchanges with the web app comes from
[`@repo/contracts`](../../packages/contracts).

## Commands

Run from the repository root so Turbo resolves the dependency order:

```sh
npm run dev -- --filter=api      # watch mode, http://localhost:4000
npm run test -- --filter=api     # unit tests
npm run test:e2e -- --filter=api # contract tests over HTTP
npm run build -- --filter=api
```

## Layout

```
src/
  main.ts                 process entry point: create, configure, listen
  bootstrap.ts            cross-cutting wiring shared with the e2e tests
  app.module.ts           composition root: lists feature modules
  config/                 environment parsed once, injected everywhere
  common/                 cross-cutting transport concerns (pipes, filters)
  modules/<feature>/
    domain/               entities and invariants — no framework, no I/O
    application/          use cases, ports (interfaces the outside must satisfy)
    infrastructure/       adapters implementing those ports
    transport/            controllers and mappers between domain and contract
    <feature>.module.ts   the only place that binds a port to an adapter
```

## Rules that hold this together

- **Dependencies point inwards.** `transport → application → domain`. The
  `infrastructure` layer implements `application` ports; it never leaks back in.
- **No `process.env` outside `config/`.** Modules inject the validated
  `AppConfig`.
- **No payload shape is declared twice.** Request and response shapes come from
  `@repo/contracts`; the API validates with the same schema the web app types
  from.
- **Errors have one shape.** `ApiExceptionFilter` renders every failure with the
  contracted error envelope and never leaks an internal message.
- **The composition root is the only wiring.** Swapping the in-memory greeting
  adapter for a database changes one `useClass` in `greeting.module.ts`.

ESLint enforces the dependency direction for `domain/` and `application/`; see
`packages/eslint-config/nest.js`. The full conventions are in
[AGENTS.md](../../AGENTS.md) and [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Toolchain note

This workspace pins TypeScript **6.0.3**, while `apps/web`, `apps/docs` and the
packages use 7.0.2. That is deliberate: `nest build` and `nest start` drive the
TypeScript programmatic compiler API, which 7.0 no longer ships (it exposes only
the `tsc` executable; the API is expected back in 7.1). The Nest CLI refuses to
run and says so explicitly.

The pin is contained to this workspace — npm installs this version for `api`
alone. Tests do not depend on it either: Jest transforms with `@swc/jest`, so
test runs never type check (that is `check-types`' job, once).

## Environment

The service reads real environment variables; every one of them has a default,
so `npm run dev` works on a clean checkout. Copy [`.env.example`](../../.env.example)
to `.env` to override them, and export them when running `nest start`
(`node --env-file-if-exists=.env dist/main` is used for production builds).

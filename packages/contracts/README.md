# @repo/contracts

Every payload that crosses this monorepo's HTTP boundary, declared once with
[Zod](https://zod.dev).

- `apps/api` validates requests against these schemas and builds its responses from them.
- `apps/web` derives its types from the same schemas (`z.infer`) and parses responses with them.

Drift between the two sides therefore fails a type check or a runtime parse
instead of silently reaching a user. **Do not redeclare these shapes in an app.**

## Layout

| File | Contents |
| --- | --- |
| `src/health.ts` | `GET /health` |
| `src/greeting.ts` | `GET /greetings`, `GET /greetings/recent` |
| `src/api-error.ts` | The error envelope and validation-error detail shape |
| `src/index.ts` | Public surface — the only entry point consumers may import |

## Usage

```ts
import { HealthResponseSchema, type HealthResponse } from "@repo/contracts";
```

The package is compiled to `dist` (CommonJS + type declarations) because the
API consumes it through `tsc` rather than a bundler. Turbo builds it before
either app starts: `turbo dev` runs `^build` first, and `build` orders itself
against its dependencies.

# apps/web

Next.js frontend for the toolkit. It renders server components by default and
never declares an API payload shape of its own — every request and response
shape comes from [`@repo/contracts`](../../packages/contracts).

## Commands

```sh
npm run dev -- --filter=web      # http://localhost:3000
npm run build -- --filter=web
npm run lint -- --filter=web
```

Contract tests for the endpoints this app consumes live in
[`apps/api/test`](../api/test) — they parse live responses with the same schemas
`lib/api-client.ts` uses.

## Layout

```
app/
  layout.tsx          shell, fonts, metadata
  page.tsx            server component: reads health and greeting history
  greeting-panel.tsx  client component: calls the API from the browser
lib/
  api-client.ts       the only module that talks to the API
  result.ts           failures as values, so rendering has an explicit error path
```

## Rules that hold this together

- **All network access goes through `lib/api-client.ts`.** Responses are parsed
  with the contract schemas, so a drifted payload throws `ApiError` instead of
  rendering `undefined`.
- **Server components first.** Reach for `"use client"` only when the browser
  needs the behaviour, and keep such components at the leaves.
- **Failures have a rendered state.** An unreachable API shows a message, not a
  blank card or a crash.
- **No inline payload types.** Import them from `@repo/contracts`.

See [AGENTS.md](../../AGENTS.md) and [CONTRIBUTING.md](../../CONTRIBUTING.md)
for the repository-wide conventions.

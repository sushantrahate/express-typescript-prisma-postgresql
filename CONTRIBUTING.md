# Contributing

Thanks for considering a contribution to this project! This is a boilerplate/starter
template, so contributions that improve its usefulness as a starting point (bug fixes,
clearer defaults, better docs, additional examples) are especially welcome.

## Getting Started

1. Fork the repo and clone your fork.
2. Copy `.env.dev.example` to `.env.dev` and fill in your local Postgres connection
   details, a `JWT_SECRET` (32+ characters), and `WHITE_LIST_URLS`. See the
   "Environment Variables" section of the [README](README.md) for the full list.
3. Install dependencies:

   ```bash
   npm install
   ```

   This also runs `prisma generate` and sets up Husky via the `postinstall`/`prepare`
   scripts.

4. Run migrations and generate the Prisma client against your local database:

   ```bash
   npx prisma migrate dev
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

## Before Opening a Pull Request

Run the full verification suite locally — this is the same sequence CI runs:

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:ci
npm run build
```

A few conventions to follow:

- **Feature-based structure**: new features live under `src/features/<name>/` with
  their own `controllers/`, `services/`, `repositories/`, `routes/`, `schemas/`,
  `types/`, and `__tests__/` — see the README's architecture section for the rationale
  behind each layer.
- **Tests**: add unit tests for new middleware/utils/services under a local
  `__tests__/` folder, and prefer a Supertest integration test in `src/__tests__/` for
  new routes that don't require a live database. Coverage thresholds are enforced via
  `vitest.config.ts` — `npm run test:ci -- --coverage` will fail the build if they drop.
- **Env vars**: any new required environment variable must be added to
  `src/config/env-schema.ts` (with validation) and documented in `.env.dev.example` and
  the README's environment variable table.
- **No secrets in commits**: never commit `.env`, `.env.dev`, or real credentials —
  `.env.dev.example` should only ever contain placeholder values.
- **Dependency majors**: this repo intentionally pins a few dependencies (Prisma,
  ESLint, TypeScript) below their newest major release — see the README's "Pinned Major
  Versions" section before bumping them.

Husky runs `lint-staged` on commit (ESLint `--fix` + Prettier `--write` on staged
files), so most formatting issues are caught automatically.

## Commit Messages

Keep commit messages short and describe the *why*, not just the *what* — e.g.
`fix: prevent getProfile from hanging when unauthenticated` rather than
`update controller`.

## Reporting Bugs / Requesting Features

Open a GitHub issue with steps to reproduce (for bugs) or a clear description of the
use case (for feature requests). For security vulnerabilities, see
[SECURITY.md](SECURITY.md) instead of opening a public issue.

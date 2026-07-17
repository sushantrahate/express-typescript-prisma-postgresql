# 🚀 Express + TypeScript + Prisma + PostgreSQL Boilerplate (2025 Edition)

This is a backend built with Node.js, Express, TypeScript, and Prisma ORM. It follows modern best practices for API development, including strict type safety, structured error handling, security measures, and environment validation.

Designed to be modular and maintainable, the project features a clean architecture, making it easy to extend with new functionalities.

## ✨ Features

🛠️ Core Features\
✅ TypeScript – Fully typed backend for maintainability\
✅ Express.js – Lightweight and fast web framework\
✅ Prisma ORM – Type-safe database interactions
✅ PostgreSQL – Relational database\
\
🎯 Development & Code Quality\
✅ Feature-Based Structure – Each feature has its own folder, keeping everything related to a feature (routes, schemas, types, services, controllers, repositories) together for better maintainability and scalability\
✅ ESLint + Prettier – Code linting, formatting and autoformat on save\
✅ Zod Validation – Strict schema validation for request & environment variables\
✅ VSCode debugger\
\
🔐 Environment & Security\
✅ Environment Validation – Ensures required .env variables exist (Zod), fails fast on startup\
✅ Helmet & Security Headers – Protects against web vulnerabilities\
✅ CORS Whitelisting – `cors()` restricted to `WHITE_LIST_URLS`, not left open to any origin\
✅ Rate Limiting – Global limiter plus a stricter limiter scoped to `/login` and `/register`\
✅ Configurable JWT Expiry – `JWT_EXPIRES_IN` (defaults to a short-lived `1d`, not 30 days)\
✅ Structured Logging with Redaction – Pino redacts `authorization` headers and password fields\
\
⚡ API & Middleware\
✅ Request Validation – Uses Zod for body, params, and query validation\
✅ Error Handling Middleware – Centralized error handling with PostgreSQL error handling [(Ref)](https://www.prisma.io/docs/orm/reference/error-reference); internal error details are logged server-side but never leaked to the client\
✅ Unified Response Structure – Uses [uni-response](https://github.com/sushantrahate/uni-response) for consistent API responses\
\
🧪 Testing & CI/CD\
✅ Vitest – Unit and integration testing (via Supertest), with enforced coverage thresholds\
✅ Husky + Lint-Staged – Enforces pre-commit linting and formatting on staged files\
✅ GitHub Actions – Lint, format check, typecheck, test, and build run on every push/PR ([`.github/workflows/ci.yml`](.github/workflows/ci.yml))\
\
🛑 Server Management\
✅ Graceful Shutdown – Ensures proper cleanup of database & open connections during shutdown [(Ref)](https://github.com/sushantrahate/secure-nodejs-backend/tree/main/graceful-shutdown)

## 🛠️ Clean Architecture & Feature-Based Structure

### 📌 Clean Architecture & Framework-Agnostic Design

This project follows a feature-based modular structure, where each feature (e.g., user) has its own isolated folder containing everything related to that feature.

📂 Project Structure:

```bash
.github/
│── workflows/
│   ├── ci.yml       # Lint, format check, typecheck, test, build on push/PR
│── dependabot.yml   # Automated weekly dependency update PRs (npm + GitHub Actions)
prisma/
│── migrations/      # Prisma migration history
│── schema.prisma
src/
│── config/          # Configuration (env vars, Prisma, security)
│   ├── __tests__/   # Unit tests for env schema, etc.
│── constants/       # Shared constants (messages, rate-limit/bcrypt config, etc.)
│── features/        # Feature-based modular structure
│   ├── user/        # User feature module
│   │   ├── __tests__/      # Unit tests (vitest)
│   │   ├── controllers/    # Handles HTTP requests (Express-dependent)
│   │   ├── repositories/   # Database interactions (Prisma-dependent)
│   │   ├── routes/         # Express API routes (Express-dependent)
│   │   ├── schemas/        # Zod validation schemas (Framework-agnostic)
│   │   ├── services/       # Business logic (Completely framework-independent)
│   │   ├── types/          # TypeScript interfaces & types
│── middleware/       # Global Express middlewares
│   ├── __tests__/    # Unit tests for auth, security, validation, error middleware
│── utils/            # Helper functions
│   ├── __tests__/    # Unit tests for utils
│── __tests__/        # App-level integration tests (Supertest against the real app)
│── app.ts            # Express app setup
│── server.ts         # Entry point
tsconfig.json          # Type-checking / IDE config (includes tests)
tsconfig.build.json     # Production build config (excludes tests, extends tsconfig.json)
vitest.config.ts        # Test runner + coverage threshold config
vitest.setup.ts         # Shared env var bootstrap for tests
LICENSE                 # MIT-0 (MIT No Attribution)
SECURITY.md             # Vulnerability reporting policy
CONTRIBUTING.md         # Contribution guidelines
```
### 📌 Layer-by-Layer Breakdown

### 1️⃣ Feature Modules (e.g., user/)

Each feature is self-contained, meaning everything related to "users" is inside `features/user/`

🎯 Benefit:\
💡 You can easily add or remove features without affecting other parts of the app.

🔹 **No Cluttering, Even as the Project Grows Large –** The feature-based structure ensures that related files stay together, preventing scattered code.\
🔹 **Everything in One Place –** Developers can find all logic related to a feature (controllers, services, repositories, schemas) in a single folder, reducing confusion.\
🔹 **No Ambiguity in Large Systems –** Since each feature is self-contained, developers always know which controller, service, or repository to use, making onboarding and scaling easier.\
🔹 **Scalability & Maintainability –** Adding a new feature means simply creating a new folder under features/, without modifying unrelated parts of the app.

### 2️⃣ Controllers (controllers/)

✅ Handles HTTP requests and responses\
✅ Calls the service layer for business logic\
✅ Only responsible for Express-specific logic

📄 Example: user.controller.ts

```ts
import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    res.json({ success: true, data: users });
  }
}
```

### 🛠️ Why This Structure?\

Express-specific logic stays here (e.g., req, res)\
Business logic is in the service layer (so it’s framework-agnostic)

🎯 Benefit:\
💡 Can switch from Express to Fastify/NestJS by just changing the controllers.

### 3️⃣ Services (services/)

✅ Contains core business logic\
✅ Does NOT depend on Express or Prisma\
✅ Interacts with repositories for data retrieval\

📄 Example: user.service.ts

```ts
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers() {
    return await this.userRepository.getUsers();
  }
}
```

### 🛠️ Why This Structure?

- No dependency on Express or HTTP requests
- Calls repository for database access

🎯 Benefit:\
💡 Can be reused in a CLI app, background worker, or GraphQL API without changes.


### 4️⃣ Repositories (repositories/)

✅ Handles all database queries\
✅ Uses Prisma (or any ORM, easily replaceable)\
✅ Interacts only with services/, never controllers

📄 Example: user.repository.ts

```ts
import { prisma } from "@/config/prisma.config";

export class UserRepository {
  async getUsers() {
    return await prisma.user.findMany();
  }
}
```

### 🛠️ Why This Structure?

- Keeps database logic separate from business logic
- Easy to swap Prisma for another ORM (e.g., Drizzle, TypeORM)

🎯 Benefit:\
💡 Can change the database or ORM without affecting services/controllers.

### 5️⃣ Routes (routes/)

✅ Defines API endpoints\
✅ Maps controllers to Express routes

📄 Example: user.routes.ts

```ts
import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.get("/", (req, res) => userController.getUsers(req, res));

export default router;
```

### 🛠️ Why This Structure?

- Controllers are injected into routes for better testability
- Only Express-dependent part is here

🎯 Benefit:\
💡 Can switch to NestJS, Fastify, or Hono by only changing routes & controllers.

### 6️⃣ Validation Schemas (schemas/)

✅ Uses Zod for request validation
✅ Completely framework-independent

📄 Example: user.schema.ts

```ts
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});
```

### 🛠️ Why This Structure?

- Schemas don’t depend on Express, so they can be used anywhere
- Validation logic is reusable (can be used in GraphQL, CLI, or workers)
- 
🎯 Benefit:\
💡 Easier to enforce validation rules across different application layers.

### 🛠️ Final Benefits Summary
<table>
  <thead>
    <tr>
      <th>Layer</th>
      <th>Purpose</th>
      <th>Benefit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Controllers</strong></td>
      <td>Handle HTTP requests</td>
      <td>Framework-dependent, easily replaceable</td>
    </tr>
    <tr>
      <td><strong>Services</strong></td>
      <td>Business logic</td>
      <td>Framework-agnostic, reusable anywhere</td>
    </tr>
    <tr>
      <td><strong>Repositories</strong></td>
      <td>Database interactions</td>
      <td>Can switch ORM (Prisma, TypeORM, Drizzle)</td>
    </tr>
    <tr>
      <td><strong>Routes</strong></td>
      <td>Maps controllers to APIs</td>
      <td>Only responsible for Express routing</td>
    </tr>
    <tr>
      <td><strong>Schemas</strong></td>
      <td>Data validation</td>
      <td>Reusable validation logic across app</td>
    </tr>
  </tbody>
</table>

## 🔑 Environment Variables

Validated at startup by `src/config/env-schema.ts` — the app exits immediately if a required variable is missing or invalid. Copy `.env.dev.example` to `.env.dev` and fill in real values; **never commit `.env.dev`** (it's gitignored, but was accidentally committed early in this repo's history — rotate any secret you find there before reusing it).

| Variable              | Required | Default       | Notes                                                              |
| ---------------------- | -------- | ------------- | -------------------------------------------------------------------- |
| `NODE_ENV`             | No       | `development` | `development` \| `production` \| `test`                              |
| `PORT`                 | No       | `5000`        |                                                                        |
| `LOG_LEVEL`            | No       | `info`        | Pino level: `fatal`\|`error`\|`warn`\|`info`\|`debug`\|`trace`\|`silent` |
| `DATABASE_URL`         | Yes      | —             | PostgreSQL connection string                                          |
| `SHADOW_DATABASE_URL`  | No       | —             | Only needed for `prisma migrate dev`                                  |
| `JWT_SECRET`           | Yes      | —             | Minimum 32 characters                                                 |
| `JWT_EXPIRES_IN`       | No       | `1d`          | Any `jsonwebtoken` `expiresIn` value                                  |
| `WHITE_LIST_URLS`      | Yes      | —             | Comma-separated list of allowed CORS origins                          |

## ✨ Setup from scratch

## ⚡ TypeScript & Development Dependencies Setup

```bash
mkdir express-ts-prisma && cd express-ts-prisma
npm init -y
```

```bash
npm install --save-dev typescript tsx nodemon @types/node tsc-alias
```

> Create `tsconfig.json`

## ⚡ Add Express, CORS, and .env Setup

```bash
npm install express cors dotenv
npm install --save-dev @types/express @types/cors
```

> Create `.env.dev` File from `.env.example`
> Create src/config/env-config.ts // Env Configuration file
> Create src/config/env-schema.ts // Schema for environment variables

## ⚡ ESLint, Prettier & Linting Plugins

```bash
npm install --save-dev eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-plugin-node eslint-plugin-import eslint-plugin-simple-import-sort eslint-plugin-unicorn eslint-plugin-security eslint-config-prettier
```

> Create `eslint.config.js`

> Create `.prettierrc.json`

> Create `.prettierignore`

📌 Prettier will ignore these files & folders (same format as `.gitignore`).

> create `.vscode/settings.json` to Autoformat using Prettier on save

## ⚡ Setup Prisma & PostgreSQL

> Create Database and Shadow Database

> Update `.env.dev` File

```ini
DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/dev_db"
SHADOW_DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/dev_db_shadow"
```

### Install Prisma

```bash
npm install @prisma/client
npm install --save-dev prisma
```

### Initialize Prisma

```bash
npx prisma init
```

### Modify prisma/schema.prisma

```js
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

### Run Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## ⚡ Create Express Server

### Create `src/server.ts`

## ⚡ Setup Husky + Lint-Staged

```bash
npm install --save-dev husky lint-staged
```

### Enable Husky (v9+)

```bash
npx husky init
```

`npm install` runs this automatically via the `prepare` script:

```json
"scripts": {
  "prepare": "husky"
}
```

### Add Pre-commit Hook

`.husky/pre-commit`:

```sh
npx lint-staged
```

Modify `package.json`

```json
// Runs linters (ESLint, Prettier) only on staged files before committing.
"lint-staged": {
  "*.ts": ["eslint --fix", "prettier --write"]
}
```

> `.husky/_` is regenerated on every `npm install` and is gitignored — only `.husky/pre-commit` (and any other hook files you add) should be committed.

## ⚡ Add Scripts in package.json

```json
"scripts": {
    "prebuild": "npm run lint && npm run format:check && npm run typecheck && npm run test:ci",
    "build": "rimraf dist && tsc -p tsconfig.build.json && tsc-alias -p tsconfig.build.json",
    "start": "node dist/server.js",
    "dev": "nodemon --ext ts --exec tsx src/server.ts",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext ts --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:ci": "vitest --run",
    "postinstall": "prisma generate",
    "prepare": "husky"
  }
```

> `build` uses `tsconfig.build.json` (which extends `tsconfig.json` and excludes `**/*.spec.ts` / `__tests__/`) so test files never end up compiled into `dist`. Everyday type-checking (`typecheck`, the IDE, ESLint's type-aware parsing) uses the base `tsconfig.json`, which *does* include tests.

## ⚡ Run the Project

```bash
# Start Dev Server
npm run dev

# Lint Code
npm run lint
npm run lint:fix

# Format Code
npm run format
```

## ⚡ Vitest for Unit & Integration Testing

```bash
npm install --save-dev vitest @vitest/coverage-v8 supertest @types/supertest
```

> Only install `@types/supertest` — `supertest` itself is what you write integration tests against (via `import request from 'supertest'`). Don't add `@types/jest`; this project uses Vitest's own globals, not Jest's.

Create `vitest.config.ts` (test include pattern, `setupFiles`, and `coverage.thresholds`) and `vitest.setup.ts` (default env vars so any spec that transitively imports `src/config/env-config.ts` doesn't need a real `.env` file).

Test files live next to the code they cover, under a local `__tests__/` folder:

- `src/features/user/__tests__/`
- `src/middleware/__tests__/`
- `src/utils/__tests__/`
- `src/config/__tests__/`

App-level integration tests (Supertest against the real `app` instance, for routes/behavior that doesn't require a live database — 404 handling, CORS, validation) live in `src/__tests__/`.

## ⚡ Security

```sh
npm i helmet express-rate-limit
```

Two rate limiters are configured in `src/middleware/security.middleware.ts` (values centralized in `src/constants/config.constants.ts`):

- `rateLimiter` — applied globally.
- `authRateLimiter` — a tighter limit applied only to `/login` and `/register`, to slow down credential stuffing.

CORS is restricted to `WHITE_LIST_URLS` (`app.use(cors({ origin: allowedURLs }))`) rather than left open to any origin.

## ⚡ Logger

```bash
npm install pino pino-pretty pino-http
```

> Don't install `@types/pino`, `@types/pino-http`, or `@types/pino-pretty` — those are deprecated stub packages; the real packages ship their own types.

Create `src/middleware/pino-logger.ts`. It exports:

- `logger` — the base Pino instance (with `redact` configured for `authorization` headers and password/token fields), for use outside request context (e.g. `server.ts`).
- `pinoLogger` — the `pino-http` middleware that attaches a request-scoped `req.log`.

Mount `pinoLogger` **before** `express.json()`/other middleware in `app.ts` so that requests failing during body parsing are still logged.

## ⚡ Constants

Shared, non-secret configuration values (rate-limit windows/maxes, bcrypt salt rounds) live in `src/constants/config.constants.ts`; user-facing message strings live in `src/constants/messages.ts`.

## ⚡ Middleware

## ⚡ Utils

## ⚡ CI/CD

`.github/workflows/ci.yml` runs on every push/PR to `main`: install → lint → format check → typecheck → test → build. It sets placeholder env vars (`DATABASE_URL`, `JWT_SECRET`, etc.) directly in the workflow so the pipeline doesn't depend on a real database or secrets.

`.github/dependabot.yml` opens weekly PRs for outdated npm packages (grouped into separate dev-/production-dependency PRs) and GitHub Actions versions. See the "A Note on Pinned Major Versions" section below before merging a major-version bump.

## ⚡ A Note on Pinned Major Versions

A few dependencies are intentionally held back from their newest major release because the surrounding ecosystem isn't ready yet — check before bumping further:

- **Prisma stays on the 6.x line.** Prisma 7 removes `datasource.url`/`shadowDatabaseUrl` from `schema.prisma` entirely in favor of a `prisma.config.ts` + driver-adapter (`@prisma/adapter-pg`) setup — a data-layer rewrite, not a drop-in bump.
- **ESLint stays on the 9.x line.** `eslint-plugin-import`'s peer range still caps at `^9`; `eslint-plugin-unicorn` is pinned to `65.0.1` (the last release supporting ESLint 9) since `70+` requires ESLint `>=10.4`.
- **TypeScript stays on the 5.x line.** TypeScript 7 is too new for confident `typescript-eslint`/`tsc-alias` compatibility.

If you upgrade any of these, re-run `npm run lint && npm run typecheck && npm run test:ci && npm run build` and fix what breaks before merging.

## 🤝 Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, the
verification commands to run before opening a PR, and project conventions.

## 🛡️ Security

Found a vulnerability? Please don't open a public issue — see
[SECURITY.md](SECURITY.md) for how to report it privately.

## 📄 License

Licensed under [MIT-0](LICENSE) (MIT No Attribution) — use it freely, no attribution
required.

If you liked it then please show your love by ⭐ the repo

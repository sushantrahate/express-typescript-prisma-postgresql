# 🚀 Express + TypeScript + Prisma + PostgreSQL Boilerplate (2025 Edition)

This is a backend built with Node.js, Express, TypeScript, and Prisma ORM. It follows modern best practices for API development, including strict type safety, structured error handling, security measures, and environment validation.

Designed to be modular and maintainable, the project features a clean architecture, making it easy to extend with new functionalities.

## ✨ Features

🛠️ Core Features
✅ TypeScript – Fully typed backend for maintainability
✅ Express.js – Lightweight and fast web framework
✅ Prisma ORM – Type-safe database interactions
✅ PostgreSQL – Relational database

🎯 Development & Code Quality
✅ Feature-Based Structure – Each feature has its own folder, keeping everything related to a feature (routes, schemas, types, services, controllers, repositories) together for better maintainability and scalability
✅ ESLint + Prettier – Code linting, formatting and autoformat on save
✅ Zod Validation – Strict schema validation for request & environment variables
✅ VSCode debugger

🔐 Environment & Security
✅ Environment Validation – Ensures required .env variables exist
✅ Helmet & Security Headers – Protects against web vulnerabilities
✅ Rate Limiter, Host whitelisting middleware

⚡ API & Middleware
✅ Request Validation – Uses Zod for body, params, and query validation
✅ Error Handling Middleware – Centralized error handling with PostgreSQL error handling [(Ref)](https://www.prisma.io/docs/orm/reference/error-reference)
✅ Unified Response Structure – Uses [uni-response](https://github.com/sushantrahate/uni-response) for consistent API responses

🧪 Testing & CI/CD
✅ Vitest – Unit and integration testing
✅ Husky + Lint-Staged – Enforces pre-commit linting and testing

🛑 Server Management
✅ Graceful Shutdown – Ensures proper cleanup of database & open connections during shutdown [(Ref)](https://github.com/sushantrahate/secure-nodejs-backend/tree/main/graceful-shutdown)

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
npm install --save-dev eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-plugin-node eslint-plugin-import eslint-plugin-simple-import-sort eslint-plugin-unicorn eslint-plugin-security
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

### Enable Husky

```bash
npx husky install
npm set-script prepare "husky install"
```

### Add Pre-commit Hook

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

Modify `package.json`

```json
// Runs linters (ESLint, Prettier) only on changed files before committing.
"lint-staged": {
   "**/*.{ts,json,md}": ["eslint --fix", "prettier --write"]
}
```

Add Pre-Push Hook

```sh
// Before git push trigger tests & build validation.
npx husky add .husky/pre-push "npm run lint && npm run format && npm run test && npm run build"
```

## ⚡ Add Scripts in package.json

```json
"scripts": {
    "prebuild": "npm run lint && npm run format && npm run test",
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "nodemon --ext ts --exec tsx src/server.ts",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext ts --fix",
    "format": "prettier --write .",
    "test": "vitest",
    "prepare": "husky install"
  }
```

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

## ⚡ Vitest for Unit Testing

## ⚡ Security

```sh
npm i helmet express-rate-limit
```

## ⚡ Constants

## ⚡ Middleware

## ⚡ Utils

If you liked it then please show your love by ⭐ the repo
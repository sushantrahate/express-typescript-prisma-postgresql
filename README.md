# Express TypeScript Prisma PostgreSQL Boilerplate

This is a simple starter pack for building RESTful APIs using Express,
TypeScript, Prisma, and PostgreSQL.

## Features

- ESLint + Prettier + Airbnb Style Guide for Code Quality.
- VSCode debugger.
- API error Middleware with PostgreSQL error handling
  [Reference](https://www.prisma.io/docs/reference/api-reference/error-reference)
- Testing with Jest
- Linting and Pre-Commit Checks with husky

## Project Structure

```txt
src\
 |--config\         # Environment variables and configuration related things
 |--constants\      # constant variables
 |--controllers\    # controllers for module (Business logic)
 |--middlewares\    # Custom middlewares (auth, common API error handling)
 |--routes\         # Routes
 |--services\       # For common business logic (service layer)
 |--utils\          # Utility functions
 |--app.js          # Main Express app setup
 |--server.js       # App entry point
```

## Getting started

Clone or download this repository and cd into
express-typescript-prisma-postgresql

- Create the `.env` file by copying the `.env.example` file
- Configure your PostgreSQL database by editing DATABASE_URL and
  SHADOW_DATABASE_URL in `.env`

- Install the project's npm dependencies by running `npm i`
- Apply schema changes to your database `npm run db:push`
- Run `npm run dev` for starting local API server

## Debug in VSCode

set breakpoints at code and hit `f5`

## Testing

Run tests by using the command `npm run test`

## Build the app

Build the application with `npm run build`. 'dist' folder will be created.

## Run Prisma studio locally

Run `npm run studio` and open a web browser with the URL http://localhost:5555/

If you liked it then please show your love by ⭐ the repo

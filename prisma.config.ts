import 'dotenv/config';

import path from 'node:path';

import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
  },
  datasource: {
    url: env('DATABASE_URL'),
    // Optional: env() throws at config-load time if the var is unset at all, so this
    // needs a plain presence check rather than passing it through unconditionally.
    ...(process.env.SHADOW_DATABASE_URL ? { shadowDatabaseUrl: env('SHADOW_DATABASE_URL') } : {}),
  },
});

// Ensures env-config's schema validation passes in any test run (local or CI) without
// requiring a real .env file, since some spec files import modules that transitively
// load `src/config/env-config.ts`.
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.PORT = process.env.PORT || '5000';
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'silent';
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test_db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_only_secret_at_least_32_characters_long';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
process.env.WHITE_LIST_URLS = process.env.WHITE_LIST_URLS || 'https://example.com';

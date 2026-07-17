import { describe, expect, it } from 'vitest';

import { envSchema } from '../env-schema';

const validEnv = {
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
  JWT_SECRET: 'a_secret_that_is_at_least_32_characters_long',
  WHITE_LIST_URLS: 'https://example.com,https://app.example.com',
};

describe('envSchema', () => {
  it('accepts a minimal valid config and applies defaults', () => {
    const result = envSchema.safeParse(validEnv);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(5000);
      expect(result.data.NODE_ENV).toBe('development');
      expect(result.data.JWT_EXPIRES_IN).toBe('1d');
      expect(result.data.WHITE_LIST_URLS).toEqual([
        'https://example.com',
        'https://app.example.com',
      ]);
    }
  });

  it('does not require SHADOW_DATABASE_URL', () => {
    const result = envSchema.safeParse(validEnv);

    expect(result.success).toBe(true);
  });

  it('rejects a JWT_SECRET shorter than 32 characters', () => {
    const result = envSchema.safeParse({ ...validEnv, JWT_SECRET: 'too-short' });

    expect(result.success).toBe(false);
  });

  it('rejects a non-URL DATABASE_URL', () => {
    const result = envSchema.safeParse({ ...validEnv, DATABASE_URL: 'not-a-url' });

    expect(result.success).toBe(false);
  });

  it('rejects WHITE_LIST_URLS containing a non-URL entry', () => {
    const result = envSchema.safeParse({
      ...validEnv,
      WHITE_LIST_URLS: 'https://example.com,nope',
    });

    expect(result.success).toBe(false);
  });
});

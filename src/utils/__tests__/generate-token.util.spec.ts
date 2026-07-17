import jwt from 'jsonwebtoken';
import { describe, expect, it, vi } from 'vitest';

const { JWT_SECRET } = vi.hoisted(() => ({
  JWT_SECRET: 'unit_test_secret_at_least_32_characters_long',
}));

vi.mock('../../config/env-config', () => ({
  env: { JWT_SECRET, JWT_EXPIRES_IN: '2h' },
}));

import { generateToken } from '../generate-token.util';

describe('generateToken', () => {
  it('signs a token containing the userId and role, honoring JWT_EXPIRES_IN', () => {
    const token = generateToken('user-1', 'admin');

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    expect(decoded.userId).toBe('user-1');
    expect(decoded.role).toBe('admin');
    expect(decoded.exp).toBeDefined();
    expect(decoded.iat).toBeDefined();
    expect((decoded.exp as number) - (decoded.iat as number)).toBe(2 * 60 * 60);
  });

  it('defaults role to "user" when not provided', () => {
    const token = generateToken('user-2');

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    expect(decoded.role).toBe('user');
  });
});

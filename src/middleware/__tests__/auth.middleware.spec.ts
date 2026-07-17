import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { JWT_SECRET } = vi.hoisted(() => ({
  JWT_SECRET: 'unit_test_secret_at_least_32_characters_long',
}));

vi.mock('../../config/env-config', () => ({
  env: { JWT_SECRET },
}));

import { auth, checkUserRole } from '../auth.middleware';

describe('auth middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
  });

  describe('auth', () => {
    it('rejects requests with no token', () => {
      auth(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('rejects an invalid token', () => {
      req.headers = { authorization: 'Bearer not-a-real-token' };

      auth(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('attaches userId/role and calls next for a valid token', () => {
      const token = jwt.sign({ userId: 'user-1', role: 'admin' }, JWT_SECRET);
      req.headers = { authorization: `Bearer ${token}` };

      auth(req as Request, res as Response, next);

      expect(req.userId).toBe('user-1');
      expect(req.role).toBe('admin');
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('checkUserRole', () => {
    it('rejects requests with no token', () => {
      checkUserRole(['admin'])(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('rejects a role that is not allowed', () => {
      const token = jwt.sign({ userId: 'user-1', role: 'user' }, JWT_SECRET);
      req.headers = { authorization: `Bearer ${token}` };

      checkUserRole(['admin'])(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('allows an allowed role and calls next', () => {
      const token = jwt.sign({ userId: 'user-1', role: 'admin' }, JWT_SECRET);
      req.headers = { authorization: `Bearer ${token}` };

      checkUserRole(['admin'])(req as Request, res as Response, next);

      expect(req.userId).toBe('user-1');
      expect(next).toHaveBeenCalled();
    });
  });
});

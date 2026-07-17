import { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authRateLimiter, hostWhitelist, rateLimiter } from '../security.middleware';

describe('security middleware', () => {
  describe('hostWhitelist', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = { headers: {} };
      res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      next = vi.fn();
    });

    it('rejects requests with no Origin header', () => {
      hostWhitelist(['https://example.com'])(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('rejects an origin not in the whitelist', () => {
      req.headers = { origin: 'https://evil.example' };

      hostWhitelist(['https://example.com'])(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('allows a whitelisted origin', () => {
      req.headers = { origin: 'https://example.com' };

      hostWhitelist(['https://example.com'])(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  it('exposes configured rate limiter middlewares', () => {
    expect(typeof rateLimiter).toBe('function');
    expect(typeof authRateLimiter).toBe('function');
  });
});

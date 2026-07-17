import { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { validateRequest } from '../validation.middleware';

const schema = z.object({
  email: z.string().email(),
});

describe('validateRequest', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
  });

  it('returns 400 with error details for invalid input', () => {
    req.body = { email: 'not-an-email' };

    validateRequest(schema)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches parsed data and calls next for valid input', () => {
    req.body = { email: 'user@example.com' };

    validateRequest(schema)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({ email: 'user@example.com' });
    expect(res.status).not.toHaveBeenCalled();
  });
});

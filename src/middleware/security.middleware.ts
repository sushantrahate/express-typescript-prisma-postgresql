import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { unifiedResponse } from 'uni-response';

import { RATE_LIMIT } from '../constants/config.constants';
import { ERROR } from '../constants/messages';

// General limiter applied to all routes.
const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT.GLOBAL_WINDOW_MS,
  max: RATE_LIMIT.GLOBAL_MAX,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Tighter limiter for credential-stuffing/brute-force-prone auth routes (login/register).
const authRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.AUTH_WINDOW_MS,
  max: RATE_LIMIT.AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: unifiedResponse(false, 'Too many attempts, please try again later'),
});

// Middleware to check host whitelist
/**
 * The function `hostWhitelist` checks if the request origin is in the allowed URLs whitelist and
 * either allows or denies access accordingly.
 * @param {string[]} allowedUrls - The `allowedUrls` parameter in the `hostWhitelist` function is an
 * array of strings that contains the URLs that are allowed to access the server. The function checks
 * if the `origin` header of the incoming request matches any of the URLs in the `allowedUrls` array to
 * determine if the
 * @returns A function that acts as a middleware to check if the request origin is whitelisted in the
 * provided `allowedUrls` array. If the origin is allowed, the middleware calls the `next()` function
 * to continue processing the request. If the origin is not allowed, it returns a 403 status with an
 * error message and stops further processing.
 */
const hostWhitelist = (allowedUrls: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { origin } = req.headers;

    if (!origin) {
      res.status(400).json(unifiedResponse(false, ERROR.ORIGIN_HEADER_IS_MISSING));
      return; // Exit to ensure no further middleware runs
    }

    if (allowedUrls.includes(origin as string)) {
      next(); // Host is whitelisted, continue processing the request
    } else {
      res.status(403).json(unifiedResponse(false, ERROR.ACCESS_FORBIDDEN));
      return; // Exit to stop further processing
    }
  };
};

export { authRateLimiter, hostWhitelist, rateLimiter };

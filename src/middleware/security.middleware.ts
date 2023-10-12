import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { createResponse } from '../utils/response.util';
import { ERROR } from '../constants/messages';

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware to check host whitelist
const hostWhitelist = (allowedUrls: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { origin } = req.headers;
    if (!origin) {
      return res
        .status(400)
        .json(createResponse(false, null, ERROR.ORIGIN_HEADER_IS_MISSING));
    }
    if (allowedUrls.includes(origin as string)) {
      next(); // Host is whitelisted, proceed to the next middleware or route handler
    } else {
      // Host is not whitelisted, send a 403 Forbidden response
      return res
        .status(403)
        .json(createResponse(false, null, ERROR.ACCESS_FORBIDDEN));
    }
  };
};

export { rateLimiter, hostWhitelist };

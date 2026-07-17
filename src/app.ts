import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import { unifiedResponse } from 'uni-response';

import { env } from './config/env-config';
import userRoutes from './features/user/routes/user.routes';
import { apiErrorHandler, unmatchedRoutes } from './middleware/api-error.middleware';
import { pinoLogger } from './middleware/pino-logger';
import { rateLimiter } from './middleware/security.middleware';

const app: Application = express();

const allowedURLs = env.WHITE_LIST_URLS || [];

// Request logging (attaches `req.log`) — runs first so it covers every request,
// including ones that fail during body parsing below.
app.use(pinoLogger);

// Security middleware
app.use(rateLimiter);
app.use(helmet());

// Global Middlewares
app.use(express.json());
app.use(cors({ origin: allowedURLs })); // Restrict CORS to the configured whitelist

app.get('/', (req: Request, res: Response): void => {
  res.json(unifiedResponse(true, 'ok'));
  return;
});

app.get('/heartbeat', (req: Request, res: Response): void => {
  req.log.info('Heartbeat ok');
  res.send('ok');
  return;
});

// API Routes
app.use('/v1/users', userRoutes);

// Error Handling Middleware (Optional)
// For prisma error and other error
app.use(apiErrorHandler);

// Middleware for handling unmatched routes
app.use(unmatchedRoutes);

export { app };

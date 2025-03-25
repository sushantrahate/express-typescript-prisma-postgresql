import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';

import { env } from './config/env-config';
import userRoutes from './features/user/routes/user.routes';
import { apiErrorHandler, unmatchedRoutes } from './middleware/api-error.middleware';
import { pinoLogger, loggerMiddleware } from './middleware/pino-logger';
// import morgan from 'morgan';
import { hostWhitelist, rateLimiter } from './middleware/security.middleware';

const app: Application = express();

// Security middleware
// app.use(hostWhitelist);
app.use(rateLimiter);
app.use(helmet());

// Global Middlewares
app.use(express.json());
app.use(cors()); // Enables CORS

// TODO: logger
app.use(loggerMiddleware);
app.use(pinoLogger);
// if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const allowedURLs = env.WHITE_LIST_URLS || [];

app.get('/', hostWhitelist(allowedURLs), (req: Request, res: Response): void => {
  res.json('');
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

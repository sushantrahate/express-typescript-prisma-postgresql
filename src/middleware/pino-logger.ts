// src/middleware/pino-logger.ts
import pino, { Logger } from 'pino';
import pinoHttp from 'pino-http';
import { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import { ensureDir } from 'fs-extra'; // Optional: to ensure log directory exists
import { randomUUID } from 'crypto';

// Extend Express Request interface to include logger
declare global {
  namespace Express {
    interface Request {
      log: Logger;
    }
  }
}

// Configure log file destination for production
const logDir = join(__dirname, '..', 'logs');
const logFile = join(logDir, 'app.log');

// Ensure log directory exists synchronously or asynchronously
(async () => {
  try {
    await ensureDir(logDir);
  } catch (err) {
    console.error('Failed to create log directory:', err);
  }
})();

// Production: Write to file, Development: Pretty print
const transport =
  process.env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:mm:ss',
          ignore: 'pid,hostname',
        },
      }
    : {
        target: 'pino/file',
        options: { destination: logFile },
      };

const logger = pino({
  level: process.env.LOG_LEVEL || 'info', // Default to 'info' if not set
  transport,
});

export const pinoLogger = pinoHttp({
  logger,
  // Generate UUID for each request using crypto
  genReqId: (req: Request) => randomUUID(),
  // Custom success message with req.id
  customSuccessMessage: (req: Request, res: Response) => {
    return `${req.method} ${req.url} [reqId: ${req.id}] completed`;
  },
  // Custom error message with req.id
  customErrorMessage: (req: Request, res: Response, err: Error) => {
    return `${req.method} ${req.url} [reqId: ${req.id}] failed with ${err.message}`;
  },
});

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.log = logger; // Attach logger to request object
  next();
};

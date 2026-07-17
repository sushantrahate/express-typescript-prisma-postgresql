// src/middleware/pino-logger.ts
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { ensureDir } from 'fs-extra'; // Optional: to ensure log directory exists
import { join } from 'path';
import pino, { Logger } from 'pino';
import pinoHttp from 'pino-http';

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
// eslint-disable-next-line node/no-process-env
const isDevelopment = process.env.NODE_ENV === 'development';

const transport = isDevelopment
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

export const logger = pino({
  // eslint-disable-next-line node/no-process-env
  level: process.env.LOG_LEVEL || 'info', // Default to 'info' if not set
  transport,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.password2',
      '*.password',
      '*.password2',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
});

// Attaches `req.log` (a child logger with request-scoped bindings) to every request.
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

import { Server as HttpServer } from 'http';

import { app } from './app';
import { env } from './config/env-config';
import { PrismaService } from './config/prisma.config';
import { logger } from './middleware/pino-logger';

const SHUTDOWN_TIMEOUT_MS = 10000;

class Server {
  private readonly port: number;
  private serverInstance: HttpServer | undefined;
  private readonly prisma: PrismaService;

  constructor(port: number) {
    this.port = port;
    this.prisma = PrismaService.getInstance();
  }

  // Start the server
  public start(): void {
    this.serverInstance = app.listen(this.port, () => {
      logger.info(`Server running at http://localhost:${this.port}`);
    });

    // Handle system signals for graceful shutdown
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    process.on('uncaughtException', this.handleUncaughtException.bind(this));
    process.on('unhandledRejection', this.handleUnhandledRejection.bind(this));
  }

  // Graceful shutdown logic
  private async gracefulShutdown(): Promise<void> {
    logger.info('Received shutdown signal, shutting down gracefully...');
    try {
      // Stop accepting new connections
      this.serverInstance?.close(async () => {
        logger.info('No new requests are being accepted.');

        try {
          await this.closeDBConnection();
          logger.info('All connections closed, shutting down...');
          process.exit(0); // Successful exit
        } catch (err) {
          logger.error({ err }, 'Error during shutdown');
          process.exit(1); // Exit with error if closing connections failed
        }
      });

      // Timeout to force shutdown if requests are still pending
      setTimeout(() => {
        logger.error('Forcing shutdown due to timeout.');
        process.exit(1);
      }, SHUTDOWN_TIMEOUT_MS);
    } catch (err) {
      logger.error({ err }, 'Failed to initiate graceful shutdown');
      process.exit(1); // Exit with error if initial shutdown fails
    }
  }

  // Close database connection
  private async closeDBConnection(): Promise<void> {
    logger.info('Closing database connection...');
    try {
      await this.prisma.disconnect(); // Gracefully disconnect Prisma
      logger.info('Database connection closed.');
    } catch (err) {
      logger.error({ err }, 'Error closing database connection');
      throw err; // Re-throw to handle the error in the shutdown sequence
    }
  }

  // Handle uncaught exceptions
  private handleUncaughtException(error: Error): void {
    logger.error({ err: error }, 'Uncaught Exception');
    process.exit(1); // Exit with error code for unexpected issues
  }

  // Handle unhandled promise rejections
  private handleUnhandledRejection(reason: unknown): void {
    logger.error({ reason }, 'Unhandled Rejection');
    process.exit(1); // Exit with error status for unhandled rejections
  }
}

// Initialize and start the server
const server = new Server(env.PORT);
server.start();

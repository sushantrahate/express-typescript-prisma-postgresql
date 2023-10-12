import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { rateLimiter, hostWhitelist } from './middleware/security.middleware';
import {
  apiErrorHandler,
  unmatchedRoutes,
} from './middleware/api-error.middleware';
import { router as userRoutes } from './routes/user.routes';
import { router as masterRoutes } from './routes/master.routes';

dotenv.config();

const app: Application = express();

// Middleware to set CORS headers
const corsOptions = {
  origin: '*', // Change this to your specific origin(s)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Add the required headers
  optionsSuccessStatus: 204, // Set the options success status code
};
app.use(cors(corsOptions));
// Use body-parser middleware to handle URL-encoded form data
app.use(bodyParser.urlencoded({ extended: false }));

// Security middleware
// app.use(hostWhitelist);
app.use(rateLimiter);
app.use(helmet());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedURLs = process.env.WHITE_LIST_URLS?.split(',') || [];

app.get('/', hostWhitelist(allowedURLs), (req: Request, res: Response) => {
  return res.json('');
});

app.get('/heartbeat', (req: Request, res: Response) => {
  return res.send('ok');
});

app.use('/v1/users', userRoutes);
app.use('/v1/masters', hostWhitelist(allowedURLs), masterRoutes); // Only whitelisted host can access

// For prisma error and other error
app.use(apiErrorHandler);

// Middleware for handling unmatched routes
app.use(unmatchedRoutes);

export { app };

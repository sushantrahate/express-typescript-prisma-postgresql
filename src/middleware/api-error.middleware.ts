import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { createResponse } from '../utils/response.util';
import { ERROR } from '../constants/messages';

const env = process.env.NODE_ENV || 'prod';

const checkContentType = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.get('Content-Type');

  if (!contentType || contentType !== 'application/json') {
    return res
      .status(400)
      .json(
        createResponse(
          false,
          null,
          'Only application/json Content-Type is allowed'
        )
      );
  }

  next();
};

const checkContentTypeAsURLEncodedFormData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const contentType = String(req.get('Content-Type')).split(';')[0];

  if (!contentType || contentType !== 'application/x-www-form-urlencoded') {
    return res
      .status(400)
      .json(
        createResponse(
          false,
          null,
          'Content-Type required as application/x-www-form-urlencoded'
        )
      );
  }

  next();
};

// Middleware to check host whitelist
const apiErrorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (env === 'development') {
    console.log('err', err);
  }
  if (
    err instanceof SyntaxError &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (err as any).status === 400 &&
    'body' in err
  ) {
    // Handle JSON syntax error
    return res.status(400).json(createResponse(false, null, 'Invalid JSON'));
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma validation errors
    if (err.meta) {
      const firstKey = Object.keys(err?.meta)[0];
      const cause = err?.meta[firstKey] as string;
      return res
        .status(400)
        .json(
          createResponse(false, null, `Provided field id not found, ${cause}`)
        );
    }
  }
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return res.status(400).json(createResponse(false, null, err?.message));
  }
  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(400).json(createResponse(false, null, err?.message));
  }
  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(400).json(createResponse(false, null, err?.message));
  }
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(400).json(createResponse(false, null, err?.message));
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json(createResponse(false, null, err?.message));
  }
  // Handle other errors
  return res
    .status(500)
    .json(createResponse(false, null, ERROR.INTERNAL_SERVER_ERROR));
};

const unmatchedRoutes = (req: Request, res: Response) => {
  return res
    .status(404)
    .json(createResponse(false, null, ERROR.ROUTE_NOT_FOUND));
};

export {
  checkContentType,
  checkContentTypeAsURLEncodedFormData,
  apiErrorHandler,
  unmatchedRoutes,
};

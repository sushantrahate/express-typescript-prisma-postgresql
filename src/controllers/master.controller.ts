import { Request, Response, NextFunction } from 'express';
import { createResponse } from '../utils/response.util';

const sampleFunc = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = { data: 123 };
    const response = createResponse(true, result, 'Success');
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export { sampleFunc };

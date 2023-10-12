import express, { Request, Response } from 'express';
import { sampleFunc } from '../controllers/master.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  return res.json('from master');
});

router.get('/sample', sampleFunc); // localhost:4000/v1/masters/sample

export { router };

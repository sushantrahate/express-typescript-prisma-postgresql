import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth.middleware';
import {
  login,
  registerUser,
  getProfile,
} from '../controllers/user.controller';
import { checkContentTypeAsURLEncodedFormData } from '../middleware/api-error.middleware';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  return res.json('from user');
});

router.post('/register', checkContentTypeAsURLEncodedFormData, registerUser); // localhost:4000/v1/users/register
router.post('/login', checkContentTypeAsURLEncodedFormData, login); // localhost:4000/v1/users/login
router.get('/profile', auth, getProfile); // localhost:4000/v1/users/profile

export { router };

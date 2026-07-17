import jwt, { Secret } from 'jsonwebtoken';

import { env } from '../config/env-config';

const secret: Secret = env.JWT_SECRET as string;

const generateToken = (userId: string, role = 'user'): string => {
  if (secret) {
    const token = jwt.sign({ userId, role }, secret, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    return token;
  }
  throw new Error('JWT SECRET is undefined');
};

export { generateToken };

import jwt, { Secret } from 'jsonwebtoken';

const secret: Secret = process.env.JWT_SECRET as string;

const generateToken = (userId: string, role = 'user'): string => {
  if (secret) {
    const token = jwt.sign({ userId, role }, secret, {
      expiresIn: '30d',
    });

    return token;
  }
  throw new Error('JWT SECRET is undefined');
};

export { generateToken };

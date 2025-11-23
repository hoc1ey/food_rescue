import jwt from 'jsonwebtoken';
import { UserType } from '../generated/prisma/index.js';

export const generateToken = (userId: string, userType: UserType): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
};

export const verifyToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

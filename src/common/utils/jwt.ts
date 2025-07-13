import jwt from 'jsonwebtoken';
import { ResponseError } from '../errors/ResponseError.ts';

const signToken = (payload: object, isRefreshToken = false) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ResponseError(500, 'Internal server error');
  }
  return jwt.sign(payload, secret, { expiresIn: isRefreshToken ? '7d' : '15m' });
}

const verifyRefreshToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ResponseError(500, 'Internal server error');
  }
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new ResponseError(401, 'Security error');
  }
}

export { signToken, verifyRefreshToken };
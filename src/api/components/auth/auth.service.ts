import { signToken, verifyRefreshToken } from '../../../common/utils/jwt.ts';
import pool from '../../../config/db.ts';
import { ResponseError} from '../../../common/errors/ResponseError.ts';
import type { QueryResult } from 'pg';

interface Credentials {
  id: string;
  is_coordinator: string;
  password: string;
}

export const login = async (email: string, password_from_req: string) => {
  console.log('Login attempt for email:', email);
  const result: QueryResult<Credentials> = await pool.query(`
    SELECT t.id, t.is_coordinator, c.password 
    FROM therapist t
    JOIN credentials c ON t.id = c.id
    WHERE email = $1
    `, [email]
  );

  

  if (result.rowCount === 0) {
    console.log('No user found with the provided email:', email);
    throw new ResponseError(401, 'Invalid credentials');
  }

  const user = result.rows[0];
  console.log('User found:', user);

  const isPasswordValid = user.password === password_from_req;
  if (!isPasswordValid) {
    throw new ResponseError(401, 'Invalid credentials');
  }

  const payload = { id: user.id, is_coordinator: user.is_coordinator };
  const accessToken = signToken(payload);
  const refreshToken = signToken(payload, true);

  return { accessToken, refreshToken };
};

interface User {
  id: string;
  name: string;
  email: string;
  title?: string;
  is_coordinator: boolean;
}

export const getProfile = async (userId: string) => {
  const result: QueryResult<User> = await pool.query(`
    SELECT t.id, t.name, t.email, t.title, t.is_coordinator
    FROM therapist t
    WHERE t.id = $1
  `, [userId]);
  if (result.rowCount === 0) {
    throw new ResponseError(404, 'User not found');
  }
  const user = result.rows[0];
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    title: user.title,
    is_coordinator: user.is_coordinator
  };
}
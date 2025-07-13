import { type Request, type Response } from 'express';
import * as AuthService from './auth.service.ts';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const tokens = await AuthService.login(email, password);
  res.status(200).json(tokens);
};

/* export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }
  const newAccessToken = await AuthService.refreshToken(refreshToken);
  res.status(200).json({ accessToken: newAccessToken });
}; */

export const getProfile = async (req: Request, res: Response) => {
  const userProfile = await AuthService.getProfile(req.user.id);
  res.status(200).json(userProfile);
};
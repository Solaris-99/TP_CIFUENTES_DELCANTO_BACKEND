import { Router } from 'express';
import { checkAuth } from '../../../middleware/security.middleware.ts';
import * as AuthController from './auth.controller.ts';

const router = Router();

router.post('/', AuthController.login);
//router.post('/refresh', AuthController.refresh);

router.get('/profile', checkAuth, AuthController.getProfile);

export default router;
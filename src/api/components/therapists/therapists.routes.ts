import { Router } from 'express';
import { checkAuth } from '../../../middleware/security.middleware.ts';
import * as TherapistController from './therapists.controller.ts';

const router = Router();
//replace for role-middleware
router.get('/', checkAuth, TherapistController.getTherapists)
router.get('/:id',checkAuth, TherapistController.getTherapist)
router.delete('/:id', checkAuth, TherapistController.deleteTherapist)
router.patch('/:id', checkAuth, TherapistController.updateTherapist)

export default router;
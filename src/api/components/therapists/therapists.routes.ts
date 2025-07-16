import { Router } from 'express';
import * as TherapistController from './therapists.controller.ts';

const router = Router();

router.get('/', TherapistController.getTherapists)
router.get('/:id', TherapistController.getTherapist)
router.delete('/:id', TherapistController.deleteTherapist)
router.patch('/:id', TherapistController.updateTherapist)

export default router;
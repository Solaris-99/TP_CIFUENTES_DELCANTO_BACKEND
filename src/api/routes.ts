import { Router } from 'express';
import authRoutes from './components/auth/auth.routes.ts';
import therapistRoutes from './components/therapists/therapists.routes.ts'
import patientRoutes from './components/patients/patients.routes.ts';
import { checkPermission } from '../middleware/coordinatorCheck.middleware.ts';
import { checkAuth } from '../middleware/security.middleware.ts';

const router = Router();

router.use('/auth', authRoutes);
router.use('/therapists', checkAuth, checkPermission, therapistRoutes)
router.use('/patients', checkAuth, patientRoutes);

export default router;
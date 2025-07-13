import { Router } from 'express';
import authRoutes from './components/auth/auth.routes.ts';
import therapistRoutes from './components/therapists/therapists.routes.ts'
//import patientRoutes from './components/patients/patients.routes.ts';

const router = Router();

router.use('/auth', authRoutes);
router.use('/therapists', therapistRoutes)
//router.use('/patients', patientRoutes);
//router.use('/therapists', therapistRoutes, checkAuth);

export default router;
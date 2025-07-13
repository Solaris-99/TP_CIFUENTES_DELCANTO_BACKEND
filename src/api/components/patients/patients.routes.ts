/* import { Router } from 'express';
import * as PatientController from './patients.controller.ts';
import { checkAuth } from '../../../middleware/auth.middleware.ts';
import { checkRole } from '../../../middleware/role.middleware.ts';

const router = Router();

// Middleware de autenticación para todas las rutas de pacientes
router.use(checkAuth, checkRole(['admin', 'therapist']));

// --- Rutas de Pacientes ---
router.get('/', PatientController.getPatients);
router.get('/:patientId', PatientController.getPatientById);

// --- Rutas anidadas para el Equipo (Team) ---
const teamRouter = Router({ mergeParams: true });
teamRouter.get('/', PatientController.getPatientTeam);
teamRouter.post('/', checkRole(['admin']), PatientController.addTherapistToTeam); // Solo admin puede agregar
teamRouter.delete('/:therapistId', checkRole(['admin']), PatientController.removeTherapistFromTeam); // Solo admin puede quitar
router.use('/:patientId/team', teamRouter);

// --- Rutas anidadas para Programas (Programs) ---
const programRouter = Router({ mergeParams: true });
programRouter.get('/', PatientController.getPatientPrograms);
programRouter.post('/', PatientController.addProgramToPatient);
programRouter.patch('/:programId', PatientController.updateProgram);
programRouter.put('/:programId/background', PatientController.updateProgramBackground);
router.use('/:patientId/programs', programRouter);

// --- Rutas anidadas para Unidades (Units) ---
const unitRouter = Router({ mergeParams: true });
unitRouter.get('/', PatientController.getProgramUnits);
unitRouter.post('/', PatientController.addUnitToProgram);
unitRouter.patch('/:unitId', PatientController.updateUnit);
router.use('/:patientId/programs/:programId/units', unitRouter);

// --- Rutas anidadas para Registros (Registry) ---
const registryRouter = Router({ mergeParams: true });
registryRouter.get('/', PatientController.getUnitRegistries);
registryRouter.post('/', PatientController.addRegistryToUnit);
registryRouter.delete('/:registryId', PatientController.deleteRegistry);
router.use('/:patientId/programs/:programId/units/:unitId/registry', registryRouter);

export default router; */
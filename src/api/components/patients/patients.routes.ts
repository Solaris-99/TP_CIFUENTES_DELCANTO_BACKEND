import { Router } from 'express';
import * as PatientController from './patients.controller.ts';
import { checkAuth } from '../../../middleware/security.middleware.ts';
//import { checkRole } from '../../../middleware/role.middleware.ts';

const router = Router();
router.use(checkAuth);

// --- Rutas de Pacientes ---
router.get('/', PatientController.getAllPatients);
router.get('/:patientId', PatientController.getPatientById);
//router.post('/', PatientController.createPatient);
//router.delete('/:patientId', PatientController.deletePatient);

// --- Rutas de Equipo ---
router.get('/:patientId/team', PatientController.getPatientTeam);
router.post('/:patientId/team', PatientController.addTherapistToTeam); // Solo admin
router.delete('/:patientId/team/:therapistId', PatientController.removeTherapistFromTeam); // Solo admin

// --- Rutas de Programas ---
router.get('/:patientId/programs', PatientController.getPatientPrograms);
router.post('/:patientId/programs', PatientController.addProgramToPatient);
router.patch('/:patientId/programs/:programId', PatientController.updateProgramStatus);
router.put('/:patientId/programs/:programId/background', PatientController.updateProgramBackground);

// --- Rutas de Unidades ---
router.get('/:patientId/programs/:programId/units', PatientController.getProgramUnits);
router.post('/:patientId/programs/:programId/units', PatientController.addUnitToProgram);
router.patch('/:patientId/programs/:programId/units/:unitId', PatientController.updateUnitStatus);

// --- Rutas de Registros ---
router.get('/:patientId/programs/:programId/units/:unitId/registry', PatientController.getUnitRegistries);
router.post('/:patientId/programs/:programId/units/:unitId/registry', PatientController.addRegistryToUnit);
router.delete('/:patientId/programs/:programId/units/:unitId/registry/:registryId', PatientController.deleteRegistry);

export default router;
import { Router } from 'express';
import * as PatientController from './patients.controller.ts';
import { checkPermission } from '../../../middleware/coordinatorCheck.middleware.ts';

const router = Router();

// --- Rutas de Pacientes ---
router.get('/', checkPermission, PatientController.getAllPatients);
router.get('/myPatients', PatientController.getAllPatientsOfTherapist);
router.get('/:patientId', PatientController.getPatientById);
router.post('/', PatientController.createPatient);
router.delete('/:patientId', PatientController.deletePatient);

// --- Rutas de Equipo ---
router.get('/:patientId/team', PatientController.getPatientTeam);
router.post('/:patientId/team', checkPermission, PatientController.addTherapistToTeam);
router.delete('/:patientId/team/:therapistId', checkPermission, PatientController.removeTherapistFromTeam);

// --- Rutas de Programas ---
router.get('/:patientId/programs', PatientController.getPatientPrograms);
router.get('/:patientId/programs/:programId', PatientController.getPatientProgram);
router.post('/:patientId/programs', PatientController.addProgramToPatient);
router.patch('/:patientId/programs/:programId', PatientController.updateProgramStatus);
router.delete('/:patientId/programs/:programId', PatientController.removeProgramFromPatient);
router.put('/:patientId/programs/:programId/background', PatientController.updateProgramBackground);
router.get('/:patientId/programs/:programId/background', PatientController.getProgramBackground);

// --- Rutas de Unidades ---
router.get('/:patientId/programs/:programId/units', PatientController.getProgramUnits);
router.post('/:patientId/programs/:programId/units', PatientController.addUnitToProgram);
router.patch('/:patientId/programs/:programId/units/:unitId', PatientController.updateUnitStatus);

// --- Rutas de Registros ---
router.get('/:patientId/programs/:programId/units/:unitId/registry', PatientController.getUnitRegistries);
router.post('/:patientId/programs/:programId/units/:unitId/registry', PatientController.addRegistryToUnit);
router.delete('/:patientId/programs/:programId/units/:unitId/registry/:registryId', PatientController.deleteRegistry);

export default router;
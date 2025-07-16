import { type Request, type Response } from 'express';
import * as PatientService from './patients.service.ts';

// Patients

export const getAllPatients = async (req: Request, res: Response) => {
  const patients = await PatientService.getAllPatients();
  res.status(200).json(patients);
};

export const getPatientById = async (req: Request, res: Response) => {
  const patient = await PatientService.getPatientById(req.params.patientId);
  res.status(200).json(patient);
};

export const createPatient = async (req: Request, res: Response) => {
  const newPatient = await PatientService.createPatient(req.body);
  res.status(201).json(newPatient);
}

export const deletePatient = async (req: Request, res: Response) => {
  await PatientService.deletePatient(req.params.patientId);
  res.status(204).send();
};

// Team

export const getPatientTeam = async (req: Request, res: Response) => {
  const team = await PatientService.getPatientTeam(req.params.patientId);
  res.status(200).json(team);
};

export const addTherapistToTeam = async (req: Request, res: Response) => {
  const { therapistId } = req.body;
  await PatientService.addTherapistToTeam(req.params.patientId, therapistId);
  res.status(201).json({ message: 'Therapist added to team' });
}

export const removeTherapistFromTeam = async (req: Request, res: Response) => {
  const { therapistId } = req.params;
  await PatientService.removeTherapistFromTeam(req.params.patientId, therapistId);
  res.status(200).json({ message: 'Therapist removed from team' });
}

// Programs

export const getPatientPrograms = async (req: Request, res: Response) => {
  const programs = await PatientService.getPatientPrograms(req.params.patientId);
  res.status(200).json(programs);
}

export const addProgramToPatient = async (req: Request, res: Response) => {
  await PatientService.addProgramToPatient(req.params.patientId, req.body);
  res.status(201).json({ message: 'Program added to patient' });
}

export const updateProgramStatus = async (req: Request, res: Response) => {
  const { programId } = req.params;
  const { status } = req.body;
  await PatientService.updateProgramStatus(programId, status);
  res.status(200).json({ message: 'Program updated' });
}

export const updateProgramBackground = async (req: Request, res: Response) => {
  const { programId } = req.params;
  const { background } = req.body;
  await PatientService.updateProgramBackground(programId, background);
  res.status(200).json({ message: 'Program background updated' });
}

// Units

export const getProgramUnits = async (req: Request, res: Response) => {
  const units = await PatientService.getProgramUnits(req.params.programId);
  res.status(200).json(units);
}

export const addUnitToProgram = async (req: Request, res: Response) => {
  const { name, status } = req.body;
  await PatientService.addUnitToProgram(req.params.programId, { name, status });
  res.status(201).json({ message: 'Unit added to program' });
}

export const updateUnitStatus = async (req: Request, res: Response) => {
  const { unitId } = req.params;
  const { status } = req.body;
  await PatientService.updateUnitStatus(unitId, status);
  res.status(200).json({ message: 'Unit updated' });
}

export const getUnitRegistries = async (req: Request, res: Response) => {
  const registries = await PatientService.getUnitRegistries(req.params.unitId);
  res.status(200).json(registries);
}

export const addRegistryToUnit = async (req: Request, res: Response) => {
  const { registry } = req.body;
  const { id } = req.user;
  await PatientService.addRegistryToUnit(req.params.unitId, registry, id);
  res.status(201).json({ message: 'Registry added to unit' });
}

export const deleteRegistry = async (req: Request, res: Response) => {
  const { registryId } = req.params;
  await PatientService.deleteRegistry(registryId);
  res.status(200).json({ message: 'Registry deleted' });
}
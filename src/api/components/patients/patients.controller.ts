// Este archivo será bastante grande. En un proyecto real, podrías dividirlo
// en controladores más pequeños (team.controller, program.controller, etc.).

/* import { type Request, type Response } from 'express';
import * as PatientService from './patients.service.ts';

// Patients
export const getPatients = async (req: Request, res: Response) => {
  const patients = await PatientService.getAllPatients(req.query);
  res.status(200).json(patients);
};

export const getPatientById = async (req: Request, res: Response) => {
  const patient = await PatientService.getPatientById(req.params.patientId);
  res.status(200).json(patient);
};

// Team
export const getPatientTeam = async (req: Request, res: Response) => {
  const team = await PatientService.getPatientTeam(req.params.patientId);
  res.status(200).json(team);
}; */
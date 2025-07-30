import { ResponseError } from "../../../common/errors/ResponseError";
import pool from "../../../config/db";
import type { Patient } from "./patients.entity";

export const getAllPatients = async () => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.date_creation, p.name, p.dni, p.diagnosis, p.observations, p.birthdate
      FROM patient p
      ORDER BY p.date_creation DESC
    `);

    return result.rows;
  }
  catch (error) {
    console.error('Error fetching patients:', error);
    throw new ResponseError(500, 'Error fetching patients');
  }
}

export const getAllPatientsOfTherapist = async (therapistId: number) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.date_creation, p.name, p.dni, p.diagnosis, p.observations, p.birthdate
      FROM patient p
      JOIN patient_therapist pt ON p.id = pt.patient_id
      JOIN therapist t ON t.id = pt.therapist_id
      WHERE pt.therapist_id = $1
      ORDER BY p.date_creation DESC
    `, [therapistId]);

    return result.rows;
  }
  catch (error) {
    console.error('Error fetching patients:', error);
    throw new ResponseError(500, 'Error fetching patients');
  }

}

export const getPatientById = async (patientId: string) => {
  const result = await pool.query(`
      SELECT p.id, p.date_creation, p.name, p.dni, p.diagnosis, p.observations, p.birthdate
      FROM patient p
      WHERE p.id = $1
    `, [patientId]);

  if (result.rowCount === 0) {
    throw new ResponseError(404, 'Patient not found');
  }

  return result.rows[0];
}

export const createPatient = async (patient: Patient) : Promise<Patient> => {
  const { name, dni, diagnosis, observations, birthdate } = patient;
  const result = await pool.query(`
    INSERT INTO patient (name, dni, diagnosis, observations, birthdate, date_creation)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [name, dni, diagnosis, observations, birthdate, new Date()]);

  return result.rows[0];
}

export const deletePatient = async (patientId: string) => {
  const result = await pool.query(`
    DELETE FROM patient
    WHERE id = $1
  `, [patientId]);

  if (result.rowCount === 0) {
    throw new ResponseError(404, 'Patient not found');
  }
}

export const getPatientTeam = async (patientId: string) => {
  try {
    const result = await pool.query(`
      SELECT t.id, t.name, t.email, t.title, t.title
      FROM therapist t
      JOIN patient_therapist pt ON t.id = pt.therapist_id
      WHERE pt.patient_id = $1
    `, [patientId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching patient team:', error);
    throw new ResponseError(500, 'Error fetching patient team');
  }
}

export const addTherapistToTeam = async (patientId: string, therapistId: string) => {
  try {
    await pool.query(`
      INSERT INTO patient_therapist (patient_id, therapist_id)
      VALUES ($1, $2)
    `, [patientId, therapistId]);
  } catch (error) {
    console.error('Error adding therapist to team:', error);
    throw new ResponseError(500, 'Error adding therapist to team');
  }
}

export const removeTherapistFromTeam = async (patientId: string, therapistId: string) => {
  try {
    const result = await pool.query(`
      DELETE FROM patient_therapist
      WHERE patient_id = $1 AND therapist_id = $2
    `, [patientId, therapistId]);

    if (result.rowCount === 0) {
      throw new ResponseError(404, 'Therapist not found in patient team');
    }
  } catch (error) {
    console.error('Error removing therapist from team:', error);
    throw new ResponseError(500, 'Error removing therapist from team');
  }
}

export const getPatientPrograms = async (patientId: string) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, p.antecedent, p.status
      FROM program p
      WHERE p.patient_id = $1
    `, [patientId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching patient programs:', error);
    throw new ResponseError(500, 'Error fetching patient programs');
  }
}

interface Program {
  id: string;
  date_creation: Date;
  last_update: Date;
  name: string;
  antecedent: string;
  status: ProgramStatus;
  unit_count?: number;
  unit_active_count?: number;
}

export const getPatientProgram = async (programId: string): Promise<Program> => {
  const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.antecedent,
        p.status,
        count(u.id) AS unit_count,
        sum(CASE WHEN u.status = 'Activo' THEN 1 ELSE 0 END) AS unit_active_count,
        sum(CASE WHEN u.status = 'Completado' THEN 1 ELSE 0 END) AS unit_completed_count
      FROM program p
      LEFT JOIN unit u ON p.id = u.program_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [programId]);

  if (result.rowCount === 0) {
    throw new ResponseError(404, 'Program not found');
  }

  return result.rows[0];
}

export const getProgramBackground = async (programId: string) => {
  const result = await pool.query(`
      SELECT antecedent
      FROM program
      WHERE id = $1
    `, [programId]);

  if (result.rowCount === 0) {
    throw new ResponseError(404, 'Program not found');
  }

  return result.rows[0];
}


enum ProgramStatus {
  ACTIVE = 'Activo',
  COMPLETED = 'Completado',
  SUSPENDED = 'Suspendido'
}

export const addProgramToPatient = async (patientId: string, name: string) => {
  const result = await pool.query(`
      INSERT INTO program (date_creation, last_updated, name, status, patient_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [new Date(), new Date(), name, ProgramStatus.ACTIVE, patientId]);

  return result.rows[0];
}

export const removeProgramFromPatient = async (programId: string) => {
  const result = await pool.query(`
      DELETE FROM program
      WHERE id = $1
      RETURNING id
    `, [programId]);

  console.log('Program removed:', result.rows[0]);

  if (result.rowCount === 0) {
    throw new ResponseError(404, 'Program not found');
  }
  return { message: 'Program removed successfully' };
}

export const updateProgramStatus = async (programId: string, status: string) => {
  await pool.query(`
      UPDATE program
      SET status = $1
      WHERE id = $2
    `, [status, programId]);
  return { message: 'Program status updated successfully' };

}

export const updateProgramBackground = async (programId: string, background: string) => {
  try {
    await pool.query(`
      UPDATE program
      SET antecedent = $1
      WHERE id = $2
    `, [background, programId]);
    return { message: 'Program background updated successfully' };
  } catch (error) {
    console.error('Error updating program background:', error);
    throw new ResponseError(500, 'Error updating program background');
  }
}

export const getProgramUnits = async (programId: string) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.status
      FROM unit u
      WHERE u.program_id = $1
    `, [programId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching program units:', error);
    throw new ResponseError(500, 'Error fetching program units');
  }
}

interface Unit {
  id?: number;
  name: string;
  date_created?: Date;
  last_update?: Date;
  status: UnitStatus;
}

enum UnitStatus {
  ACTIVE = 'Activo',
  COMPLETED = 'Completado',
  SUSPENDED = 'Suspendido'
}

export const addUnitToProgram = async (programId: string, name: string) => {
  try {
    const response = await pool.query(`
      INSERT INTO unit (program_id, status, date_created, last_updated, name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [programId, UnitStatus.ACTIVE, new Date(), new Date(), name]);

    return response.rows[0];
  }
  catch (error) {
    console.error('Error adding unit to program:', error);
    throw new ResponseError(500, 'Error adding unit to program');
  }
}

export const updateUnitStatus = async (unitId: string, status: string) => {
  try {
    await pool.query(`
      UPDATE unit
      SET status = $1
      WHERE id = $2
    `, [status, unitId]);
    return { message: 'Unit status updated successfully' };
  } catch (error) {
    console.error('Error updating unit status:', error);
    throw new ResponseError(500, 'Error updating unit status');
  }
}

export const getUnitRegistries = async (unitId: string) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.date_created, r.value, r.therapist_id
      FROM registry r
      WHERE r.unit_id = $1
    `, [unitId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching unit registries:', error);
    throw new ResponseError(500, 'Error fetching unit registries');
  }
}

export const addRegistryToUnit = async (unitId: string, value: string, therapistId: string) => {
  await pool.query(`
      INSERT INTO registry (unit_id, date_created, value, therapist_id)
      VALUES ($1, $2, $3, $4)
    `, [unitId, new Date(), value, therapistId]);
}

export const deleteRegistry = async (registryId: string) => {
  try {
    const result = await pool.query(`
      DELETE FROM registry
      WHERE id = $1
    `, [registryId]);

    if (result.rowCount === 0) {
      throw new ResponseError(404, 'Registry not found');
    }

    return { message: 'Registry deleted successfully' };
  } catch (error) {
    console.error('Error deleting registry:', error);
    throw new ResponseError(500, 'Error deleting registry');
  }
}

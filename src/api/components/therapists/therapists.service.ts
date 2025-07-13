import pool from '../../../config/db.ts';
import type { QueryResult } from 'pg';
import { ResponseError } from '../../../common/errors/ResponseError.ts';

interface Therapist {
    id: number,
    date_creation: Date,
    email: string,
    is_coordinator: boolean,
    last_login?: Date,
    name: string,
    title?: string
}

export const getTherapists = async () => {
    const res: QueryResult<Therapist> = await pool.query("SELECT * FROM therapist");
    return res.rows;
}

export const getTherapist = async ( id: number) => {
    const res: QueryResult<Therapist> = await pool.query("SELECT * FROM therapist WHERE id = $1", [id]);
    if (res.rowCount === 0) {
        throw new ResponseError(404, 'Therapist not found');
    }
    
    return res.rows[0];
}

export const deleteTherapist = async ( id: number)=>{
    const res: QueryResult<Therapist> = await pool.query("DELETE FROM therapist WHERE id = $1", [id]);
    if (res.rowCount === 0){
        throw new ResponseError(404, 'Therapist not found');
    }
    return true;
}

export const updateTherapist = async (
    id: number,
    updates: Partial<Omit<Therapist, 'id' | 'date_creation'>>
): Promise<Therapist> => {
    if (Object.keys(updates).length === 0) {
        throw new ResponseError(400, 'No fields provided for update');
    }

    const keys = Object.keys(updates) as (keyof typeof updates)[];
    const setClauses = keys.map((key, i) => `${key} = $${i + 1}`);
    const values = keys.map(key => updates[key]);

    const query = `
        UPDATE therapist
        SET ${setClauses.join(', ')}
        WHERE id = $${keys.length + 1}
        RETURNING *;
    `;

    const res: QueryResult<Therapist> = await pool.query(query, [...values, id]);

    if (res.rowCount === 0) {
        throw new ResponseError(404, 'Therapist not found');
    }

    return res.rows[0];
};
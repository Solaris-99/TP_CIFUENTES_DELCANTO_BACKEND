import { type Request, type Response } from 'express';
import { checkAuth } from '../../../middleware/security.middleware';
import * as TherapistService from './therapists.service'

export const getTherapists = async (req: Request, res: Response) => {
    const therapists = await TherapistService.getTherapists();
    res.status(200).json(therapists);
};

export const getTherapist = async (req: Request, res: Response) => {
    const therapist = await TherapistService.getTherapist(parseInt(req.params.id));
    res.status(200).json(therapist);
}

export const deleteTherapist = async(req: Request, res: Response) => {
    await TherapistService.deleteTherapist(parseInt(req.params.id));
    res.status(204);
}

export const updateTherapist = async(req: Request, res: Response) => {
    const updatedTherapist = await TherapistService.updateTherapist(parseInt(req.params.id), req.body)
    res.status(200).json(updatedTherapist);
}
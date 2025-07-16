import type { NextFunction, Request, Response } from "express";
import { ResponseError } from "../common/errors/ResponseError";
import type { DecodedToken } from "./security.middleware";

export const checkPermission = (req: Request, _res: Response, next: NextFunction) => {
  const decodedToken: DecodedToken = req.user;

  if (!decodedToken.is_coordinator) {
    throw new ResponseError(403, 'You do not have permissions for this resource');
  }

  next();
};
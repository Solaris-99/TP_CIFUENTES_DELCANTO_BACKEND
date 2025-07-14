import { ResponseError } from "../common/errors/ResponseError";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ResponseError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: 'Unexpected error occurred' });
  }
};
import { NextFunction, Request, Response } from "express";
import { httpException } from "../utils/root";

export const errorMiddleware = (
  error: httpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    error: error.errors,
  });
};

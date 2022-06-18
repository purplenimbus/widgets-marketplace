import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validationHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: any = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    error: { errors: extractedErrors },
  });
};

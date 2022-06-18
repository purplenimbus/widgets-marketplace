import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const error = { ...err };
  error.message = err.message;

  res.status(error.statusCode || 500).json({
    error: {
      message: error.message || "Server Error...",
      type: error.type || "server",
    },
  });
};

import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log('errorHandler', err);
  const error = { ...err };
  error.message = err.message;

  res.status(error.statusCode || 500).json({
    error: {
      message: error.message || "Server Error...",
      type: error.type || "server",
    },
  });
};

export default errorHandler;

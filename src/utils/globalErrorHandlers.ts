import type { Request, Response, NextFunction } from "express";
import { statusCode } from "./status-code.js";

// Global Error Handler
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res
    .status(statusCode.SERVER_ERROR)
    .json({ success: false, message: err.message });
};

// 404 Not Found Middleware
export const NotFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(statusCode.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

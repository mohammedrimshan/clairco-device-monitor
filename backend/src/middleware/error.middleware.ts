import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../errors/app.error.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { MESSAGES } from "../constants/messages.js";

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  if (err instanceof z.ZodError) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: MESSAGES.DEVICE.INVALID_INPUT,
      details: err.issues,
    });
    return;
  }

  if (err instanceof Error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: err.message,
    });
    return;
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
  });
};

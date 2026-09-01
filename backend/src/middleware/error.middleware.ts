import type { Request, Response, NextFunction } from "express";

import { z } from "zod";

import { AppError } from "../errors/app.error.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { MESSAGES } from "../constants/messages.js";

interface PrismaKnownError {
  code: string;
  meta?: {
    target?: string[];
  };
}

const isPrismaKnownError = (error: unknown): error is PrismaKnownError => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const candidate = error as Record<string, unknown>;

  return (
    typeof candidate.code === "string" &&
    candidate.code.startsWith("P")
  );
};

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

  if (isPrismaKnownError(err) && err.code === "P2002") {
    const target = err.meta?.target ?? [];

    const message = target.includes("deviceId")
      ? MESSAGES.DEVICE.ALREADY_EXISTS
      : target.includes("mqttTopic")
        ? MESSAGES.DEVICE.MQTT_TOPIC_EXISTS
        : MESSAGES.DEVICE.ALREADY_EXISTS;

    res.status(HTTP_STATUS.CONFLICT).json({
      error: message,
    });

    return;
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
  });
};
import type { RequestHandler } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
import { MESSAGES } from "../constants/messages.js";

export const notFoundMiddleware: RequestHandler = (_req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    message: MESSAGES.ERROR.ROUTE_NOT_FOUND,
  });
};

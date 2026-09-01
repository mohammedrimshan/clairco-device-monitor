import type { RequestHandler, Response } from "express";

import * as deviceService from "./device.service.js";
import {
  createDeviceSchema,
  updateDeviceSchema,
} from "./device.schema.js";

import { HTTP_STATUS } from "../../constants/http-status.js";
import { MESSAGES } from "../../constants/messages.js";

export const createDevice: RequestHandler = async (req, res, next) => {
  try {
    const validatedData = createDeviceSchema.parse(req.body);
    const newDevice = await deviceService.createDevice(validatedData);
    res.status(HTTP_STATUS.CREATED).json(newDevice);
  } catch (error) {
    next(error);
  }
};

export const getAllDevices: RequestHandler = async (_req, res, next) => {
  try {
    const devices = await deviceService.getAllDevices();
    res.status(HTTP_STATUS.OK).json(devices);
  } catch (error) {
    next(error);
  }
};

export const getDeviceById: RequestHandler = async (req, res, next) => {
  try {
    const idParam = req.params.id;

    if (typeof idParam !== "string") {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: MESSAGES.DEVICE.INVALID_ID,
      });
      return;
    }

    const id = Number.parseInt(idParam, 10);

    if (Number.isNaN(id)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: MESSAGES.DEVICE.INVALID_ID,
      });
      return;
    }

    const device = await deviceService.getDeviceById(id);

    res.status(HTTP_STATUS.OK).json(device);
  } catch (error) {
    next(error);
  }
};

export const updateDevice: RequestHandler = async (req, res, next) => {
  try {
    const idParam = req.params.id;

    if (typeof idParam !== "string") {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: MESSAGES.DEVICE.INVALID_ID,
      });
      return;
    }

    const id = Number.parseInt(idParam, 10);

    if (Number.isNaN(id)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: MESSAGES.DEVICE.INVALID_ID,
      });
      return;
    }

    const validatedData = updateDeviceSchema.parse(req.body);

    const updatedDevice = await deviceService.updateDevice(
      id,
      validatedData,
    );

    res.status(HTTP_STATUS.OK).json(updatedDevice);
  } catch (error) {
    next(error);
  }
};

export const deleteDevice: RequestHandler = async (req, res, next) => {
  try {
    const idParam = req.params.id;

    if (typeof idParam !== "string") {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: MESSAGES.DEVICE.INVALID_ID,
      });
      return;
    }

    const id = Number.parseInt(idParam, 10);

    if (Number.isNaN(id)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: MESSAGES.DEVICE.INVALID_ID,
      });
      return;
    }

    await deviceService.deleteDevice(id);

    res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.DEVICE.DELETED,
    });
  } catch (error) {
    next(error);
  }
};
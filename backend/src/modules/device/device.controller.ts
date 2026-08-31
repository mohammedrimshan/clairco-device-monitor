import type { RequestHandler, Response } from "express";

import { z } from "zod";

import * as deviceService from "./device.service.js";
import {
  createDeviceSchema,
  updateDeviceSchema,
} from "./device.schema.js";

const handleServiceError = (error: unknown, res: Response): void => {
  if (error instanceof deviceService.DeviceError) {
    res.status(error.statusCode).json({
      error: error.message,
    });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({
      error: error.message,
    });
    return;
  }

  res.status(500).json({
    error: "Internal server error",
  });
};

export const createDevice: RequestHandler = async (req, res) => {
  try {
    const validatedData = createDeviceSchema.parse(req.body);

    const newDevice = await deviceService.createDevice(validatedData);

    res.status(201).json(newDevice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Invalid input",
        details: error.issues,
      });
      return;
    }

    handleServiceError(error, res);
  }
};

export const getAllDevices: RequestHandler = async (_req, res) => {
  try {
    const devices = await deviceService.getAllDevices();

    res.status(200).json(devices);
  } catch (error) {
    handleServiceError(error, res);
  }
};

export const getDeviceById: RequestHandler = async (req, res) => {
  try {
    const idParam = req.params.id;

    if (typeof idParam !== "string") {
      res.status(400).json({
        error: "Invalid device ID",
      });
      return;
    }

    const id = Number.parseInt(idParam, 10);

    if (Number.isNaN(id)) {
      res.status(400).json({
        error: "Invalid device ID",
      });
      return;
    }

    const device = await deviceService.getDeviceById(id);

    res.status(200).json(device);
  } catch (error) {
    handleServiceError(error, res);
  }
};

export const updateDevice: RequestHandler = async (req, res) => {
  try {
    const idParam = req.params.id;

    if (typeof idParam !== "string") {
      res.status(400).json({
        error: "Invalid device ID",
      });
      return;
    }

    const id = Number.parseInt(idParam, 10);

    if (Number.isNaN(id)) {
      res.status(400).json({
        error: "Invalid device ID",
      });
      return;
    }

    const validatedData = updateDeviceSchema.parse(req.body);

    const updatedDevice = await deviceService.updateDevice(
      id,
      validatedData,
    );

    res.status(200).json(updatedDevice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Invalid input",
        details: error.issues,
      });
      return;
    }

    handleServiceError(error, res);
  }
};

export const deleteDevice: RequestHandler = async (req, res) => {
  try {
    const idParam = req.params.id;

    if (typeof idParam !== "string") {
      res.status(400).json({
        error: "Invalid device ID",
      });
      return;
    }

    const id = Number.parseInt(idParam, 10);

    if (Number.isNaN(id)) {
      res.status(400).json({
        error: "Invalid device ID",
      });
      return;
    }

    await deviceService.deleteDevice(id);

    res.status(200).json({
      message: "Device deleted successfully",
    });
  } catch (error) {
    handleServiceError(error, res);
  }
};
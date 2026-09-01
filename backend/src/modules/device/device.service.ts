import * as deviceRepository from "./device.repository.js";
import type { CreateDeviceInput, UpdateDeviceInput } from "./device.schema.js";
import {
  subscribeToTopic,
  unsubscribeFromTopic,
} from "../mqtt/mqtt.service.js";

import { AppError } from "../../errors/app.error.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { MESSAGES } from "../../constants/messages.js";

export const createDevice = async (data: CreateDeviceInput) => {
  const existing = await deviceRepository.findDeviceByDeviceId(data.deviceId);
  if (existing) {
    throw new AppError(HTTP_STATUS.CONFLICT, MESSAGES.DEVICE.ALREADY_EXISTS);
  }

  const newDevice = await deviceRepository.createDevice(data);

  // Dynamically subscribe after successful DB creation — no restart needed.
  if (newDevice.mqttTopic) {
    subscribeToTopic(newDevice.mqttTopic);
  }

  return newDevice;
};

export const getAllDevices = async () => {
  return deviceRepository.findAllDevices();
};

export const getDeviceById = async (id: number) => {
  const device = await deviceRepository.findDeviceById(id);
  if (!device) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.DEVICE.NOT_FOUND);
  }
  return device;
};

export const updateDevice = async (id: number, data: UpdateDeviceInput) => {
  const device = await deviceRepository.findDeviceById(id);
  if (!device) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.DEVICE.NOT_FOUND);
  }
  return deviceRepository.updateDevice(id, data);
};

export const deleteDevice = async (id: number) => {
  const device = await deviceRepository.findDeviceById(id);
  if (!device) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.DEVICE.NOT_FOUND);
  }

  await deviceRepository.deleteDevice(id);

  // Dynamically unsubscribe after successful DB deletion.
  if (device.mqttTopic) {
    unsubscribeFromTopic(device.mqttTopic);
  }
};

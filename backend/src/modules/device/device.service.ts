import * as deviceRepository from "./device.repository.js";
import type { CreateDeviceInput, UpdateDeviceInput } from "./device.schema.js";
import {
  subscribeToTopic,
  unsubscribeFromTopic,
} from "../mqtt/mqtt.service.js";

export class DeviceError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "DeviceError";
  }
}

export const createDevice = async (data: CreateDeviceInput) => {
  const existing = await deviceRepository.findDeviceByDeviceId(data.deviceId);
  if (existing) {
    throw new DeviceError(409, "Device with this ID already exists");
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
    throw new DeviceError(404, "Device not found");
  }
  return device;
};

export const updateDevice = async (id: number, data: UpdateDeviceInput) => {
  const device = await deviceRepository.findDeviceById(id);
  if (!device) {
    throw new DeviceError(404, "Device not found");
  }
  return deviceRepository.updateDevice(id, data);
};

export const deleteDevice = async (id: number) => {
  const device = await deviceRepository.findDeviceById(id);
  if (!device) {
    throw new DeviceError(404, "Device not found");
  }

  await deviceRepository.deleteDevice(id);

  // Dynamically unsubscribe after successful DB deletion.
  if (device.mqttTopic) {
    unsubscribeFromTopic(device.mqttTopic);
  }
};

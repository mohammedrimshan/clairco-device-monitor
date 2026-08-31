import { apiClient } from "./axios.js";
import type {
  Device,
  CreateDeviceInput,
  UpdateDeviceInput,
  DeviceListResponse,
  DeleteDeviceResponse,
} from "../../types/device.js";
import {
  deviceSchema,
  deviceListResponseSchema,
  deleteDeviceResponseSchema,
} from "../../schemas/device.schema.js";

export const getDevices = async (): Promise<DeviceListResponse> => {
  const response = await apiClient.get("/devices");
  return deviceListResponseSchema.parse(response.data);
};

export const getDeviceById = async (id: number): Promise<Device> => {
  const response = await apiClient.get(`/devices/${id}`);
  return deviceSchema.parse(response.data);
};

export const createDevice = async (
  data: CreateDeviceInput
): Promise<Device> => {
  const response = await apiClient.post("/devices", data);
  return deviceSchema.parse(response.data);
};

export const updateDevice = async (
  id: number,
  data: UpdateDeviceInput
): Promise<Device> => {
  const response = await apiClient.patch(`/devices/${id}`, data);
  return deviceSchema.parse(response.data);
};

export const deleteDevice = async (
  id: number
): Promise<DeleteDeviceResponse> => {
  const response = await apiClient.delete(`/devices/${id}`);
  return deleteDeviceResponseSchema.parse(response.data);
};

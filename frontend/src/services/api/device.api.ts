import { apiClient } from "./axios";
import type {
  Device,
  CreateDeviceInput,
  UpdateDeviceInput,
  DeviceListResponse,
  DeleteDeviceResponse,
  ApiResponse,
} from "@/types/device";
import {
  deviceSchema,
  deviceListResponseSchema,
  deleteDeviceResponseSchema,
  apiResponseSchema,
} from "@/schemas/device.schema";

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
): Promise<ApiResponse<Device>> => {
  const response = await apiClient.post("/devices", data);
  return apiResponseSchema(deviceSchema).parse(response.data);
};

export const updateDevice = async (
  id: number,
  data: UpdateDeviceInput
): Promise<ApiResponse<Device>> => {
  const response = await apiClient.patch(`/devices/${id}`, data);
  return apiResponseSchema(deviceSchema).parse(response.data);
};

export const deleteDevice = async (
  id: number
): Promise<DeleteDeviceResponse> => {
  const response = await apiClient.delete(`/devices/${id}`);
  return deleteDeviceResponseSchema.parse(response.data);
};

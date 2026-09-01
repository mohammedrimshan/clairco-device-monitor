import { z } from "zod";
import {
  deviceSchema,
  createDeviceSchema,
  updateDeviceSchema,
  deviceListResponseSchema,
  deleteDeviceResponseSchema,
} from "@/schemas/device.schema";

export type Device = z.infer<typeof deviceSchema>;
export type CreateDeviceInput = z.infer<typeof createDeviceSchema>;
export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>;
export type DeviceListResponse = z.infer<typeof deviceListResponseSchema>;
export type DeleteDeviceResponse = z.infer<typeof deleteDeviceResponseSchema>;

export interface ApiResponse<T> {
  message: string;
  data: T;
}

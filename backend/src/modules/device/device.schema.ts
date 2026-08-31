import { z } from "zod";

export const createDeviceSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
  name: z.string().min(1, "Device name is required"),
  mqttTopic: z.string().min(1, "MQTT topic is required"),
  expectedInterval: z.number().int().positive(),
  alertEmail: z.string().email("Invalid alert email"),
});

export const updateDeviceSchema = createDeviceSchema.partial();

export type CreateDeviceInput = z.infer<typeof createDeviceSchema>;
export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>;
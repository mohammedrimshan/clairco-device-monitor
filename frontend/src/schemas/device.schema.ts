import { z } from "zod";

export const deviceSchema = z.object({
  id: z.number(),
  deviceId: z.string(),
  name: z.string(),
  mqttTopic: z.string(),
  expectedInterval: z.number().int().positive(),
  lastSeenAt: z.string().nullable(),
  status: z.enum(["ONLINE", "OFFLINE"]),
  alertEmail: z.string().email(),
  alertSent: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createDeviceSchema = deviceSchema.pick({
  deviceId: true,
  name: true,
  mqttTopic: true,
  expectedInterval: true,
  alertEmail: true,
});

export const updateDeviceSchema = createDeviceSchema.partial();

export const deviceListResponseSchema = z.array(deviceSchema);

export const deleteDeviceResponseSchema = z.object({
  message: z.string(),
});
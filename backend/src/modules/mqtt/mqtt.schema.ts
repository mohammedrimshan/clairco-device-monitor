import { z } from "zod";

export const mqttPayloadSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
});

export type MqttPayload = z.infer<typeof mqttPayloadSchema>;
import { z } from "zod";

export const createDeviceSchema = z.object({
  deviceId: z
    .string()
    .trim()
    .regex(/^[A-Z]{2}-\d{3}$/, "Device ID must be in the format XX-000 (e.g., AC-001)"),
  name: z
    .string()
    .trim()
    .min(3, "Device name must be at least 3 characters")
    .max(100, "Device name cannot exceed 100 characters"),
  mqttTopic: z
    .string()
    .trim()
    .regex(/^devices\/[A-Z]{2}-\d{3}\/data$/, "MQTT topic must follow the format 'devices/XX-000/data'"),
  expectedInterval: z
    .number()
    .int("Must be an integer")
    .positive("Must be greater than 0")
    .max(86400, "Interval is too large"),
  alertEmail: z
    .string()
    .trim()
    .email("Invalid alert email")
    .max(255, "Email is too long"),
});

export const updateDeviceSchema = createDeviceSchema.partial();

export type CreateDeviceInput = z.infer<typeof createDeviceSchema>;
export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>;
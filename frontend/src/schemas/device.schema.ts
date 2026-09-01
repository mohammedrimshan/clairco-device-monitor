import { z } from "zod";

export const deviceSchema = z.object({
  id: z.number(),
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
  lastSeenAt: z.string().nullable(),
  status: z.enum(["ONLINE", "OFFLINE"]),
  alertEmail: z
    .string()
    .trim()
    .email("Invalid alert email")
    .max(255, "Email is too long"),
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

export const apiResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    message: z.string(),
    data: schema,
  });

export const deviceListResponseSchema = z.array(deviceSchema);

export const deleteDeviceResponseSchema = z.object({
  message: z.string(),
});
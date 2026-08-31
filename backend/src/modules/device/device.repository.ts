import prisma from "../../config/database.js";

import type {
  CreateDeviceInput,
  UpdateDeviceInput,
} from "./device.schema.js";

export const createDevice = async (data: CreateDeviceInput) => {
  return prisma.device.create({
    data,
  });
};

export const findAllDevices = async () => {
  return prisma.device.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findDeviceById = async (id: number) => {
  return prisma.device.findUnique({
    where: { id },
  });
};

export const findDeviceByDeviceId = async (deviceId: string) => {
  return prisma.device.findUnique({
    where: { deviceId },
  });
};

export const updateDevice = async (
  id: number,
  data: UpdateDeviceInput,
) => {
  return prisma.device.update({
    where: { id },
    data,
  });
};

export const deleteDevice = async (id: number) => {
  return prisma.device.delete({
    where: { id },
  });
};

export const updateDeviceStatus = async (
  deviceId: string,
  data: { status: "ONLINE" | "OFFLINE"; lastSeenAt: Date; alertSent?: boolean }
) => {
  return prisma.device.update({
    where: { deviceId },
    data,
  });
};
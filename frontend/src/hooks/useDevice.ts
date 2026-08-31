import { useQuery } from "@tanstack/react-query";
import { getDeviceById } from "../services/api/device.api.js";
import type { Device } from "../types/device.js";

export const useDevice = (id: number) => {
  return useQuery<Device, Error>({
    queryKey: ["devices", id],
    queryFn: () => getDeviceById(id),
    enabled: !!id,
  });
};

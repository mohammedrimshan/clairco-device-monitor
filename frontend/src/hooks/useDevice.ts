import { useQuery } from "@tanstack/react-query";
import { getDeviceById } from "@/services/api/device.api";
import type { Device } from "@/types/device";

export const useDevice = (id: number) => {
  return useQuery<Device, Error>({
    queryKey: ["devices", id],
    queryFn: () => getDeviceById(id),
    enabled: !!id,
  });
};

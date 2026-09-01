import { useQuery } from "@tanstack/react-query";
import { getDevices } from "@/services/api/device.api";
import type { DeviceListResponse } from "@/types/device";

export const useDevices = () => {
  return useQuery<DeviceListResponse, Error>({
    queryKey: ["devices"],
    queryFn: getDevices,
  });
};
